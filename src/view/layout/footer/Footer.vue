<template>
  <!-- begin:: Footer -->
  <div class="footer bg-white py-4 d-flex flex-lg-column" id="kt_footer">
    <div
      class="d-flex align-items-center justify-content-between"
      v-bind:class="{ 'container-fluid': widthFluid, container: !widthFluid }"
    >
      <div class="text-dark">
        <span class="text-muted font-weight-bold mr-2">
          2021 &nbsp;&copy;&nbsp;
        </span>
        <a href="/" target="_blank" class="text-dark-75 text-hover-primary">
          iMoney
        </a>
      </div>
      <div class="nav nav-dark">
        <a href="/about-us/" target="_blank" class="nav-link pr-3 pl-0">
          About
        </a>
        <a href="/services" target="_blank" class="nav-link px-3"> Dịch vụ </a>
        <a
          href="/terms-and-policies"
          target="_blank"
          class="nav-link pl-3 pr-0"
        >
          Điều khoản và chính sách
        </a>
      </div>
    </div>
  </div>
  <!-- end:: Footer -->
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "KTFooter",
  computed: {
    ...mapGetters("config", ["layoutConfig"]),

    /**
     * Check if footer container is fluid
     */
    widthFluid() {
      return this.layoutConfig("footer.width") === "fluid";
    },
  },
};
</script>
