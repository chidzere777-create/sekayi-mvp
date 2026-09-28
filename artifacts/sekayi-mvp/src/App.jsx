import { useEffect, useState } from 'react'
import './App.css'
import { cartItemsFromResponse, marketplaceApi } from './api.js'

function App() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showSellerForm, setShowSellerForm] = useState(false)
const [showSellerDashboard, setShowSellerDashboard] = useState(false)
const [editingProductId, setEditingProductId] = useState(null)

const [showProductForm, setShowProductForm] = useState(false)
const [showCart, setShowCart] = useState(false)
 const [showAccount, setShowAccount] = useState(false)
  const [showRiderForm, setShowRiderForm] = useState(false)
  const [showRiderList, setShowRiderList] = useState(false)
const [apiError, setApiError] = useState('')
const [isLoadingProducts, setIsLoadingProducts] = useState(true)

const [riders, setRiders] = useState(() => {
  return JSON.parse(localStorage.getItem('sekayiRiders')) || []
})

const [riderForm, setRiderForm] = useState({
  name: '',
  whatsapp: '',
  location: '',
  vehicle: ''
})

const [buyer, setBuyer] = useState(() => {
  return JSON.parse(localStorage.getItem('sekayiBuyer')) || null
})

const [buyerForm, setBuyerForm] = useState({
  name: '',
  whatsapp: '',
  location: ''
}) 

  const [cart, setCart] = useState(() => {
 return []
})

const [savedProducts, setSavedProducts] = useState(() => {
 return []
    })
