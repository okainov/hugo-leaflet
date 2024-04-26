# hugo-mod-leaflet: Leaflet integration for Hugo

This module provies a number of Hugo shortcodes for easy embedding of maps into Hugo-based websites.

## Example

Here's an example use of the map shortcodes provided by hugo-mod-leaflet:

```go-html-template
{{< leaflet-map resizable=false >}}
    {{< leaflet-layer id="ch.swisstopo.pixelkarte-farbe" selectorPosition="bottomleft" >}}
    {{< leaflet-layer id="ch.swisstopo.swissimage" >}}
    {{< leaflet-layer id="ch.swisstopo.swisstlm3d-wanderwege" >}}

    {{< leaflet-scale position="bottomright" >}}

    {{< leaflet-track path="track.gpx" color="DarkRed" >}}

    {{< leaflet-elevation-profile expanded=true resizable=true width=300 height=150 >}}
{{< /leaflet-map >}}
```

And below is how this might render:

![alt text](doc/render-example.png){width=792px}

## Documentation

The current shortcode documentation is contained at the top of [leaflet-map.html](layouts/shortcodes/leaflet-map.html) but is reproduced here for convenience:

### Syntax summary

```go-html-template
{{< leaflet-map centerLat=FLOAT centerLon=FLOAT zoom=INT width="STRING" height="STRING" resizable=BOOL maximizable=BOOL freezable=BOOL freezeOptions="STRING" >}}

	{{< leaflet-layer id="STRING" apiKey="STRING" >}}

	{{< leaflet-marker lat=FLOAT lon=FLOAT >}}

	{{< leaflet-track path="URL" title="STRING" downloadable=BOOL >}}

	{{< leaflet-scale >}}

	{{< leaflet-elevation-profile expanded=BOOL resizable=BOOL width=INT height=INT minWidth=INT minHeight=INT maxWidth=INT maxHeight=INT >}}

{{< /leaflet-map >}}
```

### Map options

```
centerLat/centerLon:
	Center point coordinates of the map as decimal values. Optional iif tracks or markers are given.
zoom:
	Zoom level of the map. Optional iif tracks or markers are given.
width:
	Width of the map, including CSS units (e.g. "50%", "300px").
	Optional, defaults to "auto".
height:
	Height of the map, including CSS units (e.g. "50%", "300px").
	Optional, defaults to "50vh".
resizable:
	Boolean value indicating whether the map should be drag & drop resizable.
	Optional, defaults to true.
maximizable:
	Boolean value indicating whether the maximize button should be displayed.
	Optional, defaults to true.
freezable:
	Boolean value indicating whether the map should be frozen on page load to avoid scroll capture.
	Optional, defaults to true.
freezeOptions:
	A string containing a JSON object (without its braces) that contains options for Leaflet.Freezy.
	See https://gitlab.com/mrubli/leaflet-freezy#options for details.
	Optional, defaults to: "freezeButtonInnerHtml: 1500"
	Example: freezeOptions="hoverToThawDuration: 500, freezeButtonInnerHtml: '🥶'"
	Example: freezeOptions=" "   (to avoid the hugo-mod-leaflet default and use Leaflet.Freezy's defaults instead)
```

### Layer options

```
id:
	Name of the layer. Supported base layers:
	- org.openstreetmap.standard:
		https://www.openstreetmap.org/
	- com.thunderforest.cycle: ①
		https://www.thunderforest.com/maps/opencyclemap/
	- com.thunderforest.outdoors: ①
		https://www.thunderforest.com/maps/outdoors/
	- com.thunderforest.landscape: ①
		https://www.thunderforest.com/maps/landscape/
	- ch.swisstopo.pixelkarte-farbe: ②
		https://map.geo.admin.ch/?topic=swisstopo&bgLayer=ch.swisstopo.pixelkarte-farbe&lang=en
	- ch.swisstopo.swissimage: ②
		https://map.geo.admin.ch/?topic=swisstopo&bgLayer=ch.swisstopo.swissimage&lang=en
	Supported overlays:
	- ch.swisstopo.swisstlm3d-wanderwege: ②
		https://map.geo.admin.ch/?topic=swisstopo&bgLayer=ch.swisstopo.pixelkarte-farbe&lang=en&layers=ch.swisstopo.swisstlm3d-wanderwege&layers_opacity=0.8
	- ch.astra.mountainbikeland: ②
		https://map.geo.admin.ch/?topic=swisstopo&bgLayer=ch.swisstopo.pixelkarte-farbe&lang=en&layers=ch.astra.mountainbikeland&layers_opacity=0.6
	- ch.astra.veloland: ②
		https://map.geo.admin.ch/?topic=swisstopo&bgLayer=ch.swisstopo.pixelkarte-farbe&lang=en&layers=ch.astra.veloland&layers_opacity=0.6
	- ch.swisstopo.schneeschuhwandern: ②
		https://map.geo.admin.ch/?topic=swisstopo&bgLayer=ch.swisstopo.pixelkarte-farbe&lang=en&layers=ch.swisstopo.schneeschuhwandern
	- ch.swisstopo-karto.schneeschuhrouten: ②
		https://map.geo.admin.ch/?topic=swisstopo&bgLayer=ch.swisstopo.pixelkarte-farbe&lang=en&layers=ch.swisstopo-karto.schneeschuhrouten&layers_opacity=0.8
	Notes:
		① API key required.
		② Uses EPSG-2056 (Swiss CH1903+/LV95) projection. Cannot be combined with EPSG3857
			(WGS 84) map layers.
apiKey:
	API key for tile access.
selectorPosition:
	Position of the layer selector button. One of: "topleft", "topright", "bottomleft", "bottomright"
	Optional, defaults to "bottomleft". If specified for more than one layer, the last one wins.
```

### Marker options

```
lat/lon:
	Coordinates of the marker as decimal values.
```

### Track options

```
path:
	Absolute or relative path of the .gpx file to render as a track.
title:
	Name of the track, used e.g. to render the 'Download GPX' button when multiple tracks are present.
color:
	Color to use for rendering the track.
	Optional, defaults to DeepPink.
opacity:
	Opacity to use for rendering the track.
	Optional, defaults to 0.7.
downloadable:
	Boolean value indicating whether there should be a 'Download GPX' button for this track.
	Optional, defaults to true.
```

### Scale options

```
position:
	Position of the scale. One of: "topleft", "topright", "bottomleft", "bottomright"
	Optional, defaults to "bottomright".
```

### Elevation profile options

```
resizable:
	Boolean value indicating whether the elevation profile box should be drag & drop resizable.
	Optional, defaults to false.
expanded:
	Boolean value indicating whether the elevation profile should be expanded by default.
	Optional, defaults to true.
width:
	Width of the elevation profile.
	Optional, defaults to 360.
height:
	Height of the elevation profile.
	Optional, defaults to 180.
minWidth:
	Minimum width of the elevation profile if resizable.
	Optional.
minHeight:
	Minimum height of the elevation profile if resizable.
	Optional.
maxWidth:
	Maximum width of the elevation profile if resizable.
	Optional.
maxHeight:
	Maximum height of the elevation profile if resizable.
	Optional.

Note: Elevation profiles are only supported if exactly one track is present.
```
