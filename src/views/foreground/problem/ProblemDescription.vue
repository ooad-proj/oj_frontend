<template>
  <div>
    <v-card class="pa-5">
      <p class="tw-text-3xl tw-font-bold">1001 A+B</p>
      <v-divider class="tw-my-4"></v-divider>
      <p class="tw-font-bold tw-text-lg tw-mt-4">问题描述</p>
      <div class="tw-bg-gray-200 tw-p-10">
        <mavon-editor v-model="data.description" style="z-index: 0" />
      </div>
      <p class="tw-font-bold tw-text-lg tw-mt-4">输入格式</p>
      <div class="tw-bg-gray-200 tw-p-10">
        <mavon-editor v-model="data.inputFormat" style="z-index: 0" />
      </div>
      <p class="tw-font-bold tw-text-lg tw-mt-4">输出格式</p>
      <div class="tw-bg-gray-200 tw-p-10">
        <mavon-editor v-model="data.outputFormat" style="z-index: 0" />
      </div>
      <p class="tw-font-bold tw-text-lg tw-mt-4">样例</p>
      <div>
        <v-container
          ><v-row v-for="(item,index) in data.samples" :key="index">
            <v-col>
              <p>输入：</p>
              <div class="tw-bg-gray-200 tw-p-2">
                <pre class="tw-font-mono">{{item.input}}</pre>
              </div>
            </v-col>
            <v-col>
              <p>输出：</p>
              <div class="tw-bg-gray-200 tw-p-2">
                <pre class="tw-font-mono">{{item.output}}</pre>
              </div>
            </v-col>
          </v-row></v-container
        >
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["data"],
  data() {
    return {};
  },
};
</script>

<style>
</style>