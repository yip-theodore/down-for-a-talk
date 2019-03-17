import React, { useState, useEffect, useContext, useRef } from 'react'
import UserContext from '../../shared/User'
import FirebaseContext from '../../shared/Firebase'

import Top from './components/top'
import Main from './components/main'
import Bottom from './components/bottom'
import './conversation.scss'


function Conversation () {

  const user = useContext(UserContext)
  const firebase = useContext(FirebaseContext)
  

  const [ conversation, setConversation ] = useState()
  useEffect(() => {
    firebase.suscribeToConversationChange(conversation => {
      setConversation(conversation)
      window.scrollTo({ top: document.body.scrollHeight + 100, behavior: 'smooth' })
    }, user)
  }, [])


  const [ input, setInput ] = useState('')
  const inputRef = useRef()
  useEffect(() => {
    if (!conversation) return
    
    inputRef.current.style.height = input ? `${inputRef.current.scrollHeight + 2}px` : ''
    
    if (!conversation.users[user.uid].typing) {
      if (!input) return
      firebase.conversationRef.child(`users/${user.uid}`)
      .update({ typing: true })
    }
    const timeoutId = window.setTimeout(() => {
      firebase.conversationRef.child(`users/${user.uid}`)
      .update({ typing: false })
    }, 2000)

    return () => window.clearTimeout(timeoutId)
  }, [input])


  const handleChange = e => {
    setInput(e.target.value)
  }
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
  const handleTextareaEnter = e => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      handleSubmit(e)
    }
  }
  const handleLeave = () => {
    firebase.leaveConversation(undefined, user)
  }

  if (!conversation) return null
  
  const messages = Object.entries(conversation.messages || {})
  const otherUid = Object.keys(conversation.users).filter(uid => uid !== user.uid)
  
  return (
    <div className='Conversation container'>

      <Top handleLeave={handleLeave} />

      <Main
        messages={messages}
        user={user}
        otherUser={conversation.users[otherUid]}
      />

      <Bottom
          input={input}
          handleChange={handleChange}
          handleTextareaEnter={handleTextareaEnter}
          handleSubmit={handleSubmit}
          inputRef={inputRef}
          disabled={conversation.users[otherUid].left}
      />

    </div>
  )
}

export default Conversation