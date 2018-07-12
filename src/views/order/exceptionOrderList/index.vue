<template>
  <div class="ticket-list">
    <el-tabs type="border-card" :value="activeTab" width="1500px" @tab-click="select">
      <el-tab-pane label="待处理" name="needSomeWork">
        <exception-order-list v-if="activeTab === 'needSomeWork'" :flag="0" :reload="reload"></exception-order-list>
      </el-tab-pane>
      <!-- <el-tab-pane label="处理中" name="workingOnIt">
        <exception-order-list v-if="activeTab === 'workingOnIt'" :flag="1"></exception-order-list>
      </el-tab-pane> -->
      <el-tab-pane label="已处理" name="finished">
        <exception-order-list v-if="activeTab === 'finished'" :flag="20" :reload="reload"></exception-order-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import exceptionOrderList from './exceptionOrderList.vue'
export default {
  components: { exceptionOrderList },
  data() {
    return {
      activeTab: 'needSomeWork',
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
