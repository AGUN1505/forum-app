# NexusForum - Aplikasi Forum Diskusi

## Tech Stack
- React 18 + Vite + Redux Toolkit + React Router v6
- **Storybook** (React Ecosystem)
- **Vitest** + **React Testing Library** (Unit & Integration)
- **Cypress** (E2E Testing)
- ESLint Airbnb + GitHub Actions + Vercel

## Instalasi
```bash
npm install
npm run dev
```

## Testing
```bash
npm test           # Unit & Integration (71 tests)
npm run e2e        # E2E Cypress (butuh dev server running)
npm run storybook  # Storybook komponen
```

## Test Summary
| Jenis | File | Jumlah Test |
|-------|------|-------------|
| Reducer | authSlice.test.js | 9 tests |
| Thunk | authSlice.test.js | 8 tests |
| Reducer | threadsSlice.test.js | 17 tests |
| Thunk | threadsSlice.test.js | 15 tests |
| Component | VoteButton.test.jsx | 8 tests |
| Component | ThreadCard.test.jsx | 9 tests |
| Component | CategoryFilter.test.jsx | 5 tests |
| E2E | login.cy.js | 6 scenarios |

## CI/CD
- **CI**: GitHub Actions (`.github/workflows/ci.yml`)
- **CD**: Vercel (`vercel.json`)
- Branch protection: aktifkan di GitHub Settings → Branches

## Live URL

