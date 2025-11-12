import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { services } from '@/app/data';
import Link from 'next/link';
import { ArrowRight, Brush, Sparkles, Users, BookOpen, Star } from 'lucide-react';

export default function Home() {
  const serviceIcons: { [key: string]: React.ElementType } = {
    'bridal-makeup': Sparkles,
    'semi-bridal-makeup': Brush,
    'party-makeup': Users,
    'makeup-classes': BookOpen,
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-primary/10 via-background to-background py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-headline text-5xl font-bold text-primary md:text-7xl">
            Elegance & Artistry, Redefined.
          </h1>
          <p className="mt-4 max-w-2xl mx-auto font-body text-lg text-muted-foreground md:text-xl">
            Discover a world of beauty with FaniaBook. We offer bespoke makeup services for Black skin, making your special moments unforgettable.
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
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {services.map((service) => {
              const Icon = serviceIcons[service.id] || Brush;
              return (
                <Card key={service.id} className="overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
                  <div className="flex flex-col justify-between p-6 w-full">
                    <div>
                      <div className="flex items-center mb-2">
                        <Icon className="h-8 w-8 text-accent mr-3" />
                        <CardTitle className="font-headline text-2xl">{service.name}</CardTitle>
                      </div>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                    <div className="mt-4 text-right">
                       <Button asChild variant="link" className="text-accent">
                          <Link href="/booking">
                           Book Now <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                       </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
           <div className="text-center mt-12">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                <Link href="/booking">
                See All Options & Book Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
              <h2 className="font-headline text-4xl font-bold text-primary">What Our Clients Say</h2>
              <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
                We are proud to have delighted our clients. Here's what they think about our service.
              </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card>
                  <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                          {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />)}
                      </div>
                      <p className="text-muted-foreground mb-4">"The bridal makeup was absolutely perfect! It lasted all day and I felt like a princess. Highly recommended!"</p>
                      <p className="font-bold text-right">- Sarah L.</p>
                  </CardContent>
              </Card>
              <Card>
                  <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                          {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />)}
                      </div>
                      <p className="text-muted-foreground mb-4">"I took a makeup class and it was fantastic. I learned so many professional tips and tricks. The instructor was so patient."</p>
                      <p className="font-bold text-right">- Jessica M.</p>
                  </CardContent>
              </Card>
              <Card>
                  <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                           {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />)}
                      </div>
                      <p className="text-muted-foreground mb-4">"Absolutely stunning party makeup. I received so many compliments and felt incredibly glamorous. Will definitely book again!"</p>
                      <p className="font-bold text-right">- Emily R.</p>
                  </CardContent>
              </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
