<template>
  <div class="personal-page">
    <div class="table-filter">
      <div class="filter-item">
        <div class="filter-item">
          <label for="">用户姓名：</label>
          <el-input class="filter-box" v-model="userName" size="small" @keyup.enter.native="search"></el-input>
        </div>

        <div class="filter-item">
          <label for="">用户ID：</label>
          <el-input class="filter-box" v-model="userName" size="small" @keyup.enter.native="search"></el-input>
        </div>

        <div class="filter-item">
          <label for="">用户账号：</label>
          <el-input class="filter-box" v-model="userName" size="small" @keyup.enter.native="search"></el-input>
        </div>

        <div class="search-button inline-block">
          <el-button type="primary" size="small" @click="search">查询</el-button>
          <el-button type="ghost" size="small" style="margin-left: 8px" @click="reset">重置</el-button>
        </div>
      </div>

      <el-table :data="list" highlight-current-row border :stripe="true" v-loading="listLoading" style="width: 100%;" class="filter-box" :header-row-style="{backgroundColor: '#f6f6f6'}" @sort-change="sortTable">
        <el-table-column align="center" label="用户ID" sortable="custom" prop="id">
          <template slot-scope="scope">
            <span>{{ scope.row.user_id }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="账户状态" sortable="custom" prop="id">
          <template slot-scope="scope">
            <span>{{ scope.row.status }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="账户类型" sortable="custom" prop="id">
          <template slot-scope="scope">
            <span>{{ scope.row.type }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="用户姓名" sortable="custom" prop="id">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="性别" sortable="custom" prop="id">
          <template slot-scope="scope">
            <span>{{ scope.row.sex }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="身份证号" sortable="custom" prop="id">
          <template slot-scope="scope">
            <span>{{ scope.row.user_number }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="驾驶证号" sortable="custom" prop="id">
          <template slot-scope="scope">
            <span>{{ scope.row.car_number }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="注册时间" sortable="custom" prop="id">
          <template slot-scope="scope">
            <span>{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="最近登录" sortable="custom" prop="id">
          <template slot-scope="scope">
            <span>{{ scope.row.last_login }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button class="action" type="text" @click="">查看</el-button>
            <el-button class="action" type="text" @click="">修改</el-button>
            <el-button class="action" type="text" @click="">审核</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {getGeneralInformation} from '@/api'
export default {
  data () {
    return {
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      userName: ''
    }
  },
  created () {
    this.list = [
      {
        user_id: '1231',
        name: '张三',
        sex: '男',
        status: '待审核',
        type: '个人用户',
        account: '13456789100',
        user_number: '112312312412412467',
        car_number: '461524675124123',
        create_time: '2018-05-21 16:33:48',
        last_login: '2018-05-21 16:33:48'
      }
    ]
    this.getGeneralInformation()
  },
  methods: {
    search () {},
    getGeneralInformation () {
      var params = {}
      getGeneralInformation(params).then(res => {
        console.log(res)
      })
    },
    reset () {},
    sortTable () {},
    handleSizeChange () {},
    handleCurrentChange () {}
  }
}
</script>
