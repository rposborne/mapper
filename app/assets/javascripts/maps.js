// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

(function() {
  window.MapSpot = function(node, inputNode, options) {
    const DEFAULT_CENTER = { lat: 38.898754, lng: -77.031563 };
    const DEFAULT_ZOOM = 17;

    this.options = options || {};

    this.node = node;
    this.inputNode = inputNode;
    this.markers = [];
    this.openedMarker = null;
    this.map = new google.maps.Map(this.node);
    this.searchBox = new google.maps.places.SearchBox(this.inputNode);
    this.infowindow = new google.maps.InfoWindow({
      content: document.getElementById('marker-form-wrapper')
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

      document.getElementById('delete-marker').addEventListener('button', function(e) {
        e.preventDefault()
        self.deleteMarker()
      })

      document.getElementById('save-map-form').addEventListener('submit', function(e) {
        e.preventDefault()
        self.save()
      })

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
          self.addMarker(place.geometry.location, place);

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

      document.getElementById('marker-form').addEventListener('submit', function(e) {
        e.preventDefault();

        self.openedMarker.name = this.name.value;
        self.openedMarker.address = this.address.value;
        self.openedMarker.tell = this.tell.value;

        this.name.value = ""
        this.address.value = ""
        this.tell.value = ""

        self.infowindow.close(self.map, self.openedMarker);
        self.messageWindow.open(self.map, self.openedMarker)
        setInterval(function() {
          self.messageWindow.close(self.map, self.openedMarker)
        }, 500)
        document.getElementById('message').setAttribute("style", "display: block")
        self.openedMarker = null;
      })
    };

    this.addMarker = function(latLng, place) {
      let self = this;
      let marker = new google.maps.Marker({
        position: latLng,
        draggable: true,
        map: this.map
      });
      marker.name = ""
      marker.address = ""
      marker.tell = ""

      if (place !== undefined) {
        marker.name = place.name;
        marker.address = place.formatted_address;
      }

      this.map.panTo(latLng);
      this.markers.push(marker);

      google.maps.event.addListener(marker, 'click', function() {
        self.infowindow.open(self.map, marker);
        self.openedMarker = marker;
        document.getElementById('marker-form-wrapper').setAttribute("style", "display: block")
        let form = document.getElementById('marker-form');
        form.name.value = marker.name;
        form.address.value = marker.address;
        form.tell.value = marker.tell;
      })
    };

    this.deleteMarker = function(latLng, place) {
      let self = this;
      index = this.markers.indexOf(marker)
        if (index > -1) {
      this.markers.splice(index, 1)
      console.log(markers);
      }
    }

    this.serializeMarkers = function() {
      return this.markers.map(function(marker) {
        return {
          lat: marker.position.lat(),
          lng: marker.position.lng(),
          name: marker.name,
          address: marker.address,
          tell: marker.tell
        };
      });
    };

    this.deleteAllMarkers = function() {
      this.markers.forEach(function(marker) {
        marker.setMap(null);
      });
      this.markers.length = 0;
    };

    this.restoreMarkers = function(markers) {
      let self = this;
      markers.forEach(function(marker) {
        self.addMarker(marker);
      });
    };

    this.restoreMap = function(data) {
      let self = this;

      this.deleteAllMarkers();
      this.map.setCenter(data.center);
      this.map.setZoom(data.zoom);
      this.restoreMarkers(data.markers);
    };

    this.getMapIdFromLocation = function() {
      return document.location.pathname.split("/")[2];
    }

    this.getMap = function() {
      let self = this;
      let mapId = this.getMapIdFromLocation();
      fetch(`/maps/${mapId}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json',
          'X-CSRF-Token': document.querySelector("meta[name=csrf-token]").content
        },
        // body: JSON.stringify({ map: map })
      })
      .then(function(res) {
        if (res.ok) {
          return res.json()
        }
      })
      .then(function(json) {
        self.restoreMarkers(json.markers)
         console.log(json)
       })
    }

    this.save = function() {
      let self = this;
      let map = self.serialize();
      map.title = document.getElementById('title-field').value;
      map.description = document.getElementById('description-field').value;

      fetch('/maps', {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json',
          'X-CSRF-Token': document.querySelector("meta[name=csrf-token]").content
        },
        body: JSON.stringify({ map: map })
      })
      .then(data => console.log(data))
    }

    this.serialize = function() {
      return {
        center: {
          lat: this.map.getCenter().lat(),
          lng: this.map.getCenter().lng()
        },
        zoom: this.map.getZoom(),
        markers: this.serializeMarkers()
      };
    };


  };
})();
// Demo serialize and restore
// setTimeout(function() {
//   mapSpot.map.setZoom(16);
// }, 1000);
// serialized = mapSpot.serialize();
// setTimeout(function() {
//   mapSpot.deleteAllMarkers();
// }, 2000);
// setTimeout(function() {
//   mapSpot.restoreMap(serialized);
// }, 3000);

(function() {
  window.mapDefaults = {
    markers: [{ lat: 38.898754, lng: -77.031563 }],
    node: document.getElementById("map"),
    inputNode: document.getElementById("pac-input")
  };
})();

if (document.getElementById('map-page') !== null) {
  window.mapSpot = new MapSpot(mapDefaults.node, mapDefaults.inputNode, {
    center: mapDefaults.markers[0]
  });
  mapSpot.initMap();
}

if (document.getElementById('edit-map-page') !== null) {
  window.mapSpot = new MapSpot(mapDefaults.node, mapDefaults.inputNode, {
    center: mapDefaults.markers[0]
  });
  mapSpot.initMap();
  mapSpot.getMap();

  console.log("Coordinates");
  console.table(mapSpot.serializeMarkers());

  console.log("Markers");
  console.log(mapSpot.markers);
}
