<template>
  <div class="ticket-type">
    <el-row>
      <el-col :span="9" :offset="3" v-for="(item, key) in types" :key="key" v-if="item.number !== '0'">
        <div class="type-item" @click="chooseType(item)">
          <div>{{ item.name }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    props: {
      types: {
        type: Array
      }
    },
    methods: {
      chooseType (item) {
        this.$emit('chooseType', item.number)
      }
    }
  }
</script>
<style lang="scss">
  .ticket-type {
    .type-item {
      border-radius: 8px;
      width: 212px;
      height: 120px;
      line-height: 120px;
      margin-bottom: 15px;
      text-align: center;
      font-size: 30px;
      background: radial-gradient(transparent 0, transparent 3px, #409EFF 4px);
      background-size: 15px 15px;
      background-position: 9px 3px;

      & > div {
        width: 200px;
        height: 120px;
        margin: 0 auto;
        background-color: #fff;
        border-top: 1px solid #409EFF;
        border-bottom: 1px solid #409EFF;

        &:hover {
          background-color: #a5d0fc;
          color: #fff;
        }
      }
    }
  }
</style>
