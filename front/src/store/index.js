import { createStore } from 'vuex';
import axiosClient from '../axios';

const store = createStore({
  state: {
    user: {
      data:null,
      token: sessionStorage.getItem('TOKEN') || '',
      role:'',
    },
    questions: [],
    currentQuestion: null,
    answers: {},
    tags: []
  },

  getters: {
    isAuthenticated: (state) => !!state.user.token,
    currentUser: (state) => state.user.data,
    isSupervisor: (state) => state.user.role ==='superviseur',
    questions: (state) => state.questions,
    currentQuestion: (state) => state.currentQuestion,
    answers:( state )=> questionId => state.answers[questionId] || [],
    tags: (state) => state.tags,
  },
  actions: {
    async register({ commit }, user) {
      try {
        const { data } = await axiosClient.post('/register', user);
        commit('setUser', data);
        return data;
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      }
    },
    async login({ commit }, credentials) {
      try {
        const { data } = await axiosClient.post('/login', credentials);
        console.log('User data:', data.user); // Journal de débogage
        console.log('Token:', data.access_token);
        commit('setUser', { user: data.user, token: data.access_token, role: data.user.role });
        return data;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },

    logout({ commit }) {
      commit('logout');
      sessionStorage.removeItem('TOKEN');
    },
    async fetchCurrentUser({ commit }) {
      const token = sessionStorage.getItem('TOKEN');
      if (token) {
        try {
          commit('setFetchingUser', true);
          axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const { data } = await axiosClient.get('/user');
          console.log('Fetched user:', data);
          commit('setUser', { user: data, token: token, role: data.role });
        } catch (error) {
          console.error('Error fetching user:', error);
          throw error;
        } finally {
          commit('setFetchingUser', false);
        }
      } else {
        console.log('No token found');
      }
    },
     // Questions
     async fetchQuestions({ commit }) {
      try {
        const { data } = await axiosClient.get('/questions');
        commit('setQuestions', data);
      } catch (error) {
        console.error('Error fetching questions:', error);
        throw error;
      }
    },
    async addQuestion({ commit }, question) {
      try {
        const { data } = await axiosClient.post('/questions', question);
        commit('addQuestion', data);
        return data;
      } catch (error) {
        console.error('Error adding question:', error);
        throw error;
      }
    },

    // Answers
    fetchAnswers({ commit }, questionId) {
      return axiosClient.get(`/questions/${questionId}/answers`)
        .then(({ data }) => {
          commit('setAnswers', { questionId, answers: data });
          return data;
        });
    },
    async fetchQuestionDetail({ commit }, id) {
      try {
        const { data } = await axiosClient.get(`/questions/${id}`);
        commit('setQuestionDetail', data);
        return data;
      } catch (error) {
        console.error('Error fetching question detail:', error);
        throw error;
      }
    },
    async approveAnswer({ commit }, answerId) {
      console.log('Approving answer with ID:', answerId);
      try {
        const response = await axiosClient.put(`/answers/${answerId}/approve`);
        console.log('Approved answer:', response.data);
        commit('approveAnswer', response.data);
        return response.data;
      } catch (error) {
        console.error('Error approving answer:', error);
        throw error;
      }
    },
    async addAnswer({ commit }, { questionId, content }) {
      try {
        const { data } = await axiosClient.post(`/questions/${questionId}/answers`, { content });
        commit('addAnswer', { questionId, answer: data });
      } catch (error) {
        console.error('Error adding answer:', error);
        throw error;
      }
    },
    // Tags
    async fetchTags({ commit }) {
      try {
        const { data } = await axiosClient.get('/tags');
        commit('setTags', data);
      } catch (error) {
        console.error('Error fetching tags:', error);
        throw error;
      }
    },
    createTag({ commit }, tagName) {
      return axiosClient.post('/tags', { name: tagName })
        .then(({ data }) => {
          commit('addTag', data);
          return data;
        })
        .catch(error => {
          console.error('Error creating tag:', error);
          throw error;
        });
    },
    updateTag({ commit }, tag) {
      return axiosClient.put(`/tags/${tag.id}`, { name: tag.name })
        .then(({ data }) => {
          commit('updateTag', data);
          return data;
        })
        .catch(error => {
          console.error('Error updating tag:', error);
          throw error;
        });
    },
    deleteTag({ commit }, tagId) {
      return axiosClient.delete(`/tags/${tagId}`)
        .then(() => {
          commit('removeTag', tagId);
        })
        .catch(error => {
          console.error('Error deleting tag:', error);
          throw error;
        });
    }
  },
  
  mutations: {

    setFetchingUser(state, isFetching) {
      state.isFetchingUser = isFetching;
    },

    setUser(state, { user, token, role }) {
      console.log('Committing user:', user);
      state.user.data = user;
      state.user.token = token;
      state.user.role = role;
      sessionStorage.setItem('TOKEN', token);
    },
    setToken(state, token) {
      state.user.token = token;
      sessionStorage.setItem('TOKEN', token);
    },

    logout(state) {
      state.user.data = null;
      state.user.token = '';
    },
    addTag(state, tag) {
      state.tags.push(tag);
    },
    updateTag(state, updatedTag) {
      const index = state.tags.findIndex(tag => tag.id === updatedTag.id);
      if (index !== -1) {
        state.tags.splice(index, 1, updatedTag);
      }
    },
    removeTag(state, tagId) {
      state.tags = state.tags.filter(tag => tag.id !== tagId);
    },
    setTags(state, tags) {
      state.tags = tags;
    },
  
      setQuestions(state, questions) {
        state.questions = questions;
      },

      addQuestion(state, question) {
        state.questions.push(question);
      },

      setQuestionDetail(state, question) {
        const index = state.questions.findIndex(q => q.id === question.id);
        if (index !== -1) {
          state.questions.splice(index, 1, question);
        } else {
          state.questions.push(question);
        }
      },
      approveAnswer(state, { answer }) {
        // Mettre à jour l'état de la réponse approuvée dans le store
        if (!state.questions) return;
        const question = state.questions.find(question => 
          question.answers.some(ans => ans.id === answer.id));
        if (question) {
          const ans = question.answers.find(ans => ans.id === answer.id);
          if (ans) {
            ans.status = answer.status;
          }
        }
      },

      addAnswer(state, { questionId, answer }) 
      {
        const question = state.questions.find(q => q.id === questionId);
        if (question) {
          question.answers.push(answer);
        }
      },
    },

  modules: {},
});

export default store;
