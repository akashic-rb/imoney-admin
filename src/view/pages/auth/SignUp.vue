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

    <!--begin::Signup-->
    <div class="login-form login-signin">
      <div class="text-center mb-10 mb-lg-20">
        <h3 class="font-size-h1">Sign Up</h3>
      </div>

      <div role="alert" class="alert alert-info">
        <div class="alert-text">
          You must contact <strong>Admin</strong> to get account !
        </div>
      </div>
    </div>
    <!--end::Signup-->
  </div>
</template>

<script>
export default {
  name: "changePassword",
};
</script>
