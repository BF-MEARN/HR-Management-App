import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import db from "../config/connection.js";

import Employee from "../models/Employee.js";
import FacilityReport from "../models/FacilityReport.js";
import Housing from "../models/Housing.js";
import RegistrationToken from "../models/RegistrationToken.js";
import User from "../models/User.js";
import VisaStatus from "../models/VisaStatus.js";

const SALT_ROUNDS = 10;
const amountHousing = 5;
const amountUserEmployee = 20;
const amountFacilityReports = 15;
const amountRegTokens = 10;

const seedDatabase = async () => {
  console.log("Connecting to database...");
  await new Promise((res, rej) => {
    if (db.readyState === 1) {
      console.log("Already connected.");
      res();
      return;
    }
    db.once("open", () => {
      console.log("Database connected.");
      res();
    });
    db.on("error", (err) => {
      console.error("Database connection error:", err);
      rej(err);
    });
  });
  console.log("Starting seeding process...");

  try {
    // --- 1. Clear Existing Data ---
    console.log(`Clearing data...`);
    await Employee.deleteMany({});
    await FacilityReport.deleteMany({});
    await Housing.deleteMany({});
    await RegistrationToken.deleteMany({});
    await User.deleteMany({});
    await VisaStatus.deleteMany({});
    console.log(`Data cleared.`);

    // --- 2. Seed Housing ---
    console.log(`Seeding: Housing`);
    const housingData = [];
    for (let i = 0; i < amountHousing; i++) {
      housingData.push({
        address: {
          street: faker.location.streetAddress(false),
          city: faker.location.city(),
          state: faker.location.state({ abbreviated: true }),
          zip: faker.location.zipCode("#####"),
        },
        landlord: {
          fullName: faker.person.fullName(),
          phone: faker.phone.number(),
          email: faker.internet.email(),
        },
        facility: {
          beds: faker.number.int({ min: 2, max: 6 }),
          mattresses: faker.number.int({ min: 2, max: 6 }),
          tables: faker.number.int({ min: 1, max: 3 }),
          chairs: faker.number.int({ min: 2, max: 8 }),
        },
        residents: [],
      });
    }
    const createdHousing = await Housing.insertMany(housingData);
    console.log(`${createdHousing.length} Housing documents created.`);
    if (createdHousing.length === 0) {
      throw new Error("Failed to create housing, cannot proceed.");
    }

    // --- 3. Seed Employees, Users, and Visa Status (Interlinked) ---
    console.log("Seeding Employees, Users, and Visa Status...");
    const createdEmployees = [];
    const createdUsers = [];
    const createdVisaStatuses = [];
    const employeeUpdates = [];
    const housingResidentMap = {};
    createdHousing.forEach((h) => (housingResidentMap[h._id.toString()] = []));

    const hrPassword = await bcrypt.hashSync("password", SALT_ROUNDS);
    const hrUser = new User({
      username: "hradmin",
      password: hrPassword,
      email: "hr@example.com",
      role: "hr",
      isOnboardingComplete: true,
      employeeId: null,
      isActive: true,
    });
    await hrUser.save();
    createdUsers.push(hrUser);
    console.log("HR User created.");

    for (let i = 0; i < amountUserEmployee; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet
        .email({ firstName, lastName, allowSpecialCharacters: false })
        .toLowerCase();
      const username = faker.internet
        .username({ firstName, lastName })
        .toLowerCase();
      const password = await bcrypt.hashSync("password", SALT_ROUNDS);
      const isCitizenOrPR = faker.datatype.boolean(0.3);
      const assignedHouse = faker.helpers.arrayElement(createdHousing);

      const newEmployee = new Employee({
        firstName,
        lastName,
        middleName: faker.datatype.boolean(0.5)
          ? faker.person.middleName()
          : undefined,
        preferredName: faker.datatype.boolean(0.3)
          ? faker.person.firstName()
          : undefined,
        profilePicture: faker.image.avatar(),
        ssn: `${faker.number.int({ min: 100, max: 999 })}-${faker.number.int({
          min: 10,
          max: 99,
        })}-${faker.number.int({ min: 1000, max: 9999 })}`,
        dob: faker.date.birthdate({ min: 18, max: 60, mode: "age" }),
        gender: faker.helpers.arrayElement([
          "male",
          "female",
          "prefer_not_to_say",
        ]),
        isCitizenOrPR,
        driverLicense: faker.datatype.boolean(0.7)
          ? {
            number: faker.string.alphanumeric(10).toUpperCase(),
            expirationDate: faker.date.future({ years: 5 }),
            file: faker.system.filePath(),
          }
          : undefined,
        reference: faker.datatype.boolean(0.4)
          ? {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            phone: faker.phone.number(),
            email: faker.internet.email(),
            relationship: faker.helpers.arrayElement([
              "Former Manager",
              "Professor",
              "Colleague",
            ]),
          }
          : undefined,
        emergencyContacts: [
          {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            phone: faker.phone.number(),
            email: faker.internet.email(),
            relationship: faker.helpers.arrayElement([
              "Parent",
              "Sibling",
              "Friend",
              "Spouse",
            ]),
          },
          // Optionally add a second emergency contact
          ...(faker.datatype.boolean(0.3)
            ? [
              {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                phone: faker.phone.number(),
                email: faker.internet.email(),
                relationship: faker.helpers.arrayElement([
                  "Parent",
                  "Sibling",
                  "Friend",
                  "Spouse",
                ]),
              },
            ]
            : []),
        ],
        contactInfo: {
          cellPhone: faker.phone.number(),
          workPhone: faker.datatype.boolean(0.2)
            ? faker.phone.number()
            : undefined,
        },
        address: {
          building: faker.helpers.arrayElement([
            `Apt ${faker.number.int({ min: 1, max: 50 })}`,
            `Unit ${faker.number.int({ min: 100, max: 999 })}`,
            "",
          ]),
          street: faker.location.streetAddress(false),
          city: faker.location.city(),
          state: faker.location.state({ abbreviated: true }),
          zip: faker.location.zipCode("#####"),
        },
        carInfo: faker.datatype.boolean(0.6)
          ? {
            make: faker.vehicle.manufacturer(),
            model: faker.vehicle.model(),
            color: faker.vehicle.color(),
          }
          : undefined,
        onboardingStatus: "Not Started",
      });

      const newUser = new User({
        employeeId: newEmployee._id,
        username,
        password,
        email,
        role: "employee",

        isActive: true,
        isOnboardingComplete: false,
      });

      let newVisaStatus = null;
      if (!isCitizenOrPR) {
        const workAuthType = faker.helpers.arrayElement([
          "H1-B",
          "L2",
          "F1",
          "H4",
          "Other",
        ]);
        const isOpt = workAuthType === "F1";
        newVisaStatus = new VisaStatus({
          employeeId: newEmployee._id,
          workAuthorization: {
            type: workAuthType,
            startDate: faker.date.past({ years: 1 }),
            endDate: faker.date.future({ years: 3 }),
            otherTitle:
              workAuthType === "Other" ? faker.lorem.words(2) : undefined,
          },
          optReceipt: { status: isOpt ? "Not Uploaded" : undefined },
          optEAD: { status: isOpt ? "Not Uploaded" : undefined },
          i983: { status: isOpt ? "Not Uploaded" : undefined },
          i20: { status: isOpt ? "Not Uploaded" : undefined },
        });
        createdVisaStatuses.push(newVisaStatus);
      }

      const updateData = {
        userId: newUser._id,
        houseId: assignedHouse._id,
      };
      if (newVisaStatus) {
        updateData.visaInfo = newVisaStatus._id;
      }

      employeeUpdates.push({
        updateOne: {
          filter: { _id: newEmployee._id },
          update: { $set: updateData },
        },
      });

      housingResidentMap[assignedHouse._id.toString()].push(newEmployee._id);

      createdEmployees.push(newEmployee);
      createdUsers.push(newUser);
    }

    console.log("Saving Users...");
    await User.insertMany(createdUsers.filter((u) => u.role !== "hr"));

    console.log("Saving Visa Statuses...");
    if (createdVisaStatuses.length > 0) {
      await VisaStatus.insertMany(createdVisaStatuses);
    } else {
      console.log("No Visa Statuses to save.");
    }

    console.log("Saving Employees (initial) and applying updates (linking)...");

    await Employee.insertMany(createdEmployees);
    if (employeeUpdates.length > 0) {
      await Employee.bulkWrite(employeeUpdates);
      console.log(`${employeeUpdates.length} Employees updated with links.`);
    } else {
      console.log("No Employee links to update.");
    }

    console.log("Updating Housing with residents...");
    const housingUpdates = Object.entries(housingResidentMap)
      .filter(([, residents]) => residents.length > 0)
      .map(([houseId, residents]) => ({
        updateOne: {
          filter: { _id: new mongoose.Types.ObjectId(houseId) },
          update: { $set: { residents: residents } },
        },
      }));

    if (housingUpdates.length > 0) {
      await Housing.bulkWrite(housingUpdates);
      console.log(
        `${housingUpdates.length} Housing documents updated with residents.`
      );
    } else {
      console.log("No Housing resident lists to update.");
    }

    console.log(
      `${createdEmployees.length} Employees, ${createdUsers.length - 1
      } Employee Users, and ${createdVisaStatuses.length
      } Visa Statuses processed.`
    );

    // --- 5. Seed Facility Reports ---
    console.log(`Seeding: Facility Reports`);
    const facilityReportData = [];

    const employeesWithHousing = await Employee.find({
      houseId: { $ne: null },
      userId: { $ne: null },
    }).populate("userId");
    const allUsers = await User.find({});

    if (employeesWithHousing.length > 0 && allUsers.length > 0) {
      for (let i = 0; i < amountFacilityReports; i++) {
        const reportingEmployee =
          faker.helpers.arrayElement(employeesWithHousing);
        const createdByUser = faker.helpers.arrayElement(allUsers);

        facilityReportData.push({
          employeeId: reportingEmployee._id,
          houseId: reportingEmployee.houseId,
          title: faker.lorem.sentence(5),
          description: faker.lorem.paragraph(3),
          status: faker.helpers.arrayElement(["Open", "In Progress", "Closed"]),
          comments: [
            {
              createdBy: reportingEmployee.userId,
              description: faker.lorem.sentence(10),
              timestamp: faker.date.recent({ days: 10 }),
            },
            ...(faker.datatype.boolean(0.5)
              ? [
                {
                  createdBy: createdByUser._id,
                  description: faker.lorem.sentence(8),
                  timestamp: faker.date.recent({ days: 5 }),
                },
              ]
              : []),
          ],
        });
      }
      await FacilityReport.insertMany(facilityReportData);
      console.log(`${facilityReportData.length} Facility Reports created.`);
    } else {
      console.log(
        "Skipping Facility Reports: Not enough employees with housing or users found."
      );
    }

    // --- 6. Seed Registration Tokens ---
    console.log(`Seeding: Registration Tokens`);
    const registrationTokenData = [];
    for (let i = 0; i < amountRegTokens; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      registrationTokenData.push({
        name: `${firstName} ${lastName}`,
        email: faker.internet
          .email({ firstName, lastName, allowSpecialCharacters: false })
          .toLowerCase(),
        token: faker.string.uuid(),
        used: faker.datatype.boolean(0.4),
      });
    }
    await RegistrationToken.insertMany(registrationTokenData);
    console.log(`${registrationTokenData.length} Registration Tokens created.`);

    // --- Seeding Complete ---
    console.log("Seeding process completed successfully.");
  } catch (error) {
    console.error("Seeding failed:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    } else {
      console.error("An unknown error occurred during seeding.");
    }
  } finally {
    // --- 7. Close Connection ---
    console.log("Closing database connection...");
    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  }
};

seedDatabase();
