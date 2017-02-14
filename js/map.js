/* global L */
/* global schools, playgrounds */
$(document).ready(function() {
    // Initial map setup
    var featureRadius = 2200;   // Radius, in metres, to display features
    var familyMarker, playgroundLayer, schoolLayer, crimeLayer;
    var map, controlLayers;

    function init() {
        var initialLatLng = L.latLng(54.5733, -5.9340);
        var accessToken = 'pk.eyJ1Ijoicm9zZWtxIiwiYSI6ImNpdmNhb3JrNzAwNWwyenBmMDN1a2g0NXAifQ.Cx7hjZVb009fCALAGxO6ng';
        var mapboxTiles = L.tileLayer(
            'https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + accessToken,
            {
                attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }
        );
        map = L.map('map')
                .addLayer(mapboxTiles)
                .setView(initialLatLng, 15);
        map.zoomControl.setPosition('bottomleft');
        controlLayers = L.control.layers().addTo(map);
        
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
            $('#postcode-error').hide();
            $.ajax({
                url: 'https://api.postcodes.io/postcodes/' + encodeURI(postcode),
                success: handlePostcodeResponse,
                error: handlePostcodeError
            });
            
            e.preventDefault();
        });

        // Hide any elements with the "hidden" class attached
        $('.hidden').hide().removeClass('hidden');

        // Instantiate the family marker, place it on the map, and add listeners
        //  for moving/dragging.
        familyMarker = L.marker(initialLatLng, {draggable: true}).addTo(map);
        familyMarker.on('move movestart moveend', handleMarkerMove);
        displayLocalFeatures(initialLatLng);
    };

    /**
     * Handler for playground marker setup
     * 
     * @param {object} feature
     * @param {L.marker} layer
     */
    function doPlaygroundMarker( feature, layer ) {
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

    /**
     * Handler for school marker setup
     * 
     * @param {object} feature
     * @param {L.marker} layer
     */
    function doSchoolsMarker( feature, layer ) {
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
    
    /**
     * Handle the response returned by the post code geolocation service.
     * 
     * @param {object} response
     * @param {string} status
     * @param {object} jqXHR
     */
    function handlePostcodeResponse( response, status, jqXHR ) {
        var pos = L.latLng(response.result.latitude, response.result.longitude);
        // Marker already exists, so we just move it to the new location
        familyMarker.setLatLng(pos);
        map.panTo(pos);
    };

    /**
     * Display an error message when the postcode API cannot find the post code,
     *  or another error occurs.
     * 
     */
    function handlePostcodeError() {
        $('#postcode-error').text('The given postcode could not be found.').show();
    };

    /**
     * Handle the user moving/dragging the marker.
     * 
     * @param {Event} e
     */
    function handleMarkerMove( e ) {
        if ( e.type === 'movestart' ) {
            e.target.isDragging = true;
        }
        else if ( e.type === 'moveend' ) {
            e.target.isDragging = false;
            displayLocalFeatures(e.target.getLatLng());
        }
        else if ( e.type === 'move' && !e.target.isDragging ) {
            displayLocalFeatures(e.latlng);
        }
    };

    /**
     * Place markers on the map for features within a defined radius, including
     *  crimes, which we need to make an API call to retrieve.
     * 
     * @param {L.latLng} position
     */
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

    /**
     * Filter a set of GeoJSON features (playgrounds, schools) and return only 
     *  those within the defined radius around the given point.
     * 
     * @param {array} data
     * @param {L.latLng} pos
     * @returns {array}
     */
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

    /**
     * Handle the response from the Crime API
     * 
     * @param {array} crimes
     * @param {string} status
     * @param {object} jqXHR
     */
    function handleCrimeAPIResponse( crimes, status, jqXHR ) {
        var icon = new L.icon({
            iconUrl: 'lib/leaflet/images/crime_icon.png',
            iconSize: [54, 67],
            popupAnchor: [0, -30]
        });
        var popupOptions = {width: 200};
        var popupContent, marker, position;

        for ( var x = 0, ln = crimes.length; x < ln; x++ ) {
            popupContent = 'Crime';
            if ( crimes[x].category ) {
                popupContent = naturalizeCategoryString(crimes[x].category);
            }
            // Create a marker for each crime event within the area
            position = crimes[x].location;
            marker = L.marker([position.latitude, position.longitude], {
                icon: icon
            });
            marker.bindPopup(popupContent, popupOptions);
            crimeLayer.addLayer(marker);
        }
        
        createPieChart(crimes);

    };

    function createPieChart(crimes) {

        var crimes = crimes;

        console.log(crimes);

        var crimeSummary = d3.nest().key(function (d) { return d.category; }).rollup(function (v) { return v.length; }).entries(crimes);

        console.log(JSON.stringify(crimeSummary));

        var width = 300;
        var height = 300;
        var radius = Math.min(width, height) / 2;

        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        var canvas = d3.select("#crime-piechart")
            .append("canvas")
            .attr("width", width)
            .attr("height", height)
            .append('g').attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');





        //do everything inside this function including d3 nest & pie chart

    }

    /**
     * Crime categories are strings such as "anti-social-behaviour". This function
     *  replaces the '-' characters with spaces, and capitalises each word.
     * 
     * @param {string} str
     * @returns {string}
     */
    function naturalizeCategoryString( str ) {
        var parts;
        if ( ( !str.split || !str.length) ) {
            throw "First argument must be a string.";
        }

        parts = str.split('-');
        for ( var x = 0, ln = parts.length; x < ln; x++ ) {
            parts[x] = parts[x].substr(0, 1).toUpperCase() + parts[x].substr(1).toLowerCase();
        }

        return parts.join(' ');
    };

    init();

});

var lat = -5.884378; 
var long = 54.602357; 
var date = '2016-12';
var policeURLrequest = 'https://data.police.uk/api/crimes-street/all-crime?lat='+lat+'&lng='+long+'&date='+date;


//Pie chart showing the crime breakdown that interacts with the 
/*function d3Leaflet(){
var CrimeJson = d3.request(policeURLrequest)
    .mimeType("application/json")
    .response(function(xhr) { return JSON.parse(xhr.responseText); })
    .get(callback);

var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var labelArc = d3.svg.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.population; });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.json(CrimeJson, type, function(error, data) {
  if (error) throw error;

  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
    .size()
    .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.age); });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.; });
});*/




