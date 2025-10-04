import multer from "multer"
import path from "path"
// const paths = path.join(process.cwd(),'/img')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img')
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`)
  }
})

export const upload = multer({ storage: storage })

