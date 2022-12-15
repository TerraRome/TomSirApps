import moment from 'moment'
import {Linking} from 'react-native'
import calculateCart from './calculateCart'

export const whatsappBill = (item: any) => {
  let phoneWithCountryCode = `+62` + item?.whatsapp
  let message = messageBill(item)

  console.log(item)

  Linking.openURL(`https://wa.me/${phoneWithCountryCode}?text=${message}`)
}

const messageBill = (item: any) => {
  let carts =
    item?.transaction_product?.map((e: any) => ({
      cartId: e?.id,
      id: e.product_id,
      qty: e.qty,
      note: e.note,
      transaction_product_id: e?.id,
      addons: e?.addons || [],
      name: e.product.name,
      description: e.product.description,
      addon_category: e.product.addon_category,
      ingredient: e.product.ingredient,
      product: e.product,
      image: e.product.image,
      price: e.product.price,
      disc: e.product.disc,
      is_disc_percentage: e.product.is_disc_percentage,
    })) || []

  const calculate = calculateCart(carts)
  const subTotalMinusDiscount = calculate.subtotal - calculate.discount
  const subTotalPlusTax = subTotalMinusDiscount + item.total_tax
  const total = subTotalMinusDiscount + subTotalPlusTax

  let productDetail = () => {
    const message = carts.map((e: any) => {
      const totalPriceAddons = e.addons.reduce(
        (acc: number, curr: any) => acc + parseFloat(curr.price),
        0,
      )
      const totalRealPriceItem = parseFloat(e.price + totalPriceAddons) * e?.qty
      const nominalDiscount = e?.is_disc_percentage
        ? (parseFloat(e?.price) * e?.disc) / 100
        : parseFloat(e?.disc)
      const discountPrice = totalRealPriceItem - nominalDiscount * e?.qty
      const message = `✅ ${e?.qty} ${e?.name} @ Rp${e?.product?.price}
Total: Rp${discountPrice}
`

      return message
    })

    return message
  }

  let msg = `FAKTUR ELEKTRONIK
Dr.Clean laundry
Raya Darmo Baru Barat no 54
${item?.whatsapp}

Pelanggan Yth,
Pak ${item?.note} 

Nomor Nota:
${item?.code}

Tanggal:
${moment(item?.createdAt).format('DD MMM YYYY HH:mm')}

=================
Detail pesanan:
${productDetail()}
=================
Detail biaya :
Total tagihan : Rp${subTotalMinusDiscount},-
Pajak(${item?.tax_percentage}%) : Rp${item?.total_tax}
Grand total : Rp${item?.total_price},-
💵 ${item?.payment_type}  : Rp${item?.total_pay},-
${item?.payment_return > 0 ? 'Kembalian : Rp' + item?.payment_return : ''}

Status: Lunas`

  return msg
}
