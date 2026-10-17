# Contexto do Projeto: PAPAGaio 🦜

## 1. Visão Geral
O **PAPAGaio** é uma plataforma de inteligência analítica e dashboard educacional integrada ao ecossistema **Gaio** da UEG (Universidade Estadual de Goiás). O objetivo principal é consolidar, monitorar e apresentar de forma visual e intuitiva métricas essenciais de produtividade, gestão de tarefas no Kanban e saúde das entregas para os usuários.

---

## 2. Tecnologias e Decisões de Arquitetura
* **HTML5:** Marcação semântica das páginas para acessibilidade, clareza estrutural e SEO.
* **CSS3:** Estilização moderna (CSS Variables, Flexbox, CSS Grid), layout fluido e responsividade total (*mobile-first*, tablets e desktops).
* **Biblioteca de Gráficos:** **Chart.js (CDN)** para renderização de gráficos responsivos, interativos e com animações fluidas (Rosca, Barras Horizontais, Linhas e Medidores).
* **Paleta de Cores Oficial (Tema Claro Papagaio / Gaio):**
  * **Verde Esmeralda:** `#059669` (Primário da marca e tarefas concluídas), `#10B981` (Esmeralda claro), `#ECFDF5` (Fundos suaves de badges)
  * **Azul Petróleo:** `#0F4C5C` (Primário institucional), `#155E75` e `#0E7490` (Em Andamento e apoio visual), `#0B3642` (Petróleo profundo)
  * **Amarelo Solar & Laranja Tropical:** `#F59E0B` (Amarelo / Âmbar de atenção), `#EA580C` (Laranja vivo para "A Fazer" e prazos)
  * **Superfícies em Tema Claro:** `#F4F7F6` (Fundo geral arejado), `#FFFFFF` (Cards, formulários e navbar com sombras sutis)
  * **Tipografia de Alto Contraste:** `#0F172A` (Títulos e textos principais), `#334155` (Secundários), `#64748B` (Apoios)
* **Simulação de E-mail:** Notificação Toast moderna em tema claro com borda verde esmeralda e código numérico de 6 dígitos em badge estilizado.
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
     * *A Fazer* (Laranja Tropical `#EA580C`)
     * *Em Andamento* (Azul Petróleo `#0E7490`)
     * *Concluídas* (Verde Esmeralda `#059669`)
   * Métrica em destaque (Card numérico de alto impacto com borda solar e gradiente tropical): **"Total de tarefas pendentes na semana"**.

2. **Painel de Carga por Disciplina/Tag (Gráfico de Barras Horizontal):**
   * Mapeamento do esforço por etiquetas coloridas do Gaio.
   * Apresenta o número de tarefas por disciplina (ex.: *Matemática: 12 tarefas*, *História: 3 tarefas*, *Algoritmos: 9 tarefas*, etc.) com a paleta do Papagaio (Esmeralda, Petróleo, Amarelo e Laranja).

3. **Painel de Prazos e Entregas (Saúde das Entregas):**
   * Indicador visual de velocímetro de saúde das entregas (% no prazo em Verde Esmeralda vs. % com atraso em Laranja).
   * Identificação dos gargalos e prazos da semana com cards contrastantes no tema claro.

4. **Painel de Histórico e Linha do Tempo de Produtividade:**
   * Gráfico de evolução temporal de conclusão de tarefas em Verde Esmeralda e Azul Petróleo ao longo das semanas.

---

## 4. Estrutura de Arquivos do Repositório
```text
papagaio/
├── assets/             # Logotipos e Favicon SVG (Paleta Papagaio: Esmeralda, Petróleo e Laranja)
├── css/
│   └── style.css       # Folha de estilo unificada (Tema Claro Papagaio)
├── js/
│   ├── auth.js         # Lógica de autenticação, transições e validações
│   └── dashboard.js    # Lógica de renderização de gráficos Chart.js
├── dashboard.html      # Visão analítica pós-login em tema claro
├── index.html          # Ponto de entrada (Login, Registro e Verificação de E-mail)
├── context.md          # Especificação e arquitetura do projeto
├── Checklist.md        # Acompanhamento detalhado das etapas e entregas
└── README.md           # Apresentação geral do repositório
```

---

## 5. Repositório Oficial
* **GitHub:** [https://github.com/papagaio-ueg/papagaio/](https://github.com/papagaio-ueg/papagaio/)
