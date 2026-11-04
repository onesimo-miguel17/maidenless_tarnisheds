import type { AdministrativeUnit } from "./types";

/**
 * Verified municipality/commune tranches.
 *
 * Transcribed from the annex to Law n.º 8/25, Diário da República,
 * I Série, n.º 176, 16 September 2025:
 * - Cabinda: page 20315.
 * - Zaire: page 20316.
 *
 * The annex uses commune code "00" when no commune is listed for a
 * municipality. Those placeholders are not separate commune records.
 */
export const cabindaMunicipalities: AdministrativeUnit[] = [
  { id: "ao-cabinda-cabinda", name: "Cabinda", level: "municipality", parentId: "ao-cabinda", officialCode: "AOCDA0101" },
  { id: "ao-cabinda-cacongo", name: "Cacongo", level: "municipality", parentId: "ao-cabinda", officialCode: "AOCDA0102" },
  { id: "ao-cabinda-buco-zau", name: "Buco Zau", level: "municipality", parentId: "ao-cabinda", officialCode: "AOCDA0103" },
  { id: "ao-cabinda-belize", name: "Belize", level: "municipality", parentId: "ao-cabinda", officialCode: "AOCDA0104" },
  { id: "ao-cabinda-miconje", name: "Miconje", level: "municipality", parentId: "ao-cabinda", officialCode: "AOCDA0105" },
  { id: "ao-cabinda-massabi", name: "Massabi", level: "municipality", parentId: "ao-cabinda", officialCode: "AOCDA0106" },
  { id: "ao-cabinda-necuto", name: "Necuto", level: "municipality", parentId: "ao-cabinda", officialCode: "AOCDA0107" },
  { id: "ao-cabinda-tando-zinze", name: "Tando Zinze", level: "municipality", parentId: "ao-cabinda", officialCode: "AOCDA0108" },
  { id: "ao-cabinda-liambo", name: "Liambo", level: "municipality", parentId: "ao-cabinda", officialCode: "AOCDA0109" },
  { id: "ao-cabinda-ngoio", name: "Ngoio", level: "municipality", parentId: "ao-cabinda", officialCode: "AOCDA0110" },
];

export const cabindaCommunes: AdministrativeUnit[] = [
  { id: "ao-cabinda-cacongo-landana", name: "Landana", level: "commune", parentId: "ao-cabinda-cacongo", officialCode: "AOCDA010201" },
  { id: "ao-cabinda-cacongo-dinge", name: "Dinge", level: "commune", parentId: "ao-cabinda-cacongo", officialCode: "AOCDA010202" },
  { id: "ao-cabinda-belize-belize", name: "Belize", level: "commune", parentId: "ao-cabinda-belize", officialCode: "AOCDA010401" },
  { id: "ao-cabinda-belize-luali", name: "Luali", level: "commune", parentId: "ao-cabinda-belize", officialCode: "AOCDA010402" },
  { id: "ao-cabinda-necuto-necuto", name: "Necuto", level: "commune", parentId: "ao-cabinda-necuto", officialCode: "AOCDA010701" },
  { id: "ao-cabinda-necuto-inhuca", name: "Inhuca", level: "commune", parentId: "ao-cabinda-necuto", officialCode: "AOCDA010702" },
  { id: "ao-cabinda-tando-zinze-tando-zinze", name: "Tando Zinze", level: "commune", parentId: "ao-cabinda-tando-zinze", officialCode: "AOCDA010801" },
  { id: "ao-cabinda-tando-zinze-malembo", name: "Malembo", level: "commune", parentId: "ao-cabinda-tando-zinze", officialCode: "AOCDA010802" },
];

