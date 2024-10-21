import { connectToDatabase } from "../db";
import sql from "mssql";

export const getAllCustomers = async () => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request().query("SELECT * FROM Customers");
    return result.recordset;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

export const getCustomerById = async (id) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Customers WHERE id = @id");
    return result.recordset[0];
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw error;
  }
};

const createCustomer = async (customer) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("name", sql.VarChar, customer.name)
      .input("email", sql.VarChar, customer.email)
      .input("phone", sql.VarChar, customer.phone)
      .input("address", sql.VarChar, customer.address)
      .query(`INSERT INTO Customers (name, email, phone, address)
                VALUES (@name, @email, @phone, @address);
                SELECT SCOPE_IDENTITY() AS id;`);

    return result.recordset[0];
  } catch (error) {
    console.log("Error creating customer:", error);
    throw error;
  }
};

export const updateCustomer = async (id, customerData) => {
  try {
    const pool = await connectToDatabase();
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("name", sql.NVarChar, customerData.name)
      .input("email", sql.NVarChar, customerData.email)
      .input("phone", sql.NVarChar, customerData.phone)
      .input("address", sql.NVarChar, customerData.address)
      .query(`UPDATE Customers SET 
                    name = @name, 
                    email = @email, 
                    phone = @phone, 
                    address = @address 
                  WHERE id = @id;`);
    return { id, ...customerData };
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    const pool = await connectToDatabase();
    await pool
      .request()
      .input("id", sql.Int, id) // ID del cliente a eliminar
      .query(`DELETE FROM Customers WHERE id = @id;`);
    return { message: "Cliente eliminado con éxito." };
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};

export { createCustomer };
