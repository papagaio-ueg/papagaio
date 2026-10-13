# Papagaio 🦜

Documentação introdutória e especificações iniciais do projeto **Papagaio**.

---

## 🛠️ Tecnologias Utilizadas (Front-end Inicial)

* **HTML5:** Estruturação semântica das páginas.
* **CSS3:** Estilização, layout e responsividade (mobile-first / adaptável).
* **JavaScript (Vanilla):** Lógica de manipulação do DOM (alternância dinâmica de formulários) e validação de dados no lado do cliente.

---

## 🖥️ Telas e Regras de Negócio

### 1. Visão Geral (Main)
* **Telas Principais:** A aplicação possui duas telas principais:
  1. **Login / Registro** (`index.html`)
  2. **Dashboard** (`dashboard.html`)
* **Fluxo Inicial:** O sistema inicia obrigatoriamente na tela de **Login**.
* **Transição Login ⇄ Registro:**
  * Ocorrem na mesma página.
  * A troca entre formulários é feita em **1 clique**, alterando apenas o formulário visível via JavaScript, sem recarregar a tela.
* **Responsividade:** Todas as telas devem se adaptar a dispositivos móveis (smartphones) e redimensionar-se com fluidez para tablets e desktops.

---

### 2. Tela de Autenticação

#### 🔹 Login
* **Campos:**
  * **E-mail:** Aceita apenas formato válido de e-mail.
  * **Senha:** Campo de senha protegido.
* **Navegação:** Botão/link visível para alternar para a tela de **Registro**.

#### 🔹 Registro
* **Campos:**
  * **Nome:** Aceita apenas letras (maiúsculas e minúsculas).
  * **E-mail:** Aceita apenas formato válido de e-mail.
  * **Senha:** Campo para definição de senha.
  * **Confirmar Senha:** Validação de correspondência com o campo anterior.
* **Validação:** Todos os campos devem ser preenchidos antes de prosseguir.
* **Fluxo de Verificação por E-mail:**
  1. Após o envio do formulário, um código de verificação é enviado ao e-mail informado.
  2. A interface exibe uma etapa de confirmação com um campo de entrada numérico (*apenas dígitos*).
  3. Ao inserir o código correto e clicar em **Confirmar**, o cadastro é efetivado.
  4. O usuário é redirecionado automaticamente para o formulário de **Login**.

---

### 3. Dashboard
* Estrutura pós-autenticação contendo os itens e funcionalidades do painel principal (painéis/gráficos a serem expandidos).

---

## 📁 Estrutura de Arquivos

Para manter o código organizado entre os membros da equipe, o repositório seguirá a seguinte estrutura padrão:

```text
papagaio/
├── assets/             # Imagens, ícones e logotipos do projeto
├── css/
│   └── style.css       # Estilos globais e responsivos
├── js/
│   └── auth.js         # Autenticação, transição de formulários e validações
├── dashboard.html      # Tela principal pós-login
├── index.html          # Tela de autenticação (Login e Registro)
└── README.md           # Documentação do projeto
```