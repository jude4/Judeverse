import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ufuoma Jude Onohwosafe — The Architect’s Studio',
  description: 'Explore the interactive 3D studio of Ufuoma Jude Onohwosafe, a senior software engineer building intelligent systems and creative digital experiences.',
  metadataBase: new URL('https://example.com'), // Replace with your production domain before launch.
  openGraph: {
    title: 'The Architect’s Studio | Ufuoma Jude Onohwosafe',
    description: 'Engineering intelligent systems. Creating meaningful digital experiences.',
    type: 'website'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
