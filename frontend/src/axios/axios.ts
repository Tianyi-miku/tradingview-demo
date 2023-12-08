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