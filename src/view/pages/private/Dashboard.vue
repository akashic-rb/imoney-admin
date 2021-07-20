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
                  >Total Employees : {{ number }}</span
                >
                <span class="d-block text-dark-50 mt-2 font-size-sm">{{
                  new Date().toISOString().substr(0, 10)
                }}</span>
              </h3>
            </div>
            <v-spacer></v-spacer>
            <v-row class="mt-4">
              <v-col md="8"
                ><v-autocomplete
                  v-model="team"
                  outlined
                  auto-select-first
                  chips
                  clearable
                  deletable-chips
                  dense
                  prepend-inner-icon="mdi-filter"
                  placeholder="Filter by team"
                  item-value="id"
                  item-text="name"
                  :items="teamItems"
                ></v-autocomplete></v-col
            ></v-row>
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
              Employees end at this month : {{ getAllTotal }}
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
                    class="h-100 align-self-end rounded-circle"
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
                  >{{ item.profile.firstName }} {{ item.profile.lastName }}</a
                >
                <span class="text-muted">{{ item.status }}</span>
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
import { TEAM } from "@/utils/constants";
import { convertKeyHaveTwoChars } from "@/helper/validation";

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

    team: "",
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
    this.setBreadcrumb([{ title: "Dashboard" }]);
    this.setChart();
    this.getUserEndAtThisMonth();
  },

  computed: {
    ...mapState("user/groupBy", {
      groupByLoading: "loading",
      groupByData: "data",
      groupByError: "error",
    }),
    ...mapState("user/getAll", {
      getAllLoading: "loading",
      getAllData: "data",
      getAllTotal: "total",
      getAllError: "error",
      lastPage: "lastPage",
    }),
    teamItems() {
      return Object.keys(TEAM).map((key) => ({
        id: TEAM[key],
        name: convertKeyHaveTwoChars(key),
      }));
    },
  },

  methods: {
    ...mapActions("breadcrumbs", ["setBreadcrumb"]),
    ...mapActions("user/groupBy", ["groupBy"]),
    ...mapActions("user/getAll", ["getAll"]),

    async setChart() {
      this.loaded = false;
      const column = "status";
      await this.groupBy({
        column: column,
        team: this.team,
      });

      const labels = ["Internship", "Transit", "Probationary", "Official"];
      const total = [0, 0, 0, 0];

      let number = 0;
      this.groupByData.forEach(function (element) {
        total[element.status - 1] = element.total;
        number += element.total;
      });
      this.number = number;

      this.chartData = {
        labels: labels,
        datasets: [
          {
            label: "Status",
            backgroundColor: "#8FD1B7",
            data: total,
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

    detailUser(item) {
      this.$router.push({ name: "userEditing", params: { id: item.id } });
    },

    avatar(item) {
      return !item.imagePath
        ? "https://ui-avatars.com/api/?name=Admin"
        : process.env.VUE_APP_BASE_API_URL + "/storage/" + item.imagePath;
    },
  },
};
</script>
