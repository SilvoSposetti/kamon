export class Configuration {
  // Important: this constructor and the config.json file must have the same mapping to work properly!
  constructor(public useCustomBackgroundImage: boolean,
              public useScene: boolean,
              public scene: string,
              public list: any[][]) {
  }

}
