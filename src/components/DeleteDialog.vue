<template>
    <v-dialog v-model="popUpSelf" :max-width=width>
        <v-card class="pa-5 tw-flex-col tw-space-y-4">
          <div class="tw-text-xl tw-font-bold">{{title}}</div>
          <div class="tw-flex">
            <div class="pa-2">
              <v-icon color=" error" x-large>mdi-alert-circle-outline</v-icon>
            </div>
            <div class="pa-2">
              {{content}}
            </div>
          </div>

          <div>
            <v-btn text color="primary" @click="$emit('cancel')">取消</v-btn>
            <v-btn text color="primary" @click="$emit('confirm')">确定</v-btn>
          </div>

        </v-card>
    </v-dialog>
</template>

<script>
export default {
    model: {
        prop: "popUp",
        event: "change"
    },
    props: ["title","content","width", "popUp"],
    data() {
        return {
          popUpSelf: false
        }
    },
    watch: {
      popUp (val) {
        this.popUpSelf = val
      },
      popUpSelf() {
        this.$emit('change', this.popUpSelf)
      }
    }
}
</script>

 <!-- <v-dialog v-model="dialogDelete" max-width="35rem">
        <v-card class="pa-5 tw-flex-col tw-space-y-4">
          <div class="tw-text-xl tw-font-bold">删除用户组</div>
          <div class="tw-flex">
            <div class="pa-2">
              <v-icon color=" error" x-large>mdi-alert-circle-outline</v-icon>
            </div>
            <div class="pa-2">
              确定删除吗，确认删除操作后将离开本界面，跳转至所有群组界面
            </div>
          </div>

          <div>
            <v-btn text color="primary" @click="closeDelete">取消</v-btn>
            <v-btn text color="primary" @click="deleteItemConfirm">确定</v-btn>
          </div>

        </v-card>
    </v-dialog> -->