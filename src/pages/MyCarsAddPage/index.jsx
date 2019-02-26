import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import Cars from '../../services/api/cars'
import { getCurrentUser } from '../../services/auth'
import Loading from '../../components/Loading'
import LicencePlateInput from '../../components/LicencePlateInput';

class MyCarsAddPage extends React.Component {
    state = { licencePlate: '', loading: false }

    onLicenceChange(e) {
        this.setState({ licencePlate: e.target.value })
    }

    async addCar () {
        this.setState({ loading: true })

        let user = getCurrentUser()

        await Cars.addMyCar({
            licencePlate: this.state.licencePlate.toUpperCase(),
            ownerId: user.uid
        })

        this.setState({ loading: false })

        this.props.history.push('/my-cars')
    }

    render () {
        return (
            this.state.loading
                ? <Loading />
                : <React.Fragment>
                    <Link to="/my-cars">Nazad</Link>

                    <LicencePlateInput
                        onLicenceChange={e => this.onLicenceChange(e)}
                        value={this.state.licencePlate}
                    />

                    <button className="full-width" onClick={() => this.addCar()}>DODAJ</button>
                </React.Fragment>
        )
    }
}

export default withRouter(MyCarsAddPage)