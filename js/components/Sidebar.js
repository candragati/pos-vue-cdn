import { router } from "../router.js";

export default {
  props: ["visible"],
  template: `
    <div class="sidebar" v-show="visible">
      <h3>POS</h3>

      <button @click="go('pos')">Kasir</button>
      <button disabled>Laporan</button>
      <button disabled>Produk</button>
    </div>
  `,
  methods: {
    go(route) {
      router.go(route);
    },
  },
};
