import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

// ELECTRON SETTINGS
import settings from 'electron-settings'

// GLOBAL VARS
Vue.prototype.$global = {}
Vue.prototype.$settings = settings
Vue.prototype.$_ = require('lodash')

// BULMA
import 'bulma/css/bulma.css'

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
Vue.http = Vue.prototype.$http = axios

// SNOOWRAP
import reddit from './modules/reddit'
Vue.prototype.$reddit = reddit.reddit

// TOASTED
import Toasted from 'vue-toasted'
Vue.use(Toasted)

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

/* eslint-disable no-new */
new Vue({
	components: { App },
	router,
	store,
	template: '<App/>'
}).$mount('#app')
