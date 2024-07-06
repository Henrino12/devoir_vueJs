<template>
<PageComponent title="Dashboard">
  <div class="container p-4 mx-auto">
    <div class="flex justify-end mb-4">
      <button @click="goToCreateQuestion" class="px-4 py-2 text-white bg-green-500 rounded-md">Poser une question</button>
    </div>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <!-- Colonne principale des questions -->
      <div class="md:col-span-2">
        <div
          v-for="question in questions"
          :key="question.id"
          class="flex items-start p-4 mb-4 bg-white rounded-lg shadow-md"
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
      <!-- Colonne des informations supplémentaires -->
      <div class="flex flex-col space-y-4">
        <!-- Card pour le nombre total de questions -->
        <div class="p-4 bg-white border border-blue-500 rounded-lg shadow-md">
          <div class="text-xl font-semibold text-center text-blue-500">Total des Questions</div>
          <div class="mt-2 text-2xl font-bold text-center">{{ totalQuestions }}</div>
        </div>
        <!-- Card pour la liste des tags -->
        <div class="p-4 bg-white border border-blue-500 rounded-lg shadow-md">
          <div class="text-xl font-semibold text-center text-blue-500">Tags</div>
          <ul class="mt-2 space-y-2">
            <li v-for="tag in tags" :key="tag.id" class="text-gray-700">
              {{ tag.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
   </PageComponent>
  </template>
  
  
  <script setup>
  import PageComponent from "../components/PageComponent.vue"
  </script>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  import Swal from 'sweetalert2';
  
  export default {
    computed: {
      ...mapGetters(['questions', 'isAuthenticated', 'tags']),
      totalQuestions() {
        return this.questions.length;
      }
    },
    methods: {
      ...mapActions(['fetchQuestions', 'fetchTags']),
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
        this.$router.push({ name: 'questioncreate' });
      },
    },
    mounted() {
      this.fetchQuestions();
      this.fetchTags();
    }
  }
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
  }
  </style>
 
 <style scoped>
 .container {
   max-width: 800px;
 }
 </style>
  <style>
  
  </style>