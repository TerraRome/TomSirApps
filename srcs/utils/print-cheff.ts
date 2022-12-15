//@ts-ignore
import {BluetoothEscposPrinter} from 'react-native-bluetooth-escpos-printer'
import {formatDate} from '@utils/formatDate'

export const printCheff = (item: any) => {
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
          [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
          ['Pesanan', item.note],
          options,
        )
      }
      await BluetoothEscposPrinter.printText(dashSeparator, {})
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
      const type = item.type === 'dine_in' ? 'Dine in' : 'Take away'
      await BluetoothEscposPrinter.printText(type + '\n', options)
      if (item?.note) {
        await BluetoothEscposPrinter.printText(item.note + '\n', options)
      }
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT)
      await item.transaction_product.reduce(
        (p: any, x: any) =>
          p.then(() => {
            return new Promise(async resolve => {
              await BluetoothEscposPrinter.printText(`${x.qty}x ` + x.product.name.substr(0, 31) + '\n', options)
              if (x?.addons?.length > 0) {
                const addons = x.addons.map((a: any, i: any) => a.name).join(', ')
                await BluetoothEscposPrinter.printText('Addons: ' + addons + '\n', options)
              }
              if (x.note) {
                await BluetoothEscposPrinter.printText('Notes: ' + x.note + '\n', options)
              }
              await BluetoothEscposPrinter.printText('\n\r', options)
              resolve('ok')
            })
          }),
        Promise.resolve(),
      )
      await BluetoothEscposPrinter.printText(dashSeparator, {})
      await BluetoothEscposPrinter.printText('\n\r', options)
      await BluetoothEscposPrinter.printText('\n\r', options)
      resolve(true)
    } catch (error) {
      reject(error)
    }
  })
}
