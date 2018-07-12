
// 订单信息
data.orderNum  订单号 orderNum
data.status // 102, // 状态:0 预约未取车; 10 订单进行中; 15 还车待结算; 101 正常支付完成; 102手动取消完成; 103 自动取消完成; 104 客服取消完成; 105 汽车订单异常;106 单车订单异常
data.name <<< 姓名 ##TODO
data.phone_num <<< 账号|手机号 ##TODO
data.car_license TODO:xxxx >> 车牌号 getCarInfo
data.carId // 车辆ID
data.costLevel TODO:xxxx 收费等级 >> 车辆等级 getCarInfo
data.endBillingTime - data.startBillingTime // 计费时长（计算）TODO:或者为空
data.mileage // 行驶里程（KM）
data.orderTime
data.startBillingTime // 取车时间
data.endBillingTime  // 还车时间
data.bookType  // 默认:0;地图选取:1;扫描车牌:2
data.isAbatement // 是否免赔 0：默认 1：是 2：否
data.  TODO:#后端需要加接口 还车方式？？？用户还车、客服还车 || 
data.userId 用户ID
data.onParkId    // 下单网点：
data.downParkId // 还车网点
data.remarks    // 还车备注
// 费用信息
data.orderPrice  // 车费合计
data.mileageMoney  // 里程费
data.          // TODO: 时长费 时长费怎么计算？
data.abatement  // 不计免赔
data.           // TODO: 还车附加费 ？？
data.           // TODO: 里程豆抵扣 ？？
data.           // TODO: 优惠券抵扣 ？？
data.           // TODO: 退款 ？？ 退款指的是什么？
data.realPrice  // 实付金额

---------------------
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

更新之后

// 订单信息
data.orderNum  订单号 orderNum
data.status // 102, // 状态:0 预约未取车; 10 订单进行中; 15 还车待结算; 101 正常支付完成; 102手动取消完成; 103 自动取消完成; 104 客服取消完成; 105 汽车订单异常;106 单车订单异常
data.name <<< 姓名 ##TODO:
data.phone_num <<< 账号|手机号 ##TODO:
data.car_license TODO: getCarInfo >> 车牌号 
data.carId // 车辆ID
data.* TODO: getCarInfo  >> 收费等级 == 车辆等级 
data.endBillingTime - data.startBillingTime // 计费时长（计算）TODO:或者为空
data.mileage // 行驶里程（KM）
data.orderTime
data.startBillingTime // 取车时间
data.endBillingTime  // 还车时间
data.bookType  // 默认:0;地图选取:1;扫描车牌:2
data.isAbatement // 是否免赔 0：默认 1：是 2：否
data.userId 用户ID
data.onParkId    // 下单网点：
data.downParkId // 还车网点
data.remarks    // 还车备注
// 费用信息
data.orderPrice  // 车费合计
data.mileageMoney  // 里程费
data.          // TODO: 时长费 <<< dispatching_fee
data.abatement  // 不计免赔
data.           // TODO: 还车附加费  <<< day_money
data.realPrice  // 实付金额

