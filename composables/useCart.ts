// composables/useCart.ts
export interface Product {
  id: number
  name: string
  slug: string
  category: string
  price: number
  description: string
  material: string
  stock: number
  rating: number
  review_count: number
  image_url: string
}

export interface CartItem extends Product {
  quantity: number
}

export const useCart = () => {
  const items = useState<CartItem[]>('vespera_cart', () => [])
  const isCartOpen = useState<boolean>('vespera_cart_open', () => false)

  // Hydrate from localStorage on client mount
  if (import.meta.client) {
    onMounted(() => {
      const saved = localStorage.getItem('vespera_cart')
      if (saved && items.value.length === 0) {
        try {
          items.value = JSON.parse(saved)
        } catch (e) {
          console.error('Failed to parse cart from storage', e)
        }
      }
    })
  }

  const persist = () => {
    if (import.meta.client) {
      localStorage.setItem('vespera_cart', JSON.stringify(items.value))
    }
  }

  const addToCart = (product: Product, quantity = 1) => {
    const existing = items.value.find((i) => i.id === product.id)
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock)
    } else {
      items.value.push({ ...product, quantity })
    }
    persist()
    isCartOpen.value = true
  }

  const updateQuantity = (productId: number, quantity: number) => {
    const item = items.value.find((i) => i.id === productId)
    if (!item) return
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      item.quantity = Math.min(quantity, item.stock)
      persist()
    }
  }

  const removeFromCart = (productId: number) => {
    items.value = items.value.filter((i) => i.id !== productId)
    persist()
  }

  const clearCart = () => {
    items.value = []
    persist()
  }

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
  )

  return {
    items,
    isCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    subtotal
  }
}