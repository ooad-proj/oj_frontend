<template>
  <div>
    <v-card class="pa-5">
      <p class="tw-text-3xl tw-font-bold">{{this.data.shownId}} {{data.title}}</p>
      <v-divider class="tw-my-4"></v-divider>
      <p class="tw-font-bold tw-text-lg tw-mt-4">问题描述</p>
      <md-viewer :value="data.description"/>

      <p class="tw-font-bold tw-text-lg tw-mt-4">输入格式</p>
      <md-viewer :value="data.inputFormat"/>

      <p class="tw-font-bold tw-text-lg tw-mt-4">输出格式</p>
      <md-viewer :value="data.outputFormat"/>

      <p class="tw-font-bold tw-text-lg tw-mt-4">样
        例</p>
      <div>
        <v-container
          ><v-row v-for="(item,index) in data.samples" :key="index">
            <v-col md="6">
              <p>输入：</p>
              <div class="tw-bg-gray-100 tw-p-2 tw-h-36 tw-overflow-auto tw-rounded-md">
                <pre class="tw-font-mono">{{item.input}}</pre>
              </div>
            </v-col>
            <v-col md="6">
              <p>输出：</p>
              <div class="tw-bg-gray-100 tw-p-2 tw-h-36 tw-overflow-auto tw-rounded-md">
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
import MdViewer from '@/components/MdViewer.vue'
export default {
  components: {MdViewer},
  props: ["data"],
  data() {
    return {};
  },
};
</script>

<style>
</style>