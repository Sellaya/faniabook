import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { services } from '@/app/data';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Brush, Sparkles, Users, BookOpen } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');
  const serviceIcons: { [key: string]: React.ElementType } = {
    'bridal-makeup': Sparkles,
    'semi-bridal-makeup': Brush,
    'party-makeup': Users,
    'makeup-classes': BookOpen,
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
          <h1 className="font-headline text-5xl font-bold md:text-7xl">
            Elegance & Artistry, Redefined.
          </h1>
          <p className="mt-4 max-w-2xl font-body text-lg md:text-xl">
            Discover a world of beauty with FaniaBook. We offer bespoke makeup services to make your special moments unforgettable.
          </p>
          <Button asChild className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
            <Link href="/booking">
              Book Your Appointment <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="w-full bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl font-bold text-primary">Our Services</h2>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
              From bridal glamour to professional classes, we cater to all your beauty needs with passion and precision.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => {
              const serviceImage = PlaceHolderImages.find((img) => img.id === service.imageId);
              const Icon = serviceIcons[service.id] || Brush;
              return (
                <Card key={service.id} className="overflow-hidden shadow-lg transition-transform hover:scale-105 hover:shadow-xl">
                  <CardHeader>
                    {serviceImage && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={serviceImage.imageUrl}
                          alt={serviceImage.description}
                          data-ai-hint={serviceImage.imageHint}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                    )}
                    <div className="flex items-center pt-4">
                      <Icon className="h-8 w-8 text-accent mr-3" />
                      <CardTitle className="font-headline text-2xl">{service.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{service.description}</CardDescription>
                    <div className="mt-4 text-right">
                      <p className="font-bold text-lg text-primary">From ${service.price}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
           <div className="text-center mt-12">
            <Button asChild variant="link" className="text-accent text-lg">
                <Link href="/booking">
                See all options and book now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
