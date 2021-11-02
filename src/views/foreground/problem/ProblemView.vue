<template>
  <div>
    <v-container grid-list-xs>
      <v-row>
        <v-col cols="9">
          <problem-description></problem-description>
        </v-col>
        <v-col cols="3">
          <problem-side-item></problem-side-item>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ProblemSideItem from './ProblemSideItem.vue'
import ProblemDescription from './ProblemDescription.vue'
export default {
  components: {ProblemSideItem, ProblemDescription}
  // !!注意！ 我们希望复用本组件，所以本组件数据全由上层props传入
  // 本组件可能跳转位置不同，注意处理
}
</script>

<style>

</style>