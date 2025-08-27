import '@testing-library/jest-dom'

// Mock IndexedDB for testing
const mockIDBRequest = {
  result: [],
  error: null,
  onsuccess: null,
  onerror: null,
}

const mockIDBDatabase = {
  transaction: () => ({
    objectStore: () => ({
      add: () => mockIDBRequest,
      getAll: () => mockIDBRequest,
      clear: () => mockIDBRequest,
    }),
  }),
  close: () => {},
}

const mockIDBFactory = {
  open: () => ({
    ...mockIDBRequest,
    onupgradeneeded: null,
    result: mockIDBDatabase,
  }),
}

// @ts-expect-error - Mocking global IndexedDB
globalThis.indexedDB = mockIDBFactory
