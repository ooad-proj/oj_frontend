<template>
  <div>
    <v-container grid-list-xs>
      <v-row>
        <v-col cols="9">
          <problem-description :data="this.descriptionData"></problem-description>
        </v-col>
        <v-col cols="3">
          <problem-side-item :data="this.sidebarData"></problem-side-item>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import api from "@/api/api";
import ProblemSideItem from './ProblemSideItem.vue'
import ProblemDescription from './ProblemDescription.vue'
export default {
  components: {ProblemSideItem, ProblemDescription},
  // !!注意！ 我们希望复用本组件，所以本组件数据全由上层props传入
  // 本组件可能跳转位置不同，注意处理
  data() {
    return {
      sidebarData: {
        creatorId:null,
        creatorName:null,
        timeLimit:null,
        spaceLimit:null,
        scoreRule:{
          allowPartial:null,
          totalScore: null,
          punishRule:[],
        },
        groupName:null
      },
      problemId:null,
      descriptionData:{
        description:null,
        inputFormat:null,
        outputFormat:null,
        samples:[],
      }
    }
  },
  mounted() {
    this.problemId = this.$route.params.problemId
    this.getDataFromApi()
  },
  methods: {
    partial() {
      return this.sidebarData.scoreRule.allowPartial ? "是" : "否";
    },
    changeArrayPunishRule(){
      return this.change(this.sidebarData.scoreRule.punishRule)
    },
    change(fields) {

      let field = [];
      if (fields != null && fields.length > 0) {
        field = fields.split(",");
        let first = field[0];
        field[0] = first.substring(first.indexOf("[") + 1);
        let last = field[field.length - 1];
        field[field.length - 1] = last.substring(0, last.indexOf("]"));
      }
      field=field.map(item => {  
        return +item;
      })

      return field;
    },
    getDataFromApi(){
      api.problemFactory.getProblemInfo(this.problemId).then((response)=>{
        this.sidebarData.creatorId = response.content.creatorId
        this.sidebarData.creatorName = response.content.creatorName
        this.sidebarData.timeLimit = response.content.timeLimit
        this.sidebarData.spaceLimit = response.content.spaceLimit
        this.sidebarData.scoreRule = response.content.scoreRule
        this.sidebarData.groupName = response.content.groupName
        this.sidebarData.scoreRule.allowPartial = this.partial()
        this.sidebarData.scoreRule.punishRule= this.changeArrayPunishRule()

        this.descriptionData.description = response.content.description
        this.descriptionData.inputFormat = response.content.inputFormat
        this.descriptionData.outputFormat = response.content.outputFormat
        this.descriptionData.samples = response.content.samples

        console.log(response)

      })
    }
  },
}
</script>

<style>
</style>