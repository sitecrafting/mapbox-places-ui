import React from 'react'
import ReactDOM from 'react-dom'
import MapboxPlaces from './MapboxPlaces'

const placesUi = document.getElementById('mapbox-places-ui')

ReactDOM.render(
  <MapboxPlaces
    initialValue={placesUi.dataset.value}
    inputProps={{
      name: "coordinates"
    }}
  />,
  placesUi
)
