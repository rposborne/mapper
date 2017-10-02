// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
//
// function initAutocomplete() {
//        let map = new google.maps.Map(document.getElementById('map'), {
//          center: {lat: -33.8688, lng: 151.2195},
//          zoom: 13,
//          mapTypeId: 'roadmap'
//        });
//
//        // Create the search box and link it to the UI element.
//        let input = document.getElementById('pac-input');
//        let searchBox = new google.maps.places.SearchBox(input);
//        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
//
//        // Bias the SearchBox results towards current map's viewport.
//        map.addListener('bounds_changed', function() {
//          searchBox.setBounds(map.getBounds());
//        });
//
//        map.addListener('click', function(e) {
//         placeMarkerAndPanTo(e.latLng, map);
//       });
//
//        let markerData = []
//        function placeMarkerAndPanTo(latLng, map) {
//          let marker = new google.maps.Marker({
//            position: latLng,
//            map: map
//          });
//          map.panTo(latLng);
//          markerData.push(latLng)
//          console.log(markerData);
//        }
//
//        let markers = [];
//        // Listen for the event fired when the user selects a prediction and retrieve
//        // more details for that place.
//        searchBox.addListener('places_changed', function() {
//          let places = searchBox.getPlaces();
//
//          if (places.length == 0) {
//            return;
//          }
//
//         function saveMarkersToDB(markerData) {
//           return fetch("/maps", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ markerData: markerData})
//           }).then(r => console.log(r))
//         }
//
//          // Clear out the old markers.
//          markers.forEach(function(marker) {
//            marker.setMap(null);
//          });
//          markers = [];
//
//          // For each place, get the icon, name and location.
//          let bounds = new google.maps.LatLngBounds();
//          places.forEach(function(place) {
//            if (!place.geometry) {
//              console.log("Returned place contains no geometry");
//              return;
//            }
//            let icon = {
//              url: place.icon,
//              size: new google.maps.Size(71, 71),
//              origin: new google.maps.Point(0, 0),
//              anchor: new google.maps.Point(17, 34),
//              scaledSize: new google.maps.Size(25, 25)
//            };
//
//            // Create a marker for each place.
//            markers.push(new google.maps.Marker({
//              map: map,
//              icon: icon,
//              title: place.name,
//              position: place.geometry.location
//            }));
//
//            if (place.geometry.viewport) {
//              // Only geocodes have viewport.
//              bounds.union(place.geometry.viewport);
//            } else {
//              bounds.extend(place.geometry.location);
//            }
//          });
//          map.fitBounds(bounds);
//        });
//      google.maps.event.addDomListener(window, "load", this.initialize);
// }


   (function() {
    window.MapSpot = function(node, options) {
      const DEFAULT_CENTER = {lat: 35.654890, lng: 139.722600}
      const DEFAULT_ZOOM = 17

      this.options = options || {}

      this.node = node
      this.markers = []
      this.map = new google.maps.Map(this.node)
      let input = document.getElementById('pac-input');
      let searchBox = new google.maps.places.SearchBox(input);

      this.initMap = function() {
        this.map.setCenter(this.options["center"] || DEFAULT_CENTER)
        this.map.setZoom(this.options["zoom"] || DEFAULT_ZOOM)
        this.addEventListeners()
      }

      this.addEventListeners = function() {
        let self = this
        google.maps.event.addListener(this.map, "click", function(event) {
          self.addMarker(event.latLng)
        });
      }

      this.addMarker = function(coordinates) {
        this.markers.push(
          new google.maps.Marker({
            position: coordinates,
            draggable: true,
            map: this.map
          })
        )
      }

      searchBox.addListener('places_changed', function() {
  let places = searchBox.getPlaces();

  if (places.length == 0) {
    return;
  }

 function saveMarkersToDB(markerData) {
   return fetch("/maps", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ markerData: markerData})
   }).then(r => console.log(r))
 }

  // Clear out the old markers.
  markers.forEach(function(marker) {
    marker.setMap(null);
  });
  this.markers = [];


  let bounds = new google.maps.LatLngBounds();
  places.forEach(function(place) {
    if (!place.geometry) {
      console.log("Returned place contains no geometry");
      return;
    }
    let icon = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    // Create a marker for each place.
    markers.push(new google.maps.Marker({
      map: map,
      icon: icon,
      title: place.name,
      position: place.geometry.location
    }));

    if (place.geometry.viewport) {
      // Only geocodes have viewport.
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }
  });
  map.fitBounds(bounds);
});

      this.getCoordinates = function() {
        return this.markers.map(function(marker) {
          return {
            lat: marker.position.lat(),
            lng: marker.position.lng()
          }
        })
      }

      this.deleteAllMarkers = function() {
        this.markers.forEach(function(marker) {
          marker.setMap(null)
        })
        this.markers.length = 0
      }

      this.restoreCoordinates = function(coordinates) {
        let self = this
        coordinates.forEach(function(coordinate) {
          self.addMarker(coordinate)
        })
      }

      this.restoreMap = function(serialized) {
        let self = this
        this.deleteAllMarkers()
        this.map.setCenter(serialized.center)
        this.map.setZoom(serialized.zoom)
        this.restoreCoordinates(serialized.coordinates)
      }

      this.serialize = function() {
        return {
          center: {
            lat: this.map.getCenter().lat(),
            lng: this.map.getCenter().lng(),
          },
          zoom: this.map.getZoom(),
          coordinates: this.getCoordinates(),
        }
      }
    }
  })();

  (function() {
    window.mapDefaults = {
      coordinates: [
        {lat: 35.654890, lng: 139.722600},
      ],
      node: document.getElementById('map'),
    }
  })();

  let mapSpot = new MapSpot(mapDefaults.node, {
    center: mapDefaults.coordinates[0],
  })
  mapSpot.initMap()

  mapSpot.restoreCoordinates(mapDefaults.coordinates)
  mapSpot.addMarker({lat: 35.654376, lng: 139.722903})

  console.log("Coordinates")
  console.table(mapSpot.getCoordinates())

  console.log("Markers")
  console.log(mapSpot.markers)

  // Demo serialize and restore
  setTimeout(function() {
    mapSpot.map.setZoom(16)
  }, 1000)
  serialized = mapSpot.serialize()
  setTimeout(function() {
    mapSpot.deleteAllMarkers()
  }, 2000)
  setTimeout(function() {
    mapSpot.restoreMap(serialized)
  }, 3000)
