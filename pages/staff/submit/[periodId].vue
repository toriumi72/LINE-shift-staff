<script setup lang="ts">
import {
  useSwipe,
  usePointerSwipe
} from '@vueuse/core'
import type { UseSwipeDirection } from '@vueuse/core'
import type {
  DayData,
} from '@/types'
import {
  CheckMark
} from '@/types'
import { cdate } from "cdate"

const { loggedInUser } = useAuth()
const { 
  periodList,
  getPeriodListRealTime,
  addSubmit,
  getSubmit,
} = useStore()

const route = useRoute()
const periodId = route.params.periodId
const weeks = ["日", "月", "火", "水", "木", "金", "土",]
const startDay = ref(0)
const existDayDataList = ref([])
const dayDataList = ref<DayData[]>([])
const currentSelect = ref(0)
const isActive = ref(true)
const start = ref<cdate.CDate | null>(null)
const end = ref<cdate.CDate | null>(null)
const deadline = ref<cdate.CDate | null>(null)

onMounted(async () => {
  const period = periodList.value.find((period:any) => period.id === periodId)
  start.value = cdate(period.start.toDate())
  end.value = cdate(period.end.toDate())
  deadline.value = cdate(period.deadline.toDate())
  startDay.value = period.start.toDate().getDay()
  for (let cdate = start.value; cdate < end.value;) {
    const dayData: DayData = {
      cdate: cdate,
      date: cdate.get('date'),
      checkMark: CheckMark.CROSS,
      start: {
        hour: 9,
        minute: 0,
      },
      end: {
        hour: 17,
        minute: 0,
      }
    }
    dayDataList.value.push(dayData)
    cdate = cdate.next("day")
  }

  await getSubmit(loggedInUser.value.uid, periodId, dayDataList.value)
  .then((res) => {
    existDayDataList.value = res.map((data: any, index: number) => {
      // オブジェクトの形式を作成して格納
      return {
        cdate: dayDataList.value[index].cdate,
        date: data.date,
        checkMark: data.checkMark,
        start: {
          hour: data.start.hour,
          minute: data.start.minute,
        },
        end: {
          hour: data.end.hour,
          minute: data.end.minute,
        }
      }
    })
    console.log("existDayDataList" ,existDayDataList.value)
    // 取得したデータをdayDataListに代入する
    if (existDayDataList.value) {
      for (let i = 0; i < dayDataList.value.length; i++) {
        dayDataList.value[i] = existDayDataList.value[i]
      }
    }
  })
  .catch((error) => {
    console.log("error", error)
  })
})


//提出・確認modal
const isConfirm = ref(false)
const confirmDayDataList = computed(() => {
  return dayDataList.value.filter((dayData) => dayData.checkMark === 0)
})

const onSubmit = () => {
  const submitDateArr: any = dayDataList.value.map((data: any) => {
    const startCdate = data.cdate.set(0, 'hour').set(0, 'minute').add(data.start.hour, 'hour').add(data.start.minute, 'minute')
    const endCdate = data.cdate.set(0, 'hour').set(0, 'minute').add(data.end.hour, 'hour').add(data.end.minute, 'minute')
    return {
      ...data,
      startCdate,
      endCdate,
    }
  })
  console.log(submitDateArr)
  addSubmit(loggedInUser.value.uid, periodId, submitDateArr)
}


//useSwipe
const target = ref<Element | null>(null)
const container = ref<HTMLElement | null>(null)
const containerWidth = computed(() => container.value?.offsetWidth)
const left = ref('0')
const right = ref('0')
const opacity = ref(1)
const stop = computed(() => dayDataList.value.length - 1)
const transform = ref(0)


