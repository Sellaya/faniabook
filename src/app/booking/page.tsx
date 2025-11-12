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
import { addDays, format } from 'date-fns';
import { DollarSign, MapPin, Building, Calendar as CalendarIcon, Clock } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Please select a service.'),
  serviceType: z.enum(['in-studio', 'mobile'], {
    required_error: 'Please select a service type.',
  }),
  date: z.date({ required_error: 'Please select a date.' }),
  time: z.string().min(1, 'Please select a time.'),
  location: z.string().optional(),
}).refine(data => data.serviceType !== 'mobile' || (data.location && data.location.trim() !== ''), {
  message: 'Location is required for mobile services.',
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

  const watchedServiceId = watch('serviceId');
  const watchedServiceType = watch('serviceType');
  const watchedDate = watch('date');
  const watchedTime = watch('time');
  const watchedLocation = watch('location');

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
      ...(data.location && { location: data.location }),
    });
    router.push(`/booking/contract?${query.toString()}`);
  };

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold text-primary">Create Your Booking</h1>
        <p className="mt-2 text-lg text-muted-foreground">Follow the steps below to schedule your appointment.</p>
      </header>

      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Service Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">1. Select a Service</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="serviceId"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => {
                      const serviceImage = PlaceHolderImages.find(img => img.id === service.imageId);
                      const isSelected = field.value === service.id;
                      return (
                        <div
                          key={service.id}
                          onClick={() => {
                            field.onChange(service.id);
                            setSelectedService(service);
                          }}
                          className={cn(
                            "rounded-lg border-2 p-4 cursor-pointer transition-all",
                            isSelected ? "border-primary ring-2 ring-primary" : "border-border hover:border-primary/50"
                          )}
                        >
                          {serviceImage && (
                            <Image src={serviceImage.imageUrl} alt={serviceImage.description} width={400} height={300} className="rounded-md object-cover w-full h-32 mb-4" />
                          )}
                          <h3 className="font-bold text-lg">{service.name}</h3>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              />
              {errors.serviceId && <p className="text-destructive mt-2 text-sm">{errors.serviceId.message}</p>}
            </CardContent>
          </Card>

          {/* Service Options */}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">2. Choose Your Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Service Type</Label>
                <Controller
                  name="serviceType"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent/50 [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="in-studio" className="sr-only" />
                        <Building className="mb-3 h-6 w-6" />
                        In-Studio
                      </Label>
                      <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent/50 [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="mobile" className="sr-only" />
                        <MapPin className="mb-3 h-6 w-6" />
                        Mobile Service
                      </Label>
                    </RadioGroup>
                  )}
                />
                 {errors.serviceType && <p className="text-destructive mt-2 text-sm">{errors.serviceType.message}</p>}
              </div>
              {watchedServiceType === 'mobile' && (
                <div>
                  <Label htmlFor="location" className="text-base font-medium">Location</Label>
                  <Input
                    id="location"
                    placeholder="Enter your address for mobile service"
                    className="mt-2"
                    {...form.register('location')}
                  />
                   {errors.location && <p className="text-destructive mt-2 text-sm">{errors.location.message}</p>}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">3. Select Date & Time</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center">
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  )}
                />
                 {errors.date && <p className="text-destructive mt-2 text-sm">{errors.date.message}</p>}
              </div>
              <div className="space-y-4">
                 <Label className="text-base font-medium">Available Time Slots</Label>
                <Controller
                  name="time"
                  control={control}
                  render={({ field }) => (
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <SelectTrigger>
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
        </div>

        {/* Quote Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2"><DollarSign/> Quote Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedService ? (
                <p className="text-muted-foreground">Select a service to see the quote.</p>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{selectedService.name}</span>
                    <span>${selectedService.price.toFixed(2)}</span>
                  </div>
                  {watchedServiceType === 'mobile' && (
                    <div className="flex justify-between">
                      <span>Mobile Service Fee</span>
                      <span>$50.00</span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2 font-bold text-lg flex justify-between">
                    <span>Total</span>
                    <span>${calculateQuote().toFixed(2)}</span>
                  </div>

                  <div className="text-sm text-muted-foreground pt-4 space-y-2">
                    {watchedDate && (
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{format(watchedDate, 'PPP')}</span>
                      </div>
                    )}
                    {watchedTime && (
                       <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{watchedTime}</span>
                      </div>
                    )}
                    {watchedServiceType === 'in-studio' && (
                       <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span>In-Studio</span>
                      </div>
                    )}
                     {watchedServiceType === 'mobile' && watchedLocation && (
                       <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                        <span>{watchedLocation}</span>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={!selectedService}>
                Proceed to Contract
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
