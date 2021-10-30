<template>
  <div>
    <v-card class="pa-3">
      <p class="tw-font-bold tw-text-lg">详细信息</p>
      <div class=" tw-p-1">
        <p>创建人： {{}}</p>
        <p>来源： {{}}</p>
        <p>时间限制： {{}}</p>
        <p>空间限制： {{}}</p>
        <p>接受部分分： {{}}</p>
        <p>罚分方式：</p>
        <v-sparkline
          :value="temp"
          height="100"
          smooth
          line-width="2"
          label-size="12"
        >
        </v-sparkline>
        <div class="tw-flex tw-justify-between"><div>{{temp[0]}}</div><div>{{temp[temp.length-1]}}</div></div>
        <div class=" tw-flex tw-justify-evenly tw-mt-2">
          <div class=" tw-p-1 tw-w-full"><v-btn color="primary" class=" tw-w-full">提交</v-btn></div>
          <div class=" tw-p-1 tw-w-full"><v-btn color="primary" class=" tw-w-full">记录</v-btn></div>
        </div>

      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  // !!注意！ 我们希望复用本组件，所以本组件数据全由上层props传入
  data() {
    return {
      what: 'XXX',
      temp: [1,1,0.95,0.9,0.85,0.8,0.75,0.7,0.65,0.6]
    }
  }
}
</script>

<style>

</style>