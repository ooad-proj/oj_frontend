<template>
  <v-app>
    <v-container
      grid-list-xs
      fill-height
      align-start
      justify-center
      class="blue-grey lighten-5 pa-5"
      fluid
    >
      <v-data-table
        :headers="headers"
        :items="desserts"
        :footer-props="{
          showFirstLastPage: true,
          itemsPerPageOptions: [5, 10, 15],
        }"
        class="elevation-5 tw-mt-28"
        mt-5
        pa-5
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title class="text-h2">Hotel List</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">确定删除吗</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >取消</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >确定</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>

        <template v-slot:[`item.price`]="{ item }">
          <v-chip :color="getColor(item.price)" dark>
            {{ item.price }}
          </v-chip>
        </template>

        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize"> Reset </v-btn>
        </template>

        <template v-slot:footer>
          <v-container grid-list-xs fluid fill-height justify-center>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  添加新记录
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field
                      v-model="editedItem.name"
                      :counter="10"
                      :rules="nameRules"
                      label="Hotel Name"
                      required
                    ></v-text-field>

                    <v-radio-group v-model="editedItem.city" row mandatory>
                      <p class="tw-mt-4 tw-mr-2">City:</p>
                      <v-radio label="Guang Zhou" value="Guang Zhou"></v-radio>
                      <v-radio label="Shen Zhen" value="Shen Zhen"></v-radio>
                    </v-radio-group>

                    <v-select
                      v-model="editedItem.district"
                      :items="items"
                      :rules="[(v) => !!v || '选择地区']"
                      label="District"
                      required
                    ></v-select>

                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      :return-value.sync="editedItem.date"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.date"
                          label="Date"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          required
                          :rules="[(v) => !!v || '选择日期']"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.date"
                        no-title
                        scrollable
                        color="green lighten-1"
                        :allowed-dates="allowedDates"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu = false">
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menu.save(editedItem.date)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>

                    <v-menu
                      ref="menuA"
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="editedItem.time"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.etime"
                          label="Earliest check in time"
                          prepend-icon="mdi-clock-time-four-outline"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          required
                          :rules="[(v) => !!v || '选择时间']"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="menu2"
                        v-model="editedItem.etime"
                        full-width
                        @click:minute="$refs.menuA.save(editedItem.etime)"
                      ></v-time-picker>
                    </v-menu>

                    <v-text-field
                      v-model="editedItem.price"
                      :rules="priceRules"
                      label="Price"
                      required
                    ></v-text-field>

                    <v-select
                      v-model="editedItem.roomtp"
                      :items="Roomtypes"
                      :rules="[(v) => !!v || '选择房间种类']"
                      label="Room type"
                      required
                    ></v-select>
                  </v-form>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-container>
        </template>
      </v-data-table>
    </v-container>
    <v-snackbar v-model="snackbar">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    text: "数据关联不符合规范,请检查上下文数据",
    snackbar: false,
    menu2: false,
    menu: false,
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "Hotel name", align: "start", sortable: false, value: "name" },
      { text: "City", value: "city" },
      { text: "District", value: "district" },
      { text: "Date", value: "date" },
      { text: "Earlist Check-in time", value: "etime" },
      { text: "Price", value: "price" },
      { text: "Room Type", value: "roomtp" },
      { text: "Operation", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,

    editedItem: {
      name: "",
      city: "Guang Zhou",
      district: "",
      date: null,
      etime: null,
      price: 0,
      roomtp: "",
    },
    defaultItem: {
      name: "",
      city: "Guang Zhou",
      district: "",
      date: null,
      etime: null,
      price: 0,
      roomtp: "",
    },
    valid: true,
    name: "",
    nameRules: [
      (v) => !!v || "名字不能为空",
      (v) => (v && v.length <= 10) || "输入需小于10个字符",
    ],

    priceRules: [
      (v) => !!v || "价格不能为空",
      (v) => /(^[1-9]\d*$)/.test(v) || "请输入有效的价格",
    ],
    select: null,
    itemsA: [
      "LI WAN",
      "YUE XIU",
      "HAI ZHU",
      "TIAN HE",
      "BAI YUN",
      "HUANG PU",
      "YV FAN",
      "HUA DU",
      "NAN SHA",
      "CONG HUA",
    ],
    itemsB: [
      "FU TIAN",
      "NAN SHAN",
      "LUO HU",
      "LONG GANG",
      "PING SHAN",
      "LONG HUA",
      "GUANG MING",
      "YAN TIAN",
    ],
    roomtype: "",
    Roomtypes: [
      "Standard Room",
      "King Bed Room",
      "Family Room",
      "Presidential Room",
    ],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    items() {
      return this.editedItem.city == "Guang Zhou" ? this.itemsA : this.itemsB;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    allowedDates: (val) =>
      parseInt(val.split("-")[2], 10) -
        parseInt(
          new Date(Date.now()).toISOString().substr(0, 10).split("-")[2],
          10
        ) >
      0,
    checkA() {
      this.GuangZhou = true;
      this.Shenzhen = false;
    },
    checkB() {
      this.GuangZhou = false;
      this.Shenzhen = true;
    },

    initialize() {
      this.desserts = [
        {
          name: "湖畔宿舍",
          city: "Shen Zhen",
          district: "NAN SHAN",
          date: "2021-10-16",
          etime: "01:51",
          price: 4,
          roomtp: "Standard Room",
        },
        {
          name: "广州宾馆",
          city: "Guang Zhou",
          district: "NAN SHA",
          date: "2021-10-16",
          etime: "05:33",
          price: 3500,
          roomtp: "King Bed Room",
        },
        {
          name: "广州宾馆",
          city: "Guang Zhou",
          district: "NAN SHA",
          date: "2021-10-16",
          etime: "05:33",
          price: 2950,
          roomtp: "King Bed Room",
        },
        {
          name: "广州宾馆",
          city: "Guang Zhou",
          district: "NAN SHA",
          date: "2021-10-16",
          etime: "05:33",
          price: 2800,
          roomtp: "King Bed Room",
        },
      ];
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$refs.form.resetValidation();
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$refs.form.resetValidation();
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      let count = 0;
      let falseflag = false;

      if (this.$refs.form.validate()) {
        for (let j = 0; j < this.desserts.length; j++) {
          if (
            this.desserts[j].name == this.editedItem.name &&
            this.desserts[j].city == this.editedItem.city &&
            this.desserts[j].district == this.editedItem.district
          ) {
            count = count + 1;
            if (count == 3) {
              falseflag = true;
              break;
            }
          }
        }
        for (let j = 0; j < this.desserts.length; j++) {
          if (
            this.desserts[j].name == this.editedItem.name &&
            this.desserts[j].city == this.editedItem.city &&
            this.desserts[j].district == this.editedItem.district &&
            this.desserts[j].roomtp != this.editedItem.roomtp
          ) {
            if (this.desserts[j].price == this.editedItem.price) {
              falseflag = true;
              break;
            }
          }
        }
        if (!falseflag) {
          if (this.editedIndex > -1) {
            Object.assign(this.desserts[this.editedIndex], this.editedItem);
          } else {
            this.desserts.push(this.editedItem);
          }
          this.close();
        } else {
          this.snackbar = true;
        }
      }
    },
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    getColor(val) {
      if (val > 3000) return "red";
      else if (val > 1500) return "orange";
      else return "green";
    },
  },
};
</script>