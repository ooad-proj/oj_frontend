<template>
  <v-container grid-list-xs>
    <SnackBar ref="sb"></SnackBar>
    <v-card class="pa-5">
      <v-container grid-list-xs>
        <v-row>
          <v-col cols="6" class="">
            <div
              class="tw-font-bold tw-text-2xl tw-items-center tw-flex tw-h-full"
            >
              <div>代码提交</div>
            </div>
          </v-col>

          <v-col cols="6" class="">
            <v-tabs v-model="tab" show-arrows>
              <v-tab v-for="(item, index) in title" :key="index">
                {{ item }}
              </v-tab>
            </v-tabs>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6">
            <div style="height: 600px" class="tw-overflow-y-auto">
              <vue-codeditor
                style="font-size: 16px; min-height: 600px"
                theme="katzenmilch"
                :mode="select"
                v-model="code"
              />
            </div>
          </v-col>

          <v-col cols="6">
            <div class="tw-p-2">选择语言</div>
            <div class="tw-mt-2">
              <v-select
                @change="changeTemplate()"
                :items="selections"
                solo
                flat
                background-color="grey lighten-3"
                v-model="select"
              ></v-select>
            </div>
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <div class="tw-flex tw-justify-between tw-items-center tw-p-2">
                  <div class="">样例测试</div>
                  <div>{{ noAnswer }}</div>
                  <div>
                    <v-btn
                      color="primary"
                      @click="testAnswer"
                      :disabled="testLoader || !ifHaveAnswer"
                      :loading="testLoader"
                      >提交测试</v-btn
                    >
                  </div>
                </div>

                <textarea
                  class="
                    tw-bg-gray-100
                    tw-p-2
                    tw-h-36
                    tw-w-full
                    tw-overflow-auto
                    tw-rounded-md
                  "
                  v-model="testCase"
                >
                </textarea>

                <v-row>
                  <v-col md="6">
                    <div class="tw-p-2">执行结果</div>
                    <div
                      class="tw-p-2 tw-h-48 tw-overflow-auto tw-rounded-md"
                      :class="
                        userResult.correct
                          ? 'tw-bg-gray-100 '
                          : 'tw-bg-red-100 tw-text-red-600'
                      "
                    >
                      <!-- <div
                        class="
                          tw-px-2 tw-py-1 tw-text-white tw-rounded-md tw-w-min
                        "
                        :class="
                          (isReturn ? 'tw-visible' : 'tw-invisible') +
                          ' ' +
                          colorMap[this.userResult.color]
                        "
                      >
                        {{ userResult.code }}
                      </div>
                      <div>{{ userResult.timeCost }}</div>
                      <div>{{ userResult.memoryCost }}</div> -->
                      <pre class="tw-font-mono tw-text-xs">{{
                        userResult.message
                      }}</pre>
                    </div>
                  </v-col>
                  <v-col md="6">
                    <div class="tw-p-2">标准结果</div>
                    <div
                      class="tw-p-2 tw-h-48 tw-overflow-auto tw-rounded-md"
                      :class="
                        standardResult.correct
                          ? 'tw-bg-gray-100 '
                          : 'tw-bg-red-100 tw-text-red-600'
                      "
                    >
                      <!-- <div
                        class="
                          tw-px-2 tw-py-1 tw-text-white tw-rounded-md tw-w-min
                        "
                        :class="
                          (isReturn ? 'tw-visible' : 'tw-invisible') +
                          ' ' +
                          colorMap[this.standardResult.color]
                        "
                      >
                        {{ standardResult.code }}
                      </div>
                      <div>{{ standardResult.timeCost }}</div>
                      <div>{{ standardResult.memoryCost }}</div> -->
                      <pre class="tw-font-mono tw-text-xs">{{
                        standardResult.message
                      }}</pre>
                    </div>
                  </v-col>
                </v-row>
              </v-tab-item>

              <v-tab-item>
                <div class="tw-flex tw-justify-between tw-items-center tw-p-2">
                  <div class="">提交</div>
                  <div>
                    <v-btn
                      color="primary"
                      @click="submitAnswer"
                      :disabled="submitLoader && !ifHaveAnswer"
                      :loading="submitLoader"
                      >提交代码</v-btn
                    >
                  </div>
                </div>

                <div class="">
                  <!-- <v-row>
                    <v-col md="4">
                      <div>结果:{{ this.finialResult }}</div>
                    </v-col>

                    <v-col md="4">
                      <div>通过数目:{{ this.correctNum }}</div>
                    </v-col>

                    <v-col md="4">
                      <div>全部数目:{{ this.totalNum }}</div>
                    </v-col>
                  </v-row> -->
                  <div
                    v-if="this.ifsubmit"
                    class="
                      tw-px-4
                      tw-py-2
                      tw-my-2
                      tw-text-white
                      tw-rounded-md
                      tw-border-dashed
                    "
                    :class="
                      finialResult == 'AC'
                        ? 'tw-text-green-500 tw-border-green-500'
                        : 'tw-text-red-500 tw-border-red-500'
                    "
                  >
                    正确数：{{ this.correctNum }}/{{ this.totalNum }}
                  </div>
                </div>

                <div class="tw-overflow-y-scroll" style="height: 400px">
                  <v-expansion-panels flat v-if="this.ifsubmit">
                    <v-expansion-panel
                      v-for="(item, i) in results"
                      :key="i"
                      class="grey lighten-4"
                    >
                      <v-expansion-panel-header>
                        <div class="tw-flex tw-justify-around">
                          <div>{{ item.id }}</div>
                          <div>{{ item.timeCost }}ms</div>
                          <div>{{ item.memoryCost }}MB</div>
                          <div
                            class="
                              tw-px-2
                              tw-py-1
                              tw-text-white
                              tw-rounded-md
                              tw-w-min
                            "
                            :class="colorMap[item.color]"
                          >
                            {{ item.code }}
                          </div>
                        </div>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <!-- <div class="tw-bg-gray-200 tw-rounded-md tw-p-2">
                          {{ item.message }}
                        </div> -->
                        <div
                          class="tw-p-2 tw-overflow-auto tw-rounded-md"
                          :class="
                            item.correct
                              ? 'tw-bg-gray-100 '
                              : 'tw-bg-red-100 tw-text-red-600'
                          "
                        >
                          <pre class="tw-font-mono tw-text-xs">{{
                            item.message
                          }}</pre>
                        </div>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </div>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import SnackBar from "@/components/SnackBar.vue";
