/* eslint-disable indent */
// middleware helper
// eslint-disable-next-line no-undef
const mainControl = require(appRoot + '/controllers/index')
import * as bodyParser from 'body-parser'

// handle views
module.exports = (app) => {
	// import middleware
	app.engine('html', require('ejs').renderFile)
	app.set('view engine', 'html')
	app.set('views', appRoot + '/views')
	app.group('/', (router) => {
		router.use('/assets', express.static(appRoot + '/../public'))
		router.get('/', (req, res) => {
			res.render('index')
		})
		router.group('/admin', (router) => {
			router.get('/', mainControl.admin.index)
		})
	})


	app.group('/api/v1', (router) => {
		router.use(bodyParser.urlencoded({
			extended: true
		}))
		router.use(bodyParser.json())
		router.use(function (req, res, next) {
			res.setHeader('Content-Type', 'application/json')
			next()
		})
		router.group('/user', router => {
			router.get('/', mainControl.user.index)
			router.post('/', mainControl.user.post)
			router.post('/login', mainControl.user.login)
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