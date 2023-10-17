<script setup lang="ts">

const { loggedInUser } = useAuth()
const { 
  getUser,  
  updateUser,

} = useStore()

const isOpen = ref(false)
const updateData = ref({
  fullName: '',
  birthDate: '',
})


const addFullNameAndCloseModal = async () => {
  await updateUser(loggedInUser.value.uid, updateData.value)
  // データを再取得してloggedInUserに代入
  await getUser(loggedInUser.value.uid)
  .then((res) => {
    loggedInUser.value = res
    console.log(loggedInUser.value)
  })
  .catch((err) => {
    console.log(err)
  })

  // モーダルを閉じる
  isOpen.value = false
}

onMounted(async () => {
  //localの場合
  // loggedInUser.value = ref({
  //   uid: 'U5c0dae7bcf8516c22362d6dcdbd88af1',
  //   name: 'とり',
  //   imageUrl: 'https://profile.line-scdn.net/0hDa1sVJ4LG04MCgnENAhkGTBPFSN7JB0GdGoHfS9aRC0lPV0dOWlVLnwIQC1yPV5NY2xUeC8NQi4h',
  //   fullName: '鳥海翔英',
  //   birthDate: '2001-04-15',
  //   createdAt: '',
  //   updatedAt: '',
  // })

  // もしログインユーザーのプロフィールが存在しない場合、モーダルを表示する
  if (loggedInUser && !loggedInUser.fullName && !loggedInUser.birthDate) {
    isOpen.value = true
  }
})
</script>

<template>
  <div>
    <template v-if="loggedInUser">
      <template v-if="loggedInUser.fullName && loggedInUser.birthDate">
        <!-- プロフィールが設定されている場合のコンテンツ -->
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </template>
      <template v-else>
        <!-- プロフィールが設定されていない場合のモーダル -->
        <UModal v-model="isOpen" :ui="{ container: 'flex min-h-full items-center justify-center text-center' }" class="z-[99]">
          <div>
            <h1>プロフィールを追加してください</h1>
            <UFormGroup label="名前" help="あなたのメールを他の人と共有することはありません。">
              <UInput v-model="updateData.fullName" placeholder="山田 太郎" icon="" size="xl" required />
            </UFormGroup>
            <UFormGroup label="生年月日">
              <UInput v-model="updateData.birthDate"  icon="" size="xl" type="date" required />
            </UFormGroup>
            
            <UButton @click="addFullNameAndCloseModal">完了する</UButton>
          </div>
        </UModal>
        <UButton @click="isOpen = true">プロフィールを追加する</UButton>
      </template>
    </template>
    <div v-else>
      loggedInUser is null
    </div>
  </div>
</template>

<style scoped>
body * {
  position: relative;
  color: #333;
}
</style>
