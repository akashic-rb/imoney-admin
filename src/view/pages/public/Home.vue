<template>
  <v-app id="home">
    <v-container fill-height>
      <v-row class="mx-auto" :justify="justify">
        <v-col md="6" v-if="users.length === 0 && !error">
          <v-row class="mb-2">
            <v-col align="center">
              <v-img
                src="https://appscyclone.com/wp-content/uploads/2020/04/logo.png"
                alt="logo"
                max-width="288"
                max-height="50"
              >
              </v-img>
            </v-col>
          </v-row>

          <v-text-field
            v-model="key"
            @keyup.enter="searchUser"
            placeholder="Ex: abc, 0123, ..."
            prepend-inner-icon="mdi-magnify"
            filled
            rounded
            dense
            clearable
            autocomplete="off"
            solo
            :disabled="searching"
          ></v-text-field>
          <div class="text-center">
            <v-btn
              rounded
              elevation="5"
              :loading="searching"
              :disabled="searching"
              @click="searchUser"
            >
              Search
            </v-btn>
          </div>
        </v-col>

        <v-col md="6" v-if="users.length !== 0" align="center">
          <v-card-title
            >Found some persons with key " <i>{{ key }}</i> "</v-card-title
          >
          <v-row class="mx-auto" :justify="justify">
            <v-col md="3" v-for="item in users" :key="item.id">
              <v-card hover @click="detailUser(item)">
                <v-avatar size="72" class="mt-2">
                  <img
                    :src="avatar(item)"
                    class="img-radius"
                    alt="User-Profile-Image"
                  />
                </v-avatar>
                <v-card-text
                  >{{ item.profile.firstName }}
                  {{ item.profile.lastName }}</v-card-text
                >
              </v-card>
            </v-col>
          </v-row>

          <div class="text-center" v-if="lastPage > 1">
            <v-pagination
              v-model="options.page"
              :length="lastPage"
              prev-icon="mdi-menu-left"
              next-icon="mdi-menu-right"
              class="mt-2"
            ></v-pagination>
          </div>

          <v-btn class="mt-2" color="darken-2" dark @click="back">
            <v-icon dark left> mdi-arrow-left </v-icon>Back
          </v-btn>
        </v-col>

        <v-col md="6" v-if="users.length === 0 && error" align="center">
          <v-card-title
            >Not found any persons with key "<i>{{ key }}</i
            >"</v-card-title
          >

          <v-btn class="mt-1" color="darken-2" dark @click="back">
            <v-icon dark left> mdi-arrow-left </v-icon>Back
          </v-btn>
        </v-col>
      </v-row>
      <v-dialog
        v-model="dialog"
        transition="dialog-top-transition"
        max-width="600"
        v-if="user"
      >
        <div class="card user-card-full">
          <div class="row m-l-0 m-r-0">
            <div class="col-sm-4 bg-c-lite-green user-profile">
              <div class="card-block text-center text-white">
                <div class="m-b-25">
                  <img
                    :src="avatarUser"
                    class="img-radius"
                    alt="User-Profile-Image"
                    height="100px"
                    width="100px"
                  />
                </div>
                <h6 class="f-w-600">
                  {{ user.profile.firstName }} {{ user.profile.lastName }}
                </h6>
                <p>{{ user.team.name }} Team</p>
                <hr />
                <p v-for="role in user.roles" :key="role.id">
                  {{ role.name }}
                </p>
              </div>
            </div>
            <div class="col-sm-8">
              <div class="card-block">
                <h6 class="m-b-20 p-b-5 b-b-default f-w-600">Information</h6>
                <div class="row">
                  <div class="col-sm-8">
                    <p class="m-b-10 f-w-600">Email</p>
                    <h6 class="text-muted f-w-400">{{ user.email }}</h6>
                  </div>
                  <div class="col-sm-4">
                    <p class="m-b-10 f-w-600">Phone</p>
                    <h6 class="text-muted f-w-400">{{ user.phone }}</h6>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-8">
                    <p class="m-b-10 f-w-600">Date of birth</p>
                    <h6 class="text-muted f-w-400">{{ user.profile.dob }}</h6>
                  </div>
                  <div class="col-sm-4">
                    <p class="m-b-10 f-w-600">Gender</p>
                    <h6 class="text-muted f-w-400">
                      {{ user.profile.gender }}
                    </h6>
                  </div>
                </div>
                <h6 class="m-b-20 m-t-40 p-b-5 b-b-default f-w-600">About</h6>
                <div class="row">
                  <div class="col-sm-4">
                    <p class="m-b-10 f-w-600">Status</p>
                    <h6 class="text-muted f-w-400">{{ user.status }}</h6>
                  </div>
                  <div class="col-sm-4">
                    <p class="m-b-10 f-w-600">Start date</p>
                    <h6 class="text-muted f-w-400">{{ user.startDate }}</h6>
                  </div>
                  <div class="col-sm-4">
                    <p class="m-b-10 f-w-600">End date</p>
                    <h6 class="text-muted f-w-400">{{ user.endDate }}</h6>
                  </div>
                </div>
                <ul class="social-link list-unstyled m-t-40 m-b-10">
                  <li>
                    <a
                      href="#!"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title=""
                      data-original-title="facebook"
                      data-abc="true"
                      ><i
                        class="mdi mdi-facebook feather icon-facebook facebook"
                        aria-hidden="true"
                      ></i
                    ></a>
                  </li>
                  <li>
                    <a
                      href="#!"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title=""
                      data-original-title="twitter"
                      data-abc="true"
                      ><i
                        class="mdi mdi-twitter feather icon-twitter twitter"
                        aria-hidden="true"
                      ></i
                    ></a>
                  </li>
                  <li>
                    <a
                      href="#!"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title=""
                      data-original-title="instagram"
                      data-abc="true"
                      ><i
                        class="mdi mdi-instagram feather icon-instagram instagram"
                        aria-hidden="true"
                      ></i
                    ></a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </v-dialog>
    </v-container>
  </v-app>
