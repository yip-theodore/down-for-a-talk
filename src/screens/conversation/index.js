import React, { useState, useEffect, useContext } from 'react'
import UserContext from '../../shared/User'
import FirebaseContext from '../../shared/Firebase'


function Conversation () {

  const user = useContext(UserContext)
  const firebase = useContext(FirebaseContext)
  

  const [ conversation, setConversation ] = useState()

  useEffect(() => {
    firebase.suscribeToConversationChange(setConversation, user)
  }, [])


  const [ input, setInput ] = useState('')

  useEffect(() => {
    if (!conversation) return
    
    if (!conversation.users[user.uid].typing) {
      firebase.conversationRef.child(`users/${user.uid}`)
      .update({ typing: true })
    }
    const timeoutId = window.setTimeout(() => {
      firebase.conversationRef.child(`users/${user.uid}`)
      .update({ typing: false })
    }, 2000)

    return () => window.clearTimeout(timeoutId)
  }, [input])


  const handleSubmit = e => {
    e.preventDefault()
    if (!input) return
    
    firebase.conversationRef.child('messages')
    .push({
      value: input,
      user: user.uid
    })
    firebase.conversationRef.child(`users/${user.uid}`)
    .update({ typing: false })

    setInput('')
  }

  const handleLeave = () => {
    firebase.leaveConversation(undefined, user)
  }

  return (
    <div>
      <h2>Conversation</h2>

      <button onClick={handleLeave}>Leave</button>

      <form onSubmit={handleSubmit} >
        <input
          type='text'
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type='submit'>Send</button>
      </form>

      <pre>{JSON.stringify(conversation, null, 2)}</pre>
    </div>
  )
}

export default Conversation