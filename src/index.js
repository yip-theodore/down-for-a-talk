import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import * as serviceWorker from './serviceWorker';

import { compose } from 'recompose'
import { withFirebaseProvider } from './shared/Firebase'
import { withUserProvider, withUser } from './shared/User'

import Home from './screens/home'
import Waiting from './screens/waiting'
import Conversation from './screens/conversation'


function AppBase ({ user }) {

  useEffect(() => {
    const localHour = (new Date()).getHours()
    if (localHour < 6 || localHour > 20) {
      document.body.classList.add('--night')
    }
  }, [])


  if (user.conversationId) return <Conversation />
  if (user.waiting) return <Waiting />
  return <Home />
}

const App = compose(
  withFirebaseProvider,
  withUserProvider,
  withUser
)(AppBase)

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
