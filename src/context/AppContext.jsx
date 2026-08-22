import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const initialEmployees = [
  {
    id: "ODOO20260001",
    name: "Sidharth (Admin)",
    email: "sidharth@odoo.com",
    phone: "+91 9876543210",
    role: "HR",
    password: "password",
    avatar: "",
    resume: {
      summary: "Lead Developer and HR Manager",
      experience: "Lead developer for Odoo-Dijkstra.",
      interests: "Algorithmic pathfinding, system design",
      certifications: "React Master, Odoo Partner"
    },
    privateInfo: {
      dob: "1998-05-15",
      gender: "Male",
      maritalStatus: "Single",
      nationality: "Indian",
      address: "123 Tech Park, Bangalore",
      personalEmail: "sidharth.personal@gmail.com",
      bankName: "HDFC Bank",
      ifsc: "HDFC0001234",
      accountNo: "50100087654321"
    },
    salaryInfo: {
      monthlyWage: 120000,
      yearlyWage: 1440000,
      workingDays: 5,
      basic: 60000,
      hra: 24000,
      standardAllowance: 10000,
      performanceBonus: 15000,
      lta: 5000,
      foodAllowance: 3000,
      pfEmployee: 7200,
      pfEmployer: 7200,
      professionalTax: 200
    }
  },
  {
    id: "ODOO20260002",
    name: "Rujitha (Employee)",
    email: "rujitha@odoo.com",
    phone: "+91 9876543211",
    role: "Employee",
    password: "password",
    avatar: "",
    resume: {
      summary: "Frontend Developer",
      experience: "React Developer at Odoo-Dijkstra.",
      interests: "UI/UX, Responsive Design",
      certifications: "CSS Grid Master"
    },
    privateInfo: {
      dob: "2000-08-20",
      gender: "Female",
      maritalStatus: "Single",
      nationality: "Indian",
      address: "456 Silicon Valley, Bangalore",
      personalEmail: "rujitha.personal@gmail.com",
      bankName: "ICICI Bank",
      ifsc: "ICIC0005678",
      accountNo: "102030405060"
    },
    salaryInfo: {
      monthlyWage: 80000,
      yearlyWage: 960000,
      workingDays: 5,
      basic: 40000,
      hra: 16000,
      standardAllowance: 8000,
      performanceBonus: 10000,
      lta: 3000,
      foodAllowance: 2800,
      pfEmployee: 4800,
      pfEmployer: 4800,
      professionalTax: 200
    }
  },
  {
    id: "ODOO20260003",
    name: "Shebha (Employee)",
    email: "shebha@odoo.com",
    phone: "+91 9876543212",
    role: "Employee",
    password: "password",
    avatar: "",
    resume: {
      summary: "Product Designer and Frontend Engineer",
      experience: "Product Designer at Odoo-Dijkstra.",
      interests: "Design Systems, Motion Graphics",
      certifications: "UX Certification"
    },
    privateInfo: {
      dob: "1999-12-05",
      gender: "Female",
      maritalStatus: "Single",
      nationality: "Indian",
      address: "789 Design District, Bangalore",
      personalEmail: "shebha.personal@gmail.com",
      bankName: "SBI Bank",
      ifsc: "SBIN0009012",
      accountNo: "987654321098"
    },
    salaryInfo: {
      monthlyWage: 80000,
      yearlyWage: 960000,
      workingDays: 5,
      basic: 40000,
      hra: 16000,
      standardAllowance: 8000,
      performanceBonus: 10000,
      lta: 3000,
      foodAllowance: 2800,
      pfEmployee: 4800,
      pfEmployer: 4800,
      professionalTax: 200
    }
  }
];

