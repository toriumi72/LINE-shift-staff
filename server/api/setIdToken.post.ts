import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { Timestamp, getFirestore } from 'firebase-admin/firestore';
import serviceAccount from '../../serviceAccountKey.json'
initializeApp({
  credential: cert(serviceAccount as ServiceAccount)
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const data = await verifyToken(body.idToken)
    console.log(data) // ログ5

    const lineUserId = data.sub
    const name = data.name
    const imageUrl = data.picture

    const customToken = await getAuth().createCustomToken(lineUserId)
    console.log("customToken:" + customToken) // ログ6

    await setAppUserDocument({ lineUserId, name, imageUrl })
    console.log("[DEBUG] App user document set.") // ログ6

    event.node.res.statusCode = 200
    event.node.res.end(customToken)
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'An unexpected error occurred'
    console.error("[ERROR] An error occurred:", errorMessage) 
    event.node.res.statusCode = 500
    event.node.res.end(JSON.stringify({ error: errorMessage }))
  }
})

const verifyToken = async (idToken: string): Promise<any> => {
  const params = new URLSearchParams()
  params.append('id_token', idToken)
  params.append('client_id', '2000379873')
  const response = await fetch('https://api.line.me/oauth2/v2.1/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  })

  const data = await response.json()
  console.log("data:" + data)

  if (response.status !== 200) {
    console.error("Error response from LINE verify API:", data)
    throw new Error(`[${response.status}]: /oauth2/v2.1/verify`)
  }

  // Ensure the ID token is valid
  if (data.error) {
    throw new Error(data.error_description || 'Error verifying ID token')
  }

  return data
}

const setAppUserDocument = async ({ lineUserId, name, imageUrl }: { lineUserId: string; name: string; imageUrl?: string; }): Promise<void> => {
  const db = getFirestore()
  await db.collection('Users').doc(lineUserId).set({ uid:lineUserId, name: name, imageUrl: imageUrl, createAt: Timestamp.now(), updateAt: Timestamp.now()  ?? null })
  .then(() => {
    console.log("Users ドキュメント 成功!")
  })
  .catch((error) => {
    console.error("Users ドキュメント 失敗", error)
  })
}


