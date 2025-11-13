export type Service = {
  id: string;
  name: string;
  description: string;
  price?: number;
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

export type MockBooking = {
  date: string;
  time: string;
};

// This type is being removed as it's based on mock data.
// The status page will now use the structure directly from Firestore.
// export type DetailedMockBooking = {
//   id: string;
//   serviceName: string;
//   date: string;
//   time: string;
//   status: string;
//   clientName: string;
// };