export const AppProvider = ({ children }) => {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('dayflow_employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('dayflow_attendance');
    return saved ? JSON.parse(saved) : [];
  });

  const [leaves, setLeaves] = useState(() => {
    const saved = localStorage.getItem('dayflow_leaves');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('dayflow_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('dayflow_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('dayflow_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('dayflow_leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('dayflow_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('dayflow_current_user');
    }
  }, [currentUser]);

  // login
  const login = (email, password) => {
    const user = employees.find(e => e.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error("Employee not found");
    
    if (user.password && user.password !== password) {
      throw new Error("Invalid password");
    }
    
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // signup
  const signup = (userData) => {
    const nameParts = userData.name.trim().split(" ");
    let initials = "XX";
    if (nameParts.length >= 2) {
      initials = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    } else if (nameParts.length === 1 && nameParts[0].length >= 2) {
      initials = (nameParts[0][0] + nameParts[0][1]).toUpperCase();
    }
    const year = new Date().getFullYear();
    const serial = String(employees.length + 1).padStart(4, '0');
    const newId = `ODOO${initials}${year}${serial}`;

    const newEmployee = {
      id: newId,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || "",
      role: userData.role || "Employee",
      password: userData.password,
      avatar: userData.avatar || "",
      resume: { summary: "", experience: "", interests: "", certifications: "" },
      privateInfo: {
        dob: "",
        gender: "",
        maritalStatus: "",
        nationality: "",
        address: "",
        personalEmail: "",
        bankName: "",
        ifsc: "",
        accountNo: ""
      },
      salaryInfo: {
        monthlyWage: 50000,
        yearlyWage: 600000,
        workingDays: 5,
        basic: 25000,
        hra: 10000,
        standardAllowance: 5000,
        performanceBonus: 5000,
        lta: 2500,
        foodAllowance: 2500,
        pfEmployee: 3000,
        pfEmployer: 3000,
        professionalTax: 200
      }
    };

    setEmployees(prev => [...prev, newEmployee]);
    setCurrentUser(newEmployee);
    return newEmployee;
  };

  // updateProfile
  const updateProfile = (employeeId, updatedFields) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === employeeId) {
        const updated = {
          ...emp,
          ...updatedFields,
          resume: { ...emp.resume, ...(updatedFields.resume || {}) },
          privateInfo: { ...emp.privateInfo, ...(updatedFields.privateInfo || {}) },
          salaryInfo: { ...emp.salaryInfo, ...(updatedFields.salaryInfo || {}) }
        };
        if (currentUser && currentUser.id === employeeId) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return emp;
    }));
  };

  // createEmployeeByAdmin
  const createEmployeeByAdmin = (userData) => {
    const nameParts = userData.name.trim().split(" ");
    let initials = "XX";
    if (nameParts.length >= 2) {
      initials = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    } else if (nameParts.length === 1 && nameParts[0].length >= 2) {
      initials = (nameParts[0][0] + nameParts[0][1]).toUpperCase();
    }
    const year = new Date().getFullYear();
    const serial = String(employees.length + 1).padStart(4, '0');
    const newId = `ODOO${initials}${year}${serial}`;

    const newEmployee = {
      id: newId,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || "",
      role: userData.role || "Employee",
      password: "password",
      avatar: userData.avatar || "",
      resume: userData.resume || { summary: "", experience: "", interests: "", certifications: "" },
      privateInfo: userData.privateInfo || {
        dob: "",
        gender: "",
        maritalStatus: "",
        nationality: "",
        address: "",
        personalEmail: "",
        bankName: "",
        ifsc: "",
        accountNo: ""
      },
      salaryInfo: userData.salaryInfo || {
        monthlyWage: 60000,
        yearlyWage: 720000,
        workingDays: 5,
        basic: 30000,
        hra: 12000,
        standardAllowance: 6000,
        performanceBonus: 6000,
        lta: 3000,
        foodAllowance: 3000,
        pfEmployee: 3600,
        pfEmployer: 3600,
        professionalTax: 200
      }
    };

    setEmployees(prev => [...prev, newEmployee]);
    return newEmployee;
  };

  // checkIn
  const checkIn = (employeeId, timeString) => {
    const today = new Date().toISOString().split('T')[0];
    setAttendance(prev => {
      const existsIdx = prev.findIndex(a => a.employeeId === employeeId && a.date === today);
      if (existsIdx > -1) {
        const updated = [...prev];
        updated[existsIdx] = { ...updated[existsIdx], checkIn: timeString, status: "Present" };
        return updated;
      } else {
        return [...prev, {
          employeeId,
          date: today,
          checkIn: timeString,
          checkOut: "",
          status: "Present",
          workHours: 0
        }];
      }
    });
  };

  // checkOut
  const checkOut = (employeeId, timeString) => {
    const today = new Date().toISOString().split('T')[0];
    setAttendance(prev => {
      const existsIdx = prev.findIndex(a => a.employeeId === employeeId && a.date === today);
      if (existsIdx > -1) {
        const updated = [...prev];
        const log = updated[existsIdx];
        
        let workHours = 0;
        if (log.checkIn) {
          const [inH, inM] = log.checkIn.split(':').map(Number);
          const [outH, outM] = timeString.split(':').map(Number);
          const diffMs = (outH * 60 + outM) - (inH * 60 + inM);
          workHours = Math.max(0, Number((diffMs / 60).toFixed(2)));
        }

        updated[existsIdx] = {
          ...log,
          checkOut: timeString,
          workHours: workHours
        };
        return updated;
      } else {
        return [...prev, {
          employeeId,
          date: today,
          checkIn: "",
          checkOut: timeString,
          status: "Present",
          workHours: 0
        }];
      }
    });
  };

  // requestLeave
  const requestLeave = (leaveData) => {
    const newLeave = {
      id: Date.now(),
      employeeId: currentUser?.id || "ODOO20260001",
      type: leaveData.type || "Paid",
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      days: Number(leaveData.days) || 1,
      remarks: leaveData.remarks || "",
      attachment: leaveData.attachment || "",
      status: "Pending",
      comments: ""
    };
    setLeaves(prev => [...prev, newLeave]);
  };

  // updateLeaveStatus
  const updateLeaveStatus = (leaveId, status, comments = "") => {
    setLeaves(prev => prev.map(l => {
      if (l.id === leaveId) {
        return { ...l, status, comments };
      }
      return l;
    }));
  };

  // getEmployeeStatus
  const getEmployeeStatus = (employeeId) => {
    const today = new Date().toISOString().split('T')[0];
    
    const hasApprovedLeaveToday = leaves.some(l => {
      if (l.employeeId !== employeeId || l.status !== "Approved") return false;
      const start = new Date(l.startDate);
      const end = new Date(l.endDate);
      const todayDate = new Date(today);
      return todayDate >= start && todayDate <= end;
    });

    if (hasApprovedLeaveToday) return "On Leave";

    const todayLog = attendance.find(a => a.employeeId === employeeId && a.date === today);
    if (todayLog && todayLog.checkIn) {
      return "Present";
    }

    return "Absent";
  };

  return (
    <AppContext.Provider value={{
      employees,
      attendance,
      leaves,
      currentUser,
      login,
      logout,
      signup,
      updateProfile,
      createEmployeeByAdmin,
      checkIn,
      checkOut,
      requestLeave,
      updateLeaveStatus,
      getEmployeeStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};
