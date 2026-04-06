# Lambda TypeScript Template

Plantilla base para una AWS Lambda en Node.js + TypeScript. Esta plantilla NO implementa lógica de negocio; sólo provee la estructura inicial y configuraciones comunes.

## Requisitos mínimos
- Node 18+
- npm o yarn

## Instalación

```bash
npm install
```

## Scripts

- `npm run build` — Compila TypeScript a `dist/`.
- `npm test` — Ejecuta tests con Jest.
- `npm run format` — Formatea con Prettier.

## Estructura `src/`

src/
├── application/
│   └── use-cases/
├── domain/
│   ├── entities/
│   ├── repositories/
│   └── services/
├── infrastructure/
│   ├── persistence/
│   │   ├── db/
│   │   └── repositories/
│   └── services/
├── interfaces/
│   └── handlers/
└── shared/

> Nota: Los directorios "hoja" contienen `.gitkeep` para que Git los rastree.

## Configuraciones incluidas
- `tsconfig.json` – configuración de TypeScript orientada a Node 18+.
- `jest.config.js` – configuración básica usando `ts-jest`.
- `eslintrc.cjs` + `.prettierrc` – linting y formateo básicos para TypeScript.
- `.gitignore` – entradas habituales para Node + Lambda.

---
