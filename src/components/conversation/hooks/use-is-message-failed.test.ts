import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIsMessageFailed } from './use-is-message-failed';
import { IConversationMessage } from '../../../types/conversation';

describe('useIsMessageFailed', () => {
  const createMockMessage = (
    overrides?: Partial<IConversationMessage>
  ): IConversationMessage => ({
    id: 1,
    content: 'Test message',
    created_at: '2025-01-01T00:00:00Z',
    saw: false,
    mimetype: null,
    username: 'test_user',
    role: 'user',
    class: 'message',
    fromApp: false,
    hasImage: false,
    run_id: null,
    response_score: null,
    meta_status_history: [],
    ...overrides,
  });

  describe('when message has no meta_status_history', () => {
    it('should return false when meta_status_history is undefined', () => {
      const message = createMockMessage({ meta_status_history: undefined });
      const { result } = renderHook(() => useIsMessageFailed(message));
      
      expect(result.current).toBe(false);
    });

    it('should return false when meta_status_history is empty array', () => {
      const message = createMockMessage({ meta_status_history: [] });
      const { result } = renderHook(() => useIsMessageFailed(message));
      
      expect(result.current).toBe(false);
    });
  });

  describe('when message has failed status', () => {
    it('should return true when the most recent status is "failed"', () => {
      const message = createMockMessage({
        meta_status_history: [
          { status: 'failed', timestamp: '1704153600000' },
        ],
      });
      const { result } = renderHook(() => useIsMessageFailed(message));
      
      expect(result.current).toBe(true);
    });

    it('should return true when the most recent status is "FAILED" (uppercase)', () => {
      const message = createMockMessage({
        meta_status_history: [
          { status: 'FAILED', timestamp: '1704153600000' },
        ],
      });
      const { result } = renderHook(() => useIsMessageFailed(message));
      
      expect(result.current).toBe(true);
    });

    it('should return true when the most recent status is "Failed" (mixed case)', () => {
      const message = createMockMessage({
        meta_status_history: [
          { status: 'Failed', timestamp: '1704153600000' },
        ],
      });
      const { result } = renderHook(() => useIsMessageFailed(message));
      
      expect(result.current).toBe(true);
    });
  });

  describe('when message has api_error status', () => {
    it('should return true when the most recent status is "api_error"', () => {
      const message = createMockMessage({
        meta_status_history: [
          { status: 'api_error', timestamp: '1704153600000' },
        ],
      });
      const { result } = renderHook(() => useIsMessageFailed(message));
      
      expect(result.current).toBe(true);
    });

    it('should return true when the most recent status is "API_ERROR" (uppercase)', () => {
      const message = createMockMessage({
        meta_status_history: [
          { status: 'API_ERROR', timestamp: '1704153600000' },
        ],
      });
      const { result } = renderHook(() => useIsMessageFailed(message));
      
      expect(result.current).toBe(true);
    });
  });

  describe('when message has other status', () => {
    it('should return false when the most recent status is "sent"', () => {
      const message = createMockMessage({
        meta_status_history: [
          { status: 'sent', timestamp: '1704153600000' },
        ],
      });
      const { result } = renderHook(() => useIsMessageFailed(message));
      
      expect(result.current).toBe(false);
    });

    it('should return false when the most recent status is "delivered"', () => {
      const message = createMockMessage({
        meta_status_history: [
          { status: 'delivered', timestamp: '1704153600000' },
        ],
      });
      const { result } = renderHook(() => useIsMessageFailed(message));
      
      expect(result.current).toBe(false);
    });

    it('should return false when the most recent status is "read"', () => {
      const message = createMockMessage({
        meta_status_history: [
          { status: 'read', timestamp: '1704153600000' },
        ],
      });
      const { result } = renderHook(() => useIsMessageFailed(message));
      
      expect(result.current).toBe(false);
    });
  });

  describe('when message has multiple status history entries', () => {
    it('should check only the most recent status (by timestamp)', () => {
      const message = createMockMessage({
        meta_status_history: [
          { status: 'sent', timestamp: '1704067200000' }, // older
          { status: 'failed', timestamp: '1704153600000' }, // most recent
          { status: 'delivered', timestamp: '1704110000000' }, // middle
        ],
      });
      const { result } = renderHook(() => useIsMessageFailed(message));
      
      expect(result.current).toBe(true);
    });

    it('should return false when the most recent status is not failed/api_error', () => {
      const message = createMockMessage({
        meta_status_history: [
          { status: 'failed', timestamp: '1704067200000' }, // older - was failed
          { status: 'sent', timestamp: '1704153600000' }, // most recent - now sent
        ],
      });
      const { result } = renderHook(() => useIsMessageFailed(message));
      
      expect(result.current).toBe(false);
    });

    it('should handle unordered history entries correctly', () => {
      const message = createMockMessage({
        meta_status_history: [
          { status: 'delivered', timestamp: '1704110000000' },
          { status: 'api_error', timestamp: '1704153600000' }, // highest timestamp
          { status: 'sent', timestamp: '1704067200000' },
        ],
      });
      const { result } = renderHook(() => useIsMessageFailed(message));
      
      expect(result.current).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should return false when status is undefined', () => {
      const message = createMockMessage({
        meta_status_history: [
          { status: undefined as any, timestamp: '1704153600000' },
        ],
      });
      const { result } = renderHook(() => useIsMessageFailed(message));
      
      expect(result.current).toBe(false);
    });

    it('should return false when status is an empty string', () => {
      const message = createMockMessage({
        meta_status_history: [
          { status: '', timestamp: '1704153600000' },
        ],
      });
      const { result } = renderHook(() => useIsMessageFailed(message));
      
      expect(result.current).toBe(false);
    });

    it('should return false when status is null', () => {
      const message = createMockMessage({
        meta_status_history: [
          { status: null as any, timestamp: '1704153600000' },
        ],
      });
      const { result } = renderHook(() => useIsMessageFailed(message));
      
      expect(result.current).toBe(false);
    });

    it('should handle status with extra whitespace', () => {
      const message = createMockMessage({
        meta_status_history: [
          { status: '  failed  ', timestamp: '1704153600000' },
        ],
      });
      const { result } = renderHook(() => useIsMessageFailed(message));
      
      // Note: The current implementation doesn't trim whitespace
      // This test documents the current behavior
      expect(result.current).toBe(false);
    });
  });

  describe('memoization behavior', () => {
    it('should return the same result when called with the same message reference', () => {
      const message = createMockMessage({
        meta_status_history: [
          { status: 'failed', timestamp: '1704153600000' },
        ],
      });
      
      const { result, rerender } = renderHook(() => useIsMessageFailed(message));
      const firstResult = result.current;
      
      rerender();
      const secondResult = result.current;
      
      expect(firstResult).toBe(secondResult);
      expect(firstResult).toBe(true);
    });

    it('should recalculate when message reference changes', () => {
      const message1 = createMockMessage({
        meta_status_history: [
          { status: 'failed', timestamp: '1704153600000' },
        ],
      });
      
      const message2 = createMockMessage({
        meta_status_history: [
          { status: 'sent', timestamp: '1704153600000' },
        ],
      });
      
      const { result, rerender } = renderHook(
        ({ msg }) => useIsMessageFailed(msg),
        { initialProps: { msg: message1 } }
      );
      
      expect(result.current).toBe(true);
      
      rerender({ msg: message2 });
      
      expect(result.current).toBe(false);
    });
  });

  describe('real-world scenarios', () => {
    it('should handle a message lifecycle: sent -> delivered -> read', () => {
      const message = createMockMessage({
        meta_status_history: [
          { status: 'sent', timestamp: '1704067200000' },
          { status: 'delivered', timestamp: '1704070800000' },
          { status: 'read', timestamp: '1704074400000' },
        ],
      });
      const { result } = renderHook(() => useIsMessageFailed(message));
      
      expect(result.current).toBe(false);
    });

    it('should handle a message that failed after being sent', () => {
      const message = createMockMessage({
        meta_status_history: [
          { status: 'sent', timestamp: '1704067200000' },
          { status: 'failed', timestamp: '1704070800000' },
        ],
      });
      const { result } = renderHook(() => useIsMessageFailed(message));
      
      expect(result.current).toBe(true);
    });

    it('should handle a message with api_error that includes error details', () => {
      const message = createMockMessage({
        meta_status_history: [
          { 
            status: 'sent', 
            timestamp: '1704067200000' 
          },
          { 
            status: 'api_error', 
            timestamp: '1704070800000',
            error: {
              code: 500,
              title: 'Internal Server Error',
              message: 'Failed to send message',
            }
          },
        ],
      });
      const { result } = renderHook(() => useIsMessageFailed(message));
      
      expect(result.current).toBe(true);
    });
  });
});

