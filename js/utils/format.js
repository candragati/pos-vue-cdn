export function formatRupiah(val) {
  return new Intl.NumberFormat("id-ID").format(val);
}
