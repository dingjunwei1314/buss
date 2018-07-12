<template>
  <div class="redeem-code-list">
    <div class="table-filter">
      <div class="filter-item">
        <label for="created-time">生成时间：</label>
        <el-date-picker name="created-time" v-model="createdTime" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </div>

      <div class="filter-item">
        <label for="">操作人：</label>
        <el-input class="filter-box" v-model="operator" size="small" @keyup.enter.native="search"></el-input>
      </div>

      <div class="filter-item">
        <label for="ticket-type">优惠券类型：</label>
        <el-select name="ticket-type" v-model="ticketType" size="small" filterable clearable class="filter-box">
          <el-option
            v-for="item in typeOptions"
            :key="item.number"
            :label="item.name"
            :value="item.number">
          </el-option>
        </el-select>
      </div>

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
        <label for="">优惠券名称：</label>
        <el-input class="filter-box" v-model="ticketName" size="small" @keyup.enter.native="search"></el-input>
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
      <el-button v-if="hasPermission(funcCode.redeemAdd)" type="primary" size="small" @click="createRedeem">生成兑换码</el-button>
    </div>

    <el-table :data="list" highlight-current-row border :stripe="true" v-loading="listLoading" style="width: 100%;" class="filter-box" :header-row-style="{backgroundColor: '#f6f6f6'}" @sort-change="sortTable">
      <el-table-column align="center" label="ID" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="优惠券类型" width="120" sortable="custom" prop="stype">
        <template slot-scope="scope">
          <span v-if="scope.row.stype === '1'">满减券</span>
          <span v-if="scope.row.stype === '2'">代金券</span>
          <span v-if="scope.row.stype === '3'">折扣券</span>          
        </template>
      </el-table-column>

      <el-table-column align="center" label="优惠券名称">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span><br/>
          <el-button type="text" @click="showCouponDetail(scope.row)">(ID：{{ scope.row.c_id }})</el-button>
          <!-- <span>(ID：{{ scope.row.c_id }})</span> -->
        </template>
      </el-table-column>

      <el-table-column align="center" label="生成时间" width="103" sortable="custom" prop="create_time">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.create_time) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="生成数量" width="103" sortable="custom" prop="code_num">
        <template slot-scope="scope">
          <span>{{ scope.row.code_num }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="已兑换数量" width="120" sortable="custom" prop="code_overnum">
        <template slot-scope="scope">
          <span>{{ +scope.row.code_num - +scope.row.code_overnum }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="已使用数量" width="120" sortable="custom" prop="used">
        <template slot-scope="scope">
          <span>{{ scope.row.used }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="描述" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.content || '—' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="100" sortable="custom" prop="cstatus">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.cstatus === '1'" type="success">可兑换</el-tag>
          <el-tag v-if="scope.row.cstatus === '2'" type="danger">不可兑换</el-tag>
          <el-tag v-if="scope.row.cstatus === '5'" type="info">全部已兑换</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作人" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.user_name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button class="action" type="text" @click="getRedeemDetail(scope.row)">查看</el-button>
          <el-button v-if="hasPermission(funcCode.redeemStatus) && scope.row.cstatus !== '5'" class="action" type="text" @click="editStatus(scope.row)">{{ scope.row.cstatus === '1' ? '暂停兑换' : '恢复兑换'}}</el-button>
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

    <el-dialog title="生成兑换码" :visible.sync="showCreateRedeem" width="800px" top="96px" :close-on-click-modal="false">
      <create-redeem @close="closeDialog"></create-redeem>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="showDetail" width="800px" top="96px" :close-on-click-modal="false" @close="couponId = ''">
      <ticket-detail :id="couponId"></ticket-detail>
    </el-dialog>
  </div>
</template>

<script>
  import { parseTime } from '@/utils'
  import { getRedeemList, editRedeemStatus } from '@/api'
  import createRedeem from './createRedeem'
  import TicketDetail from '../ticketList/ticketDetail'
  import moment from 'moment'
  import hasPermission from '@/utils/checkPermissions'
  import { funcCode } from '@/utils/permissionMap'

  const statusOptions = [{
    name: '全部',
    number: '0'
  }, {
    name: '可兑换',
    number: '1'
  }, {
    name: '不可兑换',
    number: '2'
  }, {
    name: '全部已兑换',
    number: '5'
  }]
  const typeOptions = [{
    name: '全部类型',
    number: '0'
  }, {
    name: '满减券',
    number: '1'
  }, {
    name: '折扣券',
    number: '2'
  }, {
    name: '代金券',
    number: '3'
  }]
  export default {
    components: { createRedeem, TicketDetail },
    data () {
      return {
        list: [],
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          pageSize: 10,
          where: '',
          sort: 'create_time&desc'
        },
        parseTime: parseTime,
        createdTime: [],
        operator: '',
        ticketType: '0',
        typeOptions: typeOptions,
        cstatus: '0',
        statusOptions: statusOptions,
        ticketName: '',
        ticketId: '',
        showCreateRedeem: false,
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
        getRedeemList(this.listQuery).then((res) => {
          this.listLoading = false
          this.list = res.data
          this.total = +res.total
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
        if (this.createdTime && this.createdTime.length > 0) {
          condition.start_time = moment(this.createdTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
          condition.end_time = moment(this.createdTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
        }
        if (+this.ticketType > 0) {
          condition.stype = this.ticketType
        }
        if (+this.cstatus > 0) {
          condition.cstatus = this.cstatus
        }
        condition.title = this.ticketName
        condition.c_id = this.ticketId
        condition.user_name = this.operator
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
          sort: 'create_time&desc'
        }
        this.createdTime = []
        this.ticketType = '0'
        this.cstatus = '0'
        this.ticketName = ''
        this.ticketId = ''
        this.operator = ''
      },
      editStatus (row) {
        const params = {
          id: row.id,
          cstatus: row.cstatus === '1' ? '2' : '1'
        }
        const confirmText = row.cstatus === '1' ? '确认暂停？' : '确认恢复？'
        this.$confirm(confirmText, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          editRedeemStatus(params).then((res) => {
            this.$message.success('操作成功')
            this.getList()
          })
        })
      },
      getRedeemDetail (row) {
        this.$router.push({ path: 'redeemDetail', query: { b_id: row.id } })
        window.localStorage.setItem('b_id', row.id)
      },
      createRedeem () {
        this.showCreateRedeem = true
      },
      showCouponDetail (row) {
        this.couponId = row.c_id
        this.showDetail = true
      },
      closeDialog () {
        this.showCreateRedeem = false
        this.getList()
      }
    }
  }
</script>
<style lang="scss">
  .redeem-code-list {
    .table-filter {
    }
  }
</style>
