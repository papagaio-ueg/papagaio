/**
 * PAPAGaio 🦜 - Lógica do Dashboard Analítico
 * Arquivo: js/dashboard.js
 * 
 * Implementa:
 * 1. Recuperação e exibição de dados da sessão autenticada
 * 2. Gráfico Donut (Funil do Kanban: A Fazer, Em Andamento, Concluídas) com Paleta Preto, Dourado e Branco
 * 3. Gráfico de Barras Horizontal (Carga por Disciplina / Tag) em Ouro e Branco
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
  // CONFIGURAÇÃO DOS GRÁFICOS (CHART.JS) - PALETA PRETO, DOURADO E BRANCO
  // ==========================================================================

  // Configuração global de fontes e contraste
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
          '#EF4444', // Vermelho (A Fazer)
          '#D4AF37', // Dourado Nobre (Em Andamento)
          '#FFFFFF'  // Branco Puro (Concluídas)
        ],
        hoverBackgroundColor: [
          '#DC2626',
          '#F5D77F',
          '#E2E8F0'
        ],
        borderWidth: 2,
        borderColor: '#131720',
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
            backgroundColor: '#0E1218',
            borderColor: '#D4AF37',
            borderWidth: 1,
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
        'Matemática',
        'Algoritmos',
        'Banco de Dados',
        'Eng. Software',
        'História'
      ],
      datasets: [{
        label: 'Quantidade de Tarefas',
        data: [12, 9, 7, 5, 3], // Exemplo explícito: Matemática (12), História (3)
        backgroundColor: [
          '#D4AF37', // Dourado Nobre
          '#F5D77F', // Dourado Claro
          '#FFFFFF', // Branco
          '#AA771C', // Dourado Escuro
          '#CBD5E1'  // Prata / Branco Suave
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
            backgroundColor: '#0E1218',
            borderColor: '#D4AF37',
            borderWidth: 1,
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
              color: 'rgba(255, 255, 255, 0.06)'
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
          '#D4AF37', // Dourado Nobre
          '#EF4444'  // Vermelho
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
            backgroundColor: '#0E1218',
            borderColor: '#D4AF37',
            borderWidth: 1,
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
          borderColor: '#D4AF37',
          backgroundColor: 'rgba(212, 175, 55, 0.16)',
          borderWidth: 3,
          fill: true,
          tension: 0.35,
          pointRadius: 5,
          pointBackgroundColor: '#F5D77F',
          pointBorderColor: '#D4AF37',
          pointBorderWidth: 2
        },
        {
          label: 'Novas Demandas (Gaio)',
          data: [8, 14, 12, 11],
          borderColor: '#FFFFFF',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: '#FFFFFF',
          pointBorderColor: '#0E1218',
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
            backgroundColor: '#0E1218',
            borderColor: '#D4AF37',
            borderWidth: 1,
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
              color: 'rgba(255, 255, 255, 0.06)'
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
