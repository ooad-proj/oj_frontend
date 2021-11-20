<template>
  <div>
    <SnackBar ref="sb"></SnackBar>
    <div class="tw-bg-white tw-shadow-md">
      <v-breadcrumbs :items="items"></v-breadcrumbs>
    </div>
    <v-container grid-list-xs fluid>
      <v-row>
        <v-col>
          <v-card>
            <div class="tw-flex tw-justify-between tw-items-center pa-5">
              <div class="tw-font-bold tw-text-xl">所有用户</div>
              <div>
                <div class="tw-inline-block mx-1">
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="搜索id"
                    single-line
                    hide-details
                    @click:append="searchId"
                  >
                  </v-text-field>
                </div>
                <v-btn
                  color="primary mx-1"
                  @click="addingManyUser = true"
                  v-if="myrole == 'teacher'"
                  >批量添加</v-btn
                >
                <v-btn
                  color="primary mx-1"
                  @click="addingUser = true"
                  v-if="myrole == 'teacher'"
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
                    item-height="50"
                    width="400"
                    class="tw-bg-gray-300"
                  >
                    <template v-slot:default="{ index, item }">
                      <v-list-item
                        :key="index"
                        :class="
                          index % 2 == 0 ? ' tw-bg-gray-100' : 'tw-bg-gray-50'
                        "
                      >
                        <div class="tw-flex">
                          <div class="tw-w-32">{{ item.userId }}</div>
                          <div
                            :class="classMap[item.status]"
                            class="tw-px-1 tw-rounded-md"
                          >
                            {{ respMap[item.status] }}
                          </div>
                        </div>
                      </v-list-item>
                    </template>
                  </v-virtual-scroll>
                </v-row>
                <v-row>
                  <v-card-text>
                    <v-form ref="formCsv" v-model="csvValid">
                      <v-file-input
                        truncate-length="15"
                        v-model="csvFile"
                        dense
                        accept=".csv"
                        :rules="[
                          (v) =>
                            !!v ||
                            '文件不能为空' ||
                            value.size < 2000000 ||
                            '文件不能大于 2 MB!',
                        ]"
                      ></v-file-input>
                    </v-form>
                    <!-- <input type="file" ref="ref1" /> -->
                  </v-card-text>
                </v-row>
                <v-row>
                  <v-col>
                    <v-card-actions>
                      <v-btn color="primary" text @click="closeUpload"
                        >返回</v-btn
                      >
                      <v-btn
                        color="primary"
                        text
                        @click="sendFile"
                        :loading="addingUserLoader"
                        :disabled="addingUserLoader || !csvValid"
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
                      <v-form ref="form" v-model="addUserValid">
                        <v-text-field
                          v-model="id"
                          :rules="[
                            (v) => !!v || 'ID不能为空',
                            (v) =>
                              /(^[1-9]\d*$)/.test(v) ||
                              '请输入有效的id(8位数字)',
                          ]"
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
                          :rules="[
                            (v) =>
                              v == '' ||
                              /.+@.+\..+/.test(v) ||
                              '邮箱格式不合法',
                          ]"
                          label="邮箱"
                          required
                        ></v-text-field
                      ></v-form>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" text @click="closeAddUser"
                        >取消</v-btn
                      >
                      <v-btn
                        color="primary"
                        text
                        @click="addUser"
                        :loading="addingUserLoader"
                        :disabled="addingUserLoader || !addUserValid"
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
              :footer-props="{
                showFirstLastPage: true,
                itemsPerPageOptions: [5, 10, 15],
              }"
              class="elevation-2"
            >
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon
                  small
                  @click="deleteItem(item)"
                  v-if="item.deletable && myrole == 'teacher'"
                >
                  mdi-delete
                </v-icon>
              </template>

              <template v-slot:[`item.revise`]="{ item }">
                <v-icon
                  small
                  class="mr-2"
                  @click="editItem(item)"
                  v-if="item.editable && myrole == 'teacher'"
                >
                  mdi-pencil
                </v-icon>
              </template>
            </v-data-table>

            <DeleteDialog
              title="删除一个用户"
              content="确定删除吗"
              width="35rem"
              v-model="dialogDelete"
              @cancel="closeDelete"
              @confirm="deleteItemConfirm"
            ></DeleteDialog>

            <v-dialog
              v-model="editingDialog"
              max-width="500px"
              transition="dialog-transition"
            >
              <v-card class="pa-5">
                <v-row>
                  <v-col>
                    <v-card-title class="text-h5"
                      >修改这个用户 {{ editedItem2.id }}</v-card-title
                    >
                    <v-card-text>
                      <v-form ref="formSecond" v-model="infoValid">
                        <v-text-field
                          v-model="editedItem2.name"
                          :rules="[(v) => !!v || '用户名不能为空']"
                          label="用户名"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem2.mail"
                          :rules="[
                            (v) =>
                              v == '' ||
                              /.+@.+\..+/.test(v) ||
                              '邮箱格式不合法',
                          ]"
                          label="邮箱"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem2.password"
                          :rules="[(v) => !!v || '密码不能为空']"
                          label="密码"
                          required
                        ></v-text-field>
                      </v-form>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" text @click="closeEditing"
                        >取消</v-btn
                      >
                      <v-btn
                        color="primary"
                        text
                        @click="submitEditUser"
                        :loading="editingUser"
                        :disabled="!infoValid || editingUser"
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
import DeleteDialog from "@/components/DeleteDialog.vue";
export default {
  components: {
    SnackBar,
    DeleteDialog,
  },

  watch: {
    options: {
      handler() {
        this.getDataFromApi("");
      },
      deep: true,
    },
  },
  mounted() {
    this.getDataFromApi("");
    this.getMyRole();
  },
  data() {
    return {
      myrole: null,
      //编辑的item
      editedItem2: {
        id: null,
        name: null,
        mail: null,
        password: null,
      },
      csvValid: false,
      addUserValid: false,
      search: "",
      respMap: {
        0: "成功",
        "-1": "用户已存在",
        "-2": "必须项不能为空",
        "-3": "密码格式错误",
      },
      classMap: {
        0: "tw-bg-green-400",
        "-1": "tw-bg-yellow-500",
        "-2": "tw-bg-red-400",
        "-3": "tw-bg-red-400",
      },
      infoValid: false,
      dialogDelete: false,
      editingUser: false,
      defaultItem: {
        name: "",
        id: "",
        mail: "",
        isEditable: false,
        isDeleteable: false,
      },
      //删除的item
      editedItem: {
        name: "",
        id: "",
        mail: "",
        isEditable: false,
        isDeleteable: false,
      },
      editedIndex: null,
      editingDialog: null,
      csvFile: null,
      responseData: [],
      id: null,
      name: null,
      mail: "",
      addingManyUser: false,
      benched: 1,
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
          value: "id",
        },
        { text: "用户名称", value: "name", sortable: false },
        { text: "用户邮箱", value: "mail", sortable: false },
        { text: "操作", value: "actions", sortable: false },
        { text: "修改", value: "revise", sortable: false },
      ],
    };
  },
  computed: {},
  methods: {
    getMyRole() {
      api.authFactory.getRole().then((response) => {
        this.myrole = response.content;
      });
    },
    searchId() {
      this.getDataFromApi(this.search);
    },
    deleteItemConfirm() {
      api.userFactory.deleteUserInfo(this.editedItem.id).then((response) => {
        if (response.code == 0) {
          this.$refs.sb.warn("删除成功");
        } else {
          this.$refs.sb.warn("用户不存在");
        }
        this.closeDelete();
        this.getDataFromApi("");
      });
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
        this.editedItem2 = {
          id: null,
          name: null,
          mail: null,
          password: null,
        };
      });
      this.editingDialog = false;
    },
    submitEditUser() {
      let errorflag = 0;
      let that = this;
      that.editingUser = true;
      api.userFactory
        .changeUserInfo(
          that.editedItem2.id,
          that.editedItem2.name,
          that.editedItem2.password,
          that.editedItem2.mail
        )
        .then((response) => {
          if (response.code == 0) {
            this.$refs.sb.warn("修改成功");
          } else {
            this.$refs.sb.warn("非法信息");
            errorflag = 1;
          }
          this.getDataFromApi("");
        });
      that.editingUser = false;
      if (errorflag == 0) {
        that.closeEditing();
      }
    },
    sendFile() {
      let that = this;
      let url = "http://localhost:8082/api/user/add/batch";
      //获取数据
      let data = new FormData();
      data.append("file", this.csvFile);
      //附加headerio
      let header = { "Content-Type": "multipart/form-data;" };
      axios.post(url, data, header).then((resp) => {
        that.responseData = resp.data.content;
        this.$refs.sb.warn("上传成功");
        this.$refs.formCsv.resetValidation();
        this.csvFile = null;
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
          this.$refs.sb.warn(this.respMap[response.code]);
          this.closeAddUser();
          this.addingUserLoader = false;
          this.getDataFromApi("");
        });
    },
    getDataFromApi(searchText) {
      const { page, itemsPerPage } = this.options;
      this.loading = true;
      api.userFactory
        .getUserInfoSimple(page, itemsPerPage, searchText)
        .then((response) => {
          this.userInfo = response.content.list;
          this.totalUser = response.content.totalAmount;
          this.loading = false;
        });
    },

    editItem(item) {
      api.userFactory.getUserById(item.id).then((response) => {
        this.editedItem2 = response.content;
      });

      this.editingDialog = true;
    },
  },
};
</script>

<style>
</style>