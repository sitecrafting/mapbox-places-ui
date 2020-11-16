import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import mapboxClient from '@mapbox/mapbox-sdk'
import Autosuggest from 'react-autosuggest'

function MapboxPlaces(props) {
  const [value, setValue] = useState(props.initialValue)

  return (
    <Autosuggest
      suggestions={['Tacoma', 'Spokane', 'Orting']}
      renderSuggestion={x => x}
      onSuggestionsFetchRequested={() => console.log('fetch!')}
      onSuggestionsClearRequested={() => console.log('clear!')}
      getSuggestionValue={(x) => x}
      inputProps={Object.assign({}, props.inputProps, {
        value,
        onChange: (e, { newValue }) => setValue(newValue),
      })}
    />
  )
}

export default MapboxPlaces
