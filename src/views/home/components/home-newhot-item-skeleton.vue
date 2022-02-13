<template>
  <div class='home-newhot-item-skeleton'>
    <div class="item" v-for="i in 4" :key="i" :style="{ backgroundColor: bg }">
      <tm-skeleton bg="#e4e4e4" width="306px" height="306px" animated />
      <tm-skeleton bg="#e4e4e4" width="160px" height="24px" animated />
      <tm-skeleton bg="#e4e4e4" width="120px" height="24px" animated />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeNewhotItemSkeleton',
  props: {
    bg: {
      type: String,
      default: '#fff'
    }
  }
}
</script>

<style scoped lang='less'>
.home-newhot-item-skeleton {
  width: 1240px;
  height: 406px;
  display: flex;
  justify-content: space-between;
  .item {
    width: 306px;
    .tm-skeleton ~ .tm-skeleton {
      display: block;
      margin: 16px auto 0;
    }
  }
}
</style>