const [seller, setSeller] = useState(() => {
 return JSON.parse(localStorage.getItem('sekayiSeller')) || null
})
const [sellerOrderCount, setSellerOrderCount] = useState(0)

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
 const products = savedProducts

 useEffect(() => {
   let active = true
   marketplaceApi
     .listProducts()
     .then((items) => {
       if (active) setSavedProducts(items)
     })
     .catch((error) => {
       if (active) setApiError(error.message)
     })
     .finally(() => {
       if (active) setIsLoadingProducts(false)
     })
   return () => {
     active = false
   }
 }, [])

 useEffect(() => {
   if (!buyer?.id) return
   marketplaceApi
     .getCart(buyer.id)
     .then((nextCart) => setCart(cartItemsFromResponse(nextCart)))
     .catch((error) => setApiError(error.message))
 }, [buyer?.id])

 useEffect(() => {
   if (!seller?.id) return
   marketplaceApi
     .getSellerOrderCount(seller.id)
     .then((result) => setSellerOrderCount(result.count))
     .catch((error) => setApiError(error.message))
 }, [seller?.id])

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
          <img className="bear" src={`${import.meta.env.BASE_URL}sekayi-logo.png`} alt="Sekayi" />
          
            <p className="tagline">Simple • Local • Trusted</p>
          </div>
      

        <button className="menu" aria-label="Menu">
          ☰
        </button>
      </header>

      <main>
        <section className="hero">
          <h2>
            Buy & Sell Local 
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
                 <div className="product" key={product.id}
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
                  
                  </div>
                  <h4>{product.name}</h4>
                  <p>{product.details}</p>
                  <strong>${Number(product.price).toFixed(2)}</strong>
                  {product && product.seller && (
                    <div className="seller-info">
                      <h3>Seller</h3>
                        <p><strong>{product.seller.name}</strong></p>
                          <p>📍 {product.seller.location}</p>
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
              <strong>${Number(selectedProduct.price).toFixed(2)}</strong>
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
  className="place-order-button"
 onClick={async () => {
 if (!buyer?.id) {
 alert('Please create a buyer account before adding items to your cart.')
 setShowAccount(true)
 return
 }

 try {
   const nextCart = await marketplaceApi.addCartItem(buyer.id, {
     productId: Number(selectedProduct.id),
     quantity: 1
   })
   setCart(cartItemsFromResponse(nextCart))
   alert('Product added to cart!')
 } catch (error) {
   alert(error.message)
 }
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
        <button
  className="sell-button"
  onClick={() => setShowRiderForm(true)}
>
  🚴 Register as a Rider
</button>
        <button className="nav-item" 
        onClick={() => setShowCart(true)}>
          🛒<span>Cart</span>
        </button>
        <button className="nav-item"
          onClick={() => setShowAccount(true)}
>
          👤<span>Account</span>
        </button>
        <button
          className="seller-dashboard-button"
            onClick={() => {
 if (!seller?.id) {
                            alert('Please register as a seller first.')
                                  return
                                      }

                                          setShowSellerDashboard(true)
                                            }}
                                            >
            
        

                  
                          
                                
                                    

                                  
                                            
                                              
                                          
                                              
                                                👤 Seller Dashboard
                                                </button>
      </nav>
               {showSellerForm && (
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
 onClick={async () => {
                                                                                                                                                                                                  if (
                                                                                                                                                                                                        !sellerForm.name ||
                                                                                                                                                                                                              !sellerForm.whatsapp ||
                                                                                                                                                                                                                    !sellerForm.location ||
                                                                                                                                                                                                                          !sellerForm.product
                                                                                                                                                                                                                              ) {
                                                                                                                                                                                                                                    alert('Please complete all fields.')
                                                                                                                                                                                                                                          return
                                                                                                                                                                                                                                              }

 try {
   const createdSeller = await marketplaceApi.createSeller(sellerForm)
   localStorage.setItem('sekayiSeller', JSON.stringify(createdSeller))
   setSeller(createdSeller)
   alert('Seller registration successful!')
   setSellerForm({
     name: '',
     whatsapp: '',
     location: '',
     product: ''
   })
   setShowSellerForm(false)
 } catch (error) {
   alert(error.message)
 }
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

 {seller && (
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
 marketplaceApi.updateSeller(seller.id, {
   name: newName,
   whatsapp: newWhatsapp,
   location: newLocation,
   product: seller.product
 }).then((updatedSeller) => {
   setSeller(updatedSeller)
   localStorage.setItem('sekayiSeller', JSON.stringify(updatedSeller))
   alert('Seller details updated successfully!')
 }).catch((error) => alert(error.message))
                                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                                                                                                                  }}
                                                                                                                                                                                                                                                                                                                                                  >
                                                                                                                                                                                                                                                                                                                                                    Edit Seller Details
                                                                                                                                                                                                                                                                                                                                                    </button>

                                                                                                                                                                                                                                                  <p>
                                                                                                                                                                                                                                                                <strong>Products:</strong>{' '}
 {savedProducts
 .filter((product) => product.sellerId === seller.id)
                                                                                                                                                                                                                                                                          .length}
                                                                                                                                                                                                                                                                            </p>
                                                                                                                                                                                                                                                                            <p>
 <strong>Orders:</strong> {sellerOrderCount}
</p>
                                                                                                                      
                                                                                                                                                                                                                                                                            <h3>My Products</h3>

 {(() => {
 const sellerProducts = savedProducts.filter(
 (product) => product.sellerId === seller.id
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
 onClick={async () => {
 try {
   await marketplaceApi.deleteProduct(product.id)
   setSavedProducts((items) => items.filter((item) => item.id !== product.id))
   alert('Product deleted.')
 } catch (error) {
   alert(error.message)
 }
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
 )}
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

                                                                                                                                                                                                                                                                         <select
  value={productForm.category}
  onChange={(e) =>
    setProductForm({
      ...productForm,
      category: e.target.value
    })
  }
>
  <option value="">Select Category</option>
  <option value="Groceries">Groceries</option>
  <option value="Food">Food</option>
  <option value="Electronics">Electronics</option>
  <option value="Fashion">Fashion</option>
  <option value="Home">Home</option>
  <option value="Other">Other</option>
</select>

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
 onClick={async () => {
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

 if (!seller?.id) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 alert('Please register as a seller first.')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       return
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               if (editingProductId !== null) {
   try {
     const updatedProduct = await marketplaceApi.updateProduct(editingProductId, {
       name: productForm.name,
       price: Number(String(productForm.price).replace(/[^0-9.]/g, '')),
       category: productForm.category,
       description: productForm.description,
       details: productForm.location,
       location: productForm.location,
       image: productForm.image || '📦'
     })
     setSavedProducts((items) =>
       items.map((item) => item.id === updatedProduct.id ? updatedProduct : item)
     )
     setEditingProductId(null)
     alert('Product updated successfully!')
   } catch (error) {
     alert(error.message)
     return
   }
 } else {
   try {
     const newProduct = await marketplaceApi.createProduct({
       sellerId: seller.id,
       name: productForm.name,
       price: Number(String(productForm.price).replace(/[^0-9.]/g, '')),
       category: productForm.category,
       details: productForm.location,
       description: productForm.description,
       location: productForm.location,
       image: productForm.image || '📦'
     })
     setSavedProducts((items) => [...items, newProduct])
     alert('Product published successfully!')
   } catch (error) {
     alert(error.message)
     return
   }
 }

 setProductForm({
   name: '',
   price: '',
   category: '',
   description: '',
   location: '',
   image: ''
 })
 setShowProductForm(false)
 setShowSellerDashboard(false)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       }}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       >
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 Publish Product
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       </button>
             </div>
          </div>
      )}
                      
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
                <div className="quantity-controls">
  <button
 onClick={async () => {
 try {
   const nextCart = await marketplaceApi.updateCartItem(
     buyer.id,
     item.id,
     Math.max(1, item.quantity - 1)
   )
   setCart(cartItemsFromResponse(nextCart))
 } catch (error) {
   alert(error.message)
 }
    }}
  >
    −
  </button>

  <span>{item.quantity}</span>

  <button
 onClick={async () => {
 try {
   const nextCart = await marketplaceApi.updateCartItem(
     buyer.id,
     item.id,
     item.quantity + 1
   )
   setCart(cartItemsFromResponse(nextCart))
 } catch (error) {
   alert(error.message)
 }
    }}
  >
    +
  </button>
</div>

                <button
                  onClick={async () => {
                    try {
                      const nextCart = await marketplaceApi.removeCartItem(
                        buyer.id,
                        item.id
                      )
                      setCart(cartItemsFromResponse(nextCart))
                    } catch (error) {
                      alert(error.message)
                    }
                  }}
                >
                  Remove
                </button>
              </div>

            </div>
          ))}

          <div className="cart-total">
  <strong>
    Total: $
    {cart.reduce((total, item) => {
      const price = Number(
        String(item.price).replace(/[^0-9.]/g, '')
      )

      return total + price * item.quantity
    }, 0).toFixed(2)}
  </strong>
</div>

          <button
  className="contact-button"
  onClick={() => {
    setShowRiderList(true)
  }}
>
  🛵 Find a Rider
</button>
          <button
  className="place-order-button"
            onClick={async () => {
              if (!buyer?.id) {
                alert('Please create a buyer account before placing an order.')
                setShowAccount(true)
                return
              }
              try {
                const order = await marketplaceApi.createOrder(
                  buyer.id,
                  buyer.location
                )
                setCart([])
                alert(`Order #${order.id} placed successfully!`)
              } catch (error) {
                alert(error.message)
              }
            }}
          >
            Place Order
          </button>
        </>
      )}

    </div>
  </div>
)}       

      {showAccount && (
  <div className="product-modal">
    <div className="product-modal-content">

      <button
        className="close-button"
        onClick={() => setShowAccount(false)}
      >
        ✕
      </button>

      <h2>👤 My Account</h2>

      {!buyer ? (
        <>
          <p>Create your buyer account.</p>

          <input
            type="text"
            placeholder="Your name"
            value={buyerForm.name}
            onChange={(e) =>
              setBuyerForm({
                ...buyerForm,
                name: e.target.value
              })
            }
          />

          <input
            type="text"
            placeholder="WhatsApp number"
            value={buyerForm.whatsapp}
            onChange={(e) =>
              setBuyerForm({
                ...buyerForm,
                whatsapp: e.target.value
              })
            }
          />

          <input
            type="text"
            placeholder="Your location"
            value={buyerForm.location}
            onChange={(e) =>
              setBuyerForm({
                ...buyerForm,
                location: e.target.value
              })
            }
          />

          <button
            className="sell-button"
            onClick={async () => {
              if (
                !buyerForm.name ||
                !buyerForm.whatsapp ||
                !buyerForm.location
              ) {
                alert('Please complete all fields.')
                return
              }

              try {
                const createdBuyer = await marketplaceApi.createBuyer(buyerForm)
                localStorage.setItem(
                  'sekayiBuyer',
                  JSON.stringify(createdBuyer)
                )
                setBuyer(createdBuyer)
                alert('Account created successfully!')
              } catch (error) {
                alert(error.message)
              }
            }}
          >
            Create Account
          </button>
        </>
      ) : (
        <>
          <p><strong>Name:</strong> {buyer.name}</p>
          <p><strong>WhatsApp:</strong> {buyer.whatsapp}</p>
          <p><strong>Location:</strong> {buyer.location}</p>

          <button
  className="sell-button"
  onClick={() => {
    setBuyerForm({
      name: buyer.name,
      whatsapp: buyer.whatsapp,
      location: buyer.location
    })

    setBuyer(null)
  }}
>
  ✏️ Edit Account
</button>
        </>
      )}

    </div>
  </div>
)}
    {showRiderList && (
  <div className="product-modal">
    <div className="product-modal-content">

      <button
        className="close-button"
        onClick={() => setShowRiderList(false)}
      >
        ✕
      </button>

      <h2>🛵 Find a Rider</h2>

      {riders.length === 0 ? (
    <>
        <p>No riders available.</p>
    <button
  className="sell-button"
  onClick={() => {
    setShowRiderList(false)
    setShowRiderForm(true)
  }}
>
  🚴 Register as Rider
</button>
    </>
      ) : (
        <>
          <h3>Available Riders</h3>

          {riders.map((rider, index) => (
            <div className="seller-profile" key={index}>
              <p><strong>Name:</strong> {rider.name}</p>
              <p><strong>📍 Location:</strong> {rider.location}</p>
              <p><strong>🚗Vehicle:</strong> {rider.vehicle}</p>

              <button
                className="sell-button"
                onClick={() => {
                  let whatsapp = rider.whatsapp
                    .replace(/\s/g, '')
                    .replace(/^0/, '263')
                    .replace(/^\+263/, '263')

                  const message =
                    'Hello, I found you on Sekayi. I would like to arrange a delivery.'

                  window.open(
                    `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`,
                    '_blank'
                  )
                }}
              >
                📱 Contact Rider
              </button>
            </div>
          ))}
        </>
      )}

    </div>
  </div>
)}
      {showRiderForm && (
  <div className="product-modal">
    <div className="product-modal-content">

      <button
        className="close-button"
        onClick={() => setShowRiderForm(false)}
      >
        ✕
      </button>

      <h2>🚴 Rider Registration</h2>

      {riders.length === 0 ? (
        <>
          <p>Register as a Sekayi rider.</p>

          <input
            type="text"
            placeholder="Your name"
            value={riderForm.name}
            onChange={(e) =>
              setRiderForm({
                ...riderForm,
                name: e.target.value
              })
            }
          />

          <input
            type="text"
            placeholder="WhatsApp number"
            value={riderForm.whatsapp}
            onChange={(e) =>
              setRiderForm({
                ...riderForm,
                whatsapp: e.target.value
              })
            }
          />

          <input
            type="text"
            placeholder="Your location"
            value={riderForm.location}
            onChange={(e) =>
              setRiderForm({
                ...riderForm,
                location: e.target.value
              })
            }
          />

          <input
            type="text"
            placeholder="Vehicle type (e.g. Motorcycle)"
            value={riderForm.vehicle}
            onChange={(e) =>
              setRiderForm({
                ...riderForm,
                vehicle: e.target.value
              })
            }
          />

          <button
            className="sell-button"
            onClick={() => {
              if (
                !riderForm.name ||
                !riderForm.whatsapp ||
                !riderForm.location ||
                !riderForm.vehicle
              ) {
                alert('Please complete all fields.')
                return
              }

              const newRiders = [...riders, riderForm]

              localStorage.setItem(
                'sekayiRiders',
                JSON.stringify(newRiders)
              )

              setRiders(newRiders)

              alert('Rider registration successful!')
            }}
          >
            Register as Rider
          </button>
        </>
      ) : (
  <>
    <h3>🛵 Registered Riders</h3>

    {riders.map((rider, index) => (
      <div className="seller-profile" key={index}>
        <p><strong>Name:</strong> {rider.name}</p>
        <p><strong>📍 Location:</strong> {rider.location}</p>
        <p><strong>🚗 Vehicle:</strong> {rider.vehicle}</p>

        <button
          className="sell-button"
          onClick={() => {
            let whatsapp = rider.whatsapp
              .replace(/\s/g, '')
              .replace(/^0/, '263')
              .replace(/^\+263/, '263')

            const message =
              'Hello, I found you on Sekayi. I would like to arrange a delivery.'

            window.open(
              `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`,
              '_blank'
            )
          }}
        >
          📱 Contact Rider
        </button>
      </div>
    ))}
  </>
)}

    </div>
  </div>
)}
    </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
  )
}

export default App
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
