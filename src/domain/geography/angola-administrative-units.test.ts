import { describe, expect, it } from "vitest";
import { angolaProvinces } from "./angola";
import {
  cabindaCommunes,
  cabindaMunicipalities,
  zaireCommunes,
  zaireMunicipalities,
  uigeCommunes,
  uigeMunicipalities,
  bengoCommunes,
  bengoMunicipalities,
  cuanzaNorteCommunes,
  cuanzaNorteMunicipalities,
  cuanzaSulCommunes,
  cuanzaSulMunicipalities,
  malanjeCommunes,
  malanjeMunicipalities,
  lundaNorteCommunes,
  lundaNorteMunicipalities,
  lundaSulCommunes,
  lundaSulMunicipalities,
  moxicoCommunes,
  moxicoMunicipalities,
} from "./angola-administrative-units";

describe("Angola administrative hierarchy — Cabinda tranche", () => {
  it("contains the ten municipalities transcribed for Cabinda", () => {
    expect(cabindaMunicipalities).toHaveLength(10);
    expect(cabindaMunicipalities.map((unit) => unit.officialCode)).toEqual([
      "AOCDA0101", "AOCDA0102", "AOCDA0103", "AOCDA0104", "AOCDA0105",
      "AOCDA0106", "AOCDA0107", "AOCDA0108", "AOCDA0109", "AOCDA0110",
    ]);
  });

  it("links each municipality to the Cabinda province", () => {
    const cabinda = angolaProvinces.find((province) => province.id === "ao-cabinda");
    expect(cabinda).toBeDefined();
    expect(cabindaMunicipalities.every((unit) => unit.parentId === cabinda?.id)).toBe(true);
    expect(cabindaMunicipalities.every((unit) => unit.level === "municipality")).toBe(true);
  });

  it("contains only the eight communes explicitly listed in the legal annex", () => {
    expect(cabindaCommunes).toHaveLength(8);
    expect(cabindaCommunes.map((unit) => unit.officialCode)).toEqual([
      "AOCDA010201", "AOCDA010202", "AOCDA010401", "AOCDA010402",
      "AOCDA010701", "AOCDA010702", "AOCDA010801", "AOCDA010802",
    ]);
  });

  it("links every Cabinda commune to an existing municipality", () => {
    const municipalityIds = new Set(cabindaMunicipalities.map((unit) => unit.id));
    expect(cabindaCommunes.every((unit) => municipalityIds.has(unit.parentId ?? ""))).toBe(true);
    expect(cabindaCommunes.every((unit) => unit.level === "commune")).toBe(true);
  });

  it("does not turn Cabinda's legal 00 commune placeholder into a commune record", () => {
    const communeParentIds = new Set(cabindaCommunes.map((unit) => unit.parentId));
    const municipalitiesWithoutCommunes = cabindaMunicipalities.filter(
      (unit) => !communeParentIds.has(unit.id),
    );
    expect(municipalitiesWithoutCommunes.map((unit) => unit.name)).toEqual([
      "Cabinda", "Buco Zau", "Miconje", "Massabi", "Liambo", "Ngoio",
    ]);
  });
});

describe("Angola administrative hierarchy — Zaire tranche", () => {
  it("contains the eleven municipalities with their exact legal codes", () => {
    expect(zaireMunicipalities).toHaveLength(11);
    expect(zaireMunicipalities.map((unit) => unit.officialCode)).toEqual([
      "AOZRE0201", "AOZRE0202", "AOZRE0203", "AOZRE0204", "AOZRE0205",
      "AOZRE0206", "AOZRE0207", "AOZRE0208", "AOZRE0209", "AOZRE0210",
      "AOZRE0211",
    ]);
    expect(zaireMunicipalities.map((unit) => unit.name)).toEqual([
      "Soyo", "Mbanza Kongo", "N'zeto", "Tomboco", "Cuimba", "Nóqui",
      "Luvo", "Lufico", "Quelo", "Serra de Canda", "Quindeje",
    ]);
  });

  it("links all Zaire municipalities to the Zaire province", () => {
    const zaire = angolaProvinces.find((province) => province.id === "ao-zaire");
    expect(zaire).toBeDefined();
    expect(zaireMunicipalities.every((unit) => unit.parentId === zaire?.id)).toBe(true);
    expect(zaireMunicipalities.every((unit) => unit.level === "municipality")).toBe(true);
  });

  it("contains the eighteen explicitly listed Zaire communes with exact codes", () => {
    expect(zaireCommunes).toHaveLength(18);
    expect(zaireCommunes.map((unit) => unit.officialCode)).toEqual([
      "AOZRE020101", "AOZRE020102", "AOZRE020201", "AOZRE020202",
      "AOZRE020203", "AOZRE020204", "AOZRE020301", "AOZRE020302",
      "AOZRE020401", "AOZRE020402", "AOZRE020403", "AOZRE020501",
      "AOZRE020502", "AOZRE020503", "AOZRE020801", "AOZRE020802",
      "AOZRE021101", "AOZRE021102",
    ]);
  });

  it("links each Zaire commune to an existing Zaire municipality", () => {
    const municipalityIds = new Set(zaireMunicipalities.map((unit) => unit.id));
    expect(zaireCommunes.every((unit) => municipalityIds.has(unit.parentId ?? ""))).toBe(true);
    expect(zaireCommunes.every((unit) => unit.level === "commune")).toBe(true);
  });

  it("does not create communes for the four municipality rows marked 00", () => {
    const communeParentIds = new Set(zaireCommunes.map((unit) => unit.parentId));
    const municipalitiesWithoutCommunes = zaireMunicipalities.filter(
      (unit) => !communeParentIds.has(unit.id),
    );
    expect(municipalitiesWithoutCommunes.map((unit) => unit.name)).toEqual([
      "Nóqui", "Luvo", "Quelo", "Serra de Canda",
    ]);
  });

  it("keeps IDs and official codes unique across both verified tranches", () => {
    const units = [
      ...cabindaMunicipalities, ...cabindaCommunes,
      ...zaireMunicipalities, ...zaireCommunes,
    ];
    expect(new Set(units.map((unit) => unit.id)).size).toBe(units.length);
    expect(new Set(units.map((unit) => unit.officialCode)).size).toBe(units.length);
  });
});


