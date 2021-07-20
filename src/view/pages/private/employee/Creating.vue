<template>
  <v-container>
    <v-card class="mx-auto">
      <v-form ref="form" v-model="valid" lazy-validation :disabled="saving">
        <v-card-title>Information</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                :v-model="password"
                :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="() => (value = !value)"
                :type="value ? 'password' : 'text'"
                :rules="passwordRules"
                @input="(_) => (password = _)"
                label="Password"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-title>Profile</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="firstName"
                :rules="firstNameRules"
                label="Firstname"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="lastName"
                :rules="lastNameRules"
                label="Lastname"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="phone"
                :rules="phoneRules"
                label="Phone"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="gender"
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
                    v-model="dob"
                    label="Date of birth"
                    prepend-icon="mdi-calendar"
                    :rules="[invalidDOB]"
                    v-bind="attrs"
                    v-on="on"
                    readonly
                  ></v-text-field>
                </template>
                <v-date-picker v-model="dob" no-title scrollable>
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
                v-model="university"
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
                v-model="status"
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
                v-model="team"
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
                v-model="skills"
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
                v-model="roles"
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
                v-model="permissions"
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
            @click="saveCreate()"
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

    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      (v) => (v && v.length >= 15) || "E-mail must be at least 15 characters",
      (v) =>
        (v && v.length <= 50) ||
        "E-mail must not be greater than 50 characters",
    ],

    value: true,
    password: "",
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) => (v && v.length >= 6) || "Password must be at least 6 characters",
    ],

    phone: "",
    phoneRules: [
      (v) => !!v || "Phone is required",
      (v) => /^\d{10}$/.test(v) || "Phone is invalid",
    ],

    firstName: "",
    firstNameRules: [
      (v) => !!v || "Firstname is required",
      (v) =>
        /^[A-Za-z]+$/.test(v) ||
        "Firstname can't contain numbers or special characters",
      (v) =>
        (v && v.length <= 20) || "Firstname must be less than 20 characters",
    ],

    lastName: "",
    lastNameRules: [
      (v) => !!v || "Lastname is required",
      (v) =>
        /^[A-Za-z]+$/.test(v) ||
        "Lastname can't contain numbers or special characters",
      (v) =>
        (v && v.length <= 20) || "Lastname must be less than 20 characters",
    ],

    menu: false,

    gender: 1,

    dob: new Date().toISOString().substr(0, 10),

    university: "",
    universityRules: [
      (v) => !!v || "University is required",
      (v) => (v && v.length >= 5) || "University must be at least 5 characters",
    ],

    status: null,
    statusRules: [(v) => !!v || "Status is required"],

    team: null,
    teamRules: [(v) => !!v || "Team is required"],

    skills: [],

    roles: [{ id: 4, name: "Employee" }],

    permissions: [],

    checkbox: false,
    checkboxRules: [(v) => !!v || "You must agree to continue!"],

    saving: false,
  }),

  mounted() {
    this.setBreadcrumb([
      { title: "Employee", route: "employeeListing" },
      { title: "Create" },
    ]);
    this.getRolesList();
    this.getPermissionsList();
  },

  computed: {
    ...mapState("role/getAll", ["rolesList", "loading"]),
    ...mapState("permission/getAll", ["permissionsList", "loading"]),
    ...mapState("employee/create", ["error", "loading"]),
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
    ...mapActions("employee/create", ["create"]),

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

    async getRolesList() {
      await this.getAllRoles({
        key: null,
        itemsPerPage: -1,
      });
    },

    async getPermissionsList() {
      await this.getAllPermissions();
    },

    clear() {
      this.$refs.form.resetValidation();
    },

    saveCreate() {
      this.valid = this.$refs.form.validate();

      if (typeof this.skills[0] === "object") {
        this.skills = this.skills.map((i) => i.id);
      }
      if (typeof this.permissions[0] === "object") {
        this.permissions = this.permissions.map((i) => i.id);
      }

      if (this.valid) {
        this.saving = true;
        const info = {
          email: this.email,
          password: this.password,
          phone: this.phone,
          first_name: this.firstName,
          last_name: this.lastName,
          gender: this.gender,
          dob: this.dob,
          university: this.university,
          status: this.status,
          team_id: this.team,
          skills: this.skills,
          permission_id: this.permissions,
        };

        setTimeout(async () => {
          const isSucceeded = await this.create(info);
          if (isSucceeded) {
            this.$notify({
              title: "Create new employee successfully!",
              type: "success",
            });
            this.$router.push({ name: "employeeListing" });
          } else {
            this.$notify({
              title: "Create new employee failed!",
              text: this.error,
              type: "error",
            });
          }
          this.saving = false;
        }, 2000);
      }
    },
  },
};
</script>
