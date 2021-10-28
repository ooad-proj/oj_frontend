<template>
  <v-card>
    <div class="tw-flex tw-justify-between pa-5 tw-w-full">
      <div class="tw-text-xl tw-font-bold">班级用户管理</div>

      <div >
        <v-btn color="primary" dark class="mx-1" @click="addingDialog = true" v-if="checkTeacher">
          添加学生到组
        </v-btn>
        <v-btn
          color="primary"
          dark
          class="mx-1"
          @click="addingManyDialog = true"
          v-if="checkTeacher"
        >
          批量添加到组
        </v-btn>
      </div>
    </div>
    <v-data-table
      :headers="headerToShow"
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
              <v-form ref="editingForm" v-model="editValid">
                <v-text-field
                  v-model="editedItem.id"
                  :rules="[
                    (v) => !!v || 'ID不能为空',
                    (v) => /(^[1-9]\d*$)/.test(v) || '请输入有效的id(数字)',
                  ]"
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
                  :rules="[
                    (v) => !!v || '邮箱不能为空',
                    (v) =>
                      /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(
                        v
                      ) || '邮箱格式错误',
                  ]"
                  label="邮箱"
                  required
                ></v-text-field
              ></v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="closeEditUser">取消</v-btn>
              <v-btn
                color="primary"
                text
                @click="submitEditUser"
                :loading="editingUserLoader"
                :disabled="editingUserLoader || !editValid"
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
              <v-form ref="addingForm" v-model="addValid">
                <v-text-field
                  v-model="addUserId"
                  :rules="[
                    (v) => !!v || 'ID不能为空',
                    (v) => /(^[1-9]\d*$)/.test(v) || '请输入有效的id(数字)',
                  ]"
                  label="请输入用户ID"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="closeAddingDialog"
                >取消</v-btn
              >
              <v-btn
                color="primary"
                text
                @click="submitAddingDialog"
                :loading="addUserLoader"
                :disabled="addUserLoader || !addValid"
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
            item-height="50"
            width="400"
            class="tw-bg-gray-300"
          >
            <template v-slot:default="{ index, item }">
              <v-list-item
                :key="index"
                :class="index % 2 == 0 ? ' tw-bg-gray-200' : 'tw-bg-gray-50'"
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
              <v-btn color="primary" text @click="closeUpload">返回</v-btn>
              <v-btn
                color="primary"
                text
                @click="sendFile"
                :loading="addingManyLoader"
                :disabled="addingManyLoader || !csvValid"
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
  computed:{
    checkTeacher: function(){
      // return true
      return this.myrole == 'teacher' ? true : false
    },
      headerToShow: function(){
      return this.myrole == 'teacher'? this.userHeaders:this.headerForAssistant
    }
  },
  components: {
    DeleteDialog,
  },
  data: () => ({
    myrole:null,
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
    csvValid: false,
    editValid: false,
    addValid: false,
    // props: ["groupId"],
    groupId: null,
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
      { text: "用户名", value: "name"   ,sortable: false,},
      { text: "用户邮箱", value: "mail"  ,sortable: false,},
      { text: "编辑用户", value: "edit", sortable: false },
      { text: "删除用户", value: "actions", sortable: false },
    ],
    headerForAssistant: [
      { text: "用户id", align: "start", sortable: false, value: "id" },
      { text: "用户名", value: "name"   ,sortable: false,},
      { text: "用户邮箱", value: "mail"  ,sortable: false,},
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
    this.groupId = this.$route.params.groupId;
    this.getDataFromApi();
    this.getMyRole()
  },
  methods: {
    getMyRole() {
      api.authFactory.getRole().then((response) => {
        this.myrole = response.content;
      });
    },
    sendFile() {
      api.groupFactory
        .addManyUserInGroup(this.groupId, this.csvFile)
        .then((response) => {
          this.responseData = response.content;
          this.$emit("showmsg", "上传成功");
          this.$refs.formCsv.resetValidation();
          this.csvFile = null;
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
          let map = {
            0: "成功",
            "-1": "组不存在",
            "-2": "用户不存在",
            "-3": "用户已在组内",
          };
          this.$emit("showmsg", map[response.code]);
          this.closeAddingDialog();
        });
    },
    deleteItemConfirm() {
      api.groupFactory
        .deleteUserInGroup(this.groupId, this.editedItem.id)
        .then((response) => {
          let map = {
            0: "成功",
            "-1": "组不存在",
            "-2": "用户不在该组",
            "-3": "用户不存在",
          };
          this.$emit("showmsg", map[response.code]);
          this.closeDelete();
        });
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
            this.$emit("showmsg", "修改成功");
          } else {
            this.$emit("showmsg", "非法信息");
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