export function formatPrice(amount) {
  return `Rs ${Number(amount || 0).toLocaleString("en-PK")}`;
}
