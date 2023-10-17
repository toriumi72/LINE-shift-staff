// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  runtimeConfig: {
    public: {
      apiKey: "AIzaSyAD2_5YXuamrrnreD0XvLal2RlRujA7MCs",
      authDomain: "line-shift.firebaseapp.com",
      projectId: "line-shift",
      storageBucket: "line-shift.appspot.com",
      messagingSenderId: "207627437339",
      appId: "1:207627437339:web:18addb640dd54c74083fbe",
      measurementId: "G-D7H3D93K5G"
    },
  },
  nitro: { 
    preset: 'firebase', 
    firebase: { 
      nodeVersion: "18", 
      gen: 2, 
      httpsOptions: { 
        region: 'asia-northeast1', 
        maxInstances: 3, 
      }, 
    }, 
  }, 
  ui: {
    icons: 'all'
  },
})
