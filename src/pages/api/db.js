import sql from "mssql";

const dbConfig = {
  user: "db_aafce3_rodrigomoreno_admin",
  password: "server123",
  server: "SQL9001.site4now.net",
  database: "db_aafce3_rodrigomoreno",
  port: 1433,
  options: {
    encrypt: true, // Si se usa azure poner true
    trustServerCertificate: false, // En entornos de producción
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
