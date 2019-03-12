import React, { Component } from 'react'
import { compose } from 'recompose'
import { withFirebaseProvider } from '../Firebase'
import { withUserProvider, withUser } from '../User'

class App extends Component {

  join = () => {
    const { firebase, user } = this.props

    if (user) {
      firebase.waiting(user.uid).set(true)
    } else {
      firebase.createUser()
      .then(({ user }) =>
        firebase.waiting(user.uid).set(true)
      )
    }
  }

  render() {
    const { user } = this.props
    return (
      <div>
        <pre>{JSON.stringify(user, null, 2)}</pre>
        <button onClick={this.join}>Join</button>
      </div>
    );
  }
}

export default compose(
  withFirebaseProvider,
  withUserProvider,
  withUser
)(App)