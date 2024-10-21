import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import BasicTextField from "../BasicTextField";
import CustomButton from "../CustomButton";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({ open, handleClose, onSubmit }) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");

  const handleSubmit = async () => {
    const customerData = {
      name,
      email,
      phone,
      address,
    };

    try {
      const response = await fetch(
        "http://localhost:3000/api/customer/customers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customerData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        onSubmit(data);
        handleClose();
      } else {
        throw new Error("Error al crear el cliente");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <BasicTextField
            label="Nombre"
            defaultValue="Nombre"
            width="30ch"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <BasicTextField
            label="Email"
            defaultValue="Email"
            width="30ch"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <BasicTextField
            label="Teléfono"
            defaultValue="Telefono"
            width="30ch"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <BasicTextField
            label="Dirección"
            defaultValue="Dirección"
            width="30ch"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              padding: "8px 0 16px",
            }}
          >
            <CustomButton
              text={"Guardar"}
              width="90px"
              onClick={handleSubmit}
            />
            <Button onClick={handleClose}>Cerrar</Button>{" "}
          </div>

          {/* Botón para cerrar el modal */}
        </Box>
      </Modal>
    </div>
  );
}
