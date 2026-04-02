'use client';
import { useState, createContext, useContext } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export const LangContext = createContext<{lang: string, setLang: (l: string) => void}>({
  lang: 'en',
  setLang: () => {}
});

export function useLang() {
  return useContext(LangContext);
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState('en');
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <div className="min-h-screen flex flex-col bg-[#050A18]">
        <Navbar lang={lang} setLang={setLang} />
        <main className="flex-1">
          {children}
        </main>
        <Footer lang={lang} />
      </div>
    </LangContext.Provider>
  );
}