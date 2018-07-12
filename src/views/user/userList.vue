<template>
  <div class="personal-page">
    <div class="table-filter lang-filter">


      <div class="filter-item">
        <label for="created-time">注册时间：</label>
        <el-date-picker name="" v-model="createTime" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </div>

      <div class="filter-item">
        <label for="created-time">身份认证提交时间：</label>
        <el-date-picker name="" v-model="licenseTime" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </div>

      <div class="filter-item">
        <label for="created-time">人工审核时间：</label>
        <el-date-picker name="" v-model="examineTime" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </div>

      <div class="filter-item">
        <label for="created-time">账号状态：</label>
        <el-select name="ticket-type" v-model="filterForm.status" size="small" filterable clearable  class="filter-box">
          <el-option
            v-for="item in accountStatus"
            :key="item.number"
            :label="item.name"
            :value="item.number">
          </el-option>
        </el-select>
      </div>

      <div class="filter-item">
        <label for="created-time">身份认证状态：</label>
        <el-select name="ticket-type" v-model="filterForm.identityStatus" size="small" filterable clearable  class="filter-box">
          <el-option
            v-for="item in idCardStatus"
            :key="item.number"
            :label="item.name"
            :value="item.number">
          </el-option>
        </el-select>
      </div>

      <div class="filter-item">
        <label for="created-time">驾驶证状态：</label>
        <el-select name="ticket-type" v-model="filterForm.licenseStatus" size="small" filterable clearable  class="filter-box">
          <el-option
            v-for="item in licenseStatus"
            :key="item.number"
            :label="item.name"
            :value="item.number">
          </el-option>
        </el-select>
      </div>


      <div class="filter-item">
        <label for="">用户姓名：</label>
        <el-input class="filter-box" v-model="filterForm.fullName" size="small" @keyup.enter.native="search"></el-input>
      </div>


      <div class="filter-item">
        <label for="">用户账号：</label>
        <el-input class="filter-box" v-model="filterForm.phoneNum" size="small" @keyup.enter.native="search"></el-input>
      </div>

      <div class="filter-item">
        <label for="">身份证号：</label>
        <el-input class="filter-box" v-model="filterForm.identityCardNum" size="small" @keyup.enter.native="search"></el-input>
      </div>

      <div class="filter-item">
        <label for="">用户ID：</label>
        <el-input class="filter-box" v-model="filterForm.userId" size="small" @keyup.enter.native="search"></el-input>
      </div>


      <div class="filter-item">
        <label for="">注册渠道：</label>
        <el-select name="ticket-type" v-model="filterForm.platform" size="small" filterable clearable  class="filter-box">
          <el-option
            v-for="item in platforms"
            :key="item.number"
            :label="item.name"
            :value="item.number">
          </el-option>
        </el-select>
      </div>

      

      <div class="search-button inline-block">
        <el-button type="primary" size="small" @click="search">查询</el-button>
        <el-button type="ghost" size="small" style="margin-left: 8px" @click="reset">重置</el-button>
      </div>
    </div>

    <div class="func-btn">
      <!-- <el-button type="primary" size="small" @click="">添加卡包</el-button> -->
      <el-button  type="primary" size="small" :loading="btnLoading" @click="exportData">导出当前列表</el-button>
      <p style="color:#1c2438;font-size:12px;padding-left:10px;display:inline-block">注：导出功能仅支持最多前2w条数据</p>
      <!-- <el-button  type="primary" size="small" :loading="btnLoading" @click="exportData($event, true)">导出全部列表</el-button> -->
    </div>

    <el-table :data="list" highlight-current-row border :stripe="true" v-loading="listLoading" style="width: 100%;" class="filter-box" :header-row-style="{backgroundColor: '#f6f6f6'}" @sort-change="sortTable">
      <el-table-column align="center" label="用户ID" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="账号" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.phoneNum }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="姓名" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.fullName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="账户状态" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span v-if="scope.row.status=='0'">初始化</span>
          <span v-if="scope.row.status=='10'">审核中</span>
          <span v-if="scope.row.status=='15'">审核驳回</span>
          <span v-if="scope.row.status=='18'">机审通过</span>
          <span v-if="scope.row.status=='20'">正常状态</span>
          <span v-if="scope.row.status=='100'">非法用户</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="身份认证状态" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span v-if="scope.row.identityStatus=='10'">未审核</span>
          <span v-if="scope.row.identityStatus=='11'">审核中</span>
          <span v-if="scope.row.identityStatus=='12'">失败</span>
          <span v-if="scope.row.identityStatus=='13'">成功</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="驾驶证状态" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span v-if="scope.row.identityStatus=='10'">未认证</span>
          <span v-if="scope.row.identityStatus=='11'">认证中</span>
          <span v-if="scope.row.identityStatus=='12'">认证失败</span>
          <span v-if="scope.row.identityStatus=='13'">认证通过</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="注册渠道" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span v-if="scope.row.platform=='0'">默认</span>
          <span v-if="scope.row.platform=='1'">安卓</span>
          <span v-if="scope.row.platform=='2'">ios</span>
          <span v-if="scope.row.platform=='3'">微信小程序</span>
          <span v-if="scope.row.platform=='4'">微信公众号</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="注册时间" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime.slice(0,4)=='1970'? '':scope.row.createTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="身份认证提交时间" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.commitLicenseTime.slice(0,4)=='1970'? '':scope.row.commitLicenseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="人工审核时间" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.examineTime.slice(0,4)=='1970'? '':scope.row.examineTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button class="action" type="text" @click="viewInfo(scope)">查看</el-button>
          <el-button class="action" type="text" @click="viewWallet(scope)">钱包</el-button>
          <el-button class="action" type="text" @click="changeStatus(scope)">
            <span v-if="scope.row.status==100">启用</span>
            <span v-else>禁用</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="filterForm.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="filterForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <el-dialog licensePictureCopy :title="createTitle" :close-on-press-escape="false" :visible.sync="viewInfoDialog" width="1000px" top="96px" :close-on-click-modal="false">
      <div id="viewBox">
        <p class="tab-tit">基本信息</p>
        <el-row class="tab-con">
          <el-row>
            <el-col :span="12">
              <div class="detail-item">
                <label class="item-label" for="">用户ID：</label>
                <span class="show-item">{{ data && data.userId }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <label class="item-label" for="">账号：</label>
                <span class="show-item">{{ data && data.phoneNum }}</span>
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <div class="detail-item">
                <label class="item-label" for="">姓名：</label>
                <span class="show-item">{{ data && data.fullName }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <label class="item-label" for="">身份证号：</label>
                <span class="show-item">{{ data && data.identityCardNum }}</span>
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <div class="detail-item">
                <label class="item-label" for="">昵称：</label>
                <span class="show-item">{{ data && data.name }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <label class="item-label" for="">信用等级：</label>
                <span class="show-item">{{ data && data.level }}</span>
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <div class="detail-item">
                <label class="item-label" for="">认证方式：</label>
                <span class="show-item">{{ data && data.authType }}</span>
                
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <label class="item-label" for="">芝麻信用分：</label>
                <span class="show-item">{{ data && data.zmSource }}</span>
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <div class="detail-item">
                <label class="item-label" for="">账号状态：</label>
                <span class="show-item" v-if="data.status=='0'">初始化</span>
                <span class="show-item" v-if="data.status=='10'">审核中</span>
                <span class="show-item" v-if="data.status=='15'">审核驳回</span>
                <span class="show-item" v-if="data.status=='18'">机审通过</span>
                <span class="show-item" v-if="data.status=='20'">正常状态</span>
                <span class="show-item" v-if="data.status=='100'">非法用户</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <label class="item-label" for="">信用认证时间：</label>
                <span class="show-item">{{ data && data.authTime }}</span>
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <div class="detail-item">
                <label class="item-label" for="">注册时间：</label>
                <span class="show-item">{{ data && data.createTime }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <label class="item-label" for="">注册来源：</label>
                <span class="show-item" v-if="data.platform=='0'">默认</span>
                <span class="show-item" v-if="data.platform=='1'">安卓</span>
                <span class="show-item" v-if="data.platform=='2'">ios</span>
                <span class="show-item" v-if="data.platform=='3'">微信小程序</span>
                <span class="show-item" v-if="data.platform=='4'">微信公众号</span>
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <div class="detail-item">
                <label class="item-label" for="">驾驶证状态：</label>
                <span class="show-item" v-if="data.licenseStatus === 0">初始化</span>
                <span class="show-item" v-if="data.licenseStatus === 10">未认证</span>
                <span class="show-item" v-if="data.licenseStatus === 11">认证中</span>
                <span class="show-item" v-if="data.licenseStatus === 12">认证失败</span>
                <span class="show-item" v-if="data.licenseStatus === 13">认证通过</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <label class="item-label" for="">禁用备注：</label>
                <span class="show-item">{{ data && data.remark }}</span>
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <div class="detail-item">
                <div class="detail-item">
                  <label class="item-label top-label" for="">头像：</label>
                    <picPreview v-show="data.selfie !== '' && data.selfie !== null && data.selfie !== undefined" :backgroundPicUrl="PIC_URL+data.selfie" />
                </div>
              </div>
            </el-col>
            <el-col :span="12"> 
              <div class="detail-item">
                <label class="item-label" for="">性别：</label>
                <span v-if="data.gender==1" class="show-item">男性</span>
                <span v-else-if="data.gender==2" class="show-item">女性</span>
                <span v-else-if="data.gender==0" class="show-item">默认</span>
                <span v-else class="show-item"></span>
              </div>
              <div class="detail-item">
                <label class="item-label" for="">年龄：</label>
                <span class="show-item">{{ data && data.age }}</span>
              </div>
            </el-col>
          </el-row>
        </el-row>

        <p class="tab-tit">认证资料</p>
        <el-row class="tab-con">
          <el-row>
            <el-col :span="12">
              <div class="detail-item">
                <label class="item-label" for="">身份认证状态：</label>
                <span class="show-item" v-if="data.identityStatus=='10'">未审核</span>
                <span class="show-item" v-else-if="data.identityStatus=='11'">审核中</span>
                <span class="show-item" v-else-if="data.identityStatus=='12'">失败</span>
                <span class="show-item" v-else-if="data.identityStatus=='13'">成功</span>
                <span class="show-item" v-else></span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <label class="item-label" for="">身份认证提交时间：</label>
                <span class="show-item">{{ data && data.commitLicenseTime }}</span>
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <div class="detail-item">
                <label class="item-label" for="">人工审核时间：</label>
                <span class="show-item">{{ data && data.examineTime }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <label class="item-label" for="">人工审核失败原因：</label>
                <span class="show-item">{{ data && data.fileNumber }}</span>
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <div class="detail-item">
                <label class="item-label top-label" for="">身份证头像页照片：</label>
                <picPreview v-show="data.identityPositivePicture !== '' && data.identityPositivePicture !== null && data.identityPositivePicture !== undefined" :backgroundPicUrl="PIC_URL+data.identityPositivePicture" />
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <label class="item-label top-label" for="">身份证国徽页照片：</label>
                <picPreview v-show="data.identityOppositePicture !== '' && data.identityOppositePicture !== null && data.identityOppositePicture !== undefined" :backgroundPicUrl="PIC_URL+data.identityOppositePicture" />
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <div class="detail-item">
                <label class="item-label top-label" for="">驾驶证正本照片：</label>
                <picPreview v-show="data.drivingLicencePicture !== '' && data.drivingLicencePicture !== null && data.drivingLicencePicture !== undefined" :backgroundPicUrl="PIC_URL+data.drivingLicencePicture" />
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <label class="item-label top-label" for="">驾驶证副本照片：</label>
                <picPreview v-show="data.licensePictureCopy !== '' && data.licensePictureCopy !== null && data.licensePictureCopy !== undefined" :backgroundPicUrl="PIC_URL+data.licensePictureCopy" />
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <div class="detail-item">
                <label class="item-label top-label" for="">自拍照片：</label>
                <picPreview v-show="data.selfie !== '' && data.selfie !== null && data.selfie !== undefined" :backgroundPicUrl="PIC_URL+data.selfie" />
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24" v-show="userAuthFlag">
              <div class="detail-item">
                <label class="item-label top-label" for="">请选择拒绝原因：</label>
                <el-select v-model="fileNumber" size="small" placeholder="请选择拒绝原因">
                  <el-option
                    v-for="item in userAuthReason"
                    :key="item.id"
                    :label="item.describe"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <div class="action-btn">
                <el-button type="primary" :disabled="data.status === 0 || data.status === 20 || data.status === 100" @click="userAuth(true)">审核通过</el-button>
                <el-button type="danger" :disabled="data.status === 0 || data.status === 20 || data.status === 100 || data.status === 15" @click="userAuth(false)">审核拒绝</el-button>
                <!-- <el-button type="primary" @click="userAuth(true)">审核通过</el-button>
                <el-button type="danger" @click="userAuth(false)">审核拒绝</el-button> -->
              </div>
            </el-col>
          </el-row>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getUserList, viewInfo, changeStatus, getExportData, userAuth, searchUserAuthReason } from '@/api'
  import { PIC_URL } from '@/config/app'
  import { getUserId } from '@/utils/auth'
  import moment from 'moment'
  import picPreview from '../common/picPreview'
  // import md5 from '@/utils/md5'
  // import hasPermission from '@/utils/checkPermissions'
  export default {
    components: {
      picPreview
    },
    data () {
      return {
        PIC_URL,
        btnLoading: false,
        createTime: [],
        licenseTime: [],
        examineTime: [],
        list: [],
        listLoading: false,
        total: 0,
        filterForm: {
          page: 1,
          pageSize: 10,
          platform: '',
          userId: '',
          fullName: '',
          phoneNum: '',
          status: '',
          licenseStatus: '',
          identityStatus: '',
          identityCardNum: '',
          createStartTime: '',
          createEndTime: '',
          licenseStartTime: '',
          licenseEndTime: '',
          examineStartTime: '',
          examineEndTime: ''
        },
        accountStatus: [
          {number: 0, name: '初始化'},
          {number: 10, name: '审核中'},
          {number: 15, name: '审核驳回'},
          {number: 18, name: '机审通过'},
          {number: 20, name: '正常状态'},
          {number: 100, name: '非法用户'}
        ], // 所有账号状态
        idCardStatus: [
          {number: 10, name: '未审核'},
          {number: 11, name: '审核中'},
          {number: 12, name: '失败'},
          {number: 13, name: '成功'}
        ], // 所有身份证状态
        licenseStatus: [
          {number: 10, name: '未认证'},
          {number: 11, name: '认证中'},
          {number: 12, name: '认证失败'},
          {number: 13, name: '认证通过'}
        ], // 所有驾驶证状态
        platforms: [
          {number: 0, name: '默认'},
          {number: 1, name: '安卓'},
          {number: 2, name: 'ios'},
          {number: 3, name: '微信小程序'},
          {number: 4, name: '微信公众号'}
        ], // 渠道
        createTitle: '用户信息',
        viewInfoDialog: false,
        data: {},
        userAuthFlag:false,
        userAuthReason:[],
        fileNumber:'',
        operationReason:''
      }
    },
    created () {
      this.getUserList()
      this.searchUserAuthReason()
    },
    methods: {
      searchUserAuthReason () {// 获取拒绝原因
        searchUserAuthReason().then(res => {
          if (res.status === 200) {
            this.userAuthReason = res.attachment
          } else {
            this.$message.error(res.message)
            this.userAuthReason = []
          }
        })
      },
      getFilterParams () { // 搜索条件
        this.filterForm.createStartTime = ''
        this.filterForm.createEndTime = ''
        this.filterForm.licenseStartTime = ''
        this.filterForm.licenseEndTime = ''
        this.filterForm.examineStartTime = ''
        this.filterForm.examineEndTime = ''
        // console.log(this.createTime)
        if (this.createTime && this.createTime.length > 0) {
          this.filterForm.createStartTime = moment(this.createTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
          this.filterForm.createEndTime = moment(this.createTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
        }
        if (this.licenseTime && this.licenseTime.length > 0) {
          this.filterForm.licenseStartTime = moment(this.licenseTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
          this.filterForm.licenseEndTime = moment(this.licenseTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
        }
        if (this.examineTime && this.examineTime.length > 0) {
          this.filterForm.examineStartTime = moment(this.examineTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
          this.filterForm.examineEndTime = moment(this.examineTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
        }
      },
      getUserList () { // 获取数据
        this.getFilterParams()
        // console.log(this.filterForm)
        this.listLoading = true
        getUserList(this.filterForm).then((res) => {
          this.listLoading = false
          if (res.status === 200) {
            this.list = res.attachment.data
            this.total = res.attachment.totalSize
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
          console.log(err)
          this.listLoading = false
        })
      },
      viewInfo (scope, userId) { // 查看
        this.viewInfoDialog = true
        this.fileNumber = ''
        this.userAuthFlag = false
        let data = {
          userId: scope && scope.row && scope.row.userId || userId
        }
        // console.log(data)
        viewInfo(data).then((res) => {
          if (res.status === 200) {
            this.listLoading = false
            this.data = res.attachment
            this.userAuthReason.forEach(item => {
              if (item.id === +this.data.fileNumber) {
                this.data.fileNumber = item.describe
              }
            })
            if (this.data.authTime) {
              this.data.authTime = this.data.authTime.slice(0,4) === '1970'? '':this.data.authTime
            }
            if (this.data.commitLicenseTime) {
              this.data.commitLicenseTime = this.data.commitLicenseTime.slice(0,4) === '1970'? '':this.data.commitLicenseTime
            }
            if (this.data.createTime) {
              this.data.createTime = this.data.createTime.slice(0,4) === '1970'? '':this.data.createTime
            }
            if (this.data.examineTime) {
              this.data.examineTime = this.data.examineTime.slice(0,4) === '1970'? '':this.data.examineTime
            }
            setTimeout(() => {
              var idCarRE = new Viewer(document.getElementById('viewBox'), {
                url: 'data-original'
              })
            }, 1000)
            // console.log(this.data)
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
          console.log(err)
          this.listLoading = false
        })
      },
      viewWallet (scope) {
        this.$router.push({
          path: `/user/walletList/${scope.row.userId}`,
        })
      },
      exportData () { // 导出
        let data = {}
        this.getFilterParams()
        this.btnLoading = true
        for (let i in this.filterForm) {
          if (i !== 'page' && i !== 'pageSize') {
            data[i] = this.filterForm[i]
          }
        }
        data.pageSize = 20000
        let mypage = window.open()
        mypage.document.write('数据生成中，请稍后...')
        getExportData({url: '/oms/user/exportUser', data: data}).then(res => {
          if (res.status === 200) {
            mypage.location.href = res.attachment
            setTimeout(() => {
              mypage.close()
              if (this.total >= 20000 ) {
                this.$message.warning('导出成功，一次最多可以导出2万条数据')
              }
            }, 1000)
          } else {
            this.$message.error(res.message)
            mypage.close()
          }
        }).catch(err => {
          console.log(err)
          mypage.close()
        }).finally(() => {
          this.btnLoading = false
        })
      },
      changeStatus (scope) { // 禁用启用
        if (scope.row.status !== 100) {
          this.$prompt('禁用备注（必填）', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^.{1,500}$/,
            inputErrorMessage: '备注不能为空最多500字符'
          }).then(({ value }) => {
            let data = {
              userid: scope.row.userId,
              remark: value,
              sysUserId: getUserId(),
              status: 100
            }
            changeStatus(data).then((res) => {
              if (res.status === 200) {
                this.$message.success(res.message)
                this.getUserList()
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
              console.log(err)
            })
          }).catch(() => {})
        } else {
          this.$confirm('确认启用该账号？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let data = {
              userid: scope.row.userId,
              sysUserId: getUserId(),
              remark: '',
              status: 10
            }
            changeStatus(data).then((res) => {
              if (res.status === 200) {
                this.$message.success(res.message)
                this.getUserList()
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
              console.log(err)
            })
          }).catch(() => {
          })
        }
      },
      search () {
        this.getUserList()
      },
      reset () {
        for (let i in this.filterForm) {
          if (i !== 'page' && i !== 'pageSize') {
            this.filterForm[i] = ''
          }
        }
        this.createTime = []
        this.licenseTime = []
        this.examineTime = []
      },
      sortTable () {},
      handleSizeChange (value) {
        this.filterForm.pageSize = value
        this.getUserList()
      },
      handleCurrentChange (value) {
        this.filterForm.page = value
        this.getUserList()
      },
      userAuth (isPass) {
        if (isPass) {
          this.userAuthFlag = false
          let params = {
            userid: this.data.userId,
            identityStatus: isPass ? 13 : 12,
            licenseStatus: isPass ? 13 : 12,
            status: isPass ? 20 : 15,
            sysUserId: getUserId()
          }
          this.fileNumber = ''
          this.$confirm('确认通过审核吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            userAuth(params).then(res => {
              if (res.status === 200) {
                this.$message.success(res.message)
                this.getUserList()
                this.viewInfo(null, this.data.userId)
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
              console.log(err)
            })
          }).catch(() => {})
        } else {
          if (this.fileNumber !== '') {
            let operationReason = ''
            this.userAuthReason.forEach(item => {
              if (item.id === +this.fileNumber) {
                operationReason = item.describe
              }
            })
            let params = {
              userid: this.data.userId,
              identityStatus: isPass ? 13 : 12,
              licenseStatus: isPass ? 13 : 12,
              status: isPass ? 20 : 15,
              sysUserId: getUserId(),
              fileNumber: this.fileNumber,
              operationReason
            }
            this.$confirm('确认审核失败吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              userAuth(params).then(res => {
                if (res.status === 200) {
                  this.userAuthFlag = false
                  this.$message.success(res.message)
                  this.getUserList()
                  this.viewInfo(null, this.data.userId)
                } else {
                  this.$message.error(res.message)
                }
              }).catch(err => {
                console.log(err)
              })
            }).catch(() => {})
          } else {
            if (this.userAuthFlag) {
              this.$message.error('请先选择拒绝原因')
            } else {
              this.userAuthFlag = true
            }
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  .personal-page{
    .viewer-button{
      right: -20px!important;
    }
    .two-input{
      width:360px;
      display:inline-block;
      .two-input-flex{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%
      }
    }

    .detail-item {
      margin-bottom: 10px;
      .item-label {
        display: inline-block;
        width: 150px;
        min-height: 38px;
        text-align: right;
        line-height: 38px;
      }
      .top-label {
        vertical-align: top
      }
      .show-item {
        display: inline-block;
        width: 300px;
        min-height: 38px;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 6px;
        vertical-align: middle;
        word-break:break-all
      }
    }

    .tab-con{
      padding: 30px 10px; 
      border-top: 2px solid rgb(60, 141, 188);
    }
    .action-btn {
      margin-top: 20px;
      text-align: center;
    }
  }
  
</style>

