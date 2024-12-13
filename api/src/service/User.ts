import { QueryTypes, Sequelize } from "sequelize";
import { database, db, host, password, user } from "../config/db";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { secretKey } from "../config/db";
import { UUID } from "crypto";
import { APPOINTMENTDATA, USERDATA } from "../controller/User";
import { differenceInYears } from "date-fns";

export const executeQuery = async (
  database: Sequelize,
  query: string,
  method: QueryTypes,
  replacements?: Record<string, any>
) => {
  try {
    let result = await database.query(query, {
      type: method,
      replacements,
    });
    console.log(`Client Database query executed: ${query}`);
    return result;
  } catch (err) {
    console.log("Query execution failed on ClientDB:", err);
    throw err;
  }
};

export const fetchResult = async (
  db: string,
  query: string,
  method: QueryTypes,
  replacements?: Record<string, any>
): Promise<any[]> => {
  const createDbConnection = new Sequelize({
    username: user,
    password: password,
    database: db,
    host: host,
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

  const result = await executeQuery(
    createDbConnection,
    query,
    method,
    replacements
  );
  await createDbConnection.close();
  return result;
};

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export const getDoctors = async (db: any) => {
  try {
    const query = `SELECT * FROM doctors_table`;

    const result = await fetchResult(db, query, QueryTypes.SELECT);

    if (!result || result.length === 0) {
      console.warn("No doctors found in the database.");
    }

    return result;
  } catch (error: any) {
    console.error("Error fetching doctors from database:", error.message);

    // Throwing a more detailed error
    throw new Error(`Failed to fetch doctors: ${error.message || error}`);
  }
};

export const getSpecialist = async (db: string, speciality: string) => {
  try {
    const query = `SELECT * FROM doctors_table WHERE speciality = :speciality`;

    const result = await fetchResult(db, query, QueryTypes.SELECT, {
      speciality,
    });

    if (!result || result.length === 0) {
      console.log(`No doctors found for speciality: ${speciality}`);
      return [];
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Error fetching specialists for ${speciality}:`,
        error.message
      );
      throw new Error(`Database error: ${error.message}`);
    }

    console.error("Unexpected error:", error);
    throw new Error("An unexpected error occurred while fetching specialists.");
  }
};

export const singleDoc = async (db: string, id: string) => {
  try {
    const query = `SELECT * FROM doctors_table WHERE id=:id`;
    const result = await fetchResult(db, query, QueryTypes.SELECT, {
      id,
    });
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching doctor details:", error.message);
      throw new Error(error.message);
    } else {
      console.error("Unknown error:", error);
      throw new Error("An unknown error occurred");
    }
  }
};

export const getuser = async (db: string, id: string) => {
  try {
    const query = `SELECT * FROM users_table WHERE id=:id`;
    const result = await fetchResult(db, query, QueryTypes.SELECT, {
      id,
    });
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching user:", error.message);
      throw new Error(error.message);
    } else {
      console.error("Unknown error occurred:", error);
      throw new Error("An unknown error occurred while fetching user data.");
    }
  }
};

export const registerUser = async (
  userName: string,
  email: string,
  password: string,
  imageUrl: string,
  db: string
) => {
  try {
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const selectUserQuery = `SELECT * FROM users_table WHERE email = :email`;
    const dbUser = await fetchResult(db, selectUserQuery, QueryTypes.SELECT, {
      email,
    });

    if (dbUser && dbUser.length > 0) {
      throw new Error("User already exists");
    } else {
      const createUserQuery = `
        INSERT INTO users_table (id, name, email, password,image_url) 
        VALUES (:userId, :userName, :email, :hashedPassword,:imageUrl)
      `;
      await fetchResult(db, createUserQuery, QueryTypes.INSERT, {
        userId,
        userName,
        email,
        hashedPassword,
        imageUrl,
      });
      const token = jwt.sign({ id: userId, email: email }, secretKey, {
        expiresIn: "1d",
      });
      return {
        id: userId,
        userName,
        email,
        token,
        message: `Welcome ${userName}`,
      };
    }
  } catch (error) {
    console.error("Error during user registration:", error);
    throw error;
  }
};

// Login a user
export const loginUser = async (
  email: string,
  password: string,
  db: string
) => {
  try {
    const selectUserQuery = `SELECT * FROM users_table WHERE email = :email`;
    const dbUser = (await fetchResult(db, selectUserQuery, QueryTypes.SELECT, {
      email,
    })) as User[];

    if (!dbUser || dbUser.length === 0) {
      throw new Error("User not found");
    }

    const user = dbUser[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, {
      expiresIn: "1d",
    });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token,
      message: "Login successful",
    };
  } catch (error) {
    console.error("Error during user login:", error);
    throw error;
  }
};

export const userAppointment = async (appointment_details: APPOINTMENTDATA) => {
  const {
    doctorId,
    patientId,
    doctorName,
    image,
    department,
    fees,
    appointmentDate,
    appointmentDay,
    appointmentHour,
    adrLine1,
    adrLine2,
    patientName,
    age,
    imageUrl,
    status,
  } = appointment_details;
  console.log(patientId);

  const getdateAndTimeQuery = `
    SELECT * FROM appoint_table 
    WHERE appointment_date = :appointmentDate 
    AND appointment_hour = :appointmentHour AND doctor_name=:doctorName AND status=:status
  `;

  try {
    const dbUser = (await fetchResult(
      db,
      getdateAndTimeQuery,
      QueryTypes.SELECT,
      { appointmentDate, appointmentHour, doctorName, status }
    )) as APPOINTMENTDATA[];
    const user = dbUser[0];
    if (dbUser.length === 0) {
      const appointmentId = uuidv4();
      const bookAppointmentQuery = `
        INSERT INTO appoint_table 
        (id, doctor_id, doctor_name, doc_img_url, department, fees, appointment_date, appointment_day, appointment_hour,adr_line1,adr_line2,status,patient_name,patient_age,patient_img_url,patient_id) 
        VALUES (:appointmentId, :doctorId, :doctorName, :image, :department, :fees, :appointmentDate, :appointmentDay, :appointmentHour,:adrLine1,:adrLine2,:status,:patientName,:age,:imageUrl,:patientId)
      `;

      await fetchResult(db, bookAppointmentQuery, QueryTypes.INSERT, {
        appointmentId,
        doctorId,
        doctorName,
        image,
        department,
        fees,
        appointmentDate,
        appointmentDay,
        appointmentHour,
        adrLine1,
        adrLine2,
        status,
        patientName,
        age,
        imageUrl,
        patientId,
      });

      return {
        appointmentId,
        message: "Appointment booked successfully.",
      };
    } else if (dbUser.length > 0 && user.status === "Cancelled") {
      const appointmentId = uuidv4();
      const bookAppointmentQuery = `
        INSERT INTO appoint_table 
        (id, doctor_id, doctor_name, doc_img_url, department, fees, appointment_date, appointment_day, appointment_hour,adr_line1,adr_line2,status,patient_name,patient_age,patient_img_url,patient_id) 
        VALUES (:appointmentId, :doctorId, :doctorName, :image, :department, :fees, :appointmentDate, :appointmentDay, :appointmentHour,:adrLine1,:adrLine2,:status,:patientName,:age,:imageUrl,:patientId)
      `;

      await fetchResult(db, bookAppointmentQuery, QueryTypes.INSERT, {
        appointmentId,
        doctorId,
        doctorName,
        image,
        department,
        fees,
        appointmentDate,
        appointmentDay,
        appointmentHour,
        adrLine1,
        adrLine2,
        status,
        patientName,
        age,
        imageUrl,
        patientId,
      });

      return {
        appointmentId,
        message: "Appointment booked successfully.",
      };
    } else {
      throw new Error("Slot is already taken.");
    }
  } catch (error) {
    const errorMessage =
      (error as Error).message ||
      "An error occurred while booking the appointment.";
    console.error(`Error during booking appointment: ${errorMessage}`);
    throw error; // Re-throw the error after logging it
  }
};

export const getAppointments = async (db: any, id: string) => {
  try {
    const query = `SELECT * FROM appoint_table WHERE patient_id=:id `;

    const result = await fetchResult(db, query, QueryTypes.SELECT, { id });

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching appointments:", error.message);
    } else {
      console.error("Unknown error:", error);
    }

    throw new Error("Unable to fetch appointments from the database");
  }
};

export const cancelAppointment = async (doctorId: string, status: string) => {
  const updateAvailabilityQuery = `
    UPDATE appoint_table 
    SET status = :status 
    WHERE id = :doctorId
  `;

  try {
    const result = await fetchResult(
      db,
      updateAvailabilityQuery,
      QueryTypes.UPDATE,
      {
        doctorId,
        status,
      }
    );
    return result;
  } catch (error) {
    console.error("Error updating doctor availability:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  userData: USERDATA,
  id: string,
  db: string
) => {
  const { name, email, address, phone, dob, imageUrl } = userData;
  console.log("DOB received:", dob);

  let age = null;
  if (dob && !isNaN(new Date(dob).getTime())) {
    const date = new Date();
    const startDate = new Date(dob);
    age = differenceInYears(date, startDate);
  }

  try {
    const query = `UPDATE users_table SET name=:name, email=:email, address=:address, age=:age, image_url=:imageUrl,
    date_of_birth=:dob, phone_num=:phone WHERE id=:id`;

    console.log("Executing query with parameters:", {
      name,
      email,
      address,
      age,
      imageUrl,
      dob,
      phone,
      id,
    });

    const result = await fetchResult(db, query, QueryTypes.UPDATE, {
      name,
      email,
      address,
      age,
      imageUrl,
      dob,
      phone,
      id,
    });

    return result ? "Profile updated successfully" : "No changes made";
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }
};
