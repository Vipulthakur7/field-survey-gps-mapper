// let coordinates = [];
// let watchId = null;
// let map, polygonLayer;

// document.addEventListener('deviceready', () => {
//   setTimeout(initMap, 100);
// }, false);

// function initMap() {

//   delete L.Icon.Default.prototype._getIconUrl;
//   L.Icon.Default.mergeOptions({
//     iconRetinaUrl: 'lib/leaflet/images/marker-icon-2x.png',
//     iconUrl: 'lib/leaflet/images/marker-icon.png',
//     shadowUrl: 'lib/leaflet/images/marker-shadow.png'
//   });

 
//   map = L.map('map').setView([20.5937, 78.9629], 5);
//   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '© OpenStreetMap contributors'
//   }).addTo(map);

//   polygonLayer = L.polygon([], { color: 'green' }).addTo(map);
// }

// function startSurvey() {
//   coordinates = [];
//   if (watchId) navigator.geolocation.clearWatch(watchId);

//   watchId = navigator.geolocation.watchPosition((pos) => {
//     const lat = pos.coords.latitude;
//     const lng = pos.coords.longitude;
//     coordinates.push([lng, lat]);

//     if (coordinates.length > 2) {
//       const latLngs = coordinates.map(([lng, lat]) => [lat, lng]);
//       polygonLayer.setLatLngs(latLngs);
//     }

//     map.setView([lat, lng], 18);
//   }, (err) => {
//     alert("GPS error: " + err.message);
//     console.error(err);
//   }, {
//     enableHighAccuracy: true,
//     maximumAge: 1000,
//     timeout: 20000
//   });

//   alert("Survey started. Walk to 4+ corners of the field.");
// }

// function stopSurvey() {
//   if (watchId) {
//     navigator.geolocation.clearWatch(watchId);
//     watchId = null;
//   }

//   if (coordinates.length < 3) {
//     alert("Not enough points to form a polygon.");
//     return;
//   }

//   coordinates.push(coordinates[0]); 

//   const geojsonPolygon = {
//     type: "Feature",
//     geometry: {
//       type: "Polygon",
//       coordinates: [coordinates]
//     }
//   };

//   const area = turf.area(geojsonPolygon);

//   document.getElementById('result').innerHTML = `
//     <p><strong>Area:</strong> ${area.toFixed(2)} sq.m</p>
//     <p><strong>Coordinates:</strong></p>
//     <pre>${JSON.stringify(coordinates, null, 2)}</pre>
//   `;
// }


let coordinates = [];
let watchId = null;
let map, polygonLayer;

document.addEventListener('deviceready', () => {
  setTimeout(initMap, 100);
}, false);

function initMap() {
  // Fix for custom marker icons
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'lib/leaflet/images/marker-icon-2x.png',
    iconUrl: 'lib/leaflet/images/marker-icon.png',
    shadowUrl: 'lib/leaflet/images/marker-shadow.png'
  });

  // Initialize map
  map = L.map('map').setView([20.5937, 78.9629], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  polygonLayer = L.polygon([], { color: 'green' }).addTo(map);
}

function startSurvey() {
  coordinates = [];
  if (watchId) navigator.geolocation.clearWatch(watchId);

  // UI update
  document.getElementById('startBtn').disabled = true;
  document.getElementById('stopBtn').disabled = false;

  watchId = navigator.geolocation.watchPosition((pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    coordinates.push([lng, lat]);

    if (coordinates.length > 2) {
      const latLngs = coordinates.map(([lng, lat]) => [lat, lng]);
      polygonLayer.setLatLngs(latLngs);
    }

    map.setView([lat, lng], 18);
  }, (err) => {
    alert("GPS error: " + err.message);
    console.error(err);
  }, {
    enableHighAccuracy: true,
    maximumAge: 1000,
    timeout: 20000
  });

  alert("Survey started. Walk to 4+ corners of the field.");
}

function stopSurvey() {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }

  // UI update
  document.getElementById('startBtn').disabled = false;
  document.getElementById('stopBtn').disabled = true;

  if (coordinates.length < 3) {
    alert("Not enough points to form a polygon.");
    return;
  }

  coordinates.push(coordinates[0]);

  const geojsonPolygon = {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [coordinates]
    }
  };

  const area = turf.area(geojsonPolygon);

  document.getElementById('result').innerHTML = `
    <p><strong>Area:</strong> ${area.toFixed(2)} sq.m</p>
    <p><strong>Coordinates:</strong></p>
    <pre>${JSON.stringify(coordinates, null, 2)}</pre>
  `;
}
