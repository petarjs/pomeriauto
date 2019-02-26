import React from 'react'
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';

import firebase from '../../services/firebase'
import Cars from '../../services/api/cars'
import Loading from '../../components/Loading'

import './index.css'
import LicencePlateInput from '../../components/LicencePlateInput';

class MyCarPage extends React.Component {
    state = {
        loading: true,
        carFilename: '',
        progress: 0,
        carURL: '',
        licencePlate: ''
    }

    async componentDidMount () {
        let id = this.props.match.params.id
        let car = await Cars.getById(id)

        this.setState({
            car,
            licencePlate: car.licencePlate,
            loading: false
        })
    }

    onLicenceChange = e => this.setState({ licencePlate: e.target.value })

    async onSave () {
        let id = this.props.match.params.id
        await Cars.updateMyCar(id, {
            licencePlate: this.state.licencePlate.toUpperCase()
        })

        this.props.history.push('/my-cars')
    }

    async onDelete () {
        let id = this.props.match.params.id
        await Cars.deleteMyCar(id)
        this.props.history.push('/my-cars')
    }

    handleUploadStart = () => this.setState({ loading: true, progress: 0 });

    handleProgress = progress => this.setState({ progress });

    handleUploadError = error => {
        this.setState({ loading: false });
        console.error(error);
        alert(error)
    };

    handleUploadSuccess = filename => {
        this.setState({ carFilename: filename, progress: 100 });

        firebase
            .storage()
            .ref('cars')
            .child(filename)
            .getDownloadURL()
            .then(async url => {
                this.setState({ carURL: url })

                let carId = this.props.match.params.id
                await Cars.setImage(carId, url)

                let car = await Cars.getById(carId)

                this.setState({ car, loading: false })
            });

    };

    renderPage () {
        return (
            this.state.loading
                ?
                    <Loading />
                :
                    <React.Fragment>
                        {this.state.car.imageUrl && <img className="car__image" alt="Car" src={this.state.car.imageUrl} />}

                        <LicencePlateInput value={this.state.licencePlate} onLicenceChange={e => this.onLicenceChange(e)} />

                        <button onClick={() => this.onSave()}>Sačuvaj podatke</button>
                        <button onClick={() => this.onDelete()}>Izbrisi auto</button>

                        <CustomUploadButton
                            accept="image/*"
                            name="car"
                            randomizeFilename
                            storageRef={firebase.storage().ref('cars')}
                            onUploadStart={this.handleUploadStart}
                            onUploadError={this.handleUploadError}
                            onUploadSuccess={this.handleUploadSuccess}
                            onProgress={this.handleProgress}
                            className="button full-width"
                        >
                            Izaberite sliku auta
                        </CustomUploadButton>
                    </React.Fragment>
        )
    }

    render () {
        return (
            this.state.car
                ? this.renderPage()
                : <Loading />
        )
    }
}

export default MyCarPage