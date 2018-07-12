<template>
  <div>
    <el-button type="primary" @click="$router.push({ name:'exceptionOrderList' })" class="btn-float">返回</el-button>
    <div class="ticket-detail">
      <h3 class="header">订单信息</h3>
      <div class="detail-item">
        <label class="item-label" for="">订单号：</label>
        <span class="show-item">{{ data && data.orderNum }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">订单状态：</label>
        <span class="show-item">{{ data && data.orderStatus }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">姓名：</label>
        <span class="show-item">{{ data && data.name }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">账号：</label>
        <span class="show-item">{{ data && data.phone_num }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">车牌号：</label>
        <span class="show-item">{{ data && data.license }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">车辆ID：</label>
        <span class="show-item">{{ data && data.carId }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">收费等级：</label>
        <span class="show-item">{{ data && data.rank }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">计费时长（分）：</label>
        <span class="show-item">{{ data && data.dayMinutes }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">行驶里程（KM）：</label>
        <span class="show-item">{{ data && data.mileage }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">下单时间：</label>
        <span class="show-item">{{ data && parseTime(data.orderTime) }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">取车时间：</label>
        <span class="show-item">{{ data && parseTime(data.startBillingTime) }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">还车时间：</label>
        <span class="show-item">{{ data && parseTime(data.endBillingTime) }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">结算时间：</label>
        <span class="show-item">{{ data && parseTime(data.finishTime) }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">订单开始方式：</label>
        <span class="show-item">{{ data && data.bookType }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">是否免赔：</label>
        <span class="show-item">{{ data && data.isAbatement }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">用户ID：</label>
        <span class="show-item">{{ data && data.userId }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">下单网点：</label>
        <span class="show-item">{{ data && data.onParkId }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">还车网点：</label>
        <span class="show-item">{{ data && data.downParkId }}</span>
      </div>
      <div class="detail-item row-flex">
        <label class="item-label" for="">还车备注：</label>
        <el-input 
          type="textarea" 
          :autosize="{ minRows: 1, maxRows: 10}" 
          v-model="data.user_remark" 
          v-if="data" 
          style="width:800px;" 
          disabled>
        </el-input>
      </div>

      <h3 class="header">费用信息</h3>
      <div class="detail-item">
        <label class="item-label" for="">车费合计：</label>
        <span class="show-item">{{ data && data.orderPrice }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">里程费：</label>
        <span class="show-item">{{ data && data.mileageMoney }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">时长费：</label>
        <span class="show-item">{{ data && data.dayMoney }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">不计免赔：</label>
        <span class="show-item">{{ data && data.abatement }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">还车附加费：</label>
        <span class="show-item">{{ data && data.dispatchingFee }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">实付金额：</label>
        <span class="show-item">{{ data && data.realPrice }}</span>
      </div>
    </div>

    <div class="ticket-detail">
      <h3 class="header">异常处理记录</h3>
      <el-table :data="exceptionData" border style="width: 100%">
        <el-table-column prop="createTime" label="操作时间" width="160">
        </el-table-column>
        <el-table-column prop="sysUid" label="操作人" width="100">
        </el-table-column>
        <el-table-column prop="exceptionStatus" label="异常状态" width="100">
        </el-table-column>
        <el-table-column prop="exceptionType" label="异常情况" width="100">
        </el-table-column>
        <el-table-column prop="remark" label="异常备注" min-width="150">
        </el-table-column>
      </el-table>
    </div>

  </div>

</template>

<script>
import {
  getExceptionOrderDetail,
  getUserInfoCommon,
  getCarInfoByIds,
  getOrderBillDetail
} from '@/api'
import { parseTime } from '@/utils'
import md5 from '@/utils/md5'
import * as R from 'ramda'

export default {
  props: {
    orderid: {
      type: Number,
    },
  },
  data() {
    return {
      orderDetail: [],
      data: null,
      parseTime: parseTime,
      exceptionData: [],
    }
  },
  methods: {
    getExceptionOrderDetail(val) {
      const params = {
        orderId: val,
      }
      getExceptionOrderDetail(params).then(async res => {
        let rawData_one = res.attachment.ordersDetail
        let rawData_two = res.attachment.exceptionLog

        rawData_two = rawData_two.map(x => { x.createTime = parseTime(x.createTime)
          // x.sysUid = TODO: 查询
          x.exceptionStatus = R.cond([
            [R.equals(0), () => '待处理'],
            [R.equals(20), () => '已处理'],
          ])(x.exceptionStatus)
          x.exceptionType = R.cond([
            [R.equals(0), () => '车辆失联'],
            [R.equals(1), () => '道路救援'],
            [R.equals(2), () => '结算错误'],
            [R.equals(3), () => '取消频繁'],
            [R.equals(4), () => '停滞过久'],
            [R.equals(5), () => '超出围栏'],
            [R.equals(6), () => '严重投诉'],
            [R.equals(7), () => '无法还车'],
            [R.equals(8), () => '无法结算'],
            [R.equals(9), () => '非法移动'],
            [R.equals(10), () => '其他'],
          ])(x.exceptionType)
          // x.remark
          return x
        })

        this.exceptionData = rawData_two
        // if (!rawData_one.user_remark) {
        //   rawData_one.user_remark = ''
        // }

        rawData_one.bookType = R.cond([
          [R.equals(0), () => '默认'],
          [R.equals(1), () => '地图选取'],
          [R.equals(2), () => '扫描车牌'],
        ])(rawData_one.bookType)

        rawData_one.isAbatement = R.cond([
          [R.equals(0), () => '默认'],
          [R.equals(1), () => '是'],
          [R.equals(2), () => '否'],
        ])(rawData_one.isAbatement)

        rawData_one.orderStatus = R.cond([
          [R.equals(0), () => '预约未用车'],
          [R.equals(10), () => '订单进行中'],
          [R.equals(15), () => '还车待结算'],
          [R.equals(101), () => '正常支付完成'],
          [R.equals(102), () => '手动取消完成'],
          [R.equals(103), () => '自动取消完成'],
          [R.equals(104), () => '客服取消完成'],
          [R.equals(105), () => '汽车订单异常完成'],
          [R.equals(106), () => '单车订单异常'],
        ])(rawData_one.status)

        // 例外情况 ： 如果日期返回为-288000

        // 因为此处数据提供方是incar，所以单位是元，维护代码时请注意。
        if (rawData_one.status === 10) {
          rawData_one.orderPrice = ''
          rawData_one.mileageMoney = ''
          rawData_one.dayMoney = ''
          rawData_one.abatement = ''
          rawData_one.dispatchingFee = ''
          rawData_one.realPrice = ''

          getOrderBillDetail({
            orderId: val,
          }).then(res => {
            rawData_one.orderPrice = res.attachment.orderPrice + ' 元'
            rawData_one.mileageMoney = res.attachment.mileageMoney + ' 元'
            rawData_one.dayMoney = res.attachment.dayMoney + ' 元'
            rawData_one.abatement = res.attachment.abatement + ' 元'
            rawData_one.dispatchingFee = res.attachment.dispatchingFee + ' 元'
            rawData_one.realPrice = ''
          })
        } else {
          rawData_one.orderPrice = rawData_one.orderPrice / 100 + ' 元'
          rawData_one.mileageMoney = rawData_one.mileageMoney / 100 + ' 元'
          rawData_one.dayMoney = rawData_one.dayMoney / 100 + ' 元'
          rawData_one.abatement = rawData_one.abatement / 100 + ' 元'
          rawData_one.dispatchingFee = rawData_one.dispatchingFee / 100 + ' 元'
          rawData_one.realPrice = rawData_one.realPrice / 100 + ' 元'
        }

        rawData_one.orderTime = rawData_one.orderTime > 0 ? rawData_one.orderTime : ''
        rawData_one.startBillingTime = rawData_one.startBillingTime > 0 ? rawData_one.startBillingTime : ''
        rawData_one.endBillingTime = rawData_one.endBillingTime > 0 ? rawData_one.endBillingTime : ''
        rawData_one.finishTime = rawData_one.finishTime > 0 ? rawData_one.finishTime : ''

        let uid = rawData_one.userId
        let carId = rawData_one.carId

        let time = new Date().getTime().toString()
        let timestamp = time.slice(0, -3)
        let sign = md5('incar' + time.slice(0, -3))
        await getUserInfoCommon({
          userId: uid,
          timestamp: timestamp,
          sign: sign,
        }).then(res => {
          if (res.attachment[0]) {
            rawData_one['phone_num'] = res.attachment[0].phoneNum
            rawData_one['name'] = res.attachment[0].fullName || ''
          } else {
            rawData_one['phone_num'] = ''
            rawData_one['name'] = ''
          }
        })

        await getCarInfoByIds({
          carIds: carId,
        }).then(res => {
          if (res.status === 200) {
            if (res.attachment.CarModels[0]) {
              rawData_one['license'] = res.attachment.CarModels[0].licenseTag
              rawData_one['rank'] = R.cond([
                [R.equals(1), () => 'S'],
                [R.equals(2), () => 'M+'],
                [R.equals(3), () => 'S+'],
              ])(res.attachment.CarModels[0].gradeId)
              rawData_one['user_remark'] = res.attachment.CarModels[0].userRemark
              this.data = rawData_one
            } else {
              rawData_one['license'] = ''
              rawData_one['rank'] = ''
              rawData_one['user_remark'] = ''
            }
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
  },
  created() {
    this.getExceptionOrderDetail(this.orderid)
  },
}
</script>

<style lang="scss">
.ticket-detail {
  .detail-item {
    margin-bottom: 10px;
    line-height: 30px;
    .item-label {
      display: inline-block;
      vertical-align: middle;
      width: 120px;
      text-align: right;
      height: 30px;
      font-size: 14px;
    }
    .show-item {
      display: inline-block;
      vertical-align: middle;
      width: 600px;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding-left: 6px;
      line-height: 30px;
      height: 30px;
    }
  }
}

.el-textarea.is-disabled .el-textarea__inner {
  background-color: #fff;
  border-color: #e4e7ed;
  color: #000;
  font-size: 15px;
  cursor: auto;
}

.row-flex {
  display: flex;
  align-items: center;
}

.header {
  border-bottom: 1px solid black;
  padding-bottom: 5px;
}

.btn-float {
  position: absolute;
  right: 2vw;
  top: 2vh;
}
</style>
