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

function MapboxPlaces({
  mapboxToken,
  textInputProps,
  coordinatesInputProps,
  coordinatesFormat,
  onSuggestionSelected,
  containerProps,
  suggestionComponent,
  geocodeQueryOptions,
}) {
  if (typeof onSuggestionSelected !== 'function') {
    throw new Error('onSuggestionSelected must be a function!')
  }
  if (typeof textInputProps.value !== 'string') {
    throw new Error('textInputProps.value must be a string!')
  }
  if (typeof coordinatesInputProps.value !== 'string') {
    throw new Error('coordinatesInputProps.value must be a string!')
  }

  // Wrap the Mapbox forwardGeocode service.
  const [
    suggestions,
    clearSuggestions,
    fetchSuggestions
  ] = useForwardGeocoder({ mapboxToken, geocodeQueryOptions })

  // Fallback on the built-in Suggestion component.
  const renderSuggestion = suggestionComponent || Suggestion

  // Mapbox uses lng,lat format. Should we invoke our on-selected callback
  // with reversed coordinates?
  const shouldReverseCoords = coordinatesFormat === 'lat,lng'

  // Close around onSuggestionSelected so we can pass it more information
  // than AutoSuggest alone gives us.
  const autoSuggestSelectedCallback = (_, { suggestion }) => {
    const [lng, lat]  = suggestion.geometry.coordinates
    const coords      = shouldReverseCoords ? [lat, lng] : [lng, lat]
    const coordsValue = coords.join(',')

    onSuggestionSelected({ coords, coordsValue, suggestion })
  }

  // Apply inputProps defaults.
  const inputProps = Object.assign({
    name: 'place_name',
    type: 'text',
  }, textInputProps)

  // Apply coordinatesInputProps defaults.
  const coordProps = Object.assign({
    name: 'coordinates',
    type: 'hidden',
  }, coordinatesInputProps, { readOnly: true })

  // Clear coordinates when the user clears the input.
  // TODO parameterize this behavior as a prop?
  if (coordProps.value && textInputProps.value === '') {
    coordProps.value = ''
  }

  return (
    <div {...containerProps}>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={fetchSuggestions}
        onSuggestionsClearRequested={clearSuggestions}
        getSuggestionValue={feature => feature.place_name}
        renderSuggestion={feature => renderSuggestion({ feature })}
        inputProps={inputProps}
        onSuggestionSelected={autoSuggestSelectedCallback}
      />
      <input {...coordProps} />
    </div>
  )
}

export default MapboxPlaces
