import NgoService from "./ngo.service.js";

export default class NgoController {
  constructor() {
    this.service = new NgoService();
  }

  getProfile = (req, res) => {
    const profile = this.service.getProfile();
    res.json(profile);
  };

  updateProfile = (req, res) => {
    const data = req.body;
    const updated = this.service.updateProfile(data);
    res.json(updated);
  };

  getNotifications = (req, res) => {
    const notifications = this.service.getNotifications();
    res.json(notifications);
  };
}
