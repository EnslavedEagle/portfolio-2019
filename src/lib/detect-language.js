const path = require('path');
const languages = require(path.resolve('config/languages'));

function detectLanguage(req, res, next) {
  const language = req.headers['accept-language']
    .split(/(;q=[0-1]{1}.[0-9]{1}.?|,)/g)
    .find(l => languages.includes(l)) || 'pl-PL';
  const siteLang = require(path.resolve(`src/language/${language}/site.json`));
  res.locale = language;
  res.locals.site = siteLang;
  res.header('Content-Language', language);
  next();
}

module.exports = detectLanguage;