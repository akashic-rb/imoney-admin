<template>
  <v-container>
    <v-progress-linear
      indeterminate
      color="teal"
      v-show="loading"
    ></v-progress-linear>
    <v-card class="mx-auto">
      <v-form
        ref="form"
        v-model="valid"
        v-if="employee"
        lazy-validation
        :disabled="saving"
      >
        <v-card-title>Details</v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="employee.profile.firstName"
                :rules="firstNameRules"
                label="Firstname"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="employee.profile.lastName"
                :rules="lastNameRules"
                label="Lastname"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="employee.email"
                :value="email"
                :rules="emailRules"
                label="E-mail"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="employee.phone"
                :rules="phoneRules"
                label="Phone"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="employee.profile.gender"
                item-value="id"
                item-text="name"
                :items="genderItems"
                label="Gender"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="dob"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="employee.profile.dob"
                    label="Date of birth"
                    prepend-icon="mdi-calendar"
                    :rules="[invalidDOB]"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="employee.profile.dob"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">
                    Cancel
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(dob)">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="employee.profile.university"
                :rules="universityRules"
                label="University"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-title>Job</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="3">
              <v-select
                v-model="employee.status"
                item-value="id"
                item-text="name"
                :items="statusItems"
                :rules="statusRules"
                label="Status"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="employee.team"
                item-value="id"
                item-text="name"
                :items="teamItems"
                :rules="teamRules"
                label="Team"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="employee.skills"
                item-value="id"
                item-text="name"
                :items="skillItems"
                :rules="[required]"
                label="Skills"
                multiple
                small-chips
                deletable-chips
                clearable
                hide-selected
                :menu-props="{ top: false, offsetY: true }"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="employee.roles"
                item-value="id"
                item-text="name"
                :items="rolesList"
                :rules="[required]"
                label="Roles"
                multiple
                small-chips
                deletable-chips
                clearable
                hide-selected
                :menu-props="{ top: false, offsetY: true }"
                disabled
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="employee.permissions"
                item-value="id"
                item-text="name"
                :items="permissionsList"
                label="Permissions"
                multiple
                small-chips
                deletable-chips
                clearable
                hide-selected
                :menu-props="{ top: false, offsetY: true }"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="employee.startDate"
                label="Start date"
                prepend-icon="mdi-calendar"
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-if="employee.endDate"
                v-model="employee.endDate"
                label="End date"
                prepend-icon="mdi-calendar"
                disabled
              ></v-text-field>
            </v-col>
          </v-row>
          <v-checkbox
            v-model="checkbox"
            :rules="checkboxRules"
            label="Do you agree?"
            required
          ></v-checkbox>
        </v-card-text>

        <v-card-actions>
          <v-btn
            class="mr-4"
            @click="saveEdit()"
            :loading="saving"
            :disabled="saving"
          >
            Save
          </v-btn>
          <v-btn @click="clear" :disabled="saving"> Clear </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { GENDER, STATUS, TEAM, SKILL } from "@/utils/constants";
import {
  convertKeyName,
  convertKeyHaveTwoChars,
  convertKeyHaveSpace,
} from "@/helper/validation";

