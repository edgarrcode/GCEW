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
    this._div.innerHTML = '<div class="VsTopBar"><h4>Hispanics:</h4>' + 
    (feature ?
      '<div class="VsStateTitle"><b>' + feature.name + '</b></div></div>' +
      '<div class="VSBottomBar">' +
      '<div class="PopGrowthWrapper">' + 'Population Growth: ' + '<div>' + feature.hPopGrowth + '%' + '</div>' + '</div>' +
      '<div class="EnrollGrowthWrapper">' + 'Enrollment Growth: ' + '<div>' + feature.hEnrollGrowth + '%' + '</div>' + '</div>' +
      '</div>'
      : '<b>Please hover over a state</b>'
    );
  };

  info.addTo(map);


  // get color depending on population density value
  function getColor(d) {
    return d > 80 ? '#006d2c' :
        d > 60   ? '#31a354' :
        d > 40   ? '#74c476' :
        d > 20   ? '#bae4b3' :
        '#edf8e9';
  }

  function style(feature) {
    return {
      weight: 1,
      opacity: 0.25,
      color: '#111',
      fillOpacity: 0.8,
      fillColor: getColor(feature.properties.hEnrollGrowth)
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

    var aTitle = '<div class="legendTitleWrapper">Hispanics<div>Enrollment Growth</div></div>',
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