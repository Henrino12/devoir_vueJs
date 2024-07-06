import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Dashboard from '../views/Dashboard.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import AuthLayout from '../components/AuthLayout.vue';
import DefaultLayout from '../components/DefaultLayout.vue';
import HomeLayout from '../components/HomeLayout.vue';
import QuestionCreate from '../components/QuestionCreate.vue';
import QuestionDetails from '../components/QuestionDetails.vue';
import TagCreate from '../components/TagCreate.vue';
import Theme from '../views/Theme.vue';
import store from '../store';

  const routes =[
          {
            path: '/',
            redirect: '/dashboard',
            component: DefaultLayout,
            meta: { requiresAuth: true },
            children: [
              {path:'dashboard', name:'dashboard', component: Dashboard},
              {path:'theme', name:'theme', component: Theme},
              { path: 'tagcreate', name: 'tag-create', component: TagCreate },
             
           
            ]
          },

          {
            path: '/auth',
            redirect: '/login',
            name: 'Auth',
            component: AuthLayout,
            meta: {isGuest: true},
            children: [
              {
                path: '/login',
                name: 'login',
                component: Login,
              },
              {
                path: '/register',
                name: 'register',
                component: Register,
              },
            ],
          },

          {
            path:'/home', 
            redirect:'/home',
            name:'home', 
            component: HomeLayout,
            children:[
              {path:'/home', name: 'home', component:Home},

              
            ],
        },
        {path:'/questioncreate', name: 'questioncreate', component:QuestionCreate},
        { path: '/question/:id', name: 'questionDetail', component: QuestionDetails, props: true },
  ];

  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters.isAuthenticated;
    console.log('Navigation to:', to.name);
    console.log('Is authenticated:', isAuthenticated);
    
    if (to.meta.requiresAuth && !isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      next({ name: 'home' });
    } else if (isAuthenticated && to.meta.isGuest) {
      console.log('Already authenticated, redirecting to dashboard');
      next({ name: 'dashboard' });
    } else {
      next();
    }
  });
  


export default router
