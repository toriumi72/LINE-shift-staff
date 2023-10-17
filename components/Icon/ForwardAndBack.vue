<script setup lang="ts">
type Props = {
  mark: number,
}
const props = defineProps<Props>()
const name = [
  "i-material-symbols-arrow-left-rounded",
  "i-material-symbols-arrow-right-rounded"
]

</script>

<template>
  <UIcon :name="name[props.mark]" />
</template>