const { distanceX, isSwiping } = usePointerSwipe(target, {
  onSwipe(e: PointerEvent) {
    if (containerWidth.value) {
      if (distanceX.value < 0) {
        const distance = Math.abs(distanceX.value)
        left.value = `${distance}px`
        opacity.value = 0.7 - distance / containerWidth.value
        transform.value = distance
      }
      else if (distanceX.value > 0) {
        const distance = Math.abs(distanceX.value)
        right.value = `${distance}px`
        opacity.value = 0.7 - distance / containerWidth.value
        transform.value = -distance
      }
      else {
        left.value = '0'
        right.value = '0'
        opacity.value = 1
        transform.value = 0
      }
    }
  },
  onSwipeEnd(e: PointerEvent, direction: UseSwipeDirection) {
    if (distanceX.value < 0 && containerWidth.value && (Math.abs(distanceX.value) / containerWidth.value) >= 0.1) {
      left.value = '100%'
      opacity.value = 0
      swipeDate(-1)
    }
    else if (distanceX.value > 0 && containerWidth.value && (Math.abs(distanceX.value) / containerWidth.value) >= 0.1) {
      right.value = '100%'
      opacity.value = 0
      swipeDate(1)
    }
    else {
      left.value = '0'
      right.value = '0'
      opacity.value = 1
      transform.value = 0
    }
    left.value = '0'
    right.value = '0'
    opacity.value = 1
    transform.value = 0
  },
})

// const { direction, isSwiping, lengthX, lengthY } = useSwipe(
//   target,
//   {
//     passive: false,
//     onSwipe(e: TouchEvent) {
//       if (containerWidth.value) {
//         if (lengthX.value < 0) {
//           const length = Math.abs(lengthX.value)
//           left.value = `${length}px`
//           opacity.value = 1.0 - length / containerWidth.value
//           transform.value = length
//         } else if (lengthX.value > 0) {
//           const length = Math.abs(lengthX.value)
//           right.value = `${length}px`
//           opacity.value = 1.0 - length / containerWidth.value
//           transform.value = -length
//         } else {
//           left.value = '0'
//           right.value = '0'
//           opacity.value = 1
//           transform.value = 0
//         }
//       }
//     },
//     onSwipeEnd(e: TouchEvent, direction: UseSwipeDirection) {
//       if (lengthX.value < 0 && containerWidth.value && Math.abs(lengthX.value) / containerWidth.value >= 0.1
//       ) {
//         left.value = '100%'
//         opacity.value = 0
//         swipeDate(-1)
//       } else if (lengthX.value > 0 && containerWidth.value && Math.abs(lengthX.value) / containerWidth.value >= 0.1
//       ) {
//         right.value = '100%'
//         opacity.value = 0
//         swipeDate(1)
//       } else {
//         left.value = '0'
//         right.value = '0'
//         opacity.value = 1
//         transform.value = 0
//       }
//       left.value = '0'
//       right.value = '0'
//       opacity.value = 1
//       transform.value = 0
//     },
//   }
// )

const swipeDate = (add: number) => {
  const result = currentSelect.value + add
  if (result > stop.value) {
    currentSelect.value = 0
  }
  else if (result < 0) {
    currentSelect.value = stop.value
  }
  else {
    currentSelect.value = result
  }
}

</script>

