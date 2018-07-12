<template>
  <div>
    <div class="ticket-list-page">
      <h1>认证资料</h1>
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="9">
          <div>账号：
            <el-input class = "input" v-model="input1">
            </el-input>
          </div>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="9">
          <div>姓名：
            <el-input v-model="input1">
            </el-input>
          </div>
        </el-col>
        <el-col :span="2"></el-col>
      </el-row>
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="9">
          <div>身份证号：
            <el-input v-model="input1">
            </el-input>
          </div>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="9">
          <div>驾驶证档案编号：
            <el-input v-model="input1">
            </el-input>
          </div>
        </el-col>
        <el-col :span="2"></el-col>
      </el-row>
    </div>
  </div>

  </div>
  </div>
</template>
<script>
import hasPermission from '@/utils/checkPermissions'
import { funcCode } from '@/utils/permissionMap'
import { parseTime } from '@/utils'
import moment from 'moment'
export default {
  //   components: { ticketDetail, createTicket },
  props: {
    type: {
      type: String,
      default: 'to'
    }
  },
  data () {
    return {
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        pageSize: 10,
        sort: 'create_time&desc',
        where: ''
      },
      consumeMoney: '',
      reChargeTime: [],
      reChargeName: '',
      reChargeAccount: '',
      reChargeBill: '',
      payType: '0',
      payOptions: [],
      payStatus: '0',
      statusOptions: [],
      showCreate: false,
      isChooseType: false,
      showDetail: false,
      couponId: '',
      createTitle: '',
      parseTime: parseTime,
      funcCode: funcCode,
      ticketType: '',
      typeOptions: '',
      ticketStatus: '',
      ticketName: '',
      ticketId: '',
      loading: false,
      input1: ''
    }
  },
  created () {
    // 获取当前充值记录
    this.list = [
      {
        id: '1',
        reChargeAccount: '18888888888',
        name: '张三',
        accountStatus: '可用',
        auditStatus: '机审预审失败',
        similarity: '82',
        commitTime: '2018年1月10日  17:00:00',
        auditTime: '2018年1月10日  17:00:00',
        auditor: '张三'
      }
    ]
  },
  methods: {
    hasPermission,
    // 搜索充值记录
    getRechargeRecord () {},
    getFilterParams () {
      let condition = {}
      if (this.reChargeTime && this.reChargeTime.length > 0) {
        condition.start_time =
          moment(this.reChargeTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
        condition.end_time =
          moment(this.reChargeTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      if (+this.payType > 0) {
        condition.stype = this.payType
      }
      if (+this.payStatus > 0) {
        condition.status = this.payStatus
      }
      condition.title = this.reChargeName
      condition.id = this.reChargeAccount
      condition.reChargeBill = this.reChargeBill
      this.listQuery.where = ''
      for (let i in condition) {
        if (condition[i]) {
          const str = `${i}=${condition[i]}&`
          this.listQuery.where += str
        }
      }
    },
    search () {},
    reset () {},
    sortTable () {},
    handleSizeChange () {},
    handleCurrentChange () {}
  }
}
</script>

<style lang="scss">
.ticket-list-page {
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
  .input {
    display: inline-block
  }
}
</style>
