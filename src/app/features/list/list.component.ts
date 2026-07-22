import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PokemonListService } from '../../services/pokemon-list.service';
import { FavoriteService } from '../../services/favorite.service';
import { PokemonType } from '../../models/pokemon.type';
import {
  InfiniteScrollCustomEvent,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSpinner,
} from '@ionic/angular/standalone';
import { TypeChips } from '../../shared/type-chips/type-chips';
import { PokemonCard } from '../../shared/pokemon-card/pokemon-card';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './list.component.html',
  imports: [
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSpinner,
    TypeChips,
    EmptyState,
    PokemonCard,
  ],
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  private readonly router = inject(Router);
  private readonly apiList = inject(PokemonListService);
  private readonly favorites = inject(FavoriteService);
  protected readonly items = computed(() => this.apiList.items());
  protected readonly activeType = computed(() => this.apiList.activeType());
  protected readonly loading = computed(() => this.apiList.loading());
  protected readonly hasMore = computed(() => this.apiList.hasMore());
  protected readonly error = computed(() => this.apiList.error());
  protected readonly isInitialLoad = computed(() => this.loading() && this.items().length === 0);
  protected readonly isEmpty = computed(
    () => !this.loading() && !this.error() && this.items().length === 0,
  );

  protected readonly cards = computed(() =>
    this.items().map((item) => ({
      item,
      isFavorite: this.favorites.isFavorite(item.id),
    })),
  );

  async ngOnInit(): Promise<void> {
    await this.apiList.init();
  }

  protected async onSelectType(type: PokemonType): Promise<void> {
    await this.apiList.selectType(type);
  }

  protected async onInfiniteScroll(event: InfiniteScrollCustomEvent): Promise<void> {
    await this.apiList.loadMore();
    await event.target.complete();
  }

  protected openDetail(id: number): void {
    void this.router.navigate(['/pokemon', id]);
  }

  protected async retry(): Promise<void> {
    await this.apiList.retry();
  }
}