export const zaireMunicipalities: AdministrativeUnit[] = [
  { id: "ao-zaire-soyo", name: "Soyo", level: "municipality", parentId: "ao-zaire", officialCode: "AOZRE0201" },
  { id: "ao-zaire-mbanza-kongo", name: "Mbanza Kongo", level: "municipality", parentId: "ao-zaire", officialCode: "AOZRE0202" },
  { id: "ao-zaire-nzeto", name: "N'zeto", level: "municipality", parentId: "ao-zaire", officialCode: "AOZRE0203" },
  { id: "ao-zaire-tomboco", name: "Tomboco", level: "municipality", parentId: "ao-zaire", officialCode: "AOZRE0204" },
  { id: "ao-zaire-cuimba", name: "Cuimba", level: "municipality", parentId: "ao-zaire", officialCode: "AOZRE0205" },
  { id: "ao-zaire-noqui", name: "Nóqui", level: "municipality", parentId: "ao-zaire", officialCode: "AOZRE0206" },
  { id: "ao-zaire-luvo", name: "Luvo", level: "municipality", parentId: "ao-zaire", officialCode: "AOZRE0207" },
  { id: "ao-zaire-lufico", name: "Lufico", level: "municipality", parentId: "ao-zaire", officialCode: "AOZRE0208" },
  { id: "ao-zaire-quelo", name: "Quelo", level: "municipality", parentId: "ao-zaire", officialCode: "AOZRE0209" },
  { id: "ao-zaire-serra-de-canda", name: "Serra de Canda", level: "municipality", parentId: "ao-zaire", officialCode: "AOZRE0210" },
  { id: "ao-zaire-quindeje", name: "Quindeje", level: "municipality", parentId: "ao-zaire", officialCode: "AOZRE0211" },
];

export const zaireCommunes: AdministrativeUnit[] = [
  { id: "ao-zaire-soyo-soyo", name: "Soyo", level: "commune", parentId: "ao-zaire-soyo", officialCode: "AOZRE020101" },
  { id: "ao-zaire-soyo-pedra-de-feitico", name: "Pedra de Feitiço", level: "commune", parentId: "ao-zaire-soyo", officialCode: "AOZRE020102" },
  { id: "ao-zaire-mbanza-kongo-mbanza-kongo", name: "Mbanza Kongo", level: "commune", parentId: "ao-zaire-mbanza-kongo", officialCode: "AOZRE020201" },
  { id: "ao-zaire-mbanza-kongo-madimba", name: "Madimba", level: "commune", parentId: "ao-zaire-mbanza-kongo", officialCode: "AOZRE020202" },
  { id: "ao-zaire-mbanza-kongo-caluca", name: "Caluca", level: "commune", parentId: "ao-zaire-mbanza-kongo", officialCode: "AOZRE020203" },
  { id: "ao-zaire-mbanza-kongo-quiende", name: "Quiende", level: "commune", parentId: "ao-zaire-mbanza-kongo", officialCode: "AOZRE020204" },
  { id: "ao-zaire-nzeto-nzeto", name: "N'zeto", level: "commune", parentId: "ao-zaire-nzeto", officialCode: "AOZRE020301" },
  { id: "ao-zaire-nzeto-mussera", name: "Mussera", level: "commune", parentId: "ao-zaire-nzeto", officialCode: "AOZRE020302" },
  { id: "ao-zaire-tomboco-tomboco", name: "Tomboco", level: "commune", parentId: "ao-zaire-tomboco", officialCode: "AOZRE020401" },
  { id: "ao-zaire-tomboco-quinsimba", name: "Quinsimba", level: "commune", parentId: "ao-zaire-tomboco", officialCode: "AOZRE020402" },
  { id: "ao-zaire-tomboco-quinzau", name: "Quinzau", level: "commune", parentId: "ao-zaire-tomboco", officialCode: "AOZRE020403" },
  { id: "ao-zaire-cuimba-cuimba", name: "Cuimba", level: "commune", parentId: "ao-zaire-cuimba", officialCode: "AOZRE020501" },
  { id: "ao-zaire-cuimba-buela", name: "Buela", level: "commune", parentId: "ao-zaire-cuimba", officialCode: "AOZRE020502" },
  { id: "ao-zaire-cuimba-luvaca", name: "Luvaca", level: "commune", parentId: "ao-zaire-cuimba", officialCode: "AOZRE020503" },
  { id: "ao-zaire-lufico-lufico", name: "Lufico", level: "commune", parentId: "ao-zaire-lufico", officialCode: "AOZRE020801" },
  { id: "ao-zaire-lufico-mpala", name: "Mpala", level: "commune", parentId: "ao-zaire-lufico", officialCode: "AOZRE020802" },
  { id: "ao-zaire-quindeje-quibala-norte", name: "Quibala-Norte", level: "commune", parentId: "ao-zaire-quindeje", officialCode: "AOZRE021101" },
  { id: "ao-zaire-quindeje-quindeje", name: "Quindeje", level: "commune", parentId: "ao-zaire-quindeje", officialCode: "AOZRE021102" },
];


