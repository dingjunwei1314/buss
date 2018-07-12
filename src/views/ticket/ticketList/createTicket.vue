<template>
  <div class="create-ticket">
    <div class="ticket-item">
      <label class="item-label" for="">优惠券名称：</label>
      <el-input class="input-item" v-model="form.title" placeholder="请输入内容"></el-input>
    </div>

    <div class="ticket-item">
      <label class="item-label" for="">有效期：</label>
      <el-select class="middle-item" v-model="form.effective_type" placeholder="请选择">
        <el-option label="可用日期" value="1"></el-option>
        <el-option label="领取日期" value="2"></el-option>
      </el-select>
      <template v-if="form.effective_type === '1'">
        <el-date-picker class="input-item" v-model="expiryDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </template>
      <template v-if="form.effective_type === '2'">
        <span class="inline-ml">自领取之日起<el-input class="small-item" v-model="form.day" type="number" min="1"/>天内有效</span>
      </template>
    </div>

    <div class="ticket-item">
      <label class="item-label" for="">是否限时：</label>
      <el-select class="input-item" v-model="form.is_limit" placeholder="请选择" @change="resetLimit">
        <el-option label="不限" value="0"></el-option>
        <el-option label="限时可用（每天内时间段）" value="1"></el-option>
        <el-option label="限时可用（日期）" value="2"></el-option>
        <el-option v-if="form.stype === '3'" label="限时优惠" value="3"></el-option>
      </el-select>
      <template v-if="form.is_limit === '1' || form.is_limit === '3'">
        <el-time-picker
          class="input-item"
          is-range
          v-model="limitTime"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围">
        </el-time-picker>
      </template>
      <template v-if="form.is_limit === '2'">
        <el-date-picker
          class="time-item"
          v-model="limitDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </template>
    </div>

    <div class="ticket-item" v-if="form.stype !== '3'">
      <label class="item-label" for="">优惠券面额：</label>
      <el-input class="middle-item" v-model="form.money" placeholder="元" type="number"></el-input>
      <span>元</span>
    </div>
    <!-- 折扣券 -->
    <div class="ticket-item" v-if="form.stype === '3'">
      <label class="item-label" for="">优惠券折扣：</label>
      <el-input class="input-item" v-model="form.discount" placeholder="请输入内容"></el-input>
      <span>折</span>
      <span class="remark">注：(八折直接输入8，0折为免费)</span>
    </div>
    <!-- 限免券 -->
    <!-- <div class="ticket-item" v-if="form.stype === '4'">
      <label class="item-label" for="">免费时长：</label>
      <el-input class="input-item" v-model="form.money" placeholder="请输入内容"></el-input>
    </div> -->
    
    <!-- 满减券 -->
    <!-- <div class="ticket-item" v-if="form.stype === '1'">
      <label class="item-label" for="">使用规则：</label>
      <el-select class="input-item" v-model="form.r_id" placeholder="请选择">
        <el-option
          v-for="item in roleOptions"
          :key="item.number"
          :label="item.instruction"
          :value="item.number">
        </el-option>
      </el-select>
      <template v-if="form.stype === '1'">
        <span class="inline-ml">满<el-input class="small-item" v-model="form.full_money" type="number" />元可用</span>
      </template>
    </div> -->

    <div class="ticket-item">
      <label class="item-label" for="">使用规则：</label>
      <el-select class="input-item" v-model="form.r_id" placeholder="请选择">
        <el-option
          v-for="item in roleOptions"
          :key="item.number"
          :label="item.instruction"
          :value="item.number">
        </el-option>
      </el-select>
      <!-- 满减券 -->
      <template v-if="form.stype === '1'">
        <span class="inline-ml">满<el-input class="small-item" v-model="form.full_money" type="number" />元可用</span>
      </template>
    </div>

    <!-- 折扣券 -->
    <div class="ticket-item" v-if="form.stype === '3'">
      <label class="item-label" for="">最高可优惠额度：</label>
      <el-input class="middle-item" v-model="form.quota_money" placeholder="请输入内容" type="number" min="0"></el-input>
      <span>元</span>
    </div>
  
    <div class="ticket-item">
      <label class="item-label" for="">可用城市：</label>
      <span class="checked-city" v-if="cityMap(form.city_code)" v-html="cityMap(form.city_code)"></span>
      <el-button type="info" @click="showChooseCity = true">选择城市</el-button>
      <template v-if="showChooseCity">
        <el-radio-group class="city-box" v-model="checkCityAll" @change="selectAllCity">
          <el-radio label="0">全国城市</el-radio>
          <br />
          <el-radio label="1" class="word-space">
            <el-checkbox-group class="inline" v-model="form.city_code" :disabled="disabled">
              <el-checkbox v-for="city in cities" :label="city.baiduid" :key="city.citycode">{{city.cityname}}</el-checkbox>
            </el-checkbox-group>
          </el-radio>
        </el-radio-group>
      </template>
    </div>

    <div class="ticket-item">
      <label class="item-label" for="">可用车辆级别：</label>
      <el-checkbox :indeterminate="isCarLevelAll" v-model="checkCarAll" @change="checkCarAllChange">全部级别</el-checkbox>
      <el-checkbox-group class="inline" v-model="form.car_level" @change="carSelectChange">
        <el-checkbox v-for="level in carLevels" :label="level.value" :key="level.value">{{level.label}}</el-checkbox>
      </el-checkbox-group>
    </div>

   <!--  <div class="ticket-item">
      <label class="item-label" for="">可用车型：</label>
      <el-select class="input-item" v-model="carType" placeholder="请选择"></el-select>
    </div> -->

    <div class="ticket-item">
      <label class="item-label" for="">可用用户级别：</label>
      <el-checkbox :indeterminate="isUserLevelAll" v-model="checkUserAll" @change="checkUserAllChange">全部级别</el-checkbox>
      <el-checkbox-group class="inline" v-model="form.user_level" @change="userSelectChange">
        <el-checkbox v-for="level in userLevels" :label="level.value" :key="level.value">{{level.label}}</el-checkbox>
      </el-checkbox-group>
    </div>

    <div class="ticket-item">
      <label class="item-label" for="">渠道：</label>
      <el-select class="input-item" v-model="form.source" placeholder="请选择">
        <el-option v-for="(item, key) in sourceOptions" :key="item" :label="item" :value="key">
        </el-option>
      </el-select>
    </div>

    <div class="ticket-item">
      <label class="item-label top" for="">使用说明：</label>
      <el-input class="textarea-item" v-model="form.content" type="textarea" :row="3" placeholder="请输入内容"></el-input>
    </div>

    <div class="ticket-item">
      <label class="item-label top" for="">备注(非必填)：</label>
      <el-input class="textarea-item" v-model="form.remark" type="textarea" :row="3" placeholder="请输入内容"></el-input>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>

  </div>
