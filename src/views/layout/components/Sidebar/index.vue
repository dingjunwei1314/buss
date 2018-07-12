<template>
  <scroll-bar>
    <div class="logo-box">
      <div class="logo" :class="{collapse: isCollapse}">
        <img :src="logo" alt="logo">
      </div>
      <span v-if="!isCollapse">业务管理后台</span>
    </div>
    <el-menu mode="vertical" unique-opened :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#fff" active-text-color="#409EFF">
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
import logo from '@/assets/imgs/logo.png'

export default {
  components: { SidebarItem, ScrollBar },
  data () {
    return {
      logo: logo
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes () {
      return this.$router.options.routes
    },
    isCollapse () {
      return !this.sidebar.opened
    }
  }
}
</script>

<style lang="scss">
  .logo-box {
    width: 100%;
    height: 120px;
    border: 1px solid transparent;

    .logo {
      margin-top: 10px;
      text-align: center;
      overflow: hidden;
      transition: all .4s;
      & > img {
        height: 100%;
      }
    }
    & > span {
      display: inline-block;
      width: 100%;
      margin-top: 10px;
      text-align: center;
      color: #fff;
    }

    .collapse {
      height: 30px;
      margin-top: 44px;
      transition: all .4s;
    }
  }
</style>
