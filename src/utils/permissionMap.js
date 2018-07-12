/* eslint-disable */
const menuCode = {
  home: '1',                  // 首页
  userCore: '2',              // 用户中心
  userEdit: '3',              // 修改资料
  permissionManage: '4',      // 权限管理
  roleManage: '6',            // 角色管理
  accountManage: '7',         // 账户管理
  serveCity: '8',             // 服务城市管理
  cityManage: '9',            // 城市管理
  system: '10',               // 系统管理
  menuManage: '11',           // 菜单管理
  logManage: '12',            // 日志管理
  couponManage: '13',         // 优惠券管理
  couponList: '14',           // 优惠券列表
  couponCode: '15',           // 优惠券兑换码
  grantCoupon: '16',          // 发放优惠券
  redressCoupon: '17',        // 补偿优惠券
  couponRecord: '18',         // 优惠券领取记录
  orderManage: '19',          // 订单管理
  orderList: '20',            // 订单列表
  abnormal: '21'              // 异常订单
}

const funcCode = {
  addRole: '1',               // 添加角色     --------------------  access/role/add
  editRole: '2',              // 修改角色     --------------------  access/role/edit
  allotRole: '3',             // 分配权限     --------------------  access/role/config
  roleStatus: '4',            // 启用/禁用角色   ------------------  access/role/status
  addAccount: '5',            // 添加账号     --------------------  access/account/add         
  editAccount: '6',           // 修改账号     --------------------  access/account/edit
  delAccount: '7',            // 删除账号     --------------------  access/account/del
  accountView: '38',          // 查看账号     --------------------  access/account/view
  accountStatus: '8',         // 启用/禁用账号   ------------------  access/account/add
  accountExport: '9',         // 导出当前账户列表   ----------------  access/account/export
  accountExportAll: '10',     // 导出全部账户列表   ----------------  access/account/exports
  addCity: '11',              // 添加城市     --------------------   city/city/add
  cityStatus: '14',           // 启用/禁用城市   ------------------  city/city/status
  couponAdd: '15',            // 添加优惠券    --------------------  activity/coupon/add
  couponStatus: '16',         // 启用/禁用优惠券  -----------------   activity/coupon/status
  couponDel: '17',            // 删除优惠券    --------------------  activity/coupon/del
  couponView: '18',           // 优惠券详情    --------------------  activity/coupon/view
  couponRelease: '19',        // 快速发放优惠券    -----------------  activity/coupon/release
  couponExport: '20',         // 导出当前优惠券列表  ---------------  activity/coupon/export
  couponExportAll: '21',      // 导出全部优惠券列表  ---------------  activity/coupon/exports
  redeemAdd: '22',            // 生成兑换码    --------------------  activity/redeem/add
  redeemStatus: '23',         // 暂停/回复兑换码   -----------------  activity/redeem/status
  codeList: '24',             // 查看兑换码       -----------------  activity/code/list
  codeExport: '25',           // 导出当前兑换码（查看）列表  ---------  activity/code/export
  codeExportAll: '26',        // 导出全部兑换码（查看）列表  ---------  activity/code/exports
  publishCoupon: '27',        // 单/批量用户发放优惠券  -------------  activity/publish/add
  publishExport: '28',        // 导出当前发放列表   ----------------  activity/publish/export
  publishExportAll: '29',     // 导出全部发放列表   ----------------  activity/publish/exports
  redressAdd: '30',           // 补偿用户优惠券    -----------------  activity/redress/add
  redressExport: '31',        // 导出当前补偿优惠券列表  ------------  activity/redress/export
  redressExportAll: '32',     // 导出全部补偿优惠券列表  ------------  activity/redress/exports
  recordExport: '33',         // 导出当前优惠券记录列表  ------------  activity/record/export
  recordExportAll: '34',      // 导出全部优惠券记录列表  ------------  activity/record/exports
  logView: '35',              // 查看日志   -----------------------  system/log/view
  userCoreEdit: '36',         // 用户个人资料修改  -----------------  home/home/edit
  roleList: '37',             // 获取权限   -----------------------  access/role/config-list

  rentOrderExport:'38',
  rentOrderExportAll:'39',
  finishOrderExport:'40',
  finishOrderExportAll:'41',
  unusualOrderExport:'42',
  unusualOrderExportAll:'43',
  
}

export { menuCode, funcCode }
/* eslint-disable */
