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
        <v-card-title>Chỉnh sửa thông tin người dùng</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="user.email"
                :rules="emailRules"
                label="Email"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="user.name"
                :rules="nameRules"
                label="Tên"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="user.username"
                :rules="username"
                label="Tên đăng nhập"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="user.role.name"
                label="Role"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                :value="user.email_verified_at"
                label="Verified email at"
                required
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                :value="formatStatus(user.deleted_at)"
                label="Trạng thái"
                required
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text>
          <v-checkbox
            v-model="checkbox"
            :rules="checkboxRules"
            label="Bạn chắc chắn?"
            required
          ></v-checkbox>
        </v-card-text>

        <v-card-actions>
          <v-btn
            class="mr-4 primary"
            @click="saveEdit()"
            :loading="saving"
            :disabled="saving"
          >
            Lưu
          </v-btn>
          <v-btn @click="clear" :disabled="saving"> Xóa </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data: () => ({
    valid: true,

    loading: false,

    email: "",

    menu: false,

    checkbox: false,

    emailRules: [
      (v) => !!v || "E-mail là bắt buộc",
      (v) => /.+@.+\..+/.test(v) || "E-mail không hợp lệ",
    ],

    value: true,

    name: "",
    nameRules: [
      (v) => !!v || "Firstname is required",
      (v) => (v && v.length <= 20) || "Tên quá dài",
    ],

    username: "",

    checkboxRules: [(v) => !!v || "Vui lòng xác nhận thông tin!"],

    saving: false,
  }),

  async mounted() {
    this.setBreadcrumb([
      { title: "Người dùng", route: "userListing" },
      { title: "Chỉnh sửa" },
    ]);
    this.getUser();
  },

  computed: {
    ...mapState("user/get", {
      user: "user",
      getLoading: "loading",
    }),

    ...mapState("user/update", {
      error: "error",
      updateLoading: "loading",
    }),
  },

  methods: {
    ...mapActions("breadcrumbs", ["setBreadcrumb"]),
    ...mapActions("user/get", ["get"]),
    ...mapActions("user/update", ["update"]),

    async getUser() {
      this.loading = true;
      let res = await this.get(this.$route.params.id);
      this.loading = !res;
    },

    saveEdit() {
      this.valid = this.$refs.form.validate();
      if (this.valid) {
        this.saving = true;

        const formData = new FormData();
        formData.append("email", this.user.email);
        formData.append("name", this.user.name);
        formData.append("username", this.user.username);
        formData.append("user_id", this.user.user_id);

        setTimeout(async () => {
          const isSucceeded = await this.update({
            id: this.user.user_id,
            formData,
          });
          if (isSucceeded) {
            this.$notify({
              title: "Cập nhật thành công!",
              type: "success",
            });
            this.$router.push({ name: "userListing" });
          } else {
            this.$notify({
              title: "Đã có lỗi xảy ra thử lại sau!",
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
        return "Vui lòng điền";
      }
      return !!value || "Vui lòng điền";
    },

    formatStatus(date) {
      if (!date) {
        return "Active";
      }
      return "Deleted";
    },
  },
};
</script>
