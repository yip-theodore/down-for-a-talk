import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
}

class Firebase {
  constructor () {
    app.initializeApp(config)
    this.auth = app.auth()
    this.db = app.database()
  }

  createUser = () => this.auth.signInAnonymously()

  joinWaitingRoom = () => {
    this.userRef.update({ waiting: true })
    this.waitingRef.set(true)

    this.leaveWaitingRoom('onDisconnect')
  }

  leaveWaitingRoom = (on = 'child') => {
    this.userRef[on]('/').update({ waiting: false }, () => {
      on !== 'onDisconnect' && this.userRef.onDisconnect().cancel()
    })
    
    this.waitingRef[on]('/').set(false, () => {
      on !== 'onDisconnect' && this.waitingRef.onDisconnect().cancel()
    })

  }

  onUserChange = callback => {
    this.auth.onAuthStateChanged(authUser => {
      if (!authUser) return

      this.userRef = this.db.ref(`users/${authUser.uid}`)
      this.waitingRef = this.db.ref(`waiting/${authUser.uid}`)


      this.userRef.on('value', snapshot => {
        const userInfo = snapshot.val()
        
        const user = { uid: authUser.uid, ...userInfo }
        callback(user)
      })
    })
  }

  suscribeToConversationChange = (callback, user) => {

    this.conversationRef = this.db.ref(`conversations/${user.conversationId}`)

    this.conversationListener =
      this.conversationRef.on('value', snapshot => {
        const conversation = snapshot.val()
        callback(conversation)
      })

    this.leaveConversation('onDisconnect', user)
  }

  unsuscribeToConversationChange = () => {
    this.conversationRef.off('value', this.conversationListener)
    this.conversationRef = null
  }
  
  leaveConversation = (on = 'child', user) => {

    this.conversationRef.child(`users/${user.uid}`)[on]('/')
    .update({
      left: true
    }, () => {
      on !== 'onDisconnect' && this.conversationRef.child(`users/${user.uid}`).onDisconnect().cancel()
      on !== 'onDisconnect' && this.unsuscribeToConversationChange()
    })

    const key = this.userRef.child('previousConversationsIds').push().key

    this.userRef[on]('/').update({
      conversationId: false,
      previousConversationsIds: {
        ...user.previousConversationsIds,
        [key]: user.conversationId
      }
    }, () => {
      on !== 'onDisconnect' && this.userRef.onDisconnect().cancel()
    })
  }

}

export default Firebase