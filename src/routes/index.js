// middleware helper
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

			router.get('/multisource', (req, res) => {
				res.setHeader('Content-Type', 'application/json')
				mainControl.survey = function () {
					return new Promise((response, reject) => {
						let source2 = [{
								idUser: null,
								nama: null,
								mag: 5.4,
								time: '02-Jul-19 03:39:50 WIB',
								reportTime: null,
								newslink: null,
								mmi: null,
								quiz: null,
								address: '101 km TimurLaut MALUKUBRTDAYA',
								coords: [128.49, -7]
							},
							{
								idUser: null,
								nama: null,
								mag: 5.4,
								time: '02-Jul-19 03:39:50 WIB',
								reportTime: null,
								newslink: null,
								mmi: null,
								quiz: null,
								address: '101 km TimurLaut MALUKUBRTDAYA',
								coords: [128.49, -7]
							}
						]
						response(source2)
					})
				}
				Promise.join(mainControl.bmkg(), mainControl.survey(), function (bmkg, survey) {
					// db = db.map(data => {
					//     return {
					//         idUser: data.iduser,
					//         nama: data.nama,
					//         mag: parseFloat(data.magnitudo),
					//         time: `${data.tanggalgempa} ${data.waktugempa}`,
					//         reportTime: data.waktupelaporan,
					//         newslink: null,
					//         mmi: data.mmi,
					//         quiz: data.kuesioner,
					//         address: data.alamat,
					//         coords: [
					//             parseFloat(`${data.bujurgempa}0000`),
					//             parseInt(`${data.lintanggempa}0000`)
					//         ]
					//     };
					// });
					bmkg = bmkg.map(data => {
						var cords = data.point.coordinates.split(',')
						return {
							idUser: null,
							nama: null,
							mag: parseFloat(data.Magnitude),
							time: `${data.Tanggal} ${data.Jam}`,
							reportTime: null,
							newslink: null,
							mmi: null,
							quiz: null,
							address: data.Wilayah,
							coords: [parseFloat(`${cords[0]}0000`), parseInt(`${cords[1]}0000`)]
						}
					})
					var data = {
						bmkg: bmkg,
						db: survey,
					}
					res.status(200).send({
						success: true,
						data: data
					})
				}).catch((TypeError, errFn) => {
					console.log(TypeError, errFn)
				})
			})
		})
	})
}