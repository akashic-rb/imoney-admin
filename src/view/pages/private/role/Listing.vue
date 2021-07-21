<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="roles"
      :options.sync="options"
      :server-items-length="total"
      :loading="loading"
      loading-text="Loading... Please wait"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Danh sách role</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-text-field
            v-model="key"
            @focus="searchClosed = false"
            @blur="searchClosed = true"
            @change="searchRole"
            color="teal"
            placeholder="Rolename"
            prepend-inner-icon="mdi-magnify"
            class="expanding-search mt-4 mr-2 shrink"
            :class="{ closed: searchClosed && !key }"
            filled
            dense
            clearable
          ></v-text-field>
        </v-toolbar>
      </template>

      <template v-slot:[`item.name`]="{ item }">
        {{ item.name }}
      </template>
      <template v-slot:[`item.description`]="{ item }">
        {{ item.description }}
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

export default {
  data: () => ({
    valid: true,

    options: {
      page: 1,
    },

    headers: [
      {
        text: "Role",
        align: "start",
        value: "name",
        sortable: false,
      },
      { text: "Description", value: "description", sortable: false },
    ],

    defaultItem: {
      name: "",
      description: "",
    },

    key: "",
    searchClosed: true,

    loading: false,

    role: null,

    loadItem: false,
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
    ...mapState("role/getAll", {
      roles: "rolesList",
      rolesListLoading: "loading",
      total: "total",
    }),
  },

  mounted() {
    this.setBreadcrumb([
      { title: "Role", route: "roleListing" },
      { title: "Danh sách" },
    ]);
  },

  methods: {
    ...mapActions("breadcrumbs", ["setBreadcrumb"]),
    ...mapActions("role/getAll", ["getAllRoles"]),

    async getDataFromApi() {
      this.loading = true;
      const except = ["Admin"];
      const { page, itemsPerPage } = this.options;
      await this.getAllRoles({
        key: this.key,
        except: except,
        page: page,
        itemsPerPage: itemsPerPage,
      });
      this.loading = false;
    },

    searchRole() {
      if (this.options.page !== 1) {
        this.options.page = 1;
      }
      this.getDataFromApi();
    },
  },
};
</script>
