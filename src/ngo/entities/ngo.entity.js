export class Ngo {
  constructor(id, name, email, description, notifications = []) {
    this.id = id
    this.name = name
    this.email = email
    this.description = description
    this.notifications = notifications
  }
}
