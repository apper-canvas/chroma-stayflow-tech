const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class HousekeepingService {
  constructor() {
    this.storageKey = 'stayflow_housekeeping';
    this.initializeData();
  }

  async initializeData() {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      const { default: initialData } = await import('@/services/mockData/housekeeping.json');
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
    const item = data.find(task => task.id === id);
    return item ? { ...item } : null;
  }

  async create(task) {
    await delay(400);
    const data = this.getData();
    const newTask = {
      ...task,
      id: Date.now().toString()
    };
    data.push(newTask);
    this.saveData(data);
    return { ...newTask };
  }

  async update(id, updatedTask) {
    await delay(350);
    const data = this.getData();
    const index = data.findIndex(task => task.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    data[index] = { ...data[index], ...updatedTask };
    this.saveData(data);
    return { ...data[index] };
  }

  async delete(id) {
    await delay(300);
    const data = this.getData();
    const filteredData = data.filter(task => task.id !== id);
    if (filteredData.length === data.length) {
      throw new Error('Task not found');
    }
    this.saveData(filteredData);
    return true;
  }

  async getTodayTasks() {
    await delay(250);
    const data = this.getData();
    const today = new Date().toDateString();
    return data.filter(task => 
      new Date(task.scheduledTime).toDateString() === today
    );
  }

  async getPendingTasks() {
    await delay(250);
    const data = this.getData();
    return data.filter(task => task.status === 'pending');
  }
}

export default new HousekeepingService();