# Desafio Técnico QA - BeTalent

Este repositório contém a documentação e o código-fonte da resolução do desafio técnico prático para a vaga de QA (Quality Assurance) na BeTalent. O projeto abrange testes automatizados de API (Restful-Booker) e automação End-to-End (E2E) de Interface (Sauce Demo), integrados em uma pipeline de CI/CD.

## Tecnologias e Frameworks Utilizados

- **Cypress (v13+):** Framework principal para automação de testes E2E de UI.
- **JavaScript:** Linguagem base para a escrita dos testes da interface.
- **Postman:** Ferramenta para mapeamento, modelagem e testes de contrato/integração da API.
- **Newman:** CLI do Postman utilizado para executar a collection de testes da API localmente e na esteira.
- **GitHub Actions:** Serviço de Integração Contínua (CI) para execução autônoma dos testes a cada push.
- **Node.js & npm:** Gerenciamento de pacotes e dependências estruturais do projeto.

## Estrutura do Projeto (Árvore de Pastas)

```text
teste-pratico-qa-betalent/
├── .github/workflows/
│   └── api-tests.yml                  # Configuração da pipeline de CI/CD no GitHub Actions
├── cypress/
│   ├── e2e/
│   │   └── saucedemo.cy.js            # Cenários de teste automatizados de interface
│   ├── fixtures/
│   │   └── massaDeDados.json          # Massa de dados externa (Data-Driven Testing)
│   └── support/
│       ├── commands.js                # Custom Commands para abstração de ações repetitivas
│       └── e2e.js                     # Configurações globais do framework Cypress
├── evidencias-api/                    # Capturas de tela comprovando execuções e fluxos manuais
├── .gitignore                         # Diretivas de arquivos ignorados pelo versionamento
├── BeTalent - Restful-Booker API...   # Collection exportada do Postman contendo o CRUD mapeado
├── cypress.config.js                  # Arquivo de configuração central de propriedades do Cypress
├── package.json                       # Metadados do projeto, dependências instaladas e scripts
└── README.md                          # Documentação central e guia de execução

## Instalação e Configuração Local

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (versão 18 ou superior)

### Passos de Instalação
1. Clone este repositório para a sua máquina local:
```bash
git clone https://github.com/gabrielleliis/teste-pratico-qa-betalent.git
```
2. Navegue até o diretório raiz do projeto:
```bash
cd teste-pratico-qa-betalent
```
3. Instale as dependências:
```bash
npm install
```

## Execução dos Testes

### Parte 1: Testes E2E de Interface (Cypress)
A automação de UI foi construída com foco em escalabilidade e manutenção, utilizando `Custom Commands` e separação de lógica de dados com `fixtures`.

- Para abrir a interface interativa do Cypress (Modo Visual):
```bash
npx cypress open
```
- Para executar os testes em background (Headless Mode):
```bash
npx cypress run
```

### Parte 2: Testes de API (Newman)
Para rodar a suíte de testes de API localmente via terminal, instale o Newman globalmente utilizando:
```bash
npm install -g newman
```

Em seguida, execute o comando abaixo, garantindo a injeção da variável de ambiente base do ambiente:
```bash
newman run "BeTalent - Restful-Booker API.postman_collection.json" --env-var "base_url=https://restful-booker.herokuapp.com"
```

**Nota sobre Execução Contínua:** Este repositório possui uma integração direta com o GitHub Actions. Qualquer push realizado no repositório disparará automaticamente a execução dos scripts de validação e contrato da API na nuvem.

## Estratégias e Decisões Técnicas

- **Resiliência de Dados NA API:** A infraestrutura da API do Restful-Booker reseta seus dados em curtos períodos de tempo. Para evitar *flaky tests* (testes falsos-negativos), a esteira foi construída de forma autossuficiente: a execução dos métodos de criação (`POST`) precede operações de busca (`GET`), atualização (`PUT`) e exclusão (`DELETE`), capturando e armazenando dinamicamente o `bookingid` e o `token` de autenticação em variáveis de coleção.

## Relatório de Bugs (Testes Exploratórios)

Durante a exploração da interface web utilizando os perfis de exceção (`problem_user` e `error_user`), foram mapeados defeitos que comprometem a regra de negócio do Sauce Demo.

- **BUG-001: Quebra de renderização e travamento do Carrinho**
  - **Ambiente:** Sauce Demo (Perfil `problem_user`)
  - **Severidade:** Alta
  - **Comportamento:** O sistema bloqueia a adição de produtos ao carrinho após 3 itens específicos, inutilizando o botão "Add to cart". Simultaneamente, os assets (imagens) dos produtos apresentam falha de rota, renderizando placeholders incorretos.

- **BUG-002: Falha no funcionamento do Filtro de Ordenação**
  - **Ambiente:** Sauce Demo (Perfis `problem_user` ou `error_user`)
  - **Severidade:** Média
  - **Comportamento:** Ao utilizar o dropdown de ordenação (ex: "Name Z to A"), a interface ignora o critério selecionado. A vitrine permanece estática no padrão A-Z.

- **BUG-003: Bloqueio na finalização de compra (Erro de Validação)**
  - **Ambiente:** Sauce Demo (Perfil `error_user`)
  - **Severidade:** Crítica (Blocker)
  - **Comportamento:** Na tela de submissão do Checkout, ao preencher os dados e avançar, o sistema limpa silenciosamente o input "Last Name" e acusa erro de obrigatoriedade ("Error: Last Name is required"). O usuário é impedido de finalizar o fluxo transacional de compra.
