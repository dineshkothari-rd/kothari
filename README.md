# React + Vite

## Payment Setup

Online rent collection uses Razorpay Checkout from the admin payment form.

1. Copy `.env.example` to `.env`.
2. Set `VITE_RAZORPAY_KEY_ID` to your Razorpay key id.
3. Restart the Vite dev server after changing environment variables.

The current client-only flow stores the returned Razorpay payment id with the
payment record. For production-grade verification, add a backend or Firebase
Function to create Razorpay orders and verify payment signatures before marking
payments as paid.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
