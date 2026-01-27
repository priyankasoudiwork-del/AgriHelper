import firestore from '@react-native-firebase/firestore';

export interface ChatMessage {
  id?: string;
  Question: string;
  Answer?: string;
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
  status?: 'pending' | 'processing' | 'completed' | 'error';
  language?: 'kannada' | 'english' | 'mixed';
  category?: 'farming' | 'chemicals' | 'crops' | 'diseases' | 'weather' | 'general';
  helpful?: boolean | null;
  errorMessage?: string;
}

class AiChatService {
  private farmersCollectionName = 'farmers';
  private aiChatSubcollectionName = 'AiChat';

  /**
   * Get reference to a farmer's AI chat subcollection
   */
  private getUserAiChatRef(userId: string) {
    return firestore()
      .collection(this.farmersCollectionName)
      .doc(userId)
      .collection(this.aiChatSubcollectionName);
  }

  /**
   * Convert Firebase status to UI status
   * Firebase Gemini uses status.state with values: PROCESSING, COMPLETED, ERRORED
   */
  private convertStatus(data: any): 'pending' | 'processing' | 'completed' | 'error' {
    // Check if status field exists and has state property
    if (data.status && typeof data.status === 'object' && data.status.state) {
      const firebaseState = data.status.state;
      if (firebaseState === 'COMPLETED') return 'completed';
      if (firebaseState === 'ERRORED') return 'error';
      if (firebaseState === 'PROCESSING') return 'processing';
    }

    // Fallback: check if status is a string
    if (typeof data.status === 'string') {
      const status = data.status.toLowerCase();
      if (status === 'completed') return 'completed';
      if (status === 'error' || status === 'errored') return 'error';
      if (status === 'processing') return 'processing';
      if (status === 'pending') return 'pending';
    }

    // Default: if no Answer and no error, still processing; if has Answer, completed
    if (data.Answer && data.Answer.trim()) {
      return 'completed';
    }

    // If we have neither status nor answer, assume processing
    return data.status ? 'processing' : 'pending';
  }

  /**
   * Extract error message from Firebase status
   */
  private getErrorMessage(data: any): string | undefined {
    // Check Firebase Gemini error format
    if (data.status && typeof data.status === 'object') {
      if (data.status.error) {
        return typeof data.status.error === 'string'
          ? data.status.error
          : data.status.error.message || JSON.stringify(data.status.error);
      }
    }
    // Check direct errorMessage field
    if (data.errorMessage) {
      return data.errorMessage;
    }
    // Return undefined if no error
    return undefined;
  }

  /**
   * Send a message to AI (create a new chat document)
   */
  async sendMessage(
    userId: string,
    question: string,
    language?: 'kannada' | 'english' | 'mixed',
    category?: 'farming' | 'chemicals' | 'crops' | 'diseases' | 'weather' | 'general'
  ): Promise<string> {
    try {
      const now = firestore.Timestamp.now();
      const messageData = {
        Question: question,
        Answer: '', // Empty initially, will be filled by Gemini extension
        userId: userId,
        createdAt: now,
        updatedAt: now,
        status: 'pending',
        language: language || 'mixed',
        category: category || 'general',
        helpful: null,
      };

      const docRef = await this.getUserAiChatRef(userId).add(messageData);

      console.log('AI Chat question sent with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error sending AI chat question:', error);
      throw error;
    }
  }

  /**
   * Get all chat messages for a user
   */
  async getUserChatMessages(userId: string): Promise<ChatMessage[]> {
    try {
      const snapshot = await this.getUserAiChatRef(userId)
        .orderBy('createdAt', 'desc')
        .get();

      const messages: ChatMessage[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        const message: ChatMessage = {
          id: doc.id,
          Question: data.Question || '',
          Answer: data.Answer || '',
          userId: data.userId || userId,
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt) || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || (data.updatedAt ? new Date(data.updatedAt) : undefined),
          status: this.convertStatus(data),
          language: data.language,
          category: data.category,
          helpful: data.helpful !== undefined ? data.helpful : null,
          errorMessage: this.getErrorMessage(data),
        };
        messages.push(message);
      });

