const AppTitle = 'Időjárás App';
const Author = 'szoftverfejlesztő';
const Company = 'Ács Norbert - Bajai SZC Türr István Technikum'
const ServerURL = 'http://localhost:3000'


let title = document.getElementById('appTitle');
let company = document.getElementById('company');
let author = document.getElementById('author');
let lightmodeBtn = document.getElementById('lightmodeBtn');
let darkmodeBtn = document.getElementById('darkmodeBtn');
let main = document.querySelector('main');

/*Menu*/
let mainMenu = document.getElementById('mainMenu');
let userMenu = document.getElementById('userMenu');


title.innerHTML = AppTitle;
company.innerHTML = Company;
author.innerHTML = Author;

let loggedUser = null;

/* Téma beállításai */
let theme = 'light';

lightmodeBtn.addEventListener('click', () => {
    setTheme('light');
});

darkmodeBtn.addEventListener('click', () => {
    setTheme('dark');
});

let loadTheme = () => {
    theme = 'dark';
    if (localStorage.getItem('SCTheme')) {
        theme = localStorage.getItem('SCTheme');
    }
    setTheme(theme);
}

let saveTheme = (theme) => {
    localStorage.setItem('SCTheme', theme)
}

let setTheme = (theme) => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    setThemeBtn(theme);
    saveTheme(theme);
}

setThemeBtn = (theme) => {
    if (theme == 'light') {
        lightmodeBtn.classList.add('hide');
        darkmodeBtn.classList.remove('hide');
    } else {
        lightmodeBtn.classList.remove('hide');
        darkmodeBtn.classList.add('hide');
    }
}


let render = async (view) => {
    main.innerHTML = await (await fetch(`views/${view}.html`)).text();

    switch (view) {
        case "profile":
            getProfile();
            break;
        case "main":
            setDate();
            await getIdojaras();
            renderIdojaras();
            break;
            case "statistics":
                setTimeout(() => loadChart(), 50);
                break;
            
    }
}

async function getLoggedUser() {
    if (sessionStorage.getItem('loggedUser')) {
        loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
        mainMenu.classList.add('hide');
        userMenu.classList.remove('hide');
        await render('profile');
    } else {
        loggedUser = null;
        mainMenu.classList.remove('hide');
        userMenu.classList.add('hide');
        await render('login');
    }
    return loggedUser;
}


loadTheme()
getLoggedUser()