</template>

<script>
  import { getRoles, submitCreateTicket, getSource } from '@/api'
  import { getUserId } from '@/utils/auth'
  import moment from 'moment'
  const carLevels = [{
    label: 'S级',
    value: '1'
  }, {
    label: 'M+级',
    value: '2'
  }, {
    label: 'S+级',
    value: '3'
  }]
  const userLevels = [{
    label: 'A级',
    value: '1'
  }, {
    label: 'AA级',
    value: '2'
  }]
  export default {
    data () {
      return {
        cities: [],
        form: {
          title: '',
          stype: '',
          effective_type: '', // 有效期类型
          start_time: '',
          end_time: '',
          money: '',
          full_money: '',
          r_id: '1',
          day: '',
          is_limit: '0',
          limit_starttime: '',
          limit_endtime: '',
          discount: '', // 折扣
          quota_money: '', //最高可优惠额度
          city_code: ['0'],
          car_level: ['0'],
          user_level: ['0'],
          source: '',
          content: '',
          remark: ''
        },
        expiryDate: [],
        limitDate: [],
        limitTime: [new Date(), new Date()],
        roleOptions: [],
        carLevels: carLevels,
        userLevels: userLevels,
        isCarLevelAll: false,
        checkCarAll: true,
        isUserLevelAll: false,
        checkUserAll: true,
        showChooseCity: false,
        checkCityAll: '0',
        submitSign: true,
        sourceOptions: [],
        disabled: true
      }
    },
    watch: {
      expiryDate (val) {
        if (val.length > 0) {
          this.form.start_time = moment(val[0]).format('YYYY-MM-DD') + ' 00:00:00'
          this.form.end_time = moment(val[1]).format('YYYY-MM-DD') + ' 23:59:59'
        }
      },
      limitTime (val) {
        if (val.length > 0) {
          this.form.limit_starttime = moment(val[0]).format('HH:mm:ss')
          this.form.limit_endtime = moment(val[1]).format('HH:mm:ss')
        }
      },
      limitDate (val) {
        if (val.length > 0) {
          this.form.limit_starttime = moment(val[0]).format('YYYY-MM-DD') + ' 00:00:00'
          this.form.limit_endtime = moment(val[1]).format('YYYY-MM-DD') + ' 23:59:59'
        }
      }
    },
    created () {
      this.form.stype = this.$store.getters.couponType
      this.cities = this.$store.getters.cities
      this.form.operation_id = getUserId()
      this.getRole()
      // 全选状态
      carLevels.map((x) => {
        this.form.car_level.push(x.value)
      })
      userLevels.map((x) => {
        this.form.user_level.push(x.value)
      })
      this.getSource()
    },
    methods: {
      getRole () {
        getRoles().then((res) => {
          this.roleOptions = res
        })
      },
      getSource () {
        getSource().then(res => {
          this.sourceOptions = res
        })
      },      
      // 可用车辆等级全选
      checkCarAllChange (val) {
        let allLevel = []
        this.carLevels.map((x) => {
          allLevel.push(x.value)
        })
        allLevel.unshift('0') // 服务端要求全部时要多传0
        this.form.car_level = val ? allLevel : []
        this.isCarLevelAll = false
      },
      // 车辆等级全选状态判断
      carSelectChange (value) {
        let carCount = this.carLevels.length
        if (value.length === carCount || value.length < carCount) {
          if (value.includes('0')) {
            this.form.car_level.splice(this.form.car_level.findIndex(y => y === '0'), 1)
          } else if (value.length === carCount) {
            this.form.car_level.unshift('0')
            carCount += 1
          }
        } else {
          this.form.car_level.unshift('0')
          carCount += 1
        }
        let checkedCount = value.length
        this.checkCarAll = checkedCount === carCount
        this.isCarLevelAll = checkedCount > 0 && checkedCount < carCount
      },
      // 用户等级全选
      checkUserAllChange (val) {
        let allLevel = []
        this.userLevels.map((x) => {
          allLevel.push(x.value)
        })
        allLevel.unshift('0') // 服务端要求全部时要多传0
        this.form.user_level = val ? allLevel : []
        this.isUserLevelAll = false
      },
      // 用户全选状态判断
      userSelectChange (value) {
        let userCount = this.userLevels.length
        if (value.length === userCount || value.length < userCount) {
          // 已选的小于等于全等级的 即非全选
          if (value.includes('0')) {
            // 非全选状态 如果有0 则删除0
            this.form.user_level.splice(this.form.user_level.findIndex(y => y === '0'), 1)
          } else if (value.length === userCount) {
            // 选中的等于全等级长度 说明用户重新选择了全部 加上0
            this.form.user_level.unshift('0')
            userCount += 1
          }
        } else {
          this.form.user_level.unshift('0')
          userCount += 1
        }
        let checkedCount = value.length
        this.checkUserAll = checkedCount === userCount
        this.isUserLevelAll = checkedCount > 0 && checkedCount < userCount
      },
      // 可用城市全选
      selectAllCity (val) {
        if (val == '0') {
          this.disabled = true
          this.form.city_code = ['0']
        } else {
          this.disabled = false
          this.form.city_code = []
        }
      },
      cityMap (citycode) {
        if (typeof citycode === 'object' && citycode.length > 0) {
          let cityArr = []
          this.cities.map((x) => {
            citycode.map((y) => {
              if (y === x.baiduid) {
                cityArr.push(x.cityname)
              }
            })
          })
          return cityArr.join('、')
        }
      },
      resetLimit () {
        this.form.limit_starttime = ''
        this.form.limit_endtime = ''
      },
      submit () {
        if (!this.submitSign) {
          return
        }
        this.submitSign = false
        // getWay 数组传值 转换
        let params = {}
        for (let i in this.form) {
          if (i === 'city_code') {
            params['city_code'] = this.form[i].join(',')
          } else if (i === 'user_level') {
            params['user_level'] = this.form[i].join(',')
          } else if (i === 'car_level') {
            params['car_level'] = this.form[i].join(',')
          } else {
            params[i] = this.form[i]
          }
        }
        if (!params['city_code']) {
          this.$message.error('请选择可用城市')
          this.submitSign = true
          return
        }
        submitCreateTicket(params).then((res) => {
          this.submitSign = true
          this.$message.success('添加成功')
          this.$emit('close')
        }).catch((err) => {
          this.submitSign = true
          console.log(err)
        })
      }
    }
  }
