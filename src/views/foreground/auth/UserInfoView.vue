<template>
  <div>
    <div class=" tw-p-3 tw-shadow-sm tw-bg-white tw-font-bold tw-text-xl">个人主页</div>
    <v-container grid-list-xs>
      <v-row><v-col><v-card class="pa-4">
        <p class=" tw-text-bg tw-font-bold">基本信息</p>
        <div class=" tw-flex tw-flex-row tw-p-3">
          <div class=" tw-w-32">id：</div>
          <div class=" tw-w-48">{{basic.id}}</div>
        </div>
        <div class=" tw-flex tw-flex-row tw-p-3">
          <div class=" tw-w-32">姓名：</div>
          <div class=" tw-w-48">{{basic.name}}</div>
        </div>
        <div class=" tw-flex tw-flex-row tw-p-3">
          <div class=" tw-w-32">邮箱：</div>
          <div class=" tw-w-48">{{basic.mail}}</div>
        </div>
      </v-card></v-col></v-row>
    </v-container>
  </div>
</template>

<script>
import api from '../../../api/api'
export default {
  methods: {
    getInfo() {
      Promise.all([
        api.authFactory.getInfo(),
        api.authFactory.getGroups(),
      ]).then(resps => {
        let info = resps[0]
        this.basic = info.info
      })
    }
  },
  data: function() {
    return {
      basic: {
        id: '',
        name: '',
        mail: ''
      },
      group: {

      },
      record: {

      }
    }
  },
  mounted() {
    this.getInfo()
  },
  activated() {
    this.getInfo()
  }
}
</script>

<style>

</style>