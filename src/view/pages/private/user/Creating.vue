<template>
  <v-container>
    <v-card class="mx-auto">
      <v-form ref="form" v-model="valid" lazy-validation :disabled="saving">
        <v-card-title>Thông tin đăng nhập</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
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
                label="Mật khẩu"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="name"
                :rules="nameRules"
                label="Tên"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="username"
                :rules="usernameRules"
                label="Tên đăng nhập"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="role"
                :items="rolesList"
                label="Chọn role"
                item-text="name"
                item-value="role_id"
              ></v-select>
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
            @click="saveCreate()"
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

    email: "",
    emailRules: [
      (v) => !!v || "E-mail là bắt buộc",
      (v) => /.+@.+\..+/.test(v) || "E-mail không hợp lệ",
    ],

    value: true,
    password: "",
    passwordRules: [
      (v) => !!v || "Mật khẩu là bắt buộc",
      (v) =>
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/i.test(
          v
        ) ||
        "Mật khẩu phải có 1 ký tự đặc biệt, 1 chữ in hoa, 1 số, ít nhất 8 ký tự",
    ],

    name: "",
    nameRules: [
      (v) => !!v || "Tên là bắt buộc",
      (v) => (v && v.length <= 20) || "Tên quá dài",
    ],

    username: "",
    usernameRules: [
      (v) => !!v || "Tên đăng nhập là bắt buộc",
      (v) => /^[A-Za-z0-9]+$/.test(v) || "Tên không được chứa kí tự đặc biệt",
      (v) => (v && v.length <= 20) || "Tên quá dài",
    ],
    menu: false,

    role: "",

    checkbox: false,
    checkboxRules: [(v) => !!v || "Vui lòng xác nhận thông tin!"],

    saving: false,
  }),

  mounted() {
    this.setBreadcrumb([
      { title: "Người dùng", route: "userListing" },
      { title: "Tạo mới" },
    ]);
    this.getRolesList();
  },

  computed: {
    ...mapState("role/getAll", ["rolesList", "loading"]),
    ...mapState("user/create", ["error", "loading"]),
  },

  methods: {
    ...mapActions("breadcrumbs", ["setBreadcrumb"]),
    ...mapActions("user/create", ["create"]),
    ...mapActions("role/getAll", ["getAllRoles"]),

    async getRolesList() {
      this.getAllRoles();
    },

    saveCreate() {
      this.valid = this.$refs.form.validate();

      if (this.valid) {
        this.saving = true;

        const formData = new FormData();
        formData.append("email", this.email);
        formData.append("password", this.password);
        formData.append("name", this.name);
        formData.append("username", this.username);
        formData.append("role_id", this.role);
        setTimeout(async () => {
          const isSucceeded = await this.create(formData);
          if (isSucceeded) {
            this.$notify({
              title: "Tạo người dùng thành công!",
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
  },
};
</script>
