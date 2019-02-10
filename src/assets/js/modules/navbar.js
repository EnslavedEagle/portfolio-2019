export default class Navbar {
    constructor() {
        console.log('Init navbar');

        this.defaultClass = 'site-nav';
        this.activeClass = 'site-nav--expanded';

        this.navbar = document.querySelector(`.${this.defaultClass}`);

        const button = document.getElementById('NavbarToggle');
        button.addEventListener('click', (e) => {
            console.log('click');
            this.toggle();
        });
    }

    toggle() {
        this.navbar.classList.toggle(this.activeClass);
    }
}
