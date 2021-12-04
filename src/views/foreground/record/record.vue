<template>
  <div>
    <SnackBar ref="sb"></SnackBar>
    <v-container grid-list-xs>
      <v-card class="pa-5">
        <p class="tw-text-xl tw-font-bold">提交记录</p>
        <v-row>
          <v-col md="3">
            <v-row>
              <v-col cols="4">
                <div class="tw-mt-6 tw-ml-8">用户:</div>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="userId"
                  label="用户"
                  single-line
                ></v-text-field>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
          </v-col>

          <v-col md="3">
            <v-row>
              <v-col cols="4">
                <div class="tw-mt-6 tw-ml-8">问题:</div>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="problemId"
                  label="问题"
                  single-line
                ></v-text-field>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
          </v-col>

          <v-col md="3">
            <v-row>
              <v-col cols="4">
                <div class="tw-mt-6 tw-ml-8">状态:</div>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="stateCode"
                  label="状态"
                  single-line
                ></v-text-field>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
          </v-col>

          <v-col md="3">
            <v-btn
              :loading="searchLoading"
              :disabled="searchLoading"
              color="primary"
              class="ma-3 white--text "
              @click="getDataFromApi(1)"
            >
              搜索
              <v-icon right dark> mdi-magnify </v-icon>
            </v-btn>
          </v-col>
        </v-row>
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
import SnackBar from "@/components/SnackBar.vue";
export default {
  components: {
    SnackBar,
  },
  mounted() {
    this.getDataFromApi("");
  },
  data() {
    return {
      searchLoading:false,
      userId: "",
      problemId: "",
      stateCode: "",
      options: {},
      loading: false,
      totalPage: 100,
      totalAmont: 0,
      tableData: [],
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      headers: [
        {
          text: "提交Id",
          align: "start",
          sortable: false,
          value: "resultId",
        },
        { text: "用户Id", value: "userId", sortable: false },
        { text: "问题Id", value: "problemId", sortable: false },
        { text: "提交时间", value: "submitTime", sortable: false },
        { text: "成绩", value: "score", sortable: false },
      ],
    };
  },
  watch: {
    page: {
      handler() {
        this.getDataFromApi(0);
      },
      deep: true,
    },
  },
  methods: {
    getDataFromApi(val) {
        if(val==1){
            this.searchLoading = true
        }
      this.loading = true;
      api.recordFactory
        .getRecord(this.userId,this.problemId,this.stateCode,this.page, this.itemsPerPage)
        .then((response) => {
            console.log(response)
          this.tableData = response.content.list;
          this.tableData.forEach((item)=>{
            item.submitTime = this.timestampToTime(item.submitTime/1000)
            return item
          })
          this.totalAmont = response.content.totalAmont;
          this.totalPage = response.content.totalPage;
          this.loading = false;
          this.searchLoading = false;
          console.log(this.tableData)
        })
        .catch(() => {
          this.$refs.sb.warn("未知错误");
          this.loading = false;
        });
    },
    timestampToTime(timestamp) {
        let date = new Date(parseInt(timestamp)); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
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
        return Y + M + D + h + m;
      },
  },
};
</script>

<style>
</style>