// Gempa UI
var map
$("#floating input").click(function (e) {
	// layering
	map.data.revertStyle()
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
				//var icon = 'http://maps.google.com/mapfiles/ms/icons/red.png'
				if (feature.getProperty('type') != "bmkg") {
					//icon = 'http://maps.google.com/mapfiles/ms/icons/blue.png'
					//label = 'User'
					title = 'markers-laporan'
				}
				return {
					//label: label,
					title: title,
					icon: 'http://inatews.bmkg.go.id/images/kedalaman.png',
				}
			})
			map.data.addGeoJson(mapData)

			map.data.addListener('click', function (e) {
				var feat = e.feature
				var html = '<h3>' + feat.getProperty('type').toUpperCase() + '</h3>'
				if (feat.getProperty('name'))
					html += '<b><a>Nama : </a>' + feat.getProperty('name') + '</b>'
				if (feat.getProperty('iduser'))
					html += '<br><a>ID user : </a>' + feat.getProperty('iduser')
				if (feat.getProperty('lat'))
					html += '<br><a>Lokasi : </a>' + feat.getProperty('lat') + ', ' + feat.getProperty('lng')
				if (feat.getProperty('address'))
					html += '<br><a>( </a>' + feat.getProperty('address')
				if (feat.getProperty('quiz'))
					html += '<a> )</a><br><a>Kuisioner : </a>' + feat.getProperty('quiz')
				if (feat.getProperty('mmi'))
					html += '<br><a>Intensitas : </a>' + feat.getProperty('mmi')
				if (feat.getProperty('mag'))
					html += '<br><a>Magnitudo : </a>' + feat.getProperty('mag')
				if (feat.getProperty('deep'))
					html += '<br><a>Kedalaman : </a>' + feat.getProperty('deep')
				if (feat.getProperty('disasterDate'))
					html += '<br><a>Waktu gempa : </a>' + feat.getProperty('disasterDate')
				if (feat.getProperty('createdDate'))
					html += '<br><a>Input server (GMT) : </a>' + feat.getProperty('createdDate')

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