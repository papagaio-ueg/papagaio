# Contexto do Projeto: PAPAGaio 🦜

## 1. Visão Geral
O **PAPAGaio** é uma plataforma de inteligência analítica e dashboard educacional integrada ao ecossistema **Gaio** da UEG (Universidade Estadual de Goiás). O objetivo principal é consolidar, monitorar e apresentar de forma visual e intuitiva métricas essenciais de produtividade, gestão de tarefas no Kanban e saúde das entregas para os usuários.

---

## 2. Tecnologias e Decisões de Arquitetura
* **HTML5:** Marcação semântica das páginas para acessibilidade, clareza estrutural e SEO.
* **CSS3:** Estilização moderna (CSS Variables, Flexbox, CSS Grid), layout fluido e responsividade total (*mobile-first*, tablets e desktops).
* **JavaScript (Vanilla):** Manipulação dinâmica do DOM, alternância de formulários sem reload de página, validações de entrada em tempo real e orquestração de dados analíticos.
* **Biblioteca de Gráficos:** **Chart.js (CDN)** para renderização de gráficos responsivos, interativos e com animações fluidas (Rosca, Barras Horizontais, Linhas e Medidores).
* **Paleta de Cores (Ardósia):**
  * `#BEBEBE` (Ardósia Claro / Bordas e Neutros)
  * `#79ED91` (Verde Vibrante / Destaque de Sucesso e Concluídas)
  * `#698696` (Azul Ardósia / Primário e Cabeçalhos)
  * `#4DBE55` (Verde Médio / Ações e Indicadores Positivos)
  * `#71776D` (Cinza Musgo Ardósia / Textos secundários e apoios)
* **Simulação de E-mail:** Notificação Toast com o código de 6 dígitos gerado aleatoriamente para validação ágil no front-end.
* **Simplificação de Escopo:** Conforme alinhamento com o usuário, a divisão por cargos (Aluno vs. Professor) foi removida, mantendo uma visão unificada e rica focada no fluxo completo do usuário.

---

## 3. Arquitetura de Telas e Regras de Negócio

### 3.1. Autenticação (`index.html` e `js/auth.js`)
* **Ponto de Entrada:** A aplicação inicia obrigatoriamente na tela de **Login**.
* **Unificação Login ⇄ Registro:**
  * Ambos os formulários coexistem na mesma página (`index.html`).
  * A alternância entre Login e Registro ocorre em **1 único clique**, substituindo apenas o formulário visível via JavaScript com transição suave, sem recarregar a tela.
* **Formulário de Login:**
  * Campo de e-mail (validação estrita de formato de e-mail).
  * Campo de senha com controle de visibilidade.
  * Botão visível para alternar para o formulário de Registro.
* **Formulário de Registro:**
  * Campos: Nome Completo, E-mail, Senha e Confirmação de Senha.
  * Validação de caracteres:
    * **Nome:** Aceita exclusivamente letras maiúsculas e minúsculas (incluindo espaços e acentuação gráfica). Bloqueia números e caracteres especiais.
    * **E-mail:** Formato válido de e-mail.
    * **Senhas:** Devem coincidir e possuir preenchimento completo.
  * Bloqueio estrito de avanço se qualquer campo estiver incompleto ou inválido.
* **Fluxo de Verificação por E-mail:**
  1. Após o envio válido do formulário de registro, a interface avança para a etapa de verificação.
  2. Um código numérico de 6 dígitos é gerado e exibido via notificação (Toast).
  3. Campo de entrada exclusivo para números (`input type="text"` com filtro numérico estrito).
  4. Botão "Confirmar": ao bater com o código enviado, o usuário é cadastrado com sucesso.
  5. Redirecionamento automático e imediato para a tela/formulário de Login com mensagem de sucesso.

---

### 3.2. Dashboard Analítico Unificado (`dashboard.html` e `js/dashboard.js`)
O dashboard do PAPAGaio consolida os dados operacionais do Kanban e do Gaio:

1. **Painel de Status das Tarefas (O "Funil" do Kanban):**
   * Gráfico de Rosca (Donut):
     * *A Fazer* (Vermelho / Coral)
     * *Em Andamento* (Amarelo / Âmbar)
     * *Concluídas* (Verde `#4DBE55` / `#79ED91`)
   * Métrica em destaque (Card numérico de alto impacto): **"Total de tarefas pendentes na semana"**.

2. **Painel de Carga por Disciplina/Tag (Gráfico de Barras Horizontal):**
   * Mapeamento do esforço por etiquetas coloridas do Gaio.
   * Apresenta o número de tarefas por disciplina (ex.: *Matemática: 12 tarefas*, *História: 3 tarefas*, *Programação: 9 tarefas*, etc.).

3. **Painel de Prazos e Entregas (Saúde das Entregas):**
   * Indicador visual de velocímetro / saúde das entregas (% no prazo vs. % com atraso).
   * Identificação dos gargalos e prazos da semana.

4. **Painel de Histórico e Linha do Tempo de Produtividade:**
   * Gráfico de evolução temporal de conclusão de tarefas ao longo das semanas/meses.

---

## 4. Estrutura de Arquivos do Repositório
```text
papagaio/
├── assets/             # Logotipos SVG, ícones e ilustrações
├── css/
│   └── style.css       # Folha de estilo unificada e responsiva (Paleta Ardósia)
├── js/
│   ├── auth.js         # Lógica de autenticação, transições e validações
│   └── dashboard.js    # Lógica de renderização de gráficos Chart.js e métricas
├── dashboard.html      # Visão analítica pós-login
├── index.html          # Ponto de entrada (Login, Registro e Verificação de E-mail)
├── context.md          # Especificação e arquitetura do projeto
├── Checklist.md        # Acompanhamento detalhado das etapas e entregas
└── README.md           # Apresentação geral do repositório
```

---

## 5. Repositório Oficial
* **GitHub:** [https://github.com/papagaio-ueg/papagaio/](https://github.com/papagaio-ueg/papagaio/)
