<template>
  <section class="section">
    <div class="container">
      <section>
        <b-field label="Find a subreddit">
          <b-autocomplete
            :data="data"
            placeholder="e.g. Videos"
            field="title"
            :loading="isFetching"
            @typing="getAsyncData"
            clearable
            @select="option => (selected = option)"
            v-on:select="klarpa"
            max-height="400px"
          >
            <template slot-scope="props">
              <div class="media">
                <div class="media-left">
                  <img width="32" :src="`https://image.tmdb.org/t/p/w500/${props.option.poster_path}`" />
                </div>
                <div class="media-content">
                  {{ props.option.title }}
                  <br />
                  <small>
                    Released at {{ props.option.release_date }}, rated <b>{{ props.option.vote_average }}</b>
                  </small>
                </div>
              </div>
            </template>
          </b-autocomplete>
        </b-field>
      </section>

      <section>
        <transition name="fade">
          <div v-if="selected != null">
            <button
              tag="router-link"
              :to="{ name: 'subreddit', params: { name: 'holdmyfeedingtube' } }"
              class="button use-button is-fullwidth is-medium is-fullwidth"
            >
              <p class="animate__animated animate__fadeInLeft animate__infinite infinite">
                <i class="fa fa-angle-double-right" aria-hidden="true"></i>
              </p>
              Use '{{ selected.title }} '
            </button>
            <br />
            <div v-if="loadingSubredditInfo">
              <b-skeleton width="30%" :animated="true"></b-skeleton>
              <b-skeleton width="50%" :animated="true"></b-skeleton>
              <b-skeleton width="50%" :animated="true"></b-skeleton>
              <b-skeleton width="50%" :animated="true"></b-skeleton>
              <b-skeleton width="50%" :animated="true"></b-skeleton>
            </div>
            <div v-else>
              :D
            </div>
          </div>
        </transition>
      </section>
    </div>
  </section>
</template>

<script>
import debounce from 'lodash/debounce'

export default {
  name: 'Search',
  data: () => {
    return {
      data: [],
      selected: null,
      isFetching: false,
      isHovering: false,
      loadingSubredditInfo: true
    }
  },
  mounted() {},
  methods: {
    async klarpa() {
      this.loadingSubredditInfo = true
      //
      //       const r = require('./reddit')
      //       await r
      //         .getHot()
      //         .map(post => post.title)
      //         .then(console.log)

      setTimeout(() => {
        this.loadingSubredditInfo = false
      }, 1000)
    },
    getAsyncData: debounce(function(name) {
      if (!name.length) {
        this.data = []
        return
      }
      this.isFetching = true
      this.$http
        .get(`https://api.themoviedb.org/3/search/movie?api_key=bb6f51bef07465653c3e553d6ab161a8&query=${name}`)
        .then(({ data }) => {
          this.data = []
          data.results.forEach(item => this.data.push(item))
        })
        .catch(error => {
          this.data = []
          throw error
        })
        .then(() => {
          this.isFetching = false
        })
    }, 500)
  }
}
</script>

<style>
.use-button {
  margin-top: 20px;
}
</style>
