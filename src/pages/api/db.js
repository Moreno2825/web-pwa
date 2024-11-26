import sql from "mssql";

const dbConfig = {
  user: "sa",
  password: "serverroot659",
  server: "RODRIGOMORENO",
  database: "Prac_PWA",
  port: 1433,
  options: {
    encrypt: true, // Si se usa azure poner true
    trustServerCertificate: true, // En entornos de producción
  },
};

export const connectToDatabase = async () => {
  try {
    const pool = await sql.connect(dbConfig);
    return pool;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};
