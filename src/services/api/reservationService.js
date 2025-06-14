import { toast } from 'react-toastify';

class ReservationService {
  constructor() {
    this.tableName = 'reservation';
    this.tableFields = ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'guest_name', 'guest_email', 'guest_phone', 'check_in', 'check_out', 'status', 'total_amount', 'notes', 'room_id'];
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
        orderBy: [{ FieldName: "check_in", SortType: "DESC" }]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast.error("Failed to fetch reservations");
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
      console.error(`Error fetching reservation with ID ${id}:`, error);
      return null;
    }
  }

  async create(reservation) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields with proper formatting
      const reservationData = {
        Name: reservation.Name || `Reservation for ${reservation.guest_name}`,
        guest_name: reservation.guest_name,
        guest_email: reservation.guest_email,
        guest_phone: reservation.guest_phone,
        room_id: parseInt(reservation.room_id),
        check_in: reservation.check_in, // DateTime format
        check_out: reservation.check_out, // DateTime format
        status: reservation.status,
        total_amount: parseFloat(reservation.total_amount),
        notes: reservation.notes || ''
      };

      const params = { records: [reservationData] };
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
      console.error("Error creating reservation:", error);
      toast.error("Failed to create reservation");
      return null;
    }
  }

  async update(id, updatedReservation) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields
      const reservationData = { Id: parseInt(id) };
      
      if (updatedReservation.guest_name !== undefined) reservationData.guest_name = updatedReservation.guest_name;
      if (updatedReservation.guest_email !== undefined) reservationData.guest_email = updatedReservation.guest_email;
      if (updatedReservation.guest_phone !== undefined) reservationData.guest_phone = updatedReservation.guest_phone;
      if (updatedReservation.room_id !== undefined) reservationData.room_id = parseInt(updatedReservation.room_id);
      if (updatedReservation.check_in !== undefined) reservationData.check_in = updatedReservation.check_in;
      if (updatedReservation.check_out !== undefined) reservationData.check_out = updatedReservation.check_out;
      if (updatedReservation.status !== undefined) reservationData.status = updatedReservation.status;
      if (updatedReservation.total_amount !== undefined) reservationData.total_amount = parseFloat(updatedReservation.total_amount);
      if (updatedReservation.notes !== undefined) reservationData.notes = updatedReservation.notes;

      const params = { records: [reservationData] };
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
      console.error("Error updating reservation:", error);
      toast.error("Failed to update reservation");
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
      console.error("Error deleting reservation:", error);
      toast.error("Failed to delete reservation");
      return false;
    }
  }

  async getTodayArrivals() {
    try {
      const apperClient = this.getApperClient();
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      const params = {
        Fields: this.tableFields,
        where: [{ FieldName: "check_in", Operator: "ExactMatch", Values: [today] }],
        orderBy: [{ FieldName: "check_in", SortType: "ASC" }]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching today's arrivals:", error);
      return [];
    }
  }

  async getTodayDepartures() {
    try {
      const apperClient = this.getApperClient();
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      const params = {
        Fields: this.tableFields,
        where: [{ FieldName: "check_out", Operator: "ExactMatch", Values: [today] }],
        orderBy: [{ FieldName: "check_out", SortType: "ASC" }]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching today's departures:", error);
      return [];
    }
  }
}

export default new ReservationService();