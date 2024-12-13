import { QueryError, QueryTypes, Sequelize } from "sequelize";
import { database, db, host, password, user } from "../config/db";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { secretKey } from "../config/db";
import { DOCDATA } from "../controller/Admin";

// types/Doctor.ts
export interface DoctorData {
  name: string;
  email: string;
  password: string;
  imageUrl?: string; // Optional
  speciality: string;
  degree: string;
  experience: string;
  about: string; // Optional
  fees: number;
  address1: string;
  address2: string; // Optional
}
interface EARNINGS {
  earnings: number;
}
interface Doctor {
  id: string;
  name: string;
  email: string;
  password: string;
}
interface Admin {
  id: string;
  name: string;
  email: string;
  password_hash: string;
}

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

export const getAdmin = async (db: string) => {
  try {
    const query = `SELECT * FROM doctors_table`;
    const result = await fetchResult(db, query, QueryTypes.SELECT);
    return result;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const singleDoc = async (db: string, id: string) => {
  try {
    const query = `SELECT * FROM doctors_table WHERE id = :id`;
    const result = await fetchResult(db, query, QueryTypes.SELECT, { id });

    if (!result.length) {
      throw new Error(`Doctor with ID ${id} not found`);
    }

    return result[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching doctor data:", error.message);
    } else {
      console.error("Unknown error:", error);
    }

    throw new Error("Error fetching doctor details");
  }
};
export const singleAdmin = async (db: string, id: string) => {
  try {
    const query = `SELECT  role FROM admin_table WHERE id = :id`;
    const result = await fetchResult(db, query, QueryTypes.SELECT, { id });

    if (!result.length) {
      throw new Error(`Admin with ID ${id} not found`);
    }

    return result[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching Admin data:", error.message);
    } else {
      console.error("Unknown error:", error);
    }

    throw new Error("Error fetching Admin details");
  }
};

export const adminSingleDoc = async (db: string, id: string) => {
  try {
    const query = `SELECT * FROM doctors_table WHERE id = :id`;
    const result = await fetchResult(db, query, QueryTypes.SELECT, { id });

    if (!result.length) {
      throw new Error(`Doctor with ID ${id} not found`);
    }

    return result[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching doctor data:", error.message);
    } else {
      console.error("Unknown error:", error);
    }

    throw new Error("Error fetching doctor details");
  }
};
export const createDoctor = async (doctorData: DoctorData) => {
  const {
    name,
    email,
    password,
    imageUrl,
    speciality,
    degree,
    experience,
    about,
    fees,
    address1,
    address2,
  } = doctorData;

  try {
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(doctorData.password, 10);

    const selectUserQuery = `SELECT * FROM doctors_table WHERE email = :email`;
    const dbUser = await fetchResult(db, selectUserQuery, QueryTypes.SELECT, {
      email,
    });

    if (dbUser && dbUser.length > 0) {
      throw new Error("Doctor already exists");
    } else {
      const createUserQuery = `
        INSERT INTO doctors_table (id, name, email, password,doc_image_url,
    speciality,
    degree,
    experience,
    about,
    fees,
    adr_line1,
    adr_line2) 
        VALUES (:userId, :name, :email, :hashedPassword,:imageUrl,
    :speciality,
    :degree,
    :experience,
    :about,
    :fees,
    :address1,
    :address2)
      `;
      const response = await fetchResult(
        db,
        createUserQuery,
        QueryTypes.INSERT,
        {
          userId,
          name,
          email,
          hashedPassword,
          imageUrl,
          speciality,
          degree,
          experience,
          about,
          fees,
          address1,
          address2,
        }
      );
      return "Doctor created successfully";
    }
  } catch (error) {
    console.error("Error during doctor registration:", error);
    throw error;
  }
};

export const updateDoctorAvailability = async (
  doctorId: string,
  available: boolean
) => {
  const updateAvailabilityQuery = `
    UPDATE doctors_table 
    SET availability = :available 
    WHERE id = :doctorId
  `;

  try {
    const result = await fetchResult(
      db,
      updateAvailabilityQuery,
      QueryTypes.UPDATE,
      {
        doctorId,
        available,
      }
    );
    return result;
  } catch (error) {
    console.error("Error updating doctor availability:", error);
    throw error;
  }
};
export const loginDoctor = async (
  email: string,
  password: string,
  db: string
) => {
  try {
    const selectDoctorQuery = `SELECT * FROM doctors_table WHERE email = :email`;
    const dbDoctor = (await fetchResult(
      db,
      selectDoctorQuery,
      QueryTypes.SELECT,
      {
        email,
      }
    )) as Doctor[];

    if (!dbDoctor || dbDoctor.length === 0) {
      throw new Error("Doctor not found");
    }

    const doctor = dbDoctor[0];

    const isPasswordValid = await bcrypt.compare(password, doctor.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ id: doctor.id, email: doctor.email }, secretKey, {
      expiresIn: "1d",
    });

    return {
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      token,
      message: "Login successful",
    };
  } catch (error) {
    console.error("Error during doctor login:", error);
    throw error;
  }
};

export const loginAdmin = async (
  email: string,
  password: string,
  db: string
) => {
  try {
    const selectDoctorQuery = `SELECT * FROM admin_table WHERE email = :email`;
    const dbAdmin = (await fetchResult(
      db,
      selectDoctorQuery,
      QueryTypes.SELECT,
      {
        email,
      }
    )) as Admin[];

    if (!dbAdmin || dbAdmin.length === 0) {
      throw new Error(`Admin with email ${email} does not exists`);
    }

    const admin = dbAdmin[0];

    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, secretKey, {
      expiresIn: "1d",
    });

    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      token,
      message: "Login successful",
    };
  } catch (error) {
    console.error("Error during admin login:", error);
    throw error;
  }
};

