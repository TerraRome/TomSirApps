export function convertToRupiah(angka: string | number) {
  var rupiah = ''
  var angkarev = parseInt(angka.toString(), 0).toString().split('').reverse().join('')
  for (var i = 0; i < angkarev.length; i++) {
    if (i % 3 == 0) {
      rupiah += angkarev.substr(i, 3) + '.'
    }
  }
  return rupiah
    .split('', rupiah.length - 1)
    .reverse()
    .join('')
}

export function convertToAngka(rupiah: string | number) {
  return parseInt(rupiah.toString().replace(/,.*|[^0-9]/g, ''), 10)
}

export const moneyFormat = (num = '') => {
  return (
    String(num)
      .replace(/\D*/g, '')
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') || ''
  )
}
