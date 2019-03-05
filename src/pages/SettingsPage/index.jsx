import React from 'react'
import { Link } from 'react-router-dom'
import { logout } from '../../services/auth'
import LicencePlateInput from '../../components/LicencePlateInput';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import firebase from '../../services/firebase'
import Cars from '../../services/api/cars';
import Loading from '../../components/Loading';
import routes from '../../routes';
import requireMyCar from '../../components/RequireMyCar';

class SettingsPage extends React.Component {
    state = {
        licencePlate: '',
        loading: true,
        carFilename: '',
        progress: 0,
        carURL: '',
    }

    async componentDidMount () {
        let car = await Cars.getMyCar()

        let newState = {
            loading: false
        }

        if (car) {
            newState.car = car
            newState.licencePlate = car.licencePlate
        }

        this.setState(newState)
    }

    async onSave () {
        let id = this.state.car.id

        await Cars.updateMyCar(id, {
            licencePlate: this.state.licencePlate.toUpperCase()
        })

        this.props.history.push(routes.HOME_PAGE)
    }

    async logout () {
        await logout()
        this.props.history.push(routes.LOGIN_PAGE)
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

                let carId = this.state.car.id
                await Cars.setImage(carId, url)

                this.setState({ loading: false })
            });
    };

    onLicenceChange(e) {
        this.setState({
            licencePlate: e.target.value
        })
    }

    render () {
        return (
            this.state.loading
                ? <Loading />
                : <React.Fragment>
                    <div className="page-header">
                        <div className="title">Podešavanja</div>
                        <button className="button-outline" onClick={() => this.logout()}>Logout</button>
                    </div>

                    <div className="settings-content">

                        <div className="page-subheader">
                            <div className="subtitle">
                                <i className="material-icons">info</i>
                                Promenite aktivno vozilo za koje želite da primate notifikacije.
                            </div>
                        </div>

                        <div className="settings__licence-plate">
                            <LicencePlateInput
                                value={this.state.licencePlate}
                                onLicenceChange={e => this.onLicenceChange(e)}
                            />
                        </div>

                        <div>
                            {this.state.car.imageUrl && <img className="car__image" alt="Car" src={this.state.car.imageUrl} />}

                            <div className="settings-actions">
                                <CustomUploadButton
                                    accept="image/*"
                                    name="car"
                                    randomizeFilename
                                    storageRef={firebase.storage().ref('cars')}
                                    onUploadStart={this.handleUploadStart}
                                    onUploadError={this.handleUploadError}
                                    onUploadSuccess={this.handleUploadSuccess}
                                    onProgress={this.handleProgress}
                                    className="button button-outline settings-action"
                                >
                                    Izaberite sliku
                                </CustomUploadButton>

                                {/* <button className="button button-outline settings-action">Saobrcajna</button> */}
                            </div>
                        </div>
                    </div>


                    <div className="bottom-buttons">
                        <Link className="button button-clear" to={routes.HOME_PAGE}>Odustani</Link>
                        <button onClick={() => this.onSave()}>Sačuvaj</button>
                    </div>
                </React.Fragment>
        )
    }
}

export default requireMyCar(SettingsPage)