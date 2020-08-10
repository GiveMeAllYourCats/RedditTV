import Vue from 'vue'
const axios = require('axios')
const debug = require('debug')('reddittv:yeet')

class Reddit {
	constructor() {
		// klarkahond
		this.root = 'https://www.reddit.com/'
	}

	async get(path) {
		const response = await axios.get(`${this.root}/${path}`)
		if (response.status != 200) {
			Vue.prototype.$buefy.snackbar.open({
				message: `Reddit returned a HTTP status code ${response.status}`,
				type: 'is-danger',
				position: 'is-top',
				actionText: 'OK',
				duration: 4000
			})
		}

		return response.data
	}

	async search(query) {
		// https://www.reddit.com/subreddits/search.json?q=fun+nsfw:1
		const klarp = await this.get(`subreddits/search.json?q=${query}+nsfw:1`)
		debug(klarp)
	}
}

const reddit = new Reddit()

;(async () => {
	debug('HI REDDIt')
	const res = await reddit.search('fun')
	debug(res)
})()

export default { reddit }
