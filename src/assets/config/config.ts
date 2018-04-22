export class Configuration {
  // Important: this constructor and the config.json file must have the same mapping to work properly!
  constructor(public useCustomBackgroundImage: boolean,
              public useScene: boolean,
              public showClock: boolean,
              public defaultScene: string,
              public showCitations: boolean,
              public openLinkInNewTab: boolean,
              public showList: boolean,
              public suggestions: boolean,
              public searchDelimiter: string,
              public amountOfSuggestions: number,
              public allowLocation: boolean,
              public useToDoList: boolean,
              public useCredits: boolean,
              public showFPS: boolean,
              public backgroundGradientFirstStop: number[],
              public backgroundGradientSecondStop: number[],
              public foregroundGradientFirstStop: number[],
              public foregroundGradientSecondStop: number[],
              public paintColor: number[],
              public searchEngine: string[],
              public list: string[][],
              public citations: string[][]) {
  }
}
