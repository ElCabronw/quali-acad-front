const CPF_PATTERN = '###.###.###-##';
const CNPJ_PATTERN = '##.###.###/####-##';
const POSTALCODE_PATTERN = '#####-###';
const CELLPHONE_PATTERN = '(##) #####-####';
const PHONE_PATTERN = '(##) ####-####';
const HOURS_MINUTES_PATTERN = '##:##';

export class MaskUtil {
  public static CPF_TEXT_FIELD_PATTERN = '999.999.999-99';
  public static CNPJ_TEXT_FIELD_PATTERN = '99.999.999/9999-99';
  public static CELLPHONE_TEXT_FIELD_PATTERN = '(99) 99999-9999';
  public static PHONE_TEXT_FIELD_PATTERN = '(99) 9999-9999';
  public static POSTALCODE_TEXT_FIELD_PATTERN = '99999-999';
  public static HOURS_MINUTES_FIELD_PATTERN = '99:99';

  public static formatDocument(stringValue: string) {
    if (!stringValue) {
      return '';
    }

    if (stringValue.length === 11) {
      return this.doMaskString(stringValue, CPF_PATTERN);
    }

    if (stringValue.length === 14) {
      return this.doMaskString(stringValue, CNPJ_PATTERN);
    }

    return stringValue;
  }

  public static formatPostalCode(stringValue: string) {
    return this.doMaskString(stringValue, POSTALCODE_PATTERN);
  }

  public static formatPhone(stringValue: string) {
    if (!stringValue) {
      return '';
    }

    if (stringValue.length === 11) {
      return this.doMaskString(stringValue, CELLPHONE_PATTERN);
    } else if (stringValue.length === 10) {
      return this.doMaskString(stringValue, PHONE_PATTERN);
    }

    return stringValue;
  }

  public static formatHoursMinutes(stringValue: string) {
    return this.doMaskString(stringValue, HOURS_MINUTES_PATTERN);
  }





  public static doMaskString(str: string, pattern?: string) {
    if (!str?.trim()) {
      return '';
    }

    if (!pattern || !pattern.includes('#')) {
      console.warn('Utilize uma máscara válida. Ex.: (##) #####-####');
      return str;
    }
    let i = 0;
    return pattern.replace(/#/g, () => str[i++]);
  }
}
