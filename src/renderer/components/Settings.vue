<template>
  <section class="section">
    <div class="container">
      settings
    </div>
  </section>
</template>

<script>
export default {
  name: 'Settings',
  data: () => {
    return {}
  },
  mounted() {
    this.start()
  },
  methods: {
    async start() {
      if (!(await this.$settings.get('firstStart'))) {
        this.$toasted.show('Looks like this is your first time here, Welcome!').goAway(2500)

        // console.log(this.$r.getSubmission('2np694').body)
      }
    }
  }
}
</script>

<style></style>
