const assignedProcesses = [
  {
    processID: "1",
    processName: "Radical Prostatectomy",
    description: "Surgical removal of the prostate gland",
    myProcedure: {
      procedureName: "Pelvic Ultrasound",
      location: "Room 170A",
      timeStart: "2024-04-05T20:30:00",
      timeEnd: "2024-04-05T21:30:00",
    },
    currentProcedure: "Pre-Operative Consultation",
    patientName: "May Mary",
    procedureAhead: 0,
  },
  {
    processID: "2",
    processName: "Coronary Artery Bypass Grafting (CABG)",
    description: "Surgical procedure to restore blood flow to the heart",
    myProcedure: {
      procedureName: "Cardiac Catheterization",
      location: "Room 215B",
      timeStart: "2024-04-06T08:00:00",
      timeEnd: "2024-04-06T10:00:00",
    },
    currentProcedure: "Intra-Operative Procedure",
    patientName: "John Doe",
    procedureAhead: 1,
  },
  {
    processID: "3",
    processName: "Total Knee Replacement",
    description:
      "Surgical procedure to replace a damaged knee joint with an artificial implant",
    myProcedure: {
      procedureName: "X-ray Imaging",
      location: "Room 310C",
      timeStart: "2024-04-07T11:00:00",
      timeEnd: "2024-04-07T12:00:00",
    },
    currentProcedure: "Post-Operative Follow-Up",
    patientName: "Alice Johnson",
    procedureAhead: 2,
  },
  {
    processID: "4",
    processName: "Cholecystectomy",
    description: "Surgical removal of the gallbladder",
    myProcedure: {
      procedureName: "Abdominal Ultrasound",
      location: "Room 155A",
      timeStart: "2024-04-08T09:30:00",
      timeEnd: "2024-04-08T11:00:00",
    },
    currentProcedure: "Post-Operative Care",
    patientName: "Michael Smith",
    procedureAhead: 3,
  },
  {
    processID: "5",
    processName: "Hysterectomy",
    description: "Surgical removal of the uterus",
    myProcedure: {
      procedureName: "Pelvic MRI",
      location: "Room 220D",
      timeStart: "2024-04-09T14:00:00",
      timeEnd: "2024-04-09T15:30:00",
    },
    currentProcedure: "Rehabilitation",
    patientName: "Emily Brown",
    procedureAhead: 4,
  },
  {
    processID: "6",
    processName: "Lumbar Microdiscectomy",
    description:
      "Surgical removal of herniated disc material pressing on a nerve root in the lumbar spine",
    myProcedure: {
      procedureName: "MRI Scan",
      location: "Room 410E",
      timeStart: "2024-04-10T10:30:00",
      timeEnd: "2024-04-10T11:30:00",
    },
    currentProcedure: "Follow-Up Appointment",
    patientName: "David Wilson",
    procedureAhead: 5,
  },
];

export default assignedProcesses;
