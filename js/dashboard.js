/**
 * PAPAGaio 🦜 - Lógica do Dashboard Analítico (Dark Slate Theme)
 * Arquivo: js/dashboard.js
 * 
 * Implementa:
 * 1. Recuperação e exibição de dados da sessão autenticada
 * 2. Modal interativo de Perfil (alteração de foto, preset de avatar, nome de exibição)
 * 3. Armazenamento temporário no navegador (sessionStorage e localStorage)
 * 4. Gráfico Donut (Funil do Kanban: A Fazer, Em Andamento, Concluídas) com Paleta da Arara
 * 5. Gráfico de Barras Horizontal (Carga por Disciplina / Tag) em Azul, Verde e Laranja
 * 6. Indicador Velocímetro / Gauge (Saúde das Entregas no Prazo vs. Atrasos)
 * 7. Gráfico de Linha (Evolução Temporal de Entregas)
 * 8. Notificações Toast no Dashboard e Tratamento de Logout
 */

(function () {
  'use strict';

  // ==========================================================================
  // SISTEMA DE NOTIFICAÇÕES (TOAST)
  // ==========================================================================
  const toastContainer = document.getElementById('toastContainer');

  function showToast({ title, message, type = 'info', duration = 4500 }) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button type="button" class="toast-close" aria-label="Fechar notificação">&times;</button>
    `;

    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.classList.add('show');
      });
    });

    const closeBtn = toast.querySelector('.toast-close');
    const dismiss = () => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    };

    if (closeBtn) closeBtn.addEventListener('click', dismiss);
    if (duration > 0) setTimeout(dismiss, duration);
  }

  // ==========================================================================
  // INFORMAÇÕES DO USUÁRIO E SESSÃO (PROTÓTIPO COM STORAGE DO NAVEGADOR)
  // ==========================================================================
  const btnOpenProfile = document.getElementById('btnOpenProfile');
  const userNameDisplay = document.getElementById('userNameDisplay');
  const userEmailDisplay = document.getElementById('userEmailDisplay');
  const userAvatar = document.getElementById('userAvatar');
  const btnLogout = document.getElementById('btnLogout');
  const currentDateDisplay = document.getElementById('currentDateDisplay');

  // Estado padrão do usuário
  let currentUser = {
    name: 'Estudante Gaio',
    email: 'aluno@ueg.br',
    avatar: null,
    avatarType: 'initials' // 'image' | 'preset' | 'initials'
  };

  // Recupera dados salvos da sessão ativa ou armazenamento local do navegador
  const rawSession = sessionStorage.getItem('papagaio_current_user');
  const rawLocal = localStorage.getItem('papagaio_current_user');
  const savedData = rawSession || rawLocal;

  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      if (parsed.name) currentUser.name = parsed.name;
      if (parsed.email) currentUser.email = parsed.email;
      if (parsed.avatar !== undefined) currentUser.avatar = parsed.avatar;
      if (parsed.avatarType) currentUser.avatarType = parsed.avatarType;
    } catch (e) {
      console.warn('Erro ao carregar dados do usuário:', e);
    }
  }

  // Verifica se há cadastro prévio sincronizado no banco local 'papagaio_users'
  try {
    const usersDb = JSON.parse(localStorage.getItem('papagaio_users') || '[]');
    const matched = usersDb.find(u => u.email && u.email.toLowerCase() === currentUser.email.toLowerCase());
    if (matched) {
      if (matched.name && !rawSession) currentUser.name = matched.name;
      if (matched.avatar !== undefined && currentUser.avatar === null) {
        currentUser.avatar = matched.avatar;
        currentUser.avatarType = matched.avatarType || 'image';
      }
    }
  } catch (e) {
    console.warn('Erro ao consultar papagaio_users:', e);
  }

  // Renderiza as informações do perfil no Header do Dashboard
  function renderUserBadge() {
    if (userNameDisplay) userNameDisplay.textContent = currentUser.name;
    if (userEmailDisplay) userEmailDisplay.textContent = currentUser.email;

    if (userAvatar) {
      if (currentUser.avatarType === 'image' && currentUser.avatar) {
        userAvatar.innerHTML = `<img src="${currentUser.avatar}" alt="Foto de ${currentUser.name}" class="user-avatar-img">`;
      } else if (currentUser.avatarType === 'preset' && currentUser.avatar) {
        userAvatar.innerHTML = `<span class="user-avatar-emoji">${currentUser.avatar}</span>`;
      } else {
        const initials = currentUser.name
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map(part => part[0].toUpperCase())
          .join('');
        userAvatar.textContent = initials || 'PG';
      }
    }
  }

  // Inicializa o badge com os dados carregados
  renderUserBadge();

  // Data atual formatada
  if (currentDateDisplay) {
    const now = new Date();
    const options = { month: 'long', year: 'numeric', day: 'numeric' };
    currentDateDisplay.textContent = now.toLocaleDateString('pt-BR', options);
  }

  // Ação de Logout
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      sessionStorage.removeItem('papagaio_current_user');
      window.location.href = 'index.html';
    });
  }

  // ==========================================================================
  // MODAL DE PERFIL: CONTROLE E INTERATIVIDADE
  // ==========================================================================
  const profileModal = document.getElementById('profileModal');
  const btnCloseProfileModal = document.getElementById('btnCloseProfileModal');
  const btnCancelProfile = document.getElementById('btnCancelProfile');
  const profileForm = document.getElementById('profileForm');
  const profileDisplayName = document.getElementById('profileDisplayName');
  const profileEmailDisplayOnly = document.getElementById('profileEmailDisplayOnly');
  const profileNameError = document.getElementById('profileNameError');
  const profilePhotoFile = document.getElementById('profilePhotoFile');
  const btnRemovePhoto = document.getElementById('btnRemovePhoto');
  const profileAvatarPreview = document.getElementById('profileAvatarPreview');
  const profileAvatarText = document.getElementById('profileAvatarText');
  const profileAvatarImg = document.getElementById('profileAvatarImg');
  const avatarPresetsList = document.getElementById('avatarPresetsList');
  const presetButtons = avatarPresetsList ? avatarPresetsList.querySelectorAll('.avatar-preset-btn') : [];

  // Estado temporário mantido durante a edição no modal
  let tempAvatar = null;
  let tempAvatarType = 'initials';

  // Atualiza o preview visual do avatar dentro do modal
  function updateModalAvatarPreview() {
    if (!profileAvatarPreview) return;

    if (tempAvatarType === 'image' && tempAvatar) {
      if (profileAvatarImg) {
        profileAvatarImg.src = tempAvatar;
        profileAvatarImg.style.display = 'block';
      }
      if (profileAvatarText) {
        profileAvatarText.style.display = 'none';
      }
    } else if (tempAvatarType === 'preset' && tempAvatar) {
      if (profileAvatarImg) {
        profileAvatarImg.style.display = 'none';
      }
      if (profileAvatarText) {
        profileAvatarText.style.display = 'block';
        profileAvatarText.innerHTML = `<span class="profile-avatar-emoji">${tempAvatar}</span>`;
      }
    } else {
      // Iniciais baseadas no texto atual digitado ou nome atual
      if (profileAvatarImg) {
        profileAvatarImg.style.display = 'none';
      }
      if (profileAvatarText) {
        profileAvatarText.style.display = 'block';
        const nameVal = (profileDisplayName ? profileDisplayName.value : '').trim() || currentUser.name || 'PG';
        const initials = nameVal
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map(part => part[0].toUpperCase())
          .join('');
        profileAvatarText.textContent = initials || 'PG';
      }
    }

    // Atualiza estado visual ativo nos botões de preset
    presetButtons.forEach(btn => {
      const emoji = btn.getAttribute('data-preset-emoji') || btn.textContent.trim();
      if (tempAvatarType === 'preset' && tempAvatar === emoji) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Abre a janela modal de configurações do perfil
  function openProfileModal() {
    if (!profileModal) return;

    // Carrega o estado atual para edição temporária
    tempAvatar = currentUser.avatar;
    tempAvatarType = currentUser.avatarType || (currentUser.avatar ? 'image' : 'initials');

    if (profileDisplayName) {
      profileDisplayName.value = currentUser.name;
      profileDisplayName.classList.remove('input-error');
    }
    if (profileEmailDisplayOnly) {
      profileEmailDisplayOnly.value = currentUser.email;
    }
    if (profileNameError) {
      profileNameError.textContent = '';
      profileNameError.classList.remove('visible');
    }
    if (profilePhotoFile) {
      profilePhotoFile.value = '';
    }

    updateModalAvatarPreview();

    profileModal.classList.add('active');
    profileModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    if (btnOpenProfile) {
      btnOpenProfile.setAttribute('aria-expanded', 'true');
    }

    // Foca suavemente no campo do nome
    setTimeout(() => {
      if (profileDisplayName) {
        profileDisplayName.focus();
        profileDisplayName.select();
      }
    }, 120);
  }

  // Fecha o modal de perfil
  function closeProfileModal() {
    if (!profileModal) return;

    profileModal.classList.remove('active');
    profileModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    if (btnOpenProfile) {
      btnOpenProfile.setAttribute('aria-expanded', 'false');
      btnOpenProfile.focus();
    }
  }

  // Abertura do perfil ao clicar no botão do Header (ou no avatar/nome)
  if (btnOpenProfile) {
    btnOpenProfile.addEventListener('click', (e) => {
      e.preventDefault();
      openProfileModal();
    });
  }

  // Botões de fechar modal
  if (btnCloseProfileModal) {
    btnCloseProfileModal.addEventListener('click', closeProfileModal);
  }

  if (btnCancelProfile) {
    btnCancelProfile.addEventListener('click', closeProfileModal);
  }

  // Fechar ao clicar fora do card (no backdrop)
  if (profileModal) {
    profileModal.addEventListener('click', (e) => {
      if (e.target === profileModal) {
        closeProfileModal();
      }
    });
  }

  // Fechar com a tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && profileModal && profileModal.classList.contains('active')) {
      closeProfileModal();
    }
  });

  // Upload e preview imediato de foto de perfil
  if (profilePhotoFile) {
    profilePhotoFile.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type.toLowerCase())) {
        showToast({
          title: 'Formato não suportado',
          message: 'Selecione uma imagem válida nos formatos PNG, JPG ou WEBP.',
          type: 'warning'
        });
        profilePhotoFile.value = '';
        return;
      }

      // Limite de 2MB para não exceder limites de quota de armazenamento local do navegador
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        showToast({
          title: 'Arquivo muito grande',
          message: 'A foto deve ter no máximo 2MB para armazenamento temporário no navegador.',
          type: 'warning'
        });
        profilePhotoFile.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = function (event) {
        tempAvatar = event.target.result;
        tempAvatarType = 'image';
        updateModalAvatarPreview();
        showToast({
          title: 'Foto carregada',
          message: 'Clique em "Salvar Alterações" para confirmar a atualização.',
          type: 'info',
          duration: 3000
        });
      };
      reader.onerror = function () {
        showToast({
          title: 'Erro ao carregar',
          message: 'Não foi possível ler o arquivo selecionado.',
          type: 'error'
        });
      };
      reader.readAsDataURL(file);
    });
  }

  // Remover foto personalizada (retornar para as iniciais)
  if (btnRemovePhoto) {
    btnRemovePhoto.addEventListener('click', () => {
      tempAvatar = null;
      tempAvatarType = 'initials';
      if (profilePhotoFile) profilePhotoFile.value = '';
      updateModalAvatarPreview();
      showToast({
        title: 'Foto removida',
        message: 'O avatar padrão com suas iniciais será utilizado.',
        type: 'info',
        duration: 2500
      });
    });
  }

  // Seleção de presets temáticos
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const emoji = btn.getAttribute('data-preset-emoji') || btn.textContent.trim();
      tempAvatar = emoji;
      tempAvatarType = 'preset';
      if (profilePhotoFile) profilePhotoFile.value = '';
      updateModalAvatarPreview();
    });
  });

  // Atualização das iniciais no preview enquanto o usuário digita
  if (profileDisplayName) {
    profileDisplayName.addEventListener('input', () => {
      if (profileNameError) {
        profileNameError.textContent = '';
        profileNameError.classList.remove('visible');
        profileDisplayName.classList.remove('input-error');
      }
      if (tempAvatarType === 'initials') {
        updateModalAvatarPreview();
      }
    });
  }

  // Submissão do formulário de perfil (Salvar Alterações)
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const newName = profileDisplayName ? profileDisplayName.value.trim() : '';

      // Validação do nome
      if (!newName) {
        if (profileNameError && profileDisplayName) {
          profileNameError.textContent = 'Por favor, informe seu nome de exibição.';
          profileNameError.classList.add('visible');
          profileDisplayName.classList.add('input-error');
          profileDisplayName.focus();
        }
        return;
      }

      if (newName.length < 2) {
        if (profileNameError && profileDisplayName) {
          profileNameError.textContent = 'O nome de exibição deve ter pelo menos 2 caracteres.';
          profileNameError.classList.add('visible');
          profileDisplayName.classList.add('input-error');
          profileDisplayName.focus();
        }
        return;
      }

      // Atualiza o estado
      currentUser.name = newName;
      currentUser.avatar = tempAvatar;
      currentUser.avatarType = tempAvatarType;

      // Armazena temporariamente no navegador
      try {
        sessionStorage.setItem('papagaio_current_user', JSON.stringify(currentUser));
        localStorage.setItem('papagaio_current_user', JSON.stringify(currentUser));

        // Sincroniza também no banco de usuários mock se houver conta correspondente
        const usersDb = JSON.parse(localStorage.getItem('papagaio_users') || '[]');
        const userIndex = usersDb.findIndex(u => u.email && u.email.toLowerCase() === currentUser.email.toLowerCase());
        if (userIndex !== -1) {
          usersDb[userIndex].name = currentUser.name;
          usersDb[userIndex].avatar = currentUser.avatar;
          usersDb[userIndex].avatarType = currentUser.avatarType;
          localStorage.setItem('papagaio_users', JSON.stringify(usersDb));
        }
      } catch (err) {
        console.warn('Erro ao salvar dados no navegador:', err);
      }

      // Reflete as alterações no cabeçalho imediatamente
      renderUserBadge();

      // Fecha o modal
      closeProfileModal();

      // Feedback visual de sucesso
      showToast({
        title: 'Perfil Atualizado com Sucesso!',
        message: 'Foto e nome de exibição foram atualizados e salvos no navegador.',
        type: 'success',
        duration: 4000
      });
    });
  }

  // ==========================================================================
  // CONFIGURAÇÃO DOS GRÁFICOS (CHART.JS) - DARK SLATE THEME
  // ==========================================================================

  // Configuração global de fontes e contraste para Dark Slate
  Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  Chart.defaults.color = '#CBD5E1';

  // --------------------------------------------------------------------------
  // 1. PAINEL DE STATUS DAS TAREFAS: O "FUNIL" DO KANBAN (GRÁFICO DE ROSCA)
  // --------------------------------------------------------------------------
  const kanbanCanvas = document.getElementById('kanbanDonutChart');
  if (kanbanCanvas) {
    const kanbanData = {
      labels: ['A Fazer', 'Em Andamento', 'Concluídas'],
      datasets: [{
        data: [18, 12, 35],
        backgroundColor: [
          '#F97316', // Laranja Quente (A Fazer)
          '#3B82F6', // Azul Royal (Em Andamento)
          '#10B981'  // Verde Esmeralda (Concluídas)
        ],
        hoverBackgroundColor: [
          '#EA580C',
          '#2563EB',
          '#059669'
        ],
        borderWidth: 3,
        borderColor: '#162032',
        hoverOffset: 6
      }]
    };

    new Chart(kanbanCanvas, {
      type: 'doughnut',
      data: kanbanData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#0B1120',
            borderColor: '#3B82F6',
            borderWidth: 1.5,
            titleFont: { size: 13, weight: 'bold' },
            titleColor: '#FFFFFF',
            bodyFont: { size: 12 },
            bodyColor: '#E2E8F0',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function (context) {
                const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                const value = context.parsed;
                const percentage = ((value / total) * 100).toFixed(1);
                return ` ${context.label}: ${value} tarefas (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. PAINEL DE CARGA POR DISCIPLINA / TAG (GRÁFICO DE BARRAS HORIZONTAL)
  // --------------------------------------------------------------------------
  const disciplineCanvas = document.getElementById('disciplineBarChart');
  if (disciplineCanvas) {
    const disciplineData = {
      labels: [
        'Fontend',
        'Refatoração',
        'Banco de Dados',
        'Requisitos',
        'Backend'
      ],
      datasets: [{
        label: 'Quantidade de Tarefas',
        data: [12, 9, 7, 5, 3], // Exemplo explícito: Matemática (12), História (3)
        backgroundColor: [
          '#3B82F6', // Azul Royal
          '#10B981', // Verde Esmeralda
          '#F97316', // Laranja Quente
          '#60A5FA', // Azul Claro
          '#34D399'  // Menta / Esmeralda Claro
        ],
        borderRadius: 6,
        barPercentage: 0.65
      }]
    };

    new Chart(disciplineCanvas, {
      type: 'bar',
      data: disciplineData,
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#0B1120',
            borderColor: '#10B981',
            borderWidth: 1.5,
            titleColor: '#FFFFFF',
            bodyColor: '#E2E8F0',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (context) => ` ${context.parsed.x} tarefas vinculadas a esta tag`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 14,
            grid: {
              color: 'rgba(255, 255, 255, 0.08)'
            },
            ticks: {
              color: '#94A3B8',
              stepSize: 2,
              font: { weight: '600' }
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              color: '#FFFFFF',
              font: { weight: '700' }
            }
          }
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. PAINEL DE SAÚDE DAS ENTREGAS: VELOCÍMETRO / GAUGE SEMICIRCULAR
  // --------------------------------------------------------------------------
  const healthGaugeCanvas = document.getElementById('healthGaugeChart');
  if (healthGaugeCanvas) {
    const gaugeData = {
      labels: ['No Prazo', 'Com Atraso'],
      datasets: [{
        data: [30, 5],
        backgroundColor: [
          '#10B981', // Verde Esmeralda (No Prazo)
          '#F97316'  // Laranja Quente (Com Atraso)
        ],
        borderWidth: 0,
        circumference: 180,
        rotation: -90
      }]
    };

    new Chart(healthGaugeCanvas, {
      type: 'doughnut',
      data: gaugeData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '76%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#0B1120',
            borderColor: '#10B981',
            borderWidth: 1.5,
            titleColor: '#FFFFFF',
            bodyColor: '#E2E8F0',
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.raw} tarefas`
            }
          }
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. PAINEL DE HISTÓRICO E LINHA DO TEMPO (EVOLUÇÃO TEMPORAL)
  // --------------------------------------------------------------------------
  const timelineCanvas = document.getElementById('timelineLineChart');
  if (timelineCanvas) {
    const timelineData = {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4 (Atual)'],
      datasets: [
        {
          label: 'Tarefas Concluídas',
          data: [6, 11, 15, 10],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.18)',
          borderWidth: 3,
          fill: true,
          tension: 0.35,
          pointRadius: 5,
          pointBackgroundColor: '#34D399',
          pointBorderColor: '#059669',
          pointBorderWidth: 2
        },
        {
          label: 'Novas Demandas (Gaio)',
          data: [8, 14, 12, 11],
          borderColor: '#3B82F6',
          borderWidth: 2.5,
          borderDash: [5, 5],
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: '#60A5FA',
          pointBorderColor: '#1D4ED8',
          fill: false
        }
      ]
    };

    new Chart(timelineCanvas, {
      type: 'line',
      data: timelineData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              color: '#FFFFFF',
              font: { weight: '600' }
            }
          },
          tooltip: {
            backgroundColor: '#0B1120',
            borderColor: '#3B82F6',
            borderWidth: 1.5,
            titleColor: '#FFFFFF',
            bodyColor: '#E2E8F0',
            padding: 10,
            cornerRadius: 8
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 18,
            grid: {
              color: 'rgba(255, 255, 255, 0.08)'
            },
            ticks: {
              color: '#94A3B8',
              stepSize: 3
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#CBD5E1',
              font: { weight: '600' }
            }
          }
        }
      }
    });
  }

})();
