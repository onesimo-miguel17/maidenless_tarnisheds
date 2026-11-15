# Integração FAO WaPOR v3

## Objectivo

Adicionar ao Pambala uma fonte de observação por satélite para água e produtividade agrícola, começando por descobrir e validar os produtos oficiais publicados no catálogo WaPOR v3.

## Fonte e acesso

- Serviço: FAO GISMGR API v2.
- Workspace: \`WAPOR-3\`.
- Base URL: \`https://data.apps.fao.org/gismgr/api/v2\`.
- A API WaPOR v3 não exige token nem credenciais para acesso público ao catálogo.
- Cobertura continental de nível 1: África e Próximo Oriente.

## Produtos em verificação

| Código | Variável | Cadência | Utilidade |
| --- | --- | --- | --- |
| L1-AETI-D | Evapotranspiração real e intercepção | Decendial | Consumo de água observado por satélite |
| L1-RET-E | Evapotranspiração de referência | Diária | Comparação com ET₀ |
| L1-NPP-D | Produtividade primária líquida | Decendial | Indicador de produtividade vegetal |
| L1-RSM-D | Humidade relativa do solo | Decendial | Contexto de humidade do solo |

A disponibilidade efectiva de cada mapset é confirmada em tempo de execução pelo endpoint \`/api/wapor\`. Os códigos e a cadência devem continuar sujeitos à resposta do catálogo oficial.

## Endpoints internos

### Catálogo

\`GET /api/wapor\`

Devolve metadados do catálogo, disponibilidade por camada, unidades quando publicadas e instante de consulta. O resultado é cacheado durante seis horas.

### Descoberta de períodos e metadados COG

\`GET /api/wapor/rasters?layer=L1-RSM-D&limit=24\`

- Consulta o catálogo de rasters do mapset seleccionado com \`view=details\`.
- Segue a paginação disponibilizada pela API oficial.
- Interpreta períodos diários e decendiais a partir dos códigos oficiais dos rasters.
- Devolve os metadados publicados por raster: URL COG público validado, escala, offset, unidade, NoData, tipo de dados, extensão WGS84 e dimensão temporal quando presentes.
- Só expõe URLs HTTPS do bucket público oficial FAO WaPOR v3; não funciona como proxy arbitrário.
- Não devolve valores de pixel nem afirma que existe uma medição extraída para a parcela.

## Limitações deliberadas

Esta integração descobre períodos e metadados dos COGs, mas ainda não lê pixels. A amostragem pontual exige validar a transformação de coordenadas para o CRS do raster, a geotransformação, a janela de leitura, NoData e os factores de escala/offset antes de expor qualquer valor ao agricultor.

A resolução do produto continental é mais grosseira do que a dos produtos nacionais/subnacionais. O Pambala deve informar sempre a resolução e a cadência reais do produto seleccionado.

## Referências

- FAO, WaPOR data access: https://www.fao.org/in-action/remote-sensing-for-water-productivity/wapor-data-access/en
- FAO WaPOR portal: https://data.apps.fao.org/wapor/
- GISMGR API reference: https://data.apps.fao.org/gismgr/shared/docs/api-reference/index.html
- FAO WaPOR v3 API tutorial: https://github.com/un-fao/FAO-Water-Applications/blob/main/WaPOR/WaPORv3_API.ipynb
- FAO Downloader (referência técnica independente para metadados e COGs): https://github.com/bvissers/FAO-Downloader

## Nota de interpretação

RSM é humidade relativa do solo (0–1, relativa aos limites de murcha e capacidade de campo), não teor volumétrico de água. AETI, RET e NPP devem conservar as unidades publicadas pelo catálogo e as correcções de escala/offset por raster. Nenhum destes indicadores, isoladamente, constitui uma prescrição de rega.
