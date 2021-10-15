<template>
  <div class=" tw-min-h-screen blue-grey lighten-5">
    <top-bar @userClick="$refs.rbar.open()"></top-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
    <right-bar ref="rbar"></right-bar>
  </div>
</template>

<script>
import TopBar from '../../components/TopBar.vue'
import RightBar from '../../components/RightBar.vue'
export default {
  components: {TopBar, RightBar}


}
</script>