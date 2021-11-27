<template>
  <div>
    <v-card class="pa-5 mt-5">
      <div class="tw-flex tw-justify-between tw-items-center pa-5">
        <div class="tw-font-bold tw-text-xl">问题 {{ problemId }} 的答案</div>
      </div>
      <div>
        <v-tabs v-model="tab" show-arrows>
          <v-tab v-for="(n, index) in items" :key="index">
            {{ n.language }}
          </v-tab>
        </v-tabs>
        <v-card-text class="text-center">
          <v-tabs-items v-model="tab">
            <v-tab-item v-for="(item, index) in items" :key="index">
              <div style="height: 600px" class="tw-overflow-y-auto">
                <vue-codeditor
                  :readonly="'true'"
                  style="font-size: 16px; min-height: 600px"
                  v-model="item.code"
                  :mode="languagemode(item.language)"
                  theme="katzenmilch"
                />
              </div>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  mounted() {
    this.problemId = this.$route.params.problemId;
  },
  computed: {},
  props: ["items"],
  data() {
    return {
      problemId: 0,
      tab: null,
    };
  },
  methods: {
    languagemode(val) {
      let map = {
        java: "java",
        python: "python",
      };
      return map[val];
    }
  },
};
</script>