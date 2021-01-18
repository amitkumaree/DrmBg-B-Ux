export default class Utils {
  public static convertStringToDt(str: string): Date {
    str = str.substring(0, 10);
    const dateParts = str.split('/');
    return new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
  }

  /** Use this method to get todays dt and put in textbox */
  public static getTodaysDtInCorrectFormat(): string {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();

    return (((dd < 10) ? ('0' + dd) : dd) + '/'
            + ((mm < 10) ? '0' + mm : mm) + '/'
            + yyyy);
  }

  // private static some() {
  //   let today = new Date();
  //   let dd = today.getDate();

  //   let mm = today.getMonth() + 1;
  //   const yyyy = today.getFullYear();
  //   if (dd < 10) {
  //     dd = '0' + dd;
  //   }

  //   if (mm < 10) {
  //     mm = '0' + mm;
  //   }
  //   today = mm + '-' + dd + '-' + yyyy;
  //   console.log(today);
  //   today = mm + '/' + dd + '/' + yyyy;
  //   console.log(today);
  //   today = dd + '-' + mm + '-' + yyyy;
  //   console.log(today);
  //   today = dd + '/' + mm + '/' + yyyy;
  //   console.log(today);
  // }
}
