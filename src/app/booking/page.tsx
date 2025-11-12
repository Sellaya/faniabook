'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { services } from '@/app/data';
import type { Service, ServiceType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Building, MapPin } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Please select a service.'),
  serviceType: z.enum(['in-studio', 'mobile'], {
    required_error: 'Please select a service type.',
  }),
  date: z.date({ required_error: 'Please select a date.' }),
  time: z.string().min(1, 'Please select a time.'),
  location: z.string().optional(),
  name: z.string().min(1, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
}).refine(data => {
  if (data.serviceType === 'mobile') {
    return data.location && data.location.trim() !== '';
  }
  return true;
}, {
  message: 'Location is required for mobile services.',
  path: ['location'],
}).refine(data => {
    if (data.serviceType === 'mobile' && data.location) {
        return data.location.toLowerCase().includes('ontario');
    }
    return true;
}, {
    message: 'Service is only available in Ontario.',
    path: ['location'],
});

type BookingFormData = z.infer<typeof bookingSchema>;

const availableTimes = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
];

export default function BookingPage() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const { watch, control, formState: { errors } } = form;

  const watchedServiceType = watch('serviceType');
  
  const calculateQuote = () => {
    if (!selectedService) return 0;
    let total = selectedService.price;
    if (watchedServiceType === 'mobile') {
      total += 50; // Mobile service fee
    }
    return total;
  };

  const onSubmit = (data: BookingFormData) => {
    const query = new URLSearchParams({
      serviceId: data.serviceId,
      serviceType: data.serviceType,
      date: data.date.toISOString(),
      time: data.time,
      price: calculateQuote().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      ...(data.location && { location: data.location }),
    });
    router.push(`/booking/contract?${query.toString()}`);
  };

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <header className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold text-primary">Create Your Booking</h1>
        <p className="mt-2 text-md text-muted-foreground">Follow the steps to schedule your appointment.</p>
      </header>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">1. Select a Service</CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              name="serviceId"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-3">
                  {services.map((service) => {
                    const isSelected = field.value === service.id;
                    return (
                      <div
                        key={service.id}
                        onClick={() => {
                          field.onChange(service.id);
                          const currentService = services.find(s => s.id === service.id) || null;
                          setSelectedService(currentService);
                        }}
                        className={cn(
                          "rounded-md border p-3 cursor-pointer transition-all text-center",
                          isSelected ? "border-primary ring-2 ring-primary bg-primary/5" : "border-border hover:border-primary/50"
                        )}
                      >
                        <h3 className="font-semibold text-sm">{service.name}</h3>
                      </div>
                    );
                  })}
                </div>
              )}
            />
            {errors.serviceId && <p className="text-destructive mt-2 text-sm">{errors.serviceId.message}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">2. Choose Your Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-base font-medium">Service Type</Label>
              <Controller
                name="serviceType"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="mt-2 grid grid-cols-2 gap-3"
                  >
                    <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 text-sm hover:bg-accent/50 [&:has([data-state=checked])]:border-primary">
                      <RadioGroupItem value="in-studio" className="sr-only" />
                      <Building className="mb-2 h-5 w-5" />
                      In-Studio
                    </Label>
                    <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 text-sm hover:bg-accent/50 [&:has([data-state=checked])]:border-primary">
                      <RadioGroupItem value="mobile" className="sr-only" />
                      <MapPin className="mb-2 h-5 w-5" />
                      Mobile Service
                    </Label>
                  </RadioGroup>
                )}
              />
               {errors.serviceType && <p className="text-destructive mt-2 text-sm">{errors.serviceType.message}</p>}
            </div>

            {watchedServiceType === 'in-studio' && (
              <Alert>
                <Building className="h-4 w-4" />
                <AlertTitle>Our Studio Address</AlertTitle>
                <AlertDescription>
                  123 Beauty Lane, Toronto, Ontario, M5B 2H1
                </AlertDescription>
              </Alert>
            )}
            
            {watchedServiceType === 'mobile' && (
              <div>
                <Label htmlFor="location" className="text-base font-medium">Your Address</Label>
                <Input
                  id="location"
                  placeholder="Enter your address in Ontario"
                  className="mt-2"
                  {...form.register('location')}
                />
                 {errors.location && <p className="text-destructive mt-2 text-sm">{errors.location.message}</p>}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">3. Select Date & Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                    className="rounded-md border p-0"
                  />
                )}
              />
               {errors.date && <p className="text-destructive -mt-2 px-3 pb-3 text-sm">{errors.date.message}</p>}

            <div>
               <Label className="text-base font-medium">Available Time Slots</Label>
              <Controller
                name="time"
                control={control}
                render={({ field }) => (
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                     <SelectTrigger className="mt-2">
                       <SelectValue placeholder="Select a time" />
                     </SelectTrigger>
                     <SelectContent>
                       {availableTimes.map(time => (
                         <SelectItem key={time} value={time}>{time}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                )}
              />
               {errors.time && <p className="text-destructive mt-2 text-sm">{errors.time.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">4. Your Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Jane Doe" {...form.register('name')} />
                  {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="jane@example.com" {...form.register('email')} />
                  {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
              </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="(123) 456-7890" {...form.register('phone')} />
                {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={!selectedService}>
              Generate Quote & Proceed
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
