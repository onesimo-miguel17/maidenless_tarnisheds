# Integração FAO WaPOR v3

## Objectivo

Adicionar ao Pambala uma fonte de observação por satélite para água e produtividade agrícola, começando por descobrir e validar os produtos oficiais publicados no catálogo WaPOR v3.

## Fonte e acesso

- Serviço: FAO GISMGR API v2.
- Workspace: `WAPOR-3`.
- Base URL: `https://data.apps.fao.org/gismgr/api/v2`.
- A API WaPOR v3 não exige token nem credenciais para acesso público ao catálogo.
- Cobertura continental de nível 1: África e Próximo Oriente.

## Produtos em verificação

| Código | Variável | Cadência | Utilidade |
| --- | --- | --- | --- |
| L1-AETI-D | Evapotranspiração real e intercepção | Decendial | Consumo de água observado por satélite |
| L1-RET-E | Evapotranspiração de referência | Diária | Comparação com ET₀ |
| L1-NPP-D | Produtividade primária líquida | Decendial | Indicador de produtividade vegetal |
| L1-RSM-D | Humidade relativa do solo | Decendial | Contexto de humidade do solo |

A disponibilidade efectiva de cada mapset é confirmada em tempo de execução pelo endpoint `/api/wapor`. Os códigos e a cadência devem continuar sujeitos à resposta do catálogo oficial.

## Endpoint interno

`GET /api/wapor`

Devolve metadados do catálogo, disponibilidade por camada, unidades quando publicadas e instante de consulta. O resultado é cacheado durante seis horas.

## Limitações deliberadas

Esta primeira entrega é uma integração de catálogo e descoberta de metadados. Não apresenta valores de satélite como se fossem amostras do terreno. A série temporal por ponto ou parcela exige validar a operação de consulta espacial, os identificadores temporais, os factores de escala, os valores NoData e a disponibilidade efectiva dos produtos antes de expor indicadores agrícolas.

A resolução do produto continental é mais grosseira do que a dos produtos nacionais/subnacionais. O Pambala deve informar sempre a resolução e a cadência reais do produto seleccionado.

## Referências

- FAO, WaPOR data access: https://www.fao.org/in-action/remote-sensing-for-water-productivity/wapor-data-access/en
- FAO WaPOR portal: https://data.apps.fao.org/wapor/
- GISMGR API reference: https://data.apps.fao.org/gismgr/shared/docs/api-reference/index.html
- FAO WaPOR v3 API tutorial: https://github.com/un-fao/FAO-Water-Applications/blob/main/WaPOR/WaPORv3_API.ipynb
