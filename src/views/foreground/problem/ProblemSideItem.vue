<template>
  <div>

    <v-dialog
      v-model="dialog"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="text-h5">
          罚分方式
        </v-card-title>
        <v-card-text>
          <p class=" tw-text-black">{{data.scoreRule.punishRule}}</p>
          <p>罚分方式为一个数组，其表示经过一定提交次数后的得分上限。例如，数组的第一位是 {{data.scoreRule.punishRule[0]}}，这表示第 1 次提交最多能获得 {{data.scoreRule.punishRule[0]*100}}% 的分数。罚分下限为数组的最后一位。这意味着这表示第 {{data.scoreRule.punishRule.length}} 次后的提交最多能获得 {{data.scoreRule.punishRule[data.scoreRule.punishRule.length-1]*100}}% 的分数。</p>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            了解
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-card class="pa-3">
      <p class="tw-font-bold tw-text-lg">详细信息</p>
      <div class="tw-p-1">
        <p>创建人： {{ this.data.creatorName }}</p>
        <p>来源： {{ this.data.groupName }}</p>
        <p>时间限制： {{ this.data.timeLimit }}</p>
        <p>空间限制： {{ this.data.spaceLimit }}</p>
        <p>接受部分分： {{ this.data.scoreRule.allowPartial }}</p>
        <p>罚分方式：<v-icon dense @click="dialog = true">mdi-help-circle-outline</v-icon></p>
        <v-sparkline
          :value="punishRuleShow"
          height="100"
          smooth
          line-width="2"
          label-size="12"
        >
        </v-sparkline>
        <div class="tw-flex tw-justify-between">
          <div>{{ data.scoreRule.punishRule[0] }}</div>
          <div>
            {{
              data.scoreRule.punishRule[data.scoreRule.punishRule.length - 1]
            }}
          </div>
        </div>
        <div class="tw-flex tw-justify-evenly tw-mt-2">
          <div class="tw-p-1 tw-w-full">
            <v-btn color="primary" class="tw-w-full" @click="goSubmit()"
              >提交</v-btn
            >
          </div>
          <div class="tw-p-1 tw-w-full">
            <v-btn color="primary" class="tw-w-full">记录</v-btn>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["data"],
  // !!注意！ 我们希望复用本组件，所以本组件数据全由上层props传入
  computed: {
    punishRuleShow() {
      let rule = this.data.scoreRule.punishRule
      if (rule.length == 1) {
        rule.push(rule[0])
      }
      return rule
    }
  },
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    goSubmit() {
      this.$router.push({
        name: "judgePage",
        params: {
          problemId: this.$route.params.problemId
        },
      });
    },
  },
};
</script>

<style>
</style>