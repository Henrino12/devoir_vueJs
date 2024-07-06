
<template>
  <router-view></router-view>
</template>
<script >
import { mapActions } from 'vuex';

export default {
  name: 'App',
  created() {
    console.log('App component created'); 
    this.fetchCurrentUser();
  },
  methods: {
    ...mapActions(['fetchCurrentUser']),
  },
};
</script>


