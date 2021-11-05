<template>
  <div>
    <v-container grid-list-xs>
      <v-card class="pa-5">
        <p class="tw-text-xl tw-font-bold">班级</p>
        <v-progress-linear
          :active="loading"
          :indeterminate="loading"
          absolute
          color="deep-purple accent-4"
        ></v-progress-linear>
        <div
          class="tw-grid tw-grid-cols-4 tw-gap-4 tw-p-6 tw-items-start tw-h-96"
        >
          <div
            v-for="group in groups"
            :key="group.groupId"
            class="
              tw-rounded-md tw-border tw-border-solid tw-border-gray-200 tw-p-4
              hover:tw-bg-gray-100
              tw-transition-colors
            "
          >
            <v-row>
              <v-col>
                <p class="tw-text-3xl tw-font-bold">
                  {{ group.groupName }}
                </p>
              </v-col>
              <v-spacer></v-spacer>
              <v-col>
                <v-btn
                  outlined
                  rounded
                  text
                  color="primary"
                  :to="{
                    name: 'contestInGroup',
                    params: {
                      groupId: group.groupId,
                    },
                  }"
                >
                  进入
                </v-btn>
              </v-col>
            </v-row>

            <p class="mt-12 tw-text-sm">我的角色：{{ group.Role }}</p>
          </div>
        </div>

        <v-pagination
          v-model="page"
          class="my-4"
          :total-visible="9"
          :length="totalPage"
        ></v-pagination>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import api from "@/api/api";
export default {
  data() {
    return {
      page: 1,
      itemsPerPage: 8,
      groups: [],
      totalPage: 0,
      totalAmount: 0,
      loading: false,
    };
  },
  watch: {
    page: {
      handler() {
        this.getDataFromApi("");
      },
      deep: true,
    },
  },
  mounted() {
    this.getDataFromApi("");
  },
  methods: {
    getDataFromApi(searchText) {
      this.loading = true;
      api.authFactory
        .getGroupsByPage(this.page, this.itemsPerPage, searchText)
        .then((response) => {
          this.groups = response.content.list;
          this.totalPage = response.content.totalPage;
          this.loading = false;
        });
    },
  },
};
</script>

<style>
</style>