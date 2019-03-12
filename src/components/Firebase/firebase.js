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
    this.userRef.set({ waiting: true })
    this.waitingRef.push(true)
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

}

export default Firebase