export default {
  data() {
    return {
      cart: [],
      showCart: false,
      products: [
        {
          id: 1,
          name: "Kopi Hitam",
          price: 8000,
          img: "assets/img/product.png",
          category: "minuman",
        },
        {
          id: 2,
          name: "Teh Manis",
          price: 5000,
          img: "assets/img/product.png",
          category: "minuman",
        },
        {
          id: 3,
          name: "Nasi Goreng",
          price: 15000,
          img: "assets/img/product.png",
          category: "makanan",
        },
        {
          id: 4,
          name: "Mie Goreng",
          price: 12000,
          img: "assets/img/product.png",
          category: "makanan",
        },

        // tambahan 15 produk
        {
          id: 5,
          name: "Kopi Susu",
          price: 10000,
          img: "assets/img/product.png",
          category: "minuman",
        },
        {
          id: 6,
          name: "Es Teh Manis",
          price: 6000,
          img: "assets/img/product.png",
          category: "minuman",
        },
        {
          id: 7,
          name: "Es Jeruk",
          price: 7000,
          img: "assets/img/product.png",
          category: "minuman",
        },
        {
          id: 8,
          name: "Nasi Ayam Goreng",
          price: 18000,
          img: "assets/img/product.png",
          category: "makanan",
        },
        {
          id: 9,
          name: "Nasi Ayam Bakar",
          price: 20000,
          img: "assets/img/product.png",
          category: "makanan",
        },
        {
          id: 10,
          name: "Mie Kuah",
          price: 12000,
          img: "assets/img/product.png",
          category: "makanan",
        },
        {
          id: 11,
          name: "Kentang Goreng",
          price: 10000,
          img: "assets/img/product.png",
          category: "snack",
        },
        {
          id: 12,
          name: "Tempe Goreng",
          price: 5000,
          img: "assets/img/product.png",
          category: "snack",
        },
        {
          id: 13,
          name: "Tahu Crispy",
          price: 6000,
          img: "assets/img/product.png",
          category: "snack",
        },
        {
          id: 14,
          name: "Sosis Bakar",
          price: 8000,
          img: "assets/img/product.png",
          category: "snack",
        },
        {
          id: 15,
          name: "Roti Bakar Coklat",
          price: 12000,
          img: "assets/img/product.png",
          category: "snack",
        },
        {
          id: 16,
          name: "Milkshake Coklat",
          price: 14000,
          img: "assets/img/product.png",
          category: "minuman",
        },
        {
          id: 17,
          name: "Jus Alpukat",
          price: 15000,
          img: "assets/img/product.png",
          category: "minuman",
        },
        {
          id: 18,
          name: "Jus Mangga",
          price: 13000,
          img: "assets/img/product.png",
          category: "minuman",
        },
        {
          id: 19,
          name: "Nasi Telur",
          price: 10000,
          img: "assets/img/product.png",
          category: "makanan",
        },
      ],

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
    handleKeyDown(e) {
      if (e.key !== "Escape") return;
      if (this.showReceiptPreview) {
        e.preventDefault();
        this.closeReceiptPreview();
        return;
      }
      if (this.showPaymentModal) {
        e.preventDefault();
        this.closePaymentModal();
        return;
      }
    },
    closeCashModal() {
      this.showpaymentModal = false;
      this.cashReceived = 0;
      this.cashReceivedDisplay = "";
      this.changeAmount = 0;
    },
    onPrintAndFinish() {
      this.resetTransaction();
    },
    resetTransaction() {
      this.closeReceiptPreview();
      this.showReceiptPreview = false;
      this.receiptHtml = "";
      this.cashReceived = 0;
      this.cashReceivedDisplay = "";
      this.changeAmount = 0;
      this.cart = [];
      this.cartTotal = 0;
      this.cartQty = 0;
      this.$nextTick(() => {
        const el = document.getElementById("product-search");
        if (el) el.focus();
      });
    },
    onCashInput(e) {
      const raw = e.target.value.replace(/\D/g, "");
      this.cashReceived = raw ? parseInt(raw) : 0;
      this.cashReceivedDisplay = raw
        ? new Intl.NumberFormat("id-ID").format(this.cashReceived)
        : "";
      this.changeAmount = this.cashReceived - this.cartTotal;
    },
    closeReceiptPreview() {
      this.isReceiptPreviewOpen = false;
    },
    openReceiptPreview() {
      if (this.cashReceived < this.cartTotal) return;
      this.transaction = {
        id: Date.now(),
        date: new Date(),
        items: [...this.cart],
        total: this.cartTotal,
        cash: this.cashReceived,
        change: this.changeAmount,
      };
      this.showPaymentModal = false;
      this.isReceiptPreviewOpen = true;
    },
    openPayment() {
      this.cashReceived = null;
      this.cashReceivedDisplay = "";
      this.showPaymentModal = true;
      this.$nextTick(() => {
        this.$refs.cashInput?.focus();
      });
    },

    closePayment() {
      this.showPaymentModal = false;
    },

    confirmPayment() {
      this.transaction = {
        id: Date.now(),
        date: new Date(),
        items: [...this.cart],
        total: this.cartTotal,
        cash: this.cashReceived,
        change: this.changeAmount,
      };

      this.cart = [];
      this.showPaymentModal = false;
      this.showReceipt = true;
    },

    printReceipt() {
      const receipt = document.getElementById("receipt");

      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";

      document.body.appendChild(iframe);

      const doc = iframe.contentDocument || iframe.contentWindow.document;

      // Build HTML via DOM (NO document.write)
      const html = doc.createElement("html");
      const head = doc.createElement("head");
      const body = doc.createElement("body");

      const style = doc.createElement("style");
      style.textContent = `
        body {
          font-family: monospace;
          font-size: 12px;
          margin: 0;
          padding: 8px;
        }
        .receipt-row {
          display: flex;
          justify-content: space-between;
        }
        .center {
          text-align: center;
        }
        hr {
          border-top: 1px dashed #000;
        }
        button {
          display: none;
        }
      `;

      head.appendChild(style);

      // clone receipt content
      body.innerHTML = receipt.innerHTML;

      html.appendChild(head);
      html.appendChild(body);

      doc.open();
      doc.appendChild(html);
      doc.close();

      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    },
    formatRupiah(val) {
      return val.toLocaleString("id-ID");
    },

    toggleCart() {
      this.showCart = !this.showCart;
    },

    payOrder() {
      if (this.cart.length === 0) return;

      const order = {
        items: this.cart,
        total: this.total,
        time: new Date().toISOString(),
      };

      console.log("ORDER PAID:", order);

      alert("Transaksi berhasil");

      this.cart = [];
    },
    clearSearch() {
      this.searchQuery = "";
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

    formatRupiah(value) {
      return new Intl.NumberFormat("id-ID").format(value);
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
