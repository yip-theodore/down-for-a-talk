import { useState, useEffect } from 'react'

const useAnimatedText = (string) => {
  const [ letterCount, setLetterCount ] = useState(0)
  const [ text, setText ] = useState(string)

  useEffect(() => {
    if (letterCount > string.length) return

    const isO = string[letterCount-1] && !/\.|!|\?|,|</.test(string[letterCount-1])

    const timeoutId = window.setTimeout(() => {
      setLetterCount(letterCount => letterCount + 1)
    }, isO ? 30 : 300)

    setText(isO ? string.replace('-', 'o') : string)

    return () => window.clearTimeout(timeoutId)
  }, [letterCount])

  useEffect(() => {
    const skip = () => setLetterCount(string.length)
    window.addEventListener('click', skip)
    return () => window.removeEventListener('click', skip)
  }, [])

  return { text, letterCount }
}

export default useAnimatedText