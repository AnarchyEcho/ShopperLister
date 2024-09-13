export interface ISettings {
  chosenTheme: 'dark' | 'light',
  theme: {
    dark: ITheme,
    light: ITheme,
  }
}

interface ITheme {
  background: string
}