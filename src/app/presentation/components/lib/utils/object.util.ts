export class ObjectUtil {
  public static getObjectKeys<T>(obj: Object): Array<keyof T> {
    if (!obj) {
      return [];
    }

    return Object.keys(obj).map((key: string) => key as keyof T);
  }

  public static isValid(obj: any) {
    return obj !== null && obj !== undefined;
  }

  public static getCodes(obj: any): any {
    if (!obj) {
      return {};
    }

    return Object.keys(obj).reduce((acc, curr) => {
      let value = obj[curr];
      try {
        value = JSON.parse(obj[curr]);
      } catch (_) {
        value = obj[curr];
      }
      return { ...acc, [curr]: value?.code || value };
    }, {});
  }
}
