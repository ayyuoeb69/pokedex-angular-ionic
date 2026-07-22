import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './empty-state.html',
})
export class EmptyState {
  readonly heading = input.required<string>();
  readonly message = input.required<string>();
}
