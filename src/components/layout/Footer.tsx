import Link from 'next/link';
import { Brush, Mail, Phone, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <Brush className="h-6 w-6 text-primary" />
              <span className="font-headline text-xl">FaniaBook</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Professional Makeup Artistry
            </p>
          </div>

          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h3 className="font-headline text-lg font-semibold">Contact Us</h3>
            <div className="mt-2 space-y-1 text-sm">
              <a
                href="mailto:contact@faniabook.com"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                contact@faniabook.com
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                +1 (234) 567-890
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h3 className="font-headline text-lg font-semibold">Follow Us</h3>
            <div className="mt-2 flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FaniaBook. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
