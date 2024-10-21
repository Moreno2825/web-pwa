import {
  deleteCustomer,
  getCustomerById,
  updateCustomer,
} from "../models/customerModel";

export default async function handler(req, res) {
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const customer = await getCustomerById(id);
        if (customer) {
          res.status(200).json(customer);
        } else {
          res.status(404).json({ message: "Customer not found" });
        }
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
      break;

    case "PUT":
      try {
        const customer = req.body;
        const updatedCustomer = await updateCustomer(id, customer);
        res.status(200).json(updatedCustomer);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
      break;

    case "DELETE":
      try {
        await deleteCustomer(id);
        res.status(200).json({ message: "Customer deleted" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
