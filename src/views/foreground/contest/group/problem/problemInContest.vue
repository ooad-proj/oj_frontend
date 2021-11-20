<template>
  <div>
    <v-container grid-list-xs>
      <v-card class="pa-5">
        <p class="tw-text-xl tw-font-bold">竞赛:{{ title }}</p>

        <v-divider></v-divider>

        <div class="tw-flex tw-items-center pa-5">
          <div class="tw-font-bold tw-text-xl">
            <v-chip color="primary" label>
              <v-icon left> mdi-timer-outline </v-icon>
              {{ TimeStart }}
            </v-chip>
          </div>

          <v-progress-linear
            :value="value"
            color="primary"
            
            height="25"
            class="mx-5"
          >
            <template v-slot:default="{ value }">
              <strong>{{ Math.ceil(value) }}%</strong>
            </template>
          </v-progress-linear>

          <div class="tw-font-bold tw-text-xl">
            <v-chip color="primary" label>
              <v-icon left> mdi-timer-outline </v-icon>
              {{ TimeEnd }}
            </v-chip>
          </div>
        </div>

        <!-- <v-row>
          <v-col>
            <v-chip color="primary" label>
              <v-icon left> mdi-account-circle-outline </v-icon>
              John Leider
            </v-chip></v-col
          >
          <v-col>
            <v-progress-linear v-model="value" color="primary" height="25">
              <template v-slot:default="{ value }">
                <strong>{{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>
          </v-col>

          <v-col>
            <v-chip color="primary" label>
              <v-icon left> mdi-account-circle-outline </v-icon>
              John Leider
            </v-chip>
          </v-col>
        </v-row> -->

        <v-divider></v-divider>
        <v-data-table
          :headers="headers"
          :items="tableData"
          hide-default-footer
          :loading="loading"
          :footer-props="{
            showFirstLastPage: true,
            itemsPerPageOptions: [5, 10, 15],
          }"
        >
          <template v-slot:[`item.enter`]="{ item }">
            <v-btn text color="primary" @click="goInProblem(item)">
              <v-icon left>mdi-door-open</v-icon>
              进入问题
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import api from "@/api/api";
export default {
  data() {
    return {
      contestId: null,
      headers: [
        {
          text: "问题序号",
          align: "start",
          sortable: false,
          value: "shownId",
        },
        { text: "标题", value: "title", sortable: false },
        { text: "我的分数", value: "myScore", sortable: false },
        { text: "总分", value: "score", sortable: false },
        { text: "进入问题", value: "enter", sortable: false },
      ],
      tableData: [],
      loading: false,
      startTime: null,
      endTime: null,
      nowTime: null,

      title: null,
      value: null,
    };
  },
  mounted() {
    this.contestId = this.$route.params.contestId;
    this.getDataFromApi();
  },
  computed: {
    TimeStart() {
      return (
        this.timestampToTime(this.startTime)[0] +
        this.timestampToTime(this.startTime)[1]
      );
    },
    TimeEnd() {
      return (
        this.timestampToTime(this.endTime)[0] +
        this.timestampToTime(this.endTime)[1]
      );
    },
  },
  methods: {
    timestampToTime(timestamp) {
      let date = new Date(parseInt(timestamp));
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D = date.getDate() + " ";
      let h = date.getHours() + ":";
      let m = date.getMinutes();
      if (parseInt(m) < 10) {
        m = "0" + m;
      }
      return [Y + M + D, h + m];
    },
    getDataFromApi() {
      api.contestFactory.getContestInfo(this.contestId).then((response) => {
        this.tableData = response.content.problems;
        this.startTime = response.content.contest.startTime;
        this.endTime = response.content.contest.endTime;
        this.title = response.content.contest.title;
        this.nowTime = new Date(Date.now()).getTime();
        this.value =
          (this.nowTime - this.startTime) / (this.endTime - this.startTime);
        console.log(response);
      });
    },
    goInProblem(item) {
      this.$router.push({
        name: "problemPage",
        params: {
          problemId: item.problemId,
        },
      });
    },
  },
};
</script>