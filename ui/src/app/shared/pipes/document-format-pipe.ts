import { Pipe, PipeTransform } from '@angular/core';

export function stripDocumentMask(value: string): string {
  return value.replace(/\D/g, '');
}

@Pipe({
  name: 'documentFormat',
})
export class DocumentFormatPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    if (!value) return '';

    const digits = stripDocumentMask(value);

    if (digits.length === 11) {
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    if (digits.length === 14) {
      return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    return value;
  }
}