      return messages;
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw error;
    }
  }

  /**
   * Get a single chat message by ID
   */
  async getChatMessage(userId: string, messageId: string): Promise<ChatMessage | null> {
    try {
      const doc = await this.getUserAiChatRef(userId)
        .doc(messageId)
        .get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data();
      if (!data) {
        return null;
      }

      const message: ChatMessage = {
        id: doc.id,
        Question: data.Question || '',
        Answer: data.Answer || '',
        userId: data.userId || userId,
        createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt) || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || (data.updatedAt ? new Date(data.updatedAt) : undefined),
        status: this.convertStatus(data),
        language: data.language,
        category: data.category,
        helpful: data.helpful !== undefined ? data.helpful : null,
        errorMessage: this.getErrorMessage(data),
      };

      return message;
    } catch (error) {
      console.error('Error fetching chat message:', error);
      throw error;
    }
  }

  /**
   * Listen to real-time updates for user's chat messages
   */
  subscribeToChatMessages(
    userId: string,
    callback: (messages: ChatMessage[]) => void
  ): () => void {
    const unsubscribe = this.getUserAiChatRef(userId)
      .orderBy('createdAt', 'asc')
      .onSnapshot(
        snapshot => {
          const messages: ChatMessage[] = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            const message: ChatMessage = {
              id: doc.id,
              Question: data.Question || '',
              Answer: data.Answer || '',
              userId: data.userId || userId,
              createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt) || new Date(),
              updatedAt: data.updatedAt?.toDate?.() || (data.updatedAt ? new Date(data.updatedAt) : undefined),
              status: this.convertStatus(data),
              language: data.language,
              category: data.category,
              helpful: data.helpful !== undefined ? data.helpful : null,
              errorMessage: this.getErrorMessage(data),
            };
            messages.push(message);
          });
          callback(messages);
        },
        error => {
          console.error('Error in chat messages subscription:', error);
        }
      );

    return unsubscribe;
  }

  /**
   * Mark a message as helpful or not helpful (for future feedback feature)
   */
  async markMessageHelpful(userId: string, messageId: string, helpful: boolean): Promise<void> {
    try {
      await this.getUserAiChatRef(userId)
        .doc(messageId)
        .update({
          helpful: helpful,
          updatedAt: firestore.Timestamp.now(),
        });

      console.log('Message marked as', helpful ? 'helpful' : 'not helpful');
    } catch (error) {
      console.error('Error marking message helpful:', error);
      throw error;
    }
  }

  /**
   * Delete a chat message
   */
  async deleteChatMessage(userId: string, messageId: string): Promise<void> {
    try {
      await this.getUserAiChatRef(userId)
        .doc(messageId)
        .delete();

      console.log('Chat message deleted:', messageId);
    } catch (error) {
      console.error('Error deleting chat message:', error);
      throw error;
    }
  }

  /**
   * Clear all chat history for a user
   */
  async clearChatHistory(userId: string): Promise<void> {
    try {
      const snapshot = await this.getUserAiChatRef(userId).get();

      const batch = firestore().batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log('Chat history cleared for user:', userId);
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw error;
    }
  }

  /**
   * Get messages by category (for future filtering feature)
   */
  async getMessagesByCategory(
    userId: string,
    category: 'farming' | 'chemicals' | 'crops' | 'diseases' | 'weather' | 'general'
  ): Promise<ChatMessage[]> {
    try {
      const snapshot = await this.getUserAiChatRef(userId)
        .where('category', '==', category)
        .orderBy('createdAt', 'desc')
        .get();

      const messages: ChatMessage[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        const message: ChatMessage = {
          id: doc.id,
          Question: data.Question || '',
          Answer: data.Answer || '',
          userId: data.userId || userId,
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt) || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || (data.updatedAt ? new Date(data.updatedAt) : undefined),
          status: this.convertStatus(data),
          language: data.language,
          category: data.category,
          helpful: data.helpful !== undefined ? data.helpful : null,
          errorMessage: this.getErrorMessage(data),
        };
        messages.push(message);
      });

      return messages;
    } catch (error) {
      console.error('Error fetching messages by category:', error);
      throw error;
    }
  }
}

export default new AiChatService();