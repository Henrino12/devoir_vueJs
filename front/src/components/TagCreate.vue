<template>
    <div class="container p-4 mx-auto">
      <h1 class="mb-4 text-2xl font-bold">Create a New Tag</h1>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label class="block text-gray-700">Tag Name</label>
          <input v-model="tagName" type="text" class="w-full p-2 mt-1 border rounded-md" required />
        </div>
        <button type="submit" class="px-4 py-2 text-white bg-blue-500 rounded-md">Create Tag</button>
      </form>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  
  export default {
    data() {
      return {
        tagName: '',
      };
    },
    methods: {
      ...mapActions(['createTag']),
      async submitForm() {
        try {
          await this.createTag(this.tagName);
          this.$router.push({ name: 'theme' });
        } catch (error) {
          console.error('Error creating tag:', error);
        }
      },
    },
  };
  </script>
  