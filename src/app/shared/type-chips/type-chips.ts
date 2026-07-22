import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { PokemonType, PokemonTypeEnum } from '../../models/pokemon.type';

@Component({
  selector: 'app-type-chips',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './type-chips.html',
  styleUrl: './type-chips.scss',
})
export class TypeChips {
  readonly active = input.required<PokemonType>();

  readonly select = output<PokemonType>();

  protected readonly types = Object.values(PokemonTypeEnum);
}
