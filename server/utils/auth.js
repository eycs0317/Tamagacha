const jwt = require('jsonwebtoken');

const secret = 'mysecretssshhhhhhh';
const expiration = '2h';

function authMiddleware (req, res, next) {
  // allows token to be sent via req.body, req.query, or headers
  let token = req.body.token || req.query.token || req.headers.authorization;

  // We split the token string into an array and return actual token
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return res.status(400).json({message: 'You have no token!'});
  }

  // if token can be verified, add the decoded user's data to the request so it can be accessed in the resolver
  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data;
  } catch {
    console.log('Invalid token');
  // return the request object so it can be passed to the resolver as `context`
  return res.status(400).json({message: 'invalid token!'});
  }
  next();
};

function signToken ({ email, username, _id }) {
  const payload = { email, username, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

// const withAuth = (req, res, next) => {
//     if (!req.session.loggedIn) {
//       res.redirect('/');
//     } else {
//       next();
//     }
//   };

  module.exports = { signToken, authMiddleware };
  