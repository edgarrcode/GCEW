function getColor(t){return t>80?"#000000":t>60?"#252525":t>40?"#636363":t>20?"#969696":t>0?"#dddddd":"#f00"}function style(t){return{weight:1,opacity:1,color:"#777",fillOpacity:.9,fillColor:getColor(t.properties.allPopGrowth)}}function highlightFeature(t){var o=t.target;o.setStyle({weight:1,color:"#777",dashArray:"",fillOpacity:.7}),L.Browser.ie||L.Browser.opera||o.bringToFront(),info.update(o.feature.properties)}function resetHighlight(t){geojson.resetStyle(t.target),info.update()}function zoomToFeature(t){map.fitBounds(t.target.getBounds())}function onEachFeature(t,o){o.on({mouseover:highlightFeature,mouseout:resetHighlight,click:zoomToFeature})}var map=L.map("map",{scrollWheelZoom:!1}).setView([37.8,-96],4);L.tileLayer("https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png",{maxZoom:18,attribution:'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',id:"edgarr.iig85lao"}).addTo(map);var info=L.control({position:"bottomleft"});info.onAdd=function(t){return this._div=L.DomUtil.create("div","info"),this.update(),this._div},info.update=function(t){this._div.innerHTML='<div class="VsTopBar"><h4>All Ethnicities:</h4>'+(t?'<div class="VsStateTitle"><b>'+t.name+'</b></div></div><div class="VSBottomBar"><div class="PopGrowthWrapper">Population Growth: <div>'+t.allPopGrowth+'%</div></div><div class="EnrollGrowthWrapper">Enrollment Growth: <div>'+t.allEnrollGrowth+"%</div></div></div>":"<b>Please hover over a state</b>")},info.addTo(map);var geojson;geojson=L.geoJson(statesData,{style:style,onEachFeature:onEachFeature}).addTo(map);var legend=L.control({position:"bottomright"});legend.onAdd=function(t){for(var o='<div class="legendTitleWrapper">ALL Ethnicities<div>Population Growth</div></div>',e=L.DomUtil.create("div","info legend"),i=[0,20,40,60,80],a=['<i style="background:#f00; margin-left:10px;"></i> Less than 0'],r,n,l=0;l<i.length;l++)r=i[l],n=i[l+1],a.push('<div class="aGrade"><i style="background:'+getColor(r+1)+'"></i> '+r+(n?"% &ndash; "+n:"+"));return e.innerHTML=o+a.join("%</div>"),e},legend.addTo(map);