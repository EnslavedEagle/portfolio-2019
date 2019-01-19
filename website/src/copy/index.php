<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="index,follow">
  <meta name="author" content="Patryk Bernasiewicz">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Patryk Bernasiewicz | Front-End Developer</title>
  <meta property="og:title" content="Patryk Bernasiewicz | Front-End Developer">
  <meta property="og:description" content="Patryk Bernasiewicz - Front-End Developer, strona internetowa portfolio">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pl_PL">
  <meta property="og:site_name" content="PatrykB.pl">
  <meta property="og:image" content="images/fb-image.png">
  <link rel="stylesheet" href="css/style.css">
  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('js/sw.js');
    }
  </script>
</head>
<body>
  
  <header class="site-header" id="top">
    
    <nav class="site-nav">
      <ul class="site-nav__list">
        <li class="site-nav__item">
          <a href="#top" class="site-nav__link">Strona główna</a>
        </li>
        <li class="site-nav__item">
          <a href="#o-mnie" class="site-nav__link">O mnie</a>
        </li>
        <li class="site-nav__item">
          <a href="#projekty" class="site-nav__link">Projekty</a>
        </li>
        <li class="site-nav__item">
          <a href="#kontakt" class="site-nav__link">Kontakt</a>
        </li>
      </ul>
    </nav>

    <div class="container site-header__inner">
      <div class="site-header__devices">
        <a href="#top" class="site-header__item site-header__item--hello" aria-label="Przejdź do strony głównej">
          <img src="images/header/hello.svg" alt="Hello!">
        </a>
        <a href="#top" class="site-header__item site-header__item--about" aria-label="Przejdź do sekcji 'O mnie'">
          <img src="images/header/about.svg" alt="O mnie">
        </a>
        <a href="#top" class="site-header__item site-header__item--projects" aria-label="Przejdź do sekcji 'O mnie'">
          <img src="images/header/projects.svg" alt="Projekty">
        </a>
        <a href="#top" class="site-header__item site-header__item--contact" aria-label="Przejdź do sekcji 'O mnie'">
          <img src="images/header/contact.svg" alt="Kontakt">
        </a>
      </div>
    </div>
  
  </header>

  <script src="js/scripts.js"></script>
</body>
</html>