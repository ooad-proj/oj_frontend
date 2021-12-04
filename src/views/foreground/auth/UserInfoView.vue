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
            <div class="tw-flex tw-flex-row tw-p-3 ">
              <div class="tw-w-32">邮箱：</div>
              <div class="tw-w-48">{{ basic.mail }}</div>
            </div>
          </v-card></v-col
        ></v-row
      >

      <v-row
        ><v-col
          ><v-card class="pa-4">
            <p class="tw-text-bg tw-font-bold tw-divi">群组信息</p>
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

      <v-row>
        <v-col>
          <v-card class="pa-4">
            <p class="tw-text-bg tw-font-bold">提交概述</p>
            <v-row>
              <v-col>
                <div class="tw-p-3">
                  <p>提交总数：{{record.answerNum}}</p>
                  <p>正确数：{{record.correctNum}}</p>
                  <p>正确率：{{record.correctRate}}</p>
                </div>
              </v-col>
              <v-col cols="8"><line-chart ref="chart" :height="300"></line-chart></v-col>
            </v-row>
            
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import api from "../../../api/api";
import LineChart from "@/components/LineChart.vue"
export default {
  components: {LineChart},
  methods: {
    fliterLabel(label) {
      return label
    },
    getInfo() {
      Promise.all([
        api.authFactory.getInfo(),
        api.authFactory.getGroups(),
        api.authFactory.getRole(),
        api.submitFactory.getSubmitAllTimes()
      ]).then((resps) => {
        let info = resps[0];
        this.basic = info.content;
        api.submitFactory.getSubmitTimes(this.basic.id).then(resp => {
          this.$refs.chart.dataStd[0].values = resp.content.data
          this.$refs.chart.labels = this.fliterLabel(resp.content.label)
          // this.$refs.chart.dataStd[0].values = [1,2,3]
          // this.$refs.chart.labels = this.fliterLabel(['1','2','3'])
        })
        this.group = resps[1].content;
        this.role = resps[2].content;
        this.record = resps[3].content;
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
      record: {
        answerNum: 0,
        correctNum: 0,
        correctRate: 0
      },

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