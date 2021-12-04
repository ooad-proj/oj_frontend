<template>
  <v-app-bar app class="grey darken-3 white--text">
    <v-toolbar-title>TealOJ</v-toolbar-title>
    <v-divider vertical class="mx-4 grey darken-2"></v-divider>

    <div class="tw-flex-row tw-space-x-2">
      <button
        class="
          tw-rounded-md tw-transition-all
          hover:tw-bg-gray-500
          tw-p-2 tw-px-1
          sm:tw-px-4
        "
        @click="$router.push('/home')"
      >
        <v-icon class="white--text">mdi-home</v-icon>
        <span class="tw-hidden lg:tw-inline">首页</span>
      </button>
      <button
        class="
          tw-rounded-md tw-transition-all
          hover:tw-bg-gray-500
          tw-p-2 tw-px-1
          sm:tw-px-4
        "
        @click="$router.push('/problemSet')"
      >
        <v-icon class="white--text">mdi-file-question</v-icon>
        <span class="tw-hidden lg:tw-inline">问题</span>
      </button>
      <button
        class="
          tw-rounded-md tw-transition-all
          hover:tw-bg-gray-500
          tw-p-2 tw-px-1
          sm:tw-px-4
        "
        @click="$router.push('/record')"
      >
        <v-icon class="white--text">mdi-format-list-bulleted</v-icon>
        <span class="tw-hidden lg:tw-inline">记录</span>
      </button>
      <button
        class="
          tw-rounded-md tw-transition-all
          hover:tw-bg-gray-500
          tw-p-2 tw-px-1
          sm:tw-px-4
        "
        @click="$router.push('/rank')"
      >
        <v-icon class="white--text">mdi-chevron-triple-up</v-icon>
        <span class="tw-hidden lg:tw-inline">排名</span>
      </button>
      <button
        class="
          tw-rounded-md tw-transition-all
          hover:tw-bg-gray-500
          tw-p-2 tw-px-1
          sm:tw-px-4
        "
        @click="$router.push('/contest')"
      >
        <v-icon class="white--text">mdi-trophy</v-icon>
        <span class="tw-hidden lg:tw-inline">竞赛</span>
      </button>

      <button
        class="
          tw-rounded-md tw-transition-all
          hover:tw-bg-gray-500
          tw-p-2 tw-px-1
          sm:tw-px-4
        "
        @click="$router.push('/forum/0')"
      >
        <v-icon class="white--text">mdi-chat-processing-outline</v-icon>
        <span class="tw-hidden lg:tw-inline">讨论</span>
      </button>
      <!-- <v-btn depressed class=" darken-3 grey white--text" href="/#/home">
        <v-icon>mdi-home</v-icon><span class=" tw-hidden">首页</span>
      </v-btn>
      <v-btn depressed class=" darken-3 grey white--text " href="/#/problemSet">
        <v-icon dense>mdi-file-question</v-icon><span class=" tw-hidden">首页</span>
      </v-btn>
      <v-btn depressed class=" darken-3 grey white--text " href="/#/">
        <v-icon dense>mdi-format-list-bulleted</v-icon><span class=" tw-hidden">首页</span>
      </v-btn>
      <v-btn depressed class=" darken-3 grey white--text " href="/#/">
        <v-icon dense>mdi-chevron-triple-up</v-icon><span class=" tw-hidden">首页</span>
      </v-btn>
      <v-btn depressed class=" darken-3 grey white--text " href="/#/contest">
        <v-icon dense>mdi-trophy</v-icon><span class=" tw-hidden">首页</span>
      </v-btn> -->
    </div>

    <v-spacer></v-spacer>
    <v-divider vertical class="mx-4 grey darken-2"></v-divider>
    <button
      class="
        tw-rounded-md tw-transition-all
        hover:tw-bg-gray-500
        tw-p-2 tw-px-1
        sm:tw-px-4
      "
      @click="$emit('userClick')"
    >
      <v-icon class="white--text">mdi-account-circle</v-icon>
      <span class="tw-hidden sm:tw-inline">{{
        user.name == "" ? "用户" : user.name
      }}</span>
    </button>
    <!-- <v-btn depressed class=" darken-3 grey white--text " @click="$emit('userClick')">
      <v-icon dense>mdi-account-circle</v-icon><pre> </pre><span class="tw-hidden sm:tw-inline">{{user.name == '' ? '用户' : user.name}}</span>
    </v-btn> -->
  </v-app-bar>
</template>

<script>
import api from "../api/api";
export default {
  data: function () {
    return {
      user: {
        id: -1,
        name: "",
      },
    };
  },
  methods: {
    getInfo() {
      api.authFactory.isLogin().then((resp) => {
        if (resp.isLogin == true) {
          api.authFactory.getInfo().then((resp) => {
            this.user.id = resp.content.id;
            this.user.name = resp.content.name;
          });
        } else {
          this.user.id = -1;
          this.user.name = "";
        }
      });
    },
  },
  mounted() {
    this.getInfo();
    this.$emit("toast");
  },
};
</script>