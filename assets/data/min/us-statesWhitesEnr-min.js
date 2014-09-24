function getColor(o){return o>80?"#feebe2":o>60?"#fbb4b9":o>40?"#f768a1":o>20?"#c51b8a":"#7a0177"}function style(o){return{weight:1,opacity:.25,color:"#fb017e",fillOpacity:.8,fillColor:getColor(o.properties.wEnrollGrowth)}}function highlightFeature(o){var t=o.target;t.setStyle({weight:1,color:"#666",dashArray:"",fillOpacity:.7}),L.Browser.ie||L.Browser.opera||t.bringToFront(),info.update(t.feature.properties)}function resetHighlight(o){geojson.resetStyle(o.target),info.update()}function zoomToFeature(o){map.fitBounds(o.target.getBounds())}function onEachFeature(o,t){t.on({mouseover:highlightFeature,mouseout:resetHighlight,click:zoomToFeature})}var map=L.map("map",{scrollWheelZoom:!1}).setView([37.8,-96],4);L.tileLayer("https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png",{maxZoom:18,attribution:'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',id:"edgarr.iig85lao"}).addTo(map);var info=L.control({position:"bottomleft"});info.onAdd=function(o){return this._div=L.DomUtil.create("div","info"),this.update(),this._div},info.update=function(o){this._div.innerHTML='<div class="VsTopBar"><h4>Whites:</h4>'+(o?'<div class="VsStateTitle"><b>'+o.name+'</b></div></div><div class="VSBottomBar"><div class="PopGrowthWrapper">Population Growth: <div>'+o.wPopGrowth+'%</div></div><div class="EnrollGrowthWrapper">Enrollment Growth: <div>'+o.wEnrollGrowth+"%</div></div></div>":"<b>Please hover over a state</b>")},info.addTo(map);var geojson;geojson=L.geoJson(statesData,{style:style,onEachFeature:onEachFeature}).addTo(map);var legend=L.control({position:"bottomright"});legend.onAdd=function(o){for(var t='<div class="legendTitleWrapper">Whites<div>Enrollment Growth</div></div>',e=L.DomUtil.create("div","info legend"),i=[0,20,40,60,80],r=[],a,n,l=0;l<i.length;l++)a=i[l],n=i[l+1],r.push('<div class="aGrade"><i style="background:'+getColor(a+1)+'"></i> '+a+(n?"% &ndash; "+n:"+"));return e.innerHTML=t+r.join("%</div>"),e},legend.addTo(map);