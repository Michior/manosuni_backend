export default class NgoService {
  getProfile() {
    return {
      id: 1,
      nombre: "Fundación Manos Unidas",
      correo: "contacto@manosuni.org",
      telefono: "+503 7777 8888",
    };
  }

  updateProfile(data) {
    return { message: "Perfil actualizado correctamente", data };
  }

  getNotifications() {
    return [
      { id: 1, titulo: "Nueva actividad registrada", fecha: "2025-10-20" },
      { id: 2, titulo: "Voluntario completó horas", fecha: "2025-10-19" },
    ];
  }
}

