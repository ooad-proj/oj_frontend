<template>
  <div>
    <v-container grid-list-xs>
      <v-card class="pa-5">
        <p class="tw-text-xl tw-font-bold">问题集</p>
        <v-data-table
          :headers="headers"
          :items="tableData"
          hide-default-footer
          :loading="loading"
        >
          <template v-slot:[`item.enter`]="{ item }">
            <v-btn text color="primary" @click="goInProblem(item)">
              <v-icon left>mdi-door-open</v-icon>
              进入问题
            </v-btn>
          </template>
        </v-data-table>

        <div class="text-center pt-2">
          <v-pagination
            v-model="page"
            :total-visible="9"
            :length="totalPage"
          ></v-pagination>
        </div>
      </v-card>
    </v-container>
  </div>
</template>