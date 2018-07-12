<template>
  <div class="phone">
    <el-tabs type="border-card" v-model="activeTab">
        <el-tab-pane label="更换用户手机号" name="one">
          <el-form ref="phoneChangeForm" :rules="rules" :model="phoneChangeForm" label-width="120px">
            <el-form-item label="用户当前手机号" prop="phoneNumOld">
                <el-input size="small" v-model="phoneChangeForm.phoneNumOld"></el-input>
            </el-form-item>
            <el-form-item label="用户新手机号" prop="phoneNumNew">
                <el-input size="small" v-model="phoneChangeForm.phoneNumNew"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" :loading="btnLoading" @click="phoneChange('phoneChangeForm')">确认</el-button>
            </el-form-item>
          </el-form>
      </el-tab-pane>
      <!-- <el-tab-pane label="更换记录" disabled name="two">
        <div class="table-filter">
            <div class="filter-item">
                <label for="created-time">时间：</label>
                <el-date-picker name="created-time" v-model="createdTime" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </div>  

            <div class="filter-item">
                <label for="">姓名：</label>
                <el-input class="filter-box" v-model="fullName" size="small" @keyup.enter.native="search"></el-input>
            </div>

            <div class="filter-item">
                <label for="">原账号 ：</label>
                <el-input class="filter-box" v-model="phoneNum" size="small" @keyup.enter.native="search"></el-input>
            </div>

            <div class="filter-item">
                <label for="">新账号 ：</label>
                <el-input class="filter-box" v-model="phoneNum" size="small" @keyup.enter.native="search"></el-input>
            </div>
           
            
            <div class="search-button inline-block">
                <el-button type="primary" size="small" @click="search">查询</el-button>
                <el-button type="ghost" size="small" style="margin-left: 8px" @click="reset">重置</el-button>
            </div>
            </div>


        <el-table :data="list" highlight-current-row border :stripe="true" v-loading="listLoading" style="width: 100%;" class="filter-box" :header-row-style="{backgroundColor: '#f6f6f6'}" @sort-change="sortTable">

            <el-table-column align="center" label="序号" width="113"  prop="careateTime">
                <template slot-scope="scope">
                <span>{{ scope.row.phoneNum }}</span>
                </template>
            </el-table-column>
           
            <el-table-column align="center" label="原账号" width="113"  prop="careateTime">
                <template slot-scope="scope">
                <span>{{ scope.row.phoneNum }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="姓名" width="90"  prop="city_code">
                <template slot-scope="scope">
                <span>{{ scope.row.fullName }}</span>
                </template>
            </el-table-column>      
            <el-table-column align="center" label="新账号" width="113"  prop="careateTime">
                <template slot-scope="scope">
                <span>{{ scope.row.phoneNum }}</span>
                </template>
            </el-table-column>
            <el-table-column  align="center" label="更换时间" min-width="100">
                <template slot-scope="scope">
                <span>{{ scope.row.careateTime }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作人" width="90">
                <template slot-scope="scope">
                <span>{{ scope.row.sysUserId }}</span>
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
        </el-tab-pane> -->
      </el-tabs>

  </div>
</template>
<script>
  import { phoneChange, searchRechargeRecords, getUser } from '@/api'
  import moment from 'moment'
  import hasPermission from '@/utils/checkPermissions'
  import { mapState } from 'vuex'
  import { getUserId } from '@/utils/auth'
  export default {
    data () {
      var checkPhoneNumOld= (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户当前手机号不能为空'))
        }
        var reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
        if (!reg.test(value)) {
          return callback(new Error('手机号格式错误'))
        }
        callback()
      }
      var checkPhoneNumNew= (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户新手机号不能为空'))
        }
        var reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
        if (!reg.test(value)) {
          return callback(new Error('手机号格式错误'))
        }
        if (value === this.phoneChangeForm.phoneNumOld) {
            return callback(new Error('新手机号不能跟当前手机号一致'))
        }
        callback()
      }
      return {
        activeTab: 'one',
        list: [],
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          pageSize: 10
        },
        btnLoading: false,
        rules: {
          phoneNumOld: [
            {validator: checkPhoneNumOld, trigger: 'blur', required: true}
          ],
          phoneNumNew: [
            {validator: checkPhoneNumNew, trigger: 'blur', required: true}
          ] 
        },
        phoneChangeForm: {
          phoneNumOld: '',
          phoneNumNew: '',
        },
        reasonOptions: [],
        createdTime: [],
        fullName: '',
        phoneNum: '',
        rechargeReasonId: '',
        funcCode: {}
      }
    },
    computed:{
      ...mapState({
        userInfo:state => state.user.userInfo,
      })
    },
    created () {
    //   this.searchRechargeRecords()
    //   this.$store.dispatch('SetRechargeReason').then(res => {
    //     this.reasonOptions = res
    //   })
    },
    methods: {
      handleClick () {
        this.searchRechargeRecords()
      },
      hasPermission,
      searchRechargeRecords () {
        this.getFilterParams()
        this.listLoading = true
        searchRechargeRecords(this.listQuery).then((res) => {
          this.listLoading = false
          if (res.status === 200) {
            this.list = res.attachment.data
            this.total = res.attachment.totalSize
            this.list.forEach(item => {
              getUser({userId: item.sysUserId}).then(res => {
                if (res.status === 200) {
                  if(res.attachment.length > 0){
                    item.sysUserId = res.attachment[0].fullName
                  }else{
                    item.sysUserId = ''
                  }
                }
              })
            })
          }
        })
      },
      getFilterParams () {
        this.listQuery.startTime = '';
        this.listQuery.endTime = '';
        if (this.createdTime && this.createdTime.length > 0) {
          this.listQuery.startTime = moment(this.createdTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
          this.listQuery.endTime = moment(this.createdTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
        }
        this.listQuery.fullName = this.fullName
        this.listQuery.phoneNum = this.phoneNum
        this.listQuery.rechargeReasonId = this.rechargeReasonId
      },
      phoneChange (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('确认更换吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.btnLoading = true
              const formData = {
                phoneNumOld: this.phoneChangeForm.phoneNumOld,
                phoneNumNew: this.phoneChangeForm.phoneNumNew,
                sysUserId: getUserId(),
                remark: '无'
              }
              phoneChange(formData).then(res => {
                if (res.status === 200) {
                  this.btnLoading = false
                  this.$message.success(res.message)
                  this.$refs[formName].resetFields();
                  for (let i in this.phoneChangeForm) {
                    this.phoneChangeForm[i] = ''
                  }
                } else {
                  this.$message.error(res.message)
                  this.btnLoading = false
                }
              }).catch(err => {
                this.btnLoading = false
                console.log(err)
              })
            }).catch(error => {
              console.log(error)
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      search () {
        this.searchRechargeRecords()
      },
      viewRemark (data) {
        this.$alert(data, '备注', {
          dangerouslyUseHTMLString: true
        }).catch(err => {})
      },
      sortTable (args) {
        if (args.order && args.prop) {
          this.listQuery.sort = args.order === 'ascending' ? `${args.prop}&asc` : `${args.prop}&desc`
        } else {
          this.listQuery.sort = ''
        }
        this.searchRechargeRecords()
      },
      reset () {
        this.listQuery = {
          page: 1,
          pageSize: 10
        }
        this.createdTime = []
        this.phoneNum = ''
        this.fullName = ''
        this.rechargeReasonId = ''
      },
      handleSizeChange (val) {
        this.listQuery.pageSize = val
        this.searchRechargeRecords()
      },
      handleCurrentChange (val) {
        this.listQuery.page = val
        this.searchRechargeRecords()
      }
    }
  }
</script>

<style lang="scss">
  .phone {
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
