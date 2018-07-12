<template>
  <el-table-column :label="colConfig.label" min-width="200" align="center">
    <div slot-scope="{ row }" style="display:flex;flex-wrap:nowrap;flex-direction:row">
      <el-button type="text" size="medium" @click.native="$router.push({ name:'exceptionOrderList' , query: { orderId : row.order_id }})">查看</el-button>
      <el-button type="text" size="medium" @click.native="returnCar(row.order_id,row.order_num,row.operator_id, row.exception_status , row.exception_situation , row.exception_remarks , row.exception_id , row.uid , row.car_id )">还车</el-button>
      <el-button type="text" size="medium" @click.native="openDoor(row.order_id,row.order_num,row.operator_id, row.exception_status , row.exception_situation , row.exception_remarks , row.exception_id , row.uid , row.car_id )">开门</el-button>
      <el-button type="text" size="medium" @click.native="lockCar(row.order_id,row.order_num,row.operator_id, row.exception_status , row.exception_situation , row.exception_remarks , row.exception_id , row.uid , row.car_id )">锁车</el-button>
      <el-button type="text" size="medium" @click.native="finish(row.order_id,row.order_num,row.operator_id, row.exception_status , row.exception_situation , row.exception_remarks , row.exception_id , row.uid , row.car_id )">完成</el-button>

      <el-dialog title="还车" :visible.sync="dialogShow_returnCar" width="60%" center>
        <div style="display:flex;flex-wrap:wrap">
          <div style="flex-basis:50%;display:flex;align-items:center;margin-bottom:13px">
            <span>当前订单号：</span>
            <el-input v-model.trim="orderNum" placeholder="" size="small" style="width:70%" disabled></el-input>

          </div>
          <div style="flex-basis:50%;display:flex;align-items:center;margin-bottom:13px">
            <span>异常情况选择：</span>
            <el-select v-model.trim="exception_condition_returnCar" placeholder="请选择" size="small">
              <el-option v-for="item in exceptionOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>

        </div>
        <div style="margin-bottom:12px">
          <div>异常备注（必填）：</div>
          <el-input type="textarea" :rows="6" placeholder="请输入内容" size="small" v-model.trim="exception_memo_returnCar">
          </el-input>
        </div>
        <span style="color:red">
          注意：<br> 1、提醒用户携带好自身物品从车内离开，还车后车门将自动锁死；
          <br> 2、还车后，车辆处于下线整备状态，如车辆无工单而发生移动属于非法移动状态；
          <br> 3、还车后，用户无法继续使用该车辆，如要用车需重新下单租车；
          <br>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="returnCarSubmit">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </span>
      </el-dialog>

      <el-dialog title="开门" :visible.sync="dialogShow_openDoor" width="60%" center>
        <div style="display:flex;flex-wrap:wrap">
          <div style="flex-basis:50%;display:flex;align-items:center;margin-bottom:13px">
            <span>当前订单号：</span>
            <el-input v-model.trim="orderNum" placeholder="" size="small" style="width:70%" disabled></el-input>

          </div>
          <div style="flex-basis:50%;display:flex;align-items:center;margin-bottom:13px">
            <span>异常情况选择：</span>
            <el-select v-model.trim="exception_condition_openDoor" placeholder="请选择" size="small">
              <el-option v-for="item in exceptionOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div style="margin-bottom:12px">
          <div>异常备注（必填）：</div>
          <el-input type="textarea" :rows="6" placeholder="请输入内容" size="small" v-model.trim="exception_memo_openDoor">
          </el-input>
        </div>
        <span style="color:red">
          注意：<br> 1、建议从后台查看用户所在位置，然后必须和用户确认，人在车旁不超过10米；
          <br> 2、提醒用户，如果是订单首次开车门，开车门后订单将开始计费；
          <br>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="openDoorSubmit">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </span>
      </el-dialog>

      <el-dialog title="锁车" :visible.sync="dialogShow_lockCar" width="60%" center>
        <div style="display:flex;flex-wrap:wrap">
          <div style="flex-basis:50%;display:flex;align-items:center;margin-bottom:13px">
            <span>当前订单号：</span>
            <el-input v-model.trim="orderNum" placeholder="" size="small" style="width:70%" disabled></el-input>

          </div>
          <div style="flex-basis:50%;display:flex;align-items:center;margin-bottom:13px">
            <span>异常情况选择：</span>
            <el-select v-model.trim="exception_condition_lockCar" placeholder="请选择" size="small">
              <el-option v-for="item in exceptionOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div style="margin-bottom:12px">
          <div>异常备注（必填）：</div>
          <el-input type="textarea" :rows="6" placeholder="请输入内容" size="small" v-model.trim="exception_memo_lockCar">
          </el-input>
        </div>
        <span style="color:red">
          注意：<br> 1、和用户确认是要锁车门还是要换车，用户核心需求是什么？
          <br>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="lockCarSubmit">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </span>
      </el-dialog>

      <el-dialog title="完成" :visible.sync="dialogShow_finish" width="30%" center>
        <div style="text-align:center">确认已处理完成此订单异常情况？</div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="finishSubmit" size="small">确 定</el-button>
          <el-button @click="dialogShow_finish = false" size="small">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </el-table-column>
