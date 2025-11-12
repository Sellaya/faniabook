'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { services, mockBookings } from '@/app/data';
import type { Service } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
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
import { Building, MapPin, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Please select a service.'),
  serviceType: z.enum(['in-studio', 'mobile'], {
    required_error: 'Please select a service type.',
  }),
  date: z.date({ required_error: 'Please select a date.' }),
  time: z.string().min(1, 'Please select a time.'),
  name: z.string().min(1, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  streetAddress: z.string().optional(),
  postalCode: z.string().optional(),
}).refine(data => {
  if (data.serviceType === 'mobile') {
    return data.streetAddress && data.streetAddress.trim() !== '';
  }
  return true;
}, {
  message: 'Street address is required for mobile services.',
  path: ['streetAddress'],
}).refine(data => {
  if (data.serviceType === 'mobile') {
    return data.postalCode && data.postalCode.trim() !== '';
  }
  return true;
}, {
  message: 'Postal code is required for mobile services.',
  path: ['postalCode'],
});

type BookingFormData = z.infer<typeof bookingSchema>;

const availableTimes = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
];

export default function BookingPage() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [isSlotBooked, setIsSlotBooked] = useState(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const { watch, control, formState: { errors }, getValues } = form;

  const watchedServiceType = watch('serviceType');
  const watchedDate = watch('date');
  const watchedTime = watch('time');

  useEffect(() => {
    const checkBookingConflict = () => {
      const selectedDate = getValues('date');
      const selectedTime = getValues('time');

      if (!selectedDate || !selectedTime) {
        setIsSlotBooked(false);
        return;
      }
      
      const isBooked = mockBookings.some(booking => 
        new Date(booking.date).toDateString() === selectedDate.toDateString() && booking.time === selectedTime
      );

      setIsSlotBooked(isBooked);
    };

    checkBookingConflict();
  }, [watchedDate, watchedTime, getValues]);


  const calculateQuote = () => {
    if (!selectedService) return 0;
    let total = selectedService.price;
    if (watchedServiceType === 'mobile') {
      total += 50; // Mobile service fee
    }
    return total;
  };

  const onSubmit = (data: BookingFormData) => {
    if (isSlotBooked) return;

    let location;
    if (data.serviceType === 'mobile' && data.streetAddress && data.postalCode) {
        location = `${data.streetAddress}, Ontario, ${data.postalCode}`;
    }

    const query = new URLSearchParams({
      serviceId: data.serviceId,
      serviceType: data.serviceType,
      date: data.date.toISOString(),
      time: data.time,
      price: calculateQuote().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      ...(location && { location: location }),
    });
    router.push(`/booking/contract?${query.toString()}`);
  };

  return (
    <div className="container mx-auto max-w-lg py-8 px-4">
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
                 <Select onValueChange={(value) => {
                    field.onChange(value);
                    const currentService = services.find(s => s.id === value) || null;
                    setSelectedService(currentService);
                 }} defaultValue={field.value}>
                   <SelectTrigger>
                     <SelectValue placeholder="Select a service" />
                   </SelectTrigger>
                   <SelectContent>
                     {services.map((service) => (
                       <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
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
              <div className="space-y-4">
                <div>
                  <Label htmlFor="streetAddress" className="text-base font-medium">Street Address</Label>
                  <Input
                    id="streetAddress"
                    placeholder="e.g., 123 Main St"
                    className="mt-2"
                    {...form.register('streetAddress')}
                  />
                  {errors.streetAddress && <p className="text-destructive mt-2 text-sm">{errors.streetAddress.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="province" className="text-base font-medium">Province</Label>
                        <Input id="province" value="Ontario" disabled className="mt-2"/>
                    </div>
                    <div>
                        <Label htmlFor="postalCode" className="text-base font-medium">Postal Code</Label>
                        <Input
                            id="postalCode"
                            placeholder="e.g., A1B 2C3"
                            className="mt-2"
                            {...form.register('postalCode')}
                        />
                        {errors.postalCode && <p className="text-destructive mt-2 text-sm">{errors.postalCode.message}</p>}
                    </div>
                </div>
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
                  <Popover open={isDatePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setDatePickerOpen(false);
                        }}
                        disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
               {errors.date && <p className="text-destructive mt-1 text-sm">{errors.date.message}</p>}

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

            {isSlotBooked && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Slot Unavailable</AlertTitle>
                    <AlertDescription>
                        This time slot is already booked. Please select a different time or contact Fania directly to inquire about this date.
                    </AlertDescription>
                </Alert>
            )}

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
        </Card>

        <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={!selectedService || isSlotBooked}>
            Generate Quote & Proceed
        </Button>
      </form>
    </div>
  );
}
