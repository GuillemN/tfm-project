import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CampFiltre } from './filtre-config';

@Component({
  selector: 'app-filtre',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filtre.component.html',
  styleUrls: ['./filtre.component.scss']
})
export class FiltreComponent {
  @Input() camps: CampFiltre[] = [];
  @Output() filtreCanviat = new EventEmitter<any>();

  valors: { [clau: string]: any } = {
    lliure: ['Lliure', 'Guardat'],
    parroquia: 'La Massana'  // 
  };
  error: string | null = null;

  aplicarFiltre() {
    const valorsCopia = { ...this.valors }; // 
  
    // Validació
    const disponibilitat = valorsCopia['lliure'];
    if (!Array.isArray(disponibilitat) || disponibilitat.length === 0) {
      this.error = 'Has de seleccionar almenys "Lliure" o "Guardat".';
      return;
    }
  
    valorsCopia['lliure'] = disponibilitat.map((val: string) => val === 'Lliure' ? 1 : 0);
  
    this.error = null;
    this.filtreCanviat.emit(valorsCopia);
  }

  actualitzaCheckbox(clau: string, valor: string, event: any) {
    if (!this.valors[clau]) {
      this.valors[clau] = [];
    }

    if (event.target.checked) {
      this.valors[clau].push(valor);
    } else {
      this.valors[clau] = this.valors[clau].filter((v: string) => v !== valor);
    }
  }
}
