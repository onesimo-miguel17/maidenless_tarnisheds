# Pambala — Inteligência Agrícola

Plataforma de apoio à decisão agrícola, desenvolvida no contexto do **NASA Space Apps Challenge 2026**, com foco inicial em Angola. O Pambala combina contexto do terreno, dados climáticos da NASA, referências de culturas e estatísticas agrícolas oficiais para apresentar informação rastreável e limitações explícitas.

> **Princípio central:** apoiar decisões com evidência, sem transformar estimativas ou dados incompletos em certezas agronómicas.

## Estado actual

O produto já possui três verticais funcionais:

1. **Inteligência do solo:** registo de características observadas do terreno e avaliação conservadora de pH quando existe medição.
2. **Inteligência climática:** consulta de dados diários NASA POWER por coordenadas e período.
3. **Contexto agrícola de Angola:** integração de estatísticas oficiais ICAPP 2024/2025, com auditoria de qualidade e restrições de utilização.

A atribuição automática de província, município ou comuna a partir de coordenadas continua desactivada: ainda não foi validado um conjunto de limites administrativos geográficos oficial e adequado para produção.

## Funcionalidades disponíveis

| Área | Página | O que permite |
| --- | --- | --- |
| Clima NASA | `/climate` | Consultar precipitação, temperatura e humidade diárias da NASA POWER; ver cobertura, lacunas e indicadores derivados. |
| Contexto agrícola nacional | `/agriculture` | Consultar estatísticas nacionais e registos históricos por província do ICAPP 2024/2025. |
| Contexto regional | `/agriculture/regions` | Explorar agregados da campanha por região, conforme a classificação usada pelo INE. |
| Qualidade dos dados | `/agriculture/data-quality` | Consultar discrepâncias documentadas na publicação ICAPP e as respectivas restrições de utilização. |

### APIs

- `GET /api/climate?latitude=…&longitude=…&start=YYYY-MM-DD&end=YYYY-MM-DD`
- `GET /api/agriculture/context`
- `GET /api/agriculture/context?province=<id>`
- `GET /api/agriculture/data-quality`

Os parâmetros das APIs são validados. A API climática limita o período de consulta e rejeita datas futuras ou posteriores a ontem.

## Fontes de dados

### NASA POWER

A integração usa a NASA POWER Daily Point API:

`https://power.larc.nasa.gov/api/temporal/daily/point`

Parâmetros actualmente consultados:

- `PRECTOTCORR` — precipitação corrigida;
- `T2M` — temperatura média do ar;
- `T2M_MAX` — temperatura máxima;
- `T2M_MIN` — temperatura mínima;
- `RH2M` — humidade relativa.

Comunidade: `AG` (Agroclimatology).

**Limitação essencial:** NASA POWER fornece estimativas em grelha, não medições efectuadas dentro da parcela agrícola. A resolução espacial varia por parâmetro. Valores em falta permanecem indisponíveis; não são convertidos em zero.

### Estatísticas agrícolas de Angola

Fonte: Instituto Nacional de Estatística (INE), **ICAPP 2024/2025**.

- [Página oficial da publicação](https://www.ine.gov.ao/publicacoes/detalhes/NTM0NzU=)
- [Documento PDF](https://www.ine.gov.ao/Arquivos/arquivosCarregados//Carregados/Publicacao_639135904375282798.pdf)
- [Ficheiro Excel](https://www.ine.gov.ao/Arquivos/arquivosCarregados//Carregados/Publicacao_639135933953837199.xlsx)

Os dados são estatísticas agregadas de campanha, não medições de uma exploração individual. A publicação usa a geografia histórica de 18 províncias; os valores não são redistribuídos pelas 21 províncias actuais.

O repositório mantém um registo de discrepâncias da publicação. Esse registo é uma auditoria documental, não uma rectificação oficial do INE. Métricas inconsistentes ou por esclarecer não são usadas em rankings, previsões, recomendações ou avaliações de parcelas.

## Geografia administrativa

A divisão político-administrativa de referência compreende 21 províncias, 326 municípios e 378 comunas. A hierarquia está a ser transcrita por tranches a partir da legislação e ainda não representa cobertura nacional completa.

- A estrutura e a proveniência estão documentadas em [`src/domain/geography/README.md`](src/domain/geography/README.md).
- Os limites geográficos oficiais actuais ainda não foram validados para utilização em produção.
- Não são inferidos municípios, comunas, coordenadas, áreas ou polígonos em falta.
- A geografia histórica do ICAPP não é silenciosamente convertida para a divisão administrativa actual.

## Arquitectura e tecnologias

- Next.js 15 e React 19
- TypeScript
- Tailwind CSS v4
- Zod para validação em runtime
- Vitest para testes
- GitHub Actions para validação contínua
- Vercel para alojamento e previews

Organização principal do código:

- `src/domain/soil` — esquema e avaliação descritiva do solo;
- `src/domain/crops` — catálogo e avaliação de culturas;
- `src/domain/agriculture` — contexto ICAPP, auditoria e controlo de qualidade;
- `src/domain/geography` — províncias e hierarquia administrativa;
- `src/lib/nasa-power.ts` — integração com NASA POWER;
- `src/app/api` — endpoints HTTP;
- `docs/` — decisões técnicas, fontes e pedidos institucionais.

## Princípios de qualidade e limites

- Distinguir sempre dados medidos, estimados, declarados e desconhecidos.
- Nunca tratar dados em falta como zero ou como incompatibilidade.
- Não apresentar NASA POWER como medição local da parcela.
- Não inferir danos nas culturas apenas a partir de anomalias de precipitação.
- Não produzir previsões de produtividade, pontuações arbitrárias de aptidão ou rankings sem evidência validada.
- Não recomendar datas de plantação ou prescrições de irrigação sem referências locais adequadas.
- Explicar fonte, período, cobertura, incerteza e limitações de cada análise.
- Não activar atribuição geográfica automática antes de validar a origem, licença, precisão, CRS e geometria dos limites administrativos.

O Pambala apresenta actualmente uma **avaliação descritiva e conservadora**, não uma certificação de aptidão agrícola nem uma garantia de produção.

## Desenvolvimento local

### Requisitos

- Node.js 20.9 ou superior
- npm

### Instalação

```bash
npm install
npm run dev
```

### Verificações

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Antes de abrir um pull request, executar as verificações acima e documentar fontes, limitações e decisões relevantes.

## Documentação de continuidade

O ficheiro [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) contém o contexto técnico detalhado, o histórico de decisões, as dependências em aberto e o procedimento de continuidade do projecto.
