import React from 'react'
import FirebaseContext from './context'
import Firebase from './firebase'

const withFirebaseProvider = Component => props => (
  <FirebaseContext.Provider value={new Firebase()}>
    <Component {...props} />
  </FirebaseContext.Provider>
)

export default withFirebaseProvider