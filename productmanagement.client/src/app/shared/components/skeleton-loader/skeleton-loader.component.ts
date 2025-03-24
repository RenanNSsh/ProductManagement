import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy,Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonLoaderComponent {
  @Input() width = '100%';
  @Input() height = '20px';
  @Input() margin = '0';
} 