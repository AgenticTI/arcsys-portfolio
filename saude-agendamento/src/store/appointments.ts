import { create } from "zustand";
import { Appointment, AppointmentStatus } from "@/types";
import initialData from "@/data/appointments.json";

interface AppointmentsState {
  appointments: Appointment[];
  confirmAppointment: (id: string) => void;
  cancelAppointment: (id: string) => void;
  addAppointment: (appointment: Appointment) => void;
}

export const useAppointmentsStore = create<AppointmentsState>((set) => ({
  appointments: initialData as Appointment[],

  confirmAppointment: (id: string) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, status: "confirmed" as AppointmentStatus } : a
      ),
    })),

  cancelAppointment: (id: string) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, status: "cancelled" as AppointmentStatus } : a
      ),
    })),

  addAppointment: (appointment: Appointment) =>
    set((state) => ({
      appointments: [...state.appointments, appointment],
    })),
}));
