import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Pencil } from 'lucide-react';

const mockUser = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  phone: '+1 (234) 567-890',
};

const mockBookings = [
  {
    id: 'BK001',
    service: 'Bridal Makeup',
    date: '2024-08-15',
    status: 'Confirmed',
    price: 350,
  },
  {
    id: 'BK002',
    service: 'Party Makeup',
    date: '2024-05-20',
    status: 'Completed',
    price: 150,
  },
  {
    id: 'BK003',
    service: 'Makeup Classes',
    date: '2024-03-10',
    status: 'Completed',
    price: 100,
  },
];

export default function ProfilePage() {
  const avatarImage = PlaceHolderImages.find((img) => img.id === 'profile-avatar');

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <header className="mb-12">
        <h1 className="font-headline text-5xl font-bold text-primary">My Profile</h1>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="shadow-lg">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <Avatar className="h-24 w-24 mb-4">
                {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt={mockUser.name} data-ai-hint={avatarImage.imageHint}/>}
                <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{mockUser.name}</h2>
              <p className="text-muted-foreground">{mockUser.email}</p>
              <p className="text-muted-foreground">{mockUser.phone}</p>
              <Button variant="outline" size="sm" className="mt-4">
                <Pencil className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Booking History</CardTitle>
              <CardDescription>Here are your past and upcoming appointments.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.id}</TableCell>
                      <TableCell>{booking.service}</TableCell>
                      <TableCell>{booking.date}</TableCell>
                      <TableCell>
                        <Badge variant={booking.status === 'Confirmed' ? 'default' : 'secondary'} className={booking.status === 'Confirmed' ? 'bg-green-600' : ''}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">${booking.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
