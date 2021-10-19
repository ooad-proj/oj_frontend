<template>
  <v-snackbar v-model="warnData.doing" timeout="1000">
    {{ warnData.text }}
  </v-snackbar>
</template>

<script>
export default {
  data: function () {
    return {
      warnData: {
        doing: false,
        text: "",
      },
    };
  },
  methods: {
    warn(text) {
      console.log('yes')
      this.warnData.text = text
      this.warnData.doing = true
    },
  }
};
</script>

<style>
</style>