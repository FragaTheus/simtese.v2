import { Component } from '@angular/core';

import { HomePageLayout } from '../../../shared/components/layout/home/home-page-layout/home-page-layout';
import { ButtonModule } from 'primeng/button';
import {
  COMERCIAL,
  ENFERMAGEM_CREDENCIADAS,
  ENFERMAGEM_EMPRESAS,
  ENFERMAGEM_IN_COMPANY,
  FACEBOOK,
  FATURAMENTO_E_ESOCIAL,
  FIXO,
  GOOGLE_MAPS,
  INSTAGRAM,
  LINKEDIN,
  RECEPCAO_E_AGENDAMENTOS,
  SEGURANCA_DO_TRABALHO,
} from '../links';

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
  imports: [HomePageLayout, ButtonModule],
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
        link: FIXO,
      },
      {
        icon: 'pi pi-whatsapp',
        label: '(11) 91966-6340',
        description: 'Comercial',
        link: COMERCIAL,
      },
      {
        icon: 'pi pi-whatsapp',
        label: '(11) 92601-7154',
        description: 'Recepção e Agendamentos',
        link: RECEPCAO_E_AGENDAMENTOS,
      },
      {
        icon: 'pi pi-whatsapp',
        label: '(11) 92601-7052',
        description: 'Faturamento e eSocial',
        link: FATURAMENTO_E_ESOCIAL,
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
        link: ENFERMAGEM_EMPRESAS,
      },
      {
        icon: 'pi pi-whatsapp',
        label: '(11) 92601-6837',
        description: 'Enfermagem — Credenciadas',
        link: ENFERMAGEM_CREDENCIADAS,
      },
      {
        icon: 'pi pi-whatsapp',
        label: '(11) 92601-7092',
        description: 'Enfermagem — In Company',
        link: ENFERMAGEM_IN_COMPANY,
      },
      {
        icon: 'pi pi-whatsapp',
        label: '(11) 92601-6845',
        description: 'Segurança do Trabalho',
        link: SEGURANCA_DO_TRABALHO,
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
      link: GOOGLE_MAPS,
    },
    {
      icon: 'pi pi-facebook',
      link: FACEBOOK,
    },
    {
      icon: 'pi pi-instagram',
      link: INSTAGRAM,
    },
    {
      icon: 'pi pi-linkedin',
      link: LINKEDIN,
    },
  ];

  openLink(link: string): void {
    window.open(link, '_blank', 'noopener,noreferrer');
  }
}
