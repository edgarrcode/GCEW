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
    this._div.innerHTML = '<div class="VsTopBar"><h4>Career Clusters 2018:</h4>' + 
    (feature ?
      '<div class="VsStateTitle"><b>' + feature.name + '</b></div></div>' +
      '<div class="VSBottomBar">' +
      '<div class="PopGrowthWrapper">' + 'High School Jobs: ' + '<div>' + feature.highSchoolJobs2018St + '</div>' + '</div>' +
      '<div class="EnrollGrowthWrapper">' + 'Postsecondary Jobs' + '<div>' + feature.postSecondaryJobs2018St + '</div>' + '</div>' +
      '</div>' + 
      '<div class="legendOpenPDF">Please click on state to open PDF</div>'
      : '<b>Please hover over a state</b>'
    );

  };

  info.addTo(map);


  // get color depending on population density value
  function getColor(d) {
    return d > 10000000 ? '#7a0177' :
        d > 5000000   ? '#ae017e' :
        d > 1000000   ? '#dd3497' :
        d > 750000   ? '#f768a1' :
        d > 500000   ? '#fa9fb5' :
        d > 200000   ? '#fcc5c0' :
        '#feebe2';
  }

  function style(feature) {
    return {
      weight: 1,
      opacity: 1,
      color: '#fb017e',
      fillOpacity: 1,
      fillColor: getColor(feature.properties.highSchoolJobs2018)
    };
  }

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 1,
      color: '#fb017e',
      dashArray: '',
      fillOpacity: 1
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
      //mouseout: resetHighlight,
      click: function () {window.open(feature.properties.attachedFile)}
    });
  }

  geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);

  // map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    var aTitle = '<div class="legendTitleWrapper"><div>High School Jobs, 2018</div></div>',
    div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 200000, 500000, 750000, 1000000, 5000000, 10000000],
      labels = [],
      from, to;

    for (var i = 0; i < grades.length; i++) {
      from = grades[i];
      to = grades[i + 1];

      labels.push(
        '<div class="aGrade"><i style="background:' + getColor(from + 1) + '"></i> ' +
        from + (to ? ' &ndash; ' + to : '+'));
    }

    div.innerHTML = aTitle + labels.join('</div>');
    return div;
  };

  legend.addTo(map);