const calculateCart = (carts: any[]) => {
  const defaults = {
    qty: 0,
    subtotal: 0,
    discount: 0,
    discountNominal: 0,
    totalAddons: 0,
  }
  if (!carts) {
    return defaults
  }
  return carts?.reduce((acc: any, curr: any) => {
    const discountNominal = curr?.is_disc_percentage ? (parseFloat(curr?.price) * curr?.disc) / 100 : curr?.disc
    const totalAddons = curr?.addons?.reduce(
      (addonAcc: any, addonCurr: any) => addonAcc + parseFloat(addonCurr.price),
      0,
    )
    return {
      qty: curr?.qty + acc.qty,
      discount: discountNominal * curr?.qty + acc.discount,
      discountNominal: discountNominal + acc.discountNominal,
      totalAddons: totalAddons + acc.totalAddons,
      subtotal: (parseFloat(curr.price) + totalAddons) * curr.qty + acc.subtotal,
    }
  }, defaults)
}

export default calculateCart
