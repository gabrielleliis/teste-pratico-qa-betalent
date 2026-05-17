describe('Testes E2E e Integração - Sauce Demo', () => {
  let dados; // Variável para armazenar nossa massa de dados

  before(() => {
    // Carrega os dados do arquivo JSON apenas uma vez antes dos testes
    cy.fixture('massaDeDados').then((fixtureData) => {
      dados = fixtureData;
    });
  });

  beforeEach(() => {
    // Como a BaseURL está no config, passamos apenas a barra
    cy.visit('/');
  });

  it('Cenário 1: Login com credenciais válidas', () => {
    // Uso do Custom Command limpo e direto
    cy.realizarLogin(dados.usuarioValido, dados.senhaGeral);

    cy.url().should('include', '/inventory.html');
    cy.get('.title').should('have.text', 'Products');
  });

  it('Cenário 2: Validação de segurança para usuário bloqueado', () => {
    cy.realizarLogin(dados.usuarioBloqueado, dados.senhaGeral);
    cy.get('[data-test="error"]').should('contain', 'Epic sadface: Sorry, this user has been locked out.');
  });

  it('Cenário 3: Fluxo transacional completo de compra (Checkout E2E)', () => {
    cy.realizarLogin(dados.usuarioValido, dados.senhaGeral);

    // Adição ao carrinho
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('.shopping_cart_badge').should('have.text', '1');
    cy.get('.shopping_cart_link').click();

    // Validação de permanência de estado no carrinho
    cy.url().should('include', '/cart.html');
    cy.get('.inventory_item_name').should('contain', 'Sauce Labs Backpack');

    // Processo de Checkout
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="firstName"]').type('Gabriel');
    cy.get('[data-test="lastName"]').type('Santos');
    cy.get('[data-test="postalCode"]').type(dados.cepEntrega); // Dado vindo da fixture
    cy.get('[data-test="continue"]').click();

    // Revisão e Finalização
    cy.get('[data-test="finish"]').click();
    cy.get('.complete-header').should('contain', 'Thank you for your order!');
  });
});