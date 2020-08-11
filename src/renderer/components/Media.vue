<template>
  <section class="section">
    <div v-if="currentItem != undefined" class="container-fluid">
      <div class="columns is-vcentered">
        <div @click="prevMedia" class="column has-text-right">
          <i class="fa fa-4x fa-angle-left" aria-hidden="true"></i>
        </div>
        <div class="column is-three-quarters">
          <h1 class="title">{{ currentItem.title }}</h1>
          <h2 class="subtitle">
            Posted by <b>/u/{{ currentItem.author }}</b> in <b>/r/{{ currentItem.subreddit }}</b>
            <hr />
            <small>
              url: {{ currentItem.url }}<br />
              mediaType: {{ currentItem.mediaType }}<br />
              mimeType: {{ currentItem.mimeType }}<br />
            </small>
          </h2>
          <div v-if="currentItem.mediaType == 'youtubeVideo'">
            <webview id="youtube" :src="currentItem.url"></webview>
          </div>
          <div v-if="currentItem.mediaType == 'webview'">
            <webview id="html" :src="currentItem.url"></webview>
          </div>
          <div v-if="currentItem.mediaType == 'redditVideo'" class="player-container">
            <vue-core-video-player :src="currentItem.media.reddit_video.fallback_url"></vue-core-video-player>
          </div>
          <div v-if="currentItem.mediaType == 'gifv'" class="">
            <video preload="auto" autoplay="autoplay" loop="loop" style="width: 200px; height: 200px;">
              <source :src="currentItem.url" type="video/gifv" />
            </video>
          </div>
          <div v-if="currentItem.mediaType == 'image'" class="">
            <figure class="image is-square">
              <img class="" :src="currentItem.url" />
            </figure>
          </div>
          <div v-if="currentItem.selfpost" class="">
            <vue-markdown><span v-html="currentItem.selftext"></span></vue-markdown>
          </div>
        </div>
        <div @click="nextMedia" class="column has-text-left">
          <i class="fa fa-4x fa-angle-right" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
const youtubeRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/
export default {
  name: 'Media',
  props: ['items', 'last'],
  data: () => {
    return {
      playlist: [],
      history: [],
      currentItem: undefined
    }
  },
  async mounted() {
    if (this.items) {
      await this.importPlaylist(this.items)
    }
    this.nextMedia()
  },
  computed: {},
  methods: {
    async importPlaylist(items) {
      this.items.map(item => {
        const obj = {
          title: item.title,
          url: item.url,
          selfpost: item.is_self,
          author: item.author,
          selftext: item.selftext,
          selftextHtml: item.selftext_html,
          upvoted: item.upvote_ratio * 100,
          upvotes: item.ups,
          score: item.score,
          mimeType: this.$mime.lookup(item.url),
          mediaType: this.getMediaType(item),
          media: item.media,
          created: item.created,
          subreddit: item.subreddit,
          domain: item.domain,
          data: item
        }

        if (obj.mediaType === 'youtubeVideo') {
          const match = obj.url.match(youtubeRegex)
          console.log(match[2])
          obj.url = `https://www.youtube.com/embed/${match[2]}?autoplay=1`
        }
        this.playlist.push(obj)
      })
    },
    getMediaType(item) {
      let mediaType
      if (!mediaType && !require('url').parse(item.url).hostname) {
        const re = /(?:\.([^.]+))?$/
        mediaType = re.exec(item.url)[1]
      }

      if (item.domain === 'v.redd.it') {
        mediaType = 'redditVideo'
      }

      if (item.url.match(youtubeRegex)) {
        mediaType = 'youtubeVideo'
      }

      if (!mediaType) {
        mediaType = 'webview'
        console.log('ERROR DOES NOT EXIST', item)
      }

      console.log(mediaType)

      return mediaType
    },
    checkPlaylistEmpty() {
      if (this.playlist.length === 0) {
        this.$toasted.info('The playlist is empty!', { icon: 'list' })
        return true
      }
      return false
    },
    nextMedia() {
      if (!this.checkPlaylistEmpty()) {
        this.currentItem = this.playlist[0]
        this.history.push(this.playlist.shift())
      }
    },
    prevMedia() {
      if (!this.checkPlaylistEmpty()) {
        this.currentItem = this.history[this.history.length - 1]
        this.playlist.push(this.history.pop())
      }
    }
  }
}
</script>

<style></style>
