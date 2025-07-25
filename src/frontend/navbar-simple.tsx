import { type ReactNode } from 'react';

export interface NavBarProps {
  children: ReactNode;
}

export default function NavBar({ children }: NavBarProps) {
  return (
    <div>
      <nav>Simple Navbar</nav>
      <main>{children}</main>
    </div>
  );
} 