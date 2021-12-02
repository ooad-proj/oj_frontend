<template>
  <div>
    <DeleteDialog
      title="删除帖子"
      content="确定删除吗，确认删除操作后将离开本界面，跳转回所有评论"
      width="35rem"
      v-model="dialogDelete"
      @cancel="closeDelete"
      @confirm="deleteItemConfirm"
    ></DeleteDialog>

    <DeleteDialog
      title="删除评论"
      content="确定删除吗"
      width="35rem"
      v-model="commentDelete"
      @cancel="closeCommentDelete"
      @confirm="deleteCommentConfirm"
    ></DeleteDialog>

    <v-container grid-list-xs>
      <SnackBar ref="sb"></SnackBar>
      <v-card class="pa-5">
        <div class="tw-flex tw-justify-between tw-items-center">
          <div>
            <p class="tw-text-3xl tw-font-bold px-4">{{ info.title }}</p>
          </div>
          <div>
            <v-btn
              color="error"
              class="mx-3 mb-3"
              v-if="info.deleteable"
              @click="deletePost()"
              >删除帖子</v-btn
            >
            <v-btn
              color="primary"
              v-if="info.modifyable"
              class="mx-3 mb-3"
              @click="editPost()"
              >修改帖子</v-btn
            >
          </div>
        </div>
        <v-divider></v-divider>
        <p class="tw-text-xl tw-font-bold px-4 tw-mt-3">
          发帖人 : {{ info.userName }}
        </p>
        <md-viewer :value="info.content" class="tw-mt-3" />
      </v-card>

      <v-card class="pa-5 mt-5">
        <div class="tw-flex tw-justify-between tw-items-center">
          <div>
            <p class="tw-text-xl tw-font-bold">回帖</p>
          </div>
        </div>

        <v-progress-linear
          :active="loading"
          :indeterminate="loading"
          absolute
          color="deep-purple accent-4"
        ></v-progress-linear>

        <div
          v-for="item in list"
          :key="item.commentId"
          :title="item.title"
          class="
            tw-rounded-sm
            tw-border-2
            tw-border-solid
            tw-border-gray-200
            tw-p-2
            tw-m-2
            tw-flex
            tw-flex-col
          "
        >
          <div>
            <div class="tw-flex tw-justify-between tw-items-center">
              <div>
                <p class="tw-font-bold">
                  #{{ item.floorId }} {{ item.userName }}
                  {{ toTime(item.modifyTime) }}
                </p>
              </div>
              <v-icon small @click="deleteComment(item.commentId)" v-if="item.deleteable">
                mdi-delete
              </v-icon>
            </div>
          </div>
          <v-divider></v-divider>
          <div class="tw-p-2">{{ item.comment }}</div>
        </div>

        <v-pagination
          v-model="page"
          class="my-4"
          :total-visible="9"
          :length="totalPage"
        ></v-pagination>

        <div>
          <div class="tw-flex tw-justify-between tw-items-center">
            <div>
              <p class="tw-text-xl tw-font-bold">回帖</p>
            </div>
            <div>
              <div class="tw-flex">
                <div>
                  <v-btn
                    color="primary"
                    class="mx-3 mt-3"
                    @click="addComment()"
                    :loading="addLoader"
                    :disabled="addLoader"
                    >发布评论</v-btn
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="tw-m-2">
            <textarea
              class="tw-border-solid tw-border-2 tw-w-full tw-h-48 tw-p-2"
              type="text"
              v-model="post_text"
            />
          </div>
        </div>
      </v-card>
    </v-container>

    <v-dialog v-model="editDialog" max-width="800px" max-height="600px">
      <v-card class="pa-5">
        <v-row>
          <v-col>
            <v-card-title class="text-h5">修改帖子</v-card-title>
            <v-card-text>
              <v-form ref="releaseForm" v-model="releaseValid">
                <v-text-field
                  v-model="editInfo.title"
                  :rules="[
                    (v) => !!v || '帖子名不能为空',
                    (v) => v.length < 10 || '公告名不能超过10个字符',
                  ]"
                  label="请输入帖子名"
                  required
                ></v-text-field>
                <v-input
                  v-model="editInfo.content"
                  :rules="[
                    (v) => !!v || '帖子内容不能为空',
                    (v) => v.length < 500 || '帖子内容不能超过500个',
                  ]"
                  :count="500"
                  required
                >
                  <md-editor class="tw-w-full" v-model="info.content" />
                </v-input>
                <v-checkbox
                  v-model="editInfo.goPublic"
                  label="是否公开"
                  class=""
                  v-if="(my_role == 'teacher') | (my_role == 'assistant')"
                ></v-checkbox>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="cancelEdit()">取消</v-btn>
              <v-btn
                color="primary"
                text
                :loading="editLoading"
                :disabled="editLoading"
                @click="confirmEdit()"
                >确定</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import MdEditor from "@/components/MdEditor.vue";
