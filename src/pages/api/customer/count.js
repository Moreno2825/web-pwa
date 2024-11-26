import { getCustomerCount } from "../models/customerModel";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    try {
      const total = await getCustomerCount();
      res.status(200).json({ total });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
