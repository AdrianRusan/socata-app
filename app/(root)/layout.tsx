import StreamVideoProvider from '@/providers/StreamClientProvider'
import { Metadata } from 'next';
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: "Șocâtă",
  description: "Șocâtă este o platformă de videoconferințe care îți oferă o experiență de neegalat în comunicarea online cu orice număr de șocâte.",
  icons: {
    icon: "/icons/logo.svg",
  }
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <StreamVideoProvider>
        {children}
      </StreamVideoProvider>
    </main>
  )
}

export default RootLayout