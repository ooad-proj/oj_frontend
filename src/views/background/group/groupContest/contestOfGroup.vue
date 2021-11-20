<template>
  <div>
    <DeleteDialog
      title="删除一个组内竞赛"
      content="确定删除吗"
      width="35rem"
      v-model="dialogDelete"
      @cancel="closeDelete"
      @confirm="deleteItemConfirm"
    ></DeleteDialog>
    <v-card>
      <div class="tw-flex tw-justify-between tw-items-center pa-5">
        <div class="tw-font-bold tw-text-xl">班级竞赛管理</div>
        <div>
          <div class="tw-inline-block mx-1">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="竞赛标题"
              single-line
              hide-details
              @click:append="searchId"
            >
            </v-text-field>
          </div>
          <v-btn color="primary mx-1" @click="addContest">添加竞赛</v-btn>
        </div>
      </div>

      <v-data-table
        :headers="headers"
        :items="tableData"
        :options.sync="options"
        :footer-props="{
          showFirstLastPage: true,
          firstIcon: 'mdi-arrow-collapse-left',
          lastIcon: 'mdi-arrow-collapse-right',
          prevIcon: 'mdi-minus',
          nextIcon: 'mdi-plus',
          itemsPerPageOptions: [5, 10, 15],
        }"
        :server-items-length="totalContest"
        :loading="loading"
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

        <template v-slot:[`item.enter`]="{ item }">
          <v-btn
            text
            color="primary"
            :to="{
              name: 'contestInfo',
              params: {
                contestId: item.contestId,
              },
            }"
          >
            <v-icon left>mdi-door-open</v-icon>
            进入竞赛
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="editingDialog" max-width="600px">
      <v-card class="pa-5">
        <v-row>
          <v-col>
            <v-card-title class="text-h5">{{ editTitle }}</v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="editValid">
                <v-text-field
                  v-model="editedItem.title"
                  :rules="[
                    (v) => !!v || '标题不能为空',
                    (v) => v.length <= 10 || '输入必须小于10个字符',
                  ]"
                  label="竞赛标题"
                  :counter="10"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.description"
                  :rules="[(v) => v.length <= 10 || '输入必须小于20个字符']"
                  label="竞赛描述"
                  :counter="20"
                  required
                ></v-text-field>
                <v-row>
                  <v-col>
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      :return-value.sync="startDay"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="startDay"
                          label="比赛开始日期"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          required
                          :rules="[(v) => !!v || '选择日期']"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="startDay"
                        no-title
                        scrollable
                        color="green lighten-1"
                        :allowed-dates="allowedDates"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu = false">
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menu.save(startDay)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col>
                    <v-menu
                      ref="menuTime"
                      v-model="menuTime"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="startTimeInDay"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="startTimeInDay"
                          label="设置开始日期时间"
                          prepend-icon="mdi-clock-time-four-outline"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          required
                          :rules="[(v) => !!v || '选择时间']"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="menuTime"
                        :max="judgeTime ? endTimeInDay : null"
                        v-model="startTimeInDay"
                        full-width
                        @click:minute="$refs.menuTime.save(startTimeInDay)"
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-menu
                      ref="menuEndDay"
                      v-model="menuEndDay"
                      :close-on-content-click="false"
                      :return-value.sync="endDay"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="endDay"
                          label="比赛结束日期"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          required
                          :rules="[(v) => !!v || '选择日期']"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="endDay"
                        no-title
                        scrollable
                        color="green lighten-1"
                        :allowed-dates="allowedEndDates"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menuEndDay = false">
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menuEndDay.save(endDay)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col>
                    <v-menu
                      ref="menuEndTime"
                      v-model="menuEndTime"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="endTimeInDay"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="endTimeInDay"
                          label="设置结束日期时间"
                          prepend-icon="mdi-clock-time-four-outline"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          required
                          :rules="[(v) => !!v || '选择时间']"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="menuEndTime"
                        v-model="endTimeInDay"
                        :min="judgeTime ? startTimeInDay : null"
                        full-width
                        @click:minute="$refs.menuEndTime.save(endTimeInDay)"
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="closeEditItem">取消</v-btn>
              <v-btn
                color="primary"
                text
                @click="submiteditItem"
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
  </div>
</template>

