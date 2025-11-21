const input = document.getElementById('messageInput');
  const chatBody = document.getElementById('chatBody');
  const sendBtn = document.getElementById('sendBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const authContainer = document.getElementById('authContainer');
  const app = document.getElementById('app');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const userStatus = document.getElementById('userStatus');
  const passStatus = document.getElementById('passStatus');
  const registerBtn = document.getElementById('registerBtn');

  const botReplies = [
    "Интересно… но не уверен, что понял 😅",
    "Хмм, звучит как баг 🤔",
    "Я — искусственный интеллект, а ты?",
    "Ошибка 404: смысл не найден",
    "Проверь синтаксис своих мыслей 💻",
    "Я думал ты программист, а не философ 🤖",
    "Впечатляюще, но где документация?",
    "Кажется, кто-то опять забыл закрыть скобку 😆"
  ];

  // ========== UI подсказки ==========
  usernameInput.addEventListener('input', () => {
    const name = usernameInput.value.trim();
    if (!name) { userStatus.textContent = ""; return; }
    userStatus.textContent = name.length < 3 ? "Имя слишком короткое" : "Имя выглядит OK";
    userStatus.style.color = name.length < 3 ? "orange" : "lime";
  });

  passwordInput.addEventListener('input', () => {
    const pass = passwordInput.value;
    let score = 0;
    if (pass.length >= 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (!pass) {
      passStatus.textContent = "";
    } else if (score <= 1) {
      passStatus.textContent = "Слабый пароль";
      passStatus.style.color = "red";
    } else if (score === 2) {
      passStatus.textContent = "Нормальный пароль";
      passStatus.style.color = "orange";
    } else {
      passStatus.textContent = "Сложный пароль";
      passStatus.style.color = "lime";
    }
  });

  // ========== Registration ==========
  registerBtn.addEventListener('click', async () => {
    const name = usernameInput.value.trim();
    const pass = passwordInput.value;

    if (!name || !pass) {
      alert("Введите имя и пароль");
      return;
    }
    if (name.length < 3) {
      alert("Имя должно быть минимум 3 символа");
      return;
    }
    if (pass.length < 6) {
      alert("Пароль минимум 6 символов");
      return;
    }

    // Формируем payload
    const payload = {
      username: name,
      email: name + "@example.com", // временно, пока нет поля ввода email
      password: pass
    };

    try {
      const res = await fetch('/users', { // относительный путь — работает при запуске из Spring
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const user = await res.json();
        console.log('✅ Пользователь создан:', user);
        localStorage.setItem('currentUser', name);
        authContainer.style.display = 'none';
        app.style.display = 'flex';
        // можно загрузить сообщения/пользователей здесь
      } else {
        // пытаемся прочитать ответ — сервер может вернуть JSON или текст
        let text;
        try { text = await res.text(); } catch(e){ text = 'Unknown error'; }
        alert('Ошибка регистрации: ' + (text || res.status));
        console.warn('Регистрация вернула', res.status, text);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Не удалось подключиться к серверу. Убедитесь, что backend запущен.');
    }
  });

  // ========== Auto-login if present ==========
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    authContainer.style.display = 'none';
    app.style.display = 'flex';
  }

  // ========== Messages local demo ==========
  const savedMessages = JSON.parse(localStorage.getItem('lingoMessages')) || [];
  savedMessages.forEach(msg => addMessage(msg.text, msg.sender));

  function addMessage(text, sender = 'user') {
    const msg = document.createElement('div');
    msg.classList.add('message', sender);
    msg.textContent = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function saveMessage(text, sender) {
    const messages = JSON.parse(localStorage.getItem('lingoMessages')) || [];
    messages.push({ text, sender });
    localStorage.setItem('lingoMessages', JSON.stringify(messages));
  }

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    saveMessage(text, 'user');
    input.value = '';
    setTimeout(() => {
      const reply = botReplies[Math.floor(Math.random() * botReplies.length)];
      addMessage(reply, 'bot');
      saveMessage(reply, 'bot');
    }, 800 + Math.random() * 800);
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

  settingsBtn.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const theme = document.body.classList.contains('light') ? 'light' : 'dark';
    localStorage.setItem('lingoTheme', theme);
  });

  if (localStorage.getItem('lingoTheme') === 'light') {
    document.body.classList.add('light');
  }