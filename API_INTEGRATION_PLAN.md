# API Integration Plan

## Goal
Create a clean, scalable API integration layer for the app so the current mock-based pages can move to real backend data without rewriting the UI.

## Current app fit
The app already has clear domain areas that map well to backend endpoints:
- Dashboard overview: summary cards, category spending, trend chart, recent transactions
- Transactions page: list, filter, add, edit, delete
- Chat page: assistant conversations and prompt suggestions
- Login page: sign-in/sign-up and session handling

## Target architecture
Use a thin service layer between the UI and the network layer.

### Proposed structure
- lib/api/client.ts
  - shared fetch wrapper
  - base URL configuration
  - auth headers
  - timeout and retry handling
  - standardized error parsing
- lib/api/types.ts
  - shared request/response DTOs
  - domain models aligned with current app types
- lib/api/services/auth.ts
  - login, signup, logout, session refresh
- lib/api/services/transactions.ts
  - list, create, update, delete, filter, pagination
- lib/api/services/analytics.ts
  - dashboard summary, category totals, trends, recent activity
- lib/api/services/chat.ts
  - message history, suggest prompts, assistant responses
- lib/hooks/*
  - small UI-facing hooks that call the services and expose loading/error/success states

## Data flow
1. Page components stay focused on UI and local state.
2. A service function handles API calls and data mapping.
3. The API client centralizes auth, error handling, and request configuration.
4. The UI consumes normalized data, not raw API payloads.

## Recommended API contracts
### Auth
- POST /auth/login
- POST /auth/signup
- POST /auth/logout
- GET /auth/me

### Transactions
- GET /transactions
- GET /transactions/:id
- POST /transactions
- PATCH /transactions/:id
- DELETE /transactions/:id

### Analytics
- GET /analytics/summary
- GET /analytics/category-breakdown
- GET /analytics/trend
- GET /analytics/recent-transactions

### Chat
- GET /chat/prompts
- GET /chat/history
- POST /chat/message

## Migration strategy
1. Keep the existing mock data modules as a fallback during development.
2. Introduce the API layer behind a feature flag.
3. Replace one domain at a time:
   - auth first
   - transactions second
   - analytics third
   - chat last
4. Remove mock usage only after the API is stable and tested.

## Error and loading handling
- Show skeletons or loading states on page load.
- Use a consistent error banner or toast for failed requests.
- Retry transient network errors once.
- Fall back to cached or mock data when the backend is temporarily unavailable.

## Security and reliability
- Store secrets only in server-side environment variables.
- Send auth tokens through secure cookies or Authorization headers.
- Validate response shapes before using them in components.
- Log request failures with enough context for debugging.

## Testing plan
- Unit test the API client for retry and error handling.
- Unit test service adapters for request/response mapping.
- Add integration tests for transactions and auth flows.
- Verify loading and empty states in Storybook and browser tests.

## Phase rollout
### Phase 1: Foundation
- Set up the API client and shared types.
- Add environment variables and base URL configuration.

### Phase 2: Auth
- Implement login, signup, and session retrieval.
- Connect the login page to real auth state.

### Phase 3: Transactions
- Replace mock transaction loading with API-backed list/create/edit/delete flows.
- Add filtering and pagination support.

### Phase 4: Dashboard and analytics
- Wire summary cards, charts, and recent activity to real endpoints.

### Phase 5: Assistant chat
- Replace canned responses with backend chat history and generation calls.

## Definition of done
The integration layer is ready when:
- UI pages can load data from the API without direct fetch logic in components
- auth and error handling are centralized
- mock data is no longer required for the main user flows
- loading, empty, and error states are consistent across pages
