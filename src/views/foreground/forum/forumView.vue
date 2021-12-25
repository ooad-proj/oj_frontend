<template>
  <div>
    <v-container grid-list-xs>
      <v-card class="pa-5">
        <div class="tw-flex tw-justify-between tw-items-center">
          <div>
            <p class="tw-text-xl tw-font-bold">讨论版</p>
          </div>
          <div class="tw-flex">
            <div>
              <v-btn
                color="primary"
                @click="releaseAnnouncement"
                class="mx-3 mt-3"
                >发布帖子</v-btn
              >
            </div>
            <div>
              <v-text-field
                v-model="searchContent"
                class="mb-5"
                append-icon="mdi-magnify"
                label="搜索id"
                single-line
                hide-details
                @click:append="getDataFromApi(searchContent)"
              >
              </v-text-field>
            </div>
          </div>
        </div>

        <v-progress-linear
          :active="loading"
          :indeterminate="loading"
          absolute
          color="deep-purple accent-4"
        ></v-progress-linear>

        <div
          v-for="item in publicContent"
          :key="-item.postId"
          :title="item.title"
          class="
            tw-rounded-sm tw-border-2 tw-border-solid tw-border-gray-200 tw-p-4
            hover:tw-bg-gray-100
            tw-transition-colors tw-m-2 tw-flex tw-flex-col
          "
        >
          <div class="tw-flex tw-justify-between tw-items-center">
            <div
              class="
                tw-text-purple-600
                tw-text-2xl
                tw-font-bold
                tw-truncate
                tw-w-min
                tw-cursor-pointer
                hover:tw-underline
              "
              @click="Go(item)"
            >
              [公告]{{ item.title }}
            </div>
            <div class="tw-text-sm">
              <div>发帖人:{{ item.userName }}</div>
              <div>最后一次更改日期:{{ toTime(item.modifyTime) }}</div>
            </div>
          </div>
          <p class="mt-12 tw-text-sm">{{ item.preview }}</p>
        </div>

        <div
          v-for="item in list"
          :key="item.postId"
          :title="item.title"
          class="
            tw-rounded-sm tw-border-2 tw-border-solid tw-border-gray-200 tw-p-4
            hover:tw-bg-gray-100
            tw-transition-colors tw-m-2 tw-flex tw-flex-col
          "
        >
          <div class="tw-flex tw-justify-between tw-items-center">
            <div
              class="
                tw-text-2xl tw-font-bold tw-truncate tw-w-min tw-cursor-pointer
                hover:tw-underline
              "
              @click="Go(item)"
            >
              {{ item.title }}
            </div>
            <div class="tw-text-sm">
              <div>发帖人:{{ item.userName }}</div>
              <div>最后一次更改日期:{{ toTime(item.modifyTime) }}</div>
            </div>
          </div>
          <p class="mt-12 tw-text-sm">{{ item.preview }}</p>
        </div>

        <v-pagination
          v-model="page"
          class="my-4"
          :total-visible="9"
          :length="totalPage"
        ></v-pagination>
        <v-dialog v-model="releaseDialog" max-width="800px" max-height="600px">
          <v-card class="pa-5">
            <v-row>
              <v-col>
                <v-card-title class="text-h5">发布公告或帖子</v-card-title>
                <v-card-text>
                  <v-form ref="releaseForm" v-model="releaseValid">
                    <v-text-field
                      v-model="releaseName"
                      :rules="[
                        (v) => !!v || '帖子名不能为空',
                        (v) => v.length < 10 || '帖子名不能超过10个字符',
                      ]"
                      label="请输入帖子名"
                      required
                    ></v-text-field>
                    <v-input
                      v-model="releaseContent"
                      :rules="[
                        (v) => !!v || '公告内容不能为空',
                        (v) => v.length < 500 || '公告内容不能超过500个',
                      ]"
                      :count="500"
                      required
                    >
                      <md-editor class="tw-w-full" v-model="releaseContent" />
                    </v-input>
                    <v-checkbox
                      v-model="isPublic"
                      label="是否公开"
                      class=""
                      v-if="(my_role =='teacher') |(my_role =='assistant')"
                    ></v-checkbox>
                    <!-- <v-checkbox
                      v-model="isMail"
                      label="是否需要邮件通知"
                      class=""
                      :disabled="!isPublic"
                      v-if="(my_role =='teacher') |(my_role =='assistant')"
                    ></v-checkbox> -->
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="cancelRelease()"
                    >取消</v-btn
                  >
                  <v-btn
                    color="primary"
                    text
                    :loading="releaseLoading"
                    :disabled="releaseLoading"
                    @click="confirmRelease()"
                    >确定</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-card>
        </v-dialog>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import MdEditor from "@/components/MdEditor.vue";
