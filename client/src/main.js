// import Vue from 'vue'

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import App from './App.vue'

// Component views

import troubleTicketList from './components/troubleTicketList.vue'
import troubleTicketNew from './components/troubleTicketNew.vue'
import troubleTicketEdit from './components/troubleTicketEdit.vue'

Vue.use(VueRouter)
Vue.use(VueResource)

var router = new VueRouter({
  routes: [
    {
    // LIST
    path: '/',
    component: troubleTicketList,
    children: [{
      // EDIT
      path: '/edit/:troubleTicketId',
      name: 'troubleTicketEdit',
      component: troubleTicketEdit
      },{
      // NEW
      path: '/new',
      name: 'troubleTicketNew',
      component: troubleTicketNew
      }]
    }]
})

new Vue({
  el: '#app',
  router: router,
  template: '<App/>',
  components: { App }
})
