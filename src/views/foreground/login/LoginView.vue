<template>
  <v-container class="">
    <v-card class=" mx-auto tw-max-w-sm my-10 pa-10">
      <v-form v-model="valid">
        <p class=" tw-text-2xl tw-font-bold">登录</p>
        <div class=" tw-p-2"></div>
        <v-text-field
        label="用户id"
        required
        :rules="rules.id"
        color="teal"
        prepend-icon="mdi-account"
        v-model="id"
        ></v-text-field>

        <v-text-field
        label="密码"
        required
        type="password"
        :rules="rules.password"
        color="teal"
        prepend-icon="mdi-form-textbox-password"
        v-model="password"
        ></v-text-field>

        <div class=" tw-p-8">
          <!-- <v-switch color="teal" inset dense label="记住我"></v-switch> -->
        </div>

        <div class=" tw-p-2">
          <v-btn block color="primary" :disabled="!valid" @click="login">登录</v-btn>
        </div>
        
      </v-form>
    </v-card>
    <snack-bar ref="sb"></snack-bar>


  </v-container>
</template>

<script>
import api from '../../../api/api'
import SnackBar from '@/components/SnackBar.vue'
export default {
  components: {SnackBar},
  data() {
    return {
      id: '',
      password: '',
      valid: false,
      rules: {
        id: [
          v => !!v || 'id为空',
        ],
        password: [
          v => !!v || '密码为空',
          v => v.length >= 6 || '密码长度不能少于6个字符',
        ]
      },
    }
  },
  methods: {
    startWarn(text) {
      this.$refs.sb.warn(text)
    },
    login() {
      api.authFactory.login(this.id, this.password).then(resp => {
        if (resp.code == 0) {
          this.$router.push('/home')
          location.reload()
        } else if (resp.code == -1) {
          this.startWarn('用户不存在')
        } else if (resp.code == -2) {
          this.startWarn('用户名或密码错误')
        }
      })
    },
  }
}
</script>

<style>

</style>