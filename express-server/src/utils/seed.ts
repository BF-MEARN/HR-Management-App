import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import db from "../config/connection";

import Employee from "../models/Employee";
import FacilityReport from "../models/FacilityReport";
import Housing from "../models/Housing";
import RegistrationToken from "../models/RegistrationToken";
import User from "../models/User";
import VisaStatus from "../models/VisaStatus";

const SALT_ROUNDS: number = 10;
const amountHousing: number = 5;
const amountUserEmployee: number = 10;

const seedDatabase = async () => {
  console.log("Connecting to database...");
  await new Promise<void>((res) => {
    if (db.readyState === 1) {
      res();
    } else {
      db.once("open", res);
    }
  });
  console.log("Database connected. Starting seeding process...");

  try {
    // Clear data
    console.log(`Clearing data...`);
    await Employee.deleteMany({});
    await FacilityReport.deleteMany({});
    await Housing.deleteMany({});
    await RegistrationToken.deleteMany({});
    await User.deleteMany({});
    await VisaStatus.deleteMany({});
    console.log(`Data cleared`);

    // Housing
    console.log(`Seeding: Housing`);
    const housingData = [];

    for (let i = 0; i < amountHousing; i++) {
      housingData.push({
        address: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state({ abbreviated: true }),
          zip: faker.location.zipCode(),
        },
        landlord: {
          fullName: faker.person.fullName(),
          phone: faker.phone.number(),
          email: faker.internet.email(),
        },
        facility: {
          beds: faker.number.int({ min: 4, max: 10 }),
          mattresses: faker.number.int({ min: 4, max: 10 }),
          tables: faker.number.int({ min: 1, max: 5 }),
          chairs: faker.number.int({ min: 4, max: 10 }),
        },
        residents: [],
      });
    }

    const createdHousing = await Housing.insertMany(housingData);
    console.log(`${createdHousing.length} Housing documents created.`);

    // Seeding Employees and Users
    console.log("Seeding Employees and Users...");
    const createdEmployees = [];
    const createdUsers = [];
    const employeeUpdates = [];
    const housingUpdates = [];

    for (let i = 0; i < amountUserEmployee; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email();

      const newEmployee = new Employee({
        firstName,
        lastName,
        ssn: `${faker.number.int({ min: 100, max: 999 })}-${faker.number.int({
          min: 10,
          max: 99,
        })}-${faker.number.int({ min: 1000, max: 9999 })}`,
        dob: faker.date.birthdate(),
        gender: faker.person.sex(),
        isCitizenOrPR: faker.datatype.boolean(0.3),
        contactInfo: {
          cellPhone: faker.phone.number(),
        },
        emergencyContacts: [{
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          phone: faker.phone.number(),
          email: faker.internet.email(),
          relationship: faker.helpers.arrayElement(["Parent", "Sibling", "Friend", "Spouse"])
        }],
        address: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state({ abbreviated: true }),
          zip: faker.location.zipCode(),
        },
      });
      await newEmployee.save();
      createdEmployees.push(newEmployee);
    }

    console.log(
      `${createdEmployees.length} Employees and ${createdUsers.length} Users created.`
    );

    console.log("Closing database connection...");
    await mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (error: unknown) {
    if (error) {
      console.error(error);
    }
  }
};

seedDatabase();
