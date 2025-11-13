'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const consultationSchema = z.object({
  name: z.string().min(1, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone number must be in the format (XXX) XXX-XXXX'),
  message: z.string().min(10, 'Please enter a message with at least 10 characters.'),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

export default function ConsultationPage() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
  });

  const { formState: { errors }, register, handleSubmit } = form;

  const onSubmit = (data: ConsultationFormData) => {
    // In a real app, you would send this data to your backend
    console.log(data);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto max-w-lg py-12 px-4">
        <Card className="text-center shadow-lg">
          <CardHeader className="items-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <CardTitle className="font-headline text-3xl text-primary mt-4">Thank You!</CardTitle>
            <CardDescription className="text-md">
              Your consultation request has been sent. We will get back to you within 24-48 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/">Return to Homepage</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-lg py-8 px-4">
       <div className="relative">
        <Button
          variant="outline"
          size="sm"
          className="absolute -top-4 left-0"
          onClick={() => router.push('/booking')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      <header className="text-center mb-8">
        <div className="inline-flex items-center justify-center rounded-lg bg-primary p-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="font-headline text-4xl font-bold text-primary">Makeup Class Consultation</h1>
        <p className="mt-2 text-md text-muted-foreground">
          Interested in our makeup classes? Fill out the form below to get in touch.
        </p>
      </header>

      <Card>
        <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Jane Doe" {...register('name')} />
                    {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="jane@example.com" {...register('email')} />
                    {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <p className="text-sm text-muted-foreground">Please use the format (XXX) XXX-XXXX.</p>
                    <Input id="phone" type="tel" placeholder="(647) 123-4567" {...register('phone')} />
                    {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message">Your Message</Label>
                    <Textarea
                        id="message"
                        placeholder="Tell us what you're interested in learning..."
                        rows={5}
                        {...register('message')}
                    />
                    {errors.message && <p className="text-destructive text-sm mt-1">{errors.message.message}</p>}
                </div>
                <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Send Inquiry
                </Button>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
