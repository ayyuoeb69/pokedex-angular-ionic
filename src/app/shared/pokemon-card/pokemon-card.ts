import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { PokemonListItem } from '../../models/pokemon.type';
import { PokemonListService } from '../../services/pokemon-list.service';
import { colorPokemonType, handleImageError } from '../../utils/helper';

@Component({
  selector: 'app-pokemon-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.scss',
})
export class PokemonCard {
  readonly pokemon = input.required<PokemonListItem>();
  readonly isFavorite = input(false);
  readonly select = output<void>();

  private readonly list = inject(PokemonListService);

  protected readonly typeColor = computed(() => {
    const type = this.list.activeType();
    return type ? colorPokemonType(type) : 'var(--card-neutral)';
  });

  protected onImageError(event: Event): void {
    handleImageError(event);
  }
}
