/**
 * Test Address Lookup
 * 
 * Run: npx ts-node scripts/test-address-lookup.ts
 * Or copy to browser console after loading the app
 */

import { 
  findProvinceByName, 
  findDistrictByName, 
  findWardByName,
  lookupAddressIds,
  enrichEmployeeAddresses,
} from '@/lib/import-export/address-lookup';
import { useProvinceStore } from '@/features/settings/provinces/store';

// Helper để test
async function runTests() {
  console.log('=== TEST ADDRESS LOOKUP ===');
  
  // Get store state
  const store = useProvinceStore.getState();
  console.log('Provinces count:', store.data.length);
  console.log('Districts count:', store.districts.length);
  console.log('Wards count:', store.wards.length);
  
  // Sample provinces
  console.log('\n--- Sample Provinces ---');
  console.log(store.data.slice(0, 5).map(p => `${p.id}: ${p.name}`));
  
  // Test 1: Find province
  console.log('\n--- Test findProvinceByName ---');
  const testProvinces = [
    'An Giang',
    'Bắc Ninh', 
    'TP Hồ Chí Minh',
    'Thành phố Hồ Chí Minh',
    'Hà Nội',
    'ha noi',
  ];
  
  testProvinces.forEach(name => {
    const result = findProvinceByName(name);
    console.log(`"${name}" => `, result);
  });
  
  // Test 2: Find district 
  console.log('\n--- Test findDistrictByName ---');
  // Need provinceId first
  const hcm = findProvinceByName('TP Hồ Chí Minh');
  if (hcm) {
    const testDistricts = [
      'Quận 1',
      'Quận 7',
      'Quận Bình Thạnh',
      'Bình Thạnh',
    ];
    
    testDistricts.forEach(name => {
      const result = findDistrictByName(name, hcm.id);
      console.log(`"${name}" (province: ${hcm.id}) => `, result);
    });
  }
  
  // Test 3: Full lookup
  console.log('\n--- Test lookupAddressIds ---');
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
    console.log(`\nAddress ${i + 1}:`, addr);
    const result = lookupAddressIds(addr);
    console.log('Result:', result);
  });
  
  // Test 4: enrichEmployeeAddresses
  console.log('\n--- Test enrichEmployeeAddresses ---');
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
  
  console.log('Input:', testEmployee);
  const enriched = enrichEmployeeAddresses(testEmployee);
  console.log('Enriched:', enriched);
  
  console.log('\n=== END TESTS ===');
}

runTests().catch(console.error);