describe("Angola administrative hierarchy — Uíge tranche", () => {
  it("contains the 23 municipalities in the legal annex order", () => {
    expect(uigeMunicipalities).toHaveLength(23);
    expect(uigeMunicipalities.map((unit) => unit.officialCode)).toEqual(
      Array.from({ length: 23 }, (_, index) => `AOUGE03${String(index + 1).padStart(2, "0")}`),
    );
    expect(uigeMunicipalities.map((unit) => unit.name)).toEqual([
      "Dange Quitexe", "Bungo", "Ambuíla", "Negage", "Puri",
      "Maquela do Zombo", "Damba", "Sanza Pombo", "Bembe", "Milunga",
      "Songo", "Quimbele", "Cangola", "Uige", "Mucaba",
      "Nova Esperança", "Sacandica", "Nsosso", "Lucunga", "Quipedro",
      "Massau", "Vista Alegre", "Alto Zaza",
    ]);
  });

  it("links all Uíge municipalities to the Uíge province", () => {
    const uige = angolaProvinces.find((province) => province.id === "ao-uige");
    expect(uige).toBeDefined();
    expect(uigeMunicipalities.every((unit) => unit.parentId === uige?.id)).toBe(true);
    expect(uigeMunicipalities.every((unit) => unit.level === "municipality")).toBe(true);
  });

  it("contains the 44 communes explicitly listed in the legal annex", () => {
    expect(uigeCommunes).toHaveLength(44);
    expect(uigeCommunes.map((unit) => unit.officialCode)).toEqual([
      "AOUGE030101", "AOUGE030102",
      "AOUGE030401", "AOUGE030402", "AOUGE030403",
      "AOUGE030601", "AOUGE030602",
      "AOUGE030701", "AOUGE030702", "AOUGE030703", "AOUGE030704",
      "AOUGE030801", "AOUGE030802", "AOUGE030803", "AOUGE030804",
      "AOUGE030901", "AOUGE030902",
      "AOUGE031001", "AOUGE031002",
      "AOUGE031101", "AOUGE031102",
      "AOUGE031201", "AOUGE031202",
      "AOUGE031301", "AOUGE031302", "AOUGE031303",
      "AOUGE031401", "AOUGE031402", "AOUGE031403", "AOUGE031404",
      "AOUGE031501", "AOUGE031502",
      "AOUGE031601", "AOUGE031602", "AOUGE031603",
      "AOUGE031701", "AOUGE031702", "AOUGE031703",
      "AOUGE032101", "AOUGE032102",
      "AOUGE032201", "AOUGE032202",
      "AOUGE032301", "AOUGE032302",
    ]);
  });

  it("links every Uíge commune to an existing municipality", () => {
    const municipalityIds = new Set(uigeMunicipalities.map((unit) => unit.id));
    expect(uigeCommunes.every((unit) => municipalityIds.has(unit.parentId ?? ""))).toBe(true);
    expect(uigeCommunes.every((unit) => unit.level === "commune")).toBe(true);
  });

  it("does not create communes for the six municipality rows marked 00", () => {
    const communeParentIds = new Set(uigeCommunes.map((unit) => unit.parentId));
    const municipalitiesWithoutCommunes = uigeMunicipalities.filter(
      (unit) => !communeParentIds.has(unit.id),
    );
    expect(municipalitiesWithoutCommunes.map((unit) => unit.name)).toEqual([
      "Bungo", "Ambuíla", "Puri", "Nsosso", "Lucunga", "Quipedro",
    ]);
  });

  it("keeps IDs and official codes unique across all three verified tranches", () => {
    const units = [
      ...cabindaMunicipalities, ...cabindaCommunes,
      ...zaireMunicipalities, ...zaireCommunes,
      ...uigeMunicipalities, ...uigeCommunes,
    ];
    expect(new Set(units.map((unit) => unit.id)).size).toBe(units.length);
    expect(new Set(units.map((unit) => unit.officialCode)).size).toBe(units.length);
  });
});


