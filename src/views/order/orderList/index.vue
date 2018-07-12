<template>
  <div class="ticket-list">
    <el-tabs type="border-card" :value="activeTab" @tab-click="select">
      <el-tab-pane label="全部订单" name="all">
        <order-list v-if="activeTab === 'all'" :flag="0" reload="reload"></order-list>
      </el-tab-pane>
      <el-tab-pane label="待取车" name="waiting">
        <order-list v-if="activeTab === 'waiting'" :flag="1" reload="reload"></order-list>
      </el-tab-pane>
      <el-tab-pane label="进行中" name="doing">
        <order-list v-if="activeTab === 'doing'" :flag="2" reload="reload"></order-list>
      </el-tab-pane>
      <el-tab-pane label="还车待结算" name="almostThere">
        <order-list v-if="activeTab === 'almostThere'" :flag="3" reload="reload"></order-list>
      </el-tab-pane>
      <el-tab-pane label="已结算" name="Finished">
        <order-list v-if="activeTab === 'Finished'" :flag="4" reload="reload"></order-list>
      </el-tab-pane>
      <el-tab-pane label="已取消" name="canceled">
        <order-list v-if="activeTab === 'canceled'" :flag="5" reload="reload"></order-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import orderList from './orderList'
export default {
  components: { orderList },
  data() {
    return {
      activeTab: 'all',
      reload: false
    }
  },
  methods: {
    select(el) {
      this.reload = true;
      this.activeTab = el.name
    },
  },
}
</script>
