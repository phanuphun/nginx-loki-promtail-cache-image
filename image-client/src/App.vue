<script setup lang="ts">
import { onMounted, ref } from 'vue'
interface ResponseApi {
  name:string
  url:string
}

const vedingCode = import.meta.env.VITE_VENDING_CODE
const api = import.meta.env.VITE_API
const imageData = ref<ResponseApi[]>([])

const handleFetch = async () => {
  try {
    const response = await fetch(api)
    const data: ResponseApi[] = await response.json()
    imageData.value = data
    console.log(data)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

onMounted(async () => {
  await handleFetch()
})
</script>

<template>
  <h1>Vending Code : {{ vedingCode }}</h1>
  <p>
    API Endpoint: {{ api }}
  </p>
  <div v-if="imageData.length > 0">
    <div v-for="image in imageData" :key="image.name">
      <h2>{{ image.name }}</h2>
      <p>{{ image.url }}</p>
      <img :src="image.url" :alt="image.name" style="max-width: 400px;"/>
    </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<style scoped></style>
