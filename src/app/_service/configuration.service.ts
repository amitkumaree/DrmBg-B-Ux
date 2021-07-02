import { Injectable } from '@angular/core';
import * as configuration from '../../assets/constants/bankconfig.json';
import { BankConfiguration } from '../bank-resolver/Models';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  configuration: BankConfiguration[] = [];

  constructor() { }

  getAllConfiguration(): Promise<BankConfiguration[]> {
    const p = new Promise<BankConfiguration[]>((resolve, reject) => {
      if (null !== this.configuration
          && this.configuration.length > 0) { } else {
          this.configuration = (configuration  as  any).default;
        }

      resolve(this.configuration);
      // even here if the this.configuration is null
      // then we should reject with error
    });

    return p;
  }

  getConfigurationForName(findConf: string): Promise<BankConfiguration> {
    const p = new Promise<BankConfiguration>((resolve, reject) => {
      if (null !== this.configuration
          && this.configuration.length > 0) { } else {
          this.configuration = (configuration  as  any).default;
        }

      resolve(this.configuration.
        filter(e => e.name.toLowerCase() === findConf.toLowerCase())[0]);
      // even here if the this.configuration is null
      // then we should reject with error
    });

    return p;
  }
}
