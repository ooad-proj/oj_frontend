<template>
  <div>
    <SnackBar ref="sb"></SnackBar>
    <div class="tw-bg-white tw-shadow-md">
      <v-breadcrumbs :items="items"></v-breadcrumbs>
    </div>
    <v-container grid-list-xs fluid>
      <v-row>
        <v-col>
          <groupConfig
            :groupId="this.$route.params.groupId"
            @editName="showeditName"
          ></groupConfig>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <groupMember
            @showmsg="showGroupMemberMsg"
            :groupId="this.$route.params.groupId"
          ></groupMember>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <groupAssistantManagement
            :groupId="this.$route.params.groupId"
            @deleteAssitant="showDeleteAssistant"
            @addAssitant="showAddAssistant"
          ></groupAssistantManagement>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import SnackBar from "../../../components/SnackBar.vue";
import groupAssistantManagement from "@/views/background/group/groupAssistant/groupAssistantManagement.vue";
import groupConfig from "@/views/background/group/groupConfig/groupConfig.vue";
import groupMember from "@/views/background/group/groupMember/groupMember.vue";
export default {
  components: {
    SnackBar,
    groupAssistantManagement,
    groupConfig,
    groupMember,
  },
  data: () => ({
    items: [
      {
        text: "我管理的群组",
        disabled: false,
        link: true,
        exact: true,
        to: { path: "../../admin/group" },
      },
      {
        text: "详细信息",
        disabled: false,
      },
    ],
  }),
  created() {},
  watch: {},
  mounted() {},
  methods: {
    showGroupMemberMsg(msg) {
      this.$refs.sb.warn(msg);
    },
    showeditName(msg) {
      this.$refs.sb.warn(msg);
    },
    showAddAssistant(msg) {
      this.$refs.sb.warn(msg);
    },
    showDeleteAssistant(msg) {
      this.$refs.sb.warn(msg);
    },
  },
};
</script>

<style>
</style>