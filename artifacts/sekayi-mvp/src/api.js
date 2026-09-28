const API_BASE = `${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/api`

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const body = await response.json()
      message = body.error || message
    } catch {
      // Keep the HTTP status message when the server did not return JSON.
    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  return response.json()
}

const json = (method, body) => ({
  method,
  body: JSON.stringify(body),
})

export const marketplaceApi = {
  listProducts: (params = {}) => {
    const query = new URLSearchParams()
    if (params.search) query.set('search', params.search)
    if (params.category && params.category !== 'All') {
      query.set('category', params.category)
    }
    const suffix = query.toString() ? `?${query.toString()}` : ''
    return request(`/products${suffix}`)
  },
  createSeller: (body) => request('/sellers', json('POST', body)),
  updateSeller: (sellerId, body) =>
    request(`/sellers/${sellerId}`, json('PATCH', body)),
  createBuyer: (body) => request('/buyers', json('POST', body)),
  createProduct: (body) => request('/products', json('POST', body)),
  updateProduct: (productId, body) =>
    request(`/products/${productId}`, json('PATCH', body)),
  deleteProduct: (productId) => request(`/products/${productId}`, { method: 'DELETE' }),
  getCart: (buyerId) => request(`/buyers/${buyerId}/cart`),
  addCartItem: (buyerId, body) =>
    request(`/buyers/${buyerId}/cart/items`, json('POST', body)),
  updateCartItem: (buyerId, productId, quantity) =>
    request(
      `/buyers/${buyerId}/cart/items/${productId}`,
      json('PATCH', { quantity }),
    ),
  removeCartItem: (buyerId, productId) =>
    request(`/buyers/${buyerId}/cart/items/${productId}`, { method: 'DELETE' }),
  createOrder: (buyerId, deliveryLocation) =>
    request(`/buyers/${buyerId}/orders`, json('POST', { deliveryLocation })),
  getSellerOrderCount: (sellerId) =>
    request(`/sellers/${sellerId}/orders/count`),
}

export function cartItemsFromResponse(cart) {
  return (cart?.items || []).map((item) => ({
    ...item.product,
    id: item.productId,
    quantity: item.quantity,
  }))
}