export interface ISettings {
  chosenTheme: 'dark' | 'light'
  theme: {
    dark: ITheme
    light: ITheme
  }
}

interface ITheme {
  color: string
  background: string
  headerBackground: string
  headerColor: string
}

export interface IList {
  tableName: string
  pickedList: string
}
