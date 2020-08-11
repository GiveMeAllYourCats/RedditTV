import Vue from 'vue'
const axios = require('axios')
const async = require('async')

class Reddit {
	constructor() {
		this.shuffle = require('fisher-yates')
		this.root = 'https://www.reddit.com/'
	}

	error(message) {
		message = message.toString()
		Vue.prototype.$buefy.snackbar.open({
			message: message,
			type: 'is-danger',
			position: 'is-top',
			actionText: 'OK',
			duration: 4000
		})
		throw message
	}

	async request(type, url) {
		let response
		Vue.prototype.$Progress.start()
		try {
			response = await axios[type](url)
		} catch (err) {
			this.error(err)
		}
		Vue.prototype.$Progress.finish()

		if (response.status != 200) {
			this.error(`${type} request to reddit returned a HTTP status code ${response.status}`)
		}
		return response
	}

	async get(path) {
		let response
		response = await this.request('get', `${this.root}/${path}`)

		return response.data
	}

	processItem(data) {
		console.log('PROC', data.title, { data })
		return data
	}

	async seek(subreddit, last) {
		this.seekObj = {}
		this.seekObj.shuffle = this.shuffle
		this.seekObj.last = last
		this.seekObj.items = []
		this.seekObj.next = async () => {
			this.seekObj.items.push(...(await this.getSubredditContent(subreddit, 5, true, this.seekObj.last)))
			this.seekObj.last = this.seekObj.items[this.seekObj.items.length - 1].name
		}

		if (!last) {
			this.seekObj.items = await this.getSubredditContent(subreddit, 5, true)
			this.seekObj.last = this.seekObj.items[this.seekObj.items.length - 1].name
		} else {
			await this.seekObj.next()
		}

		return this.seekObj
	}

	async getSubredditContent(subreddit, amount = 1, doShuffle = false, after) {
		const loader = Vue.prototype.$loading.show()
		let content = await new Promise(async (resolve, reject) => {
			let count = 0
			const returnVal = []
			await async.forever(async next => {
				count++
				let url = `r/${subreddit}/top.json?count=1&t=all&limit=100`
				if (after) {
					url = `${url}&after=${after}`
				}
				const res = await this.get(url)
				const items = res.data.children.map(item => {
					return this.processItem(item.data)
				})
				if (items.length >= 1) {
					after = items[items.length - 1].name
					returnVal.push(...items)
				}
				if (count === amount) {
					return resolve(returnVal)
				} else {
					setTimeout(next, 200)
				}
			}, this.error)
		})
		loader.hide()

		if (doShuffle) {
			content = this.shuffle(content)
		}

		return content
	}

	async search(query) {
		const res = await this.get(`subreddits/search.json?q=${query}+nsfw:1&limit=60`)
		return res.data.children.map(item => {
			// This shows a black reddit logo if no icon img was found for a subreddit
			if (item.data.icon_img == '' || item.data.icon_img == null) {
				item.data.icon_img = '/static/logoblack.png'
			}
			return item.data
		})
	}
}

const reddit = new Reddit()

export default { reddit }
