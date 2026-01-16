export default {
  props: {
    time: String,
    date: String,
    cashier: String,
    showSidebar: Boolean,
  },

  emits: ["toggle-sidebar", "logout"],

  template: `
    <div class="app-header">
      <div class="header-left">
        <button
          class="sidebar-toggle"
          @click="$emit('toggle-sidebar')"
        >
          ☰
        </button>

        <span class="app-title">POS KASIR</span>
      </div>

      <div class="header-center">
        <span class="shift-label">Shift Aktif</span>
      </div>

      <div class="header-right">
        <div class="datetime">
          <div class="clock">{{ time }}</div>
          <div class="clock">{{ date }}</div>
        </div>

        <span class="cashier">{{ cashier }}</span>

        <button class="logout-btn" @click="$emit('logout')">
          Logout
        </button>
      </div>
    </div>
  `,
};
