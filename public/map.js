// Gempa UI
var map
$("#floating input").click(function (e) {
	// layering
	map.data.revertStyle()

	console.log($(this).attr('name'))
	console.log($(this).is(':checked'))

	if (!$(this).is(':checked')) {
		map.data.forEach(marker => {
			if (marker.getProperty('type') == $(this).attr('name'))
				map.data.overrideStyle(marker, {
					visible: false
				})
		})
	}
})

function initMap() {

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
			var bmkg = data.data.gempaBmkg.reduce(function (arr, el) {
				if (typeof el.coords == "object") {
					el.type = 'bmkg'
					var newEl = {
						type: 'Feature',
						properties: el,
						geometry: {
							type: 'Point',
							coordinates: [parseFloat(el.coords[0]), parseFloat(el.coords[1])]
						}
					}
					arr.push(newEl)
				}
				return arr;
			}, [])
			var lapor = data.data.gempaLapor.reduce(function (arr, el) {
				if (typeof el.coords == "object") {
					el.type = 'lapor'
					var newEl = {
						type: 'Feature',
						properties: el,
						geometry: {
							type: 'Point',
							coordinates: [parseFloat(el.coords[0]), parseFloat(el.coords[1])]
						}
					}
					arr.push(newEl)
				}
				return arr;
			}, [])
			mapFeatures = bmkg.concat(lapor)
			var mapData = {
				type: 'FeatureCollection',
				features: mapFeatures
			}
			var infowindow = new google.maps.InfoWindow()

			map.data.setStyle(function (feature) {
				var title = 'markers-bmkg'
				//var label = 'BMKG'
				var icon = 'http://maps.google.com/mapfiles/ms/icons/red.png'
				if (feature.getProperty('type') != "bmkg") {
					icon = 'http://maps.google.com/mapfiles/ms/icons/blue.png'
					//label = 'User'
					title = 'markers-laporan'
				}
				return {
					//label: label,
					title: title,
					icon: icon,
				}
			})
			map.data.addGeoJson(mapData)

			map.data.addListener('click', function (e) {
				var feat = e.feature
				hideMaker(feat)
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