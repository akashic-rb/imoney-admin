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
          <v-toolbar-title>Employees Listing</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-row class="mt-4">
            <v-col md="6"
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
                @change="filterAndSearchEmployee"
              ></v-autocomplete></v-col
          ></v-row>

          <v-spacer></v-spacer>

          <v-text-field
            v-model="key"
            @focus="searchClosed = false"
            @blur="searchClosed = true"
            @change="filterAndSearchEmployee"
            color="teal"
            placeholder="Name/Phone/Email"
            prepend-inner-icon="mdi-account-search"
            class="expanding-search mt-4 mr-2 shrink"
            :class="{ closed: searchClosed && !key }"
            filled
            dense
            clearable
          ></v-text-field>

          <router-link :to="{ name: 'employeeCreating' }">
            <v-btn color="teal" dark class="mb-2"
              ><v-icon class="mr-1">mdi-account-plus</v-icon>
            </v-btn>
          </router-link>
        </v-toolbar>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this employee?</v-card-title>
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
    pointer: cursor !important
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

export default {
  data: () => ({
    valid: true,

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

    employee: null,

    loading: false,
    dialogDelete: false,
    deletedIndex: -1,

    deleting: false,

    key: "",
    searchClosed: true,

    team: "",
  }),

  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },

  computed: {
    ...mapState("employee/getAll", {
      data: "data",
      employeesListLoading: "loading",
      total: "total",
    }),

    ...mapState("employee/destroy", {
      error: "error",
      destroyLoading: "loading",
    }),

    teamItems() {
      return Object.keys(TEAM).map((key) => ({
        id: TEAM[key],
        name: convertKeyHaveTwoChars(key),
      }));
    },
  },

  mounted() {
    this.setBreadcrumb([
      { title: "Employee", route: "employeeListing" },
      { title: "List" },
    ]);
  },

  methods: {
    ...mapActions("breadcrumbs", ["setBreadcrumb"]),
    ...mapActions("employee/getAll", ["getAll"]),
    ...mapActions("employee/destroy", ["destroy"]),

    async getDataFromApi() {
      this.loading = true;
      const { page, sortBy, sortDesc, itemsPerPage } = this.options;
      await this.getAll({
        key: this.key,
        team: this.team,
        sortBy: sortBy[0],
        sortDesc: sortDesc[0],
        page: page,
        itemsPerPage: itemsPerPage,
      });
      this.loading = false;
    },

    editItem(item) {
      this.$router.push({ name: "employeeEditing", params: { id: item.id } });
    },

    deleteItem(item) {
      this.deletedIndex = this.data.indexOf(item);
      this.employee = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleting = true;

      setTimeout(async () => {
        const isSucceeded = await this.destroy(this.employee.id);
        if (isSucceeded) {
          this.$notify({
            title: "Delete employee successfully!",
            type: "success",
          });
          this.data.splice(this.deletedIndex, 1);
        } else {
          this.$notify({
            title: "Delete employee failed!",
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
        this.employee = null;
        this.deletedIndex = -1;
      });
    },

    searchRole() {
      if (this.options.page !== 1) {
        this.options.page = 1;
      }
      this.getDataFromApi();
    },

    required(value) {
      if (value instanceof Array && value.length == 0) {
        return "This field is required";
      }
      return !!value || "This field is required";
    },

    filterAndSearchEmployee() {
      if (this.options.page !== 1) {
        this.options.page = 1;
      }
      this.getDataFromApi();
    },
  },
};
</script>
