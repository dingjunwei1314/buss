<template>
    <div class="tab-container">
        <el-tabs style='margin-top:15px;' v-model="auditStatus" type="border-card">
            <el-tab-pane v-for="item in auditOptions" :label="item.label" :key='item.key' :name="item.key">
                <keep-alive>
                    <auditPane v-if="auditStatus==item.key" :type='item.key'></auditPane>
                </keep-alive>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
// import {toAudit, successAudit, failureAudit} from './components'
import auditPane from './components/auditPane'

export default {
  name: 'tab',
  components: { auditPane },
  data () {
    return {
      auditOptions: [
        {label: '待审核', key: 'to'},
        {label: '审核成功', key: 'success'},
        {label: '审核失败', key: 'failure'}
      ],
      auditStatus: 'to'
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
</style>
