export default function Header({ cartCount, onCartClick }) {
  return (
    <header className="header">
      <div className="header-inner">
        <h1 className="logo">ThreadCo</h1>
        <nav className="nav">
          <span className="nav-link">Men</span>
          <span className="nav-link">Women</span>
          <span className="nav-link">Sale</span>
        </nav>
        <button className="cart-btn" onClick={onCartClick}>
          Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>
    </header>
  )
}
