function handleMarkers(mapOptions, map) {

  const markers = mapOptions.hasOwnProperty("markers") ? mapOptions.markers : [];
  var greenIcon = L.icon({
    iconUrl: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round" viewBox="0 0 500 820"><defs><linearGradient id="a" x1="0" x2="1" y1="0" y2="0" gradientTransform="rotate(-90 478.7 62.3) scale(37.566)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#126FC6"/><stop offset="1" stop-color="#4C9CD1"/></linearGradient><linearGradient id="b" x1="0" x2="1" y1="0" y2="0" gradientTransform="rotate(-90 468.5 54) scale(19.053)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2E6C97"/><stop offset="1" stop-color="#3883B7"/></linearGradient></defs><path fill="#FFF" d="M341.9 266.3a91.7 91.7 0 1 1-183.7 0 91.7 91.7 0 1 1 183.7 0z"/><path fill="url(#a)" stroke="url(#b)" stroke-width="1.1" d="M416.5 503.6c-6.5 0-12 5.7-12 11.9 0 2.8 1.6 6.3 2.7 8.7l9.3 17.9 9.3-17.9c1-2.4 2.7-5.8 2.7-8.7 0-6.2-5.4-11.9-12-11.9Zm0 7.2c2.6 0 4.7 2 4.7 4.7a4.7 4.7 0 1 1-4.7-4.7Z" transform="translate(-7889.1 -9807.4) scale(19.5417)"/></svg>',

    iconSize: [25, 41], // size of the icon
    iconAnchor: [25, 41], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -46] // point from which the popup should open relative to the iconAnchor
  });

  function interpolateColor(startColor, endColor, fraction) {
    const startRGB = hexToRGB(startColor);
    const endRGB = hexToRGB(endColor);

    const r = Math.round(startRGB.r + (endRGB.r - startRGB.r) * fraction);
    const g = Math.round(startRGB.g + (endRGB.g - startRGB.g) * fraction);
    const b = Math.round(startRGB.b + (endRGB.b - startRGB.b) * fraction);

    return rgbToHex(r, g, b);
  }

  function hexToRGB(hex) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return {r, g, b};
  }

  function rgbToHex(r, g, b) {
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase()}`;
  }

  function generateYearColor(year) {
    const startYear = 2016;
    const currentYear = new Date().getFullYear();

    // Start color is red, end color is bright green
    // const startColor = "#FF0000";  // Red
    // const endColor = "#00FF00";    // Bright Green
    const startColor = "#6D2017";  // Red
    const endColor = "#40FF40";    // Bright Green

    // Calculate the fraction for the current year
    const fraction = (year - startYear) / (currentYear - startYear);
    return interpolateColor(startColor, endColor, fraction);
  }


  function getMarkerSVG(hexColor) {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="marker">
      <path fill-opacity=".25" d="M16 32s1.427-9.585 3.761-12.025c4.595-4.805 8.685-.99 8.685-.99s4.044 3.964-.526 8.743C25.514 30.245 16 32 16 32z"/>
      <path fill="${hexColor}" stroke="#000" d="M15.938 32S6 17.938 6 11.938C6 .125 15.938 0 15.938 0S26 .125 26 11.875C26 18.062 15.938 32 15.938 32zM16 6a4 4 0 100 8 4 4 0 000-8z"/>
    </svg>`;
  }

  var bounds = L.latLngBounds();
  for (const userMarker of markers) {
    const icon = L.divIcon({
      className: "marker",
      html: getMarkerSVG(generateYearColor(userMarker.year ? userMarker.year : new Date().getFullYear())),
      iconSize: [40, 40],
      iconAnchor: [12, 24],
      popupAnchor: [7, -16]
    });


    const marker = L.marker(userMarker, {icon: icon}).addTo(map);
    if (userMarker.popup) {
      marker.bindPopup(userMarker.popup);
    }
    if (userMarker.tooltip) {
      marker.bindTooltip(userMarker.tooltip);
    }
    bounds.extend(L.latLng(userMarker));
  }
  setMapView(map, mapOptions, bounds);

  // Function to determine the best way to set the map view
  function setMapView(map, options, bounds) {
    if (options.zoom && options.center) {
      console.log("zoom-center");
      map.setView(options.center, options.zoom);
    } else if (bounds.isValid()) {
      if (options.zoom) {
        map.setView(bounds.getCenter(), options.zoom);
      } else if (options.center) {
        map.fitBounds(bounds);
        map.setView(options.center, undefined, {animate: false});
      } else {
        map.fitBounds(bounds);
      }
    } else {
      map.fitWorld();
    }
  }

}