describe("Angola administrative hierarchy — Bengo tranche", () => {
  it("contains the twelve municipalities in the legal annex order", () => {
    expect(bengoMunicipalities).toHaveLength(12);
    expect(bengoMunicipalities.map((unit) => unit.officialCode)).toEqual(
      Array.from({ length: 12 }, (_, index) => `AOBGO04${String(index + 1).padStart(2, "0")}`),
    );
    expect(bengoMunicipalities.map((unit) => unit.name)).toEqual([
      "Dande", "Quibaxe", "Muxaluando", "Bula Atumba", "Ambriz",
      "Pango Aluquém", "Barra do Dande", "Piri", "Quicunzo",
      "Nambuangongo", "Úcua", "Panguila",
    ]);
  });

  it("links all Bengo municipalities to the Bengo province", () => {
    const bengo = angolaProvinces.find((province) => province.id === "ao-bengo");
    expect(bengo).toBeDefined();
    expect(bengoMunicipalities.every((unit) => unit.parentId === bengo?.id)).toBe(true);
    expect(bengoMunicipalities.every((unit) => unit.level === "municipality")).toBe(true);
  });

  it("contains the nineteen communes explicitly listed in the legal annex", () => {
    expect(bengoCommunes).toHaveLength(19);
    expect(bengoCommunes.map((unit) => unit.officialCode)).toEqual([
      "AOBGO040101", "AOBGO040102", "AOBGO040103",
      "AOBGO040201", "AOBGO040202", "AOBGO040203",
      "AOBGO040301", "AOBGO040302", "AOBGO040303",
      "AOBGO040401", "AOBGO040402",
      "AOBGO040501", "AOBGO040502", "AOBGO040503",
      "AOBGO040601", "AOBGO040602",
      "AOBGO041001", "AOBGO041002", "AOBGO041003",
    ]);
    expect(bengoCommunes.map((unit) => unit.name)).toEqual([
      "Caxito", "Mabubas", "Quicabo",
      "Quibaxe", "Paredes", "Coxe",
      "Muxaluando", "Quixico", "Cage Mazumbo",
      "Bula Atumba", "Quiage",
      "Ambriz", "Bela Vista", "Tabi",
      "Pango Aluquém", "Cazuangongo",
      "Gombe", "Canacassala", "Zala",
    ]);
  });

  it("links every Bengo commune to an existing municipality", () => {
    const municipalityIds = new Set(bengoMunicipalities.map((unit) => unit.id));
    expect(bengoCommunes.every((unit) => municipalityIds.has(unit.parentId ?? ""))).toBe(true);
    expect(bengoCommunes.every((unit) => unit.level === "commune")).toBe(true);
  });

  it("does not create communes for the five municipality rows marked 00", () => {
    const communeParentIds = new Set(bengoCommunes.map((unit) => unit.parentId));
    const municipalitiesWithoutCommunes = bengoMunicipalities.filter(
      (unit) => !communeParentIds.has(unit.id),
    );
    expect(municipalitiesWithoutCommunes.map((unit) => unit.name)).toEqual([
      "Barra do Dande", "Piri", "Quicunzo", "Úcua", "Panguila",
    ]);
  });

  it("keeps IDs and official codes unique across all four verified tranches", () => {
    const units = [
      ...cabindaMunicipalities, ...cabindaCommunes,
      ...zaireMunicipalities, ...zaireCommunes,
      ...uigeMunicipalities, ...uigeCommunes,
      ...bengoMunicipalities, ...bengoCommunes,
    ];
    expect(new Set(units.map((unit) => unit.id)).size).toBe(units.length);
    expect(new Set(units.map((unit) => unit.officialCode)).size).toBe(units.length);
  });
});


describe("Angola administrative hierarchy — Cuanza-Norte tranche", () => {
  it("contains the seventeen municipalities in the legal annex order", () => {
    expect(cuanzaNorteMunicipalities).toHaveLength(17);
    expect(cuanzaNorteMunicipalities.map((unit) => unit.officialCode)).toEqual(
      Array.from({ length: 17 }, (_, index) => `AOCNO07${String(index + 1).padStart(2, "0")}`),
    );
    expect(cuanzaNorteMunicipalities.map((unit) => unit.name)).toEqual([
      "Cazengo", "Golungo Alto", "Cambambe", "Samba Cajú", "Ambaca",
      "Lucala", "Banga", "Bolongongo", "Quiculungo", "Ngonguembo",
      "Massangano", "Cêca", "Tango", "Terreiro", "Aldeia Nova",
      "Caculo Cabaça", "Luinga",
    ]);
  });

  it("links all Cuanza-Norte municipalities to the correct province", () => {
    const province = angolaProvinces.find((unit) => unit.id === "ao-cuanza-norte");
    expect(province).toBeDefined();
    expect(cuanzaNorteMunicipalities.every((unit) => unit.parentId === province?.id)).toBe(true);
    expect(cuanzaNorteMunicipalities.every((unit) => unit.level === "municipality")).toBe(true);
  });

  it("contains the twenty-four communes and preserves their official codes", () => {
    expect(cuanzaNorteCommunes).toHaveLength(24);
    expect(cuanzaNorteCommunes.map((unit) => unit.officialCode)).toEqual([
      "AOCNO070101", "AOCNO070102",
      "AOCNO070201", "AOCNO070202", "AOCNO070203",
      "AOCNO070301", "AOCNO070302", "AOCNO070303",
      "AOCNO070401", "AOCNO070402",
      "AOCNO070501", "AOCNO070502", "AOCNO070503",
      "AOCNO070601", "AOCNO070602",
      "AOCNO070701", "AOCNO070702",
      "AOCNO071001", "AOCNO071002", "AOCNO071003",
      "AOCNO071101", "AOCNO071102",
      "AOCNO071401", "AOCNO071402",
    ]);
    expect(cuanzaNorteCommunes.map((unit) => unit.name)).toEqual([
      "Ndalatando", "Caculo Camuiza",
      "Golungo Alto", "Cambondo", "Quilombo quía Puto",
      "Dondo", "Dange ya Menha", "São Pedro da Quilemba",
      "Samba Cajú", "Samba Lucala",
      "Camabatela", "Múa", "Bindo",
      "Lucala", "Quiangombe",
      "Banga", "Cariamba",
      "Quilombo dos Dembos", "Camame", "Cavunga",
      "Massangano", "Zenza do Itombe",
      "Terreiro", "Quiquiemba",
    ]);
  });

  it("links every Cuanza-Norte commune to an existing municipality", () => {
    const municipalityIds = new Set(cuanzaNorteMunicipalities.map((unit) => unit.id));
    expect(cuanzaNorteCommunes.every((unit) => municipalityIds.has(unit.parentId ?? ""))).toBe(true);
    expect(cuanzaNorteCommunes.every((unit) => unit.level === "commune")).toBe(true);
  });

  it("keeps the seven municipalities with commune code 00 as municipality-only records", () => {
    const communeParentIds = new Set(cuanzaNorteCommunes.map((unit) => unit.parentId));
    const municipalityOnly = cuanzaNorteMunicipalities.filter(
      (unit) => !communeParentIds.has(unit.id),
    );
    expect(municipalityOnly.map((unit) => unit.name)).toEqual([
      "Bolongongo", "Quiculungo", "Cêca", "Tango", "Aldeia Nova",
      "Caculo Cabaça", "Luinga",
    ]);
  });

  it("keeps IDs and official codes unique across all five verified tranches", () => {
    const units = [
      ...cabindaMunicipalities, ...cabindaCommunes,
      ...zaireMunicipalities, ...zaireCommunes,
      ...uigeMunicipalities, ...uigeCommunes,
      ...bengoMunicipalities, ...bengoCommunes,
      ...cuanzaNorteMunicipalities, ...cuanzaNorteCommunes,
    ];
    expect(new Set(units.map((unit) => unit.id)).size).toBe(units.length);
    expect(new Set(units.map((unit) => unit.officialCode)).size).toBe(units.length);
  });
});


