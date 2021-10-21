<template>
  <v-app-bar app class=" grey darken-3 white--text">
    <v-toolbar-title>Online Judge</v-toolbar-title>
    <v-divider vertical class=" mx-4 grey darken-2"></v-divider>

    <div class=" tw-flex-row tw-space-x-2">
      <v-btn depressed class=" darken-3 grey white--text " href="/#/">
        <v-icon>mdi-home</v-icon>首页
      </v-btn>
      <v-btn depressed class=" darken-3 grey white--text ">
        <v-icon dense>mdi-file-question</v-icon>问题
      </v-btn>
      <v-btn depressed class=" darken-3 grey white--text ">
        <v-icon dense>mdi-format-list-bulleted</v-icon>记录
      </v-btn>
      <v-btn depressed class=" darken-3 grey white--text ">
        <v-icon dense>mdi-chevron-triple-up</v-icon>排名
      </v-btn>
      <v-btn depressed class=" darken-3 grey white--text ">
        <v-icon dense>mdi-trophy</v-icon>竞赛
      </v-btn>
    </div>

    <v-spacer></v-spacer>
    <v-divider vertical class=" mx-4 grey darken-2"></v-divider>
    <v-btn depressed class=" darken-3 grey white--text " @click="$emit('userClick')">
      <v-icon dense>mdi-account-circle</v-icon><pre> </pre>{{user.name == '' ? '用户' : user.name}}
    </v-btn>


  </v-app-bar>
</template>

<script>
import api from '../api/api'
export default {
  data: function() {
    return {
      user: {
        id: -1,
        name: ''
      }
    }
  },
  methods: {
    getInfo() {
      api.authFactory.isLogin().then(resp => {
        if (resp.isLogin == true) {
          api.authFactory.getInfo().then(resp => {
            this.user.id = resp.content.id
            this.user.name = resp.content.name
          })
        } else {
            this.user.id = -1
            this.user.name = ''
            
        }
      })
    }
  },
  mounted() {
    this.getInfo()
    this.$emit('toast')
  }
}
</script>