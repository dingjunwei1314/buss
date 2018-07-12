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

      <div class="filter-item">
        <label for="ticket-type">发放状态：</label>
        <el-select name="ticket-type" v-model="status" size="small" filterable clearable placeholder="请选择发放状态" class="filter-box">
          <el-option
            v-for="item in statusOptions"
            :key="item.number"
            :label="item.name"
            :value="item.number">
          </el-option>
        </el-select>
      </div>

      <div class="search-button inline-block">
        <el-button type="primary" size="small" @click="search">查询</el-button>
        <el-button type="ghost" size="small" style="margin-left: 8px" @click="reset">重置</el-button>
      </div>
    </div>

    <div class="func-btn">
      <el-button v-if="hasPermission(funcCode.publishCoupon)" type="primary" size="small" @click="grantCoupon">发放优惠券</el-button>
      <el-button v-if="hasPermission(funcCode.couponExport)" type="primary" size="small" @click="exportData($event)">导出当前列表</el-button>
      <el-button v-if="hasPermission(funcCode.couponExportAll)" type="primary" size="small" @click="exportData($event, true)">导出全部列表</el-button>
    </div>

    <!--  还要在funcCode这里配置一些变量  -->

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
          <span>{{ scope.row.c_num }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号" width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.stype === '1'">{{ scope.row.oneuid || '-' }}</span>
          <span v-else>
            {{ scope.row.num }}个(<span style="color:#409EFF"><a :href="'http://' + scope.row.template_url" :download="scope.row.template_url.substring(scope.row.template_url.lastIndexOf('\/') + 1, scope.row.template_url.length)">下载UID</a></span>)
          </span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="创建时间" width="160" sortable="custom" prop="create_time">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.create_time) }}</span>
        </template>
      </el-table-column> 
      
      <el-table-column align="center" label="状态" width="100" sortable="custom" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '1'" type="warning">未发送</el-tag>
          <el-tag v-if="scope.row.status === '2'" type="success">发送成功</el-tag>
          <el-tag v-if="scope.row.status === '3'" type="danger">发送失败</el-tag>
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

    <el-dialog title="发放优惠券" :visible.sync="showGrant" width="1000px" top="96px" :close-on-click-modal="false">
      <grant-coupon @close="close"></grant-coupon>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="showDetail" width="800px" top="96px" :close-on-click-modal="false" @close="couponId = ''">
      <ticket-detail :id="couponId"></ticket-detail>
    </el-dialog>
  </div>
</template>
<script>
  import { getGrant, getExportData } from '@/api'
  import moment from 'moment'
  import { parseTime } from '@/utils'
  import { exportFromArray } from '@/utils/exportData'
  import GrantCoupon from './grantCoupon'
  import TicketDetail from '../ticketList/ticketDetail'
  import hasPermission from '@/utils/checkPermissions'
  import { funcCode } from '@/utils/permissionMap'

  const statusOptions = [{
    name: '全部',
    number: '0'
  }, {
    name: '未发送',
    number: '1'
  }, {
    name: '发送成功',
    number: '2'
  }, {
    name: '发送失败',
    number: '3'
  }]
  export default {
    components: { GrantCoupon, TicketDetail },
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
        status: '0',
        statusOptions: statusOptions,
        sendTime: [],
        ticketId: '',
        mobile: '',
        userName: '',
        parseTime: parseTime,
        showGrant: false,
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
        getGrant(this.listQuery).then((res) => {
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
        if (+this.status > 0) {
          condition.status = this.status
        }
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
          this.getList()
        }
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
        this.status = '0'
      },
      grantCoupon () {
        this.showGrant = true
      },
      close () {
        this.showGrant = false
        this.getList()
      },
      showCouponDetail (row) {
        this.couponId = row.c_id
        this.showDetail = true
      },
      exportData (e, isAll) {
        this.getFilterParams()
        let params
        if (isAll) {
          params = {
            url: '/activity/publish/exports'
          }
        } else {
          params = {
            url: '/activity/publish/export',
            data: {
              where: this.listQuery.where
            }
          }
        }
        getExportData(params).then((res) => {
          let filter = ['id', 'send_time', 'c_id', 'num', 'oneuid', 'create_time', 'status', 'operation_id', 'remark']
          exportFromArray('发放优惠券列表', res.title, filter, res.data)
        })
      }
    }
  }
</script>
