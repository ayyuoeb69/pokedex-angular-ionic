import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PokemonType } from '../../models/pokemon.type';

@Component({
  selector: 'app-type-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './type-badge.html',
  styleUrl: './type-badge.scss',
})
export class TypeBadge {
  readonly type = input.required<PokemonType>();

  protected readonly color = computed(() => `var(--t-${this.type()})`);
}
