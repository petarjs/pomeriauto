import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { init as initFirebase } from './services/firebase'
import { authInitialized } from './services/auth'

initFirebase()

authInitialized()
  .then(() => {
    ReactDOM.render(<App />, document.getElementById('root'));
  })
  .catch(e => console.log(e))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
