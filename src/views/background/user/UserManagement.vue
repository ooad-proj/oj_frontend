<template>
  <div>
    <SnackBar ref="sb"></SnackBar>
    <div class="tw-bg-white tw-shadow-md">
      <v-breadcrumbs :items="items"></v-breadcrumbs>
    </div>
    <v-container grid-list-xs fluid>
      <v-row>
        <v-col>
          <v-card class="pa-4">
            <div class="tw-flex tw-justify-between tw-items-center tw-mb-8">
              <div class="tw-font-bold tw-text-xl">所有用户</div>
              <div>
                <v-btn color="primary" @click="addingManyUser = true"
                  >批量添加</v-btn
                >
                <v-btn color="primary mx-2" @click="addingUser = true"
                  >添加用户</v-btn
                >
              </div>
            </div>

            <v-dialog v-model="addingManyUser" max-width="600px">
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
                              >学号:{{ item.userId }} 结果:{{
                                item.status
                              }}</strong
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
                    <v-file-input
                      truncate-length="15"
                      v-model="csvFile"
                    ></v-file-input>
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
                        :loading="addingUserLoader"
                        :disabled="addingUserLoader"
                        >上传</v-btn
                      >

                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-col>
                </v-row>
              </v-card>
            </v-dialog>

            <v-dialog v-model="addingUser" max-width="600px">
              <v-card class="pa-5">
                <v-row>
                  <v-col>
                    <v-card-title class="text-h5">添加一个用户</v-card-title>
                    <v-card-text>
                      <v-form ref="form">
                        <v-text-field
                          v-model="id"
                          :rules="[(v) => !!v || 'ID不能为空']"
                          label="ID"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-model="name"
                          :rules="[(v) => !!v || '用户名不能为空']"
                          label="用户名"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-model="mail"
                          :rules="[(v) => !!v || '邮箱不能为空']"
                          label="邮箱"
                          required
                        ></v-text-field
                      ></v-form>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="closeAddUser"
                        >取消</v-btn
                      >
                      <v-btn
                        color="blue darken-1 secondary"
                        text
                        @click="addUser"
                        :loading="addingUserLoader"
                        :disabled="addingUserLoader"
                        >确定</v-btn
                      >
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-col>
                </v-row>
              </v-card>
            </v-dialog>

            <v-data-table
              :headers="headers"
              :items="userInfo"
              :options.sync="options"
              :server-items-length="totalUser"
              :loading="loading"
              class="elevation-2"
            >
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
              </template>

    
            </v-data-table>

            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">确定删除吗</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >取消</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >确定</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog
              v-model="editingDialog"
              max-width="500px"
              transition="dialog-transition"
            >
              <v-card class="pa-5">
                <v-row>
                  <v-col>
                    <v-card-title class="text-h5">修改这个用户</v-card-title>
                    <v-card-text>
                      <v-form ref="formSecond">
                        <v-text-field
                          v-model="editedItem.userId"
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
                      <v-btn color="blue darken-1" text @click="closeEditing"
                        >取消</v-btn
                      >
                      <v-btn
                        color="blue darken-1 secondary"
                        text
                        @click="submitEditUser"
                        :loading="editingUser"
                        :disabled="editingUser"
                        >确定</v-btn
                      >
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-col>
                </v-row>
              </v-card>
            </v-dialog>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script>
import api from "@/api/api";
import SnackBar from "../../../components/SnackBar.vue";
import axios from "axios";
export default {
  components: {
    SnackBar,
  },
  data() {
    return {
      dialogDelete: false,
      editingUser: false,
      defaultItem: {
        name: "",
        userId: "",
        mail: "",
      },
      editedItem: {
        name: "",
        userId: "",
        mail: "",
      },
      editedIndex: null,
      editingDialog: null,
      csvFile: null,
      responseData: [],
      id: null,
      name: null,
      mail: null,
      addingManyUser: false,
      benched: 0,
      groupName: "",
      addingUser: false,
      addingUserLoader: false,
      items: [
        {
          text: "所有用户",
          disabled: false,
        },
      ],
      totalUser: 0,
      userInfo: [],
      loading: true,
      options: {},
      headers: [
        {
          text: "用户ID",
          align: "start",
          sortable: false,
          value: "userId",
        },
        { text: "用户名称", value: "name" },
        { text: "用户邮箱", value: "mail" },
        { text: "操作", value: "actions", sortable: false },
      ],
    };
  },
  computed: {},
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
    deleteItemConfirm() {
      api.userFactory
        .deleteUserInfo(this.editedItem.userId)
        .then((response) => {
          if (response.code == 0) {
            this.$refs.sb.warn("删除成功");
          } else {
            this.$refs.sb.warn("删除失败，未知错误");
          }
        });
        this.closeDelete()
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    deleteItem(item) {
      this.editedIndex = this.userInfo.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    closeEditing() {
      this.$refs.formSecond.resetValidation();
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.editingDialog = false;
    },
    submitEditUser() {
      let errorflag = 0;
      let that = this;
      that.editingUser = true;
      api.userFactory
        .changeUserInfo(
          that.editedItem.userId,
          that.editedItem.name,
          "123456",
          that.editedItem.mail
        )
        .then((response) => {
          if (response.code == 0) {
            this.$refs.sb.warn(response.msg);
          } else {
            this.$refs.sb.warn("修改失败，未知错误");
            errorflag = 1;
          }
        });
      that.editingUser = false;
      if (errorflag == 0) {
        that.closeEditing();
      }
    },
    sendFile() {
      let that = this;
      let url = "http://mockjs.docway.net/mock/1itkXEuHAcj/api/user/add/batch";
      //获取数据
      let data = new FormData();
      data.append("file", this.csvFile);
      //附加headerio
      let header = { "Content-Type": "multipart/form-data;" };
      axios.post(url, data, header).then((resp) => {
        that.responseData = resp.data.content;
        that.repsonseData = that.responseData.map(function (item) {
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
        this.$refs.sb.warn("上传成功");
      });
    },
    closeUpload() {
      this.addingManyUser = false;
      this.responseData = [];
    },
    closeAddUser() {
      this.$refs.form.resetValidation();
      this.id = null;
      this.name = null;
      this.mail = null;
      this.addingUser = false;
    },
    addUser() {
      this.addingUserLoader = true;
      api.userFactory
        .createUser(this.id, this.name, 123456, this.mail)
        .then((response) => {
          if (response.code == 0) {
            this.$refs.sb.warn("添加成功");
          } else if (response.code == -1) {
            this.$refs.sb.warn("用户已经存在");
          } else if (response.code == -2) {
            this.$refs.sb.warn("必填项不能为空");
          } else if (response.code == -3) {
            this.$refs.sb.warn("密码格式错误");
          } else {
            this.$refs.sb.warn("未知错误");
          }
        });

      this.addingUserLoader = false;
    },
    getDataFromApi() {
      const { page, itemsPerPage } = this.options;
      this.loading = true;
      api.userFactory
        .getUserInfoSimple(page, itemsPerPage, "")
        .then((response) => {
          this.userInfo = response.content.list;
          this.totalUser = response.content.totalAmount;
          this.loading = false;
        });
    },
    editItem(item) {
      this.editedIndex = this.userInfo.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editingDialog = true;
    },
  },
};
</script>

<style>
</style>