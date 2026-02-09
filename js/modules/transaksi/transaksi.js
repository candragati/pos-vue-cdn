export function usePayment() {
  return {
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
      this.cashReceived = null;
      this.cashReceivedDisplay = "";
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
  };
}
