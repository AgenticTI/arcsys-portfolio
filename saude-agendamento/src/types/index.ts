export type AppointmentStatus = "confirmed" | "pending" | "cancelled";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  photo: string;
  rating: number;
  crm: string;
  bio: string;
  availableSlots: string[]; // e.g. ["09:00", "10:00"]
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;   // "YYYY-MM-DD"
  time: string;   // "HH:MM"
  status: AppointmentStatus;
  reason: string;
}

export interface Patient {
  id: string;
  name: string;
  photo: string;
  email: string;
}

export interface DoctorUser {
  id: string;
  name: string;
  specialty: string;
  photo: string;
}
