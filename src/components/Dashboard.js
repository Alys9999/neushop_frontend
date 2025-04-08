import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = "https://db-group5-452710.wl.r.appspot.com";

function Dashboard() {
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [lowStockList, setLowStockList] = useState([]);
  
  const [bestSellerDays, setBestSellerDays] = useState(30);
  const [bestSellerLimit, setBestSellerLimit] = useState(5);
  const [bestSellers, setBestSellers] = useState([]);
  
  const [revenueDays, setRevenueDays] = useState(30);
  const [revenue, setRevenue] = useState(null);
  
  const [orderStatus, setOrderStatus] = useState('pending');
  const [orders, setOrders] = useState([]);
  
  const navigate = useNavigate();

  const fetchLowStock = () => {
    fetch(`${BASE_URL}/products/low-stock/${lowStockThreshold}`)
      .then(res => res.json())
      .then(data => setLowStockList(data))
      .catch(err => {
        console.error("Error fetching low stock:", err);
        alert("Failed to fetch low stock products.");
      });
  };

  const fetchBestSellers = () => {
    fetch(`${BASE_URL}/products/best-selling/${bestSellerDays}/${bestSellerLimit}`)
      .then(res => res.json())
      .then(data => setBestSellers(data))
      .catch(err => {
        console.error("Error fetching best sellers:", err);
        alert("Failed to fetch best selling products.");
      });
  };

  const fetchRevenue = () => {
    fetch(`${BASE_URL}/revenue/${revenueDays}`)
      .then(res => res.json())
      .then(data => setRevenue(data.total_revenue || 0))
      .catch(err => {
        console.error("Error fetching revenue:", err);
        alert("Failed to fetch revenue.");
      });
  };

  const fetchOrdersByStatus = () => {
    fetch(`${BASE_URL}/orders/status/${orderStatus}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then(data => setOrders(data))
      .catch(err => {
        console.error("Error fetching orders by status:", err);
        alert("Failed to fetch orders.");
      });
  };

  const handleLogout = () => {
    fetch(`${BASE_URL}/logout`, { method: "POST" })
      .then(() => navigate('/'))
      .catch(err => console.error("Logout error:", err));
  };

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h1>Neushop Admin Dashboard</h1>
      
      <section>
        <h2>Low Stock Products</h2>
        <input
          type="number"
          value={lowStockThreshold}
          onChange={(e) => setLowStockThreshold(e.target.value)}
          placeholder="Enter stock threshold"
        />
        <button onClick={fetchLowStock}>Check Low Stock</button>
        <ul>
          {lowStockList.map(p => (
            <li key={p.id || p.name}>
              <strong>{p.name}</strong> (Stock: {p.stock_quantity})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Best Selling Products</h2>
        <input
          type="number"
          value={bestSellerDays}
          onChange={(e) => setBestSellerDays(e.target.value)}
          placeholder="Days"
        />
        <input
          type="number"
          value={bestSellerLimit}
          onChange={(e) => setBestSellerLimit(e.target.value)}
          placeholder="Limit"
        />
        <button onClick={fetchBestSellers}>Check Best Sellers</button>
        <ul>
          {bestSellers.map(p => (
            <li key={p.id || p.name}>
              <strong>{p.name}</strong> - {p.total_sold} sold
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Revenue</h2>
        <input
          type="number"
          value={revenueDays}
          onChange={(e) => setRevenueDays(e.target.value)}
          placeholder="Days"
        />
        <button onClick={fetchRevenue}>Check Revenue</button>
        {revenue !== null && (
          <div>
            Total Revenue (last {revenueDays} days): ${parseFloat(revenue).toFixed(2)}
          </div>
        )}
      </section>

      <section>
        <h2>Filter Orders by Status</h2>
        <label>Select Status:</label>
        <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="cancelled">Cancelled</option>
          <option value="Processing">Processing</option>
          <option value="Delivered">Delivered</option>
          <option value="Completed">Completed</option>
        </select>
        <button onClick={fetchOrdersByStatus}>Fetch Orders</button>
        <ul>
          {orders.length === 0 ? (
            <li>No orders found for this status</li>
          ) : (
            orders.map(order => (
              <li key={order.order_id}>
                <div>
                  <span>Order #{order.order_id}</span>
                  <span> {order.status} </span>
                </div>
                <div>
                  <span>Date: {new Date(order.order_date).toLocaleDateString()}</span>
                  <span> Total: ${order.total_amount.toFixed(2)}</span>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>

      <button onClick={handleLogout} className="btn btn-danger">Logout</button>
    </div>
  );
}

export default Dashboard;