<template>
  <div class="inline-block w-auto h-auto mb-2 px-4 py-2 bg-primary-500 rounded shadow z-30">
    <div class="mx-auto">
      <div class="flex justify-between gap-2">
        <div class="flex items-center gap-1 font-medium">
          <div v-if="start" class="text-white">
            {{ start.format(`YYYY/M/D`) }} <span class="text-xs">({{ start.locale("ja").format(`ddd`) }})</span>
          </div>
          <IconArrow class="text-white" />
          <div v-if="end" class="text-white">
            {{ end.format(`YYYY/M/D`) }} <span class="text-xs">({{ end.locale("ja").format(`ddd`) }})</span>
          </div>
        </div>
        <div class="flex items-center gap-1 pt-[4px] pl-2 text-xs text-white font-medium">
          <div>
            期限
          </div>
          <div v-if="deadline">
            {{ deadline.format(`M/D`) }}<span class="text-xs">({{ deadline.locale("ja").format(`ddd`) }})</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="flex flex-col justify-between">
    <!-- カレンダー -->
    <div class="mb-2 pt-5 px-2 pb-3 w-full h-full bg-white rounded shadow z-30">
      <div class="w-full h-full">
        <div class="w-full">
          <div class="mb-3 grid grid-cols-7 gap-3 text-sm font-medium text-center">
            <div v-for="(week, index) in weeks" :key="index" class="text-[#9F9F9F]" :class="{ 'text-[#EAA6A6]': index === 0, 'text-blue-300': index === 6 }">
              {{ week }}
            </div>
          </div>
          <div class="pb-2">
            <div class="grid grid-cols-7 gap-3 text-sm text-center cursor-pointer">
              <div v-for="n of startDay" :key="n"></div>
              <button v-for="(dayData, index) of dayDataList" @click="currentSelect = index" :key="index"
                class="relative duration-800 transition-all rounded-[50px]" 
                :class="{
                  'bg-primary-500 text-black': dayData.checkMark === 0,
                  // 'bg-red-500 text-black': dayData.checkMark === 1,
                }">
                <div class="duration-800 transition-all rounded-[50px]" :class="{
                  'border-[3px] border-gray-400 text-black shadow-md': currentSelect === index ? isActive : !isActive,
                }">
                  <CalenderGrid :dayData="dayData" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- swipeゾーン -->
    <div ref="container" class="mb-2 mx-auto w-full rounded bg-white shadow">
      <div v-if="dayDataList.length" ref="target" class="flex flex-col justify-center gap-2 px-6 pt-3 pb-10 w-full h-full">
        <div class="flex justify-between items-center">
          <UButton @click="swipeDate(-1)" class="hover:bg-white" variant="ghost" >
            <IconForwardAndBack :mark="0" class="text-3xl text-gray-400" />
          </UButton>
          <div class="flex items-baseline gap-1">
            <div class="text-xl">
              {{ dayDataList[currentSelect].cdate.format('M/D') }}
            </div>
            <div class="text-md">
              ({{ dayDataList[currentSelect].cdate.locale("ja").format(`ddd`) }})
            </div>
          </div>
          <UButton @click="swipeDate(1)" class="hover:bg-white" variant="ghost">
            <IconForwardAndBack :mark="1" class="text-3xl text-gray-400" />
          </UButton>
        </div>
        <div class="flex justify-center gap-1">
          <UButton
            v-for="(n, index) in 2"
            @click="dayDataList[currentSelect].checkMark = index"
            class="text-white"
            :class="{
              'bg-primary-500': dayDataList[currentSelect].checkMark == index,
              // 'bg-red-500': dayDataList[currentSelect].checkMark == index && index == 1,
              'bg-black/30': dayDataList[currentSelect].checkMark != index,
            }"
          >
            <IconCheckMark class="text-xl" :mark="index" />
          </UButton>
        </div>
        <!-- input:time -->
        <div v-if="dayDataList[currentSelect].checkMark === 0" class="flex justify-center gap-2 pt-2">
          <div class="flex flex-col justify-center items-center">
            <div>出勤時間</div>
            <div class="flex">
              <select
                v-model.number="dayDataList[currentSelect].start.hour"
                :disabled="dayDataList[currentSelect].checkMark == 1"
                class="px-0 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                name=""
                id=""
              >
                <option v-for="(n, index) in 24">{{ n }}</option>
              </select>
              :
              <select
                v-model.number="dayDataList[currentSelect].start.minute"
                :disabled="dayDataList[currentSelect].checkMark == 1"
                class="px-0 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                name=""
                id=""
              >
                <option value="0">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
              </select>
            </div>
          </div>
          <div> ~ </div>
          <div class="flex flex-col justify-center items-center">
            <div>退勤時間</div>
            <div class="flex">
              <select
                v-model.number="dayDataList[currentSelect].end.hour"
                :disabled="dayDataList[currentSelect].checkMark == 1"
                class="px-0 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                name=""
                id=""
              >
                <option v-for="(n, index) in 33" :value="n" :key="index">
                  {{ n <= 24 ? n : `翌${n - 24}` }}
                </option>
              </select>
              :
              <select
                v-model.number="dayDataList[currentSelect].end.minute"
                :disabled="dayDataList[currentSelect].checkMark == 1"
                class="px-0 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                name=""
                id=""
              >
                <option value="0">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
              </select>
            </div>
          </div>
        </div>
        <div v-else class="flex justify-center items-center pt-2 text-sm">
          {{ dayDataList[currentSelect].cdate.format('M/D') }}の出勤希望は,<br>出勤しない(×)になっています。
        </div>
      </div>
    </div>
    <!-- 確認ボタン -->
    <div class="p-3 flex gap-2 w-full h-auto bg-white rounded shadow">
      <div class="flex flex-row justify-center items-center gap-4 flex-1 rounded shadow">
        <div class="flex flex-col items-center gap-1">
          <IconCheckMark class="text-primary-500 text-2xl" :mark="0" />
          <div class="flex justify-center items-center font-medium text-xs">
            {{ dayDataList.filter(data => data.checkMark == 0).length }}日間
          </div>
        </div>
        <div class="flex flex-col items-center gap-1">
          <IconCheckMark class="text-gray-400 text-2xl" :mark="1" />
          <div class="flex justify-center items-center font-medium text-xs">
            {{ dayDataList.filter(data => data.checkMark == 1).length }}日間
          </div>
        </div>
      </div>
        
      <UButton @click="isConfirm = true" class="py-4 flex-[2.2] font-medium" size="xl" block>
        確認画面へ
      </UButton>
    </div>
  </div>
  <UModal v-model="isConfirm" :ui="{ container: 'flex min-h-full items-center justify-center text-center' }" class="z-[99]">
    <div class="py-3 px-2">
      <div class="relative">
        <div class="flex justify-center items-center mb-3 font-medium">
          提出内容確認
        </div>
        <UButton @click="isConfirm = false" icon="i-heroicons-x-mark-20-solid"  class="absolute top-[-4px] right-0" size="sm" variant="ghost" color="black" />
      </div>
      <div v-if="confirmDayDataList.length">
        <div class="flex flex-col gap-y-2 h-auto max-h-[60vh] mb-2 py-1 px-1 overflow-y-scroll">
          <div v-for="(confirmDayData, index) of confirmDayDataList" class="flex justify-between items-center py-2 px-5 rounded shadow">
            <div class="flex-1">
              {{ confirmDayData.cdate.format(`M/D`) }} 
              <span class="text-sm font-medium text-center">
                ({{ confirmDayData.cdate.locale("ja").format(`ddd`) }})
              </span>
            </div>
            <div class="flex-1 text-center">
              <template v-if="confirmDayData.start.minute == 0">
                {{ confirmDayData.start.hour }}:{{ confirmDayData.start.minute }}0 ~ {{ confirmDayData.end.hour }}:{{ confirmDayData.end.minute }}0
              </template>
              <template v-else>
                {{ confirmDayData.start.hour }}:{{ confirmDayData.start.minute }}0 ~ {{ confirmDayData.end.hour }}:{{ confirmDayData.end.minute }}
              </template>
            </div>
            <IconCheckMark class="flex-[0.3] ml-12 text-primary-500 text-2xl" :mark="0" />
          </div>
        </div>
        <UButton @click="onSubmit" class="font-medium" size="xl" block >
          提出する
        </UButton>
      </div>
      <div v-else>
        <div class="mb-4">
          出勤希望の日程はありません。<br>出勤０日で提出する場合は、提出ボタンを押してください。
        </div>
        <UButton @click="onSubmit" class="font-medium" size="xl" block >
          出勤０日で提出する
        </UButton>
      </div>
    </div>
  </UModal>
</template>

<style scoped>
body {
  position: relative;
  background-color: #F0F0EA;
}
</style>
