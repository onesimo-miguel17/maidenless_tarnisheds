# Fundação geográfica — Angola

Este domínio representa a estrutura territorial administrativa usada para localizar explorações, parcelas, observações de campo e dados ambientais.

## Divisão político-administrativa

A divisão de referência, em vigor desde 1 de Janeiro de 2025, compreende:
- 21 províncias;
- 326 municípios;
- 378 comunas.

A base de dados está a ser importada por tranches provinciais, directamente a partir do anexo da Lei n.º 8/25. As tranches detalhadas actualmente transcritas são:
- Cabinda: 10 municípios e 8 comunas;
- Zaire: 11 municípios e 18 comunas.
- Uíge: 23 municípios e 44 comunas.
- Bengo: 12 municípios e 19 comunas.

Total actualmente registado: 56 municípios e 89 comunas, distribuídos por quatro províncias. Estes totais não representam a cobertura nacional.

## Códigos territoriais oficiais

A fonte normativa dos códigos é a Lei n.º 8/25, de 16 de Setembro, Diário da República, I Série, n.º 176, Anexo sobre a Codificação Nacional.

A aplicação guarda:
- código provincial: por exemplo, Zaire `AOZRE02`;
- código municipal: código provincial + número municipal, por exemplo `AOZRE0201`;
- código de comuna: código municipal + número da comuna, por exemplo `AOZRE020101`.

Os IDs como `ao-zaire-mbanza-kongo` são identificadores internos estáveis do Pambala. Não são códigos territoriais oficiais.

### Marcador de comuna 00

O anexo usa o código `00` na coluna de comuna quando não enumera uma comuna para determinado município. Esse marcador aparece no código alfanumérico da linha do município, mas **não representa uma comuna autónoma**. A aplicação não cria registos de comuna para esses marcadores.

### Importação por tranches

O ficheiro `angola-administrative-units.ts` contém os municípios e comunas das províncias importadas. Os testes verificam:
- quantidades por tranche;
- grafia e códigos oficiais;
- unicidade de IDs e códigos;
- relações pai-filho;
- ausência de falsas comunas criadas a partir do marcador `00`.

Os nomes são preservados conforme a grafia apresentada no anexo legal. A normalização de nomes para pesquisa ou apresentação deverá ser uma camada separada, sem alterar a transcrição de origem.

Uma transcrição HTML secundária consultada durante a verificação apresentava divergência no código da comuna de Paredes (Quibaxe, Bengo). O PDF do Diário da República apresenta o código `02` e o código alfanumérico `AOBGO040202`; a transcrição secundária não é usada como fonte de verdade.

## Proveniência

1. Assembleia Nacional, Lei n.º 14/24, de 5 de Setembro — Diário da República, I Série, n.º 171. Define a divisão político-administrativa.
   https://c2a.portais.gov.ao/uploads/LEI_14_24_5_de_SETEMBRO_LEI_DA_DPA_043a0de85f.pdf
2. Ministério das Relações Exteriores, comunicação institucional sobre a entrada em vigor da nova divisão em 1 de Janeiro de 2025.
   https://brasil.mirex.gov.ao/web/noticias/nova-divisao-politica-administrativa
3. INE, Resultados Definitivos do Recenseamento Geral da População e Habitação 2024, Novembro de 2025.
   https://www.ine.gov.ao/Arquivos/arquivosCarregados/Carregados/Publicacao_638992698392586291.pdf
4. Assembleia Nacional, Lei n.º 8/25, de 16 de Setembro — Diário da República, I Série, n.º 176, Anexo sobre a Codificação Nacional.
   https://files.lex.ao/assembleia-nacional/2025/lei-n-o-8-25-de-16-de-setembro/download/lei-n-o-8-25-de-16-de-setembro_assembleia-nacional_lex-ao.pdf

## Limites e próximos passos

- A hierarquia completa ainda não está importada: os 326 municípios e 378 comunas são contagens legais nacionais, não a quantidade já presente no código.
- As tranches detalhadas são apenas Cabinda, Zaire, Uíge e Bengo; não se deve inferir que as restantes províncias já estão cobertas.
- Não contém geometrias, limites, áreas, centroides ou coordenadas.
- Não representa zonas agroecológicas nem classes de aptidão agrícola.
- A importação deve continuar por província, com revisão dos códigos e nomes contra o PDF.
- Alterações futuras à divisão administrativa devem ser versionadas; não se deve sobrescrever silenciosamente o histórico territorial.
