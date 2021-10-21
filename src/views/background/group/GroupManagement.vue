<template>
  <div>
    <SnackBar ref="snkBar"></SnackBar>
    <div class="tw-bg-white tw-shadow-md">
      <v-breadcrumbs :items="items"></v-breadcrumbs>
    </div>
    <v-container grid-list-xs fluid>
      <v-row>
        <v-col>
          <v-card>
            <div class="tw-flex tw-justify-between tw-items-center pa-5">
              <div class="tw-font-bold tw-text-xl">我管理的群组</div>
              <div>
                <v-btn color="primary" @click="addGroup">添加群组</v-btn>
              </div>
            </div>

            <v-dialog v-model="add_group" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">添加一个班级</v-card-title>
                <v-card-text>
                  <v-form ref="groupForm">
                    <v-text-field
                      v-model="groupName"
                      :rules="[(v) => !!v || '名称不能为空']"
                      label="请输入班级的名称"
                      required
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeAddGroup"
                    >取消</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="confirmAddGroup"
                    >确定</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-data-table
              :headers="headers"
              :items="groupInfo"
              :options.sync="options"
              :server-items-length="totalgroup"
              :loading="loading"
              class="elevation-2"
            >
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn
                  text
                  color="primary"
                  :to="{
                    name: 'GroupInfo',
                    params: {
                      groupId: item.groupId,
                      name: item.groupName,
                      memberNum: item.memberNum,
                      assistantNum: item.assistantNum,
                    },
                  }"
                >
                  <v-icon left>mdi-door-open</v-icon>
                  进入
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import api from "@/api/api";
import SnackBar from "../../../components/SnackBar.vue";
export default {
  components: {
    SnackBar,
  },
  data() {
    return {
      groupName: "",
      add_group: false,
      items: [
        {
          text: "我管理的群组",
          disabled: false,
        },
      ],
      totalgroup: 0,
      groupInfo: [],
      loading: true,
      options: {},
      headers: [
        {
          text: "群组ID",
          align: "start",
          sortable: false,
          value: "groupId",
        },
        { text: "群组名称", value: "groupName" },
        { text: "当前人数", value: "memberNum" },
        { text: "学助人数", value: "assistantNum" },
        { text: "进入群组", value: "actions", sortable: false ,class:"tw-w-48",align: "center"},
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
    this.getDataFromApi();
  },
  methods: {
    getDataFromApi() {
      this.loading = true;
      const { page, itemsPerPage } = this.options;
      api.groupFactory.getGroup(page, itemsPerPage, "").then((response) => {
        this.groupInfo = response.content.list;
        this.totalgroup = response.content.totalAmount;
        this.loading = false;
      });
    },
    closeAddGroup() {
      this.groupName = null;
      this.add_group = false;
      this.$refs.groupForm.resetValidation();
    },
    confirmAddGroup() {
      api.groupFactory.createGroup(this.groupName).then((response) => {
        this.$refs.snkBar.warn(response.msg);
        this.getDataFromApi();
        this.closeAddGroup();
      });
    },
    addGroup() {
      this.add_group = true;
    },
  },
};
</script>

<style>
</style>