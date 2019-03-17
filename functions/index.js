const functions = require('firebase-functions')

exports.matchmaker =
  functions.database.ref('/waiting/{uid}')
  .onWrite(({ after }, { params: { uid } }) => {
    if (!after.exists()) return Promise.resolve()

    const waiting = after.val()
    const { ref } = after
    let matchedUid

    const matchUser = ref.root.child('match')
    .transaction(match => {
        // console.log({ waiting, match, uid })

        if (!match || match.uid === uid) {
          if (!waiting) return
          return { uid }
        }

        matchedUid = match.uid
        return {}
        
      }, (error, committed, snapshot) => {
        if (error) throw error
        // console.log({ error, committed, snapshot: snapshot.val() })
        return { committed, snapshot }
      }, false)
    .then(({ committed, snapshot }) => {
      if (!committed) return Promise.resolve()

      const result = snapshot.val()
      
      if (!waiting) return Promise.resolve()
      if (result && result.uid) return Promise.resolve()

      const conversationRef = ref.root.child('conversations').push()
      const users = [ matchedUid, uid ]

      const setConversation = users.map(userId =>
        conversationRef.child(`users/${userId}`)
        .set({
          left: false,
          typing: false
        }))
      const updateUsers = users.map(userId =>
        ref.root.child(`users/${userId}`)
        .update({
          conversationId: conversationRef.key,
          waiting: false
        }))
      return Promise.all([...setConversation, ...updateUsers])
    })

    const leaveWaitingRoom = ref.remove()
    return Promise.all([ matchUser, leaveWaitingRoom ])
  })
