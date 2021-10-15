<template>
  <v-app>
    <router-view @toast="infom()"></router-view>

    <v-snackbar
      v-model="info"
      timeout="2000"
    >
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

  </v-app>
</template>

<script>

export default {
  name: 'App',

  methods: {
    infom() {
      console.log(12345)
      return 0
    }
  },

  data: () => ({
    info: false,
    text: 'Lorem ipsum dolor sit amet',
    vertical: true,
  }),
};
</script>
