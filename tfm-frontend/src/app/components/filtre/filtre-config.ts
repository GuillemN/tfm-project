export interface CampFiltre {
    clau: string;
    etiqueta: string;
    tipus: 'text' | 'number' | 'select' | 'checkbox';
    opcions?: string[]; 
  }