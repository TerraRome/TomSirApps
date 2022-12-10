import {Alert, Linking, Platform} from 'react-native'

export const whatsappBill = (item: any) => {
  let msg = `FAKTUR ELEKTRONIK
              Dr.Clean laundry
              Raya Darmo Baru Barat no 54
              6281336832016

              Pelanggan Yth,
              pak rintis

              Nomor Nota:
              DCLN221128131416442

              Terima:
              28/11/2022 13:14
              Selesai:
              29/11/2022 13:14

              =================
              Detail pesanan:
              ✅ 1 Paket Cuci Kering Setrika/ 3kg @ Rp25.000,-
              Total: Rp25.000,-
              Ket: 18pcs 2.5kg
              =================
              Detail biaya :
              Total tagihan : Rp25.000,-
              Grand total : Rp25.000,-
              💵 DEBIT Rp25.000,-

              Status: Lunas
              =================
              Syarat & ketentuan:
              PERHATIAN :
              1. Pengambilan barang harap disertai nota
              2. Barang yang tidak diambil selama 1 bulan, hilang / rusak tidak diganti
              3. Barang hilang/rusak karena proses pengerjaan diganti maksimal 3x biaya.
              4. Klaim luntur tidak dipisah diluar tanggungan
              5. Hak klaim berlaku 2 jam setelah barang diambil
              6. Setiap konsumen dianggap setuju dengan isi perhitungan tersebut diatas
              =================================

              http://kertas.online/nota/n/DCLN221128131416442

              Terima kasih`
  let phoneWithCountryCode = item?.whatsapp

  let mobile =
    Platform.OS == 'ios' ? phoneWithCountryCode : '+62' + phoneWithCountryCode
  if (mobile) {
    if (msg) {
      let url = 'https://wa.me/085156247366?text=halo'
      Linking.openURL(url)
        .then(data => {
          console.log('WhatsApp Opened')
        })
        .catch(error => {
          console.log(error)
          Alert.alert('Make sure WhatsApp installed on your device')
        })
    } else {
      Alert.alert('Please insert message to send')
    }
  } else {
    Alert.alert('Please insert mobile no')
  }
}
