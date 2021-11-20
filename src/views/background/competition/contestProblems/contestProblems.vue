<template>
  <div>
    <DeleteDialog
      title="删除一个竞赛"
      content="确定删除吗"
      width="35rem"
      v-model="dialogDelete"
      @cancel="closeDelete"
      @confirm="deleteItemConfirm"
    ></DeleteDialog>
    <v-card>
      <div class="tw-flex tw-justify-between tw-w-full pa-5 tw-items-center">
        <div class="tw-text-xl tw-font-bold">竞赛问题管理</div>

        <div>
          <v-btn color="primary" dark @click="goCreateProblem">
            添加新问题
          </v-btn>
        </div>
      </div>
      <v-data-table
        :headers="headers"
        :items="tableData"
        :options.sync="options"
        :loading="loading"
        class="elevation-2"
        :footer-props="{
          showFirstLastPage: true,
          itemsPerPageOptions: [5, 10, 15],
        }"
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
  </div>
</template>
<script>
import DeleteDialog from "@/components/DeleteDialog.vue";
import api from "@/api/api";
export default {
  components: {
    DeleteDialog,
  },
  props: ["contestId"],
  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },
  data() {
    return {
      deleteContestId: null,
      dialogDelete: false,
      options: {},
      tableData: [],
      loading: false,
      headers: [
        {
          text: "problemID",
          align: "start",
          sortable: false,
          value: "problemId",
        },
        {
          text: "问题ID",
          align: "start",
          sortable: false,
          value: "shownId",
        },
        { text: "标题", value: "title", sortable: false },
        { text: "修改/查看", value: "revise", sortable: false },
        { text: "答案", value: "answer", sortable: false },
        { text: "删除", value: "delete", sortable: false },
      ],
    };
  },
  mounted() {
    this.getDataFromApi();
  },
  methods: {
    getDataFromApi() {
      this.loading = true;
      api.contestFactory.getContestInfo(this.contestId).then((response) => {
        this.tableData = response.content.problems;
        this.loading = false;
      });
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
          this.$emit("showMsg", map[response.code]);
          this.closeDelete();
          this.getDataFromApi("");
        });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.deleteProblemId = null;
    },
    goCreateProblem() {
      this.$router.push({
        name: "createProblem",
        params: { contestId: this.contestId },
      });
    },
    editItem(item) {
      this.$router.push({
        name: "createProblem",
        params: {
          contestId: this.contestId,
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
  },
};
</script>