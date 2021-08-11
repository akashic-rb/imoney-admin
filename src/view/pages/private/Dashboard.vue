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
                  >Tổng người dùng : {{ getAllData.length }}</span
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
          <div class="card-header h-auto border-0">
            <div class="py-5">
              <h3 class="card-label">
                <span class="d-block font-weight-bolder text-success">
                  Số người dùng đã đăng ký : {{ premiumUsers.length }}
                </span>
                <span class="d-block text-dark-50 mt-2 font-size-sm">
                  Cập nhật: {{ new Date().toISOString().substr(0, 10) }}
                </span>
              </h3>
            </div>
          </div>
          <!--end::Header-->
          <!--begin::Body-->
          <div class="card-body pt-2">
            <!--begin::Item-->
            <div
              class="d-flex align-items-center mb-10"
              v-for="item in premiumUsers"
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
    premiumUsers: [],
  }),
  components: {
    UserChart,
  },

  mounted() {
    this.setBreadcrumb([{ title: "Tổng quan" }]);
    this.setChart();
    this.getPremiumUser();
  },

  computed: {
    ...mapState("user/getAll", {
      getAllLoading: "loading",
      getAllData: "data",
      getAllError: "error",
    }),
  },

  methods: {
    ...mapActions("breadcrumbs", ["setBreadcrumb"]),
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
      await this.getAll();
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

    async getPremiumUser() {
      await this.getAll();
      this.premiumUsers = this.getAllData.filter(
        (item) => item.role.name === "Premium User"
      );
    },

    avatar(item) {
      return !item.imagePath
        ? `https://ui-avatars.com/api/?name=${item.name}`
        : process.env.VUE_APP_BASE_API_URL + "/storage/" + item.imagePath;
    },
  },
};
</script>