describe("Angola administrative hierarchy — Cuanza-Sul tranche", () => {
  it("contains the 24 municipalities in the legal annex order", () => {
    expect(cuanzaSulMunicipalities).toHaveLength(24);
    expect(cuanzaSulMunicipalities.map((unit) => unit.officialCode)).toEqual(
      Array.from({ length: 24 }, (_, index) => `AOCSU08${String(index + 1).padStart(2, "0")}`),
    );
    expect(cuanzaSulMunicipalities.map((unit) => unit.name)).toEqual(["Sumbe","Calulo","Gabela","Cassongue","Porto Amboim","Quibala","Seles","Waku Kungo","Mussende","Quilenda","Ebo","Conda","Quirimbo","Munenga","Quissongo","Gungo","Sanga","Gangula","Pambangala","Condé","Amboiva","Lonhe","Quenha","Boa Entrada"]);
  });

  it("links all Cuanza-Sul municipalities to the correct province", () => {
    const province = angolaProvinces.find((unit) => unit.id === "ao-cuanza-sul");
    expect(province).toBeDefined();
    expect(cuanzaSulMunicipalities.every((unit) => unit.parentId === province?.id)).toBe(true);
    expect(cuanzaSulMunicipalities.every((unit) => unit.level === "municipality")).toBe(true);
  });

  it("contains the 23 communes explicitly listed in the legal annex with exact codes", () => {
    expect(cuanzaSulCommunes).toHaveLength(23);
    expect(cuanzaSulCommunes.map((unit) => unit.officialCode)).toEqual(["AOCSU080101","AOCSU080102","AOCSU080201","AOCSU080202","AOCSU080301","AOCSU080302","AOCSU080401","AOCSU080402","AOCSU080403","AOCSU080501","AOCSU080502","AOCSU080601","AOCSU080602","AOCSU080701","AOCSU080702","AOCSU080901","AOCSU080902","AOCSU081101","AOCSU081102","AOCSU081201","AOCSU081202","AOCSU082201","AOCSU082202"]);
    expect(cuanzaSulCommunes.map((unit) => unit.name)).toEqual(["Sumbe","Quicombo","Calulo","Cabuta","Gabela","Assango","Cassongue","Atóme","Dumbi","Porto Amboim","Capolo","Quibala","Dala Cachibo","Seles","Botera","Mussende","Quipaxi","Ebo","Cassanje","Conda","Cunjo","Lonhe","Cariango"]);
  });

  it("links every Cuanza-Sul commune to its correct municipality", () => {
    const municipalityIds = new Set(cuanzaSulMunicipalities.map((unit) => unit.id));
    expect(cuanzaSulCommunes.every((unit) => municipalityIds.has(unit.parentId ?? ""))).toBe(true);
    expect(cuanzaSulCommunes.every((unit) => unit.level === "commune")).toBe(true);
    expect(cuanzaSulCommunes.map((unit) => unit.parentId)).toEqual(["ao-cuanza-sul-sumbe","ao-cuanza-sul-sumbe","ao-cuanza-sul-calulo","ao-cuanza-sul-calulo","ao-cuanza-sul-gabela","ao-cuanza-sul-gabela","ao-cuanza-sul-cassongue","ao-cuanza-sul-cassongue","ao-cuanza-sul-cassongue","ao-cuanza-sul-porto-amboim","ao-cuanza-sul-porto-amboim","ao-cuanza-sul-quibala","ao-cuanza-sul-quibala","ao-cuanza-sul-seles","ao-cuanza-sul-seles","ao-cuanza-sul-mussende","ao-cuanza-sul-mussende","ao-cuanza-sul-ebo","ao-cuanza-sul-ebo","ao-cuanza-sul-conda","ao-cuanza-sul-conda","ao-cuanza-sul-lonhe","ao-cuanza-sul-lonhe"]);
  });

  it("keeps the thirteen municipalities with commune code 00 as municipality-only records", () => {
    const communeParentIds = new Set(cuanzaSulCommunes.map((unit) => unit.parentId));
    const municipalityOnly = cuanzaSulMunicipalities.filter(
      (unit) => !communeParentIds.has(unit.id),
    );
    expect(municipalityOnly.map((unit) => unit.name)).toEqual(["Waku Kungo","Quilenda","Quirimbo","Munenga","Quissongo","Gungo","Sanga","Gangula","Pambangala","Condé","Amboiva","Quenha","Boa Entrada"]);
  });

  it("keeps IDs and official codes unique across all six verified tranches", () => {
    const units = [
      ...cabindaMunicipalities, ...cabindaCommunes,
      ...zaireMunicipalities, ...zaireCommunes,
      ...uigeMunicipalities, ...uigeCommunes,
      ...bengoMunicipalities, ...bengoCommunes,
      ...cuanzaNorteMunicipalities, ...cuanzaNorteCommunes,
      ...cuanzaSulMunicipalities, ...cuanzaSulCommunes,
    ];
    expect(new Set(units.map((unit) => unit.id)).size).toBe(units.length);
    expect(new Set(units.map((unit) => unit.officialCode)).size).toBe(units.length);
  });
});


