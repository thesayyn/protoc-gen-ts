describe('Weather app', () => {
    it('should work', () => {
      cy.visit('http://localhost:8080');
      cy.clock();
      cy.contains('Temperature');
      cy.contains('Antalya');
      cy.contains('TR_ANTALYA');
      cy.wait(3000);
      cy.tick(3000);
      cy.contains('Vancouver');
      cy.contains('CA_VANCOUVER');
    });
    it('should work with promise', () => {
      cy.visit('http://localhost:8080#promise_client');
      cy.clock();
      cy.contains('Temperature');
      cy.contains('Antalya');
      cy.contains('TR_ANTALYA');
      cy.wait(3000);
      cy.tick(3000);
      cy.contains('Vancouver');
      cy.contains('CA_VANCOUVER');
    });
});