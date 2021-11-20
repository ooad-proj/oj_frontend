<template>
  <div>
    <v-container grid-list-xs>
      <v-card class="pa-5">
        <p class="tw-text-xl tw-font-bold">竞赛页</p>
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
              进入竞赛
            </v-btn>
          </template>
        </v-data-table>

        <div class="text-center pt-2">
          <v-pagination
            v-model="page"
            :total-visible="9"
            :length="totalPage"
          ></v-pagination>
        </div>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import api from "@/api/api";
export default {
  data() {
    return {
      options: {},
      headers: [
        {
          text: "标题",
          align: "start",
          sortable: false,
          value: "title",
        },
        { text: "描述", value: "description", sortable: false },
        { text: "开始时间", value: "startTime", sortable: false },
        { text: "结束时间", value: "endTime", sortable: false },
        { text: "我的分数", value: "myScore", sortable: false },
        { text: "总分数", value: "totalScore", sortable: false },
        { text: "进入竞赛", value: "enter", sortable: false },
      ],
      loading: false,
      page: 1,
      itemsPerPage: 10,
      tableData: [],
      totalPage: 0,
    };
  },
  mounted() {
    this.getDataFromApi("");
  },
  watch: {
    page: {
      handler() {
        this.getDataFromApi("");
      },
      deep: true,
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
    getDataFromApi(searchText) {
      this.loading = true;
      api.groupFactory
        .getContestInGroup(
          this.$route.params.groupId,
          this.page,
          this.itemsPerPage,
          searchText
        )
        .then((response) => {
          let that = this;
          that.tableData = response.content.list;
          that.tableData.map(function (item) {
            let tempStart = that.timestampToTime(item.startTime);
            let tempEnd = that.timestampToTime(item.endTime);

            item.startTime = tempStart[0] + tempStart[1];
            item.endTime = tempEnd[0] + tempEnd[1];
          });

          this.totalPage = response.content.totalPage;
          this.loading = false;
        });
    },
    goInProblem(item) {
      this.$router.push({
        name: "problemIncontest",
        params: {
          contestId: item.contestId,
        },
      });
    },
  },
};
</script>