<template>
  <div>
    <!--begin::Content header-->
    <div
      class="position-absolute top-0 right-0 text-right mt-5 mb-15 mb-lg-0 flex-column-auto justify-content-center py-5 px-10"
    >
      <span class="font-weight-bold font-size-3 text-dark-60">
        Already have an account before ?
      </span>
      <router-link
        class="font-weight-bold font-size-3 ml-2"
        :to="{ name: 'login' }"
      >
        Sign In!
      </router-link>
    </div>
    <!--end::Content header-->

    <!--begin::forgotPassword-->
    <div class="forgot-password-form forgot-password-reset">
      <div class="text-center mb-10 mb-lg-20">
        <h3 class="font-size-h1">Forgot Password</h3>
        <p class="text-muted font-weight-semi-bold">
          Enter your email , new password will be sent to your email .
        </p>
      </div>

      <!--begin::Form-->
      <b-form class="form" @submit.stop.prevent="onSubmit">
        <div role="alert" class="alert alert-info">
          <div class="alert-text">
            Enter your <strong>email</strong> that you forgot password .
          </div>
        </div>
        <b-form-group id="email-input-group" label="" label-for="email-input">
          <b-form-input
            class="form-control form-control-solid h-auto py-5 px-6 mb-2"
            id="email-input"
            name="email-input"
            v-model="$v.form.email.$model"
            :state="validateState('email')"
            aria-describedby="email-live-feedback"
            placeholder="Email"
            autocomplete="off"
          ></b-form-input>

          <b-form-invalid-feedback id="email-live-feedback">
            Email is required and a valid email address.
          </b-form-invalid-feedback>
        </b-form-group>

        <!--begin::Action-->
        <div
          class="form-group d-flex flex-wrap justify-content-between align-items-center"
        >
          <router-link
            :to="{ name: 'changePassword' }"
            class="text-dark-60 text-hover-primary my-3 mr-2"
            id="kt_forgot_change"
          >
            Change Password ?
          </router-link>
          <button
            ref="kt_forgot_reset_submit"
            class="btn btn-primary font-weight-bold px-9 py-4 my-3 font-size-3"
            :disabled="reset"
          >
            Reset
          </button>
        </div>
        <!--end::Action-->
      </b-form>
      <!--end::Form-->
    </div>
    <!--end::forgotPassword-->
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
import { email, required } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  name: "forgotPassword",
  data() {
    return {
      reset: false,
      form: {
        email: "",
      },
    };
  },
  computed: {
    ...mapState("user/forgotPassword", ["error", "loading"]),
  },
  validations: {
    form: {
      email: {
        required,
        email,
      },
    },
  },
  methods: {
    ...mapActions("user/forgotPassword", ["forgotPassword"]),
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    resetForm() {
      this.form = {
        email: null,
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

      this.reset = true;

      // set spinner to submit button
      const submitButton = this.$refs["kt_forgot_reset_submit"];
      submitButton.classList.add("spinner", "spinner-light", "spinner-right");

      // dummy delay
      setTimeout(async () => {
        const isSucceeded = await this.forgotPassword({
          email: this.$v.form.email.$model,
        });
        if (isSucceeded) {
          this.$notify({
            title: "Reset password link has been sent to your email !",
            type: "success",
          });
        } else
          this.$notify({
            title: "Reset password failed",
            text: this.error,
            type: "error",
          });

        submitButton.classList.remove(
          "spinner",
          "spinner-light",
          "spinner-right"
        );
        this.reset = false;
      }, 2000);
    },
  },
};
</script>
