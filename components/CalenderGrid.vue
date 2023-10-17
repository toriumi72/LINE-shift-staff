<script setup lang="ts">
import type {
  DayData
} from '@/types'
type Props = {
  dayData: DayData,
}
const props = defineProps<Props>()
</script>

<template>
  <div class="pt-[100%] font-medium">
    <div class="inset-0 absolute w-hull h-hull flex items-center justify-center">
      {{ props.dayData.date }}
    </div>
  </div>
</template>

<style>

</style>