import { toast } from 'react-toastify';

class RoomService {
  constructor() {
    this.tableName = 'room';
    this.tableFields = ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'number', 'type', 'status', 'cleaning_status', 'floor', 'amenities', 'rate'];
  }

  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const apperClient = this.getApperClient();
      const params = {
        Fields: this.tableFields,
        orderBy: [{ FieldName: "floor", SortType: "ASC" }, { FieldName: "number", SortType: "ASC" }]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to fetch rooms");
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = this.getApperClient();
      const params = { fields: this.tableFields };
      
      const response = await apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching room with ID ${id}:`, error);
      return null;
    }
  }

  async create(room) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields
      const roomData = {
        Name: room.Name || `Room ${room.number}`,
        number: room.number,
        type: room.type,
        status: room.status,
        cleaning_status: room.cleaning_status || 'clean',
        floor: parseInt(room.floor),
        amenities: Array.isArray(room.amenities) ? room.amenities.join(',') : room.amenities,
        rate: parseFloat(room.rate)
      };

      const params = { records: [roomData] };
      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room");
      return null;
    }
  }

  async update(id, updatedRoom) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields
      const roomData = { Id: parseInt(id) };
      
      if (updatedRoom.number !== undefined) roomData.number = updatedRoom.number;
      if (updatedRoom.type !== undefined) roomData.type = updatedRoom.type;
      if (updatedRoom.status !== undefined) roomData.status = updatedRoom.status;
      if (updatedRoom.cleaning_status !== undefined) roomData.cleaning_status = updatedRoom.cleaning_status;
      if (updatedRoom.floor !== undefined) roomData.floor = parseInt(updatedRoom.floor);
      if (updatedRoom.amenities !== undefined) {
        roomData.amenities = Array.isArray(updatedRoom.amenities) ? updatedRoom.amenities.join(',') : updatedRoom.amenities;
      }
      if (updatedRoom.rate !== undefined) roomData.rate = parseFloat(updatedRoom.rate);

      const params = { records: [roomData] };
      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("Failed to update room");
      return null;
    }
  }

  async delete(id) {
    try {
      const apperClient = this.getApperClient();
      const params = { RecordIds: [parseInt(id)] };
      
      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error("Failed to delete room");
      return false;
    }
  }

  async getByFloor(floor) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        Fields: this.tableFields,
        where: [{ FieldName: "floor", Operator: "ExactMatch", Values: [floor] }],
        orderBy: [{ FieldName: "number", SortType: "ASC" }]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching rooms for floor ${floor}:`, error);
      return [];
    }
  }

  async getAvailableRooms() {
    try {
      const apperClient = this.getApperClient();
      const params = {
        Fields: this.tableFields,
        where: [{ FieldName: "status", Operator: "ExactMatch", Values: ["available"] }],
        orderBy: [{ FieldName: "floor", SortType: "ASC" }, { FieldName: "number", SortType: "ASC" }]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching available rooms:", error);
      return [];
    }
  }
}

export default new RoomService();