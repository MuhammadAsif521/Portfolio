import { trigger, transition, style, query, animate, group, sequence } from '@angular/animations';

export const routeFadeAnimation = trigger('routeFadeAnimation', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1
      })
    ], { optional: true }),
    query(':enter', [
      style({ opacity: 0 })
    ], { optional: true }),
    sequence([
      query('app-footer', [
        animate('200ms ease', style({ opacity: 0, transform: 'translateY(10px)' }))
      ], { optional: true }),
      group([
        query(':leave', [
          animate('300ms ease', style({ opacity: 0 }))
        ], { optional: true }),

        query(':enter', [
          animate('300ms ease', style({ opacity: 1 }))
        ], { optional: true })
      ]),
      query('app-footer', [
        animate('200ms ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ], { optional: true })
    ])
  ])
]);