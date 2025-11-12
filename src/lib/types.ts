export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageId: string;
};

export type ServiceType = 'in-studio' | 'mobile';

export type Booking = {
  service: Service;
  serviceType: ServiceType;
  date: Date;
  time: string;
  location?: string;
  price: number;
};
