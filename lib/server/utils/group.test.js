import { filterGroup } from './group';

const devices = [
  { name: 'group1', groups: ['group1'] },
  { name: 'group2', groups: ['group2'] },
  { name: 'group1andgroup2', groups: ['group1', 'group2'] },
  { name: 'group3', groups: ['group3'] },
];

describe('group utils', () => {
  describe('filterGroup', () => {
    it('should filter by group name', () => {
      expect(filterGroup(devices, 'group3')).toEqual([
        { name: 'group3', groups: ['group3'] },
      ]);
    });

    it('should filter multiple group names', () => {
      expect(filterGroup(devices, 'group1')).toEqual([
        { name: 'group1', groups: ['group1'] },
        { name: 'group1andgroup2', groups: ['group1', 'group2'] },
      ]);
    });

    it('should work for unknown group', () => {
      expect(filterGroup(devices, 'unknown')).toEqual([]);
    });

    it('should accept the not selector', () => {
      expect(filterGroup(devices, '!group1')).toEqual([
        { name: 'group2', groups: ['group2'] },
        { name: 'group3', groups: ['group3'] },
      ]);
    });
  });
});
