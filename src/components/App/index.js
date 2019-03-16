import React, { Component } from 'react'
import { compose } from 'recompose'
import { withFirebaseProvider } from '../Firebase'
import { withUserProvider, withUser } from '../User'

import Conversation from '../Conversation'

class App extends Component {

  join = async () => {
    const { firebase, user } = this.props

    if (!user.uid) await firebase.createUser()
    firebase.joinWaitingRoom()
  }

  leave = () => this.props.firebase.leaveWaitingRoom()

  render() {
    const { user } = this.props
    return (
      <div>
        <pre>{JSON.stringify(user, null, 2)}</pre>

        {user.conversationId
          ? <Conversation />
          : user.waiting
            ? <div>
                Looking for someone…
                <button onClick={this.leave}>Leave</button>
              </div>
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