<template>
  <div class="ticket-list">
    <el-tabs type="border-card" :value="activeTab">
      <el-tab-pane label="优惠券列表" name="ticket">
        <ticket-list v-if="activeTab === 'ticket'"></ticket-list>
      </el-tab-pane>
      <!-- <el-tab-pane label="优惠券卡包列表" name="card">卡包列表</el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
  import ticketList from './ticketList'
  export default {
    components: { ticketList },
    data () {
      return {
        activeTab: 'ticket'
      }
    }
  }
</script>
