const app = document.getElementById('app');

const ce = (name) => document.createElement(name);

const form = ce('form');
form.id = 'login_form';
const username = ce('input');
const password = ce('input');
password.type = 'password';
const submit = ce('button');
submit.textContent = 'Login';

form.append(username, password, submit);
form.onsubmit = (e) => {
    e.preventDefault();
}

let state = {
    user: null,
    token: null,
    error: null,
};

const storedState = localStorage.getItem('state');

if (storedState) {
    state = JSON.parse(storedState);
}

submit.addEventListener('click', async () => {
    const requestBody = JSON.stringify({
        username: username.value,
        password: password.value,
    });

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: requestBody,
    });

    const json = await response.json();

    if (json.user) {
        state.user = json.user;
        state.token = json.token;
        state.error = null;

        localStorage.setItem('state', JSON.stringify(state));
    } else {
        state.error = 'Failed to login.';
    }

    render();
});

const render = () => {
    for (let i = 0; i < app.children.length; ++i) {
        const child = app.children[i];

        app.removeChild(child);
    }

    if (!state.user) {
        app.append(form);
        console.log('Rendered Form!');

        if (state.error) {
            const errorText = ce('span');
            errorText.style.color = 'red';
            errorText.textContent = state.error;

            form.append(errorText);
        }
    } else {
        app.append('You are logged in!');
    }
}

render();
