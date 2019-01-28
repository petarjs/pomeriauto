import React from 'react'
import { Link } from 'react-router-dom'
import { logout } from '../../services/auth'

class SettingsPage extends React.Component {
    async logout () {
        await logout()
        this.props.history.push('/login')
    }

    render () {
        return (
            <React.Fragment>
                <div>
                    <Link className="button full-width" to="/my-cars">Moji automobili</Link>
                </div>
                <div>
                    <button className="full-width" onClick={() => this.logout()}>Logout</button>
                </div>
            </React.Fragment>
        )
    }
}

export default SettingsPage