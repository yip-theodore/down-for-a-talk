

import React, { useContext } from 'react'
import UserContext from '../../shared/User'
import FirebaseContext from '../../shared/Firebase'

function Waiting () {

  const user = useContext(UserContext)
  const firebase = useContext(FirebaseContext)

  const leave = () => firebase.leaveWaitingRoom()

  return (
    <div>
      Looking for someone…
      <button onClick={leave}>Leave</button>
    </div>
  )
}

export default Waiting