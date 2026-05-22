const https = require('https');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let googlePublicKeys = null;
let keysExpiryTime = 0;

// Resilient, high-performance cached retriever for Google public signing certificates
const fetchGooglePublicKeys = () => {
  return new Promise((resolve, reject) => {
    if (googlePublicKeys && Date.now() < keysExpiryTime) {
      return resolve(googlePublicKeys);
    }

    https.get('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com', (res) => {
      let data = '';
      
      const cacheControl = res.headers['cache-control'];
      if (cacheControl) {
        const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
        if (maxAgeMatch) {
          keysExpiryTime = Date.now() + parseInt(maxAgeMatch[1], 10) * 1000;
        }
      }

      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          googlePublicKeys = JSON.parse(data);
          resolve(googlePublicKeys);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

// Decodes and validates the Firebase ID token signature, issuer, and expiry
const verifyFirebaseToken = async (token) => {
  const decodedToken = jwt.decode(token, { complete: true });
  if (!decodedToken || !decodedToken.header || !decodedToken.header.kid) {
    throw new Error('Invalid token structure');
  }

  const kid = decodedToken.header.kid;
  const publicKeys = await fetchGooglePublicKeys();
  const publicKeyPem = publicKeys[kid];

  if (!publicKeyPem) {
    throw new Error('Public key not found for key identifier');
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || 'lenovo-monitor-store';
  const options = {
    algorithms: ['RS256'],
    audience: projectId,
    issuer: `https://securetoken.google.com/${projectId}`
  };

  return jwt.verify(token, publicKeyPem, options);
};

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Try Firebase Token verification first
      try {
        const decodedFirebaseUser = await verifyFirebaseToken(token);
        const email = decodedFirebaseUser.email;
        
        let user = await User.findOne({ email });
        if (!user) {
          // Dynamic hydration: Automatically register authenticated Firebase users in the local database
          user = await User.create({
            name: decodedFirebaseUser.name || email.split('@')[0],
            email: email,
            password: 'firebase_authenticated_admin' 
          });
        }
        
        req.user = user;
        return next();
      } catch (firebaseErr) {
        // Fallback to local custom JWT validation in case of test tools/legacy login sessions
        try {
          const decodedLocal = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey_change_in_production');
          req.user = await User.findById(decodedLocal.id).select('-password');
          if (req.user) {
            return next();
          }
        } catch (localErr) {
          console.error('Auth Fallback failure:', localErr.message);
        }
        
        console.error('Firebase Auth error:', firebaseErr.message);
        return res.status(401).json({ message: 'Not authorized, token validation failed' });
      }
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, server authentication error' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no bearer authorization token found' });
  }
};

module.exports = { protect };
