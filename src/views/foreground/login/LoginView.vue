<template>
  <v-container class="">
    <v-card class=" mx-auto tw-max-w-sm my-10 pa-10">
      <v-form>
        <p class=" tw-text-2xl tw-font-bold">登录</p>
        <div class=" tw-p-2"></div>
        <v-text-field
        label="用户id"
        required
        color="teal"
        prepend-icon="mdi-account"
        ></v-text-field>

        <v-text-field
        label="密码"
        required
        color="teal"
        prepend-icon="mdi-form-textbox-password"
        ></v-text-field>

        <div class=" tw-p-2">
          <v-switch color="teal" inset dense label="记住我"></v-switch>
        </div>

        <div class=" tw-p-2">
          <v-btn block class="teal white--text">登录</v-btn>
        </div>
        
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
export default {

}
</script>

<style>

</style>