# Checklist de Desenvolvimento - PAPAGaio 🦜

Status do Projeto: 🟢 **Concluído e Atualizado**

---

## 📋 Fase 1: Planejamento e Decisões Alinhadas
- [x] Criação do arquivo de documentação de contexto (`context.md`)
- [x] Criação da lista de verificação de requisitos (`Checklist.md`)
- [x] Decisão de Gráficos: Chart.js via CDN aprovado
- [x] Decisão de Escopo: Remoção do requisito de cargos (Aluno/Professor), foco em Dashboard consolidado único
- [x] Decisão de Verificação: Notificação Toast dinâmica com o código de 6 dígitos
- [x] Decisão Visual Atualizada: **Tema Dark Slate com Paleta Oficial da Arara** (`#0B1120` Midnight Navy, Azul Royal `#2563EB`/`#3B82F6`, Verde Esmeralda `#10B981`, Laranja Quente `#F97316` e tipografia branca/clara `#FFFFFF`/`#E2E8F0` com 100% de contraste e legibilidade, eliminando problemas de fundo branco e texto invisível)

---

## 🎨 Fase 2: Identidade Visual e Estilos Globais (`css/style.css`)
- [x] Integração do novo emblema oficial circular da Arara em `assets/logo.png` e `assets/favicon.png` com transparência real
- [x] Definição do Design System em Tema Dark Slate (`#0B1120` e `#162032`) com tipografia nítida (`#FFFFFF` e `#E2E8F0`)
- [x] Estilos base de tipografia, resets, sombras profundas e bordas arredondadas modernas
- [x] Estilização dos componentes reutilizáveis:
  - [x] Formulários e inputs com fundo escuro, texto branco visível, placeholder suave e foco em Azul Royal
  - [x] Botões primários com gradiente Azul Royal para Verde Esmeralda com efeito hover dinâmico
  - [x] Cards de métricas com indicadores e badges coloridos no tema escuro
  - [x] Toast notification moderno flutuante com borda azul e badge de código visível
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
- [x] Estrutura semântica do `dashboard.html` com Navbar, Sidebar/Menu e Grid de Cards e Gráficos em tema Dark Slate
- [x] Integração do Chart.js via CDN com tipografia clara `#CBD5E1` e eixos ajustados para tema escuro
- [x] **Painel de Status das Tarefas (Funil do Kanban):**
  - [x] Gráfico de Rosca (Donut): "A Fazer" (Laranja Quente `#F97316`), "Em Andamento" (Azul Royal `#3B82F6`) e "Concluídas" (Verde Esmeralda `#10B981`)
  - [x] Card de destaque numérico: "Total de tarefas pendentes na semana" com borda e gradiente da Arara
- [x] **Painel de Carga por Disciplina/Tag:**
  - [x] Gráfico de Barras Horizontal com tarefas por tag (Matemática: 12, História: 3, Algoritmos: 9, Banco de Dados: 7, Eng. Software: 5) na paleta da Arara
- [x] **Painel de Prazos e Entregas (Saúde das Entregas):**
  - [x] Indicador visual tipo velocímetro / semicírculo gauge (86% no prazo em Verde Esmeralda vs. 14% atrasos em Laranja)
  - [x] Lista/Cards de gargalos da semana e prazos iminentes no tema Dark Slate com contraste total
- [x] **Painel de Tendência Temporal / Histórico:**
  - [x] Gráfico de linha mostrando ritmo de conclusão de tarefas em Verde Esmeralda e Azul Royal
- [x] Botão de Logout com retorno suave ao `index.html`

---

## 📱 Fase 5: Testes de Responsividade e Validações Finais
- [x] Teste em dispositivos móveis (360px - 480px)
- [x] Teste em tablets (768px - 1024px)
- [x] Teste em desktops (> 1200px)
- [x] Teste de todos os fluxos de validação de formulário
- [x] Finalização e entrega