function getSupportedLayers() {
  return new Map([["org.openstreetmap.standard", {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    makeLayer: (t, e, n) => L.tileLayer(e.url, {
      attribution: e.attribution
    })
  }
  ], ["com.thunderforest.cycle", {
    name: "OpenCycleMap",
    url: "https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey={apikey}",
    attribution: 'Maps &copy; <a href="https://www.thunderforest.com/">Thunderforest</a>. Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.',
    makeLayer: (t, e, n) => L.tileLayer(e.url, {
      attribution: e.attribution,
      apikey: n.apiKey
    })
  }
  ], ["com.thunderforest.outdoors", {
    name: "Outdoors",
    url: "https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={apikey}",
    attribution: 'Maps &copy; <a href="https://www.thunderforest.com/">Thunderforest</a>. Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.',
    makeLayer: (t, e, n) => L.tileLayer(e.url, {
      attribution: e.attribution,
      apikey: n.apiKey
    })
  }
  ], ["com.thunderforest.landscape", {
    name: "Landscape",
    url: "https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey={apikey}",
    attribution: 'Maps &copy; <a href="https://www.thunderforest.com/">Thunderforest</a>. Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.',
    makeLayer: (t, e, n) => L.tileLayer(e.url, {
      attribution: e.attribution,
      apikey: n.apiKey
    })
  }
  ], ["ch.swisstopo.pixelkarte-farbe", {
    name: "SwissTopo National maps",
    crs: L.CRS.EPSG2056,
    makeLayer: (t, e, n) => L.tileLayer.swiss({
      layer: t
    })
  }
  ], ["ch.swisstopo.swissimage", {
    name: "SwissTopo Aerial imagery",
    crs: L.CRS.EPSG2056,
    makeLayer: (t, e, n) => L.tileLayer.swiss({
      layer: t,
      maxNativeZoom: 28
    })
  }
  ], ["ch.swisstopo.swisstlm3d-wanderwege", {
    name: "Hiking trails",
    overlay: !0,
    crs: L.CRS.EPSG2056,
    makeLayer: (t, e, n) => L.tileLayer.swiss({
      layer: t,
      maxNativeZoom: 26,
      format: "png",
      opacity: .7
    })
  }
  ], ["ch.astra.mountainbikeland", {
    name: "Mountainbikeland Schweiz",
    overlay: !0,
    crs: L.CRS.EPSG2056,
    makeLayer: (t, e, n) => L.tileLayer.swiss({
      layer: t,
      maxNativeZoom: 26,
      format: "png",
      opacity: .7
    })
  }
  ], ["ch.astra.veloland", {
    name: "Veloland Schweiz",
    overlay: !0,
    crs: L.CRS.EPSG2056,
    makeLayer: (t, e, n) => L.tileLayer.swiss({
      layer: t,
      maxNativeZoom: 26,
      format: "png",
      opacity: .7
    })
  }
  ], ["ch.swisstopo.schneeschuhwandern", {
    name: "Snowshoe trekking",
    overlay: !0,
    crs: L.CRS.EPSG2056,
    makeLayer: (t, e, n) => L.tileLayer.swiss({
      layer: t,
      maxNativeZoom: 26,
      format: "png",
      opacity: .7
    })
  }
  ], ["ch.swisstopo-karto.schneeschuhrouten", {
    name: "Snowshoe routes",
    overlay: !0,
    crs: L.CRS.EPSG2056,
    makeLayer: (t, e, n) => L.tileLayer.swiss({
      layer: t,
      maxNativeZoom: 25,
      format: "png",
      opacity: .7
    })
  }
  ]]);
}

