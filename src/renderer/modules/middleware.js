import settings from 'electron-settings'

export default async (to, from) => {
	return new Promise(async (resolve, reject) => {
		// If first time starting app, redirect to settings
		// if (!(await settings.get('firstStart')) && to.path !== '/settings') {
		// 	return resolve({ path: '/settings' })
		// }

		return resolve()
	})
}
