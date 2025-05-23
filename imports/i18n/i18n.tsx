import {i18n} from 'meteor/universe:i18n'
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

const localeContext = createContext(i18n.getLocale())

export type LocaleProviderProps = {children: ReactNode}

export function LocaleProvider({children}: LocaleProviderProps) {
  const [locale, setLocale] = useState(i18n.getLocale())
  useEffect(() => {
    i18n.onChangeLocale(setLocale)
    return () => {
      i18n.offChangeLocale(setLocale)
    }
  }, [setLocale])

  return (
    <localeContext.Provider value={locale}>{children}</localeContext.Provider>
  )
}

export function useLocale() {
  return useContext(localeContext)
}

export function useTranslator(prefix = '') {
  const locale = useLocale()
  return useCallback(
    (key: string, ...args: unknown[]) =>
      i18n.getTranslation(prefix, key, ...args),
    [locale],
  )
}
