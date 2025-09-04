import { NgClass, NgStyle } from '@angular/common';
import { Component, InputSignal, input } from '@angular/core';

@Component({
  selector: 'app-custom-toast',
  standalone: true,
  templateUrl: './custom-toast.component.html',
  styleUrls: ['./custom-toast.component.scss'],
  imports: [NgStyle,NgClass],
})
export class CustomToastComponent {
  public icon: InputSignal<string> = input('');
  public message: InputSignal<string> = input('');
  public color: InputSignal<
    'primary' |
    'secondary' |
    'tertiary' |
    'success' |
    'warning' |
    'danger' |
    'dark' |
    'medium' |
    'light'
  > = input<'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'dark' | 'medium' | 'light'>('success');
}