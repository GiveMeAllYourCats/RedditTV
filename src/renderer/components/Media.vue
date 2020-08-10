<template>
  <section class="section">
    <div class="container-fluid">
      <div class="columns is-vcentered">
        <div class="column has-text-right">
          <i class="fa fa-4x fa-angle-left" aria-hidden="true"></i>
        </div>
        <div class="column is-three-quarters">
          <h1 class="title">{{ title }}</h1>
          <h2 class="subtitle">{{ subtitle }}</h2>
          <div v-if="type == 'youtube'">
            <webview id="youtube" :src="url"></webview>
          </div>
          <div v-if="type == 'mp4'" class="player-container">
            <vue-core-video-player :src="url"></vue-core-video-player>
          </div>
        </div>
        <div class="column has-text-left">
          <i class="fa fa-4x fa-angle-right" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
const isYoutube = link => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/
  const match = link.match(regExp)
  if (match && match[2].length == 11) {
    return match[2]
  }
  return false
}

const isMp4 = link => {
  const regExp = /https?.*?\.mp4/
  const match = link.match(regExp)
  if (match) {
    return true
  }
  return false
}

export default {
  name: 'Media',
  data: () => {
    return {
      type: '',
      url: '',
      title: 'MY MOM CUT HER BALLS OFF WITH A RUSTY SCISSOR',
      subtitle: 'Video from reddit.com'
    }
  },
  mounted() {
    this.play('https://www.youtube.com/embed/M7lc1UVf-VE')
    // this.play('https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4')
  },
  computed: {},
  methods: {
    play(link) {
      // youtube check
      const youtube = isYoutube(link)
      if (youtube) {
        this.type = 'youtube'
        this.url = `https://www.youtube.com/embed/${youtube}?autoplay=1`
      }

      // mp4 check
      if (isMp4(link)) {
        this.type = 'mp4'
        this.url = link
      }
    }
  }
}
</script>

<style></style>
