<template>
  <div class="account-list">
    <div class="table-filter">
      <div class="filter-item">
        <label for="">城市限制：</label>
        <el-select v-model="cityCode" size="small" filterable clearable placeholder="请选择城市" class="filter-box">
          <el-option
            v-for="item in cityOptions"
            :key="item.citycode"
            :label="item.cityname"
            :value="item.baiduid">
          </el-option>
        </el-select>
      </div>

      <div class="filter-item">
        <label for="">角色：</label>
        <el-select v-model="roluId" size="small" filterable clearable placeholder="请选择城市" class="filter-box">
          <el-option
            v-for="item in cityOptions"
            :key="item.citycode"
            :label="item.cityname"
            :value="item.baiduid">
          </el-option>
        </el-select>
      </div>

      <div class="filter-item">
        <label for="">状态：</label>
        <el-select v-model="status" size="small" filterable clearable placeholder="请选择城市" class="filter-box">
          <el-option
            v-for="item in cityOptions"
            :key="item.citycode"
            :label="item.cityname"
            :value="item.baiduid">
          </el-option>
        </el-select>
      </div>

      <div class="filter-item">
        <label for="">账号：</label>
        <el-input class="filter-box" v-model="account" size="small" placeholder="优惠券名称" @keyup.enter.native="search"></el-input>
      </div>

      <div class="filter-item">
        <label for="">姓名：</label>
        <el-input class="filter-box" v-model="name" size="small" placeholder="优惠券名称" @keyup.enter.native="search"></el-input>
      </div>

      <div class="filter-item">
        <label for="">手机号：</label>
        <el-input class="filter-box" v-model="mobile" size="small" placeholder="优惠券名称" @keyup.enter.native="search"></el-input>
      </div>

      <div class="filter-item">
        <label for="">邮箱：</label>
        <el-input class="filter-box" v-model="email" size="small" placeholder="优惠券名称" @keyup.enter.native="search"></el-input>
      </div>

      <div class="filter-item">
        <label for="created-time">注册时间：</label>
        <el-date-picker name="created-time" v-model="createdTime" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </div>

      <div class="filter-item">
        <label for="created-time">最后登录时间：</label>
        <el-date-picker name="created-time" v-model="loginTime" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </div>

      <div class="search-button inline-block">
        <el-button type="primary" size="small" @click="search">查询</el-button>
        <el-button type="ghost" size="small" style="margin-left: 8px" @click="reset">重置</el-button>
      </div>
    </div>

    <div class="func-btn">
      <el-button type="primary" size="small" @click="showDialog = true">添加</el-button>
      <el-button type="primary" size="small" @click="exportData($event)">导出当前列表</el-button>
      <el-button type="primary" size="small" @click="exportData($event, true)">导出全部列表</el-button>
    </div>

    <el-table :data="list" highlight-current-row border :stripe="true" v-loading="listLoading" style="width: 100%;" class="filter-box" :header-row-style="{backgroundColor: '#f6f6f6'}">
      <el-table-column align="center" label="序号">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="账号">
        <template slot-scope="scope">
          <span>{{ scope.row.user_account }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.user_name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.user_mobile }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.user_email }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="城市">
        <template slot-scope="scope">
          <span>{{ scope.row.city_ids || '无' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色">
        <template slot-scope="scope">
          <span>{{ scope.row.role_name || '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="注册时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.user_creation_time) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="最后登录时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.user_last_login_time) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status === '1'">启用</span>
          <span v-else>禁用</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button class="action" type="text" @click="edit(scope.row)">修改</el-button>
          <el-button class="action" type="text" @click="">删除</el-button>
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

    <el-dialog title="提示" :visible.sync="showDialog" width="600px" top="96px" :close-on-click-modal="false">
      <create-account :data.sync="userData" @close="close"></create-account>
    </el-dialog>
  </div>
</template>
<script>
  import { getCity, getAccount } from '@/api'
  import { parseTime } from '@/utils'
  import moment from 'moment'
  import createAccount from './createAccount'
  export default {
    components: { createAccount },
    data () {
      return {
        list: [],
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          pageSize: 10,
          where: '',
          sort: ''
        },
        cityCode: '',
        cityOptions: [],
        roluId: '',
        status: '',
        account: '',
        name: '',
        mobile: '',
        email: '',
        createdTime: [],
        loginTime: [],
        parseTime: parseTime,
        userData: null,
        showDialog: false
      }
    },
    created () {
      this.getList()
      this.getCities()
    },
    methods: {
      getCities () {
        getCity().then((res) => {
          this.cityOptions = res
        })
      },
      getList () {
        this.listLoading - true
        const params = {
          page: this.listQuery.page,
          pageSize: this.listQuery.pageSize,
          where: this.listQuery.where,
          sort: ''
        }
        getAccount(params).then((res) => {
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
        if (this.createdTime.length > 0) {
          condition.user_creation_time = moment(this.createdTime[0]).format('YYYY-MM-DD') + '—' + moment(this.createdTime[1]).format('YYYY-MM-DD')
        }
        if (this.loginTime.length > 0) {
          condition.user_last_login_time = moment(this.loginTime[0]).format('YYYY-MM-DD') + '—' + moment(this.loginTime[1]).format('YYYY-MM-DD')
        }
        condition.city_ids = this.cityCode
        condition.role_id = this.roluId
        condition.status = this.status
        condition.user_account = this.account
        condition.user_name = this.name
        condition.user_mobile = this.mobile
        condition.user_email = this.email
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
      reset () {
        this.listQuery = {
          page: 1,
          pageSize: 10,
          where: '',
          sort: ''
        }
        this.createdTime = []
        this.loginTime = []
        this.cityCode = ''
        this.roluId = ''
        this.status = ''
        this.account = ''
        this.name = ''
        this.mobile = ''
        this.email = ''
      },
      edit (row) {
        this.userData = Object.assign({}, row)
        this.showDialog = true
      },
      close () {
        this.userData = null
        this.showDialog = false
      },
      exportData () {}
    }
  }
</script>
<style lang="scss">
  .account-list {
    .table-filter {
      .filter-item {
        & > label {
          width: 100px;
        }
      }
    }
  }
</style>
