<template>
  <div class="personal-page">
   

    <el-table :data="list" highlight-current-row border :stripe="true" v-loading="listLoading" style="width: 100%;" class="filter-box" :header-row-style="{backgroundColor: '#f6f6f6'}" @sort-change="sortTable">
      <el-table-column align="center" label="用户ID" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="账号" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.phoneNum }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="账户状态" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{scope.row.status}}</span>
          
          <!-- <span v-if="scope.row.status=='0'">初始化</span>
          <span v-if="scope.row.status=='10'">审核中</span>
          <span v-if="scope.row.status=='15'">审核驳回</span>
          <span v-if="scope.row.status=='18'">机审通过</span>
          <span v-if="scope.row.status=='20'">正常状态</span>
          <span v-if="scope.row.status=='100'">非法用户</span> -->
        </template>
      </el-table-column>
      <el-table-column align="center" label="账户余额（元）" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{(scope.row.balance+scope.row.promoteMoney+scope.row.parkFeeMoney)/100}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实充余额（元）" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{scope.row.balance/100}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="返现余额（元）" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{scope.row.promoteMoney/100}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="停车费余额（元）" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{scope.row.parkFeeMoney/100}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="保证金（元）" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{scope.row.bail/100}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="优惠券数量（张）" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{scope.row.balance}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="里程豆数量" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{scope.row.balance}}</span>
        </template>
      </el-table-column> -->
    </el-table>

    <!-- <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="filterForm.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="filterForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination> -->

  </div>
</template>

<script>
  import { getwalletList } from '@/api'
  import { PIC_URL } from '@/config/app'
  // import md5 from '@/utils/md5'
  // import hasPermission from '@/utils/checkPermissions'
  export default {
    components: {},
    data () {
      return {
        PIC_URL,
        btnLoading: false,
        createTime: [],
        licenseTime: [],
        examineTime: [],
        list: [],
        listLoading: false,
        total: 0,
        filterForm: {
          page: 1,
          pageSize: 10,
          userId: '',
        },
      
        createTitle: '用户信息',
        viewInfoDialog: false,
        data: {}
      }
    },
    created () {
      this.getwalletList()
    },
    methods: {
      getwalletList () { // 获取数据
        this.filterForm.userId = this.$route.params.userId
        this.listLoading = true
        getwalletList(this.filterForm).then((res) => {
          this.listLoading = false
          if (res.status === 200) {
            this.list = [].concat(res.attachment)
            this.total = res.attachment.totalSize
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
          console.log(err)
          this.listLoading = false
        })
      },
      search () {
        this.getwalletList()
      },
      reset () {
        for (let i in this.filterForm) {
          if (i !== 'page' && i !== 'pageSize') {
            this.filterForm[i] = ''
          }
        }
        this.createTime = []
        this.licenseTime = []
        this.examineTime = []
      },
      sortTable () {},
      // handleSizeChange (value) {
      //   this.filterForm.pageSize = value
      //   this.getwalletList()
      // },
      // handleCurrentChange (value) {
      //   this.filterForm.page = value
      //   this.getwalletList()
      // }
    }
  }
</script>

<style lang="scss">
  .personal-page{
    .two-input{
      width:360px;
      display:inline-block;
      .two-input-flex{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%
      }
    }

    .detail-item {
      margin-bottom: 10px;
      .item-label {
        display: inline-block;
        width: 150px;
        text-align: right;
      }
      .show-item {
        display: inline-block;
        width: 300px;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 6px;
      }
    }

    .tab-con{
      padding: 30px 10px; 
      border-top: 2px solid rgb(60, 141, 188);
    }
  }
  
</style>