export default {
  data: () => ({
    valid: true,

    loading: false,

    email: "",

    menu: false,

    dob: new Date().toISOString().substr(0, 10),

    skills: [],

    roles: [],

    permissions: [],

    checkbox: false,

    saving: false,

    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      (v) => (v && v.length >= 15) || "E-mail must be at least 15 characters",
      (v) =>
        (v && v.length <= 50) ||
        "E-mail must not be greater than 50 characters",
    ],

    phoneRules: [
      (v) => !!v || "Phone is required",
      (v) => /^\d{10}$/.test(v) || "Phone is invalid",
    ],

    firstNameRules: [
      (v) => !!v || "Firstname is required",
      (v) =>
        /^[A-Za-z]+$/.test(v) ||
        "Firstname can't contain numbers or special characters",
      (v) =>
        (v && v.length <= 20) || "Firstname must be less than 20 characters",
    ],

    lastNameRules: [
      (v) => !!v || "Lastname is required",
      (v) =>
        /^[A-Za-z]+$/.test(v) ||
        "Lastname can't contain numbers or special characters",
      (v) =>
        (v && v.length <= 20) || "Lastname must be less than 20 characters",
    ],

    universityRules: [
      (v) => !!v || "University is required",
      (v) => (v && v.length >= 6) || "University must be at least 6 characters",
    ],

    statusRules: [(v) => !!v || "Status is required"],

    teamRules: [(v) => !!v || "Team is required"],

    checkboxRules: [(v) => !!v || "You must agree to continue!"],
  }),

  async mounted() {
    this.setBreadcrumb([
      { title: "Employee", route: "employeeListing" },
      { title: "Edit" },
    ]);
    this.getRolesList();
    this.getPermissionsList();
    this.getEmployee();
  },

  computed: {
    ...mapState("role/getAll", {
      rolesList: "rolesList",
      rolesListLoading: "loading",
    }),

    ...mapState("permission/getAll", {
      permissionsList: "permissionsList",
      permissionsListLoading: "loading",
    }),

    ...mapState("employee/get", {
      employee: "employee",
      getLoading: "loading",
    }),

    ...mapState("employee/update", {
      error: "error",
      updateLoading: "loading",
    }),

    genderItems() {
      return Object.keys(GENDER).map((key) => ({
        id: GENDER[key],
        name: convertKeyName(key),
      }));
    },
    statusItems() {
      return Object.keys(STATUS).map((key) => ({
        id: STATUS[key],
        name: convertKeyName(key),
      }));
    },
    teamItems() {
      return Object.keys(TEAM).map((key) => ({
        id: TEAM[key],
        name: convertKeyHaveTwoChars(key),
      }));
    },
    skillItems() {
      return Object.keys(SKILL).map((key) => ({
        id: SKILL[key],
        name: convertKeyHaveSpace(key),
      }));
    },
  },

  methods: {
    ...mapActions("breadcrumbs", ["setBreadcrumb"]),
    ...mapActions("role/getAll", ["getAllRoles"]),
    ...mapActions("permission/getAll", ["getAllPermissions"]),
    ...mapActions("employee/get", ["get"]),
    ...mapActions("employee/update", ["update"]),

    async getRolesList() {
      const except = ["Admin"];
      await this.getAllRoles({
        key: null,
        except: except,
        itemsPerPage: -1,
      });
    },

    async getPermissionsList() {
      await this.getAllPermissions();
    },

    async getEmployee() {
      this.loading = true;
      await this.get(this.$route.params.id);
      this.loading = false;
    },

    saveEdit() {
      this.valid = this.$refs.form.validate();
      if (typeof this.employee.team === "object") {
        this.employee.team = this.employee.team.id;
      }
      if (typeof this.employee.skills[0] === "object") {
        this.employee.skills = this.employee.skills.map((i) => i.id);
      }
      if (typeof this.employee.roles[0] === "object") {
        this.employee.roles = this.employee.roles.map((i) => i.id);
      }
      if (typeof this.employee.permissions[0] === "object") {
        this.employee.permissions = this.employee.permissions.map((i) => i.id);
      }

      if (this.valid) {
        this.saving = true;
        const info = {
          email: this.employee.email,
          phone: this.employee.phone,
          first_name: this.employee.profile.firstName,
          last_name: this.employee.profile.lastName,
          gender: this.employee.profile.gender,
          dob: this.employee.profile.dob,
          university: this.employee.profile.university,
          status: this.employee.status,
          team_id: this.employee.team,
          skills: this.employee.skills,
          role_id: this.employee.roles,
          permission_id: this.employee.permissions,
        };

        setTimeout(async () => {
          const isSucceeded = await this.update({
            id: this.$route.params.id,
            info,
          });
          if (isSucceeded) {
            this.$notify({
              title: "Update employee successfully!",
              type: "success",
            });
            this.$router.push({
              name: "employeeListing",
            });
          } else {
            this.$notify({
              title: "Update employee failed!",
              text: this.error,
              type: "error",
            });
          }
          this.saving = false;
        }, 2000);
      }
    },

    clear() {
      this.$refs.form.resetValidation();
    },

    required(value) {
      if (value instanceof Array && value.length == 0) {
        return "This field is required";
      }
      return !!value || "This field is required";
    },

    invalidDOB(value) {
      let validDate = new Date("2005-01-01");
      let dateCheck = new Date(value);
      if (dateCheck > validDate) {
        return "DOB must be a date before 01-01-2005";
      }
      return !!value || "DOB is invalid";
    },
  },
};
</script>
