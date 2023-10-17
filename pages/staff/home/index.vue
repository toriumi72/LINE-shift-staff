<script setup lang="ts">
const { loggedInUser } = useAuth()
</script>

<template>
  <div>
    {{ loggedInUser.name }}さん、こんにちは
  </div>
  <div>
    home
    <div>
      ・現在確定中のシフト表を表示する予定
    </div>
    <div>
      ・この画面から色々飛べるようにする予定
    </div>
    <div>
      画面イメージ
    </div>
    <div>
      <img src="/homeTest.svg" alt="">
    </div>
  </div>
</template>

<style scoped>

</style>