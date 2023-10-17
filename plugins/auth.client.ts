import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth'
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getFunctions } from 'firebase/functions'

// const { $liffInitPromise } = useNuxtApp()
// const liff = await $liffInitPromise as any

export default defineNuxtPlugin((nuxtApp) => {

  /** firebase app initialize */
  const config = useRuntimeConfig()
  const firebaseConfig = {
    apiKey: config.public.apiKey,
    authDomain: config.public.authDomain,
    projectId: config.public.projectId,
    storageBucket: config.public.storageBucket,
    appId: config.public.appId,
    measurementId: config.public.measurementId
  }
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)

  /** provide things */
  nuxtApp.provide('firebaseApp', app)
  nuxtApp.provide('fireAuth', auth)
  nuxtApp.provide('fireStore', getFirestore(app))
  nuxtApp.provide('fireStorage', getStorage(app))
  nuxtApp.provide('fireFunctions', getFunctions(app))

  /** auth state changed */
  onAuthStateChanged(auth, async (user) => {
    const { loggedInUser, signInWithLINEToken } = useAuth()
    const { getUser } = useStore()
    if (user) {
      const liff:any = await nuxtApp.$liffInit
      const idTokenValue = liff.getIDToken()
      await useFetch('/api/updateUserProfile',{
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: idTokenValue }),
      })
      console.log("user is logged in")
      await getUser(user.uid)
      .then((res) => {
        loggedInUser.value = res
      })
      .catch((error) => {
        console.log("error", error)
        alert("失敗")
      })
    } else {
      try {
        const liff:any = await nuxtApp.$liffInit
        if(!liff.isLoggedIn()) {
          liff.login()
        }
        const idTokenValue = liff.getIDToken()
        signInWithLINEToken(idTokenValue)
      } catch (error) {
        console.error("Error initializing liff:", error)
        alert("Error initializing liff:" + error)
      }
    }
  })

})