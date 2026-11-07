import { angolaGeographyMetadata, angolaProvinces } from "./angola";
import {
  cabindaMunicipalities,
  zaireMunicipalities,
  uigeMunicipalities,
  bengoMunicipalities,
  cuanzaNorteMunicipalities,
  cuanzaSulMunicipalities,
  malanjeMunicipalities,
  lundaNorteMunicipalities,
  lundaSulMunicipalities,
  moxicoMunicipalities,
  moxicoLesteMunicipalities,
  bieMunicipalities,
  huamboMunicipalities,
  benguelaMunicipalities,
  namibeMunicipalities,
  huilaMunicipalities,
  cuneneMunicipalities,
  cubangoMunicipalities,
  cuandoMunicipalities,
  luandaMunicipalities,
  icoloEBengoMunicipalities,
  cabindaCommunes,
  zaireCommunes,
  uigeCommunes,
  bengoCommunes,
  cuanzaNorteCommunes,
  cuanzaSulCommunes,
  malanjeCommunes,
  lundaNorteCommunes,
  lundaSulCommunes,
  moxicoCommunes,
  moxicoLesteCommunes,
  bieCommunes,
  huamboCommunes,
  benguelaCommunes,
  namibeCommunes,
  huilaCommunes,
  cuneneCommunes,
  cubangoCommunes,
  cuandoCommunes,
  luandaCommunes,
  icoloEBengoCommunes,
} from "./angola-administrative-units";

export interface ProvinceGeographyCoverage {
  provinceId: string;
  provinceName: string;
  municipalityCount: number;
  communeCount: number;
  hasDetailedHierarchy: boolean;
}

export interface AngolaGeographyCoverage {
  referenceDate: string;
  expected: {
    provinces: number;
    municipalities: number;
    communes: number;
  };
  registered: {
    provinceList: number;
    municipalities: number;
    communes: number;
  };
  provincesWithDetailedHierarchy: number;
  provincesWithoutDetailedHierarchy: number;
  geometryAvailable: false;
  automaticCoordinateAssignmentEnabled: false;
  provinces: ProvinceGeographyCoverage[];
  limitations: string[];
}

const allMunicipalities = [cabindaMunicipalities, zaireMunicipalities, uigeMunicipalities, bengoMunicipalities, cuanzaNorteMunicipalities, cuanzaSulMunicipalities, malanjeMunicipalities, lundaNorteMunicipalities, lundaSulMunicipalities, moxicoMunicipalities, moxicoLesteMunicipalities, bieMunicipalities, huamboMunicipalities, benguelaMunicipalities, namibeMunicipalities, huilaMunicipalities, cuneneMunicipalities, cubangoMunicipalities, cuandoMunicipalities, luandaMunicipalities, icoloEBengoMunicipalities].flat();
const allCommunes = [cabindaCommunes, zaireCommunes, uigeCommunes, bengoCommunes, cuanzaNorteCommunes, cuanzaSulCommunes, malanjeCommunes, lundaNorteCommunes, lundaSulCommunes, moxicoCommunes, moxicoLesteCommunes, bieCommunes, huamboCommunes, benguelaCommunes, namibeCommunes, huilaCommunes, cuneneCommunes, cubangoCommunes, cuandoCommunes, luandaCommunes, icoloEBengoCommunes].flat();

export function getAngolaGeographyCoverage(): AngolaGeographyCoverage {
  const provinces = angolaProvinces.map((province) => {
    const municipalities = allMunicipalities.filter(
      (unit) => unit.parentId === province.id,
    );
    const municipalityIds = new Set(municipalities.map((unit) => unit.id));
    const communes = allCommunes.filter((unit) =>
      municipalityIds.has(unit.parentId ?? ""),
    );

    return {
      provinceId: province.id,
      provinceName: province.name,
      municipalityCount: municipalities.length,
      communeCount: communes.length,
      hasDetailedHierarchy: municipalities.length > 0,
    };
  });

  const provincesWithDetailedHierarchy = provinces.filter(
    (province) => province.hasDetailedHierarchy,
  ).length;

  return {
    referenceDate: angolaGeographyMetadata.administrativeReferenceDate,
    expected: {
      provinces: angolaGeographyMetadata.administrativeCounts.provinces,
      municipalities: angolaGeographyMetadata.administrativeCounts.municipalities,
      communes: angolaGeographyMetadata.administrativeCounts.communes,
    },
    registered: {
      provinceList: angolaProvinces.length,
      municipalities: allMunicipalities.length,
      communes: allCommunes.length,
    },
    provincesWithDetailedHierarchy,
    provincesWithoutDetailedHierarchy:
      provinces.length - provincesWithDetailedHierarchy,
    geometryAvailable: false,
    automaticCoordinateAssignmentEnabled: false,
    provinces,
    limitations: [
      "A hierarquia nominal das 21 províncias, 326 municípios e 378 comunas está transcrita a partir do Anexo da Lei n.º 8/25.",
      "A correspondência administrativa é textual e baseada nos códigos legais; este conjunto não contém geometrias territoriais.",
      "Não existem polígonos, limites, centroides ou coordenadas territoriais validados neste conjunto.",
      "A atribuição automática de província, município ou comuna a partir de coordenadas permanece desactivada.",
      "A hierarquia administrativa não substitui cartografia oficial nem delimita zonas agroecológicas.",
    ],
  };
}
