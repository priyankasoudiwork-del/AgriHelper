import firestore from '@react-native-firebase/firestore';

export interface SprayRecord {
  id?: string;
  userId: string;
  date: string;
  chemicalName: string;
  disease: string;
  quantity: string;
  unit: string;
  acres: string;
  cost: string;
  weather: string;
  sprayTime: string;
  sprayMethod: string;
  notes: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

class SprayRecordService {
  private farmersCollectionName = 'farmers';
  private sprayRecordsSubcollectionName = 'sprayRecords';

  /**
   * Get reference to a farmer's spray records subcollection
   */
  private getUserSprayRecordsRef(userId: string) {
    return firestore()
      .collection(this.farmersCollectionName)
      .doc(userId)
      .collection(this.sprayRecordsSubcollectionName);
  }

  /**
   * Add a new spray record to Firestore
   */
  async addSprayRecord(userId: string, recordData: Omit<SprayRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = new Date();
      const record: Omit<SprayRecord, 'id'> = {
        ...recordData,
        userId,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await this.getUserSprayRecordsRef(userId).add(record);

      console.log('Spray record added with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding spray record:', error);
      throw error;
    }
  }

  /**
   * Get all spray records for a user
   */
  async getUserSprayRecords(userId: string): Promise<SprayRecord[]> {
    try {
      const snapshot = await this.getUserSprayRecordsRef(userId)
        .orderBy('date', 'desc')
        .get();

      const records: SprayRecord[] = [];
      snapshot.forEach(doc => {
        records.push({
          id: doc.id,
          ...doc.data(),
        } as SprayRecord);
      });

      return records;
    } catch (error) {
      console.error('Error fetching spray records:', error);
      throw error;
    }
  }

  /**
   * Get a single spray record by ID
   */
  async getSprayRecord(userId: string, recordId: string): Promise<SprayRecord | null> {
    try {
      const doc = await this.getUserSprayRecordsRef(userId)
        .doc(recordId)
        .get();

      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data(),
      } as SprayRecord;
    } catch (error) {
      console.error('Error fetching spray record:', error);
      throw error;
    }
  }

  /**
   * Update a spray record
   */
  async updateSprayRecord(userId: string, recordId: string, updates: Partial<Omit<SprayRecord, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
    try {
      await this.getUserSprayRecordsRef(userId)
        .doc(recordId)
        .update({
          ...updates,
          updatedAt: new Date(),
        });

      console.log('Spray record updated:', recordId);
    } catch (error) {
      console.error('Error updating spray record:', error);
      throw error;
    }
  }

  /**
   * Delete a spray record
   */
  async deleteSprayRecord(userId: string, recordId: string): Promise<void> {
    try {
      await this.getUserSprayRecordsRef(userId)
        .doc(recordId)
        .delete();

      console.log('Spray record deleted:', recordId);
    } catch (error) {
      console.error('Error deleting spray record:', error);
      throw error;
    }
  }

  /**
   * Listen to real-time updates for user's spray records
   */
  subscribeToUserRecords(userId: string, callback: (records: SprayRecord[]) => void): () => void {
    const unsubscribe = this.getUserSprayRecordsRef(userId)
      .orderBy('date', 'desc')
      .onSnapshot(
        snapshot => {
          const records: SprayRecord[] = [];
          snapshot.forEach(doc => {
            records.push({
              id: doc.id,
              ...doc.data(),
            } as SprayRecord);
          });
          callback(records);
        },
        error => {
          console.error('Error in spray records subscription:', error);
        }
      );

    return unsubscribe;
  }
}

export default new SprayRecordService();
