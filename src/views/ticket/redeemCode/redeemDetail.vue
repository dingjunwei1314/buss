<template>
  <div class="redeem-detail">
    <div class="table-filter">
      <div class="filter-item">
        <label for="ticket-status">状态：</label>
        <el-select name="ticket-status" v-model="cstatus" size="small" filterable clearable placeholder="优惠券类型" class="filter-box">
          <el-option
            v-for="item in statusOptions"
            :key="item.number"
            :label="item.name"
            :value="item.number">
          </el-option>
        </el-select>
      </div>

      <div class="filter-item">
        <label for="">兑换码：</label>
        <el-input class="filter-box" v-model="code" size="small" @keyup.enter.native="search"></el-input>
      </div>

      <div class="filter-item">
        <label for="">优惠券ID ：</label>
        <el-input class="filter-box" v-model="ticketId" size="small" @keyup.enter.native="search"></el-input>
      </div>

      <div class="search-button inline-block">
        <el-button type="primary" size="small" @click="search">查询</el-button>
        <el-button type="ghost" size="small" style="margin-left: 8px" @click="reset">重置</el-button>
      </div>
    </div>

    <div class="func-btn">
      <el-button v-if="hasPermission(funcCode.codeExport)" type="primary" size="small" @click="exportData($event)">导出当前列表</el-button>
      <el-button v-if="hasPermission(funcCode.codeExportAll)" type="primary" size="small" @click="exportData($event, true)">导出全部列表</el-button>
    </div>

    <el-table :data="list" highlight-current-row border :stripe="true" v-loading="listLoading" style="width: 100%;" class="filter-box" :header-row-style="{backgroundColor: '#f6f6f6'}" @sort-change="sortTable">
      <el-table-column align="center" label="序号" min-width="90" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="兑换码" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="优惠券ID" min-width="110" sortable="custom" prop="c_id">
        <template slot-scope="scope">
          <el-button type="text" @click="showCouponDetail(scope.row)">{{ scope.row.c_id }}</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="券码状态" min-width="103" sortable="custom" prop="cstatus">
        <template slot-scope="scope">
          <span v-if="scope.row.cstatus === '1'">待兑换</span>
          <span v-else-if="scope.row.cstatus === '2'">已兑换</span>
          <span v-else>---</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" min-width="103">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.create_time) || '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="兑换时间" min-width="103" sortable="custom" prop="modify_time">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.modify_time) || '-' }}</span>
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

    <el-dialog title="提示" :visible.sync="showDetail" width="800px" top="96px" :close-on-click-modal="false" @close="couponId = ''">
      <ticket-detail :id="couponId"></ticket-detail>
    </el-dialog>
  </div>
</template>
<script>
  import { redeemDetail, getExportData } from '@/api'
  import { exportFromArray } from '@/utils/exportData'
  import TicketDetail from '../ticketList/ticketDetail'
  import { parseTime } from '@/utils'
  import hasPermission from '@/utils/checkPermissions'
  import { funcCode } from '@/utils/permissionMap'

  const statusOptions = [{
    name: '全部',
    number: '0'
  }, {
    name: '待兑换',
    number: '1'
  }, {
    name: '已兑换',
    number: '2'
  }]
  export default {
    components: { TicketDetail },
    data () {
      return {
        b_id: '',
        list: [],
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          pageSize: 10,
          where: '',
          sort: ''
        },
        cstatus: '0',
        statusOptions: statusOptions,
        code: '',
        ticketId: '',
        showDetail: false,
        couponId: '',
        parseTime: parseTime,
        funcCode: funcCode
      }
    },
    created () {
      this.b_id = this.$route.query.b_id || window.localStorage.getItem('b_id')
      this.getCodeList()
    },
    methods: {
      hasPermission,
      getCodeList () {
        this.listLoading = true
        this.listQuery['b_id'] = this.b_id
        redeemDetail(this.listQuery).then((res) => {
          this.list = res.data || []
          this.total = +res.total
          this.listLoading = false
        })
      },
      handleSizeChange (val) {
        this.listQuery.pageSize = val
        this.getCodeList()
      },
      handleCurrentChange (val) {
        this.listQuery.page = val
        this.getCodeList()
      },
      getFilterParams () {
        let condition = {}
        if (+this.cstatus > 0) {
          condition.cstatus = this.cstatus
        }
        condition.code = this.code
        condition.c_id = this.ticketId
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
        this.getCodeList()
      },
      sortTable (args) {
        if (args.order && args.prop) {
          this.listQuery.sort = args.order === 'ascending' ? `${args.prop}&asc` : `${args.prop}&desc`
        } else {
          this.listQuery.sort = ''
        }
        this.getCodeList()
      },
      reset () {
        this.listQuery = {
          page: 1,
          pageSize: 10,
          where: '',
          sort: ''
        }
        this.cstatus = '0'
        this.uid = ''
        this.code = ''
        this.ticketId = ''
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
            url: '/activity/code/exports',
            data: {
              b_id: this.b_id
            }
          }
        } else {
          params = {
            url: '/activity/code/export',
            data: {
              b_id: this.b_id,
              where: this.listQuery.where
            }
          }
        }
        getExportData(params).then((res) => {
          let filter = ['id', 'code', 'c_id', 'cstatus', 'create_time', 'modify_time']
          exportFromArray('兑换码列表（查看）', res.title, filter, res.data)
        })
      }
    }
  }
</script>
