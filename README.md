# Mapbox Places UI

A Google Places-style find-as-you-type (FAYT) React component that consumes the Mapbox [forwardGeocode](https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md#forwardgeocode) API service.

Wraps [react-autosuggest](http://react-autosuggest.js.org/) and the Mapbox JavaScript [geocoding service](https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md#geocoding).

## Basic Example

Simply pass your Mapbox access token as a prop, and the `MapboxPlaces` component will take care of the REST:

```jsx
<MapboxPlaces mapboxToken="asdfqwerty" />
```

## Props

| Prop                                   | Type     | Description                                                  |
| -------------------------------------- | -------- | ------------------------------------------------------------ |
| [`mapboxToken`](#mapboxtoken-required) | String   | **REQUIRED** API access token                                |
| [`initialValue`](#initialvalue)        | String   | The initial text input value to set                          |
| textInputProps                         | Object   | Props to pass as [`inputProps`](https://github.com/moroshko/react-autosuggest#input-props-prop) to the `Autosuggest` component |
| coordinatesInputProps                  | Object   | Props to pass to the input element containing the resolved (geocoded) coordinates |
| coordinatesFormat                      | String   | Controls how resolved coordinates are rendered in the separate coordinates input |
| containerProps                         | Object   | Props to pass to the container div for the entire Place UI   |
| suggestionComponent                    | Function | Render function for each suggestion                          |
| geocodeQueryOptions                    | Object   | Query options to pass to Mapbox's `geocodingService.forwardQuery()` method |

### mapboxToken (required)

The Mapbox API access token for your account.

### initialValue

The initial text input string to set on the `Autosuggest` component.

### textInputProps

Additional props to pass as [`inputProps`](https://github.com/moroshko/react-autosuggest#input-props-prop) to the `Autosuggest` component. Note that `value` and `onChange` cannot be overridden.

### coordinateInputProps

`MapboxPlaces` renders a read-only `input` element to contain the resolved coordinates. This is typically a `hidden` field, but it doesn't need to be. The `coordinateInputProps` controls the props (aside from the reserved `value` and `readOnly` props) passed to this input element.

### coordinatesFormat

Controls how resolved coordinates are rendered in the separate coordinates input. Mapbox resolves coordinates as `[longitude, latitude]`, which may not always be what you want.

Options:

* `"lng,lat"` (default)
* `"lat,lng"`

### containerProps

Props for the top-level div containing the `Autosuggest` and coordinates input elements.

### suggestionComponent

Render function for each suggestion. Passed a single `feature` prop, representing a single place returned within the features array from the Mapbox [Geocoding Response object](https://docs.mapbox.com/api/search/#geocoding-response-object):

```jsx
<MapboxPlaces
  mapboxToken="asdfqwerty"
  suggestionComponent={feature => {
    return <div className="my-suggestion">{feature.place_name}</div>
  }}
/>
```

Note that react-autosuggest already wraps this in a `<li>` element.

### geocodeQueryOptions

Extra options to pass to the Mapbox Geocoding Service's [`forwardGeocode()` method](https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md#forwardgeocode). Note that `query` cannot be overridden, as it is always what the user has entered in the auto-suggest text input.

```jsx
<MapboxPlaces
  mapboxToken="asdfqwerty"
  geocodeQueryOptions={{
  	// Bias results toward those closest to the SiteCrafting office.
    proximity: [-122.4357428, 47.2365706],
    // Any other valid args, besides `query`...
  }}
/>
```

Note that for `proximity` coordinates, Mapbox expects the format to be `[longitude, latitude]`.