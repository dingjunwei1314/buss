<template>
  <div class="create-account">
    <div class="account-item">
      <label for="">账号：</label>
      <el-input class="input-item" v-model="account" placeholder="请输入内容"></el-input>
    </div>

    <div class="account-item">
      <label for="">密码：</label>
      <el-input class="input-item" v-model="password" placeholder="请输入内容"></el-input>
    </div>

    <div class="account-item">
      <label for="">姓名：</label>
      <el-input class="input-item" v-model="name" placeholder="请输入内容"></el-input>
    </div>

    <div class="account-item">
      <label for="">手机号：</label>
      <el-input class="input-item" v-model="mobile" placeholder="请输入内容"></el-input>
    </div>

    <div class="account-item">
      <label for="">邮箱：</label>
      <el-input class="input-item" v-model="email" placeholder="请输入内容"></el-input>
    </div>

    <div class="account-item">
      <label for="">角色：</label>
      <el-select class="input-item" v-model="role" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>

    <div class="account-item">
      <label for="">可用状态：</label>
      <el-radio v-model="status" label="1">启用</el-radio>
      <el-radio v-model="status" label="2">禁用</el-radio>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </div>
</template>
<script>
  import { addAccount, accountDetail } from '@/api'
  import MD5 from '@/utils/md5'
  export default {
    props: {
      data: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        account: '',
        password: '',
        name: '',
        mobile: '',
        email: '',
        role: '',
        options: [],
        status: ''
      }
    },
    created () {
      if (this.data) {
        this.inherit(this.data)
      }
    },
    watch: {
      data (val) {
        if (val) {
          this.inherit(val)
        }
      }
    },
    methods: {
      inherit (userInfo) {
        const params = {
          user_id: userInfo.user_id
        }
        accountDetail(params).then((res) => {
          console.log('*******', res)
          this.account = res.user_account
          this.name = res.user_name
          this.mobile = res.user_mobile
          this.email = res.user_email
          this.role = res.role_id
          this.status = res.status
        })
      },
      submit () {
        const params = {
          user_account: this.account,
          user_name: this.name,
          user_pwd: MD5(this.password),
          user_mobile: this.mobile,
          user_email: this.email,
          role_id: this.role,
          status: this.status
        }
        addAccount(params).then((res) => {
          console.log('-------res-------', res)
        })
      }
    }
  }
</script>
<style lang="scss">
  .create-account {
    .account-item {
      & > label {
        display: inline-block;
        width: 70px;
        text-align: right;
      }
      .input-item {
        display: inline-block;
        width: 500px;
        margin-bottom: 10px;
      }
    }
  }
</style>
