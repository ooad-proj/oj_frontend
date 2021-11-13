<template>
  <div>
    <v-card class="pa-3">
      <p class="tw-font-bold tw-text-lg">详细信息</p>
      <div class="tw-p-1">
        <p>创建人： {{ this.data.creatorName }}</p>
        <p>来源： {{ this.data.groupName }}</p>
        <p>时间限制： {{ this.data.timeLimit }}</p>
        <p>空间限制： {{ this.data.spaceLimit }}</p>
        <p>接受部分分： {{ this.data.scoreRule.allowPartial }}</p>
        <p>罚分方式：</p>
        <v-sparkline
          :value="data.scoreRule.punishRule"
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
  computed: {},
  data() {
    return {};
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