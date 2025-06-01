import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ObjectUtil } from './object.util';

export class ValidationUtil {
  public static email(control: AbstractControl): ValidationErrors | null {
    const email = control.value as string;

    if (!email || email === '') {
      return null;
    }

    if (
      !email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/) ||
      email.match(/['`~!#%^&*()|+¨=?;:'´",<>\{\}\[\]\\\/]/gi)
    ) {
      return {
        email: true,
      };
    }

    return null;
  }

  public static fullName(control: AbstractControl): ValidationErrors | null {
    const name: string = control.value;
    if (!name) {
      return null;
    }

    const splittedName = name
      .trim()
      .split(' ')
      .map((namePart) => namePart.trim());

    if (splittedName.length < 2) {
      return { invalid: 'Deve conter pelo menos um nome e sobrenome.' };
    }
    return null;
  }

  public static noMultipleWhitespace(control: AbstractControl): ValidationErrors | null {
    const name: string = control.value;

    if (name) {
      if (!name.match(/^([a-zA-ZÀ-ú0-9]+\s)*[a-zA-ZÀ-ú0-9]+$/)) {
        return { haveWhiteSpace: true };
      }
    }
    return null;
  }

  public static isValidTaxId(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    if (control.value.length === 11) {
      return ValidationUtil.isValidCpf(control);
    }
    if (control.value.length === 14) {
      return ValidationUtil.isValidCnpj(control);
    }

    return null;
  }

  public static isValidCpf(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value;
    if (cpf) {
      let numbers, digits, sum, i, result, equalDigits;
      equalDigits = 1;
      if (cpf.length < 11) {
        return null;
      }

      for (i = 0; i < cpf.length - 1; i++) {
        if (cpf.charAt(i) !== cpf.charAt(i + 1)) {
          equalDigits = 0;
          break;
        }
      }

      if (!equalDigits) {
        numbers = cpf.substring(0, 9);
        digits = cpf.substring(9);
        sum = 0;
        for (i = 10; i > 1; i--) {
          sum += numbers.charAt(10 - i) * i;
        }

        result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

        if (result !== Number(digits.charAt(0))) {
          return { cpfNotValid: true };
        }
        numbers = cpf.substring(0, 10);
        sum = 0;

        for (i = 11; i > 1; i--) {
          sum += numbers.charAt(11 - i) * i;
        }
        result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

        if (result !== Number(digits.charAt(1))) {
          return { cpfNotValid: true };
        }
        return null;
      } else {
        return { cpfNotValid: true };
      }
    }
    return null;
  }

  public static isValidCnpj(control: AbstractControl): ValidationErrors | null {
    let cnpj = control.value;
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (/^(\d)\1+$/.test(cnpj)) {
      return { cnpjNotValid: true };
    }

    let t = cnpj.length - 2,
      d = cnpj.substring(t),
      d1 = parseInt(d.charAt(0)),
      d2 = parseInt(d.charAt(1)),
      calc = (x: number) => {
        let n = cnpj.substring(0, x),
          y = x - 7,
          s = 0,
          r = 0;
        for (let i = x; i >= 1; i--) {
          s += n.charAt(x - i) * y--;
          if (y < 2) y = 9;
        }
        r = 11 - (s % 11);
        return r > 9 ? 0 : r;
      };
    if (calc(t) === d1 && calc(t + 1) === d2) {
      return null;
    } else {
      return { cnpjNotValid: true };
    }
  }

  public static majorAge(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    const age = ~~((Date.now() - control.value) / 31557600000);

    if (age < 18) {
      return { isNotMajorAge: true };
    }
    return null;
  }

  public static matchField(anotherField: AbstractControl | null): ValidatorFn {
    const validator = (control: AbstractControl) => {
      if (!control.value || !anotherField?.value) {
        return null;
      }
      if (control.value !== anotherField?.value) {
        return { fieldDoesNotMatch: true };
      }

      return null;
    };
    return validator;
  }

  public static cellphone(control: AbstractControl): ValidationErrors | null {
    if (!control.value || control.value.length < 11) {
      return null;
    }

    const firstNumber = control.value.substring(2, 3);

    if (firstNumber != '9') {
      return { cellphoneInvalid: true };
    }

    return null;
  }

  public static lowerThanOrEqualTo(greaterControlName: string): ValidatorFn {
    const validator = (control: AbstractControl) => {
      const lowerValue = control.value;
      const greaterValue = control.parent?.get(greaterControlName)?.value;
      if (!control.parent?.get(greaterControlName)) {
        console.log(`Control with name ${greaterControlName} not registered`);
        return {};
      }
      if (
        ObjectUtil.isValid(lowerValue) &&
        ObjectUtil.isValid(greaterValue) &&
        lowerValue !== '' &&
        greaterValue !== '' &&
        +lowerValue > +greaterValue
      ) {
        return {
          invalid: 'Valor mínimo deve ser menor ou igual ao valor máximo',
        };
      }
      return {};
    };
    return validator;
  }

  public static greaterThanOrEqualTo(lowerControlName: string): ValidatorFn {
    const validator = (control: AbstractControl) => {
      const greaterValue = control.value;
      const lowerValue = control.parent?.get(lowerControlName)?.value;
      if (!control.parent?.get(lowerControlName)) {
        console.log(`Control with name ${lowerControlName} not registered`);
        return {};
      }
      if (
        ObjectUtil.isValid(lowerValue) &&
        ObjectUtil.isValid(greaterValue) &&
        lowerValue !== '' &&
        greaterValue !== '' &&
        +lowerValue > +greaterValue
      ) {
        return {
          invalid: 'Valor máximo deve ser maior ou igual ao valor mínimo',
        };
      }
      return {};
    };
    return validator;
  }

  public static notSequentialNumbers(length: number): ValidatorFn {
    const validator = (control: AbstractControl): ValidationErrors | null => {
      const controlValue = control.value;
      const sequentialNumbers = '01234567890123456789';

      if (controlValue) {
        if (controlValue.length === length) {
          if (~sequentialNumbers.indexOf(control.value)) {
            return { isSequential: true };
          } else if (!!controlValue.match(/^(\d)\1+$/)) {
            return { isSequential: true };
          } else {
            return null;
          }
        }
      }
      return null;
    };
    return validator;
  }

  public static firstLetterIsUppercase(control: AbstractControl): ValidationErrors | null {
    const controlValue = control.value as string;
    const regex = /^([A-ZÀ-Ú][a-zà-ú]*)(?:\s+([A-ZÀ-Ú][a-zà-ú]*))*$/;

    if (!!controlValue) {
      if (!controlValue.match(regex)) {
        return { invalidField: true };
      }
      return null;
    }
    return null;
  }

  public static containsLettersAndNumbers(control: AbstractControl): ValidationErrors | null {
    const controlValue = control.value as string;
    const regex = /^(?=.*[0-9])(?=.*[A-z])([A-z0-9_-]+)$/;

    if (!!controlValue) {
      if (!!!controlValue.match(regex)) {
        return { isNotAlphaNumeric: true };
      }
      return null;
    }
    return null;
  }

  public static greaterThanTo(lowerControlName: string): ValidatorFn {
    const validator = (control: AbstractControl) => {
      const greaterValue = control.value;
      const lowerValue = control.parent?.get(lowerControlName)?.value;
      if (!control.parent?.get(lowerControlName)) {
        console.log(`Control with name ${lowerControlName} not registered`);
        return {};
      }
      if (
        ObjectUtil.isValid(lowerValue) &&
        ObjectUtil.isValid(greaterValue) &&
        lowerValue !== '' &&
        greaterValue !== '' &&
        +lowerValue >= +greaterValue
      ) {
        return {
          invalid: ` Este valor não pode ser igual ou menor que o valor inicial`,
        };
      }
      return {};
    };
    return validator;
  }
}
