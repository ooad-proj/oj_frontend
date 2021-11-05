<template>
  <div>
    <SnackBar ref="sb"></SnackBar>
    <v-container grid-list-xs fluid>
      <v-card class="pa-5">
        <div class="tw-flex tw-justify-between tw-items-center">
          <div class="tw-font-bold tw-text-xl"> {{this.HeadLine}}</div>
        </div>
        <v-form ref="Form">
          <v-container grid-list-xs fluid>
            <v-row class="tw-mt-4">
              <v-col>
                <div class="tw-font-bold tw-p-2">标题</div>
                <v-divider></v-divider>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field
                  dense
                  outlined
                  v-model="shownId"
                  :counter="20"
                  :rules="[(v) => !!v || '竞赛中显示的id不能为空']"
                  label="竞赛中显示的id"
                  required
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  dense
                  outlined
                  v-model="title"
                  :counter="50"
                  :rules="[(v) => !!v || '标题不能为空']"
                  label="问题的标题"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="tw-mt-4">
              <v-col>
                <v-row>
                  <v-col md="2">
                    <div class="tw-font-bold tw-p-2">问题描述</div>
                  </v-col>
                  <v-col>
                    <div class="tw-font-bold tw-p-2">
                      <v-input
                        :rules="[(v) => !!v || '问题描述不能为空']"
                        v-model="description"
                      >
                      </v-input>
                    </div>
                  </v-col>
                  <v-spacer></v-spacer>
                </v-row>
                <v-divider></v-divider>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <mavon-editor v-model="description" style="z-index: 0" />
              </v-col>
            </v-row>

            <v-row class="tw-mt-4">
              <v-col>
                <div class="tw-font-bold tw-p-2">输入格式</div>
                <v-divider></v-divider>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-input
                  :rules="[(v) => !!v || '输入格式不能为空']"
                  v-model="inputFormat"
                >
                  <mavon-editor
                    v-model="inputFormat"
                    :boxShadow="false"
                    style="z-index: 0"
                  />
                </v-input>
              </v-col>
            </v-row>

            <v-row class="tw-mt-4">
              <v-col>
                <div class="tw-font-bold tw-p-2">输出格式</div>
                <v-divider></v-divider>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-input
                  :rules="[(v) => !!v || '输出格式不能为空']"
                  v-model="outputFormat"
                >
                  <mavon-editor v-model="outputFormat" style="z-index: 0" />
                </v-input>
              </v-col>
            </v-row>

            <v-row class="tw-mt-4">
              <v-col>
                <div class="tw-font-bold tw-p-2">样例</div>
                <v-divider></v-divider>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <div v-for="(sample, index) in samples" :key="index">
                  <div class="tw-flex tw-justify-between tw-p-2">
                    <div>这是第{{ index + 1 }}号样例</div>

                    <div>
                      <v-btn outlined color="error" @click="deleteSample(index)"
                        >删除样例</v-btn
                      >
                    </div>
                  </div>
                  <v-row>
                    <v-col>
                      <v-textarea outlined v-model="sample.input"></v-textarea>
                    </v-col>
                    <v-col>
                      <v-textarea outlined v-model="sample.output"></v-textarea>
                    </v-col>
                  </v-row>
                </div>
                <v-input
                  :rules="[(v) => v.length != 0 || '样例不能为空']"
                  v-model="samples"
                >
                  <div>
                    <v-btn
                      block
                      depressed
                      color="teal lighten-4"
                      @click="addSample"
                      >添加样例</v-btn
                    >
                  </div>
                </v-input>
              </v-col>
            </v-row>

            <v-row class="tw-mt-4">
              <v-col>
                <div class="tw-font-bold tw-p-2">提示</div>
                <v-divider></v-divider>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-input :rules="[(v) => !!v || '提示不能为空']" v-model="tips">
                  <mavon-editor v-model="tips" style="z-index: 0" />
                </v-input>
              </v-col>
            </v-row>

            <v-row class="tw-mt-4">
              <v-col>
                <div class="tw-font-bold tw-p-2">问题限制</div>
                <v-divider></v-divider>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field
                  dense
                  outlined
                  v-model="timeLimit"
                  :counter="20"
                  :rules="[(v) => !!v || '时间限制不能为空']"
                  label="时间限制"
                  required
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  dense
                  outlined
                  v-model="spaceLimit"
                  :rules="[(v) => !!v || '空间限制不能为空']"
                  label="空间限制"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- //TODO组合框 -->
            <v-row class="tw-mt-4">
              <v-col>
                <div class="tw-font-bold tw-p-2">语言设置</div>
                <v-divider></v-divider>
              </v-col>
            </v-row>

            <v-row>
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

            <v-row class="tw-mt-4">
              <v-col>
                <div class="tw-font-bold tw-p-2">提交模板</div>
                <v-divider></v-divider>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <div v-for="(language, index) in select" :key="index">
                  <v-textarea
                    outlined
                    :label="language"
                    v-model="content[language]"
                  ></v-textarea>
                </div>
              </v-col>
            </v-row>

            <v-row class="tw-mt-4">
              <v-col>
                <div class="tw-font-bold tw-p-2">样例设置</div>
                <v-divider></v-divider>
              </v-col>
            </v-row>

            <v-row class="tw-mt-4">
              <v-col md="2">
                <v-input
                  :rules="[(v) => !!v || '必须上传样例']"
                  v-model="testCaseId"
                >
                  <div>这是{{ testCaseId }}</div>
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
                <v-btn
                  color="success"
                  :disabled="!!!sampleFile"
                  @click="uploadSample"
                  >上传样例</v-btn
                >
                <v-btn color="primary">下载样例</v-btn>
              </v-col>
            </v-row>

            <v-row class="tw-mt-4">
              <v-col>
                <div class="tw-font-bold tw-p-2">评分标准</div>
                <v-divider></v-divider>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field
                  dense
                  outlined
                  v-model="totalScore"
                  :counter="20"
                  :rules="[
                    (v) => !!v || '总分不能为空',
                    (v) => /^[1-9]\d*$/.test(v) || '总分必须为数字',
                  ]"
                  label="总分"
                  required
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  dense
                  outlined
                  v-model="punishRule"
                  :rules="[
                    (v) => !!v || '罚分规则不能为空',
                    (v) =>
                      /^[\[](((0.(\d)+)|(1)|(0))[,])*((0.(\d)+)|(1)|(0))[\]]$/.test(
                        v
                      ) || '罚分规则格式错误',
                  ]"
                  label="罚分规则"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="tw-mt-4">
              <v-col>
                <div class="tw-font-bold tw-p-2">额外选项</div>
                <v-divider></v-divider>
              </v-col>
            </v-row>

            <v-checkbox v-model="allowPartial" label="允许部分分"></v-checkbox>
          </v-container>

          <v-row class="tw-mt-4">
            <v-col>
              <div class="tw-font-bold tw-p-2">提交</div>
              <v-divider></v-divider>
            </v-col>
          </v-row>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="cancel">取消</v-btn>
            <v-btn
              color="primary"
              text
              @click="confirm"
              :disabled="loader"
              :loading="loader"
              >确定</v-btn
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
export default {
  computed: {
    HeadLine(){
      return this.$route.query.ifEdit? "修改问题":"添加问题"
    }
  },
  components: {
    SnackBar,
  },
  mounted() {
    if (this.$route.query.ifEdit) {
      this.getDataFromAip();
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  data() {
    return {
      prevRoute: null,
      test: false,
      //////////////////////////////////////////////
      loader: false,
      //////////////////////////评分规则///////////////
      allowPartial: false,
      totalScore: null,
      punishRule: null,
      //////////////////////////选择///////////////////
      languages: ["C++", "Python", "Java", "Rust", "JavaScript"],
      select: ["C++"],

      // content: [
      //   {"C++": "int main(){}"},
      //   {Python: "asddsa"},
      //   {Java: ""},
      //   {Rust: ""},
      //   {JavaScript: ""},
      // ],

      content: {
        "C++": "int main(){}",
        Python: "asddsa",
        Java: "",
        Rust: "",
        JavaScript: "",
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
    confirm(){
      this.$route.query.ifEdit ? this.submitEdit():this.submit()
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
          console.log(this.sampleFile)
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
        "C++": "int main(){}",
        Python: "asddsa",
        Java: "",
        Rust: "",
        JavaScript: "",
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
      console.log('提交')
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
            scoreRule
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
      console.log('修改')
      let scoreRule = {
        totalScore: this.totalScore,
        punishRule: this.punishRule,
        allowPartial: this.allowPartial,
      };
      let submitTemplate = this.changeContentToTemplete(
        this.select,
        this.content
      );
      console.log(submitTemplate)
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
            scoreRule
          )
          .then((response) => {
            console.log(response)
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
    getDataFromAip() {
      api.problemFactory
        .getProblemInfo(this.$route.query.problemId)
        .then((response) => {
          console.log(response);
          if (response.code == 0) {
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
          } else {
            //TODO error Page
            let a = 1;
            console.log(a);
          }
        });
    },
  },
};
</script>