import api from "@/api/api";
export default {
  components: {
    SnackBar,
  },
  mounted() {
    this.getIfHaveAnswer();
    this.getTemplate();
    this.getProblemInfo();
  },
  computed: {
    answerClass: function () {
      return "tw-bg-red-100 tw-p-2 tw-h-48 tw-overflow-auto tw-rounded-md";
    },
    noAnswer: function () {
      return this.ifHaveAnswer ? "" : "问题没有答案,无法测试";
    },
  },
  data() {
    return {
      ifsubmit: false,
      ifHaveAnswer: false,
      testLoader: false,
      submitLoader: false,
      resultMap: {},

      finialResult: "AC",
      correctNum: 0,
      totalNum: 0,
      results: [
        {
          id: "",
          total: "",
          isCorrect: "",
          timeCost: "",
          memoryCost: "",
          code: "",
          name: "",
          message: "",
          color: "",
        },
      ],
      result: null,
      language: null,
      testCase: "",
      isReturn: false,
      colorMap: {
        RED: "tw-bg-red-600",
        ORANGE: "tw-bg-yellow-600",
        YELLOW: "tw-bg-yellow-400",
        GREEN: "tw-bg-green-600",
        BLUE: "tw-bg-blue-600",
        PURPLE: "tw-bg-purple-600",
        GRAY: "tw-bg-gray-600",
        PINK: "tw-bg-pink-600",
      },
      // resultMap:{
      //   "WA":"RED",
      //   "MLE":"MLE",
      //   "T"
      // },
      code: "",
      select: "java",
      tab: null,
      title: ["测试", "提交"],
      selections: ["java", "python"],
      standardResult: {
        correct: true,
        timeCost: "",
        memoryCost: "",
        code: "",
        name: "",
        message: "",
        color: "GRAY",
      },
      userResult: {
        correct: true,
        timeCost: "",
        memoryCost: "",
        code: "",
        name: "",
        message: "",
        color: "",
      },
      res_code_map_one: {
        0: "成功",
        1: "停止访问",
        "-1": "问题不存在",
        "-2": "没有标答",
        "-3": "测试机错误",
      },
      submitId: null,
      templateMap: {
        java: "",
        python: "",
      },
    };
  },
  methods: {
    getProblemInfo() {
      api.problemFactory
        .getProblemInfo(this.$route.params.problemId)
        .then((response) => {
          this.selections = response.content.allowedLanguage;
          this.select = this.selections[0];
          this.changeTemplate();
        });
    },
    changeTemplate() {
      this.code = this.templateMap[this.select];
      console.log(this.templateMap);
      console.log(this.select);
    },
    getTemplate() {
      api.submitFactory
        .getTemplate(this.$route.params.problemId)
        .then((response) => {
          let content = response.content;
          console.log(response);
          if (response.content.length != 0) {
            this.templateMap = { java: "", python: "" };
            for (let i = 0; i < content.length; i++) {
              this.templateMap[content[i].language] = content[i].code;
            }
          }
        })
        .catch(() => {
          this.$refs.sb.warn("未知错误");
        });
    },
    getIfHaveAnswer() {
      let map = {
        0: "成功",
        "-1": "问题不存在",
      };
      api.submitFactory
        .ifHaveAnswer(this.$route.params.problemId)
        .then((response) => {
          if (response.code == 0) {
            this.ifHaveAnswer = response.content.haveAnswer;
          } else {
            this.$refs.sb.warn(map[response.code]);
          }
        });
    },

    testAnswer() {
      this.testLoader = true;
      api.submitFactory
        .testAnswer(
          this.$route.params.problemId,
          this.code,
          this.testCase,
          this.select
        )
        .then((response) => {
          if (response.code == 0) {
            this.testId = response.content.submitId;
            this.getTestResult();
            this.$refs.sb.warn("提交成功,开始测试");
            this.isReturn = true;
          } else {
            console.log(response);
          }
        })
        .catch(() => {
          this.$refs.sb.warn("提交错误");
          this.testLoader = false;
        });
    },
    submitAnswer() {
      let map = {
        0: "上传成功,开始测试",
        "-1": "问题不存在",
        "-2": "没有权限回答",
      };
      this.submitLoader = true;
      api.submitFactory
        .submitAnswer(this.$route.params.problemId, this.select, this.code)
        .then((response) => {
          console.log(response);
          if (response.code == 0) {
            this.submitId = response.content.submitId;
            this.getAnswer();
          }
          this.$refs.sb.warn(map[response.code]);
        })
        .catch(() => {
          this.$refs.sb.warn("提交错误");
          this.submitLoader = false;
        });
    },
    async getTestResult() {
      while (1 + 2 == Number(3)) {
        let temp = await api.submitFactory
          .getTestResult(this.testId)
          .catch(() => {
            this.$refs.sb.warn("测试错误");
            this.testLoader = false;
          });

        if (temp.code == 1) {
          this.testLoader = false;
          this.standardResult = temp.content.standardResult;
          this.userResult = temp.content.userResult;
          this.$refs.sb.warn("测试完成");

          break;
        } else if (temp.code == 0) {
          await this.sleep(1000);
        } else {
          this.$refs.sb.warn(this.res_code_map_one[temp.code]);
        }
      }
    },
    async getAnswer() {
      while (1 + 2 == Number(3)) {
        this.result = await api.submitFactory
          .getsubmitAnswer(this.submitId)
          .catch(() => {
            this.$refs.sb.warn("测试错误");
            this.submitLoader = false;
          });
        this.results = this.result.content.records;
        this.finialResult = this.result.content.finialResult;
        this.correctNum = this.result.content.correctNum;
        this.totalNum = this.result.content.totalNum;
        console.log(this.results);

        if (this.result.code == 1) {
          this.submitLoader = false;
          this.$refs.sb.warn("测试完成");
          this.ifsubmit = true;
          break;
        } else if (this.result.code == 0) {
          await this.sleep(1000);
        } else {
          this.$refs.sb.warn(this.res_code_map_one[this.result.code]);
        }
      }
    },
    async test() {
      await this.sleep(1000);
    },

    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
  },
};
</script>