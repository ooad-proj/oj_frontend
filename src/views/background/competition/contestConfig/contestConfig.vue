<template>
  <div>
    <v-card>
      <div class="tw-flex tw-justify-between tw-items-center pa-5">
        <div class="tw-text-xl tw-font-bold">组详情</div>
      </div>
      <v-container fluid class="tw-px-8">
        <v-row>
          <div class="tw-flex tw-flex-row tw-p-3">
            <div class="tw-w-32">组id：</div>
            <div class="tw-w-48">{{ contestId }}</div>
          </div>
        </v-row>

        <v-row>
          <div class="tw-flex tw-flex-row tw-p-3">
            <div class="tw-w-32">标题：</div>
            <div class="tw-w-48">{{ title }}</div>
          </div>
        </v-row>

        <v-row>
          <div class="tw-flex tw-flex-row tw-p-3">
            <div class="tw-w-32">竞赛描述：</div>
            <div class="tw-w-48">{{ description }}</div>
          </div>
        </v-row>

        <v-row>
          <div class="tw-flex tw-flex-row tw-p-3">
            <div class="tw-w-32">开始时间:</div>
            <div class="tw-w-48">{{ startTime }}</div>
          </div>
        </v-row>

        
        <v-row>
          <div class="tw-flex tw-flex-row tw-p-3">
            <div class="tw-w-32">结束时间：</div>
            <div class="tw-w-48">{{ endTime }}</div>
          </div>
        </v-row>

        <v-row>
          <div class="tw-flex tw-flex-row tw-p-3">
            <div class="tw-w-32">创建者id：</div>
            <div class="tw-w-48">{{ creatorName }}</div>
          </div>
        </v-row>

        <v-row>
          <div class="tw-flex tw-flex-row tw-p-3">
            <div class="tw-w-32">创建者姓名：</div>
            <div class="tw-w-48">{{ creatorId }}</div>
          </div>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>
<script>
export default {
  props: ["contestId","title","description","startTime","endTime","creatorName","creatorId"],
  data() {
    return {};
  },
  mounted() {},
  methods: {
  },
};
</script>