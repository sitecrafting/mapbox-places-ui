import React from 'react'
import ReactDOM from 'react-dom'
import MapboxPlaces from './MapboxPlaces'

const placesUi = document.getElementById('mapbox-places-ui')

// Assume the entirety of the query string is the Mapbox access token,
// (minus the "?").
const token = location.search.slice(1)

ReactDOM.render(
  <MapboxPlaces
    mapboxToken={token}
    initialValue={placesUi.dataset.value}
    textInputProps={{
      name: "coordinates"
    }}
    coordinatesInputProps={{
      // On a real project, you'll probably want this to be hidden.
      type: "text",
      name: "coordinates",
    }}
  />,
  placesUi
)
