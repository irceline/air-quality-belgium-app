var lastChildPhenomenonId;//= {};
function changeWMS(phenomenonId, hourComputed, dayComputed, boundingbox){
// fix
// add to css: .leaflet-tile {-webkit-backface-visibility: visible !important;}
L.Browser.webkit3d = false;
// cumstom behaviour double-click for zoom to phenomenon extend
if ((lastChildPhenomenonId == phenomenonId && boundingbox != [])||(typeof initialPhenomenon === 'undefined'&& boundingbox != [])){
	Map.map.fitBounds(boundingbox)
	initialPhenomenon = -1;
}
if(lastChildPhenomenonId == {} || lastChildPhenomenonId == phenomenonId){
	console.log('same selection');
	return ;
}
// different aggregations of the same pollutant (PM10):
if (phenomenonId == 5){
    this.pm10_current24 = L.tileLayer.wms("http://geo.irceline.be/wms", {
		layers: 'rio:pm10_actueel24',
		transparent: true,
		format: 'image/png',
		cql_filter: timestring,
		opacity: 0.7,
		projection: 'EPSG:4326',
		pane: 'tilePane',
		zIndex: -9998,
		units: 'm'
    }).addTo(Map.map);
    this.pm10_current = L.tileLayer.wms("http://geo.irceline.be/wms", {
		layers: 'rio:pm10_actueel',
		transparent: true,
		format: 'image/png',
		cql_filter: timestring,
		opacity: 0.7,
		visibility: true,
		pane: 'tilePane',
		zIndex: -9998,
		projection: 'EPSG:4326',
		units: 'm'
    });
		this.pm10_daily_mean = new L.LayerGroup();
    this.pm10_daily_mean_rio = L.tileLayer.wms("http://geo.irceline.be/wms", {
		layers: 'rio:pm10_daggemiddelde',
		transparent: true,
		format: 'image/png',
		cql_filter: timestring_day,
		opacity: 0.7,
		visibility: true,
		pane: 'tilePane',
		zIndex: -9998,
		projection: 'EPSG:4326',
		units: 'm'
    }).addTo(pm10_daily_mean);
		this.pm10_daily_mean_station = L.tileLayer.wms("http://geo.irceline.be/wms", {
		layers: 'realtime:pm10_station_daggemiddelde',
		transparent: true,
		format: 'image/png',
		cql_filter: timestring_day,
		visibility: true,
		pane: 'tilePane',
		zIndex: -9997,
		projection: 'EPSG:4326',
		units: 'm'
		}).addTo(pm10_daily_mean);
	// the forecast layers
	this.imageUrlPM10day0 = 'http://www.irceline.be/air/forecast/map/air_quality_PM10ovl_day0.png';
	this.imageUrlPM10day1 = 'http://www.irceline.be/air/forecast/map/air_quality_PM10ovl_day1.png';
	this.imageUrlPM10day2 = 'http://www.irceline.be/air/forecast/map/air_quality_PM10ovl_day2.png';
	this.imageBounds = [[49.42970232967725, 2.2959900496768988], [51.54563342675961, 7.546266537830604]];
	this.pm10day0 = L.imageOverlay(imageUrlPM10day0, imageBounds, {transparent: true, opacity: 0.7, pane: 'tilePane', zIndex: -9998, projection: 'EPSG:4326', units: 'm'});
	this.pm10day1 = L.imageOverlay(imageUrlPM10day1, imageBounds, {transparent: true, opacity: 0.7, pane: 'tilePane', zIndex: -9998, projection: 'EPSG:4326', units: 'm'});
	this.pm10day2 = L.imageOverlay(imageUrlPM10day2, imageBounds, {transparent: true, opacity: 0.7, pane: 'tilePane', zIndex: -9998, projection: 'EPSG:4326', units: 'm'});
    // add layers control
    this.baseLayers = {
		"current running 24 hour mean PM10": this.pm10_current24,
		"current hourly mean PM10": this.pm10_current,
		"daily mean (yesterday) PM10": this.pm10_daily_mean,
		"forecast - daily mean today": this.pm10day0,
		"forecast - daily mean tomorrow": this.pm10day1,
		"forecast - daily mean in 2 days": this.pm10day2
    };
    this.pm10ControlLayer = L.control.layers(this.baseLayers, null, {
      position: 'bottomright',
      collapsed: true
    }).addTo(Map.map);
		Map.map.on('baselayerchange', function (eventLayer) {
		    if (eventLayer.name === 'daily mean (yesterday) PM10') {
		        Map.map.removeLayer(Map.stationMarkers);
		    } else if (eventLayer.name === 'forecast - daily mean today') {
		        Map.map.removeLayer(Map.stationMarkers);
		    } else if (eventLayer.name === 'forecast - daily mean tomorrow') {
		        Map.map.removeLayer(Map.stationMarkers);
		    } else if (eventLayer.name === 'forecast - daily mean in 2 days') {
		        Map.map.removeLayer(Map.stationMarkers);
		    } else {
		        Map.map.addLayer(Map.stationMarkers);
		    }
		});
}
// clean-up on change phenomenon
if (phenomenonId != 5){
	console.log("remove layers");
	if (Map.map.hasLayer(this.pm10_current24)){
			Map.map.removeLayer(this.pm10_current24)
			this.pm10ControlLayer.removeLayer(this.pm10_current24);
			this.pm10ControlLayer.removeLayer(this.pm10_current);
			this.pm10ControlLayer.removeLayer(this.pm10_daily_mean);
			this.pm10ControlLayer.removeLayer(this.pm10day0);
			this.pm10ControlLayer.removeLayer(this.pm10day1);
			this.pm10ControlLayer.removeLayer(this.pm10day2);
			Map.map.removeControl(pm10ControlLayer)
		}
	if (Map.map.hasLayer(this.pm10_current)){
			Map.map.removeLayer(this.pm10_current)
			this.pm10ControlLayer.removeLayer(this.pm10_current24);
			this.pm10ControlLayer.removeLayer(this.pm10_current);
			this.pm10ControlLayer.removeLayer(this.pm10_daily_mean);
			this.pm10ControlLayer.removeLayer(this.pm10day0);
			this.pm10ControlLayer.removeLayer(this.pm10day1);
			this.pm10ControlLayer.removeLayer(this.pm10day2);
			Map.map.removeControl(pm10ControlLayer)
		}
	if (Map.map.hasLayer(this.pm10_daily_mean)){
			Map.map.removeLayer(this.pm10_daily_mean)
			this.pm10ControlLayer.removeLayer(this.pm10_current24);
			this.pm10ControlLayer.removeLayer(this.pm10_current);
			this.pm10ControlLayer.removeLayer(this.pm10_daily_mean);
			this.pm10ControlLayer.removeLayer(this.pm10day0);
			this.pm10ControlLayer.removeLayer(this.pm10day1);
			this.pm10ControlLayer.removeLayer(this.pm10day2);
			Map.map.removeControl(pm10ControlLayer)
	  }
	if (Map.map.hasLayer(this.pm10day0)){
			Map.map.removeLayer(this.pm10day0)
			this.pm10ControlLayer.removeLayer(this.pm10_current24);
			this.pm10ControlLayer.removeLayer(this.pm10_current);
			this.pm10ControlLayer.removeLayer(this.pm10_daily_mean);
			this.pm10ControlLayer.removeLayer(this.pm10day0);
			this.pm10ControlLayer.removeLayer(this.pm10day1);
			this.pm10ControlLayer.removeLayer(this.pm10day2);
			this.pm10ControlLayer.removeLayer(this.stationMarkers);
			this.map.removeLayer(this.stationMarkers);
			Map.map.removeControl(pm10ControlLayer)
	}
	if (Map.map.hasLayer(this.pm10day1)){
			Map.map.removeLayer(this.pm10day1)
			this.pm10ControlLayer.removeLayer(this.pm10_current24);
			this.pm10ControlLayer.removeLayer(this.pm10_current);
			this.pm10ControlLayer.removeLayer(this.pm10_daily_mean);
			this.pm10ControlLayer.removeLayer(this.pm10day0);
			this.pm10ControlLayer.removeLayer(this.pm10day1);
			this.pm10ControlLayer.removeLayer(this.pm10day2);
			Map.map.removeControl(pm10ControlLayer)
	}
	if (Map.map.hasLayer(this.pm10day2)){
			Map.map.removeLayer(this.pm10day2);
			this.pm10ControlLayer.removeLayer(this.pm10_current24);
			this.pm10ControlLayer.removeLayer(this.pm10_current);
			this.pm10ControlLayer.removeLayer(this.pm10_daily_mean);
			this.pm10ControlLayer.removeLayer(this.pm10day0);
			this.pm10ControlLayer.removeLayer(this.pm10day1);
			this.pm10ControlLayer.removeLayer(this.pm10day2);
			Map.map.removeControl(pm10ControlLayer)
	}
}
// different aggregations of O3 (phenomenonId == 7):
if (phenomenonId == 7){
    this.o3_current = L.tileLayer.wms("http://geo.irceline.be/wms", {
		layers: 'rio:o3_actueel',
		transparent: true,
		format: 'image/png',
		cql_filter: timestring,
		opacity: 0.7,
		projection: 'EPSG:4326',
		pane: 'tilePane',
		zIndex: -9998,
		units: 'm'
    }).addTo(Map.map);
		this.o3_current8 = new L.LayerGroup();
    this.o3_current8_rio = L.tileLayer.wms("http://geo.irceline.be/wms", {
		layers: 'rio:o3_actueel8',
		transparent: true,
		format: 'image/png',
		cql_filter: timestring,
		opacity: 0.7,
		visibility: true,
		pane: 'tilePane',
		zIndex: -9998,
		projection: 'EPSG:4326',
		units: 'm'
    }).addTo(o3_current8);
		this.o3_current8_station = L.tileLayer.wms("http://geo.irceline.be/wms", {
		layers: 'realtime:o3_station_actueel8',
		transparent: true,
		format: 'image/png',
		cql_filter: timestring,
		visibility: true,
		pane: 'tilePane',
		zIndex: -9997,
		projection: 'EPSG:4326',
		units: 'm'
		}).addTo(o3_current8);

		// this.o3_daily_mean = new L.LayerGroup();
    // this.o3_daily_mean_rio = L.tileLayer.wms("http://geo.irceline.be/wms", {
		// layers: 'rio:o3_daggemiddelde',
		// transparent: true,
		// format: 'image/png',
		// cql_filter: timestring_day,
		// opacity: 0.7,
		// visibility: true,
		// pane: 'tilePane',
		// zIndex: -9998,
		// projection: 'EPSG:4326',
		// units: 'm'
    // }).addTo(o3_daily_mean);
		// this.o3_daily_mean_station = L.tileLayer.wms("http://geo.irceline.be/wms", {
		// layers: 'realtime:o3_station_daggemiddelde',
		// transparent: true,
		// format: 'image/png',
		// cql_filter: timestring_day,
		// visibility: true,
		// pane: 'tilePane',
		// zIndex: -9997,
		// projection: 'EPSG:4326',
		// units: 'm'
		// }).addTo(o3_daily_mean);
	// the forecast layers
	this.imageUrlo3day0 = 'http://www.irceline.be/air/forecast/map/air_quality_O3max_day0.png';
	this.imageUrlo3day1 = 'http://www.irceline.be/air/forecast/map/air_quality_O3max_day1.png';
	this.imageUrlo3day2 = 'http://www.irceline.be/air/forecast/map/air_quality_O3max_day2.png';
	this.imageBounds = [[49.42970232967725, 2.2959900496768988], [51.54563342675961, 7.546266537830604]];
	this.o3day0 = L.imageOverlay(imageUrlo3day0, imageBounds, {transparent: true, opacity: 0.7, pane: 'tilePane', zIndex: -9998, projection: 'EPSG:4326', units: 'm'});
	this.o3day1 = L.imageOverlay(imageUrlo3day1, imageBounds, {transparent: true, opacity: 0.7, pane: 'tilePane', zIndex: -9998, projection: 'EPSG:4326', units: 'm'});
	this.o3day2 = L.imageOverlay(imageUrlo3day2, imageBounds, {transparent: true, opacity: 0.7, pane: 'tilePane', zIndex: -9998, projection: 'EPSG:4326', units: 'm'});
    // add layers control
    this.baseLayers = {
		"current hourly mean": this.o3_current,
		"current 8 hour mean": this.o3_current8,
		// "daily mean (yesterday) PM10": this.o3_daily_mean,
		"forecast - daily mean today": this.o3day0,
		"forecast - daily mean tomorrow": this.o3day1,
		"forecast - daily mean in 2 days": this.o3day2
    };
    this.o3ControlLayer = L.control.layers(this.baseLayers, null, {
      position: 'bottomright',
      collapsed: true
    }).addTo(Map.map);
		Map.map.on('baselayerchange', function (eventLayer) {
		    if (eventLayer.name === 'current 8 hour mean') {
		        Map.map.removeLayer(Map.stationMarkers);
		    } else if (eventLayer.name === 'forecast - daily mean today') {
		        Map.map.removeLayer(Map.stationMarkers);
		    } else if (eventLayer.name === 'forecast - daily mean tomorrow') {
		        Map.map.removeLayer(Map.stationMarkers);
		    } else if (eventLayer.name === 'forecast - daily mean in 2 days') {
		        Map.map.removeLayer(Map.stationMarkers);
		    } else {
		        Map.map.addLayer(Map.stationMarkers);
		    }
		});
}
// clean-up on change phenomenon
if (phenomenonId != 7){
	console.log("remove layers");
	if (Map.map.hasLayer(this.o3_current)){
			Map.map.removeLayer(this.o3_current)
			this.o3ControlLayer.removeLayer(this.o3_current);
			this.o3ControlLayer.removeLayer(this.o3_current8);
			// this.o3ControlLayer.removeLayer(this.o3_daily_mean);
			this.o3ControlLayer.removeLayer(this.o3day0);
			this.o3ControlLayer.removeLayer(this.o3day1);
			this.o3ControlLayer.removeLayer(this.o3day2);
			Map.map.removeControl(o3ControlLayer)
		}
	if (Map.map.hasLayer(this.o3_current8)){
			Map.map.removeLayer(this.o3_current8)
			this.o3ControlLayer.removeLayer(this.o3_current);
			this.o3ControlLayer.removeLayer(this.o3_current8);
			// this.o3ControlLayer.removeLayer(this.o3_daily_mean);
			this.o3ControlLayer.removeLayer(this.o3day0);
			this.o3ControlLayer.removeLayer(this.o3day1);
			this.o3ControlLayer.removeLayer(this.o3day2);
			Map.map.removeControl(o3ControlLayer)
		}
	if (Map.map.hasLayer(this.o3_daily_mean)){
			Map.map.removeLayer(this.o3_daily_mean)
			this.o3ControlLayer.removeLayer(this.o3_current);
			this.o3ControlLayer.removeLayer(this.o3_current8);
			// this.o3ControlLayer.removeLayer(this.o3_daily_mean);
			this.o3ControlLayer.removeLayer(this.o3day0);
			this.o3ControlLayer.removeLayer(this.o3day1);
			this.o3ControlLayer.removeLayer(this.o3day2);
			Map.map.removeControl(o3ControlLayer)
	  }
	if (Map.map.hasLayer(this.o3day0)){
			Map.map.removeLayer(this.o3day0)
			this.o3ControlLayer.removeLayer(this.o3_current);
			this.o3ControlLayer.removeLayer(this.o3_current8);
			// this.o3ControlLayer.removeLayer(this.o3_daily_mean);
			this.o3ControlLayer.removeLayer(this.o3day0);
			this.o3ControlLayer.removeLayer(this.o3day1);
			this.o3ControlLayer.removeLayer(this.o3day2);
			this.map.removeLayer(this.stationMarkers);
			Map.map.removeControl(o3ControlLayer)
	}
	if (Map.map.hasLayer(this.o3day1)){
			Map.map.removeLayer(this.o3day1)
			this.o3ControlLayer.removeLayer(this.o3_current);
			this.o3ControlLayer.removeLayer(this.o3_current8);
			// this.o3ControlLayer.removeLayer(this.o3_daily_mean);
			this.o3ControlLayer.removeLayer(this.o3day0);
			this.o3ControlLayer.removeLayer(this.o3day1);
			this.o3ControlLayer.removeLayer(this.o3day2);
			Map.map.removeControl(o3ControlLayer)
	}
	if (Map.map.hasLayer(this.o3day2)){
			Map.map.removeLayer(this.o3day2);
			this.o3ControlLayer.removeLayer(this.o3_current);
			this.o3ControlLayer.removeLayer(this.o3_current8);
			// this.o3ControlLayer.removeLayer(this.o3_daily_mean);
			this.o3ControlLayer.removeLayer(this.o3day0);
			this.o3ControlLayer.removeLayer(this.o3day1);
			this.o3ControlLayer.removeLayer(this.o3day2);
			Map.map.removeControl(o3ControlLayer)
	}
}
if (phenomenonId == 8){
        this.no2_current = L.tileLayer.wms("http://geo.irceline.be/wms", {
          layers: 'rio:no2_actueel',
          transparent: true,
          format: 'image/png',
          cql_filter: timestring,
          opacity: 0.7,
          visibility: true,
          units: 'm'
        });
        Map.map.addLayer(this.no2_current);
}
if (phenomenonId != 8 && Map.map.hasLayer(this.no2_current)){
  Map.map.removeLayer(this.no2_current);
}
if (phenomenonId == 391){
        this.bc_current = L.tileLayer.wms("http://geo.irceline.be/wms", {
          layers: 'rio:bc_actueel',
          transparent: true,
          format: 'image/png',
          cql_filter: timestring,
          opacity: 0.7,
          visibility: true,
          units: 'm'
        }).addTo(Map.map);
}
if (phenomenonId != 391 && Map.map.hasLayer(this.bc_current)){
  Map.map.removeLayer(this.bc_current);
}
if (phenomenonId == 6001){
        this.pm25_current = L.tileLayer.wms("http://geo.irceline.be/wms", {
          layers: 'rio:pm25_actueel',
          transparent: true,
          format: 'image/png',
          cql_filter: timestring,
          opacity: 0.7,
          visibility: true,
          units: 'm'
        }).addTo(Map.map);
}
if (phenomenonId != 6001 && Map.map.hasLayer(this.pm25_current)){
  Map.map.removeLayer(this.pm25_current);
}
lastChildPhenomenonId = phenomenonId;
}
