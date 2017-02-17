/* global L */
/* global d3 */
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
        playgroundLayer = L.geoJson(false, {onEachFeature: doPlaygroundMarker}).addTo(map);
        schoolLayer = L.geoJson(false, {onEachFeature: doSchoolsMarker}).addTo(map);
        crimeLayer = L.featureGroup().addTo(map);

        // Add a control overlay to enable filtering
        controlLayers.addOverlay(playgroundLayer, 'Children Playgrounds');
        controlLayers.addOverlay(schoolLayer, 'Schools');
        controlLayers.addOverlay(crimeLayer, 'Crime');

        // Add listener to postcode form and search button
        $('.address-form').on('submit', function( e ) {
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
    }

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
    }

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
    }

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
    }

    /**
     * Display an error message when the postcode API cannot find the post code,
     *  or another error occurs.
     * 
     */
    function handlePostcodeError() {
        $('#postcode-error').text('The given postcode could not be found.').show();
    }

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
    }

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
    }

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
    }

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

    }

    /**
     * Method to create the pie chart and legend using d3. Takes the json returned by the API call and summarises using the 
     * d3 Nest function. Then uses this new data for the pie chart data.
     * 
     * @param {array} crimes
     */
    function createPieChart( crimes ) {
        console.log(crimes);

        //d3 nest function to count the instances of each category of crime

        var crimeSummary = d3.nest()
                .key(function( d ) {
                    return naturalizeCategoryString(d.category);
                })
                .rollup(function( v ) {
                    return v.length;
                })
                .entries(crimes);

        crimeSummary.sort(function( a, b ) {
            return d3.descending(a.value, b.value);
        });
        console.log(JSON.stringify(crimeSummary));

        //#crime-piechart is the id of the div showing the piechart
        //#legend is the id of the div showing the legend

        var width = $('#crime-piechart').width(),
                height = $('#crime-piechart').height(),
                radius = Math.min(width, height) / 2;
        var color = d3.scaleOrdinal()
                .range([
                    "#2C93E8", "#838690", "#F56C4E", "#CA2E55", "#FFE0B5", 
                    "#BDB246", "#25CED1", "#FCEADE", "#EA526F", "#99EDCC", 
                    "#E36588", "#9AC4F8", "#9A275A", "#5F4842"
                ]);

        // Create the pie chart and associated arcs
        var pie = d3.pie()
                .value(function( d ) {
                    return d.value;
                })(crimeSummary);
        var arc = d3.arc()
                .outerRadius(radius - 10)
                .innerRadius(50);

        // Empty out the pie chart element (clearing any existing chart)
        $('#crime-piechart').empty();
        // Create the chart SVG element
        var svg = d3.select("#crime-piechart")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"); // Moving the center point. 1/2 the width and 1/2 the height

        // Create each pie segment
        var g = svg.selectAll("arc")
                .data(pie)
                .enter().append("g")
                    .attr("class", "arc");
        g.append("path")
                .attr("d", arc)
                .style("fill", function( d, i ) {
                    return color(i);
                });
        
        /* Tooltips */
        if ( !$('#d3-tooltip').length ) {
            // Tooltip element doesn't exist, so we need to create it
            d3.select('body')
                    .append('div')
                    .attr('id', 'd3-tooltip')
                    .attr('class', 'tooltip fade')
                    .append('div')
                        .attr('class', 'tooltip-inner');
            $('#d3-tooltip').hide();
        }
        // Event handlers for displaying the tooltips
        g.on('mouseover', function( d ) {
            // Update the tooltip text
            // TODO: Display a percentage?
            $('#d3-tooltip .tooltip-inner')
                    .text(d.data.key);
            
            // Display and position the tooltip
            var tooltip = $('#d3-tooltip');
            tooltip.addClass('fade in')
                    .css('left', (d3.event.pageX - (tooltip.width() / 2)) + 'px')
                    .css('top', (d3.event.pageY - tooltip.height() - 4) + 'px')
                    .show();
        });
        g.on('mousemove', function() {
            // Re-position the tooltip as the mouse is moved
            var tooltip = $('#d3-tooltip');
            tooltip.css('left', (d3.event.pageX - (tooltip.width() / 2)) + 'px')
                    .css('top', (d3.event.pageY - tooltip.height() - 4) + 'px');
        });
        svg.on('mouseout', function() {
            $('#d3-tooltip').hide();
        });

        g.exit().remove();

        /* Legend */
        $('#legend').empty();

        var legendWidth = $('#legend').width();
        var legendHeight = $('#legend').height();

        var legendSVG = d3.select("#legend")
                .append('svg')
                .attr("width", legendWidth)
                .attr("height", legendHeight)
                .append('g');

        var legend = legendSVG.selectAll('g')
                .data(crimeSummary)
                .enter()
                .append('g')
                .attr("transform", function( d, i ) {
                    return "translate(0," + i * 18 + ")";
                });

        // Add a rect element to handle mouse events - text and g elements
        //  only "activate" on filled areas (individual letters, the circles, 
        //  etc.), whereas the rect will react to the entire area.
        legend.append('rect')
                .attr('opacity', 0)
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', legendWidth)
                .attr('height', 18)
                .on('mouseenter', function( d, i ) {
                    $($('.legend-text')[i]).addClass('bold enlarge');
                    $($('g.arc')[i]).addClass('enlarge');
                })
                .on('mouseleave', function( d, i ) {
                    $($('.legend-text')[i]).removeClass('bold enlarge');
                    $($('g.arc')[i]).removeClass('enlarge');
                })
                ;

        legend.append('circle')
                .attr("class", "dot")
                .attr("r", 6)
                .attr("cx", 10)
                .attr("cy", 10)
                .style("fill", function( d, i ) {
                    return color(i);
                });

        legend.append("text")
                .attr("x", 35)
                .attr("y", 15)
                .attr("font-size", "12px")
                .attr('pointer-events', 'none')
                .attr('class', 'legend-text')
                .text(function( d ) {
                    return d.key;
                });

        legend.exit().remove();
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
        if ( (!str.split || !str.length) ) {
            throw "First argument must be a string.";
        }

        parts = str.split('-');
        for ( var x = 0, ln = parts.length; x < ln; x++ ) {
            parts[x] = parts[x].substr(0, 1).toUpperCase() + parts[x].substr(1).toLowerCase();
        }

        return parts.join(' ');
    }

    init();
});
