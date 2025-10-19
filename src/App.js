import { useMemo, useState } from "react";
import monsteraImg from "./assets/monstera.jpg";
import fiddleLeafImg from "./assets/fiddle-leaf.jpg";
import snakeImg from "./assets/snake.jpg";
import zzPlantImg from "./assets/zz-plant.jpg";
import orchidImg from "./assets/orchid.jpg";
import anthuriumImg from "./assets/anthurium.jpg";
import "./App.css";

const PLANTS = [
  {
    id: "monstera",
    name: "Monstera Deliciosa",
    price: 28,
    category: "Tropicals",
    image: monsteraImg,
  },
  {
    id: "fiddle-leaf",
    name: "Fiddle Leaf Fig",
    price: 42,
    category: "Tropicals",
    image: fiddleLeafImg,
  },
  {
    id: "snake",
    name: "Snake Plant",
    price: 22,
    category: "Low Light",
    image: snakeImg,
  },
  {
    id: "zz-plant",
    name: "ZZ Plant",
    price: 24,
    category: "Low Light",
    image: zzPlantImg,
  },
  {
    id: "orchid",
    name: "Phalaenopsis Orchid",
    price: 36,
    category: "Flowering",
    image: orchidImg,
  },
  {
    id: "anthurium",
    name: "Anthurium Flamingo",
    price: 32,
    category: "Flowering",
    image: anthuriumImg,
  },
];

function Header({ onNavigate, cartCount }) {
  return (
    <header className="site-header">
      <button className="brand" onClick={() => onNavigate("landing")}>
        BeesyBoutique
      </button>
      <nav className="nav-links">
        <button onClick={() => onNavigate("products")}>Plants</button>
        <button onClick={() => onNavigate("cart")}>Cart</button>
      </nav>
      <button className="cart-indicator" onClick={() => onNavigate("cart")}>
        <span className="icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path
              d="M7 4h-2l-1 2v2h2l3.6 7.59-1.35 2.41c-.16.28-.25.61-.25.95 0 1.1.9 2 2 2h10v-2h-9.42c-.13 0-.25-.11-.25-.25l.03-.12.9-1.58h6.99c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.3.12-.47 0-.55-.45-1-1-1h-16l-.68-1.5c-.17-.38-.53-.63-.92-.63z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span className="count" aria-label={`Cart has ${cartCount} items`}>
          {cartCount}
        </span>
      </button>
    </header>
  );
}

function Landing({ onNavigate }) {
  return (
    <section className="landing">
      <div className="hero-overlay">
        <h1>BeesyBoutique</h1>
        <p>
          Discover elegant plants in decorative vases, each one hand-nurtured to
          bring life and style into your space. From lush Monsteras to graceful
          Orchids, every plant is a living piece of art ready to brighten your
          home.
        </p>
        <button className="primary" onClick={() => onNavigate("products")}>
          Get Started
        </button>
      </div>
    </section>
  );
}

function ProductListing({ cart, onAddToCart }) {
  const plantsByCategory = useMemo(() => {
    return PLANTS.reduce((grouped, plant) => {
      if (!grouped[plant.category]) {
        grouped[plant.category] = [];
      }
      grouped[plant.category].push(plant);
      return grouped;
    }, {});
  }, []);

  return (
    <section className="products">
      <h2>Our Collection</h2>
      <p className="intro">
        Explore plants chosen for every skill level and lighting condition.
      </p>
      {Object.entries(plantsByCategory).map(([category, plants]) => (
        <div key={category} className="category-section">
          <h3>{category}</h3>
          <div className="product-grid">
            {plants.map((plant) => {
              const inCart = Boolean(cart[plant.id]);
              return (
                <article key={plant.id} className="product-card">
                  <img src={plant.image} alt={plant.name} />
                  <div className="product-details">
                    <h4>{plant.name}</h4>
                    <p className="price">${plant.price.toFixed(2)}</p>
                  </div>
                  <button
                    className="primary"
                    disabled={inCart}
                    onClick={() => onAddToCart(plant)}
                  >
                    {inCart ? "Added" : "Add to Cart"}
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}

function CartPage({
  cartItems,
  totalItems,
  totalCost,
  onIncrease,
  onDecrease,
  onDelete,
  onContinue,
}) {
  return (
    <section className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="intro">Your cart is empty. Add a few plants to begin.</p>
      ) : (
        <>
          <div className="cart-summary">
            <div>
              <strong>Total Plants:</strong> {totalItems}
            </div>
            <div>
              <strong>Total Cost:</strong> ${totalCost.toFixed(2)}
            </div>
          </div>
          <ul className="cart-items">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-info">
                  <h4>{item.name}</h4>
                  <p>${item.price.toFixed(2)} each</p>
                </div>
                <div className="cart-controls">
                  <div className="quantity-controls">
                    <button onClick={() => onDecrease(item.id)}>-</button>
                    <span className="quantity">{item.quantity}</span>
                    <button onClick={() => onIncrease(item.id)}>+</button>
                  </div>
                  <button className="text-button" onClick={() => onDelete(item.id)}>
                    Delete
                  </button>
                </div>
                <div className="line-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="cart-actions">
        <button className="secondary" onClick={onContinue}>
          Continue Shopping
        </button>
        <button
          className="primary"
          onClick={() => window.alert("Checkout is coming soon!")}
        >
          Checkout
        </button>
      </div>
    </section>
  );
}

function App() {
  const [page, setPage] = useState("landing");
  const [cart, setCart] = useState({});

  const totalItems = useMemo(() => {
    return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const totalCost = useMemo(() => {
    return Object.values(cart).reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
  }, [cart]);

  const cartItems = useMemo(() => Object.values(cart), [cart]);

  const handleAddToCart = (plant) => {
    setCart((prev) => {
      if (prev[plant.id]) {
        return prev;
      }
      return {
        ...prev,
        [plant.id]: { ...plant, quantity: 1 },
      };
    });
  };

  const handleIncrease = (id) => {
    setCart((prev) => {
      const item = prev[id];
      if (!item) {
        return prev;
      }
      return {
        ...prev,
        [id]: { ...item, quantity: item.quantity + 1 },
      };
    });
  };

  const handleDecrease = (id) => {
    setCart((prev) => {
      const item = prev[id];
      if (!item) {
        return prev;
      }
      if (item.quantity <= 1) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [id]: { ...item, quantity: item.quantity - 1 },
      };
    });
  };

  const handleDelete = (id) => {
    setCart((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const renderPage = () => {
    if (page === "landing") {
      return <Landing onNavigate={setPage} />;
    }
    if (page === "products") {
      return <ProductListing cart={cart} onAddToCart={handleAddToCart} />;
    }
    return (
      <CartPage
        cartItems={cartItems}
        totalItems={totalItems}
        totalCost={totalCost}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onDelete={handleDelete}
        onContinue={() => setPage("products")}
      />
    );
  };

  return (
    <div className="app-shell">
      {page !== "landing" && (
        <Header cartCount={totalItems} onNavigate={setPage} />
      )}
      <main className={`page-content page-${page}`}>{renderPage()}</main>
    </div>
  );
}

export default App;
