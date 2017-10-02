// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

(function() {
  window.MapSpot = function(node, inputNode, options) {
    const DEFAULT_CENTER = { lat: 35.65489, lng: 139.7226 };
    const DEFAULT_ZOOM = 17;

    this.options = options || {};

    this.node = node;
    this.inputNode = inputNode;
    this.markers = [];
    this.map = new google.maps.Map(this.node);
    this.searchBox = new google.maps.places.SearchBox(this.inputNode);

    this.initMap = function() {
      this.map.setCenter(this.options["center"] || DEFAULT_CENTER);
      this.map.setZoom(this.options["zoom"] || DEFAULT_ZOOM);
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.inputNode);
      this.addEventListeners();
    };

    this.addEventListeners = function() {
      let self = this;
      google.maps.event.addListener(this.map, "click", function(event) {
        self.addMarker(event.latLng);
      });

      self.searchBox.addListener("places_changed", function() {
        let places = self.searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }


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

          // function saveMarkersToDB(markerData) {
          //   return fetch("/maps", {
          //     method: "POST",
          //     headers: { "Content-Type": "application/json" },
          //     body: JSON.stringify({ markerData: markerData})
          //   }).then(r => console.log(r))
          // }

          // Clear out the old markers.
          // markers.forEach(function(marker) {
          //   marker.setMap(null);
          // });
          // markers = [];

          // Create a marker for each place.
          self.addMarker(place.geometry.location);


          // self.markers.push(
          //   new google.maps.Marker({
          //     map: map,
          //     icon: icon,
          //     title: place.name,
          //     position: place.geometry.location
          //   })
          // );
          console.log(self.markers)

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        self.map.fitBounds(bounds);
      });


      self.map.addListener("bounds_changed", function() {
        self.searchBox.setBounds(self.map.getBounds());
      });

      self.map.addListener("click", function(e) {
        placeMarkerAndPanTo(e.latLng, self.map);
      });

      function placeMarkerAndPanTo(latLng, map) {
        let marker = new google.maps.Marker({
          position: latLng,
          map: map
        });
        self.map.panTo(latLng);
      }
    };



    this.addMarker = function(coordinates) {
      this.markers.push(
        new google.maps.Marker({
          position: coordinates,
          draggable: true,
          map: this.map
        })
      );
    };







    this.getCoordinates = function() {
      return this.markers.map(function(marker) {
        return {
          lat: marker.position.lat(),
          lng: marker.position.lng()
        };
      });
    };

    this.deleteAllMarkers = function() {
      this.markers.forEach(function(marker) {
        marker.setMap(null);
      });
      this.markers.length = 0;
    };

    this.restoreCoordinates = function(coordinates) {
      let self = this;
      coordinates.forEach(function(coordinate) {
        self.addMarker(coordinate);
      });
    };

    this.restoreMap = function(serialized) {
      let self = this;
      this.deleteAllMarkers();
      this.map.setCenter(serialized.center);
      this.map.setZoom(serialized.zoom);
      this.restoreCoordinates(serialized.coordinates);
    };

    this.serialize = function() {
      return {
        center: {
          lat: this.map.getCenter().lat(),
          lng: this.map.getCenter().lng()
        },
        zoom: this.map.getZoom(),
        coordinates: this.getCoordinates()
      };
    };
  };
})();

(function() {
  window.mapDefaults = {
    coordinates: [{ lat: 35.65489, lng: 139.7226 }],
    node: document.getElementById("map"),
    inputNode: document.getElementById("pac-input")
  };
})();

let mapSpot = new MapSpot(mapDefaults.node, mapDefaults.inputNode, {
  center: mapDefaults.coordinates[0]
});
mapSpot.initMap();

mapSpot.restoreCoordinates(mapDefaults.coordinates);
mapSpot.addMarker({ lat: 35.654376, lng: 139.722903 });

console.log("Coordinates");
console.table(mapSpot.getCoordinates());

console.log("Markers");
console.log(mapSpot.markers);

// Demo serialize and restore
setTimeout(function() {
  mapSpot.map.setZoom(16);
}, 1000);
serialized = mapSpot.serialize();
setTimeout(function() {
  mapSpot.deleteAllMarkers();
}, 2000);
setTimeout(function() {
  mapSpot.restoreMap(serialized);
}, 3000);
