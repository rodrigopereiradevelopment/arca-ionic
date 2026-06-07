import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface InfoNutricional {
  nome: string;
  ingredientes: string | null;
  alergenos: string[];
  nutricao: {
    energia: number | null;
    gorduras: number | null;
    gorduras_saturadas: number | null;
    carboidratos: number | null;
    acucares: number | null;
    fibras: number | null;
    proteinas: number | null;
    sal: number | null;
  };
  nutri_score: string | null;
  nova_group: number | null;
}

export const NUTRI_SCORE_CORES: Record<string, string> = {
  a: '#38a169', b: '#68d391', c: '#ecc94b', d: '#ed8936', e: '#e53e3e',
};

@Injectable({ providedIn: 'root' })
export class InfoNutricionalService {

  async buscar(barcode: string): Promise<InfoNutricional | null> {
    if (!barcode) return null;
    try {
      const res = await fetch(
        `${environment.apiUrl}/api/produtos/info-nutricional?barcode=${encodeURIComponent(barcode)}`
      );
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
}
