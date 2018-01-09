jest.mock('../../../locals.json', () => ({
  powerControl: {
    devices: [
      { name: 'group1', group: ['group1'] },
      { name: 'group2', group: ['group2'] },
      { name: 'group1andgroup2', group: ['group1', 'group2'] },
      { name: 'group3', group: ['group3'] },
    ],
  },
}));

import { filterGroup } from './group';

describe('group utils', () => {
  describe('filterGroup', () => {
    it('should filter by group name', () => {
      expect(filterGroup('group3')).toEqual([
        { name: 'group3', group: ['group3'] },
      ]);
    });

    it('should filter multiple group names', () => {
      expect(filterGroup('group1')).toEqual([
        { name: 'group1', group: ['group1'] },
        { name: 'group1andgroup2', group: ['group1', 'group2'] },
      ]);
    });

    it('should work for unknown group', () => {
      expect(filterGroup('unknown')).toEqual([]);
    });

    it('should accept the not selector', () => {
      expect(filterGroup('!group1')).toEqual([
        { name: 'group2', group: ['group2'] },
        { name: 'group3', group: ['group3'] },
      ]);
    });
  });
});
