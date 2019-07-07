// Gempa UI
var map

function initMap() {

	var markType = 'marker'

	map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: -3.0993011,
			lng: 111.3965968
		},
		zoom: 5,
		styles: [{
				featureType: 'poi',
				stylers: [{
					visibility: 'off'
				}] // Turn off POI.
			},
			{
				featureType: 'transit.station',
				stylers: [{
					visibility: 'off'
				}] // Turn off bus, train stations etc.
			}
		],
		disableDoubleClickZoom: true,
		streetViewControl: false,
	})

	$.get(apiUrl + '/api/v1/map/multisource')
		.done(data => {
			var bmkg = data.data.bmkg.map(function (data) {
				return {
					type: 'Feature',
					properties: data,
					geometry: {
						type: 'Point',
						coordinates: [parseFloat(data.coords[0]), parseFloat(data.coords[1])]
					}
				}
			})
			var mapData = {
				type: 'FeatureCollection',
				features: bmkg
			}
			console.log(mapData)
			var infowindow = new google.maps.InfoWindow()

			map.data.setStyle(function (feature) {
				return {
					icon: 'http://maps.google.com/mapfiles/ms/icons/red.png',
				}
			})
			map.data.addGeoJson(mapData)
			map.data.addListener('click', function (e) {
				var feat = e.feature

				// Properti data: 
				// feat.getProperty(key) // result String
				// available key: 
				// address: "196 km BaratDaya MALUKUTENGGARA"
				// createdDate: "2019-07-07T17:22:53+0700"
				// deep: "122 Km"
				// disasterDate: "06-Jul-19 02:59:15 WIB"
				// iduser: null
				// lat: "6.01 LS"
				// lng: "131 BT"
				// mag: "5.4 SR"
				// mmi: null
				// name: null
				// quiz: null
				var html = '<b>custom html, masukin sesuai data</b>'
				html += '<br><a class=\'map_link\' target=\'_blank\' href=\'#\'>bisa tambahin link berita kalo ada</a>'

				infowindow.setContent(html)
				infowindow.setPosition(e.latLng)
				infowindow.setOptions({
					pixelOffset: new google.maps.Size(0, -34)
				})
				infowindow.open(map)
			})
		}).fail(err => {
			console.log(err)
		})
}