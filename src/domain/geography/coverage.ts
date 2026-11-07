import { angolaGeographyMetadata, angolaProvinces } from "./angola";
import {
  cabindaCommunes,
  cabindaMunicipalities,
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
    provinceList: number;
    municipalities: number;
    communes: number;
  };
  registered: {
    provinces: number;
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

export function getAngolaGeographyCoverage(): AngolaGeographyCoverage {
  const provinces = angolaProvinces.map((province) => {
    const municipalities = cabindaMunicipalities.filter(
      (unit) => unit.parentId === province.id,
    );
    const municipalityIds = new Set(municipalities.map((unit) => unit.id));
    const communes = cabindaCommunes.filter(
      (unit) => municipalityIds.has(unit.parentId ?? ""),
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
      municipalities: cabindaMunicipalities.length,
      communes: cabindaCommunes.length,
    },
    provincesWithDetailedHierarchy,
    provincesWithoutDetailedHierarchy:
      provinces.length - provincesWithDetailedHierarchy,
    geometryAvailable: false,
    automaticCoordinateAssignmentEnabled: false,
    provinces,
    limitations: [
      "A lista das 21 províncias está registada, mas a hierarquia detalhada de municípios e comunas está incompleta.",
      "Os registos municipais e comunais apresentados correspondem apenas às tranches efectivamente transcritas e testadas no código.",
      "Não existem polígonos, limites, centroides ou coordenadas territoriais validados neste conjunto.",
      "A atribuição automática de província, município ou comuna a partir de coordenadas permanece desactivada.",
      "Os totais nacionais são referências legais; não representam a quantidade actualmente importada.",
    ],
  };
}
