<!-- pages/products/[slug].vue -->
<script setup lang="ts">
import type { Product } from '~/composables/useCart'

const route = useRoute()
const config = useRuntimeConfig()
const { addToCart } = useCart()
const quantity = ref(1)

const { data: product, error } = await useFetch<Product>(`/api/products/${route.params.slug}`)

if (error.value || !product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Product Not Found',
    fatal: true
  })
}

const canonicalUrl = computed(() => `${config.public.siteUrl}/products/${product.value?.slug}`)

// 1. Dynamic Page-Level Meta & Open Graph Tags
useSeoMeta({
  title: () => product.value?.name || 'Product',
  description: () => product.value?.description || '',
  ogTitle: () => `${product.value?.name} | Vespera Fine Jewellery`,
  ogDescription: () => product.value?.description || '',
  ogImage: () => product.value?.image_url || '',
  ogUrl: () => canonicalUrl.value,
  ogType: 'product',
  twitterCard: 'summary_large_image'
})

// 2. Canonical Link & Schema.org JSON-LD Product Structured Data
useHead({
  link: [
    { rel: 'canonical', href: () => canonicalUrl.value }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.value?.name,
        image: [product.value?.image_url],
        description: product.value?.description,
        sku: `VSP-${product.value?.id}`,
        material: product.value?.material,
        brand: {
          '@type': 'Brand',
          name: 'Vespera Fine Jewellery'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.value?.rating,
          reviewCount: product.value?.review_count
        },
        offers: {
          '@type': 'Offer',
          url: canonicalUrl.value,
          priceCurrency: 'USD',
          price: Number(product.value?.price).toFixed(2),
          availability:
            (product.value?.stock ?? 0) > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition'
        }
      })
    }
  ]
})
</script>

<template>
  <div v-if="product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Breadcrumbs -->
    <nav aria-label="Breadcrumb" class="text-xs text-stone-500 mb-8 flex items-center gap-2">
      <NuxtLink to="/" class="hover:text-stone-900">Home</NuxtLink>
      <span>/</span>
      <NuxtLink :to="`/?category=${product.category}`" class="hover:text-stone-900">
        {{ product.category }}
      </NuxtLink>
      <span>/</span>
      <span class="text-stone-900 font-medium">{{ product.name }}</span>
    </nav>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
      <!-- Optimized Product Image -->
      <div class="bg-stone-200 rounded-xl overflow-hidden aspect-4/5">
        <NuxtImg
          :src="product.image_url"
          :alt="product.name"
          width="800"
          height="1000"
          format="webp"
          fetchpriority="high"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Product Details -->
      <div class="space-y-6">
        <div>
          <span class="text-xs uppercase tracking-widest text-amber-800 font-medium">
            {{ product.category }}
          </span>
          <h1 class="text-3xl sm:text-4xl font-serif text-stone-900 mt-1">
            {{ product.name }}
          </h1>
          <div class="flex items-center gap-4 mt-3">
            <span class="text-2xl font-semibold text-stone-900">
              ${{ Number(product.price).toFixed(2) }}
            </span>
            <span class="text-xs text-stone-500 border-l border-stone-300 pl-4">
              ★ {{ product.rating }} ({{ product.review_count }} verified reviews)
            </span>
          </div>
        </div>

        <p class="text-stone-600 leading-relaxed text-sm sm:text-base">
          {{ product.description }}
        </p>

        <!-- Specifications Box -->
        <div class="bg-stone-100 p-4 rounded-lg space-y-2 text-xs text-stone-700 border border-stone-200">
          <div class="flex justify-between">
            <span class="text-stone-500">Material:</span>
            <span class="font-medium">{{ product.material }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-stone-500">Availability:</span>
            <span class="font-medium text-emerald-700">
              {{ product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock' }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-stone-500">Warranty:</span>
            <span class="font-medium">2-Year Atelier Care Guarantee</span>
          </div>
        </div>

        <!-- Quantity & Add to Cart -->
        <div class="pt-4 flex flex-col sm:flex-row gap-4">
          <div class="flex items-center border border-stone-300 rounded-md px-3 py-2 w-32 justify-between">
            <button
              @click="quantity = Math.max(1, quantity - 1)"
              class="text-stone-600 hover:text-stone-900 px-2"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span class="text-sm font-medium">{{ quantity }}</span>
            <button
              @click="quantity = Math.min(product.stock, quantity + 1)"
              class="text-stone-600 hover:text-stone-900 px-2"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            @click="addToCart(product, quantity)"
            class="flex-1 bg-stone-900 text-white py-3.5 px-8 rounded-md text-xs uppercase tracking-widest font-medium hover:bg-amber-900 transition"
          >
            Add to Bag — ${{ (Number(product.price) * quantity).toFixed(2) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>