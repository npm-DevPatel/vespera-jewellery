<!-- app.vue -->
<script setup lang="ts">
const { items, isCartOpen, updateQuantity, removeFromCart, clearCart, totalItems, subtotal } = useCart()
const checkoutSuccess = ref(false)
const isSubmitting = ref(false)

const handleMockCheckout = () => {
  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    checkoutSuccess.value = true
    clearCart()
  }, 900)
}

const closeCart = () => {
  isCartOpen.value = false
  checkoutSuccess.value = false
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-amber-200">
    <!-- Top Announcement Bar -->
    <div class="bg-stone-900 text-stone-100 text-xs tracking-widest uppercase text-center py-2.5 px-4">
      Complimentary Insured Express Shipping on Orders Over $250
    </div>

    <!-- Navigation Header -->
    <header class="sticky top-0 z-30 bg-stone-50/90 backdrop-blur-md border-b border-stone-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <NuxtLink to="/" class="text-2xl font-serif tracking-tight font-semibold text-stone-900">
          VESPERA
          <span class="block text-[10px] font-sans tracking-[0.25em] uppercase text-stone-500 -mt-1">
            Fine Jewellery
          </span>
        </NuxtLink>

        <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <NuxtLink to="/" class="hover:text-stone-900 transition">All Collections</NuxtLink>
          <NuxtLink to="/?category=Rings" class="hover:text-stone-900 transition">Rings</NuxtLink>
          <NuxtLink to="/?category=Necklaces" class="hover:text-stone-900 transition">Necklaces</NuxtLink>
          <NuxtLink to="/?category=Earrings" class="hover:text-stone-900 transition">Earrings</NuxtLink>
          <NuxtLink to="/?category=Bracelets" class="hover:text-stone-900 transition">Bracelets</NuxtLink>
        </nav>

        <button
          @click="isCartOpen = true"
          aria-label="Open shopping bag"
          class="relative flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border border-stone-300 hover:border-stone-900 transition"
        >
          <span>Bag</span>
          <span class="bg-stone-900 text-stone-50 text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {{ totalItems }}
          </span>
        </button>
      </div>
    </header>

    <!-- Main Page Content -->
    <main class="flex-1">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="bg-stone-900 text-stone-400 py-12 mt-24 border-t border-stone-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-sm">
        <div>
          <p class="text-stone-100 font-serif text-lg tracking-wide">VESPERA FINE JEWELLERY</p>
          <p class="text-xs text-stone-500 mt-1">Ethically crafted in recycled precious metals.</p>
        </div>
        <div class="flex gap-6 text-xs uppercase tracking-wider">
          <a href="/sitemap.xml" target="_blank" class="hover:text-stone-200">Sitemap (XML)</a>
          <span>© {{ new Date().getFullYear() }} Vespera Atelier</span>
        </div>
      </div>
    </footer>

    <!-- Slide-over Cart Drawer -->
    <div v-if="isCartOpen" class="fixed inset-0 z-50 overflow-hidden">
      <div @click="closeCart" class="fixed inset-0 bg-stone-950/50 backdrop-blur-xs transition-opacity" />

      <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div class="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          <!-- Drawer Header -->
          <div class="p-6 border-b border-stone-200 flex items-center justify-between">
            <h2 class="text-lg font-serif font-semibold">Your Shopping Bag ({{ totalItems }})</h2>
            <button @click="closeCart" class="text-stone-400 hover:text-stone-900 text-sm uppercase tracking-wider">
              Close ✕
            </button>
          </div>

          <!-- Drawer Body -->
          <div class="p-6 flex-1 overflow-y-auto">
            <!-- Mock Checkout Confirmation State -->
            <div v-if="checkoutSuccess" class="text-center py-12 space-y-4">
              <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-xl">
                ✓
              </div>
              <h3 class="text-xl font-serif font-semibold">Order Confirmed</h3>
              <p class="text-sm text-stone-600">
                Thank you for your order! Because this is a demo storefront, no payment was processed.
              </p>
              <button
                @click="closeCart"
                class="mt-4 inline-block bg-stone-900 text-white text-xs uppercase tracking-widest px-6 py-3 rounded-md hover:bg-stone-800"
              >
                Continue Exploring
              </button>
            </div>

            <!-- Empty Bag State -->
            <div v-else-if="items.length === 0" class="text-center py-16 text-stone-500">
              <p class="text-base">Your bag is currently empty.</p>
              <p class="text-xs mt-1">Explore our handcrafted pieces to add to your collection.</p>
            </div>

            <!-- Cart Items List -->
            <ul v-else class="divide-y divide-stone-200">
              <li v-for="item in items" :key="item.id" class="py-4 flex gap-4">
                <NuxtImg
                  :src="item.image_url"
                  :alt="item.name"
                  width="80"
                  height="80"
                  format="webp"
                  class="w-20 h-20 object-cover rounded-md bg-stone-100 shrink-0"
                />
                <div class="flex-1">
                  <div class="flex justify-between">
                    <NuxtLink
                      :to="`/products/${item.slug}`"
                      @click="closeCart"
                      class="text-sm font-medium text-stone-900 hover:underline"
                    >
                      {{ item.name }}
                    </NuxtLink>
                    <button
                      @click="removeFromCart(item.id)"
                      class="text-xs text-stone-400 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                  <p class="text-xs text-stone-500 mt-0.5">{{ item.material }}</p>
                  <div class="flex items-center justify-between mt-3">
                    <div class="flex items-center border border-stone-300 rounded">
                      <button
                        @click="updateQuantity(item.id, item.quantity - 1)"
                        class="px-2 py-0.5 text-xs hover:bg-stone-100"
                      >
                        -
                      </button>
                      <span class="px-2 text-xs font-medium">{{ item.quantity }}</span>
                      <button
                        @click="updateQuantity(item.id, item.quantity + 1)"
                        class="px-2 py-0.5 text-xs hover:bg-stone-100"
                      >
                        +
                      </button>
                    </div>
                    <span class="text-sm font-semibold">${{ (item.price * item.quantity).toFixed(2) }}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- Drawer Footer -->
          <div v-if="items.length > 0 && !checkoutSuccess" class="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
            <div class="flex justify-between text-sm">
              <span class="text-stone-600">Subtotal</span>
              <span class="font-semibold text-base">${{ subtotal.toFixed(2) }}</span>
            </div>
            <p class="text-xs text-stone-500">Shipping and complimentary gift packaging calculated at checkout.</p>
            <button
              @click="handleMockCheckout"
              :disabled="isSubmitting"
              class="w-full bg-stone-900 text-white py-3.5 text-xs uppercase tracking-widest font-medium rounded hover:bg-amber-900 transition disabled:opacity-50"
            >
              {{ isSubmitting ? 'Processing Order...' : 'Proceed to Mock Checkout' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>