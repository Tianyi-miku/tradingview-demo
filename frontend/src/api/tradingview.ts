import request from '@/axios'

const tradingviewApi = {
  getMsgbyNameAndTime: '/getMsgbyNameAndTime',
}

//根据名称，时间获取数据
export function getMsgbyNameAndTime() {
  return request({
    url: tradingviewApi.getMsgbyNameAndTime,
    method: 'get'
  })
}

export default {
  getMsgbyNameAndTime,
}