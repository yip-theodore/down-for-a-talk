

import React, { useContext } from 'react'
import UserContext from '../../shared/User'
import FirebaseContext from '../../shared/Firebase'

function Home () {

  const user = useContext(UserContext)
  const firebase = useContext(FirebaseContext)

  const join = async () => {
    if (!user.uid) await firebase.createUser()
    firebase.joinWaitingRoom()
  }

  return (
    <button onClick={join}>
      {user.uid ? 'Enter' : 'Join'}
    </button>
  )
}

export default Home