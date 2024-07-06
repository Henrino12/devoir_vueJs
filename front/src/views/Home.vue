<template>
  <div class="min-h-full">
    <header class="bg-white shadow">
      <div class="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Bienvenue sur la page du forum</h1>
      </div>
    </header>
    <main>
      <div class="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="container p-4 mx-auto">
          <div class="flex justify-end mb-4">
            <button @click="goToCreateQuestion" class="px-4 py-2 text-white bg-green-500 rounded-md">Poser une question</button>
          </div>
          <div class="grid grid-cols-1 gap-4">
            <div
              v-for="question in questions"
              :key="question.id"
              class="flex items-start p-4 bg-white rounded-lg shadow-md"
            >
              <div class="mr-4 text-center">
                <div class="text-xl font-semibold">{{ question.answers_count }}</div>
                <div class="text-gray-600">Réponses</div>
              </div>
              <div class="flex-grow">
                <router-link :to="{ name: 'questionDetail', params: { id: question.id } }" class="text-xl font-semibold text-blue-500 hover:underline">
                  {{ question.title }}
                </router-link>
                <p class="text-gray-700">{{ question.content }}</p>
                <div class="mt-2 text-sm text-gray-500">
                  Posté par {{ question.user.name }} il y a {{ timeSince(question.created_at) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import Swal from 'sweetalert2';

export default {
  computed: {
    ...mapGetters(['questions', 'isAuthenticated']),
  },
  methods: {
    ...mapActions(['fetchQuestions']),
    timeSince(date) {
      const seconds = Math.floor((new Date() - new Date(date)) / 1000);
      let interval = seconds / 31536000;

      if (interval > 1) {
        return Math.floor(interval) + " ans";
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        return Math.floor(interval) + " mois";
      }
      interval = seconds / 86400;
      if (interval > 1) {
        return Math.floor(interval) + " jours";
      }
      interval = seconds / 3600;
      if (interval > 1) {
        return Math.floor(interval) + " heures";
      }
      interval = seconds / 60;
      if (interval > 1) {
        return Math.floor(interval) + " minutes";
      }
      return Math.floor(seconds) + " secondes";
    },
    goToCreateQuestion() {
      if (!this.isAuthenticated) {
        Swal.fire({
          icon: 'warning',
          title: 'Non Authentifié',
          text: 'Veuillez vous connecter pour poser une question.',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            this.$router.push({ name: 'login' });
          }
        });
        return;
      }
      this.$router.push({ name: 'QuestionCreate' });
    },
  },
  mounted() {
    this.fetchQuestions();
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>