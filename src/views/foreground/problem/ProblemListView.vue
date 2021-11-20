<template>
  <div>
    <v-container grid-list-xs>
      <v-card class="pa-5">
        <p class="tw-text-xl tw-font-bold">问题集</p>
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
          text: "编号",
          align: "start",
          sortable: false,
          value: "problemId",
        },
        { text: "标题", value: "title", sortable: false },
        { text: "来源", value: "groupName", sortable: false },
        { text: "来源班级", value: "contestTitle", sortable: false },
        { text: "进入问题", value: "enter", sortable: false },
      ],
    };
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
    getDataFromApi(searchText) {
      this.loading = true;
      api.problemFactory
        .getAnswerableProblem(this.page, this.itemsPerPage, searchText)
        .then((response) => {
          console.log(response);
          this.tableData = response.content.list;
          this.totalPage = response.content.totalPage;
          this.totalAmont = response.content.totalAmont;
          console.log(response);
          this.loading = false;
        });
    },
    goInProblem(item) {
      this.$router.push({
        name: "problemPage",
        params: { problemId: item.problemId },
      });
    },
  },
};
</script>

<style>
</style>