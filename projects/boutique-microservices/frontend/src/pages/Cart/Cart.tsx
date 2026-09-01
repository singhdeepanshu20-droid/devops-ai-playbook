import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate, Link } from 'react-router-dom';

const Cart: React.FC = () => {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your Cart is Empty</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>Looks like you haven't added any products to your cart yet.</p>
        <Link
          to="/products"
          style={{
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 600
          }}
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const subtotal = total;
  const shipping = subtotal > 500 ? 0 : 15;
  const tax = subtotal * 0.08;
  const finalTotal = subtotal + shipping + tax;

  return (
    <div style={{ padding: '2rem 0' }}>
      <h1 style={{ fontSize: '2.25rem', marginBottom: '2rem' }}>Shopping Cart</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
        <div>
          <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>
            {items.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', borderBottom: '1px solid #eee', alignItems: 'center' }}>
                <img
                  src={item.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjwvc3ZnPgo='}
                  alt={item.name}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{item.name}</h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.875rem' }}>${typeof item.price === 'string' ? parseFloat(item.price).toFixed(2) : item.price.toFixed(2)} each</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    style={{ padding: '0.25rem 0.75rem', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: 600, width: '2rem', textAlign: 'center' }}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{ padding: '0.25rem 0.75rem', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    +
                  </button>
                </div>
                <div style={{ fontWeight: 700, minWidth: '80px', textAlign: 'right' }}>
                  ${((typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity).toFixed(2)}
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  style={{ backgroundColor: 'transparent', border: 'none', color: '#d32f2f', cursor: 'pointer', fontWeight: 600 }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <Link to="/products" style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: 600 }}>
              &larr; Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              style={{ backgroundColor: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}
            >
              Clear Cart
            </button>
          </div>
        </div>

        <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#fff', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem' }}>Order Summary</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Shipping:</span>
            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1rem 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            <span>Total:</span>
            <span style={{ color: '#d4af37' }}>${finalTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#1a1a1a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;