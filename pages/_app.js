import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import Sidebar from '@/components/Sidebar'
import Player from '@/components/Player'
import Topbar from '@/components/Topbar'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <main
        className={`h-screen grid grid-rows-[1fr_auto] grid-cols-[auto_1fr] p-8 pb-0 gap-2 text-white ${inter.className}`}
      >
        <Sidebar />
        <section className='bg-dark rounded-xl p-4'>
          <Topbar />
          <Component {...pageProps} />
        </section>
        <Player />
      </main>
    </SessionProvider>
  );
}