describe("Angola administrative hierarchy — Malanje tranche", () => {
  it("contains the 27 municipalities in the legal annex order", () => {
    expect(malanjeMunicipalities).toHaveLength(27);
    expect(malanjeMunicipalities.map((unit) => unit.officialCode)).toEqual(
      Array.from({ length: 27 }, (_, index) => `AOMJE09${String(index + 1).padStart(2, "0")}`),
    );
    expect(malanjeMunicipalities.map((unit) => unit.name)).toEqual(["Calandula","Malanje","Cacuso","Massango","Marimba","Quela","Quirima","Cangandala","Cahombo","Kunda dya Baze","Cambundi Catembo","Caculama","Kiwaba Nzoji","Luquembo","Cateco Cangola","Mbanji ya Ngola","Cuale","Pungo a Ndongo","Ngola Luiji","Quihuhu","Xandel","Cambo Suinginge","Milando","Quitapa","Capunda","Muquixe","Quessua"]);
  });

  it("links all Malanje municipalities to the correct province", () => {
    const province = angolaProvinces.find((unit) => unit.id === "ao-malanje");
    expect(province).toBeDefined();
    expect(malanjeMunicipalities.every((unit) => unit.parentId === province?.id)).toBe(true);
    expect(malanjeMunicipalities.every((unit) => unit.level === "municipality")).toBe(true);
  });

  it("contains the 38 communes explicitly listed in the legal annex with exact codes and names", () => {
    expect(malanjeCommunes).toHaveLength(38);
    expect(malanjeCommunes.map((unit) => unit.officialCode)).toEqual(["AOMJE090101","AOMJE090102","AOMJE090201","AOMJE090202","AOMJE090301","AOMJE090302","AOMJE090501","AOMJE090502","AOMJE090601","AOMJE090602","AOMJE090701","AOMJE090702","AOMJE090801","AOMJE090802","AOMJE090803","AOMJE090901","AOMJE090902","AOMJE091001","AOMJE091002","AOMJE091101","AOMJE091102","AOMJE091201","AOMJE091202","AOMJE091301","AOMJE091302","AOMJE091401","AOMJE091402","AOMJE091601","AOMJE091602","AOMJE091901","AOMJE091902","AOMJE092001","AOMJE092002","AOMJE092101","AOMJE092102","AOMJE092501","AOMJE092502","AOMJE092503"]);
    expect(malanjeCommunes.map((unit) => unit.name)).toEqual(["Calandula","Cota","Malanje","Lombe","Cacuso","Socueco","Marimba","Mangando","Quela","Bângalas","Quirima","Sautar","Cangandala","Caribo","Culamagia","Cahombo","Micanda","Kunda dya Baze","Lemba","Cambundi Catembo","Dumba Cambango","Caculama","Caxinga","Kiwaba Nzoji","Mufuma","Luquembo","Dombo wa Zanga","Mbanji ya Ngola","Cabombo","Ngola Luiji","Cambaxe","Quihuhu","Quinguengue","Xandel","Moma","Capunda","Quimbango","Cunga Palanga"]);
  });

  it("links every Malanje commune to its correct municipality", () => {
    const municipalityIds = new Set(malanjeMunicipalities.map((unit) => unit.id));
    expect(malanjeCommunes.every((unit) => municipalityIds.has(unit.parentId ?? ""))).toBe(true);
    expect(malanjeCommunes.every((unit) => unit.level === "commune")).toBe(true);
    expect(malanjeCommunes.map((unit) => unit.parentId)).toEqual(["ao-malanje-calandula","ao-malanje-calandula","ao-malanje-malanje","ao-malanje-malanje","ao-malanje-cacuso","ao-malanje-cacuso","ao-malanje-marimba","ao-malanje-marimba","ao-malanje-quela","ao-malanje-quela","ao-malanje-quirima","ao-malanje-quirima","ao-malanje-cangandala","ao-malanje-cangandala","ao-malanje-cangandala","ao-malanje-cahombo","ao-malanje-cahombo","ao-malanje-kunda-dya-baze","ao-malanje-kunda-dya-baze","ao-malanje-cambundi-catembo","ao-malanje-cambundi-catembo","ao-malanje-caculama","ao-malanje-caculama","ao-malanje-kiwaba-nzoji","ao-malanje-kiwaba-nzoji","ao-malanje-luquembo","ao-malanje-luquembo","ao-malanje-mbanji-ya-ngola","ao-malanje-mbanji-ya-ngola","ao-malanje-ngola-luiji","ao-malanje-ngola-luiji","ao-malanje-quihuhu","ao-malanje-quihuhu","ao-malanje-xandel","ao-malanje-xandel","ao-malanje-capunda","ao-malanje-capunda","ao-malanje-capunda"]);
  });

  it("keeps the nine municipalities with commune code 00 as municipality-only records", () => {
    const communeParentIds = new Set(malanjeCommunes.map((unit) => unit.parentId));
    const municipalityOnly = malanjeMunicipalities.filter(
      (unit) => !communeParentIds.has(unit.id),
    );
    expect(municipalityOnly.map((unit) => unit.name)).toEqual(["Massango","Cateco Cangola","Cuale","Pungo a Ndongo","Cambo Suinginge","Milando","Quitapa","Muquixe","Quessua"]);
  });

  it("keeps IDs and official codes unique across all seven imported tranches", () => {
    const units = [
      ...cabindaMunicipalities, ...cabindaCommunes,
      ...zaireMunicipalities, ...zaireCommunes,
      ...uigeMunicipalities, ...uigeCommunes,
      ...bengoMunicipalities, ...bengoCommunes,
      ...cuanzaNorteMunicipalities, ...cuanzaNorteCommunes,
      ...cuanzaSulMunicipalities, ...cuanzaSulCommunes,
      ...malanjeMunicipalities, ...malanjeCommunes,
    ];
    expect(new Set(units.map((unit) => unit.id)).size).toBe(units.length);
    expect(new Set(units.map((unit) => unit.officialCode)).size).toBe(units.length);
  });
});


