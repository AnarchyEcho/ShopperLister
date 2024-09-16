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
  modalColor: string
  modalBackground: string
  modalTrim: string
  modalDisabled: string
  listCogColor: string
  listItemTextColor: string
  listItemBackgroundColor: string
}

export interface IList {
  tableName: string
  pickedList: string
}

export interface IShoppingList {
  name: string
  amount: string
  checked: string
}
