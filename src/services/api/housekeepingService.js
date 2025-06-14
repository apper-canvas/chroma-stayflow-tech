import { toast } from 'react-toastify';

class HousekeepingService {
  constructor() {
    this.tableName = 'housekeeping';
    this.tableFields = ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'room_id', 'type', 'priority', 'assigned_to', 'status', 'scheduled_time', 'completed_time'];
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
        orderBy: [
          { FieldName: "priority", SortType: "DESC" }, 
          { FieldName: "scheduled_time", SortType: "ASC" }
        ]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching housekeeping tasks:", error);
      toast.error("Failed to fetch housekeeping tasks");
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
      console.error(`Error fetching task with ID ${id}:`, error);
      return null;
    }
  }

  async create(task) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields with proper formatting
      const taskData = {
        Name: task.Name || `${task.type} - Room ${task.room_id}`,
        room_id: parseInt(task.room_id),
        type: task.type,
        priority: task.priority,
        assigned_to: task.assigned_to,
        status: task.status || 'pending',
        scheduled_time: task.scheduled_time, // DateTime format
        completed_time: task.completed_time || null
      };

      const params = { records: [taskData] };
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
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
      return null;
    }
  }

  async update(id, updatedTask) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields
      const taskData = { Id: parseInt(id) };
      
      if (updatedTask.room_id !== undefined) taskData.room_id = parseInt(updatedTask.room_id);
      if (updatedTask.type !== undefined) taskData.type = updatedTask.type;
      if (updatedTask.priority !== undefined) taskData.priority = updatedTask.priority;
      if (updatedTask.assigned_to !== undefined) taskData.assigned_to = updatedTask.assigned_to;
      if (updatedTask.status !== undefined) taskData.status = updatedTask.status;
      if (updatedTask.scheduled_time !== undefined) taskData.scheduled_time = updatedTask.scheduled_time;
      if (updatedTask.completed_time !== undefined) taskData.completed_time = updatedTask.completed_time;

      const params = { records: [taskData] };
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
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
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
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
      return false;
    }
  }

  async getTodayTasks() {
    try {
      const apperClient = this.getApperClient();
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      const params = {
        Fields: this.tableFields,
        where: [{ FieldName: "scheduled_time", Operator: "ExactMatch", Values: [today] }],
        orderBy: [{ FieldName: "priority", SortType: "DESC" }, { FieldName: "scheduled_time", SortType: "ASC" }]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching today's tasks:", error);
      return [];
    }
  }

  async getPendingTasks() {
    try {
      const apperClient = this.getApperClient();
      const params = {
        Fields: this.tableFields,
        where: [{ FieldName: "status", Operator: "ExactMatch", Values: ["pending"] }],
        orderBy: [{ FieldName: "priority", SortType: "DESC" }, { FieldName: "scheduled_time", SortType: "ASC" }]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching pending tasks:", error);
      return [];
    }
  }
}

export default new HousekeepingService();