describe("Angola administrative hierarchy — Lunda-Norte tranche", () => {
  it("contains the 19 municipalities in the legal annex order", () => {
    expect(lundaNorteMunicipalities).toHaveLength(19);
    expect(lundaNorteMunicipalities.map((unit) => unit.officialCode)).toEqual(
      Array.from({ length: 19 }, (_, index) => `AOLNO10${String(index + 1).padStart(2, "0")}`),
    );
    expect(lundaNorteMunicipalities.map((unit) => unit.name)).toEqual([
      "Cuilo", "Dundo", "Lubalo", "Capenda Camulemba", "Cuango", "Lucapa",
      "Cambulo", "Xá Muteba", "Caungula", "Lóvua", "Chitato", "Xá Cassau",
      "Camaxilo", "Luangue", "Luremo", "Canzar", "Cassanje Calucala",
      "Mussungue", "Cafunfo",
    ]);
  });

  it("links all Lunda-Norte municipalities to the correct province", () => {
    const province = angolaProvinces.find((unit) => unit.id === "ao-lunda-norte");
    expect(province).toBeDefined();
    expect(province?.officialCode).toBe("AOLNO10");
    expect(province?.administrativeSeat).toBe("Dundo");
    expect(lundaNorteMunicipalities.every((unit) => unit.parentId === province?.id)).toBe(true);
    expect(lundaNorteMunicipalities.every((unit) => unit.level === "municipality")).toBe(true);
  });

  it("contains the 20 communes explicitly listed in the legal annex with exact codes and names", () => {
    expect(lundaNorteCommunes).toHaveLength(20);
    expect(lundaNorteCommunes.map((unit) => unit.officialCode)).toEqual([
      "AOLNO100101", "AOLNO100102", "AOLNO100201", "AOLNO100202",
      "AOLNO100301", "AOLNO100302", "AOLNO100401", "AOLNO100402",
      "AOLNO100601", "AOLNO100602", "AOLNO100701", "AOLNO100702",
      "AOLNO101201", "AOLNO101202", "AOLNO101601", "AOLNO101602",
      "AOLNO101701", "AOLNO101702", "AOLNO101801", "AOLNO101802",
    ]);
    expect(lundaNorteCommunes.map((unit) => unit.name)).toEqual([
      "Cuilo", "Caluango", "Dundo", "Luachimo", "Lubalo", "Muvuluege",
      "Capenda Camulemba", "Xinge", "Lucapa", "Camissombo", "N'zage",
      "Cachimo", "Xá Cassau", "Capaia", "Canzar", "Luia",
      "Cassanje Calucala", "Iongo", "Mussungue", "Caíta",
    ]);
  });

  it("links every Lunda-Norte commune to its correct municipality", () => {
    const municipalityIds = new Set(lundaNorteMunicipalities.map((unit) => unit.id));
    expect(lundaNorteCommunes.every((unit) => municipalityIds.has(unit.parentId ?? ""))).toBe(true);
    expect(lundaNorteCommunes.every((unit) => unit.level === "commune")).toBe(true);
    expect(lundaNorteCommunes.map((unit) => unit.parentId)).toEqual([
      "ao-lunda-norte-cuilo", "ao-lunda-norte-cuilo",
      "ao-lunda-norte-dundo", "ao-lunda-norte-dundo",
      "ao-lunda-norte-lubalo", "ao-lunda-norte-lubalo",
      "ao-lunda-norte-capenda-camulemba", "ao-lunda-norte-capenda-camulemba",
      "ao-lunda-norte-lucapa", "ao-lunda-norte-lucapa",
      "ao-lunda-norte-cambulo", "ao-lunda-norte-cambulo",
      "ao-lunda-norte-xa-cassau", "ao-lunda-norte-xa-cassau",
      "ao-lunda-norte-canzar", "ao-lunda-norte-canzar",
      "ao-lunda-norte-cassanje-calucala", "ao-lunda-norte-cassanje-calucala",
      "ao-lunda-norte-mussungue", "ao-lunda-norte-mussungue",
    ]);
  });

  it("keeps the nine municipalities with commune code 00 as municipality-only records", () => {
    const communeParentIds = new Set(lundaNorteCommunes.map((unit) => unit.parentId));
    const municipalityOnly = lundaNorteMunicipalities.filter(
      (unit) => !communeParentIds.has(unit.id),
    );
    expect(municipalityOnly.map((unit) => unit.name)).toEqual([
      "Cuango", "Xá Muteba", "Caungula", "Lóvua", "Chitato",
      "Camaxilo", "Luangue", "Luremo", "Cafunfo",
    ]);
  });

  it("keeps IDs and official codes unique across all eight imported tranches", () => {
    const units = [
      ...cabindaMunicipalities, ...cabindaCommunes,
      ...zaireMunicipalities, ...zaireCommunes,
      ...uigeMunicipalities, ...uigeCommunes,
      ...bengoMunicipalities, ...bengoCommunes,
      ...cuanzaNorteMunicipalities, ...cuanzaNorteCommunes,
      ...cuanzaSulMunicipalities, ...cuanzaSulCommunes,
      ...malanjeMunicipalities, ...malanjeCommunes,
      ...lundaNorteMunicipalities, ...lundaNorteCommunes,
    ];
    expect(new Set(units.map((unit) => unit.id)).size).toBe(units.length);
    expect(new Set(units.map((unit) => unit.officialCode)).size).toBe(units.length);
  });
});


