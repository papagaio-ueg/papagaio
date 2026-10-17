# Contexto do Projeto: PAPAGaio 🦜

## 1. Visão Geral
O **PAPAGaio** é uma plataforma de inteligência analítica e dashboard educacional integrada ao ecossistema **Gaio** da UEG (Universidade Estadual de Goiás). O objetivo principal é consolidar, monitorar e apresentar de forma visual e intuitiva métricas essenciais de produtividade, gestão de tarefas no Kanban e saúde das entregas para os usuários.

---

## 2. Tecnologias e Decisões de Arquitetura
* **HTML5:** Marcação semântica das páginas para acessibilidade, clareza estrutural e SEO.
* **CSS3:** Estilização moderna (CSS Variables, Flexbox, CSS Grid), layout fluido e responsividade total (*mobile-first*, tablets e desktops).
* **Biblioteca de Gráficos:** **Chart.js (CDN)** para renderização de gráficos responsivos, interativos e com animações fluidas (Rosca, Barras Horizontais, Linhas e Medidores).
* **Paleta de Cores Oficial (Dark Slate & Cores da Arara):**
  * **Emblema Oficial:** Círculo minimalista escuro com a arara geométrica estilizada em Azul Royal, Verde Esmeralda, Bico Laranja e face Branca.
  * **Superfícies Dark Slate:** `#0B1120` (Fundo principal da aplicação), `#162032` (Superfície dos cards e containers), `#101927` (Painéis internos e inputs).
  * **Azul Royal (Corpo da Arara):** `#2563EB` / `#3B82F6` (Botões de ação primários, status "Em Andamento", foco de campos e realces).
  * **Verde Esmeralda (Asa da Arara):** `#10B981` / `#34D399` (Status "Concluídas", badges de sucesso e botões de confirmação).
  * **Laranja Quente (Bico da Arara):** `#F97316` / `#EA580C` (Status "A Fazer", card de métrica em destaque e prazos iminentes).
  * **Tipografia de Alto Contraste (100% Visível):** `#FFFFFF` (Títulos, números e valores de alto impacto), `#E2E8F0` (Textos de corpo e formulários), `#94A3B8` (Legendas de apoio).
* **Simulação de E-mail:** Notificação Toast escura moderna com borda azul royal e código numérico de 6 dígitos em badge estilizado.
* **Simplificação de Escopo:** Conforme alinhamento prévio com o usuário, a divisão por cargos (Aluno vs. Professor) foi removida, mantendo uma visão unificada e rica focada no fluxo completo do usuário.

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

## 3.2. Dashboard Analítico Unificado (`dashboard.html` e `js/dashboard.js`)
O dashboard do PAPAGaio consolida os dados operacionais do Kanban e do Gaio:

1. **Painel de Status das Tarefas (O "Funil" do Kanban):**
   * Gráfico de Rosca (Donut):
     * *A Fazer* (Laranja Quente `#F97316`)
     * *Em Andamento* (Azul Royal `#3B82F6`)
     * *Concluídas* (Verde Esmeralda `#10B981`)
   * Métrica em destaque (Card numérico de alto impacto com borda e gradiente da Arara): **"Total de tarefas pendentes na semana"**.

2. **Painel de Carga por Disciplina/Tag (Gráfico de Barras Horizontal):**
   * Mapeamento do esforço por etiquetas coloridas do Gaio.
   * Apresenta o número de tarefas por disciplina (ex.: *Matemática: 12 tarefas*, *História: 3 tarefas*, *Algoritmos: 9 tarefas*, etc.) com a paleta da Arara (Azul Royal, Verde Esmeralda, Laranja e Azul Claro).

3. **Painel de Prazos e Entregas (Saúde das Entregas):**
   * Indicador visual de velocímetro de saúde das entregas (% no prazo em Verde Esmeralda vs. % com atraso em Laranja).
   * Identificação dos gargalos e prazos da semana com cards contrastantes no tema Dark Slate (100% de legibilidade).

4. **Painel de Histórico e Linha do Tempo de Produtividade:**
   * Gráfico de evolução temporal de conclusão de tarefas em Verde Esmeralda e Azul Royal ao longo das semanas.

---

## 4. Estrutura de Arquivos do Repositório
```text
papagaio/
├── assets/             # Logotipos e Favicon PNG de alta resolução gerados a partir do novo emblema
├── css/
│   └── style.css       # Folha de estilo unificada (Tema Dark Slate Arara)
├── js/
│   ├── auth.js         # Lógica de autenticação, transições e validações
│   └── dashboard.js    # Lógica de renderização de gráficos Chart.js no tema escuro
├── dashboard.html      # Visão analítica pós-login em tema Dark Slate
├── index.html          # Ponto de entrada (Login, Registro e Verificação de E-mail)
├── context.md          # Especificação e arquitetura do projeto
├── Checklist.md        # Acompanhamento detalhado das etapas e entregas
└── README.md           # Apresentação geral do repositório
```

---

## 5. Repositório Oficial
* **GitHub:** [https://github.com/papagaio-ueg/papagaio/](https://github.com/papagaio-ueg/papagaio/)
