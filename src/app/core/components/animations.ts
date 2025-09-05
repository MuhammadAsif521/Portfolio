import {
  trigger,
  transition,
  style,
  query,
  animate,
  group,
  sequence
} from '@angular/animations';

export const routeFadeAnimation = trigger('routeFadeAnimation', [
  transition('* <=> *', [
    // set container
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      })
    ], { optional: true }),

    // enter start state
    query(':enter', [
      style({ opacity: 0 })
    ], { optional: true }),

    sequence([
      // footer out
      query('app-footer', [
        animate('200ms ease', style({ opacity: 0, transform: 'translateY(10px)' }))
      ], { optional: true }),

      // page swap
      group([
        query(':leave', [
          animate('300ms ease', style({ opacity: 0 }))
        ], { optional: true }),

        query(':enter', [
          animate('300ms ease', style({ opacity: 1 }))
        ], { optional: true })
      ]),

      // footer in
      query('app-footer', [
        animate('200ms ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ], { optional: true })
    ])
  ])
]);
