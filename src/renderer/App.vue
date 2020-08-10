<template>
	<div id="app">
		<b-navbar>
			<template slot="brand">
				<b-navbar-item tag="router-link" :to="{ path: '/' }"> <img src="/static/logobig.png" /> <b>TV</b> </b-navbar-item>
			</template>
			<template slot="start">
				<b-navbar-item>
					<b-navbar-item tag="router-link" :to="{ name: 'search' }">Search</b-navbar-item>
				</b-navbar-item>
				<b-navbar-item>
					<b-navbar-item tag="router-link" :to="{ name: 'media' }">Watch</b-navbar-item>
				</b-navbar-item>
				<b-navbar-dropdown label="Saved">
					<b-navbar-item tag="router-link" :to="{ name: 'subreddit', params: { name: 'holdmyfeedingtube' } }">/r/holdmyfeedingtube</b-navbar-item>
				</b-navbar-dropdown>
				<b-navbar-dropdown label="Recent"> </b-navbar-dropdown>
			</template>
		</b-navbar>
		<transition name="fade" mode="out-in" appear>
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'reddittv',
	mounted() {},
	methods: {}
}
</script>

<style>
/* CSS */
</style>
