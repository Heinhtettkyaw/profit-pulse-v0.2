# ProfitPulse - Inventory & Sales Management System

## Overview
ProfitPulse is a full-stack inventory and sales management system built with **Spring Boot (backend)** and **React.js (frontend)**, integrated with **Flask (Python) for sales forecasting using ARIMA**. The system tracks inventory, sales, profit/loss, and forecasts future trends.

## Features
### 🛒 Inventory & Sales Management
- **Admin** can **add, edit, and delete inventory items**.
- **Cashiers** can **view available stock** and **record sales transactions**.
- Items are **removed from inventory when out of stock**, but supplier transaction history is retained.

### 📊 Profit & Loss Reports
- Profit/Loss is calculated as **Sold Price - Original Price** (excluding fees).
- Reports display **total inventory value, total sales, profit, and loss**.
- **Monthly and Daily profit bar charts** visualize trends.

### 🔍 Advanced Search & Reports
- **Admin can filter transactions** by **supplier name, buyer name, or item name**.
- **Sales and supplier transaction reports** show detailed records.

### 🔐 User Management
- **Admin can add, delete, and reset cashiers' passwords.**
- **Cashiers can change their passwords.**
- **Secure authentication** with Spring Security and JWT.

### 📈 Sales Forecasting with ARIMA
- Forecast **profit trends** using **Python + Flask + ARIMA model**.
- Automatically **exports the latest sales data** to CSV for analysis.
- Displays **forecasted profit** on the frontend.

---
## Tech Stack
### **Backend** (Spring Boot)
- Java (Spring Boot, Spring Security, Spring Data JPA)
- MySQL (Database)
- JWT Authentication

### **Frontend** (React.js)
- React, Axios, Recharts (charts), React Router
- Responsive UI for Admin and Cashiers

### **Forecasting Service** (Flask + ARIMA)
- Python (Flask, Pandas, Statsmodels, SQLAlchemy)
- Fetches real-time sales data and generates **profit predictions**.

---
## Installation Guide
### **Backend Setup (Spring Boot)**
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/profitpulse.git
   cd profitpulse/profit-pulse-backend
   ```
2. Configure database in `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/profitpulse2
   spring.datasource.username=root
   spring.datasource.password=
   ```
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

### **Frontend Setup (React.js)**
1. Go to the frontend directory:
   ```bash
   cd ../profit-pulse-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm start
   ```

### **Forecasting Service Setup (Flask + ARIMA)**
1. Go to the forecasting service directory:
   ```bash
   cd ../profit-pulse-forecast
   ```
2. Install dependencies:
   
```bash
  pip install flask pandas sqlalchemy statsmodels numpy pymysql
  pip install flask-cors
  ```


3. Run the Flask server:
   ```bash
   python .\profit_pulse_forecasting.py
   ```

---
## API Endpoints
### **Backend (Spring Boot)**
| Endpoint                        | Method | Description                  |
|---------------------------------|--------|------------------------------|
| `/admin/inventory/all`          | GET    | Get all inventory items      |
| `/admin/inventory/add`          | POST   | Add an inventory item        |
| `/admin/sales/record`           | POST   | Record a sale transaction    |
| `/admin/report/sales`           | GET    | View all sales transactions  |
| `/admin/report/suppliers`       | GET    | View all supplier records    |
| `/admin/profit-loss/monthly/bar`| GET    | Get monthly profit data      |

### **Forecasting (Flask)**
| Endpoint       | Method | Description                  |
|---------------|--------|------------------------------|
| `/forecast`   | GET    | Get profit forecast (ARIMA) |

---
## Future Improvements
- Implement **AI-based demand forecasting**.
- Add **role-based access control (RBAC)** for better security.
- Optimize **inventory auto-restocking recommendations**.

---
## License
MIT License. Contributions welcome!

---
🚀 **Built with passion for business analytics and optimization!**

