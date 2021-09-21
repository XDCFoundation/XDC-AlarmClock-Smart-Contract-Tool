<template>
  <Header></Header>
  <router-view></router-view>
</template>

<script>

/**
 * Main component with router view. All components will be loaded within router-view
 */
import Header from '@/components/common/Header.vue';

export default {
  name: 'App',
  /**
   * Common header for all components
   */
  components: {
     Header,
  },
}
</script>
