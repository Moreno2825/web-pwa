import IconButton from "@mui/material/IconButton";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Badge, Box, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import * as React from "react";
import PropTypes from "prop-types";
import { createTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import BasicTextField from "../BasicTextField";
import CustomButton from "../CustomButton";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { Toaster, toast } from "alert";

const NAVIGATION = [
  {
    kind: "header",
    title: "Main itemms",
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

// parametrizar header
const columns = [
  {
    name: "Nombre",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.email,
  },
  {
    name: "Teléfono",
    selector: (row) => row.phone,
  },
];

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

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof window !== "undefined" && navigator.onLine
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};

function BasicModal({ open, handleClose, fetchCustomers }) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const isOnline = useOnlineStatus();

  const handleSubmit = async () => {
    const customerData = { name, email, phone, address };

    if (isOnline) {
      try {
        const response = await fetch("/api/customer/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(customerData),
        });

        if (response.ok) {
          const data = await response.json();
          fetchCustomers();
          handleClose();
          toast.success("Cliente creado con éxito");
        } else {
          throw new Error("Error al crear el cliente");
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      // Guardar en localStorage si está offline
      const offlineCustomers =
        JSON.parse(localStorage.getItem("offline_customers")) || [];
      offlineCustomers.push({ ...customerData, id: Date.now(), offline: true });
      localStorage.setItem(
        "offline_customers",
        JSON.stringify(offlineCustomers)
      );
      fetchCustomers(); // Actualiza la lista con los datos offline
      handleClose();
      toast.success(
        "Cliente guardado localmente. Sincronizará al estar en línea."
      );
    }
  };

  return (
    <div>
      <Toaster />
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
            <Button onClick={handleClose}>Cerrar</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

// Componente expandible para mostrar los datos
const ExpandedComponent = ({ data, onDeleteSuccess, fetchCustomers }) => {
  const [name, setName] = useState(data.name);
  const [email, setEmail] = useState(data.email);
  const [phone, setPhone] = useState(data.phone);
  const [address, setAddress] = useState(data.phone);
  const isOnline = useOnlineStatus();

  const handleDelete = async () => {
    if (isOnline) {
      try {
        const response = await fetch(`/api/customer/${data.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast.success("Cliente eliminado con éxito");
          onDeleteSuccess();
        } else {
          throw new Error("Error al eliminar el cliente");
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      // Eliminación offline
      const offlineCustomers =
        JSON.parse(localStorage.getItem("offline_customers")) || [];

      const filteredOfflineCustomers = offlineCustomers.filter(
        (customer) => customer.id !== data.id
      );

      localStorage.setItem(
        "offline_customers",
        JSON.stringify(filteredOfflineCustomers)
      );

      toast.success(
        "Cliente eliminado localmente. Sincronizará al estar en línea."
      );
      onDeleteSuccess();
    }
  };

  const handleEdit = async () => {
    const updatedCustomer = { id: data.id, name, email, phone, address };

    if (isOnline) {
      try {
        const response = await fetch(`/api/customer/${data.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCustomer),
        });

        if (response.ok) {
          toast.success("Cliente actualizado con éxito");
          fetchCustomers();
        } else {
          throw new Error("Error al actualizar el cliente");
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      // Actualización offline
      const offlineCustomers =
        JSON.parse(localStorage.getItem("offline_customers")) || [];

      const updatedOfflineCustomers = offlineCustomers.map((customer) =>
        customer.id === data.id ? { ...customer, ...updatedCustomer } : customer
      );

      localStorage.setItem(
        "offline_customers",
        JSON.stringify(updatedOfflineCustomers)
      );

      toast.success(
        "Cliente actualizado localmente. Sincronizará al estar en línea."
      );

      fetchCustomers();
    }
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "90%",
          height: "100px",
        }}
      >
        <BasicTextField
          label="Nombre"
          defaultValue={data.name}
          onChange={(e) => setName(e.target.value)}
        />
        <BasicTextField
          label="Email"
          defaultValue={data.email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <BasicTextField
          label="Teléfono"
          defaultValue={data.phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <BasicTextField
          label="Dirección"
          defaultValue={data.address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </Box>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
          padding: "0 0 16px",
        }}
      >
        <CustomButton text={"Editar"} onClick={handleEdit} />
        <CustomButton
          text={"Eliminar"}
          backgroundColor={"red"}
          onClick={handleDelete}
        />
      </div>
    </React.Fragment>
  );
};

function DemoPageContent({ pathname }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null); // Nuevo estado para controlar la fila expandida
  const isOnline = useOnlineStatus();

  const fetchCustomers = async () => {
    if (isOnline) {
      try {
        const response = await fetch("/api/customer/customers");
        if (!response.ok) throw new Error("Error al obtener los datos");
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        setError(error.message);
      }
    } else {
      const offlineCustomers =
        JSON.parse(localStorage.getItem("offline_customers")) || [];
      setCustomers(offlineCustomers);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, [isOnline]);

  useEffect(() => {
    if (isOnline) {
      const syncOfflineData = async () => {
        const offlineCustomers =
          JSON.parse(localStorage.getItem("offline_customers")) || [];
        for (const customer of offlineCustomers) {
          try {
            await fetch("/api/customer/customers", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(customer),
            });
          } catch {
            console.error("Error al sincronizar cliente:", customer);
          }
        }
        // limpiar el localstorage guardado en el almacenamiento
        localStorage.removeItem("offline_customers");
        fetchCustomers();
      };

      syncOfflineData();
    }
  }, [isOnline]);

  // Mostrar notificación cada vez que cambie el estado de conexión
  useEffect(() => {
    toast(isOnline ? "Estás en línea" : "Estás sin conexión", {
      icon: isOnline ? "✅" : "⚠️",
      style: {
        backgroundColor: isOnline ? "#4caf50" : "#f44336", // Verde para online, rojo para offline
        color: "white",
      },
    });
  }, [isOnline]);

  if (loading) return <Typography>Cargando...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const handleDeleteSuccess = () => {
    fetchCustomers();
    setExpandedRow(null); // Cierra la fila expandida
  };

  const handleEditSuccess = () => {
    fetchCustomers();
    setExpandedRow(null);
  };

  return (
    <Box
      sx={{
        py: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "95%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography>Bienvenidos a un proyecto PWA</Typography>
        <div
          style={{ display: "flex", justifyContent: "end", padding: "0 8px" }}
        >
          <CustomButton text={"Crear"} onClick={handleOpen} />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        expandableRows
        expandableRowsComponent={(props) => (
          <ExpandedComponent
            {...props}
            onDeleteSuccess={handleDeleteSuccess}
            fetchCustomers={handleEditSuccess}
          />
        )}
        pagination
        onRowExpandChange={(rowId) => setExpandedRow(rowId)} // Controla qué fila está expandida
      />

      <BasicModal
        open={modalOpen}
        handleClose={handleClose}
        fetchCustomers={fetchCustomers}
      />
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function Search() {
  return (
    <React.Fragment>
      <Tooltip title="Search" enterDelay={1000}>
        <div>
          <IconButton
            type="button"
            aria-label="search"
            sx={{
              display: { xs: "inline", md: "none" },
            }}
          >
            <SearchIcon />
          </IconButton>
        </div>
      </Tooltip>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        slotProps={{
          input: {
            endAdornment: (
              <IconButton type="button" aria-label="search" size="small">
                <SearchIcon />
              </IconButton>
            ),
            sx: { pr: 0.5 },
          },
        }}
        sx={{ display: { xs: "none", md: "inline-block" }, mr: 1 }}
      />
    </React.Fragment>
  );
}

function Notification() {
  const [notificationCount, setNotificationCount] = useState(0);

  // Función para obtener el conteo de notificaciones desde la API
  const fetchNotificationCount = async () => {
    try {
      const response = await fetch("/api/customer/count");
      if (response.ok) {
        const data = await response.json();
        setNotificationCount(data.total); // Actualiza el estado con el nuevo conteo
      } else {
        console.error(
          "Error fetching notification count:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  };

  // Llama a la API para obtener el conteo de notificaciones cuando el componente se monta
  useEffect(() => {
    fetchNotificationCount();
  }, []);

  // Manejo del click para recargar el conteo
  const handleClick = () => {
    fetchNotificationCount(); // Vuelve a llamar la función de fetch para actualizar el conteo
  };

  return (
    <React.Fragment>
      <div style={{ padding: "8px" }}>
        <Tooltip title="Clientes sincronizados" arrow>
          <Badge
            badgeContent={notificationCount}
            color="primary"
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "red", // Color del badge
                color: "#fff", // Color del texto
              },
            }}
          >
            <NotificationsIcon
              sx={{ color: "var(--mui-palette-primary-dark)" }}
              onClick={handleClick} // Agrega el manejador de clic
            />
          </Badge>
        </Tooltip>
      </div>
    </React.Fragment>
  );
}

function DashboardLayoutSlots(props) {
  const { window } = props;

  const [pathname, setPathname] = React.useState("/dashboard");

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout slots={{ toolbarActions: Notification }}>
        <DemoPageContent pathname={pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

DashboardLayoutSlots.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutSlots;
