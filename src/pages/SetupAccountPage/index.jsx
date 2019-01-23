import React from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import Settings from '../../services/api/settings'
import Cars from '../../services/api/cars'
import { getCurrentUser } from '../../services/auth'

class SetupAccountPage extends React.Component {
    state = {
        settings: null,
        termsAccepted: null,
        notificationEmail: null,
        licencePlate: null
    }

    async componentWillMount () {
        let settings = await Settings.getMySettings()

        console.log({settings});

        this.setState({ settings })
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

        await Settings.saveMySettings({
            termsAccepted: this.state.termsAccepted,
            notificationEmail: this.state.notificationEmail
        })

        await Cars.addMyCar({
            ownerId: getCurrentUser().uid,
            licencePlate: this.state.licencePlate
        })

        this.props.history.push('/')
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
                <input type="checkbox" onChange={e => this.onTermsChange(e)} />

                <input type="text" onChange={e => this.onLicenceChange(e)} />

                <input type="text" onChange={e => this.onEmailChange(e)} />

                <button onClick={() => this.onNext()}>Next</button>
                <button onClick={() => this.onSkip()}>Skip</button>
            </div>
        )
    }

    render () {
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