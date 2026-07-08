import jwt from 'jsonwebtoken';

// Runs BEFORE any protected route. Expects the frontend to send:
// Authorization: Bearer <token>
export default function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // jwt.verify checks two things: the signature is valid (so we know
    // WE issued it, not a forger), and it hasn't expired.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user id to the request so every route handler downstream
    // knows WHO is asking — without trusting anything the client claims.
    req.userId = decoded.userId;

    next(); // pass control to the actual route handler
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}