</template>

<script>
import format from 'date-fns/format'
import * as R from 'ramda'
import {
  getExceptionOrderList,
  getUserInfoCommon,
  lockCar,
  unlockCar,
  returnCar,
  finishExceptionOrder,
} from '@/api'

export default {
  props: ['colConfig'],
  data() {
    return {
      orderNum: '',
      orderId: '',
      operatorId: '',

      dialogShow_returnCar: false,
      exception_condition_returnCar: null,
      exception_memo_returnCar: '',

      dialogShow_openDoor: false,
      exception_condition_openDoor: null,
      exception_memo_openDoor: '',

      dialogShow_lockCar: false,
      exception_condition_lockCar: null,
      exception_memo_lockCar: '',

      dialogShow_finish: false,

      exception_status: '',
      exception_situation: '',
      exception_id: '',
      car_id: '',
      uid: '',
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
    }
  },
  methods: {
    cancel() {
      this.orderNum = ''
      this.orderId = ''
      this.operatorId = ''

      this.dialogShow_returnCar = false
      this.exception_condition_returnCar = null
      this.exception_memo_returnCar = ''

      this.dialogShow_openDoor = false
      this.exception_condition_openDoor = null
      this.exception_memo_openDoor = ''

      this.dialogShow_lockCar = false
      this.exception_condition_lockCar = null
      this.exception_memo_lockCar = ''

      this.dialogShow_finish = false

      this.exception_status = ''
      this.exception_situation = ''
      this.exception_id = ''
      this.car_id = ''
      this.uid = ''
    },

    returnCar(
      order_id,
      order_num,
      operator_id,
      exception_status,
      exception_situation,
      exception_remarks,
      exception_id,
      uid,
      car_id
    ) {
      this.orderId = order_id
      this.orderNum = order_num
      this.operatorId = operator_id
      this.exceptionStatus = exception_status
      this.exception_id = exception_id
      this.uid = uid
      this.car_id = car_id
      this.dialogShow_returnCar = true
    },
    returnCarSubmit() {
      if (this.exception_memo_returnCar.length > 460) {
        this.$message.error('备注字数不能大于450字，请整理后重试')
        return
      }
      if (this.exception_condition_returnCar === null) {
        this.$message.error('异常情况未选择');
        return;
      }
      if (!this.exception_memo_returnCar) {
        this.$message.error('异常备注未填写');
        return;
      }

      const params = {
        orderId: this.orderId,
        exceptionStatus: this.exceptionStatus,
        exceptionSituation: this.exception_condition_returnCar,
        exceptionRemarks: '还车：' + this.exception_memo_returnCar,
        exceptionId: this.exception_id,
        uid: this.uid,
        carId: this.car_id,

        operatorId: this.operatorId
      }
      returnCar(params).then(res => {
        if (res.status === 200) {
          this.dialogShow_returnCar = false
          this.$message.success(res.message)
          this.$store.dispatch('triggerRefresh')
        } else {
          this.$message.error(res.message)
        }
      })
    },

    openDoor(
      order_id,
      order_num,
      operator_id,
      exception_status,
      exception_situation,
      exception_remarks,
      exception_id,
      uid,
      car_id
    ) {
      this.orderId = order_id
      this.orderNum = order_num
      this.operatorId = operator_id
      this.exceptionStatus = exception_status
      this.exception_id = exception_id
      this.uid = uid
      this.car_id = car_id
      this.dialogShow_openDoor = true
    },
    openDoorSubmit() {
      if (this.exception_memo_openDoor.length > 460) {
        this.$message.error('备注字数不能大于450字，请整理后重试')
        return
      }
      if (this.exception_condition_openDoor === null) {
        this.$message.error('异常情况未选择')
        return
      }
      if (!this.exception_memo_openDoor) {
        this.$message.error('异常备注未填写')
        return
      }

      const params = {
        orderId: this.orderId,
        exceptionStatus: this.exceptionStatus,
        exceptionSituation: this.exception_condition_openDoor,
        exceptionRemarks: '开车门：' + this.exception_memo_openDoor,
        exceptionId: this.exception_id,
        carId: this.car_id,

        operatorId: this.operatorId
      }
      unlockCar(params).then(res => {
        if (res.status === 200) {
          this.dialogShow_openDoor = false
          this.$message.success(res.message)
          this.$store.dispatch('triggerRefresh')
        } else {
          this.$message.error(res.message)
        }
      })
    },

    lockCar(
      order_id,
      order_num,
      operator_id,
      exception_status,
      exception_situation,
      exception_remarks,
      exception_id,
      uid,
      car_id
    ) {
      this.orderId = order_id
      this.orderNum = order_num
      this.operatorId = operator_id
      this.exceptionStatus = exception_status
      this.exception_id = exception_id
      this.uid = uid
      this.car_id = car_id
      this.dialogShow_lockCar = true
    },
    lockCarSubmit() {
      if (this.exception_memo_lockCar.length > 460) {
        this.$message.error('备注字数不能大于450字，请整理后重试')
        return
      }
      if (this.exception_condition_lockCar === null) {
        this.$message.error('异常情况未选择')
        return
      }
      if (!this.exception_memo_lockCar) {
        this.$message.error('异常备注未填写')
        return
      }
      const params = {
        orderId: this.orderId,
        exceptionStatus: this.exceptionStatus,
        exceptionSituation: this.exception_condition_lockCar,
        exceptionRemarks: '锁车门：' + this.exception_memo_lockCar,
        exceptionId: this.exception_id,
        carId: this.car_id,

        operatorId: this.operatorId
      }
      lockCar(params).then(res => {
        if (res.status === 200) {
          this.dialogShow_lockCar = false
          this.$message.success(res.message)
          this.$store.dispatch('triggerRefresh')
        } else {
          this.$message.error(res.message)
        }
      })
    },

    finish(
      order_id,
      order_num,
      operator_id,
      exception_status,
      exception_situation,
      exception_remarks,
      exception_id,
      uid,
      car_id
    ) {
      this.orderId = order_id
      this.orderNum = order_num
      this.operatorId = operator_id
      this.exceptionStatus = exception_status
      this.exception_id = exception_id
      this.exception_situation = exception_situation
      this.exception_remarks = exception_remarks
      this.uid = uid
      this.car_id = car_id
      this.dialogShow_finish = true
    },
    finishSubmit() {
      const params = {
        orderId: this.orderId,
        exceptionStatus: this.exceptionStatus,
        exceptionSituation: this.exception_situation,
        exceptionRemarks: '完成：' + this.exception_remarks,
        exceptionId: this.exception_id,
        operatorId: this.operatorId
      }
      finishExceptionOrder(params).then(res => {
        if (res.status === 200) {
          this.dialogShow_finish = false
          this.$message.success(res.message)
          this.$store.dispatch('triggerRefresh')
        } else {
          this.$message.error(res.message)
        }
      })
    },
  },
}
</script>

<style scoped>
.el-input.is-disabled .el-input__inner {
  background-color: #fff;
  border-color: #e4e7ed;
  color: #000;
  font-size: 15px;
  cursor: auto;
}
</style>
