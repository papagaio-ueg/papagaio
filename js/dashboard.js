/**
 * PAPAGaio 🦜 - Lógica do Dashboard Analítico (Dark Slate Theme)
 * Arquivo: js/dashboard.js
 * 
 * Implementa:
 * 1. Recuperação e exibição de dados da sessão autenticada
 * 2. Gráfico Donut (Funil do Kanban: A Fazer, Em Andamento, Concluídas) com Paleta da Arara
 * 3. Gráfico de Barras Horizontal (Carga por Disciplina / Tag) em Azul, Verde e Laranja
 * 4. Indicador Velocímetro / Gauge (Saúde das Entregas no Prazo vs. Atrasos)
 * 5. Gráfico de Linha (Evolução Temporal de Entregas)
 * 6. Tratamento de Logout e responsividade dos gráficos
 */

(function () {
  'use strict';

  // ==========================================================================
  // INFORMAÇÕES DO USUÁRIO E SESSÃO
  // ==========================================================================
  const userNameDisplay = document.getElementById('userNameDisplay');
  const userEmailDisplay = document.getElementById('userEmailDisplay');
  const userAvatar = document.getElementById('userAvatar');
  const btnLogout = document.getElementById('btnLogout');
  const currentDateDisplay = document.getElementById('currentDateDisplay');

  // Recupera dados salvos na autenticação
  const rawSession = sessionStorage.getItem('papagaio_current_user');
  let currentUser = {
    name: 'Estudante Gaio',
    email: 'aluno@ueg.br'
  };

  if (rawSession) {
    try {
      const parsed = JSON.parse(rawSession);
      if (parsed.name) currentUser.name = parsed.name;
      if (parsed.email) currentUser.email = parsed.email;
    } catch (e) {
      console.warn('Erro ao carregar sessão:', e);
    }
  }

  // Atualiza elementos do DOM com o perfil
  if (userNameDisplay) userNameDisplay.textContent = currentUser.name;
  if (userEmailDisplay) userEmailDisplay.textContent = currentUser.email;
  if (userAvatar) {
    const initials = currentUser.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0].toUpperCase())
      .join('');
    userAvatar.textContent = initials || 'PG';
  }

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
