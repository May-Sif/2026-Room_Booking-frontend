export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  department: string;
  role: string;
}

export interface Room {
  id: number;
  roomCode: string;
  name: string;
  capacity: number;
  status: number;
  building: string;
  floor: string;
}

export interface Booking {
  Id: string;
  roomId: number;
  userId: number;
  purpose: string;
  startTime: string;
  endTime: string;
  status: number;
}
