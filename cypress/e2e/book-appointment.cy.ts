/// <reference types="cypress" />

describe('Care Seeker - Book Appointment', () => {
  beforeEach(() => {
    // ── API intercepts ──
    cy.intercept('GET', '**/categories**', { fixture: 'categories.json' }).as(
      'getCategories'
    );
    cy.intercept('GET', '**/auth/profile', { fixture: 'profile.json' }).as(
      'getProfile'
    );
    cy.intercept('GET', '**/healthcare/appointments?*', {
      fixture: 'appointments-empty.json',
    }).as('getAppointments');

    // Doctor discovery: list endpoint vs detail endpoint
    cy.intercept('GET', '**/doctors-discovery', (req) => {
      // Detail endpoint matches /doctors-discovery/<id>
      if (/\/doctors-discovery\/\d+$/.test(req.url)) {
        req.reply({ fixture: 'doctor-detail.json' });
      } else {
        req.reply({ fixture: 'doctors-discovery.json' });
      }
    }).as('doctorsDiscovery');

    cy.intercept('POST', '**/healthcare/appointments', {
      fixture: 'create-appointment-response.json',
    }).as('createAppointment');

    // ── Log in & load the dashboard ──
    cy.login();
    cy.visit('/dashboard');

    // Wait for the dashboard to finish loading its data
    cy.wait('@getCategories');
    cy.wait('@getProfile');
    cy.wait('@getAppointments');
    cy.url().should('include', '/dashboard');
  });

  it('completes the full booking wizard', () => {
    // ── Open the booking modal ──
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

    // ── Step 4: Doctor list loads ──
    cy.contains('Top Doctors', { timeout: 5000 }).should('be.visible');
    cy.contains('John Doe').click();

    // ── Step 5: Doctor detail loads → Book Appointment ──
    cy.contains('Doctor details').should('be.visible');
    cy.contains('button', 'Book Appointment').click();

    // ── Step 6: Booking form appears ──
    cy.contains('Book Appointment', { timeout: 3000 }).should('be.visible');

    // Open the date/time picker
    cy.contains('button', 'Select appointment time').click();

    // Navigate to a valid future date (Wednesday = available per fixture)
    cy.get('#month').select('July');
    cy.get('#year').select('2026');
    cy.get('button:not([disabled])').contains('15').click();

    // Pick the 09:00 time slot
    cy.contains('button', '09:00').first().click();

    // Confirm the selected time is displayed
    cy.contains('Start time').should('be.visible');

    // Enter a reason for the appointment
    cy.get('textarea').type('Cypress E2E test appointment');

    // ── Submit the booking ──
    cy.contains('button', 'Book Appointment').click();
    cy.wait('@createAppointment');

    // ── Success state ──
    cy.contains('button', 'Proceed to Payment').should('be.visible');
    cy.contains('button', 'Cancel Appointment').should('be.visible');
  });
});
