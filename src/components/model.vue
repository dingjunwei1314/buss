<template>
  <div>
    <div class="ticket-list">
      <el-tabs type="border-card" :value="activeTab">
        <el-tab-pane label="待填" name="待填（英文）">
          <sth-list v-if="activeTab === '待填（英文）'"></sth-list>
        </el-tab-pane>
      </el-tabs>
    </div>

    <my-table
      :data="tableData"
      :col-configs="colConfigs">
    </my-table>

  </div>
</template>
<script>

import myTable from "@/components/myTable.vue";

  import sthList from './sthList'
  export default {
    components: { sthList,myTable },
    data () {
      return {
        activeTab: 'sth'
      }
    }
  }
</script>


