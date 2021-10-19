import i18next from 'i18next'

export default function useLanguage(): [string | undefined, (language: string) => void] {
  const language = i18next.language || window.localStorage.i18nextLng
  const setLanguage = (language: string) => {
    i18next.changeLanguage(language, err => {
      if (err) return console.error(err)
    })
  }
  return [language, setLanguage]
}
