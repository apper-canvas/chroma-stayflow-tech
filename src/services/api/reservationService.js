const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ReservationService {
  constructor() {
    this.storageKey = 'stayflow_reservations';
    this.initializeData();
  }

  async initializeData() {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      const { default: initialData } = await import('@/services/mockData/reservations.json');
      localStorage.setItem(this.storageKey, JSON.stringify(initialData));
    }
  }

  getData() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  async getAll() {
    await delay(300);
    return [...this.getData()];
  }

  async getById(id) {
    await delay(200);
    const data = this.getData();
    const item = data.find(reservation => reservation.id === id);
    return item ? { ...item } : null;
  }

  async create(reservation) {
    await delay(400);
    const data = this.getData();
    const newReservation = {
      ...reservation,
      id: Date.now().toString()
    };
    data.push(newReservation);
    this.saveData(data);
    return { ...newReservation };
  }

  async update(id, updatedReservation) {
    await delay(350);
    const data = this.getData();
    const index = data.findIndex(reservation => reservation.id === id);
    if (index === -1) {
      throw new Error('Reservation not found');
    }
    data[index] = { ...data[index], ...updatedReservation };
    this.saveData(data);
    return { ...data[index] };
  }

  async delete(id) {
    await delay(300);
    const data = this.getData();
    const filteredData = data.filter(reservation => reservation.id !== id);
    if (filteredData.length === data.length) {
      throw new Error('Reservation not found');
    }
    this.saveData(filteredData);
    return true;
  }

  async getTodayArrivals() {
    await delay(250);
    const data = this.getData();
    const today = new Date().toDateString();
    return data.filter(reservation => 
      new Date(reservation.checkIn).toDateString() === today
    );
  }

  async getTodayDepartures() {
    await delay(250);
    const data = this.getData();
    const today = new Date().toDateString();
    return data.filter(reservation => 
      new Date(reservation.checkOut).toDateString() === today
    );
  }
}

export default new ReservationService();