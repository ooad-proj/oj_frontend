<template>
  <v-container grid-list-xs>
    <SnackBar ref="sb"></SnackBar>
    <v-card class="pa-5">
      <div class="tw-flex tw-justify-between tw-items-center tw-p-2">
        <div class="tw-text-2xl">
          ID:{{ this.$route.params.resultId }}的结果
        </div>
        <div>
          <v-btn color="primary" @click="back()">返回</v-btn>
        </div>
      </div>
      <div class="tw-overflow-y-scroll" style="height: 400px">
        <v-expansion-panels flat>
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
                  class="tw-px-2 tw-py-1 tw-text-white tw-rounded-md tw-w-min"
                  :class="colorMap[item.color]"
                >
                  {{ item.code }}
                </div>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div
                class="tw-p-2 tw-overflow-auto tw-rounded-md"
                :class="
                  item.correct
                    ? 'tw-bg-gray-100 '
                    : 'tw-bg-red-100 tw-text-red-600'
                "
              >
                <pre class="tw-font-mono">{{ item.message }}</pre>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
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
    this.getDataFromApi();
  },
  computed: {
    answerClass: function () {
      return "tw-bg-red-100 tw-p-2 tw-h-48 tw-overflow-auto tw-rounded-md";
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
    };
  },
  methods: {
    getDataFromApi() {
      api.submitFactory
        .getsubmitAnswer(this.$route.params.resultId)
        .then((response) => {
          this.results = response.content.records;
          console.log(response);
        });
    },
    back() {
      this.$router.go(-1);
    },
  },
};
</script>