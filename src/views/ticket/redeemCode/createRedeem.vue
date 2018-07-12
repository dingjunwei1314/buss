<template>
  <div class="create-redeem">
    <div class="ticket-item">
      <label class="item-label" for="">选择优惠券：</label>
      <el-select class="input-item" v-model="form.id" filterable remote clearable placeholder="请选择" :remote-method="remoteSort">
        <el-option
          v-for="item in couponOptions"
          :key="item.id"
          :label="item.title + ' (id:' + item.id + ')'"
          :value="item.id">
        </el-option>
      </el-select>
    </div>

    <div class="ticket-item">
      <label class="item-label" for="">兑换码数量：</label>
      <el-input class="input-item" v-model="form.num" type="number" placeholder="请输入内容"></el-input>
    </div>

    <div class="ticket-item">
      <label class="item-label" for="">兑换码相同：</label>
      <el-radio v-model="form.ctype" label="1">是</el-radio>
      <el-radio v-model="form.ctype" label="2">否</el-radio>
    </div>

    <div class="ticket-item">
      <label class="item-label top" for="">描述(非必填)：</label>
      <el-input class="textarea-item" v-model="form.content" type="textarea" :row="3" placeholder="请输入内容"></el-input>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </div>
</template>

<script>
  import { getCoupon, createRedeem } from '@/api'
  import { getUserId } from '@/utils/auth'
  export default {
    data () {
      return {
        form: {
          id: '',
          num: 0,
          ctype: '1',
          content: '',
          operation_id: ''
        },
        couponOptions: []
      }
    },
    created () {
      this.getCoupons()
      this.form.operation_id = getUserId()
    },
    methods: {
      getCoupons (query) {
        const params = {
          source: '2',
          title: query
        }
        getCoupon(params).then((res) => {
          this.couponOptions = res
        })
      },
      remoteSort (query) {
        this.getCoupons(query)
      },
      submit () {
        if (this.form.num > 50000) {
          this.$message.error('最多一次生成50000条')
          return
        }
        if (this.form.content && this.form.content.length > 200) {
          this.$message.error('描述长度最多200字')
          return
        }
        createRedeem(this.form).then((res) => {
          this.$message.success('生成成功')
          this.$emit('close')
        })
      }
    }
  }
</script>

<style lang="scss">
  .create-redeem {
    .ticket-item {
      margin-bottom: 10px;
      .item-label {
        display: inline-block;
        width: 120px;
        text-align: right;
      }
      .input-item {
        display: inline-block;
        width: 400px;
      }
      .textarea-item {
        display: inline-block;
        width: 600px;
      }
      .top {
        vertical-align: top;
      }
    }
  }
</style>
