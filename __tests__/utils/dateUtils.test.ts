import { formatDate, isToday, isOverdue } from '../../utils/dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2025-09-27T10:30:00Z');
      const formatted = formatDate(date);

      expect(formatted).toContain('Sep');
      expect(formatted).toContain('27');
      expect(formatted).toContain('2025');
    });

    it('should handle different dates', () => {
      const date = new Date('2024-12-25T00:00:00Z');
      const formatted = formatDate(date);
      expect(formatted).toContain('Dec');
      expect(formatted).toContain('25');
      expect(formatted).toContain('2024');
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow)).toBe(false);
    });
  });

  describe('isOverdue', () => {
    it('should return true for past dates', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      expect(isOverdue(pastDate)).toBe(true);
    });

    it('should return false for today', () => {
      const today = new Date();
      expect(isOverdue(today)).toBe(false);
    });

    it('should return false for future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      expect(isOverdue(futureDate)).toBe(false);
    });
  });
});