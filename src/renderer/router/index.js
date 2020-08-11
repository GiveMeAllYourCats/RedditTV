import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing',
      component: require('@/components/Landing').default
    },
    {
      path: '/subreddit/:name',
      name: 'subreddit',
      component: require('@/components/Subreddit').default
    },
    {
      path: '/settings',
      name: 'settings',
      component: require('@/components/Settings').default
    },
    {
      path: '/media',
      name: 'media',
      component: require('@/components/Media').default,
      props: true
    },
    {
      path: '/search',
      name: 'search',
      component: require('@/components/Search').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
