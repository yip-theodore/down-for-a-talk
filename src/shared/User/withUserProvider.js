import React from 'react'
import UserContext from './context'
import { withFirebase } from '../Firebase'

const withUserProvider = Component => {
  
  class WithUserProvider extends React.Component {

    constructor (props) {
      super(props)
      this.state = {
        user: {}
      }
    }

    componentDidMount () {
      const { firebase } = this.props
      
      firebase.onUserChange(user => this.setState({ user }))
    }

    render () {
      const { user } = this.state
      return (
        <UserContext.Provider value={user}>
          <Component {...this.props} />
        </UserContext.Provider>
      )
    }
  }
  return withFirebase(WithUserProvider)
}

export default withUserProvider