export const getNewDoctorAppointmentList = async (db: string, id: string) => {
  try {
    const status = "waiting";
    const query = `SELECT * FROM appoint_table WHERE doctor_id=:id AND status=:status`;
    const result = await fetchResult(db, query, QueryTypes.SELECT, {
      id,
      status,
    });
    return result;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
export const getDoctorAppointmentList = async (db: any, id: string) => {
  try {
    const query = `SELECT * FROM appoint_table WHERE doctor_id=:id `;

    const result = await fetchResult(db, query, QueryTypes.SELECT, { id });

    return result || [];
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching appointments:", {
        message: error.message,
        query: "SELECT * FROM appoint_table",
      });
      throw new Error("Unable to fetch appointments from the database");
    } else {
      console.error("Unexpected Error:", error);
      throw new Error(
        "An unexpected error occurred while fetching appointments"
      );
    }
  }
};
export const getDoctorDetailsAndAppointments = async (
  db: string,
  id: string
) => {
  try {
    const doctorQuery = `SELECT * FROM doctors_table WHERE id = :id`;
    const doctorResult = await fetchResult(db, doctorQuery, QueryTypes.SELECT, {
      id,
    });

    if (!doctorResult.length) {
      throw new Error(`Doctor with ID ${id} not found`);
    }

    const appointmentQuery = `SELECT * FROM appoint_table WHERE doctor_id = :id`;
    const appointmentResult = await fetchResult(
      db,
      appointmentQuery,
      QueryTypes.SELECT,
      { id }
    );

    return {
      doctor: doctorResult[0],
      appointments: appointmentResult || [],
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching data:", error.message);
    } else {
      console.error("Unexpected Error:", error);
    }

    throw new Error("Error fetching doctor details and appointments");
  }
};

export const getAdminAppointmentList = async (db: string) => {
  try {
    // Define the two queries
    const doctorsQuery = `SELECT * from doctors_table`;
    const appointmentsQuery = `SELECT * FROM appoint_table`;

    // Fetch results in parallel using Promise.all
    const [doctorsResult, appointmentsResult] = await Promise.all([
      fetchResult(db, doctorsQuery, QueryTypes.SELECT),
      fetchResult(db, appointmentsQuery, QueryTypes.SELECT),
    ]);

    // Calculate the count of doctors and return both the count and appointments list
    const doctorsCount = doctorsResult.length;

    return {
      doctorsCount,
      appointments: appointmentsResult || [],
    };
  } catch (error: unknown) {
    // Handle errors properly
    if (error instanceof Error) {
      console.error("Error fetching doctors and appointments:", {
        message: error.message,
      });
      throw new Error(
        "Unable to fetch doctors and appointments from the database"
      );
    } else {
      console.error("Unexpected Error:", error);
      throw new Error(
        "An unexpected error occurred while fetching doctors and appointments"
      );
    }
  }
};

