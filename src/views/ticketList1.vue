<template>
  <div class="ticket-list-page">
    <div class="table-filter">
      <div class="filter-item">
        <label for="created-time">添加时间：</label>
        <el-date-picker name="created-time" v-model="createdTime" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </div>

      <div class="filter-item">
        <label for="ticket-type">优惠券类型：</label>
        <el-select name="ticket-type" v-model="ticketType" size="small" filterable clearable placeholder="优惠券类型" class="filter-box">
          <el-option
            v-for="item in typeOptions"
            :key="item.number"
            :label="item.name"
            :value="item.number">
          </el-option>
        </el-select>
      </div>
  
      <div class="filter-item">
        <label for="ticket-status">优惠券状态：</label>
        <el-select name="ticket-status" v-model="ticketStatus" size="small" filterable clearable placeholder="优惠券类型" class="filter-box">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      
      <div class="filter-item">
        <label for="">优惠券名称：</label>
        <el-input class="filter-box" v-model="ticketName" size="small" @keyup.enter.native="search"></el-input>
      </div>

      <div class="filter-item">
        <label for="">优惠券ID ：</label>
        <el-input class="filter-box" v-model="ticketId" size="small" @keyup.enter.native="search"></el-input>
      </div>

      <div class="filter-item">
        <label for="">城市 ：</label>
        <el-input class="filter-box" v-model="city" size="small" @keyup.enter.native="search"></el-input>
      </div>      

      <div class="search-button inline-block">
        <el-button type="primary" size="small" @click="search">查询</el-button>
        <el-button type="ghost" size="small" style="margin-left: 8px" @click="reset">重置</el-button>
      </div>
    </div>

    <div class="func-btn">
      <el-button v-if="hasPermission(funcCode.couponAdd)" type="primary" size="small" @click="addTicket">添加优惠券</el-button>
      <!-- <el-button type="primary" size="small" @click="">添加卡包</el-button> -->
      <el-button v-if="hasPermission(funcCode.couponExport)" type="primary" size="small" @click="exportData($event)">导出当前列表</el-button>
      <el-button v-if="hasPermission(funcCode.couponExportAll)" type="primary" size="small" @click="exportData($event, true)">导出全部列表</el-button>
    </div>

    <el-table :data="list" highlight-current-row border :stripe="true" v-loading="listLoading" style="width: 100%;" class="filter-box" :header-row-style="{backgroundColor: '#f6f6f6'}" @sort-change="sortTable">
      <el-table-column align="center" label="ID" width="90" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" width="113" sortable="custom" prop="create_time">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.create_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="城市" width="90" sortable="custom" prop="city_code">
        <template slot-scope="scope">
          <span>{{ scope.row.city_code }}</span>
        </template>
      </el-table-column>      
      <el-table-column align="center" label="优惠券类型" width="120" sortable="custom" prop="stype">
        <template slot-scope="scope">
          <span>{{ scope.row.stype }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="优惠券名称" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="优惠券有效期" width="200">
        <template slot-scope="scope">
          <span v-html="scope.row.effective_type_time"></span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="优惠" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.arrValue }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="使用规则" min-width="260">
        <template slot-scope="scope">
          <span>{{ scope.row.regulations }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" sortable="custom" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '1'" type="success">可用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作人">
        <template slot-scope="scope">
          <span>{{ scope.row.user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button v-if="hasPermission(funcCode.couponView)" class="action" type="text" @click="showTicketDetail(scope.row)">查看</el-button>
          <el-button v-if="hasPermission(funcCode.couponStatus)" class="action" type="text" @click="editStatus(scope.row)">{{ scope.row.status === '1' ? '禁用' : '启用' }}</el-button>
          <el-button v-if="hasPermission(funcCode.couponDel)" class="action" type="text" @click="deleteTicket(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    
    <el-dialog :title="createTitle" :visible.sync="showCreate" width="1000px" top="96px" :close-on-click-modal="false">
      <ticket-type v-if="!isChooseType" :types="typeOptions" @chooseType="chooseType"></ticket-type>
      <create-ticket v-else @close="close"></create-ticket>
    </el-dialog>

    <el-dialog title="查看" :visible.sync="showDetail" width="800px" top="96px" :close-on-click-modal="false">
      <ticket-detail :id="couponId"></ticket-detail>
    </el-dialog>
  </div>
</template>

<script>
  import {getTicketList} from '@/api'
  export default{
    data () {
      return {

      }
    },
    created () {
    },
    methods: {
      getTicketList () {},
      getFilterParams () {
        
      }
    }  
  }
</script>