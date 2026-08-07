import { useState } from "react";

const MOCK_EMPLOYEES = [
  {
    id: "EMP001",
    firstName: "John",
    lastName: "Doe",
    role: "Manager",
    department: "Front of House",
    status: "Active",
    shift: "Morning",
    phone: "123-456-7890",
    email: "john@example.com",
    joinDate: "2024-01-15",
  },
  {
    id: "EMP002",
    firstName: "Jane",
    lastName: "Smith",
    role: "Chef",
    department: "Kitchen",
    status: "Active",
    shift: "Evening",
    phone: "098-765-4321",
    email: "jane@example.com",
    joinDate: "2024-02-20",
  },
  {
    id: "EMP003",
    firstName: "Mike",
    lastName: "Johnson",
    role: "Waiter",
    department: "Front of House",
    status: "On Leave",
    shift: "Morning",
    phone: "555-123-4567",
    email: "mike@example.com",
    joinDate: "2024-03-10",
  },
];

const MOCK_ATTENDANCE = [
  {
    id: "ATT001",
    employeeId: "EMP001",
    employeeName: "John Doe",
    date: "2024-10-24",
    clockIn: "09:00 AM",
    clockOut: "05:00 PM",
    status: "Present",
    totalHours: "8h",
  },
];

const MOCK_SHIFTS = [
  {
    id: "SHF001",
    name: "Morning Shift",
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    id: "SHF002",
    name: "Evening Shift",
    startTime: "17:00",
    endTime: "01:00",
  },
];

export function useStaff() {
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES);
  const [attendanceLogs, setAttendanceLogs] = useState(MOCK_ATTENDANCE);
  const [shifts, setShifts] = useState(MOCK_SHIFTS);

  const addEmployee = (emp) => {
    setEmployees((prev) => [
      ...prev,
      { ...emp, id: `EMP00${prev.length + 1}` },
    ]);
  };

  const updateEmployee = (updatedEmp) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === updatedEmp.id ? updatedEmp : emp))
    );
  };

  const deleteEmployee = (id) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const assignShift = (employeeId, shiftId) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId
          ? { ...emp, shift: shifts.find((s) => s.id === shiftId)?.name }
          : emp
      )
    );
  };

  return {
    employees,
    attendanceLogs,
    shifts,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    assignShift,
  };
}
