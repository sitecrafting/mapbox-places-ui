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
    coordinatesInputProps={{
      // On a real project, you'll probably want this to be hidden.
      type: "text",
    }}
    geocodeQueryOptions={{
      countries: ["US"],
      types: ["postcode", "district", "place", "locality", "neighborhood", "poi"],
      // Bias results toward those closest to the SiteCrafting office.
      // NOTE: format is [longitude,latitude]
      proximity: [-122.4357428, 47.2365706],
    }}
    suggestionComponent={({ feature }) => {
      return <h5>{feature.place_name}</h5>
    }}
  />,
  placesUi
)
