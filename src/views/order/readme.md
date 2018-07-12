# 订单列表调用的API


* getOrderList  // 获取订单列表
* getExceptionOrderList  // 获取异常状态的订单
* getOrderDetail  // 获取订单详情
* getCarInfo  // 查询车辆信息
* lockOrUnlock  // 异常状态-车 >>> 开门/锁门
* returnExceptionOrderCar  // 异常状态-车 >> 还车
* completeExceptionOrder  // 异常状态-订单 >>> 完成
* switchToException  // 正常-订单 >>> 转入异常状态

api >>> index.js <<< 各种api调用的封装

## getOrderList

### 参数

@ 必传
pageStatus    
timestamp     
sign  

@ 可选
userId
carId 
orderNum
orderTimeStart
orderTimeEnd  
fetchTimeStart
fetchTimeEnd  
returnTimeStart     
returnTimeEnd 
settlementTimeStart 
sellementTimeEnd    
cancelTimeStart     
cancelTimeEnd 
cancelStatus  
pageNum 
pageSize

"num"
"phone_num"
"name"
"uid"
"order_id"
"order_status"
"car_id"
"where_order_begin"
"where_car_return"
"return_car_memo"
"when_order_begin"
"when_car_rent"
"when_car_return"
"when_order_finish"
"total_account"
"actually_pay"
"isGuaranteed"
"operation"

序号
手机号
姓名
用户ID
订单号
订单状态
车辆ID
下单地址
取车地址
还车地址
还车备注
下单时间
取车时间
还车时间
结算时间
车费合计（元）
实付金额
是否免赔
操作




需要解决的问题：
* /order/orders-list 接口
  1.返回值里缺少【手机号码】 [已解决TODO:]
  2.下单地址？取车地址？ [已解决TODO: 下单地址指的是下单时车辆的地址 === 取车地址]
  3.实付金额是【计算所得】还是【服务端返回】？运营收入指的是？ [已解决]
  4.这个接口还需要返回一个字段，就是 自动取消数量（总） 和 主动取消数量（总） [已解决TODO: 放弃这个字段]

TODO:
1.对接API文档 √
2.制作请求体 √
3.分页绑定 √
4.功能按钮
5.permissonMap 编写
6.调整样式
7.联调 + 查漏补缺
  

```js
let arr1 = ["序号","手机号","姓名","用户ID","订单号","订单状态","车辆ID","下单地址","还车地址","还车备注","下单时间","取车时间","还车时间","结算时间","车费合计（元）","实付金额（元）","操作"];
let arr2 = ["序号","账号","姓名","用户ID","订单号","车辆ID","下单地址","下单时间","操作"]
let arr3 = ["序号","账号","姓名","用户ID","订单号","车辆ID","下单地址","下单时间","取车时间","操作"]
let arr4 = ["序号","账号","姓名","用户ID","订单号","车辆ID","下单地址","还车地址","还车备注","下单时间","取车时间","还车时间","车费合计（元）","操作"]
let arr5 = ["序号","账号","姓名","用户ID","订单号","车辆ID","下单地址","还车地址","还车备注","下单时间","取车时间","还车时间","结算时间","车费合计（元）","实付金额（元）","操作"]
let arr6 = ["序号","账号","姓名","用户ID","订单号","取消类型","车辆ID","下单地址","下单时间","取消时间","操作"]
```

## getExceptionOrderList

### 参数

| 参数名    | 必选 | 类型   | 说明                                |
| :-------- | :--- | :----- | ----------------------------------- |
| timestamp | 是   | String | 当前时间, 时间戳, 例: 1526961885000 |
| sign      | 是   | String | 签名值                              |
| pageNum   | 否   | Long   | 页码                                |
| pageSize  | 否   | Long   | 每页条数                            |
| carId     | 否   | String | 车辆 id                             |
| userId    | 否   | String | 用户 id                             |
| status    | 否   | String | 异常状态(0:待处理,20:已处理)        |




["序号","账号","姓名","订单号","车辆ID","订单状态","下单时间","还车时间","结算时间","转入时间","当前异常备注","操作"]

["序号","账号","姓名","订单号","车牌号","订单状态","下单时间","还车时间","结算时间","转入时间","当前异常备注","操作"]

["序号","账号","姓名","订单号","车辆ID@","订单状态","转入时间","处理完成时间@","当前异常备注","操作"]

license
cancelType
exception_memo
process_finish_time

问题：
1.处理完成时间 指的是什么，应该用哪个字段 >>> 处理完成时间和订单结算时间，有区别吗？[已解决]
2.可选传参的数量不足够支持搜索功能。 >>> 字段相较于正常订单，还要添加一个处理完成时间（其实未必需要，这个值和还车时间是一样的）  >>> 但是其他时间还是需要添加的，还要后端同学添加下参数的筛选。[未确认]

TODO:
1.对接API文档 √
2.制作请求体 √
3.分页绑定 √
4.功能按钮
5.permissonMap 编写
6.调整样式
7.联调 + 查漏补缺

3个月之后就无法原路退回 <<< 支付宝

## getOrderDetail

