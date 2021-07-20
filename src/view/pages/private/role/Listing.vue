<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="rolesList"
      :options.sync="options"
      :server-items-length="total"
      :loading="loading"
      loading-text="Loading... Please wait"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Roles Listing</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>

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

          <v-btn color="teal" dark class="mb-2" @click="newRole"
            ><v-icon class="mr-1">mdi-plus-circle</v-icon>
          </v-btn>
        </v-toolbar>
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-progress-linear
              indeterminate
              color="primary"
              v-show="loadItem"
            ></v-progress-linear>
            <v-card-text>
              <v-container>
                <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
                  :disabled="saving"
                  v-if="role && !loadItem"
                >
                  <v-row>
                    <v-col cols="12" sm="8" md="4">
                      <v-text-field
                        v-model="role.name"
                        :rules="roleRules"
                        label="Role"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="8" md="8">
                      <v-select
                        v-model="role.permissions"
                        item-value="id"
                        item-text="name"
                        :items="permissionsList"
                        :rules="[required]"
                        label="Permissions"
                        multiple
                        small-chips
                        deletable-chips
                        item-disabled
                        clearable
                        hide-selected
                        :menu-props="{ top: false, offsetY: true }"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="8" md="6">
                      <v-checkbox
                        v-model="checkbox"
                        :rules="checkboxRules"
                        label="Do you agree?"
                        required
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
                :disabled="saving"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
                :loading="saving"
                :disabled="saving"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline"
              >Are you sure you want to delete this role?</v-card-title
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

      <template v-slot:[`item.role`]="{ item }">
        {{ item.name }}
      </template>
      <template v-slot:[`item.permissions`]="{ item }">
        <v-combobox
          v-model="item.permissions"
          item-value="id"
          item-text="name"
          :items="permissionsList"
          placeholder="Permissions"
          multiple
          small-chips
          dense
          readonly
        ></v-combobox>
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
        value: "role",
        sortable: false,
      },
      { text: "Permissions", value: "permissions", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],

    defaultItem: {
      name: "",
      permissions: [],
    },

    dialog: false,
    dialogDelete: false,
    key: "",
    searchClosed: true,
    deleting: false,

    loading: false,
    role: null,
    permissions: [],

    loadItem: false,

    editedIndex: -1,

    saving: false,

    checkbox: false,
    checkboxRules: [(v) => !!v || "You must agree to continue!"],

    roleRules: [(v) => !!v || "Rolename is required"],
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
      rolesList: "rolesList",
      rolesListLoading: "loading",
      total: "total",
    }),

    ...mapState("permission/getAll", {
      permissionsList: "permissionsList",
      permissionsListLoading: "loading",
    }),

    ...mapState("role/get", {
      roleData: "role",
      getRoleLoading: "loading",
    }),

    ...mapState("role/update", {
      updateRoleLoading: "loading",
      updateRoleError: "error",
    }),

    ...mapState("role/create", {
      createRoleLoading: "loading",
      createRoleError: "error",
    }),

    ...mapState("role/destroy", {
      destroyRoleLoading: "loading",
      destroyRoleError: "error",
    }),

    formTitle() {
      return this.editedIndex === -1 ? "New role" : "Edit role";
    },
  },

  mounted() {
    this.setBreadcrumb([
      { title: "Role", route: "roleListing" },
      { title: "List" },
    ]);
    this.getPermissionsList();
  },

  methods: {
    ...mapActions("breadcrumbs", ["setBreadcrumb"]),
    ...mapActions("role/getAll", ["getAllRoles"]),
    ...mapActions("permission/getAll", ["getAllPermissions"]),
    ...mapActions("role/get", ["get"]),
    ...mapActions("role/update", ["update"]),
    ...mapActions("role/create", ["create"]),
    ...mapActions("role/destroy", ["destroy"]),

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

    async getPermissionsList() {
      await this.getAllPermissions();
    },

    async editItem(item) {
      this.dialog = true;
      this.loadItem = true;
      this.editedIndex = this.rolesList.indexOf(item);
      await this.get(item.id);
      this.role = this.roleData;
      this.loadItem = false;
    },

    deleteItem(item) {
      this.deletedIndex = this.rolesList.indexOf(item);
      this.role = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleting = true;

      setTimeout(async () => {
        const isSucceeded = await this.destroy(this.role.id);
        if (isSucceeded) {
          this.rolesList.splice(this.deletedIndex, 1);
          this.$notify({
            title: "Delete role successfully!",
            type: "success",
          });
        } else {
          this.$notify({
            title: "Delete role failed!",
            text: this.destroyRoleError,
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
        this.role = null;
        this.deletedIndex = -1;
      });
    },

    searchRole() {
      if (this.options.page !== 1) {
        this.options.page = 1;
      }
      this.getDataFromApi();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.$refs.form.reset();
        this.role = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      this.valid = this.$refs.form.validate();
      if (typeof this.role.permissions[0] === "object") {
        this.role.permissions = this.role.permissions.map((i) => i.id);
      }
      if (this.valid) {
        this.saving = true;
        const data = {
          name: this.role.name,
          permissions: this.role.permissions,
        };
        if (this.editedIndex > -1) {
          setTimeout(async () => {
            const isSucceeded = await this.update({
              id: this.role.id,
              data,
            });
            if (isSucceeded) {
              this.$notify({
                title: "Update role successfully !",
                type: "success",
              });
              this.getDataFromApi();
              this.close();
            } else {
              this.$notify({
                title: "Update role failed !",
                text: this.updateRoleError,
                type: "error",
              });
            }
            this.saving = false;
          }, 2000);
        } else {
          setTimeout(async () => {
            const isSucceeded = await this.create(data);
            if (isSucceeded) {
              this.$notify({
                title: "Create role successfully !",
                type: "success",
              });
              this.getDataFromApi();
              this.close();
            } else {
              this.$notify({
                title: "Create role failed !",
                text: this.createRoleError,
                type: "error",
              });
            }
            this.saving = false;
          }, 2000);
        }
      }
    },

    newRole() {
      this.role = Object.assign({}, this.defaultItem);
      this.dialog = true;
    },

    required(value) {
      if (value instanceof Array && value.length == 0) {
        return "This field is required";
      }
      return !!value || "This field is required";
    },
  },
};
</script>
