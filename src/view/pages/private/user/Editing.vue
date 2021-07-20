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
        v-if="user"
        lazy-validation
        :disabled="saving"
      >
        <v-card-title>Details</v-card-title>
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
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="user.profile.firstName"
                :rules="firstNameRules"
                label="Firstname"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="user.profile.lastName"
                :rules="lastNameRules"
                label="Lastname"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="user.email"
                :value="email"
                :rules="emailRules"
                label="E-mail"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="user.phone"
                :rules="phoneRules"
                label="Phone"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="user.profile.gender"
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
                    v-model="user.profile.dob"
                    label="Date of birth"
                    prepend-icon="mdi-calendar"
                    :rules="[invalidDOB]"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="user.profile.dob" no-title scrollable>
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
                v-model="user.profile.university"
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
                v-model="user.status"
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
                v-model="user.team"
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
                v-model="user.skills"
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
                v-model="user.roles[0]"
                item-value="id"
                item-text="name"
                :items="rolesList"
                :rules="[required]"
                label="Roles"
                small-chips
                deletable-chips
                hide-selected
                :menu-props="{ top: false, offsetY: true }"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="user.permissions"
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
                v-model="user.startDate"
                label="Start date"
                prepend-icon="mdi-calendar"
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-if="user.endDate"
                v-model="user.endDate"
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

    rulesAvatar: [
      (v) => !v || v.size < 2000000 || "Avatar size should be less than 2 MB!",
    ],

    imgPreview: null,
    image: null,
  }),

  async mounted() {
    this.setBreadcrumb([
      { title: "User", route: "userListing" },
      { title: "Edit" },
    ]);
    this.getRolesList();
    this.getPermissionsList();
    this.getUser();
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

    ...mapState("user/get", {
      user: "user",
      getLoading: "loading",
    }),

    ...mapState("user/update", {
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
    avatar() {
      if (!this.user.imagePath) {
        return this.imgPreview
          ? this.imgPreview
          : process.env.BASE_URL + "media/users/default.jpg";
      } else {
        return this.imgPreview
          ? this.imgPreview
          : process.env.VUE_APP_BASE_API_URL +
              "/storage/" +
              this.user.imagePath;
      }
    },
  },

  methods: {
    ...mapActions("breadcrumbs", ["setBreadcrumb"]),
    ...mapActions("role/getAll", ["getAllRoles"]),
    ...mapActions("permission/getAll", ["getAllPermissions"]),
    ...mapActions("user/get", ["get"]),
    ...mapActions("user/update", ["update"]),

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

    async getUser() {
      this.loading = true;
      await this.get(this.$route.params.id);
      this.loading = false;
    },

    saveEdit() {
      this.valid = this.$refs.form.validate();
      if (typeof this.user.team === "object") {
        this.user.team = this.user.team.id;
      }
      if (typeof this.user.skills[0] === "object") {
        this.user.skills = this.user.skills.map((i) => i.id);
      }
      if (typeof this.user.roles[0] === "object") {
        this.user.roles = this.user.roles.map((i) => i.id);
      }
      if (typeof this.user.permissions[0] === "object") {
        this.user.permissions = this.user.permissions.map((i) => i.id);
      }

      if (this.valid) {
        this.saving = true;

        const formData = new FormData();
        formData.append("email", this.user.email);
        formData.append("phone", this.user.phone);
        formData.append("first_name", this.user.profile.firstName);
        formData.append("last_name", this.user.profile.lastName);
        formData.append("gender", this.user.profile.gender);
        formData.append("dob", this.user.profile.dob);
        formData.append("status", this.user.status);
        formData.append("university", this.user.profile.university);
        formData.append("team_id", this.user.team);
        formData.append("role_id", this.user.roles);
        formData.append("skills", JSON.stringify(this.user.skills));
        formData.append("permission_id", JSON.stringify(this.user.permissions));
        formData.append("_method", "PUT");
        if (this.image !== null) {
          formData.append("image", this.image);
        }

        setTimeout(async () => {
          const isSucceeded = await this.update({
            id: this.$route.params.id,
            formData: formData,
          });
          if (isSucceeded) {
            this.$notify({
              title: "Update user successfully!",
              type: "success",
            });
            this.$router.push({
              name: "userListing",
            });
          } else {
            this.$notify({
              title: "Update user failed!",
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
        this.imgPreview = URL.createObjectURL(e);
        this.image = e;
      } else {
        this.imgPreview = null;
      }
    },
  },
};
</script>
