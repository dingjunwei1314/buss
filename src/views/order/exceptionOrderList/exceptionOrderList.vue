<template>
  <div>

    <div v-if="$route.query.orderId">
      <exception-order-detail :orderid="$route.query.orderId"></exception-order-detail>
    </div>

    <div v-else>
      <div class="table-filter">
        <div class="filter-item" v-if="isContainInList('下单时间')">
          <label for="">下单时间</label>
          <el-date-picker name="" v-model.trim="when_order_begin" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </div>
        <div class="filter-item" v-if="isContainInList('还车时间')">
          <label for="">还车时间</label>
          <el-date-picker name="" v-model.trim="when_car_return" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </div>
        <div class="filter-item" v-if="isContainInList('结算时间')">
          <label for="">结算时间</label>
          <el-date-picker name="" v-model.trim="when_order_finish" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </div>
        <div class="filter-item" v-if="isContainInList('取消时间')">
          <label for="">取消时间</label>
          <el-date-picker name="" v-model.trim="when_order_cancel" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </div>
        <div class="filter-item" v-if="isContainInList('转入时间')">
          <label for="">转入时间</label>
          <el-date-picker name="" v-model.trim="when_exception_switch_in" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </div>
        <div class="filter-item" v-if="isContainInList('处理完成时间')">
          <label for="">处理完成时间</label>
          <el-date-picker name="" v-model.trim="when_exception_close" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </div>

        <div class="filter-item" v-if="isContainInList('车辆ID')">
          <label for="">车辆ID：</label>
          <el-input class="filter-box" v-model.trim="car_id" size="small" @keyup.enter.native="search"></el-input>
        </div>

        <div class="filter-item" v-if="isContainInList('订单号')">
          <label for="">订单号：</label>
          <el-input class="filter-box" v-model.trim="order_num" size="small" @keyup.enter.native="search"></el-input>
        </div>

        <div class="filter-item" v-if="isContainInList('手机号')">
          <label for="">手机号：</label>
          <el-input class="filter-box" v-model.trim="phone_num" size="small" @keyup.enter.native="search"></el-input>
        </div>

        <!-- <div class="filter-item" v-if="isContainInList('姓名')">
          <label for="">姓名：</label>
          <el-input class="filter-box" v-model.trim="name" size="small" @keyup.enter.native="search"></el-input>
        </div> -->

        <div class="search-button inline-block">
          <el-button type="primary" size="small" @click="search">查询</el-button>
          <el-button type="ghost" size="small" style="margin-left: 8px" @click="reset">重置</el-button>
        </div>
      </div>

      <div class="func-btn row-flex">
        <el-button type="primary" size="small" @click="exportData($event)">导出当前列表</el-button>
        <p style="color:#1c2438;font-size:12px;padding-left:10px">注：导出功能仅支持最多前2w条数据</p>
        <div style="flex:1"></div>
        <span style="margin-right:200px"> 订单总数 ：{{ orderTotalAmount }}</span>
      </div>

      <!-- TODO: -->
      <my-table :data="exceptionOrderList" :col-configs="colConfigs" :child-list-loading.sync="listLoading" />

      <!-- TODO: -->
      <div style="display:flex;flex-direction:row;align-items:center;margin-top:2vh">
        <div>每页显示条数：</div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page_num" :page-sizes="[20, 30, 50]" :page-size="page_size" layout="sizes, prev, pager, next" :total="orderTotalAmount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import myTable from '@/components/myTable.vue'
import format from 'date-fns/format'
import * as R from 'ramda'
import { PREFIX } from '@/config/app'
import { getExceptionOrderList, getUserInfoCommon , exportExceptionOrderList } from '@/api'
import exceptionOrderDetail from './exceptionOrderDetail'
import { parseTime } from '@/utils'
import md5 from '@/utils/md5'
import { mapState } from 'vuex'
import funcBtn_two from './exception_funcbtn'

