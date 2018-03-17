var lastChildPhenomenonId;//= {};
function changeWMS(phenomenonId, hourComputed, dayComputed, boundingbox) {
// fix
// add to css: .leaflet-tile {-webkit-backface-visibility: visible !important;}
    L.Browser.webkit3d = false;
// cumstom behaviour double-click for zoom to phenomenon extend
    if ((lastChildPhenomenonId === phenomenonId && boundingbox !== []) || (typeof initialPhenomenon === 'undefined' && boundingbox !== [])) {
        Map.map.fitBounds(boundingbox);
        initialPhenomenon = -1;
    }
    if (lastChildPhenomenonId === {} || lastChildPhenomenonId === phenomenonId) {
        console.log('same selection');
        return;
    }
// convert lastupdate to ISO - cf TIME parameter WMS
    var now=moment(lastupdate).toISOString();
    var day_0=moment(lastupdate).format('YYYY-MM-DD').concat('T00:00:00.000Z');
    var day_0_text=moment(lastupdate).format('YYYY-MM-DD');
    var day_min_1=moment(lastupdate).subtract(1, 'days').format('YYYY-MM-DD').concat('T00:00:00.000Z');
    var day_min_1_text=moment(lastupdate).subtract(1, 'days').format('YYYY-MM-DD');
    console.log("Yesterday: " + day_min_1);
    console.log("Today: " + day_0);
// different aggregations of the same pollutant (PM10):
    if (phenomenonId === "5") {
        this.pm10_current = L.tileLayer.wms("http://geo.irceline.be/rio/wms", {
            layers: 'rio:pm10_hmean_1x1',
            transparent: true,
            format: 'image/png',
            time: now,
            tiled: true,
            opacity: 0.7
        }).addTo(Map.map);
        this.pm10_current24 = new L.LayerGroup();
        this.pm10_current24_rio = L.tileLayer.wms("http://geo.irceline.be/rio/wms", {
            layers: 'rio:pm10_24hmean_1x1',
            transparent: true,
            format: 'image/png',
            time: now,
            tiled: true,
            opacity: 0.7,
            zIndex: -9998
        }).addTo(pm10_current24);
        this.pm10_current24_station = L.tileLayer.wms("http://geo.irceline.be/realtime/wms", {
            layers: 'realtime:pm10_24hmean_station',
            transparent: true,
            format: 'image/png',
            now: now,
            tiled: true,
            opacity: 0.7,
            zIndex: -9997
        }).addTo(pm10_current24);
        this.pm10_daily_mean = new L.LayerGroup();
        this.pm10_daily_mean_rio = L.tileLayer.wms("http://geo.irceline.be/rio/wms", {
            layers: 'rio:pm10_dmean',
            transparent: true,
            format: 'image/png',
            time: day_min_1,
            tiled: true,
            opacity: 0.7,
            zIndex: -9998
        }).addTo(pm10_daily_mean);
        this.pm10_daily_mean_station = L.tileLayer.wms("http://geo.irceline.be/realtime/wms", {
            layers: 'realtime:pm10_dmean_station',
            transparent: true,
            format: 'image/png',
            time: day_min_1,
            tiled: true,
            zIndex: -9997
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
            "current hourly mean PM10": this.pm10_current,
            "current running 24 hour mean PM10": this.pm10_current24,
            "daily mean (day_min_1) PM10": this.pm10_daily_mean,
            "forecast - daily mean today": this.pm10day0,
            "forecast - daily mean tomorrow": this.pm10day1,
            "forecast - daily mean in 2 days": this.pm10day2
        };
        this.pm10ControlLayer = L.control.layers(this.baseLayers, null, {
            position: 'bottomright',
            collapsed: true
        }).addTo(Map.map);
        Map.map.on('baselayerchange', function (eventLayer) {
            if (eventLayer.name === 'current running 24 hour mean PM10') {
                Map.map.removeLayer(Map.stationMarkers);
            } else if (eventLayer.name === 'daily mean (day_min_1) PM10') {
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
    if (phenomenonId !== "5") {
        console.log("remove layers");
        if (Map.map.hasLayer(this.pm10_current24)) {
            Map.map.removeLayer(this.pm10_current24);
            this.pm10ControlLayer.removeLayer(this.pm10_current24);
            this.pm10ControlLayer.removeLayer(this.pm10_current);
            this.pm10ControlLayer.removeLayer(this.pm10_daily_mean);
            this.pm10ControlLayer.removeLayer(this.pm10day0);
            this.pm10ControlLayer.removeLayer(this.pm10day1);
            this.pm10ControlLayer.removeLayer(this.pm10day2);
            Map.map.removeControl(pm10ControlLayer);
        }
        if (Map.map.hasLayer(this.pm10_current)) {
            Map.map.removeLayer(this.pm10_current);
            this.pm10ControlLayer.removeLayer(this.pm10_current24);
            this.pm10ControlLayer.removeLayer(this.pm10_current);
            this.pm10ControlLayer.removeLayer(this.pm10_daily_mean);
            this.pm10ControlLayer.removeLayer(this.pm10day0);
            this.pm10ControlLayer.removeLayer(this.pm10day1);
            this.pm10ControlLayer.removeLayer(this.pm10day2);
            Map.map.removeControl(pm10ControlLayer);
        }
        if (Map.map.hasLayer(this.pm10_daily_mean)) {
            Map.map.removeLayer(this.pm10_daily_mean);
            this.pm10ControlLayer.removeLayer(this.pm10_current24);
            this.pm10ControlLayer.removeLayer(this.pm10_current);
            this.pm10ControlLayer.removeLayer(this.pm10_daily_mean);
            this.pm10ControlLayer.removeLayer(this.pm10day0);
            this.pm10ControlLayer.removeLayer(this.pm10day1);
            this.pm10ControlLayer.removeLayer(this.pm10day2);
            Map.map.removeControl(pm10ControlLayer);
        }
        if (Map.map.hasLayer(this.pm10day0)) {
            Map.map.removeLayer(this.pm10day0);
            this.pm10ControlLayer.removeLayer(this.pm10_current24);
            this.pm10ControlLayer.removeLayer(this.pm10_current);
            this.pm10ControlLayer.removeLayer(this.pm10_daily_mean);
            this.pm10ControlLayer.removeLayer(this.pm10day0);
            this.pm10ControlLayer.removeLayer(this.pm10day1);
            this.pm10ControlLayer.removeLayer(this.pm10day2);
            this.pm10ControlLayer.removeLayer(this.stationMarkers);
            this.map.removeLayer(this.stationMarkers);
            Map.map.removeControl(pm10ControlLayer);
        }
        if (Map.map.hasLayer(this.pm10day1)) {
            Map.map.removeLayer(this.pm10day1);
            this.pm10ControlLayer.removeLayer(this.pm10_current24);
            this.pm10ControlLayer.removeLayer(this.pm10_current);
            this.pm10ControlLayer.removeLayer(this.pm10_daily_mean);
            this.pm10ControlLayer.removeLayer(this.pm10day0);
            this.pm10ControlLayer.removeLayer(this.pm10day1);
            this.pm10ControlLayer.removeLayer(this.pm10day2);
            Map.map.removeControl(pm10ControlLayer);
        }
        if (Map.map.hasLayer(this.pm10day2)) {
            Map.map.removeLayer(this.pm10day2);
            this.pm10ControlLayer.removeLayer(this.pm10_current24);
            this.pm10ControlLayer.removeLayer(this.pm10_current);
            this.pm10ControlLayer.removeLayer(this.pm10_daily_mean);
            this.pm10ControlLayer.removeLayer(this.pm10day0);
            this.pm10ControlLayer.removeLayer(this.pm10day1);
            this.pm10ControlLayer.removeLayer(this.pm10day2);
            Map.map.removeControl(pm10ControlLayer);
        }
    }
// different aggregations of O3 (phenomenonId === 7):
    if (phenomenonId === "7") {
        this.o3_current = L.tileLayer.wms("http://geo.irceline.be/rio/wms", {
            layers: 'rio:o3_hmean_1x1',
            transparent: true,
            format: 'image/png',
            time: now,
            tiled: true,
            opacity: 0.7,
            zIndex: -9998
        }).addTo(Map.map);
        this.o3_current8 = new L.LayerGroup();
        this.o3_current8_rio = L.tileLayer.wms("http://geo.irceline.be/rio/wms", {
            layers: 'rio:o3_8hmean_1x1',
            transparent: true,
            format: 'image/png',
            time: now,
            tiled: true,
            opacity: 0.7,
            zIndex: -9998
        }).addTo(o3_current8);
        this.o3_current8_station = L.tileLayer.wms("http://geo.irceline.be/realtime/wms", {
            layers: 'realtime:o3_8hmean_station',
            transparent: true,
            format: 'image/png',
            time: now,
            tiled: true,
            zIndex: -9997
        }).addTo(o3_current8);
        this.o3_max_hour = new L.LayerGroup();
        this.o3_max_hour_rio = L.tileLayer.wms("http://geo.irceline.be/rio/wms", {
            layers: 'rio:o3_maxhmean',
            transparent: true,
            format: 'image/png',
            time: day_0,
            tiled: true,
            opacity: 0.7,
            visibility: true,
            zIndex: -9998
        }).addTo(o3_max_hour);
        this.o3_max_hour_station = L.tileLayer.wms("http://geo.irceline.be/realtime/wms", {
            layers: 'realtime:o3_maxhmean_station',
            transparent: true,
            format: 'image/png',
            time: day_0,
            tiled: true,
            zIndex: -9997
        }).addTo(o3_max_hour);
        this.o3_max_8hour = new L.LayerGroup();
        this.o3_max_8hour_rio = L.tileLayer.wms("http://geo.irceline.be/rio/wms", {
            layers: 'rio:o3_max8hmean',
            transparent: true,
            format: 'image/png',
            time: day_0,
            tiled: true,
            opacity: 0.7,
            zIndex: -9998
        }).addTo(o3_max_8hour);
        this.o3_max_8hour_station = L.tileLayer.wms("http://geo.irceline.be/realtime/wms", {
            layers: 'realtime:o3_max8hmean_station',
            transparent: true,
            format: 'image/png',
            time: day_0,
            tiled: true,
            zIndex: -9997
        }).addTo(o3_max_8hour);
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
            "max hourly mean today": this.o3_max_hour,
            "max 8 hour mean today": this.o3_max_8hour,
            "forecast - max hourly mean today": this.o3day0,
            "forecast - max hourly mean tomorrow": this.o3day1,
            "forecast - max hourly mean in 2 days": this.o3day2
        };
        this.o3ControlLayer = L.control.layers(this.baseLayers, null, {
            position: 'bottomright',
            collapsed: true
        }).addTo(Map.map);
        Map.map.on('baselayerchange', function (eventLayer) {
            if (eventLayer.name === 'current 8 hour mean') {
                Map.map.removeLayer(Map.stationMarkers);
            } else if (eventLayer.name === 'max hourly mean today') {
                Map.map.removeLayer(Map.stationMarkers);
            } else if (eventLayer.name === 'max 8 hour mean today') {
                Map.map.removeLayer(Map.stationMarkers);
            } else if (eventLayer.name === 'forecast - max hourly mean today') {
                Map.map.removeLayer(Map.stationMarkers);
            } else if (eventLayer.name === 'forecast - max hourly mean tomorrow') {
                Map.map.removeLayer(Map.stationMarkers);
            } else if (eventLayer.name === 'forecast - max hourly mean in 2 days') {
                Map.map.removeLayer(Map.stationMarkers);
            } else {
                Map.map.addLayer(Map.stationMarkers);
            }
        });
    }
// clean-up on change phenomenon
    if (phenomenonId !== "7") {
        console.log("remove layers");
        if (Map.map.hasLayer(this.o3_current)) {
            Map.map.removeLayer(this.o3_current);
            this.o3ControlLayer.removeLayer(this.o3_current);
            this.o3ControlLayer.removeLayer(this.o3_current8);
            this.o3ControlLayer.removeLayer(this.o3_max_hour);
            this.o3ControlLayer.removeLayer(this.o3_max_8hour);
            this.o3ControlLayer.removeLayer(this.o3day0);
            this.o3ControlLayer.removeLayer(this.o3day1);
            this.o3ControlLayer.removeLayer(this.o3day2);
            Map.map.removeControl(o3ControlLayer);
        }
        if (Map.map.hasLayer(this.o3_current8)) {
            Map.map.removeLayer(this.o3_current8);
            this.o3ControlLayer.removeLayer(this.o3_current);
            this.o3ControlLayer.removeLayer(this.o3_current8);
            this.o3ControlLayer.removeLayer(this.o3_max_hour);
            this.o3ControlLayer.removeLayer(this.o3_max_8hour);
            this.o3ControlLayer.removeLayer(this.o3day0);
            this.o3ControlLayer.removeLayer(this.o3day1);
            this.o3ControlLayer.removeLayer(this.o3day2);
            Map.map.removeControl(o3ControlLayer);
        }
        if (Map.map.hasLayer(this.o3_max_hour)) {
            Map.map.removeLayer(this.o3_max_hour);
            this.o3ControlLayer.removeLayer(this.o3_current);
            this.o3ControlLayer.removeLayer(this.o3_current8);
            this.o3ControlLayer.removeLayer(this.o3_max_hour);
            this.o3ControlLayer.removeLayer(this.o3_max_8hour);
            this.o3ControlLayer.removeLayer(this.o3day0);
            this.o3ControlLayer.removeLayer(this.o3day1);
            this.o3ControlLayer.removeLayer(this.o3day2);
            Map.map.removeControl(o3ControlLayer);
        }
        if (Map.map.hasLayer(this.o3_max_8hour)) {
            Map.map.removeLayer(this.o3_max_8hour);
            this.o3ControlLayer.removeLayer(this.o3_current);
            this.o3ControlLayer.removeLayer(this.o3_current8);
            this.o3ControlLayer.removeLayer(this.o3_max_hour);
            this.o3ControlLayer.removeLayer(this.o3_max_8hour);
            this.o3ControlLayer.removeLayer(this.o3day0);
            this.o3ControlLayer.removeLayer(this.o3day1);
            this.o3ControlLayer.removeLayer(this.o3day2);
            Map.map.removeControl(o3ControlLayer);
        }
        if (Map.map.hasLayer(this.o3day0)) {
            Map.map.removeLayer(this.o3day0);
            this.o3ControlLayer.removeLayer(this.o3_current);
            this.o3ControlLayer.removeLayer(this.o3_current8);
            this.o3ControlLayer.removeLayer(this.o3_max_hour);
            this.o3ControlLayer.removeLayer(this.o3_max_8hour);
            this.o3ControlLayer.removeLayer(this.o3day0);
            this.o3ControlLayer.removeLayer(this.o3day1);
            this.o3ControlLayer.removeLayer(this.o3day2);
            this.map.removeLayer(this.stationMarkers);
            Map.map.removeControl(o3ControlLayer);
        }
        if (Map.map.hasLayer(this.o3day1)) {
            Map.map.removeLayer(this.o3day1);
            this.o3ControlLayer.removeLayer(this.o3_current);
            this.o3ControlLayer.removeLayer(this.o3_current8);
            this.o3ControlLayer.removeLayer(this.o3_max_hour);
            this.o3ControlLayer.removeLayer(this.o3_max_8hour);
            this.o3ControlLayer.removeLayer(this.o3day0);
            this.o3ControlLayer.removeLayer(this.o3day1);
            this.o3ControlLayer.removeLayer(this.o3day2);
            Map.map.removeControl(o3ControlLayer);
        }
        if (Map.map.hasLayer(this.o3day2)) {
            Map.map.removeLayer(this.o3day2);
            this.o3ControlLayer.removeLayer(this.o3_current);
            this.o3ControlLayer.removeLayer(this.o3_current8);
            this.o3ControlLayer.removeLayer(this.o3_max_hour);
            this.o3ControlLayer.removeLayer(this.o3_max_8hour);
            this.o3ControlLayer.removeLayer(this.o3day0);
            this.o3ControlLayer.removeLayer(this.o3day1);
            this.o3ControlLayer.removeLayer(this.o3day2);
            Map.map.removeControl(o3ControlLayer);
        }
    }
    // different aggregations of the same pollutant (NO2):
        if (phenomenonId === "8") {
            this.no2_current = L.tileLayer.wms("http://geo.irceline.be/rio/wms", {
                layers: 'rio:no2_hmean_1x1',
                transparent: true,
                format: 'image/png',
                time: now,
                tiled: true,
                opacity: 0.7,
                zIndex: -9998
            }).addTo(Map.map);
            this.no2_max = new L.LayerGroup();
            this.no2_max_rio = L.tileLayer.wms("http://geo.irceline.be/rio/wms", {
                layers: 'rio:no2_maxhmean',
                transparent: true,
                format: 'image/png',
                time: day_0,
                tiled: true,
                opacity: 0.7,
                zIndex: -9998
            }).addTo(no2_max);
            this.no2_max_station = L.tileLayer.wms("http://geo.irceline.be/realtime/wms", {
                layers: 'realtime:no2_maxhmean_station',
                transparent: true,
                format: 'image/png',
                time: day_0,
                opacity: 0.7,
                zIndex: -9997
            }).addTo(no2_max);
            // the forecast layers
            this.imageUrlNO2day0 = 'http://www.irceline.be/air/forecast/map/air_quality_NO2max_day0.png';
            this.imageUrlNO2day1 = 'http://www.irceline.be/air/forecast/map/air_quality_NO2max_day1.png';
            this.imageUrlNO2day2 = 'http://www.irceline.be/air/forecast/map/air_quality_NO2max_day2.png';
            this.imageBounds = [[49.42970232967725, 2.2959900496768988], [51.54563342675961, 7.546266537830604]];
            this.no2day0 = L.imageOverlay(imageUrlNO2day0, imageBounds, {transparent: true, opacity: 0.7, pane: 'tilePane', zIndex: -9998, projection: 'EPSG:4326', units: 'm'});
            this.no2day1 = L.imageOverlay(imageUrlNO2day1, imageBounds, {transparent: true, opacity: 0.7, pane: 'tilePane', zIndex: -9998, projection: 'EPSG:4326', units: 'm'});
            this.no2day2 = L.imageOverlay(imageUrlNO2day2, imageBounds, {transparent: true, opacity: 0.7, pane: 'tilePane', zIndex: -9998, projection: 'EPSG:4326', units: 'm'});
            // add layers control
            this.baseLayers = {
                "current hourly mean NO2": this.no2_current,
                "highest hourly mean NO2": this.no2_max,
                "forecast - daily mean today": this.no2day0,
                "forecast - daily mean tomorrow": this.no2day1,
                "forecast - daily mean in 2 days": this.no2day2
            };
            this.no2ControlLayer = L.control.layers(this.baseLayers, null, {
                position: 'bottomright',
                collapsed: true
            }).addTo(Map.map);
            Map.map.on('baselayerchange', function (eventLayer) {
                if (eventLayer.name === 'highest hourly mean NO2') {
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
        if (phenomenonId !== "8") {
            console.log("remove layers");
            if (Map.map.hasLayer(this.no2_max)) {
                Map.map.removeLayer(this.no2_max);
                this.no2ControlLayer.removeLayer(this.no2_max);
                this.no2ControlLayer.removeLayer(this.no2_current);
                this.no2ControlLayer.removeLayer(this.no2day0);
                this.no2ControlLayer.removeLayer(this.no2day1);
                this.no2ControlLayer.removeLayer(this.no2day2);
                Map.map.removeControl(no2ControlLayer);
            }
            if (Map.map.hasLayer(this.no2_current)) {
                Map.map.removeLayer(this.no2_current);
                this.no2ControlLayer.removeLayer(this.no2_max);
                this.no2ControlLayer.removeLayer(this.no2_current);
                this.no2ControlLayer.removeLayer(this.no2day0);
                this.no2ControlLayer.removeLayer(this.no2day1);
                this.no2ControlLayer.removeLayer(this.no2day2);
                Map.map.removeControl(no2ControlLayer);
            }
            if (Map.map.hasLayer(this.no2_daily_mean)) {
                Map.map.removeLayer(this.no2_daily_mean);
                this.no2ControlLayer.removeLayer(this.no2_max);
                this.no2ControlLayer.removeLayer(this.no2_current);
                this.no2ControlLayer.removeLayer(this.no2day0);
                this.no2ControlLayer.removeLayer(this.no2day1);
                this.no2ControlLayer.removeLayer(this.no2day2);
                Map.map.removeControl(no2ControlLayer);
            }
            if (Map.map.hasLayer(this.no2day0)) {
                Map.map.removeLayer(this.no2day0);
                this.no2ControlLayer.removeLayer(this.no2_max);
                this.no2ControlLayer.removeLayer(this.no2_current);
                this.no2ControlLayer.removeLayer(this.no2day0);
                this.no2ControlLayer.removeLayer(this.no2day1);
                this.no2ControlLayer.removeLayer(this.no2day2);
                this.no2ControlLayer.removeLayer(this.stationMarkers);
                this.map.removeLayer(this.stationMarkers);
                Map.map.removeControl(no2ControlLayer);
            }
            if (Map.map.hasLayer(this.no2day1)) {
                Map.map.removeLayer(this.no2day1);
                this.no2ControlLayer.removeLayer(this.no2_max);
                this.no2ControlLayer.removeLayer(this.no2_current);
                this.no2ControlLayer.removeLayer(this.no2day0);
                this.no2ControlLayer.removeLayer(this.no2day1);
                this.no2ControlLayer.removeLayer(this.no2day2);
                Map.map.removeControl(no2ControlLayer);
            }
            if (Map.map.hasLayer(this.no2day2)) {
                Map.map.removeLayer(this.no2day2);
                this.no2ControlLayer.removeLayer(this.no2_max);
                this.no2ControlLayer.removeLayer(this.no2_current);
                this.no2ControlLayer.removeLayer(this.no2day0);
                this.no2ControlLayer.removeLayer(this.no2day1);
                this.no2ControlLayer.removeLayer(this.no2day2);
                Map.map.removeControl(no2ControlLayer);
            }
        }
    // different aggregations of the same pollutant (BC):
        if (phenomenonId === "391") {
            this.bc_current = L.tileLayer.wms("http://geo.irceline.be/wms", {
                layers: 'rio:bc_hmean_1x1',
                transparent: true,
                format: 'image/png',
                time: now,
                tiled: true,
                opacity: 0.7,
                zIndex: -9998
            }).addTo(Map.map);
            this.bc_current24 = new L.LayerGroup();
            this.bc_current24_rio = L.tileLayer.wms("http://geo.irceline.be/wms", {
                layers: 'rio:bc_24hmean',
                transparent: true,
                format: 'image/png',
                time: now,
                tiled: true,
                opacity: 0.7,
                zIndex: -9998
            }).addTo(bc_current24);
            this.bc_current24_station = L.tileLayer.wms("http://geo.irceline.be/wms", {
                layers: 'realtime:bc_24hmean_station',
                transparent: true,
                format: 'image/png',
                time: now,
                tiled: true,
                opacity: 0.7,
                zIndex: -9997
            }).addTo(bc_current24);
            this.bc_daily_mean = new L.LayerGroup();
            this.bc_daily_mean_rio = L.tileLayer.wms("http://geo.irceline.be/wms", {
                layers: 'rio:bc_dmean',
                transparent: true,
                format: 'image/png',
                time: day_min_1,
                tiled: true,
                opacity: 0.7,
                zIndex: -9998
            }).addTo(bc_daily_mean);
            this.bc_daily_mean_station = L.tileLayer.wms("http://geo.irceline.be/wms", {
                layers: 'realtime:bc_dmean_station',
                transparent: true,
                format: 'image/png',
                time: day_min_1,
                tiled: true,
                zIndex: -9997
            }).addTo(bc_daily_mean);
            // add layers control
            this.baseLayers = {
                "current hourly mean BC": this.bc_current,
                "current running 24 hour mean BC": this.bc_current24,
                "daily mean (day_min_1) BC": this.bc_daily_mean
            };
            this.bcControlLayer = L.control.layers(this.baseLayers, null, {
                position: 'bottomright',
                collapsed: true
            }).addTo(Map.map);
            Map.map.on('baselayerchange', function (eventLayer) {
                if (eventLayer.name === 'current running 24 hour mean BC') {
                    Map.map.removeLayer(Map.stationMarkers);
                } else if (eventLayer.name === 'daily mean (day_min_1) BC') {
                    Map.map.removeLayer(Map.stationMarkers);
                } else {
                    Map.map.addLayer(Map.stationMarkers);
                }
            });
        }
    // clean-up on change phenomenon
        if (phenomenonId !== "391") {
            console.log("remove layers");
            if (Map.map.hasLayer(this.bc_current24)) {
                Map.map.removeLayer(this.bc_current24);
                this.bcControlLayer.removeLayer(this.bc_current24);
                this.bcControlLayer.removeLayer(this.bc_current);
                this.bcControlLayer.removeLayer(this.bc_daily_mean);
                Map.map.removeControl(bcControlLayer);
            }
            if (Map.map.hasLayer(this.bc_current)) {
                Map.map.removeLayer(this.bc_current);
                this.bcControlLayer.removeLayer(this.bc_current24);
                this.bcControlLayer.removeLayer(this.bc_current);
                this.bcControlLayer.removeLayer(this.bc_daily_mean);
                Map.map.removeControl(bcControlLayer);
            }
            if (Map.map.hasLayer(this.bc_daily_mean)) {
                Map.map.removeLayer(this.bc_daily_mean);
                this.bcControlLayer.removeLayer(this.bc_current24);
                this.bcControlLayer.removeLayer(this.bc_current);
                this.bcControlLayer.removeLayer(this.bc_daily_mean);
                Map.map.removeControl(bcControlLayer);
            }
            if (Map.map.hasLayer(this.bcday0)) {
                Map.map.removeLayer(this.bcday0);
                this.bcControlLayer.removeLayer(this.bc_current24);
                this.bcControlLayer.removeLayer(this.bc_current);
                this.bcControlLayer.removeLayer(this.bc_daily_mean);
                this.bcControlLayer.removeLayer(this.stationMarkers);
                this.map.removeLayer(this.stationMarkers);
                Map.map.removeControl(bcControlLayer);
            }
            if (Map.map.hasLayer(this.bcday1)) {
                Map.map.removeLayer(this.bcday1);
                this.bcControlLayer.removeLayer(this.bc_current24);
                this.bcControlLayer.removeLayer(this.bc_current);
                this.bcControlLayer.removeLayer(this.bc_daily_mean);
                Map.map.removeControl(bcControlLayer);
            }
            if (Map.map.hasLayer(this.bcday2)) {
                Map.map.removeLayer(this.bcday2);
                this.bcControlLayer.removeLayer(this.bc_current24);
                this.bcControlLayer.removeLayer(this.bc_current);
                this.bcControlLayer.removeLayer(this.bc_daily_mean);
                Map.map.removeControl(bcControlLayer);
            }
        }
    // different aggregations of the same pollutant (PM2.5):
        if (phenomenonId === "6001") {
            this.pm25_current = L.tileLayer.wms("http://geo.irceline.be/rio/wms", {
                layers: 'rio:pm25_hmean_1x1',
                transparent: true,
                format: 'image/png',
                time: now,
                tiled: true,
                opacity: 0.7,
                zIndex: -9998
            }).addTo(Map.map);
            this.pm25_current24 = new L.LayerGroup();
            this.pm25_current24_rio = L.tileLayer.wms("http://geo.irceline.be/rio/wms", {
                layers: 'rio:pm25_24hmean_1x1',
                transparent: true,
                format: 'image/png',
                time: now,
                opacity: 0.7,
                zIndex: -9998
            }).addTo(pm25_current24);
            this.pm25_current24_station = L.tileLayer.wms("http://geo.irceline.be/realtime/wms", {
                layers: 'realtime:pm25_24hmean_station',
                transparent: true,
                format: 'image/png',
                time: now,
                zIndex: -9997
            }).addTo(pm25_current24);
            this.pm25_daily_mean = new L.LayerGroup();
            this.pm25_daily_mean_rio = L.tileLayer.wms("http://geo.irceline.be/rio/wms", {
                layers: 'rio:pm25_dmean',
                transparent: true,
                format: 'image/png',
                time: day_min_1,
                opacity: 0.7,
                zIndex: -9998
            }).addTo(pm25_daily_mean);
            this.pm25_daily_mean_station = L.tileLayer.wms("http://geo.irceline.be/realtime/wms", {
                layers: 'realtime:pm25_dmean_station',
                transparent: true,
                format: 'image/png',
                time: day_min_1,
                zIndex: -9997
            }).addTo(pm25_daily_mean);
            // add layers control
            this.baseLayers = {
                "current hourly mean PM2.5": this.pm25_current,
                "current running 24 hour mean PM2.5": this.pm25_current24,
                "daily mean (day_min_1) PM2.5": this.pm25_daily_mean
            };
            this.pm25ControlLayer = L.control.layers(this.baseLayers, null, {
                position: 'bottomright',
                collapsed: true
            }).addTo(Map.map);
            Map.map.on('baselayerchange', function (eventLayer) {
                if (eventLayer.name === 'current running 24 hour mean PM2.5') {
                    Map.map.removeLayer(Map.stationMarkers);
                } else if (eventLayer.name === 'daily mean (day_min_1) PM2.5') {
                    Map.map.removeLayer(Map.stationMarkers);
                } else {
                    Map.map.addLayer(Map.stationMarkers);
                }
            });
        }
    // clean-up on change phenomenon
        if (phenomenonId !== "6001") {
            console.log("remove layers");
            if (Map.map.hasLayer(this.pm25_current24)) {
                Map.map.removeLayer(this.pm25_current24);
                this.pm25ControlLayer.removeLayer(this.pm25_current24);
                this.pm25ControlLayer.removeLayer(this.pm25_current);
                this.pm25ControlLayer.removeLayer(this.pm25_daily_mean);
                Map.map.removeControl(pm25ControlLayer);
            }
            if (Map.map.hasLayer(this.pm25_current)) {
                Map.map.removeLayer(this.pm25_current);
                this.pm25ControlLayer.removeLayer(this.pm25_current24);
                this.pm25ControlLayer.removeLayer(this.pm25_current);
                this.pm25ControlLayer.removeLayer(this.pm25_daily_mean);
                Map.map.removeControl(pm25ControlLayer);
            }
            if (Map.map.hasLayer(this.pm25_daily_mean)) {
                Map.map.removeLayer(this.pm25_daily_mean);
                this.pm25ControlLayer.removeLayer(this.pm25_current24);
                this.pm25ControlLayer.removeLayer(this.pm25_current);
                this.pm25ControlLayer.removeLayer(this.pm25_daily_mean);
                Map.map.removeControl(pm25ControlLayer);
            }
            if (Map.map.hasLayer(this.pm25day0)) {
                Map.map.removeLayer(this.pm25day0);
                this.pm25ControlLayer.removeLayer(this.pm25_current24);
                this.pm25ControlLayer.removeLayer(this.pm25_current);
                this.pm25ControlLayer.removeLayer(this.pm25_daily_mean);
                this.pm25ControlLayer.removeLayer(this.stationMarkers);
                this.map.removeLayer(this.stationMarkers);
                Map.map.removeControl(pm25ControlLayer);
            }
            if (Map.map.hasLayer(this.pm25day1)) {
                Map.map.removeLayer(this.pm25day1);
                this.pm25ControlLayer.removeLayer(this.pm25_current24);
                this.pm25ControlLayer.removeLayer(this.pm25_current);
                this.pm25ControlLayer.removeLayer(this.pm25_daily_mean);
                Map.map.removeControl(pm25ControlLayer);
            }
            if (Map.map.hasLayer(this.pm25day2)) {
                Map.map.removeLayer(this.pm25day2);
                this.pm25ControlLayer.removeLayer(this.pm25_current24);
                this.pm25ControlLayer.removeLayer(this.pm25_current);
                this.pm25ControlLayer.removeLayer(this.pm25_daily_mean);
                Map.map.removeControl(pm25ControlLayer);
            }
        }
    lastChildPhenomenonId = phenomenonId;
}

//(function () {
var oldInit = Map.init;
Map.init = function () {
    oldInit.apply(Map, arguments); // Use #apply in case `init` uses `this`
    Map.map.attributionControl.setPrefix(
        ""
    );
    this.selectedPhenomenon = top_pollutant_today;
    $(document).ready(function () {
        $('[data-action="zoom"]').click(function () {
            Map.map.fitBounds([
                [49.5, 3.27], [51.5, 5.67]
            ]);
        });
        $('[data-action="refresh"]').click(function () {
            // var initialHref = window.location.href;
            // window.location = initialHref;
            // window.location.reload();
            // document.location = "../index.html";
            window.location = "../index.html";
        });
    });
    function checkInternet() {
        var networkState = navigator.connection.type;
        if(networkState == Connection.NONE) {
            onConnexionError();
            return false;
        } else {
            return true;
        }
    };
    var isOffline = 'onLine' in navigator && !navigator.onLine;

    if ( isOffline || checkInternet===false) {
        var a = "Your device is offline";
    }
    else {
        var a = moment(lastupdate).format('dddd D MMMM YYYY, HH:mm');
    }
    $("span#lastupdate_current").text(a);
};

Map.createStationMarker = function (results, clustering) {
    if (!this.map) {
        this.createMap();
    }
    if (this.stationMarkers) {
        this.map.removeLayer(this.stationMarkers);
    }
    var boundingbox = []; // customIRCELINE
    if (results.length > 0) {
        var firstElemCoord = results[0].geometry.coordinates;
        var topmost = firstElemCoord[1];
        var bottommost = firstElemCoord[1];
        var leftmost = firstElemCoord[0];
        var rightmost = firstElemCoord[0];
        this.stationMarkers = clustering ? new L.MarkerClusterGroup() : new L.LayerGroup();
        that = this;
        $.each(results, $.proxy(function (n, elem) {
            var geom = elem.geometry.coordinates;
            if (!isNaN(geom[0]) || !isNaN(geom[1])) {
                if (geom[0] > rightmost) {
                    rightmost = geom[0];
                }
                if (geom[0] < leftmost) {
                    leftmost = geom[0];
                }
                if (geom[1] > topmost) {
                    topmost = geom[1];
                }
                if (geom[1] < bottommost) {
                    bottommost = geom[1];
                }
                /* begin customIRCELINE */
                var LeafIcon = L.Icon.extend({
                    options: {
                        iconSize: [24, 24]
                    }
                });
                var ircelineIcon = new LeafIcon({iconUrl: 'images/marker-icon-irceline.png'});
                var marker = new L.Marker([geom[1], geom[0]], {
                    id: elem.properties.id,
                    icon: ircelineIcon
                });
                /* end customIRCELINE */
                marker.on('click', $.proxy(that.markerClicked, that)); // customIRCELINE
                this.stationMarkers.addLayer(marker);
            }
        }, this));
        this.map.addLayer(this.stationMarkers);
        boundingbox = [[49.5, 3.27],[51.5, 5.67]];//override zoom to extend of stations with particular phenomenon [// customIRCELINE (double-click zoom to extend of phenomenon)
            // [parseFloat(bottommost), parseFloat(leftmost)], // customIRCELINE
            // [parseFloat(topmost), parseFloat(rightmost)]]; // customIRCELINE
        /*this.map.fitBounds([
         [parseFloat(bottommost), parseFloat(leftmost)],
         [parseFloat(topmost), parseFloat(rightmost)]]);*/
    }
    changeWMS(this.selectedPhenomenon, timestring, timestring_day, boundingbox); // customIRCELINE
};

Map.createColoredMarkers = function (results) {
    var boundingbox = []; // customIRCELINE
    if (this.stationMarkers) {
        this.map.removeLayer(this.stationMarkers);
    }
    if (results.length > 0) {
        var firstElemCoord = results[0].getCoordinates();
        var topmost = firstElemCoord[1];
        var bottommost = firstElemCoord[1];
        var leftmost = firstElemCoord[0];
        var rightmost = firstElemCoord[0];
        this.stationMarkers = new L.LayerGroup();
        that = this;
        $.each(results, $.proxy(function (n, elem) {
            var geom = elem.getCoordinates();
            if (!isNaN(geom[0]) || !isNaN(geom[1])) {
                if (geom[0] > rightmost) {
                    rightmost = geom[0];
                }
                if (geom[0] < leftmost) {
                    leftmost = geom[0];
                }
                if (geom[1] > topmost) {
                    topmost = geom[1];
                }
                if (geom[1] < bottommost) {
                    bottommost = geom[1];
                }
                var marker;
                if (elem.isCurrent()) {
                    var interval = this.getMatchingInterval(elem);
                    var fillcolor = interval && interval.color ? interval.color : Settings.defaultMarkerColor;
                    marker = new L.circleMarker([geom[1], geom[0]], {
                        id: elem.getStationId(),
                        fillColor: fillcolor,
                        color: "#000",
                        opacity: 1,
                        weight: 2,
                        fillOpacity: 0.8
                    });
                } else {
                    marker = new L.circleMarker([geom[1], geom[0]], {
                        id: elem.getStationId(),
                        fillColor: Settings.defaultMarkerColor,
                        color: "#000",
                        opacity: 1,
                        weight: 2,
                        fillOpacity: 0.2
                    });
                }
                marker.on('click', $.proxy(that.markerClicked, that));
                this.stationMarkers.addLayer(marker);
            }
        }, this));
        this.map.addLayer(this.stationMarkers);
        boundingbox = [[49.5, 3.27],[51.5, 5.67]];//override zoom to extend of stations with particular phenomenon [// customIRCELINE (double-click zoom to extend of phenomenon)
            // [parseFloat(bottommost), parseFloat(leftmost)], // customIRCELINE
            // [parseFloat(topmost), parseFloat(rightmost)]]; // customIRCELINE
        /*this.map.fitBounds([
         [parseFloat(bottommost), parseFloat(leftmost)],
         [parseFloat(topmost), parseFloat(rightmost)]]);*/
    }
    changeWMS(this.selectedPhenomenon, timestring, timestring_day, boundingbox); // customIRCELINE
};
