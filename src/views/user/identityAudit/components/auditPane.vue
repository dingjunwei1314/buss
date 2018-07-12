<template>
    <div class="ticket-list-page">
        <div class="table-filter">
            <div class="filter-item">
                <label for="reCharge-time">提交时间：</label>
                <el-date-picker name="reCharge-time" v-model="reChargeTime" type="datetimerange" size="small" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
            </div>

            <div class="filter-item">
                <label for="reCharge-time">人工审核时间：</label>
                <el-date-picker name="reCharge-time" v-model="reChargeTime" type="datetimerange" size="small" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
            </div>

            <div class="filter-item">
                <label for="ticket-type">账号状态：</label>
                <el-select name="ticket-type" v-model="ticketType" size="small" filterable clearable placeholder="优惠券类型" class="filter-box">
                    <el-option v-for="item in typeOptions" :key="item.number" :label="item.name" :value="item.number">
                    </el-option>
                </el-select>
            </div>

            <div class="filter-item">
                <label for="ticket-status">机审预审状态：</label>
                <el-select name="ticket-status" v-model="ticketStatus" size="small" filterable clearable placeholder="优惠券类型" class="filter-box">
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>

            <div class="filter-item">
                <label for="">姓名：</label>
                <el-input class="filter-box" v-model="ticketName" size="small" @keyup.enter.native="search"></el-input>
            </div>

            <div class="filter-item">
                <label for="">账号：</label>
                <el-input class="filter-box" v-model="ticketId" size="small" @keyup.enter.native="search"></el-input>
            </div>

            <div class="filter-item">
                <label for="">审核人 ：</label>
                <el-input class="filter-box" v-model="reChargeBill" size="small" @keyup.enter.native="search"></el-input>
            </div>

            <div class="search-button inline-block">
                <el-button type="primary" size="small" @click="search">搜索</el-button>
            </div>
        </div>

        <el-table :data="list" highlight-current-row border :stripe="true" v-loading="listLoading" style="width: 100%;" class="filter-box" :header-row-style="{backgroundColor: '#f6f6f6'}" @sort-change="sortTable">
            <el-table-column align="center" label="序号" prop="id">
                <template slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="账号" prop="reChargeAccount">
                <template slot-scope="scope">
                    <span>{{ scope.row.reChargeAccount }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="姓名" prop="name">
                <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="账号状态" prop="reChargeMoney">
                <template slot-scope="scope">
                    <span>{{ scope.row.accountStatus }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="机审预审状态">
                <template slot-scope="scope">
                    <span>{{ scope.row.auditStatus }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="图片对比相似度">
                <template slot-scope="scope">
                    <span v-html="scope.row.similarity"></span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="身份认证提交时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.commitTime }}</span>
                </template>
            </el-table-column>
            <el-table-column v-if="type != 'to'" align="center" label="人工审核时间" width="120" prop="consumeRemainedMoney">
                <template slot-scope="scope">
                    <span>{{ scope.row.auditTime }}</span>
                </template>
            </el-table-column>
            <el-table-column v-if="type != 'to'" align="center" label="审核人" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.auditor }}</span>
                </template>
            </el-table-column>
            <el-table-column v-if="type != 'to'" align="center" label="操作" width="180">
                <template slot-scope="scope">
                    <el-button v-if="hasPermission(funcCode.couponView)" class="action" type="text" @click="getAuditDetail(scope.row)">查看</el-button>
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
      loading: false
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
    getAuditDetail () { this.$router.push({ path: 'auditDeatil' }) },
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
}
</style>
