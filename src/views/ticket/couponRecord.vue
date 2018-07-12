<template>
  <div class="coupon-record">
    <div class="table-filter">
      <div class="filter-item">
        <label for="created-time">发放时间：</label>
        <el-date-picker name="created-time" v-model="sendTime" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </div>

      <div class="filter-item">
        <label for="">优惠券ID ：</label>
        <el-input class="filter-box" v-model="ticketCid" size="small" @keyup.enter.native="search"></el-input>
      </div>

      <div class="filter-item">
        <label for="">记录ID ：</label>
        <el-input class="filter-box" v-model="ticketId" size="small" @keyup.enter.native="search"></el-input>
      </div>

      <div class="filter-item">
        <label for="">手机号：</label>
        <el-input class="filter-box" v-model="phonoNumber" size="small" @keyup.enter.native="search"></el-input>
      </div>

      <div class="filter-item">
        <label for="">兑换码：</label>
        <el-input class="filter-box" v-model="code" size="small" @keyup.enter.native="search"></el-input>
      </div>

      <div class="filter-item">
        <label for="ticket-type">使用状态：</label>
        <el-select name="ticket-type" v-model="status" size="small" filterable clearable placeholder="请选择发放状态" class="filter-box">
          <el-option v-for="item in statusOptions" :key="item.number" :label="item.name" :value="item.number">
          </el-option>
        </el-select>
      </div>

      <div class="filter-item">
        <label for="ticket-type">渠道：</label>
        <el-select name="ticket-type" v-model="source" size="small" filterable clearable placeholder="请选择渠道" class="filter-box">
          <el-option v-for="(item, key) in sourceOptions" :key="item" :label="item" :value="key">
          </el-option>
        </el-select>
      </div>

      <div class="search-button inline-block">
        <el-button type="primary" size="small" @click="search">查询</el-button>
        <el-button type="ghost" size="small" style="margin-left: 8px" @click="reset">重置</el-button>
      </div>
    </div>

    <div class="func-btn">
      <el-button v-if="hasPermission(funcCode.recordExport)" type="primary" size="small" @click="exportData($event)">导出当前列表</el-button>
      <el-button v-if="hasPermission(funcCode.recordExportAll)" type="primary" size="small" @click="exportData($event, true)">导出全部列表</el-button>
    </div>

    <el-table :data="list" highlight-current-row border :stripe="true" v-loading="listLoading" style="width: 100%;" class="filter-box" :header-row-style="{backgroundColor: '#f6f6f6'}" @sort-change="sortTable">
      <el-table-column align="center" label="记录ID" width="100" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="发放时间" width="160" sortable="custom" prop="create_time">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.create_time) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="优惠券ID" width="120" sortable="custom" prop="c_id">
        <template slot-scope="scope">
          <el-button type="text" @click="showCouponDetail(scope.row)">{{ scope.row.c_id }}</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="城市" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.city_code }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="有效期" width="155">
        <template slot-scope="scope">
          <span>{{ scope.row.start_time }}</span><br>
          <span>{{ scope.row.end_time }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="渠道" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.source }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="UID">
        <template slot-scope="scope">
          <span>{{ scope.row.uid || '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.phonoNumber }}</span>
        </template>
      </el-table-column>      

      <el-table-column align="center" label="使用状态" sortable="custom" prop="status">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="使用时间" sortable="custom" prop="user_time">
        <template slot-scope="scope">
          <span>{{ scope.row.user_time || '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单ID" width="260">
        <template slot-scope="scope">
          <span>{{ scope.row.order_id || '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="兑换码">
        <template slot-scope="scope">
          <span>{{ scope.row.code || '-' }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <el-dialog title="提示" :visible.sync="showDetail" width="800px" top="96px" :close-on-click-modal="false" @close="couponId = ''">
      <ticket-detail :id="couponId"></ticket-detail>
    </el-dialog>
  </div>
</template>
<script>
import { getRecord, getSource, getExportData, getUser } from '@/api'
import moment from 'moment'
import { parseTime } from '@/utils'
import { exportFromArray } from '@/utils/exportData'
import TicketDetail from './ticketList/ticketDetail'
import hasPermission from '@/utils/checkPermissions'
import { funcCode } from '@/utils/permissionMap'
import * as R from 'ramda'

const statusOptions = [
  {
    name: '全部',
    number: '0'
  },
  {
    name: '未使用',
    number: '10'
  },
  {
    name: '已使用',
    number: '20'
  }
]
export default {
  components: { TicketDetail },
  data () {
    return {
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        pageSize: 10,
        where: '',
        sort: 'id&desc'
      },
      sendTime: [],
      ticketId: '',
      ticketCid: '',
      uid: '',
      code: '',
      status: '0',
      statusOptions: statusOptions,
      source: '',
      sourceOptions: [],
      parseTime: parseTime,
      showDetail: false,
      couponId: '',
      funcCode: funcCode,
      phonoNumber: '',
      getPhoneUid: [],
      userParams: ''
    }
  },
  created () {
    this.getList()
    this.getSource()
    // this.getPhotoNumber()
  },
  methods: {
    hasPermission,
    async getList () {
      this.listLoading = true
      await getRecord(this.listQuery)
      .then(res => {
        this.list = res.data
        this.total = +res.total
        this.listLoading = false
        let uidList = R.uniq(res.data.map(x => x.uid)).join(',');
        getUser({userId: uidList})
        .then(res => {
          let data  = res.attachment
          this.list = (R.map( x => {
            for(let item of data){
              if(x.uid == item.userId){
                x.phonoNumber = item.phoneNum;
                return x;
              }
            }
            return x;
          })(this.list));
          this.listLoading = false          
        })
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
    async getFilterParams () {
      let condition = {}
      if (this.sendTime && this.sendTime.length > 0) {
        condition.start_time =
          moment(this.sendTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
        condition.end_time =
          moment(this.sendTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      if (+this.status > 0) {
        condition.status = this.status
      }
      if (this.phonoNumber) {
        await getUser({phoneNum: this.phonoNumber})
        .then(res => {
          let data  = res.attachment
          this.uid = data[0].userId
        })
      condition.uid = this.uid
      } else {
        condition.uid = ''
      }
      condition.code = this.code
      condition.c_id = this.ticketCid
      condition.id = this.ticketId
      condition.source = this.source
      this.listQuery.where = ''
      for (let i in condition) {
        if (condition[i]) {
          const str = `${i}=${condition[i]}&`
          this.listQuery.where += str
        }
      }
    },
    sortTable (args) {
      if (args.order && args.prop) {
        this.listQuery.sort =
          args.order === 'ascending' ? `${args.prop}&asc` : `${args.prop}&desc`
      } else {
        this.listQuery.sort = ''
      }
      this.getList()
    },
    async search () {
      await this.getFilterParams()
      this.getList()
    },
    reset () {
      this.listQuery = {
        page: 1,
        pageSize: 10,
        where: '',
        sort: 'id&desc'
      }
      this.sendTime = []
      this.uid = ''
      this.ticketId = ''
      this.ticketCid = ''
      this.status = '0'
      this.source = ''
      this.code = ''
    },
    getSource () {
      getSource().then(res => {
        this.sourceOptions = res
      })
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
          url: '/activity/record/exports'
        }
      } else {
        params = {
          url: '/activity/record/export',
          data: {
            where: this.listQuery.where
          }
        }
      }
      getExportData(params).then(res => {
        let filter = [
          'id',
          'create_time',
          'c_id',
          'city_code',
          'expiry_time',
          'source',
          'uid',
          'status',
          'user_time',
          'order_id',
          'code'
        ]
        exportFromArray('优惠券领取记录', res.title, filter, res.data)
      })
    }
  }
}
</script>
