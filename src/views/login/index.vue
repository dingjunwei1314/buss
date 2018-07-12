<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-con">
        <el-card class="box-card">
          <h3>欢迎登录 大道用车</h3>

          <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" @keyup.enter="handleLogin">
            <el-form-item label="">
              <el-input v-model="loginForm.username" size="small" placeholder="用户名">
                <svg-icon slot="prefix" icon-class="user" />
              </el-input>
            </el-form-item>

            <el-form-item label="">
              <el-input v-model="loginForm.password" size="small" type="password"  placeholder="密码">
                <svg-icon slot="prefix" icon-class="password" />
              </el-input>
            </el-form-item>

            <el-form-item>
              <el-button style="width:100%;height:30px;line-height:30px;padding:0;font-size:12px;" type="primary" @click="handleLogin">登陆</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'

export default {
  name: 'login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  methods: {
    showPwd () {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less">
  .login-container {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    height: 100%;
    width:100%;
    .login-box {
      background-image: url('../../assets/imgs/login_bg.jpg');
      background-size: cover;
      background-position: center;
      width: 100%;
      height: 100%;
      position: relative;
    }
    .login-con {
      position: absolute;
      right: 160px;
      top: 50%;
      width: 300px;
      transform: translateY(-50%);
    }
  }
</style>
