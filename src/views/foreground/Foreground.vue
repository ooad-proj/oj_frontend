<template>
  <div class=" tw-min-h-screen blue-grey lighten-5">
    <top-bar></top-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </div>
</template>

<script>
import TopBar from '../../components/TopBar.vue'
export default {
  components: {TopBar}


}
</script>