<template>
  <div>
    <snackBar ref="sb"></snackBar>
    <v-container grid-list-xs fluid>
      <DeleteDialog
        title="删除一个问题"
        content="确定删除吗"
        width="35rem"
        v-model="dialogDelete"
        @cancel="closeDelete"
        @confirm="deleteItemConfirm"
      ></DeleteDialog>
      <v-row>
        <v-col>
          <v-card>
            <div class="tw-flex tw-justify-between tw-items-center pa-5">
              <div class="tw-font-bold tw-text-xl">我管理的问题</div>
              <div>
                <div class="tw-inline-block mx-1">
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="问题标题"
                    single-line
                    hide-details
                    @click:append="searchId"
                  >
                  </v-text-field>
                </div>
                <v-btn color="primary mx-1" @click="addPublicProblem">添加问题</v-btn>
              </div>
            </div>

            <v-data-table
              :headers="headers"
              :items="tableData"
              :options.sync="options"
              :server-items-length="totalProblem"
              :loading="loading"
              :footer-props="{
                showFirstLastPage: true,
                itemsPerPageOptions: [5, 10, 15],
              }"
              class="elevation-2"
            >
              <template v-slot:[`item.delete`]="{ item }">
                <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
              </template>

              <template v-slot:[`item.revise`]="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">
                  mdi-pencil
                </v-icon>
              </template>

              <template v-slot:[`item.answer`]="{ item }">
                <v-icon small class="mr-2" @click="editAnswer(item)">
                  mdi-file-edit-outline
                </v-icon>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import DeleteDialog from "@/components/DeleteDialog.vue";
import api from "@/api/api";
import SnackBar from "../../../components/SnackBar.vue";
export default {
  components: {
    SnackBar,
    DeleteDialog,
  },
  mounted() {
    this.getDataFromApi("");
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi("");
      },
      deep: true,
    },
  },
  data() {
    return {
      dialogDelete: false,
      deleteProblemId: null,
      options: {},
      search: "",
      totalProblem: 0,
      loading: false,
      tableData: [{ id: 1, name: "asdasd", source: "public" }],
      headers: [
        {
          text: "问题ID",
          align: "start",
          sortable: false,
          value: "problemId",
        },
        { text: "标题", value: "title", sortable: false },
        { text: "来源", value: "groupName", sortable: false },
        { text: "比赛来源", value: "contestTitle", sortable: false },
        { text: "修改", value: "revise", sortable: false },
        { text: "答案", value: "answer", sortable: false },
        { text: "删除", value: "delete", sortable: false },
      ],
      myrole: null,
    };
  },
  methods: {
    getDataFromApi(searchText) {
      const { page, itemsPerPage } = this.options;
      this.loading = true;
      api.problemFactory
        .getMyProblem(page, itemsPerPage, searchText)
        .then((response) => {
          console.log(response);
          this.tableData = response.content.list;
          this.totalProblem = response.content.totalAmount;
          this.loading = false;
        });
    },
    searchId() {
      this.getDataFromApi(this.search);
    },
    deleteItem(item) {
      this.deleteProblemId = item.problemId;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      api.problemFactory
        .deleteProblem(this.deleteProblemId)
        .then((response) => {
          let map = { 0: "成功", "-1": "问题不存在" };
          this.$refs.sb.warn(map[response.code]);

          this.closeDelete();
          this.getDataFromApi("");
        });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.deleteProblemId = null;
    },
    editItem(item) {
      this.$router.push({
        name: "createProblem",
        params: {
          contestId: 0,
        },
        query: {
          ifEdit: true,
          problemId: item.problemId,
        },
      });
    },
    editAnswer(item) {
      this.$router.push({
        name: "answerOfProblem",
        params: {
          problemId: item.problemId,
        },
      });
    },
    addPublicProblem(){
      this.$router.push({
        name: "createProblem",
        params: { contestId: 0 },
      });
    }
  },
};
</script>