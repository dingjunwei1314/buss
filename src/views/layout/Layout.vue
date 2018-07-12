<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <sidebar class="sidebar-container"></sidebar>
    <div class="navbar-container">
      <navbar></navbar>
      <tags-view></tags-view>
    </div>
    <div class="main-container">
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from '@/views/layout/components'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    TagsView,
    AppMain
  },
  computed: {
    sidebar () {
      return this.$store.state.app.sidebar
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: calc(100% - 96px);
  height: calc(100vh - 96px);
  width: 100%;
  width: 100vw;

  .navbar-container {
    position: fixed;
    top: 0;
    left: 220px;
    right: 0;
    z-index: 20;
    transition: all .4s;
  }
  .main-container {
    margin-top: 96px;
  }
}
</style>
