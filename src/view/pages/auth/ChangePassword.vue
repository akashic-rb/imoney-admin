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
        <h3 class="font-size-h1">Change Password</h3>
        <p class="text-muted font-weight-semi-bold">
          Enter your email and old password
        </p>
      </div>

      <!--begin::Form-->
      <b-form class="form" @submit.stop.prevent="onSubmit">
        <div role="alert" class="alert alert-info">
          <div class="alert-text">
            Enter exactly these <strong>fields</strong> to change your password
            .
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

        <b-form-group
          id="password-input-group"
          label=""
          label-for="password-input"
        >
          <b-form-input
            class="form-control form-control-solid h-auto py-5 px-6 mb-2"
            type="password"
            id="password-input"
            name="password-input"
            v-model="$v.form.password.$model"
            :state="validateState('password')"
            aria-describedby="password-live-feedback"
            placeholder="Old password"
            autocomplete="off"
          ></b-form-input>

          <b-form-invalid-feedback id="password-live-feedback">
            Password must have at least 6 characters.
          </b-form-invalid-feedback>
        </b-form-group>
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
            flex-wrap
            justify-content-between
            align-items-center
          "
        >
          <router-link
            :to="{ name: 'forgotPassword' }"
            class="text-dark-60 text-hover-primary my-3 mr-2"
            id="kt_change_forgot"
          >
            Forgot Password ?
          </router-link>
          <button
            ref="kt_changePassword_submit"
            class="btn btn-primary font-weight-bold px-9 py-4 my-3 font-size-3"
            :disabled="change"
          >
            Change
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
import { email, minLength, required, sameAs } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  name: "changePassword",
  data() {
    return {
      change: false,
      form: {
        email: "",
        password: "",
        newPassword: "",
        confirmNewPassword: "",
      },
    };
  },
  computed: {
    ...mapState("user/changePassword", ["error", "loading"]),
  },
  validations: {
    form: {
      email: {
        required,
        email,
      },
      password: {
        required,
        minLength: minLength(6),
      },
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
    ...mapActions("user/changePassword", ["changePassword"]),
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    resetForm() {
      this.form = {
        email: null,
        password: null,
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

      this.change = true;
      const email = this.$v.form.email.$model;
      const password = this.$v.form.password.$model;
      const newPassword = this.$v.form.newPassword.$model;
      const newPassword_confirmation = this.$v.form.confirmNewPassword.$model;

      const info = {
        email,
        password,
        newPassword,
        newPassword_confirmation,
      };

      // set spinner to submit button
      const submitButton = this.$refs["kt_changePassword_submit"];
      submitButton.classList.add("spinner", "spinner-light", "spinner-right");

      // dummy delay
      setTimeout(async () => {
        const isSucceeded = await this.changePassword(info);
        if (isSucceeded) {
          this.$router.push({ name: "login" });
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
        this.change = false;
      }, 2000);
    },
  },
};
</script>
