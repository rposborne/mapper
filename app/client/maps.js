// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

import MapSpot from './map_spot'

(function() {
  window.mapDefaults = {
    markers: [{ lat: 38.898754, lng: -77.031563 }],
    node: document.getElementById("map"),
    inputNode: document.getElementById("pac-input")
  };

  if (document.getElementById('map-page') !== null) {
    window.mapSpot = new MapSpot(mapDefaults.node, mapDefaults.inputNode, {
      center: mapDefaults.markers[0]
    });
    mapSpot.initMap();
  }

  if (document.getElementById('save-map-page') !== null) {
    window.mapSpot = new MapSpot(mapDefaults.node, mapDefaults.inputNode, {
      center: mapDefaults.markers[0]
    });
    mapSpot.initMap();
    mapSpot.getMap();
  }

  if (document.getElementById('save-map-page') !== null) {
    window.mapSpot = new MapSpot(mapDefaults.node, mapDefaults.inputNode, {
      center: mapDefaults.markers[0]
    });
    mapSpot.initMap();
    mapSpot.getMap();
  }

  if (document.getElementById('show-map-page') !== null) {
    window.mapSpot = new MapSpot(mapDefaults.node, mapDefaults.inputNode, {
      center: mapDefaults.markers[0]
    });
    mapSpot.initMap();
    mapSpot.getMap();
  }

  if (document.getElementById('edit-map-page') !== null) {
    window.mapSpot = new MapSpot(mapDefaults.node, mapDefaults.inputNode, {
      center: mapDefaults.markers[0]
    });
    mapSpot.initMap();
    mapSpot.getMap();
  }


})();
