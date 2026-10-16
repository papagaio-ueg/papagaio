/**
 * PAPAGaio 🦜 - Módulo de Autenticação, Transições e Validações
 * Arquivo: js/auth.js
 * 
 * Responsabilidades:
 * 1. Alternância fluida em 1 clique entre Login e Registro sem reload de página
 * 2. Validação rigorosa no cliente (letras no nome, formato de e-mail, senhas)
 * 3. Envio simulado e validação de código numérico de confirmação por e-mail
 * 4. Cadastro e redirecionamento para tela de Login
 */

(function () {
  'use strict';

  // --- Elementos do DOM: Formulários e Cards ---
  const loginCard = document.getElementById('loginCard');
  const registerCard = document.getElementById('registerCard');
  const verificationCard = document.getElementById('verificationCard');

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const verificationForm = document.getElementById('verificationForm');

  // Botões de alternância em 1 clique
  const btnGoToRegister = document.getElementById('btnGoToRegister');
  const btnGoToLogin = document.getElementById('btnGoToLogin');
  const btnBackToRegister = document.getElementById('btnBackToRegister');
  const btnResendCode = document.getElementById('btnResendCode');

  // Inputs do Login
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const loginEmailError = document.getElementById('loginEmailError');
  const loginPasswordError = document.getElementById('loginPasswordError');

  // Inputs do Registro
  const registerName = document.getElementById('registerName');
  const registerEmail = document.getElementById('registerEmail');
  const registerPassword = document.getElementById('registerPassword');
  const registerConfirmPassword = document.getElementById('registerConfirmPassword');

  const registerNameError = document.getElementById('registerNameError');
  const registerEmailError = document.getElementById('registerEmailError');
  const registerPasswordError = document.getElementById('registerPasswordError');
  const registerConfirmPasswordError = document.getElementById('registerConfirmPasswordError');

  // Inputs da Verificação de E-mail
  const verificationCode = document.getElementById('verificationCode');
  const verificationCodeError = document.getElementById('verificationCodeError');
  const verificationEmailTarget = document.getElementById('verificationEmailTarget');

  // Container de Toasts
  const toastContainer = document.getElementById('toastContainer');

  // Estado Temporário em Memória para o Registro Atual
  let pendingRegistration = {
    name: '',
    email: '',
    password: '',
    code: ''
  };

  // ==========================================================================
  // SISTEMA DE NOTIFICAÇÕES (TOAST)
  // ==========================================================================
  function showToast({ title, message, code = null, type = 'info', duration = 8000 }) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';
    if (type === 'error') icon = '❌';

    let codeHtml = '';
    if (code) {
      codeHtml = `
        <div style="margin-top: 6px;">
          <span style="font-size: 0.8rem; color: #4B5563; display: block;">Código de Verificação:</span>
          <span class="toast-code-badge">${code}</span>
        </div>
      `;
    }

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
        ${codeHtml}
      </div>
      <button type="button" class="toast-close" aria-label="Fechar notificação">&times;</button>
    `;

    toastContainer.appendChild(toast);

    // Animar entrada
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    const closeBtn = toast.querySelector('.toast-close');
    const dismiss = () => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    };

    closeBtn.addEventListener('click', dismiss);

    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
  }

  // ==========================================================================
  // TRANSIÇÃO DE FORMULÁRIOS EM 1 CLIQUE
  // ==========================================================================
  function switchView(targetCard) {
    // Esconde todos
    [loginCard, registerCard, verificationCard].forEach(card => {
      if (card) {
        card.classList.remove('active');
        card.classList.add('hidden');
      }
    });

    // Limpa erros visuais ao alternar
    clearAllErrors();

    // Exibe o card alvo com animação
    if (targetCard) {
      targetCard.classList.remove('hidden');
      targetCard.classList.add('active');

      // Foco inteligente no primeiro input visível
      const firstInput = targetCard.querySelector('input:not([type="hidden"])');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 150);
      }
    }
  }

  // Alternância 1 Clique: Login -> Registro
  if (btnGoToRegister) {
    btnGoToRegister.addEventListener('click', () => {
      switchView(registerCard);
    });
  }

  // Alternância 1 Clique: Registro -> Login
  if (btnGoToLogin) {
    btnGoToLogin.addEventListener('click', () => {
      switchView(loginCard);
    });
  }

  // Voltar da Verificação para o Registro
  if (btnBackToRegister) {
    btnBackToRegister.addEventListener('click', () => {
      switchView(registerCard);
    });
  }

  // ==========================================================================
  // TOGGLE DE VISIBILIDADE DE SENHA
  // ==========================================================================
  document.querySelectorAll('.input-toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🔒';
        btn.setAttribute('aria-label', 'Ocultar senha');
      } else {
        input.type = 'password';
        btn.textContent = '👁️';
        btn.setAttribute('aria-label', 'Mostrar senha');
      }
    });
  });

  // ==========================================================================
  // VALIDADORES AUXILIARES
  // ==========================================================================
  
  // E-mail válido
  function isValidEmail(email) {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    return re.test(String(email).trim());
  }

  // Nome: estritamente letras maiúsculas e minúsculas (inclui acentos comuns e espaços)
  function isValidName(name) {
    const trimmed = String(name).trim();
    if (trimmed.length < 2) return false;
    // Permite letras portuguesas e espaços, bloqueia números e símbolos especiais
    const re = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    return re.test(trimmed);
  }

  function setFieldError(input, errorElement, message) {
    if (input) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
    }
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('visible');
    }
  }

  function clearFieldError(input, errorElement) {
    if (input) {
      input.classList.remove('is-invalid');
    }
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('visible');
    }
  }

  function clearAllErrors() {
    document.querySelectorAll('.form-input').forEach(input => {
      input.classList.remove('is-invalid');
    });
    document.querySelectorAll('.form-error-msg').forEach(msg => {
      msg.textContent = '';
      msg.classList.remove('visible');
    });
  }

  // ==========================================================================
  // MÁSCARAS E REGRAS DE ENTRADA EM TEMPO REAL
  // ==========================================================================

  // Restrição estrita no campo Nome: alertar caso digite números ou símbolos
  if (registerName) {
    registerName.addEventListener('input', () => {
      const rawVal = registerName.value;
      if (rawVal.length > 0 && !isValidName(rawVal)) {
        setFieldError(
          registerName, 
          registerNameError, 
          'O nome aceita apenas letras maiúsculas e minúsculas (sem números ou símbolos).'
        );
      } else {
        clearFieldError(registerName, registerNameError);
      }
    });
  }

  // Restrição estrita no campo de Código de Verificação: APENAS NÚMEROS
  if (verificationCode) {
    verificationCode.addEventListener('input', (e) => {
      // Remove instantaneamente qualquer caractere não numérico
      const numericOnly = e.target.value.replace(/\D/g, '');
      e.target.value = numericOnly;

      if (numericOnly.length > 0) {
        clearFieldError(verificationCode, verificationCodeError);
      }
    });

    // Impede teclas não numéricas
    verificationCode.addEventListener('keypress', (e) => {
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    });
  }

  // ==========================================================================
  // SUBMISSÃO: FORMULÁRIO DE LOGIN
  // ==========================================================================
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAllErrors();

      let hasError = false;
      const emailVal = loginEmail.value.trim();
      const passwordVal = loginPassword.value;

      // 1. Campo de usuário deve aceitar apenas email
      if (!emailVal) {
        setFieldError(loginEmail, loginEmailError, 'Informe seu e-mail cadastrado.');
        hasError = true;
      } else if (!isValidEmail(emailVal)) {
        setFieldError(loginEmail, loginEmailError, 'Formato inválido. O usuário deve ser um e-mail válido.');
        hasError = true;
      }

      // 2. Campo de senha
      if (!passwordVal) {
        setFieldError(loginPassword, loginPasswordError, 'Informe sua senha.');
        hasError = true;
      }

      if (hasError) return;

      // Autenticação com verificação de usuários no localStorage
      const usersDb = JSON.parse(localStorage.getItem('papagaio_users') || '[]');
      const matchedUser = usersDb.find(u => u.email.toLowerCase() === emailVal.toLowerCase());

      // Se encontrou usuário ou se é login de demonstração
      let loggedUser = null;
      if (matchedUser) {
        if (matchedUser.password !== passwordVal) {
          setFieldError(loginPassword, loginPasswordError, 'Senha incorreta.');
          return;
        }
        loggedUser = matchedUser;
      } else {
        // Permite login caso não haja usuário cadastrado previamente (usuário demo)
        loggedUser = {
          name: emailVal.split('@')[0].replace(/[._-]/g, ' '),
          email: emailVal
        };
      }

      // Salva sessão atual
      sessionStorage.setItem('papagaio_current_user', JSON.stringify({
        name: loggedUser.name,
        email: loggedUser.email,
        loginTime: new Date().toISOString()
      }));

      showToast({
        title: 'Login bem-sucedido!',
        message: `Bem-vindo de volta, ${loggedUser.name}! Redirecionando para o Dashboard...`,
        type: 'success',
        duration: 1500
      });

      // Redireciona para o Dashboard
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    });
  }

  // ==========================================================================
  // SUBMISSÃO: FORMULÁRIO DE REGISTRO
  // ==========================================================================
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAllErrors();

      let hasError = false;

      const nameVal = registerName.value.trim();
      const emailVal = registerEmail.value.trim();
      const passVal = registerPassword.value;
      const confirmPassVal = registerConfirmPassword.value;

      // O formulário deve ser preenchido completamente antes de avançar
      // 1. Validação do Nome
      if (!nameVal) {
        setFieldError(registerName, registerNameError, 'O nome é obrigatório.');
        hasError = true;
      } else if (!isValidName(nameVal)) {
        setFieldError(
          registerName, 
          registerNameError, 
          'O nome deve conter apenas letras maiúsculas e minúsculas (sem números).'
        );
        hasError = true;
      }

      // 2. Validação do E-mail
      if (!emailVal) {
        setFieldError(registerEmail, registerEmailError, 'O e-mail é obrigatório.');
        hasError = true;
      } else if (!isValidEmail(emailVal)) {
        setFieldError(registerEmail, registerEmailError, 'Digite um e-mail válido.');
        hasError = true;
      }

      // 3. Validação de Senha
      if (!passVal) {
        setFieldError(registerPassword, registerPasswordError, 'A senha é obrigatória.');
        hasError = true;
      } else if (passVal.length < 6) {
        setFieldError(registerPassword, registerPasswordError, 'A senha deve ter no mínimo 6 caracteres.');
        hasError = true;
      }

      // 4. Validação de Confirmar Senha
      if (!confirmPassVal) {
        setFieldError(registerConfirmPassword, registerConfirmPasswordError, 'Confirme sua senha.');
        hasError = true;
      } else if (passVal !== confirmPassVal) {
        setFieldError(registerConfirmPassword, registerConfirmPasswordError, 'As senhas não coincidem.');
        hasError = true;
      }

      if (hasError) return;

      // Gera código aleatório numérico de 6 dígitos
      const generatedCode = String(Math.floor(100000 + Math.random() * 900000));

      pendingRegistration = {
        name: nameVal,
        email: emailVal,
        password: passVal,
        code: generatedCode
      };

      // Atualiza interface da etapa de verificação
      if (verificationEmailTarget) {
        verificationEmailTarget.textContent = emailVal;
      }
      if (verificationCode) {
        verificationCode.value = '';
      }

      // Notifica o usuário com o código enviado por e-mail simulado
      showToast({
        title: 'E-mail com código enviado!',
        message: `Simulação de envio para ${emailVal}. Insira o código abaixo para validar:`,
        code: generatedCode,
        type: 'info',
        duration: 15000
      });

      // Avança para a tela de verificação
      switchView(verificationCard);
    });
  }

  // ==========================================================================
  // REENVIAR CÓDIGO POR E-MAIL
  // ==========================================================================
  if (btnResendCode) {
    btnResendCode.addEventListener('click', () => {
      if (!pendingRegistration.email) {
        switchView(registerCard);
        return;
      }

      // Gera um novo código
      const newCode = String(Math.floor(100000 + Math.random() * 900000));
      pendingRegistration.code = newCode;

      showToast({
        title: 'Novo código gerado!',
        message: `Reenviamos o código para ${pendingRegistration.email}.`,
        code: newCode,
        type: 'info',
        duration: 15000
      });
    });
  }

  // ==========================================================================
  // SUBMISSÃO: CONFIRMAÇÃO DO CÓDIGO DE E-MAIL
  // ==========================================================================
  if (verificationForm) {
    verificationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAllErrors();

      const enteredCode = verificationCode.value.trim();

      if (!enteredCode) {
        setFieldError(verificationCode, verificationCodeError, 'Digite o código numérico de 6 dígitos.');
        return;
      }

      if (enteredCode !== pendingRegistration.code) {
        setFieldError(
          verificationCode, 
          verificationCodeError, 
          'Código incorreto! Verifique o número exibido na notificação e tente novamente.'
        );
        return;
      }

      // Código correto: cadastra o usuário no banco local
      const usersDb = JSON.parse(localStorage.getItem('papagaio_users') || '[]');
      
      // Remove duplicados de email caso existam
      const filteredDb = usersDb.filter(u => u.email.toLowerCase() !== pendingRegistration.email.toLowerCase());
      filteredDb.push({
        name: pendingRegistration.name,
        email: pendingRegistration.email,
        password: pendingRegistration.password,
        registeredAt: new Date().toISOString()
      });

      localStorage.setItem('papagaio_users', JSON.stringify(filteredDb));

      // Limpa formulário de registro
      registerForm.reset();

      // Preenche o e-mail no formulário de login para comodidade
      if (loginEmail) {
        loginEmail.value = pendingRegistration.email;
      }

      showToast({
        title: 'Cadastro Concluído com Sucesso!',
        message: 'Sua conta foi validada. Faça login com suas credenciais.',
        type: 'success',
        duration: 6000
      });

      // Requisito estrito: "Após cadastrar, o usuário será jogado para tela de Login."
      switchView(loginCard);
    });
  }

  // ==========================================================================
  // INICIALIZAÇÃO
  // ==========================================================================
  // Garante que a aplicação inicie estritamente na tela de login
  switchView(loginCard);

})();
