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
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import MapboxPlaces from '@sitecrafting/mapbox-places-ui'

function MyPlaces() {
  // You manage your own state!
  const [textInputValue, setInputValue] = useState('Tacoma, WA')
  const [coordinates, setCoordinates] = useState('122.4357428,47.2365706')

  return <MapboxPlaces
    mapboxToken="asdfqwerty"
    textInputProps={{
      value: textInputValue,
      onChange: (_, { newValue }) => {
        console.log('value changed: ' + newValue)
        setInputValue(newValue)
      }
    }}
    onSuggestionSelected={({ suggestion, coords, coordsValue }) => {
      console.log('suggestion selected!', suggestion, coords)
      setCoordinates(coordsValue)
    }}
    coordinatesInputProps={{
      value: coordinates,
    }}
  />
}

ReactDOM.render(<MyPlaces />, document.getElementById('places-input'))
```

Now, when the user types into the `#places-input` text field, they will see something like:

![Mapbox Places UI example, in which a user types the letters "sitec" and gets a list of results including "SiteCrafting HQ, 2716 A St, Tacoma, Washington 98402, United States" at the top](https://raw.githubusercontent.com/sitecrafting/mapbox-places-ui/main/mapbox-places-ui-example.png)

As you can probably tell, this component is almost entirely unopinionated about any kind of presentation or style. Each result is rendered inside an `<li>` element (an opinion from react-autosuggest). Beyond that, you have complete control over the rendered markup for suggestions.

It also renders an `<input>`, by default of type `hidden`, containing the resolved coordinates of the place the user has selected. This can also be controlled to a large extent using custom props.

### Basic styles

Here are some basic styles you can use with react-autosuggest to a get a vanilla UI:

```css
.react-autosuggest__suggestions-list{
  list-style: none;
  padding-left: 0;
}
.react-autosuggest__suggestion{
  padding: 0.3em 0.4em;
  cursor: pointer;
}
.react-autosuggest__suggestion--highlighted{
  background: #eee;
}
```

## Props

| Prop                                                       | Type     | Description                                                  |
| --------------------------------------------------------   | -------- | ------------------------------------------------------------ |
| [`mapboxToken`](#mapboxtoken-required)                     | String   | **REQUIRED** API access token                                |
| [`onSuggestionSelected`](#onsuggestionselected-required)   | Function | **REQUIRED** Callback for when the user makes a selection and the resolved coordinates change. |
| [`textInputProps`](#textinputprops-required)               | Object   | **REQUIRED** Props to pass as [`inputProps`](https://github.com/moroshko/react-autosuggest#input-props-prop) to the `Autosuggest` component |
| [`coordinatesInputProps`](#coordinatesinputprops-required) | Object   | **REQUIRED** Props to pass to the input element containing the resolved (geocoded) coordinates |
| [`coordinatesFormat`](#coordinatesformat)                  | String   | Controls how resolved coordinates are rendered in the separate coordinates input |
| [`containerProps`](#containerprops)                        | Object   | Props to pass to the container div for the entire Place UI   |
| [`suggestionComponent`](#suggestioncomponent)              | Function | Render function for each suggestion                          |
| [`geocodeQueryOptions`](#geocodequeryoptions)              | Object   | Query options to pass to Mapbox's `geocodingService.forwardQuery()` method |

### mapboxToken (required)

The Mapbox API access token for your account.

### textInputProps (required)

An object that MUST contain, at least, a `value` prop (string) and an `onChange` prop (function). `MapboxPlaces` has no opinion about how to manage your coordinates state beyond the fact that you must manage it yourself.

Additional props to pass as [`inputProps`](https://github.com/moroshko/react-autosuggest#input-props-prop) to the `Autosuggest` component.

### coordinatesInputProps (required)

An object that MUST contain, at least, a `value` prop. `MapboxPlaces` has no opinion about how to manage your coordinates state beyond the fact that you must manage it yourself.

`MapboxPlaces` renders a read-only `input` element to contain the resolved coordinates. This is typically a `hidden` field, but it doesn't need to be. The `coordinateInputProps` controls the props (aside from the reserved `value` and `readOnly` props) passed to this input element.

### onSuggestionSelected (required)

A callback for when the user selects a Mapbox suggestion. Called with an Object with the following props:

* `suggestion`: the full Suggestion object from Mapbox
* `coords`: an array of length 2 containing latitude and longitude. Order depends on `coordinatesFormat`.
* `coordsValue`: the formatted `coords` as a comma-separated string. As with the `coords` Array, order depends on `coordinatesFormat`. This value is what you should use, unmodified, as `coordinateInputProps.value` unless you're doing some kind of advanced filtering.

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

Note that react-autosuggest already wraps this in an `<li>` element.

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

### onCoordinatesUpdated

Callback function invoked with the suggestion data and its resolved coordinates. Passed an object containing the following properties:

* `coords`: The resolved coordinates as an **array**, in either `[lat, lng]` or `[lng, lat]` order according to `coordinatesFormat`.
* `suggestion`: The Feature object directly from Mapbox.

```jsx
<MapboxPlaces
  mapboxToken="asdfqwerty"
  coordinatesFormat="lat,lng" // this matters for the order of coords
  onCoordinatesUpdated={({ suggestion, coords }) => {
    console.log(`the coordinates for ${suggestion.text} are '${coords.join(", ")}'`)
  }}
/>
```

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
