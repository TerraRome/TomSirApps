//@ts-ignore
import {BluetoothEscposPrinter} from 'react-native-bluetooth-escpos-printer'
import calculateCart from 'utils/calculateCart'
import {convertToRupiah} from 'utils/convertRupiah'
import {formatDate} from 'utils/formatDate'

export const printBill = (item: any) => {
  return new Promise(async (resolve, reject) => {
    const options = {
      // encoding: 'GBK',
      // codepage: 0,
      // widthtimes: 2,
      // heigthtimes: 1,
      // fonttype: 0,
    }
    const dashSeparator = '--------------------------------\n\r'
    const columnWidths = [16, 16]
    try {
      await BluetoothEscposPrinter.openDrawer(0, 250, 250)
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.setBlob(0)
      if (item?.logo) {
        await BluetoothEscposPrinter.printPic(item.logo, {
          width: 150,
          left: 110,
        })
      }
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printText(
        `${item.merchant.name}\n\r`,
        options,
      )
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printText(
        `${item.merchant.address}\n\r`,
        options,
      )
      await BluetoothEscposPrinter.printText(
        `${item.merchant.phone_number}\n\r`,
        options,
      )
      // await BluetoothEscposPrinter.printText('pos-raidisolution\n\r', options)
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.LEFT,
      )
      await BluetoothEscposPrinter.printText(dashSeparator, {})
      const createdAt = formatDate(item.createdAt)
      await BluetoothEscposPrinter.printColumn(
        columnWidths,
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        [createdAt.date, createdAt.time],
        options,
      )
      await BluetoothEscposPrinter.printColumn(
        columnWidths,
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Transaksi', item.code],
        options,
      )
      if (item.status === 'hold') {
        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          ['Pesanan', item.note],
          options,
        )
      }
      await BluetoothEscposPrinter.printText(dashSeparator, {})
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      const type = item.type === 'dine_in' ? 'Dine in' : 'Take away'
      await BluetoothEscposPrinter.printText(type + '\n', options)
      if (item?.note && item.status !== 'hold') {
        await BluetoothEscposPrinter.printText(item.note + '\n', options)
      }
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.LEFT,
      )
      await item.transaction_product.reduce(
        (p: any, x: any) =>
          p.then(() => {
            return new Promise(async resolve => {
              await BluetoothEscposPrinter.printText(
                x.product.name.substr(0, 31) + '\n',
                options,
              )
              await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                [
                  `${x.qty}x Rp ${convertToRupiah(x.sub_total / x.qty)}`,
                  `Rp ${convertToRupiah(x.sub_total)}`,
                ],
                options,
              )
              if (x?.addons?.length > 0) {
                const addons = x.addons
                  .map((a: any, i: any) => a.name)
                  .join(', ')
                await BluetoothEscposPrinter.printText(
                  'Addons: ' + addons + '\n',
                  options,
                )
              }
              if (x.note) {
                await BluetoothEscposPrinter.printText(
                  'Notes: ' + x.note + '\n',
                  options,
                )
              }
              resolve('ok')
            })
          }),
        Promise.resolve(),
      )
      await BluetoothEscposPrinter.printText(dashSeparator, {})
      const calculate = calculateCart(
        item.transaction_product.map((e: any) => ({...e, ...e.product})),
      )
      if (item.status !== 'hold') {
        if (calculate.discountNominal) {
          await BluetoothEscposPrinter.printColumn(
            columnWidths,
            [
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            ['Diskon', `Rp ${convertToRupiah(calculate.discountNominal)}`],
            options,
          )
        }
        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            'Pajak',
            `(${item.tax_percentage}%)  Rp ${convertToRupiah(item.total_tax)}`,
          ],
          options,
        )
      }
      await BluetoothEscposPrinter.printColumn(
        columnWidths,
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Total', `Rp ${convertToRupiah(item.total_price)}`],
        options,
      )
      if (item.status !== 'hold') {
        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          ['TUNAI', `Rp ${convertToRupiah(item.total_pay)}`],
          options,
        )
      }
      await BluetoothEscposPrinter.printText(dashSeparator, {})
      if (item.status !== 'hold') {
        if (item?.payment_return) {
          await BluetoothEscposPrinter.printColumn(
            columnWidths,
            [
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            ['Kembalian', `Rp ${convertToRupiah(item.payment_return)}`],
            options,
          )
          await BluetoothEscposPrinter.printText(dashSeparator, {})
        }
      }
      if (item.merchant?.footer_note) {
        await BluetoothEscposPrinter.printerAlign(
          BluetoothEscposPrinter.ALIGN.CENTER,
        )
        await BluetoothEscposPrinter.printText(
          `${item.merchant?.footer_note}\n\r`,
          options,
        )
      }
      if (item.status === 'hold') {
        await BluetoothEscposPrinter.printerAlign(
          BluetoothEscposPrinter.ALIGN.CENTER,
        )
        await BluetoothEscposPrinter.printText(
          'Struk Tagihan - Belum Lunas\n\r',
          options,
        )
      }
      await BluetoothEscposPrinter.printText('\n\r', options)
      await BluetoothEscposPrinter.printText('\n\r', options)
      resolve(true)
    } catch (error) {
      reject(error)
    }
  })
}
