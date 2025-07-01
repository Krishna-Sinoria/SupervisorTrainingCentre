# React + Vite


![image](https://github.com/user-attachments/assets/b87f2bff-3ec3-40b5-8513-59719818515f)

1. Login System
Frontend-only Login.jsx form with email + password fields.

Password visibility toggle using lucide-react icons.

Demo Credentials are hardcoded for Director and Trainers.

Authentication logic resides in AuthContext.jsx.

2. AuthContext
Mock login logic using hardcoded demoUsers.

login(email, password): Matches hardcoded users.

logout(): Clears user and localStorage.

updateUser(updates): Updates local user and mock array.

Future-proofed with commented code ready for backend (Express + SQLite).

3. User Session Management
AuthContext auto-loads saved user from localStorage.

Handles page refresh and maintains login session.

(Clear instructions added for switching to backend.)

4. Role-based Dashboard
Director and Trainer see different menus and sections.

Rendered dynamically based on user.role.

Components organized under:

components/Director/

components/Trainer/

components/Common/

5. Layout System
Sidebar, Header, and Main layout working as shell.

Section switching via useState(activeSection).

UI updates based on current route/section.





This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
