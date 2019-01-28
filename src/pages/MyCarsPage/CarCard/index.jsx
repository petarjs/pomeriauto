import React from 'react'
import { Link } from 'react-router-dom'

import './index.css'

class CarCard extends React.Component {
    render () {
        let { car } = this.props
        return (
            <Link className="car-card" to={`/my-cars/list/${car.id}`}>
                {
                    !!car.imageUrl &&
                        <div className={`car-card__image`} style={{ backgroundImage: `url("${car.imageUrl}")`}} />
                }
                <div className="car-card__info">
                    {car.licencePlate}
                </div>
            </Link>
        )
    }
}

export default CarCard