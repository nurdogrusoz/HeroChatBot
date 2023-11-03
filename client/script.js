import bot from './assets/ironman.png';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300)
};

function typeText (element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++
    }
    else {
      clearInterval(interval);
    }
  }, 10)
}

function generateUniqueId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function createBotMessage(value, uniqueId) {
  return `
    <div class="msg left-msg">
      <div class="msg-bubble">
        <div class="profile">
          <img src="${bot}" alt="bot" />
        </div>
        <div class="message" id="${uniqueId}">
          ${value}
        </div>
      </div>
    </div>
  `;
}

function createUserMessage(value, uniqueId) {
  return `
    <div class="msg right-msg">
      <div class="msg-bubble">
        <div class="profile">
          <img src="${user}" alt="user" />
        </div>
        <div class="message" id="${uniqueId}">
          ${value}
        </div>
      </div>
    </div>
  `;
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data  = new FormData(form);

  //user chatstripe
  chatContainer.innerHTML += createUserMessage(data.get('prompt'));

  //clears input
  form.reset()

  //bot chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += createBotMessage(" ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  // fetch data from server -> bot response

  const response = await fetch('http://localhost:5001',{
    method: 'POST',
    headers:{
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })
  // console.log(data.get('prompt'))

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();
    typeText(messageDiv, parsedData);
  }
  else{
    const err = await response.text();
    messageDiv.innerHTML = "Something went wrong :(";

    alert(err);
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
})