const excel_controller = require("../controller/read-up-download_fileController")
const router = require('express').Router()
const multer = require('multer')
const path = require('path')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Upload')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

//multer upload

const upload = multer({
  storage: storage
})
router.post(
  '/readExcelData',
  upload.single('path'),excel_controller.read
  
)
router.get('/downloadPdfFileData', excel_controller.DownloadPDFfile)

module.exports = router
