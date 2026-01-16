// import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js"; // prod build
import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
import { router } from "./router.js";
import Sidebar from "./components/Sidebar.js";
import Topbar from "./components/Topbar.js";

const App = {
  components: { Sidebar, Topbar },

  data() {
    return {
      showSidebar: false,
      cashier: "John Doe",
      time: "",
      date: "",
    };
  },

  mounted() {
    this.updateDateTime();
    setInterval(this.updateDateTime, 1000);
  },

  computed: {
    view() {
      return router.currentView();
    },
    isLogin() {
      return router.isLogin();
    },
  },

  methods: {
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },
    updateDateTime() {
      const now = new Date();
      this.time = now.toLocaleTimeString("id-ID");
      this.date = now.toLocaleDateString("id-ID", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    },
    logout() {
      this.showSidebar = false;
      router.logout();
    },
  },

  template: `
    <!-- LOGIN LAYOUT -->
    <component
      v-if="isLogin"
      :is="view"
    ></component>

    <!-- APP LAYOUT -->
    <div v-else class="app-layout">
      <Topbar
      :time="time"
      :date="date"
      :cashier="cashier"
      :showSidebar="showSidebar"
      @toggle-sidebar="toggleSidebar"
      @logout="logout"
      />

      <!-- BODY -->
      <div class="app-body">
        <Sidebar :visible="showSidebar" />

        <div class="app-content">
          <component :is="view"></component>
        </div>
      </div>
    </div>

  `,
};

createApp(App).mount("#app");
