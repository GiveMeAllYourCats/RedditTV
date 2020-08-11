<template>
  <section class="section">
    <div class="container">
      <h1 class="title">{{ this.$route.params.name }}</h1>
      <h2 v-if="items.length == 0" class="subtitle">Loading items...</h2>
      <div v-if="items.length >= 1">
        <div class="columns">
          <div class="column">
            <button @click="play" class="button is-primary">
              <p class="animate__animated animate__fadeInLeft animate__infinite infinite">
                <i class="fa fa-angle-double-right" aria-hidden="true"></i>
              </p>
              Play {{ items.length }} media items
            </button>
            <button @click="seekNext" class="button is-info">Generate More</button>
          </div>
          <div class="column has-text-right">Total items: {{ items.length }}</div>
        </div>
      </div>

      <b-table :data="items" :columns="columns"> </b-table>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Subreddit',
  data: () => {
    return {
      last: '',
      items: [],
      columns: [
        {
          field: 'title',
          label: 'title'
        }
      ]
    }
  },
  mounted() {
    this.start()
  },
  methods: {
    play() {
      this.$router.push({ name: 'media', params: { items: this.items, last: this.last } })
    },
    async seekNext() {
      const seek = await this.$reddit.seek(this.$route.params.name, this.last)
      this.items = seek.shuffle(seek.items)
      this.last = seek.last
    },
    async start() {
      const seek = await this.$reddit.seek(this.$route.params.name)
      this.items = seek.items
      this.last = seek.last
    }
  }
}
</script>

<style></style>
