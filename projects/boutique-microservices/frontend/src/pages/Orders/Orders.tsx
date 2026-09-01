import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const userOrders = await orderService.getUserOrders();
        setOrders(userOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadOrders();
    }
  }, [user]);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2>Please log in to view your orders</h2>
        <Link to="/login" style={{ padding: '0.5rem 1rem', backgroundColor: '#1a1a1a', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) return <LoadingSkeleton count={5} />;

  return (
    <div style={{ padding: '2rem 0' }}>
      <h1 style={{ fontSize: '2.25rem', marginBottom: '2rem' }}>My Orders</h1>
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff' }}>
          <h3>You haven't placed any orders yet</h3>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>Start shopping to see your order history here.</p>
          <Link to="/products" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#1a1a1a', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 600 }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order.id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0' }}>Order #{order.id.slice(-8)}</h3>
                  <span style={{ color: '#666', fontSize: '0.875rem' }}>
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>
                  ${typeof order.totalAmount === 'string' ? parseFloat(order.totalAmount).toFixed(2) : order.totalAmount.toFixed(2)}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {order.items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{item.product.name} (x{item.quantity})</span>
                    <span>${((typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;