import React from 'react'

import './index.css'

class Empty extends React.Component {
    render () {
        return (
            <div className="empty-state">
                <div className="empty-state__icon">
                    <i className="material-icons">{this.props.icon}</i>
                </div>

                <div className="empty-state__text">
                    {this.props.text}
                </div>
            </div>
        )
    }
}

export default Empty