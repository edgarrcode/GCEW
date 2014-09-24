  var map = L.map('map',{scrollWheelZoom: false}).setView([37.8, -96], 4);

  L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'edgarr.iig85lao'
  }).addTo(map);


  // control that shows state info on hover
  var info = L.control({position: 'bottomleft'});

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };

  info.update = function (feature) {
    this._div.innerHTML = '<div class="VsTopBar"><h4>Whites:</h4>' + 
    (feature ?
      '<div class="VsStateTitle"><b>' + feature.name + '</b></div></div>' +
      '<div class="VSBottomBar">' +
      '<div class="PopGrowthWrapper">' + 'Population Growth: ' + '<div>' + feature.wPopGrowth + '%' + '</div>' + '</div>' +
      '<div class="EnrollGrowthWrapper">' + 'Enrollment Growth: ' + '<div>' + feature.wEnrollGrowth + '%' + '</div>' + '</div>' +
      '</div>'
      : '<b>Please hover over a state</b>'
    );
  };

  info.addTo(map);


  // get color depending on population density value
  function getColor(d) {
    return d > 80 ? '#feebe2' :
        d > 60   ? '#fbb4b9' :
        d > 40   ? '#f768a1' :
        d > 20   ? '#c51b8a' :
        '#7a0177';
  }

  function style(feature) {
    return {
      weight: 1,
      opacity: 0.25,
      color: '#fb017e',
      fillOpacity: 0.8,
      fillColor: getColor(feature.properties.wEnrollGrowth)
    };
  }

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 1,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
    }

    info.update(layer.feature.properties);
  }

  var geojson;

  function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
  }

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });
  }

  geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);

  // map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    var aTitle = '<div class="legendTitleWrapper">Whites<div>Enrollment Growth</div></div>',
    div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 20, 40, 60, 80],
      labels = [],
      from, to;

    for (var i = 0; i < grades.length; i++) {
      from = grades[i];
      to = grades[i + 1];

      labels.push(
        '<div class="aGrade"><i style="background:' + getColor(from + 1) + '"></i> ' +
        from + (to ? '% &ndash; ' + to : '+'));
    }

    div.innerHTML = aTitle + labels.join('%</div>');
    return div;
  };

  legend.addTo(map);