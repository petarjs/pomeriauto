import React from 'react'
import logo from '../../img/logo.png'

import './index.css'

const Loading = () => (
    <div className="loading">
        <img className="loading__logo" src={logo} alt="logo" />
        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        <div className="loading__info">Učitavanje...</div>
    </div>
)

export default Loading