describe("Angola administrative hierarchy — Lunda-Sul tranche", () => {
  it("contains the 14 municipalities in the legal annex order", () => {
    expect(lundaSulMunicipalities).toHaveLength(14);
    expect(lundaSulMunicipalities.map((unit) => unit.officialCode)).toEqual(
      Array.from({ length: 14 }, (_, index) => `AOLSU11${String(index + 1).padStart(2, "0")}`),
    );
    expect(lundaSulMunicipalities.map((unit) => unit.name)).toEqual([
      "Saurimo", "Muconda", "Cacolo", "Dala", "Chiluage", "Cassai-Sul",
      "Xassengue", "Alto Chicapa", "Sombo", "Muriege", "Luma Cassai",
      "Cazage", "Muangueji", "Cassengo",
    ]);
  });

  it("links all Lunda-Sul municipalities to the correct province", () => {
    const province = angolaProvinces.find((unit) => unit.id === "ao-lunda-sul");
    expect(province).toBeDefined();
    expect(province?.officialCode).toBe("AOLSU11");
    expect(province?.administrativeSeat).toBe("Saurimo");
    expect(lundaSulMunicipalities.every((unit) => unit.parentId === province?.id)).toBe(true);
    expect(lundaSulMunicipalities.every((unit) => unit.level === "municipality")).toBe(true);
  });

  it("contains the four communes explicitly listed in the legal annex with exact codes and names", () => {
    expect(lundaSulCommunes).toHaveLength(4);
    expect(lundaSulCommunes.map((unit) => unit.officialCode)).toEqual([
      "AOLSU110101", "AOLSU110102", "AOLSU110701", "AOLSU110702",
    ]);
    expect(lundaSulCommunes.map((unit) => unit.name)).toEqual([
      "Saurimo", "Mona Quimbundo", "Xassengue", "Cucumbi",
    ]);
  });

  it("links every Lunda-Sul commune to its correct municipality", () => {
    const municipalityIds = new Set(lundaSulMunicipalities.map((unit) => unit.id));
    expect(lundaSulCommunes.every((unit) => municipalityIds.has(unit.parentId ?? ""))).toBe(true);
    expect(lundaSulCommunes.every((unit) => unit.level === "commune")).toBe(true);
    expect(lundaSulCommunes.map((unit) => unit.parentId)).toEqual([
      "ao-lunda-sul-saurimo", "ao-lunda-sul-saurimo",
      "ao-lunda-sul-xassengue", "ao-lunda-sul-xassengue",
    ]);
  });

  it("keeps the twelve municipalities with commune code 00 as municipality-only records", () => {
    const communeParentIds = new Set(lundaSulCommunes.map((unit) => unit.parentId));
    const municipalityOnly = lundaSulMunicipalities.filter(
      (unit) => !communeParentIds.has(unit.id),
    );
    expect(municipalityOnly.map((unit) => unit.name)).toEqual([
      "Muconda", "Cacolo", "Dala", "Chiluage", "Cassai-Sul", "Alto Chicapa",
      "Sombo", "Muriege", "Luma Cassai", "Cazage", "Muangueji", "Cassengo",
    ]);
  });

  it("keeps IDs and official codes unique across all nine imported tranches", () => {
    const units = [
      ...cabindaMunicipalities, ...cabindaCommunes,
      ...zaireMunicipalities, ...zaireCommunes,
      ...uigeMunicipalities, ...uigeCommunes,
      ...bengoMunicipalities, ...bengoCommunes,
      ...cuanzaNorteMunicipalities, ...cuanzaNorteCommunes,
      ...cuanzaSulMunicipalities, ...cuanzaSulCommunes,
      ...malanjeMunicipalities, ...malanjeCommunes,
      ...lundaNorteMunicipalities, ...lundaNorteCommunes,
      ...lundaSulMunicipalities, ...lundaSulCommunes,
    ];
    expect(new Set(units.map((unit) => unit.id)).size).toBe(units.length);
    expect(new Set(units.map((unit) => unit.officialCode)).size).toBe(units.length);
  });
});