<script>
import api from "@/api/api";
import DeleteDialog from "@/components/DeleteDialog.vue";
export default {
  components: {
    DeleteDialog,
  },
  props: ["groupId"],
  data() {
    return {
      // config: {
      //   "items-per-page-options": [5, 10, 15, -1],
      // },
      judge: false,
      ///////////////////创建竞赛///////////////////
      ///////////////////修改竞赛///////////////////
      startDay: null,
      endDay: null,
      startTimeInDay: null,
      endTimeInDay: null,
      menuEndTime: false,
      menuEndDay: false,
      menuTime: false,
      menu: false,
      editValid: false,
      editing: true,
      editingDialog: false,
      editingLoader: false,
      defaultItem: {
        contestId: "",
        title: "",
        startTime: "",
        endTime: "",
        description: "",
      },

      editedItem: {
        contestId: "",
        title: "",
        startTime: "",
        endTime: "",
        description: "",
      },
      editedIndex: -1,
      ///////////////////删除竞赛///////////////////
      deleteContestId: null,
      dialogDelete: false,
      deleteLoader: false,
      ///////////////////获取数据///////////////////
      allowedDates: (val) => {
        // return new Date(val).getTime() - new Date(Date.now()).getTime() > 0;
        if (this.endDay != null) {
          return new Date(this.endDay).getTime() - new Date(val).getTime() >= 0;
        } else {
          return true;
        }
      },
      allowedEndDates: (val) => {
        return new Date(val).getTime() - new Date(this.startDay).getTime() >= 0;
      },
      loading: false,
      search: null,
      tableData: [],
      totalContest: 10,
      options: {},
      //   searchId: "",
      headers: [
        {
          text: "竞赛ID",
          align: "start",
          sortable: false,
          value: "contestId",
        },
        { text: "标题", value: "title", sortable: false },
        { text: "开始时间", value: "startTime", sortable: false },
        { text: "结束时间", value: "endTime", sortable: false },
        { text: "修改", value: "revise", sortable: false },
        { text: "删除", value: "delete", sortable: false },
        { text: "进入", value: "enter", sortable: false },
      ],
      timestampToTime(timestamp) {
        let date = new Date(parseInt(timestamp));
        let Y = date.getFullYear() + "-";
        let M =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
        let D = date.getDate();
        let h = date.getHours() + ":";
        let m = date.getMinutes();
        if (parseInt(m) < 10) {
          m = "0" + m;
        }
        if (parseInt(D) < 10) {
          D = "0" + D;
        }

        D = D + " ";
        return [Y + M + D, h + m];
      },
    };
  },
  computed: {
    editTitle() {
      return this.editing ? "编辑一个竞赛" : "创建一个竞赛";
    },
    judgeTime() {
      if (this.startDay == null || this.endDay == null) {
        return false;
      } else if (this.startDay != this.endDay) {
        return false;
      } else if (this.startDay == this.endDay) {
        return true;
      }
      return false;
    },
    address() {
      const { startDay, endDay } = this;
      return {
        startDay,
        endDay,
      };
    },
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi("");
      },
      deep: true,
    },
    address: {
      handler() {
        if (
          this.startDay != null &&
          this.endDay != null &&
          this.startDay == this.endDay &&
          this.judge
        ) {
          console.log("执行了");
          console.log(this.editingDialog);
          this.startTimeInDay = null;
          this.endTimeInDay = null;
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.getDataFromApi("");
  },
  methods: {
    ////////////////////添加/////////////////////
    addContest() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editing = false;
      this.editingDialog = true;
      this.judge = true;
    },
    ////////////////////修改/////////////////////
    editItem(item) {
      this.editedIndex = this.tableData.indexOf(item);
      let temp_start = item.startTime.trim().split(" ");
      let temp_end = item.endTime.trim().split(" ");
      this.startDay = temp_start[0];
      this.startTimeInDay = temp_start[1];
      this.endDay = temp_end[0];
      this.endTimeInDay = temp_end[1];
      this.editedItem = Object.assign({}, item);
      // console.log(this.)
      this.editingDialog = true;
      console.log(this.startTimeInDay);
    },
    closeEditItem() {
      this.startDay = null;
      this.endDay = null;
      this.startTimeInDay = null;
      this.endTimeInDay = null;
      this.editing = true;
      this.editedIndex = -1;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editingDialog = false;
      this.judge = false;
      this.$refs.form.resetValidation();
    },
    submiteditItem() {
      let date = new Date(this.startDay + " " + this.startTimeInDay);
      let start = date.getTime();
      let date1 = new Date(this.endDay + " " + this.endTimeInDay);
      let end = date1.getTime();
      this.editedItem.startTime = start;
      this.editedItem.endTime = end;
      console.log(this.startTimeInDay);
      console.log(this.editedItem);
      if (this.$refs.form.validate()) {
        this.editingLoader = true;
        if (this.editing) {
          api.contestFactory
            .changeContestBasicInfo(
              this.editedItem.contestId,
              this.editedItem.title,
              this.editedItem.description,
              this.editedItem.startTime,
              this.editedItem.endTime
            )
            .then((response) => {
              let map = { 0: "修改成功", "-1": "失败" };
              this.editingLoader = false;
              this.closeEditItem();
              this.getDataFromApi("");
              this.$emit("showmsg", map[response.code]);
            });
        } else {
          api.contestFactory
            .addContest(
              this.groupId,
              this.editedItem.title,
              this.editedItem.description,
              this.editedItem.startTime,
              this.editedItem.endTime
            )
            .then((response) => {
              let map = { 0: "添加成功", "-1": "失败" };

              this.editingLoader = false;
              this.closeEditItem();
              this.getDataFromApi("");
              this.$emit("showmsg", map[response.code]);
            });
        }
      }
    },
    ////////////////////删除/////////////////////
    deleteItem(item) {
      this.deleteContestId = item.contestId;
      this.dialogDelete = true;
    },
    //TODO loading
    deleteItemConfirm() {
      this.deleteLoader = true;
      api.contestFactory
        .deleteContest(this.deleteContestId)
        .then((response) => {
          let map = { 0: "删除成功", "-1": "竞赛不存在" };
          this.closeDelete();
          this.getDataFromApi("");
          this.deleteLoader = false;
          this.$emit("showmsg", map[response.code]);
        });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.deleteContestId = null;
    },
    ////////////////////获取数据/////////////////
    searchId() {
      this.getDataFromApi(this.search);
    },
    getDataFromApi(searchText) {
      const { page, itemsPerPage } = this.options;
      this.loading = true;
      api.groupFactory
        .getContestInGroup(this.groupId, page, itemsPerPage, searchText)
        .then((response) => {
          let that = this;
          that.tableData = response.content.list;
          that.tableData.map(function (item) {
            let tempStart = that.timestampToTime(item.startTime);
            let tempEnd = that.timestampToTime(item.endTime);

            item.startTime = tempStart[0] + tempStart[1];
            item.endTime = tempEnd[0] + tempEnd[1];
          });

          that.totalContest = response.content.totalAmount;
          this.loading = false;
        });
    },
  },
};
</script>