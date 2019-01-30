export class Configuration {
  // Important: this constructor and the config.json file must have the same mapping to work properly!
  constructor(public useScene: boolean,
              public showClock: boolean,
              public defaultScene: string,
              public openLinkInNewTab: boolean,
              public showShortcutList: boolean,
              public suggestions: boolean,
              public searchDelimiter: string,
              public amountOfSuggestions: number,
              public allowLocation: boolean,
              public showFPS: boolean,
              public backgroundGradientFirstStop: string,
              public backgroundGradientSecondStop: string,
              public foregroundGradientFirstStop: string,
              public foregroundGradientSecondStop: string,
              public searchEngine: string[],
              public shortcuts: string[][]) {
  }
}
