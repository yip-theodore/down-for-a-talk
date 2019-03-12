const functions = require('firebase-functions');

exports.match =
  functions.database.ref('/waiting')
  .onWrite((snapshot, context) => {

    const changes = snapshot.after.val()
    if (!changes) return Promise.resolve()

    const uids = Object.keys(changes)
    if (uids.length < 2) return Promise.resolve()


    const { root } = snapshot.after.ref
    const { key } = root.child('conversation').push()

    const doRemoveFromWaiting = snapshot.after.ref.remove()
    const doSetConversationKey = uids.map(uid => root.child(`user/${uid}`).set(key))
    
    return Promise.all([ doRemoveFromWaiting, ...doSetConversationKey ])
  })
