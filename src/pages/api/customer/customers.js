import { createCustomer, getAllCustomers } from "../models/customerModel";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const customers = await getAllCustomers();
        res.status(200).json(customers);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
      break;
    case "POST":
      try {
        const customer = req.body;
        const newCustomer = await createCustomer(customer);
        res.status(201).json({ message: 'Customer created', customer: newCustomer });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
