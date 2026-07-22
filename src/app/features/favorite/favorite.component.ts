import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FavoriteService } from '../../services/favorite.service';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { PokemonCard } from '../../shared/pokemon-card/pokemon-card';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonContent, EmptyState, PokemonCard],
})
export class FavoriteComponent {
  private readonly router = inject(Router);
  private readonly favorite = inject(FavoriteService);

  protected readonly favorites = this.favorite.items;
  protected readonly isEmpty = this.favorite.isEmpty;

  protected readonly countLabel = computed(() => {
    const count = this.favorite.count();
    return count === 0 ? '' : `${count} saved`;
  });

  protected openDetail(id: number): void {
    void this.router.navigate(['/pokemon', id]);
  }
}
