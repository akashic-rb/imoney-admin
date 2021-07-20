import Vue from "vue";
import Router from "vue-router";
import store from "@/core/store";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      component: () => import("@/view/pages/public/Home.vue"),
    },
    {
      path: "/admin",
      redirect: { name: "dashboard" },
      component: () => import("@/view/layout/Layout"),
      beforeEnter: (to, from, next) => {
        if (!store.getters["auth/isLoggedIn"]) next({ name: "login" });
        next();
      },
      children: [
        {
          path: "/dashboard",
          name: "dashboard",
          component: () => import("@/view/pages/private/Dashboard.vue"),
        },
        {
          path: "/user",
          name: "user",
          component: () => import("@/view/pages/private/user/Layout.vue"),
          children: [
            {
              path: "list",
              name: "userListing",
              component: () => import("@/view/pages/private/user/Listing.vue"),
            },
            {
              path: "create",
              name: "userCreating",
              component: () => import("@/view/pages/private/user/Creating.vue"),
            },
            {
              path: "edit/:id",
              name: "userEditing",
              component: () => import("@/view/pages/private/user/Editing.vue"),
            },
          ],
        },
        {
          path: "/role",
          name: "role",
          component: () => import("@/view/pages/private/role/Layout.vue"),
          children: [
            {
              path: "list",
              name: "roleListing",
              component: () => import("@/view/pages/private/role/Listing.vue"),
            },
          ],
        },
        {
          path: "/myprofile",
          name: "myProfile",
          component: () => import("@/view/pages/private/user/Profile.vue"),
        },
        {
          path: "/import",
          name: "import",
          component: () => import("@/view/pages/private/import/Layout.vue"),
          children: [
            {
              path: "user",
              name: "userData",
              component: () => import("@/view/pages/private/import/Import.vue"),
            },
          ],
        },
        {
          path: "/employee",
          name: "employee",
          component: () => import("@/view/pages/private/employee/Layout.vue"),
          children: [
            {
              path: "list",
              name: "employeeListing",
              component: () =>
                import("@/view/pages/private/employee/Listing.vue"),
            },
            {
              path: "create",
              name: "employeeCreating",
              component: () =>
                import("@/view/pages/private/employee/Creating.vue"),
            },
            {
              path: "edit/:id",
              name: "employeeEditing",
              component: () =>
                import("@/view/pages/private/employee/Editing.vue"),
            },
          ],
        },
      ],
    },
    {
      path: "/error",
      name: "error",
      component: () => import("@/view/pages/error/Error.vue"),
      children: [
        {
          path: "error-1",
          name: "error-1",
          component: () => import("@/view/pages/error/Error-1.vue"),
        },
      ],
    },
    {
      path: "/admin",
      component: () => import("@/view/pages/auth/Auth"),
      beforeEnter: (to, from, next) => {
        if (store.getters["auth/isLoggedIn"]) next({ name: "dashboard" });
        next();
      },
      children: [
        {
          name: "login",
          path: "/login",
          component: () => import("@/view/pages/auth/Login"),
        },
        {
          // forgot password
          path: "/forgotPassword",
          name: "forgotPassword",
          component: () => import("@/view/pages/auth/ForgotPassword.vue"),
        },
        {
          // change password
          path: "/changePassword",
          name: "changePassword",
          component: () => import("@/view/pages/auth/ChangePassword.vue"),
        },
        {
          // sign up
          path: "/signUp",
          name: "signUp",
          component: () => import("@/view/pages/auth/SignUp.vue"),
        },
        {
          // reset password
          path: "/resetPassword",
          name: "resetPassword",
          component: () => import("@/view/pages/auth/ResetPassword.vue"),
        },
      ],
    },
    {
      path: "*",
      redirect: "/404",
    },
    {
      // the 404 route, when none of the above matches
      path: "/404",
      name: "404",
      component: () => import("@/view/pages/error/Error-1.vue"),
    },
  ],
});
