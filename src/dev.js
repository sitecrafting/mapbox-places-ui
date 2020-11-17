import React from 'react'
import ReactDOM from 'react-dom'
import MapboxPlaces from './MapboxPlaces'

const placesUi = document.getElementById('mapbox-places-ui')

ReactDOM.render(
  <MapboxPlaces
    mapboxToken=""
    initialValue={placesUi.dataset.value}
    textInputProps={{
      name: "coordinates"
    }}
    coordinatesInputProps={{
      type: "text",
      name: "coordinates",
    }}
  />,
  placesUi
)
