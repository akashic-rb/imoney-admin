<template>
  <div>
    <div class="row">
      <div class="col-xl-8">
        <!--begin::Charts Widget 2-->
        <div
          class="
            card card-custom
            bg-gray-100
            gutter-b
            card-stretch card-shadowless
          "
        >
          <!--begin::Header-->
          <div class="card-header h-auto border-0">
            <!--begin::Title-->
            <div class="card-title py-5">
              <h3 class="card-label">
                <span class="d-block text-dark font-weight-bolder"
                  >Tổng người dùng : {{ number }}</span
                >
                <span class="d-block text-dark-50 mt-2 font-size-sm"
                  >Cập nhật: {{ new Date().toISOString().substr(0, 10) }}</span
                >
              </h3>
            </div>
            <v-spacer></v-spacer>
            <!--end::Title-->
          </div>
          <!--end::Header-->
          <!--begin::Body-->
          <div class="card-body">
            <!--begin::Chart-->
            <UserChart
              v-if="loaded"
              :chartData="chartData"
              :options="optionsChart"
            />
            <!--end::Chart-->
          </div>
          <!--end::Body-->
        </div>
        <!--end::Charts Widget 2-->
      </div>
      <div class="col-xl-4">
        <!--begin::List Widget 2-->
        <div
          class="
            card card-custom
            bg-light-success
            gutter-b
            card-stretch card-shadowless
          "
        >
          <!--begin::Header-->
          <div class="card-header border-0">
            <h3 class="card-title font-weight-bolder text-success">
              Số người dùng đã đăng ký : {{ getAllTotal }}
            </h3>
            <div class="card-toolbar">
              <div class="dropdown dropdown-inline">
                <a
                  href="#"
                  class="btn btn-clean btn-hover-success btn-sm btn-icon"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i class="ki ki-bold-more-ver text-success"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-md dropdown-menu-right">
                  <!--begin::Naviigation-->
                  <ul class="navi">
                    <li class="navi-header font-weight-bold py-5">
                      <span class="font-size-lg">Add New:</span>
                      <i
                        class="flaticon2-information icon-md text-muted"
                        data-toggle="tooltip"
                        data-placement="right"
                        title="Click to learn more..."
                      ></i>
                    </li>
                    <li class="navi-separator mb-3 opacity-70"></li>
                    <li class="navi-item">
                      <a href="#" class="navi-link">
                        <span class="navi-icon">
                          <i class="flaticon2-shopping-cart-1"></i>
                        </span>
                        <span class="navi-text">Add new user</span>
                      </a>
                    </li>
                    <li class="navi-item">
                      <a href="#" class="navi-link">
                        <span class="navi-icon">
                          <i class="navi-icon flaticon2-calendar-8"></i>
                        </span>
                        <span class="navi-text">Users</span>
                        <span class="navi-label">
                          <span
                            class="
                              label label-light-danger label-rounded
                              font-weight-bold
                            "
                            >3</span
                          >
                        </span>
                      </a>
                    </li>
                    <li class="navi-separator mt-3 opacity-70"></li>
                    <li class="navi-footer pt-5 pb-4">
                      <a
                        class="btn btn-light-primary font-weight-bolder btn-sm"
                        href="#"
                        >More options</a
                      >
                      <a
                        class="btn btn-clean font-weight-bold btn-sm d-none"
                        href="#"
                        data-toggle="tooltip"
                        data-placement="right"
                        title="Click to learn more..."
                        >Learn more</a
                      >
                    </li>
                  </ul>
                  <!--end::Naviigation-->
                </div>
              </div>
            </div>
          </div>
          <!--end::Header-->
          <!--begin::Body-->
          <div class="card-body pt-2">
            <!--begin::Item-->
            <div
              class="d-flex align-items-center mb-10"
              v-for="item in getAllData"
              :key="item.id"
            >
              <!--begin::Symbol-->
              <div class="symbol symbol-40 symbol-light-white mr-5">
                <div class="symbol-label">
                  <img
                    :src="avatar(item)"
                    class="h-100 align-self-end rounded"
                    alt=""
                  />
                </div>
              </div>
              <!--end::Symbol-->
              <!--begin::Text-->
              <div class="d-flex flex-column font-weight-bold">
                <a
                  @click="detailUser(item)"
                  class="text-dark text-hover-primary mb-1 font-size-lg"
                  >{{ item.name }}</a
                >
              </div>
              <!--end::Text-->
            </div>
            <!--end::Item-->
            <div class="text-center" v-if="lastPage > 1">
              <v-pagination
                v-model="options.page"
                :length="lastPage"
                circle
              ></v-pagination>
            </div>
          </div>
          <!--end::Body-->
        </div>
        <!--end::List Widget 2-->
      </div>
    </div>
    <!--end::Row-->
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import UserChart from "./chart/UserChart";

export default {
  name: "dashboard",
  data: () => ({
    loaded: false,
    chartData: null,
    optionsChart: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },

    options: {
      page: 1,
    },

    role: "",
    number: 0,
  }),
  components: {
    UserChart,
  },

  watch: {
    team: {
      handler() {
        this.setChart();
      },
    },
  },

  mounted() {
    this.setBreadcrumb([{ title: "Tổng quan" }]);
    this.setChart();
    this.getUserEndAtThisMonth();
  },

  computed: {
    ...mapState("user/getAll", {
      getAllLoading: "loading",
      getAllData: "data",
      getAllTotal: "total",
      getAllError: "error",
      lastPage: "lastPage",
    }),
    ...mapState("role/getAll", {
      roles: "rolesList",
    }),
  },

  methods: {
    ...mapActions("breadcrumbs", ["setBreadcrumb"]),
    ...mapActions("role/getAll", ["getAllRoles"]),
    ...mapActions("user/getAll", ["getAll"]),

    async setChart() {
      this.loaded = false;

      const chart = [
        {
          name: "Admin",
          total: 0,
        },
        {
          name: "Premium User",
          total: 0,
        },
        {
          name: "User",
          total: 0,
        },
      ];

      let number = 0;
      this.getAllData.forEach(function (element) {
        number += 1;
        chart.filter((i) =>
          i.name === element.role.name ? (i.total += 1) : i
        );
      });
      this.number = number;

      this.chartData = {
        labels: chart.map((i) => i.name),
        datasets: [
          {
            label: "Số lượng",
            backgroundColor: "#8FD1B7",
            data: chart.map((i) => i.total),
          },
        ],
      };
      this.loaded = true;
    },

    async getUserEndAtThisMonth() {
      await this.getAll({
        end: true,
        page: this.options.page,
        itemsPerPage: 5,
      });
    },

    avatar(item) {
      return !item.imagePath
        ? `https://ui-avatars.com/api/?name=${item.name}`
        : process.env.VUE_APP_BASE_API_URL + "/storage/" + item.imagePath;
    },
  },
};
</script>
