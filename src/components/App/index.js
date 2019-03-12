import React, { Component } from 'react'
import { compose } from 'recompose'
import { withFirebaseProvider } from '../Firebase'
import { withUserProvider, withUser } from '../User'

class App extends Component {

  join = async () => {
    const { firebase, user } = this.props

    if (!user.uid) await firebase.createUser()
    firebase.joinWaitingRoom()
  }

  render() {
    const { user } = this.props
    return (
      <div>
        <pre>{JSON.stringify(user, null, 2)}</pre>

        {user.conversationId
          ? <h2>Chat</h2>
          : user.waiting
            ? <span>Looking for someone…</span>
            : <button onClick={this.join}>
                {user.uid ? 'Enter' : 'Join'}
              </button>
        }
      </div>
    );
  }
}

export default compose(
  withFirebaseProvider,
  withUserProvider,
  withUser
)(App)