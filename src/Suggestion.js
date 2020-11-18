import React, { useState } from 'react'
import ReactDOM from 'react-dom'

export default function Suggestion({ feature }) {
  return (
    <div className="mapbox-places-ui-suggestion">{feature.place_name}</div>
  )
}
