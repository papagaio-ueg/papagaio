# Checklist de Desenvolvimento - PAPAGaio 🦜

Status do Projeto: 🟢 **Concluído e Atualizado**

---

## 📋 Fase 1: Planejamento e Decisões Alinhadas
- [x] Criação do arquivo de documentação de contexto (`context.md`)
- [x] Criação da lista de verificação de requisitos (`Checklist.md`)
- [x] Decisão de Gráficos: Chart.js via CDN aprovado
- [x] Decisão de Escopo: Remoção do requisito de cargos (Aluno/Professor), foco em Dashboard consolidado único
- [x] Decisão de Verificação: Notificação Toast dinâmica com o código de 6 dígitos
- [x] Decisão Visual Atualizada: **Paleta Preto, Dourado e Branco** (`#0B0E14`, `#131720`, `#D4AF37`, `#F5D77F`, `#AA771C`, `#FFFFFF`)

---

## 🎨 Fase 2: Identidade Visual e Estilos Globais (`css/style.css`)
- [x] Criação do diretório `assets/` e ícone/logo SVG do PAPAGaio com Paleta Preto, Dourado e Branco
- [x] Definição do Design System com as variáveis CSS de Preto Ônix, Ouro Metálico e Branco Puro
- [x] Estilos base de tipografia, resets, sombras e bordas arredondadas modernas
- [x] Estilização dos componentes reutilizáveis:
  - [x] Formulários, inputs com validação visual e ícones dourados
  - [x] Botões primários com gradiente dourado nobre e texto preto contrastante
  - [x] Cards de métricas com indicadores e badges dourados e brancos
  - [x] Toast notification flutuante para feedback de mensagens e código de verificação
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
- [x] Estrutura semântica do `dashboard.html` com Navbar, Sidebar/Menu e Grid de Cards e Gráficos
- [x] Integração do Chart.js via CDN
- [x] **Painel de Status das Tarefas (Funil do Kanban):**
  - [x] Gráfico de Rosca (Donut): "A Fazer" (Coral `#EF4444`), "Em Andamento" (Dourado `#D4AF37`) e "Concluídas" (Branco `#FFFFFF`)
  - [x] Card de destaque numérico: "Total de tarefas pendentes na semana" em gradiente dourado
- [x] **Painel de Carga por Disciplina/Tag:**
  - [x] Gráfico de Barras Horizontal com tarefas por tag (Matemática: 12, História: 3, Algoritmos: 9, Banco de Dados: 7, Eng. Software: 5) em Ouro e Branco
- [x] **Painel de Prazos e Entregas (Saúde das Entregas):**
  - [x] Indicador visual tipo velocímetro / semicírculo gauge em Ouro e Vermelho (86% no prazo vs. 14% atrasos)
  - [x] Lista/Cards de gargalos da semana e prazos iminentes
- [x] **Painel de Tendência Temporal / Histórico:**
  - [x] Gráfico de linha mostrando ritmo de conclusão de tarefas em Ouro reluzente e Branco
- [x] Botão de Logout com retorno suave ao `index.html`

---

## 📱 Fase 5: Testes de Responsividade e Validações Finais
- [x] Teste em dispositivos móveis (360px - 480px)
- [x] Teste em tablets (768px - 1024px)
- [x] Teste em desktops (> 1200px)
- [x] Teste de todos os fluxos de validação de formulário
- [x] Finalização e entrega