export const uigeMunicipalities: AdministrativeUnit[] = [
  { id: "ao-uige-dange-quitexe", name: "Dange Quitexe", level: "municipality", parentId: "ao-uige", officialCode: "AOUGE0301" },
  { id: "ao-uige-bungo", name: "Bungo", level: "municipality", parentId: "ao-uige", officialCode: "AOUGE0302" },
  { id: "ao-uige-ambuila", name: "Ambuíla", level: "municipality", parentId: "ao-uige", officialCode: "AOUGE0303" },
  { id: "ao-uige-negage", name: "Negage", level: "municipality", parentId: "ao-uige", officialCode: "AOUGE0304" },
  { id: "ao-uige-puri", name: "Puri", level: "municipality", parentId: "ao-uige", officialCode: "AOUGE0305" },
  { id: "ao-uige-maquela-do-zombo", name: "Maquela do Zombo", level: "municipality", parentId: "ao-uige", officialCode: "AOUGE0306" },
  { id: "ao-uige-damba", name: "Damba", level: "municipality", parentId: "ao-uige", officialCode: "AOUGE0307" },
  { id: "ao-uige-sanza-pombo", name: "Sanza Pombo", level: "municipality", parentId: "ao-uige", officialCode: "AOUGE0308" },
  { id: "ao-uige-bembe", name: "Bembe", level: "municipality", parentId: "ao-uige", officialCode: "AOUGE0309" },
  { id: "ao-uige-milunga", name: "Milunga", level: "municipality", parentId: "ao-uige", officialCode: "AOUGE0310" },
  { id: "ao-uige-songo", name: "Songo", level: "municipality", parentId: "ao-uige", officialCode: "AOUGE0311" },
  { id: "ao-uige-quimbele", name: "Quimbele", level: "municipality", parentId: "ao-uige", officialCode: "AOUGE0312" },
  { id: "ao-uige-cangola", name: "Cangola", level: "municipality", parentId: "ao-uige", officialCode: "AOUGE0313" },
  { id: "ao-uige-uige", name: "Uige", level: "municipality", parentId: "ao-uige", officialCode: "AOUGE0314" },
  { id: "ao-uige-mucaba", name: "Mucaba", level: "municipality", parentId: "ao-uige", officialCode: "AOUGE0315" },
  { id: "ao-uige-nova-esperanca", name: "Nova Esperança", level: "municipality", parentId: "ao-uige", officialCode: "AOUGE0316" },
  { id: "ao-uige-sacandica", name: "Sacandica", level: "municipality", parentId: "ao-uige", officialCode: "AOUGE0317" },
  { id: "ao-uige-nsosso", name: "Nsosso", level: "municipality", parentId: "ao-uige", officialCode: "AOUGE0318" },
  { id: "ao-uige-lucunga", name: "Lucunga", level: "municipality", parentId: "ao-uige", officialCode: "AOUGE0319" },
  { id: "ao-uige-quipedro", name: "Quipedro", level: "municipality", parentId: "ao-uige", officialCode: "AOUGE0320" },
  { id: "ao-uige-massau", name: "Massau", level: "municipality", parentId: "ao-uige", officialCode: "AOUGE0321" },
  { id: "ao-uige-vista-alegre", name: "Vista Alegre", level: "municipality", parentId: "ao-uige", officialCode: "AOUGE0322" },
  { id: "ao-uige-alto-zaza", name: "Alto Zaza", level: "municipality", parentId: "ao-uige", officialCode: "AOUGE0323" },
];

