import { Injectable } from '@angular/core';
import * as configuration from '../../assets/constants/bankconfig.json';
import { BankConfiguration } from '../bank-resolver/Models';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  static configuration: BankConfiguration[] = [];

  constructor() { }

  getAllConfiguration(): Promise<BankConfiguration[]> {
    const p = new Promise<BankConfiguration[]>((resolve, reject) => {
      if (null !== ConfigurationService.configuration
          && ConfigurationService.configuration.length > 0) { } else {
          ConfigurationService.configuration = (configuration  as  any).default;
        }

      resolve(ConfigurationService.configuration);
      // even here if the ConfigurationService.configuration is null
      // then we should reject with error
    });

    return p;
  }

  getConfigurationForName(findConf: string): Promise<BankConfiguration> {
    const p = new Promise<BankConfiguration>((resolve, reject) => {
      if (null !== ConfigurationService.configuration
          && ConfigurationService.configuration.length > 0) { } else {
          ConfigurationService.configuration = (configuration  as  any).default;
        }

      resolve(ConfigurationService.configuration.
        filter(e => e.name.toLowerCase() === findConf.toLowerCase())[0]);
      // even here if the ConfigurationService.configuration is null
      // then we should reject with error
    });

    return p;
  }
}
