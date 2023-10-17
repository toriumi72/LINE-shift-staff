import {
  getIdTokenResult,
  signInWithCustomToken,
  updateProfile,
} from 'firebase/auth'
import type { User, IdTokenResult } from "firebase/auth"
import type { LoggedInUser } from '@/types'
import { templateRef } from '@vueuse/core'

export const useAuth = () => {
  const { $fireAuth } = useNuxtApp()

  const { getUser } = useStore()

  const loggedInUser = useState<any>('loggedInUser', () => null)

  const setFireAuthInCurrentUser = (user:User, idTokenResult:IdTokenResult) => {
    const { uid, displayName, photoURL } = user
    const { claims } = idTokenResult
    loggedInUser.value = {
      uid, displayName, photoURL, claims
    }
  }

  const updateUserProfile = async (updateData:any) => {
    await updateProfile($fireAuth.currentUser, updateData)
    .then(async () => {
      await $fireAuth.currentUser.reload()
      loggedInUser.value = null
      loggedInUser.value = $fireAuth.currentUser
    })
    .catch((error) => { throw new Error(error)})
  }

  const signInWithLINEToken = async (idTokenValue:string) => {

    const { data } = await useFetch('/api/setIdToken',{
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: idTokenValue }),
    })
    console.log("data", data.value)

    if (data.value) {
      await signInWithCustomToken($fireAuth, data.value)
      .then(async (userCredential) => {
        console.log("user", userCredential.user.uid)
        alert("成功:" + userCredential.user)
        await getUser(userCredential.user.uid)
        .then((res) => {
          console.log("user", res)
          loggedInUser.value = res
          console.log("loggedInUser", loggedInUser.value)
        })
        .catch((error) => {
          console.log("error", error)
          alert("失敗")
        })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("errorCode", errorCode)
        console.log("errorMessage", errorMessage)
        alert("失敗")
      })
    }
//ここからしたなんだっけ？
    if (data.error) {
      alert(data.error)
    }
    else {
      signInWithCustomToken($fireAuth, data.token)
      .then(async (userCredential) => {
        if (userCredential.user) {
          const updateData = {
            displayName: data.displayName,
            photoURL: data.pictureUrl,
          }
          await updateUserProfile(updateData)
          .catch((error) => {
            alert(`updateUserProfile error: ${error.message}`)
          })
        }
        else { throw new Error(`no userCredential`)}
      })
      .catch((error) => {
        alert(`signInWithCustomToken failed ${error.message}`)  // @TODO navigate to error page
      })
    }
  }

  return {
    loggedInUser,
    signInWithLINEToken,
  }
}