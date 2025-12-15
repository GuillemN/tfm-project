import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ImgUrlPipe } from '../../pipes/img-url.pipe';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [CommonModule, RouterModule, ImgUrlPipe],
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class CardComponent {
    @Input() item: any;
    @Input() type: string = '';
    @Input() status: string = ''; // 'done' | 'wishlist' (optional, for profile)
    @Input() isWishlisted: boolean = false;
    @Input() isActive: boolean = false; // For 'done' status check
    @Input() showBadges: boolean = false; // To show 'Lliure'/'Guardat' badge

    @Output() toggle = new EventEmitter<{ id: number, type: string, status: 'wishlist' | 'done' }>();

    hovered: boolean = false;

    get folderName(): string {
        switch (this.type) {
            case 'ruta': return 'rutes';
            case 'refugi': return 'refugis';
            case 'pic': return 'pics';
            case 'estany': return 'estanys';
            case 'via-ferrada': return 'vies-ferrades'; // Adjust if needed
            default: return this.type + 's';
        }
    }

    get itemId(): number {
        return this.type === 'ruta' ? this.item.id : this.item[`id_${this.type}`] ?? this.item.id;
    }

    onToggle(status: 'wishlist' | 'done', event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.toggle.emit({ id: this.itemId, type: this.type, status });
    }
}
