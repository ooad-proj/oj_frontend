<template>
  <v-card>
    <div class="tw-flex tw-justify-between tw-w-full pa-5 tw-items-center">
      <div class="tw-text-xl tw-font-bold">班级学助管理</div>

      <div>
        <v-btn
          color="primary"
          dark
          class=""
          @click="addAssistantDialog = true"
          v-if="checkTeacher"
        >
          添加新学助
        </v-btn>
      </div>
    </div>
    <v-data-table
      :headers="headerToShow"
      :items="groupAssistant"
      :options.sync="options"
      :server-items-length="totalGroupAssistant"
      :loading="loading"
      :hide-default-footer="true"
      :footer-props="{
        showFirstLastPage: true,
        itemsPerPageOptions: [5, 10, 15],
      }"
      class="elevation-2 tw-pb-8"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>

    <DeleteDialog
      title="删除组内学助"
      content="确定删除吗"
      width="35rem"
      v-model="dialogDelete"
      @cancel="closeDelete"
      @confirm="deleteItemConfirm"
    ></DeleteDialog>

    <v-dialog v-model="addAssistantDialog" max-width="600px">
      <v-card class="pa-5">
        <v-row>
          <v-col>
            <v-card-title class="text-h5">添加一个学助</v-card-title>
            <v-card-text>
              <v-form ref="editingForm" v-model="addValid">
                <v-text-field
                  v-model="assistantId"
                  :rules="[
                    (v) => !!v || 'ID不能为空'
                  ]"
                  label="请输入学助ID"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="closeAddingAssistant"
                >取消</v-btn
              >
              <v-btn
                color="primary"
                text
                @click="submit"
                :loading="addAssistantLoader"
                :disabled="addAssistantLoader || !addValid"
                >确定</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import DeleteDialog from "@/components/DeleteDialog.vue";
import api from "@/api/api";
export default {
  components: {
    DeleteDialog,
  },
  // props: ["groupId"],
  data() {
    return {
      myrole: null,
      groupId: null,
      addValid: false,
      assistantId: null,
      addAssistantLoader: false,
      addAssistantDialog: false,
      assitantId: null,
      defaultItem: {
        id: "",
        name: "",
        mail: "",
      },
      editedItem: {
        id: "",
        name: "",
        mail: "",
      },
      editedIndex: -1,
      dialogDelete: false,
      options: {},
      loading: false,
      totalGroupAssistant: 0,
      groupAssistant: [],
      groupAssistantHeaders: [
        { text: "学助id", align: "start", sortable: false, value: "id" },
        { text: "学助名", value: "name" },
        { text: "学助邮箱", value: "mail" },
        { text: "删除学助", value: "actions", sortable: false },
      ],
      headerForAssistant: [
        { text: "学助id", align: "start", sortable: false, value: "id" },
        { text: "学助名", value: "name" },
        { text: "学助邮箱", value: "mail" },
      ],
    };
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },
  mounted() {
    this.groupId = this.$route.params.groupId;
    this.getDataFromApi();
    this.getMyRole();
  },
  computed: {
    checkTeacher: function () {
      return this.myrole == "teacher";
    },
    headerToShow: function () {
      return this.myrole == "teacher"
        ? this.groupAssistantHeaders
        : this.headerForAssistant;
    },
  },
  methods: {
    getMyRole() {
      api.authFactory.getRole().then((response) => {
        this.myrole = response.content;
      });
    },
    closeAddingAssistant() {
      this.assistantId = null;
      this.$refs.editingForm.resetValidation();
      this.addAssistantDialog = false;
      this.getDataFromApi();
    },
    submit() {
      this.addAssistantLoader = true;
      api.groupFactory
        .addAssistantInGroup(this.groupId, this.assistantId)
        .then((response) => {
          let map = {
            0: "成功",
            "-1": "组不存在",
            "-2": "学助已在本组",
            "-3": "用户不存在",
            "-4": "不能添加老师",
            "-5": "不能添加本组学生",
          };
          this.$emit("addAssitant", map[response.code]);
          this.addAssistantLoader = false;
          this.closeAddingAssistant();
        });
    },
    deleteItemConfirm() {
      api.groupFactory
        .deleteAssistantInGroup(this.groupId, this.editedItem.id)
        .then((response) => {
          console.log(this.editedItem);
          let map = { 0: "成功", "-1": "组不存在", "-2": "学助不存在" };
          this.$emit("deleteAssitant", map[response.code]);
          this.closeDelete();
        });
    },
    closeDelete() {
      this.getDataFromApi();
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    deleteItem(item) {
      this.editedIndex = this.groupAssistant.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    getDataFromApi() {
      this.loading = true;
      api.groupFactory.getAssistantInGroup(this.groupId).then((response) => {
        this.groupAssistant = response.content.list;
        this.totalGroupAssistant = response.content.totalAmount;
        this.loading = false;
      });
    },
  },
};
</script>