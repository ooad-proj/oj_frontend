<template>
  <div>
    <SnackBar ref="sb"></SnackBar>
    <v-container grid-list-xs fluid>
      <v-card class="pa-5">
        <div class="tw-flex tw-justify-between tw-items-center">
          <div class="tw-font-bold tw-text-xl">{{ this.HeadLine }}</div>
        </div>
        <v-form ref="Form">
          <v-container grid-list-xs fluid>
            <v-row>
              <v-col>
                <div
                  class="
                    tw-font-bold
                    tw-bg-gray-50
                    tw-py-2
                    tw-px-4
                    tw-rounded-md
                    tw-my-4
                  "
                >
                  标题
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field
                  v-model="shownId"
                  :counter="20"
                  :rules="[(v) => !!v || '竞赛中显示的id不能为空']"
                  required
                >
                  <div slot="prepend">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <p
                          class="tw-whitespace-pre tw-text-base"
                          v-bind="attrs"
                          v-on="on"
                        >
                          显示ID:
                        </p>
                      </template>
                      <span>竞赛中本题显示的ID。</span>
                    </v-tooltip>
                  </div>
                </v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="title"
                  :counter="50"
                  :rules="[(v) => !!v || '标题不能为空']"
                  required
                >
                  <div slot="prepend">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <p
                          class="tw-whitespace-pre tw-text-base"
                          v-bind="attrs"
                          v-on="on"
                        >
                          标题:
                        </p>
                      </template>
                      <span>问题的标题。</span>
                    </v-tooltip>
                  </div>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <div
                  class="
                    tw-font-bold
                    tw-bg-gray-50
                    tw-py-2
                    tw-px-4
                    tw-rounded-md
                    tw-my-4
                  "
                >
                  问题描述
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-input
                  :rules="[(v) => !!v || '问题描述不能为空']"
                  v-model="description"
                >
                  <md-editor class="tw-w-full" v-model="description" />
                </v-input>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <div
                  class="
                    tw-font-bold
                    tw-bg-gray-50
                    tw-py-2
                    tw-px-4
                    tw-rounded-md
                    tw-my-4
                  "
                >
                  输入格式
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-input
                  :rules="[(v) => !!v || '输入格式不能为空']"
                  v-model="inputFormat"
                >
                  <md-editor class="tw-w-full" v-model="inputFormat" />
                </v-input>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <div
                  class="
                    tw-font-bold
                    tw-bg-gray-50
                    tw-py-2
                    tw-px-4
                    tw-rounded-md
                    tw-my-4
                  "
                >
                  输出格式
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-input
                  :rules="[(v) => !!v || '输出格式不能为空']"
                  v-model="outputFormat"
                >
                  <md-editor class="tw-w-full" v-model="outputFormat" />
                </v-input>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <div
                  class="
                    tw-font-bold
                    tw-bg-gray-50
                    tw-py-2
                    tw-px-4
                    tw-rounded-md
                    tw-my-4
                  "
                >
                  样例
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <div v-for="(sample, index) in samples" :key="index">
                  <div
                    class="tw-flex tw-justify-between tw-items-center tw-py-4"
                  >
                    <div class="tw-font-semibold">样例 {{ index + 1 }}</div>
                    <div>
                      <v-btn
                        depressed
                        color="error"
                        @click="deleteSample(index)"
                        >删除样例</v-btn
                      >
                    </div>
                  </div>
                  <v-row>
                    <v-col>
                      <div class="tw-text-sm tw-text-gray-500">输入：</div>
                      <textarea
                        class="
                          tw-p-2 tw-resize-none tw-h-48
                          focus:tw-border-gray-300
                          tw-font-mono
                          focus:tw-outline-none
                          tw-w-full tw-border tw-border-solid tw-rounded-md
                        "
                        v-model="sample.input"
                      ></textarea>
                    </v-col>
                    <v-col>
                      <div class="tw-text-sm tw-text-gray-500">输出：</div>
                      <textarea
                        class="
                          tw-p-2 tw-resize-none tw-h-48
                          focus:tw-border-gray-300
                          tw-font-mono
                          focus:tw-outline-none
                          tw-w-full tw-border tw-border-solid tw-rounded-md
                        "
                        v-model="sample.output"
                      ></textarea>
                    </v-col>
                  </v-row>
                </div>
                <v-input
                  :rules="[(v) => v.length != 0 || '样例不能为空']"
                  v-model="samples"
                >
                  <div class="tw-py-4">
                    <v-btn block depressed color="primary" @click="addSample"
                      >添加样例</v-btn
                    >
                  </div>
                </v-input>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <div
                  class="
                    tw-font-bold
                    tw-bg-gray-50
                    tw-py-2
                    tw-px-4
                    tw-rounded-md
                    tw-my-4
                  "
                >
                  提示
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-input :rules="[(v) => !!v || '提示不能为空']" v-model="tips">
                  <md-editor class="tw-w-full" v-model="tips" />
                </v-input>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <div
                  class="
                    tw-font-bold
                    tw-bg-gray-50
                    tw-py-2
                    tw-px-4
                    tw-rounded-md
                    tw-my-4
                  "
                >
                  问题限制
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field
                  v-model="timeLimit"
                  :rules="[
                    (v) => !!v || '时间限制不能为空',
                    (v) => /^[1-9]\d*$/.test(v) || '时间限制必须为数字',
                  ]"
                  required
                >
                  <div slot="prepend">
                    <p class="tw-whitespace-pre tw-text-base">时间限制(ms)：</p>
                  </div>
                </v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="spaceLimit"
                  :rules="[
                    (v) => !!v || '空间限制不能为空',
                    (v) => /^[1-9]\d*$/.test(v) || '空间限制必须为数字',
                  ]"
                  required
                >
                  <div slot="prepend">
                    <p class="tw-whitespace-pre tw-text-base">空间限制(MB)：</p>
                  </div>
                </v-text-field>
              </v-col>
            </v-row>

            <!-- //TODO组合框 -->
            <v-row>
              <v-col>
                <div
                  class="
                    tw-font-bold
                    tw-bg-gray-50
                    tw-py-2
                    tw-px-4
                    tw-rounded-md
                    tw-my-4
                  "
                >
                  语言设置
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <v-checkbox
                  v-model="isTemplate"
                  label="是否需要模板"
                  class=""
                ></v-checkbox>
              </v-col>
              <v-col>
                <v-combobox
                  v-model="select"
                  :items="languages"
                  label="允许的语言"
                  :rules="[(v) => v.length != 0 || '语言不能为空']"
                  multiple
                  chips
                ></v-combobox>
              </v-col>
            </v-row>

            <v-row v-if="isTemplate">
              <v-col>
                <div v-for="(language, index) in select" :key="index">
                  <v-textarea
                    outlined
                    :label="language + '模板'"
                    v-model="content[language]"
                  ></v-textarea>
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <div
                  class="
                    tw-font-bold
                    tw-bg-gray-50
                    tw-py-2
                    tw-px-4
                    tw-rounded-md
                    tw-my-4
                  "
                >
                  样例设置
                </div>
              </v-col>
            </v-row>

            <v-row class="tw-mt-4">
              <v-col md="2">
                <v-input
                  :rules="[(v) => !!v || '必须上传样例']"
                  v-model="testCaseId"
                >
                  <div
                    class="
                      tw-rounded-md
                      tw-flex
                      tw-justify-center
                      tw-items-center
                      tw-w-full
                      tw-text-center
                      tw-h-10
                    "
                    :class="
                      !!testCaseId ? ' tw-bg-teal-300' : ' tw-bg-gray-300'
                    "
                  >
                    <div>
                      {{ !!testCaseId ? testCaseId + ".zip" : "未上传" }}
                    </div>
                  </div>
                </v-input>
              </v-col>
              <v-col md="7">
                <v-file-input
                  outlined
                  label="样例"
                  truncate-length="15"
                  v-model="sampleFile"
                  dense
                  accept=".zip"
                  :rules="[(v) => !!testCaseId || !!v || '文件不能为空']"
                ></v-file-input>
              </v-col>
              <v-col md="3">
                <div class="tw-flex tw-space-x-2">
                  <v-btn
                    color="primary"
                    :disabled="!!!sampleFile"
                    @click="uploadSample"
                    >上传样例</v-btn
                  >
                  <v-btn color="primary">下载样例</v-btn>
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <div
                  class="
                    tw-font-bold
                    tw-bg-gray-50
                    tw-py-2
                    tw-px-4
                    tw-rounded-md
                    tw-my-4
                  "
                >
                  评分标准
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col md="2">
                <v-checkbox
                  v-model="allowPartial"
                  label="允许部分分"
                ></v-checkbox>
              </v-col>
              <v-col md="3">
                <v-text-field
                  v-model="totalScore"
                  :rules="[
                    (v) => !!v || '总分不能为空',
                    (v) => /^[1-9]\d*$/.test(v) || '总分必须为数字',
                  ]"
                  required
                >
                  <div slot="prepend">
                    <p class="tw-whitespace-pre tw-text-base">总分：</p>
                  </div>
                </v-text-field>
              </v-col>
              <v-col>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="punishRule"
                      v-bind="attrs"
                      v-on="on"
                      :rules="[
                        (v) => !!v || '罚分规则不能为空',
                        (v) =>
                          /^[\[](((0.(\d)+)|(1)|(0))[,])*((0.(\d)+)|(1)|(0))[\]]$/.test(
                            v
                          ) || '罚分规则格式错误',
                      ]"
                      required
                    >
                      <div slot="prepend">
                        <p class="tw-whitespace-pre tw-text-base">罚分规则：</p>
                      </div>
                    </v-text-field>
                  </template>
                  <span>元素为0-1之间的数组</span>
                </v-tooltip>

                <!-- <v-text-field
                  v-model="punishRule"
                  :rules="[
                    (v) => !!v || '罚分规则不能为空',
                    (v) =>
                      /^[\[](((0.(\d)+)|(1)|(0))[,])*((0.(\d)+)|(1)|(0))[\]]$/.test(
                        v
                      ) || '罚分规则格式错误',
                  ]"
                  required
                >
                  <div slot="prepend">
                    <p class="tw-whitespace-pre tw-text-base">罚分规则：</p>
                  </div>
                </v-text-field> -->
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <div
                  class="
                    tw-font-bold
                    tw-bg-gray-50
                    tw-py-2
                    tw-px-4
                    tw-rounded-md
                    tw-my-4
                  "
                >
                  额外信息
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col md="2">
                <v-checkbox
                  v-model="allowDetailedResult"
                  label="允许学生查看详细结果"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-container>

          <div class="tw-p-10"></div>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="cancel">取消</v-btn>
            <v-btn
              color="primary"
              text
              @click="confirm"
              :disabled="loader"
              :loading="loader"
              >{{ button_two }}</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-form>
        <!-- <v-btn color="success" @click="show">text</v-btn> -->
      </v-card>
    </v-container>
  </div>
