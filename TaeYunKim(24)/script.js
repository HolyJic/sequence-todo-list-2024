const form = document.querySelector('form');
const input = document.querySelector('input');
const ul = document.querySelector('ul');

const delItem = (event) => {
    const target = event.target.parentElement
    target.remove();
};

const addItem = (text) => {
    if (text !== '') {
        const li = document.createElement('li');
        const button = document.createElement('button');
        const span = document.createElement('span');

        span.innerText = text;
        button.innerText = '삭제';
        button.addEventListener('click', delItem)

        li.appendChild(span);
        li.appendChild(button);
        ul.appendChild(li);
    }
};

const handler = (event) => {
    event.preventDefault();
    addItem(input.value);
    input.value = '';
};

form.addEventListener('submit', handler);
