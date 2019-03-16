import React from 'react';
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
  return (
    <div>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      {user.conversationId
        ? <Conversation />
        : user.waiting
          ? <Waiting />
          : <Home />
      }
    </div>
  )
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
