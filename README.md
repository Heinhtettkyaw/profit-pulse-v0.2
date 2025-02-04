## **Profit Pulse - Inventory & Sales Management System**  

### 📌 **Overview**  
Profit Pulse is a **Spring Boot + React.js** application designed to manage inventory, record sales transactions, and generate profit/loss reports efficiently. The system includes **role-based access control** for **Admins and Cashiers**, allowing for streamlined operations.

---

## 🚀 **Features**  

### **🔹 Admin Features**  
✅ **Manage Inventory**: Add, edit, and delete products. Includes supplier tracking.  
✅ **Manage Cashiers**: Add, delete, and reset cashier passwords.  
✅ **Profit & Loss Report**: View total investment, sales value, profit, and loss.  
✅ **Sales Reports**: View all sales transactions with buyer and item details.  
✅ **Supplier Transactions**: View inventory imports by supplier and item.  
✅ **Search & Filter**: Filter sales and inventory transactions by **buyer, supplier, or item name**.  

### **🔹 Cashier Features**  
✅ **Record Sales**: Select inventory items, input quantity, and buyer details.  
✅ **View Available Inventory**: Check stock levels before making a sale.  
✅ **Update Password**: Cashiers can change their own passwords.  

---

## 🛠 **Tech Stack**  

- **Backend:** Spring Boot (Java)  
- **Frontend:** React.js  
- **Database:** MySQL  
- **Security:** Spring Security with JWT Authentication  

---

## 📂 **Project Structure**  

```
profit-pulse/
│── profit-pulse-backend/       # Backend (Spring Boot)
│── profit-pulse-frontend/      # Frontend (React.js)
│── README.md                   # Documentation
```

---

## 🏗 **Setup & Installation**  

### **1️⃣ Backend Setup (Spring Boot)**  

#### **Prerequisites**  
✅ **Java 17** or later  
✅ **Maven**  
✅ **MySQL Database**  

#### **Steps to Run Backend**  
1. **Clone the repository**  
   ```bash
   git clone https://github.com/heinhtettkyaw/profit-pulse.git
   cd profit-pulse/profit-pulse-backend
   ```

2. **Configure Database Connection**  
   - Edit `src/main/resources/application.properties`:  
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/profit_pulse
     spring.datasource.username=root
     spring.datasource.password=yourpassword
     ```

3. **Run the Backend**  
   ```bash
   mvn spring-boot:run
   ```

4. **API Endpoints**  
   - **Admin Login:** `POST /auth/login`  
   
---

### **2️⃣ Frontend Setup (React.js)**  

#### **Prerequisites**  
✅ **Node.js** (LTS version recommended)  

#### **Steps to Run Frontend**  
1. **Navigate to the frontend directory**  
   ```bash
   cd ../profit-pulse-frontend
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Run the frontend**  
   ```bash
   npm start
   ```

4. **Access the App**  
   - Open **`http://localhost:3000`** in your browser.  

---

## 🛠 **Troubleshooting**  

**1️⃣ Backend Fails to Start**  
- Ensure MySQL is running and credentials in `application.properties` are correct.  
- Check if port `8081` is available.

**2️⃣ CORS Errors in Frontend**  
- If you see **CORS policy errors**, ensure the backend includes:  
  ```java
  @CrossOrigin(origins = "http://localhost:3000")
  ```

**3️⃣ React App Fails to Start**  
- Ensure Node.js is installed.  
- Run `npm install` before `npm start`.  

---

## 🛡 **Security & Authentication**  

- **JWT Authentication**: Secure login with token-based authentication.  
- **Role-Based Access**:  
  - **Admins** manage inventory, reports, and cashiers.  
  - **Cashiers** can only record sales and change passwords.  

---

📌 **Happy coding!** 🚀 

---

## 📝 **License**  

This project is licensed under the **Hein Htet Kyaw**.  

 
---

