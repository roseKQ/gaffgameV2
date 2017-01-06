L.mapbox.accessToken = 'pk.eyJ1Ijoicm9zZWtxIiwiYSI6ImNpdmNhb3JrNzAwNWwyenBmMDN1a2g0NXAifQ.Cx7hjZVb009fCALAGxO6ng';
var map = L.mapbox.map('map', 'mapbox.streets')
    .setView([54.5733, -5.9340], 15);

var controlLayers = L.control.layers().addTo(map);
//add some GeoJson for playgrounds


function playgroundMarker(feature, layer){
  var popupOptions = {width: 200};
  var popupContent = "This is some content";

var marker = new L.icon({iconUrl: "lib/leaflet/images/slide.png"});

layer.bindPopup(popupContent, popupOptions);
layer.setIcon(marker);

};


function schoolsMarker(feature, layer){
  var popupOptions = {width: 200};
  var popupContent = "This is some content";

var schoolsmarker = new L.icon({iconUrl: "lib/leaflet/images/school_icon.png"});

layer.bindPopup(popupContent, popupOptions);
layer.setIcon(schoolsmarker);

};

 function crimeMarker(feature, layer){
   var popupOptions = {width: 200};
   var popupContent = "This is some content";

 var crimemarker = new L.icon({iconUrl: "lib/leaflet/images/crime_icon.png"});

 layer.setIcon(crimemarker);

 };

var playground = L.geoJson(playgrounds, {
	onEachFeature: playgroundMarker
	
}).addTo(map);


var schools = L.geoJson(schools, {
	onEachFeature: schoolsMarker
	
}).addTo(map);

var crime = L.geoJson(crime, {
 	onEachFeature: crimeMarker
	
 }).addTo(map);

controlLayers.addOverlay(playground, 'Children Playgrounds');
controlLayers.addOverlay(schools, 'Schools');
controlLayers.addOverlay(crime, 'Crime');
//controlLayers.addOverlay(crime, 'Crime');


// var popup = L.popup();

// function onMapClick(e, playgrounds) {
//     popup
    
//         .setLatLng(e.latlng)
//         .setContent("You clicked the map at " + e.latlng.toString())
//         .openOn(map);
// }

// map.on('click', onMapClick);