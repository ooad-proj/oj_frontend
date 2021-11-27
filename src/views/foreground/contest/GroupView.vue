<template>
  <div>
    <v-container grid-list-xs>
      <v-card class="pa-5">
        <p class="tw-text-xl tw-font-bold">班级</p>
        <v-progress-linear
          :active="loading"
          :indeterminate="loading"
          absolute
        ></v-progress-linear>
        <div
          class="tw-grid tw-grid-cols-4 tw-gap-4 tw-p-6 tw-items-start tw-h-96"
        >
          <div
            v-for="group in groups"
            :key="group.groupId"
            :title="group.groupName"
            class="
              tw-rounded-md tw-border tw-border-solid tw-border-gray-200 tw-p-4
              hover:tw-bg-gray-100
              tw-transition-colors
              tw-cursor-pointer
            "
            @click="$router.push('contest/' + group.groupId)"
          >
            <p class="tw-text-3xl tw-font-bold tw-truncate">
              {{ group.groupName }}
            </p>
            <p class="mt-12 tw-text-sm">我的角色：{{ group.role }}</p>
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