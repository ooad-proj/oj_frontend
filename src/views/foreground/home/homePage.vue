<template>
  <div>
    <div class=" tw-flex tw-justify-center tw-items-center tw-fixed tw-top-0 tw-left-0 tw-w-full tw-h-screen"
    :style="{ filter: 'blur(' + filter + 'px)' }">
      <v-sparkline
        :value="value"
        :gradient="['#009688', '#eceff1']"
        smooth="4"
        padding="0"
        line-width="2"
        stroke-linecap="round"
        gradient-direction="top"
        :fill="true"
        type="trend"
        :auto-line-width="false"
        auto-draw
        height="100%"
      ></v-sparkline>
    </div>

    <div class=" tw-relative tw-w-full">
      <div class=" tw-h-screen tw-flex tw-justify-center tw-items-center">
        <div>
          <div class=" tw-text-center" style="transform:translateY(-80px);">
            <p class=" tw-text-5xl tw-font-bold tw-overflow-hidden tw-font-mono typer tw-border-0 tw-border-r-4 tw-border-solid">
              T<span class=" tw-text-teal-600">eal</span>OJ
            </p>
            <!-- <v-btn color="primary">ENTER</v-btn> -->
          </div>
        </div>
      </div>
    </div>

    <div style=" min-height: 90vh">
      <v-container grid-list-xs>
        <v-row>
          <v-col md="7">
            <v-card class=" pa-5 tw-my-4">
              <p class=" tw-text-xl tw-font-bold">最近公告</p>
              <div class=" tw-flex tw-justify-between tw-p-2 tw-border tw-border-solid">
                <div>标题</div>
                <div>发布者</div>
              </div>
              <div @click="$router.push({name: 'commentPage',params: {groupId: 0,postId: i.postId,},})" v-for="i in announcements" :key="i.postId" class=" tw-flex tw-justify-between tw-p-2 tw-border tw-border-solid">
                <div>{{i.title}}</div>
                <div>{{i.userName}}</div>
              </div>
            </v-card>
            <v-card class=" pa-5 tw-my-4">
              <p class=" tw-text-xl tw-font-bold">排名</p>
              <div class=" tw-flex tw-justify-between tw-p-2 tw-border tw-border-solid">
                <div>用户名</div>
                <div>正确率</div>
              </div>
              <div v-for="(i,index) in rank" :key="index" class=" tw-flex tw-justify-between tw-p-2 tw-border tw-border-solid">
                <div>{{i.rank}} {{i.userName}}</div>
                <div>{{i.correctRate}}</div>
              </div>
            </v-card>
          </v-col>
          <v-col md="5">
            <v-card class=" pa-5 tw-my-4" v-if="logined">
              <p class=" tw-text-xl tw-font-bold">临期比赛</p>
              <div class=" tw-flex tw-justify-between tw-p-2 tw-border tw-border-solid">
                <div>竞赛名</div>
                <div>剩余时间</div>
              </div>
              <div v-for="(i,index) in ddls" :key="index" class=" tw-flex tw-justify-between tw-p-2 tw-border tw-border-solid">
                <div>{{i.title}}</div>
                <div>{{formatSeconds(i.timeLeft / 1000)}}</div>
              </div>
            </v-card>
            <v-card class=" pa-5 tw-my-4">
              <p class=" tw-text-xl tw-font-bold">近期提交</p>
              <line-chart ref="chart" :height="200"></line-chart>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>

  </div>
</template>

<script>
import api from '../../../api/api'
import LineChart from "@/components/LineChart.vue"

export default {
  components: {LineChart},
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
    this.getDataFromApi()
  },
  data() {
    return {
      logined: false,
      filter: 0,
      value: [0,0],
      announcements: [],
      rank: [],
      ddls: []
    }
  },
  methods: {
    formatSeconds(value) {
      let result = parseInt(value);
      let h =
        Math.floor(result / 3600) < 10
          ? "0" + Math.floor(result / 3600)
          : Math.floor(result / 3600);
      let m =
        Math.floor((result / 60) % 60) < 10
          ? "0" + Math.floor((result / 60) % 60)
          : Math.floor((result / 60) % 60);
      let s =
        Math.floor(result % 60) < 10
          ? "0" + Math.floor(result % 60)
          : Math.floor(result % 60);

      let res = "";
      if (h !== "00") res += `${h}:`;
      if (m !== "00") res += `${m}:`;
      res += `${s}`;
      if(value==0){
        return "--:--:--"
      }
      return res;
    },
    getDataFromApi() {
      api.authFactory.isLogin().then(resp => {
        this.logined = resp.isLogin
      })
      Promise.all([
        api.submitFactory.getSubmitTimes(""),
        api.forumFactory.getPublic(0,5),
        api.rankFactory.getRank(1,10),
        api.contestFactory.getContestWithDDL(5)
      ]).then((resps) => {
        let resp = resps[0]
        console.log(resp)
        this.$refs.chart.dataStd[0].values = resp.content.data
        this.$refs.chart.labels = (resp.content.label)

        this.value = resps[0].content.data
        this.announcements = resps[1].content
        this.rank = resps[2].content.list
        this.ddls = resps[3].content
      })
    },
    handleScroll () {
      let height = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (height < 400) {
        this.filter =  Math.ceil(height / 40)
      } else {
        this.filter = 10
      }
    },
  }
}
</script>

<style scoped>

.typer {
  animation: widths 1s steps(6), borders 1.5s infinite steps(1)
}
@keyframes borders {
    0% {border-right-color: #000;}
    50% {border-right-color: #eceff1;}
    100% {border-right-color: #000;}
}

@keyframes widths {
    from {width: 0ch;}
    to {width: 6ch;}
}
</style>