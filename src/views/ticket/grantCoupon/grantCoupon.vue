<template>
  <div class="compensate-ticket">
    <div class="coupon-box">
      <label class="label" for="">选择赠送优惠券：</label>
      <div class="compensate-item inline-block" :class="{first: key === 0}" v-for="(item, key) in coupons">
        <el-select class="select-item" name="ticket-status" v-model="item.id" size="small" filterable remote clearable placeholder="选择优惠券" :remote-method="remoteSort">
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
      <div class="single inline-block">
        <el-radio class="radio-item" v-model="sendType" label="1">单个用户</el-radio>
        <el-input :disabled="sendType !== '1'" class="input-item" v-model="mobile" type="text" size="small" placeholder="输入用户手机号"/>
      </div>
      <br />
      <div class="multiple inline-block">
        <el-radio v-model="sendType" label="2">批量用户</el-radio>
        <div class="upload-item">
          <input :disabled="sendType !== '2'" type="file" class="upload-input" @change="fileChange" />
          <el-button type="info" :icon="file ? 'el-icon-check' : 'el-icon-upload'">上传文件</el-button>
        </div>
        <el-date-picker :disabled="sendType !== '2'" class="time-item" v-model="sendTime" type="datetime" size="small" placeholder="发放时间"></el-date-picker>
        <span class="tip">注：模板(<span style="color:#409EFF"><a :href="tem" download="模板">点击下载</a></span>)中最多可添加用户数据20000条</span>
      </div>
    </div>
    <div class="remark-box">
      <label class="label" for="">备注(必填)：</label>
      <el-input class="textarea-item" v-model="remark" type="textarea" :row="3" placeholder="请输入内容"></el-input>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary":loading="upLoading" @click="submit">确 定</el-button>
    </div>
  </div>
</template>
<script>
  import { getCoupon } from '@/api'
  import { getUserId, getToken } from '@/utils/auth'
  import { PREFIX, APP_ENV, APP_ID, IS_SEND_LOG } from '@/config/app'
  import sendLog from '@/utils/sendLog'
  import moment from 'moment'
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
        sendType: '1',
        sendTime: '',
        couponNum: 0,
        file: null,
        upLoading: false,
        tem: APP_ENV === 'pro' ? `https://api-buss-oms.mydadao.com/upload/template.xlsx` : `https://api-buss-oms-${APP_ENV}.mydadao.com/upload/template.xlsx`,
        submitSign: true
      }
    },
    created () {
      this.getCouponList()
    },
    watch: {
      sendType (val) {
        if (val === '1') {
          this.file = null
          document.querySelector('.upload-input').value = null
          this.sendTime = ''
        } else {
          this.mobile = ''
        }
      }
    },
    methods: {
      getCouponList (query) {
        const params = {
          source: '!2',
          title: query
        }
        getCoupon(params).then((res) => {
          this.couponOptions = res !== null ? res : []
        })
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
      remoteSort (query) {
        this.getCouponList(query)
      },
      async submit () {
        if (!this.submitSign) {
          return
        }
        this.submitSign = false
        if (IS_SEND_LOG) {
          let logRes = await sendLog('/activity/publish/add', {}, {
            action: 'create',
            comment: '发放优惠券'
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
        form.append('stype', this.sendType)
        if (this.mobile) {
          form.append('mobile', this.mobile)
        }
        if (this.file) {
          form.append('file', this.file)
        }
        if (this.sendTime) {
          form.append('send_time', moment(this.sendTime).format('YYYY-MM-DD HH:mm:ss'))
        }
        if (this.remark) {
          form.append('remark', this.remark)
        }
        form.append('operation_id', getUserId())
        this.upLoading = true
        axios({
          method: 'post',
          url: PREFIX + '/activity/publish/add',
          data: form,
          headers: {
            'x-incar-app-id': APP_ID,
            'x-incar-request-moudle': 'buss',
            'x-incar-request-uri': '/activity/publish/add',
            'x-incar-token': getToken(),
            'x-operate-id': IS_SEND_LOG ? logRes.id : ''
          }
        }).then((res) => {
          this.submitSign = true
          this.upLoading = false
          if (res.data && res.data.code === 200) {
            this.$message.success('发送成功！')
            // 发送成功后清除缓存
            this.coupons = [{id: '', num: 0}]
            this.sendType = '1'
            this.mobile = ''
            this.file = null
            this.sendTime = ''
            this.remark = ''
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
      .single, .multiple {
        height: 40px;
        line-height: 40px;
        & > label {
          display: inline-block;
        }
      }
      .single {
        margin-top: 10px;
        .input-item {
          margin-left: 5px;
          display: inline-block;
          width: 300px;
        }
      }
      .multiple {
        margin-left: 136px;
        .upload-item {
          display: inline-block;
          position: relative;
          .upload-input {
            position: absolute;
            top: 0;
            left: 0;
            height: 40px;
            opacity: 0;
          }
          .upload-btn {
            position: absolute;
            top: 0;
            left: 0;
          }
        }
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
