<template>
  <div class="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-md">
    <h2 class="mb-4 text-2xl font-semibold">Ajouter une Nouvelle Question</h2>
    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <label for="title" class="block text-gray-700">Titre</label>
        <input type="text" id="title" v-model="title" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm" required>
      </div>
      <div class="mb-4">
        <label for="tags" class="block text-gray-700">Tags</label>
        <select id="tags" v-model="selectedTags" multiple class="block w-full mt-1 border-gray-300 rounded-md shadow-sm" required>
          <option v-for="tag in tags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
        </select>
      </div>
      <div class="mb-4">
        <label for="content" class="block text-gray-700">Texte</label>
        <textarea id="content" v-model="content" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm" rows="6" required></textarea>
      </div>
      <div class="flex justify-end">
        <button type="submit" class="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
          Ajouter
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      title: '',
      selectedTags: [], // Liste des IDs de tags sélectionnés
      content: '' // Remplacer "text" par "content"
    };
  },
  computed: {
    ...mapGetters(['tags']) // Mapper les tags depuis Vuex
  },
  methods: {
    ...mapActions(['addQuestion', 'fetchTags']), // Mapper les actions Vuex
    async submitForm() {
      try {
        const question = {
          title: this.title,
          tags: this.selectedTags, // Utiliser les IDs de tags sélectionnés
          content: this.content // Utiliser "content" au lieu de "text"
        };
        console.log('Submitting question:', question);
        await this.addQuestion(question);
        this.$router.push('/dashboard'); // Rediriger après l'ajout vers la page d'accueil
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la question:', error);
      }
    }
  },
  mounted() {
    this.fetchTags(); // Charger les tags disponibles lorsque le composant est monté
  }
}
</script>

<style scoped>
/* Ajoutez des styles supplémentaires si nécessaire */
</style>
