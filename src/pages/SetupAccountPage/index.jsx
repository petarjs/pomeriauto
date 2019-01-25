import React from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import Settings from '../../services/api/settings'
import Cars from '../../services/api/cars'
import { getCurrentUser } from '../../services/auth'
import Loading from '../../components/Loading';

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

        console.log({settings});

        this.setState({ settings, loading: false })
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
                licencePlate: this.state.licencePlate
            })

            this.setState({ loading: false })

            this.props.history.push('/')
        } catch(ex) {
            this.setState({ loading: false })
            alert(ex)
        }
    }

    async onSkip () {
        if (!this.state.termsAccepted) {
            alert('Prihvati uslove')
            return
        }

        await Settings.saveMySettings({
            termsAccepted: this.state.termsAccepted,
        })

        this.props.history.push('/')
    }

    renderPage () {
        console.log('render page');
        return (
            <div>
                <h3 className="page__heading">Samo minut, dva...</h3>
                <div className="main__content">
                    <label>
                        <input type="checkbox" onChange={e => this.onTermsChange(e)} />
                        Pročitao sam, i slažem se sa <a href="#">Uslovima Korišćenja</a>
                    </label>

                    <label htmlFor="plate">Registarska oznaka:</label>
                    <div className="plate__wrapper">
                        <span></span>
                        <input type="text" name="plate" className="plate-input" onChange={e => this.onLicenceChange(e)} placeholder="BGXXXXYY" />
                    </div>
                    <label htmlFor="email">Email za obaveštenja:</label>
                    <input type="text" name="email" onChange={e => this.onEmailChange(e)} />

                    <div className="bottom-buttons">
                        <button onClick={() => this.onNext()}>Sačuvaj podatke</button>
                        <a onClick={() => this.onSkip()}>Preskoči</a>
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
                        ? <Redirect to={{ pathname: '/' }} />
                        : this.renderPage()
                }
            </React.Fragment>
        )
    }
}

export default withRouter(SetupAccountPage)