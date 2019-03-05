import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import firebase, { init as initFirebase } from './services/firebase'
import { authInitialized } from './services/auth'

initFirebase()

authInitialized()
  .then(() => {
    ReactDOM.render(<App />, document.getElementById('root'));
  })
  .catch(e => console.log(e))