import api from "@/api/api";
export default {
  components: {
    MdEditor,
  },
  computed: {
  },
  data() {
    return {
      isPublic: false,
      isMail: false,
      my_role: null,
      publicContent: [],
      releaseLoading: false,
      releaseDialog: false,
      releaseValid: false,
      releaseName: "",
      releaseContent: "",
      searchContent: "",
      list: [],
      search: "",
      page: 1,
      itemsPerPage: 8,
      groups: [],
      totalPage: 0,
      totalAmount: 0,
      loading: false,
    };
  },
  watch: {
    page: {
      handler() {
        this.getDataFromApi(this.searchContent);
      },
      deep: true,
    },
  },
  mounted() {
    this.getDataFromApi(this.searchContent);
  },
  methods: {
    releaseAnnouncement() {
      this.releaseDialog = true;
    },
    cancelRelease() {
      this.releaseName = "";
      this.releaseContent = "";
      this.$refs.releaseForm.resetValidation();
      this.getDataFromApi(this.searchContent)
      this.releaseDialog = false;
      this.isMail = false
      this.isPublic = false
    },
    confirmRelease() {
      let temp_map = {
        0: "成功",
        "-1": "失败",
      };

      if (this.$refs.releaseForm.validate()) {
        this.releaseLoading = true;
        api.forumFactory
          .addForum(this.$route.params.groupId, this.releaseName, this.releaseContent, this.isPublic, this.isMail)
          .then((response) => {
            this.$emit("editName", temp_map[response.code]);
            this.releaseLoading = false;
            this.cancelRelease();
          })
          .catch(() => {
            this.$emit("editName", "未知错误");
            this.releaseLoading = false;
            this.cancelRelease();
          });
      }
    },
    getDataFromApi(search) {
      console.log("11")
      api.forumFactory
        .getForumList(
          this.$route.params.groupId,
          this.page,
          this.itemsPerPage,
          search
        )
        .then((response) => {
          this.list = response.content.list;
          console.log(this.list);
          this.totalPage = response.content.totalPage;
          this.totalAmount = response.content.totalAmount;
          // this.page =1
        });
      api.forumFactory
        .getPublic(this.$route.params.groupId, 3)
        .then((response) => {
          this.publicContent = response.content;
        });
      api.authFactory.getRole().then((response) => {
        this.my_role = response.content;
      });
    },
    Go(item) {
      this.$router.push({
        name: "commentPage",
        params: {
          groupId: this.$route.params.groupId,
          postId: item.postId,
        },
      });
    },
    timestampToTime(timestamp) {
      let date = new Date(parseInt(timestamp));
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D = date.getDate();
      let h = date.getHours() + ":";
      let m = date.getMinutes();
      if (parseInt(m) < 10) {
        m = "0" + m;
      }
      if (parseInt(D) < 10) {
        D = "0" + D;
      }

      D = D + " ";
      return [Y + M + D, h + m];
    },
    toTime: function(val){
      return this.timestampToTime(val)[0]+this.timestampToTime(val)[1]
    },
    test(){
      console.log("haode")
    }
  },
};
</script>

<style>
</style>