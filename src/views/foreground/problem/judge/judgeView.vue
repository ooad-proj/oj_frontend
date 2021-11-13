<template>
  <v-container grid-list-xs>
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
              />
            </div>
          </v-col>

          <v-col cols="6">
            <div class="tw-mt-2">
              <v-select :items="selections" dense outlined></v-select>
            </div>
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <div class="tw-font-bold tw-text-xl">样例测试</div>

                <v-textarea
                  solo
                  flat
                  background-color="grey lighten-3"
                  name="input-7-4"
                  value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
                ></v-textarea>

                <div class="tw-font-bold tw-text-xl">执行结果</div>
                <v-row>
                  <v-col>
                    <v-textarea
                      solo
                      flat
                      background-color="grey lighten-3"
                      name="input-7-4"
                      value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
                    ></v-textarea>
                  </v-col>
                  <v-col>
                    <v-textarea
                      solo
                      flat
                      background-color="grey lighten-3"
                      name="input-7-4"
                      value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-tab-item>

              <v-tab-item>
                <div class="tw-font-bold tw-text-xl">提交</div>

                <v-textarea
                  outlined
                  name="input-7-4"
                  value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
                ></v-textarea>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      tab: null,
      title: ["测试", "提交"],
      selections: ["Java", "C++", "Python", "JavaScript"],
    };
  },
};
</script>