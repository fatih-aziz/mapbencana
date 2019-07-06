  // Gempa UI

  function makeInfoBox(controlDiv, map) {
      // Set CSS for the control border.
      var controlUI = document.createElement('div');
      controlUI.style.boxShadow = 'rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px';
      controlUI.style.backgroundColor = '#fff';
      controlUI.style.border = '2px solid #fff';
      controlUI.style.borderRadius = '2px';
      controlUI.style.marginBottom = '22px';
      controlUI.style.marginTop = '10px';
      controlUI.style.textAlign = 'center';
      controlDiv.appendChild(controlUI);

      // Set CSS for the control interior.
      var controlText = document.createElement('div');
      controlText.style.color = 'rgb(25,25,25)';
      controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
      controlText.style.fontSize = '100%';
      controlText.style.padding = '6px';
      controlText.textContent =
          'The map shows all clicks made in the last 10 minutes.';
      controlUI.appendChild(controlText);
  }

  var map;

  function initMap() {

      var markType = "marker";

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
      });

      // Create the DIV to hold the control and call the makeInfoBox() constructor
      // passing in this DIV.
      var infoBoxDiv = document.createElement('div');
      makeInfoBox(infoBoxDiv, map);
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(infoBoxDiv);

      function getCircle(mag) {
          if (mag != null && mag != 0) {
              return {
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: 'red',
                  fillOpacity: .5,
                  scale: Math.pow(2, mag) / 2,
                  strokeColor: 'white',
                  strokeWeight: .5
              };
          } else {
              return {
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: 'white',
                  fillOpacity: .2,
                  scale: Math.pow(2, 3) / 2,
                  strokeColor: 'red',
                  strokeWeight: .8
              };
          }
      }

      $.get(baseUrl + "/api/v1/map/multisource")
          .done(data => {
              if (markType == "heatmap") {
                  var heatmap = new google.maps.visualization.HeatmapLayer({
                      data: mapData,
                      dissipating: false,
                      map: map
                  });
              } else if (markType == "marker") {
                  bmkg = data.data.bmkg.map(function (data) {
                      return {
                          type: "Feature",
                          properties: {
                              idUser: data.idUser,
                              nama: data.nama,
                              mag: data.mag,
                              time: data.time,
                              reportTime: data.reportTime,
                              newslink: data.newslink,
                              mmi: data.mmi,
                              quiz: data.quiz,
                              address: data.address,
                          },
                          geometry: {
                              type: "Point",
                              coordinates: data.coords
                          }
                      }
                  })
                  mapData = {
                      type: "FeatureCollection",
                      features: bmkg
                  }
                  console.log(mapData);

                  map.data.setStyle(function (feature) {
                      var mag = feature.getProperty('mag');
                      return {
                          icon: getCircle(mag)
                      };
                  });
                  map.data.addGeoJson(mapData);
                  map.data.addListener('mouseover', function (e) {
                      console.log(e.feature.getProperty("mag"));
                  })
              }
          }).fail(err => {
              console.log(err);
          })
  }
  (function ($) {
      // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
      // // The Firebase SDK is initialized and available here!
      //
      // firebase.auth().onAuthStateChanged(user => { });
      // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
      // firebase.messaging().requestPermission().then(() => { });
      // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
      //
      // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

      try {
          let app = firebase.app();
          let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] ===
              'function');
      } catch (e) {
          console.error(e);
          document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
      }
  });