'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Brush,
  Menu,
  Home,
  CalendarDays,
  Search,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/booking', label: 'Booking', icon: CalendarDays },
  { href: '/booking/status', label: 'Check Booking', icon: Search },
];

export default function Header() {
  const pathname = usePathname();

  const NavLink = ({
    href,
    label,
    icon: Icon,
    className,
  }: {
    href: string;
    label: string;
    icon: React.ElementType;
    className?: string;
  }) => (
    <Link href={href} legacyBehavior passHref>
      <a
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          pathname === href
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-primary/5 hover:text-primary',
          className
        )}
      >
        <Icon className="h-4 w-4" />
        {label}
      </a>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Brush className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl">FaniaBook</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-4 text-sm lg:flex">
          {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-4 p-4">
                <Link href="/" className="mb-4 flex items-center gap-2 font-bold">
                  <Brush className="h-6 w-6 text-primary" />
                  <span className="font-headline text-xl">FaniaBook</span>
                </Link>
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <NavLink key={link.href} {...link} />
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
