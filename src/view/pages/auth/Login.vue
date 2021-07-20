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
    >
      <router-link
        class="font-weight-bold font-size-3 ml-2"
        :to="{ name: 'signUp' }"
      >
        Sign Up
      </router-link>
      <span class="font-weight-bold font-size-3 text-dark-60"> | </span>
      <router-link
        class="font-weight-bold font-size-3 ml-2"
        :to="{ name: 'changePassword' }"
      >
        Change Password
      </router-link>
    </div>
    <!--end::Content header-->

    <!--begin::Signin-->
    <div class="login-form login-signin">
      <div class="text-center mb-10 mb-lg-20">
        <h3 class="font-size-h1">Sign In</h3>
        <p class="text-muted font-weight-semi-bold">
          Enter your username and password
        </p>
      </div>

      <!--begin::Form-->
      <b-form class="form" @submit.stop.prevent="onSubmit">
        <div role="alert" class="alert alert-info">
          <div class="alert-text">
            Use account <strong>admin@admin.com</strong> and password
            <strong>password</strong> to continue.
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
            Email is required and a valid email address.
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
            Password is required.
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
            Forgot Password ?
          </router-link>
          <button
            ref="kt_login_signin_submit"
            class="btn btn-primary font-weight-bold px-9 py-4 my-3 font-size-3"
          >
            Sign In
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
        email: "admin@admin.com",
        password: "password",
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
        if (isSucceeded) this.$router.push({ name: "dashboard" });
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
