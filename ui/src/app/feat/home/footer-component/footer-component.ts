import { Component } from '@angular/core';

import { PageLayout } from '../../../shared/components/layout/page-layout/page-layout';
import { ButtonModule } from 'primeng/button';

interface Social {
  icon: string;
  link: string;
}

interface Access {
  label: string;
  items: {
    icon: string;
    label: string;
    link: string;
  }[];
}

interface Contact {
  label: string;
  items: {
    icon: string;
    label: string;
    description: string;
    link: string;
  }[];
}

interface ServiceInfo {
  icon: string;
  label: string;
  lines: string[];
}

@Component({
  selector: 'app-footer-component',
  imports: [PageLayout, ButtonModule],
  templateUrl: './footer-component.html',
})
export class FooterComponent {
  access: Access = {
    label: 'O Grupo',
    items: [
      {
        icon: 'pi pi-home',
        label: 'Início',
        link: '#hero',
      },
      {
        icon: 'pi pi-info-circle',
        label: 'Introdução',
        link: '#about',
      },
      {
        icon: 'pi pi-heart',
        label: 'Missão, Visão e Valores',
        link: '#mvv',
      },
      {
        icon: 'pi pi-briefcase',
        label: 'Serviços',
        link: '#services',
      },
    ],
  };

  administrativeContacts: Contact = {
    label: 'Contatos administrativos',
    items: [
      {
        icon: 'pi pi-phone',
        label: '(11) 4797-6140',
        description: 'Telefone fixo',
        link: 'tel:+551147976140',
      },
      {
        icon: 'pi pi-whatsapp',
        label: '(11) 91966-6340',
        description: 'Comercial',
        link: 'https://wa.me/5511919666340',
      },
      {
        icon: 'pi pi-whatsapp',
        label: '(11) 92601-7154',
        description: 'Recepção e Agendamentos',
        link: 'https://wa.me/5511926017154',
      },
      {
        icon: 'pi pi-whatsapp',
        label: '(11) 92601-7052',
        description: 'Faturamento e eSocial',
        link: 'https://wa.me/5511926017052',
      },
    ],
  };

  occupationalContacts: Contact = {
    label: 'Contatos ocupacionais',
    items: [
      {
        icon: 'pi pi-whatsapp',
        label: '(11) 92601-6690',
        description: 'Enfermagem — Empresas',
        link: 'https://wa.me/5511926016690',
      },
      {
        icon: 'pi pi-whatsapp',
        label: '(11) 92601-6837',
        description: 'Enfermagem — Credenciadas',
        link: 'https://wa.me/5511926016837',
      },
      {
        icon: 'pi pi-whatsapp',
        label: '(11) 92601-7092',
        description: 'Enfermagem — In Company',
        link: 'https://wa.me/5511926017092',
      },
      {
        icon: 'pi pi-whatsapp',
        label: '(11) 92601-6845',
        description: 'Segurança do Trabalho',
        link: 'https://wa.me/5511926016845',
      },
    ],
  };

  serviceInfo: ServiceInfo[] = [
    {
      icon: 'pi pi-map-marker',
      label: 'Endereço',
      lines: ['Rua Doutor Ricardo Vilela, 681', 'Centro — Mogi das Cruzes/SP'],
    },
    {
      icon: 'pi pi-clock',
      label: 'Atendimento administrativo',
      lines: ['Segunda a sexta-feira', 'Das 7h às 17h'],
    },
    {
      icon: 'pi pi-calendar-clock',
      label: 'Atendimento médico',
      lines: ['Segunda a sexta-feira, das 7h40 às 11h40', 'Terças e quintas, das 13h às 15h'],
    },
  ];

  socials: Social[] = [
    {
      icon: 'pi pi-map-marker',
      link: 'https://www.google.com/maps/search/?api=1&query=SIMTESE+Medicina+do+Trabalho+Rua+Doutor+Ricardo+Vilela+681+Mogi+das+Cruzes+SP',
    },
    {
      icon: 'pi pi-facebook',
      link: 'https://www.facebook.com/simtese/',
    },
    {
      icon: 'pi pi-instagram',
      link: 'https://www.instagram.com/simtesemedicina/',
    },
    {
      icon: 'pi pi-linkedin',
      link: 'https://br.linkedin.com/company/simtese-medicina-e-seguran%C3%A7a-do-trabalho',
    },
  ];

  openLink(link: string): void {
    window.open(link, '_blank', 'noopener,noreferrer');
  }
}
