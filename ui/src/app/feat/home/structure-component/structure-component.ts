import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HomePageLayout } from '../../../shared/components/layout/home/home-page-layout/home-page-layout';
import { CardModule } from 'primeng/card';

interface Structure {
  title: string;
  description: string;
  imgSrc: string;
}

@Component({
  selector: 'app-structure-component',
  imports: [NgOptimizedImage, HomePageLayout, CardModule],
  templateUrl: './structure-component.html',
})
export class StructureComponent {
  structures: Structure[] = [
    {
      title: 'Sala de Enfermagem',
      description:
        'Ambiente preparado para a realização de procedimentos e atendimentos com conforto, organização e segurança.',
      imgSrc: '/nurse-img.webp',
    },
    {
      title: 'Sala de Espera',
      description:
        'Espaço confortável e organizado para proporcionar mais tranquilidade durante o período de espera.',
      imgSrc: '/wait-img_.webp',
    },
    {
      title: 'Sala de Apoio',
      description:
        'Ambiente destinado ao acolhimento de pacientes após exames em jejum, oferecendo mais conforto durante o atendimento.',
      imgSrc: '/break-img.webp',
    },
    {
      title: 'Recepção',
      description:
        'Um espaço preparado para receber pacientes e empresas com agilidade, organização e atendimento próximo.',
      imgSrc: '/attend-img.webp',
    },
  ];
}
