/// <reference types="cypress" />

describe('Care Seeker - Book Appointment', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/categories**', { fixture: 'categories.json' }).as(
      'getCategories'
    );
    cy.intercept('GET', '**/auth/profile', { fixture: 'profile.json' }).as(
      'getProfile'
    );
    cy.intercept('GET', '**/healthcare/appointments**', {
      fixture: 'appointments-empty.json',
    }).as('getAppointments');
    cy.intercept('GET', '**/doctors-discovery*', (req) => {
      if (req.url.includes('/doctors-discovery/')) {
        req.reply({ fixture: 'doctor-detail.json' });
      } else {
        req.reply({ fixture: 'doctors-discovery.json' });
      }
    }).as('doctorsDiscovery');
    cy.intercept('POST', '**/healthcare/appointments', {
      fixture: 'create-appointment-response.json',
    }).as('createAppointment');

    cy.login();
    cy.visit('/dashboard');
    cy.wait(5000);
    cy.wait('@getCategories');
    cy.wait('@getProfile');
    cy.wait('@getAppointments');
    cy.url().should('include', '/dashboard');
  });

  it('completes the full booking wizard', () => {
    // Open the booking modal from the dashboard
    cy.contains('button', 'Doctors').click();
    cy.contains('Book Appointment').should('be.visible');

    // ── Step 1: Select specialty ──
    cy.contains('What Doctor would you like to see?').should('be.visible');
    cy.contains('Cardiologist').click();

    // ── Step 2: Select care type (auto-advances after 500ms) ──
    cy.contains('How soon do you want care?', { timeout: 3000 }).should(
      'be.visible'
    );
    cy.contains('Non-Urgent Care').click();

    // ── Step 3: Select care mode (auto-advances after 500ms) ──
    cy.contains('Where do you want care?', { timeout: 3000 }).should(
      'be.visible'
    );
    cy.contains('video consultation').click();

    // ── Step 4: Doctor list appears ──
    cy.contains('Top Doctors', { timeout: 5000 }).should('be.visible');
    cy.contains('John Doe').click();

    // ── Step 5: Doctor profile → Book Appointment button ──
    cy.contains('Doctor details').should('be.visible');
    cy.contains('button', 'Book Appointment').click();

    // ── Step 6: Booking form ──
    cy.contains('Book Appointment', { timeout: 3000 }).should('be.visible');

    // Open the date/time picker
    cy.contains('button', 'Select appointment time').click();

    // Navigate to a future date (July 15, 2026 is a Wednesday = available)
    cy.get('#month').select('July');
    cy.get('#year').select('2026');
    cy.get('button:not([disabled])').contains('15').click();

    // Pick a time slot (auto-submits — applyImmediately is true for new bookings)
    cy.contains('button', '09:00').first().click();

    // Confirm selected time is displayed
    cy.contains('Start time').should('be.visible');

    // Enter a reason for the appointment
    cy.get('textarea').type('Cypress E2E test appointment');

    // Submit the booking
    cy.contains('button', 'Book Appointment').click();
    cy.wait('@createAppointment');

    // ── Success state ──
    cy.contains('button', 'Proceed to Payment').should('be.visible');
    cy.contains('button', 'Cancel Appointment').should('be.visible');
  });
});
