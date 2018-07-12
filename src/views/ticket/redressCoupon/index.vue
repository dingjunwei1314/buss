<template>
  <div class="coupon-record">
    <div class="table-filter">
      <div class="filter-item">
        <label for="send-time">发放时间：</label>
        <el-date-picker name="send-time" v-model="sendTime" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </div>

      <div class="filter-item">
        <label for="">优惠券ID ：</label>
        <el-input class="filter-box" v-model="ticketId" size="small" @keyup.enter.native="search"></el-input>
      </div>

      <div class="filter-item">
        <label for="">手机号：</label>
        <el-input class="filter-box" v-model="mobile" size="small" @keyup.enter.native="search"></el-input>
      </div>

      <div class="filter-item">
        <label for="">操作人：</label>
        <el-input class="filter-box" v-model="userName" size="small" @keyup.enter.native="search"></el-input>
      </div>

      <div class="search-button inline-block">
        <el-button type="primary" size="small" @click="search">查询</el-button>
        <el-button type="ghost" size="small" style="margin-left: 8px" @click="reset">重置</el-button>
      </div>
    </div>

    <div class="func-btn">
      <el-button v-if="hasPermission(funcCode.redressAdd)" type="primary" size="small" @click="grantCoupon">补偿优惠券</el-button>
      <el-button v-if="hasPermission(funcCode.redressExport)" type="primary" size="small" @click="exportData($event)">导出当前列表</el-button>
      <el-button v-if="hasPermission(funcCode.redressExportAll)" type="primary" size="small" @click="exportData($event, true)">导出全部列表</el-button>
    </div>

    <el-table :data="list" highlight-current-row border :stripe="true" v-loading="listLoading" style="width: 100%;" class="filter-box" :header-row-style="{backgroundColor: '#f6f6f6'}" @sort-change="sortTable">
      <el-table-column align="center" label="记录ID" width="90" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="发放时间" width="160" sortable="custom" prop="send_time">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.send_time) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="优惠券ID" width="110" sortable="custom" prop="c_id">
        <template slot-scope="scope">
          <el-button type="text" @click="showCouponDetail(scope.row)">{{ scope.row.c_id }}</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="数量" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.num }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.oneuid || '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作人" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.user_name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.remark || '-' }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <el-dialog title="补偿优惠券" :visible.sync="showRedress" width="1000px" top="96px" :close-on-click-modal="false">
      <redress-coupon @close="close"></redress-coupon>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="showDetail" width="800px" top="96px" :close-on-click-modal="false" @close="couponId = ''">
      <ticket-detail :id="couponId"></ticket-detail>
    </el-dialog>
  </div>
</template>
<script>
  import { getRedress, getExportData } from '@/api'
  import moment from 'moment'
  import { parseTime } from '@/utils'
  import { exportFromArray } from '@/utils/exportData'
  import redressCoupon from './redressCoupon'
  import TicketDetail from '../ticketList/ticketDetail'
  import hasPermission from '@/utils/checkPermissions'
  import { funcCode } from '@/utils/permissionMap'

  export default {
    components: { redressCoupon, TicketDetail },
    data () {
      return {
        list: [],
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          pageSize: 10,
          where: '',
          sort: 'send_time&desc'
        },
        sendTime: [],
        ticketId: '',
        mobile: '',
        userName: '',
        parseTime: parseTime,
        showRedress: false,
        showDetail: false,
        couponId: '',
        funcCode: funcCode
      }
    },
    created () {
      this.getList()
    },
    methods: {
      hasPermission,
      getList () {
        this.listLoading = true
        getRedress(this.listQuery).then((res) => {
          this.list = res.data
          this.total = +res.total
          this.listLoading = false
        })
      },
      handleSizeChange (val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange (val) {
        this.listQuery.page = val
        this.getList()
      },
      getFilterParams () {
        let condition = {}
        if (this.sendTime && this.sendTime.length > 0) {
          condition.start_send_time = moment(this.sendTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
          condition.end_send_time = moment(this.sendTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
        }
        condition.mobile = this.mobile
        condition.c_id = this.ticketId
        condition.user_name = this.userName
        this.listQuery.where = ''
        for (let i in condition) {
          if (condition[i]) {
            const str = `${i}=${condition[i]}&`
            this.listQuery.where += str
          }
        }
      },
      search () {
        this.getFilterParams()
        this.getList()
      },
      sortTable (args) {
        if (args.order && args.prop) {
          this.listQuery.sort = args.order === 'ascending' ? `${args.prop}&asc` : `${args.prop}&desc`
        } else {
          this.listQuery.sort = ''
        }
        this.getList()
      },
      reset () {
        this.listQuery = {
          page: 1,
          pageSize: 10,
          where: '',
          sort: 'send_time&desc'
        }
        this.sendTime = []
        this.mobile = ''
        this.ticketId = ''
        this.userName = ''
      },
      grantCoupon () {
        this.showRedress = true
      },
      showCouponDetail (row) {
        this.couponId = row.c_id
        this.showDetail = true
      },
      close () {
        this.showRedress = false
        this.getList()
      },
      exportData (e, isAll) {
        this.getFilterParams()
        let params
        if (isAll) {
          params = {
            url: '/activity/redress/exports'
          }
        } else {
          params = {
            url: '/activity/redress/export',
            data: {
              where: this.listQuery.where
            }
          }
        }
        getExportData(params).then((res) => {
          let filter = ['id', 'send_time', 'c_id', 'num', 'oneuid', 'operation_id', 'remark']
          exportFromArray('补偿优惠券列表', res.title, filter, res.data)
        })
      }
    }
  }
</script>
