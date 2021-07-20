<template>
  <div>
    <!--begin::Content header-->
    <div
      class="
        position-absolute
        top-0
        right-0
        text-right
        mt-5
        mb-15 mb-lg-0
        flex-column-auto
        justify-content-center
        py-5
        px-10
      "
    ></div>
    <!--end::Content header-->

    <!--begin::Signin-->
    <div class="login-form login-signin">
      <div class="text-center mb-10 mb-lg-20">
        <h3 class="font-size-h1">Đăng nhập</h3>
        <p class="text-muted font-weight-semi-bold">
          Điền tài khoản và mật khẩu để đăng nhập
        </p>
      </div>

      <!--begin::Form-->
      <b-form class="form" @submit.stop.prevent="onSubmit">
        <div role="alert" class="alert alert-info">
          <div class="alert-text">
            Sử dụng một tài khoản <strong>admin</strong> để tiếp tục.
          </div>
        </div>

        <b-form-group id="email-input-group" label="" label-for="email-input">
          <b-form-input
            class="form-control form-control-solid h-auto py-5 px-6"
            id="email-input"
            name="email-input"
            v-model="$v.form.email.$model"
            :state="validateState('email')"
            aria-describedby="email-live-feedback"
          ></b-form-input>

          <b-form-invalid-feedback id="email-live-feedback">
            Email không được thiếu và phải hợp lệ
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          id="password-input-group"
          label=""
          label-for="password-input"
        >
          <b-form-input
            class="form-control form-control-solid h-auto py-5 px-6"
            type="password"
            id="password-input"
            name="password-input"
            v-model="$v.form.password.$model"
            :state="validateState('password')"
            aria-describedby="password-live-feedback"
          ></b-form-input>

          <b-form-invalid-feedback id="password-live-feedback">
            Mật khẩu là bắt buộc
          </b-form-invalid-feedback>
        </b-form-group>

        <!--begin::Action-->
        <div
          class="
            form-group
            d-flex
            flex-wrap
            justify-content-between
            align-items-center
          "
        >
          <router-link
            :to="{ name: 'forgotPassword' }"
            class="text-dark-60 text-hover-primary my-3 mr-2"
            id="kt_login_forgot"
          >
            Quên mật khẩu ?
          </router-link>
          <button
            ref="kt_login_signin_submit"
            class="btn btn-primary font-weight-bold px-9 py-4 my-3 font-size-3"
          >
            Đăng nhập
          </button>
        </div>
        <!--end::Action-->
      </b-form>
      <!--end::Form-->
    </div>
    <!--end::Signin-->
  </div>
</template>

<style lang="scss" scoped>
.spinner.spinner-right {
  padding-right: 3.5rem !important;
}
</style>

<script>
import { mapState, mapActions } from "vuex";

import { validationMixin } from "vuelidate";
import { email, minLength, required } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  name: "login",
  data() {
    return {
      signIn: false,
      // Remove this dummy login info
      form: {
        email: "admin@app.com",
        password: "P@ssw0rd",
      },
    };
  },
  computed: {
    ...mapState("account/login", ["error", "loading"]),
  },
  validations: {
    form: {
      email: {
        required,
        email,
      },
      password: {
        required,
        minLength: minLength(3),
      },
    },
  },
  methods: {
    ...mapActions("auth", ["purgeAuth"]),
    ...mapActions("account/login", { loginAsync: "doAsync" }),
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    resetForm() {
      this.form = {
        email: null,
        password: null,
      };

      this.$nextTick(() => {
        this.$v.$reset();
      });
    },
    onSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      this.signIn = true;
      const email = this.$v.form.email.$model;
      const password = this.$v.form.password.$model;

      // clear existing errors
      this.purgeAuth();

      // set spinner to submit button
      const submitButton = this.$refs["kt_login_signin_submit"];
      submitButton.classList.add("spinner", "spinner-light", "spinner-right");

      // dummy delay
      setTimeout(async () => {
        const isSucceeded = await this.loginAsync({ email, password });
        if (isSucceeded) this.$router.push({ path: "dashboard" });
        else
          this.$notify({
            title: "Login failed",
            text: this.error,
            type: "error",
          });

        submitButton.classList.remove(
          "spinner",
          "spinner-light",
          "spinner-right"
        );
        this.signIn = false;
      }, 2000);
    },
  },
};
</script>
