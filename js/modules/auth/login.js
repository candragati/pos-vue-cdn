import { router } from "../../router.js";

export default {
  data() {
    return {
      username: "",
      password: "",
      alertMessage: "",
    };
  },
  template: `
    <div class="login-page" style="height:100vh; display:flex; align-items:center; justify-content:center; background: linear-gradient(135deg, #0f4c81 0%, #1e3a8a 60%, #111 100%);">
      <div class="login-card" style="width:min(420px,90%); padding:28px; background: rgba(255,255,255,.95); border-radius:14px; box-shadow:0 20px 40px rgba(0,0,0,.15);">
        <h2 class="login-title" style="text-align:center; margin:0 0 14px; color:#1f2937; font-weight:700;">Login POS</h2>
        <div class="input-group" style="display:flex; flex-direction:column; margin-bottom:12px;">
          <label style="font-size:12px; color:#555; margin-bottom:6px;">Username</label>
          <input v-model="username" placeholder="Username" style="padding:12px 14px; border:1px solid #d1d5db; border-radius:8px; font-size:16px; outline:none;" />
        </div>
        <div class="input-group" style="display:flex; flex-direction:column; margin-bottom:12px;">
          <label style="font-size:12px; color:#555; margin-bottom:6px;">Password</label>
          <input v-model="password" type="password" placeholder="Password" style="padding:12px 14px; border:1px solid #d1d5db; border-radius:8px; font-size:16px; outline:none;" />
        </div>
        <button class="login-btn" @click="login" style="width:100%; padding:12px; border:0; border-radius:8px; font-size:16px; color:white; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); cursor:pointer;">
          Masuk
        </button>
      </div>
      <!-- Popup Alert -->
            <div v-if="alertMessage" class="popup-overlay" @click.self="closeAlert" style="position: fixed; inset: 0; background: rgba(0,0,0,.4); display:flex; align-items:center; justify-content:center; z-index: 9999;">
              <div class="popup-card" style="width: min(420px, 90%); background:white; padding:20px; border-radius:8px; box-shadow:0 10px 25px rgba(0,0,0,.25); text-align:center;">
                <div class="popup-title" style="font-weight:700; margin-bottom:8px;">Peringatan</div>
                <div class="popup-message" style="margin-bottom:12px;">{{ alertMessage }}</div>
                <button class="popup-ok" @click="closeAlert" style="padding:8px 16px; border-radius:6px; border:0; background:#2563eb; color:white; cursor:pointer;">OK</button>
              </div>
            </div>
    </div>
  `,
  methods: {
    login() {
      if (this.username && this.password) {
        router.go("pos");
      } else {
        this.alertMessage = "Masukkan username dan password";
      }
    },
    closeAlert() {
      this.alertMessage = "";
    },
  },
};
