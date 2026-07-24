import { createContext, useContext, useState } from "react";

const StaffContext = createContext();

const initialEmployees = [
  {
    id: "EMP-1001",
    firstName: "Rajesh",
    lastName: "Patel",
    email: "rajesh@spicegarden.in",
    phone: "+91 9876543210",
    role: "Restaurant Manager",
    department: "Management",
    store: "All Outlets",
    status: "Active",
    joinDate: "2023-01-15",
    salary: 55000,
  },
  {
    id: "EMP-1002",
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya@spicegarden.in",
    phone: "+91 9876543211",
    role: "Cashier / Biller",
    department: "Billing",
    store: "CG Road",
    status: "Active",
    joinDate: "2023-06-01",
    salary: 22000,
  },
  {
    id: "EMP-1003",
    firstName: "Suresh",
    lastName: "Kumar",
    email: "suresh@spicegarden.in",
    phone: "+91 9876543212",
    role: "Head Chef",
    department: "Kitchen",
    store: "CG Road",
    status: "Active",
    joinDate: "2023-03-10",
    salary: 40000,
  },
  {
    id: "EMP-1004",
    firstName: "Anil",
    lastName: "Verma",
    email: "anil@spicegarden.in",
    phone: "+91 9876543213",
    role: "Tandoor Chef",
    department: "Kitchen",
    store: "CG Road",
    status: "Active",
    joinDate: "2023-08-15",
    salary: 28000,
  },
  {
    id: "EMP-1005",
    firstName: "Deepak",
    lastName: "Singh",
    email: "deepak@spicegarden.in",
    phone: "+91 9876543214",
    role: "Captain / Waiter",
    department: "Service",
    store: "CG Road",
    status: "Active",
    joinDate: "2024-01-10",
    salary: 18000,
  },
  {
    id: "EMP-1006",
    firstName: "Kavita",
    lastName: "Joshi",
    email: "kavita@spicegarden.in",
    phone: "+91 9876543215",
    role: "Hostess",
    department: "Service",
    store: "CG Road",
    status: "On Leave",
    joinDate: "2024-03-01",
    salary: 16000,
  },
];

  const initialLogs = [
    {
      id: "LOG-1",
      employeeId: "EMP-1001",
      employeeName: "Rajesh Patel",
      inOut: "10:30 AM -> 10:00 PM",
      activity: "2 punch cycles",
      totalWork: "10h 30m",
      lunchBreak: "0h 30m",
      shortBreak: "0h 30m",
      status: "Present",
      date: new Date().toLocaleDateString(),
    },
    {
      id: "LOG-2",
      employeeId: "EMP-1002",
      employeeName: "Priya Sharma",
      inOut: "11:00 AM -> 07:00 PM",
      activity: "2 punch cycles",
      totalWork: "7h 30m",
      lunchBreak: "0h 30m",
      shortBreak: "0h 0m",
      status: "Present",
      date: new Date().toLocaleDateString(),
    },
    {
      id: "LOG-3",
      employeeId: "EMP-1003",
      employeeName: "Suresh Kumar",
      inOut: "09:00 AM -> 05:00 PM",
      activity: "2 punch cycles",
      totalWork: "7h 30m",
      lunchBreak: "0h 30m",
      shortBreak: "0h 0m",
      status: "Present",
      date: new Date().toLocaleDateString(),
    },
    {
      id: "LOG-4",
      employeeId: "EMP-1004",
      employeeName: "Anil Verma",
      inOut: "10:00 AM -> 06:00 PM",
      activity: "2 punch cycles",
      totalWork: "7h 30m",
      lunchBreak: "0h 30m",
      shortBreak: "0h 0m",
      status: "Present",
      date: new Date().toLocaleDateString(),
    },
    {
      id: "LOG-5",
      employeeId: "EMP-1005",
      employeeName: "Deepak Singh",
      inOut: "11:00 AM -> --:--",
      activity: "1 punch cycles",
      totalWork: "Running...",
      lunchBreak: "0h 0m",
      shortBreak: "0h 0m",
      status: "Present",
      date: new Date().toLocaleDateString(),
    },
    {
      id: "LOG-6",
      employeeId: "EMP-1006",
      employeeName: "Kavita Joshi",
      inOut: "-- : --",
      activity: "0 punch cycles",
      totalWork: "0h 0m",
      lunchBreak: "0h 0m",
      shortBreak: "0h 0m",
      status: "On Leave",
      date: new Date().toLocaleDateString(),
    },
  ];

  const initialShifts = [
    { employeeId: "EMP-1001", shift: "Full Day (10:00 AM - 10:00 PM)" },
    { employeeId: "EMP-1002", shift: "Morning (11:00 AM - 07:00 PM)" },
    { employeeId: "EMP-1003", shift: "Morning (09:00 AM - 05:00 PM)" },
    { employeeId: "EMP-1004", shift: "Morning (10:00 AM - 06:00 PM)" },
    { employeeId: "EMP-1005", shift: "Evening (04:00 PM - 12:00 AM)" },
    { employeeId: "EMP-1006", shift: "Morning (11:00 AM - 07:00 PM)" },
  ];

export function StaffProvider({ children }) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [attendanceLogs, setAttendanceLogs] = useState(initialLogs);
  const [shifts, setShifts] = useState(initialShifts);
  const [currentUser, setCurrentUser] = useState(null);

  // Employee Operations
  const addEmployee = (employeeData) => {
    const newId = `EMP-${1000 + employees.length + 1}`;
    const newEmployee = { ...employeeData, id: newId };
    setEmployees([...employees, newEmployee]);
  };

  const updateEmployee = (id, updatedData) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updatedData } : emp))
    );
  };

  const deleteEmployee = (id) => {
    // Soft delete usually preferred
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, status: "Terminated" } : emp))
    );
  };

  const login = (email, password) => {
    // In a real app, you would verify the password here.
    // For this mockup, we just find the user by email.
    const user = employees.find((emp) => emp.email === email);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Clock in / out logic (simplified for mockup, just creates a new session)
  const clockIn = (employeeId) => {
    const emp = employees.find((e) => e.id === employeeId);
    if (!emp) return;

    const log = {
      id: Date.now().toString(),
      employeeId,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      inOut: `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -> --:--`,
      activity: "1 punch cycles",
      totalWork: "0h 0m",
      lunchBreak: "0h 0m",
      shortBreak: "0h 0m",
      status: "Present",
      date: new Date().toLocaleDateString(),
    };
    setAttendanceLogs([log, ...attendanceLogs]);
  };

  const clockOut = (employeeId) => {
    // Ideally this would find the active log and update `inOut` out time and `totalWork`
    setAttendanceLogs((prev) => 
      prev.map((log) => {
        if (log.employeeId === employeeId && log.inOut.includes("--:--")) {
          const outTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            ...log,
            inOut: log.inOut.replace("--:--", outTime),
            totalWork: "Updated",
          };
        }
        return log;
      })
    );
  };

  const assignShift = (employeeId, shiftName) => {
    setShifts((prev) => {
      const exists = prev.find((s) => s.employeeId === employeeId);
      if (exists) {
        return prev.map((s) => s.employeeId === employeeId ? { ...s, shift: shiftName } : s);
      }
      return [...prev, { employeeId, shift: shiftName }];
    });
  };

  const value = {
    employees,
    attendanceLogs,
    shifts,
    currentUser,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    login,
    logout,
    clockIn,
    clockOut,
    assignShift,
  };

  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>;
}

export function useStaff() {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error("useStaff must be used within a StaffProvider");
  }
  return context;
}
