<template>
  <v-container fluid fill-height class="blue-grey lighten-5" pa-0 align-start>
    <v-navigation-drawer permanent dark app>
      <v-list>
        <v-subheader class="text-h6 white--text">后台管理</v-subheader>
        <v-list-item-group mandatory color=" teal lighten-3">
          <v-list-item v-for="(item, i) in items" :key="i" :to="item.router">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view class=""></router-view>
    </v-main>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    selectedItem: 1,
    items: [
      { text: "用户管理", icon: "mdi-clock",router:{ name: 'UserManagement'} },
      { text: "班级管理", icon: "mdi-account",router:{ name: 'GroupManagement'} },
      { text: "问题管理", icon: "mdi-application-edit",router:{ name: 'ProblemManagement'} },
      { text: "竞赛管理", icon: "mdi-flag",router:{ name: 'CompetitionManagement'} },
    ],
    items1: [
      ["mdi-email", "Inbox"],
      ["mdi-account-supervisor-circle", "Supervisors"],
      ["mdi-clock-start", "Clock-in"],
      ["mdi-clock-start", "Clock-in"],
    ],
  }),
};
</script>