function handleTracks(mapOptions, map) {
  const tracks = mapOptions.hasOwnProperty("tracks") ? mapOptions.tracks : [];
  if (tracks.length !== 1) {
    mapOptions.heightgraph = null;
  }
  const a = [];
  var controlElevation = null;
  // XXX: Some hack to see if at least one track has "downloadable" then use it for all
  const hasDownloadableTrack = tracks.some(track => track.downloadable === true);
  const noElevation = mapOptions.heightgraph == null;
  let elevationOptions = {
    // Chart container outside/inside map container
    ruler: false,
    legend: false,
    detached: true,
    // Chart container outside/inside map container

    // if (detached), the elevation chart container
    elevationDiv: "#heightgraph_" + mapOptions.id,

    // Default chart colors: theme lime-theme, magenta-theme, ...
    theme: "lightblue-theme",
    collapsed: noElevation,

    // if (!detached) control position on one of map corners
    position: "topright",

    // Toggle close icon visibility
    closeBtn: false,

    // Autoupdate map center on chart mouseover.
    followMarker: true,

    // Autoupdate map bounds on chart update.
    autofitBounds: true,

    // Chart distance/elevation units.
    imperial: false,

    // [Lat, Long] vs [Long, Lat] points. (leaflet default: [Lat, Long])
    reverseCoords: false,

    // Acceleration chart profile: true || "summary" || "disabled" || false
    acceleration: false,

    // Slope chart profile: true || "summary" || "disabled" || false
    slope: false,

    // Speed chart profile: true || "summary" || "disabled" || false
    speed: "summary",

    // Altitude chart profile: true || "summary" || "disabled" || false
    altitude: true,

    // Display time info: true || "summary" || false
    time: true,

    // Display distance info: true || "summary" || false
    distance: true,

    // Summary track info style: "inline" || "multiline" || false
    summary: noElevation ? false : 'multiline',

    // Download link: "link" || false || "modal"
    downloadLink: hasDownloadableTrack ? 'link' : false,

    // Toggle "leaflet-almostover" integration
    almostOver: true,

    // Toggle "leaflet-distance-markers" integration
    distanceMarkers: false,

    // Toggle "leaflet-edgescale" integration
    edgeScale: false,

    // Toggle "leaflet-hotline" integration
    hotline: true,

    // Display track datetimes: true || false
    timestamps: true,

    // Display track waypoints: true || "markers" || "dots" || false
    waypoints: true,

    // Toggle custom waypoint icons: true || { associative array of <sym> tags } || false
    wptIcons: false,

    // Toggle waypoint labels: true || "markers" || "dots" || false
    wptLabels: true,

    // Render chart profiles as Canvas or SVG Paths
    preferCanvas: true,
    // height: 150, // Height of the graph
  };

  if (mapOptions.srcFolder) {
    // Needed to indicate from where to get d3 if using local fileset
    elevationOptions.srcFolder = mapOptions.srcFolder;
  }
  if (tracks) {
    controlElevation = L.control.elevation(elevationOptions).addTo(map);
  }


  for (const i of tracks) {
    const track = typeof i === "string" ? {source: i}
      : (typeof i === "object" && i !== null) ? i
        : undefined;

    if (!track) {
      throw new Error(`Invalid track source: ${JSON.stringify(i)}`);
    }

    // Load track from url (allowed data types: "*.geojson", "*.gpx", "*.tcx")
    controlElevation.load(track.source);
  }
}

function createHugoLeafletMap(mapOptions) {
  const supportedLayers = getSupportedLayers();
  var defaultLayer = {
    defaultLayerName: void 0,
    baseLayers: {},
    overlays: {},
    crs: void 0
  };


  var enabledLayers = mapOptions.layers.enabled || [];
  if (0 == enabledLayers.length) {
    enabledLayers.push([...supportedLayers][0][0]);
  }

  for (const layer of enabledLayers) {
    const supportedLayer = supportedLayers.get(layer);
    if (!supportedLayer) {
      console.log("Warning: Ignoring unknown map layer name: " + layer);
      continue
    }
    const cksum = supportedLayer.crs || null;
    if (void 0 === defaultLayer.crs && (defaultLayer.crs = cksum), cksum != defaultLayer.crs) {
      const t = t => t ? t.code : L.CRS.EPSG3857.code;
      console.log("Warning: Skipping map layer because of CRS mismatch: " + layer + " (layer: " + t(supportedLayer.crs) + ", current: " + t(defaultLayer.crs) + ")");
      continue
    }
    const providedLayer = mapOptions.layers[layer] || {};
    if (supportedLayer.url && supportedLayer.url.includes("{apikey}") && !providedLayer.apiKey) {
      console.log("ERROR: No API key for map layer: " + layer);
      continue
    }
    const s = supportedLayer.makeLayer(layer, supportedLayer, providedLayer);
    supportedLayer.overlay ? defaultLayer.overlays[supportedLayer.name] = s : (defaultLayer.baseLayers[supportedLayer.name] = s, defaultLayer.defaultLayerName || (defaultLayer.defaultLayerName = supportedLayer.name))
  }


  var map = L.map(mapOptions.element, {
    layers: [defaultLayer.baseLayers[defaultLayer.defaultLayerName]],
    crs: defaultLayer.crs || L.CRS.EPSG3857
  });

  if (mapOptions.center) {
    console.log("Setting center to " + mapOptions.center + " and zoom=" + mapOptions.zoom);
    map.setView(mapOptions.center, mapOptions.zoom);
  }

  const hasBaseLayers = Object.keys(defaultLayer.baseLayers).length > 1;
  const hasOverlays = Object.keys(defaultLayer.overlays).length > 1;

  if (hasBaseLayers || hasOverlays) {
    L.control.layers(defaultLayer.baseLayers, defaultLayer.overlays, {
      position: mapOptions.layers.position || "bottomleft"
    }).addTo(map);
  }

  mapOptions.scale && mapOptions.scale.enabled && L.control.scale({
    position: mapOptions.scale.position || "bottomright",
    imperial: mapOptions.scale.imperial || false
  }).addTo(map);

  // TODO: doesn't work
  // const shouldMaximize = mapOptions.maximize && !mapOptions.maximize.enabled;
  // if (shouldMaximize || L.control.maximize()) {
  //   L.control.maximize().addTo(map);
  // }


  // Handle tracks via leaflet-elevation
  handleTracks(mapOptions, map);

  // handle markers
  handleMarkers(mapOptions, map);

  return map;
}