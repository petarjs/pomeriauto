import React from 'react'

import './index.css'

class LicencePlateInput extends React.Component {
    render () {
        return (
            <React.Fragment>
                {
                    !this.props.hideLabel && (
                        <label htmlFor="plate">{this.props.label || 'Moj auto:'}</label>
                    )
                }
                <div className="plate__wrapper">
                    <span></span>
                    <input value={this.props.value} type="text" name="plate" className="plate-input" placeholder="BGXXXYY" onChange={e => this.props.onLicenceChange(e)} />
                </div>
                <div className="plate__subinfo">
                    Unesite slova identično kao na slici, sa kvačicama
                </div>
            </React.Fragment>
        )
    }
}

export default LicencePlateInput