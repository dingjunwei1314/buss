<template>

  
  <div class="handed-bond-list-page">
    
    <div class="table-filter">
      <div class="filter-item">
        <label for="created-time">支付时间：</label>
        <el-date-picker name="created-time" v-model="createdTime" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </div>  
      
      <div class="filter-item">
        <label for="">姓名：</label>
        <el-input class="filter-box" v-model="ticketName" size="small" @keyup.enter.native="search"></el-input>
      </div>

      <div class="filter-item">
        <label for="">账号 ：</label>
        <el-input class="filter-box" v-model="ticketId" size="small" @keyup.enter.native="search"></el-input>
      </div>

      <div class="filter-item">
        <label for="">帐单号 ：</label>
        <el-input class="filter-box" v-model="city" size="small" @keyup.enter.native="search"></el-input>
      </div>      

      <div class="search-button inline-block">
        <el-button type="primary" size="small" @click="search">查询</el-button>
        <el-button type="ghost" size="small" style="margin-left: 8px" @click="reset">重置</el-button>
      </div>
    </div>

    <div class="func-btn">
      <el-button v-if="hasPermission(funcCode.couponExport)" type="primary" size="small" @click="exportData($event)">导出当前列表</el-button>
      <el-button v-if="hasPermission(funcCode.couponExportAll)" type="primary" size="small" @click="exportData($event, true)">导出全部列表</el-button>
    </div>

    <el-table :data="list" highlight-current-row border :stripe="true" v-loading="listLoading" style="width: 100%;" class="filter-box" :header-row-style="{backgroundColor: '#f6f6f6'}" @sort-change="sortTable">
      <el-table-column align="center" label="序号" width="90" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="账号" width="113" sortable="custom" prop="create_time">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.create_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" width="90" sortable="custom" prop="city_code">
        <template slot-scope="scope">
          <span>{{ scope.row.city_code }}</span>
        </template>
      </el-table-column>      
      <el-table-column align="center" label="保证金金额（元）" width="120" sortable="custom" prop="stype">
        <template slot-scope="scope">
          <span>{{ scope.row.stype }}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="支付方式" width="200">
        <template slot-scope="scope">
          <span v-html="scope.row.effective_type_time"></span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="账单号" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.arrValue }}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="支付时间" min-width="260">
        <template slot-scope="scope">
          <span>{{ scope.row.regulations }}</span>
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
  </div>
</template>
<script>
  import { getTicketList, getTicketType, getTicketStatus, editStatus, deleteTicket, getExportData } from '@/api'
  import { parseTime } from '@/utils'
  import moment from 'moment'
  import { exportFromArray } from '@/utils/exportData'
  import hasPermission from '@/utils/checkPermissions'
  import { funcCode } from '@/utils/permissionMap'
  export default {
    // components: { ticketDetail, createTicket, ticketType },
    data () {
      return {
        activeTab: 'one',
        list: [],
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          pageSize: 10,
          sort: 'create_time&desc',
          where: ''
        },
        createdTime: [],
        ticketName: '',
        ticketId: '',
        city: '',
        ticketType: '0',
        refundMethod: [],
        ticketStatus: '0',
        refundStatus: [],
        showCreate: false,
        isChooseType: false,
        showDetail: false,
        couponId: '',
        parseTime: parseTime,
        funcCode: funcCode,
        createTitle: ''
      }
    },
    created () {
      this.getTicketList()
      this.getTicketTypes()
      // 获取城市列表
      this.$store.dispatch('getCity')
      // 获取优惠券状态mock数据
      getTicketStatus().then((res) => {
        this.statusOptions = res
      })
    },
    methods: {
      handleClick () {
        this.getTicketList()
      },
      hasPermission,
      // 获取优惠券列表
      getTicketList () {
        this.listLoading = true
        getTicketList(this.listQuery).then((res) => {
          this.listLoading = false
          this.list = res.data
          this.total = +res.total
        })
      },
      getFilterParams () {
        let condition = {}
        if (this.createdTime && this.createdTime.length > 0) {
          condition.start_time = moment(this.createdTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
          condition.end_time = moment(this.createdTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
        }
        if (+this.ticketType > 0) {
          condition.stype = this.ticketType
        }
        if (+this.ticketStatus > 0) {
          condition.status = this.ticketStatus
        }
        condition.title = this.ticketName
        condition.id = this.ticketId
        condition.city = this.city
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
        this.getTicketList()
      },
      sortTable (args) {
        if (args.order && args.prop) {
          this.listQuery.sort = args.order === 'ascending' ? `${args.prop}&asc` : `${args.prop}&desc`
        } else {
          this.listQuery.sort = ''
        }
        this.getTicketList()
      },
      reset () {
        this.listQuery = {
          page: 1,
          pageSize: 10,
          sort: 'create_time&desc',
          where: ''
        }
        this.createdTime = []
        this.ticketType = '0'
        this.ticketStatus = '0'
        this.ticketName = ''
        this.ticketId = ''
        this.city = ''
      },
      addTicket () {
        this.showCreate = true
        this.isChooseType = false
      },
      // 获取优惠券类型
      getTicketTypes () {
        getTicketType().then((res) => {
          this.typeOptions = res
          this.typeOptions.unshift({
            name: '全部类型',
            number: '0'
          })
        })
      },
      // 选择新增优惠券的类型
      chooseType (type) {
        this.createTitle = type === '1' ? '添加满减券' : (type === '2' ? '添加代金券' : '添加折扣券')
        this.$store.dispatch('CouponType', type)
        this.isChooseType = true
      },
      showTicketDetail (row) {
        this.couponId = row.id
        this.showDetail = true
      },
      handleSizeChange (val) {
        this.listQuery.pageSize = val
        this.getTicketList()
      },
      handleCurrentChange (val) {
        this.listQuery.page = val
        this.getTicketList()
      },
      editStatus (row) {
        const endTime = row.effective_type_time.split('<br>')[1]
        if (endTime && moment(endTime).isBefore(moment()) && row.status === '2') {
          this.$message.error('优惠券已过期，不可启用！')
          return
        }
        let params = {
          id: row.id
        }
        let confirmText = ''
        if (row.status === '1') {
          params.status = '2'
          confirmText = '禁用后所有涉及到此优惠券处不再继续发送此券，确认禁用此优惠券?'
        } else if (row.status === '2') {
          params.status = '1'
          confirmText = '启用后所有涉及到此优惠券处将继续发送此券，确认启用此优惠券?'
        }
        this.$confirm(confirmText, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          editStatus(params).then((res) => {
            this.getTicketList()
          })
        })
      },
      deleteTicket (row) {
        let params = {
          id: row.id
        }
        this.$confirm('删除后不影响已发送的优惠券，确认删除此优惠券？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteTicket(params).then((res) => {
            this.$message.success('删除成功')
            this.getTicketList()
          })
        })
      },
      close () {
        this.showCreate = false
        this.getTicketList()
        this.createTitle = '添加优惠券'
      },
      exportData (e, isAll) {
        this.getFilterParams()
        let params
        if (isAll) {
          params = {
            url: '/activity/coupon/exports'
          }
        } else {
          params = {
            url: '/activity/coupon/export',
            data: {
              where: this.listQuery.where
            }
          }
        }
        getExportData(params).then((res) => {
          let filter = ['id', 'city_code', 'stype', 'title', 'effective_time', 'money', 'rule', 'status', 'operation_id', 'create_time']
          exportFromArray('优惠券列表', res.title, filter, res.data)
        })
      }
    }
  }
</script>

<style lang="scss">
  .handed-bond-list-page {
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
