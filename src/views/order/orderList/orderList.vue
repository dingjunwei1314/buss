<template>
  <div>
    <div v-if="$route.query.orderId">
      <order-detail :orderid="$route.query.orderId"></order-detail>
    </div>

    <div v-else>
      <div class="table-filter">
        
        <div class="filter-item" v-if="isContainInList('下单时间')">
          <label for="">下单时间</label>
          <el-date-picker name="" v-model.trim="when_order_begin" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </div>

        <div class="filter-item" v-if="isContainInList('取车时间')">
          <label for="">取车时间</label>
          <el-date-picker name="" v-model.trim="when_car_rent" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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

        <div class="filter-item" v-if="isContainInList('取消类型')">
          <label for="ticket-status">取消类型：</label>
          <el-select name="ticket-status" v-model.trim="why_cancel_order" size="small" filterable clearable placeholder="取消类型" class="filter-box">
            <el-option v-for="item in cancelStatusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>

        <div class="filter-item">
          <label for="">车辆ID：</label>
          <el-input class="filter-box" v-model.trim="car_id" size="small" @keyup.enter.native="search"></el-input>
        </div>

        <div class="filter-item">
          <label for="">订单号：</label>
          <el-input class="filter-box" v-model.trim="order_num" size="small" @keyup.enter.native="search"></el-input>
        </div>

        <div class="filter-item">
          <label for="">手机号：</label>
          <el-input class="filter-box" v-model.trim="phone_num" size="small" @keyup.enter.native="search"></el-input>
        </div>

        <!-- <div class="filter-item">
          <label for="">姓名</label>
          <el-input class="filter-box" v-model.trim="name" size="small" @keyup.enter.native="search"></el-input>
        </div> -->

        <div class="filter-item">
          <label for="">用户ID</label>
          <el-input class="filter-box" v-model.trim="uid" size="small" @keyup.enter.native="search"></el-input>
        </div>

        <!-- TODO: -->
        <div class="search-button inline-block">
          <el-button type="primary" size="small" @click="search">查询</el-button>
          <el-button type="ghost" size="small" style="margin-left: 8px" @click="reset">重置</el-button>
        </div>
      </div>

      <div>
        <div class="func-btn btn-right">
          <!-- <el-button v-if="hasPermission(funcCode.couponExport)" type="primary" size="small" @click="exportData($event)">导出当前列表</el-button> -->
          <el-button type="primary" size="small" @click="exportData($event)">导出当前列表</el-button>
          <p style="color:#1c2438;font-size:12px;padding-left:10px">注：导出功能仅支持最多前2w条数据</p>
          <div style="flex:1"></div>
          <div style="margin-right:200px">订单总数 ： {{ orderTotalAmount }} </div>
        </div>

        <my-table :data="orderList" :col-configs="colConfigs" :child-list-loading.sync="listLoading" @child-sort-change="sortTable" />

        <div class="row-flex" >
          <div>每页显示条数：</div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page_num" :page-sizes="[20, 30, 50]" :page-size="page_size" layout="sizes, prev, pager, next" :total="orderTotalAmount">
          </el-pagination>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import myTable from '@/components/myTable.vue'
import format from 'date-fns/format'
import { parseTime } from '@/utils'
import * as R from 'ramda'
import { getOrderList, getUserInfoCommon, switchToException , exportOrderList } from '@/api'
import md5 from '@/utils/md5'
import orderDetail from './orderDetail'
import { PREFIX } from '@/config/app'
import { mapState } from 'vuex'

const memoDetail = {
  props: ['colConfig'],
  template: `
    <el-table-column :label="colConfig.label" min-width="200" align="center" >
      <div slot-scope="{ row }">
        <el-button type="text" size="medium" @click.native="showDetail(row)" v-if="row.order_remark.length > 8">{{ row.order_remark.slice(0,8) }}...</el-button>
        <el-button type="text" size="medium" @click.native="showDetail(row)" v-else>{{ row.order_remark }}</el-button>
      </div>
    </el-table-column>
  `,
  methods:{
    showDetail(val){
      this.$alert(val.order_remark
      // ,{ title: '订单：' + val.order_num }
      )
    }
  }
}

