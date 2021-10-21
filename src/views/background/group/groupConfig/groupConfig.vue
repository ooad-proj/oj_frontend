<template>
  <v-card height="400px" pa-5>
    <v-card-text>
      <v-container grid-list-xs>
        <v-row
          ><v-text-field
            v-model="groupId"
            label="组id"
            filled
            readonly
          ></v-text-field
        ></v-row>

        <v-row
          ><v-text-field
            v-model="name"
            label="组名 "
            filled
            readonly
          ></v-text-field
        ></v-row>

        <v-row
          ><v-text-field
            v-model="memberNum"
            label="学生人数"
            filled
            readonly
          ></v-text-field
        ></v-row>

        <v-row
          ><v-text-field
            v-model="assistantNum"
            label="学助人数"
            filled
            readonly
          ></v-text-field
        ></v-row>

        <v-row>
          <v-btn color="primary" @click="editGroupName" class="mr-3"
            >修改组名</v-btn
          ><v-btn color="warning" @click="deleteGroup">删除本组</v-btn>
        </v-row>
      </v-container>
    </v-card-text>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5"
          >确定删除吗，确认删除操作后将离开本界面，跳转至所有群组界面</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">取消</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm"
            >确定</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editingDialog" max-width="600px">
      <v-card class="pa-5">
        <v-row>
          <v-col>
            <v-card-title class="text-h5">修改组名</v-card-title>
            <v-card-text>
              <v-form ref="addingForm">
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
              <v-btn color="blue darken-1" text @click="closeEditingDialog"
                >取消</v-btn
              >
              <v-btn
                color="blue darken-1 secondary"
                text
                @click="submitEditingDialog"
                :loading="editingLoader"
                :disabled="editingLoader"
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
export default {
  props: ["groupId", "name", "memberNum", "assistantNum"],
  data() {
    return {
      editingDialog: false,
      dialogDelete: false,
      newName: null,
      editingLoader: false,
    };
  },
  methods: {
    //TODO
    getDataFromApi() {},
    closeEditingDialog() {
      this.editingDialog = false;
      this.newName = null;
      this.$refs.addingForm.resetValidation();
      this.getDataFromApi();
    },
    submitEditingDialog(){
        api.groupFactory.editGroupName(this.newName,this.groupId).then((response)=>{
            this.$emit("editName", response.code.msg);
            this.editingLoader = false;
            this.closeEditingDialog()
        })
    },
    editGroupName() {
      this.editingDialog = true;
    },
    deleteItemConfirm() {
      api.groupFactory.deleteGroup(this.groupId).then((response) => {
        this.closeDelete();
        if(response.code==0){
            this.$router.push({ name:  'GroupManagement'})
        }else{
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