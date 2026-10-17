# Checklist de Desenvolvimento - PAPAGaio 🦜

Status do Projeto: 🟢 **Concluído e Atualizado**

---

## 📋 Fase 1: Planejamento e Decisões Alinhadas
- [x] Criação do arquivo de documentação de contexto (`context.md`)
- [x] Criação da lista de verificação de requisitos (`Checklist.md`)
- [x] Decisão de Gráficos: Chart.js via CDN aprovado
- [x] Decisão de Escopo: Remoção do requisito de cargos (Aluno/Professor), foco em Dashboard consolidado único
- [x] Decisão de Verificação: Notificação Toast dinâmica com o código de 6 dígitos
- [x] Decisão Visual Atualizada: **Tema Claro com Paleta Papagaio / Gaio** (Verde Esmeralda `#059669`, Azul Petróleo `#0F4C5C` e Amarelo Solar / Laranja Tropical `#F59E0B`/`#EA580C`)

---

## 🎨 Fase 2: Identidade Visual e Estilos Globais (`css/style.css`)
- [x] Criação e atualização de `assets/logo.svg` e `assets/favicon.svg` com a paleta do Papagaio (Esmeralda, Petróleo e Laranja Solar)
- [x] Definição do Design System em Tema Claro com as variáveis CSS de superfícies claras, tipografia nítida e cores vibrantes
- [x] Estilos base de tipografia, resets, sombras suaves e bordas arredondadas modernas
- [x] Estilização dos componentes reutilizáveis:
  - [x] Formulários, inputs com validação visual e ícones em Azul Petróleo e Esmeralda
  - [x] Botões primários com gradiente Verde Esmeralda para Azul Petróleo e texto contrastante
  - [x] Cards de métricas com indicadores e badges coloridos no tema claro
  - [x] Toast notification moderno flutuante com borda esmeralda e badge de código
- [x] Garantia de responsividade completa (*Mobile-first*, Tablets e Desktops)

---

## 🔐 Fase 3: Autenticação e Validações (`index.html` e `js/auth.js`)
- [x] Estruturação semântica do `index.html` contendo os containers de Login e Registro
- [x] Implementação da alternância entre Login e Registro em **1 clique** (sem reload de tela)
- [x] Formulário de Login:
  - [x] Campo de usuário aceitando exclusivamente e-mail válido
  - [x] Campo de senha protegido
  - [x] Botão visível de atalho para Registro
  - [x] Tratamento de erros e feedback visual
- [x] Formulário de Registro:
  - [x] Campos: Nome, E-mail, Senha e Confirmação de Senha
  - [x] Validação estrita: Nome aceita apenas letras (maiúsculas/minúsculas, espaços e acentos), bloqueando números e símbolos
  - [x] Validação de e-mail e correspondência obrigatória das duas senhas
  - [x] Bloqueio de avanço com campos incompletos ou inválidos
- [x] Fluxo de Verificação de E-mail:
  - [x] Transição suave para a etapa de confirmação de código
  - [x] Input aceitando exclusivamente dígitos numéricos (com bloqueio imediato de letras)
  - [x] Disparo de notificação Toast com código simulado gerado
  - [x] Botão de confirmação com validação
  - [x] Redirecionamento automático para a tela de Login com mensagem de sucesso

---

## 📊 Fase 4: Dashboard Analítico (`dashboard.html` e `js/dashboard.js`)
- [x] Estrutura semântica do `dashboard.html` com Navbar, Sidebar/Menu e Grid de Cards e Gráficos em tema claro
- [x] Integração do Chart.js via CDN com tipografia e eixos ajustados para tema claro
- [x] **Painel de Status das Tarefas (Funil do Kanban):**
  - [x] Gráfico de Rosca (Donut): "A Fazer" (Laranja Tropical `#EA580C`), "Em Andamento" (Azul Petróleo `#0E7490`) e "Concluídas" (Verde Esmeralda `#059669`)
  - [x] Card de destaque numérico: "Total de tarefas pendentes na semana" com borda solar e gradiente tropical
- [x] **Painel de Carga por Disciplina/Tag:**
  - [x] Gráfico de Barras Horizontal com tarefas por tag (Matemática: 12, História: 3, Algoritmos: 9, Banco de Dados: 7, Eng. Software: 5) na paleta do Papagaio
- [x] **Painel de Prazos e Entregas (Saúde das Entregas):**
  - [x] Indicador visual tipo velocímetro / semicírculo gauge (86% no prazo em Verde Esmeralda vs. 14% atrasos em Laranja)
  - [x] Lista/Cards de gargalos da semana e prazos iminentes no tema claro
- [x] **Painel de Tendência Temporal / Histórico:**
  - [x] Gráfico de linha mostrando ritmo de conclusão de tarefas em Verde Esmeralda e Azul Petróleo
- [x] Botão de Logout com retorno suave ao `index.html`

---

## 📱 Fase 5: Testes de Responsividade e Validações Finais
- [x] Teste em dispositivos móveis (360px - 480px)
- [x] Teste em tablets (768px - 1024px)
- [x] Teste em desktops (> 1200px)
- [x] Teste de todos os fluxos de validação de formulário
- [x] Finalização e entrega