const funcBtn = {
  props: ['colConfig'],
  template: `
    <el-table-column :label="colConfig.label" min-width="180">
      <div slot-scope="{ row }" style="display:flex;">
        <el-button  type="text" size="medium" @click.native="jumpToDetail(row.order_id)">查看</el-button>
        <el-button type="text" size="medium" @click="turnToException(row.order_id,row.order_num,row.operator_id)">转入异常</el-button>
      <el-dialog
        title="确认转入异常订单处理？"
        :visible.sync="dialogShow_switch_in"
        width="30%"
        center>
        <div>
          <span>异常情况选择：</span>
          <el-select v-model="exception_condition" placeholder="请选择" size="small">
            <el-option
              v-for="item in exceptionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="margin-top:4px">
          <span>异常备注（非必填）：</span>
          <el-input
            type="textarea"
            :rows="3"
            :autosize="{ minRows: 3, maxRows: 6}"
            placeholder="请输入内容"
            size="small"
            v-model="exception_memo">
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submit">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </span>
      </el-dialog>
      </div>
    </el-table-column>
  `,
  data() {
    return {
      dialogShow_switch_in: false,
      exception_condition: null,
      exceptionOptions: [
        {
          label: '车辆失联',
          value: 0,
        },
        {
          label: '道路救援',
          value: 1,
        },
        {
          label: '结算错误',
          value: 2,
        },
        {
          label: '取消频繁',
          value: 3,
        },
        {
          label: '停滞过久',
          value: 4,
        },
        {
          label: '超出围栏',
          value: 5,
        },
        {
          label: '严重投诉',
          value: 6,
        },
        {
          label: '无法还车',
          value: 7,
        },
        {
          label: '无法结算',
          value: 8,
        },
        {
          label: '非法移动',
          value: 9,
        },
        {
          label: '其他',
          value: 10,
        },
      ],
      exception_memo: '',
      orderId: '',
      orderNum: '',
      operatorId: '',
    }
  },
  methods: {
    cancel() {
      ;(this.exception_memo = ''),
        (this.orderId = ''),
        (this.orderNum = ''),
        (this.operatorId = ''),
        (this.exception_condition = null),
        (this.dialogShow_switch_in = false)
    },
    submit() {
      if (this.exception_memo.length > 460) {
        this.$message.error('备注字数不能大于450字，请整理后重试')
        return
      }

      if (this.exception_condition === null) {
        this.$message.error('异常情况未选择')
        return
      }

      const params = {
        operatorId: this.operatorId,
        orderId: this.orderId,
        orderNum: this.orderNum,
        exceptionSituation: this.exception_condition,
        exceptionReason: '转入异常：' + this.exception_memo,
      }
      switchToException(params).then(res => {
        if (res.status === 200) {
          this.$message.success(res.message);
          this.exception_memo = '';
          this.orderId = '';
          this.orderNum = '';
          this.operatorId = '';
          this.exception_condition = null;
          this.dialogShow_switch_in = false;
          this.$store.dispatch('triggerRefresh');
        } else {
          this.$message.error(res.message)
        }
      })
    },
    turnToException(order_id, order_num, operator_id) {
      this.orderId = order_id
      this.orderNum = order_num
      this.operatorId = operator_id
      this.dialogShow_switch_in = true
    },
    jumpToDetail(val){
      // this.reload = false;
      this.$router.push({ name:'orderList' , query: { orderId : val }});
    }
  },
}

