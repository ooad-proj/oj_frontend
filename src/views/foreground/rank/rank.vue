<template>
  <div>
    <SnackBar ref="sb"></SnackBar>
    <v-container grid-list-xs>
      <v-card class="pa-5">
        <p class="tw-text-xl tw-font-bold">全站总排名</p>
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
          text: "学号",
          align: "start",
          sortable: false,
          value: "userId",
        },
        { text: "姓名", value: "userName", sortable: false },
        { text: "回答问题数", value: "answerNum", sortable: false },
        { text: "正确数", value: "correctNum", sortable: false },
        { text: "正确率", value: "correctRate", sortable: false },
        { text: "排名", value: "rank", sortable: false },
      ],
    };
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
    getDataFromApi() {
      this.loading = true;
      api.rankFactory
        .getRank(this.page, this.itemsPerPage)
        .then((response) => {
          console.log(response);
          this.tableData = response.content.list;
          this.totalAmont = response.content.totalAmont;
          this.totalPage = response.content.totalPage;
          this.loading = false;
        })
        .catch(() => {
            this.$refs.sb.warn("未知错误")
          this.loading = false;
        });
    },
  },
};
</script>

<style>
</style>