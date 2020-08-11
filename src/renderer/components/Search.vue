<template>
  <section class="section">
    <div class="container">
      <section>
        <b-field label="Find a subreddit">
          <b-autocomplete
            :data="data"
            placeholder="e.g. Videos"
            field="url"
            :loading="isFetching"
            @typing="getAsyncData"
            clearable
            open-on-focus
            @select="option => (selected = option)"
            max-height="400px"
          >
            <template slot-scope="props">
              <div class="media">
                <div class="media-left">
                  <img width="32" :src="props.option.icon_img" />
                </div>
                <div class="media-content">
                  <b>{{ props.option.url }}</b> - {{ props.option.title }}
                  <br />
                  <small>
                    Created at <b>{{ props.option.created | moment('MM-DD-YYYY') }}</b>
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
            <router-link :to="{ name: 'subreddit', params: { name: selected.display_name } }">
              <button class="animate__animated animate__bounceIn  button use-button is-success is-fullwidth is-medium is-fullwidth">
                <p class="animate__animated animate__fadeInLeft animate__infinite infinite">
                  <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                </p>
                Generate Playlist for <b>{{ selected.url }}</b>
              </button>
            </router-link>
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
    getAsyncData: debounce(async function(name) {
      this.isFetching = true
      this.data = await this.$reddit.search(name)
      this.isFetching = false
    }, 500)
  }
}
</script>

<style>
.use-button {
  margin-top: 25px;
}
</style>
