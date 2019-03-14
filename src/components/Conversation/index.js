import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../User'
import { FirebaseContext } from '../Firebase'


const useConversation = (conversationRef) => {

  const [ conversation, setConversation ] = useState()

  useEffect(() => {
    const conversationListener = 
      conversationRef.on('value', snapshot => {
        const conversation = snapshot.val()
        setConversation(conversation)
      })

    return () => conversationRef.off(conversationListener)
  }, [])

  return conversation
}


function Conversation () {

  const user = useContext(UserContext)
  const firebase = useContext(FirebaseContext)
  const conversationRef = firebase.db.ref(`conversations/${user.conversationId}`)
  
  const [ input, setInput ] = useState('')
  const conversation = useConversation(conversationRef)


  useEffect(() => {
    if (!conversation) return
    
    if (!conversation.users[user.uid].typing) {
      console.log('timer true')
      conversationRef.child(`users/${user.uid}`).update({ typing: true })
    }
    const timeoutId = window.setTimeout(() => {
      console.log('timer false')
      conversationRef.child(`users/${user.uid}`).update({ typing: false })
    }, 2000)

    return () => window.clearTimeout(timeoutId)
  }, [input])

  const handleSubmit = e => {
    e.preventDefault()
    if (!input) return

    conversationRef.child('messages').push({
      value: input,
      user: user.uid
    })
    setInput('')
  }

  return (
    <div>
      <h2>Conversation</h2>

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