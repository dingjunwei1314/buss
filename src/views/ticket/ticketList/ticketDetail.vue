<template>
  <div class="ticket-detail">
    <div class="detail-item">
      <label class="item-label" for="">优惠券类型：</label>
      <span class="show-item">{{ data && data.stype }}</span>
    </div>

    <div class="detail-item">
      <label class="item-label" for="">渠道：</label>
      <span class="show-item">{{ data && data.source }}</span>
    </div>

    <div class="detail-item">
      <label class="item-label" for="">ID：</label>
      <span class="show-item">{{ data && data.id }}</span>
    </div>

    <div class="detail-item">
      <label class="item-label" for="">添加时间：</label>
      <span class="show-item">{{ data && parseTime(data.create_time) }}</span>
    </div>

    <div class="detail-item">
      <label class="item-label" for="">优惠券名称：</label>
      <span class="show-item">{{ data && data.title }}</span>
    </div>

    <div class="detail-item">
      <label class="item-label" for="">有效期：</label>
      <span class="show-item">{{ data && data.effective_type_time }}</span>
    </div>

    <div class="detail-item">
      <label class="item-label" for="">是否限时：</label>
      <span class="show-item">{{ data && data.is_limit_time }}</span>
    </div>

    <div class="detail-item">
      <label class="item-label" for="">优惠券面额：</label>
      <span class="show-item">{{ data && data.arrValue }}</span>
    </div>

    <div class="detail-item">
      <label class="item-label" for="">使用规则：</label>
      <span class="show-item">{{ data && data.regulations }}</span>
    </div>

    <div class="detail-item">
      <label class="item-label" for="">可用城市：</label>
      <span class="show-item">{{ data && data.city_code }}</span>
    </div>

    <div class="detail-item">
      <label class="item-label" for="">可用车辆级别：</label>
      <span class="show-item">{{ data && data.car_level }}</span>
    </div>

    <!-- <div class="detail-item">
      <label class="item-label" for="">可用车型：</label>
      <el-select v-model="value" placeholder="请选择"></el-select>
    </div> -->

    <div class="detail-item">
      <label class="item-label" for="">可用用户级别：</label>
      <span class="show-item">{{ data && data.user_level }}</span>
    </div>

    <div class="detail-item">
      <label class="item-label" for="">使用说明：</label>
      <span class="show-item">{{ data && data.content }}</span>
    </div>

    <div class="detail-item">
      <label class="item-label" for="">备注：</label>
      <span class="show-item">{{ data && data.remark }}</span>
    </div>

  </div>
</template>

<script>
  import { getDetail } from '@/api'
  import { parseTime } from '@/utils'
  export default {
    props: {
      id: {
        type: String
      }
    },
    data () {
      return {
        parseTime: parseTime,
        data: null
      }
    },
    watch: {
      id (val) {
        if (val) {
          this.getCouponDetail(val)
        }
      }
    },
    created () {
      this.getCouponDetail(this.id)
    },
    methods: {
      getCouponDetail (id) {
        const params = {
          id: id
        }
        getDetail(params).then((res) => {
          this.data = res
        })
      }
    }
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
</style>
