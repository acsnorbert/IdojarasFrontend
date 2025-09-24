/*RegExp*/ 
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function registration() {
    /* await fetch('http://localhost:3000/users')
    .then(res => res.json())
    .then(data => console.log(data)) */

    let nameField = document.getElementById('nameField');
    let emailField = document.getElementById('emailField');
    let passwordField = document.getElementById('passwordField');
    let confirmField = document.getElementById('confirmPasswordField');


    if (nameField.value == '' || passwordField.value == '' || emailField.value == '' || confirmField.value == '') {
        showMessage('danger','Hiba','Nem adtál meg minden adatot!');
        return;
    }

    if (passwordField.value != confirmField.value) {
        showMessage('danger','Hiba','A két jelszó nem egyezik!');
        return;
    }

    if (!passwdRegExp.test(passwordField.value)) {
        showMessage('danger','Hiba','A megadott jelszó nem elég biztonságos!');
        return;
    }

    if (!emailRegExp.test(emailField.value)) {
        showMessage('danger','Hiba','Nem megfelelő e-mail cím!');
        return;
    }

    try {
        const res = await fetch(`${ServerURL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameField.value,
                email: emailField.value,
                password: passwordField.value
            })
        });

        const data = await res.json();
        showMessage('info','Siker', data.msg);
        if (res.status == 200) {
            nameField.value = "";
            emailField.value = "";
            passwordField.value = "";
            confirmField.value = "";
        }
    } catch (err) {
        showMessage('danger','Hiba', err);
    }
}



async function login() {
    let emailField = document.getElementById('emailField');
    let passwordField = document.getElementById('passwordField');
    if (passwordField.value == '' || emailField.value == '') {
        showMessage('danger','Hiba','Nem adtál meg minden adatot!');
        return;
    }

    let user = {};

    try {
        const res = await fetch(`${ServerURL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailField.value,
                password: passwordField.value
            })
        });

        user = await res.json();

        if (user.id) {
            loggedUser = user;
        }

        if (!loggedUser) {
            showMessage('danger', 'Hiba', 'Hibás belépési adatok!');
            return;
        }

        sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        getLoggedUser();
        showMessage('success', 'Ok', 'Sikeres bejelentkezés');
    } catch (err) {
        showMessage('danger','Hiba', err);
    }

}


function logout() {
    sessionStorage.removeItem('loggedUser');
    getLoggedUser();
}

async function getProfile() {
    const nameField = document.getElementById('nameField');
    const emailField = document.getElementById('emailField');

    try {
        const res = await fetch(`${ServerURL}/users/${loggedUser.id}`);
        const user = await res.json();
        console.log(user)
        nameField.value = user.name;
        emailField.value = user.email;
    } catch (error) {
        showMessage('danger','Hiba', error);
    }

}

async function updateProfile() {
    let nameField = document.getElementById('nameField');
    let emailField = document.getElementById('emailField');

    if (nameField.value == '' || emailField.value == '') {
        showMessage('danger', 'Hiba', 'Nem adtál meg minden adatot!');
        return;
    }

    if (!emailRegExp.test(emailField.value)) {
        showMessage('danger', 'Hiba', 'Nem megfelelő e-mail cím!');
        return;
    }

    try {
        const res = await fetch(`${ServerURL}/users/profile`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: loggedUser.id,
                email: emailField.value,
                name: nameField.value
            })
        });

        const data = await res.json();
        showMessage('info', 'Siker', data.msg);
        if (res.status == 200) {
            nameField.value = "";
            emailField.value = "";
        }
    } catch (err) {
        showMessage('danger', 'Hiba', err);
    }

    getLoggedUser();
}

async function updatePassword() {
    console.log('updatePassword');
    let currentPasswordField = document.querySelector('#passwordField');
    let newPasswordField = document.querySelector('#newPasswordField');
    let confirmPasswordField = document.querySelector('#newPasswordConfirmField');

    if (currentPasswordField.value == '' || newPasswordField.value == '' || confirmPasswordField.value == '') {
        showMessage('danger', 'Hiba', 'Nem adtál meg minden adatot!');
        return;
    }

    if (newPasswordField.value != confirmPasswordField.value) {
        showMessage('danger', 'Hiba', 'A két jelszó nem egyezik!');
        return;
    }

    if (!passwdRegExp.test(newPasswordField.value)) {
        showMessage('danger', 'Hiba', 'A megadott jelszó nem elég biztonságos!');
        return;
    }

    try {
        const res = await fetch(`${ServerURL}/users/passmod`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: loggedUser.id,
                oldPassword: currentPasswordField.value,
                newPassword: newPasswordField.value
            })
        });

        let data = await res.json();
        if (res.status == 200){
            showMessage('success', 'Ok', data.msg);
        } else {
            showMessage('danger', 'Hiba', data.msg);
        }
    } catch (err) {
        showMessage('danger', 'Hiba', err);
    }
}

