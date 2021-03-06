<template>
  <div>
    <v-container grid-list-xs fluid>
      <SnackBar ref="sb"></SnackBar>

      <DeleteDialog
        title="删除一个答案"
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
              <v-card-title class="text-h5">{{ addtitle }}</v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="addValid">
                  <v-select
                    :items="selections"
                    v-model="editItem.language"
                    dense
                    outlined
                    class="pt-5"
                    label="语言"
                  ></v-select>

                  <div style="height: 600px" class="tw-overflow-y-auto">
                    <vue-codeditor
                      style="font-size: 16px; min-height: 600px"
                      v-model="editItem.code"
                      :mode="languagemode(editItem.language)"
                      theme="chrome"
                    />
                  </div>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="cancelAddItem()"
                  >取消</v-btn
                >
                <v-btn
                  color="primary"
                  text
                  @click="confirmAddItem()"
                  :loading="addLoader"
                  :disabled="addLoader"
                  >确定</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>

      <v-row>
        <v-col>
          <v-card class="pa-5">
            <div class="tw-flex tw-justify-between tw-items-center pa-5">
              <div class="tw-font-bold tw-text-xl">
                编辑问题 {{ problemId }} 的答案
              </div>
              <div>
                <v-row>
                  <v-col md="6">
                    <v-checkbox
                      v-model="isPublish"
                      label="公开答案"
                      class=""
                    ></v-checkbox>
                  </v-col>
                  <v-col md="6">
                    <v-btn text @click="addingDialog = true" class="primary mt-3"
                      >添加一条新答案
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </div>

            <div>
              <v-tabs v-model="tab" show-arrows>
                <v-tab v-for="(n, index) in items" :key="index">
                  {{ n.language }}
                </v-tab>
              </v-tabs>
              <v-card-text class="text-center">
                <v-tabs-items v-model="tab">
                  <v-tab-item v-for="(item, index) in items" :key="index">
                    <div
                      class="tw-flex tw-justify-between tw-items-center tw-py-3"
                    >
                      <div class="tw-flex tw-items-center">
                        <div>语言：</div>

                        <div>
                          <v-select
                            :items="selections"
                            v-model="item.language"
                            solo
                            flat
                            background-color="grey lighten-3"
                            class="pt-5"
                          ></v-select>
                        </div>
                      </div>
                      <div>
                        <v-btn
                          color="error"
                          @click="deleteItem(item)"
                          class="mx-5"
                        >
                          删除该答案
                        </v-btn>

                        <v-btn
                          color="primary"
                          @click="setAnswer(item)"
                          :disabled="item.isStandard"
                          >设置为标准答案</v-btn
                        >
                      </div>
                    </div>

                    <div style="height: 600px" class="tw-overflow-y-auto">
                      <vue-codeditor
                        style="font-size: 16px; min-height: 600px"
                        v-model="item.code"
                        :mode="languagemode(item.language)"
                        theme="katzenmilch"
                      />
                    </div>
                  </v-tab-item>
                </v-tabs-items>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="cancel">取消</v-btn>
                <v-btn
                  color="primary"
                  text
                  @click="confirm()"
                  :disabled="loader"
                  :loading="loader"
                  >保存</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import SnackBar from "@/components/SnackBar.vue";
import api from "@/api/api";
import DeleteDialog from "@/components/DeleteDialog.vue";
export default {
  components: {
    DeleteDialog,
    SnackBar,
  },
  mounted() {
    this.problemId = this.$route.params.problemId;
    this.getDataFromApi();
  },
  computed: {},
  data() {
    return {
      isPublish: false,
      addtitle: "添加一份新答案",
      addValid: false,
      addLoader: false,
      editItem: {
        language: "java",
        code: "",
      },
      defaultItem: {
        language: "java",
        code: "",
      },
      addingDialog: false,
      loader: false,
      dialogDelete: false,
      selections: ["java","python"],
      problemId: 0,

      tab: null,
      items: [],
    };
  },
  methods: {
    languagemode(val) {
      let map = {
        java: "java",
        python: "python",
      };
      return map[val];
    },
    setAnswer(item) {
      // let index = this.items.indexOf(item);
      item.isStandard = true;
      this.items.forEach((val) => {
        if (val != item) {
          val.isStandard = false;
        }
      });
      console.log(this.items);
    },
    getDataFromApi() {
      api.problemFactory.getAnswerOfProblem(this.problemId).then((response) => {
        if (response.code == 0) {
          this.isPublish = response.content.isPublish;
          this.items = response.content.answer;
        }
      });
    },
    deleteItem(item) {
      this.deleteIndex = this.items.indexOf(item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.items.splice(this.deleteIndex, 1);
      this.closeDelete();
    },
    closeDelete() {
      this.dialogDelete = false;
      this.deleteContestId = null;
      this.$refs.sb.warn("删除成功");
    },
    cancel() {
      this.$router.go(-1);
    },
    confirm() {
      console.log(this.items);
      api.problemFactory
        .editAnswerOfProblem(this.problemId, this.items, this.isPublish)
        .then((response) => {
          if (response.code == 0) {
            this.$refs.sb.warn("保存成功");
            let sleep = (time) =>
              new Promise((resolve) => {
                setTimeout(resolve, time);
              });
            sleep(1000).then(() => {
              this.$router.go(-1);
            });
          } else {
            this.$refs.sb.warn("保存失败,未知错误");
          }
        });
    },
    cancelAddItem() {
      this.editItem = Object.assign({}, this.defaultItem);
      this.addingDialog = false;
    },
    confirmAddItem() {
      let temp = { language: "", code: "", isStandard: false };
      temp.language = this.editItem.language;
      temp.code = this.editItem.code;
      this.items.push(temp);
      this.cancelAddItem();
    },
  },
};
</script>