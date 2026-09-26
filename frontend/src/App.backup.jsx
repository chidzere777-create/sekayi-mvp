import { useState } from 'react'
import './App.css'

function App() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)

  const products = [
    {
      name: 'Fresh Tomatoes',
      details: '1kg • Mbare',
      price: '$2.00',
      image: '🍅',
      category: 'Groceries',
      seller: {
            name: 'Mbare Fresh Produce',
                location: 'Mbare, Harare'
      }
    },
    {
      name: 'Potatoes',
      details: '1kg • Harare',
      price: '$3.00',
      image: '🥔',
      category: 'Groceries',
    seller: {
          name: 'Harare Farm Supplies',
              location: 'Harare'
    }
    },
    {
      name: 'Casual Sneakers',
      details: 'Harare',
      price: '$25.00',
      image: '👟',
      category: 'Fashion',
      seller: {
            name: 'Urban Footwear',
                location: 'Harare'
                  }
      }
    
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesCategory =
      category === 'All' || product.category === category

    return matchesSearch && matchesCategory
  })

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <div className="bear">🐻</div>
          <div>
            <h1>SEKAYI</h1>
            <p>Simple • Local • Trusted</p>
          </div>
        </div>

        <button className="menu" aria-label="Menu">
          ☰
        </button>
      </header>

      <main>
        <section className="hero">
          <h2>
            Shop Local.<br />Buy With Confidence.
          </h2>
          <p>Discover products from sellers around Zimbabwe.</p>

          <div className="search">
            <span>🔍</span>
            <input
              placeholder="What are you looking for?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>

        <section className="categories">
          <h3>Shop by Category</h3>

        <div className="category-grid">
          <button onClick={() => setCategory('All')}>
              🛍️<span>All Products</span>
              </button>
            <button onClick={() => setCategory('Groceries')}>
                🥬<span>Groceries</span>
                  </button>

                    <button onClick={() => setCategory('Food')}>
                        🍔<span>Food</span>
                          </button>

                            <button onClick={() => setCategory('Electronics')}>
                                📱<span>Electronics</span>
                                  </button>

                                    <button onClick={() => setCategory('Fashion')}>
                                        👕<span>Fashion</span>
                                          </button>

                                            <button onClick={() => setCategory('Home')}>
                                                🏠<span>Home</span>
                                                  </button>

                                                    <button onClick={() => setCategory('Other')}>
                                                        🛒<span>Other</span>
                                                          </button>
                                                          </div>
        </section>

        <section className="popular">
          <div className="section-title">
            <h3>Popular Products</h3>
            <button>View all →</button>
          </div>

          <div className="products">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div className="product" key={product.name}
                onClick={() => setSelectedProduct(product)}
                  >
                  <div className="product-image">{product.image}</div>
                  <h4>{product.name}</h4>
                  <p>{product.details}</p>
                  <strong>{product.price}</strong>
                  {selectedProduct && selectedProduct.seller && 
                  <div className="seller-info">
                      <h3>Seller</h3>
                        <p><strong>{selectedProduct.seller.name}</strong></p>
                          <p>📍 {selectedProduct.seller.location}</p>
                          </div>}
                </div>
              ))
            ) : (
              <p className="empty-state">No products found.</p>
            )}
          </div>
        </section>
      </main>

      <nav className="bottom-nav">
        {selectedProduct && (
            <div className="product-modal">
                <div className="product-modal-content">
                      <button
                              className="close-button"
                                      onClick={() => setSelectedProduct(null)}
                                                                                  >
                                                                                                                                      ✕
                                                                                                                                                                                                </button>
                                                                                                                                                                                                
                                                                                                                                                                                                                                                                <div className="product-modal-image">
                                                                                                                                                                                                                                                                                                                                        {selectedProduct.image}
                                                                                                                                                                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          <h2>{selectedProduct.name}</h2>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <p>{selectedProduct.details}</p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <strong>{selectedProduct.price}</strong>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          <button className="contact-seller">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        Contact Seller
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <button className="nav-item active">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  🏠<span>Home</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          </button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  <button className="nav-item">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            🔍<span>Search</span>
        </button>
        <button className="nav-item">
          🛒<span>Cart</span>
        </button>
        <button className="nav-item">
          👤<span>Account</span>
        </button>
      </nav>
    </div>
  )
}

export default App
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                