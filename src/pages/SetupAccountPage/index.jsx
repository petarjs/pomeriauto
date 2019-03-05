import React from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import Settings from '../../services/api/settings'
import Cars from '../../services/api/cars'
import { getCurrentUser } from '../../services/auth'
import Loading from '../../components/Loading';
import LicencePlateInput from '../../components/LicencePlateInput';
import routes from '../../routes';

class SetupAccountPage extends React.Component {
    state = {
        loading: true,
        settings: null,
        termsAccepted: null,
        notificationEmail: null,
        licencePlate: null
    }

    async componentWillMount () {
        let settings = await Settings.getMySettings()
        let user = getCurrentUser()

        this.setState({
            settings,
            notificationEmail: user.providerData[0].email,
            loading: false
        })
    }

    onTermsChange(e) {
        this.setState({ termsAccepted: e.target.value === 'on' })
    }

    onEmailChange(e) {
        this.setState({ notificationEmail: e.target.value })
    }

    onLicenceChange(e) {
        this.setState({ licencePlate: e.target.value })
    }

    async onNext() {
        if (!this.state.termsAccepted) {
            alert('Prihvati uslove')
            return
        }

        this.setState({ loading: true })

        try {
            await Settings.saveMySettings({
                termsAccepted: this.state.termsAccepted,
                notificationEmail: this.state.notificationEmail
            })

            await Cars.addMyCar({
                ownerId: getCurrentUser().uid,
                licencePlate: this.state.licencePlate.toUpperCase()
            })

            this.setState({ loading: false })

            this.props.history.push(routes.HOME_PAGE)
        } catch(ex) {
            this.setState({ loading: false })
            alert(ex)
        }
    }

    async onSkip () {
        if (!this.state.termsAccepted) {
            alert('Prihvatite uslove')
            return
        }

        await Settings.saveMySettings({
            termsAccepted: this.state.termsAccepted,
        })

        this.props.history.push(routes.HOME_PAGE)
    }

    renderPage () {
        return (
            <div>
                <h3 className="page__heading">Samo minut, dva...</h3>
                <div className="main__content">
                    <label>
                        <input type="checkbox" onChange={e => this.onTermsChange(e)} />
                        Pročitao sam, i slažem se sa <a href="#">Uslovima Korišćenja</a>
                    </label>

                    <LicencePlateInput
                        onLicenceChange={e => this.onLicenceChange(e)}
                        value={this.state.licencePlate}
                    />

                    <label htmlFor="email">Email za obaveštenja:</label>
                    <input type="text" name="email" value={this.state.notificationEmail} onChange={e => this.onEmailChange(e)} />

                    <div className="bottom-buttons">
                        <a href="" onClick={() => this.onSkip()}>Preskoči</a>
                        <button onClick={() => this.onNext()}>Sačuvaj podatke</button>
                    </div>
                </div>
            </div>
        )
    }

    render () {
        if (this.state.loading) {
            return <Loading />
        }

        return (
            <React.Fragment>
                {
                    (this.state.settings && this.state.settings.termsAccepted)
                        ? <Redirect to={{ pathname: routes.HOME_PAGE }} />
                        : this.renderPage()
                }
            </React.Fragment>
        )
    }
}

export default withRouter(SetupAccountPage)