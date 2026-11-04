# Biblioteca de culturas

Cada cultura é um registo independente, tipado por `CropProfile`. Intervalos numéricos podem ser `null` enquanto não houver evidência técnica suficiente. Não preencher lacunas com valores inventados.

## Níveis de evidência

- `verified`: dado validado para o contexto geográfico e agronómico explicitamente indicado.
- `general-guidance`: orientação técnica geral, que não deve ser interpretada como validação específica para Angola.
- `pending-validation`: dado em investigação; não deve influenciar avaliações.

## Catálogo inicial

O catálogo em `catalog.ts` contém seis culturas: milho, feijão comum, mandioca, amendoim, sorgo e batata-doce.

Os intervalos de temperatura, precipitação anual, pH e ciclo são transcritos dos intervalos óptimos apresentados nas fichas FAO EcoCrop. A precipitação está expressa em **mm/ano**, não em mm por ciclo. Os intervalos são referências globais; não são limites absolutos nem previsões de produtividade.

| Cultura | Nome científico | Temperatura (°C) | Precipitação anual (mm) | pH | Ciclo (dias) |
|---|---|---:|---:|---:|---:|
| Milho | Zea mays | 18–33 | 600–1200 | 5–7 | 65–365 |
| Feijão comum | Phaseolus vulgaris | 16–25 | 500–2000 | 5,5–7,5 | 50–270 |
| Mandioca | Manihot esculenta | 20–29 | 1000–1500 | 5,5–8 | 180–365 |
| Amendoim | Arachis hypogaea | 22–32 | 600–1500 | 5,5–6,5 | 90–150 |
| Sorgo | Sorghum bicolor | 22–35 | 400–600 | 5,5–7,5 | 90–300 |
| Batata-doce | Ipomoea batatas | 18–28 | 750–2000 | 5–7 | 80–170 |

Fontes primárias consultadas:
- [FAO EcoCrop — Milho](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=2175)
- [FAO EcoCrop — Feijão comum](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=1668)
- [FAO EcoCrop — Mandioca](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=1420)
- [FAO EcoCrop — Amendoim](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=2199)
- [FAO EcoCrop — Sorgo](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=48747)
- [FAO EcoCrop — Batata-doce](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=1265)

Todos os perfis permanecem com estado `draft`. Textura, drenagem, tolerância à seca, procura de água, exigência nutricional e época de plantio não são inferidas quando a ficha consultada não fornece dados suficientemente claros para a representação actual. Os seis perfis ainda não foram validados para províncias, municípios, variedades ou sistemas de produção específicos de Angola.

## Avaliação inicial de compatibilidade

`assessCropAgainstSoil` faz uma primeira comparação conservadora entre o pH medido e o intervalo de referência da cultura. Não calcula uma pontuação artificial nem transforma dados desconhecidos em incompatibilidades.

Estados possíveis:
- `provisional-match`: o pH conhecido está dentro do intervalo de referência utilizável. Não significa que a cultura esteja globalmente recomendada.
- `review-required`: o pH conhecido está fora do intervalo de referência; é necessária avaliação técnica.
- `insufficient-data`: não há medição de pH ou intervalo de referência com evidência utilizável.

Nesta fase, textura, drenagem, água, clima, época de plantio, fertilidade e maneio são explicitamente identificados como factores ainda não avaliados. A avaliação não substitui aconselhamento agronómico nem validação local.

## Próximos requisitos de qualidade

1. Recolher referências agronómicas regionais para Angola, incluindo recomendações do IIAM e de instituições de investigação relevantes.
2. Registar variedade/cultivar, província, município, época agrícola e sistema de produção sempre que a fonte disponibilizar esses detalhes.
3. Submeter os perfis a revisão agronómica antes de alterar `validationStatus` para `reviewed` ou `validated`.
4. Preservar a fonte e o contexto de cada valor; nunca converter intervalos anuais em necessidades hídricas por ciclo.
