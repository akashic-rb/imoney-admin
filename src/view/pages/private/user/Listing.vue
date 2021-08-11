<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="data"
      :options.sync="options"
      :server-items-length="total"
      :loading="getAllLoading"
      :items-per-page="-1"
      loading-text="Loading... Please wait"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Danh sách người dùng</v-toolbar-title>

          <v-spacer></v-spacer>

          <router-link :to="{ name: 'userCreating' }">
            <v-btn color="teal" dark class="mb-2"
              ><v-icon class="mr-1">mdi-account-plus</v-icon>
            </v-btn>
          </router-link>

          <v-menu left bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-export</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item>
                <JsonCSV
                  v-if="dataExport.lenght !== 0"
                  :data="dataExport"
                  class="btn btn-default"
                >
                </JsonCSV>
              </v-list-item>
              <v-list-item>
                <JsonExcel
                  v-if="dataExport.lenght !== 0"
                  :data="dataExport"
                  class="btn btn-default"
                >
                </JsonExcel>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline"
              >Are you sure you want to delete this user?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="closeDelete"
                :disabled="deleting"
                >Cancel</v-btn
              >
              <v-btn
                color="blue darken-1"
                text
                @click="deleteItemConfirm"
                :loading="deleting"
                :disabled="deleting"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

      <template v-slot:[`item.name`]="{ item }">
        {{ item.name }}
      </template>
      <template v-slot:[`item.email`]="{ item }">
        {{ item.email }}
      </template>
      <template v-slot:[`item.username`]="{ item }">
        {{ item.username }}
      </template>
      <template v-slot:[`item.role`]="{ item }">
        {{ item.role.name }}
      </template>
      <template v-slot:[`item.createDate`]="{ item }">
        {{ formatDate(item.created_at) }}
      </template>
      <template v-slot:[`item.verified`]="{ item }">
        {{ formatDate(item.email_verified_at) }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)" color="teal">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)" color="teal">
          mdi-delete
        </v-icon>
      </template>
      <template>
        <v-data-footer :disable-items-per-page="true" />
      </template>
    </v-data-table>
  </div>
</template>
<style lang="sass">
.v-input.expanding-search
  transition: max-width 0.4s
  .v-input__slot
    cursor: pointer !important
    &:before, &after
      border-color: transparent !important
  &.closed
    max-width: 45px
    .v-input__slot
      background: transparent !important
</style>
<script>
import { mapActions, mapState } from "vuex";
import JsonCSV from "vue-json-csv/src/JsonCSV";
import JsonExcel from "vue-json-excel";
import moment from "moment";

export default {
  data: () => ({
    options: {
      page: 1,
      itemsPerPage: 10,
    },

    headers: [
      {
        text: "Tên",
        align: "start",
        value: "name",
        sortable: false,
      },
      { text: "Email", value: "email", sortable: false },
      { text: "Tên đăng nhập", value: "username", sortable: false },
      { text: "Role", value: "role", sortable: false },
      { text: "Ngày tạo", value: "createDate", sortable: false },
      { text: "Xác thực", value: "verified", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],

    dialogDelete: false,

    user: null,

    deletedIndex: -1,

    deleting: false,

    loading: false,
    key: "",
    searchClosed: true,

    team: "",

    dataExport: [],

    dialog: false,
  }),
  components: {
    JsonCSV,
    JsonExcel,
  },
  watch: {
    options: {
      handle() {
        return this.getAllWithPagination(this.options.itemsPerPage);
      },
    },
  },

  computed: {
    ...mapState("user/getAll", {
      data: "data",
      getAllLoading: "loading",
      total: "total",
    }),
    ...mapState("user/destroy", {
      error: "error",
      destroyLoading: "loading",
    }),
  },

  mounted() {
    this.setBreadcrumb([
      { title: "Người dùng", route: "userListing" },
      { title: "Danh sách" },
    ]);
    this.getAllWithPagination(this.options.itemsPerPage);
  },

  methods: {
    ...mapActions("breadcrumbs", ["setBreadcrumb"]),
    ...mapActions("user/getAll", ["getAllWithPagination"]),
    ...mapActions("user/destroy", ["destroy"]),

    async getDataFromApi() {
      this.loading = true;

      await this.getAllWithPagination(this.options.itemsPerPage);
      const temp = [];
      this.data.forEach(function (item) {
        temp.push({
          Id: item.user_id,
          Name: item.name,
          Email: item.email,
          Username: item.username,
          Role: item.role.name,
          CreateDate: item.created_at,
          EmailVerifiedAt: item.email_verified_at,
        });
      });
      this.dataExport = temp;
      this.loading = false;
    },

    editItem(item) {
      this.$router.push({
        name: "userEditing",
        params: { id: item.user_id, page: this.options.page },
      });
    },

    deleteItem(item) {
      this.deletedIndex = this.data.indexOf(item);
      this.user = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleting = true;

      setTimeout(async () => {
        const isSucceeded = await this.destroy(this.user.user_id);
        if (isSucceeded) {
          this.$notify({
            title: "Xóa thành công",
            type: "success",
          });
          this.data.splice(this.deletedIndex, 1);
        } else {
          this.$notify({
            title: "Đã có lỗi xảy ra! Thử lại sau",
            text: this.error,
            type: "error",
          });
        }
        this.deleting = false;
        this.closeDelete();
      }, 2000);
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.user = null;
        this.deletedIndex = -1;
      });
    },

    formatDate(date) {
      return date === null
        ? null
        : moment(String(date)).format("DD/MM/YYYY hh:mm");
    },
  },
};
</script>
