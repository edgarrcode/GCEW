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
    this._div.innerHTML = '<div class="VsTopBar"><h4>African Americans:</h4>' + 
    (feature ?
      '<div class="VsStateTitle"><b>' + feature.name + '</b></div></div>' +
      '<div class="VSBottomBar">' +
      '<div class="PopGrowthWrapper">' + 'Population Growth: ' + '<div>' + feature.aaPopGrowth + '%' + '</div>' + '</div>' +
      '<div class="EnrollGrowthWrapper">' + 'Enrollment Growth: ' + '<div>' + feature.aaEnrollGrowth + '%' + '</div>' + '</div>' +
      '</div>'
      : '<b>Please hover over a state</b>'
    );
  };

  info.addTo(map);


  // get color depending on population density value
  function getColor(d) {
    return d > 80 ? '#045a8d' :
        d > 60   ? '#2b8cbe' :
        d > 40   ? '#74a9cf' :
        d > 20   ? '#bdc9e1' :
        d > 0   ? '#f1eef6' :
        '#f00';
  }

  function style(feature) {
    return {
      weight: 1,
      opacity: 1,
      color: '#047cc3',
      fillOpacity: 0.9,
      fillColor: getColor(feature.properties.aaPopGrowth)
    };
  }

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 1,
      color: '#047cc3',
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

    var aTitle = '<div class="legendTitleWrapper">African Americans<div>Population Growth</div></div>',
    div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 20, 40, 60, 80],
      labels = ['<i style="background:#f00; margin-left:10px;"></i> Less than 0'],
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