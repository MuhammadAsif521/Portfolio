import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  Injectable,
  createComponent,
  inject,
} from '@angular/core';
import { CustomToastComponent } from '../components/custom-toast/custom-toast.component';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);

  async showToast(icon: string, message: string, color: string = '') {
    const componentRef: ComponentRef<CustomToastComponent> = createComponent(CustomToastComponent, {
      environmentInjector: this.injector,
    });

    componentRef.setInput('icon', icon);
    componentRef.setInput('message', message);
    componentRef.setInput('color', color);

    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    domElem.classList.add('custom-toast-container');
    document.body.appendChild(domElem);

    setTimeout(() => {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
      domElem.remove();
    }, 1000);
  }
}

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private toast: ToastService = inject(ToastService);

  handleError(error: any, message: string = 'An error occurred.') {
    this.toast.showToast('fas fa-exclamation-triangle', message, 'danger');
  }
}


