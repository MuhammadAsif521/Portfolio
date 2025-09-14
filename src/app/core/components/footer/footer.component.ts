import { Component } from "@angular/core";
import { SocialLink } from "../../interfaces/core.interface";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  socialLinks: SocialLink[] = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/muhammad-asif-94ab47350/',
      icon: 'fab fa-linkedin-in'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/MuhammadAsif521',
      icon: 'fab fa-github'
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/923236879557?text=Hello%20Muhammad%20Asif',
      icon: 'fab fa-whatsapp'
    },
    {
      name: 'Skype',
      url: 'https://teams.live.com/l/invite/FEA0D91rkA3oAaZBAE?v=g1',
      icon: 'fab fa-skype'
    },
    {
      name: 'Email',
      url: '', // we'll generate dynamically
      icon: 'fas fa-envelope'
    }
  ];

  // Hybrid email link
  getEmailLink(): string {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    return isMobile
      ? 'mailto:m.asif340315@gmail.com?subject=Hello%20Muhammad%20Asif'
      : 'https://mail.google.com/mail/?view=cm&fs=1&to=m.asif340315@gmail.com';
  }
}