export const uigeCommunes: AdministrativeUnit[] = [
  { id: "ao-uige-dange-quitexe-quitexe", name: "Quitexe", level: "commune", parentId: "ao-uige-dange-quitexe", officialCode: "AOUGE030101" },
  { id: "ao-uige-dange-quitexe-aldeia-vicosa", name: "Aldeia Viçosa", level: "commune", parentId: "ao-uige-dange-quitexe", officialCode: "AOUGE030102" },
  { id: "ao-uige-negage-negage", name: "Negage", level: "commune", parentId: "ao-uige-negage", officialCode: "AOUGE030401" },
  { id: "ao-uige-negage-dimuca", name: "Dimuca", level: "commune", parentId: "ao-uige-negage", officialCode: "AOUGE030402" },
  { id: "ao-uige-negage-quisseque", name: "Quisseque", level: "commune", parentId: "ao-uige-negage", officialCode: "AOUGE030403" },
  { id: "ao-uige-maquela-maquela-do-zombo", name: "Maquela do Zombo", level: "commune", parentId: "ao-uige-maquela-do-zombo", officialCode: "AOUGE030601" },
  { id: "ao-uige-maquela-quibocolo", name: "Quibocolo", level: "commune", parentId: "ao-uige-maquela-do-zombo", officialCode: "AOUGE030602" },
  { id: "ao-uige-damba-damba", name: "Damba", level: "commune", parentId: "ao-uige-damba", officialCode: "AOUGE030701" },
  { id: "ao-uige-damba-petecuso", name: "Petecuso", level: "commune", parentId: "ao-uige-damba", officialCode: "AOUGE030702" },
  { id: "ao-uige-damba-camatambo", name: "Camatambo", level: "commune", parentId: "ao-uige-damba", officialCode: "AOUGE030703" },
  { id: "ao-uige-damba-lembua", name: "Lémbua", level: "commune", parentId: "ao-uige-damba", officialCode: "AOUGE030704" },
  { id: "ao-uige-sanza-pombo-sanza-pombo", name: "Sanza Pombo", level: "commune", parentId: "ao-uige-sanza-pombo", officialCode: "AOUGE030801" },
  { id: "ao-uige-sanza-pombo-uamba", name: "Uamba", level: "commune", parentId: "ao-uige-sanza-pombo", officialCode: "AOUGE030802" },
  { id: "ao-uige-sanza-pombo-cuilo-pombo", name: "Cuilo Pombo", level: "commune", parentId: "ao-uige-sanza-pombo", officialCode: "AOUGE030803" },
  { id: "ao-uige-sanza-pombo-alfandega", name: "Alfândega", level: "commune", parentId: "ao-uige-sanza-pombo", officialCode: "AOUGE030804" },
  { id: "ao-uige-bembe-bembe", name: "Bembe", level: "commune", parentId: "ao-uige-bembe", officialCode: "AOUGE030901" },
  { id: "ao-uige-bembe-mabaia", name: "Mabaia", level: "commune", parentId: "ao-uige-bembe", officialCode: "AOUGE030902" },
  { id: "ao-uige-milunga-milunga", name: "Milunga", level: "commune", parentId: "ao-uige-milunga", officialCode: "AOUGE031001" },
  { id: "ao-uige-milunga-macocola", name: "Macocola", level: "commune", parentId: "ao-uige-milunga", officialCode: "AOUGE031002" },
  { id: "ao-uige-songo-songo", name: "Songo", level: "commune", parentId: "ao-uige-songo", officialCode: "AOUGE031101" },
  { id: "ao-uige-songo-quivuenga", name: "Quivuenga", level: "commune", parentId: "ao-uige-songo", officialCode: "AOUGE031102" },
  { id: "ao-uige-quimbele-quimbele", name: "Quimbele", level: "commune", parentId: "ao-uige-quimbele", officialCode: "AOUGE031201" },
  { id: "ao-uige-quimbele-icoca", name: "Icoca", level: "commune", parentId: "ao-uige-quimbele", officialCode: "AOUGE031202" },
  { id: "ao-uige-cangola-cangola", name: "Cangola", level: "commune", parentId: "ao-uige-cangola", officialCode: "AOUGE031301" },
  { id: "ao-uige-cangola-bengo", name: "Bengo", level: "commune", parentId: "ao-uige-cangola", officialCode: "AOUGE031302" },
  { id: "ao-uige-cangola-cajongo", name: "Cajongo", level: "commune", parentId: "ao-uige-cangola", officialCode: "AOUGE031303" },
  { id: "ao-uige-uige-uige", name: "Uige", level: "commune", parentId: "ao-uige-uige", officialCode: "AOUGE031401" },
  { id: "ao-uige-uige-luanga", name: "Luanga", level: "commune", parentId: "ao-uige-uige", officialCode: "AOUGE031402" },
  { id: "ao-uige-uige-casseche", name: "Casseche", level: "commune", parentId: "ao-uige-uige", officialCode: "AOUGE031403" },
  { id: "ao-uige-uige-cancungo", name: "Cancungo", level: "commune", parentId: "ao-uige-uige", officialCode: "AOUGE031404" },
  { id: "ao-uige-mucaba-mucaba", name: "Mucaba", level: "commune", parentId: "ao-uige-mucaba", officialCode: "AOUGE031501" },
  { id: "ao-uige-mucaba-uando-mucaba", name: "Uando Mucaba", level: "commune", parentId: "ao-uige-mucaba", officialCode: "AOUGE031502" },
  { id: "ao-uige-nova-esperanca-nova-esperanca", name: "Nova Esperança", level: "commune", parentId: "ao-uige-nova-esperanca", officialCode: "AOUGE031601" },
  { id: "ao-uige-nova-esperanca-buenga-sul", name: "Buenga - Sul", level: "commune", parentId: "ao-uige-nova-esperanca", officialCode: "AOUGE031602" },
  { id: "ao-uige-nova-esperanca-cuilo-camboso", name: "Cuílo Camboso", level: "commune", parentId: "ao-uige-nova-esperanca", officialCode: "AOUGE031603" },
  { id: "ao-uige-sacandica-sacandica", name: "Sacandica", level: "commune", parentId: "ao-uige-sacandica", officialCode: "AOUGE031701" },
  { id: "ao-uige-sacandica-cuilo-futa", name: "Cuílo Futa", level: "commune", parentId: "ao-uige-sacandica", officialCode: "AOUGE031702" },
  { id: "ao-uige-sacandica-beu", name: "Béu", level: "commune", parentId: "ao-uige-sacandica", officialCode: "AOUGE031703" },
  { id: "ao-uige-massau-massau", name: "Massau", level: "commune", parentId: "ao-uige-massau", officialCode: "AOUGE032101" },
  { id: "ao-uige-massau-macolo", name: "Macolo", level: "commune", parentId: "ao-uige-massau", officialCode: "AOUGE032102" },
  { id: "ao-uige-vista-alegre-vista-alegre", name: "Vista Alegre", level: "commune", parentId: "ao-uige-vista-alegre", officialCode: "AOUGE032201" },
  { id: "ao-uige-vista-alegre-cambamba", name: "Cambamba", level: "commune", parentId: "ao-uige-vista-alegre", officialCode: "AOUGE032202" },
  { id: "ao-uige-alto-zaza-alto-zaza", name: "Alto Zaza", level: "commune", parentId: "ao-uige-alto-zaza", officialCode: "AOUGE032301" },
  { id: "ao-uige-alto-zaza-cuango-calumbo", name: "Cuango Calumbo", level: "commune", parentId: "ao-uige-alto-zaza", officialCode: "AOUGE032302" },
];


