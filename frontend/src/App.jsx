import { useState } from 'react'
import './App.css'

function App() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showSellerForm, setShowSellerForm] = useState(false)
const [showSellerDashboard, setShowSellerDashboard] = useState(false)
const [editingProductId, setEditingProductId] = useState(null)

const [showProductForm, setShowProductForm] = useState(false)
const [showCart, setShowCart] = useState(false)
  const [cart, setCart] = useState(() => {
  return JSON.parse(localStorage.getItem('sekayiCart')) || []
})

const [savedProducts, setSavedProducts] = useState(() => {
    return JSON.parse(localStorage.getItem('sekayiProducts')) || []
    })

const [productForm, setProductForm] = useState({
  name: '',
    price: '',
      category: '',
        description: '',
          location: '',
          image: ''
          })

  const [sellerForm, setSellerForm] = useState({
    name: '',
    whatsapp: '',
    location: '',
    product: '',
  })
  const products = [
    {
      name: 'Fresh Tomatoes',
      details: '1kg • Mbare',
      price: '$2.00',
      image: '🍅',
      category: 'Groceries',
      seller: {
            name: 'Mbare Fresh Produce',
            location: 'Mbare, Harare',
                whatsapp: '263771234567'
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
          location: 'Harare',
              whatsapp: '263772345678'
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
            location: 'Harare',
                whatsapp: '263773456789'
                  }
      }
    
  ]

  const filteredProducts = [...products, ...savedProducts].filter((product) => {
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
          <img className="bear" src="/sekayi-logo.png" alt="Sekayi" />
          <div>
            <p className="tagline">Simple • Local • Trusted</p>
          </div>
        </div>

        <button className="menu" aria-label="Menu">
          ☰
        </button>
      </header>

      <main>
        <section className="hero">
          <h2>
            Buy Local - Sell Local 
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
                  <div className="product-image">{product.image&& product.image.startsWith('data:image') ? (
                        <img
                              src={product.image}
                                    alt={product.name}
                                          className="marketplace-product-image"
                                              />
                                                ) : (
                                                    product.image || '📦'
                                                      )}
                  )
                  </div>
                  <h4>{product.name}</h4>
                  <p>{product.details}</p>
                  <strong>{product.price}</strong>
                  {selectedProduct && selectedProduct.seller && (
                    <div className="seller-info">
                      <h3>Seller</h3>
                        <p><strong>{selectedProduct.seller.name}</strong></p>
                          <p>📍 {selectedProduct.seller.location}</p>
                          </div>
                    )}
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
              <div className="product-modal-image">{selectedProduct.image &&
              selectedProduct.image.startsWith('data:image') ? (
                <img
                    src={selectedProduct.image}
                        alt={selectedProduct.name}
                            className="selected-product-image"
                              />
                              ) : (
                                selectedProduct.image || '📦'
                                )}
                </div>
              <h2>{selectedProduct.name}</h2>
              <p>{selectedProduct.details}</p>
              <strong>{selectedProduct.price}</strong>
              {selectedProduct.seller && (
                  <p>
                      <strong>Seller:</strong> {selectedProduct.seller.name}
                        </p>
              )}
              {selectedProduct.seller && (
                  <p>
                      <strong>Seller Location:</strong> 📍 {selectedProduct.seller.location}
                        </p>
                        )}

              <button
  className="cart-button"
  onClick={() => {
    const existingItem = cart.find(
      (item) => item.id === selectedProduct.id
    )

    let updatedCart

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.id === selectedProduct.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    } else {
      updatedCart = [
        ...cart,
        {
          ...selectedProduct,
          quantity: 1
        }
      ]
    }

    setCart(updatedCart)
    localStorage.setItem('sekayiCart', JSON.stringify(updatedCart))

    alert('Product added to cart!')
  }}
>
  🛒 Add to Cart
