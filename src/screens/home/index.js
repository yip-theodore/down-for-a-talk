

import React, { useContext, useRef } from 'react'
import UserContext from '../../shared/User'
import FirebaseContext from '../../shared/Firebase'
import useAnimatedText from '../../shared/useAnimatedText'

const welcomeText = `
d^-^b < Welcome aboard!

Here, you can chat with other humans, just like you, from all over the world!

Everything stays anonymous, so feel free to be yourself!

Ready?`

const defaultText = `
d^-^b < Welcome back!

Down for a talk?`

function Home () {

  const user = useContext(UserContext)
  const firebase = useContext(FirebaseContext)

  const clickedRef = useRef()
  
  const join = async () => {
    if (clickedRef.current) return
    clickedRef.current = true

    if (!user.uid) await firebase.createUser()
    firebase.joinWaitingRoom()
  }

  const { text, letterCount } = useAnimatedText(user.uid ? defaultText : welcomeText)

  return (
    <div className='Home container'>
      <p>
        {text.slice(0, letterCount)}
      </p>
      {letterCount >= text.length && (
        <button onClick={join}>
          {user.uid ? 'Sure' : 'Yes'}
        </button>
      )}
    </div>
  )
}

export default Home