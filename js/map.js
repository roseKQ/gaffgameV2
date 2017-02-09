/* global L */
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
    var featureRadius = 2200;   // Radius, in metres, to display features
    var familyMarker, playgroundLayer, schoolLayer, crimeLayer;
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
    playgroundLayer = L.geoJson(false, { onEachFeature: doPlaygroundMarker }).addTo(map);
    schoolLayer = L.geoJson(false, { onEachFeature: doSchoolsMarker }).addTo(map);
    crimeLayer = L.featureGroup().addTo(map);
    
    // Add a control overlay to enable filtering
    controlLayers.addOverlay(playgroundLayer, 'Children Playgrounds');
    controlLayers.addOverlay(schoolLayer, 'Schools');
    controlLayers.addOverlay(crimeLayer, 'Crime');
    
    // Add listener to postcode form and search button
    $('.address-form').on('submit', function(e) {
        var postcode = $(this).find('#postcode').val();
        $.ajax({
            url: 'https://api.postcodes.io/postcodes/' + encodeURI(postcode),
            success: function callback(response, status, jqXHR) {
                var pos = L.latLng(response.result.latitude, response.result.longitude);
                if ( familyMarker ) {
                    familyMarker.setLatLng(pos);
                }
                else {
                    familyMarker = L.marker(pos, {draggable: true}).addTo(map);
                    familyMarker.on('move', handleMarkerMove);
                    displayLocalFeatures(pos);
                }
                map.panTo(pos);
            },
            error: function() {
                console.log('error occured');
            }
        });
        
        e.preventDefault();
    });

    function handleMarkerMove( e ) {
        //console.log('I moved!', arguments);
        displayLocalFeatures(e.latlng);
    };

    function displayLocalFeatures( position ) {
        // TODO: Filter schools, playgrounds, and crime by 1 mile radius to display on map
        var filteredSchools = filterGeoJSONFeatures(schools, position);
        var filteredPlaygrounds = filterGeoJSONFeatures(playgrounds, position);

        // Remove any existing features from the respective layers
        schoolLayer.clearLayers();
        playgroundLayer.clearLayers();
        crimeLayer.clearLayers();
        // Add the filtered data from the static datasets
        schoolLayer.addData(filteredSchools);
        playgroundLayer.addData(filteredPlaygrounds);
        // Make the API request for most recent crime data
        $.ajax({
            url: 'https://data.police.uk/api/crimes-street/all-crime?lat=' + position.lat + '&lng=' + position.lng,
            success: handleCrimeAPIResponse,
            error: function() {
                console('API call failed!', arguments);
            }
        });
    };

    function filterGeoJSONFeatures( data, pos ) {
        var filtered = {
            "type": "FeatureCollection",
            "features": []
        };
        var coord;
        
        for ( var x = 0, ln = data.features.length; x < ln; x++ ) {
            // GeoJSON coordinates are in [Lng, Lat] format, so we need to reverse 
            //  the pairing to compare to LatLng
            coord = [].concat(data.features[x].geometry.coordinates);
            coord.reverse();
            if ( pos.distanceTo(coord) <= featureRadius ) {
                filtered.features.push(data.features[x]);
            }
        }

        return filtered;
    };

    function handleCrimeAPIResponse( crimes, status, jqXHR ) {
        var icon = new L.icon({
            iconUrl: 'lib/leaflet/images/crime_icon.png',
            iconSize: [54, 67],
            popupAnchor: [0, -30]
        });
        var popupOptions = {width: 200};
        var popupContent = 'Crime';
        /* TODO: Crime categories need "translation"
        if ( feature.properties && feature.properties['Crime type'] ) {
            popupContent = feature.properties['Crime type'];
        }*/
        var marker, position;

        for ( var x = 0, ln = crimes.length; x < ln; x++ ) {
            // Create a marker for each crime event within the area
            position = crimes[x].location;
            marker = L.marker([position.latitude, position.longitude], {
                icon: icon
            });
            marker.bindPopup(popupContent, popupOptions);
            crimeLayer.addLayer(marker);
        }
    };
});
