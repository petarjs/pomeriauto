import React from 'react'
import { Link } from 'react-router-dom'

import Loading from '../../components/Loading';
import Cars from '../../services/api/cars';
import CarCard from './CarCard'

import './index.css'

class MyCarsPage extends React.Component {
    state = { myCars: null, loading: true }

    async componentDidMount () {
        let myCars = await Cars.getMyCars()

        this.setState({ myCars, loading: false })
    }

    render () {
        if (this.state.loading) {
            return <Loading />
        }


        return (
            <div className="my-cars">
                <div className="my-cars__header">
                    <h1>Moji automobili</h1>
                    <Link className="button small-button my-cars__add" to="/my-cars/new">Dodaj</Link>
                </div>

                {
                    this.state.myCars
                        ? this.state.myCars.map(car => (
                            <CarCard key={car.id} car={car} />
                        ))
                        : <Loading />
                }
            </div>
        )
    }
}

export default MyCarsPage