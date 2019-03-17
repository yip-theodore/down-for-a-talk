import React from 'react'
import classNames from 'classnames'
import './main.scss'

function Main ({
  messages,
  user,
  otherUser
}) {
  return (
    <div className='Conversation__main'>
      {messages.map(([ key, { value, user: author } ]) =>
        <div
          key={key}
          className={classNames({
            'message--self': author === user.uid,
            'message--other': author !== user.uid,
          }, 'message')}
        >
          {value}
        </div>
      )}
      {otherUser.left ? (
        <span className='message message--info'>The other person just left.</span>
      ) : (
        !messages.length && (
          <span className='message message--info'>Let’s do it!</span>
        )
      )}
      {otherUser.typing && (
        <div className='message message--typing'>
          <div/><div/><div/>
        </div>
      )}
    </div>
  )
}

export default Main