<template>
    <div class="ticket-list-page">
        <div class="table-filter">
            <div class="filter-item">
                <label for="ticket-type">账号状态：</label>
                <el-select name="ticket-type" v-model="ticketType" size="small" filterable clearable placeholder="选择状态" class="filter-box">
                    <el-option v-for="item in typeOptions" :key="item.number" :label="item.name" :value="item.number">
                    </el-option>
                </el-select>
            </div>

            <div class="filter-item">
                <label for="">姓名：</label>
                <el-input class="filter-box" v-model="ticketName" size="small" @keyup.enter.native="search"></el-input>
            </div>

            <div class="filter-item">
                <label for="">账号 ：</label>
                <el-input class="filter-box" v-model="ticketId" size="small" @keyup.enter.native="search"></el-input>
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
            <el-table-column align="center" label="用户ID" width="90" prop="id">
                <template slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="账号" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.account }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="账号状态" width="113" prop="reChargeAccount">
                <template slot-scope="scope">
                    <span>{{ scope.row.status }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="账户余额（元）" width="90" prop="name">
                <template slot-scope="scope">
                    <span>{{ scope.row.remainMoney }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="实充余额（元）" width="120" prop="consumeMoney">
                <template slot-scope="scope">
                    <span>{{ scope.row.reChargeMoney }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="返现余额（元）" width="120" prop="onlinePayMoney">
                <template slot-scope="scope">
                    <span>{{ scope.row.backMoney }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="停车费余额（元）" width="120" prop="consumeRemainedMoney">
                <template slot-scope="scope">
                    <span>{{ scope.row.parkingMoney }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="保证金（元）" width="120" prop="consumeRemainedMoney">
                <template slot-scope="scope">
                    <span>{{ scope.row.margin }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="透支金额（元）" width="120" prop="consumeRemainedMoney">
                <template slot-scope="scope">
                    <span>{{ scope.row.overdraft }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="优惠券数量（张）" width="200">
                <template slot-scope="scope">
                    <span v-html="scope.row.couponNumber"></span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="180">
                <template slot-scope="scope">
                    <el-button v-if="hasPermission(funcCode.couponView)" class="action" type="text" @click="getRechargeRecord(scope.row)">充值记录</el-button>
                    <el-button v-if="hasPermission(funcCode.couponDel)" class="action" type="text" @click="getConsumeRecord(scope.row)">消费记录</el-button>
                    <el-button v-if="hasPermission(funcCode.couponDel)" class="action" type="text" @click="getCouponList(scope.row)">优惠券清单</el-button>
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
        id: '1',
        account: '18888888888',
        status: '可用',
        remainMoney: '100',
        reChargeMoney: '80',
        backMoney: '20',
        parkingMoney: '10',
        margin: '599',
        overdraft: '30',
        couponNumber: '5'
      }
    ]
  },
  methods: {
    hasPermission,
    // 搜索充值记录
    // getRechargeRecord() {},
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
    exportData () {},
    getRechargeRecord (row) {
      this.$router.push({path: 'reCharge'})
      window.localStorage.setItem('b_id', row.id)
    },
    getConsumeRecord (row) {
      this.$router.push({path: 'consume'})
      window.localStorage.setItem('b_id', row.id)
    },
    getCouponList (row) {
      this.$router.push({path: 'couponList'})
      window.localStorage.setItem('b_id', row.id)
    }
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
