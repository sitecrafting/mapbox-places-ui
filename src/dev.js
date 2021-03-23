import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import MapboxPlaces from './MapboxPlaces'

const placesUi = document.getElementById('mapbox-places-ui')

// Assume the entirety of the query string is the Mapbox access token,
// (minus the "?").
const token = location.search.slice(1)

const MapboxWrapper = () => {
  const [value, setValue] = useState('Tacoma, WA')
  const [coordinates, setCoordinates] = useState('122.4357428,47.2365706')

  return (
    <MapboxPlaces
      mapboxToken={token}
      textInputProps={{
        value,
        onChange: (_, { newValue }) => {
          console.log('value changed: ' + newValue)
          setValue(newValue)
        }
      }}
      onSuggestionSelected={({ suggestion, coords, coordsValue }) => {
        console.log('suggestion selected!', suggestion, coords)
        setCoordinates(coordsValue)
      }}
      coordinatesInputProps={{
        // On a real project, you'll probably want this to be hidden.
        type: "text",
        value: coordinates,
      }}
      geocodeQueryOptions={{
        countries: ["US"],
        types: ["postcode", "district", "place", "locality", "neighborhood", "poi"],
        // Bias results toward those closest to the SiteCrafting office.
        // NOTE: format is [longitude,latitude]
        proximity: [-122.4357428, 47.2365706],
      }}
    />
  )
}

ReactDOM.render(<MapboxWrapper />, placesUi)
