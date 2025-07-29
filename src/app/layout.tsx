// src/app/layout.tsx
import '../styles/globals.css'; 
import { ReactNode } from 'react';

export const metadata = {
  title: 'Doctor Appointment App',
  description: 'Book appointments with doctors online',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
