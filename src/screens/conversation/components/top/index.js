import React from 'react'
import { ReactComponent as LeaveIcon } from '../../../../assets/log-out-outline.svg'
import './top.scss'

function Top ({ handleLeave }) {
  return (
    <div className='Conversation__top fixed'>
      <div className='Conversation__top__body'>
        <button onClick={handleLeave}>
          <LeaveIcon />
        </button>
      </div>
    </div>
  )
}

export default Top