import React from 'react'

import './index.css'

class LicencePlate extends React.Component {
    render () {
        return (
            <div className={`plate__wrapper ${this.props.hidePlate ? 'plate-hidden' : ''}`}>
                <span></span>
                <div className="plate">{this.props.children}</div>
            </div>
        )
    }
}

export default LicencePlate