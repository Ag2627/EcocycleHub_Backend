import express from 'express'
import multer from 'multer'
import upload from '../config/cloudinary.js'
import VerifyAdmin from '../Middleware/VerifyAdmin.js'

const upld = multer({ upload })
const UploadRouter = express.Router()

UploadRouter.post('/image',VerifyAdmin, upld.single('image'), (req, res) => {
  try {
    res.status(200).json({ imageUrl: req.file.path }) // cloudinary image URL
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' })
  }
})

export default UploadRouter;
