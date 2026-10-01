export default function Cart({ cart, onRemove, onClose }) {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-panel" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        {cart.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          <>
            <ul className="cart-list">
              {cart.map(item => (
                <li key={item.id} className="cart-item">
                  <div>
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-meta">Qty: {item.qty} × ${item.price}</p>
                  </div>
                  <button className="remove-btn" onClick={() => onRemove(item.id)}>Remove</button>
                </li>
              ))}
            </ul>
            <div className="cart-total">
              <strong>Total: ${total.toFixed(2)}</strong>
              <button className="checkout-btn">Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
