<template>
  <v-card height="100%">
    <v-card-title
      >Choose file to import (Except : <i>.xls, .xlxs, .csv</i> )</v-card-title
    >
    <v-card-actions>
      <v-row>
        <v-col md="4">
          <v-file-input
            truncate-length="20"
            accept=".xlsx, .xls, .csv"
            @change="onFileChange"
            :disabled="uploading"
          ></v-file-input>
        </v-col>
        <v-col md="8"
          ><v-btn class="mt-2" @click="importDataUser" :disabled="uploading"
            >Import</v-btn
          ></v-col
        >
      </v-row>
    </v-card-actions>
    <v-card-text>
      <v-progress-linear
        indeterminate
        color="teal"
        v-show="uploading"
      ></v-progress-linear>
      <v-alert type="success" v-if="message" dismissible>
        {{ message.success }}
      </v-alert>
      <v-alert type="error" v-if="error" dismissible>
        {{ error }}
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data: () => ({
    file: null,
    uploading: false,
    success: false,
  }),

  mounted() {
    this.setBreadcrumb([
      { title: "Import", route: "userData" },
      { title: "User" },
    ]);
  },

  computed: {
    ...mapState("user/importData", ["error", "loading", "message"]),
  },

  methods: {
    ...mapActions("breadcrumbs", ["setBreadcrumb"]),
    ...mapActions("user/importData", ["importData"]),

    onFileChange(e) {
      this.file = e;
    },

    async importDataUser() {
      this.uploading = true;
      const formData = new FormData();
      formData.append("file", this.file);
      const isSucceeded = await this.importData(formData);
      if (isSucceeded) {
        this.success = true;
      }
      this.uploading = false;
    },
  },
};
</script>
