

import React, { useContext } from 'react'
import FirebaseContext from '../../shared/Firebase'
import useAnimatedText from '../../shared/useAnimatedText'

const defaultText = `
d^-^b < Great!

Let’s wait for someone to pick up ~`

function Waiting () {

  const firebase = useContext(FirebaseContext)

  const leave = () => firebase.leaveWaitingRoom()

  const { text, letterCount } = useAnimatedText(defaultText)

  return (
    <div className='Waiting container'>
      <p>
        {text.slice(0, letterCount)}
      </p>
      {letterCount >= text.length && (
        <button onClick={leave}>Nvm</button>
      )}
    </div>
  )
}

export default Waiting