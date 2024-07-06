<template>
  <div class="container p-4 mx-auto">
    <div v-if="question" class="p-4 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold">{{ question.title }}</h2>
      <p class="text-gray-700">{{ question.content }}</p>
      <div class="mt-4">
        <h3 class="text-xl font-semibold">Réponses</h3>
        <div v-if="question.answers && question.answers.length > 0">
          <div v-for="answer in question.answers" :key="answer.id" class="p-4 mt-2 bg-gray-100 rounded-lg">
            <p class="text-gray-700">{{ answer.content }}</p>
            <div class="flex items-center justify-between mt-2">
              <div>
                <button @click="incrementLike(answer)" class="text-blue-500 hover:text-blue-700">👍 {{ answer.likes || 0 }}</button>
                <span v-if="answer.status === 'approved'" class="ml-2 text-green-500">✔ Validé</span>
              </div>
              <div class="text-sm text-gray-500" v-if="answer.user">
                <span>par {{ answer.user.name }} ({{ answer.user.role }})</span>
              </div>
              <div v-if="isSupervisor && answer.status !== 'approved'">
                <button @click="approveAnswerHandler(answer.id)" class="px-4 py-2 text-white bg-green-500 rounded-md">Valider la Réponse</button>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p class="text-gray-500">Pas de réponse</p>
        </div>
        <button @click="toggleReplyForm" class="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md">
          Répondre
        </button>
        <div v-if="showReplyForm" class="mt-4">
          <textarea v-model="newAnswer" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm" rows="4" placeholder="Votre réponse..."></textarea>
          <button @click="submitAnswer" class="px-4 py-2 mt-2 text-white bg-blue-500 rounded-md">Poster la Réponse</button>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500">
      Chargement...
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Swal from 'sweetalert2';

export default {
  props: ['id'],
  data() {
    return {
      question: null,
      showReplyForm: false,
      newAnswer: ''
    };
  },
  computed: {
    ...mapGetters(['isSupervisor', 'isAuthenticated']),
  },
  methods: {
    ...mapActions(['fetchQuestionDetail', 'approveAnswer', 'addAnswer']),
    async fetchQuestion() {
      try {
        this.question = await this.fetchQuestionDetail(this.id);
        this.question.answers.forEach(answer => {
          if (answer.likes === null || answer.likes === undefined) {
            answer.likes = 0;
          }
        });
      } catch (error) {
        console.error('Erreur lors de la récupération de la question:', error);
      }
    },
    incrementLike(answer) {
      if (answer.likes === null || answer.likes === undefined) {
        answer.likes = 0;
      }
      answer.likes += 1;
    },
    async approveAnswerHandler(answerId) {
      try {
        await this.approveAnswer(answerId);
        // Mettez à jour l'état local pour refléter l'approbation
        const answer = this.question.answers.find(ans => ans.id === answerId);
        if (answer) {
          answer.status = 'approved';
        }
      } catch (error) {
        console.error('Erreur lors de l\'approbation de la réponse:', error);
      }
    },
    toggleReplyForm() {
      if (!this.isAuthenticated) {
        Swal.fire({
          icon: 'warning',
          title: 'Non Authentifié',
          text: 'Veuillez vous connecter pour répondre.',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            this.$router.push({ name: 'login' });
          }
        });
        return;
      }
      this.showReplyForm = !this.showReplyForm;
    },
    async submitAnswer() {
      if (!this.isAuthenticated) {
        Swal.fire({
          icon: 'warning',
          title: 'Non Authentifié',
          text: 'Veuillez vous connecter pour répondre.',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            this.$router.push({ name: 'login' });
          }
        });
        return;
      }
      if (this.newAnswer.trim() === '') return;
      try {
        await this.addAnswer({ questionId: this.id, content: this.newAnswer });
        this.newAnswer = '';
        this.showReplyForm = false;
        this.fetchQuestion();
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la réponse:', error);
      }
    }
  },
  async mounted() {
    await this.fetchQuestion();
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
