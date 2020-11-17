import React, { useState } from 'react'
import ReactDOM from 'react-dom'

export default function Suggestion({ place }) {
  return (
    <div className="mapbox-places-ui-suggestion">{place.place_name}</div>
  )
}