describe("Angola administrative hierarchy — Moxico tranche", () => {
  it("contains the twelve municipalities in the legal annex order", () => {
    expect(moxicoMunicipalities).toHaveLength(12);
    expect(moxicoMunicipalities.map((unit) => unit.officialCode)).toEqual(
      Array.from({ length: 12 }, (_, index) => `AOMCO12${String(index + 1).padStart(2, "0")}`),
    );
    expect(moxicoMunicipalities.map((unit) => unit.name)).toEqual([
      "Luena", "Cangamba", "Lumbala Nguimbo", "Camanongue", "Léua",
      "Lutembo", "Lucusse", "Cangumbe", "Chiume", "Alto Cuito", "Ninda", "Lutuei",
    ]);
  });

  it("links all Moxico municipalities to the province with the correct code and seat", () => {
    const province = angolaProvinces.find((unit) => unit.id === "ao-moxico");
    expect(province).toBeDefined();
    expect(province?.officialCode).toBe("AOMCO12");
    expect(province?.administrativeSeat).toBe("Luena");
    expect(moxicoMunicipalities.every((unit) => unit.parentId === province?.id)).toBe(true);
    expect(moxicoMunicipalities.every((unit) => unit.level === "municipality")).toBe(true);
  });

  it("contains the thirteen communes explicitly listed in the legal annex", () => {
    expect(moxicoCommunes).toHaveLength(13);
    expect(moxicoCommunes.map((unit) => unit.officialCode)).toEqual([
      "AOMCO120101", "AOMCO120102",
      "AOMCO120201", "AOMCO120202", "AOMCO120203", "AOMCO120204",
      "AOMCO120301", "AOMCO120302", "AOMCO120303",
      "AOMCO120501", "AOMCO120502",
      "AOMCO120601", "AOMCO120602",
    ]);
    expect(moxicoCommunes.map((unit) => unit.name)).toEqual([
      "Luena", "Cassongo", "Cangombe", "Cassamba", "Cangamba", "Muié",
      "Lumbala Nguimbo", "Mussuma Mitete", "Sessa", "Léua", "Liangongo",
      "Lutembo", "Luvuei",
    ]);
  });

  it("links each Moxico commune to the correct municipality", () => {
    const municipalityIds = new Set(moxicoMunicipalities.map((unit) => unit.id));
    expect(moxicoCommunes.every((unit) => municipalityIds.has(unit.parentId ?? ""))).toBe(true);
    expect(moxicoCommunes.every((unit) => unit.level === "commune")).toBe(true);
    expect(moxicoCommunes.map((unit) => unit.parentId)).toEqual([
      "ao-moxico-luena", "ao-moxico-luena",
      "ao-moxico-cangamba", "ao-moxico-cangamba", "ao-moxico-cangamba", "ao-moxico-cangamba",
      "ao-moxico-lumbala-nguimbo", "ao-moxico-lumbala-nguimbo", "ao-moxico-lumbala-nguimbo",
      "ao-moxico-leua", "ao-moxico-leua",
      "ao-moxico-lutembo", "ao-moxico-lutembo",
    ]);
  });

  it("keeps seven municipalities with commune code 00 as municipality-only records", () => {
    const communeParentIds = new Set(moxicoCommunes.map((unit) => unit.parentId));
    const municipalityOnly = moxicoMunicipalities.filter(
      (unit) => !communeParentIds.has(unit.id),
    );
    expect(municipalityOnly.map((unit) => unit.name)).toEqual([
      "Camanongue", "Lucusse", "Cangumbe", "Chiume", "Alto Cuito", "Ninda", "Lutuei",
    ]);
  });

  it("keeps IDs and official codes unique across all ten imported tranches", () => {
    const units = [
      ...cabindaMunicipalities, ...cabindaCommunes,
      ...zaireMunicipalities, ...zaireCommunes,
      ...uigeMunicipalities, ...uigeCommunes,
      ...bengoMunicipalities, ...bengoCommunes,
      ...cuanzaNorteMunicipalities, ...cuanzaNorteCommunes,
      ...cuanzaSulMunicipalities, ...cuanzaSulCommunes,
      ...malanjeMunicipalities, ...malanjeCommunes,
      ...lundaNorteMunicipalities, ...lundaNorteCommunes,
      ...lundaSulMunicipalities, ...lundaSulCommunes,
      ...moxicoMunicipalities, ...moxicoCommunes,
    ];
    expect(new Set(units.map((unit) => unit.id)).size).toBe(units.length);
    expect(new Set(units.map((unit) => unit.officialCode)).size).toBe(units.length);
  });
});
