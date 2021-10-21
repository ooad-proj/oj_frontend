<template>
  <div>
    <v-main class=" blue-grey lighten-5 tw-min-h-screen">
      <v-card class=" pa-12 tw-max-w-md tw-mx-auto mt-12">
        <h1 class=" tw-mb-4">403</h1>
        <p>您没有本页面的权限。</p>
        <div class=" tw-text-center tw-space-x-4 tw-mt-12">
          <v-btn color="primary" @click="back()">返回</v-btn>
          <v-btn color="primary" @click="index()">主页</v-btn>
        </div>
      </v-card>
    </v-main>
  </div>
</template>

<script>
export default {
  methods: {
    back() {
      this.$router.go(-1)
    },
    index() {
      this.$router.push('/')
    }
  }
}
</script>

<style>

</style>