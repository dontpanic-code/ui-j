// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  tenant: 'common',
  clientId: '2692734e-0371-476e-8aaf-a8bab62acebe',
  endpoints: {
    'https://juniverse.com.ua/api': '2692734e-0371-476e-8aaf-a8bab62acebe'
  },
  production: true,
  isLocal: false,
  apiUrl: `https://juniverse.com.ua/api`,
  telegramBot: 'https://vacancies-telegram-bot.herokuapp.com',
  hmr: false,
  countrystatecity: 'OFVEZjdKbTJuU01sU25lbkJlR1RXTEw0Z25sNUNzWmE2RHI4YWNyZA==',
  locales: ['eng', 'ua'],
  defaultLocale: 'ua',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
