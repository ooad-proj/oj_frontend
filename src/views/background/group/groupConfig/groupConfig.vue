<template>
  <v-card class="tw-pb-8">
    <div class="tw-flex tw-justify-between tw-items-center pa-5">
      <div class="tw-text-xl tw-font-bold">组详情</div>

      <div>
        <v-btn color="primary" @click="editGroupName" class="mx-1" v-if="checkTeacher"
          >修改组名</v-btn
        ><v-btn color="error" @click="deleteGroup" class="mx-1" v-if="checkTeacher">删除本组</v-btn>
      </div>
    </div>
    <v-container fluid class="tw-px-8">
      <v-row>
        <div class="tw-flex tw-flex-row tw-p-3">
          <div class="tw-w-32">组id：</div>
          <div class="tw-w-48">{{ groupId }}</div>
        </div>
      </v-row>

      <v-row>
        <div class="tw-flex tw-flex-row tw-p-3">
          <div class="tw-w-32">组名：</div>
          <div class="tw-w-48">{{ name }}</div>
        </div>
      </v-row>

      <v-row>
        <div class="tw-flex tw-flex-row tw-p-3">
          <div class="tw-w-32">学生人数：</div>
          <div class="tw-w-48">{{ memberNum }}</div>
        </div>
      </v-row>

      <v-row>
        <div class="tw-flex tw-flex-row tw-p-3">
          <div class="tw-w-32">学助人数：</div>
          <div class="tw-w-48">{{ assistantNum }}</div>
        </div>
      </v-row>
    </v-container>

    <DeleteDialog
      title="删除用户组"
      content="确定删除吗，确认删除操作后将离开本界面，跳转至所有群组界面"
      width="35rem"
      v-model="dialogDelete"
      @cancel="closeDelete"
      @confirm="deleteItemConfirm"
    ></DeleteDialog>

    <v-dialog v-model="editingDialog" max-width="600px">
      <v-card class="pa-5">
        <v-row>
          <v-col>
            <v-card-title class="text-h5">修改组名</v-card-title>
            <v-card-text>
              <v-form ref="addingForm" v-model="addValid">
                <v-text-field
                  v-model="newName"
                  :rules="[(v) => !!v || 'ID不能为空']"
                  label="请输入新的组名"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="closeEditingDialog"
                >取消</v-btn
              >
              <v-btn
                color="primary"
                text
                @click="submitEditingDialog"
                :loading="editingLoader"
                :disabled="editingLoader || !addValid"
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
import api from "@/api/api";
import DeleteDialog from "@/components/DeleteDialog.vue";
export default {
  props: ["groupId"],
  components: {
    DeleteDialog,
  },
  data() {
    return {
      myrole:null,
      name: null,
      memberNum: null,
      assistantNum: null,

      addValid: false,
      editingDialog: false,
      dialogDelete: false,
      newName: null,
      editingLoader: false,
    };
  },
  mounted() {
    this.getDataFromApi();
    this.getMyRole();
  },
  computed:{
    checkTeacher: function(){
      return this.myrole == 'teacher'
    }
  },
  methods: {
    getMyRole() {
      api.authFactory.getRole().then((response) => {
        this.myrole = response.content;
      });
    },
    getDataFromApi() {
      api.groupFactory.getDataInGroup(this.groupId).then((response)=>{
        this.name = response.content.groupName
        this.memberNum = response.content.memberNum
        this.assistantNum = response.content.assistantNum
      })
    },
    closeEditingDialog() {
      this.editingDialog = false;
      this.newName = null;
      this.$refs.addingForm.resetValidation();
      this.getDataFromApi();
    },
    submitEditingDialog() {
      api.groupFactory
        .editGroupName(this.newName, this.groupId)
        .then((response) => {
          let respMap = {
            0: "成功",
            "-1": "组已存在",
            "-2": "组为空",
            "-3": "组名重复",
          };
          this.$emit("editName", respMap[response.code]);
          this.editingLoader = false;
          this.closeEditingDialog();
        });
    },
    editGroupName() {
      this.editingDialog = true;
    },
    deleteItemConfirm() {
      api.groupFactory.deleteGroup(this.groupId).then((response) => {
        this.closeDelete();
        if (response.code == 0) {
          this.$router.push({ name: "GroupManagement" });
        } else {
          this.$emit("editName", response.msg);
        }
      });
    },
    deleteGroup() {
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false;
    },
  },
};
</script>