import MdViewer from "@/components/MdViewer.vue";
import api from "@/api/api";
import DeleteDialog from "@/components/DeleteDialog.vue";
import SnackBar from "@/components/SnackBar.vue";
export default {
  components: {
    SnackBar,
    MdViewer,
    DeleteDialog,
    MdEditor,
  },
  data() {
    return {
      editLoading: false,
      editDialog: false,
      my_role: "",
      deleteCommentId: -1,
      commentDelete: false,
      addLoader: false,
      post_text: "",
      dialogDelete: false,
      editInfo: {
        title: "",
        content: "",
        goPublic: false,
      },
      info: {
        userName: "",
        userId: "",
        modifyTime: "",
        title: "",
        content: "",
        goPublic: false,
        deleteable: false,
        modifyable: false,
      },
      data: {
        description: "asdddddd",
      },
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
        this.getDataFromApi();
      },
      deep: true,
    },
  },
  mounted() {
    this.getDataFromApi();
  },
  methods: {
    getDataFromApi() {
      api.forumFactory
        .getPostInfo(this.$route.params.postId)
        .then((response) => {
          this.info = response.content;
          console.log(this.info);
        });
      api.forumFactory
        .getComment(this.$route.params.postId, this.page, this.itemsPerPage)
        .then((response) => {
          this.totalPage = response.content.totalPage;
          this.totalAmount = response.content.totalAmount;
          this.list = response.content.list;
        });
      api.authFactory.getRole().then((response) => {
        this.my_role = response.content;
      });
    },
    deleteItemConfirm() {
      api.forumFactory
        .deletePost(this.$route.params.postId)
        .then((response) => {
          this.closeDelete();
          if (response.code == 0) {
            this.$router.push({
              name: "forumPage",
              params: {
                groupId: this.$route.params.groupId,
              },
            });
          } else {
            this.$refs.sb.warn(response.msg);
          }
        })
        .catch(() => {
          this.$refs.sb.warn("未知错误");
        });
    },
    deletePost() {
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    addComment() {
      this.addLoader = true;
      api.forumFactory
        .addComment(this.$route.params.postId, this.post_text)
        .then((response) => {
          if (response.code == 0) {
            this.$refs.sb.warn("成功");
          } else {
            this.$refs.sb.warn("失败");
          }
          this.post_text = "";
          this.getDataFromApi();
          this.addLoader = false;
        })
        .catch(() => {
          this.addLoader = false;
          this.$refs.sb.warn("未知错误");
        });
    },
    deleteComment(val) {
      this.deleteCommentId = val;
      this.commentDelete = true;
    },
    closeCommentDelete() {
      this.deleteCommentId = -1;
      this.commentDelete = false;
    },
    deleteCommentConfirm() {
      api.forumFactory
        .deleteComment(this.deleteCommentId)
        .then((response) => {
          if (response.code == 0) {
            this.$refs.sb.warn("成功");
          } else {
            this.$refs.sb.warn("失败");
          }
          this.getDataFromApi();
          this.closeCommentDelete();
        })
        .catch(() => {
          this.$refs.sb.warn("未知错误");
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
    toTime: function (val) {
      return this.timestampToTime(val)[0] + this.timestampToTime(val)[1];
    },
    editPost(){
      this.editInfo.title = this.info.title
      this.editInfo.content = this.info.content
      this.editInfo.goPublic = this.info.goPublic
        this.editDialog = true;
    },
    cancelEdit() {
      this.editInfo.title = ""
      this.editInfo.content = ""
      this.editInfo.goPublic = ""
      this.editDialog = false;
    },
    confirmEdit() {
      api.forumFactory.editPost(this.$route.params.postId,this.editInfo).then((resposne)=>{
        if(resposne.code == 0){
          this.$refs.sb.warn("成功")
          this.getDataFromApi()
        }else{
          this.$refs.sb.warn("失败")
        }
        this.cancelEdit()
      }).catch(()=>{
        this.$refs.sb.warn("未知错误")
      })
    },
  },
};
</script>

<style>
</style>