<script setup lang="ts">
import type {
  DayData,
  CheckMark
} from '@/types'
import { cdate } from "cdate"

const { loggedInUser } = useAuth()
const { 
  periodList,
  getPeriodListRealTime,
} = useStore()

onMounted(async () => {
  await getPeriodListRealTime()
})
</script>

<template>
  <div class="flex flex-col items-left gap-3">
    <div>
      提出期間の選択
    </div>
    <div v-for="period of periodList" :key="period.id" class="w-full">
      <template v-if="period.status === 'accept'">
        <UButton @click="() => $router.push(`/staff/submit/${period.id}`)" class="flex flex-col gap-1" size="xl" block >
          <div class="flex justify-center items-center gap-1">
            <div>
              {{ cdate(period.start.toDate()).format("YYYY年MM月DD日") }}<span class="text-xs">({{ cdate(period.start.toDate()).locale("ja").format(`ddd`) }})</span> 
            </div>
            <IconArrow class="text-white" />
            <div>
              {{ cdate(period.end.toDate()).format("YYYY年MM月DD日") }}<span class="text-xs">({{ cdate(period.end.toDate()).locale("ja").format(`ddd`) }})</span>
            </div>
          </div>
          <div class="flex gap-1 text-xs">
            <div>
              期限
            </div>
            <div>
              {{ cdate(period.deadline.toDate()).format("MM月DD日") }}<span class="text-xs">({{ cdate(period.deadline.toDate()).locale("ja").format(`ddd`) }})</span>
            </div>
          </div>
        </UButton>
      </template>
      <template v-if="period.status === 'reject'">

        <!-- ここ修正しないとダメ -->
        <div class="relative items-center justify-center flex mb-1">
          <span class="inset-x-0 h-px bg-gray-300 absolute"></span>
          <span class="relative px-4 text-xs bg-white text-gray-400">提出期限が過ぎた期間</span>
        </div>

        <UButton @click="() => $router.push(`/staff/submit/${period.id}`)" class="" size="xl" color="black" block disabled>
          <div class="flex justify-center items-center gap-1">
            <div>
              {{ cdate(period.start.toDate()).format("YYYY年MM月DD日") }}<span class="text-xs">({{ cdate(period.start.toDate()).locale("ja").format(`ddd`) }})</span> 
            </div>
            <IconArrow class="text-white" />
            <div>
              {{ cdate(period.end.toDate()).format("YYYY年MM月DD日") }}<span class="text-xs">({{ cdate(period.end.toDate()).locale("ja").format(`ddd`) }})</span>
            </div>
          </div>
        </UButton>
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>