import liff from '@line/liff';

export default defineNuxtPlugin((nuxtApp) => {
  const getLiffLocalStorageKeys = (prefix:any) => {
    const keys = []
    for (var i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.indexOf(prefix) === 0) {
        keys.push(key)
      }
    }
    return keys
  }
  // 期限切れのIDTokenをクリアする
  const clearExpiredIdToken = (liffId:any) => {
    const keyPrefix = `LIFF_STORE:${liffId}:`
    const key = keyPrefix + 'decodedIDToken'
    const decodedIDTokenString = localStorage.getItem(key)
    if (!decodedIDTokenString) {
      return
    }
    const decodedIDToken = JSON.parse(decodedIDTokenString)
    // 有効期限をチェック
    if (new Date().getTime() > decodedIDToken.exp * 1000) {
      const keys = getLiffLocalStorageKeys(keyPrefix)
      keys.forEach(function(key) {
        localStorage.removeItem(key)
      })
    }
  }
  clearExpiredIdToken('2000379873-BJADQkke')
  const liffInit = liff
  .init({ 
    liffId: '2000379873-BJADQkke' || '',
    withLoginOnExternalBrowser: true,
  })
  .then(() => {
    console.log('liff.init() done')
    alert('liff.init() done')
    return liff
  })
  .catch(error => {
    console.log(`liff.init() failed: ${error}`)
    alert(`liff.init() failed`)
    throw error
  })

  nuxtApp.provide('liffInit', liffInit)
})
