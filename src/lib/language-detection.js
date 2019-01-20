const path = require('path');
const languages = require(path.resolve('config/languages'));

function detectLanguage(req, reply, next) {
  const language = req.headers['accept-language']
    .split(/(;q=[0-1]{1}.[0-9]{1}.?|,)/g)
    .find(l => languages.includes(l)) || 'pl-PL';
  const siteLang = require(path.resolve(`src/language/${language}/site.json`));
  reply.locals.language = language;
  reply.locals.site = siteLang;
  reply.headers['Content-Language'] = language;
  next();
};

module.exports = detectLanguage;