<template>
  <div class="compensate-ticket">
    <div class="coupon-box">
      <label class="label" for="">选择赠送优惠券：</label>
      <div class="compensate-item inline-block" :class="{first: key === 0}" v-for="(item, key) in coupons">
        <el-select class="select-item" name="ticket-status" v-model="item.id" size="small" filterable remote clearable placeholder="选择优惠券":remote-method="remoteSort">
          <el-option
            v-for="item in couponOptions"
            :key="item.id"
            :label="item.title + ' (id:' + item.id + ')'"
            :value="item.id">
          </el-option>
        </el-select>
        <label>数量：</label>
        <el-input class="input-item" v-model="item.num" type="number" size="small" placeholder="最多5张" min="0" max="5" @change="changeNum($event, key)"/>
        <el-button class="add" type="text" @click="addItem">添加</el-button>
        <el-button v-if="key > 0" class="del" type="text" @click="delItem(key)">删除</el-button>
        <span class="tip" v-if="key === 0">注：一次发放的优惠券总数最多5张</span>
      </div>
    </div>
    <div class="user-box">
      <label class="label" for="">用户账号：</label>
      <el-input class="input-item" v-model="mobile" type="text" size="small" placeholder="输入用户手机号"/>
    </div>
    <div class="remark-box">
      <label class="label" for="">备注(必填)：</label>
      <el-input class="textarea-item" v-model="remark" type="textarea" :row="3" placeholder="请输入内容"></el-input>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </div>
</template>
<script>
  import { getCoupon } from '@/api'
  import { getUserId, getToken } from '@/utils/auth'
  import { PREFIX, APP_ID, IS_SEND_LOG } from '@/config/app'
  import sendLog from '@/utils/sendLog'
  import axios from 'axios'
  export default {
    data () {
      return {
        coupons: [{
          id: '',
          num: 0
        }],
        mobile: '',
        remark: '',
        couponOptions: [],
        couponNum: 0,
        file: null,
        submitSign: true
      }
    },
    created () {
      this.getCouponList()
    },
    methods: {
      getCouponList (query) {
        const params = {
          source: '!2',
          title: query
        }
        getCoupon(params).then((res) => {
          // 此处和request拦截器交互 没有response.data.data时返回上级数据的兼容
          this.couponOptions = res.code ? [] : res
        })
      },
      remoteSort (query) {
        this.getCouponList(query)
      },
      changeNum (e, key) {
        this.couponNum = 0
        for (let i of this.coupons) {
          this.couponNum += +i.num
        }
        if (this.couponNum > 5) {
          this.$message.error('优惠券总数已大于5张，请重新填写！')
          this.coupons[key].num = 0
        }
        if (!this.coupons[key].id) {
          this.$message.error('该项还没有选择优惠券！')
        }
      },
      addItem () {
        if (this.coupons.length < 5) {
          this.coupons.push({id: '', num: 0})
        }
      },
      delItem (key) {
        this.coupons.splice(key, 1)
      },
      fileChange (e) {
        this.file = e.target.files[0]
      },
      async submit () {
        if (!this.submitSign) {
          return
        }
        this.submitSign = false
        if (IS_SEND_LOG) {
          let logRes = await sendLog('/activity/redress/add', {}, {
            action: 'create',
            comment: '补偿优惠券'
          })
        }

        let form = new FormData()
        let idArr = []
        let numArr = []
        for (let i of this.coupons) {
          if (+i.num > 0 && i.id) {
            idArr.push(i.id)
            numArr.push(i.num)
          }
        }
        if (idArr.length > 0) {
          form.append('c_id', idArr.join(','))
        }
        if (numArr.length > 0) {
          form.append('num', numArr.join(','))
        }
        form.append('mobile', this.mobile)
        if (this.remark) {
          form.append('remark', this.remark)
        }
        form.append('operation_id', getUserId())
        axios({
          method: 'post',
          url: PREFIX + '/activity/redress/add',
          data: form,
          headers: {
            'x-incar-app-id': APP_ID,
            'x-incar-request-moudle': 'buss',
            'x-incar-request-uri': '/activity/redress/add',
            'x-incar-token': getToken(),
            'x-operate-id': IS_SEND_LOG ? logRes.id : ''
          }
        }).then((res) => {
          this.submitSign = true
          if (res.data && res.data.code === 200) {
            this.$message.success('发送成功！')
            this.$emit('close')
          } else {
            this.$message.error(res.data.message)
          }
        }).catch((err) => {
          this.submitSign = true
          console.log(err)
        })
      }
    }
  }
</script>
<style lang="scss">
  .compensate-ticket {
    padding: 20px;
    .label {
      display: inline-block;
      width: 132px;
    }
    .tip {
      margin-left: 5px;
      font-size: 14px;
      color: #aaa;
    }
    .coupon-box {
      min-width: 962px;
      .compensate-item {
        margin-left: 136px;
        margin-top: 10px;
        .select-item {
          width: 300px;
        }
        .input-item {
          display: inline-block;
          width: 100px;
        }
        .add, .del {
          margin-left: 5px;
        }
      }
      .first {
        margin: 0;
      }
    }
    .user-box {
      min-width: 962px;
      margin-top: 20px;

      .input-item {
        display: inline-block;
        width: 300px;
      }
    }
    .remark-box {
      min-width: 962px;
      margin-top: 30px;
      & > label {
        vertical-align: top;
      }
      .textarea-item {
        display: inline-block;
        width: 600px;
      }
    }
    .action-btn {
      margin-top: 20px;
      text-align: center;

      .btn {
        width: 120px;
      }
    }
  }
</style>
