import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import mapboxClient from '@mapbox/mapbox-sdk'
import geocodingService from '@mapbox/mapbox-sdk/services/geocoding'
import Autosuggest from 'react-autosuggest'

function fetchPlaces(client, { query }) {
  return client.forwardGeocode({
    query
  })
}

// TODO make a useGeocodingService() hook

function MapboxPlaces({
  mapboxToken,
  initialValue,
  textInputProps,
  coordinatesInputProps,
  containerProps,
}) {
  const [value, setValue] = useState(initialValue)

  const [client, _] = useState(geocodingService(mapboxClient({
    accessToken: mapboxToken,
  })))
  const [suggestions, setSuggestions] = useState([])
  const fetchSuggestions = ({ value }) => {
    fetchPlaces(client, {query: value})
      .send()
      .then(res => {
        console.log('features', res.body.features)
        setSuggestions(res.body.features)
      })
  }

  const getSuggestionValue = (sugg) => {
    return sugg.place_name
  }

  const renderSuggestion = (sugg) => {
    return (
      <div className="suggestion">{sugg.place_name}</div>
    )
  }

  const [selectedCoordinates, setSelectedCoordinates] = useState("")

  const onSuggestionSelected = (e, { suggestion }) => {
    const coords = suggestion.geometry.coordinates || []
    setSelectedCoordinates(coords.join(','))
  }

  return (
    <div {...containerProps}>
      <Autosuggest
        suggestions={suggestions}
        renderSuggestion={renderSuggestion}
        onSuggestionsFetchRequested={fetchSuggestions}
        onSuggestionsClearRequested={() => setSuggestions([])}
        getSuggestionValue={getSuggestionValue}
        inputProps={Object.assign({}, textInputProps, {
          value,
          onChange: (e, { newValue }) => setValue(newValue),
        })}
        onSuggestionSelected={onSuggestionSelected}
      />
      <input {...coordinatesInputProps} value={selectedCoordinates} />
    </div>
  )
}

export default MapboxPlaces
