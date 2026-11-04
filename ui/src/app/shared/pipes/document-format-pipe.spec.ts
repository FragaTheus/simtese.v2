import { DocumentFormatPipe, stripDocumentMask } from './document-format-pipe';

describe('document format', () => {
  const pipe = new DocumentFormatPipe();

  it('should strip every non digit character', () => {
    expect(stripDocumentMask('529.982.247-25')).toBe('52998224725');
    expect(stripDocumentMask('11.222.333/0001-81')).toBe('11222333000181');
  });

  it('should format CPF', () => {
    expect(pipe.transform('52998224725')).toBe('529.982.247-25');
  });

  it('should format CNPJ', () => {
    expect(pipe.transform('11222333000181')).toBe('11.222.333/0001-81');
  });

  it('should keep other values untouched and handle empty input', () => {
    expect(pipe.transform('123')).toBe('123');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
