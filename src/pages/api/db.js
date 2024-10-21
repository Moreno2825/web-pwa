import sql from "mssql";

const dbConfig = {
  user: "rodrigo", // Cambia esto al usuario adecuado
  password: "Serverroot659.", // Cambia esto por la contraseña adecuada
  server: "black-raven.database.windows.net",
  database: "ROD-PWA",
  port: 1433,
  options: {
    encrypt: true, // Asegúrate de que esté en true cuando te conectes a Azure SQL
    trustServerCertificate: false, // En entornos de producción se recomienda usar false
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
