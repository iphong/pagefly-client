
// eslint-disable-next-line no-undef
__webpack_public_path__ = 'http://localhost:8080/';


(async () => {
	const run = (await import('./run')).default

	console.log(run)
	run()
})()

