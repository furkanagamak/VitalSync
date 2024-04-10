const boardProcess = {
  processId: "001",
  processName: "Radical Prostatectomy",
  patientName: "May Mary",
  proceduresLeft: [
    {
      procedureName: "Pelvic Ultrasound",
      timeStart: "2024-04-05T18:30:00",
      location: "Room 170A",
      specialInstructions: "None",
      description:
        "A pelvic ultrasound is a non-invasive imaging procedure that uses sound waves to create images of the structures within the pelvis, aiding in the diagnosis of conditions affecting the reproductive organs, bladder, and surrounding tissues.",
      peopleAssigned: ["001", "002"],
      peopleCompleted: [],
    },
    {
      procedureName: "Anesthesia",
      timeStart: "2024-04-05T20:00:00",
      location: "Room 350C",
      specialInstructions: "None",
      description:
        "The patient is placed under general anesthesia to ensure they are unconscious and pain-free during the procedure.",
      peopleAssigned: ["003"],
      peopleCompleted: [],
    },
    {
      procedureName: "Anesthesia",
      timeStart: "2024-04-05T21:00:00",
      location: "Room 350C",
      specialInstructions: "None",
      description:
        "The patient is placed under general anesthesia to ensure they are unconscious and pain-free during the procedure.",
      peopleAssigned: ["003"],
      peopleCompleted: [],
    },
    {
      procedureName: "Orthopedic Surgery",
      timeStart: "2024-04-05T22:30:00",
      location: "Operating Room 2",
      specialInstructions:
        "Check for any allergies before administering anesthesia.",
      description:
        "Surgical procedure to repair a broken bone or damaged joint.",
      peopleAssigned: ["005", "007"],
      peopleCompleted: [],
    },
  ],
};

export default boardProcess;
