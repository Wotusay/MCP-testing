import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigation-link',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <a
      [routerLink]="routerLink"
      [routerLinkActive]="activeClass"
      [class]="baseClass"
      (click)="onLinkClick()"
    >
      {{ text }}
    </a>
  `,
})
export class NavigationLinkComponent {
  @Input() routerLink!: string;
  @Input() text!: string;
  @Input() activeClass!: string;
  @Input() baseClass!: string;
  @Output() linkClick = new EventEmitter<void>();

  protected onLinkClick(): void {
    this.linkClick.emit();
  }
}
