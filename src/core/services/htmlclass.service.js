import objectPath from "object-path";
import store from "@/core/store";

const HtmlClass = {
  config: null,

  init(config) {
    if (typeof config !== "undefined") {
      this.config = config;
    }

    // init base layout
    this.initLayout();

    // init header and subheader menu
    this.initHeader();
    this.initSubheader();

    // init aside and aside menu
    this.initAside();

    // init footer
    this.initFooter();

    // init themes
    this.initThemes();
  },

  /**
   * Init Layout
   */
  initLayout() {
    if (objectPath.has(this.config, "self.body.class")) {
      const _selfBodyClass = objectPath
        .get(this.config, "self.body.class")
        .toString();
      if (_selfBodyClass) {
        const bodyClasses = _selfBodyClass.split(" ");
        bodyClasses.forEach((cssClass) => {
          store.dispatch("htmlClass/addBodyClassName", cssClass);
        });
      }
    }

    const bgImage = objectPath.get(this.config, "self.body.background-image");
    if (typeof bgImage !== "undefined") {
      document.body.style.backgroundImage = `url(${bgImage})`;
    }

    // Offcanvas directions
    store.dispatch("htmlClass/addBodyClassName", "quick-panel-right");
    store.dispatch("htmlClass/addBodyClassName", "demo-panel-right");
    store.dispatch("htmlClass/addBodyClassName", "offcanvas-right");

    // Properly close mobile header menu
    store.dispatch("htmlClass/removeBodyClassName", "header-menu-wrapper-on");
  },

  /**
   * Init Header
   */
  initHeader() {
    // Fixed header
    if (objectPath.get(this.config, "header.self.fixed.desktop")) {
      store.dispatch("htmlClass/addBodyClassName", "header-fixed");
      store.dispatch("htmlClass/addClassName", {
        position: "header",
        className: "header-fixed",
      });
    } else {
      store.dispatch("htmlClass/addBodyClassName", "header-static");
    }

    if (objectPath.get(this.config, "header.self.fixed.mobile")) {
      store.dispatch("htmlClass/addBodyClassName", "header-mobile-fixed");
      store.dispatch("htmlClass/addClassName", {
        position: "header_mobile",
        className: "header-mobile-fixed",
      });
    }

    if (objectPath.get(this.config, "header.menu.self.display")) {
      store.dispatch("htmlClass/addClassName", {
        position: "header_menu",
        className: `header-menu-layout-${objectPath.get(
          this.config,
          "header.menu.self.layout"
        )}`,
      });

      // Menu
      if (objectPath.get(this.config, "header.menu.self.root-arrow")) {
        store.dispatch("htmlClass/addClassName", {
          position: "header_menu",
          className: "header-menu-root-arrow",
        });
      }
    }
  },

  /**
   * Init Subheader
   */
  initSubheader() {
    // Fixed content head
    if (
      objectPath.get(this.config, "subheader.fixed") &&
      objectPath.get(this.config, "header.self.fixed.desktop")
    ) {
      store.dispatch("htmlClass/addBodyClassName", "subheader-fixed");
    }

    if (objectPath.get(this.config, "subheader.display")) {
      store.dispatch("htmlClass/addBodyClassName", "subheader-enabled");
    }

    if (objectPath.has(this.config, "subheader.style")) {
      store.dispatch(
        "htmlClass/addBodyClassName",
        `subheader-${objectPath.get(this.config, "subheader.style")}`
      );
    }
  },

  /**
   * Init Aside
   */
  initAside() {
    // Reset aside class in body
    store.dispatch("htmlClass/removeBodyClassName", "aside-enabled");
    store.dispatch("htmlClass/removeBodyClassName", "aside-fixed");
    store.dispatch("htmlClass/removeBodyClassName", "aside-static");
    store.dispatch("htmlClass/removeBodyClassName", "aside-minimize");

    if (objectPath.get(this.config, "aside.self.display") !== true) {
      return;
    }

    // Add aside class enabled in body
    store.dispatch("htmlClass/addBodyClassName", "aside-enabled");

    // Fixed Aside
    if (objectPath.get(this.config, "aside.self.fixed")) {
      store.dispatch("htmlClass/addBodyClassName", "aside-fixed");
      store.dispatch("htmlClass/addClassName", {
        position: "aside",
        className: "aside-fixed",
      });
    } else {
      store.dispatch("htmlClass/addBodyClassName", "aside-static");
    }

    // Default fixed
    if (objectPath.get(this.config, "aside.self.minimize.default")) {
      store.dispatch("htmlClass/addBodyClassName", "aside-minimize");
    }

    // Dropdown Submenu
    if (objectPath.get(this.config, "aside.menu.dropdown")) {
      store.dispatch("htmlClass/addClassName", {
        position: "aside_menu",
        className: "aside-menu-dropdown",
      });
    }
  },

  /**
   * Init Footer
   */
  initFooter() {
    // Fixed header
    if (objectPath.get(this.config, "footer.fixed")) {
      store.dispatch("htmlClass/addBodyClassName", "footer-fixed");
    }
  },

  /**
   * Import theme SCSS file based on the selected theme
   */
  initThemes() {
    if (objectPath.get(this.config, "header.self.theme")) {
      const theme = objectPath.get(this.config, "header.self.theme");
      import(`@/assets/sass/themes/layout/header/base/${theme}.scss`);
    }

    if (objectPath.get(this.config, "header.menu.desktop.submenu.theme")) {
      const theme = objectPath.get(
        this.config,
        "header.menu.desktop.submenu.theme"
      );
      import(`@/assets/sass/themes/layout/header/menu/${theme}.scss`);
    }

    if (objectPath.get(this.config, "brand.self.theme")) {
      const theme = objectPath.get(this.config, "brand.self.theme");
      import(`@/assets/sass/themes/layout/brand/${theme}.scss`);
    }

    if (objectPath.get(this.config, "aside.self.theme")) {
      const theme = objectPath.get(this.config, "aside.self.theme");
      import(`@/assets/sass/themes/layout/aside/${theme}.scss`);
    }
  },
};

export default HtmlClass;
