import { describe, it, expect } from '@ohos/hypium';
import { ResourceCleaner } from '../../main/ets/utils/ResourceCleaner';

/**
 * ResourceCleaner测试类
 */
export default function resourceCleanerTest() {
  describe('ResourceCleanerTest', () => {
    it('testClearMap', 0, () => {
      const map = new Map<string, number>();
      map.set('key1', 1);
      map.set('key2', 2);
      expect(map.size).assertEqual(2);
      
      ResourceCleaner.clearMap(map);
      expect(map.size).assertEqual(0);
    });

    it('testClearArray', 0, () => {
      const array = [1, 2, 3, 4, 5];
      expect(array.length).assertEqual(5);
      
      ResourceCleaner.clearArray(array);
      expect(array.length).assertEqual(0);
    });

    it('testClearNullMap', 0, () => {
      // 测试null和undefined的情况
      ResourceCleaner.clearMap(null);
      ResourceCleaner.clearMap(undefined);
      // 不应该抛出异常
      expect(true).assertTrue();
    });
  });
}