</script>

<style lang="scss">
  .create-ticket {
    .ticket-item {
      margin-bottom: 10px;
      .item-label {
        display: inline-block;
        width: 120px;
        text-align: right;
      }
      .top {
        vertical-align: top;
      }
      .input-item {
        display: inline-block;
        width: 400px;
      }
      .time-item {
        display: inline-block;
        width: 430px;
      }
      .middle-item {
        display: inline-block;
        width: 200px;
      }
      .small-item {
        display: inline-block;
        width: 100px;
      }
      .inline-ml {
        margin-left: 10px;
      }
      .textarea-item {
        width: 600px;
      }
      .inline {
        display: inline-block;
        margin-left: 10px;
      }
      .city-box {
        border: 1px solid #ddd;
        border-radius: 6px;
        width: 620px;
        // width: 300px;
        margin-top: 6px;
        margin-left: 124px;
        padding: 10px;
        // position: relative;

        // & > i {
        //   position: absolute;
        //   top: 2px;
        //   right: 2px;
        //   cursor: pointer;
        // }
        .word-space {
          white-space: initial;
        }
      }
      .checked-city {
        display: inline-block;
        max-width: 600px;
        border: 1px solid #ddd;
        padding: 7px;
        border-radius: 6px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        vertical-align: middle;
      }
      .quota {
        display: inline-block;
      }
      .no-quota {
        display: inline-block;
        margin-top: 6px;
      }
      .remark {
        margin-left: 20px;
        color: red;
      }
    }
  }
</style>
