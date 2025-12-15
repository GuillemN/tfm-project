import { Component, OnDestroy } from '@angular/core';
import { UserItemStatus, UserItemStatusService } from '../../services/user-item-status.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    template: ''
})
export abstract class ItemStatusBaseComponent implements OnDestroy {
    userStatuses: UserItemStatus[] = [];
    protected destroy$ = new Subject<void>();

    constructor(protected userItemStatusService: UserItemStatusService) {
        this.loadUserStatuses();
    }

    loadUserStatuses() {
        this.userItemStatusService.getUserStatuses()
            .pipe(takeUntil(this.destroy$))
            .subscribe((statuses) => {
                this.userStatuses = statuses;
            });
    }

    toggleStatus(itemId: number, itemType: string, status: 'wishlist' | 'done') {
        const isActive = this.isActive(itemId, itemType, status);
        const action = isActive ? 'remove' : 'add';

        this.userItemStatusService
            .toggleStatus(itemId, itemType, status, action)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                if (action === 'add') {
                    this.userStatuses.push({
                        id: 0, // Placeholder, backend handles ID
                        user_id: 0, // Placeholder
                        item_id: itemId,
                        item_type: itemType,
                        status,
                        created_at: new Date().toISOString()
                    });
                } else {
                    this.userStatuses = this.userStatuses.filter(
                        (s) => !(s.item_id === itemId && s.item_type === itemType && s.status === status)
                    );
                }
            });
    }

    isActive(itemId: number, itemType: string, status: 'wishlist' | 'done'): boolean {
        return this.userStatuses.some(
            (s) => s.item_id === itemId && s.item_type === itemType && s.status === status
        );
    }

    isWishlisted(itemId: number, itemType: string): boolean {
        return this.isActive(itemId, itemType, 'wishlist');
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
