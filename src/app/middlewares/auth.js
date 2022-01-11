const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    //caso não tiver um header mando um erro de autorização(401)
    return res.status(401).send({ error: 'No token provided' });
  }

  //verificar se o token está no formato certo
  //Ex: Bearer ghdngnbjjjwpmxbahs876739vyghfiv
  const parts = authHeader.split(' ');

  if (!parts.length === 2) {
    return res.status(401).send({ error: 'Token Error' });
  }

  //desestruturando o array do split
  const [scheme, token] = parts;

  //verificar se o scheme corresponde a Bearer
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: 'Wrong format token' });
  }

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    //caso der erro significa que o token comparado não bateu com o secret definido na aplicação no config
    if (err) {
      return res.status(401).send({ error: 'Invalid Token' });
    }

    req.userId = decoded.id;
    return next();
  });
};
