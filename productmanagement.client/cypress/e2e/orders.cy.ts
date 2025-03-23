describe('Orders', () => {
  beforeEach(() => {
    cy.visit('/orders');
  });

  it('displays the orders list page', () => {
    cy.getBySel('orders-title').should('contain', 'Orders');
    cy.getBySel('orders-grid').should('exist');
  });

  it('navigates to create order form', () => {
    cy.getBySel('new-order-link').click();
    cy.url().should('include', '/orders/new');
  });

  it('creates a new order', () => {
    // Navigate to create order form
    cy.visit('/orders/new');

    // Fill in the form
    cy.getBySel('customer-name-input').type('Test Customer');
    cy.getBySel('customer-email-input').type('test@example.com');

    // Wait for products to load and select the first available product
    cy.getBySel('product-select').should('exist');
    cy.getBySel('product-select').find('option').should('have.length.gt', 1);
    cy.getBySel('product-select').find('option:not(:first)').first().then($option => {
      cy.getBySel('product-select').select($option.val() as string);
    });
    
    cy.getBySel('quantity-input').type('2');

    // Submit the form
    cy.getBySel('submit-button').click();

    // Verify we're redirected back to the orders list
    cy.url().should('include', '/orders');
  });

  it('updates order status', () => {
    // Wait for orders to load
    cy.getBySel('order-row').should('exist');

    // Select a status from the dropdown
    cy.getBySel('status-select').first().select('Processing');

    // Verify the status was updated
    cy.getBySel('order-status').should('contain', 'Processing');
  });
}); 