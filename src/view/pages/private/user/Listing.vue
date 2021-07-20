<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="data"
      :options.sync="options"
      :server-items-length="total"
      :loading="loading"
      loading-text="Loading... Please wait"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Users Listing</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-row class="mt-4">
            <v-col cols="12" sm="8" md="6"
              ><v-autocomplete
                v-model="team"
                outlined
                auto-select-first
                chips
                clearable
                deletable-chips
                dense
                prepend-inner-icon="mdi-filter"
                placeholder="Filter by team"
                item-value="id"
                item-text="name"
                :items="teamItems"
                @change="filterAndSearchUser"
              ></v-autocomplete></v-col
          ></v-row>

          <v-spacer></v-spacer>

          <v-text-field
            v-model="key"
            @focus="searchClosed = false"
            @blur="searchClosed = true"
            @change="filterAndSearchUser"
            color="teal"
            placeholder="Search"
            prepend-inner-icon="mdi-account-search"
            class="expanding-search mt-4 mr-2 shrink"
            :class="{ closed: searchClosed && !key }"
            filled
            dense
            clearable
          ></v-text-field>

          <router-link :to="{ name: 'userCreating' }">
            <v-btn color="teal" dark class="mb-2"
              ><v-icon class="mr-1">mdi-account-plus</v-icon>
            </v-btn>
          </router-link>

          <v-dialog v-model="dialog" width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-import</v-icon>
              </v-btn>
            </template>

            <v-card>
              <v-card-title class="text-h5 grey lighten-2">
                Choose file to import (Except : <i>.xls, .xlxs, .csv</i> )
              </v-card-title>

              <v-card-text>
                <v-row>
                  <v-col md="4">
                    <v-file-input
                      truncate-length="20"
                      accept=".xlsx, .xls, .csv"
                      @change="onFileChange"
                      :disabled="uploading"
                    ></v-file-input>
                  </v-col>
                  <v-col md="8">
                    <v-btn
                      class="mt-2"
                      @click="importDataUser"
                      :disabled="uploading"
                      >Import
                    </v-btn>
                  </v-col>
                </v-row>

                <v-progress-linear
                  indeterminate
                  color="teal"
                  v-show="uploading"
                ></v-progress-linear>
                <v-alert type="success" v-if="message" dismissible>
                  {{ message.success }}
                </v-alert>
                <v-alert type="error" v-if="error" dismissible>
                  {{ error }}
                </v-alert>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="dialog = false">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

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

      <template v-slot:[`item.fullName`]="{ item }">
        {{ item.profile.firstName }} {{ item.profile.lastName }}
      </template>
      <template v-slot:[`item.dob`]="{ item }">
        {{ item.profile.dob }}
      </template>
      <template v-slot:[`item.gender`]="{ item }">
        {{ item.profile.gender }}
      </template>
      <template v-slot:[`item.team`]="{ item }">
        {{ item.team.name }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)" color="teal">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)" color="teal">
          mdi-delete
        </v-icon>
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
import { TEAM } from "@/utils/constants";
import { convertKeyHaveTwoChars } from "@/helper/validation";
import JsonCSV from "vue-json-csv/src/JsonCSV";
import JsonExcel from "vue-json-excel";

export default {
  data: () => ({
    options: {
      page: 1,
    },

    headers: [
      {
        text: "Fullname",
        align: "start",
        value: "fullName",
      },
      { text: "DOB", value: "dob" },
      { text: "Gender", value: "gender", sortable: false },
      { text: "Email", value: "email" },
      { text: "Phone", value: "phone" },
      { text: "Status", value: "status", sortable: false },
      { text: "Team", value: "team" },
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

    file: null,

    uploading: false,

    success: false,
  }),
  components: {
    JsonCSV,
    JsonExcel,
  },

  watch: {
    options: {
      handler() {
        this.getDataFromApi();
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
    ...mapState("user/importData", ["error", "loading", "message"]),
    teamItems() {
      return Object.keys(TEAM).map((key) => ({
        id: TEAM[key],
        name: convertKeyHaveTwoChars(key),
      }));
    },
  },

  mounted() {
    this.setBreadcrumb([
      { title: "User", route: "userListing" },
      { title: "List" },
    ]);
  },

  methods: {
    ...mapActions("breadcrumbs", ["setBreadcrumb"]),
    ...mapActions("user/getAll", ["getAll"]),
    ...mapActions("user/destroy", ["destroy"]),
    ...mapActions("user/importData", ["importData"]),

    async getDataFromApi() {
      this.loading = true;

      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      await this.getAll({
        key: this.key,
        team: this.team,
        sortBy: sortBy[0],
        sortDesc: sortDesc[0],
        page: page,
        itemsPerPage: itemsPerPage,
      });
      const temp = [];
      this.data.forEach(function (item) {
        let skills = "";
        let roles = "";
        item.skills.forEach(function (skill) {
          skills += skill.name + ", ";
        });
        item.roles.forEach(function (role) {
          roles += role.name + ", ";
        });
        temp.push({
          Id: item.id,
          Firstname: item.profile.firstName,
          Lastname: item.profile.lastName,
          Dob: item.profile.dob,
          Gender: item.profile.gender,
          Email: item.email,
          Phone: item.phone,
          Status: item.status,
          StartDate: item.startDate,
          EndDate: item.endDate,
          Team: item.team.name,
          Skills: skills,
          Roles: roles,
        });
      });
      this.dataExport = temp;
      this.loading = false;
    },

    editItem(item) {
      this.$router.push({
        name: "userEditing",
        params: { id: item.id, page: this.options.page },
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
        const isSucceeded = await this.destroy(this.user.id);
        if (isSucceeded) {
          this.$notify({
            title: "Delete user successfully!",
            type: "success",
          });
          this.data.splice(this.deletedIndex, 1);
        } else {
          this.$notify({
            title: "Delete user failed!",
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

    filterAndSearchUser() {
      if (this.options.page !== 1) {
        this.options.page = 1;
      }
      this.getDataFromApi();
    },

    onFileChange(file) {
      this.file = file;
    },

    async importDataUser() {
      this.uploading = true;
      const formData = new FormData();
      formData.append("file", this.file);
      const isSucceeded = await this.importData(formData);
      if (isSucceeded) {
        this.success = true;
      }
      this.uploading = false;
    },
  },
};
</script>