</template>

<script>
import api from "@/api/api";
import SnackBar from "../../../components/SnackBar.vue";
import MdEditor from "../../../components/MdEditor.vue";
export default {
  computed: {
    HeadLine() {
      return this.$route.query.ifEdit ? "修改问题" : "添加问题";
    },
    button_two() {
      return this.$route.query.ifEdit ? "修改" : "添加";
    },
  },
  components: {
    SnackBar,
    MdEditor,
  },
  mounted() {
    if (this.$route.query.ifEdit) {
      this.getDataFromApi();
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  data() {
    return {
      allowDetailedResult:false,
      isTemplate: false,
      prevRoute: null,
      test: false,
      //////////////////////////////////////////////
      loader: false,
      //////////////////////////评分规则///////////////
      allowPartial: false,
      totalScore: null,
      punishRule: null,
      //////////////////////////选择///////////////////
      languages: ["python", "java"],
      select: ["java"],



      content: {
        python: "asddsa",
        java: "",
      },
      ////////////////////////样例文件//////////////////////
      testCaseAmount: null,
      testCaseId: null,
      sampleFile: null,
      /////////////////////////////////////////////////
      timeLimit: null,
      spaceLimit: null,
      ////////////////////////////添加样例//////////////
      addSampleValid: false,
      addingSampleLoader: false,
      addSampleDialog: false,
      Newinput: "",
      Newoutput: "",
      //////////////////////////////////////////////////
      headers: [
        {
          text: "输入",
          sortable: false,
          value: "input",
        },
        { text: "输出", value: "output", sortable: false },
        { text: "删除", value: "delete", sortable: false, width: 50 },
      ],
      samples: [
        { input: "asdasd", output: "asdad" },
        { input: "asdasd", output: "sasd" },
      ],
      shownId: null,
      title: null,
      description: "",
      inputFormat: "",
      outputFormat: "",
      tips: "",
    };
  },
  methods: {
    confirm() {
      this.$route.query.ifEdit ? this.submitEdit() : this.submit();
    },
    changeTemplateToContent(submitTemplate) {
      let temp = {};
      submitTemplate.forEach(function (item) {
        temp[item.language] = item.code;
      });
      return temp;
    },
    changeContentToTemplete(select, content) {
      let temp = [];
      select.forEach(function (item) {
        temp.push({ language: item, code: content[item] });
      });
      return temp;
    },
    ///////////////////////////////取消////////////////////////////

    //////////////////////////////取消////////////////////////////
    show() {
      this.changeContentToTemplete(this.select, this.content);
    },
    deleteItem() {},
    addSample() {
      this.samples.push({ input: "", output: "" });
    },
    deleteSample(index) {
      this.samples.splice(index, 1);
    },
    uploadSample() {
      api.problemFactory
        .addSample(this.$route.params.contestId, this.sampleFile)
        .then((response) => {
          let map = { 0: "样例上传成功", "-1": "样例上传失败" };
          console.log(this.sampleFile);
          if (response.code == 0) {
            this.testCaseId = response.content.testCaseId;
            this.testCaseAmount = response.content.testCaseAmount;
            this.sampleFile = null;
          }
          this.$refs.sb.warn(map[response.code]);
        });
    },
    //TODO清空所有
    recover() {
      this.shownId = null;
      this.title = null;
      this.description = "";
      this.inputFormat = "";
      this.outputFormat = "";
      this.samples = [
        { input: "asdasd", output: "asdad" },
        { input: "asdasd", output: "sasd" },
      ];
      this.tips = "";
      this.timeLimit = null;
      this.spaceLimit = null;
      this.select = ["C++"];
      this.testCaseId = "";
      this.content = {
        python: "asddsa",
        java: "",
      };
      this.totalScore = "";
      this.punishRule = "";
      this.allowPartial = false;
    },
    cancel() {
      this.recover();
      this.$router.go(-1);
    },
    submit() {
      console.log("提交");
      let scoreRule = {
        totalScore: this.totalScore,
        punishRule: this.punishRule,
        allowPartial: this.allowPartial,
      };
      let submitTemplate = this.changeContentToTemplete(
        this.select,
        this.content
      );

      if (this.$refs.Form.validate()) {
        this.loader = true;
        api.problemFactory
          .addProblem(
            this.$route.params.contestId,
            this.shownId,
            this.title,
            this.description,
            this.inputFormat,
            this.outputFormat,
            this.samples,
            this.tips,
            this.timeLimit,
            this.spaceLimit,
            this.select,
            this.testCaseId,
            submitTemplate,
            scoreRule,
            this.allowDetailedResult
          )
          .then((response) => {
            if (response.code == [0]) {
              this.loader = false;
              this.$refs.sb.warn("添加成功");
              this.recover();
              this.$router.go(-1);
            } else {
              this.loader = false;
              this.$refs.sb.warn("添加失败");
            }
          });
      } else {
        this.$refs.sb.warn("请重新检查表单");
      }
    },
    submitEdit() {
      console.log("修改");
      let scoreRule = {
        totalScore: this.totalScore,
        punishRule: this.punishRule,
        allowPartial: this.allowPartial,
      };
      let submitTemplate = this.changeContentToTemplete(
        this.select,
        this.content
      );
      if (!this.isTemplate) {
        submitTemplate = [];
      }
      // console.log()
      if (this.$refs.Form.validate()) {
        api.problemFactory
          .editProblemInfo(
            this.$route.query.problemId,
            this.shownId,
            this.title,
            this.description,
            this.inputFormat,
            this.outputFormat,
            this.samples,
            this.tips,
            this.timeLimit,
            this.spaceLimit,
            this.select,
            this.testCaseId,
            submitTemplate,
            scoreRule,
            this.allowDetailedResult
          )
          .then((response) => {
            console.log(response);
            if (response.code == [0]) {
              this.loader = false;
              this.$refs.sb.warn("修改成功");
              this.recover();
              this.$router.go(-1);
            } else {
              this.loader = false;
              this.$refs.sb.warn("修改失败");
            }
          });
      } else {
        this.$refs.sb.warn("请重新检查表单");
      }
    },
    getDataFromApi() {
      api.problemFactory
        .getProblemInfo(this.$route.query.problemId)
        .then((response) => {
          console.log(response);
          if (response.code == 0) {
            this.allowDetailedResult = response.content.allowDetailedResult;
            this.shownId = response.content.shownId;
            this.title = response.content.title;
            this.description = response.content.description;
            this.inputFormat = response.content.inputFormat;
            this.outputFormat = response.content.outputFormat;
            this.samples = response.content.samples;
            this.tips = response.content.tips;
            this.timeLimit = response.content.timeLimit;
            this.spaceLimit = response.content.spaceLimit;
            this.select = response.content.allowedLanguage;
            this.testCaseId = response.content.testCaseId;
            this.content = this.changeTemplateToContent(
              response.content.submitTemplate
            );
            this.totalScore = response.content.scoreRule.totalScore;
            this.punishRule = response.content.scoreRule.punishRule;
            this.allowPartial = response.content.scoreRule.allowPartial;
            if(response.content.submitTemplate.length>0){
              this.isTemplate = true
            }
          } else {
            //TODO error Page
            let a = 1;
            console.log(a);
          }
          console.log("???????" + this.description);
        });
    },
  },
};
</script>