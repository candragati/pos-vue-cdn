import { useProducts } from "../produk/produk.js";
import { formatRupiah } from "../../utils/format.js";
import { printReceipt } from "../../utils/printer.js";
import { usePayment } from "../transaksi/transaksi.js";
export default {
  data() {
    const { products } = useProducts();
    return {
      products,
      formatRupiah,
      printReceipt,

      cart: [],
      showCart: false,

      activeCategory: "all",
      searchQuery: "",
      // pembayaran
      showPaymentModal: false,
      showReceipt: false,
      cashReceived: null,
      cashReceivedDisplay: "",
      isReceiptPreviewOpen: false,

      transaction: {
        id: null,
        date: null,
        items: [],
        total: 0,
        cash: 0,
        change: 0,
      },
    };
  },

  computed: {
    cartTotal() {
      return this.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    },
    changeAmount() {
      if (!this.cashReceived) return 0;
      return this.cashReceived >= this.cartTotal
        ? this.cashReceived - this.cartTotal
        : 0;
    },

    total() {
      return this.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    },

    filteredProducts() {
      let list = this.products;

      if (this.activeCategory !== "all") {
        list = list.filter((p) => p.category === this.activeCategory);
      }

      if (this.searchQuery.trim() !== "") {
        const q = this.searchQuery.toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(q));
      }

      return list;
    },
  },

  mounted() {
    window.addEventListener("keydown", this.handleKeyDown);
  },

  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  },

  methods: {
    ...usePayment(),
    handleKeyDown(e) {
      if (e.key !== "Escape") return;
      if (this.isReceiptPreviewOpen) {
        e.preventDefault();
        this.closeReceiptPreview();
        return;
      }
      if (this.showPaymentModal) {
        e.preventDefault();
        this.closePayment();
        return;
      }
    },

    addToCart(product) {
      const item = this.cart.find((i) => i.id === product.id);
      if (item) {
        item.qty++;
      } else {
        this.cart.push({ ...product, qty: 1 });
      }
    },

    incQty(item) {
      item.qty++;
    },

    decQty(item) {
      item.qty--;
      if (item.qty <= 0) {
        this.cart = this.cart.filter((i) => i.id !== item.id);
      }
    },
  },

  template: `
    <div class="pos-layout">
      <!-- LEFT -->
      <div class="pos-products">
        <div class="product-header">
          <div class="pos-search">
          <input
            class="product-search"
            type="text"
            placeholder="Cari produk..."
            v-model="searchQuery"
          />
          <button
            v-if="searchQuery"
            class="btn-clear"
            @click="clearSearch"
            title="Clear"
          >
            ✕
          </button>
          </div>

          <div class="category-bar">
            <button
              :class="{ active: activeCategory === 'all' }"
              @click="activeCategory = 'all'"
            >Semua</button>

            <button
              :class="{ active: activeCategory === 'makanan' }"
              @click="activeCategory = 'makanan'"
            >Makanan</button>

            <button
              :class="{ active: activeCategory === 'minuman' }"
              @click="activeCategory = 'minuman'"
            >Minuman</button>

            <button
              :class="{ active: activeCategory === 'snack' }"
              @click="activeCategory = 'snack'"
            >Snack</button>


          </div>
        </div>

        <div class="product-grid">
          <div
            v-for="p in filteredProducts"
            :key="p.id"
            class="product-card"
            @click="addToCart(p)"
          >
            <img :src="p.img" class="product-img" />
            <div class="product-name">{{ p.name }}</div>
            <div class="product-price">
              Rp {{ formatRupiah(p.price) }}
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT -->
      <div
        v-if="showCart"
        class="cart-backdrop"
        @click="showCart = false"
      ></div>

      <div class="pos-cart" :class="{open: showCart}">

        <h3>Pesanan</h3>
        <div class="cart-panel">

          <!-- SCROLL AREA -->
          <div class="cart-items">
            <div
              v-for="item in cart"
              :key="item.id"
              class="cart-item"
            >
              <div>
                {{ item.name }}
                <div class="cart-controls">
                  <button @click="decQty(item)">−</button>
                  <span class="cart-qty">{{ item.qty }}</span>
                  <button @click="incQty(item)">+</button>
                </div>
              </div>

              <div>
                Rp {{ formatRupiah(item.price * item.qty) }}
              </div>
            </div>
          </div>

          <!-- STICKY FOOTER -->
          <div class="cart-footer">
            <div class="cart-total">
              <span>Total</span>
              <strong>{{ formatRupiah(total) }}</strong>
            </div>

            <button
              class="btn-pay"
              :disabled="cart.length === 0"
              @click="openPayment"
            >
              BAYAR
            </button>
          </div>

        </div>

      </div>

      <button class="cart-toggle" @click="toggleCart" v-show="!showCart">
        🛒 ({{ cart.length }}::{{formatRupiah(total)}})
      </button>

    </div>

    <div v-if="showPaymentModal" class="modal-overlay">
      <div class="modal">

        <h3>Pembayaran Tunai</h3>

        <div class="row">
          <span>Total</span>
          <strong>Rp {{ formatRupiah(cartTotal) }}</strong>
        </div>

        <div class="row">
          <label>Uang diterima</label>
          <input
          ref="cashInput"
          type="text"
          inputmode = "numeric"
          :value="cashReceivedDisplay"
                 placeholder="0"
                 @input="onCashInput"
                 @keyup.enter="openReceiptPreview"
                 />
        </div>

        <div class="row">
          <span>Kembalian</span>
          <strong>Rp {{ formatRupiah(changeAmount) }}</strong>
        </div>

        <div class="actions">
          <button @click="closePayment">Batal</button>
          <button @click="confirmPayment"
                  :disabled="cashReceived < cartTotal">
            Selesaikan & Cetak
          </button>
        </div>

      </div>
    </div>
    <div v-if="isReceiptPreviewOpen" class="modal-overlay">
      <div class="modal receipt-preview">

        <h4 class="center">Preview Struk</h4>

        <div id="receipt">
          <p class="center">TOKO POS VUE</p>
          <p class="center">{{ transaction.date.toLocaleString() }}</p>

          <hr>

          <div v-for="item in transaction.items"
               class="receipt-row">
            <span>{{ item.name }} x{{ item.qty }}</span>
            <span>{{ formatRupiah(item.price * item.qty) }}</span>
          </div>

          <hr>

          <div class="receipt-row">
            <strong>Total</strong>
            <strong>{{ formatRupiah(transaction.total) }}</strong>
          </div>
          <div class="receipt-row">
            <span>Tunai</span>
            <span>{{ formatRupiah(transaction.cash) }}</span>
          </div>
          <div class="receipt-row">
            <span>Kembali</span>
            <span>{{ formatRupiah(transaction.change) }}</span>
          </div>

          <hr>

          <p class="center">Terima kasih 🙏</p>
        </div>

        <div class="actions">
          <button @click="onPrintAndFinish">Close</button>
          <button @click="printReceipt">Cetak</button>
        </div>

      </div>
    </div>



  `,
};
