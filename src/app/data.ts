import type { Service } from '@/lib/types';

export const services: Service[] = [
  {
    id: 'bridal-makeup',
    name: 'Bridal Makeup',
    description: 'A complete bridal package for your special day, ensuring you look flawless from ceremony to reception.',
    price: 350,
    imageId: 'bridal-makeup',
  },
  {
    id: 'semi-bridal-makeup',
    name: 'Semi-Bridal Makeup',
    description: 'Perfect for engagement parties, receptions, or other pre-wedding events. A glamorous yet elegant look.',
    price: 200,
    imageId: 'semi-bridal-makeup',
  },
  {
    id: 'party-makeup',
    name: 'Party Makeup',
    description: 'Get ready for any special occasion with our party makeup service. Look your best for birthdays, anniversaries, or a night out.',
    price: 150,
    imageId: 'party-makeup',
  },
  {
    id: 'makeup-classes',
    name: 'Makeup Classes',
    description: 'Learn from the best. Our one-on-one or group classes cover everything from basics to advanced techniques.',
    price: 100,
    imageId: 'makeup-classes',
  },
];
