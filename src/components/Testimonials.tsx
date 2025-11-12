import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export default function Testimonials() {
  return (
    <section className="w-full bg-primary/5 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">What Our Clients Say</h2>
            <p className="mt-2 text-md text-muted-foreground max-w-2xl mx-auto md:text-lg">
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
  );
}
