<template>
  <v-container grid-list-xs>
    <div>
      <SnackBar ref="sb"></SnackBar>
      <div class="tw-bg-white tw-shadow-md">
        <v-breadcrumbs :items="items"></v-breadcrumbs>
      </div>

      <v-container grid-list-xs fluid>
        <v-row>
          <v-col>
            <contestConfig
              :contestId="this.$route.params.contestId"
              :title="this.title"
              :description="this.description"
              :startTime="this.startTime"
              :endTime="this.endTime"
              :creatorName="this.creatorName"
              :creatorId="this.creatorId"
            ></contestConfig>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <contestProblems
              :contestId="this.$route.params.contestId"
              @showMsg="showMsg"
            ></contestProblems>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-container>
</template>

<script>
import api from "@/api/api";
import SnackBar from "../../../components/SnackBar.vue";
import contestConfig from "@/views/background/competition/contestConfig/contestConfig.vue";
import contestProblems from "@/views/background/competition/contestProblems/contestProblems.vue";
export default {
  components: {
    contestConfig,
    SnackBar,
    contestProblems,
  },
  data() {
    return {
      timestampToTime(timestamp) {
        let date = new Date(parseInt(timestamp)); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + "-";
        let M =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
        let D = date.getDate() + " ";
        let h = date.getHours() + ":";
        let m = date.getMinutes();
        if (parseInt(m) < 10) {
          m = "0" + m;
        }
        return [Y + M + D, h + m];
      },
      items: [
        {
          text: "我管理的竞赛",
          disabled: false,
          link: true,
          exact: true,
          to: { name: "CompetitionManagement" },
        },
        {
          text: "详细信息",
          disabled: false,
        },
      ],
      contestId: null,
      title: null,
      startTime: null,
      endTime: null,
      description: null,
      creatorName: null,
      creatorId: null,
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.contestId = this.$route.params.contestId;
    this.getDataFromApi();
  },
  methods: {
    showMsg(msg) {
      this.$refs.sb.warn(msg);
    },
    getDataFromApi() {

      api.contestFactory.getContestInfo(this.contestId).then((response) => {
        this.title = response.content.contest.title;
        this.description = response.content.contest.description;
        this.creatorName = response.content.contest.creatorName;
        this.creatorId = response.content.contest.creatorId;
        let that = this;
        let tempStart = that.timestampToTime(response.content.contest.startTime);
        let tempEnd = that.timestampToTime(response.content.contest.endTime);

        that.startTime = tempStart[0] + tempStart[1];
        that.endTime = tempEnd[0] + tempEnd[1];
      });
    },
  },
};
</script>