export const confirmAppointment = async (
  appointmentId: string,
  status: string,
  patientName: string,
  doctorId: string,
  fees: number
) => {
  try {
    if (status === "Completed") {
      const getDoctorEarnings = `SELECT earnings from doctors_table WHERE id=:doctorId`;
      const doctorRresult = (await fetchResult(
        db,
        getDoctorEarnings,
        QueryTypes.SELECT,
        { doctorId }
      )) as EARNINGS[];

      if (doctorRresult.length > 0) {
        const earnings = doctorRresult[0].earnings;
        const newEarning = earnings + fees;
        const updateEarningsQuery = `UPDATE doctors_table SET earnings=:newEarning WHERE id=:doctorId`;
        const result = await fetchResult(
          db,
          updateEarningsQuery,
          QueryTypes.UPDATE,
          {
            newEarning,
            doctorId,
          }
        );
      }
    }
    const updateAvailabilityQuery = `
      UPDATE appoint_table
      SET status = :status
      WHERE id = :appointmentId
    `;
    const result = await fetchResult(
      db,
      updateAvailabilityQuery,
      QueryTypes.UPDATE,
      {
        status,
        appointmentId,
      }
    );

    console.log("status result", result);
    return result;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};

export const deleteApppointment = async (id: string) => {
  try {
    const deleteQuery = `DELETE  from appoint_table WHERE id=:id`;
    const result = await fetchResult(db, deleteQuery, QueryTypes.DELETE, {
      id,
    });
    return result;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};

export const completeAppointment = async (doctorId: string, status: string) => {
  try {
    const updateAvailabilityQuery = `
    UPDATE appoint_table 
    SET status = :status 
    WHERE id = :doctorId
  `;
    const result = await fetchResult(
      db,
      updateAvailabilityQuery,
      QueryTypes.UPDATE,
      {
        status,
        doctorId,
      }
    );
    return result;
  } catch (error) {
    console.error("Error updatings status:", error);
    throw error;
  }
};

export const updateDoctorEarnings = async (
  db: any,
  id: string,
  earnings: number
) => {
  try {
    const query = `    UPDATE doctors_table 
    SET earnings = :earnings 
    WHERE id = :id `;

    const result = await fetchResult(db, query, QueryTypes.SELECT, {
      earnings,
      id,
    });

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating earnings:", error.message);
    } else {
      console.error("Unknown error:", error);
    }

    throw new Error("Unable to update earnings");
  }
};
export const registerAdmin = async (
  userName: string,
  email: string,
  password: string,
  db: string
) => {
  try {
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const date = new Date();
    const role = "editor";
    console.log(date.toUTCString);
    const selectUserQuery = `SELECT * FROM admin_table WHERE email = :email`;
    const dbUser = await fetchResult(db, selectUserQuery, QueryTypes.SELECT, {
      email,
    });

    if (dbUser && dbUser.length > 0) {
      throw new Error("admin already exists");
    } else {
      const createUserQuery = `
        INSERT INTO admin_table (id, name, email, password_hash,role) 
        VALUES (:userId, :userName, :email, :hashedPassword,:role)
      `;
      await fetchResult(db, createUserQuery, QueryTypes.INSERT, {
        userId,
        userName,
        email,
        hashedPassword,
        role,
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
export const updateDoctorProfile = async (
  DoctorData: DOCDATA,
  id: string,
  db: string,
  available: boolean
) => {
  const { about, adrLine1, imageUrl, adrLine2, fees } = DoctorData;

  try {
    const query = `UPDATE doctors_table SET about=:about, adr_line1=:adrLine1, adr_line2=:adrLine2, fees=:fees, doc_image_url=:imageUrl,
    availability=:available
     WHERE id=:id `;

    const result = await fetchResult(db, query, QueryTypes.UPDATE, {
      about,
      adrLine1,
      adrLine2,
      fees,
      imageUrl,
      available,
      id,
    });

    return Array.isArray(result) && result.length > 0
      ? "Profile updated successfully"
      : "No changes made to the profile";
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }
};
