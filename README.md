# Pambala — Inteligência Agrícola

Plataforma de apoio à decisão agrícola orientada inicialmente para Angola. O Pambala cruza características do terreno, informação ambiental e conhecimento agronómico para apoiar a selecção de culturas e o planeamento de rotações.

## Estado do projecto

Em desenvolvimento — Fase 1: biblioteca de culturas, caracterização do solo, motor de recomendação e planeamento de rotação.

## Stack

- Next.js + React
- TypeScript
- Tailwind CSS v4
- Zod para validação
- Vitest para testes

## Requisitos

- Node.js 20.9 ou superior
- npm

## Desenvolvimento local

```bash
npm install
npm run dev
```

Verificações:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Princípios

- Dados medidos, estimados e desconhecidos são distinguidos.
- Dados em falta não são tratados como incompatibilidade.
- Recomendações apresentam critérios, limitações e justificações.
- Parâmetros agronómicos devem ter fontes técnicas rastreáveis.
- Nenhuma recomendação representa garantia de produção.
