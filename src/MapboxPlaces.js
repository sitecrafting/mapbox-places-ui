import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import mapboxClient from '@mapbox/mapbox-sdk'
import geocodingService from '@mapbox/mapbox-sdk/services/geocoding'
import Autosuggest from 'react-autosuggest'

import Suggestion from './Suggestion'

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
 *   current search term from Mapbox, which also takes into account the passed
 *   geocodeQueryOptions
 */
function useForwardGeocoder({ mapboxToken, geocodeQueryOptions }) {
  const [client, _] = useState(
    geocodingService(mapboxClient({ accessToken: mapboxToken }))
  )

  const [suggestions, setSuggestions] = useState([])

  const clearSuggestions = () => setSuggestions([])

  // Build a handler fn for fetching suggestied Places from Mapbox,
  // taking into account the user-provided query options.
  const fetchSuggestions = ({ value }) => {
    const opts = Object.assign({}, geocodeQueryOptions, { query: value })
    client.forwardGeocode(opts)
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
function useCoordinates(initialCoordinates, { coordinatesFormat, onCoordinatesUpdated }) {
  const [coordinates, setSelectedCoordinates] = useState("")

  const reverseCoords = coordinatesFormat === 'lat,lng'
  const onSuggestionSelected = (_, { suggestion }) => {
    const mapboxCoords = suggestion.geometry.coordinates
    const coords = reverseCoords ? mapboxCoords.reverse() : mapboxCoords

    // Set the new coordinates to the selected Place's coords,
    // as a comma-separated string.
    setSelectedCoordinates(coords.join(','))

    if (typeof onCoordinatesUpdated === 'function') {
      onCoordinatesUpdated({ coords, suggestion })
    }
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
  const [value, setValue] = useState(initialValue || "")

  const onChange = (_, { newValue }) => setValue(newValue)

  return [value, onChange]
}

function MapboxPlaces({
  mapboxToken,
  initialValue,
  textInputProps,
  coordinatesInputProps,
  coordinatesFormat,
  containerProps,
  suggestionComponent,
  geocodeQueryOptions,
  onCoordinatesUpdated,
}) {
  // Wrap the Mapbox forwardGeocode service.
  const [
    suggestions,
    clearSuggestions,
    fetchSuggestions
  ] = useForwardGeocoder({ mapboxToken, geocodeQueryOptions })

  // Fallback on the built-in Suggestion component.
  const renderSuggestion = suggestionComponent || Suggestion

  const [coordinates, onSuggestionSelected] = useCoordinates("", {
    coordinatesFormat,
    onCoordinatesUpdated,
  })

  // Apply inputProps defaults.
  const [value, onChange] = useInputValue(initialValue)
  const inputProps = Object.assign({
    name: 'place_name',
    type: 'text',
  }, textInputProps, { value, onChange })

  // Apply coordinatesInputProps defaults.
  const coordProps = Object.assign({
    name: 'coordinates',
    type: 'hidden',
  }, coordinatesInputProps, { value: coordinates, readOnly: true })

  return (
    <div {...containerProps}>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={fetchSuggestions}
        onSuggestionsClearRequested={clearSuggestions}
        getSuggestionValue={feature => feature.place_name}
        renderSuggestion={feature => renderSuggestion({ feature })}
        inputProps={inputProps}
        onSuggestionSelected={onSuggestionSelected}
      />
      <input {...coordProps} />
    </div>
  )
}

export default MapboxPlaces
