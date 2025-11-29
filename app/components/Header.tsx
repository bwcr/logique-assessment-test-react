import { Link } from "react-router";
import { useCart } from "../context/CartContext";

export function Header() {
  const { itemCount } = useCart();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl">🛍️</div>
            <h1 className="text-xl font-bold text-gray-900">Shop Explorer</h1>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Products
            </Link>
            <Link
              to="/cart"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium transition-colors relative"
            >
              <span>🛒 Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