// 订单信息
data && data. TODO:xxxx 订单号？？？订单ID？？？ id OR orderNum
data && data.status // 102, // 状态:0 预约未取车; 10 订单进行中; 15 还车待结算; 101 正常支付完成; 102手动取消完成; 103 自动取消完成; 104 客服取消完成; 105 汽车订单异常;106 单车订单异常
data && data.name <<< 姓名 TODO:
data && data.phone_num <<< 账号|手机号 TODO:
data && data.car_license xxxx 车牌号（废弃）
data && data.carId // 车辆ID
data && data.costLevel TODO:xxxx 收费等级
data && data.endBillingTime - data.startBillingTime // 计费时长（计算）TODO:或者为空
data && data.mileage // 行驶里程（KM）
data && data.orderTime
data && data.startBillingTime // 取车时间
data && data.endBillingTime  // 还车时间
data && data.bookType  // 默认:0;地图选取:1;扫描车牌:2
data && data.  TODO:不明确对应变量 // "orderBusinessType": 1,// 订单业务类型 1：电动汽车租赁 2：普通单车租赁 ？？？
data && data.isAbatement // 是否免赔 0：默认 1：是 2：否
data && data.  TODO:#后端需要加接口 还车方式？？？用户还车、客服还车 || 
data && data.userId 用户ID
data && data.onParkId    // 下单网点：
data && data.downParkId // 还车网点
data && data.remarks    // 还车备注
// 费用信息
data && data.orderPrice  // 车费合计
data && data.mileageMoney  // 里程费
data && data.          // TODO: 时长费 时长费怎么计算？
data && data.abatement  // 不计免赔
data && data.           // TODO: 还车附加费 ？？
data && data.           // TODO: 里程豆抵扣 ？？
data && data.           // TODO: 优惠券抵扣 ？？
data && data.           // TODO: 退款 ？？ 退款指的是什么？
data && data.realPrice  // 实付金额

Note: 无数据显示为空



---------- 5/29 更新-----------
1.收费等级 √ 
2.时长费 <<< day_money
3.还车附加费 <<< dispatching_fee
4.里程豆抵扣 × 延后
5.优惠券抵扣 × 延后
6.退款 × 延后
7.车牌号 √ 
8.还车方式 × 延后
---------------------
根据车辆ID查询可得
7.车牌号 √ 
1.收费等级 √


时长费: day_money., 还车附加费: dispatching_fee  <<<  订单表


Note: 无数据显示为空
---------------------

## 转入异常


```js
# 异常情况选择 #

* 车辆失联
* 道路救援
* 结算错误
* 取消频繁
* 停滞过久
* 超出围栏
* 严重投诉
* 无法还车
* 无法结算
* 非法移动
* 其他
```


## 复用代码部分

```js
colConfigTable = {
  序号: { prop: "num", label: "序号", align: "center", width: "90" },
  手机号: {prop: "phone_num",label: "手机号",align: "center",width: "110"},
  姓名: { prop: "name", label: "姓名", align: "center", width: "90" },
  用户ID: { prop: "uid", label: "用户ID", align: "center", width: "90" },
  订单号: {prop: "order_num",label: "订单号",align: "center",width: "90", },
  订单状态: {prop: "order_status",label: "订单状态",align: "center",width: "90", },
  车辆ID: {prop: "car_id",label: "车辆ID",align: "center",width: "90", },
  下单地址: {prop: "where_car_rent",label: "下单地址",align: "center",width: "200", },
  还车地址: {prop: "where_car_return",label: "还车地址",align: "center",width: "200", },
  还车备注: {prop: "return_car_memo",label: "还车备注",align: "center",width: "200", },
  下单时间: {prop: "when_order_begin",label: "下单时间",align: "center",width: "130",sortable: "custom", },
  取车时间: {prop: "when_car_rent",label: "取车时间",align: "center",width: "130",sortable: "custom", },
  还车时间: {prop: "when_car_return",label: "还车时间",align: "center",width: "130",sortable: "custom", },
  结算时间: {prop: "when_order_finish",label: "结算时间",align: "center",width: "130",sortable: "custom", },
  处理完成时间: { prop: 'when_exception_close', label: '处理完成时间', width: '130', align: 'center', width: '120', },
  "车费合计（元）": {prop: "total_account",label: "车费合计（元）",align: "center",width: "120", },
  "实付金额（元）": {prop: "actually_pay",label: "实付金额",align: "center",width: "120", },
  是否免赔: {prop: "isGuaranteed",label: "是否免赔",align: "center",width: "120", },
  操作: {prop: "operation",label: "操作",align: "center",width: "90", component: funcBtn, },
  操作1: { prop: 'operation', label: '操作', align: 'center', width: '90', component: funcBtn_one, },
  操作2: { prop: 'operation', label: '操作', align: 'center', width: '90', component: funcBtn_two, },
  取消类型: {prop: "cancelType",label: "取消类型",align: "center",width: "120", },
  转入时间: { prop: 'when_exception_switch_in', label: '转入时间', align: 'center', width: '120', },
  当前异常备注: { prop: 'exception_memo', label: '当前异常备注', align: 'center', width: '120', },
}
```


TODO: 延后部分

## 【订单详情页】

* 里程豆抵扣 × 延后
* 优惠券抵扣 × 延后
* 退款 × 延后
* 还车方式 × 延后

