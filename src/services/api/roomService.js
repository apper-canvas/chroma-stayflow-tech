const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class RoomService {
  constructor() {
    this.storageKey = 'stayflow_rooms';
    this.initializeData();
  }

  async initializeData() {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      const { default: initialData } = await import('@/services/mockData/rooms.json');
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
    const item = data.find(room => room.id === id);
    return item ? { ...item } : null;
  }

  async create(room) {
    await delay(400);
    const data = this.getData();
    const newRoom = {
      ...room,
      id: Date.now().toString()
    };
    data.push(newRoom);
    this.saveData(data);
    return { ...newRoom };
  }

  async update(id, updatedRoom) {
    await delay(350);
    const data = this.getData();
    const index = data.findIndex(room => room.id === id);
    if (index === -1) {
      throw new Error('Room not found');
    }
    data[index] = { ...data[index], ...updatedRoom };
    this.saveData(data);
    return { ...data[index] };
  }

  async delete(id) {
    await delay(300);
    const data = this.getData();
    const filteredData = data.filter(room => room.id !== id);
    if (filteredData.length === data.length) {
      throw new Error('Room not found');
    }
    this.saveData(filteredData);
    return true;
  }

  async getByFloor(floor) {
    await delay(250);
    const data = this.getData();
    return data.filter(room => room.floor === floor);
  }

  async getAvailableRooms() {
    await delay(300);
    const data = this.getData();
    return data.filter(room => room.status === 'available');
  }
}

export default new RoomService();