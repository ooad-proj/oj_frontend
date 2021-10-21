<template>
  <div>
    <div
      class="tw-p-3 tw-shadow-md tw-bg-white tw-font-bold tw-text-xl tw-mb-2"
    >
      个人主页
    </div>
    <v-container grid-list-xs>
      <v-row
        ><v-col
          ><v-card class="pa-4">
            <p class="tw-text-bg tw-font-bold">基本信息</p>
            <div class="tw-flex tw-flex-row tw-p-3">
              <div class="tw-w-32">id：</div>
              <div class="tw-w-48">{{ basic.id }}</div>
            </div>
            <div class="tw-flex tw-flex-row tw-p-3">
              <div class="tw-w-32">姓名：</div>
              <div class="tw-w-48">{{ basic.name }}</div>
            </div>
            <div class="tw-flex tw-flex-row tw-p-3">
              <div class="tw-w-32">邮箱：</div>
              <div class="tw-w-48">{{ basic.mail }}</div>
            </div>
          </v-card></v-col
        ></v-row
      >

      <v-row
        ><v-col
          ><v-card class="pa-4">
            <p class="tw-text-bg tw-font-bold">群组信息</p>
            <div class="tw-p-3">
              <p>
                您是 <span class="tw-text-teal-600">{{ roleMap[role] }}</span>
              </p>
              <div v-for="g in group" :key="g.groupId">
                您在 <span class="tw-text-teal-600">{{ g.groupName }}</span> 为
                <span class="tw-text-teal-600">{{ roleMap[g.role] }}</span>
              </div>
            </div>
          </v-card></v-col
        ></v-row
      >
    </v-container>
  </div>
</template>

<script>
import api from "../../../api/api";
export default {
  methods: {
    getInfo() {
      Promise.all([
        api.authFactory.getInfo(),
        api.authFactory.getGroups(),
        api.authFactory.getRole(),
      ]).then((resps) => {
        let info = resps[0];
        this.basic = info.content;
        this.group = resps[1].content;
      });
    },
  },
  data: function () {
    return {
      basic: {
        id: "",
        name: "",
        mail: "",
      },
      role: "user",
      roleMap: {
        user: "普通用户",
        student: "学生",
        assistant: "管理员",
        teacher: "教师",
      },
      group: {},
      record: {},
    };
  },
  mounted() {
    this.getInfo();
  },
  activated() {
    this.getInfo();
  },
};
</script>

<style>
</style>