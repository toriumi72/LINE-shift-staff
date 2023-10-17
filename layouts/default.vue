<script setup lang="ts">
const { loggedInUser } = useAuth()
const { getPeriodListRealTime } = useStore()
const route = useRoute()
const localNavArray = ref([
  {
    slack: 'staff/home',
    name: 'ホーム',
    icon: 'i-heroicons-home',
    // selectedIcon: 'mingcute:home-1-fill'
  },
  {
    slack: 'staff/submit',
    name: 'シフト希望提出',
    icon: 'i-heroicons-pencil-square',
    // selectedIcon: 'mingcute:message-3-fill'
  },
  {
    slack: 'staff/workData',
    name: '勤怠データ',
    icon: 'i-heroicons-currency-dollar',
    // selectedIcon: 'ic:baseline-bookmark'
  },
  {
    slack: 'staff/mySetting',
    name: '設定',
    icon: 'i-heroicons-user',
    // selectedIcon: 'mdi:account-circle'
  }
])
const isOpenMenu = ref(false)

onMounted(() => {
  // getPeriodListRealTime()
})

// let preventTouchMove: (event: TouchEvent) => void

// watch(isOpenMenu, (newVal) => {
//   if (newVal) {
//     preventTouchMove = (event: TouchEvent) => event.preventDefault();
//     window.addEventListener('touchmove', preventTouchMove, { passive: false });
//   } else {
//     window.removeEventListener('touchmove', preventTouchMove);
//   }
// })

// onUnmounted(() => {
//   window.removeEventListener('touchmove', preventTouchMove);
// })
</script>

<template>
  <div class="fixed top-0 left-0 flex items-center py-3 px-4 sm:px-6 lg:px-8 w-full h-auto bg-white shadow z-[99]">
    <template v-for="(localNav, index) of localNavArray">
      <div v-show="route.path.startsWith('/' + localNav.slack)" class="absolute inset-x-0 text-center">
        {{ localNav.name }}
      </div>
    </template>
    
    <div class="ml-auto flex items-center">
      <UButton v-if="loggedInUser" @click="navigateTo('/')" :ui="{ rounded: 'rounded', padding: 'px-0 py-0' }" size="sm" variant="ghost">
        <UAvatar v-if="loggedInUser && loggedInUser.imageUrl" :src="loggedInUser.imageUrl" :ui="{ rounded: 'rounded' }" alt="Avatar" size="sm" />
        <USkeleton v-else :ui="{ rounded: 'rounded-full' }" class="h-8 w-8 border" />
      </UButton>
      <template v-else>
        <UButton @click="navigateTo('/login')" label="ログイン" color="black" size="sm" />
      </template>
    </div>
  </div>

  <!-- 仮の設定 -->
  <div class="w-full pt-16 mb-24 px-3">
    <slot />
  </div>

  <div class="fixed bottom-0 left-0 w-full h-auto bg-white shadow z-[99]">
    <div class="flex px-2 pt-2 pb-8 items-center">
      <div class="grow flex items-center">
        <!-- <UButton @click="isOpenMenu = !isOpenMenu" class="absolute left-1/2 flex items-center justify-center -top-4 -translate-x-1/2" icon="i-heroicons-shopping-bag" size="xl" color="primary" rounded="rounded-full" square variant="solid" /> -->
        <button v-for="(localNav, index) of localNavArray" :key="index" @click="navigateTo('/' + localNav.slack)" class="basis-1/4 py-[calc(0.2vh_+_6px)]">
          <div class="text-[calc(2vh_+_8px)] leading-none" :class="{ 'text-primary-500': route.path.startsWith('/' + localNav.slack) }">
            <UIcon :name="localNav.icon" class="text-light" />
          </div>  
        </button>
      </div>
    </div>
  </div>
</template>