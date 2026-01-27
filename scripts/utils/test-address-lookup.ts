/**
 * Test Address Lookup
 * 
 * Run: npx ts-node scripts/test-address-lookup.ts
 * Or copy to browser console after loading the app
 * 
 * NOTE: This test file needs provinces/districts/wards data to run.
 * Use from browser console where the store is available, not as standalone script.
 */

import { 
  findProvinceByName, 
  findDistrictByName, 
  lookupAddressIds,
  enrichEmployeeAddresses,
} from '@/lib/import-export/address-lookup';
import { useProvinceStore } from '@/features/settings/provinces/store';

// Helper để test
async function runTests() {
  
  // Get store state
  const store = useProvinceStore.getState();
  const { provinces, districts, wards } = store;
  
  // Sample provinces
  
  // Test 1: Find province
  const testProvinces = [
    'An Giang',
    'Bắc Ninh', 
    'TP Hồ Chí Minh',
    'Thành phố Hồ Chí Minh',
    'Hà Nội',
    'ha noi',
  ];
  
  testProvinces.forEach(name => {
    const result = findProvinceByName(name, provinces);
  });
  
  // Test 2: Find district 
  // Need provinceId first
  const hcm = findProvinceByName('TP Hồ Chí Minh', provinces);
  if (hcm) {
    const testDistricts = [
      'Quận 1',
      'Quận 7',
      'Quận Bình Thạnh',
      'Bình Thạnh',
    ];
    
    testDistricts.forEach(name => {
      const result = findDistrictByName(name, hcm.id, districts);
    });
  }
  
  // Test 3: Full lookup
  const testAddresses = [
    {
      street: '123 Nguyễn Văn Linh',
      province: 'An Giang',
      provinceId: '',
      district: '',
      districtId: 0,
      ward: '',
      wardId: '',
      inputLevel: '2-level' as const,
    },
    {
      street: '456 ABC',
      province: 'TP Hồ Chí Minh',
      provinceId: '',
      district: 'Quận 7',
      districtId: 0,
      ward: 'Phường Tân Phú',
      wardId: '',
      inputLevel: '3-level' as const,
    },
  ];
  
  testAddresses.forEach((addr, i) => {
    const result = lookupAddressIds(addr, provinces, districts, wards);
  });
  
  // Test 4: enrichEmployeeAddresses
  const testEmployee = {
    id: 'NV001',
    fullName: 'Test Employee',
    permanentAddress: {
      street: '123 Test',
      province: 'An Giang',
      provinceId: '',
      district: '',
      districtId: 0,
      ward: '',
      wardId: '',
      inputLevel: '2-level' as const,
    },
    temporaryAddress: null,
  };
  
  const enriched = enrichEmployeeAddresses(testEmployee, provinces, districts, wards);
  
}

runTests().catch(console.error);
