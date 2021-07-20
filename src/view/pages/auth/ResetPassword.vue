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

    <!--begin::changePassword-->
    <div class="change-password-form change-password-change">
      <div class="text-center mb-10 mb-lg-20">
        <h3 class="font-size-h1">Reset Password</h3>
      </div>

      <!--begin::Form-->
      <b-form class="form" @submit.stop.prevent="onSubmit">
        <div role="alert" class="alert alert-info">
          <div class="alert-text">
            Enter your new pasword and new password confirmation .
          </div>
        </div>

        <b-form-group
          id="newPassword-input-group"
          label=""
          label-for="newPassword-input"
        >
          <b-form-input
            class="form-control form-control-solid h-auto py-5 px-6 mb-2"
            type="password"
            id="newPassword-input"
            name="newPassword-input"
            v-model="$v.form.newPassword.$model"
            :state="validateState('newPassword')"
            aria-describedby="newPassword-live-feedback"
            placeholder="New password"
            autocomplete="off"
          ></b-form-input>

          <b-form-invalid-feedback id="newPassword-live-feedback">
            New password must have at least 6 characters.
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
          id="confirmNewPassword-input-group"
          label=""
          label-for="confirmNewPassword-input"
        >
          <b-form-input
            class="form-control form-control-solid h-auto py-5 px-6 mb-2"
            type="password"
            id="confirmNewPassword-input"
            name="confirmNewPassword-input"
            v-model="$v.form.confirmNewPassword.$model"
            :state="validateState('confirmNewPassword')"
            aria-describedby="confirmNewPassword-live-feedback"
            placeholder="New password confirmation"
            autocomplete="off"
          ></b-form-input>

          <b-form-invalid-feedback id="confirmNewPassword-live-feedback">
            New password confirmation does not match.
          </b-form-invalid-feedback>
        </b-form-group>

        <!--begin::Action-->
        <div
          class="
            form-group
            d-flex
            flex-row-reverse
            justify-content-between
            align-items-center
          "
        >
          <button
            ref="kt_resetPassword_submit"
            class="btn btn-primary font-weight-bold px-9 py-4 my-3 font-size-3"
            :disabled="submit"
          >
            Submit
          </button>
        </div>
        <!--end::Action-->
      </b-form>
      <!--end::Form-->
    </div>
    <!--end::changePassword-->
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
import { minLength, required, sameAs } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  name: "resetPassword",
  data() {
    return {
      email: "",
      token: "",
      submit: false,
      form: {
        newPassword: "",
        confirmNewPassword: "",
      },
    };
  },
  computed: {
    ...mapState("user/resetPassword", ["error", "loading"]),
  },
  validations: {
    form: {
      newPassword: {
        required,
        minLength: minLength(6),
      },
      confirmNewPassword: {
        sameAsPassword: sameAs("newPassword"),
      },
    },
  },
  methods: {
    ...mapActions("user/resetPassword", ["resetPassword"]),
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    resetForm() {
      this.form = {
        newPassword: null,
        confirmNewPassword: null,
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

      this.submit = true;
      const email = this.$route.query.email;
      const token = this.$route.query.token;
      const password = this.$v.form.newPassword.$model;
      const password_confirmation = this.$v.form.confirmNewPassword.$model;
      const credentials = {
        email,
        token,
        password,
        password_confirmation,
      };

      // set spinner to submit button
      const submitButton = this.$refs["kt_resetPassword_submit"];
      submitButton.classList.add("spinner", "spinner-light", "spinner-right");

      // dummy delay
      setTimeout(async () => {
        const isSucceeded = await this.resetPassword(credentials);
        if (isSucceeded) {
          this.$notify({
            title: "Your password was changed successfully !",
            type: "success",
          });
        } else
          this.$notify({
            title: "Change password failed",
            text: this.error,
            type: "error",
          });

        submitButton.classList.remove(
          "spinner",
          "spinner-light",
          "spinner-right"
        );
        this.submit = false;
      }, 2000);
    },
  },
};
</script>
