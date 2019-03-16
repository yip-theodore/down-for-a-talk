import React from 'react'
import FirebaseContext from './context'

const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    {firebase => <Component firebase={firebase} {...props} />}
  </FirebaseContext.Consumer>
)

export default withFirebase