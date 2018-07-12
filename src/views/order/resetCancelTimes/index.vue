<template>
  <div>
    <div class="container">
      <div>用户账号：
        <el-input v-model="input" placeholder="" style="width:30vw"></el-input>
        <br>
        <span style="color:red;margin-left:5em;line-height: 1.2em">重置后用户可再取消订单5次</span>
      </div>
      <el-button type="primary" style="margin-top:15px;width:15em" @click.native="reset">确认重置</el-button>
    </div>
  </div>
</template>

<script>
import { resetCancelTime, getUserInfoCommon } from '@/api'
import md5 from '@/utils/md5'

export default {
  data() {
    return {
      input: '',
    }
  },
  methods: {
    reset() {
      let time = new Date().getTime().toString()
      let timestamp = time.slice(0, -3)
      let sign = md5('incar' + time.slice(0, -3))

      const param_one = {
        phoneNum: this.input,
        timestamp: timestamp,
        sign: sign
      }
      getUserInfoCommon(param_one)
        .then(res => {
          if (res.status === 200) {
            if(res.attachment.length === 0){
              this.$message.error('该用户未注册');
            } else {
              let uid = res.attachment[0].userId
              resetCancelTime({
                userId: uid,
              }).then(res => {
                if (res.status === 200) {
                  this.$message.success('重置次数成功')
                  // this.$message.success(res.message)
                } else {
                  this.$message.error('调起失败')
                  // this.$message.error(res.message)
                }
              })
            }
          } else {
            this.$message.error(res.message)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
  },
}
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
}
</style>
