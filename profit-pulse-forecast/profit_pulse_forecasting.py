# profit-pulse-forecasting.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sqlalchemy import create_engine
from statsmodels.tsa.arima.model import ARIMA
from prophet import Prophet
from datetime import timedelta
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# MySQL connection for profitpulse2 database (user: root, no password)
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:@localhost:3306/profitpulse2")
engine = create_engine(DATABASE_URL)

def get_sales_df():
    """
    Reads sale data from the database.
    Expects table 'sale' with columns: timestamp, profit, item_name, buyer_name, cashier_username.
    """
    query = "SELECT timestamp, profit, item_name, buyer_name, cashier_username FROM sale ORDER BY timestamp"
    df = pd.read_sql(query, engine)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    return df

@app.route('/analysis/forecast', methods=['GET'])
def forecast_profit():
    """
    Ensemble forecast profit by averaging predictions from ARIMA and Prophet models.

    Query Parameters:
      - steps: number of future days to forecast (default: 5)
    """
    try:
        steps = request.args.get('steps', default=10, type=int)
        df = get_sales_df()

        # Aggregate profit by day
        daily_profit = df.groupby(df['timestamp'].dt.date)['profit'].sum()
        ts = daily_profit.sort_index()
        ts.index = pd.to_datetime(ts.index)
        ts = ts.asfreq('D').fillna(0)

        # ---- ARIMA Forecast ----
        arima_model = ARIMA(ts, order=(1, 1, 1))
        arima_fit = arima_model.fit()
        forecast_arima = arima_fit.forecast(steps=steps)

        # ---- Prophet Forecast ----
        prophet_df = ts.reset_index()
        prophet_df.columns = ['ds', 'y']
        prophet_model = Prophet()
        prophet_model.fit(prophet_df)
        future = prophet_model.make_future_dataframe(periods=steps, freq='D')
        forecast_prophet_df = prophet_model.predict(future)
        forecast_prophet = forecast_prophet_df.tail(steps)['yhat'].values

        # ---- Ensemble Forecast (average) ----
        ensemble_forecast = (forecast_arima + forecast_prophet) / 2

        # Prepare results (dates and forecast values)
        last_date = ts.index[-1]
        forecast_dates = pd.date_range(start=last_date + timedelta(days=1), periods=steps, freq='D')
        forecast_result = [
            {"date": str(d.date()), "profit": float(v)}
            for d, v in zip(forecast_dates, ensemble_forecast)
        ]

        response = {
            "ensemble_forecast": forecast_result,
            "steps": steps,
            "arima_forecast": [
                {"date": str(d.date()), "profit": float(v)}
                for d, v in zip(forecast_dates, forecast_arima)
            ],
            "prophet_forecast": [
                {"date": str(d.date()), "profit": float(v)}
                for d, v in zip(forecast_dates, forecast_prophet)
            ]
        }
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analysis/trend', methods=['GET'])
def trend_analysis():
    """
    Returns daily trend analysis data (aggregated profit by day).
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
