<!-- pages/index.vue -->
<script setup lang="ts">
import type { Product } from '~/composables/useCart'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { addToCart } = useCart()

const categories = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets']
const selectedCategory = computed(() => (route.query.category as string) || 'All')

const { data: products, status } = await useFetch<Product[]>('/api/products', {
  query: { category: selectedCategory },
  watch: [selectedCategory]
})

const selectCategory = (cat: string) => {
  if (cat === 'All') {
    router.push({ path: '/' })
  } else {
    router.push({ path: '/', query: { category: cat } })
  }
}

// Page-specific SEO & Open Graph Meta
useSeoMeta({
  title: () =>
    selectedCategory.value === 'All'
      ? 'Handcrafted 18k Gold & Sterling Silver Jewellery'
      : `${selectedCategory.value} Collection`,
  description:
    'Discover Vespera Fine Jewellery. Architectural rings, baroque pearl earrings, and recycled 18k gold necklaces crafted for modern heirlooms.',
  ogTitle: 'Vespera Fine Jewellery | Modern Heirloom Pieces',
  ogDescription:
    'Explore ethically crafted 18k gold vermeil, solid gold, and sterling silver jewellery.',
  ogType: 'website',
  ogUrl: `${config.public.siteUrl}/`,
  ogImage:
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <div>
    <!-- Editorial Hero Banner -->
    <section class="relative bg-stone-900 text-stone-100 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        <div class="max-w-xl space-y-5">
          <span class="text-xs uppercase tracking-[0.25em] text-amber-400">Autumn / Winter Atelier</span>
          <h1 class="text-4xl sm:text-5xl font-serif font-normal tracking-tight leading-tight">
            Sculpted in Recycled Gold. Built for Generations.
          </h1>
          <p class="text-stone-300 text-base leading-relaxed">
            Every Vespera piece is cast in small batches using conflict-free gemstones and 100% recycled precious metals.
          </p>
        </div>
        <div class="w-full md:w-80 lg:w-96 shrink-0">
          <NuxtImg
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80"
            alt="Aurelia Herringbone Chain Necklace"
            width="600"
            height="450"
            format="webp"
            fetchpriority="high"
            class="w-full h-64 object-cover rounded-lg shadow-xl"
          />
        </div>
      </div>
    </section>

    <!-- Category Filters & Product Grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-stone-200">
        <div>
          <h2 class="text-2xl font-serif font-semibold">
            {{ selectedCategory === 'All' ? 'All Jewellery' : selectedCategory }}
          </h2>
          <p class="text-xs text-stone-500 mt-1">
            Showing {{ products?.length || 0 }} handcrafted pieces
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectCategory(cat)"
            :class="[
              'px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition',
              selectedCategory === cat
                ? 'bg-stone-900 text-white'
                : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300'
            ]"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="status === 'pending'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        <div v-for="n in 6" :key="n" class="animate-pulse space-y-3">
          <div class="bg-stone-200 h-80 rounded-lg w-full" />
          <div class="bg-stone-200 h-4 w-2/3 rounded" />
          <div class="bg-stone-200 h-4 w-1/4 rounded" />
        </div>
      </div>

      <!-- Product Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-8">
        <article
          v-for="product in products"
          :key="product.id"
          class="group flex flex-col justify-between"
        >
          <div>
            <NuxtLink :to="`/products/${product.slug}`" class="block overflow-hidden rounded-lg bg-stone-200 aspect-4/5 relative">
              <NuxtImg
                :src="product.image_url"
                :alt="product.name"
                width="600"
                height="750"
                format="webp"
                loading="lazy"
                class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[11px] uppercase tracking-wider px-2.5 py-1 rounded text-stone-800">
                {{ product.category }}
              </span>
            </NuxtLink>

            <div class="mt-4 flex justify-between items-start gap-2">
              <div>
                <NuxtLink :to="`/products/${product.slug}`">
                  <h3 class="text-base font-medium text-stone-900 group-hover:text-amber-800 transition">
                    {{ product.name }}
                  </h3>
                </NuxtLink>
                <p class="text-xs text-stone-500 mt-0.5">{{ product.material }}</p>
              </div>
              <span class="text-sm font-semibold text-stone-900">${{ Number(product.price).toFixed(2) }}</span>
            </div>
          </div>

          <button
            @click="addToCart(product, 1)"
            class="mt-4 w-full py-2.5 px-4 border border-stone-300 rounded text-xs uppercase tracking-widest font-medium text-stone-900 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition"
          >
            Add to Bag
          </button>
        </article>
      </div>
    </section>
  </div>
</template>