</button>
          
              <button
                className="contact-button"
                onClick={() => {
                  const message = `Hello, I found your ${selectedProduct.name} on Sekayi. Is it still available?`

                 let whatsapp = selectedProduct.seller.whatsapp
                     .replace(/\s/g, '')
                         .replace(/^0/, '263')
                             .replace(/^\+263/, '263')

                  const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`
                  window.open(url, '_blank')
                }}
              >
                Contact Seller
              </button>
            </div>
          </div>
        )}

        <button className="nav-item active">
          🏠<span>Home</span>
        </button>
        <button
          className="sell-button"
          onClick={() => setShowSellerForm(true)}
        >
          🏪 Sell on Sekayi
        </button>
        <button className="nav-item" 
        onClick={() => setShowCart(true)}>
          🛒<span>Cart</span>
        </button>
        <button className="nav-item">
          👤<span>Account</span>
        </button>
        <button
          className="seller-dashboard-button"
            onClick={() => {
                  const savedSeller = localStorage.getItem('sekayiSeller')

                      if (!savedSeller) {
                            alert('Please register as a seller first.')
                                  return
                                      }

                                          setShowSellerDashboard(true)
                                            }}
                                            >
            
        

                  
                          
                                
                                    

                                  
                                            
                                              
                                          
                                              
                                                👤 Seller Dashboard
                                                </button>
      </nav>
                                                                                                                                                                                                                !sellerFo    {showSellerForm && (
          <div className="seller-form-overlay">
              <div className="seller-form">
                    <button
                            className="form-close"
                                    onClick={() => setShowSellerForm(false)}
                                          >
                                                  ✕
                                                        </button>

                                                              <h2>Sell on Sekayi</h2>
                                                                    <p>Register your seller details.</p>

                                                                          <input
                                                                                  type="text"
                                                                                          placeholder="Seller or business name"
                                                                                          value={sellerForm.name}
                                                                                            onChange={(e) =>
                                                                                                setSellerForm({ ...sellerForm, name: e.target.value })
                                                                                                  }
                                                                                                 />
                                                                                                

                                                                                                      <input
                                                                                                              type="tel"
                                                                                                                      placeholder="WhatsApp number"
                                                                                                                            value={sellerForm.whatsapp}
                                                                                                                            onChange={(e) =>
                                                                                                                                setSellerForm({ ...sellerForm, whatsapp: e.target.value })
                                                                                                                              }
                                                                                                                              />
                                                                                                                                  <input
                                                                                                                                          type="text"
                                                                                                                                                  placeholder="Location"
                                                                                                                                                  value={sellerForm.location}
                                                                                                                                                    onChange={(e) =>
                                                                                                                                                        setSellerForm({ ...sellerForm, location: e.target.value })
                                                                                                                                                          }
                                                                                                                                                          />
                                                                                                                                                          <label className="image-upload-label">
                                                                                                                                                            Product Image
                                                                                                                                                            </label>

                                                                                                                                                            <input
                                                                                                                                                              type="file"
                                                                                                                                                                accept="image/*"
                                                                                                                                                                  onChange={(e) => {
                                                                                                                                                                      const file = e.target.files[0]

                                                                                                                                                                          if (!file) return

                                                                                                                                                                              const reader = new FileReader()

                                                                                                                                                                                  reader.onloadend = () => {
                                                                                                                                                                                        setProductForm({
                                                                                                                                                                                                ...productForm,
                                                                                                                                                                                                        image: reader.result
                                                                                                                                                                                                              })
                                                                                                                                                                                                                  }

                                                                                                                                                                                                                      reader.readAsDataURL(file)
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                        />
                                                                                                                                                      

                                                                                                                                                              <input
                                                                                                                                                                      type="text"
                                                                                                                                                                              placeholder="What do you sell?"
                                                                                                                                                                                    value={sellerForm.product}
                                                                                                                                                                                    onChange={(e) =>
                                                                                                                                                                                        setSellerForm({ ...sellerForm, product: e.target.value })
                                                                                                                                                                                      }
                                                                                                                                                                                  />

                                                                                                                                                                                          <button
                                                                                                                                                                                              className="register-button"
                                                                                                                                                                                              onClick={() => {
                                                                                                                                                                                                  if (
                                                                                                                                                                                                        !sellerForm.name ||
                                                                                                                                                                                                              !sellerForm.whatsapp ||
                                                                                                                                                                                                                    !sellerForm.location ||
                                                                                                                                                                                                                          !sellerForm.product
                                                                                                                                                                                                                              ) {
                                                                                                                                                                                                                                    alert('Please complete all fields.')
                                                                                                                                                                                                                                          return
                                                                                                                                                                                                                                              }

                                                                                                                                                                                                                                                  localStorage.setItem(
                                                                                                                                                                                                                                                        'sekayiSeller',
                                                                                                                                                                                                                                                              JSON.stringify(sellerForm)
                                                                                                                                                                                                                                                                  )

                                                                                                                                                                                                                                                                      alert('Seller registration successful!')

                                                                                                                                                                                                                                                                          setSellerForm({
                                                                                                                                                                                                                                                                                name: '',
                                                                                                                                                                                                                                                                                      whatsapp: '',
                                                                                                                                                                                                                                                                                            location: '',
                                                                                                                                                                                                                                                                                                  product: ''
                                                                                                                                                                                                                                                                                                      })

                                                                                                                                                                                                                                                                                                          setShowSellerForm(false)
                                                                                                                                                                                                                                                                                                            }}
                                                                                                                                                                                                                                                                                                            >
                                                                                                                                                                                                  Register as Seller
                                                                                                                                                                                                        </button>
                                                                                                                                                                                                            </div>


                                                                                                                                                                                                              </div>
                                                                                                                                                                                                              )}
     {showSellerDashboard && (
        <div className="seller-form-overlay">
            <div className="seller-form">
                  <button
                          className="form-close"
                                  onClick={() => setShowSellerDashboard(false)}
                                        >
                                                ✕
                                                      </button>

                                                            <h2>Seller Dashboard</h2>
                                                                  <p>Welcome to Sekayi!</p>

                                                                        {(() => {
                                                                                const seller = JSON.parse(
                                                                                    localStorage.getItem('sekayiSeller')
                                                                                      ) || {}

                                                                                                          return (
                                                                                                                    <div className="seller-profile">
                                                                                                                                <p>
                                                                                                                                              <strong>Business:</strong> {seller.name}
                                                                                                                                                          </p>

                                                                                                                                                                      <p>
                                                                                                                                                                                    <strong>WhatsApp:</strong> {seller.whatsapp}
                                                                                                                                                                                                </p>

                                                                                                                                                                                                            <p>
                                                                                                                                                                                                                          <strong>Location:</strong> {seller.location}
                                                                                                                                                                                                                                      </p>
                                                                                                                                                                                                                                      <button
                                                                                                                                                                                                                                        onClick={() => {
                                                                                                                                                                                                                                            const newName = prompt('Business name:', seller.name)
                                                                                                                                                                                                                                                const newWhatsapp = prompt('WhatsApp number:', seller.whatsapp)
                                                                                                                                                                                                                                                    const newLocation = prompt('Location:', seller.location)

                                                                                                                                                                                                                                                        if (newName && newWhatsapp && newLocation) {
                                                                                                                                                                                                                                                              const updatedSeller = {
                                                                                                                                                                                                                                                                ...seller,
                                                                                                                                                                                                                                                                  name: newName,
                                                                                                                                                                                                                                                                    whatsapp: newWhatsapp,
                                                                                                                                                                                                                                                                      location: newLocation,
                                                                                                                                                                                                                                                                  }

                                                                                                                                                                                                                                                                      const products = JSON.parse(
                                                                                                                                                                                                                                                                    localStorage.getItem('sekayiProducts')
                                                                                                                                                                                                                                                                    ) || []

                                                                                                                                                                                                                                                                    const updatedProducts = products.map((product) => {
                                                                                                                                                                                                                                                                      if (product.seller?.name === seller.name) {
                                                                                                                                                                                                                                                                    return {
                                                                                                                                                                                                                                                                          ...product,
                                                                                                                                                                                                                                                                          seller: {
                                                                                                                                                                                                                                                                            ...product.seller,
                                                                                                                                                                                                                                                                              name: newName,
                                                                                                                                                                                                                                                                                whatsapp: newWhatsapp,
                                                                                                                                                                                                                                                                                  location: newLocation,
                                                                                                                                                                                                                                                                                  },
                                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                                  }

                                                                                                                                                                                                                                                                                    return product
                                                                                                                                                                                                                                                                                    })

                                                                                                                                                                                                                                                                                    localStorage.setItem(
                                                                                                                                                                                                                                                                                      'sekayiProducts',
                                                                                                                                                                                                                                                                                        JSON.stringify(updatedProducts)
                                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                                      localStorage.setItem(
                                                                                                                                                                                                                                                                        'sekayiSeller',
                                                                                                                                                                                                                                                                          JSON.stringify(updatedSeller)
                                                                                                                                                                                                                                                                          )

                                                                                                                                                                                                                                                                                alert('Seller details updated successfully!')
                                                                                                                                                                                                                                                                                window.location.reload()
                                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                                                                                                                  }}
                                                                                                                                                                                                                                                                                                                                                  >
                                                                                                                                                                                                                                                                                                                                                    Edit Seller Details
                                                                                                                                                                                                                                                                                                                                                    </button>

                                                                                                                                                                                                                                                  <p>
                                                                                                                                                                                                                                                                <strong>Products:</strong>{' '}
                                                                                                                                                                                                                                                                  {(JSON.parse(localStorage.getItem('sekayiProducts')) || [])
                                                                                                                                                                                                                                                                      .filter((product) => product.seller?.name === seller.name)
                                                                                                                                                                                                                                                                          .length}
                                                                                                                                                                                                                                                                            </p>
                                                                                                                                                                                                                                                                            <h3>My Products</h3>

                                                                                                                                                                                                                                                                            {(() => {
                                                                                                                                                                                                                                                                              const myProducts =
                                                                                                                                                                                                                                                                                  JSON.parse(localStorage.getItem('sekayiProducts')) || []

                                                                                                                                                                                                                                                                                    const sellerProducts = myProducts.filter(
                                                                                                                                                                                                                                                                                        (product) => product.seller?.name === seller.name
                                                                                                                                                                                                                                                                                          )

                                                                                                                                                                                                                                                                                            return sellerProducts.length > 0 ? (
                                                                                                                                                                                                                                                                                                sellerProducts.map((product) => (
                                                                                                                                                                                                                                                                                                      <div key={product.id} className="my-product">
                                                                                                                                                                                                                                                                                       
                                                                                                                                                                                                                                                                                       
                                                                                                                                                                                                                                                                                                            <div className="my-product-image">
                                                                                                                                                                                                                                                                                                                      {product.image ? (
                                                                                                                                                                                                                                                                                                                          product.image.startsWith('data:image') ? (
                                                                                                                                                                                                                                                                                                                              <img
                                                                                                                                                                                                                                                                                                                                    src={product.image}
                                                                                                                                                                                                                                                                                                                                          alt={product.name}
                                                                                                                                                                                                                                                                                                                                                className="product-image"
                                                                                                                                                                                                                                                                                                                                                            />
                                                                                                                                                                                                                                                                                                                                                            ) : (
                                                                                                                                                                                                                                                                                                                                                              product.image
                                                                                                                                                                                                                                                                                                                                                          )
                                                                                                                                                                                                                                                                                                                                               ) : (
                                                                                                                                                                                                                                                                                                                                                        '📦'
                                                                                                                                                                                                                                                                                                                                                          )}
                                                                                                                                                                                                                                                                                                                          <strong>{product.name}</strong>
                                                                                                                                                                                                                                                                                                                            <p className="my-product-price">{product.price}</p>
                                                                                                                                                                                                                                                                                                                              <p>📍 {product.details}</p>
                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                                                              <button
                                                                                                                                                                                                                                                                                                                                className="edit-product-button"
                                                                                                                                                                                                                                                                                                                                  onClick={() => {
                                                                                                                                                                                                                                                                                                                                      setProductForm({
                                                                                                                                                                                                                                                                                                                                            name: product.name,
                                                                                                                                                                                                                                                                                                                                                  price: product.price,
                                                                                                                                                                                                                                                                                                                                                        category: product.category,
                                                                                                                                                                                                                                                                                                                                                              description: product.description || '',
                                                                                                                                                                                                                                                                                                                                                                    location: product.details,
                                                                                                                                                                                                                                                                                                                                                                    image: product.image || ''
                                                                                                                                                                                                                                                                                                                                                                        })
                                                                                                                                                                                                                                                                                                                                                                        setEditingProductId(product.id)
                                                                                                                                                                                                                                                                                                                                                                            setShowProductForm(true)
                                                                                                                                                                                                                                                                                                                                                                              }}
                                                                                                                                                                                                                                                                                                                                                                              >
                                                                                                                                                                                                                                                                                                                                                                                ✏️ Edit
                                                                                                                                                                                                                                                                                                                                                                                </button>
                                                                                                                                                                                                                                                                                                                              <button
                                                                                                                                                                                                                                                                                                                                  className="delete-product-button"
                                                                                                                                                                                                                                                                                                                                      onClick={() => {
                                                                                                                                                                                                                                                                                                                                            const products =
                                                                                                                                                                                                                                                                                                                                                    JSON.parse(localStorage.getItem('sekayiProducts')) || []

                                                                                                                                                                                                                                                                                                                                                          const updatedProducts = products.filter(
                                                                                                                                                                                                                                                                                                                                                                  (item) => item.id !== product.id
                                                                                                                                                                                                                                                                                                                                                                        )

                                                                                                                                                                                                                                                                                                                                                                              localStorage.setItem(
                                                                                                                                                                                                                                                                                                                                                                                      'sekayiProducts',
                                                                                                                                                                                                                                                                                                                                                                                              JSON.stringify(updatedProducts)
                                                                                                                                                                                                                                                                                                                                                                                                    )

                                                                                                                                                                                                                                                                                                                                                                                                          setSavedProducts(updatedProducts)

                                                                                                                                                                                                                                                                                                                                                                                                                alert('Product deleted.')
                                                                                                                                                                                                                                                                                                                                                                                                                    }}
                                                                                                                                                                                                                                                                                                                                                                                                                      >
                                                                                                                                                                                                                                                                                                                                                                                                                          🗑️ Delete
                                                                                                                                                                                                                                                                                                                                                                                                                            </button>
                                                                                                                                                                                                                                                                                                                                    <button
                                                                                                                                                                                                                                                                                                                                      className="back-marketplace-button"
                                                                                                                                                                                                                                                                                                                                        onClick={() => setShowSellerDashboard(false)}
                                                                                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                                                          🛍️ Back to Marketplace
                                                                                                                                                                                                                                                                                                                                          </button>
                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                        ))
                                                                                                                                                                                                                                                                                                                                          ) : (
                                                                                                                                                                                                                                                                                                                                              <p>No products published yet.</p>
                                                                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                                                                                                })()}
                                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                                              )
                                                                                                                                                                                                                                                                                                    })()}
<button
  className="register-button"
    onClick={() => setShowProductForm(true)}
  
    >
      
  
  
      ➕ Add Product

      
      </button>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                              )}

       {showProductForm && (
         <div className="seller-form-overlay">
             <div className="seller-form">
                   <button
                           className="form-close"
                                   onClick={() => setShowProductForm(false)}
                                         >
                                                 ✕
                                                       </button>

                                                             <h2>Add Product</h2>
                                                                   <p>List a product for buyers to discover.</p>

                                                                         <input
                                                                                 type="text"
                                                                                         placeholder="Product name"
                                                                                                 value={productForm.name}
                                                                                                         onChange={(e) =>
                                                                                                                   setProductForm({
                                                                                                                               ...productForm,
                                                                                                                                           name: e.target.value
                                                                                                                                                     })
                                                                                                                                                             }
                                                                                                                                                                   />

                                                                                                                                                                         <input
                                                                                                                                                                                 type="text"
                                                                                                                                                                                         placeholder="Price (e.g. $25)"
                                                                                                                                                                                                 value={productForm.price}
                                                                                                                                                                                                         onChange={(e) =>
                                                                                                                                                                                                                   setProductForm({
                                                                                                                                                                                                                               ...productForm,
                                                                                                                                                                                                                                           price: e.target.value
                                                                                                                                                                                                                                                     })
                                                                                                                                                                                                                                                             }
                                                                                                                                                                                                                                                                   />

                                                                                                                                                                                                                                                                         <input
                                                                                                                                                                                                                                                                                 type="text"
                                                                                                                                                                                                                                                                                         placeholder="Category (e.g. Fashion)"
                                                                                                                                                                                                                                                                                                 value={productForm.category}
                                                                                                                                                                                                                                                                                                         onChange={(e) =>
                                                                                                                                                                                                                                                                                                                   setProductForm({
                                                                                                                                                                                                                                                                                                                               ...productForm,
                                                                                                                                                                                                                                                                                                                                           category: e.target.value
                                                                                                                                                                                                                                                                                                                                                     })
                                                                                                                                                                                                                                                                                                                                                             }
                                                                                                                                                                                                                                                                                                                                                                   />

                                                                                                                                                                                                                                                                                                                                                                         <input
                                                                                                                                                                                                                                                                                                                                                                                 type="text"
                                                                                                                                                                                                                                                                                                                                                                                         placeholder="Description"
                                                                                                                                                                                                                                                                                                                                                                                                 value={productForm.description}
                                                                                                                                                                                                                                                                                                                                                                                                         onChange={(e) =>
                                                                                                                                                                                                                                                                                                                                                                                                                   setProductForm({
                                                                                                                                                                                                                                                                                                                                                                                                                               ...productForm,
                                                                                                                                                                                                                                                                                                                                                                                                                                           description: e.target.value
                                                                                                                                                                                                                                                                                                                                                                                                                                                     })
                                                                                                                                                                                                                                                                                                                                                                                                                                                             }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                   />

                                                                                                                                                                                                                                                                                                                                                                                                                                                                         <input
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 type="text"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         placeholder="Location"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 value={productForm.location}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         onChange={(e) =>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   setProductForm({
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               ...productForm,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           location: e.target.value
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     })
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             <label className="image-upload-label">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                📷 Product Image
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </label>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <input
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  type="file"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    accept="image/*"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      className="product-image-input"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        onChange={(e) => {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            const file = e.target.files[0]

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                if (!file) return

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    const reader = new FileReader()

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        reader.onloadend = () => {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              setProductForm({
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ...productForm,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              image: reader.result
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    })
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            reader.readAsDataURL(file)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              }}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   />

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         <button
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           className="register-button"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             onClick={() => {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 if (
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       !productForm.name ||
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             !productForm.price ||
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   !productForm.category ||
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         !productForm.description ||
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               !productForm.location
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   ) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         alert('Please complete all fields.')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               return
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       const savedSeller = localStorage.getItem('sekayiSeller')

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           if (!savedSeller) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 alert('Please register as a seller first.')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       return
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               const seller = JSON.parse(savedSeller)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               if (editingProductId !== null) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 const products =
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   JSON.parse(localStorage.getItem('sekayiProducts')) || []

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 const updatedProducts = products.map((product) =>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   product.id === editingProductId
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     ? {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         ...product,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         name: productForm.name,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         price: productForm.price,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         category: productForm.category,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         description: productForm.description,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         details: productForm.location
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     : product
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 )

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 localStorage.setItem(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   'sekayiProducts',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   JSON.stringify(updatedProducts)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 )

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 setSavedProducts(updatedProducts)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 setEditingProductId(null)

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 alert('Product updated successfully!')

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 setProductForm({
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   name: '',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   price: '',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   category: '',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   description: '',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   location: '',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 })

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 setShowProductForm(false)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 return
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   const newProduct = {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         id: Date.now(),
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               name: productForm.name,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     price: productForm.price,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           category: productForm.category,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 details: productForm.location,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       description: productForm.description,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             image: productForm.image || '📦',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   seller: {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           name: seller.name,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   location: seller.location,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           whatsapp: seller.whatsapp
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         const existingProducts =
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               JSON.parse(localStorage.getItem('sekayiProducts')) || []

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   localStorage.setItem(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       'sekayiProducts',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               JSON.stringify([...existingProducts, newProduct])
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   )

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       alert('Product published successfully!')

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           setProductForm({
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 name: '',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       price: '',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             category: '',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   description: '',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         location: '',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             })

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 setShowProductForm(false)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     setShowSellerDashboard(false)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       }}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       >
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 Publish Product
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       </button>
             </div>
           )}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           </div>
                      
 {showCart && (
  <div className="product-modal">
    <div className="product-modal-content">

      <button
        className="close-button"
        onClick={() => setShowCart(false)}
      >
        ✕
      </button>

      <h2>🛒 My Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>

              <div className="cart-item-image">
                {item.image && item.image.startsWith('data:image') ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-product-image"
                  />
                ) : (
                  item.image || '📦'
                )}
              </div>

              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>{item.price}</p>
                <p>Quantity: {item.quantity}</p>

                <button
                  onClick={() => {
                    const updatedCart = cart.filter(
                      (cartItem) => cartItem.id !== item.id
                    )

                    setCart(updatedCart)
                    localStorage.setItem(
                      'sekayiCart',
                      JSON.stringify(updatedCart)
                    )
                  }}
                >
                  Remove
                </button>
              </div>

            </div>
          ))}

          <button
            className="contact-button"
            onClick={() => {
              alert('Order feature coming soon!')
            }}
          >
            Place Order
          </button>
        </>
      )}

    </div>
  </div>
)}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             )}                                                                                                                                                                                                      
    </div>
  )
}

export default App
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
