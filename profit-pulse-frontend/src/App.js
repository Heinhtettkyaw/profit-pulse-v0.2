import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import CashierDashboard from './components/CashierDashboard';
import SalesRecorder from './components/SalesRecorder';
import TransactionList from './components/TransactionList';
import SupplierTransactionList from './components/SupplierTransactionList';
import ProfitLossReport from './components/ProfitLossReport';
import CombinedProfitLossReport from './components/CombinedProfitLossReport';
// import ProfitLossPage from './components/ProfitLossPage';
import ManageCashiers from './components/ManageCashiers';
import ChangePassword from './components/ChangePassword';
import { AuthContext } from './context/AuthContext';
import InventoryManager from "./components/InventoryManager";

function App() {
  const { auth } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!auth.isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}>
            <Route path="inventory" element={<InventoryManager />} />
            <Route path="profit-loss" element={<ProfitLossReport />} />
            <Route path="combined-profit-loss" element={<CombinedProfitLossReport />} />
            {/*<Route path="profit-loss-page" element={<ProfitLossPage />} />*/}
            <Route path="sales-transactions" element={<TransactionList />} />
            <Route path="supplier-transactions" element={<SupplierTransactionList />} />
            <Route path="manage-cashiers" element={<ManageCashiers />} />
            <Route index element={<InventoryManager />} />
          </Route>

          {/* Cashier Routes */}
          <Route path="/cashier/*" element={<ProtectedRoute><CashierDashboard /></ProtectedRoute>}>
            <Route path="sales" element={<SalesRecorder />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route index element={<SalesRecorder />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
  );
}

export default App;
