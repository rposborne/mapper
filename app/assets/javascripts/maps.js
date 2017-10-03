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
    this.infowindow = new google.maps.InfoWindow({
      content: document.getElementById('form')
    });
    this.messageWindow = new google.maps.InfoWindow({
      content: document.getElementById('message')
    });


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
            return;
          }
          // Create a marker for each place.
          self.addMarker(place.geometry.location);
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
    };

    this.addMarker = function(latLng) {
      let self = this;
      let marker = new google.maps.Marker({
        position: latLng,
        draggable: true,
        map: this.map
      });
      this.map.panTo(latLng);
      this.markers.push(marker);

      google.maps.event.addListener(marker, 'click', function() {
        self.infowindow.open(self.map, marker);
        document.getElementById('form').setAttribute("style", "display: block")
      })
      document.getElementById('button').addEventListener('click', function() {
        console.log("Working?");
        self.messageWindow.open(self.map, marker)
        document.getElementById('message').setAttribute("style", "display: block")
      })
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
