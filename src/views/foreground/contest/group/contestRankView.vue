<template>
  <div>
    <SnackBar ref="sb"></SnackBar>
    <v-container grid-list-xs>
      <v-card class="pa-5">
        <p class="tw-text-xl tw-font-bold">竞赛排名</p>
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
          <template
            v-slot:[iitteemm+problem]="{ item }"
            v-for="(problem, i) in problems"
          >
            <div
              :class="colorMap[item[problem].color]"
              :key="i"
              class="tw-flex tw-flex-col tw-items-center tw-justify-center"
            >
              <div class="tw-font-bold">{{ item[problem].score }}</div>
              <div class="tw-text-xs tw-text-gray-400">
                {{ formatSeconds(item[problem].time / 1000) }}
              </div>
            </div>
          </template>

          <template v-slot:[`item.totalScore`]="{ item }">
            <div
              :class="colorMap[item.totalScore.color]"
              class="tw-flex tw-flex-col tw-items-center tw-justify-center"
            >
              <div class="tw-font-bold">{{ item.totalScore.score }}</div>
              <div class="tw-text-xs tw-text-gray-400">
                {{ formatSeconds(item.totalScore.time / 1000) }}
              </div>
            </div>
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
import SnackBar from "@/components/SnackBar.vue";
import api from "@/api/api";
export default {
   components: {
    SnackBar,
  },
  computed: {
    itemWich: function () {
      return "tw-bg-red-100 tw-p-2 tw-h-48 tw-overflow-auto tw-rounded-md";
    },
  },
  data() {
    return {
      iitteemm: "item.",
      colorMap: {
        RED: "tw-text-red-600",
        ORANGE: "tw-text-yellow-600",
        YELLOW: "tw-text-yellow-400",
        GREEN: "tw-text-green-600",
        BLUE: "tw-text-blue-600",
        PURPLE: "tw-text-purple-600",
        GRAY: "tw-text-gray-600",
        PINK: "tw-text-pink-600",
      },
      options: {},
      problems: [],
      headers: [
      ],
      loading: false,
      page: 1,
      itemsPerPage: 10,
      tableData: [
      ],
      totalPage: 0,
    };
  },
  mounted() {
    this.getDataFromApi();
  },
  watch: {
    page: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },

  methods: {
    formatSeconds(value) {
      let result = parseInt(value);
      let h =
        Math.floor(result / 3600) < 10
          ? "0" + Math.floor(result / 3600)
          : Math.floor(result / 3600);
      let m =
        Math.floor((result / 60) % 60) < 10
          ? "0" + Math.floor((result / 60) % 60)
          : Math.floor((result / 60) % 60);
      let s =
        Math.floor(result % 60) < 10
          ? "0" + Math.floor(result % 60)
          : Math.floor(result % 60);

      let res = "";
      if (h !== "00") res += `${h}:`;
      if (m !== "00") res += `${m}:`;
      res += `${s}`;
      if(value==0){
        return "--:--:--"
      }
      return res;
    },
    getDataFromApi() {
        this.loading =true
      api.rankFactory
        .getRankInContest(this.$route.params.contestId)
        .then((response) => {
          if (response.content == null){ 
            this.loading =false
            return;
          }
          this.tableData = response.content.tableData;
          this.problems = response.content.problems;
          this.headers = [
            {
              text: "用户名",
              align: "start",
              sortable: false,
              value: "userName",
            },
          ];
          for (let i = 0; i < this.problems.length; i++) {
            this.headers.push({ text: this.problems[i], value: this.problems[i], sortable: false ,align: "center" });
          }
          this.headers.push({ text: "总分", value: "totalScore", sortable: false, align: "center" })
          this.totalPage = response.content.totalPage
          console.log(this.totalPage)
          this.loading = false
        }).catch((reject)=>{
          console.log(reject)
          this.loading = false
          this.$refs.sb.warn("未知错误")
        });
    },
  },
};
</script>