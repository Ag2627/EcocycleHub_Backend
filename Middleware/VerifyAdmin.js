// middleware/verifyAdmin.js
import jwt from 'jsonwebtoken'

const VerifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - no token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied - not an admin' })
    }

    req.user = decoded // attach user info to request object
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized - invalid or expired token' })
  }
}

export default VerifyAdmin;

