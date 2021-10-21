<template>
  <v-card>
    <div class="tw-flex tw-justify-between pa-5 tw-w-full">
      <div class="tw-text-xl tw-font-bold">班级用户管理</div>

      <div>
        <v-btn color="primary" dark class="mx-1" @click="addingDialog = true">
          添加学生到组
        </v-btn>
        <v-btn
          color="primary"
          dark
          class="mx-1"
          @click="addingManyDialog = true"
        >
          批量添加到组
        </v-btn>
      </div>
    </div>
    <v-data-table
      :headers="userHeaders"
      :items="allUser"
      :options.sync="options"
      :server-items-length="totalUser"
      :loading="loading"
      class="elevation-2"
    >
      <template v-slot:[`item.edit`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="editingDialog" max-width="600px">
      <v-card class="pa-5">
        <v-row>
          <v-col>
            <v-card-title class="text-h5">修改一个用户</v-card-title>
            <v-card-text>
              <v-form ref="editingForm">
                <v-text-field
                  v-model="editedItem.id"
                  :rules="[(v) => !!v || 'ID不能为空']"
                  label="ID"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.name"
                  :rules="[(v) => !!v || '用户名不能为空']"
                  label="用户名"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.mail"
                  :rules="[(v) => !!v || '邮箱不能为空']"
                  label="邮箱"
                  required
                ></v-text-field
              ></v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeEditUser"
                >取消</v-btn
              >
              <v-btn
                color="blue darken-1 secondary"
                text
                @click="submitEditUser"
                :loading="editingUserLoader"
                :disabled="editingUserLoader"
                >确定</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    
     <DeleteDialog
      title="删除组内用户"
      content="确定删除吗"
      width="35rem"
      v-model="dialogDelete"
      @cancel="closeDelete"
      @confirm="deleteItemConfirm"
    ></DeleteDialog>



    <v-dialog v-model="addingDialog" max-width="600px">
      <v-card class="pa-5">
        <v-row>
          <v-col>
            <v-card-title class="text-h5">添加一个用户</v-card-title>
            <v-card-text>
              <v-form ref="addingForm">
                <v-text-field
                  v-model="addUserId"
                  :rules="[(v) => !!v || 'ID不能为空']"
                  label="请输入用户ID"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeAddingDialog"
                >取消</v-btn
              >
              <v-btn
                color="blue darken-1 secondary"
                text
                @click="submitAddingDialog"
                :loading="addUserLoader"
                :disabled="addUserLoader"
                >确定</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addingManyDialog" max-width="600px">
      <v-card class="pa-5">
        <v-row>
          <v-card-title class="text-h5">批量添加</v-card-title>
        </v-row>
        <v-row>
          <v-virtual-scroll
            :bench="benched"
            :items="responseData"
            height="400"
            item-height="64"
            width="100"
          >
            <template v-slot:default="{ item }">
              <v-list-item :key="item.userId">
                <v-list-item-content>
                  <v-list-item-title>
                    <strong
                      >学号:{{ item.userId }} 结果:{{ item.status }}</strong
                    >
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-divider></v-divider>
            </template>
          </v-virtual-scroll>
        </v-row>
        <v-row>
          <v-card-text>
            <v-file-input truncate-length="15" v-model="csvFile"></v-file-input>
            <!-- <input type="file" ref="ref1" /> -->
          </v-card-text>
        </v-row>
        <v-row>
          <v-col>
            <v-card-actions>
              <v-btn color="blue darken-1" text @click="closeUpload"
                >返回</v-btn
              >
              <v-btn
                color="blue darken-1 secondary"
                text
                @click="sendFile"
                :loading="addingManyLoader"
                :disabled="addingManyLoader"
                >上传</v-btn
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
import api from "@/api/api";
import DeleteDialog from "@/components/DeleteDialog.vue";
export default {
  components: {
    DeleteDialog,
  },
  data: () => ({
    props: ["groupId"],
    //////////////////////添加学生到组/////////////////////////////
    addingDialog: false,
    addUserId: null,
    addUserLoader: false,
    ////////////////////////批量添加///////////////////////////////
    addingManyDialog: false,
    benched: 0,
    responseData: [],
    csvFile: null,
    addingManyLoader: false,
    //////////////////////////////////////////////////////////////
    dialogDelete: false,
    editingUserLoader: false,
    editedIndex: null,
    editedItem: {
      id: null,
      name: null,
      mail: null,
    },
    defaultItem: {
      id: null,
      name: null,
      mail: null,
    },
    editingDialog: null,
    totalUser: null,
    loading: false,
    options: {},
    allUser: [],
    choosen: 0,
    userHeaders: [
      { text: "用户id", align: "start", sortable: false, value: "id" },
      { text: "用户名", value: "name" },
      { text: "用户邮箱", value: "mail" },
      { text: "查看用户详细信息", value: "date" },
      { text: "编辑用户", value: "edit", sortable: false },
      { text: "删除用户", value: "actions", sortable: false },
    ],
  }),
  created() {},
  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },
  mounted() {
    this.getDataFromApi();
  },
  methods: {
    sendFile() {
      api.groupFactory
        .addManyUserInGroup(this.groupId, this.csvFile)
        .then((response) => {
          response.content.map(function (item) {
            if (item.status == 0) {
              item.status = "成功";
            } else if (item.status == -1) {
              item.status = "用户已存在";
            } else if (item.status == -2) {
              item.status = "必须项不能为空";
            } else if (item.status == -3) {
              item.status = "密码格式错误";
            } else {
              item.status = "未知错误";
            }
            return item;
          });
          this.responseData = response.content;
        });
    },
    closeUpload() {
      this.responseData = [];
      this.responseData = [];
      this.addingManyDialog = false;
    },
    closeAddingDialog() {
      this.addUserId = null;
      this.$refs.addingForm.resetValidation();
      this.addingDialog = false;
      this.getDataFromApi();
    },
    submitAddingDialog() {
      this.addUserLoader = true;
      api.groupFactory
        .addUserInGroup(this.groupId, this.addUserId)
        .then((response) => {
          this.addUserLoader = false;
          this.$emit("showmsg", response.msg);
          this.closeAddingDialog();
        });
    },
    deleteItemConfirm() {
      api.groupFactory
        .deleteUserInGroup(this.groupId, this.editedItem.id)
        .then((response) => {
          this.$emit("showmsg", response.msg);
        });
      this.closeDelete();
    },
    deleteItem(item) {
      this.editedIndex = this.allUser.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false;
      this.getDataFromApi();
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeEditUser() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.$refs.editingForm.resetValidation();
      this.editingDialog = false;
      this.getDataFromApi();
    },
    submitEditUser() {
      this.editingUserLoader = true;
      let errorflag = 0;
      let that = this;
      that.editingUser = true;
      api.userFactory
        .changeUserInfo(
          that.editedItem.id,
          that.editedItem.name,
          "123456",
          that.editedItem.mail
        )
        .then((response) => {
          if (response.code == 0) {
            this.$emit("showmsg", response.msg);
          } else {
            this.$refs.sb.warn("修改失败，未知错误");
            errorflag = 1;
          }
          this.editingUserLoader = false;
        });
      that.editingUser = false;
      if (errorflag == 0) {
        that.closeEditUser();
      }
    },
    editItem(item) {
      this.editedIndex = this.allUser.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editingDialog = true;
    },
    getDataFromApi() {
      const { page, itemsPerPage } = this.options;
      this.loading = true;
      api.groupFactory
        .getUserInGroup(this.groupId, page, itemsPerPage, "")
        .then((response) => {
          this.allUser = response.content.list;
          this.totalUser = response.content.totalAmount;
          this.loading = false;
        });
    },
  },
};
</script>