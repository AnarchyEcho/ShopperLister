export interface ISettings {
  chosenTheme: 'dark' | 'light',
  theme: ITheme
}

interface ITheme {
  background: string
}