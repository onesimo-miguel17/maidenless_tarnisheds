# Fundação geográfica — Angola

Este domínio representa a estrutura territorial administrativa usada para localizar explorações, parcelas, observações de campo e dados ambientais.

## Divisão político-administrativa

A divisão de referência, em vigor desde 1 de Janeiro de 2025, compreende:
- 21 províncias;
- 326 municípios;
- 378 comunas.

A base de dados está a ser importada por tranches provinciais, directamente a partir do anexo da Lei n.º 8/25. As tranches detalhadas actualmente transcritas são:
- Cabinda: 10 municípios e 8 comunas;
- Zaire: 11 municípios e 18 comunas;
- Uíge: 23 municípios e 44 comunas;
- Bengo: 12 municípios e 19 comunas;
- Cuanza-Norte: 17 municípios e 24 comunas;
- Cuanza-Sul: 24 municípios e 23 comunas;
- Malanje: 27 municípios e 38 comunas;
- Lunda-Norte: 19 municípios e 20 comunas;
- Lunda-Sul: 14 municípios e 4 comunas;
- Moxico: 12 municípios e 13 comunas;
- Moxico Leste: 9 municípios e 4 comunas;
- Bié: 19 municípios e 30 comunas;
- Huambo: 17 municípios e 30 comunas;
- Benguela: 23 municípios e 12 comunas;
- Namibe: 9 municípios e 11 comunas;
- Huíla: 23 municípios e 28 comunas;
- Cunene: 14 municípios e 10 comunas;
- Cubango: 11 municípios e 12 comunas;
- Cuando: 9 municípios e 6 comunas;
- Luanda: 16 municípios e 13 comunas;
- Icolo e Bengo: 7 municípios e 11 comunas.

A soma das 21 tranches corresponde aos totais nacionais de referência: 326 municípios e 378 comunas. Isto confirma a cobertura tabular dos registos administrativos; não significa que existam geometrias, limites ou coordenadas territoriais.

## Códigos territoriais oficiais

A fonte normativa dos códigos é a Lei n.º 8/25, de 16 de Setembro, Diário da República, I Série, n.º 176, Anexo sobre a Codificação Nacional.

A aplicação guarda:
- código provincial: por exemplo, Zaire `AOZRE02`;
- código municipal: código provincial + número municipal, por exemplo `AOZRE0201`;
- código de comuna: código municipal + número da comuna, por exemplo `AOZRE020101`.

Os IDs como `ao-zaire-mbanza-kongo` são identificadores internos estáveis do Pambala. Não são códigos territoriais oficiais.

### Marcador de comuna 00

O anexo usa o código `00` na coluna de comuna quando não enumera uma comuna para determinado município. Esse marcador aparece no código alfanumérico da linha do município, mas **não representa uma comuna autónoma**. A aplicação não cria registos de comuna para esses marcadores. Na tranche do Cuando, seis municípios têm código de comuna `00` e permanecem apenas como registos municipais.

### Importação por tranches

O ficheiro `angola-administrative-units.ts` contém os municípios e comunas das províncias importadas. Os testes verificam:
- quantidades por tranche;
- grafia e códigos oficiais;
- unicidade de IDs e códigos;
- relações pai-filho;
- ausência de falsas comunas criadas a partir do marcador `00`.

Os nomes são preservados conforme a grafia apresentada no anexo legal. A normalização de nomes para pesquisa ou apresentação deverá ser uma camada separada, sem alterar a transcrição de origem.

Uma transcrição HTML secundária consultada durante a verificação apresentava divergência no código da comuna de Paredes (Quibaxe, Bengo). O PDF do Diário da República apresenta o código `02` e o código alfanumérico `AOBGO040202`; a transcrição secundária não é usada como fonte de verdade.

A página institucional do Governo Provincial do Cuando apresenta algumas associações município/comuna diferentes das tabelas legais consultadas. Para esta tranche, os registos e códigos seguem o Anexo da Lei n.º 8/25, e as relações hierárquicas são mantidas de forma conservadora, sem inferir comunas adicionais a partir de listagens divergentes.

## Proveniência

1. Assembleia Nacional, Lei n.º 14/24, de 5 de Setembro — Diário da República, I Série, n.º 171. Define a divisão político-administrativa.
   https://c2a.portais.gov.ao/uploads/LEI_14_24_5_de_SETEMBRO_LEI_DA_DPA_043a0de85f.pdf
2. Ministério das Relações Exteriores, comunicação institucional sobre a entrada em vigor da nova divisão em 1 de Janeiro de 2025.
   https://brasil.mirex.gov.ao/web/noticias/nova-divisao-politica-administrativa
3. INE, Resultados Definitivos do Recenseamento Geral da População e Habitação 2024, Novembro de 2025.
   https://www.ine.gov.ao/Arquivos/arquivosCarregados/Carregados/Publicacao_638992698392586291.pdf
4. Assembleia Nacional, Lei n.º 8/25, de 16 de Setembro — Diário da República, I Série, n.º 176, Anexo sobre a Codificação Nacional.
   https://files.lex.ao/assembleia-nacional/2025/lei-n-o-8-25-de-16-de-setembro/download/lei-n-o-8-25-de-16-de-setembro_assembleia-nacional_lex-ao.pdf

## Divergências de grafia entre diplomas

A Lei n.º 14/24 e o anexo de codificação da Lei n.º 8/25 apresentam diferenças de grafia para algumas unidades do Cubango. Nesta tranche, os nomes associados aos códigos seguem literalmente o anexo da Lei n.º 8/25: **Mavingue** (em vez de Mavengue), **Mué** (em vez de Maué) e **Jamba Cuio** (em vez de Jamba Cueio). A divergência é preservada para revisão jurídica, não normalizada silenciosamente.

## Divergências e validação — Cuando

A Lei n.º 8/25, página 20331, enumera seis comunas codificadas: Cuito Cuanavale, Lupire, Dirico, Xamavera, Cunjamba e Cutile. Os municípios Mavinga, Rivungo, Xipundo, Luiana, Mucusso e Luengue aparecem com marcador `00`; esse marcador não cria comunas. A Lei n.º 14/24, artigos 501.º a 513.º, confirma os nove municípios e a sede em Mavinga, e descreve a composição de Cuito Cuanavale, Dirico e Dima.

O portal institucional do Governo Provincial do Cuando apresenta uma distribuição de comunas diferente em alguns municípios. Essa divergência fica registada para validação administrativa; não foi usada para alterar os códigos legais nem para criar relações não sustentadas pelo anexo de codificação.

## Limites e próximos passos

- A cobertura tabular actualmente transcrita inclui as 21 províncias, 326 municípios e 378 comunas. Esta contagem não substitui a revisão jurídica dos diplomas nem a validação de futuras alterações administrativas.
- As 21 tranches detalhadas estão enumeradas acima; os totais por província somam 326 municípios e 378 comunas.
- Não contém geometrias, limites, áreas, centroides ou coordenadas.
- Não representa zonas agroecológicas nem classes de aptidão agrícola.
- A manutenção deve continuar com revisão dos códigos e nomes contra o PDF oficial. As tranches de Luanda e Icolo e Bengo foram transcritas da página 20318 do Anexo da Lei n.º 8/25.
- Alterações futuras à divisão administrativa devem ser versionadas; não se deve sobrescrever silenciosamente o histórico territorial.
