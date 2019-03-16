import React from 'react'
import UserContext from './context'

const withUser = Component => props => (
  <UserContext.Consumer>
    {user => <Component user={user} {...props} />}
  </UserContext.Consumer>
)

export default withUser