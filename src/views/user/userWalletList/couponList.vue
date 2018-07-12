<template>
    <div class="ticket-list-page">
        <div class="table-filter">
            <div class="filter-item">
                <label for="reCharge-time">领取时间：</label>
                <el-date-picker name="reCharge-time" v-model="reChargeTime" type="datetimerange" size="small" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
            </div>

            <div class="filter-item">
                <label for="reCharge-time">使用时间：</label>
                <el-date-picker name="reCharge-time" v-model="reChargeTime" type="datetimerange" size="small" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
            </div>

            <div class="filter-item">
                <label for="ticket-type">优惠券类型：</label>
                <el-select name="ticket-type" v-model="ticketType" size="small" filterable clearable placeholder="优惠券类型" class="filter-box">
                    <el-option v-for="item in typeOptions" :key="item.number" :label="item.name" :value="item.number">
                    </el-option>
                </el-select>
            </div>

            <div class="filter-item">
                <label for="ticket-status">状态：</label>
                <el-select name="ticket-status" v-model="ticketStatus" size="small" filterable clearable placeholder="优惠券类型" class="filter-box">
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>

            <div class="filter-item">
                <label for="">优惠券名称：</label>
                <el-input class="filter-box" v-model="ticketName" size="small" @keyup.enter.native="search"></el-input>
            </div>

            <div class="filter-item">
                <label for="">优惠券ID ：</label>
                <el-input class="filter-box" v-model="ticketId" size="small" @keyup.enter.native="search"></el-input>
            </div>

            <div class="filter-item">
                <label for="ticket-type">来源：</label>
                <el-select name="ticket-type" v-model="ticketType" size="small" filterable clearable placeholder="优惠券类型" class="filter-box">
                    <el-option v-for="item in typeOptions" :key="item.number" :label="item.name" :value="item.number">
                    </el-option>
                </el-select>
            </div>

            <div class="filter-item">
                <label for="ticket-status">城市：</label>
                <el-select name="ticket-status" v-model="ticketStatus" size="small" filterable clearable placeholder="优惠券类型" class="filter-box">
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>

            <div class="filter-item">
                <label for="">账号 ：</label>
                <el-input class="filter-box" v-model="reChargeAccount" size="small" @keyup.enter.native="search"></el-input>
            </div>

            <div class="filter-item">
                <label for="">订单号 ：</label>
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
            <el-table-column align="center" label="优惠券ID" width="90" prop="id">
                <template slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="优惠券类型" width="113" prop="reChargeAccount">
                <template slot-scope="scope">
                    <span>{{ scope.row.type }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="优惠券名称" width="90" prop="name">
                <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="可用城市" width="120" prop="consumeMoney">
                <template slot-scope="scope">
                    <span>{{ scope.row.city }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="优惠券有效期" width="120" prop="onlinePayMoney">
                <template slot-scope="scope">
                    <span>{{ scope.row.effectiveTime }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="优惠" width="120" prop="consumeRemainedMoney">
                <template slot-scope="scope">
                    <span>{{ scope.row.saveMoney }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="使用规则" width="120" prop="consumeRemainedMoney">
                <template slot-scope="scope">
                    <span>{{ scope.row.useRule }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态" width="120" prop="consumeRemainedMoney">
                <template slot-scope="scope">
                    <span>{{ scope.row.status }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="账号" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.account }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="订单号" width="200">
                <template slot-scope="scope">
                    <span v-html="scope.row.orderNumber"></span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="领取时间" width="90">
                <template slot-scope="scope">
                    <span>{{ scope.row.takeTime }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="使用时间" min-width="260">
                <template slot-scope="scope">
                    <span>{{ scope.row.useTime }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="优惠券来源" prop="status">
                <template slot-scope="scope">
                    <span>{{ scope.row.couponResource }}</span>
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
      funcCode: funcCode,
      ticketType: '',
      typeOptions: '',
      ticketStatus: '',
      ticketName: '',
      ticketId: ''
    }
  },
  created () {
    // 获取当前充值记录
    this.list = [
      {
        id: '12345678',
        type: '满减券',
        name: '新用户注册礼券（ID：123456）',
        city: '全部城市',
        effectiveTime: '2018-01-10  17:00:00 — 2018-01-10  17:00:00',
        saveMoney: '10元',
        useRule: '车费满20元可用',
        status: '未使用',
        payStatus: '已支付',
        account: '18888888888',
        orderNumber: '',
        takeTime: '2018年1月10日  17:00:00',
        useTime: '',
        couponResource: '活动1'
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
