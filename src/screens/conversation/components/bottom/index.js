import React from 'react'
import { ReactComponent as SendIcon } from '../../../../assets/arrow-upward-outline.svg'
import './bottom.scss'

function Bottom ({
  input,
  handleChange,
  handleTextareaEnter,
  inputRef,
  handleSubmit,
  disabled
}) {
  return (
    <form className='Conversation__bottom fixed'>
      <div className='Conversation__bottom__body'>
        <textarea
          type='text'
          value={input}
          onChange={handleChange}
          onKeyDown={handleTextareaEnter}
          ref={inputRef}
          disabled={disabled}
        ></textarea>
        <button
          onClick={handleSubmit}
          disabled={disabled}
        >
          <SendIcon />
        </button>
      </div>
    </form>
  )
}

export default Bottom