const axios = require('axios');
const logger = require('../utils/logger');
const { UniversitySaaSClient, StudentService } = require('saas-sdk');

// const MY_SAAS_CONFIG = {
//   BASE_URL: 'http://localhost:5001/api/v1/students',
//   API_KEY: process.env.APIKEY,
//   syncEnabled: true,  
// };

// // Helper function for syncing individual students


// const syncStudentToSaaS = async (student) => {
//   const payload = {
//     fullName: student.fullName,
//     sessionOfEntry: student.admissionSession,
//     expectedSessionOfCompletion: student.expectedSessionOfCompletion,
//     sessionOfCompletion: student.sessionOfCompletion || '',
//     transcript: student.grades?.map(g => ({
//       courseCode: g.courseCode,
//       grade: g.grade,
//       semester: g.semester,
//       session: g.session
//     })) || []
//   };
  
//   const headers = {
//     'X-API-KEY': MY_SAAS_CONFIG.API_KEY,
//     'Content-Type': 'application/json'
//   };  

//   try {
//     await axios.post(`${MY_SAAS_CONFIG.BASE_URL}/create-and-update?matricNo=${student.matricNo}`, payload, { headers });
//   } catch (error) {
//     if (error.response) {
//       logger.error('Error uploading student data to SaaS:', error.response.data.message);
//       throw new Error(`SaaS sync failed (${error.response.status}): ${error.response.data.message}`);
//     } else if (error.request) {
//       logger.error('No response from SaaS:', error.request.data.message);
//       throw new Error('No response from SaaS');
//     } else {
//       logger.error('Error setting up request to SaaS:', error.message);
//       throw new Error(`Request setup error: ${error.message}`);
//     }
//   }
// };

// const studentBatchSyncToSaaS = async (data) => {
//   const results = await Promise.allSettled(
//     data.map(async (student) => {        
//       await syncStudentToSaaS(student);
//     })
//   );
//   return {
//     message: `Processed ${data.length} students`,
//     results: results.map((result, index) => ({
//       id: data[index].matricNo,
//       status: result.status === 'fulfilled' ? 'success' : 'failed',
//       error: result.status === 'rejected' ? result.reason : undefined,
//     })),
//   };
// }


const client = new UniversitySaaSClient(process.env.APIKEY);
const studentService = new StudentService(client, { 
  syncEnabled: true,
  batchSize: 100
});


exports.createAndUpdate = async (req, res) => {
  try {
    const studentData = req.body;
    // const savedStudent = await theUniversitiesDatabase.save(studentData);
    const result = await studentService.sync(studentData); 
    return res.status(200).json({result});
  } catch (error) {
    logger.error('Student operation failed', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Main controller
// exports.createAndUpdate = async (req, res) => {
//     try {
//       logger.info(`my installed saas: ${UniversitySaaSClient}`);
//       // 1. Save to their own database first
//       const studentData = req.body;
//     //   const savedStudent = await theUniversitiesDatabase.save(studentData);
    
    
//       // 2. Sync to SaaS if enabled (fire-and-forget)
//       if (MY_SAAS_CONFIG.SYNC_ENABLED) {
//         try {            
//             await syncStudentToSaaS(studentData);        
//         } catch (error) {
//             return res.status(201).json({error: error.message});
//         }
//       }

//       // 3. Respond immediately
//       return res.status(201).json({message: 'successfully synced to saas', studentData});
//     } catch (error) {
//       logger.error('Student operation failed', error);
//       res.status(500).json({ 
//         error: 'Internal server error',
//         details: process.env.NODE_ENV === 'development' ? error.message : undefined
//       });
//     }
// };

  
// exports.batchSyncStudents = async (req, res) => {
//   try {
//     //const students = await theUniversitiesDatabase.find();
//     const results = await studentBatchSyncToSaaS(students);    
//     res.status(200).json(results);
//   } catch (error) {
//     res.status(500).json({ error: "Batch sync failed", details: error.message });
//   }
// };

exports.batchSyncStudents = async (req, res) => {
  try {
    //const students = await theUniversitiesDatabase.find();
    const results = await studentService.batchSync(students);    
    res.status(200).json({results});
  } catch (error) {
    res.status(500).json({ error: "Batch sync failed", details: error.message });
  }
};



//static test data
const students = [
  { 
    matricNo: "E032834",
    fullName: "Ayoke Dayo Tunde",
    admissionSession: "2021/2022",
    expectedSessionOfCompletion: "2025/2026",
  },
  { 
    matricNo: "E049183",
    fullName: "Omosile Ayo Jeremiah",
    admissionSession: "2021/2022",
    expectedSessionOfCompletion: "2025/2026",
    transcript: [
      {
      courseCode: "SOW101",
      grade: "86",
      semester: "1st",
      session: "2009/2010"
      },
      {
      courseCode: "ECO111",
      grade: "61",
      semester: "2st",
      session: "2008/2009"
      }
    ]
  },
  { 
    matricNo: "E0454111",
    fullName: "Shonaike Imade Naomi",
    admissionSession: "2021/2022",
    expectedSessionOfCompletion: "2025/2026",
  },
  { 
    matricNo: "E049110",
    fullName: "Testing To Fail",
    admissionSession: "2021/2022",
    expectedSessionOfCompletion: "2025/2026",
  },
  { 
    matricNo: "E051234",
    fullName: "Adebola Johnson Michael",
    admissionSession: "2021/2022",
    expectedSessionOfCompletion: "2025/2026",
    transcript: [
      {
      courseCode: "SOC101",
      grade: "57",
      semester: "1st",
      session: "2009/2010"
      },
      {
      courseCode: "ECO321",
      grade: "61",
      semester: "2st",
      session: "2008/2009"
      }
    ]
  },
  { 
    matricNo: "E052345",
    fullName: "Bakare Fatima Ahmed",
    admissionSession: "2021/2022",
    expectedSessionOfCompletion: "2025/2026",
  },
  { 
    matricNo: "E053456",
    fullName: "Chukwu Emmanuel Ngozi",
    admissionSession: "2021/2022",
    expectedSessionOfCompletion: "2025/2026",
  },
  { 
    matricNo: "E054567",
    fullName: "Daramola Oluwaseun Grace",
    admissionSession: "2021/2022",
    expectedSessionOfCompletion: "2025/2026",
  },
  { 
    matricNo: "E055678",
    fullName: "Eze Chinwe Victoria",
    admissionSession: "2021/2022",
    expectedSessionOfCompletion: "2025/2026",
  },
  { 
    matricNo: "E056789",
    fullName: "Falade Ibrahim Oluwatosin",
    admissionSession: "2021/2022",
    expectedSessionOfCompletion: "2025/2026",
  },
  { 
    matricNo: "E057890",
    fullName: "Gbenga Adekunle Olumide",
    admissionSession: "2021/2022",
    expectedSessionOfCompletion: "2025/2026",
  },
  { 
    matricNo: "E058901",
    fullName: "Hassan Aminat Oyindamola",
    admissionSession: "2021/2022",
    expectedSessionOfCompletion: "2025/2026",
  },
  { 
    matricNo: "E059012",
    fullName: "Ibeh Chidubem Joy",
    admissionSession: "2021/2022",
    expectedSessionOfCompletion: "2025/2026",
  },
  { 
    matricNo: "E060123",
    fullName: "Jolaoso Olumide Samuel",
    admissionSession: "2021/2022",
    expectedSessionOfCompletion: "2025/2026",
  },
  { 
    matricNo: "E061234",
    fullName: "Kalu Nneka Peace",
    admissionSession: "2021/2022",
    expectedSessionOfCompletion: "2025/2026",
  }
];