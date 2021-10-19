<template>
  <div>
    <div class="tw-p-3 tw-shadow-sm tw-bg-white tw-font-bold tw-text-xl">
      个人主页
    </div>
    <v-container grid-list-xs class="">
      <v-card class="pa-4">
        <v-row class="">
          <v-col cols="4" class="pa-6 tw-h-96 tw-bg-gray-100">
            <div class="tw-flex tw-flex-row tw-p-1 tw-mt-4">
              <div class="tw-w-32">id：</div>
              <div class="tw-w-48">{{ basic.id }}</div>
            </div>
            <div class="tw-flex tw-flex-row tw-p-1">
              <div class="tw-w-32">姓名：</div>
              <div class="tw-w-48">{{ basic.name }}</div>
            </div>
            <div class="tw-flex tw-flex-row tw-p-1">
              <div class="tw-w-32">邮箱：</div>
              <div class="tw-w-48">{{ basic.mail }}</div>
            </div>
          </v-col>
          <v-col class="">
            <v-tabs color="teal" v-model="choosen">
              <v-tab>修改信息</v-tab>
              <v-tab>修改密码</v-tab>
            </v-tabs>
            <v-tabs-items v-model="choosen">
              <v-tab-item class="pa-4">
                <v-form v-model="infoValid">
                  <v-text-field
                    color="teal"
                    label="新用户名"
                    :rules="rules.name"
                    v-model="editInfo.name"
                  ></v-text-field>
                  <v-text-field
                    color="teal"
                    label="新邮箱"
                    :rules="rules.mail"
                    v-model="editInfo.mail"
                  ></v-text-field>
                </v-form>
                <v-btn color="primary" :disabled="!infoValid" @click="updateInfo()">确定</v-btn>
              </v-tab-item>
              <v-tab-item class="pa-4">
                <v-form v-model="passwordValid">
                  <v-text-field
                    color="teal"
                    label="旧密码"
                    type="password"
                    :rules="rules.password"
                    v-model="editPassword.old"
                  ></v-text-field>
                  <v-text-field
                    color="teal"
                    label="新密码"
                    type="password"
                    :rules="rules.password"
                    v-model="editPassword.new"
                  ></v-text-field>
                  <v-text-field
                    color="teal"
                    label="重复密码"
                    type="password"
                    :rules="rules.repeatPassword"
                    v-model="editPassword.confirm"
                  ></v-text-field>
                </v-form>
                <v-btn color="primary" :disabled="!passwordValid" @click="updatePassword()">确定</v-btn>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
          <v-col cols="2"></v-col>
        </v-row>
      </v-card>
    </v-container>

    <v-snackbar
      v-model="warn.doing"
      timeout=1000
    >
      {{warn.text}}
    </v-snackbar>

  </div>
</template>

<script>
import api from "../../../api/api";

export default {
  mounted() {
    this.getInfo();
  },
  activated() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      Promise.all([
        api.authFactory.getInfo(),
        api.authFactory.getGroups(),
      ]).then((resps) => {
        let info = resps[0];
        this.basic = info.content;
      });
    },
    startWarn(text) {
      this.warn.text = text
      this.warn.doing = true
    },
    updateInfo() {
      api.authFactory.editInfo(this.updateInfo.name, this.updateInfo.mail).then(resp => {
        if (resp.code == 0) {
          this.$router.push('info')
        } else if (resp.code == -1) {
          this.startWarn('必填项为空')
        } else if (resp.code == -2) {
          this.startWarn('信息格式错误')
        }
      })
    },
    updatePassword() {
      api.authFactory.editPassword(this.editPassword.old, this.editPassword.new).then(resp => {
        if (resp.code == 0) {
          this.$router.push('info')
        } else if (resp.code == -1) {
          this.startWarn('原密码错误')
        } else if (resp.code == -2) {
          this.startWarn('密码格式错误')
        }
      })
    },
  },
  data: function () {
    return {
      warn: {
        doing: false,
        text: ''
      },
      choosen: 0,
      infoValid: false,
      passwordValid: false,
      rules: {
        name: [
          v => !!v || '用户名为空',
        ],
        mail: [
          // v => !!v || '邮箱为空',
          v => (v == '' || /.+@.+\..+/.test(v)) || '邮箱格式不合法',
        ],
        password: [
          v => !!v || '密码为空',
          v => v.length >= 6 || '密码长度不能少于6个字符',
        ],
        repeatPassword: [
          v => !!v || '密码为空',
          v => v == this.editPassword.old || '密码输入不一致'
        ]
      },
      basic: {
        id: "",
        name: "",
        mail: "",
      },
      editInfo: {
        name: "",
        mail: "",
      },
      editPassword: {
        old: "",
        new: "",
        confirm: ""
      },
    };
  },
};
</script>

<style>
</style>