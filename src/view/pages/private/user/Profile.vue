<template>
  <div class="container emp-profile">
    <form method="post" v-if="user && profile">
      <div class="row">
        <div class="col-md-4">
          <div class="profile-img">
            <img :src="profile.avatar_url" alt="A handsome face of admin" />
            <div class="file btn btn-lg btn-primary">
              Change Photo
              <input type="file" name="file" />
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="profile-head">
            <h5>{{ user.name }}</h5>
            <p class="profile-rating">
              Role :
              <span>{{ user.user_role }}</span>
            </p>
            <br /><br />
            <ul class="nav nav-tabs" id="myTab" role="tablist">
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link active"
                  id="home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#home"
                  role="tab"
                  type="button"
                  aria-controls="home"
                  aria-selected="true"
                >
                  Thông tin
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  id="profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#profile"
                  role="tab"
                  type="button"
                  aria-controls="profile"
                  aria-selected="false"
                >
                  Dòng thời gian
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-8">
          <div class="tab-content profile-tab" id="myTabContent">
            <div
              class="tab-pane fade show active"
              id="home"
              role="tabpanel"
              aria-labelledby="home-tab"
            >
              <div class="row">
                <div class="col-md-6">
                  <label>Tên</label>
                </div>
                <div class="col-md-6">
                  <p>
                    {{ user.name }}
                  </p>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <label>Email</label>
                </div>
                <div class="col-md-6">
                  <p>{{ user.email }}</p>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <label>Điện thoại</label>
                </div>
                <div class="col-md-6">
                  <p>{{ profile.phone }}</p>
                </div>
              </div>
            </div>
            <div
              class="tab-pane fade"
              id="profile"
              role="tabpanel"
              aria-labelledby="profile-tab"
            >
              <div class="row">
                <div class="col">
                  <v-card-text class="py-0">
                    <v-timeline align-top dense>
                      <v-timeline-item color="pink" small>
                        <v-row class="pt-1">
                          <v-col cols="3">
                            <strong>{{ user.created_at }}</strong>
                          </v-col>
                          <v-col>
                            <strong>Tài khoản đã được tạo</strong>
                          </v-col>
                        </v-row>
                      </v-timeline-item>
                    </v-timeline>
                  </v-card-text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
<style>
.emp-profile {
  padding: 3%;
  margin-top: 3%;
  margin-bottom: 3%;
  border-radius: 0.5rem;
  background: #fff;
}
.profile-img {
  text-align: center;
}
.profile-img img {
  width: 60%;
  height: 100%;
}
.profile-img .file {
  position: relative;
  overflow: hidden;
  margin-top: -30%;
  width: 60%;
  border: none;
  border-radius: 0;
  font-size: 15px;
  background: #212529b8;
}
.profile-img .file input {
  position: absolute;
  opacity: 0;
  left: 0;
  top: 0;
}
.profile-head h5 {
  color: #333;
}
.profile-head h6 {
  color: #0062cc;
}
.profile-edit-btn {
  border: none;
  border-radius: 1.5rem;
  width: 70%;
  padding: 2%;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
}
.profile-rating {
  font-size: 12px;
  color: #818182;
  margin-top: 5%;
}
.profile-rating span {
  color: #495057;
  font-size: 15px;
  font-weight: 600;
}
.profile-head .nav-tabs {
  margin-bottom: 5%;
}
.profile-head .nav-tabs .nav-link {
  font-weight: 600;
  border: none;
}
.profile-head .nav-tabs .nav-link.active {
  border: none;
  border-bottom: 2px solid #0062cc;
}
.profile-work {
  padding: 14%;
  margin-top: -15%;
}
.profile-work p {
  font-size: 12px;
  color: #818182;
  font-weight: 600;
  margin-top: 10%;
}
.profile-work a {
  text-decoration: none;
  color: #495057;
  font-weight: 600;
  font-size: 14px;
}
.profile-work ul {
  list-style: none;
}
.profile-tab label {
  font-weight: 600;
}
.profile-tab p {
  font-weight: 600;
  color: #0062cc;
}
</style>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data: () => ({
    data: null,

    gender: null,
  }),

  mounted() {
    this.setBreadcrumb([{ title: "Thông tin tài khoản" }]);
    this.getUserInfor();

    this.initScript();
  },

  computed: {
    ...mapState("account/getInfor", ["user", "loading"]),
    ...mapState("profile/get", {
      error: "error",
      profileLoading: "infoLoading",
      profile: "profile",
    }),

    avatar() {
      return !this.user.imagePath
        ? process.env.BASE_URL + "media/users/default.jpg"
        : process.env.VUE_APP_BASE_API_URL + "/storage/" + this.user.imagePath;
    },
  },

  methods: {
    ...mapActions("breadcrumbs", ["setBreadcrumb"]),
    ...mapActions("account/getInfor", ["getUserInformationLoggedIn"]),
    ...mapActions("profile/get", ["get"]),

    async getUserInfor() {
      this.getUserInformationLoggedIn();
      this.get();
    },

    initScript() {
      let tag = document.createElement("script");
      tag.setAttribute(
        "src",
        "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"
      );
      document.head.appendChild(tag);
    },
  },
};
</script>
