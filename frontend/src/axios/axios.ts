/*
 * @Description: 
 * @Author: zhangyuru
 * @Date: 2022-10-27 16:45:09
 * @LastEditors: zhangyuru
 * @LastEditTime: 2022-10-27 18:04:32
 * @FilePath: \04-teach_front-vue3-ts\src\axios\axios.ts
 */

const VueAxios = {
  vm: {},
  install (Vue: any, instance: any) {
    const _this: any = this
    if (_this.installed) return
    _this.installed = true

    if (!instance) {
      console.error('You have to install axios')
      return
    }

    Vue.axios = instance

    Object.defineProperties(Vue.prototype, {
      axios: {
        get: function get () {
          return instance
        }
      },
      $http: {
        get: function get () {
          return instance
        }
      }
    })
  }
}

export { VueAxios }