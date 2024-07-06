<template>
  <div class="min-h-full">
    <header class="bg-white shadow">
      <div class="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Thèmes</h1>
      </div>
    </header>
    <main>
      <div class="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="container p-4 mx-auto">
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-2xl font-bold"></h1>
            <button
            
              @click="goToCreateTag"
              class="px-4 py-2 text-white bg-blue-500 rounded-md"
            >
              add
            </button>
          </div>
          <div class="overflow-hidden bg-white rounded-lg shadow">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Postes
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="tag in tags"
                  :key="tag.id"
                  class="hover:bg-gray-100"
                >
                  <td class="px-6 py-4 cursor-pointer whitespace-nowrap" @click="goToQuestions(tag.id)">
                    <div class="text-sm font-medium text-gray-900">{{ tag.name }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">{{ tag.questions_count }}</div>
                  </td>
                  <td class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    <button
                      
                      @click="editTag(tag.id)"
                      class="mr-2 text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                
                      @click="deleteTag(tag.id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
    </template>
    
    
    <script >
   import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters(['isSupervisor', 'tags']), // Mapper les tags depuis Vuex
  },
  methods: {
    ...mapActions(['fetchTags', 'deleteTag']), // Mapper les actions Vuex nécessaires
    goToQuestions(tagId) {
      this.$router.push({ name: 'questions', params: { tagId } });
    },
    goToCreateTag() {
      this.$router.push({ name: 'tag-create' }); // Rediriger vers la page de création de tag
    },
    editTag(tagId) {
      this.$router.push({ name: 'editTag', params: { tagId } });
    },
    async deleteTag(tagId) {
      if (confirm('Are you sure you want to delete this tag?')) {
        try {
          await this.deleteTag(tagId);
          this.fetchTags();
        } catch (error) {
          console.error('Error deleting tag:', error);
        }
      }
    }
  },
  mounted() {
    this.fetchTags();
  }
};
    </script>
    <style>
    
    </style>