const memoDetail = {
  props: ['colConfig'],
  template: `
    <el-table-column :label="colConfig.label" min-width="200" align="center" >
      <div slot-scope="{ row }">
        <el-button type="text" size="medium" @click.native="showDetail(row)" v-if="row.exception_remarks.length > 8">{{ row.exception_remarks.slice(0,8) }}...</el-button>
        <el-button type="text" size="medium" @click.native="showDetail(row)" v-else>{{ row.exception_remarks }}</el-button>
      </div>
    </el-table-column>
  `,
  methods:{
    showDetail(val){
      this.$alert(val.exception_remarks
      // ,{ title: '订单：' + val.order_num }
      )
    }
  }
}

const funcBtn_one = {
  props: ['colConfig'],
  template: `
    <el-table-column :label="colConfig.label" min-width="80" align="center">
      <el-button  slot-scope="{ row }" type="text" size="medium" @click.native="$router.push({ name:'exceptionOrderList' , query: { orderId : row.order_id }})">查看</el-button>
    </el-table-column>
  `,
}

// TODO:

export default {
  components: { myTable, exceptionOrderDetail },
  props: ['flag','reload'],
  data() {
    return {
      exceptionOrderList: [],
      // 筛选输入框 >>> 属性
      when_order_begin: [],
      when_car_return: [],
      when_order_finish: [],
      when_order_cancel: [],
      why_cancel_order: '',
      when_exception_switch_in: [],
      when_exception_close: [],

      car_id: '',
      order_num: '',
      account: '',
      name: '',
      listLoading: '',
      phone_num_to_uid: '',
      phone_num: '',
      // 筛选输入框 >>> 选择性显示条目
      filterTable: {
        0: [
          '下单时间',
          '还车时间',
          '结算时间',
          '转入时间',
          '车辆ID',
          '订单号',
          '手机号',
          '姓名',
        ],
        20: ['转入时间', '处理完成时间', '车辆ID', '订单号', '手机号', '姓名'],
      },

      // 订单属性 相关
      orderTotalAmount: 0,
      page_size: 20,
      page_num: 1,
      mapToConfig: {
        0: [
          '序号',
          '手机号',
          '姓名',
          '订单号',
          '车辆ID',
          '订单状态',
          '下单时间',
          '还车时间',
          '结算时间',
          '转入时间',
          '当前异常备注',
          '操作2',
        ],
        20: [
          '序号',
          '手机号',
          '姓名',
          '订单号',
          '车辆ID',
          '订单状态',
          '转入时间',
          '处理完成时间',
          '当前异常备注',
          '操作1',
        ],
      },
      colConfigTable: {
        序号: { prop: 'num', label: '序号', align: 'center', width: '60' },
        手机号: {
          prop: 'phone_num',
          label: '手机号',
          align: 'center',
          'min-width': '120',
        },
        姓名: { prop: 'name', label: '姓名', align: 'center', 'min-width': '90' },
        用户ID: { prop: 'uid', label: '用户ID', align: 'center', 'min-width': '90' },
        订单号: {
          prop: 'order_num',
          label: '订单号',
          align: 'center',
          'min-width': '190',
        },
        订单状态: {
          prop: 'order_status',
          label: '订单状态',
          align: 'center',
          'min-width': '90',
        },
        车辆ID: {
          prop: 'car_id',
          label: '车辆ID',
          align: 'center',
          'min-width': '90',
        },
        下单地址: {
          prop: 'where_car_rent',
          label: '下单地址',
          align: 'center',
          'min-width': '200',
        },
        还车地址: {
          prop: 'where_car_return',
          label: '还车地址',
          align: 'center',
          'min-width': '200',
        },
        还车备注: {
          prop: 'return_car_memo',
          label: '还车备注',
          align: 'center',
          'min-width': '200',
        },
        下单时间: {
          prop: 'when_order_begin',
          label: '下单时间',
          align: 'center',
          width: '130',
          sortable: 'custom',
        },
        取车时间: {
          prop: 'when_car_rent',
          label: '取车时间',
          align: 'center',
          width: '130',
          sortable: 'custom',
        },
        还车时间: {
          prop: 'when_car_return',
          label: '还车时间',
          align: 'center',
          width: '130',
          sortable: 'custom',
        },
        结算时间: {
          prop: 'when_order_finish',
          label: '结算时间',
          align: 'center',
          width: '130',
          sortable: 'custom',
        },
        处理完成时间: {
          prop: 'when_exception_close',
          label: '处理完成时间',
          width: '130',
          align: 'center',
        },
        '车费合计（元）': {
          prop: 'total_account',
          label: '车费合计（元）',
          align: 'center',
          'min-width': '90',
        },
        '实付金额（元）': {
          prop: 'actually_pay',
          label: '实付金额',
          align: 'center',
          'min-width': '90',
        },
        是否免赔: {
          prop: 'isGuaranteed',
          label: '是否免赔',
          align: 'center',
          'min-width': '120',
        },
        // 操作: {prop: "operation",label: "操作",align: "center",'min-width': "90", component: funcBtn, },
        操作1: {
          prop: 'operation',
          label: '操作',
          align: 'center',
          'min-width': '90',
          component: funcBtn_one,
        },
        操作2: {
          prop: 'operation',
          label: '操作',
          align: 'center',
          'min-width': '90',
          component: funcBtn_two,
        },
        取消类型: {
          prop: 'cancelType',
          label: '取消类型',
          align: 'center',
          'min-width': '120',
        },
        转入时间: {
          prop: 'when_exception_switch_in',
          label: '转入时间',
          align: 'center',
          width: '130',
        },
        当前异常备注: {
          prop: 'exception_memo',
          label: '当前异常备注',
          align: 'center',
          'min-width': '200',
          component: memoDetail,
        },
      },
      rawList: [],
    }
  },
  computed: {
    filterList() {
      return this.filterTable[this.flag.toString()]
    },
    colConfigs() {
      return this.mapToConfig[this.flag.toString()].map(
        x => this.colConfigTable[x]
      )
    },
    ...mapState({
      counter: state => state.action.counter
    })
  },
  methods: {
    exportData(e) {
      // 导出
      let orderListQuery = {
        status: this.flag, // 根据标签页的选择来决定fetch的类型
        userId: this.uid,
        carId: this.car_id,
        orderNum: this.order_num,
        pageSize: 20000,//TODO:目前是写死状态

        orderTime: this.when_order_begin[0] ? format(this.when_order_begin[0] , 'YYYY-MM-DD') + ' 00:00:00' : "",
        orderTimeEnd: this.when_order_begin[1] ? format(this.when_order_begin[1] , 'YYYY-MM-DD') + ' 23:59:59' : "",
        endBillingTime: this.when_car_return[0] ? format(this.when_car_return[0] , 'YYYY-MM-DD') + ' 00:00:00' : "",
        endBillingTimeEnd: this.when_car_return[1] ? format(this.when_car_return[1] , 'YYYY-MM-DD') + ' 23:59:59' : "",
        finishTime: this.when_order_finish[0] ? format(this.when_order_finish[0] , 'YYYY-MM-DD') + ' 00:00:00' : "",
        finishTimeEnd: this.when_order_finish[1] ? format(this.when_order_finish[1] , 'YYYY-MM-DD') + ' 23:59:59' : "",
        exceptionCreateTime: this.when_exception_switch_in[0] ? format(this.when_exception_switch_in[0] , 'YYYY-MM-DD') + ' 00:00:00' : "",
        exceptionCreateTimeEnd: this.when_exception_switch_in[1] ? format(this.when_exception_switch_in[1] , 'YYYY-MM-DD') + ' 23:59:59' : "",
        exceptionFinishTime: this.when_exception_close[0] ? format(this.when_exception_close[0] , 'YYYY-MM-DD') + ' 00:00:00' : "",
        exceptionFinishTimeEnd: this.when_exception_close[1] ? format(this.when_exception_close[1] , 'YYYY-MM-DD') + ' 23:59:59' : "",
      }

      if(this.orderTotalAmount > 20000){
        this.$message.warning('导出成功，一次最多可以导出2万条数据');
      }
      var mypage = window.open();
      mypage.document.write('数据生成中，请稍后...')
      exportExceptionOrderList(orderListQuery).then(res => {
        if(res.status === 200){
          if (res.attachment) {
            mypage.location.href = res.attachment;
            setTimeout(() => {
              mypage.close();
            }, 1000);
          } else {
            this.$message.error('调起接口失败')
          }
        } else {
          this.$message.error('调起接口失败')
        }
      })
      
    },
    handleSizeChange(val) {
      this.page_size = val
      this.getExceptionOrderList()
    },
    handleCurrentChange(val) {
      this.page_num = val
      this.getExceptionOrderList()
    },
    search() {
      this.getExceptionOrderList()
    },
    reset() {
      this.when_order_begin = []
      this.when_car_return = []
      this.when_order_finish = []
      this.when_order_cancel = []
      this.why_cancel_order = ''
      this.when_exception_switch_in = []
      this.when_exception_close = []
      this.car_id = ''
      this.phone_num_to_uid = ''
      this.order_num = ''
      this.phone_num = ''
      this.name = ''
      this.listLoading = ''

    },
    isContainInList(val) {
      return R.contains(val, this.filterList)
    },
    async getExceptionOrderList() {
      this.listLoading = true

      let time = new Date().getTime().toString()
      let timestamp = time.slice(0, -3)
      let sign = md5('incar' + time.slice(0, -3))

      if (this.phone_num) {
        await getUserInfoCommon({
          phoneNum: this.phone_num,
          timestamp: timestamp,
          sign: sign,
        }).then(res => {
          if (res.attachment) {
            this.phone_num_to_uid = res.attachment[0].userId
          }
          // console.log(JSON.stringify(res, null, 2))
        })
      }

      let exception_query = {
        status: this.flag, // 根据标签页的选择来决定fetch的类型
        userId: this.phone_num_to_uid,
        carId: this.car_id,
        orderNum: this.order_num,
        pageNum: this.page_num,
        pageSize: this.page_size,

        orderTime: this.when_order_begin[0] ? format(this.when_order_begin[0] , 'YYYY-MM-DD') + ' 00:00:00' : "",
        orderTimeEnd: this.when_order_begin[1] ? format(this.when_order_begin[1] , 'YYYY-MM-DD') + ' 23:59:59' : "",
        endBillingTime: this.when_car_return[0] ? format(this.when_car_return[0] , 'YYYY-MM-DD') + ' 00:00:00' : "",
        endBillingTimeEnd: this.when_car_return[1] ? format(this.when_car_return[1] , 'YYYY-MM-DD') + ' 23:59:59' : "",
        finishTime: this.when_order_finish[0] ? format(this.when_order_finish[0] , 'YYYY-MM-DD') + ' 00:00:00' : "",
        finishTimeEnd: this.when_order_finish[1] ? format(this.when_order_finish[1] , 'YYYY-MM-DD') + ' 23:59:59' : "",
        exceptionCreateTime: this.when_exception_switch_in[0] ? format(this.when_exception_switch_in[0] , 'YYYY-MM-DD') + ' 00:00:00' : "",
        exceptionCreateTimeEnd: this.when_exception_switch_in[1] ? format(this.when_exception_switch_in[1] , 'YYYY-MM-DD') + ' 23:59:59' : "",
        exceptionFinishTime: this.when_exception_close[0] ? format(this.when_exception_close[0] , 'YYYY-MM-DD') + ' 00:00:00' : "",
        exceptionFinishTimeEnd: this.when_exception_close[1] ? format(this.when_exception_close[1] , 'YYYY-MM-DD') + ' 23:59:59' : "",
      }

      getExceptionOrderList(exception_query).then(res => {
        if (res.status === 200) {
          if (this.phone_num && !this.phone_num_to_uid) {
            this.rawList = []
            this.orderTotalAmount = 0
            this.listLoading = false
          } else {
            this.orderTotalAmount = res.attachment.total
            // this.rawList = res.attachment.list;
            const List = res.attachment.list
            let userIdList = res.attachment.list.map(x => {
              return x.userId
            })
            // console.log(userIdList);
            if (userIdList.length > 0) {
              let time = new Date().getTime().toString()
              let timestamp = time.slice(0, -3)
              let sign = md5('incar' + time.slice(0, -3))
              getUserInfoCommon({
                userId: userIdList.join(','),
                timestamp: timestamp,
                sign: sign,
              }).then(res => {
                if (res.attachment.length > 0) {
                  let userInfoList = res.attachment
                  this.rawList = [].concat(
                    R.map(x => {
                      if (userInfoList.length) {
                        if (userInfoList.length === 1) {
                          if (x.userId == userInfoList[0].userId) {
                            x.phone_num = userInfoList[0].phoneNum || '-'
                            x.name = userInfoList[0].fullName || '-'
                            return x
                          } else {
                            return x
                          }
                        } else if (userInfoList.length > 1) {
                          for (let item of userInfoList) {
                            if (x.userId == item.userId) {
                              x.phone_num = item.phoneNum
                              x.name = item.fullName
                              return x
                            }
                          }
                          return x
                        }
                      } else {
                        return x
                      }
                    })(List)
                  )
                } else {
                  this.rawList = List
                }
              })
              this.listLoading = false
            } else {
              this.rawList = []
              this.listLoading = false
            }
          }
        } else {
          this.$message.error('获取异常列表失败')
        }
      })
    },
  },
  created() {
    if (this.reload){
      this.$route.query.orderId = ''
    }
    if (this.$route.query.orderId) {
      return
    }
    this.getExceptionOrderList()
  },
  watch: {
    rawList: function(val) {
      this.exceptionOrderList = val.map((x, index) => {
        return {
          phone_num: x.phone_num ? x.phone_num : '', 
          name: x.name ? x.name : '',
          num: this.page_size * (this.page_num - 1) + index + 1,
          uid: x.userId || '',
          // exception_order_id: x.exceptionOrderId || '',
          operator_id: x.operator,
          order_id: x.id || '',
          order_num: x.orderNum || '',
          order_status: x.exceptionStatus === 0 ? '待处理' : '已处理', // (0待处理20已处理)
          status: x.status || '',
          car_id: x.carId || '',
          where_car_rent: x.onLocationName || '',
          where_car_return: x.downLocationName || '',
          return_car_memo: x.remarks || '',
          when_order_begin: 
            x.orderTime > 0 ? format(
              x.orderTime || '',
              'YYYY年MM月DD日 HH:mm:ss'
            ) : '',
          when_car_rent: 
            x.startBillingTime > 0 ? format(
              x.startBillingTime || '',
              'YYYY年MM月DD日 HH:mm:ss'
            ) : '',
          when_car_return: 
            x.endBillingTime > 0 ? format(
              x.endBillingTime || '',
              'YYYY年MM月DD日 HH:mm:ss'
            ) : '',
          when_order_finish: 
            x.finishTime > 0 ? format(
              x.finishTime || '',
              'YYYY年MM月DD日 HH:mm:ss'
            ) : '',
          total_account: x.orderPrice,
          actually_pay: x.realPrice/100,
          isGuaranteed: x.isAbatement,
          exception_memo: x.exceptionRemarks || '',
          exception_status: x.exceptionStatus ,
          exception_situation: x.exceptionSituation,
          exception_remarks: x.exceptionRemarks || '',
          exception_id: x.exceptionOrderId,
          when_exception_switch_in: 
            x.exceptionCreateTime > 0 ? format(
              x.exceptionCreateTime || '',
              'YYYY年MM月DD日 HH:mm:ss'
            ) : '',
          when_exception_close: 
            x.exceptionFinishTime > 0 ? format(
              x.exceptionFinishTime || '',
              'YYYY年MM月DD日 HH:mm:ss'
            ) : '',
        }
      })
    },
    '$route.query.orderId': function(val){
      this.getExceptionOrderList();
    },
    counter (val) {
      this.getExceptionOrderList();
    }
  },
}
</script>

<style>
.el-input.is-disabled .el-input__inner {
  background-color: #fff;
  border-color: #e4e7ed;
  color: #000;
  font-size: 15px;
  cursor: auto;
}

.row-flex {
  display:flex;
  align-items:center;
}
</style>

