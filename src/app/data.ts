import type { Service, MockBooking, DetailedMockBooking } from '@/lib/types';

export const services: Service[] = [
  {
    id: 'bridal-makeup',
    name: 'Bridal Makeup',
    description: 'A complete bridal package for your special day, ensuring you look flawless from ceremony to reception.',
    imageId: 'bridal-makeup',
    price: 350,
  },
  {
    id: 'semi-bridal-makeup',
    name: 'Semi-Bridal Makeup',
    description: 'Perfect for engagement parties, receptions, or other pre-wedding events. A glamorous yet elegant look.',
    imageId: 'semi-bridal-makeup',
    price: 250,
  },
  {
    id: 'party-makeup',
    name: 'Party Makeup',
    description: 'Get ready for any special occasion with our party makeup service. Look your best for birthdays, anniversaries, or a night out.',
    imageId: 'party-makeup',
    price: 150,
  },
  {
    id: 'makeup-classes',
    name: 'Makeup Classes',
    description: 'Learn from the best. Our one-on-one or group classes cover everything from basics to advanced techniques.',
    imageId: 'makeup-classes',
    price: 100,
  },
];

export const mockBookings: MockBooking[] = [
  { date: '2024-09-10T04:00:00.000Z', time: '09:00 AM' },
  { date: '2024-09-12T04:00:00.000Z', time: '02:00 PM' },
];

export const detailedMockBookings: DetailedMockBooking[] = [
  {
    id: '1234',
    serviceName: 'Bridal Makeup',
    date: '2024-11-15',
    time: '10:00 AM',
    status: 'Confirmed',
    clientName: 'Alice Johnson',
  },
  {
    id: '5678',
    serviceName: 'Party Makeup',
    date: '2024-11-20',
    time: '03:00 PM',
    status: 'Confirmed',
    clientName: 'Bob Williams',
  },
];
