<template>
    <div class="min-h-full">
        <header class="bg-white shadow">
          <div class="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold tracking-tight text-gray-900">{{ title }}</h1>
          </div>
        </header>
        <main>
          <div class="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <slot> </slot>
          </div>
        </main>
      </div>
</template>
<script setup >
    
const props = defineProps({
    title: String,
}) 
   
    

</script>
<style>

</style>