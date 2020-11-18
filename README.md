# Mapbox Places UI

A Google Places-style find-as-you-type (FAYT) React component that consumes the Mapbox [forwardGeocode](https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md#forwardgeocode) API service.

Wraps [react-autosuggest](http://react-autosuggest.js.org/) and the Mapbox JavaScript [geocoding service](https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md#geocoding).

## Installation

Install via `npm`:

```sh
npm install @sitecrafting/mapbox-places-ui
```

...or via `yarn`:

```sh
yarn add @sitecrafting/mapbox-places-ui
```

## Basic Example

Simply pass your Mapbox access token as a prop, and the `MapboxPlaces` component will take care of the REST:

```jsx
import MapboxPlaces from '@sitecrafting/mapbox-places-ui'

<MapboxPlaces mapboxToken="asdfqwerty" />
```

## Props

| Prop                                           | Type     | Description                                                  |
| ---------------------------------------------- | -------- | ------------------------------------------------------------ |
| [`mapboxToken`](#mapboxtoken-required)         | String   | **REQUIRED** API access token                                |
| [`initialValue`](#initialvalue)                | String   | The initial text input value to set                          |
| [`textInputProps`](#textinputprops)              | Object   | Props to pass as [`inputProps`](https://github.com/moroshko/react-autosuggest#input-props-prop) to the `Autosuggest` component |
| [`coordinatesInputProps`](#coordinateinputprops) | Object   | Props to pass to the input element containing the resolved (geocoded) coordinates |
| [`coordinatesFormat`](#coordinatesformat)        | String   | Controls how resolved coordinates are rendered in the separate coordinates input |
| [`containerProps`](#containerprops)              | Object   | Props to pass to the container div for the entire Place UI   |
| [`suggestionComponent`](#suggestioncomponent)    | Function | Render function for each suggestion                          |
| [`geocodeQueryOptions`](#geocodequeryoptions)    | Object   | Query options to pass to Mapbox's `geocodingService.forwardQuery()` method |

### mapboxToken (required)

The Mapbox API access token for your account.

### initialValue

The initial text input string to set on the `Autosuggest` component.

### textInputProps

Additional props to pass as [`inputProps`](https://github.com/moroshko/react-autosuggest#input-props-prop) to the `Autosuggest` component. Note that `value` and `onChange` cannot be overridden.

### coordinateInputProps

`MapboxPlaces` renders a read-only `input` element to contain the resolved coordinates. This is typically a `hidden` field, but it doesn't need to be. The `coordinateInputProps` controls the props (aside from the reserved `value` and `readOnly` props) passed to this input element.

### coordinatesFormat

Controls how resolved coordinates are rendered in the separate coordinates input. Mapbox resolves coordinates as `[longitude, latitude]`, which may not always be what you want, for example if you want to use the resolved coordinates with some other service that expects `"lat,lng"`.

Options:

* `"lng,lat"` (default)
* `"lat,lng"`

### containerProps

Props for the top-level div containing the `Autosuggest` and coordinates input elements.

### suggestionComponent

Stateless component (render function) for each suggestion. Passed a single `feature` prop, representing a single place returned within the `features` array from the Mapbox [Geocoding Response object](https://docs.mapbox.com/api/search/#geocoding-response-object):

```jsx
<MapboxPlaces
  mapboxToken="asdfqwerty"
  suggestionComponent={({ feature }) => {
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

## Development

Simply clone this repo, install dependencies, and start the dev server:

```sh
git clone git@github.com:sitecrafting/mapbox-places-ui.git
cd mapbox-places-ui
yarn
yarn dev
```

This will start a dev server at `localhost:9000` and watch files in `src` for changes and automatically reload.

The final step is to grab your Mapbox API access token and stick it in the query string, so that the dev URL looks like: `http://localhost:9000?<accessToken>`.

Currently there are no tests. All this library really does is stitch together the Mapbox SDK with react-autosuggest in a simple and fairly predictable way.
