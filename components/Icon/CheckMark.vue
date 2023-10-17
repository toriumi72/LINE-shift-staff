<script setup lang="ts">
type Props = {
  mark: number,
}
const props = defineProps<Props>()
const name = [
  "i-mdi-circle-outline",
  // "i-ph-triangle-bold",
  "i-akar-icons-cross",
]

</script>

<template>
  <UIcon :name="name[props.mark]" />
</template>