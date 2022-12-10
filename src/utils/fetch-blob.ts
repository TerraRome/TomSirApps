import RNFetchBlob from 'rn-fetch-blob'
const fs = RNFetchBlob.fs

export const fetchBase64 = (uri: string) => {
  let imagePath: any = null
  return new Promise((resolve, reject) => {
    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', uri)
      .then(resp => {
        imagePath = resp.path()
        return resp.readFile('base64')
      })
      .then(async base64Data => {
        await fs.unlink(imagePath)
        resolve(base64Data)
      })
  })
}

const getFileExtention = (fileUrl: string) =>
  /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined

export const downloadFile = (uri: string, filename: string) =>
  new Promise((resolve, reject) => {
    let date = new Date()
    let FILE_URL = uri
    // console.log(FILE_URL)

    let file_ext = getFileExtention(FILE_URL)
    // @ts-ignore
    file_ext = '.' + file_ext[0]
    let RootDir = fs.dirs.DownloadDir
    let name = filename
      ? filename
      : Math.floor(date.getTime() + date.getSeconds() / 2)
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path: RootDir + '/' + name + file_ext,
        description: 'downloading file...',
        notification: true,
        useDownloadManager: true,
      },
    }
    RNFetchBlob.config(options)
      .fetch('GET', FILE_URL)
      .then(resolve)
      .catch(reject)
  })
