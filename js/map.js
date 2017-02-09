$(document).ready(function() {
    // Initial map setup
    var accessToken = 'pk.eyJ1Ijoicm9zZWtxIiwiYSI6ImNpdmNhb3JrNzAwNWwyenBmMDN1a2g0NXAifQ.Cx7hjZVb009fCALAGxO6ng';
    var mapboxTiles = L.tileLayer(
        'https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + accessToken,
        {
            attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
    );
    var map = L.map('map')
            .addLayer(mapboxTiles)
            .setView([54.5733, -5.9340], 15);
    var controlLayers = L.control.layers().addTo(map);

    // Handler for playground marker setup
    var doPlaygroundMarker = function(feature, layer) {
        var popupOptions = {width: 200};
        var popupContent = 'Playground';
        if ( feature.properties && feature.properties.NAME ) {
            popupContent = feature.properties.NAME;
        }
        var icon = new L.icon({
            iconUrl: "lib/leaflet/images/slide.png",
            iconSize: [54, 67],
            popupAnchor: [0, -30]
        });

        layer.bindPopup(popupContent, popupOptions);
        layer.setIcon(icon);
    };

    // Handler for school marker setup
    var doSchoolsMarker = function(feature, layer) {
        var popupOptions = {width: 200};
        var popupContent = 'School';
        if ( feature.properties && feature.properties.CENTRE_NAME ) {
            popupContent = feature.properties.CENTRE_NAME;
        }
        var icon = new L.icon({
            iconUrl: 'lib/leaflet/images/school_icon.png',
            iconSize: [54, 67],
            popupAnchor: [0, -30]
        });

        layer.bindPopup(popupContent, popupOptions);
        layer.setIcon(icon);
    };

    // Handler for crime marker setup
    var doCrimeMarker = function(feature, layer) {
        var popupOptions = {width: 200};
        var popupContent = 'Crime';
        if ( feature.properties && feature.properties['Crime type'] ) {
            popupContent = feature.properties['Crime type'];
        }
        var icon = new L.icon({
            iconUrl: 'lib/leaflet/images/crime_icon.png',
            iconSize: [54, 67],
            popupAnchor: [0, -30]
        });

        layer.bindPopup(popupContent, popupOptions);
        layer.setIcon(icon);
    };

    // Add the geoJSON layer for each dataset
    // These datasets are all specified by 'data/{setname}.json'
    var playgroundLayer = L.geoJson(playgrounds, {
        onEachFeature: doPlaygroundMarker
    }).addTo(map);
    var schoolLayer = L.geoJson(schools, {
        onEachFeature: doSchoolsMarker
    }).addTo(map);
    var crimeLayer = L.geoJson(crime, {
        onEachFeature: doCrimeMarker
    }).addTo(map);

    // Add a control overlay to enable filtering
    controlLayers.addOverlay(playgroundLayer, 'Children Playgrounds');
    controlLayers.addOverlay(schoolLayer, 'Schools');
    controlLayers.addOverlay(crimeLayer, 'Crime');
});
