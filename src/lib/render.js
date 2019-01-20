const { resolve } = require('path');
const { existsSync } = require('fs');

function render(req, res, next) {
  const _render = res.render;

  res.render = function(view, data, fn) {
    const locale = res.locale;
    const localeFile = resolve(`src/language/${locale}/${view}.json`);
    let localeData = { ...res.locals.site };
    if (existsSync(localeFile)) {
      localeData = { ...localeData, ...require(localeFile) };
    }
    
    const _data = { ...localeData, ...data };
    _render.call(this, view, _data, fn);
  }
  return next();
}

module.exports = render;