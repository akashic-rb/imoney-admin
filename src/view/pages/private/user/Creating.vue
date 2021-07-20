<template>
  <v-container>
    <v-card class="mx-auto">
      <v-form ref="form" v-model="valid" lazy-validation :disabled="saving">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-img
                :src="avatar"
                max-width="200"
                max-height="200"
                v-model="image"
              ></v-img>
              <v-file-input
                :rules="rulesAvatar"
                accept="image/png, image/jpeg, image/bmp, image/jpg"
                placeholder="Pick an avatar"
                prepend-icon="mdi-camera"
                label="Avatar"
                show-size
                truncate-length="20"
                @change="onFileChange"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-card-text>
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
                    readonly
                    v-bind="attrs"
                    v-on="on"
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
                small-chips
                deletable-chips
                clearable
                :menu-props="{ top: false, offsetY: true }"
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
      // (v) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(v) || "At least 8 characters with at least one capital letter, a number and a special character",
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

    roles: [],

    permissions: [],

    checkbox: false,
    checkboxRules: [(v) => !!v || "You must agree to continue!"],

    saving: false,

    rulesAvatar: [
      (v) => !v || v.size < 2000000 || "Avatar size should be less than 2 MB!",
    ],

    imgUrl: null,
    image: null,
  }),

  mounted() {
    this.setBreadcrumb([
      { title: "User", route: "userListing" },
      { title: "Create" },
    ]);
    this.getRolesList();
    this.getPermissionsList();
  },

  computed: {
    ...mapState("role/getAll", ["rolesList", "loading"]),
    ...mapState("permission/getAll", ["permissionsList", "loading"]),
    ...mapState("user/create", ["error", "loading"]),
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
    avatar() {
      return !this.imgUrl
        ? process.env.BASE_URL + "media/users/default.jpg"
        : this.imgUrl;
    },
  },

  methods: {
    ...mapActions("breadcrumbs", ["setBreadcrumb"]),
    ...mapActions("role/getAll", ["getAllRoles"]),
    ...mapActions("permission/getAll", ["getAllPermissions"]),
    ...mapActions("user/create", ["create"]),

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

    saveCreate() {
      this.valid = this.$refs.form.validate();

      if (typeof this.skills[0] === "object") {
        this.skills = this.skills.map((i) => i.id);
      }
      if (typeof this.roles[0] === "object") {
        this.roles = this.roles.map((i) => i.id);
      }
      if (typeof this.permissions[0] === "object") {
        this.permissions = this.permissions.map((i) => i.id);
      }

      if (this.valid) {
        this.saving = true;

        const formData = new FormData();
        formData.append("email", this.email);
        formData.append("password", this.password);
        formData.append("phone", this.phone);
        formData.append("first_name", this.firstName);
        formData.append("last_name", this.lastName);
        formData.append("gender", this.gender);
        formData.append("dob", this.dob);
        formData.append("status", this.status);
        formData.append("university", this.university);
        formData.append("team_id", this.team);
        formData.append("role_id", this.roles);
        formData.append("skills", JSON.stringify(this.skills));
        formData.append("permission_id", JSON.stringify(this.permissions));
        if (this.image !== null) {
          formData.append("image", this.image);
        }

        setTimeout(async () => {
          const isSucceeded = await this.create(formData);
          if (isSucceeded) {
            this.$notify({
              title: "Create new user successfully!",
              type: "success",
            });
            this.$router.push({ name: "userListing" });
          } else {
            this.$notify({
              title: "Create new user failed!",
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
    onFileChange(e) {
      if (e) {
        this.imgUrl = URL.createObjectURL(e);
        this.image = e;
      } else {
        this.imgUrl = null;
      }
    },
  },
};
</script>
