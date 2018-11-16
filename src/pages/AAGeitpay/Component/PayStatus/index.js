const payStatusMap= { '0':'processing', '1':'success', 'V':'default'};
const payStatus= {'0':'待确认', '1':'已确认', 'V':'订单关闭'};

const flagStatusMap = { '1': 'success', '0': 'error'};
const flagStatus = { '1': '有', '0': '无'};

const orderStatusMap = {'0':'default','1':'processing','2':'processing','3':'success','4':'default','5':'warning'};
const orderStatus = {'0':'待创建','1':'未支付','2':'正在支付','3':'已支付','4':'已关闭','5':'已退款'};

export {
  payStatusMap,
  payStatus,
  flagStatusMap,
  flagStatus,
  orderStatusMap,
  orderStatus,
}