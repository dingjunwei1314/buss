<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎使用业务管理系统</div>
    <div class="dashboard-logo">
      <img :src="logo" alt="logo">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from '@/assets/imgs/home-logo.png'

export default {
  name: 'home',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data () {
    return {
      logo: Logo
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 28px;
    line-height: 46px;
    font-weight: bold;
    text-align: center;
  }
  &-logo {
    height: 500px;
    text-align: center;
    & > img {
      height: 100%;
    }
  }
}
</style>
