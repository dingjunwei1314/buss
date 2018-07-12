<template>
  <div class="recharge">
    <el-tabs type="border-card" v-model="activeTab">
        <el-tab-pane label="为用户充值" name="one">
          <el-form ref="rechargeForm" :rules="rules" :model="rechargeForm" label-width="80px">
            <el-form-item label="用户账号" prop="phoneNum">
                <el-input size="small" v-model="rechargeForm.phoneNum"></el-input>
            </el-form-item>
            <el-form-item label="充值金额" prop="money">
                <el-input size="small" min="1"  type="number" placeholder="单位元" v-model="rechargeForm.money"></el-input>
            </el-form-item>  
            <el-form-item label="充值账户" prop="rechargeTypeId">
                <el-select size="small" clearable v-model="rechargeForm.rechargeTypeId" placeholder="请选择">
                  <el-option
                    v-for="item in rechargeTypeOptions"
                    :key="item.id"
                    :label="item.rechargeType"
                    :value="item.id">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="充值原因" prop="rechargeReasonId">
                <el-select size="small" clearable v-model="rechargeForm.rechargeReasonId" placeholder="请选择">
                  <el-option
                    v-for="item in reasonOptions"
                    :key="item.id"
                    :label="item.describe"
                    :value="item.id">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="订单号" prop="orderId">
                <el-input size="small" min="1" v-model="rechargeForm.orderId"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input size="small" placeholder="请输入备注，长度在500个字符以内" type="textarea" v-model="rechargeForm.remark"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" :loading="btnLoading" @click="recharge('rechargeForm')">确认</el-button>
            </el-form-item>
          </el-form>
      </el-tab-pane>
      <el-tab-pane label="充值记录" name="two">
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
                <label for="">账号 ：</label>
                <el-input class="filter-box" v-model="phoneNum" size="small" @keyup.enter.native="search"></el-input>
            </div>

            <div class="filter-item">
                <label for="">充值原因 ：</label>
                <el-select size="small" clearable class="filter-box" v-model="rechargeReasonId" placeholder="请选择">
                  <el-option
                    v-for="item in reasonOptions"
                    :key="item.id"
                    :label="item.describe"
                    :value="item.id">
                  </el-option>
                </el-select>
            </div>

            <div class="filter-item">
                <label for="">充值账户 ：</label>
                <el-select size="small" clearable class="filter-box" v-model="rechargeTypeId" placeholder="请选择">
                  <el-option
                    v-for="item in rechargeTypeOptions"
                    :key="item.id"
                    :label="item.rechargeType"
                    :value="item.id">
                  </el-option>
                </el-select>
            </div>
            
            <div class="search-button inline-block">
                <el-button type="primary" size="small" @click="search">查询</el-button>
                <el-button type="ghost" size="small" style="margin-left: 8px" @click="reset">重置</el-button>
            </div>
            </div>


        <el-table :data="list" highlight-current-row border :stripe="true" v-loading="listLoading" style="width: 100%;" class="filter-box" :header-row-style="{backgroundColor: '#f6f6f6'}" @sort-change="sortTable">
           
            <el-table-column align="center" label="账号" width="113"  prop="careateTime">
                <template slot-scope="scope">
                <span>{{ scope.row.phoneNum }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="姓名" width="90"  prop="city_code">
                <template slot-scope="scope">
                <span>{{ scope.row.fullName }}</span>
                </template>
            </el-table-column>      
            <el-table-column align="center" label="充值金额（元）" width="120"  prop="stype">
                <template slot-scope="scope">
                <span>{{ scope.row.money/100 }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="充值原因" width="150">
                <template slot-scope="scope">
                <span>{{ scope.row.describe }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="充值账户" width="150">
                <template slot-scope="scope">
                <span>{{ scope.row.rechargeType }}</span>
                </template>
            </el-table-column>
            <el-table-column  align="center" label="时间" min-width="100">
                <template slot-scope="scope">
                <span>{{ scope.row.careateTime }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作人" width="90">
                <template slot-scope="scope">
                <span>{{ scope.row.sysUserId }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="备注" min-width="180">
                <template slot-scope="scope">
                  <el-button type="text" style="white-space:pre-wrap" size="small" @click="viewRemark(scope.row.remark)">
                    <p style="width: 180px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                      {{ scope.row.remark.slice(0,20) }}
                    </p>
                  </el-button>
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
        </el-tab-pane>
      </el-tabs>

  </div>
</template>
<script>
  import { recharge, searchRechargeRecords, getUser } from '@/api'
  import moment from 'moment'
  import hasPermission from '@/utils/checkPermissions'
  // import { funcCode } from '@/utils/permissionMap'
  import { getUserId } from '@/utils/auth'
  export default {
    data () {
      var checkMobile = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'))
        }
        var reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
        if (!reg.test(value)) {
          return callback(new Error('手机号格式错误'))
        }
        callback()
      }
      var checkMoney = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('充值金额不能为空'))
        }
        if (value <= 0 || value > 9999.99) {
          return callback(new Error('充值金额不能为负数且不大于9999.99'))
        }
        if (!Number.isInteger(Number(value))) {
          if (value.toString().split(".")[1].length > 2) {
            return callback(new Error('充值金额精确到分'))
          }
        }
        callback()
      } 
      var checkOrderId = (rule, value, callback) => {
        if (value === '') {
          return callback()
        }
        if (value.length > 20) {
          return callback(new Error('订单号最多20位'))
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
          phoneNum: [
            {validator: checkMobile, trigger: 'change', required: true}
          ],
          money: [
            {required: true, trigger: 'change', validator: checkMoney}
          ],
          rechargeTypeId: [
            {required: true, message: '充值账户不能为空', trigger: 'change'}
          ],
          remark: [
            {max: 500, message: '长度在 500 个字符以内', trigger: 'change'}
          ],
          orderId:[
            {trigger:'change',validator: checkOrderId}
          ]
        },
        rechargeForm: {
          phoneNum: '',
          money: '',
          remark: '',
          rechargeReasonId: '',
          rechargeTypeId: '',
          sysUserId: '',
          orderId: ''
        },
        reasonOptions: [],
        rechargeTypeOptions: [],
        createdTime: [],
        fullName: '',
        phoneNum: '',
        rechargeReasonId: '',
        rechargeTypeId: '',
        funcCode: {}
      }
    },
    created () {
      this.searchRechargeRecords()
      this.$store.dispatch('SetRechargeReason').then(res => {
        this.reasonOptions = res
      })
      this.$store.dispatch('SetRechargeType').then(res => {
        this.rechargeTypeOptions = res
      })  
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
          } else {
            this.$message.error(res.message)
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
        this.listQuery.rechargeTypeId = this.rechargeTypeId
        this.listQuery.income = 1
      },
      recharge (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('确认充值吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.btnLoading = true
              const formData = {
                phoneNum: this.rechargeForm.phoneNum,
                money: Math.ceil(this.rechargeForm.money*100),
                remark: this.rechargeForm.remark,
                rechargeReasonId: this.rechargeForm.rechargeReasonId,
                rechargeTypeId: this.rechargeForm.rechargeTypeId,
                sysUserId: getUserId(),
                orderId: this.rechargeForm.orderId,
                income: 1
              }
              recharge(formData).then(res => {
                if (res.status === 200) {
                  this.btnLoading = false
                  this.$message.success(res.message)
                  this.searchRechargeRecords()
                  this.$refs[formName].resetFields()
                  for (let i in this.rechargeForm) {
                    this.rechargeForm[i] = ''
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
        this.rechargeTypeId = ''
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
  .recharge {
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
