# 🎯 Desafio Técnico QA - BeTalent

Este repositório contém a resolução do desafio técnico prático para a vaga de QA (Quality Assurance) na BeTalent. O projeto engloba testes de API (Restful-Booker) e automação E2E de Interface (Sauce Demo), utilizando padrões de projeto e boas práticas de engenharia de software.

## 🛠️ Tecnologias e Arquitetura Utilizadas
* **Cypress & JavaScript:** Automação de UI com padrão de Custom Commands e Data-Driven Testing (Fixtures).
* **Postman:** Mapeamento e testes E2E de contrato e performance de API.
* **Newman & GitHub Actions:** Implementação de pipeline de Integração Contínua (CI) para execução automatizada dos testes de API na nuvem.
* **Node.js:** Gerenciamento de dependências.

---

## ⚙️ Parte 1: Testes de API (Restful-Booker)

A validação da API foi estruturada no Postman, contemplando um CRUD completo (Autenticação, Criação, Busca, Atualização e Exclusão). 

O arquivo da collection (`BeTalent - Restful-Booker API.postman_collection.json`) está anexado na raiz deste repositório.

### 📌 Estratégia e Premissas Identificadas
Durante a análise exploratória, identifiquei uma característica crucial da infraestrutura do Restful-Booker: **o banco de dados é volátil e reseta em curtos períodos de tempo (aprox. 10 minutos)**. 
Para garantir a resiliência dos testes automatizados, a esteira foi desenhada de forma encadeada: a execução de métodos `GET`, `PUT` e `DELETE` depende intrinsecamente de um `POST` executado imediatamente antes, com passagem dinâmica de variáveis de ambiente (`bookingid` e `token`), garantindo que o recurso exista no momento da requisição.

### 🚀 Nível 2 - Automação e Integração Contínua (CI/CD)
Foram implementados scripts de validação na API garantindo:
* **Validação de Contrato:** Tipagem estrita de dados e presença de campos obrigatórios.
* **Performance:** Validação de tempo de resposta (`responseTime`) abaixo de limites aceitáveis (< 1000ms).
* **CI/CD:** O projeto conta com um workflow do GitHub Actions que executa a suíte de testes da API via **Newman** a cada push no repositório, garantindo feedback contínuo.

---

## 💻 Parte 2: Testes E2E de Interface (Sauce Demo)

A automação do Front-end foi construída com Cypress, saindo de scripts procedurais básicos para uma arquitetura escalável utilizando `Custom Commands` (evitando repetição de código) e separação de massa de dados via `Fixtures`.

### 🚀 Como executar os testes de UI localmente
1. Clone o repositório.
2. Instale as dependências executando: `npm install`
3. Abra a interface do Cypress: `npx cypress open` ou rode em modo headless: `npx cypress run`

### 📝 Cenários Automatizados
* **Cenário 1:** Login com credenciais válidas (Caminho Feliz).
* **Cenário 2:** Validação de segurança para usuário bloqueado (Caminho Triste).
* **Cenário 3:** Fluxo transacional completo de compra (End-to-End).

---

## 🐛 Relatório de Bugs (Testes Exploratórios)

Durante a execução de fluxos alternativos, foram identificadas falhas críticas de usabilidade e renderização no sistema web.

### 🔴 BUG-001: Botão "Add to cart" inativo e falha no carregamento dos assets visuais do catálogo.
* **Ambiente:** Sauce Demo (Perfil: `problem_user`)
* **Severidade:** 🔴 Alta (Impede fluxo de compra e compromete a vitrine).
* **Passos para reproduzir:**
  1. Realizar login com as credenciais `problem_user` e `secret_sauce`.
  2. Na tela principal (Inventory), tentar adicionar múltiplos produtos ao carrinho.
* **Resultado Atual:** O sistema bloqueia a adição ao carrinho após 3 itens específicos ("Sauce Labs Bolt T-Shirt", "Sauce Labs Fleece Jacket", etc). O botão não responde e o badge do carrinho não atualiza. Além disso, todas as imagens dos produtos apresentam erro de rota, sendo renderizadas com o mesmo placeholder incorreto de um cachorro.

### 🔴 BUG-002: Falha no funcionamento do Filtro de Ordenação
* **Ambiente:** Sauce Demo (Perfil: `problem_user` e `error_user`)
* **Severidade:** Média
* **Passos para reproduzir:**
  1. Realizar login e acessar a página de Produtos.
  2. Clicar no dropdown de filtros (canto superior direito).
  3. Selecionar a ordenação "Name (Z to A)" ou "Price (low to high)".
* **Resultado Atual:** A interface ignora o comando do usuário. A vitrine de produtos não é reordenada de acordo com o critério selecionado, mantendo a listagem estática padrão (A-Z), caracterizando falha na funcionalidade de filtro.

### 🔴 BUG-003: Bloqueio na finalização de compra (Erro de Validação de Input)
* **Ambiente:** Sauce Demo (Perfil: `error_user`)
* **Severidade:** Crítica (Blocker)
* **Passos para reproduzir:**
  1. Realizar login com `error_user` e adicionar qualquer item ao carrinho.
  2. Acessar o carrinho e clicar em "Checkout".
  3. Preencher os dados corretamente (First Name, Last Name e Postal Code).
  4. Clicar em "Continue".
* **Resultado Atual:** O sistema apaga silenciosamente o input do campo "Last Name" no momento da submissão e exibe a mensagem de erro "Error: Last Name is required", impossibilitando o usuário de avançar para a tela de revisão e concluir a compra.

---

*Desenvolvido por Gabriel Lelis Costa Santos.*