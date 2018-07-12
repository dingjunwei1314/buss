<template>
  <div class="bond-list-page">
    <el-tabs type="border-card" @tab-click="handleClick" v-model="activeTab">
      <el-tab-pane label="申请退保列表" name="one">
        <applicationBond />
      </el-tab-pane>
      <el-tab-pane label="已交保证金记录" name="two">
        <handedBond />
      </el-tab-pane>
      <el-tab-pane label="已退保证金记录" name="three">
        <RetreatedBond />
      </el-tab-pane>
      <el-tab-pane label="退款处理状态" name="four">
        <statusBond />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import applicationBond from './applicationBond'
  import handedBond from './handedBond'
  import RetreatedBond from './RetreatedBond'
  import statusBond from './statusBond'

  export default {
    components: { applicationBond, handedBond, RetreatedBond, statusBond },
    data () {
      return {
        activeTab: 'one'
      }
    },
    created () {},
    methods: {}
  }
</script>

<style lang="scss">
  .bond-list-page {
    position: relative;
    .scan-detail {
      width: 80%;
      height: calc(100vh - 100px);
      border: 1px solid red;
      background-color: #fff;
      position: absolute;
      top: 0;
      right: 0;
      z-index: 10;
    }
  }
</style>
