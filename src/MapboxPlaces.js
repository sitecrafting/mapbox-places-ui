import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import mapboxClient from '@mapbox/mapbox-sdk'
import geocodingService from '@mapbox/mapbox-sdk/services/geocoding'
import Autosuggest from 'react-autosuggest'

/**
 * Using the given GeocodingService client instance, perform the given query
 * against the Mapbox API.
 *
 * @return Promise a Promise that resolves to forwardGeocode results
 * @see https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md#forwardgeocode
 */
function fetchPlaces(client, { query }) {
  return client.forwardGeocode({
    query
  })
}

/**
 * Given a Mapbox access token, return a tuple of the form:
 *
 * [suggestions, setSuggestions, fetchSuggestions]
 *
 * where:
 *
 * - suggestions is the current array of Places
 * - setSuggestions is a hook function for setting suggestions directly
 * - fetchSuggestions is an async function for fetching suggestions for the
 *   current search term from Mapbox
 */
function useForwardGeocoder({ mapboxToken }) {
  const [client, _] = useState(
    geocodingService(mapboxClient({ accessToken: mapboxToken }))
  )

  const [suggestions, setSuggestions] = useState([])

  const clearSuggestions = () => setSuggestions([])

  const fetchSuggestions = ({ value }) => {
    fetchPlaces(client, { query: value })
      .send()
      .then(res => setSuggestions(res.body.features))
  }

  return [suggestions, clearSuggestions, fetchSuggestions]
}

/**
 * Given an initial coordinates ("lat,lng") string, return a tuple of the form:
 *
 * [coordinates, onSuggestionSelected]
 *
 * where:
 *
 * - coordinates is the current coordinates string
 * - onSuggestionSelected is a handler function to call when the user selects a
 *   new Place among the suggested results
 */
function useCoordinates(initialCoordinates) {
  const [coordinates, setSelectedCoordinates] = useState("")

  const onSuggestionSelected = (_, { suggestion }) => {
    // Set the new coordinates to the selected Place's lat,lng coords,
    // as a comma-separated string.
    setSelectedCoordinates(suggestion.geometry.coordinates.join(','))
  }

  return [coordinates, onSuggestionSelected]
}

/**
 * Given an initial form input value, return a tuple of the form:
 *
 * [value, onChange]
 *
 * where:
 *
 * - value is the current value of the input element
 * - onChange is a standard onChange handler function
 */
function useInputValue(initialValue) {
  const [value, setValue] = useState(initialValue)

  const onChange = (_, { newValue }) => setValue(newValue)

  return [value, onChange]
}

function MapboxPlaces({
  mapboxToken,
  initialValue,
  textInputProps,
  coordinatesInputProps,
  containerProps,
}) {
  // Wrap the Mapbox forwardGeocode service.
  const [suggestions, clearSuggestions, fetchSuggestions] = useForwardGeocoder({ mapboxToken })

  // TODO Support overriding how each suggestion is rendered.
  const renderSuggestion = (suggestion) => {
    return (
      <div className="suggestion">{suggestion.place_name}</div>
    )
  }

  const [coordinates, onSuggestionSelected] = useCoordinates("")

  const [value, onChange] = useInputValue(initialValue)
  const inputProps = Object.assign({}, textInputProps, { value, onChange })

  return (
    <div {...containerProps}>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={fetchSuggestions}
        onSuggestionsClearRequested={clearSuggestions}
        getSuggestionValue={place => place.place_name}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={onSuggestionSelected}
      />
      <input {...coordinatesInputProps} value={coordinates} readOnly={true} />
    </div>
  )
}

export default MapboxPlaces
