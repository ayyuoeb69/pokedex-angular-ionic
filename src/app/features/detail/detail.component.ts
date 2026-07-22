import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { PokeapiService } from '../../services/pokeapi.service';
import { Pokemon } from '../../models/pokemon.type';
import { Location } from '@angular/common';
import { FavoriteService } from '../../services/favorite.service';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { IonContent, IonSpinner } from '@ionic/angular/standalone';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { TypeBadge } from '../../shared/type-badge/type-badge';
import { handleImageError } from '../../utils/helper';

const STAT_CEILING = 180;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonContent, IonSpinner, EmptyState, TypeBadge],
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent {
  private readonly api = inject(PokeapiService);
  private readonly location = inject(Location);
  private readonly favorites = inject(FavoriteService);

  protected readonly id = input.required<number>();

  protected readonly pokemon = signal<Pokemon | null>(null);
  protected readonly loading = signal<boolean>(true);
  protected readonly error = signal<string | null>(null);

  protected readonly heroBackground = computed(() => {
    const primaryType = this.pokemon()?.types[0];
    if (!primaryType) return 'linear-gradient(160deg, #8d9080, #5c5f52)';
    const color = `var(--t-${primaryType})`;
    return `linear-gradient(160deg, ${color}, color-mix(in srgb, ${color} 60%, #000))`;
  });

  protected readonly isFavorite = computed(() => {
    const pokemon = this.pokemon();
    return pokemon ? this.favorites.isFavorite(pokemon.id) : false;
  });
  protected readonly heartIcon = computed(() => (this.isFavorite() ? '❤️' : '\u{1F90D}'));

  protected readonly favoriteLabel = computed(() =>
    this.isFavorite() ? 'Saved to favourites' : 'Add to favourites',
  );

  constructor() {
    effect(() => {
      const id = Number(this.id());
      void this.load(id);
    });
    effect(() => {
      console.log(this.pokemon(), 'af');
    });
  }

  protected async load(id: number): Promise<void> {
    if (!Number.isFinite(id)) {
      this.error.set('That is not a valid Pokédex number.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      this.pokemon.set(await firstValueFrom(this.api.getPokemonDetail(id)));
    } catch {
      this.pokemon.set(null);
      this.error.set('Could not load this Pokémon. Check your connection.');
    } finally {
      this.loading.set(false);
    }
  }

  protected retry(): void {
    void this.load(Number(this.id()));
  }

  protected goBack(): void {
    this.location.back();
  }

  protected toggleFavorite(): void {
    const pokemon = this.pokemon();
    if (!pokemon) return;
    void this.favorites.toggle({ id: pokemon.id, name: pokemon.name });
  }

  protected statPercent(value: number): number {
    return Math.min(100, (value / STAT_CEILING) * 100);
  }

  protected statColor(value: number): string {
    if (value >= 90) return 'var(--led-green)';
    if (value >= 55) return 'var(--t-electric)';
    return 'var(--dex-red-light)';
  }

  protected onImageError(event: Event): void {
    handleImageError(event);
  }
}
