<template>
  <el-table :data="data" highlight-current-row border :stripe="true" v-loading="childListLoading" class="filter-box" :header-row-style="{backgroundColor: '#f6f6f6'}" style="width: 100%;" @sort-change='tellFather' header-align="center">
    <template v-for="colConfig in colConfigs">
      <slot v-if="colConfig.slot" :name="colConfig.slot"></slot>
      <component
        v-else-if="colConfig.component"
        :is="colConfig.component" 
        :col-config="colConfig">
      </component>
      <el-table-column v-else v-bind="colConfig"></el-table-column>
    </template>  
  </el-table>
</template>

<script>
export default {
  props:['colConfigs','data','childListLoading'],
  methods:{
    tellFather(args){
      this.$emit('child-sort-change',args)
    }
  }
}
</script>
