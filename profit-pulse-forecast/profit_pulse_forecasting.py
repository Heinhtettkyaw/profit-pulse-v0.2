# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sqlalchemy import create_engine
from statsmodels.tsa.arima.model import ARIMA
import os
from datetime import timedelta, date

app = Flask(__name__)
CORS(app)  # Enable CORS

# Set up MySQL connection for your profitpulse2 database.
# For MySQL with user 'root' and no password:
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:@localhost:3306/profitpulse2")
engine = create_engine(DATABASE_URL)

def get_sales_df():
    """
    Reads sale data from the database.
    Expects table 'sale' with at least the following columns (all in snake_case):
      - timestamp
      - profit
      - item_name
      - buyer_name
      - cashier_username
    """
    query = "SELECT timestamp, profit, item_name, buyer_name, cashier_username FROM sale ORDER BY timestamp"
    df = pd.read_sql(query, engine)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    return df

def get_season(month):
    """
    Return season name given a month number.
    Winter: Dec-Feb, Spring: Mar-May, Summer: Jun-Aug, Autumn: Sep-Nov.
    """
    if month in [12, 1, 2]:
        return "Winter"
    elif month in [3, 4, 5]:
        return "Spring"
    elif month in [6, 7, 8]:
        return "Summer"
    elif month in [9, 10, 11]:
        return "Autumn"
    return "Unknown"

@app.route('/analysis/forecast', methods=['GET'])
def forecast_profit():
    """
    Forecast profit using ARIMA on daily aggregated profit data.
    Query Parameter:
      - steps: number of future days to forecast (default: 5)
    """
    try:
        steps = request.args.get('steps', default=5, type=int)
        df = get_sales_df()
        daily_profit = df.groupby(df['timestamp'].dt.date)['profit'].sum()
        ts = daily_profit.sort_index()
        ts.index = pd.to_datetime(ts.index)
        ts = ts.asfreq('D').fillna(0)
        model = ARIMA(ts, order=(1, 1, 1))
        model_fit = model.fit()
        forecast_values = model_fit.forecast(steps=steps)
        last_date = ts.index[-1]
        forecast_dates = pd.date_range(start=last_date + timedelta(days=1), periods=steps, freq='D')
        forecast_result = [
            {"date": str(d.date()), "profit": float(v)}
            for d, v in zip(forecast_dates, forecast_values)
        ]
        return jsonify({"forecast": forecast_result, "steps": steps})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analysis/trend', methods=['GET'])
def trend_analysis():
    """
    Return trend analysis data (daily aggregated profit).
    """
    try:
        df = get_sales_df()
        daily_profit = df.groupby(df['timestamp'].dt.date)['profit'].sum()
        ts = daily_profit.sort_index().reset_index()
        ts.columns = ['date', 'profit']
        ts['date'] = ts['date'].astype(str)
        data = ts.to_dict(orient='records')
        return jsonify({"trend": data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analysis/top-profit-products', methods=['GET'])
def top_profit_products():
    """
    Returns top profit-making products (aggregated profit > 0).
    """
    try:
        df = get_sales_df()
        grouped = df.groupby('item_name')['profit'].sum()
        result = grouped[grouped > 0].sort_values(ascending=False).reset_index()
        data = result.to_dict(orient='records')
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analysis/top-loss-products', methods=['GET'])
def top_loss_products():
    """
    Returns top loss-making products (aggregated profit < 0).
    """
    try:
        df = get_sales_df()
        grouped = df.groupby('item_name')['profit'].sum()
        result = grouped[grouped < 0].sort_values().reset_index()
        data = result.to_dict(orient='records')
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analysis/top-customers', methods=['GET'])
def top_customers():
    """
    Returns top customers by total profit.
    """
    try:
        df = get_sales_df()
        grouped = df.groupby('buyer_name')['profit'].sum()
        result = grouped.sort_values(ascending=False).reset_index()
        data = result.to_dict(orient='records')
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analysis/top-cashiers', methods=['GET'])
def top_cashiers():
    """
    Returns top cashiers (by performance) based on total profit handled.
    """
    try:
        df = get_sales_df()
        grouped = df.groupby('cashier_username')['profit'].sum()
        result = grouped.sort_values(ascending=False).reset_index()
        data = result.to_dict(orient='records')
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analysis/forecast/resolution', methods=['GET'])
def forecast_by_resolution():
    """
    Aggregates profit data by a given resolution (daily, monthly, yearly, seasonal).
    For seasonal, groups by season (Winter, Spring, Summer, Autumn) based on the month.
    Query Parameters:
      - resolution: 'daily' (default), 'monthly', 'yearly', or 'seasonal'
      - steps: number of future periods to forecast (not applied for seasonal; just returns historical aggregation)
    """
    try:
        resolution = request.args.get('resolution', default='daily').lower()
        steps = request.args.get('steps', default=5, type=int)
        df = get_sales_df()
        aggregated = None
        if resolution == 'daily':
            aggregated = df.groupby(df['timestamp'].dt.date)['profit'].sum()
            aggregated.index = pd.to_datetime(aggregated.index)
            aggregated = aggregated.sort_index()
            data = [{"period": str(d.date()), "profit": float(v)} for d, v in aggregated.items()]
        elif resolution == 'monthly':
            aggregated = df.groupby(df['timestamp'].dt.to_period('M'))['profit'].sum()
            aggregated = aggregated.sort_index()
            data = [{"period": str(p), "profit": float(v)} for p, v in aggregated.items()]
        elif resolution == 'yearly':
            aggregated = df.groupby(df['timestamp'].dt.year)['profit'].sum()
            aggregated = aggregated.sort_index()
            data = [{"period": str(year), "profit": float(v)} for year, v in aggregated.items()]
        elif resolution == 'seasonal':
            # Group by season based on month
            df['season'] = df['timestamp'].dt.month.apply(get_season)
            aggregated = df.groupby('season')['profit'].sum().sort_values(ascending=False)
            data = [{"period": season, "profit": float(v)} for season, v in aggregated.items()]
        else:
            return jsonify({"error": "Unsupported resolution. Use daily, monthly, yearly, or seasonal."}), 400

        return jsonify({"resolution": resolution, "data": data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analysis/trend', methods=['GET'])
def get_trend():
    """
    Return the daily trend of profit as a time series.
    """
    try:
        df = get_sales_df()
        daily_profit = df.groupby(df['timestamp'].dt.date)['profit'].sum()
        ts = daily_profit.sort_index().reset_index()
        ts.columns = ['date', 'profit']
        ts['date'] = ts['date'].astype(str)
        data = ts.to_dict(orient='records')
        return jsonify({"trend": data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
