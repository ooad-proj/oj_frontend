<template>
  <div>
    <v-container grid-list-xs>
      <v-card class=" pa-5">
        <p class=" tw-text-xl tw-font-bold">班级</p>
        <div class="tw-grid tw-grid-cols-4 tw-gap-4 tw-p-6 tw-items-start tw-h-96">

          <div class=" tw-rounded-md tw-border tw-border-solid tw-border-gray-200 tw-p-4 hover:tw-bg-gray-100 tw-transition-colors">
              <p class=" tw-text-3xl tw-font-bold">CS101</p>
              <p class=" mt-12 tw-text-sm">班级人数：15</p>
          </div>
          <div class=" tw-rounded-md tw-border tw-border-solid tw-border-gray-200 tw-p-4 hover:tw-bg-gray-100 tw-transition-colors">
              <p class=" tw-text-3xl tw-font-bold">CS102</p>
              <p class=" mt-12 tw-text-sm">班级人数：19</p>
          </div>



        </div>

        <v-pagination
          v-model="page"
          class="my-4"
          :length="10"
        ></v-pagination>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1
    }
  }
}
</script>

<style>

</style>