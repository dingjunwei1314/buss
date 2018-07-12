<template>
    <div class="ticket-list-page">
        <div class="table-filter">
            <div class="filter-item">
                <label for="reCharge-time">时间：</label>
                <el-date-picker name="reCharge-time" v-model="reChargeTime" type="datetimerange" size="small" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
            </div>

            <div class="filter-item">
                <label for="">姓名：</label>
                <el-input class="filter-box" v-model="reChargeName" size="small" @keyup.enter.native="search"></el-input>
            </div>

            <div class="filter-item">
                <label for="">账号 ：</label>
                <el-input class="filter-box" v-model="reChargeAccount" size="small" @keyup.enter.native="search"></el-input>
            </div>

            <div class="filter-item">
                <label for="">账号单 ：</label>
                <el-input class="filter-box" v-model="reChargeBill" size="small" @keyup.enter.native="search"></el-input>
            </div>

            <div class="search-button inline-block">
                <el-button type="primary" size="small" @click="search">搜索</el-button>
            </div>
        </div>

        <div class="func-btn">
            <!-- <el-button type="primary" size="small" @click="">添加卡包</el-button> -->
            <el-button v-if="hasPermission(funcCode.couponExport)" type="primary" size="small" @click="exportData($event)">导出当前列表</el-button>
            <el-button v-if="hasPermission(funcCode.couponExportAll)" type="primary" size="small" @click="exportData($event, true)">导出全部列表</el-button>
        </div>

        <el-table :data="list" highlight-current-row border :stripe="true" v-loading="listLoading" style="width: 100%;" class="filter-box" :header-row-style="{backgroundColor: '#f6f6f6'}" @sort-change="sortTable">
            <el-table-column align="center" label="序号" width="90" prop="id">
                <template slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="账号" width="113" prop="reChargeAccount">
                <template slot-scope="scope">
                    <span>{{ scope.row.reChargeAccount }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="姓名" width="90" prop="name">
                <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="消费金额（元）" width="120" prop="consumeMoney">
                <template slot-scope="scope">
                    <span>{{ scope.row.consumeMoney }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="在线支付金额（元）" width="120" prop="onlinePayMoney">
                <template slot-scope="scope">
                    <span>{{ scope.row.onlinePayMoney }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="消费实充余额（元）" width="120" prop="reChargeRemainedMoney">
                <template slot-scope="scope">
                    <span>{{ scope.row.reChargeRemainedMoney }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="消费返现余额（元）" width="120" prop="backRemainedMoney">
                <template slot-scope="scope">
                    <span>{{ scope.row.backRemainedMoney }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="消费停车费余额（元）" width="120" prop="packRemainedMoney">
                <template slot-scope="scope">
                    <span>{{ scope.row.packRemainedMoney }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="透支金额（元）" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.overDraftMoney }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="优惠金额（元）" width="200">
                <template slot-scope="scope">
                    <span v-html="scope.row.arrValue"></span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="订单号" min-width="260">
                <template slot-scope="scope">
                    <span>{{ scope.row.orderNumber }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="消费时间" prop="status">
                <template slot-scope="scope">
                    <span>{{ scope.row.consumeTime }}</span>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

    </div>
</template>
<script>
import hasPermission from '@/utils/checkPermissions'
import { funcCode } from '@/utils/permissionMap'
import { parseTime } from '@/utils'
import moment from 'moment'
export default {
  //   components: { ticketDetail, createTicket },
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
      funcCode: funcCode
    }
  },
  created () {
    // 获取当前充值记录
    this.list = [
      {
        id: '1',
        reChargeAccount: '18888888888',
        name: '张三',
        consumeMoney: '10',
        onlinePayMoney: '',
        reChargeRemainedMoney: '9',
        backRemainedMoney: '1',
        packRemainedMoney: '',
        overDraftMoney: '',
        arrValue: '',
        orderNumber: '12345678901234567890',
        consumeTime: '2018年1月10日  17:00:00'
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
    handleCurrentChange () {},
    exportData () {}
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
}
</style>
