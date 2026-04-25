/**
 * End-to-End tests untuk alur login aplikasi.
 *
 * Skenario pengujian:
 * 1. User berhasil login dengan kredensial yang valid
 * 2. User gagal login dengan password yang salah
 * 3. User dapat logout setelah berhasil login
 * 4. Halaman login menampilkan form yang benar
 */

describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display the login form correctly', () => {
    // Skenario: halaman login menampilkan semua elemen yang diperlukan
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
    cy.contains('Sign In').should('exist');
  });

  it('should show error message when login with wrong credentials', () => {
    // Skenario: user memasukkan email/password salah dan mendapatkan pesan error
    // Intercept agar API benar-benar mengembalikan error (bukan bergantung pada network)
    cy.intercept('POST', '**/login', {
      statusCode: 400,
      body: {
        status: 'fail',
        message: 'Email or password is wrong',
      },
    }).as('loginFail');

    cy.get('input[type="email"]').type('wrong@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginFail');

    // Error message ditampilkan — cek via text karena CSS Modules mengubah class name
    cy.contains('Email or password is wrong', { timeout: 5000 }).should('be.visible');
  });

  it('should navigate to register page when clicking register link', () => {
    // Skenario: user yang belum punya akun dapat navigasi ke halaman register
    cy.contains('Create one').click();
    cy.url().should('include', '/register');
  });

  it('should show loading state when submitting login form', () => {
    // Skenario: tombol submit menunjukkan loading saat request sedang berjalan
    cy.intercept('POST', '**/login', (req) => {
      req.reply({
        delay: 2000,
        statusCode: 200,
        body: {
          status: 'success',
          data: { token: 'fake-token' },
        },
      });
    }).as('slowLogin');

    cy.intercept('GET', '**/users/me', {
      statusCode: 200,
      body: {
        status: 'success',
        data: {
          user: {
            id: 'user-1',
            name: 'Test',
            email: 'test@test.com',
            avatar: 'https://avatar.com/1',
          },
        },
      },
    });

    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Cek via text karena CSS Modules mengubah class name
    cy.contains('Signing in...').should('be.visible');
  });

  it('should successfully login and redirect to home page', () => {
    // Skenario utama: user login sukses dan diarahkan ke halaman utama
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: {
        status: 'success',
        data: { token: 'valid-jwt-token' },
      },
    }).as('loginRequest');

    cy.intercept('GET', '**/users/me', {
      statusCode: 200,
      body: {
        status: 'success',
        data: {
          user: {
            id: 'user-1',
            name: 'John Doe',
            email: 'john@example.com',
            avatar: 'https://ui-avatars.com/api/?name=John',
          },
        },
      },
    }).as('getProfile');

    cy.intercept('GET', '**/threads', {
      statusCode: 200,
      body: { status: 'success', data: { threads: [] } },
    });

    cy.intercept('GET', '**/users', {
      statusCode: 200,
      body: { status: 'success', data: { users: [] } },
    });

    cy.get('input[type="email"]').type('john@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.wait('@getProfile');

    // Setelah login, diarahkan ke halaman utama
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    // Nama user muncul di navbar
    cy.contains('John Doe').should('be.visible');
  });

  it('should successfully logout after login', () => {
    // Skenario: user bisa logout dan token dihapus dari localStorage
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: { status: 'success', data: { token: 'valid-jwt-token' } },
    });

    cy.intercept('GET', '**/users/me', {
      statusCode: 200,
      body: {
        status: 'success',
        data: {
          user: {
            id: 'user-1', name: 'John Doe', email: 'john@example.com',
            avatar: 'https://ui-avatars.com/api/?name=John',
          },
        },
      },
    });

    cy.intercept('GET', '**/threads', {
      statusCode: 200,
      body: { status: 'success', data: { threads: [] } },
    });

    cy.intercept('GET', '**/users', {
      statusCode: 200,
      body: { status: 'success', data: { users: [] } },
    });

    cy.get('input[type="email"]').type('john@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.contains('John Doe', { timeout: 5000 }).should('be.visible');
    cy.contains('Logout').click();

    // Setelah logout, diarahkan ke halaman login
    cy.url().should('include', '/login');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.null;
    });
  });
});
