/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {'director' | 'trainer'} role
 * @property {string} [position]
 * @property {string} [phone]
 * @property {string} [address]
 * @property {string} [department]
 * @property {string} [joinDate]
 * @property {string} [photo]
 * @property {boolean} active
 */

/**
 * @typedef {Object} Marks
 * @property {number} railwayOrganization
 * @property {number} mechanicalDepartmentRole
 * @property {number} rollingStockCarriage
 * @property {number} rollingStockWagon
 * @property {number} rollingStockDiesel
 * @property {number} industrialSafety
 * @property {number} coachProduction
 * @property {number} rwf
 * @property {number} demuSpart
 * @property {number} dieselProduction
 * @property {number} rdso
 */

/**
 * @typedef {Object} Trainee
 * @property {string} id
 * @property {string} ticketNumber
 * @property {string} [photo]
 * @property {string} serialNo
 * @property {string} fullName
 * @property {string} fatherName
 * @property {string} motherName
 * @property {string} dateOfBirth
 * @property {string} dateOfAppointment
 * @property {string} dateOfSparing
 * @property {string} category
 * @property {string} bloodGroup
 * @property {string} maritalStatus
 * @property {string} employeeName
 * @property {string} pfNumber
 * @property {string} nationality
 * @property {string} modeOfAppointment
 * @property {string} batch
 * @property {string} designation
 * @property {string} moduleNumber
 * @property {string} courseDuration
 * @property {string} stream
 * @property {string} unit
 * @property {string} workingUnder
 * @property {string} stationCode
 * @property {string} phoneNumber
 * @property {string} email
 * @property {string} address
 * @property {string} educationalQualification
 * @property {string} trainerId
 * @property {string} createdAt
 * @property {Marks} [marks]
 * @property {string} [grade]
 * @property {number} [totalMarks]
 */

/**
 * @typedef {Object} Analytics
 * @property {number} totalTrainees
 * @property {number} activeTrainers
 * @property {{ name: string, value: number }[]} courseDistribution
 * @property {{ month: string, enrollments: number }[]} monthlyEnrollment
 * @property {{ module: string, count: number }[]} moduleEnrollment
