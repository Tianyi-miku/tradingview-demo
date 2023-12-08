import request from '@/axios'

const tradingviewApi = {
  getData: '/'
}

//根据名称，时间获取数据
export function getData(path: string) {
  return request({
    url: tradingviewApi.getData + path,
    method: 'get'
  })
}