</template>
<style>
#home {
  background: url("https://appscyclone.com/wp-content/uploads/2020/04/hero-bg-right.png")
    no-repeat fixed center !important;
  background-size: cover !important;
}

.user-card-full {
  overflow: hidden;
}

.card {
  border-radius: 5px;
  -webkit-box-shadow: 0 1px 20px 0 rgba(69, 90, 100, 0.08);
  box-shadow: 0 1px 20px 0 rgba(69, 90, 100, 0.08);
  border: none;
  margin-bottom: 30px;
}

.m-r-0 {
  margin-right: 0px;
}

.m-l-0 {
  margin-left: 0px;
}

.user-card-full .user-profile {
  border-radius: 5px 0 0 5px;
}

.bg-c-lite-green {
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    from(#f29263),
    to(#ee5a6f)
  );
  background: linear-gradient(to right, #ee5a6f, #f29263);
}

.user-profile {
  padding: 20px 0;
}

.card-block {
  padding: 1.25rem;
}

.m-b-25 {
  margin-bottom: 25px;
}

.img-radius {
  border-radius: 10px;
}

h6 {
  font-size: 14px;
}

.card .card-block p {
  line-height: 25px;
}

@media only screen and (min-width: 1400px) {
  p {
    font-size: 14px;
  }
}

.card-block {
  padding: 1.25rem;
}

.b-b-default {
  border-bottom: 1px solid #e0e0e0;
}

.m-b-20 {
  margin-bottom: 20px;
}

.p-b-5 {
  padding-bottom: 5px !important;
}

.card .card-block p {
  line-height: 25px;
}

.m-b-10 {
  margin-bottom: 10px;
}

.text-muted {
  color: #919aa3 !important;
}

.b-b-default {
  border-bottom: 1px solid #e0e0e0;
}

.f-w-600 {
  font-weight: 600;
}

.m-b-20 {
  margin-bottom: 20px;
}

.m-t-40 {
  margin-top: 20px;
}

.p-b-5 {
  padding-bottom: 5px !important;
}

.m-b-10 {
  margin-bottom: 10px;
}

.m-t-40 {
  margin-top: 20px;
}

.user-card-full .social-link li {
  display: inline-block;
}

.user-card-full .social-link li a {
  font-size: 20px;
  margin: 0 10px 0 0;
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
</style>
<script>
import { mapActions, mapState } from "vuex";
import { GENDER, STATUS } from "@/utils/constants";
import { convertKeyName, getKeyByValue } from "@/helper/validation";

export default {
  data: () => ({
    users: [],
    user: null,
    error: null,

    options: {
      page: 1,
    },

    justify: "center",
    key: "",

    dialog: false,
    searching: false,
  }),

  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },

  computed: {
    ...mapState("user/getAll", {
      data: "data",
      loading: "loading",
      getAllError: "error",
      total: "total",
      lastPage: "lastPage",
    }),
    ...mapState("user/get", {
      userDetails: "user",
      getLoading: "loading",
    }),

    avatarUser() {
      return !this.user.imagePath
        ? process.env.BASE_URL + "media/users/default.jpg"
        : process.env.VUE_APP_BASE_API_URL + "/storage/" + this.user.imagePath;
    },
  },

  methods: {
    ...mapActions("user/getAll", ["getAll"]),
    ...mapActions("user/get", ["get"]),

    async getDataFromApi() {
      if (this.key) {
        this.searching = true;
        await this.getAll({
          key: this.key,
          page: this.options.page,
          itemsPerPage: 8,
        });
        this.users = this.data;
        this.error = this.getAllError;
        this.searching = false;
      }
    },

    back() {
      this.users = [];
      this.error = null;
    },

    searchUser() {
      if (this.options.page !== 1) {
        this.options.page = 1;
      }
      this.getDataFromApi();
    },

    async detailUser(item) {
      await this.get(item.id);
      this.user = this.userDetails;

      const gender = this.user.profile.gender;
      const status = this.user.status;
      this.user.profile.gender = convertKeyName(getKeyByValue(GENDER, gender));
      this.user.status = convertKeyName(getKeyByValue(STATUS, status));

      this.dialog = true;
    },

    avatar(item) {
      return !item.imagePath
        ? process.env.BASE_URL + "media/users/default.jpg"
        : process.env.VUE_APP_BASE_API_URL + "/storage/" + item.imagePath;
    },
  },
};
</script>
