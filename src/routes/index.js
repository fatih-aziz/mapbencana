/* eslint-disable indent */
// middleware helper
// eslint-disable-next-line no-undef
const mainControl = require(appRoot + '/controllers/index')

// handle views
module.exports = (app) => {
	app.group('/', (router) => {
		router.get('/', (req, res) => {
			res.render('index')
		})
	})

	app.group('/api/v1', (router) => {
		router.group('/user', router => {
			router.post('/', (req, res) => {
				console.log(req.body)
				res.status(200).send(`your data: ${req.body}`)
			})
			router.get('/', (req, res) => {
				res.send('GET USER')
				// res.render("index");
			})
		})
		router.group('/map', router => {
			router.get('/bmkg', mainControl.bmkg.get)
			router.get('/bmkg/sync', mainControl.bmkg.sync)
			router.get('/lapor', mainControl.lapor.index)
			router.post('/lapor', mainControl.lapor.post)
			router.get('/init', (req, res) => {
				res.setHeader('content-type', 'application/javascript')
				// eslint-disable-next-line no-undef
				rp.get(
						`https://maps.googleapis.com/maps/api/js?key=${
						process.env.GOOGLE_API_KEY
					}&libraries=visualization&callback=initMap`
					)
					.pipe(res)
			})

			router.get('/multisource', mainControl.multiSource.get)
		})
	})
}