export default {
  components: { myTable, orderDetail },
  props: ['flag','reload'],
  data() {
    return {
      when_order_begin: [],
      when_car_rent: [],
      when_car_return: [],
      when_order_finish: [],
      when_order_cancel: [],
      why_cancel_order: '',
      uid: '',
      order_id: '',
      order_num: '',
      car_id: '',
      phone_num: '',
      phone_num_to_uid:'',
      name: '',
      name_to_uid: '',
      orderTotalAmount: 0,
      page_size: 20,
      page_num: 1,
      cancelStatusOptions: [
        {
          label: '手动取消',
          value: 102,
        },
        {
          label: '自动取消',
          value: 103,
        },
      ],
      exceptionOptions: [
        {
          label: '车辆失联',
          value: '1',
        },
        {
          label: '道路救援',
          value: '12',
        },
        {
          label: '结算错误',
          value: '13',
        },
        {
          label: '取消频繁',
          value: '14',
        },
        {
          label: '停滞过久',
          value: '15',
        },
        {
          label: '超出围栏',
          value: '16',
        },
        {
          label: '严重投诉',
          value: '17',
        },
        {
          label: '无法还车',
          value: '18',
        },
        {
          label: '无法结算',
          value: '19',
        },
        {
          label: '非法移动',
          value: '110',
        },
        {
          label: '其他',
          value: '111',
        },
      ],

      listLoading: false,
      dialogShow_switch_in: false,

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
          'min-width': '120',
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
        订单备注: {
          prop: 'order_remark',
          label: '订单备注',
          align: 'center',
          'min-width': '200',
          // slot $alert(message, options)
          component: memoDetail,
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
          label: '实付金额（元）',
          align: 'center',
          'min-width': '90',
        },
        是否免赔: {
          prop: 'isGuaranteed',
          label: '是否免赔',
          align: 'center',
          'min-width': '120',
        },
        操作: {
          prop: 'operation',
          label: '操作',
          align: 'center',
          'min-width': '90',
          component: funcBtn,
        },
        // 操作1: { prop: 'operation', label: '操作', align: 'center', 'min-width': '90', component: funcBtn_one, },
        // 操作2: { prop: 'operation', label: '操作', align: 'center', 'min-width': '90', component: funcBtn_two, },
        取消类型: {
          prop: 'cancel_type',
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
      },

      filterDateTable: [
        // "下单时间","取车时间","还车时间","结算时间","车辆ID","订单号","账号","姓名","用户ID"
        ['下单时间', '取车时间', '还车时间', '结算时间'],
        ['下单时间'],
        ['下单时间', '取车时间'],
        ['下单时间', '取车时间', '还车时间'],
        ['下单时间', '取车时间', '还车时间', '结算时间'],
        ['下单时间', '取消时间', '取消类型'],
      ],
      rawList: [],
      mapToConfig: [
        [
          '序号',
          '手机号',
          '姓名',
          '用户ID',
          '订单号',
          '订单状态',
          '订单备注',
          '车辆ID',
          '下单地址',
          '还车地址',
          '下单时间',
          '取车时间',
          '还车时间',
          '结算时间',
          '车费合计（元）',
          '实付金额（元）',
          '操作',
        ],
        [
          '序号',
          '手机号',
          '姓名',
          '用户ID',
          '订单号',
          '车辆ID',
          '下单地址',
          '下单时间',
          '操作',
        ],
        [
          '序号',
          '手机号',
          '姓名',
          '用户ID',
          '订单号',
          '车辆ID',
          '下单地址',
          '下单时间',
          '取车时间',
          '操作',
        ],
        [
          '序号',
          '手机号',
          '姓名',
          '用户ID',
          '订单号',
          '订单备注',
          '车辆ID',
          '下单地址',
          '还车地址',
          '下单时间',
          '取车时间',
          '还车时间',
          '车费合计（元）',
          '操作',
        ],
        [
          '序号',
          '手机号',
          '姓名',
          '用户ID',
          '订单号',
          '订单备注',
          '车辆ID',
          '下单地址',
          '还车地址',
          '下单时间',
          '取车时间',
          '还车时间',
          '结算时间',
          '车费合计（元）',
          '实付金额（元）',
          '操作',
        ],
        [
          '序号',
          '手机号',
          '姓名',
          '用户ID',
          '订单号',
          '取消类型',
          '车辆ID',
          '下单地址',
          '下单时间',
          '取车时间',
          '操作',
        ],
      ]
    }
  },
  computed: {
    filterList() {
      return this.filterDateTable[this.flag]
    },
    colConfigs() {
      return this.mapToConfig[this.flag].map(x => this.colConfigTable[x])
    },
    orderList() {
      return this.rawList.map((x, index) => {
        let outputList = {
          phone_num: x.phone_num ? x.phone_num : '', //TODO:
          name: x.name ? x.name : '',
          num: this.page_size * (this.page_num - 1) + index + 1,
          uid: x.userId || '',
          order_id: x.id || '',
          order_num: x.orderNum || '',
          order_status: R.cond([
            [R.equals(0),() => '预约未用车'],
            [R.equals(10),() => '订单进行中'],
            [R.equals(15),() => '还车待结算'],
            [R.equals(101),() => '正常支付完成'],
            [R.equals(102),() => '手动取消完成'],
            [R.equals(103),() => '自动取消完成'],
            [R.equals(104),() => '客服取消完成'],
            [R.equals(105),() => '汽车订单异常完成'],
            [R.equals(106),() => '单车订单异常']
          ])(+x.status), // 状态:0 预约未取车; 10 订单进行中; 15 还车待结算; 101 正常支付完成; 102手动取消完成; 103 自动取消完成; 104 客服取消完成; 105 汽车订单异常;106 单车订单异常
          car_id: x.carId || '',
          where_car_rent: x.onLocationName || '', //TODO: 下单地址？下单地址？
          where_car_return: x.downLocationName || '',
          order_remark: x.remarks || '',
          when_order_begin: x.orderTime > 0 ? format(
            x.orderTime ,
            'YYYY年MM月DD日 HH:mm:ss'
          ) : '',
          when_car_rent: x.startBillingTime > 0 ? format(
            x.startBillingTime ,
            'YYYY年MM月DD日 HH:mm:ss'
          ) : '',
          when_car_return: x.endBillingTime > 0 ? format(
            x.endBillingTime ,
            'YYYY年MM月DD日 HH:mm:ss'
          ) : '',
          when_order_finish: x.finishTime > 0 ? format(
            x.finishTime ,
            'YYYY年MM月DD日 HH:mm:ss'
          ) : '',
          total_account: x.orderPrice/100 === NaN ? 0 : x.orderPrice/100,
          actually_pay: x.realPrice/100 === NaN ? 0 : x.realPrice/100,
          isGuaranteed: x.isAbatement || '',
          operation: '',
          operator_id: x.operator || '',
          cancel_type: R.cond([
            [R.equals(0),() => '预约未用车'],
            [R.equals(10),() => '订单进行中'],
            [R.equals(15),() => '还车待结算'],
            [R.equals(101),() => '正常支付完成'],
            [R.equals(102),() => '手动取消完成'],
            [R.equals(103),() => '自动取消完成'],
            [R.equals(104),() => '客服取消完成'],
            [R.equals(105),() => '汽车订单异常完成'],
            [R.equals(106),() => '单车订单异常']
          ])(x.status)
        }

        return outputList
      })
    },
    ...mapState({
      counter: state => state.action.counter
    })
  },
  methods: {
    isContainInList(val) {
      return R.contains(val, this.filterList)
    },
    search() {
      this.getOrderList()
    },
    handleSizeChange(val) {
      this.page_size = val
      this.getOrderList()
    },
    handleCurrentChange(val) {
      this.page_num = val
      this.getOrderList()
    },
    exportData(e) {
      // 导出
      let orderListQuery = {
        pageStatus: this.flag, // 根据标签页的选择来决定fetch的类型
        userId: this.uid,
        carId: this.car_id,
        pageSize: 20000,//TODO:目前是写死状态

        orderTimeStart: this.when_order_begin[0] ? format(this.when_order_begin[0] , 'YYYY-MM-DD') + ' 00:00:00' : '',
        orderTimeEnd: this.when_order_begin[1] ? format(this.when_order_begin[1] , 'YYYY-MM-DD') + ' 23:59:59' : '',
        fetchTimeStart: this.when_car_rent[0] ? format(this.when_car_rent[0] , 'YYYY-MM-DD') + ' 00:00:00' : '',
        fetchTimeEnd: this.when_car_rent[1] ? format(this.when_car_rent[1] , 'YYYY-MM-DD') + ' 23:59:59' : '',
        returnTimeStart: this.when_car_return[0] ? format(this.when_car_return[0] , 'YYYY-MM-DD') + ' 00:00:00' : '',
        returnTimeEnd: this.when_car_return[1] ? format(this.when_car_return[1] , 'YYYY-MM-DD') + ' 23:59:59' : '',
        settlementTimeStart: this.when_order_finish[0] ? format(this.when_order_finish[0] , 'YYYY-MM-DD') + ' 00:00:00' : '',
        sellementTimeEnd: this.when_order_finish[1] ? format(this.when_order_finish[1] , 'YYYY-MM-DD') + ' 23:59:59' : '',
        cancelTimeStart: this.when_order_cancel[0] ? format(this.when_order_cancel[0] , 'YYYY-MM-DD') + ' 00:00:00' : '',
        cancelTimeEnd: this.when_order_cancel[1] ? format(this.when_order_cancel[1] , 'YYYY-MM-DD') + ' 23:59:59' : '',
        cancelStatus: this.why_cancel_order
      }

      if(this.orderTotalAmount > 20000){
        this.$message.warning('导出成功，一次最多可以导出2万条数据');
      }
      var mypage = window.open();
      mypage.document.write('数据生成中，请稍后...')
      exportOrderList(orderListQuery).then(res => {
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
    sortTable() {
      //...
    },
    reset(){
      this.when_order_begin= []
      this.when_car_rent= []
      this.when_car_return= []
      this.when_order_finish= []
      this.when_order_cancel= []
      this.why_cancel_order= ''
      this.uid= ''
      this.phone_num_to_uid = ''
      this.order_id= ''
      this.order_num= ''
      this.car_id= ''
      this.phone_num= ''
      this.name= ''
    },
    async getOrderList() {
      this.listLoading = true;
      let time = new Date().getTime().toString()
      let timestamp = time.slice(0, -3)
      let sign = md5('incar' + time.slice(0, -3))

      if(this.phone_num){
        await getUserInfoCommon({
          phoneNum: this.phone_num,
          timestamp: timestamp,
          sign: sign
        }).then(res => {
          if(res.attachment){
            this.phone_num_to_uid = res.attachment[0].userId;
          }
        })
      }
      if(this.name){
        await getUserInfoCommon({
          fullName: this.name,
          timestamp: timestamp,
          sign: sign
        }).then(res => {
          // console.log(res);
          if(res.attachment.length > 0){
            this.name_to_uid = R.join(',')(res.attachment.map(x => x.userId));
          }
        })
      }

      if (!(/^[0-9]*$/).test(this.car_id)) {
        this.$message.error('车辆ID必须为数字类型')
        return
      }

      let orderListQuery = {
        pageStatus: this.flag, // 根据标签页的选择来决定fetch的类型
        //TODO:
        //姓名 手机号
        // userId: this.uid || this.phone_num || this.name,
        userId:  this.phone_num_to_uid || this.uid ,
        carId: this.car_id,
        orderNum: this.order_num,

        orderTimeStart: this.when_order_begin[0] ? format(this.when_order_begin[0] , 'YYYY-MM-DD') + ' 00:00:00' : '',
        orderTimeEnd: this.when_order_begin[1] ? format(this.when_order_begin[1] , 'YYYY-MM-DD') + ' 23:59:59' : '',
        fetchTimeStart: this.when_car_rent[0] ? format(this.when_car_rent[0] , 'YYYY-MM-DD') + ' 00:00:00' : '',
        fetchTimeEnd: this.when_car_rent[1] ? format(this.when_car_rent[1] , 'YYYY-MM-DD') + ' 23:59:59' : '',
        returnTimeStart: this.when_car_return[0] ? format(this.when_car_return[0] , 'YYYY-MM-DD') + ' 00:00:00' : '',
        returnTimeEnd: this.when_car_return[1] ? format(this.when_car_return[1] , 'YYYY-MM-DD') + ' 23:59:59' : '',
        settlementTimeStart: this.when_order_finish[0] ? format(this.when_order_finish[0] , 'YYYY-MM-DD') + ' 00:00:00' : '',
        sellementTimeEnd: this.when_order_finish[1] ? format(this.when_order_finish[1] , 'YYYY-MM-DD') + ' 23:59:59' : '',
        cancelTimeStart: this.when_order_cancel[0] ? format(this.when_order_cancel[0] , 'YYYY-MM-DD') + ' 00:00:00' : '',
        cancelTimeEnd: this.when_order_cancel[1] ? format(this.when_order_cancel[1] , 'YYYY-MM-DD') + ' 23:59:59' : '',
        cancelStatus: this.why_cancel_order,
        pageNum: this.page_num,
        pageSize: this.page_size,
      }

      //此处可以有 合并对象 的操作  >>> 查询ramda文档
      getOrderList(orderListQuery).then(res => {
        this.listLoading = true
        if (res.status === 200) {
          this.listLoading = false
          if(this.phone_num && !this.phone_num_to_uid){
            this.rawList = [];
            this.orderTotalAmount = 0
          } else {
            this.orderTotalAmount = res.attachment.total //TODO:
            // this.rawList = res.attachment.list
            const List = res.attachment.list
            let userIdList = res.attachment.list.map(x => {
              return x.userId
            })
            
            let time = new Date().getTime().toString();
            let timestamp = time.slice(0,-3);
            let sign = md5('incar' + time.slice(0,-3));
            if (userIdList.length < 1) {
              this.rawList = []
              return
            }
            getUserInfoCommon({
              userId: userIdList.join(','),
              timestamp: timestamp,
              sign: sign
            }).then(res => {
              let userInfoList = res.attachment
              this.rawList = (R.map( x => {
                for(let item of userInfoList){
                  if(x.userId === item.userId){
                    x.phone_num = item.phoneNum;
                    x.name = item.fullName;
                    return x;
                  }
                }
                return x;
              })(List));
  
              this.listLoading = false
            })
          }
        } else {
          this.$message.error('获取【用户信息】失败')
        }
      })
    },
  },
  created() {
    if (this.reload){
      this.$route.query.orderId = ''
      this.getOrderList()
    }
    if (this.$route.query.orderId) {
      return
    }
    this.getOrderList()
  },
  watch: {
    '$route.query.orderId': function(val){
      this.getOrderList();
    },
    counter (val) {
      this.getOrderList();
    }
  }
}
</script>

<style>
.row-flex {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  margin-top:2vh
}

.el-input.is-disabled .el-input__inner {
  background-color: #fff;
  border-color: #e4e7ed;
  color: #000;
  font-size: 15px;
  cursor: auto;
}

.btn-right {
  display:flex;
  align-items:center;
}
</style>
