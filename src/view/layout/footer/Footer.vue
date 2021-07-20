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
        <a
          href="https://appscyclone.com/"
          target="_blank"
          class="text-dark-75 text-hover-primary"
        >
          Appscyclone
        </a>
      </div>
      <div class="nav nav-dark">
        <a
          href="https://appscyclone.com/aboutus/"
          target="_blank"
          class="nav-link pr-3 pl-0"
        >
          About
        </a>
        <a
          href="https://appscyclone.com/services/"
          target="_blank"
          class="nav-link px-3"
        >
          Services
        </a>
        <a
          href="https://appscyclone.com/contact/"
          target="_blank"
          class="nav-link pl-3 pr-0"
        >
          Contact
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
