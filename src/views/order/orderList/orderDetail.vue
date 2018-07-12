<template>
  <div>

    <el-button type="primary" @click="$router.push({ name:'orderList' })" class="btn-float">返回</el-button>
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
        <span class="show-item">{{ data.name }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">账号：</label>
        <span class="show-item">{{ data.phone_num }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">车牌号：</label>
        <span class="show-item">{{ data.license }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">车辆ID：</label>
        <span class="show-item">{{ data && data.carId }}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">收费等级：</label>
        <span class="show-item">{{ data.rank }}</span>
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
          v-model="data.userRemark"
          v-if="data"
          style="width:800px;"
          disabled>
        </el-input>
      </div>

    </div>

    <div class="ticket-detail">
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
        <span class="show-item">{{ data && data.dispatchingFee}}</span>
      </div>
      <div class="detail-item">
        <label class="item-label" for="">实付金额：</label>
        <span class="show-item">{{ data && data.realPrice }}</span>
      </div>
    </div>

  </div>

</template>

<script>
import { getOrderDetail , getUserInfo , getCarInfoByIds , getUserInfoCommon , getOrderBillDetail } from "@/api";
import { parseTime } from "@/utils";
import md5 from '@/utils/md5'
import * as R from 'ramda'

export default {
  props: {
    orderid: {
      type: Number
    }
  },
  data(){
    return {
      orderDetail : [],
      data:null,
      parseTime: parseTime
    }
  },
  methods: {
    getOrderDetail(val) {
      const params = {
        orderId: val
      };
      getOrderDetail(params).then(async res => {
        // console.log(JSON.stringify(res.attachment,null,2));
        let rawData = res.attachment[0];

        R.cond([
          [R.equals(0),   () => { rawData.bookType = '默认' }],
          [R.equals(1), () => { rawData.bookType = '地图选取' }],
          [R.equals(2),  () => { rawData.bookType = '扫描车牌' }]
        ])(rawData.bookType);

        R.cond([
          [R.equals(0),   () => { rawData.isAbatement = '默认' }],
          [R.equals(1), () => { rawData.isAbatement = '是' }],
          [R.equals(2),  () => { rawData.isAbatement = '否' }]
        ])(rawData.isAbatement);

        rawData.orderStatus = R.cond([
          [R.equals(0),() => '预约未用车'],
          [R.equals(10),() => '订单进行中'],
          [R.equals(15),() => '还车待结算'],
          [R.equals(101),() => '正常支付完成'],
          [R.equals(102),() => '手动取消完成'],
          [R.equals(103),() => '自动取消完成'],
          [R.equals(104),() => '客服取消完成'],
          [R.equals(105),() => '汽车订单异常完成'],
          [R.equals(106),() => '单车订单异常']
        ])(rawData.status)

        

        rawData.orderTime = rawData.orderTime > 0 ? rawData.orderTime : '';
        rawData.startBillingTime = rawData.startBillingTime > 0 ? rawData.startBillingTime : '';
        rawData.endBillingTime = rawData.endBillingTime > 0 ? rawData.endBillingTime : '';
        rawData.finishTime = rawData.finishTime > 0 ? rawData.finishTime : '';

        // 因为此处数据提供方是incar，所以单位是元，维护代码时请注意。
        if(rawData.status === 10){
          rawData.orderPrice = '';
          rawData.mileageMoney = '';
          rawData.dayMoney = '';
          rawData.abatement = '';
          rawData.dispatchingFee = '';
          rawData.realPrice = '';

          getOrderBillDetail({
            orderId: val
          }).then(res => {
            rawData.orderPrice = res.attachment.orderPrice + ' 元';
            rawData.mileageMoney = res.attachment.mileageMoney + ' 元';
            rawData.dayMoney = res.attachment.dayMoney + ' 元';
            rawData.abatement = res.attachment.abatement + ' 元';
            rawData.dispatchingFee = res.attachment.dispatchingFee + ' 元';
            rawData.realPrice = '';
          })
        } else {
          rawData.orderPrice = rawData.orderPrice/100 + ' 元'; 
          rawData.mileageMoney = rawData.mileageMoney/100 + ' 元'; 
          rawData.dayMoney = rawData.dayMoney/100 + ' 元'; 
          rawData.abatement = rawData.abatement/100 + ' 元'; 
          rawData.dispatchingFee = rawData.dispatchingFee/100 + ' 元'; 
          rawData.realPrice = rawData.realPrice/100 + ' 元'; 
        }

        let uid = res.attachment[0].userId;
        let carId = res.attachment[0].carId;
        let time = new Date().getTime().toString()
        let timestamp = time.slice(0, -3)
        let sign = md5('incar' + time.slice(0, -3))
        await getUserInfoCommon({
          userId: uid,
          timestamp: timestamp,
          sign: sign
        }).then(res => {
          if(res.attachment[0]){
            rawData['phone_num'] = res.attachment[0].phoneNum
            rawData['name'] = res.attachment[0].fullName
          } else {
            rawData['phone_num'] =''
            rawData['name'] = ''
          }
        })

        await getCarInfoByIds({
          carIds : carId
        }).then( res => {
          if(res.status === 200){
            if(res.attachment.CarModels[0]){
            rawData['license'] = res.attachment.CarModels[0].licenseTag
            rawData['rank'] = R.cond([
                [R.equals(1),   () => 'S' ],
                [R.equals(2), () => 'M+'],
                [R.equals(3),  () => 'S+' ]
              ])(res.attachment.CarModels[0].gradeId);
            rawData['userRemark'] = res.attachment.CarModels[0].userRemark
            } else {
              rawData['license'] = ''
              rawData['rank'] = ''
            }
            this.data = rawData;
          } else {
            this.$message.error(res.message)
          }
        })

      });
    }
  },
  created(){
    this.getOrderDetail(this.orderid);
  }
};

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

.btn-float {
  position:absolute;
  right:2vw;
  top:2vh;
}

.row-flex {
  display:flex;
  flex-direction:row;
}

.header {
  border-bottom:1px solid black;
  padding-bottom:5px
}
</style>
