import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

// VUE MARKDOWN
import VueMarkdown from 'vue-markdown'

// ELECTRON SETTINGS
import settings from 'electron-settings'

// PROGRESS BAR
import VueProgressBar from 'vue-progressbar'
const options = {
	color: 'rgb(143, 255, 199)',
	failedColor: 'red',
	thickness: '3px',
	transition: {
		speed: '0.2s',
		opacity: '0.6s',
		termination: 1
	},
	autoRevert: false,
	autoFinish: false,
	location: 'top',
	inverse: false
}
Vue.use(VueProgressBar, options)

// GLOBAL VARS
Vue.prototype.$global = {}
Vue.prototype.$settings = settings
Vue.prototype.$_ = require('lodash')
Vue.prototype.$mime = require('mime-types')
Vue.prototype.$shuffle = require('fisher-yates')

// BULMA
import 'bulma/css/bulma.css'

// LOADING COMPONENT
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
Vue.use(Loading)

// BUEFY
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
Vue.use(Buefy, { defaultIconPack: 'fas' })

// FONTAWESOME
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// MOMENT
Vue.use(require('vue-moment'))

// CUSTOM TITLEBAR
const customTitlebar = require('custom-electron-titlebar')
new customTitlebar.Titlebar({
	backgroundColor: customTitlebar.Color.fromHex('#444')
})

// AXIOS
const instance = axios.create()
instance.interceptors.request.use(config => {
	Vue.prototype.$Progress.start() // for every request start the progress
	return config
})
instance.interceptors.response.use(response => {
	Vue.prototype.$Progress.finish() // finish when a response is received
	return response
})
Vue.http = Vue.prototype.$http = instance

// REDDIT PLUGIN
import reddit from './modules/reddit'
Vue.prototype.$reddit = reddit.reddit

// TOASTED
import Toasted from 'vue-toasted'
Vue.use(Toasted, {
	action: {
		icon: 'times-circle',
		onClick: (e, toastObject) => {
			toastObject.goAway(0)
		}
	},
	keepOnHover: true,
	duration: 3000,
	iconPack: 'fontawesome'
})

// CORE-VIDEO
import VueCoreVideoPlayer from 'vue-core-video-player'
Vue.use(VueCoreVideoPlayer)

// VUE-YOUTUBE
import VueYoutube from 'vue-youtube'
Vue.use(VueYoutube)

// MIDDLEWARE
import middleware from './modules/middleware'
router.beforeEach(async (to, from, next) => {
	const action = await middleware(to, from)
	if (action) {
		return next(action)
	}
	next()
})
router.beforeEach((to, from, next) => {
	Vue.prototype.$Progress.start()
	next()
})
router.afterEach((to, from) => {
	Vue.prototype.$Progress.finish()
})

/* eslint-disable no-new */
new Vue({
	components: { App, VueMarkdown },
	router,
	store,
	template: '<App/>'
}).$mount('#app')
