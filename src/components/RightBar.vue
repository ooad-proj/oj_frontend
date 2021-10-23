<template>
  <v-navigation-drawer v-model="shown" app right absolute temporary>
    <div
      v-if="isLogin"
      class="tw-flex tw-flex-wrap tw-h-full tw-content-between"
    >
      <div class="tw-w-full">
        <div class="text-center">
          <v-icon class="text-h1">mdi-account-box</v-icon>
        </div>
        <div class="text-center tw-font-bold">
          {{ user.name }}
        </div>
        <div class="text-center">
          {{ user.mail }}
        </div>
        <hr class="tw-m-2 tw-bg-gray-200 tw-border-solid" />
        <v-list>
          <v-list-item
            v-for="(t, index) in top"
            :key="index"
            class=""
            @click="$router.push(t.path)"
            v-ripple
          >
            <v-icon>{{ t.icon }}</v-icon>
            <pre> </pre>
            <span>{{ t.name }}</span>
          </v-list-item>
          
          <v-list-item
            @click="background()"
            v-if="isAdmin"
            class="tw-transition-all tw-cursor-default"
            v-ripple
          >
            <v-icon class="">mdi-server</v-icon>
            <pre> </pre>
            <span class="">后台管理</span>
          </v-list-item>

        </v-list>
      </div>
      <v-list class="tw-w-full">
        <v-list-item
          @click="logout()"
          class="tw-transition-all hover:tw-bg-red-100 tw-cursor-default"
          v-ripple="{ class: `error--text` }"
        >
          <v-icon class="red--text">mdi-exit-to-app</v-icon>
          <pre> </pre>
          <span class="tw-text-red-500">退出登录</span>
        </v-list-item>
      </v-list>
    </div>

    <div
      v-else
      class="tw-flex tw-flex-wrap tw-h-full tw-justify-center tw-content-center"
    >
      <div>
        <p class="tw-text-center tw-font-bold">未登录</p>
        <v-btn class="teal white--text" @click="$router.push('/login')"
          >登录</v-btn
        >
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script>
import api from "../api/api";
export default {
  data() {
    return {
      isLogin: false,
      isAdmin: false,
      shown: false,
      user: { id: "-1", name: "name", mail: "30acda@ad.com" },
      top: [
        { path: "/user/info", name: "个人主页", icon: "mdi-account-details" },
        { path: "/user/edit", name: "修改信息", icon: "mdi-pencil" },
      ],
    };
  },
  methods: {
    open() {
      api.authFactory.isLogin().then(resp => {
        console.log(resp)
        this.isLogin = resp.isLogin;
        if (this.isLogin) {
          this.getUser();
          this.getAdmin();
        }
        this.shown = true;
      });
      
    },
    getAdmin() {
      api.authFactory.getRole().then(resp => {
        if (resp.content == 'teacher' || resp.content == 'assistant') {
          this.isAdmin = true
        } else {
          this.isAdmin = false
        }
      })
    },
    getUser() {
      api.authFactory.getInfo().then(resp => {
        this.user = resp.content;
      });
    },
    logout() {
      api.authFactory.logout().then(() => {
        this.$router.push("/");
        location.reload();
      });
    },
    background() {
      this.$router.push("/admin");
    }
  },
};
</script>

<style>
</style>