# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sqlalchemy import create_engine
from statsmodels.tsa.arima.model import ARIMA
import os

app = Flask(__name__)

# Use your MySQL configuration:
# Database: profitpulse2, table: sale, user: root, no password.
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:@localhost:3306/profitpulse2")
engine = create_engine(DATABASE_URL)

@app.route('/forecast', methods=['GET'])
def forecast():
    try:
        steps = request.args.get('steps', default=5, type=int)
        query = "SELECT timestamp, profit FROM sale ORDER BY timestamp"
        df = pd.read_sql(query, engine)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        daily_profit = df.groupby(df['timestamp'].dt.date)['profit'].sum()
        ts = daily_profit.sort_index()
        ts.index = pd.to_datetime(ts.index)
        ts = ts.asfreq('D').fillna(0)
        model = ARIMA(ts, order=(1, 1, 1))
        model_fit = model.fit()
        forecast_values = model_fit.forecast(steps=steps)
        last_date = ts.index[-1]
        forecast_dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=steps, freq='D')
        forecast_result = [
            {"date": str(date.date()), "profit": float(value)}
            for date, value in zip(forecast_dates, forecast_values)
        ]
        return jsonify({"forecast": forecast_result, "steps": steps})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
