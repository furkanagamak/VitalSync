//Testing data from Build 2

const processDetails = {
  processId: "001",
  processName: "Radical Prostatectomy",
  patientName: "May Mary",
  currentProcedure: "Pelvic Ultrasound",
  completedProcedures: 1,
  totalProcedures: 5,
  sections: [
    {
      sectionName: "preoperative",
      description: "preoperative actions",
      isCompleted: false,
      procedures: [
        {
          procedureName: "Preoperative Theorapy",
          specialInstructions: "None",
          description:
            "A nurse should talk to the patient to assess their mental state",
          timeStart: "2024-04-04T14:30:00",
          timeEnd: "2024-04-04T16:30:00",
          resources: {
            personnel: ["Jhon Abraham"],
            equipments: [],
            spaces: ["Room 006B", "Patient Bed"],
          },
          peopleAssigned: ["003"],
          peopleCompleted: ["003"],
        },
        {
          procedureName: "Pelvic Ultrasound",
          specialInstructions: "None",
          description:
            "A pelvic ultrasound is a non-invasive imaging procedure that uses sound waves to create images of the structures within the pelvis, aiding in the diagnosis of conditions affecting the reproductive organs, bladder, and surrounding tissues.",
          timeStart: "2024-04-05T14:30:00",
          timeEnd: "2024-04-05T16:30:00",
          resources: {
            personnel: ["John Smith", "Mary Jane"],
            equipments: ["Ultrasound Machine", "Transducer"],
            spaces: ["Room 170A", "Patient Bed"],
          },
          peopleAssigned: ["005", "006"],
          peopleCompleted: [],
        },
      ],
    },
    {
      sectionName: "intraoperative",
      description: "intraoperative actions",
      isCompleted: false,
      procedures: [
        {
          procedureName: "Anesthesia Shot ",
          specialInstructions: "None",
          description:
            "An anesthesia shot should be given to the patient before surgery",
          timeStart: "2024-04-05T14:30:00",
          timeEnd: "2024-04-05T14:45:00",
          resources: {
            personnel: ["Jaden June"],
            equipments: ["Anesthesia Syringe"],
            spaces: ["Room 305D", "Surgery Bed"],
          },
          peopleAssigned: ["007"],
          peopleCompleted: [],
        },
        {
          procedureName: "Prostate Removal",
          specialInstructions: "None",
          description: " Surgery to remove the prostate from the patient",
          timeStart: "2024-04-05T15:00:00",
          timeEnd: "2024-04-05T16:00:00",
          resources: {
            personnel: [
              "Jhon Abraham",
              "Mary Jane",
              "John Smith",
              "Judith July",
            ],
            equipments: [
              "Scalpel",
              "Retractor",
              "Forceps",
              "Scissors",
              "Surgical Microscope",
            ],
            spaces: ["Room 305D", "Surgery Bed"],
          },
          peopleAssigned: ["005", "006", "007", "008"],
          peopleCompleted: [],
        },
      ],
    },
    {
      sectionName: "postoperative",
      description: "postoperative actions",
      isCompleted: false,
      procedures: [
        {
          procedureName: "Post Operation Follow-up",
          specialInstructions: "None",
          description:
            "Information is given to the patient and the patient's family on what they should do and should not do for a speedy recovery.",
          timeStart: "2024-04-05T17:00:00",
          timeEnd: "2024-04-05T17:30:00",
          resources: {
            personnel: ["Jhon Abraham"],
            equipments: [],
            spaces: ["Room 006B", "Patient Bed"],
          },
          peopleAssigned: ["007"],
          peopleCompleted: [],
        },
      ],
    },
  ],
};

export default processDetails;
