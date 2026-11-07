# Fundação geográfica — Angola

Este domínio representa a hierarquia administrativa nominal usada para organizar explorações, parcelas, observações de campo e contexto territorial.

## Divisão político-administrativa

A referência legal em vigor desde 1 de Janeiro de 2025 compreende:
- 21 províncias;
- 326 municípios;
- 378 comunas.

As 21 províncias, os 326 municípios e as 378 comunas estão transcritos no domínio geográfico do Pambala a partir do Anexo sobre a Codificação Nacional da Lei n.º 8/25, de 16 de Setembro de 2025. A página `/geography` e a API `GET /api/geography/coverage` expõem a cobertura do registo.

## Códigos territoriais oficiais

A fonte normativa dos códigos é a Lei n.º 8/25, de 16 de Setembro, Diário da República, I Série, n.º 176, Anexo sobre a Codificação Nacional.

A aplicação guarda:
- código provincial, por exemplo `AOCDA01`;
- código municipal, formado pelo código provincial e dois dígitos, por exemplo `AOCDA0102`;
- código de comuna, formado pelo código municipal e dois dígitos, por exemplo `AOCDA010201`.

Os IDs como `ao-cabinda-cacongo` são identificadores internos estáveis do Pambala. Não são códigos territoriais oficiais.

### Marcador de comuna 00

O anexo usa o código `00` na coluna de comuna quando não enumera uma comuna para determinado município. Esse marcador aparece no código alfanumérico da linha do município, mas **não representa uma comuna autónoma**. A aplicação não cria registos de comuna para esses marcadores.

## Proveniência e transcrição

Fonte normativa principal:
- Assembleia Nacional, Lei n.º 8/25, de 16 de Setembro — Diário da República, I Série, n.º 176, Anexo sobre a Codificação Nacional.
- PDF consultado: https://files.lex.ao/assembleia-nacional/2025/lei-n-o-8-25-de-16-de-setembro/download/lei-n-o-8-25-de-16-de-setembro_assembleia-nacional_lex-ao.pdf

As tabelas do anexo distribuem-se pelas páginas 20315–20331. A tranche de Luanda e Icolo e Bengo está na página 20318. Os testes verificam:
- contagem nacional de 326 municípios e 378 comunas;
- cobertura das 21 províncias;
- grafia e códigos das duas tranches de Luanda e Icolo e Bengo;
- unicidade global de IDs internos e códigos oficiais;
- relações pai-filho;
- prefixos dos códigos em relação às unidades administrativas progenitoras;
- ausência de falsas comunas criadas a partir do marcador `00`.

Os nomes são preservados conforme a grafia transcrita do anexo. A normalização para pesquisa ou apresentação deverá ser uma camada separada, sem alterar a transcrição de origem.

### Divergências documentadas

- **Bengo:** a transcrição HTML secundária consultada diverge no código da comuna Paredes (Quibaxe). O PDF do Diário da República apresenta o código `AOBGO040202`; é esse o código mantido no registo.
- **Cubango:** a Lei n.º 14/24 e o Anexo de Codificação da Lei n.º 8/25 apresentam diferenças de grafia em alguns nomes. Para os registos com código, mantém-se a grafia do Anexo da Lei n.º 8/25, incluindo Mavingue, Mué e Jamba Cuio.
- **Cuando:** o portal institucional provincial apresenta algumas associações município/comuna diferentes das tabelas do Anexo de Codificação. O registo segue os códigos e as associações explicitamente enumeradas no anexo, sem criar comunas adicionais.

Estas divergências devem permanecer documentadas e não podem ser normalizadas silenciosamente. A transcrição digital do anexo deve ser revista contra a reprodução oficial sempre que uma grafia ou associação seja questionada.

## Limites

- Este conjunto representa hierarquia administrativa nominal e códigos, não cartografia.
- Não contém geometrias, limites, áreas, centroides ou coordenadas.
- A atribuição automática de província, município ou comuna a partir de coordenadas permanece desactivada.
- Não representa zonas agroecológicas nem classes de aptidão agrícola.
- A geografia histórica do ICAPP não é redistribuída pelas 21 províncias actuais.
- Alterações futuras à divisão administrativa devem ser versionadas; não se deve sobrescrever silenciosamente o histórico territorial.
