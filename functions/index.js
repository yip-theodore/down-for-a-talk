const functions = require('firebase-functions')

exports.matchmaker =
  functions.database.ref('/waiting/{uid}')
  .onCreate(({ ref }, { params: { uid } }) => {
    let matchedUid

    const matchUser = ref.root.child('match')
    .transaction(match => {
        if (!match) return { uid }
        matchedUid = match.uid
        return {}
      }, (error, committed, snapshot) => {
        if (error) throw error
        return { committed, snapshot }
      }, false)
    .then(({ committed, snapshot }) => {
      if (!committed) return Promise.resolve()

      const after = snapshot.val()
      if (after && after.uid) return Promise.resolve()

      const conversationRef = ref.root.child('conversations').push()
      const users = [ matchedUid, uid ]

      const setConversation = conversationRef.set({ users })
      const updateUsers = users.map(userId =>
        ref.root.child(`users/${userId}`)
        .update({
          conversationId: conversationRef.key,
          waiting: false
        }))
      return Promise.all([setConversation, ...updateUsers])
    })

    const leaveWaitingRoom = ref.remove()
    return Promise.all([ matchUser, leaveWaitingRoom ])
  })
