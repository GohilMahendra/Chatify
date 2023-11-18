
export const createFirestoreMocks = (data: any) => {
    const positiveResponse = {
      data: jest.fn().mockReturnValue({
        data
      }),
      id: `fake_id`,
      exists: true,
    };
  
    const negativeResponse = {
      error: `Error string`,
    };
  
    const mockGet = jest.fn();
  
    const mockDoc = jest.fn(() => ({
      get: mockGet,
    }));
  
    const mockCollection = jest.fn(() => ({
      doc: mockDoc,
    }));
  
    return {
      __esModule: true,
      firestore: jest.fn(() => ({
        collection: mockCollection,
      })),
      mockGet,
      positiveResponse,
      negativeResponse,
    };
  };
  