export const bengoMunicipalities: AdministrativeUnit[] = [
  { id: "ao-bengo-dande", name: "Dande", level: "municipality", parentId: "ao-bengo", officialCode: "AOBGO0401" },
  { id: "ao-bengo-quibaxe", name: "Quibaxe", level: "municipality", parentId: "ao-bengo", officialCode: "AOBGO0402" },
  { id: "ao-bengo-muxaluando", name: "Muxaluando", level: "municipality", parentId: "ao-bengo", officialCode: "AOBGO0403" },
  { id: "ao-bengo-bula-atumba", name: "Bula Atumba", level: "municipality", parentId: "ao-bengo", officialCode: "AOBGO0404" },
  { id: "ao-bengo-ambriz", name: "Ambriz", level: "municipality", parentId: "ao-bengo", officialCode: "AOBGO0405" },
  { id: "ao-bengo-pango-aluquem", name: "Pango Aluquém", level: "municipality", parentId: "ao-bengo", officialCode: "AOBGO0406" },
  { id: "ao-bengo-barra-do-dande", name: "Barra do Dande", level: "municipality", parentId: "ao-bengo", officialCode: "AOBGO0407" },
  { id: "ao-bengo-piri", name: "Piri", level: "municipality", parentId: "ao-bengo", officialCode: "AOBGO0408" },
  { id: "ao-bengo-quicunzo", name: "Quicunzo", level: "municipality", parentId: "ao-bengo", officialCode: "AOBGO0409" },
  { id: "ao-bengo-nambuangongo", name: "Nambuangongo", level: "municipality", parentId: "ao-bengo", officialCode: "AOBGO0410" },
  { id: "ao-bengo-ucua", name: "Úcua", level: "municipality", parentId: "ao-bengo", officialCode: "AOBGO0411" },
  { id: "ao-bengo-panguila", name: "Panguila", level: "municipality", parentId: "ao-bengo", officialCode: "AOBGO0412" },
];

