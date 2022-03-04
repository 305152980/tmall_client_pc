<template>
  <div class="tm-bread-item">
    <router-link v-if="to" :to="to">
      <slot />
    </router-link>
    <span v-else>
      <slot />
    </span>
  </div>
</template>

<script>
export default {
  name: 'TmBreadItem',
  props: {
    to: {
      type: [String, Object],
      default: ''
    }
  }
}
</script>
