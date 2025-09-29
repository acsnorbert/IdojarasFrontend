const AppTitle = 'Időjárás App';
const Author = 'szoftverfejlesztő';
const Company = 'Ács Norbert - Bajai SZC Türr István Technikum';
const ServerURL = 'http://localhost:3000';

let title = document.getElementById('appTitle');
let company = document.getElementById('company');
let author = document.getElementById('author');
let lightmodeBtn = document.getElementById('lightmodeBtn');
let darkmodeBtn = document.getElementById('darkmodeBtn');
let main = document.querySelector('main');

title.innerHTML = AppTitle;
company.innerHTML = Company;
author.innerHTML = Author;

let loggedUser = null;
let theme = 'light';

/*-- Téma beállítása --*/
lightmodeBtn.addEventListener('click', ()=>setTheme('light'));
darkmodeBtn.addEventListener('click', ()=>setTheme('dark'));

function loadTheme() {
    theme = localStorage.getItem('SCTheme') || 'light';
    setTheme(theme);
}

function saveTheme(theme) { localStorage.setItem('SCTheme',theme); }

function setTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme',theme);
    setThemeBtn(theme);
    saveTheme(theme);
}

function setThemeBtn(theme) {
    if(theme==='light'){ lightmodeBtn.classList.add('hide'); darkmodeBtn.classList.remove('hide'); }
    else { lightmodeBtn.classList.remove('hide'); darkmodeBtn.classList.add('hide'); }
}

/*-- Render nézet --*/
let render = async (view) => {
    main.innerHTML = await (await fetch(`views/${view}.html`)).text();

    switch(view){
        case 'profile': await getProfile(); break;
        case 'main':
            setDate();
            await getIdojaras();
            renderIdojaras();
            break;
        case 'statistics':
            setTimeout(()=>loadChart(),50);
            break;
        case 'calendar':
            await getIdojaras(); 
            initCalendar();
            break;
    }
}

/*-- Bejelentkezett felhasználó --*/
async function getLoggedUser(){
    if(sessionStorage.getItem('loggedUser')){
        loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
        document.getElementById('mainMenu').classList.add('hide');
        document.getElementById('userMenu').classList.remove('hide');
        await render('profile');
    } else {
        loggedUser = null;
        document.getElementById('mainMenu').classList.remove('hide');
        document.getElementById('userMenu').classList.add('hide');
        await render('login');
    }
}

(async ()=>{
    loadTheme();
    await getLoggedUser();
})();
