from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sqlalchemy import create_engine
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.statespace.sarimax import SARIMAX
from datetime import timedelta
import os

app = Flask(__name__)
CORS(app)

DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:@localhost:3306/profitpulse2")
engine = create_engine(DATABASE_URL)

def get_sales_df():
    query = "SELECT timestamp, profit, item_name, buyer_name, cashier_username FROM sale ORDER BY timestamp"
    df = pd.read_sql(query, engine)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    return df

@app.route('/analysis/forecast', methods=['GET'])
def forecast_profit():
    try:
        steps = request.args.get('steps', default=5, type=int)
        df = get_sales_df()

        daily_profit = df.groupby(df['timestamp'].dt.date)['profit'].mean()
        ts = daily_profit.sort_index()
        ts.index = pd.to_datetime(ts.index)
        ts = ts.asfreq('D').fillna(0)

        # ARIMA model for trend component (with differencing)
        arima_model = ARIMA(ts, order=(1, 1, 1))
        arima_fit = arima_model.fit()
        arima_forecast = arima_fit.forecast(steps=steps)
        arima_residuals = arima_fit.resid[1:]  # Skip first NaN from differencing

        # SARIMAX model for residual seasonal component
        sarima_model = SARIMAX(arima_residuals,
                               order=(0, 0, 1),
                               seasonal_order=(1, 0, 1, 7),
                               enforce_stationarity=False)
        sarima_fit = sarima_model.fit(disp=False)
        sarima_forecast = sarima_fit.forecast(steps=steps)

        # Hybrid forecast combination
        hybrid_forecast = arima_forecast + sarima_forecast

        last_date = ts.index[-1]
        forecast_dates = pd.date_range(start=last_date + timedelta(days=1), periods=steps, freq='D')

        arima_result = [{"date": d.date().isoformat(), "profit": float(v)} for d, v in zip(forecast_dates, arima_forecast)]
        sarima_result = [{"date": d.date().isoformat(), "profit": float(v)} for d, v in zip(forecast_dates, sarima_forecast)]
        hybrid_result = [{"date": d.date().isoformat(), "profit": float(v)} for d, v in zip(forecast_dates, hybrid_forecast)]

        return jsonify({
            "arima_forecast": arima_result,
            "sarima_forecast": sarima_result,
            "hybrid_forecast": hybrid_result,
            "steps": steps
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analysis/trend', methods=['GET'])
def trend_analysis():
    try:
        df = get_sales_df()
        daily_profit = df.groupby(df['timestamp'].dt.date)['profit'].mean()
        ts = daily_profit.sort_index().reset_index()
        ts.columns = ['date', 'profit']
        ts['date'] = ts['date'].astype(str)
        data = ts.to_dict(orient='records')
        return jsonify({"trend": data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analysis/top-profit-products', methods=['GET'])
def top_profit_products():
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
    try:
        df = get_sales_df()
        loss_df = df[df['profit'] < 0]
        grouped = loss_df.groupby('item_name')['profit'].sum()
        result = grouped.sort_values(ascending=True).reset_index()
        data = result.to_dict(orient='records')
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analysis/top-customers', methods=['GET'])
def top_customers():
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