export const bengoCommunes: AdministrativeUnit[] = [
  { id: "ao-bengo-dande-caxito", name: "Caxito", level: "commune", parentId: "ao-bengo-dande", officialCode: "AOBGO040101" },
  { id: "ao-bengo-dande-mabubas", name: "Mabubas", level: "commune", parentId: "ao-bengo-dande", officialCode: "AOBGO040102" },
  { id: "ao-bengo-dande-quicabo", name: "Quicabo", level: "commune", parentId: "ao-bengo-dande", officialCode: "AOBGO040103" },
  { id: "ao-bengo-quibaxe-quibaxe", name: "Quibaxe", level: "commune", parentId: "ao-bengo-quibaxe", officialCode: "AOBGO040201" },
  { id: "ao-bengo-quibaxe-paredes", name: "Paredes", level: "commune", parentId: "ao-bengo-quibaxe", officialCode: "AOBGO040202" },
  { id: "ao-bengo-quibaxe-coxe", name: "Coxe", level: "commune", parentId: "ao-bengo-quibaxe", officialCode: "AOBGO040203" },
  { id: "ao-bengo-muxaluando-muxaluando", name: "Muxaluando", level: "commune", parentId: "ao-bengo-muxaluando", officialCode: "AOBGO040301" },
  { id: "ao-bengo-muxaluando-quixico", name: "Quixico", level: "commune", parentId: "ao-bengo-muxaluando", officialCode: "AOBGO040302" },
  { id: "ao-bengo-muxaluando-cage-mazumbo", name: "Cage Mazumbo", level: "commune", parentId: "ao-bengo-muxaluando", officialCode: "AOBGO040303" },
  { id: "ao-bengo-bula-atumba-bula-atumba", name: "Bula Atumba", level: "commune", parentId: "ao-bengo-bula-atumba", officialCode: "AOBGO040401" },
  { id: "ao-bengo-bula-atumba-quiage", name: "Quiage", level: "commune", parentId: "ao-bengo-bula-atumba", officialCode: "AOBGO040402" },
  { id: "ao-bengo-ambriz-ambriz", name: "Ambriz", level: "commune", parentId: "ao-bengo-ambriz", officialCode: "AOBGO040501" },
  { id: "ao-bengo-ambriz-bela-vista", name: "Bela Vista", level: "commune", parentId: "ao-bengo-ambriz", officialCode: "AOBGO040502" },
  { id: "ao-bengo-ambriz-tabi", name: "Tabi", level: "commune", parentId: "ao-bengo-ambriz", officialCode: "AOBGO040503" },
  { id: "ao-bengo-pango-aluquem-pango-aluquem", name: "Pango Aluquém", level: "commune", parentId: "ao-bengo-pango-aluquem", officialCode: "AOBGO040601" },
  { id: "ao-bengo-pango-aluquem-cazuangongo", name: "Cazuangongo", level: "commune", parentId: "ao-bengo-pango-aluquem", officialCode: "AOBGO040602" },
  { id: "ao-bengo-nambuangongo-gombe", name: "Gombe", level: "commune", parentId: "ao-bengo-nambuangongo", officialCode: "AOBGO041001" },
  { id: "ao-bengo-nambuangongo-canacassala", name: "Canacassala", level: "commune", parentId: "ao-bengo-nambuangongo", officialCode: "AOBGO041002" },
  { id: "ao-bengo-nambuangongo-zala", name: "Zala", level: "commune", parentId: "ao-bengo-nambuangongo", officialCode: "AOBGO041003" },
];
