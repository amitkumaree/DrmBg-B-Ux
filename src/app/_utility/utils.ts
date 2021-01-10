export default class Utils {
  public static convertStringToDt(str: string): Date {
    str = str.substring(0, 10);
    const dateParts = str.split('/');
    return new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
  }
}
