/**
 * Auto-generated from FILE2 (file2.xlsb)
 * Date: 2025-10-29T19:47:51.666404
 * Total: 3321 wards (2 cấp - 34 tỉnh mới)
 */

import { asSystemId, asBusinessId, type SystemId, type BusinessId } from '@/lib/id-types';
import { buildSeedAuditFields } from '@/lib/seed-audit';

export type Ward2Level = {
  systemId: SystemId;
  id: string;
  name: string;
  provinceId: BusinessId;
  provinceName: string;
  level: 2;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

type Ward2LevelSeed = {
  systemId: string;
  id: string;
  name: string;
  provinceId: string;
  provinceName: string;
  level: 2;
};

const WARD_2LEVEL_AUDIT_DATE = '2024-01-18T00:00:00Z';

const rawData = [
  {
    "systemId": "W2_10105001",
    "id": "10105001",
    "name": "Phường Hoàn Kiếm",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10105002",
    "id": "10105002",
    "name": "Phường Cửa Nam",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10101003",
    "id": "10101003",
    "name": "Phường Ba Đình",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10101004",
    "id": "10101004",
    "name": "Phường Ngọc Hà",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10101005",
    "id": "10101005",
    "name": "Phường Giảng Võ",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10107006",
    "id": "10107006",
    "name": "Phường Hai Bà Trưng",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10107007",
    "id": "10107007",
    "name": "Phường Vĩnh Tuy",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10107008",
    "id": "10107008",
    "name": "Phường Bạch Mai",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10109009",
    "id": "10109009",
    "name": "Phường Đống Đa",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10109010",
    "id": "10109010",
    "name": "Phường Kim Liên",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10109011",
    "id": "10109011",
    "name": "Phường Văn Miếu - Quốc Tử Giám",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10109012",
    "id": "10109012",
    "name": "Phường Láng",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10109013",
    "id": "10109013",
    "name": "Phường Ô Chợ Dừa",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10103014",
    "id": "10103014",
    "name": "Phường Hồng Hà",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10108015",
    "id": "10108015",
    "name": "Phường Lĩnh Nam",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10108016",
    "id": "10108016",
    "name": "Phường Hoàng Mai",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10108017",
    "id": "10108017",
    "name": "Phường Vĩnh Hưng",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10108018",
    "id": "10108018",
    "name": "Phường Tương Mai",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10108019",
    "id": "10108019",
    "name": "Phường Định Công",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10123020",
    "id": "10123020",
    "name": "Phường Hoàng Liệt",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10108021",
    "id": "10108021",
    "name": "Phường Yên Sở",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10111022",
    "id": "10111022",
    "name": "Phường Thanh Xuân",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10111023",
    "id": "10111023",
    "name": "Phường Khương Đình",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10111024",
    "id": "10111024",
    "name": "Phường Phương Liệt",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10113025",
    "id": "10113025",
    "name": "Phường Cầu Giấy",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10113026",
    "id": "10113026",
    "name": "Phường Nghĩa Đô",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10113027",
    "id": "10113027",
    "name": "Phường Yên Hòa",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10103028",
    "id": "10103028",
    "name": "Phường Tây Hồ",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10157029",
    "id": "10157029",
    "name": "Phường Phú Thượng",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10157030",
    "id": "10157030",
    "name": "Phường Tây Tựu",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10157031",
    "id": "10157031",
    "name": "Phường Phú Diễn",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10157032",
    "id": "10157032",
    "name": "Phường Xuân Đỉnh",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10157033",
    "id": "10157033",
    "name": "Phường Đông Ngạc",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10157034",
    "id": "10157034",
    "name": "Phường Thượng Cát",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10155035",
    "id": "10155035",
    "name": "Phường Từ Liêm",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10155036",
    "id": "10155036",
    "name": "Phường Xuân Phương",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10155037",
    "id": "10155037",
    "name": "Phường Tây Mỗ",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10155038",
    "id": "10155038",
    "name": "Phường Đại Mỗ",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10106039",
    "id": "10106039",
    "name": "Phường Long Biên",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10106040",
    "id": "10106040",
    "name": "Phường Bồ Đề",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10106041",
    "id": "10106041",
    "name": "Phường Việt Hưng",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10106042",
    "id": "10106042",
    "name": "Phường Phúc Lợi",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10127043",
    "id": "10127043",
    "name": "Phường Hà Đông",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10127044",
    "id": "10127044",
    "name": "Phường Dương Nội",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10127045",
    "id": "10127045",
    "name": "Phường Yên Nghĩa",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10127046",
    "id": "10127046",
    "name": "Phường Phú Lương",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10127047",
    "id": "10127047",
    "name": "Phường Kiến Hưng",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10123048",
    "id": "10123048",
    "name": "Xã Thanh Trì",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10123049",
    "id": "10123049",
    "name": "Xã Đại Thanh",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10123050",
    "id": "10123050",
    "name": "Xã Nam Phù",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10123051",
    "id": "10123051",
    "name": "Xã Ngọc Hồi",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10123052",
    "id": "10123052",
    "name": "Phường Thanh Liệt",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10143053",
    "id": "10143053",
    "name": "Xã Thượng Phúc",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10143054",
    "id": "10143054",
    "name": "Xã Thường Tín",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10143055",
    "id": "10143055",
    "name": "Xã Chương Dương",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10143056",
    "id": "10143056",
    "name": "Xã Hồng Vân",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10149057",
    "id": "10149057",
    "name": "Xã Phú Xuyên",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10149058",
    "id": "10149058",
    "name": "Xã Phượng Dực",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10149059",
    "id": "10149059",
    "name": "Xã Chuyên Mỹ",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10149060",
    "id": "10149060",
    "name": "Xã Đại Xuyên",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10141061",
    "id": "10141061",
    "name": "Xã Thanh Oai",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10141062",
    "id": "10141062",
    "name": "Xã Bình Minh",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10141063",
    "id": "10141063",
    "name": "Xã Tam Hưng",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10141064",
    "id": "10141064",
    "name": "Xã Dân Hòa",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10147065",
    "id": "10147065",
    "name": "Xã Vân Đình",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10147066",
    "id": "10147066",
    "name": "Xã Ứng Thiên",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10147067",
    "id": "10147067",
    "name": "Xã Hòa Xá",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10147068",
    "id": "10147068",
    "name": "Xã Ứng Hòa",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10145069",
    "id": "10145069",
    "name": "Xã Mỹ Đức",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10145070",
    "id": "10145070",
    "name": "Xã Hồng Sơn",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10145071",
    "id": "10145071",
    "name": "Xã Phúc Sơn",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10145072",
    "id": "10145072",
    "name": "Xã Hương Sơn",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10153073",
    "id": "10153073",
    "name": "Phường Chương Mỹ",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10153074",
    "id": "10153074",
    "name": "Xã Phú Nghĩa",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10153075",
    "id": "10153075",
    "name": "Xã Xuân Mai",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10153076",
    "id": "10153076",
    "name": "Xã Trần Phú",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10153077",
    "id": "10153077",
    "name": "Xã Hòa Phú",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10153078",
    "id": "10153078",
    "name": "Xã Quảng Bị",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10151079",
    "id": "10151079",
    "name": "Xã Minh Châu",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10151080",
    "id": "10151080",
    "name": "Xã Quảng Oai",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10151081",
    "id": "10151081",
    "name": "Xã Vật Lại",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10151082",
    "id": "10151082",
    "name": "Xã Cổ Đô",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10151083",
    "id": "10151083",
    "name": "Xã Bất Bạt",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10151084",
    "id": "10151084",
    "name": "Xã Suối Hai",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10151085",
    "id": "10151085",
    "name": "Xã Ba Vì",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10151086",
    "id": "10151086",
    "name": "Xã Yên Bài",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10129087",
    "id": "10129087",
    "name": "Phường Sơn Tây",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10129088",
    "id": "10129088",
    "name": "Phường Tùng Thiện",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10129089",
    "id": "10129089",
    "name": "Xã Đoài Phương",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10131090",
    "id": "10131090",
    "name": "Xã Phúc Thọ",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10131091",
    "id": "10131091",
    "name": "Xã Phúc Lộc",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10131092",
    "id": "10131092",
    "name": "Xã Hát Môn",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10135093",
    "id": "10135093",
    "name": "Xã Thạch Thất",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10135094",
    "id": "10135094",
    "name": "Xã Hạ Bằng",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10135095",
    "id": "10135095",
    "name": "Xã Tây Phương",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10135096",
    "id": "10135096",
    "name": "Xã Hòa Lạc",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10135097",
    "id": "10135097",
    "name": "Xã Yên Xuân",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10139098",
    "id": "10139098",
    "name": "Xã Quốc Oai",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10139099",
    "id": "10139099",
    "name": "Xã Hưng Đạo",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10139100",
    "id": "10139100",
    "name": "Xã Kiều Phú",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10139101",
    "id": "10139101",
    "name": "Xã Phú Cát",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10137102",
    "id": "10137102",
    "name": "Xã hoài Đức",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10137103",
    "id": "10137103",
    "name": "Xã Dương Hòa",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10137104",
    "id": "10137104",
    "name": "Xã Sơn Đồng",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10137105",
    "id": "10137105",
    "name": "Xã An Khánh",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10133106",
    "id": "10133106",
    "name": "Xã Đan Phượng",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10133107",
    "id": "10133107",
    "name": "Xã Ô Diên",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10133108",
    "id": "10133108",
    "name": "Xã Liên Minh",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10119109",
    "id": "10119109",
    "name": "Xã Gia Lâm",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10119110",
    "id": "10119110",
    "name": "Xã Thuận An",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10119111",
    "id": "10119111",
    "name": "Xã Bát Tràng",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10119112",
    "id": "10119112",
    "name": "Xã Phù Đổng",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10117113",
    "id": "10117113",
    "name": "Xã Thư Lâm",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10117114",
    "id": "10117114",
    "name": "Xã Đông Anh",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10117115",
    "id": "10117115",
    "name": "Xã Phúc Thịnh",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10117116",
    "id": "10117116",
    "name": "Xã Thiên Lộc",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10117117",
    "id": "10117117",
    "name": "Xã Vĩnh Thanh",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10125118",
    "id": "10125118",
    "name": "Xã Mê Linh",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10125119",
    "id": "10125119",
    "name": "Xã Yên Lãng",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10125120",
    "id": "10125120",
    "name": "Xã Tiến Thắng",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10125121",
    "id": "10125121",
    "name": "Xã Quang Minh",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10115122",
    "id": "10115122",
    "name": "Xã Sóc Sơn",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10115123",
    "id": "10115123",
    "name": "Xã Đa Phúc",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10115124",
    "id": "10115124",
    "name": "Xã Nội Bài",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10115125",
    "id": "10115125",
    "name": "Xã Trung Giã",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_10115126",
    "id": "10115126",
    "name": "Xã Kim Anh",
    "provinceId": "08",
    "provinceName": "Thành phố Hà Nội",
    "level": 2
  },
  {
    "systemId": "W2_22113001",
    "id": "22113001",
    "name": "Xã Đại Sơn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22113002",
    "id": "22113002",
    "name": "Xã Sơn Động",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22113003",
    "id": "22113003",
    "name": "Xã Tây Yên Tử",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22113004",
    "id": "22113004",
    "name": "Xã Dương Hưu",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22113005",
    "id": "22113005",
    "name": "Xã Yên Định",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22113006",
    "id": "22113006",
    "name": "Xã An Lạc",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22113007",
    "id": "22113007",
    "name": "Xã Vân Sơn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22107008",
    "id": "22107008",
    "name": "Xã Biển Động",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22107009",
    "id": "22107009",
    "name": "Xã Lục Ngạn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22107010",
    "id": "22107010",
    "name": "Xã Đèo Gia",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22107011",
    "id": "22107011",
    "name": "Xã Sơn Hải",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22107012",
    "id": "22107012",
    "name": "Xã Tân Sơn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22107013",
    "id": "22107013",
    "name": "Xã Biên Sơn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22107014",
    "id": "22107014",
    "name": "Xã Sa Lý",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22107015",
    "id": "22107015",
    "name": "Xã Nam Dương",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22121016",
    "id": "22121016",
    "name": "Xã Kiên Lao",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22121017",
    "id": "22121017",
    "name": "Phường Chũ",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22121018",
    "id": "22121018",
    "name": "Phường Phượng Sơn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22115019",
    "id": "22115019",
    "name": "Xã Lục Sơn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22115020",
    "id": "22115020",
    "name": "Xã Trường Sơn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22115021",
    "id": "22115021",
    "name": "Xã Cẩm Lý",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22115022",
    "id": "22115022",
    "name": "Xã Đông Phú",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22115023",
    "id": "22115023",
    "name": "Xã Nghĩa Phương",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22115024",
    "id": "22115024",
    "name": "Xã Lục Nam",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22115025",
    "id": "22115025",
    "name": "Xã Bắc Lũng",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22115026",
    "id": "22115026",
    "name": "Xã Bảo Đài",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22111027",
    "id": "22111027",
    "name": "Xã Lạng Giang",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22111028",
    "id": "22111028",
    "name": "Xã Mỹ Thái",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22111029",
    "id": "22111029",
    "name": "Xã Kép",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22111030",
    "id": "22111030",
    "name": "Xã Tân Dĩnh",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22111031",
    "id": "22111031",
    "name": "Xã Tiên Lục",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22103032",
    "id": "22103032",
    "name": "Xã Yên Thế",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22103033",
    "id": "22103033",
    "name": "Xã Bố Hạ",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22103034",
    "id": "22103034",
    "name": "Xã Đồng Kỳ",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22103035",
    "id": "22103035",
    "name": "Xã Xuân Lương",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22103036",
    "id": "22103036",
    "name": "Xã Tam Tiến",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22105037",
    "id": "22105037",
    "name": "Xã Tân Yên",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22105038",
    "id": "22105038",
    "name": "Xã Ngọc Thiện",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22105039",
    "id": "22105039",
    "name": "Xã Nhã Nam",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22105040",
    "id": "22105040",
    "name": "Xã Phúc Hòa",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22105041",
    "id": "22105041",
    "name": "Xã Quang Trung",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22109042",
    "id": "22109042",
    "name": "Xã Hợp Thịnh",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22109043",
    "id": "22109043",
    "name": "Xã Hiệp Hòa",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22109044",
    "id": "22109044",
    "name": "Xã Hoàng Vân",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22109045",
    "id": "22109045",
    "name": "Xã Xuân Cẩm",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22117046",
    "id": "22117046",
    "name": "Phường Tự Lạn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22117047",
    "id": "22117047",
    "name": "Phường Việt Yên",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22117048",
    "id": "22117048",
    "name": "Phường Nếnh",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22117049",
    "id": "22117049",
    "name": "Phường Vân Hà",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22101050",
    "id": "22101050",
    "name": "Xã Đồng Việt",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22101051",
    "id": "22101051",
    "name": "Phường Bắc Giang",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22101052",
    "id": "22101052",
    "name": "Phường Đa Mai",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22101053",
    "id": "22101053",
    "name": "Phường Tiền Phong",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22101054",
    "id": "22101054",
    "name": "Phường Tân An",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22101055",
    "id": "22101055",
    "name": "Phường Yên Dũng",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22101056",
    "id": "22101056",
    "name": "Phường Tân Tiến",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22101057",
    "id": "22101057",
    "name": "Phường Cảnh Thụy",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22301058",
    "id": "22301058",
    "name": "Phường Kinh Bắc",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22301059",
    "id": "22301059",
    "name": "Phường Võ Cường",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22301060",
    "id": "22301060",
    "name": "Phường Vũ Ninh",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22301061",
    "id": "22301061",
    "name": "Phường Hạp Lĩnh",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22301062",
    "id": "22301062",
    "name": "Phường Nam Sơn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22313063",
    "id": "22313063",
    "name": "Phường Từ Sơn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22313064",
    "id": "22313064",
    "name": "Phường Tam Sơn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22313065",
    "id": "22313065",
    "name": "Phường Đồng Nguyên",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22313066",
    "id": "22313066",
    "name": "Phường Phù Khê",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22309067",
    "id": "22309067",
    "name": "Phường Thuận Thành",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22309068",
    "id": "22309068",
    "name": "Phường Mão Điền",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22309069",
    "id": "22309069",
    "name": "Phường Trạm Lộ",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22309070",
    "id": "22309070",
    "name": "Phường Trí Quả",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22309071",
    "id": "22309071",
    "name": "Phường Song Liễu",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22309072",
    "id": "22309072",
    "name": "Phường Ninh Xá",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22305073",
    "id": "22305073",
    "name": "Phường Quế Võ",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22305074",
    "id": "22305074",
    "name": "Phường Phương Liễu",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22305075",
    "id": "22305075",
    "name": "Phường Nhân Hòa",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22305076",
    "id": "22305076",
    "name": "Phường Đào Viên",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22305077",
    "id": "22305077",
    "name": "Phường Bồng Lai",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22305078",
    "id": "22305078",
    "name": "Xã Chi Lăng",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22305079",
    "id": "22305079",
    "name": "Xã Phù Lãng",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22303080",
    "id": "22303080",
    "name": "Xã Yên Phong",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22303081",
    "id": "22303081",
    "name": "Xã Văn Môn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22303082",
    "id": "22303082",
    "name": "Xã Tam Giang",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22303083",
    "id": "22303083",
    "name": "Xã Yên Trung",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22303084",
    "id": "22303084",
    "name": "Xã Tam Đa",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22307085",
    "id": "22307085",
    "name": "Xã Tiên Du",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22307086",
    "id": "22307086",
    "name": "Xã Liên Bão",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22307087",
    "id": "22307087",
    "name": "Xã Tân Chi",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22307088",
    "id": "22307088",
    "name": "Xã Đại Đồng",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22307089",
    "id": "22307089",
    "name": "Xã Phật Tích",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22315090",
    "id": "22315090",
    "name": "Xã Gia Bình",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22315091",
    "id": "22315091",
    "name": "Xã Nhân Thắng",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22315092",
    "id": "22315092",
    "name": "Xã Đại Lai",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22315093",
    "id": "22315093",
    "name": "Xã Cao Đức",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22315094",
    "id": "22315094",
    "name": "Xã Đông Cứu",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22311095",
    "id": "22311095",
    "name": "Xã Lương Tài",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22311096",
    "id": "22311096",
    "name": "Xã Lâm Thao",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22311097",
    "id": "22311097",
    "name": "Xã Trung Chính",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22311098",
    "id": "22311098",
    "name": "Xã Trung Kênh",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22113099",
    "id": "22113099",
    "name": "Xã Tuấn Đạo",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22521001",
    "id": "22521001",
    "name": "Phường An Sinh",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22521002",
    "id": "22521002",
    "name": "Phường Đông Triều",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22521003",
    "id": "22521003",
    "name": "Phường Bình Khê",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22521004",
    "id": "22521004",
    "name": "Phường Mạo Khê",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22521005",
    "id": "22521005",
    "name": "Phường Hoàng Quế",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22505006",
    "id": "22505006",
    "name": "Phường Yên Tử",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22505007",
    "id": "22505007",
    "name": "Phường Vàng Danh",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22505008",
    "id": "22505008",
    "name": "Phường Uông Bí",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22525009",
    "id": "22525009",
    "name": "Phường Đông Mai",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22525010",
    "id": "22525010",
    "name": "Phường Hiệp Hòa",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22525011",
    "id": "22525011",
    "name": "Phường Quảng Yên",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22525012",
    "id": "22525012",
    "name": "Phường Hà An",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22525013",
    "id": "22525013",
    "name": "Phường Phong Cốc",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22525014",
    "id": "22525014",
    "name": "Phường Liên Hòa",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22501015",
    "id": "22501015",
    "name": "Phường Tuần Châu",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22501016",
    "id": "22501016",
    "name": "Phường Việt Hưng",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22501017",
    "id": "22501017",
    "name": "Phường Bãi Cháy",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22501018",
    "id": "22501018",
    "name": "Phường Hà Tu",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22501019",
    "id": "22501019",
    "name": "Phường Hà Lầm",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22501020",
    "id": "22501020",
    "name": "Phường Cao Xanh",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22501021",
    "id": "22501021",
    "name": "Phường Hồng Gai",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22501022",
    "id": "22501022",
    "name": "Phường Hạ Long",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22501023",
    "id": "22501023",
    "name": "Phường Hoành Bồ",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22501024",
    "id": "22501024",
    "name": "Xã Quảng La",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22501025",
    "id": "22501025",
    "name": "Xã Thống Nhất",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22503026",
    "id": "22503026",
    "name": "Phường Mông Dương",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22503027",
    "id": "22503027",
    "name": "Phường Quang Hanh",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22503028",
    "id": "22503028",
    "name": "Phường Cẩm Phả",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22503029",
    "id": "22503029",
    "name": "Phường Cửa Ông",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22503030",
    "id": "22503030",
    "name": "Xã Hải Hòa",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22513031",
    "id": "22513031",
    "name": "Xã Tiên Yên",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22513032",
    "id": "22513032",
    "name": "Xã Điền Xá",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22513033",
    "id": "22513033",
    "name": "Xã Đông Ngũ",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22513034",
    "id": "22513034",
    "name": "Xã Hải Lạng",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22501035",
    "id": "22501035",
    "name": "Xã Lương Minh",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22515036",
    "id": "22515036",
    "name": "Xã Kỳ Thượng",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22515037",
    "id": "22515037",
    "name": "Xã Ba Chẽ",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22527038",
    "id": "22527038",
    "name": "Xã Quảng Tân",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22527039",
    "id": "22527039",
    "name": "Xã Đầm Hà",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22511040",
    "id": "22511040",
    "name": "Xã Quảng Hà",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22511041",
    "id": "22511041",
    "name": "Xã Đường Hoa",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22511042",
    "id": "22511042",
    "name": "Xã Quảng Đức",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22507043",
    "id": "22507043",
    "name": "Xã Hoành Mô",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22507044",
    "id": "22507044",
    "name": "Xã Lục Hồn",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22507045",
    "id": "22507045",
    "name": "Xã Bình Liêu",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22509046",
    "id": "22509046",
    "name": "Xã Hải Sơn",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22509047",
    "id": "22509047",
    "name": "Xã Hải Ninh",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22509048",
    "id": "22509048",
    "name": "Xã Vĩnh Thực",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22509049",
    "id": "22509049",
    "name": "Phường Móng Cái 1",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22509050",
    "id": "22509050",
    "name": "Phường Móng Cái 2",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22509051",
    "id": "22509051",
    "name": "Phường Móng Cái 3",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22517052",
    "id": "22517052",
    "name": "Đặc khu Vân Đồn",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22523053",
    "id": "22523053",
    "name": "Đặc khu Cô Tô",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_22511054",
    "id": "22511054",
    "name": "Xã Cái Chiên",
    "provinceId": "21",
    "provinceName": "Tỉnh Quảng Ninh",
    "level": 2
  },
  {
    "systemId": "W2_10311001",
    "id": "10311001",
    "name": "Phường Thuỷ Nguyên",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10311002",
    "id": "10311002",
    "name": "Phường Thiên Hương",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10311003",
    "id": "10311003",
    "name": "Phường Hòa Bình",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10311004",
    "id": "10311004",
    "name": "Phường Nam Triệu",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10311005",
    "id": "10311005",
    "name": "Phường Bạch Đằng",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10311006",
    "id": "10311006",
    "name": "Phường Lưu Kiếm",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10311007",
    "id": "10311007",
    "name": "Phường Lê Ích Mộc",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10301008",
    "id": "10301008",
    "name": "Phường Hồng Bàng",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10301009",
    "id": "10301009",
    "name": "Phường Hồng An",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10303010",
    "id": "10303010",
    "name": "Phường Ngô Quyền",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10303011",
    "id": "10303011",
    "name": "Phường Gia Viên",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10305012",
    "id": "10305012",
    "name": "Phường Lê Chân",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10305013",
    "id": "10305013",
    "name": "Phường An Biên",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10304014",
    "id": "10304014",
    "name": "Phường Hải An",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10304015",
    "id": "10304015",
    "name": "Phường Đông Hải",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10307016",
    "id": "10307016",
    "name": "Phường Kiến An",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10307017",
    "id": "10307017",
    "name": "Phường Phù Liễn",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10309018",
    "id": "10309018",
    "name": "Phường Nam Đồ Sơn",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10309019",
    "id": "10309019",
    "name": "Phường Đồ Sơn",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10327020",
    "id": "10327020",
    "name": "Phường Hưng Đạo",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10327021",
    "id": "10327021",
    "name": "Phường Dương Kinh",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10313022",
    "id": "10313022",
    "name": "Phường An Dương",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10313023",
    "id": "10313023",
    "name": "Phường An Hải",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10313024",
    "id": "10313024",
    "name": "Phường An Phong",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10315025",
    "id": "10315025",
    "name": "Xã An Hưng",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10315026",
    "id": "10315026",
    "name": "Xã An Khánh",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10315027",
    "id": "10315027",
    "name": "Xã An Quang",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10315028",
    "id": "10315028",
    "name": "Xã An Trường",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10315029",
    "id": "10315029",
    "name": "Xã An Lão",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10317030",
    "id": "10317030",
    "name": "Xã Kiến Thụy",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10317031",
    "id": "10317031",
    "name": "Xã Kiến Minh",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10317032",
    "id": "10317032",
    "name": "Xã Kiến Hải",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10317033",
    "id": "10317033",
    "name": "Xã Kiến Hưng",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10317034",
    "id": "10317034",
    "name": "Xã Nghi Dương",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10319035",
    "id": "10319035",
    "name": "Xã Quyết Thắng",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10319036",
    "id": "10319036",
    "name": "Xã Tiên Lãng",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10319037",
    "id": "10319037",
    "name": "Xã Tân Minh",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10319038",
    "id": "10319038",
    "name": "Xã Tiên Minh",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10319039",
    "id": "10319039",
    "name": "Xã Chấn Hưng",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10319040",
    "id": "10319040",
    "name": "Xã Hùng Thắng",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10321041",
    "id": "10321041",
    "name": "Xã Vĩnh Bảo",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10321042",
    "id": "10321042",
    "name": "Xã Nguyễn Bỉnh Khiêm",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10321043",
    "id": "10321043",
    "name": "Xã Vĩnh Am",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10321044",
    "id": "10321044",
    "name": "Xã Vĩnh Hải",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10321045",
    "id": "10321045",
    "name": "Xã Vĩnh Hòa",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10321046",
    "id": "10321046",
    "name": "Xã Vĩnh Thịnh",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10321047",
    "id": "10321047",
    "name": "Xã Vĩnh Thuận",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10311048",
    "id": "10311048",
    "name": "Xã Việt Khê",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10323049",
    "id": "10323049",
    "name": "Đặc khu Cát Hải",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10325050",
    "id": "10325050",
    "name": "Đặc khu Bạch Long Vĩ",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10701051",
    "id": "10701051",
    "name": "Phường Hải Dương",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10701052",
    "id": "10701052",
    "name": "Phường Lê Thanh Nghị",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10701053",
    "id": "10701053",
    "name": "Phường Việt Hòa",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10701054",
    "id": "10701054",
    "name": "Phường Thành Đông",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10701055",
    "id": "10701055",
    "name": "Phường Nam Đồng",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10701056",
    "id": "10701056",
    "name": "Phường Tân Hưng",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10701057",
    "id": "10701057",
    "name": "Phường Thạch Khôi",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10717058",
    "id": "10717058",
    "name": "Phường Tứ Minh",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10701059",
    "id": "10701059",
    "name": "Phường Ái Quốc",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10703060",
    "id": "10703060",
    "name": "Phường Chu Văn An",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10703061",
    "id": "10703061",
    "name": "Phường Chí Linh",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10703062",
    "id": "10703062",
    "name": "Phường Trần Hưng Đạo",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10703063",
    "id": "10703063",
    "name": "Phường Nguyễn Trãi",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10703064",
    "id": "10703064",
    "name": "Phường Trần Nhân Tông",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10703065",
    "id": "10703065",
    "name": "Phường Lê Đại Hành",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10709066",
    "id": "10709066",
    "name": "Phường Kinh Môn",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10709067",
    "id": "10709067",
    "name": "Phường Nguyễn Đại Năng",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10709068",
    "id": "10709068",
    "name": "Phường Trần Liễu",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10709069",
    "id": "10709069",
    "name": "Phường Bắc An Phụ",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10709070",
    "id": "10709070",
    "name": "Phường Phạm Sư Mạnh",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10709071",
    "id": "10709071",
    "name": "Phường Nhị Chiểu",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10709072",
    "id": "10709072",
    "name": "Xã Nam An Phụ",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10705073",
    "id": "10705073",
    "name": "Xã Nam Sách",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10705074",
    "id": "10705074",
    "name": "Xã Thái Tân",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10705075",
    "id": "10705075",
    "name": "Xã Hợp Tiến",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10705076",
    "id": "10705076",
    "name": "Xã Trần Phú",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10705077",
    "id": "10705077",
    "name": "Xã An Phú",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10707078",
    "id": "10707078",
    "name": "Xã Thanh Hà",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10707079",
    "id": "10707079",
    "name": "Xã Hà Tây",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10707080",
    "id": "10707080",
    "name": "Xã Hà Bắc",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10707081",
    "id": "10707081",
    "name": "Xã Hà Nam",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10707082",
    "id": "10707082",
    "name": "Xã Hà Đông",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10717083",
    "id": "10717083",
    "name": "Xã Cẩm Giang",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10717084",
    "id": "10717084",
    "name": "Xã Tuệ Tĩnh",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10717085",
    "id": "10717085",
    "name": "Xã Mao Điền",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10717086",
    "id": "10717086",
    "name": "Xã Cẩm Giàng",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10719087",
    "id": "10719087",
    "name": "Xã Kẻ Sặt",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10719088",
    "id": "10719088",
    "name": "Xã Bình Giang",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10719089",
    "id": "10719089",
    "name": "Xã Đường An",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10719090",
    "id": "10719090",
    "name": "Xã Thượng Hồng",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10713091",
    "id": "10713091",
    "name": "Xã Gia Lộc",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10713092",
    "id": "10713092",
    "name": "Xã Yết Kiêu",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10713093",
    "id": "10713093",
    "name": "Xã Gia Phúc",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10713094",
    "id": "10713094",
    "name": "Xã Trường Tân",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10715095",
    "id": "10715095",
    "name": "Xã Tứ Kỳ",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10715096",
    "id": "10715096",
    "name": "Xã Tân Kỳ",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10715097",
    "id": "10715097",
    "name": "Xã Đại Sơn",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10715098",
    "id": "10715098",
    "name": "Xã Chí Minh",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10715099",
    "id": "10715099",
    "name": "Xã Lạc Phượng",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10715100",
    "id": "10715100",
    "name": "Xã Nguyên Giáp",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10723101",
    "id": "10723101",
    "name": "Xã Ninh Giang",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10723102",
    "id": "10723102",
    "name": "Xã Vĩnh Lại",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10723103",
    "id": "10723103",
    "name": "Xã Khúc Thừa Dụ",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10723104",
    "id": "10723104",
    "name": "Xã Tân An",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10723105",
    "id": "10723105",
    "name": "Xã Hồng Châu",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10721106",
    "id": "10721106",
    "name": "Xã Thanh Miện",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10721107",
    "id": "10721107",
    "name": "Xã Bắc Thanh Miện",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10721108",
    "id": "10721108",
    "name": "Xã Hải Hưng",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10721109",
    "id": "10721109",
    "name": "Xã Nguyễn Lương Bằng",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10721110",
    "id": "10721110",
    "name": "Xã Nam Thanh Miện",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10711111",
    "id": "10711111",
    "name": "Xã Phú Thái",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10711112",
    "id": "10711112",
    "name": "Xã Lai Khê",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10711113",
    "id": "10711113",
    "name": "Xã An Thành",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10711114",
    "id": "10711114",
    "name": "Xã Kim Thành",
    "provinceId": "11",
    "provinceName": "Thành phố Hải Phòng",
    "level": 2
  },
  {
    "systemId": "W2_10901001",
    "id": "10901001",
    "name": "Phường Phố Hiến",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10901002",
    "id": "10901002",
    "name": "Phường Sơn Nam",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10901003",
    "id": "10901003",
    "name": "Phường Hồng Châu",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10903004",
    "id": "10903004",
    "name": "Phường Mỹ Hào",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10903005",
    "id": "10903005",
    "name": "Phường Đường Hào",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10903006",
    "id": "10903006",
    "name": "Phường Thượng Hồng",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10901007",
    "id": "10901007",
    "name": "Xã Tân Hưng",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10913008",
    "id": "10913008",
    "name": "Xã Hoàng Hoa Thám",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10913009",
    "id": "10913009",
    "name": "Xã Tiên Lữ",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10913010",
    "id": "10913010",
    "name": "Xã Tiên Hoa",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10911011",
    "id": "10911011",
    "name": "Xã Quang Hưng",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10911012",
    "id": "10911012",
    "name": "Xã Đoàn Đào",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10911013",
    "id": "10911013",
    "name": "Xã Tiên Tiến",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10911014",
    "id": "10911014",
    "name": "Xã Tống Trân",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10909015",
    "id": "10909015",
    "name": "Xã Lương Bằng",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10909016",
    "id": "10909016",
    "name": "Xã Nghĩa Dân",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10909017",
    "id": "10909017",
    "name": "Xã Hiệp Cường",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10909018",
    "id": "10909018",
    "name": "Xã Đức Hợp",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10907019",
    "id": "10907019",
    "name": "Xã Ân Thi",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10907020",
    "id": "10907020",
    "name": "Xã Xuân Trúc",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10907021",
    "id": "10907021",
    "name": "Xã Phạm Ngũ Lão",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10907022",
    "id": "10907022",
    "name": "Xã Nguyễn Trãi",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10907023",
    "id": "10907023",
    "name": "Xã Hồng Quang",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10905024",
    "id": "10905024",
    "name": "Xã Khoái Châu",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10905025",
    "id": "10905025",
    "name": "Xã Triệu Việt Vương",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10905026",
    "id": "10905026",
    "name": "Xã Việt Tiến",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10905027",
    "id": "10905027",
    "name": "Xã Chí Minh",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10905028",
    "id": "10905028",
    "name": "Xã Châu Ninh",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10919029",
    "id": "10919029",
    "name": "Xã Yên Mỹ",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10919030",
    "id": "10919030",
    "name": "Xã Việt Yên",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10919031",
    "id": "10919031",
    "name": "Xã Hoàn Long",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10919032",
    "id": "10919032",
    "name": "Xã Nguyễn Văn Linh",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10917033",
    "id": "10917033",
    "name": "Xã Như Quỳnh",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10917034",
    "id": "10917034",
    "name": "Xã Lạc Đạo",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10917035",
    "id": "10917035",
    "name": "Xã Đại Đồng",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10915036",
    "id": "10915036",
    "name": "Xã Nghĩa Trụ",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10915037",
    "id": "10915037",
    "name": "Xã Phụng Công",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10915038",
    "id": "10915038",
    "name": "Xã Văn Giang",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_10915039",
    "id": "10915039",
    "name": "Xã Mễ Sở",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11501040",
    "id": "11501040",
    "name": "Phường Thái Bình",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11501041",
    "id": "11501041",
    "name": "Phường Trần Lãm",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11501042",
    "id": "11501042",
    "name": "Phường Trần Hưng Đạo",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11501043",
    "id": "11501043",
    "name": "Phường Trà Lý",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11501044",
    "id": "11501044",
    "name": "Phường Vũ Phúc",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11507045",
    "id": "11507045",
    "name": "Xã Thái Thụy",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11507046",
    "id": "11507046",
    "name": "Xã Đông Thụy Anh",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11507047",
    "id": "11507047",
    "name": "Xã Bắc Thụy Anh",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11507048",
    "id": "11507048",
    "name": "Xã Thụy Anh",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11507049",
    "id": "11507049",
    "name": "Xã Nam Thụy Anh",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11507050",
    "id": "11507050",
    "name": "Xã Bắc Thái Ninh",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11507051",
    "id": "11507051",
    "name": "Xã Thái Ninh",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11507052",
    "id": "11507052",
    "name": "Xã Đông Thái Ninh",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11507053",
    "id": "11507053",
    "name": "Xã Nam Thái Ninh",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11507054",
    "id": "11507054",
    "name": "Xã Tây Thái Ninh",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11507055",
    "id": "11507055",
    "name": "Xã Tây Thụy Anh",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11515056",
    "id": "11515056",
    "name": "Xã Tiền Hải",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11515057",
    "id": "11515057",
    "name": "Xã Tây Tiền Hải",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11515058",
    "id": "11515058",
    "name": "Xã Ái Quốc",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11515059",
    "id": "11515059",
    "name": "Xã Đồng Châu",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11515060",
    "id": "11515060",
    "name": "Xã Đông Tiền Hải",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11515061",
    "id": "11515061",
    "name": "Xã Nam Cường",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11515062",
    "id": "11515062",
    "name": "Xã Hưng Phú",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11515063",
    "id": "11515063",
    "name": "Xã Nam Tiền Hải",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11503064",
    "id": "11503064",
    "name": "Xã Quỳnh Phụ",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11503065",
    "id": "11503065",
    "name": "Xã Minh Thọ",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11503066",
    "id": "11503066",
    "name": "Xã Nguyễn Du",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11503067",
    "id": "11503067",
    "name": "Xã Quỳnh An",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11503068",
    "id": "11503068",
    "name": "Xã Ngọc Lâm",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11503069",
    "id": "11503069",
    "name": "Xã Đồng Bằng",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11503070",
    "id": "11503070",
    "name": "Xã A Sào",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11503071",
    "id": "11503071",
    "name": "Xã Phụ Dực",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11503072",
    "id": "11503072",
    "name": "Xã Tân Tiến",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11505073",
    "id": "11505073",
    "name": "Xã Hưng Hà",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11505074",
    "id": "11505074",
    "name": "Xã Tiên La",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11505075",
    "id": "11505075",
    "name": "Xã Lê Quý Đôn",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11505076",
    "id": "11505076",
    "name": "Xã Hồng Minh",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11505077",
    "id": "11505077",
    "name": "Xã Thần Khê",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11505078",
    "id": "11505078",
    "name": "Xã Diên Hà",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11505079",
    "id": "11505079",
    "name": "Xã Ngự Thiên",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11505080",
    "id": "11505080",
    "name": "Xã Long Hưng",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11509081",
    "id": "11509081",
    "name": "Xã Đông Hưng",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11509082",
    "id": "11509082",
    "name": "Xã Bắc Tiên Hưng",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11509083",
    "id": "11509083",
    "name": "Xã Đông Tiên Hưng",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11509084",
    "id": "11509084",
    "name": "Xã Nam Đông Hưng",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11509085",
    "id": "11509085",
    "name": "Xã Bắc Đông Quan",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11509086",
    "id": "11509086",
    "name": "Xã Bắc Đông Hưng",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11509087",
    "id": "11509087",
    "name": "Xã Đông Quan",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11509088",
    "id": "11509088",
    "name": "Xã Nam Tiên Hưng",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11509089",
    "id": "11509089",
    "name": "Xã Tiên Hưng",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11513090",
    "id": "11513090",
    "name": "Xã Lê Lợi",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11513091",
    "id": "11513091",
    "name": "Xã Kiến Xương",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11513092",
    "id": "11513092",
    "name": "Xã Quang Lịch",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11513093",
    "id": "11513093",
    "name": "Xã Vũ Quý",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11513094",
    "id": "11513094",
    "name": "Xã Bình Thanh",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11513095",
    "id": "11513095",
    "name": "Xã Bình Định",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11513096",
    "id": "11513096",
    "name": "Xã Hồng Vũ",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11513097",
    "id": "11513097",
    "name": "Xã Bình Nguyên",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11513098",
    "id": "11513098",
    "name": "Xã Trà Giang",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11511099",
    "id": "11511099",
    "name": "Xã Vũ Thư",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11511100",
    "id": "11511100",
    "name": "Xã Thư Trì",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11511101",
    "id": "11511101",
    "name": "Xã Tân Thuận",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11511102",
    "id": "11511102",
    "name": "Xã Thư Vũ",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11511103",
    "id": "11511103",
    "name": "Xã Vũ Tiên",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11511104",
    "id": "11511104",
    "name": "Xã Vạn Xuân",
    "provinceId": "10",
    "provinceName": "Tỉnh Hưng Yên",
    "level": 2
  },
  {
    "systemId": "W2_11707001",
    "id": "11707001",
    "name": "Xã Gia Viễn",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11707002",
    "id": "11707002",
    "name": "Xã Đại Hoàng",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11707003",
    "id": "11707003",
    "name": "Xã Gia Hưng",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11707004",
    "id": "11707004",
    "name": "Xã Gia Phong",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11707005",
    "id": "11707005",
    "name": "Xã Gia Vân",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11707006",
    "id": "11707006",
    "name": "Xã Gia Trấn",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11705007",
    "id": "11705007",
    "name": "Xã Nho Quan",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11705008",
    "id": "11705008",
    "name": "Xã Gia Lâm",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11705009",
    "id": "11705009",
    "name": "Xã Gia Tường",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11705010",
    "id": "11705010",
    "name": "Xã Phú Sơn",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11705011",
    "id": "11705011",
    "name": "Xã Cúc Phương",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11705012",
    "id": "11705012",
    "name": "Xã Phú Long",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11705013",
    "id": "11705013",
    "name": "Xã Thanh Sơn",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11705014",
    "id": "11705014",
    "name": "Xã Quỳnh Lưu",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11713015",
    "id": "11713015",
    "name": "Xã Yên Khánh",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11713016",
    "id": "11713016",
    "name": "Xã Khánh Nhạc",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11713017",
    "id": "11713017",
    "name": "Xã Khánh Thiện",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11713018",
    "id": "11713018",
    "name": "Xã Khánh Hội",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11713019",
    "id": "11713019",
    "name": "Xã Khánh Trung",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11711020",
    "id": "11711020",
    "name": "Xã Yên Mô",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11711021",
    "id": "11711021",
    "name": "Xã Yên Từ",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11711022",
    "id": "11711022",
    "name": "Xã Yên Mạc",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11711023",
    "id": "11711023",
    "name": "Xã Đồng Thái",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11715024",
    "id": "11715024",
    "name": "Xã Chất Bình",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11715025",
    "id": "11715025",
    "name": "Xã Kim Sơn",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11715026",
    "id": "11715026",
    "name": "Xã Quang Thiện",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11715027",
    "id": "11715027",
    "name": "Xã Phát Diệm",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11715028",
    "id": "11715028",
    "name": "Xã Lai Thành",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11715029",
    "id": "11715029",
    "name": "Xã Định Hóa",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11715030",
    "id": "11715030",
    "name": "Xã Bình Minh",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11715031",
    "id": "11715031",
    "name": "Xã Kim Đông",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11111032",
    "id": "11111032",
    "name": "Xã Bình Lục",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11111033",
    "id": "11111033",
    "name": "Xã Bình Mỹ",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11111034",
    "id": "11111034",
    "name": "Xã Bình An",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11111035",
    "id": "11111035",
    "name": "Xã Bình Giang",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11111036",
    "id": "11111036",
    "name": "Xã Bình Sơn",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11109037",
    "id": "11109037",
    "name": "Xã Liêm Hà",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11109038",
    "id": "11109038",
    "name": "Xã Tân Thanh",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11109039",
    "id": "11109039",
    "name": "Xã Thanh Bình",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11109040",
    "id": "11109040",
    "name": "Xã Thanh Lâm",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11109041",
    "id": "11109041",
    "name": "Xã Thanh Liêm",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11107042",
    "id": "11107042",
    "name": "Xã Lý Nhân",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11107043",
    "id": "11107043",
    "name": "Xã Nam Xang",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11107044",
    "id": "11107044",
    "name": "Xã Bắc Lý",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11107045",
    "id": "11107045",
    "name": "Xã Vĩnh Trụ",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11107046",
    "id": "11107046",
    "name": "Xã Trần Thương",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11107047",
    "id": "11107047",
    "name": "Xã Nhân Hà",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11107048",
    "id": "11107048",
    "name": "Xã Nam Lý",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11309049",
    "id": "11309049",
    "name": "Xã Nam Trực",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11309050",
    "id": "11309050",
    "name": "Xã Nam Minh",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11309051",
    "id": "11309051",
    "name": "Xã Nam Đồng",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11309052",
    "id": "11309052",
    "name": "Xã Nam Ninh",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11309053",
    "id": "11309053",
    "name": "Xã Nam Hồng",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11303054",
    "id": "11303054",
    "name": "Xã Minh Tân",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11303055",
    "id": "11303055",
    "name": "Xã Hiển Khánh",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11303056",
    "id": "11303056",
    "name": "Xã Vụ Bản",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11303057",
    "id": "11303057",
    "name": "Xã Liên Minh",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11307058",
    "id": "11307058",
    "name": "Xã Ý Yên",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11307059",
    "id": "11307059",
    "name": "Xã Yên Đồng",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11307060",
    "id": "11307060",
    "name": "Xã Yên Cường",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11307061",
    "id": "11307061",
    "name": "Xã Vạn Thắng",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11307062",
    "id": "11307062",
    "name": "Xã Vũ Dương",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11307063",
    "id": "11307063",
    "name": "Xã Tân Minh",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11307064",
    "id": "11307064",
    "name": "Xã Phong Doanh",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11311065",
    "id": "11311065",
    "name": "Xã Cổ Lễ",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11311066",
    "id": "11311066",
    "name": "Xã Ninh Giang",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11311067",
    "id": "11311067",
    "name": "Xã Cát Thành",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11311068",
    "id": "11311068",
    "name": "Xã Trực Ninh",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11311069",
    "id": "11311069",
    "name": "Xã Quang Hưng",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11311070",
    "id": "11311070",
    "name": "Xã Minh Thái",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11311071",
    "id": "11311071",
    "name": "Xã Ninh Cường",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11313072",
    "id": "11313072",
    "name": "Xã Xuân Trường",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11313073",
    "id": "11313073",
    "name": "Xã Xuân Hưng",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11313074",
    "id": "11313074",
    "name": "Xã Xuân Giang",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11313075",
    "id": "11313075",
    "name": "Xã Xuân Hồng",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11319076",
    "id": "11319076",
    "name": "Xã Hải Hậu",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11319077",
    "id": "11319077",
    "name": "Xã Hải Anh",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11319078",
    "id": "11319078",
    "name": "Xã Hải Tiến",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11319079",
    "id": "11319079",
    "name": "Xã Hải Hưng",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11319080",
    "id": "11319080",
    "name": "Xã Hải An",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11319081",
    "id": "11319081",
    "name": "Xã Hải Quang",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11319082",
    "id": "11319082",
    "name": "Xã Hải Xuân",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11319083",
    "id": "11319083",
    "name": "Xã Hải Thịnh",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11315084",
    "id": "11315084",
    "name": "Xã Giao Minh",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11315085",
    "id": "11315085",
    "name": "Xã Giao Hòa",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11315086",
    "id": "11315086",
    "name": "Xã Giao Thuỷ",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11315087",
    "id": "11315087",
    "name": "Xã Giao Phúc",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11315088",
    "id": "11315088",
    "name": "Xã Giao Hưng",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11315089",
    "id": "11315089",
    "name": "Xã Giao Bình",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11315090",
    "id": "11315090",
    "name": "Xã Giao Ninh",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11317091",
    "id": "11317091",
    "name": "Xã Đồng Thịnh",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11317092",
    "id": "11317092",
    "name": "Xã Nghĩa Hưng",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11317093",
    "id": "11317093",
    "name": "Xã Nghĩa Sơn",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11317094",
    "id": "11317094",
    "name": "Xã Hồng Phong",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11317095",
    "id": "11317095",
    "name": "Xã Quỹ Nhất",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11317096",
    "id": "11317096",
    "name": "Xã Nghĩa Lâm",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11317097",
    "id": "11317097",
    "name": "Xã Rạng Đông",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11709098",
    "id": "11709098",
    "name": "Phường Tây Hoa Lư",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11709099",
    "id": "11709099",
    "name": "Phường Hoa Lư",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11709100",
    "id": "11709100",
    "name": "Phường Nam Hoa Lư",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11713101",
    "id": "11713101",
    "name": "Phường Đông Hoa Lư",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11703102",
    "id": "11703102",
    "name": "Phường Tam Điệp",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11703103",
    "id": "11703103",
    "name": "Phường Yên Sơn",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11703104",
    "id": "11703104",
    "name": "Phường Trung Sơn",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11703105",
    "id": "11703105",
    "name": "Phường Yên Thắng",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11101106",
    "id": "11101106",
    "name": "Phường Hà Nam",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11101107",
    "id": "11101107",
    "name": "Phường Phủ Lý",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11101108",
    "id": "11101108",
    "name": "Phường Phù Vân",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11101109",
    "id": "11101109",
    "name": "Phường Châu Sơn",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11101110",
    "id": "11101110",
    "name": "Phường Liêm Tuyền",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11103111",
    "id": "11103111",
    "name": "Phường Duy Tiên",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11103112",
    "id": "11103112",
    "name": "Phường Duy Tân",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11103113",
    "id": "11103113",
    "name": "Phường Đồng Văn",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11103114",
    "id": "11103114",
    "name": "Phường Duy Hà",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11103115",
    "id": "11103115",
    "name": "Phường Tiên Sơn",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11105116",
    "id": "11105116",
    "name": "Phường Lê Hồ",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11105117",
    "id": "11105117",
    "name": "Phường Nguyễn Úy",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11105118",
    "id": "11105118",
    "name": "Phường Lý Thường Kiệt",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11105119",
    "id": "11105119",
    "name": "Phường Kim Thanh",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11105120",
    "id": "11105120",
    "name": "Phường Tam Chúc",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11105121",
    "id": "11105121",
    "name": "Phường Kim Bảng",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11301122",
    "id": "11301122",
    "name": "Phường Nam Định",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11301123",
    "id": "11301123",
    "name": "Phường Thiên Trường",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11301124",
    "id": "11301124",
    "name": "Phường Đông A",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11301125",
    "id": "11301125",
    "name": "Phường Vị Khê",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11301126",
    "id": "11301126",
    "name": "Phường Thành Nam",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11301127",
    "id": "11301127",
    "name": "Phường Trường Thi",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11309128",
    "id": "11309128",
    "name": "Phường Hồng Quang",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_11301129",
    "id": "11301129",
    "name": "Phường Mỹ Lộc",
    "provinceId": "18",
    "provinceName": "Tỉnh Ninh Bình",
    "level": 2
  },
  {
    "systemId": "W2_20301001",
    "id": "20301001",
    "name": "Phường Thục Phán",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20301002",
    "id": "20301002",
    "name": "Phường Nùng Trí Cao",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20301003",
    "id": "20301003",
    "name": "Phường Tân Giang",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20323004",
    "id": "20323004",
    "name": "Xã Quảng Lâm",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20323005",
    "id": "20323005",
    "name": "Xã Nam Quang",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20323006",
    "id": "20323006",
    "name": "Xã Lý Bôn",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20323007",
    "id": "20323007",
    "name": "Xã Bảo Lâm",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20323008",
    "id": "20323008",
    "name": "Xã Yên Thổ",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20303009",
    "id": "20303009",
    "name": "Xã Sơn Lộ",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20303010",
    "id": "20303010",
    "name": "Xã Hưng Đạo",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20303011",
    "id": "20303011",
    "name": "Xã Bảo Lạc",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20303012",
    "id": "20303012",
    "name": "Xã Cốc Pàng",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20303013",
    "id": "20303013",
    "name": "Xã Cô Ba",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20303014",
    "id": "20303014",
    "name": "Xã Khánh Xuân",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20303015",
    "id": "20303015",
    "name": "Xã Xuân Trường",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20303016",
    "id": "20303016",
    "name": "Xã Huy Giáp",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20313017",
    "id": "20313017",
    "name": "Xã Ca Thành",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20313018",
    "id": "20313018",
    "name": "Xã Phan Thanh",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20313019",
    "id": "20313019",
    "name": "Xã Thành Công",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20313020",
    "id": "20313020",
    "name": "Xã Tĩnh Túc",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20313021",
    "id": "20313021",
    "name": "Xã Tam Kim",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20313022",
    "id": "20313022",
    "name": "Xã Nguyên Bình",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20313023",
    "id": "20313023",
    "name": "Xã Minh Tâm",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20305024",
    "id": "20305024",
    "name": "Xã Thanh Long",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20305025",
    "id": "20305025",
    "name": "Xã Cần Yên",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20305026",
    "id": "20305026",
    "name": "Xã Thông Nông",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20305027",
    "id": "20305027",
    "name": "Xã Trường Hà",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20305028",
    "id": "20305028",
    "name": "Xã Hà Quảng",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20305029",
    "id": "20305029",
    "name": "Xã Lũng Nặm",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20305030",
    "id": "20305030",
    "name": "Xã Tổng Cọt",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20315031",
    "id": "20315031",
    "name": "Xã Nam Tuấn",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20315032",
    "id": "20315032",
    "name": "Xã Hòa An",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20315033",
    "id": "20315033",
    "name": "Xã Bạch Đằng",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20315034",
    "id": "20315034",
    "name": "Xã Nguyễn Huệ",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20321035",
    "id": "20321035",
    "name": "Xã Minh Khai",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20321036",
    "id": "20321036",
    "name": "Xã Canh Tân",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20321037",
    "id": "20321037",
    "name": "Xã Kim Đồng",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20321038",
    "id": "20321038",
    "name": "Xã Thạch An",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20321039",
    "id": "20321039",
    "name": "Xã Đông Khê",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20321040",
    "id": "20321040",
    "name": "Xã Đức Long",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20317041",
    "id": "20317041",
    "name": "Xã Phục Hòa",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20317042",
    "id": "20317042",
    "name": "Xã Bế Văn Đàn",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20317043",
    "id": "20317043",
    "name": "Xã Độc Lập",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20317044",
    "id": "20317044",
    "name": "Xã Quảng Uyên",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20317045",
    "id": "20317045",
    "name": "Xã Hạnh Phúc",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20311046",
    "id": "20311046",
    "name": "Xã Quang Hán",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20311047",
    "id": "20311047",
    "name": "Xã Trà Lĩnh",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20311048",
    "id": "20311048",
    "name": "Xã Quang Trung",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20311049",
    "id": "20311049",
    "name": "Xã Đoài Dương",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20311050",
    "id": "20311050",
    "name": "Xã Trùng Khánh",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20311051",
    "id": "20311051",
    "name": "Xã Đàm Thuỷ",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20311052",
    "id": "20311052",
    "name": "Xã Đình Phong",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20319053",
    "id": "20319053",
    "name": "Xã Lý Quốc",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20319054",
    "id": "20319054",
    "name": "Xã Hạ Lang",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20319055",
    "id": "20319055",
    "name": "Xã Vinh Quý",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_20319056",
    "id": "20319056",
    "name": "Xã Quang Long",
    "provinceId": "03",
    "provinceName": "Tỉnh Cao Bằng",
    "level": 2
  },
  {
    "systemId": "W2_21113001",
    "id": "21113001",
    "name": "Xã Thượng Lâm",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21113002",
    "id": "21113002",
    "name": "Xã Lâm Bình",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21113003",
    "id": "21113003",
    "name": "Xã Minh Quang",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21113004",
    "id": "21113004",
    "name": "Xã Bình An",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21103005",
    "id": "21103005",
    "name": "Xã Côn Lôn",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21103006",
    "id": "21103006",
    "name": "Xã Yên Hoa",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21103007",
    "id": "21103007",
    "name": "Xã Thượng Nông",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21103008",
    "id": "21103008",
    "name": "Xã Hồng Thái",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21103009",
    "id": "21103009",
    "name": "Xã Nà Hang",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21105010",
    "id": "21105010",
    "name": "Xã Tân Mỹ",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21105011",
    "id": "21105011",
    "name": "Xã Yên Lập",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21105012",
    "id": "21105012",
    "name": "Xã Tân An",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21105013",
    "id": "21105013",
    "name": "Xã Chiêm Hoá",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21105014",
    "id": "21105014",
    "name": "Xã Hòa An",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21105015",
    "id": "21105015",
    "name": "Xã Kiên Đài",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21105016",
    "id": "21105016",
    "name": "Xã Tri Phú",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21105017",
    "id": "21105017",
    "name": "Xã Kim Bình",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21105018",
    "id": "21105018",
    "name": "Xã Yên Nguyên",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21105019",
    "id": "21105019",
    "name": "Xã Trung Hà",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21107020",
    "id": "21107020",
    "name": "Xã Yên Phú",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21107021",
    "id": "21107021",
    "name": "Xã Bạch Xa",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21107022",
    "id": "21107022",
    "name": "Xã Phù Lưu",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21107023",
    "id": "21107023",
    "name": "Xã Hàm Yên",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21107024",
    "id": "21107024",
    "name": "Xã Bình Xa",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21107025",
    "id": "21107025",
    "name": "Xã Thái Sơn",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21107026",
    "id": "21107026",
    "name": "Xã Thái Hòa",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21107027",
    "id": "21107027",
    "name": "Xã Hùng Đức",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21109028",
    "id": "21109028",
    "name": "Xã Hùng Lợi",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21109029",
    "id": "21109029",
    "name": "Xã Trung Sơn",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21109030",
    "id": "21109030",
    "name": "Xã Thái Bình",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21109031",
    "id": "21109031",
    "name": "Xã Tân Long",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21109032",
    "id": "21109032",
    "name": "Xã Xuân Vân",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21109033",
    "id": "21109033",
    "name": "Xã Lực Hành",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21109034",
    "id": "21109034",
    "name": "Xã Yên Sơn",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21109035",
    "id": "21109035",
    "name": "Xã Nhữ Khê",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21109036",
    "id": "21109036",
    "name": "Xã Kiến Thiết",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21111037",
    "id": "21111037",
    "name": "Xã Tân Trào",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21111038",
    "id": "21111038",
    "name": "Xã Minh Thanh",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21111039",
    "id": "21111039",
    "name": "Xã Sơn Dương",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21111040",
    "id": "21111040",
    "name": "Xã Bình Ca",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21111041",
    "id": "21111041",
    "name": "Xã Tân Thanh",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21111042",
    "id": "21111042",
    "name": "Xã Sơn Thuỷ",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21111043",
    "id": "21111043",
    "name": "Xã Phú Lương",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21111044",
    "id": "21111044",
    "name": "Xã Trường Sinh",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21111045",
    "id": "21111045",
    "name": "Xã Hồng Sơn",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21111046",
    "id": "21111046",
    "name": "Xã Đông Thọ",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21101047",
    "id": "21101047",
    "name": "Phường Mỹ Lâm",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21101048",
    "id": "21101048",
    "name": "Phường Minh Xuân",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21101049",
    "id": "21101049",
    "name": "Phường Nông Tiến",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21101050",
    "id": "21101050",
    "name": "Phường An Tường",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21101051",
    "id": "21101051",
    "name": "Phường Bình Thuận",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20103052",
    "id": "20103052",
    "name": "Xã Lũng Cú",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20103053",
    "id": "20103053",
    "name": "Xã Đồng Văn",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20103054",
    "id": "20103054",
    "name": "Xã Sà Phìn",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20103055",
    "id": "20103055",
    "name": "Xã Phố Bảng",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20103056",
    "id": "20103056",
    "name": "Xã Lũng Phìn",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20105057",
    "id": "20105057",
    "name": "Xã Sủng Máng",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20105058",
    "id": "20105058",
    "name": "Xã Sơn Vĩ",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20105059",
    "id": "20105059",
    "name": "Xã Mèo Vạc",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20105060",
    "id": "20105060",
    "name": "Xã Khâu Vai",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20105061",
    "id": "20105061",
    "name": "Xã Niêm Sơn",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20105062",
    "id": "20105062",
    "name": "Xã Tát Ngà",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20107063",
    "id": "20107063",
    "name": "Xã Thắng Mố",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20107064",
    "id": "20107064",
    "name": "Xã Bạch Đích",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20107065",
    "id": "20107065",
    "name": "Xã Yên Minh",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20107066",
    "id": "20107066",
    "name": "Xã Mậu Duệ",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20107067",
    "id": "20107067",
    "name": "Xã Ngọc Long",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20107068",
    "id": "20107068",
    "name": "Xã Du Già",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20107069",
    "id": "20107069",
    "name": "Xã Đường Thượng",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20109070",
    "id": "20109070",
    "name": "Xã Lùng Tám",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20109071",
    "id": "20109071",
    "name": "Xã Cán Tỷ",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20109072",
    "id": "20109072",
    "name": "Xã Nghĩa Thuận",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20109073",
    "id": "20109073",
    "name": "Xã Quản Bạ",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20109074",
    "id": "20109074",
    "name": "Xã Tùng Vài",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20111075",
    "id": "20111075",
    "name": "Xã Yên Cường",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20111076",
    "id": "20111076",
    "name": "Xã Đường Hồng",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20111077",
    "id": "20111077",
    "name": "Xã Bắc Mê",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20111078",
    "id": "20111078",
    "name": "Xã Giáp Trung",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20111079",
    "id": "20111079",
    "name": "Xã Minh Sơn",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20111080",
    "id": "20111080",
    "name": "Xã Minh Ngọc",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20101081",
    "id": "20101081",
    "name": "Xã Ngọc Đường",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20101082",
    "id": "20101082",
    "name": "Phường Hà Giang 1",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20101083",
    "id": "20101083",
    "name": "Phường Hà Giang 2",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20115084",
    "id": "20115084",
    "name": "Xã Lao Chải",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20115085",
    "id": "20115085",
    "name": "Xã Thanh Thuỷ",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20115086",
    "id": "20115086",
    "name": "Xã Minh Tân",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20115087",
    "id": "20115087",
    "name": "Xã Thuận Ha",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20115088",
    "id": "20115088",
    "name": "Xã Tùng Bá",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20115089",
    "id": "20115089",
    "name": "Xã Phú Linh",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20115090",
    "id": "20115090",
    "name": "Xã Linh Hồ",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20115091",
    "id": "20115091",
    "name": "Xã Bạch Ngọc",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20115092",
    "id": "20115092",
    "name": "Xã Vị Xuyên",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20115093",
    "id": "20115093",
    "name": "Xã Việt Lâm",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20115094",
    "id": "20115094",
    "name": "Xã Cao Bồ",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20115095",
    "id": "20115095",
    "name": "Xã Thượng Sơn",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20119096",
    "id": "20119096",
    "name": "Xã Tân Quang",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20119097",
    "id": "20119097",
    "name": "Xã Đồng Tâm",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20119098",
    "id": "20119098",
    "name": "Xã Liên Hiệp",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20119099",
    "id": "20119099",
    "name": "Xã Bằng Hành",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20119100",
    "id": "20119100",
    "name": "Xã Bắc Quang",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20119101",
    "id": "20119101",
    "name": "Xã Hùng An",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20119102",
    "id": "20119102",
    "name": "Xã Vĩnh Tuy",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20119103",
    "id": "20119103",
    "name": "Xã Đồng Yên",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20118104",
    "id": "20118104",
    "name": "Xã Tiên Yên",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20118105",
    "id": "20118105",
    "name": "Xã Xuân Giang",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20118106",
    "id": "20118106",
    "name": "Xã Bằng Lang",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20118107",
    "id": "20118107",
    "name": "Xã Yên Thành",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20118108",
    "id": "20118108",
    "name": "Xã Quang Bình",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20118109",
    "id": "20118109",
    "name": "Xã Tân Trịnh",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20118110",
    "id": "20118110",
    "name": "Xã Tiên Nguyên",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20113111",
    "id": "20113111",
    "name": "Xã Thông Nguyên",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20113112",
    "id": "20113112",
    "name": "Xã Hồ Thầu",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20113113",
    "id": "20113113",
    "name": "Xã Nậm Dịch",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20113114",
    "id": "20113114",
    "name": "Xã Tân Tiến",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20113115",
    "id": "20113115",
    "name": "Xã Hoàng Su Phì",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20113116",
    "id": "20113116",
    "name": "Xã Thàng Tín",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20113117",
    "id": "20113117",
    "name": "Xã Bản Máy",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20113118",
    "id": "20113118",
    "name": "Xã Pờ Ly Ngài",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20117119",
    "id": "20117119",
    "name": "Xã Xín Mần",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20117120",
    "id": "20117120",
    "name": "Xã Pà Vầy Sủ",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20117121",
    "id": "20117121",
    "name": "Xã Nấm Dẩn",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20117122",
    "id": "20117122",
    "name": "Xã Trung Thịnh",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20117123",
    "id": "20117123",
    "name": "Xã Quảng Nguyên",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_20117124",
    "id": "20117124",
    "name": "Xã Khuôn Lùng",
    "provinceId": "27",
    "provinceName": "Tỉnh Tuyên Quang",
    "level": 2
  },
  {
    "systemId": "W2_21309001",
    "id": "21309001",
    "name": "Xã Khao Mang",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21309002",
    "id": "21309002",
    "name": "Xã Mù Cang Chải",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21309003",
    "id": "21309003",
    "name": "Xã Púng Luông",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21315004",
    "id": "21315004",
    "name": "Xã Tú Lệ",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21317005",
    "id": "21317005",
    "name": "Xã Trạm Tấu",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21317006",
    "id": "21317006",
    "name": "Xã Hạnh Phúc",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21317007",
    "id": "21317007",
    "name": "Xã Phình Hồ",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21303008",
    "id": "21303008",
    "name": "Phường Nghĩa Lộ",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21303009",
    "id": "21303009",
    "name": "Phường Trung Tâm",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21303010",
    "id": "21303010",
    "name": "Phường Cầu Thia",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21303011",
    "id": "21303011",
    "name": "Xã Liên Sơn",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21315012",
    "id": "21315012",
    "name": "Xã Gia Hội",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21315013",
    "id": "21315013",
    "name": "Xã Sơn Lương",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21315014",
    "id": "21315014",
    "name": "Xã Thượng Bằng La",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21315015",
    "id": "21315015",
    "name": "Xã Chấn Thịnh",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21315016",
    "id": "21315016",
    "name": "Xã Nghĩa Tâm",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21315017",
    "id": "21315017",
    "name": "Xã Văn Chấn",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21307018",
    "id": "21307018",
    "name": "Xã Phong Dụ Hạ",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21307019",
    "id": "21307019",
    "name": "Xã Châu Quế",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21307020",
    "id": "21307020",
    "name": "Xã Lâm Giang",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21307021",
    "id": "21307021",
    "name": "Xã Đông Cuông",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21307022",
    "id": "21307022",
    "name": "Xã Tân Hợp",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21307023",
    "id": "21307023",
    "name": "Xã Mậu A",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21307024",
    "id": "21307024",
    "name": "Xã Xuân Ái",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21307025",
    "id": "21307025",
    "name": "Xã Mỏ Vàng",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21305026",
    "id": "21305026",
    "name": "Xã Lâm Thượng",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21305027",
    "id": "21305027",
    "name": "Xã Lục Yên",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21305028",
    "id": "21305028",
    "name": "Xã Tân Lĩnh",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21305029",
    "id": "21305029",
    "name": "Xã Khánh Hòa",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21305030",
    "id": "21305030",
    "name": "Xã Phúc Lợi",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21305031",
    "id": "21305031",
    "name": "Xã Mường Lai",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21313032",
    "id": "21313032",
    "name": "Xã Cảm Nhân",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21313033",
    "id": "21313033",
    "name": "Xã Yên Thành",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21313034",
    "id": "21313034",
    "name": "Xã Thác Bà",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21313035",
    "id": "21313035",
    "name": "Xã Yên Bình",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21313036",
    "id": "21313036",
    "name": "Xã Bảo Ái",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21301037",
    "id": "21301037",
    "name": "Phường Văn Phú",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21301038",
    "id": "21301038",
    "name": "Phường Yên Bái",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21301039",
    "id": "21301039",
    "name": "Phường Nam Cường",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21301040",
    "id": "21301040",
    "name": "Phường Âu Lâu",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21311041",
    "id": "21311041",
    "name": "Xã Trấn Yên",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21311042",
    "id": "21311042",
    "name": "Xã Hưng Khánh",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21311043",
    "id": "21311043",
    "name": "Xã Lương Thịnh",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21311044",
    "id": "21311044",
    "name": "Xã Việt Hồng",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21311045",
    "id": "21311045",
    "name": "Xã Quy Mông",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20511046",
    "id": "20511046",
    "name": "Xã Phong Hải",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20511047",
    "id": "20511047",
    "name": "Xã Xuân Quang",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20511048",
    "id": "20511048",
    "name": "Xã Bảo Thắng",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20511049",
    "id": "20511049",
    "name": "Xã Tằng Loỏng",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20511050",
    "id": "20511050",
    "name": "Xã Gia Phú",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20501051",
    "id": "20501051",
    "name": "Xã Cốc San",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20501052",
    "id": "20501052",
    "name": "Xã Hợp Thành",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20501053",
    "id": "20501053",
    "name": "Phường Cam Đường",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20501054",
    "id": "20501054",
    "name": "Phường Lào Cai",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20507055",
    "id": "20507055",
    "name": "Xã Mường Hum",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20507056",
    "id": "20507056",
    "name": "Xã Dền Sáng",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20507057",
    "id": "20507057",
    "name": "Xã Y Tý",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20507058",
    "id": "20507058",
    "name": "Xã A Mú Sung",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20507059",
    "id": "20507059",
    "name": "Xã Trịnh Tường",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20507060",
    "id": "20507060",
    "name": "Xã Bản Xèo",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20507061",
    "id": "20507061",
    "name": "Xã Bát Xát",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20515062",
    "id": "20515062",
    "name": "Xã Nghĩa Đô",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20515063",
    "id": "20515063",
    "name": "Xã Thượng Hà",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20515064",
    "id": "20515064",
    "name": "Xã Bảo Yên",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20515065",
    "id": "20515065",
    "name": "Xã Xuân Hòa",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20515066",
    "id": "20515066",
    "name": "Xã Phúc Khánh",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20515067",
    "id": "20515067",
    "name": "Xã Bảo Hà",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20519068",
    "id": "20519068",
    "name": "Xã Võ Lao",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20519069",
    "id": "20519069",
    "name": "Xã Khánh Yên",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20519070",
    "id": "20519070",
    "name": "Xã Văn Bàn",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20519071",
    "id": "20519071",
    "name": "Xã Dương Quỳ",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20519072",
    "id": "20519072",
    "name": "Xã Chiềng Ken",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20519073",
    "id": "20519073",
    "name": "Xã Minh Lương",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20519074",
    "id": "20519074",
    "name": "Xã Nậm Chày",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20513075",
    "id": "20513075",
    "name": "Xã Mường Bo",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20513076",
    "id": "20513076",
    "name": "Xã Bản Hồ",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20513077",
    "id": "20513077",
    "name": "Xã Tả Phìn",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20513078",
    "id": "20513078",
    "name": "Xã Tả Van",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20513079",
    "id": "20513079",
    "name": "Phường Sa Pa",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20509080",
    "id": "20509080",
    "name": "Xã Cốc Lầu",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20509081",
    "id": "20509081",
    "name": "Xã Bảo Nhai",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20509082",
    "id": "20509082",
    "name": "Xã Bản Liền",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20509083",
    "id": "20509083",
    "name": "Xã Bắc Hà",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20509084",
    "id": "20509084",
    "name": "Xã Tả Củ Tỷ",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20509085",
    "id": "20509085",
    "name": "Xã Lùng Phình",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20505086",
    "id": "20505086",
    "name": "Xã Pha Long",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20505087",
    "id": "20505087",
    "name": "Xã Mường Khương",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20505088",
    "id": "20505088",
    "name": "Xã Bản Lầu",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20505089",
    "id": "20505089",
    "name": "Xã Cao Sơn",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20521090",
    "id": "20521090",
    "name": "Xã Si Ma Cai",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20521091",
    "id": "20521091",
    "name": "Xã Sín Chéng",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21309092",
    "id": "21309092",
    "name": "Xã Lao Chải",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21309093",
    "id": "21309093",
    "name": "Xã Chế Tạo",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21309094",
    "id": "21309094",
    "name": "Xã Nậm Có",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21317095",
    "id": "21317095",
    "name": "Xã Tà Xi Láng",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21307096",
    "id": "21307096",
    "name": "Xã Phong Dụ Thượng",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21315097",
    "id": "21315097",
    "name": "Xã Cát Thịnh",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20519098",
    "id": "20519098",
    "name": "Xã Nậm Xé",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_20513099",
    "id": "20513099",
    "name": "Xã Ngũ Chỉ Sơn",
    "provinceId": "14",
    "provinceName": "Tỉnh Lào Cai",
    "level": 2
  },
  {
    "systemId": "W2_21501001",
    "id": "21501001",
    "name": "Phường Phan Đình Phùng",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21501002",
    "id": "21501002",
    "name": "Phường Linh Sơn",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21501003",
    "id": "21501003",
    "name": "Phường Tích Lương",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21501004",
    "id": "21501004",
    "name": "Phường Gia Sàng",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21501005",
    "id": "21501005",
    "name": "Phường Quyết Thắng",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21501006",
    "id": "21501006",
    "name": "Phường Quan Triều",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21501007",
    "id": "21501007",
    "name": "Xã Tân Cương",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21501008",
    "id": "21501008",
    "name": "Xã Đại Phúc",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21513009",
    "id": "21513009",
    "name": "Xã Đại Từ",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21513010",
    "id": "21513010",
    "name": "Xã Đức Lương",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21513011",
    "id": "21513011",
    "name": "Xã Phú Thịnh",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21513012",
    "id": "21513012",
    "name": "Xã La Bằng",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21513013",
    "id": "21513013",
    "name": "Xã Phú Lạc",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21513014",
    "id": "21513014",
    "name": "Xã An Khánh",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21513015",
    "id": "21513015",
    "name": "Xã Quân Chu",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21513016",
    "id": "21513016",
    "name": "Xã Vạn Phú",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21513017",
    "id": "21513017",
    "name": "Xã Phú Xuyên",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21517018",
    "id": "21517018",
    "name": "Phường Phổ Yên",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21517019",
    "id": "21517019",
    "name": "Phường Vạn Xuân",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21517020",
    "id": "21517020",
    "name": "Phường Trung Thành",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21517021",
    "id": "21517021",
    "name": "Phường Phúc Thuận",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21517022",
    "id": "21517022",
    "name": "Xã Thành Công",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21515023",
    "id": "21515023",
    "name": "Xã Phú Bình",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21515024",
    "id": "21515024",
    "name": "Xã Tân Thành",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21515025",
    "id": "21515025",
    "name": "Xã Điềm Thụy",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21515026",
    "id": "21515026",
    "name": "Xã Kha Sơn",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21515027",
    "id": "21515027",
    "name": "Xã Tân Khánh",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21511028",
    "id": "21511028",
    "name": "Xã Đồng Hỷ",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21511029",
    "id": "21511029",
    "name": "Xã Quang Sơn",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21511030",
    "id": "21511030",
    "name": "Xã Trại Cau",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21511031",
    "id": "21511031",
    "name": "Xã Nam Hòa",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21511032",
    "id": "21511032",
    "name": "Xã Văn Hán",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21511033",
    "id": "21511033",
    "name": "Xã Văn Lăng",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21503034",
    "id": "21503034",
    "name": "Phường Sông Công",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21503035",
    "id": "21503035",
    "name": "Phường Bá Xuyên",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21503036",
    "id": "21503036",
    "name": "Phường Bách Quang",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21509037",
    "id": "21509037",
    "name": "Xã Phú Lương",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21509038",
    "id": "21509038",
    "name": "Xã Vô Tranh",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21509039",
    "id": "21509039",
    "name": "Xã Yên Trạch",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21509040",
    "id": "21509040",
    "name": "Xã Hợp Thành",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21505041",
    "id": "21505041",
    "name": "Xã Định Hóa",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21505042",
    "id": "21505042",
    "name": "Xã Bình Yên",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21505043",
    "id": "21505043",
    "name": "Xã Trung Hội",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21505044",
    "id": "21505044",
    "name": "Xã Phượng Tiến",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21505045",
    "id": "21505045",
    "name": "Xã Phú Đình",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21505046",
    "id": "21505046",
    "name": "Xã Bình Thành",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21505047",
    "id": "21505047",
    "name": "Xã Kim Phượng",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21505048",
    "id": "21505048",
    "name": "Xã Lam Vỹ",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21507049",
    "id": "21507049",
    "name": "Xã Võ Nhai",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21507050",
    "id": "21507050",
    "name": "Xã Dân Tiến",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21507051",
    "id": "21507051",
    "name": "Xã Nghinh Tường",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21507052",
    "id": "21507052",
    "name": "Xã Thần Sa",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21507053",
    "id": "21507053",
    "name": "Xã La Hiên",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21507054",
    "id": "21507054",
    "name": "Xã Tràng Xá",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20704055",
    "id": "20704055",
    "name": "Xã Bằng Thành",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20704056",
    "id": "20704056",
    "name": "Xã Nghiên Loan",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20704057",
    "id": "20704057",
    "name": "Xã Cao Minh",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20703058",
    "id": "20703058",
    "name": "Xã Ba Bể",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20703059",
    "id": "20703059",
    "name": "Xã Chợ Rã",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20703060",
    "id": "20703060",
    "name": "Xã Phúc Lộc",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20703061",
    "id": "20703061",
    "name": "Xã Thượng Minh",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20703062",
    "id": "20703062",
    "name": "Xã Đồng Phúc",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20713063",
    "id": "20713063",
    "name": "Xã Yên Bình",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20705064",
    "id": "20705064",
    "name": "Xã Bằng Vân",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20705065",
    "id": "20705065",
    "name": "Xã Ngân Sơn",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20705066",
    "id": "20705066",
    "name": "Xã Nà Phặc",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20705067",
    "id": "20705067",
    "name": "Xã Hiệp Lực",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20707068",
    "id": "20707068",
    "name": "Xã Nam Cường",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20707069",
    "id": "20707069",
    "name": "Xã Quảng Bạch",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20707070",
    "id": "20707070",
    "name": "Xã Yên Thịnh",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20707071",
    "id": "20707071",
    "name": "Xã Chợ Đồn",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20707072",
    "id": "20707072",
    "name": "Xã Yên Phong",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20707073",
    "id": "20707073",
    "name": "Xã Nghĩa Tá",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20711074",
    "id": "20711074",
    "name": "Xã Phủ Thông",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20711075",
    "id": "20711075",
    "name": "Xã Cẩm Giàng",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20711076",
    "id": "20711076",
    "name": "Xã Vĩnh Thông",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20711077",
    "id": "20711077",
    "name": "Xã Bạch Thông",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20701078",
    "id": "20701078",
    "name": "Xã Phong Quang",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20701079",
    "id": "20701079",
    "name": "Phường Đức Xuân",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20701080",
    "id": "20701080",
    "name": "Phường Bắc Kạn",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20709081",
    "id": "20709081",
    "name": "Xã Văn Lang",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20709082",
    "id": "20709082",
    "name": "Xã Cường Lợi",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20709083",
    "id": "20709083",
    "name": "Xã Na Rì",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20709084",
    "id": "20709084",
    "name": "Xã Trần Phú",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20709085",
    "id": "20709085",
    "name": "Xã Côn Minh",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20709086",
    "id": "20709086",
    "name": "Xã Xuân Dương",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20713087",
    "id": "20713087",
    "name": "Xã Tân Kỳ",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20713088",
    "id": "20713088",
    "name": "Xã Thanh Mai",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20713089",
    "id": "20713089",
    "name": "Xã Thanh Thịnh",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20713090",
    "id": "20713090",
    "name": "Xã Chợ Mới",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_21507091",
    "id": "21507091",
    "name": "Xã Sảng Mộc",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20705092",
    "id": "20705092",
    "name": "Xã Thượng Quan",
    "provinceId": "26",
    "provinceName": "Tỉnh Thái Nguyên",
    "level": 2
  },
  {
    "systemId": "W2_20903001",
    "id": "20903001",
    "name": "Xã Thất Khê",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20903002",
    "id": "20903002",
    "name": "Xã Đoàn Kết",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20903003",
    "id": "20903003",
    "name": "Xã Tân Tiến",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20903004",
    "id": "20903004",
    "name": "Xã Tràng Định",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20903005",
    "id": "20903005",
    "name": "Xã Quốc Khánh",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20903006",
    "id": "20903006",
    "name": "Xã Kháng Chiến",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20903007",
    "id": "20903007",
    "name": "Xã Quốc Việt",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20907008",
    "id": "20907008",
    "name": "Xã Bình Gia",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20907009",
    "id": "20907009",
    "name": "Xã Tân Văn",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20907010",
    "id": "20907010",
    "name": "Xã Hồng Phong",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20907011",
    "id": "20907011",
    "name": "Xã Hoa Thám",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20907012",
    "id": "20907012",
    "name": "Xã Quý Hòa",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20907013",
    "id": "20907013",
    "name": "Xã Thiện Hòa",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20907014",
    "id": "20907014",
    "name": "Xã Thiện Thuật",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20907015",
    "id": "20907015",
    "name": "Xã Thiện Long",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20909016",
    "id": "20909016",
    "name": "Xã Bắc Sơn",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20909017",
    "id": "20909017",
    "name": "Xã Hưng Vũ",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20909018",
    "id": "20909018",
    "name": "Xã Vũ Lăng",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20909019",
    "id": "20909019",
    "name": "Xã Nhất Hòa",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20909020",
    "id": "20909020",
    "name": "Xã Vũ Lễ",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20909021",
    "id": "20909021",
    "name": "Xã Tân Tri",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20911022",
    "id": "20911022",
    "name": "Xã Văn Quan",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20911023",
    "id": "20911023",
    "name": "Xã Điềm He",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20911024",
    "id": "20911024",
    "name": "Xã Tri Lễ",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20911025",
    "id": "20911025",
    "name": "Xã Yên Phúc",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20911026",
    "id": "20911026",
    "name": "Xã Tân Đoàn",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20913027",
    "id": "20913027",
    "name": "Xã Khánh Khê",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20905028",
    "id": "20905028",
    "name": "Xã Na Sầm",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20905029",
    "id": "20905029",
    "name": "Xã Văn Lãng",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20905030",
    "id": "20905030",
    "name": "Xã Hội Hoan",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20905031",
    "id": "20905031",
    "name": "Xã Thụy Hùng",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20905032",
    "id": "20905032",
    "name": "Xã Hoàng Văn Thụ",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20915033",
    "id": "20915033",
    "name": "Xã Lộc Bình",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20915034",
    "id": "20915034",
    "name": "Xã Mẫu Sơn",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20915035",
    "id": "20915035",
    "name": "Xã Na Dương",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20915036",
    "id": "20915036",
    "name": "Xã Lợi Bác",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20915037",
    "id": "20915037",
    "name": "Xã Thống Nhất",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20915038",
    "id": "20915038",
    "name": "Xã Xuân Dương",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20915039",
    "id": "20915039",
    "name": "Xã Khuất Xá",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20919040",
    "id": "20919040",
    "name": "Xã Đình Lập",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20919041",
    "id": "20919041",
    "name": "Xã Châu Sơn",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20919042",
    "id": "20919042",
    "name": "Xã Kiên Mộc",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20919043",
    "id": "20919043",
    "name": "Xã Thái Bình",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20921044",
    "id": "20921044",
    "name": "Xã Hữu Lũng",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20921045",
    "id": "20921045",
    "name": "Xã Tuấn Sơn",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20921046",
    "id": "20921046",
    "name": "Xã Tân Thành",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20921047",
    "id": "20921047",
    "name": "Xã Vân Nham",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20921048",
    "id": "20921048",
    "name": "Xã Thiện Tân",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20921049",
    "id": "20921049",
    "name": "Xã Yên Bình",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20921050",
    "id": "20921050",
    "name": "Xã Hữu Liên",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20921051",
    "id": "20921051",
    "name": "Xã Cai Kinh",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20917052",
    "id": "20917052",
    "name": "Xã Chi Lăng",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20917053",
    "id": "20917053",
    "name": "Xã Nhân Lý",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20917054",
    "id": "20917054",
    "name": "Xã Chiến Thắng",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20917055",
    "id": "20917055",
    "name": "Xã Quan Sơn",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20917056",
    "id": "20917056",
    "name": "Xã Bằng Mạc",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20917057",
    "id": "20917057",
    "name": "Xã Vạn Linh",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20913058",
    "id": "20913058",
    "name": "Xã Đồng Đăng",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20913059",
    "id": "20913059",
    "name": "Xã Cao Lộc",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20913060",
    "id": "20913060",
    "name": "Xã Công Sơn",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20913061",
    "id": "20913061",
    "name": "Xã Ba Sơn",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20901062",
    "id": "20901062",
    "name": "Phường Tam Thanh",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20901063",
    "id": "20901063",
    "name": "Phường Lương Văn Tri",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20913064",
    "id": "20913064",
    "name": "Phường Kỳ Lừa",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_20901065",
    "id": "20901065",
    "name": "Phường Đông Kinh",
    "provinceId": "16",
    "provinceName": "Tỉnh Lạng Sơn",
    "level": 2
  },
  {
    "systemId": "W2_21701001",
    "id": "21701001",
    "name": "Phường Việt Trì",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21701002",
    "id": "21701002",
    "name": "Phường Nông Trang",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21701003",
    "id": "21701003",
    "name": "Phường Thanh Miếu",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21701004",
    "id": "21701004",
    "name": "Phường Vân Phú",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21701005",
    "id": "21701005",
    "name": "Xã Hy Cương",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21721006",
    "id": "21721006",
    "name": "Xã Lâm Thao",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21721007",
    "id": "21721007",
    "name": "Xã Xuân Lũng",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21721008",
    "id": "21721008",
    "name": "Xã Phùng Nguyên",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21721009",
    "id": "21721009",
    "name": "Xã Bản Nguyên",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21703010",
    "id": "21703010",
    "name": "Phường Phong Châu",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21703011",
    "id": "21703011",
    "name": "Phường Phú Thọ",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21703012",
    "id": "21703012",
    "name": "Phường Âu Cơ",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21711013",
    "id": "21711013",
    "name": "Xã Phù Ninh",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21711014",
    "id": "21711014",
    "name": "Xã Dân Chủ",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21711015",
    "id": "21711015",
    "name": "Xã Phú Mỹ",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21711016",
    "id": "21711016",
    "name": "Xã Trạm Thản",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21711017",
    "id": "21711017",
    "name": "Xã Bình Phú",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21709018",
    "id": "21709018",
    "name": "Xã Thanh Ba",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21709019",
    "id": "21709019",
    "name": "Xã Quảng Yên",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21709020",
    "id": "21709020",
    "name": "Xã Hoàng Cương",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21709021",
    "id": "21709021",
    "name": "Xã Đông Thành",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21709022",
    "id": "21709022",
    "name": "Xã Chí Tiên",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21709023",
    "id": "21709023",
    "name": "Xã Liên Minh",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21705024",
    "id": "21705024",
    "name": "Xã Đoan Hùng",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21705025",
    "id": "21705025",
    "name": "Xã Tây Cốc",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21705026",
    "id": "21705026",
    "name": "Xã Chân Mộng",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21705027",
    "id": "21705027",
    "name": "Xã Chí Đám",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21705028",
    "id": "21705028",
    "name": "Xã Bằng Luân",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21707029",
    "id": "21707029",
    "name": "Xã Hạ Hòa",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21707030",
    "id": "21707030",
    "name": "Xã Đan Thượng",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21707031",
    "id": "21707031",
    "name": "Xã Yên Kỳ",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21707032",
    "id": "21707032",
    "name": "Xã Vĩnh Chân",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21707033",
    "id": "21707033",
    "name": "Xã Văn Lang",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21707034",
    "id": "21707034",
    "name": "Xã Hiền Lương",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21713035",
    "id": "21713035",
    "name": "Xã Cẩm Khê",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21713036",
    "id": "21713036",
    "name": "Xã Phú Khê",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21713037",
    "id": "21713037",
    "name": "Xã Hùng Việt",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21713038",
    "id": "21713038",
    "name": "Xã Đồng Lương",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21713039",
    "id": "21713039",
    "name": "Xã Tiên Lương",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21713040",
    "id": "21713040",
    "name": "Xã Vân Bán",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21717041",
    "id": "21717041",
    "name": "Xã Tam Nông",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21717042",
    "id": "21717042",
    "name": "Xã Thọ Văn",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21717043",
    "id": "21717043",
    "name": "Xã Vạn Xuân",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21717044",
    "id": "21717044",
    "name": "Xã Hiền Quan",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21723045",
    "id": "21723045",
    "name": "Xã Thanh Thuỷ",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21723046",
    "id": "21723046",
    "name": "Xã Đào Xá",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21723047",
    "id": "21723047",
    "name": "Xã Tu Vũ",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21719048",
    "id": "21719048",
    "name": "Xã Thanh Sơn",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21719049",
    "id": "21719049",
    "name": "Xã Võ Miếu",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21719050",
    "id": "21719050",
    "name": "Xã Văn Miếu",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21719051",
    "id": "21719051",
    "name": "Xã Cự Đồng",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21719052",
    "id": "21719052",
    "name": "Xã Hương Cần",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21719053",
    "id": "21719053",
    "name": "Xã Yên Sơn",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21719054",
    "id": "21719054",
    "name": "Xã Khả Cửu",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21720055",
    "id": "21720055",
    "name": "Xã Tân Sơn",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21720056",
    "id": "21720056",
    "name": "Xã Minh Đài",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21720057",
    "id": "21720057",
    "name": "Xã Lai Đồng",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21720058",
    "id": "21720058",
    "name": "Xã Thu Cúc",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21720059",
    "id": "21720059",
    "name": "Xã Xuân Đài",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21720060",
    "id": "21720060",
    "name": "Xã Long Cốc",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21715061",
    "id": "21715061",
    "name": "Xã Yên Lập",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21715062",
    "id": "21715062",
    "name": "Xã Thượng Long",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21715063",
    "id": "21715063",
    "name": "Xã Sơn Lương",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21715064",
    "id": "21715064",
    "name": "Xã Xuân Viên",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21715065",
    "id": "21715065",
    "name": "Xã Minh Hòa",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21715066",
    "id": "21715066",
    "name": "Xã Trung Sơn",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21915067",
    "id": "21915067",
    "name": "Xã Tam Sơn",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21915068",
    "id": "21915068",
    "name": "Xã Sông Lô",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21915069",
    "id": "21915069",
    "name": "Xã Hải Lựu",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21915070",
    "id": "21915070",
    "name": "Xã Yên Lãng",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21903071",
    "id": "21903071",
    "name": "Xã Lập Thạch",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21903072",
    "id": "21903072",
    "name": "Xã Tiên Lữ",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21903073",
    "id": "21903073",
    "name": "Xã Thái Hòa",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21903074",
    "id": "21903074",
    "name": "Xã Liên Hòa",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21903075",
    "id": "21903075",
    "name": "Xã Hợp Lý",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21903076",
    "id": "21903076",
    "name": "Xã Sơn Đông",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21904077",
    "id": "21904077",
    "name": "Xã Tam Đảo",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21904078",
    "id": "21904078",
    "name": "Xã Đại Đình",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21904079",
    "id": "21904079",
    "name": "Xã Đạo Trù",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21905080",
    "id": "21905080",
    "name": "Xã Tam Dương",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21905081",
    "id": "21905081",
    "name": "Xã Hội Thịnh",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21905082",
    "id": "21905082",
    "name": "Xã Hoàng An",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21905083",
    "id": "21905083",
    "name": "Xã Tam Dương Bắc",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21907084",
    "id": "21907084",
    "name": "Xã Vĩnh Tường",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21907085",
    "id": "21907085",
    "name": "Xã Thổ Tang",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21907086",
    "id": "21907086",
    "name": "Xã Vĩnh Hưng",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21907087",
    "id": "21907087",
    "name": "Xã Vĩnh An",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21907088",
    "id": "21907088",
    "name": "Xã Vĩnh Phú",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21907089",
    "id": "21907089",
    "name": "Xã Vĩnh Thành",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21909090",
    "id": "21909090",
    "name": "Xã Yên Lạc",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21909091",
    "id": "21909091",
    "name": "Xã Tề Lỗ",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21909092",
    "id": "21909092",
    "name": "Xã Liên Châu",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21909093",
    "id": "21909093",
    "name": "Xã Tam Hồng",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21909094",
    "id": "21909094",
    "name": "Xã Nguyệt Đức",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21913095",
    "id": "21913095",
    "name": "Xã Bình Nguyên",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21913096",
    "id": "21913096",
    "name": "Xã Xuân Lãng",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21913097",
    "id": "21913097",
    "name": "Xã Bình Xuyên",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21913098",
    "id": "21913098",
    "name": "Xã Bình Tuyền",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21901099",
    "id": "21901099",
    "name": "Phường Vĩnh Phúc",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21901100",
    "id": "21901100",
    "name": "Phường Vĩnh Yên",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21902101",
    "id": "21902101",
    "name": "Phường Phúc Yên",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_21902102",
    "id": "21902102",
    "name": "Phường Xuân Hòa",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30510103",
    "id": "30510103",
    "name": "Xã Cao Phong",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30510104",
    "id": "30510104",
    "name": "Xã Mường Thàng",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30510105",
    "id": "30510105",
    "name": "Xã Thung Nai",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30503106",
    "id": "30503106",
    "name": "Xã Đà Bắc",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30503107",
    "id": "30503107",
    "name": "Xã Cao Sơn",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30503108",
    "id": "30503108",
    "name": "Xã Đức Nhàn",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30503109",
    "id": "30503109",
    "name": "Xã Quy Đức",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30503110",
    "id": "30503110",
    "name": "Xã Tân Pheo",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30503111",
    "id": "30503111",
    "name": "Xã Tiền Phong",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30511112",
    "id": "30511112",
    "name": "Xã Kim Bôi",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30511113",
    "id": "30511113",
    "name": "Xã Mường Động",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30511114",
    "id": "30511114",
    "name": "Xã Dũng Tiến",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30511115",
    "id": "30511115",
    "name": "Xã Hợp Kim",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30511116",
    "id": "30511116",
    "name": "Xã Nật Sơn",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30515117",
    "id": "30515117",
    "name": "Xã Lạc Sơn",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30515118",
    "id": "30515118",
    "name": "Xã Mường Vang",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30515119",
    "id": "30515119",
    "name": "Xã Đại Đồng",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30515120",
    "id": "30515120",
    "name": "Xã Ngọc Sơn",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30515121",
    "id": "30515121",
    "name": "Xã Nhân Nghĩa",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30515122",
    "id": "30515122",
    "name": "Xã Quyết Thắng",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30515123",
    "id": "30515123",
    "name": "Xã Thượng Cốc",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30515124",
    "id": "30515124",
    "name": "Xã Yên Phú",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30517125",
    "id": "30517125",
    "name": "Xã Lạc Thủy",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30517126",
    "id": "30517126",
    "name": "Xã An Bình",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30517127",
    "id": "30517127",
    "name": "Xã An Nghĩa",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30509128",
    "id": "30509128",
    "name": "Xã Lương Sơn",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30509129",
    "id": "30509129",
    "name": "Xã Cao Dương",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30509130",
    "id": "30509130",
    "name": "Xã Liên Sơn",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30505131",
    "id": "30505131",
    "name": "Xã Mai Châu",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30505132",
    "id": "30505132",
    "name": "Xã Bao La",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30505133",
    "id": "30505133",
    "name": "Xã Mai Hạ",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30505134",
    "id": "30505134",
    "name": "Xã Pà Cò",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30505135",
    "id": "30505135",
    "name": "Xã Tân Mai",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30513136",
    "id": "30513136",
    "name": "Xã Tân Lạc",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30513137",
    "id": "30513137",
    "name": "Xã Mường Bi",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30513138",
    "id": "30513138",
    "name": "Xã Mường Hoa",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30513139",
    "id": "30513139",
    "name": "Xã Toàn Thắng",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30513140",
    "id": "30513140",
    "name": "Xã Vân Sơn",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30519141",
    "id": "30519141",
    "name": "Xã Yên Thủy",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30519142",
    "id": "30519142",
    "name": "Xã Lạc Lương",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30519143",
    "id": "30519143",
    "name": "Xã Yên Trị",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30501144",
    "id": "30501144",
    "name": "Xã Thịnh Minh",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30501145",
    "id": "30501145",
    "name": "Phường Hòa Bình",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30501146",
    "id": "30501146",
    "name": "Phường Kỳ Sơn",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30501147",
    "id": "30501147",
    "name": "Phường Tân Hòa",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30501148",
    "id": "30501148",
    "name": "Phường Thống Nhất",
    "provinceId": "19",
    "provinceName": "Tỉnh Phú Thọ",
    "level": 2
  },
  {
    "systemId": "W2_30101001",
    "id": "30101001",
    "name": "Xã Mường Phăng",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30101002",
    "id": "30101002",
    "name": "Phường Điện Biên Phủ",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30101003",
    "id": "30101003",
    "name": "Phường Mường Thanh",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30103004",
    "id": "30103004",
    "name": "Phường Mường Lay",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30117005",
    "id": "30117005",
    "name": "Xã Thanh Nưa",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30117006",
    "id": "30117006",
    "name": "Xã Thanh An",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30117007",
    "id": "30117007",
    "name": "Xã Thanh Yên",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30117008",
    "id": "30117008",
    "name": "Xã Sam Mứn",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30117009",
    "id": "30117009",
    "name": "Xã Núa Ngam",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30117010",
    "id": "30117010",
    "name": "Xã Mường Nhà",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30115011",
    "id": "30115011",
    "name": "Xã Tuần Giáo",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30115012",
    "id": "30115012",
    "name": "Xã Quài Tở",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30115013",
    "id": "30115013",
    "name": "Xã Mường Mùn",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30115014",
    "id": "30115014",
    "name": "Xã Pú Nhung",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30115015",
    "id": "30115015",
    "name": "Xã Chiềng Sinh",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30113016",
    "id": "30113016",
    "name": "Xã Tủa Chùa",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30113017",
    "id": "30113017",
    "name": "Xã Sín Chải",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30113018",
    "id": "30113018",
    "name": "Xã Sính Phình",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30113019",
    "id": "30113019",
    "name": "Xã Tủa Thàng",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30113020",
    "id": "30113020",
    "name": "Xã Sáng Nhè",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30111021",
    "id": "30111021",
    "name": "Xã Na Sang",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30111022",
    "id": "30111022",
    "name": "Xã Mường Tùng",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30111023",
    "id": "30111023",
    "name": "Xã Pa Ham",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30111024",
    "id": "30111024",
    "name": "Xã Nậm Nèn",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30111025",
    "id": "30111025",
    "name": "Xã Mường Pồn",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30119026",
    "id": "30119026",
    "name": "Xã Na Son",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30119027",
    "id": "30119027",
    "name": "Xã Xa Dung",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30119028",
    "id": "30119028",
    "name": "Xã Pu Nhi",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30119029",
    "id": "30119029",
    "name": "Xã Mường Luân",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30119030",
    "id": "30119030",
    "name": "Xã Tìa Dình",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30119031",
    "id": "30119031",
    "name": "Xã Phình Giàng",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30123032",
    "id": "30123032",
    "name": "Xã Mường Chà",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30123033",
    "id": "30123033",
    "name": "Xã Nà Hỳ",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30123034",
    "id": "30123034",
    "name": "Xã Nà Bủng",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30123035",
    "id": "30123035",
    "name": "Xã Chà Tở",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30123036",
    "id": "30123036",
    "name": "Xã Si Pa Phìn",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30104037",
    "id": "30104037",
    "name": "Xã Mường Nhé",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30104038",
    "id": "30104038",
    "name": "Xã Sín Thầu",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30104039",
    "id": "30104039",
    "name": "Xã Mường Toong",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30104040",
    "id": "30104040",
    "name": "Xã Nậm Kè",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30104041",
    "id": "30104041",
    "name": "Xã Quảng Lâm",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30121042",
    "id": "30121042",
    "name": "Xã Mường Ảng",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30121043",
    "id": "30121043",
    "name": "Xã Nà Tấu",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30121044",
    "id": "30121044",
    "name": "Xã Búng Lao",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30121045",
    "id": "30121045",
    "name": "Xã Mường Lạn",
    "provinceId": "30",
    "provinceName": "Tỉnh Điện Biên",
    "level": 2
  },
  {
    "systemId": "W2_30209001",
    "id": "30209001",
    "name": "Xã Mường Kim",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30209002",
    "id": "30209002",
    "name": "Xã Khoen On",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30209003",
    "id": "30209003",
    "name": "Xã Than Uyên",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30209004",
    "id": "30209004",
    "name": "Xã Mường Than",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30211005",
    "id": "30211005",
    "name": "Xã Pắc Ta",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30211006",
    "id": "30211006",
    "name": "Xã Nậm Sỏ",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30211007",
    "id": "30211007",
    "name": "Xã Tân Uyên",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30211008",
    "id": "30211008",
    "name": "Xã Mường Khoa",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30205009",
    "id": "30205009",
    "name": "Xã Bản Bo",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30205010",
    "id": "30205010",
    "name": "Xã Bình Lư",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30205011",
    "id": "30205011",
    "name": "Xã Tả Lèng",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30205012",
    "id": "30205012",
    "name": "Xã Khun Há",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30202013",
    "id": "30202013",
    "name": "Phường Tân Phong",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30202014",
    "id": "30202014",
    "name": "Phường Đoàn Kết",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30203015",
    "id": "30203015",
    "name": "Xã Sin Suối Hồ",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30203016",
    "id": "30203016",
    "name": "Xã Phong Thổ",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30203017",
    "id": "30203017",
    "name": "Xã Sì Lở Lầu",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30203018",
    "id": "30203018",
    "name": "Xã Dào San",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30203019",
    "id": "30203019",
    "name": "Xã Khổng Lào",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30207020",
    "id": "30207020",
    "name": "Xã Tủa Sín Chải",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30207021",
    "id": "30207021",
    "name": "Xã Sìn Hồ",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30207022",
    "id": "30207022",
    "name": "Xã Hồng Thu",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30207023",
    "id": "30207023",
    "name": "Xã Nậm Tăm",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30207024",
    "id": "30207024",
    "name": "Xã Pu Sam Cáp",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30207025",
    "id": "30207025",
    "name": "Xã Nậm Cuổi",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30207026",
    "id": "30207026",
    "name": "Xã Nậm Mạ",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30213027",
    "id": "30213027",
    "name": "Xã Lê Lợi",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30213028",
    "id": "30213028",
    "name": "Xã Nậm Hàng",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30213029",
    "id": "30213029",
    "name": "Xã Mường Mô",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30213030",
    "id": "30213030",
    "name": "Xã Hua Bum",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30213031",
    "id": "30213031",
    "name": "Xã Pa Tần",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30201032",
    "id": "30201032",
    "name": "Xã Bum Nưa",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30201033",
    "id": "30201033",
    "name": "Xã Bum Tở",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30201034",
    "id": "30201034",
    "name": "Xã Mường Tè",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30201035",
    "id": "30201035",
    "name": "Xã Thu Lũm",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30201036",
    "id": "30201036",
    "name": "Xã Pa Ủ",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30201037",
    "id": "30201037",
    "name": "Xã Tà Tổng",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30201038",
    "id": "30201038",
    "name": "Xã Mù Cả",
    "provinceId": "13",
    "provinceName": "Tỉnh Lai Châu",
    "level": 2
  },
  {
    "systemId": "W2_30301001",
    "id": "30301001",
    "name": "Phường Tô Hiệu",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30301002",
    "id": "30301002",
    "name": "Phường Chiềng An",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30301003",
    "id": "30301003",
    "name": "Phường Chiềng Cơi",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30301004",
    "id": "30301004",
    "name": "Phường Chiềng Sinh",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30319005",
    "id": "30319005",
    "name": "Phường Mộc Châu",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30319006",
    "id": "30319006",
    "name": "Phường Mộc Sơn",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30319007",
    "id": "30319007",
    "name": "Phường Vân Sơn",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30319008",
    "id": "30319008",
    "name": "Phường Thảo Nguyên",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30319009",
    "id": "30319009",
    "name": "Xã Đoàn Kết",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30319010",
    "id": "30319010",
    "name": "Xã Lóng Sập",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30319011",
    "id": "30319011",
    "name": "Xã Chiềng Sơn",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30323012",
    "id": "30323012",
    "name": "Xã Vân Hồ",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30323013",
    "id": "30323013",
    "name": "Xã Song Khủa",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30323014",
    "id": "30323014",
    "name": "Xã Tô Múa",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30323015",
    "id": "30323015",
    "name": "Xã Xuân Nha",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30303016",
    "id": "30303016",
    "name": "Xã Quỳnh Nhai",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30303017",
    "id": "30303017",
    "name": "Xã Mường Chiên",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30303018",
    "id": "30303018",
    "name": "Xã Mường Giôn",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30303019",
    "id": "30303019",
    "name": "Xã Mường Sại",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30307020",
    "id": "30307020",
    "name": "Xã Thuận Châu",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30307021",
    "id": "30307021",
    "name": "Xã Chiềng La",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30307022",
    "id": "30307022",
    "name": "Xã Nậm Lầu",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30307023",
    "id": "30307023",
    "name": "Xã Muổi Nọi",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30307024",
    "id": "30307024",
    "name": "Xã Mường Khiêng",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30307025",
    "id": "30307025",
    "name": "Xã Co Mạ",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30307026",
    "id": "30307026",
    "name": "Xã Bình Thuận",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30307027",
    "id": "30307027",
    "name": "Xã Mường É",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30307028",
    "id": "30307028",
    "name": "Xã Long Hẹ",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30305029",
    "id": "30305029",
    "name": "Xã Mường La",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30305030",
    "id": "30305030",
    "name": "Xã Chiềng Lao",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30305031",
    "id": "30305031",
    "name": "Xã Mường Bú",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30305032",
    "id": "30305032",
    "name": "Xã Chiềng Hoa",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30309033",
    "id": "30309033",
    "name": "Xã Bắc Yên",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30309034",
    "id": "30309034",
    "name": "Xã Tà Xùa",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30309035",
    "id": "30309035",
    "name": "Xã Tạ Khoa",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30309036",
    "id": "30309036",
    "name": "Xã Xím Vàng",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30309037",
    "id": "30309037",
    "name": "Xã Pắc Ngà",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30309038",
    "id": "30309038",
    "name": "Xã Chiềng Sại",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30311039",
    "id": "30311039",
    "name": "Xã Phù Yên",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30311040",
    "id": "30311040",
    "name": "Xã Gia Phù",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30311041",
    "id": "30311041",
    "name": "Xã Tường Hạ",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30311042",
    "id": "30311042",
    "name": "Xã Mường Cơi",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30311043",
    "id": "30311043",
    "name": "Xã Mường Bang",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30311044",
    "id": "30311044",
    "name": "Xã Tân Phong",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30311045",
    "id": "30311045",
    "name": "Xã Kim Bon",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30317046",
    "id": "30317046",
    "name": "Xã Yên Châu",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30317047",
    "id": "30317047",
    "name": "Xã Chiềng Hặc",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30317048",
    "id": "30317048",
    "name": "Xã Lóng Phiêng",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30317049",
    "id": "30317049",
    "name": "Xã Yên Sơn",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30313050",
    "id": "30313050",
    "name": "Xã Chiềng Mai",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30313051",
    "id": "30313051",
    "name": "Xã Mai Sơn",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30313052",
    "id": "30313052",
    "name": "Xã Phiêng Pằn",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30313053",
    "id": "30313053",
    "name": "Xã Chiềng Mung",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30313054",
    "id": "30313054",
    "name": "Xã Phiêng Cằm",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30313055",
    "id": "30313055",
    "name": "Xã Mường Chanh",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30313056",
    "id": "30313056",
    "name": "Xã Tà Hộc",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30313057",
    "id": "30313057",
    "name": "Xã Chiềng Sung",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30315058",
    "id": "30315058",
    "name": "Xã Bó Sinh",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30315059",
    "id": "30315059",
    "name": "Xã Chiềng Khương",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30315060",
    "id": "30315060",
    "name": "Xã Mường Hung",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30315061",
    "id": "30315061",
    "name": "Xã Chiềng Khoong",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30315062",
    "id": "30315062",
    "name": "Xã Mường Lầm",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30315063",
    "id": "30315063",
    "name": "Xã Nậm Ty",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30315064",
    "id": "30315064",
    "name": "Xã Sông Mã",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30315065",
    "id": "30315065",
    "name": "Xã Huổi Một",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30315066",
    "id": "30315066",
    "name": "Xã Chiềng Sơ",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30321067",
    "id": "30321067",
    "name": "Xã Sốp Cộp",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30321068",
    "id": "30321068",
    "name": "Xã Púng Bánh",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30319069",
    "id": "30319069",
    "name": "Xã Tân Yên",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30307070",
    "id": "30307070",
    "name": "Xã Mường Bám",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30305071",
    "id": "30305071",
    "name": "Xã Ngọc Chiến",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30311072",
    "id": "30311072",
    "name": "Xã Suối Tọ",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30317073",
    "id": "30317073",
    "name": "Xã Phiêng Khoài",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30321074",
    "id": "30321074",
    "name": "Xã Mường Lạn",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_30321075",
    "id": "30321075",
    "name": "Xã Mường Lèo",
    "provinceId": "23",
    "provinceName": "Tỉnh Sơn La",
    "level": 2
  },
  {
    "systemId": "W2_40101001",
    "id": "40101001",
    "name": "Phường Hạc Thành",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40101002",
    "id": "40101002",
    "name": "Phường Quảng Phú",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40101003",
    "id": "40101003",
    "name": "Phường Đông Quang",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40101004",
    "id": "40101004",
    "name": "Phường Đông Sơn",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40101005",
    "id": "40101005",
    "name": "Phường Đông Tiến",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40101006",
    "id": "40101006",
    "name": "Phường Hàm Rồng",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40101007",
    "id": "40101007",
    "name": "Phường Nguyệt Viên",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40105008",
    "id": "40105008",
    "name": "Phường Sầm Sơn",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40105009",
    "id": "40105009",
    "name": "Phường Nam Sầm Sơn",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40103010",
    "id": "40103010",
    "name": "Phường Bỉm Sơn",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40103011",
    "id": "40103011",
    "name": "Phường Quang Trung",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40153012",
    "id": "40153012",
    "name": "Phường Ngọc Sơn",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40153013",
    "id": "40153013",
    "name": "Phường Tân Dân",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40153014",
    "id": "40153014",
    "name": "Phường Hải Lĩnh",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40153015",
    "id": "40153015",
    "name": "Phường Tĩnh Gia",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40153016",
    "id": "40153016",
    "name": "Phường Đào Duy Tư",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40153017",
    "id": "40153017",
    "name": "Phường Hải Bình",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40153018",
    "id": "40153018",
    "name": "Phường Trúc Lâm",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40153019",
    "id": "40153019",
    "name": "Phường Nghi Sơn",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40153020",
    "id": "40153020",
    "name": "Xã Các Sơn",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40153021",
    "id": "40153021",
    "name": "Xã Trường Lâm",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40131022",
    "id": "40131022",
    "name": "Xã Hà Trung",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40131023",
    "id": "40131023",
    "name": "Xã Tống Sơn",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40131024",
    "id": "40131024",
    "name": "Xã Hà Long",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40131025",
    "id": "40131025",
    "name": "Xã Hoạt Giang",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40131026",
    "id": "40131026",
    "name": "Xã Lĩnh Toại",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40139027",
    "id": "40139027",
    "name": "Xã Triệu Lộc",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40139028",
    "id": "40139028",
    "name": "Xã Đông Thành",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40139029",
    "id": "40139029",
    "name": "Xã Hậu Lộc",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40139030",
    "id": "40139030",
    "name": "Xã Hoa Lộc",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40139031",
    "id": "40139031",
    "name": "Xã Vạn Lộc",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40133032",
    "id": "40133032",
    "name": "Xã Nga Sơn",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40133033",
    "id": "40133033",
    "name": "Xã Nga Thắng",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40133034",
    "id": "40133034",
    "name": "Xã Hồ Vương",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40133035",
    "id": "40133035",
    "name": "Xã Tân Tiến",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40133036",
    "id": "40133036",
    "name": "Xã Nga An",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40133037",
    "id": "40133037",
    "name": "Xã Ba Đình",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40143038",
    "id": "40143038",
    "name": "Xã Hoằng Hóa",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40143039",
    "id": "40143039",
    "name": "Xã Hoằng Tiến",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40143040",
    "id": "40143040",
    "name": "Xã Hoằng Thanh",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40143041",
    "id": "40143041",
    "name": "Xã Hoằng Lộc",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40143042",
    "id": "40143042",
    "name": "Xã Hoằng Châu",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40143043",
    "id": "40143043",
    "name": "Xã Hoằng Sơn",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40143044",
    "id": "40143044",
    "name": "Xã Hoằng Phú",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40143045",
    "id": "40143045",
    "name": "Xã Hoằng Giang",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40149046",
    "id": "40149046",
    "name": "Xã Lưu Vệ",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40149047",
    "id": "40149047",
    "name": "Xã Quảng Yên",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40149048",
    "id": "40149048",
    "name": "Xã Quảng Ngọc",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40149049",
    "id": "40149049",
    "name": "Xã Quảng Ninh",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40149050",
    "id": "40149050",
    "name": "Xã Quảng Bình",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40149051",
    "id": "40149051",
    "name": "Xã Tiên Trang",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40149052",
    "id": "40149052",
    "name": "Xã Quảng Chính",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40151053",
    "id": "40151053",
    "name": "Xã Nông Cống",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40151054",
    "id": "40151054",
    "name": "Xã Thắng Lợi",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40151055",
    "id": "40151055",
    "name": "Xã Trung Chính",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40151056",
    "id": "40151056",
    "name": "Xã Trường Văn",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40151057",
    "id": "40151057",
    "name": "Xã Thăng Bình",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40151058",
    "id": "40151058",
    "name": "Xã Tượng Lĩnh",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40151059",
    "id": "40151059",
    "name": "Xã Công Chính",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40141060",
    "id": "40141060",
    "name": "Xã Thiệu Hóa",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40141061",
    "id": "40141061",
    "name": "Xã Thiệu Quang",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40141062",
    "id": "40141062",
    "name": "Xã Thiệu Tiến",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40141063",
    "id": "40141063",
    "name": "Xã Thiệu Toán",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40141064",
    "id": "40141064",
    "name": "Xã Thiệu Trung",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40135065",
    "id": "40135065",
    "name": "Xã Yên Định",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40135066",
    "id": "40135066",
    "name": "Xã Yên Trường",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40135067",
    "id": "40135067",
    "name": "Xã Yên Phú",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40135068",
    "id": "40135068",
    "name": "Xã Quý Lộc",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40135069",
    "id": "40135069",
    "name": "Xã Yên Ninh",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40135070",
    "id": "40135070",
    "name": "Xã Định Tân",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40135071",
    "id": "40135071",
    "name": "Xã Định Hòa",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40137072",
    "id": "40137072",
    "name": "Xã Thọ Xuân",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40137073",
    "id": "40137073",
    "name": "Xã Thọ Long",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40137074",
    "id": "40137074",
    "name": "Xã Xuân Hòa",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40137075",
    "id": "40137075",
    "name": "Xã Sao Vàng",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40137076",
    "id": "40137076",
    "name": "Xã Lam Sơn",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40137077",
    "id": "40137077",
    "name": "Xã Thọ Lập",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40137078",
    "id": "40137078",
    "name": "Xã Xuân Tín",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40137079",
    "id": "40137079",
    "name": "Xã Xuân Lập",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40129080",
    "id": "40129080",
    "name": "Xã Vĩnh Lộc",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40129081",
    "id": "40129081",
    "name": "Xã Tây Đô",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40129082",
    "id": "40129082",
    "name": "Xã Biện Thượng",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40147083",
    "id": "40147083",
    "name": "Xã Triệu Sơn",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40147084",
    "id": "40147084",
    "name": "Xã Thọ Bình",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40147085",
    "id": "40147085",
    "name": "Xã Thọ Ngọc",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40147086",
    "id": "40147086",
    "name": "Xã Thọ Phú",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40147087",
    "id": "40147087",
    "name": "Xã Hợp Tiến",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40147088",
    "id": "40147088",
    "name": "Xã An Nông",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40147089",
    "id": "40147089",
    "name": "Xã Tân Ninh",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40147090",
    "id": "40147090",
    "name": "Xã Đồng Tiến",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40107091",
    "id": "40107091",
    "name": "Xã Mường Chanh",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40107092",
    "id": "40107092",
    "name": "Xã Quang Chiểu",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40107093",
    "id": "40107093",
    "name": "Xã Tam chung",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40107094",
    "id": "40107094",
    "name": "Xã Mường Lát",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40107095",
    "id": "40107095",
    "name": "Xã Pù Nhi",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40107096",
    "id": "40107096",
    "name": "Xã Nhi Sơn",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40107097",
    "id": "40107097",
    "name": "Xã Mường Lý",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40107098",
    "id": "40107098",
    "name": "Xã Trung Lý",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40109099",
    "id": "40109099",
    "name": "Xã Hồi Xuân",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40109100",
    "id": "40109100",
    "name": "Xã Nam Xuân",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40109101",
    "id": "40109101",
    "name": "Xã Thiên Phủ",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40109102",
    "id": "40109102",
    "name": "Xã Hiền Kiệt",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40109103",
    "id": "40109103",
    "name": "Xã Phú Xuân",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40109104",
    "id": "40109104",
    "name": "Xã Phú Lệ",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40109105",
    "id": "40109105",
    "name": "Xã Trung Thành",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40109106",
    "id": "40109106",
    "name": "Xã Trung Sơn",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40111107",
    "id": "40111107",
    "name": "Xã Na Mèo",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40111108",
    "id": "40111108",
    "name": "Xã Sơn Thủy",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40111109",
    "id": "40111109",
    "name": "Xã Sơn Điện",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40111110",
    "id": "40111110",
    "name": "Xã Mường Mìn",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40111111",
    "id": "40111111",
    "name": "Xã Tam Thanh",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40111112",
    "id": "40111112",
    "name": "Xã Tam Lư",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40111113",
    "id": "40111113",
    "name": "Xã Quan Sơn",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40111114",
    "id": "40111114",
    "name": "Xã Trung Hạ",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40117115",
    "id": "40117115",
    "name": "Xã Linh Sơn",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40117116",
    "id": "40117116",
    "name": "Xã Đồng Lương",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40117117",
    "id": "40117117",
    "name": "Xã Văn Phú",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40117118",
    "id": "40117118",
    "name": "Xã Giao An",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40117119",
    "id": "40117119",
    "name": "Xã Yên Khương",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40117120",
    "id": "40117120",
    "name": "Xã Yên Thắng",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40113121",
    "id": "40113121",
    "name": "Xã Văn Nho",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40113122",
    "id": "40113122",
    "name": "Xã Thiết Ống",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40113123",
    "id": "40113123",
    "name": "Xã Bá Thước",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40113124",
    "id": "40113124",
    "name": "Xã Cổ Lũng",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40113125",
    "id": "40113125",
    "name": "Xã Pù Luông",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40113126",
    "id": "40113126",
    "name": "Xã Điền Lư",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40113127",
    "id": "40113127",
    "name": "Xã Điền Quang",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40113128",
    "id": "40113128",
    "name": "Xã Quý Lương",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40121129",
    "id": "40121129",
    "name": "Xã Ngọc Lặc",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40121130",
    "id": "40121130",
    "name": "Xã Thạch Lập",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40121131",
    "id": "40121131",
    "name": "Xã Ngọc Liên",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40121132",
    "id": "40121132",
    "name": "Xã Minh Sơn",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40121133",
    "id": "40121133",
    "name": "Xã Nguyệt Ấn",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40121134",
    "id": "40121134",
    "name": "Xã Kiên Thọ",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40115135",
    "id": "40115135",
    "name": "Xã Cẩm Thạch",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40115136",
    "id": "40115136",
    "name": "Xã Cẩm Thủy",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40115137",
    "id": "40115137",
    "name": "Xã Cẩm Tú",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40115138",
    "id": "40115138",
    "name": "Xã Cẩm Vân",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40115139",
    "id": "40115139",
    "name": "Xã Cẩm Tân",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40119140",
    "id": "40119140",
    "name": "Xã Kim Tân",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40119141",
    "id": "40119141",
    "name": "Xã Vân Du",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40119142",
    "id": "40119142",
    "name": "Xã Ngọc Trạo",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40119143",
    "id": "40119143",
    "name": "Xã Thạch Bình",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40119144",
    "id": "40119144",
    "name": "Xã Thành Vinh",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40119145",
    "id": "40119145",
    "name": "Xã Thạch Quảng",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40125146",
    "id": "40125146",
    "name": "Xã Như Xuân",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40125147",
    "id": "40125147",
    "name": "Xã Thượng Ninh",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40125148",
    "id": "40125148",
    "name": "Xã Xuân Bình",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40125149",
    "id": "40125149",
    "name": "Xã Hóa Quỳ",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40125150",
    "id": "40125150",
    "name": "Xã Thanh Quân",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40125151",
    "id": "40125151",
    "name": "Xã Thanh Phong",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40127152",
    "id": "40127152",
    "name": "Xã Xuân Du",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40127153",
    "id": "40127153",
    "name": "Xã Mậu Lâm",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40127154",
    "id": "40127154",
    "name": "Xã Như Thanh",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40127155",
    "id": "40127155",
    "name": "Xã Yên Thọ",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40127156",
    "id": "40127156",
    "name": "Xã Xuân Thái",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40127157",
    "id": "40127157",
    "name": "Xã Thanh Kỳ",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40123158",
    "id": "40123158",
    "name": "Xã Bát Mọt",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40123159",
    "id": "40123159",
    "name": "Xã Yên Nhân",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40123160",
    "id": "40123160",
    "name": "Xã Lương Sơn",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40123161",
    "id": "40123161",
    "name": "Xã Thường Xuân",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40123162",
    "id": "40123162",
    "name": "Xã Luận Thành",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40123163",
    "id": "40123163",
    "name": "Xã Tân Thành",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40123164",
    "id": "40123164",
    "name": "Xã Vạn Xuân",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40123165",
    "id": "40123165",
    "name": "Xã Thắng Lộc",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40123166",
    "id": "40123166",
    "name": "Xã Xuân Chinh",
    "provinceId": "25",
    "provinceName": "Tỉnh Thanh Hóa",
    "level": 2
  },
  {
    "systemId": "W2_40327001",
    "id": "40327001",
    "name": "Xã Anh Sơn",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40327002",
    "id": "40327002",
    "name": "Xã Yên Xuân",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40327003",
    "id": "40327003",
    "name": "Xã Nhân Hòa",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40327004",
    "id": "40327004",
    "name": "Xã Anh Sơn Đông",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40327005",
    "id": "40327005",
    "name": "Xã Vĩnh Tường",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40327006",
    "id": "40327006",
    "name": "Xã Thành Bình Thọ",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40321007",
    "id": "40321007",
    "name": "Xã Con Cuông",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40321008",
    "id": "40321008",
    "name": "Xã Môn Sơn",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40321009",
    "id": "40321009",
    "name": "Xã Mậu Thạch",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40321010",
    "id": "40321010",
    "name": "Xã Cam Phục",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40321011",
    "id": "40321011",
    "name": "Xã Châu Khê",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40321012",
    "id": "40321012",
    "name": "Xã Bình Chuẩn",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40325013",
    "id": "40325013",
    "name": "Xã Diễn Châu",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40325014",
    "id": "40325014",
    "name": "Xã Đức Châu",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40325015",
    "id": "40325015",
    "name": "Xã Quảng Châu",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40325016",
    "id": "40325016",
    "name": "Xã Hải Châu",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40325017",
    "id": "40325017",
    "name": "Xã Tân Châu",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40325018",
    "id": "40325018",
    "name": "Xã An Châu",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40325019",
    "id": "40325019",
    "name": "Xã Minh Châu",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40325020",
    "id": "40325020",
    "name": "Xã Hùng Châu",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40329021",
    "id": "40329021",
    "name": "Xã Đô Lương",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40329022",
    "id": "40329022",
    "name": "Xã Bạch Ngọc",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40329023",
    "id": "40329023",
    "name": "Xã Văn Hiến",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40329024",
    "id": "40329024",
    "name": "Xã Bạch Hà",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40329025",
    "id": "40329025",
    "name": "Xã Thuần Trung",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40329026",
    "id": "40329026",
    "name": "Xã Lương Sơn",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40339027",
    "id": "40339027",
    "name": "Phường Hoàng Mai",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40339028",
    "id": "40339028",
    "name": "Phường Tân Mai",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40339029",
    "id": "40339029",
    "name": "Phường Quỳnh Mai",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40337030",
    "id": "40337030",
    "name": "Xã Hưng Nguyên",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40337031",
    "id": "40337031",
    "name": "Xã Yên Trung",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40337032",
    "id": "40337032",
    "name": "Xã Hưng Nguyên Nam",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40337033",
    "id": "40337033",
    "name": "Xã Lam Thành",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40309034",
    "id": "40309034",
    "name": "Xã Mường Xén",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40309035",
    "id": "40309035",
    "name": "Xã Hữu Kiệm",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40309036",
    "id": "40309036",
    "name": "Xã Nậm Cắn",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40309037",
    "id": "40309037",
    "name": "Xã Chiêu Lưu",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40309038",
    "id": "40309038",
    "name": "Xã Na Loi",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40309039",
    "id": "40309039",
    "name": "Xã Mường Típ",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40309040",
    "id": "40309040",
    "name": "Xã Na Ngoi",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40309041",
    "id": "40309041",
    "name": "Xã Mỹ Lý",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40309042",
    "id": "40309042",
    "name": "Xã Bắc Lý",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40309043",
    "id": "40309043",
    "name": "Xã Keng Đu",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40309044",
    "id": "40309044",
    "name": "Xã Huồi Tụ",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40309045",
    "id": "40309045",
    "name": "Xã Mường Lống",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40335046",
    "id": "40335046",
    "name": "Xã Vạn An",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40335047",
    "id": "40335047",
    "name": "Xã Nam Đàn",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40335048",
    "id": "40335048",
    "name": "Xã Đại Huệ",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40335049",
    "id": "40335049",
    "name": "Xã Thiên Nhẫn",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40335050",
    "id": "40335050",
    "name": "Xã Kim Liên",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40313051",
    "id": "40313051",
    "name": "Xã Nghĩa Đàn",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40313052",
    "id": "40313052",
    "name": "Xã Nghĩa Thọ",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40313053",
    "id": "40313053",
    "name": "Xã Nghĩa Lâm",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40313054",
    "id": "40313054",
    "name": "Xã Nghĩa Mai",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40313055",
    "id": "40313055",
    "name": "Xã Nghĩa Hưng",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40313056",
    "id": "40313056",
    "name": "Xã Nghĩa Khánh",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40313057",
    "id": "40313057",
    "name": "Xã Nghĩa Lộc",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40333058",
    "id": "40333058",
    "name": "Xã Nghi Lộc",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40333059",
    "id": "40333059",
    "name": "Xã Phúc Lộc",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40333060",
    "id": "40333060",
    "name": "Xã Đông Lộc",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40333061",
    "id": "40333061",
    "name": "Xã Trung Lộc",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40333062",
    "id": "40333062",
    "name": "Xã Thần Lĩnh",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40333063",
    "id": "40333063",
    "name": "Xã Hải Lộc",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40333064",
    "id": "40333064",
    "name": "Xã Văn Kiều",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40305065",
    "id": "40305065",
    "name": "Xã Quế Phong",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40305066",
    "id": "40305066",
    "name": "Xã Tiền Phong",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40305067",
    "id": "40305067",
    "name": "Xã Tri Lễ",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40305068",
    "id": "40305068",
    "name": "Xã Mường Quàng",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40305069",
    "id": "40305069",
    "name": "Xã Thông Thụ",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40307070",
    "id": "40307070",
    "name": "Xã Quỳ Châu",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40307071",
    "id": "40307071",
    "name": "Xã Châu Tiến",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40307072",
    "id": "40307072",
    "name": "Xã Hùng Chân",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40307073",
    "id": "40307073",
    "name": "Xã Châu Bình",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40311074",
    "id": "40311074",
    "name": "Xã Quỳ Hợp",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40311075",
    "id": "40311075",
    "name": "Xã Tam Hợp",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40311076",
    "id": "40311076",
    "name": "Xã Châu Lộc",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40311077",
    "id": "40311077",
    "name": "Xã Châu Hồng",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40311078",
    "id": "40311078",
    "name": "Xã Mường Ham",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40311079",
    "id": "40311079",
    "name": "Xã Mường Chọng",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40311080",
    "id": "40311080",
    "name": "Xã Minh Hợp",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40317081",
    "id": "40317081",
    "name": "Xã Quỳnh Lưu",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40317082",
    "id": "40317082",
    "name": "Xã Quỳnh Văn",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40317083",
    "id": "40317083",
    "name": "Xã Quỳnh Anh",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40317084",
    "id": "40317084",
    "name": "Xã Quỳnh Tam",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40317085",
    "id": "40317085",
    "name": "Xã Quỳnh Phú",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40317086",
    "id": "40317086",
    "name": "Xã Quỳnh Sơn",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40317087",
    "id": "40317087",
    "name": "Xã Quỳnh Thắng",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40319088",
    "id": "40319088",
    "name": "Xã Tân Kỳ",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40319089",
    "id": "40319089",
    "name": "Xã Tân Phú",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40319090",
    "id": "40319090",
    "name": "Xã Tân An",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40319091",
    "id": "40319091",
    "name": "Xã Nghĩa Đồng",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40319092",
    "id": "40319092",
    "name": "Xã Giai Xuân",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40319093",
    "id": "40319093",
    "name": "Xã Nghĩa Hành",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40319094",
    "id": "40319094",
    "name": "Xã Tiên Đồng",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40314095",
    "id": "40314095",
    "name": "Phường Thái Hòa",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40314096",
    "id": "40314096",
    "name": "Phường Tây Hiếu",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40314097",
    "id": "40314097",
    "name": "Xã Đông Hiếu",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40331098",
    "id": "40331098",
    "name": "Xã Cát Ngạn",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40331099",
    "id": "40331099",
    "name": "Xã Tam Đồng",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40331100",
    "id": "40331100",
    "name": "Xã Hạnh Lâm",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40331101",
    "id": "40331101",
    "name": "Xã Sơn Lâm",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40331102",
    "id": "40331102",
    "name": "Xã Hoa Quân",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40331103",
    "id": "40331103",
    "name": "Xã Kim Bảng",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40331104",
    "id": "40331104",
    "name": "Xã Bích Hào",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40331105",
    "id": "40331105",
    "name": "Xã Đại Đồng",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40331106",
    "id": "40331106",
    "name": "Xã Xuân Lâm",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40315107",
    "id": "40315107",
    "name": "Xã Tam Quang",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40315108",
    "id": "40315108",
    "name": "Xã Tam Thái",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40315109",
    "id": "40315109",
    "name": "Xã Tương Dương",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40315110",
    "id": "40315110",
    "name": "Xã Lượng Minh",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40315111",
    "id": "40315111",
    "name": "Xã Yên Na",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40315112",
    "id": "40315112",
    "name": "Xã Yên Hòa",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40315113",
    "id": "40315113",
    "name": "Xã Nga My",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40315114",
    "id": "40315114",
    "name": "Xã Hữu Khuông",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40315115",
    "id": "40315115",
    "name": "Xã Nhôn Mai",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40301116",
    "id": "40301116",
    "name": "Phường Trường Vinh",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40301117",
    "id": "40301117",
    "name": "Phường Thành Vinh",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40301118",
    "id": "40301118",
    "name": "Phường Vinh Hưng",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40301119",
    "id": "40301119",
    "name": "Phường Vinh Phú",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40301120",
    "id": "40301120",
    "name": "Phường Vinh Lộc",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40301121",
    "id": "40301121",
    "name": "Phường Cửa Lò",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40323122",
    "id": "40323122",
    "name": "Xã Yên Thành",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40323123",
    "id": "40323123",
    "name": "Xã Quan Thành",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40323124",
    "id": "40323124",
    "name": "Xã Hợp Minh",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40323125",
    "id": "40323125",
    "name": "Xã Vân Tụ",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40323126",
    "id": "40323126",
    "name": "Xã Vân Du",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40323127",
    "id": "40323127",
    "name": "Xã Quang Đồng",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40323128",
    "id": "40323128",
    "name": "Xã Giai Lạc",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40323129",
    "id": "40323129",
    "name": "Xã Bình Minh",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40323130",
    "id": "40323130",
    "name": "Xã Đông Thành",
    "provinceId": "17",
    "provinceName": "Tỉnh Nghệ An",
    "level": 2
  },
  {
    "systemId": "W2_40520001",
    "id": "40520001",
    "name": "Phường Sông Trí",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40520002",
    "id": "40520002",
    "name": "Phường Hải Ninh",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40520003",
    "id": "40520003",
    "name": "Phường Hoành Sơn",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40520004",
    "id": "40520004",
    "name": "Phường Vũng Áng",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40519005",
    "id": "40519005",
    "name": "Xã Kỳ Xuân",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40519006",
    "id": "40519006",
    "name": "Xã Kỳ Anh",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40519007",
    "id": "40519007",
    "name": "Xã Kỳ Hoa",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40519008",
    "id": "40519008",
    "name": "Xã Kỳ Văn",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40519009",
    "id": "40519009",
    "name": "Xã Kỳ Khang",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40519010",
    "id": "40519010",
    "name": "Xã Kỳ Lạc",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40519011",
    "id": "40519011",
    "name": "Xã Kỳ Thượng",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40515012",
    "id": "40515012",
    "name": "Xã Cẩm Xuyên",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40515013",
    "id": "40515013",
    "name": "Xã Thiên Cầm",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40515014",
    "id": "40515014",
    "name": "Xã Cẩm Duệ",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40515015",
    "id": "40515015",
    "name": "Xã Cẩm Hưng",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40515016",
    "id": "40515016",
    "name": "Xã Cẩm Lạc",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40515017",
    "id": "40515017",
    "name": "Xã Cẩm Trung",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40515018",
    "id": "40515018",
    "name": "Xã Yên Hòa",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40501019",
    "id": "40501019",
    "name": "Phường Thành Sen",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40501020",
    "id": "40501020",
    "name": "Phường Trần Phú",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40501021",
    "id": "40501021",
    "name": "Phường Hà Huy Tập",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40501022",
    "id": "40501022",
    "name": "Xã Thạch Lạc",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40501023",
    "id": "40501023",
    "name": "Xã Đồng Tiến",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40501024",
    "id": "40501024",
    "name": "Xã Thạch Khê",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40501025",
    "id": "40501025",
    "name": "Xã Cẩm Bình",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40513026",
    "id": "40513026",
    "name": "Xã Thạch Hà",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40513027",
    "id": "40513027",
    "name": "Xã Toàn Lưu",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40513028",
    "id": "40513028",
    "name": "Xã Việt Xuyên",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40513029",
    "id": "40513029",
    "name": "Xã Đông Kinh",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40513030",
    "id": "40513030",
    "name": "Xã Thạch Xuân",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40513031",
    "id": "40513031",
    "name": "Xã Lộc Hà",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40513032",
    "id": "40513032",
    "name": "Xã Hồng Lộc",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40513033",
    "id": "40513033",
    "name": "Xã Mai Phụ",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40511034",
    "id": "40511034",
    "name": "Xã Can Lộc",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40511035",
    "id": "40511035",
    "name": "Xã Tùng Lộc",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40511036",
    "id": "40511036",
    "name": "Xã Gia Hanh",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40511037",
    "id": "40511037",
    "name": "Xã Trường Lưu",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40511038",
    "id": "40511038",
    "name": "Xã Xuân Lộc",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40511039",
    "id": "40511039",
    "name": "Xã Đồng Lộc",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40503040",
    "id": "40503040",
    "name": "Phường Bắc Hồng Lĩnh",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40503041",
    "id": "40503041",
    "name": "Phường Nam Hồng Lĩnh",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40505042",
    "id": "40505042",
    "name": "Xã Tiên Điền",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40505043",
    "id": "40505043",
    "name": "Xã Nghi Xuân",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40505044",
    "id": "40505044",
    "name": "Xã Cổ Đạm",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40505045",
    "id": "40505045",
    "name": "Xã Đan Hải",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40507046",
    "id": "40507046",
    "name": "Xã Đức Thọ",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40507047",
    "id": "40507047",
    "name": "Xã Đức Quang",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40507048",
    "id": "40507048",
    "name": "Xã Đức Đồng",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40507049",
    "id": "40507049",
    "name": "Xã Đức Thịnh",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40507050",
    "id": "40507050",
    "name": "Xã Đức Minh",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40509051",
    "id": "40509051",
    "name": "Xã Hương Sơn",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40509052",
    "id": "40509052",
    "name": "Xã Sơn Tây",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40509053",
    "id": "40509053",
    "name": "Xã Tứ Mỹ",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40509054",
    "id": "40509054",
    "name": "Xã Sơn Giang",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40509055",
    "id": "40509055",
    "name": "Xã Sơn Tiến",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40509056",
    "id": "40509056",
    "name": "Xã Sơn Hồng",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40509057",
    "id": "40509057",
    "name": "Xã Kim Hoa",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40521058",
    "id": "40521058",
    "name": "Xã Vũ Quang",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40521059",
    "id": "40521059",
    "name": "Xã Mai Hoa",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40521060",
    "id": "40521060",
    "name": "Xã Thượng Đức",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40517061",
    "id": "40517061",
    "name": "Xã Hương Khê",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40517062",
    "id": "40517062",
    "name": "Xã Hương Phố",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40517063",
    "id": "40517063",
    "name": "Xã Hương Đô",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40517064",
    "id": "40517064",
    "name": "Xã Hà Linh",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40517065",
    "id": "40517065",
    "name": "Xã Hương Bình",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40517066",
    "id": "40517066",
    "name": "Xã Phúc Trạch",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40517067",
    "id": "40517067",
    "name": "Xã Hương Xuân",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40509068",
    "id": "40509068",
    "name": "Xã Sơn Kim 1",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40509069",
    "id": "40509069",
    "name": "Xã Sơn Kim 2",
    "provinceId": "09",
    "provinceName": "Tỉnh Hà Tĩnh",
    "level": 2
  },
  {
    "systemId": "W2_40701001",
    "id": "40701001",
    "name": "Phường Đồng Hới",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40701002",
    "id": "40701002",
    "name": "Phường Đồng Thuận",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40701003",
    "id": "40701003",
    "name": "Phường Đồng Sơn",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40715004",
    "id": "40715004",
    "name": "Xã Nam Gianh",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40715005",
    "id": "40715005",
    "name": "Xã Nam Ba Đồn",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40715006",
    "id": "40715006",
    "name": "Phường Ba Đồn",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40715007",
    "id": "40715007",
    "name": "Phường Bắc Gianh",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40705008",
    "id": "40705008",
    "name": "Xã Dân Hóa",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40705009",
    "id": "40705009",
    "name": "Xã Kim Điền",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40705010",
    "id": "40705010",
    "name": "Xã Kim Phú",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40705011",
    "id": "40705011",
    "name": "Xã Minh Hóa",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40705012",
    "id": "40705012",
    "name": "Xã Tân Thành",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40703013",
    "id": "40703013",
    "name": "Xã Tuyên Lâm",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40703014",
    "id": "40703014",
    "name": "Xã Tuyên Sơn",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40703015",
    "id": "40703015",
    "name": "Xã Đồng Lê",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40703016",
    "id": "40703016",
    "name": "Xã Tuyên Phú",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40703017",
    "id": "40703017",
    "name": "Xã Tuyên Bình",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40703018",
    "id": "40703018",
    "name": "Xã Tuyên Hóa",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40707019",
    "id": "40707019",
    "name": "Xã Tân Gianh",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40707020",
    "id": "40707020",
    "name": "Xã Trung Thuần",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40707021",
    "id": "40707021",
    "name": "Xã Quảng Trạch",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40707022",
    "id": "40707022",
    "name": "Xã Hòa Trạch",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40707023",
    "id": "40707023",
    "name": "Xã Phú Trạch",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40709024",
    "id": "40709024",
    "name": "Xã Thượng Trạch",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40709025",
    "id": "40709025",
    "name": "Xã Phong Nha",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40709026",
    "id": "40709026",
    "name": "Xã Bắc Trạch",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40709027",
    "id": "40709027",
    "name": "Xã Đông Trạch",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40709028",
    "id": "40709028",
    "name": "Xã Hoàn Lão",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40709029",
    "id": "40709029",
    "name": "Xã Bố Trạch",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40709030",
    "id": "40709030",
    "name": "Xã Nam Trạch",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40711031",
    "id": "40711031",
    "name": "Xã Quảng Ninh",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40711032",
    "id": "40711032",
    "name": "Xã Ninh Châu",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40711033",
    "id": "40711033",
    "name": "Xã Trường Ninh",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40711034",
    "id": "40711034",
    "name": "Xã Trường Sơn",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40713035",
    "id": "40713035",
    "name": "Xã Lệ Thủy",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40713036",
    "id": "40713036",
    "name": "Xã Cam Hồng",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40713037",
    "id": "40713037",
    "name": "Xã Sen Ngư",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40713038",
    "id": "40713038",
    "name": "Xã Tân Mỹ",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40713039",
    "id": "40713039",
    "name": "Xã Trường Phú",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40713040",
    "id": "40713040",
    "name": "Xã Lệ Ninh",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40713041",
    "id": "40713041",
    "name": "Xã Kim Ngân",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40901042",
    "id": "40901042",
    "name": "Phường Đông Hà",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40901043",
    "id": "40901043",
    "name": "Phường Nam Đông Hà",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40903044",
    "id": "40903044",
    "name": "Phường Quảng Trị",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40905045",
    "id": "40905045",
    "name": "Xã Vĩnh Linh",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40905046",
    "id": "40905046",
    "name": "Xã Cửa Tùng",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40905047",
    "id": "40905047",
    "name": "Xã Vĩnh Hoàng",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40905048",
    "id": "40905048",
    "name": "Xã Vĩnh Thủy",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40905049",
    "id": "40905049",
    "name": "Xã Bến Quan",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40907050",
    "id": "40907050",
    "name": "Xã Cồn Tiên",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40907051",
    "id": "40907051",
    "name": "Xã Cửa Việt",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40907052",
    "id": "40907052",
    "name": "Xã Gio Linh",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40907053",
    "id": "40907053",
    "name": "Xã Bến Hải",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40915054",
    "id": "40915054",
    "name": "Xã Hướng Lập",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40915055",
    "id": "40915055",
    "name": "Xã Hướng Phùng",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40915056",
    "id": "40915056",
    "name": "Xã Khe Sanh",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40915057",
    "id": "40915057",
    "name": "Xã Tân Lập",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40915058",
    "id": "40915058",
    "name": "Xã Lao Bảo",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40915059",
    "id": "40915059",
    "name": "Xã Lìa",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40915060",
    "id": "40915060",
    "name": "Xã A Dơi",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40917061",
    "id": "40917061",
    "name": "Xã La Lay",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40917062",
    "id": "40917062",
    "name": "Xã Tà Rụt",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40917063",
    "id": "40917063",
    "name": "Xã Đakrông",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40917064",
    "id": "40917064",
    "name": "Xã Ba Lòng",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40917065",
    "id": "40917065",
    "name": "Xã Hướng Hiệp",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40909066",
    "id": "40909066",
    "name": "Xã Cam Lộ",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40909067",
    "id": "40909067",
    "name": "Xã Hiếu Giang",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40911068",
    "id": "40911068",
    "name": "Xã Triệu Phong",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40911069",
    "id": "40911069",
    "name": "Xã Ái Tử",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40911070",
    "id": "40911070",
    "name": "Xã Triệu Bình",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40911071",
    "id": "40911071",
    "name": "Xã Triệu Cơ",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40911072",
    "id": "40911072",
    "name": "Xã Nam Cửa Việt",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40913073",
    "id": "40913073",
    "name": "Xã Diên Sanh",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40913074",
    "id": "40913074",
    "name": "Xã Mỹ Thủy",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40913075",
    "id": "40913075",
    "name": "Xã Hải Lăng",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40913076",
    "id": "40913076",
    "name": "Xã Vĩnh Định",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40913077",
    "id": "40913077",
    "name": "Xã Nam Hải Lăng",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_40919078",
    "id": "40919078",
    "name": "Đặc khu Cồn Cỏ",
    "provinceId": "22",
    "provinceName": "Tỉnh Quảng Trị",
    "level": 2
  },
  {
    "systemId": "W2_41109001",
    "id": "41109001",
    "name": "Phường Thuận An",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41119002",
    "id": "41119002",
    "name": "Phường Hóa Châu",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41109003",
    "id": "41109003",
    "name": "Phường Mỹ Thượng",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41101004",
    "id": "41101004",
    "name": "Phường Vỹ Dạ",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41101005",
    "id": "41101005",
    "name": "Phường Thuận Hóa",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41101006",
    "id": "41101006",
    "name": "Phường An Cựu",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41101007",
    "id": "41101007",
    "name": "Phường Thủy Xuân",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41119008",
    "id": "41119008",
    "name": "Phường Kim Long",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41119009",
    "id": "41119009",
    "name": "Phường Hương An",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41119010",
    "id": "41119010",
    "name": "Phường Phú Xuân",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41107011",
    "id": "41107011",
    "name": "Phường Hương Trà",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41107012",
    "id": "41107012",
    "name": "Phường Kim Trà",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41111013",
    "id": "41111013",
    "name": "Phường Thanh Thủy",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41111014",
    "id": "41111014",
    "name": "Phường Hương Thủy",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41111015",
    "id": "41111015",
    "name": "Phường Phú Bài",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41103016",
    "id": "41103016",
    "name": "Phường Phong Điền",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41103017",
    "id": "41103017",
    "name": "Phường Phong Thái",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41103018",
    "id": "41103018",
    "name": "Phường Phong Dinh",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41103019",
    "id": "41103019",
    "name": "Phường Phong Phú",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41105020",
    "id": "41105020",
    "name": "Phường Phong Quảng",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41105021",
    "id": "41105021",
    "name": "Xã Đan Điền",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41105022",
    "id": "41105022",
    "name": "Xã Quảng Điền",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41109023",
    "id": "41109023",
    "name": "Xã Phú Vinh",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41109024",
    "id": "41109024",
    "name": "Xã Phú Hồ",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41109025",
    "id": "41109025",
    "name": "Xã Phú Vang",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41113026",
    "id": "41113026",
    "name": "Xã Vinh Lộc",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41113027",
    "id": "41113027",
    "name": "Xã Hưng Lộc",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41113028",
    "id": "41113028",
    "name": "Xã Lộc An",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41113029",
    "id": "41113029",
    "name": "Xã Phú Lộc",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41113030",
    "id": "41113030",
    "name": "Xã Chân Mây – Lăng Cô",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41113031",
    "id": "41113031",
    "name": "Xã Long Quảng",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41113032",
    "id": "41113032",
    "name": "Xã Nam Đông",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41113033",
    "id": "41113033",
    "name": "Xã Khe Tre",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41107034",
    "id": "41107034",
    "name": "Xã Bình Điền",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41115035",
    "id": "41115035",
    "name": "Xã A Lưới 1",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41115036",
    "id": "41115036",
    "name": "Xã A Lưới 2",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41115037",
    "id": "41115037",
    "name": "Xã A Lưới 3",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41115038",
    "id": "41115038",
    "name": "Xã A Lưới 4",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41115039",
    "id": "41115039",
    "name": "Xã A Lưới 5",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_41101040",
    "id": "41101040",
    "name": "Phường Dương Nỗ",
    "provinceId": "07",
    "provinceName": "Thành phố Huế",
    "level": 2
  },
  {
    "systemId": "W2_50101001",
    "id": "50101001",
    "name": "Phường Hải Châu",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50101002",
    "id": "50101002",
    "name": "Phường Hòa Cường",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50103003",
    "id": "50103003",
    "name": "Phường Thanh Khê",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50115004",
    "id": "50115004",
    "name": "Phường An Khê",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50105005",
    "id": "50105005",
    "name": "Phường An Hải",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50105006",
    "id": "50105006",
    "name": "Phường Sơn Trà",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50107007",
    "id": "50107007",
    "name": "Phường Ngũ Hành Sơn",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50109008",
    "id": "50109008",
    "name": "Phường Hòa Khánh",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50109009",
    "id": "50109009",
    "name": "Phường Hải Vân",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50109010",
    "id": "50109010",
    "name": "Phường Liên Chiểu",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50115011",
    "id": "50115011",
    "name": "Phường Cẩm Lệ",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50111012",
    "id": "50111012",
    "name": "Phường Hòa Xuân",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50111013",
    "id": "50111013",
    "name": "Xã Hòa Vang",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50111014",
    "id": "50111014",
    "name": "Xã Hòa Tiến",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50111015",
    "id": "50111015",
    "name": "Xã Bà Nà",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50113016",
    "id": "50113016",
    "name": "Đặc khu Hoàng Sa",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50325017",
    "id": "50325017",
    "name": "Xã Núi Thành",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50325018",
    "id": "50325018",
    "name": "Xã Tam Mỹ",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50325019",
    "id": "50325019",
    "name": "Xã Tam Anh",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50325020",
    "id": "50325020",
    "name": "Xã Đức Phú",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50325021",
    "id": "50325021",
    "name": "Xã Tam Xuân",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50325022",
    "id": "50325022",
    "name": "Xã Tam Hải",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50301023",
    "id": "50301023",
    "name": "Phường Tam Kỳ",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50301024",
    "id": "50301024",
    "name": "Phường Quảng Phú",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50301025",
    "id": "50301025",
    "name": "Phường Hương Trà",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50301026",
    "id": "50301026",
    "name": "Phường Bàn Thạch",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50302027",
    "id": "50302027",
    "name": "Xã Tây Hồ",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50302028",
    "id": "50302028",
    "name": "Xã Chiên Đàn",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50302029",
    "id": "50302029",
    "name": "Xã Phú Ninh",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50321030",
    "id": "50321030",
    "name": "Xã Lãnh Ngọc",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50321031",
    "id": "50321031",
    "name": "Xã Tiên Phước",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50321032",
    "id": "50321032",
    "name": "Xã Thạnh Bình",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50321033",
    "id": "50321033",
    "name": "Xã Sơn Cẩm Hà",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50327034",
    "id": "50327034",
    "name": "Xã Trà Liên",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50327035",
    "id": "50327035",
    "name": "Xã Trà Giáp",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50327036",
    "id": "50327036",
    "name": "Xã Trà Tân",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50327037",
    "id": "50327037",
    "name": "Xã Trà Đốc",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50327038",
    "id": "50327038",
    "name": "Xã Trà My",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50329039",
    "id": "50329039",
    "name": "Xã Nam Trà My",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50329040",
    "id": "50329040",
    "name": "Xã Trà Tập",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50329041",
    "id": "50329041",
    "name": "Xã Trà Vân",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50329042",
    "id": "50329042",
    "name": "Xã Trà Linh",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50329043",
    "id": "50329043",
    "name": "Xã Trà Leng",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50315044",
    "id": "50315044",
    "name": "Xã Thăng Bình",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50315045",
    "id": "50315045",
    "name": "Xã Thăng An",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50315046",
    "id": "50315046",
    "name": "Xã Thăng Trường",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50315047",
    "id": "50315047",
    "name": "Xã Thăng Điền",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50315048",
    "id": "50315048",
    "name": "Xã Thăng Phú",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50315049",
    "id": "50315049",
    "name": "Xã Đồng Dương",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50317050",
    "id": "50317050",
    "name": "Xã Quế Sơn Trung",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50317051",
    "id": "50317051",
    "name": "Xã Quế Sơn",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50317052",
    "id": "50317052",
    "name": "Xã Xuân Phú",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50317053",
    "id": "50317053",
    "name": "Xã Nông Sơn",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50317054",
    "id": "50317054",
    "name": "Xã Quế Phước",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50311055",
    "id": "50311055",
    "name": "Xã Duy Nghĩa",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50311056",
    "id": "50311056",
    "name": "Xã Nam Phước",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50311057",
    "id": "50311057",
    "name": "Xã Duy Xuyên",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50311058",
    "id": "50311058",
    "name": "Xã Thu Bồn",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50309059",
    "id": "50309059",
    "name": "Phường Điện Bàn",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50309060",
    "id": "50309060",
    "name": "Phường Điện Bàn Đông",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50309061",
    "id": "50309061",
    "name": "Phường An Thắng",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50309062",
    "id": "50309062",
    "name": "Phường Điện Bàn Bắc",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50309063",
    "id": "50309063",
    "name": "Xã Điện Bàn Tây",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50309064",
    "id": "50309064",
    "name": "Xã Gò Nổi",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50303065",
    "id": "50303065",
    "name": "Phường Hội An",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50303066",
    "id": "50303066",
    "name": "Phường Hội An Đông",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50303067",
    "id": "50303067",
    "name": "Phường Hội An Tây",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50303068",
    "id": "50303068",
    "name": "Xã Tân Hiệp",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50307069",
    "id": "50307069",
    "name": "Xã Đại Lộc",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50307070",
    "id": "50307070",
    "name": "Xã Hà Nha",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50307071",
    "id": "50307071",
    "name": "Xã Thượng Đức",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50307072",
    "id": "50307072",
    "name": "Xã Vu Gia",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50307073",
    "id": "50307073",
    "name": "Xã Phú Thuận",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50313074",
    "id": "50313074",
    "name": "Xã Thạnh Mỹ",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50313075",
    "id": "50313075",
    "name": "Xã Bến Giằng",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50313076",
    "id": "50313076",
    "name": "Xã Nam Giang",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50313077",
    "id": "50313077",
    "name": "Xã Đắc Pring",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50313078",
    "id": "50313078",
    "name": "Xã La Dêê",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50313079",
    "id": "50313079",
    "name": "Xã La Êê",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50305080",
    "id": "50305080",
    "name": "Xã Sông Vàng",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50305081",
    "id": "50305081",
    "name": "Xã Sông Kôn",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50305082",
    "id": "50305082",
    "name": "Xã Đông Giang",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50305083",
    "id": "50305083",
    "name": "Xã Bến Hiên",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50304084",
    "id": "50304084",
    "name": "Xã Avương",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50304085",
    "id": "50304085",
    "name": "Xã Tây Giang",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50304086",
    "id": "50304086",
    "name": "Xã Hùng Sơn",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50319087",
    "id": "50319087",
    "name": "Xã Hiệp Đức",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50319088",
    "id": "50319088",
    "name": "Xã Việt An",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50319089",
    "id": "50319089",
    "name": "Xã Phước Trà",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50323090",
    "id": "50323090",
    "name": "Xã Khâm Đức",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50323091",
    "id": "50323091",
    "name": "Xã Phước Năng",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50323092",
    "id": "50323092",
    "name": "Xã Phước Chánh",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50323093",
    "id": "50323093",
    "name": "Xã Phước Thành",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50323094",
    "id": "50323094",
    "name": "Xã Phước Hiệp",
    "provinceId": "31",
    "provinceName": "Thành phố Đà Nẵng",
    "level": 2
  },
  {
    "systemId": "W2_50501001",
    "id": "50501001",
    "name": "Xã Tịnh Khê",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50501002",
    "id": "50501002",
    "name": "Phường Trương Quang Trọng",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50501003",
    "id": "50501003",
    "name": "Xã An Phú",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50501004",
    "id": "50501004",
    "name": "Phường Cẩm Thành",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50501005",
    "id": "50501005",
    "name": "Phường Nghĩa Lộ",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50523006",
    "id": "50523006",
    "name": "Phường Trà Câu",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50523007",
    "id": "50523007",
    "name": "Xã Nguyễn Nghiêm",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50523008",
    "id": "50523008",
    "name": "Phường Đức Phổ",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50523009",
    "id": "50523009",
    "name": "Xã Khánh Cường",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50523010",
    "id": "50523010",
    "name": "Phường Sa Huỳnh",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50505011",
    "id": "50505011",
    "name": "Xã Bình Minh",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50505012",
    "id": "50505012",
    "name": "Xã Bình Chương",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50505013",
    "id": "50505013",
    "name": "Xã Bình Sơn",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50505014",
    "id": "50505014",
    "name": "Xã Vạn Tường",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50505015",
    "id": "50505015",
    "name": "Xã Đông Sơn",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50509016",
    "id": "50509016",
    "name": "Xã Trường Giang",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50509017",
    "id": "50509017",
    "name": "Xã Ba Gia",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50509018",
    "id": "50509018",
    "name": "Xã Sơn Tịnh",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50509019",
    "id": "50509019",
    "name": "Xã Thọ Phong",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50515020",
    "id": "50515020",
    "name": "Xã Tư Nghĩa",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50515021",
    "id": "50515021",
    "name": "Xã Vệ Giang",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50515022",
    "id": "50515022",
    "name": "Xã Nghĩa Giang",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50515023",
    "id": "50515023",
    "name": "Xã Trà Giang",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50517024",
    "id": "50517024",
    "name": "Xã Nghĩa Hành",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50517025",
    "id": "50517025",
    "name": "Xã Đình Cương",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50517026",
    "id": "50517026",
    "name": "Xã Thiện Tín",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50517027",
    "id": "50517027",
    "name": "Xã Phước Giang",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50521028",
    "id": "50521028",
    "name": "Xã Long Phụng",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50521029",
    "id": "50521029",
    "name": "Xã Mỏ Cày",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50521030",
    "id": "50521030",
    "name": "Xã Mộ Đức",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50521031",
    "id": "50521031",
    "name": "Xã Lân Phong",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50507032",
    "id": "50507032",
    "name": "Xã Trà Bồng",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50507033",
    "id": "50507033",
    "name": "Xã Đông Trà Bồng",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50507034",
    "id": "50507034",
    "name": "Xã Tây Trà",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50507035",
    "id": "50507035",
    "name": "Xã Thanh Bồng",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50507036",
    "id": "50507036",
    "name": "Xã Cà Đam",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50507037",
    "id": "50507037",
    "name": "Xã Tây Trà Bồng",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50513038",
    "id": "50513038",
    "name": "Xã Sơn Hạ",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50513039",
    "id": "50513039",
    "name": "Xã Sơn Linh",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50513040",
    "id": "50513040",
    "name": "Xã Sơn Hà",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50513041",
    "id": "50513041",
    "name": "Xã Sơn Thủy",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50513042",
    "id": "50513042",
    "name": "Xã Sơn Kỳ",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50511043",
    "id": "50511043",
    "name": "Xã Sơn Tây",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50511044",
    "id": "50511044",
    "name": "Xã Sơn Tây Thượng",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50511045",
    "id": "50511045",
    "name": "Xã Sơn Tây Hạ",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50519046",
    "id": "50519046",
    "name": "Xã Minh Long",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50519047",
    "id": "50519047",
    "name": "Xã Sơn Mai",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50525048",
    "id": "50525048",
    "name": "Xã Ba Vì",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50525049",
    "id": "50525049",
    "name": "Xã Ba Tô",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50525050",
    "id": "50525050",
    "name": "Xã Ba Dinh",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50525051",
    "id": "50525051",
    "name": "Xã Ba Tơ",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50525052",
    "id": "50525052",
    "name": "Xã Ba Vinh",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50525053",
    "id": "50525053",
    "name": "Xã Ba Động",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50525054",
    "id": "50525054",
    "name": "Xã Đặng Thùy Trâm",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50525055",
    "id": "50525055",
    "name": "Xã Ba Xa",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_50503056",
    "id": "50503056",
    "name": "Đặc khu Lý Sơn",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60101057",
    "id": "60101057",
    "name": "Phường Kon Tum",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60101058",
    "id": "60101058",
    "name": "Phường Đăk Cấm",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60101059",
    "id": "60101059",
    "name": "Phường Đăk BLa",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60101060",
    "id": "60101060",
    "name": "Xã Ngọk Bay",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60101061",
    "id": "60101061",
    "name": "Xã Ia Chim",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60101062",
    "id": "60101062",
    "name": "Xã Đăk Rơ Wa",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60111063",
    "id": "60111063",
    "name": "Xã Đăk Pxi",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60111064",
    "id": "60111064",
    "name": "Xã Đăk Mar",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60111065",
    "id": "60111065",
    "name": "Xã Đăk Ui",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60111066",
    "id": "60111066",
    "name": "Xã Ngọk Réo",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60111067",
    "id": "60111067",
    "name": "Xã Đăk Hà",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60107068",
    "id": "60107068",
    "name": "Xã Ngọk Tụ",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60107069",
    "id": "60107069",
    "name": "Xã Đăk Tô",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60107070",
    "id": "60107070",
    "name": "Xã Kon Đào",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60115071",
    "id": "60115071",
    "name": "Xã Đăk Sao",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60115072",
    "id": "60115072",
    "name": "Xã Đăk Tờ Kan",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60115073",
    "id": "60115073",
    "name": "Xã Tu Mơ Rông",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60115074",
    "id": "60115074",
    "name": "Xã Măng Ri",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60105075",
    "id": "60105075",
    "name": "Xã Bờ Y",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60105076",
    "id": "60105076",
    "name": "Xã Sa Loong",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60105077",
    "id": "60105077",
    "name": "Xã Dục Nông",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60103078",
    "id": "60103078",
    "name": "Xã Xốp",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60103079",
    "id": "60103079",
    "name": "Xã Ngọc Linh",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60103080",
    "id": "60103080",
    "name": "Xã Đăk Plô",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60103081",
    "id": "60103081",
    "name": "Xã Đăk Pék",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60103082",
    "id": "60103082",
    "name": "Xã Đăk Môn",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60113083",
    "id": "60113083",
    "name": "Xã Sa Thầy",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60113084",
    "id": "60113084",
    "name": "Xã Sa Bình",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60113085",
    "id": "60113085",
    "name": "Xã Ya Ly",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60114086",
    "id": "60114086",
    "name": "Xã Ia Tơi",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60108087",
    "id": "60108087",
    "name": "Xã Đăk Kôi",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60108088",
    "id": "60108088",
    "name": "Xã Kon Braih",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60108089",
    "id": "60108089",
    "name": "Xã Đăk Rve",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60109090",
    "id": "60109090",
    "name": "Xã Măng Đen",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60109091",
    "id": "60109091",
    "name": "Xã Măng Bút",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60109092",
    "id": "60109092",
    "name": "Xã Kon Plông",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60103093",
    "id": "60103093",
    "name": "Xã Đăk Long",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60113094",
    "id": "60113094",
    "name": "Xã Rờ Kơi",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60113095",
    "id": "60113095",
    "name": "Xã Mô Rai",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_60114096",
    "id": "60114096",
    "name": "Xã Ia Đal",
    "provinceId": "20",
    "provinceName": "Tỉnh Quảng Ngãi",
    "level": 2
  },
  {
    "systemId": "W2_51101001",
    "id": "51101001",
    "name": "Phường Nha Trang",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51101002",
    "id": "51101002",
    "name": "Phường Bắc Nha Trang",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51101003",
    "id": "51101003",
    "name": "Phường Tây Nha Trang",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51101004",
    "id": "51101004",
    "name": "Phường Nam Nha Trang",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51109005",
    "id": "51109005",
    "name": "Phường Bắc Cam Ranh",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51109006",
    "id": "51109006",
    "name": "Phường Cam Ranh",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51109007",
    "id": "51109007",
    "name": "Phường Cam Linh",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51109008",
    "id": "51109008",
    "name": "Phường Ba Ngòi",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51109009",
    "id": "51109009",
    "name": "Xã Nam Cam Ranh",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51105010",
    "id": "51105010",
    "name": "Xã Bắc Ninh Hòa",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51105011",
    "id": "51105011",
    "name": "Phường Ninh Hòa",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51105012",
    "id": "51105012",
    "name": "Xã Tân Định",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51105013",
    "id": "51105013",
    "name": "Phường Đông Ninh Hòa",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51105014",
    "id": "51105014",
    "name": "Phường Hòa Thắng",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51105015",
    "id": "51105015",
    "name": "Xã Nam Ninh Hòa",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51105016",
    "id": "51105016",
    "name": "Xã Tây Ninh Hòa",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51105017",
    "id": "51105017",
    "name": "Xã Hòa Trí",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51103018",
    "id": "51103018",
    "name": "Xã Đại Lãnh",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51103019",
    "id": "51103019",
    "name": "Xã Tu Bông",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51103020",
    "id": "51103020",
    "name": "Xã Vạn Thắng",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51103021",
    "id": "51103021",
    "name": "Xã Vạn Ninh",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51103022",
    "id": "51103022",
    "name": "Xã Vạn Hưng",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51107023",
    "id": "51107023",
    "name": "Xã Diên Khánh",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51107024",
    "id": "51107024",
    "name": "Xã Diên Lạc",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51107025",
    "id": "51107025",
    "name": "Xã Diên Điền",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51107026",
    "id": "51107026",
    "name": "Xã Diên Lâm",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51107027",
    "id": "51107027",
    "name": "Xã Diên Thọ",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51107028",
    "id": "51107028",
    "name": "Xã Suối Hiệp",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51117029",
    "id": "51117029",
    "name": "Xã Cam Lâm",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51117030",
    "id": "51117030",
    "name": "Xã Suối Dầu",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51117031",
    "id": "51117031",
    "name": "Xã Cam Hiệp",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51117032",
    "id": "51117032",
    "name": "Xã Cam An",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51111033",
    "id": "51111033",
    "name": "Xã Bắc Khánh Vĩnh",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51111034",
    "id": "51111034",
    "name": "Xã Trung Khánh Vĩnh",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51111035",
    "id": "51111035",
    "name": "Xã Tây Khánh Vĩnh",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51111036",
    "id": "51111036",
    "name": "Xã Nam Khánh Vĩnh",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51111037",
    "id": "51111037",
    "name": "Xã Khánh Vĩnh",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51113038",
    "id": "51113038",
    "name": "Xã Khánh Sơn",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51113039",
    "id": "51113039",
    "name": "Xã Tây Khánh Sơn",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51113040",
    "id": "51113040",
    "name": "Xã Đông Khánh Sơn",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_51115041",
    "id": "51115041",
    "name": "Đặc khu Trường Sa",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_70501042",
    "id": "70501042",
    "name": "Phường Phan Rang",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_70501043",
    "id": "70501043",
    "name": "Phường Đông Hải",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_70505044",
    "id": "70505044",
    "name": "Phường Ninh Chử",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_70501045",
    "id": "70501045",
    "name": "Phường Bảo An",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_70501046",
    "id": "70501046",
    "name": "Phường Đô Vinh",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_70507047",
    "id": "70507047",
    "name": "Xã Ninh Phước",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_70507048",
    "id": "70507048",
    "name": "Xã Phước Hữu",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_70507049",
    "id": "70507049",
    "name": "Xã Phước Hậu",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_70513050",
    "id": "70513050",
    "name": "Xã Thuận Nam",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_70513051",
    "id": "70513051",
    "name": "Xã Cà Ná",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_70513052",
    "id": "70513052",
    "name": "Xã Phước Hà",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_70513053",
    "id": "70513053",
    "name": "Xã Phước Dinh",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_70505054",
    "id": "70505054",
    "name": "Xã Ninh Hải",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_70505055",
    "id": "70505055",
    "name": "Xã Xuân Hải",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_70505056",
    "id": "70505056",
    "name": "Xã Vĩnh Hải",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_70511057",
    "id": "70511057",
    "name": "Xã Thuận Bắc",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_70511058",
    "id": "70511058",
    "name": "Xã Công Hải",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_70503059",
    "id": "70503059",
    "name": "Xã Ninh Sơn",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_70503060",
    "id": "70503060",
    "name": "Xã Lâm Sơn",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_70503061",
    "id": "70503061",
    "name": "Xã Anh Dũng",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_70503062",
    "id": "70503062",
    "name": "Xã Mỹ Sơn",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_70509063",
    "id": "70509063",
    "name": "Xã Bác Ái Đông",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_70509064",
    "id": "70509064",
    "name": "Xã Bác Ái",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_70509065",
    "id": "70509065",
    "name": "Xã Bác Ái Tây",
    "provinceId": "12",
    "provinceName": "Tỉnh Khánh Hòa",
    "level": 2
  },
  {
    "systemId": "W2_50701001",
    "id": "50701001",
    "name": "Phường Quy Nhơn",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50701002",
    "id": "50701002",
    "name": "Phường Quy Nhơn Đông",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50701003",
    "id": "50701003",
    "name": "Phường Quy Nhơn Tây",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50701004",
    "id": "50701004",
    "name": "Phường Quy Nhơn Nam",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50701005",
    "id": "50701005",
    "name": "Phường Quy Nhơn Bắc",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50717006",
    "id": "50717006",
    "name": "Phường Bình Định",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50717007",
    "id": "50717007",
    "name": "Phường An Nhơn",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50717008",
    "id": "50717008",
    "name": "Phường An Nhơn Đông",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50717009",
    "id": "50717009",
    "name": "Phường An Nhơn Nam",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50717010",
    "id": "50717010",
    "name": "Phường An Nhơn Bắc",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50717011",
    "id": "50717011",
    "name": "Xã An Nhơn Tây",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50705012",
    "id": "50705012",
    "name": "Phường Bồng Sơn",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50705013",
    "id": "50705013",
    "name": "Phường hoài Nhơn",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50705014",
    "id": "50705014",
    "name": "Phường Tam Quan",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50705015",
    "id": "50705015",
    "name": "Phường hoài Nhơn Đông",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50705016",
    "id": "50705016",
    "name": "Phường hoài Nhơn Tây",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50705017",
    "id": "50705017",
    "name": "Phường hoài Nhơn Nam",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50705018",
    "id": "50705018",
    "name": "Phường hoài Nhơn Bắc",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50713019",
    "id": "50713019",
    "name": "Xã Phù Cát",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50713020",
    "id": "50713020",
    "name": "Xã Xuân An",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50713021",
    "id": "50713021",
    "name": "Xã Ngô Mây",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50713022",
    "id": "50713022",
    "name": "Xã Cát Tiến",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50713023",
    "id": "50713023",
    "name": "Xã Đề Gi",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50713024",
    "id": "50713024",
    "name": "Xã Hòa Hội",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50713025",
    "id": "50713025",
    "name": "Xã Hội Sơn",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50709026",
    "id": "50709026",
    "name": "Xã Phù Mỹ",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50709027",
    "id": "50709027",
    "name": "Xã An Lương",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50709028",
    "id": "50709028",
    "name": "Xã Bình Dương",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50709029",
    "id": "50709029",
    "name": "Xã Phù Mỹ Đông",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50709030",
    "id": "50709030",
    "name": "Xã Phù Mỹ Tây",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50709031",
    "id": "50709031",
    "name": "Xã Phù Mỹ Nam",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50709032",
    "id": "50709032",
    "name": "Xã Phù Mỹ Bắc",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50719033",
    "id": "50719033",
    "name": "Xã Tuy Phước",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50719034",
    "id": "50719034",
    "name": "Xã Tuy Phước Đông",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50719035",
    "id": "50719035",
    "name": "Xã Tuy Phước Tây",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50719036",
    "id": "50719036",
    "name": "Xã Tuy Phước Bắc",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50715037",
    "id": "50715037",
    "name": "Xã Tây Sơn",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50715038",
    "id": "50715038",
    "name": "Xã Bình Khê",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50715039",
    "id": "50715039",
    "name": "Xã Bình Phú",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50715040",
    "id": "50715040",
    "name": "Xã Bình Hiệp",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50715041",
    "id": "50715041",
    "name": "Xã Bình An",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50707042",
    "id": "50707042",
    "name": "Xã hoài Ân",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50707043",
    "id": "50707043",
    "name": "Xã Ân Tường",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50707044",
    "id": "50707044",
    "name": "Xã Kim Sơn",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50707045",
    "id": "50707045",
    "name": "Xã Vạn Đức",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50707046",
    "id": "50707046",
    "name": "Xã Ân Hảo",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50721047",
    "id": "50721047",
    "name": "Xã Vân Canh",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50721048",
    "id": "50721048",
    "name": "Xã Canh Vinh",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50721049",
    "id": "50721049",
    "name": "Xã Canh Liên",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50711050",
    "id": "50711050",
    "name": "Xã Vĩnh Thạnh",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50711051",
    "id": "50711051",
    "name": "Xã Vĩnh Thịnh",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50711052",
    "id": "50711052",
    "name": "Xã Vĩnh Quang",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50711053",
    "id": "50711053",
    "name": "Xã Vĩnh Sơn",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50703054",
    "id": "50703054",
    "name": "Xã An Hòa",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50703055",
    "id": "50703055",
    "name": "Xã An Lão",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50703056",
    "id": "50703056",
    "name": "Xã An Vinh",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50703057",
    "id": "50703057",
    "name": "Xã An Toàn",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60301058",
    "id": "60301058",
    "name": "Phường Pleiku",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60301059",
    "id": "60301059",
    "name": "Phường Hội Phú",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60301060",
    "id": "60301060",
    "name": "Phường Thống Nhất",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60301061",
    "id": "60301061",
    "name": "Phường Diên Hồng",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60301062",
    "id": "60301062",
    "name": "Phường An Phú",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60301063",
    "id": "60301063",
    "name": "Xã Biển Hồ",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60301064",
    "id": "60301064",
    "name": "Xã Gào",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60307065",
    "id": "60307065",
    "name": "Xã Ia Ly",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60307066",
    "id": "60307066",
    "name": "Xã Chư Păh",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60307067",
    "id": "60307067",
    "name": "Xã Ia Khươl",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60307068",
    "id": "60307068",
    "name": "Xã Ia Phí",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60317069",
    "id": "60317069",
    "name": "Xã Chư Prông",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60317070",
    "id": "60317070",
    "name": "Xã Bàu Cạn",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60317071",
    "id": "60317071",
    "name": "Xã Ia Boòng",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60317072",
    "id": "60317072",
    "name": "Xã Ia Lâu",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60317073",
    "id": "60317073",
    "name": "Xã Ia Pia",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60317074",
    "id": "60317074",
    "name": "Xã Ia Tôr",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60319075",
    "id": "60319075",
    "name": "Xã Chư Sê",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60319076",
    "id": "60319076",
    "name": "Xã Bờ Ngoong",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60319077",
    "id": "60319077",
    "name": "Xã Ia Ko",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60319078",
    "id": "60319078",
    "name": "Xã Albá",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60331079",
    "id": "60331079",
    "name": "Xã Chư Pưh",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60331080",
    "id": "60331080",
    "name": "Xã Ia Le",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60331081",
    "id": "60331081",
    "name": "Xã Ia Hrú",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60311082",
    "id": "60311082",
    "name": "Phường An Khê",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60311083",
    "id": "60311083",
    "name": "Phường An Bình",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60311084",
    "id": "60311084",
    "name": "Xã Cửu An",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60327085",
    "id": "60327085",
    "name": "Xã Đak Pơ",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60327086",
    "id": "60327086",
    "name": "Xã Ya Hội",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60303087",
    "id": "60303087",
    "name": "Xã Kbang",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60303088",
    "id": "60303088",
    "name": "Xã Kông Bơ La",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60303089",
    "id": "60303089",
    "name": "Xã Tơ Tung",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60303090",
    "id": "60303090",
    "name": "Xã Sơn Lang",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60303091",
    "id": "60303091",
    "name": "Xã Đak Rong",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60313092",
    "id": "60313092",
    "name": "Xã Kông Chro",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60313093",
    "id": "60313093",
    "name": "Xã Ya Ma",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60313094",
    "id": "60313094",
    "name": "Xã Chư Krey",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60313095",
    "id": "60313095",
    "name": "Xã SRó",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60313096",
    "id": "60313096",
    "name": "Xã Đăk Song",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60313097",
    "id": "60313097",
    "name": "Xã Chơ Long",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60321098",
    "id": "60321098",
    "name": "Phường Ayun Pa",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60321099",
    "id": "60321099",
    "name": "Xã Ia Rbol",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60321100",
    "id": "60321100",
    "name": "Xã Ia Sao",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60329101",
    "id": "60329101",
    "name": "Xã Phú Thiện",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60329102",
    "id": "60329102",
    "name": "Xã Chư A Thai",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60329103",
    "id": "60329103",
    "name": "Xã Ia Hiao",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60320104",
    "id": "60320104",
    "name": "Xã Pờ Tó",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60320105",
    "id": "60320105",
    "name": "Xã Ia Pa",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60320106",
    "id": "60320106",
    "name": "Xã Ia Tul",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60323107",
    "id": "60323107",
    "name": "Xã Phú Túc",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60323108",
    "id": "60323108",
    "name": "Xã Ia Dreh",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60323109",
    "id": "60323109",
    "name": "Xã Ia Rsai",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60323110",
    "id": "60323110",
    "name": "Xã Uar",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60325111",
    "id": "60325111",
    "name": "Xã Đak Đoa",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60325112",
    "id": "60325112",
    "name": "Xã Kon Gang",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60325113",
    "id": "60325113",
    "name": "Xã Ia Băng",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60325114",
    "id": "60325114",
    "name": "Xã KDang",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60325115",
    "id": "60325115",
    "name": "Xã Đak Sơmei",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60305116",
    "id": "60305116",
    "name": "Xã Mang Yang",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60305117",
    "id": "60305117",
    "name": "Xã Lơ Pang",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60305118",
    "id": "60305118",
    "name": "Xã Kon Chiêng",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60305119",
    "id": "60305119",
    "name": "Xã Hra",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60305120",
    "id": "60305120",
    "name": "Xã Ayun",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60309121",
    "id": "60309121",
    "name": "Xã Ia Grai",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60309122",
    "id": "60309122",
    "name": "Xã Ia Krái",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60309123",
    "id": "60309123",
    "name": "Xã Ia Hrung",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60315124",
    "id": "60315124",
    "name": "Xã Đức Cơ",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60315125",
    "id": "60315125",
    "name": "Xã Ia Dơk",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60315126",
    "id": "60315126",
    "name": "Xã Ia Krêl",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_50701127",
    "id": "50701127",
    "name": "Xã Nhơn Châu",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60317128",
    "id": "60317128",
    "name": "Xã Ia Púch",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60317129",
    "id": "60317129",
    "name": "Xã Ia Mơ",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60315130",
    "id": "60315130",
    "name": "Xã Ia Pnôn",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60315131",
    "id": "60315131",
    "name": "Xã Ia Nan",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60315132",
    "id": "60315132",
    "name": "Xã Ia Dom",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60309133",
    "id": "60309133",
    "name": "Xã Ia Chia",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60309134",
    "id": "60309134",
    "name": "Xã Ia O",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60303135",
    "id": "60303135",
    "name": "Xã Krong",
    "provinceId": "06",
    "provinceName": "Tỉnh Gia Lai",
    "level": 2
  },
  {
    "systemId": "W2_60501001",
    "id": "60501001",
    "name": "Xã Hòa Phú",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60501002",
    "id": "60501002",
    "name": "Phường Buôn Ma Thuột",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60501003",
    "id": "60501003",
    "name": "Phường Tân An",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60501004",
    "id": "60501004",
    "name": "Phường Tân Lập",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60501005",
    "id": "60501005",
    "name": "Phường Thành Nhất",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60501006",
    "id": "60501006",
    "name": "Phường Ea Kao",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60509007",
    "id": "60509007",
    "name": "Xã Ea Drông",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60509008",
    "id": "60509008",
    "name": "Phường Buôn Hồ",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60509009",
    "id": "60509009",
    "name": "Phường Cư Bao",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60505010",
    "id": "60505010",
    "name": "Xã Ea Súp",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60505011",
    "id": "60505011",
    "name": "Xã Ea Rốk",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60505012",
    "id": "60505012",
    "name": "Xã Ea Bung",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60505013",
    "id": "60505013",
    "name": "Xã Ia Rvê",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60505014",
    "id": "60505014",
    "name": "Xã Ia Lốp",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60511015",
    "id": "60511015",
    "name": "Xã Ea Wer",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60511016",
    "id": "60511016",
    "name": "Xã Ea Nuôl",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60511017",
    "id": "60511017",
    "name": "Xã Buôn Đôn",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60513018",
    "id": "60513018",
    "name": "Xã Ea Kiết",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60513019",
    "id": "60513019",
    "name": "Xã Ea M’Droh",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60513020",
    "id": "60513020",
    "name": "Xã Quảng Phú",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60513021",
    "id": "60513021",
    "name": "Xã Cuôr Đăng",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60513022",
    "id": "60513022",
    "name": "Xã Cư M’gar",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60513023",
    "id": "60513023",
    "name": "Xã Ea Tul",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60539024",
    "id": "60539024",
    "name": "Xã Pơng Drang",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60539025",
    "id": "60539025",
    "name": "Xã Krông Búk",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60539026",
    "id": "60539026",
    "name": "Xã Cư Pơng",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60503027",
    "id": "60503027",
    "name": "Xã Ea Khăl",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60503028",
    "id": "60503028",
    "name": "Xã Ea Drăng",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60503029",
    "id": "60503029",
    "name": "Xã Ea Wy",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60503030",
    "id": "60503030",
    "name": "Xã Ea H’leo",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60503031",
    "id": "60503031",
    "name": "Xã Ea Hiao",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60507032",
    "id": "60507032",
    "name": "Xã Krông Năng",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60507033",
    "id": "60507033",
    "name": "Xã Dliê Ya",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60507034",
    "id": "60507034",
    "name": "Xã Tam Giang",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60507035",
    "id": "60507035",
    "name": "Xã Phú Xuân",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60519036",
    "id": "60519036",
    "name": "Xã Krông Pắc",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60519037",
    "id": "60519037",
    "name": "Xã Ea Knuếc",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60519038",
    "id": "60519038",
    "name": "Xã Tân Tiến",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60519039",
    "id": "60519039",
    "name": "Xã Ea Phê",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60519040",
    "id": "60519040",
    "name": "Xã Ea Kly",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60519041",
    "id": "60519041",
    "name": "Xã Vụ Bổn",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60515042",
    "id": "60515042",
    "name": "Xã Ea Kar",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60515043",
    "id": "60515043",
    "name": "Xã Ea Ô",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60515044",
    "id": "60515044",
    "name": "Xã Ea Knốp",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60515045",
    "id": "60515045",
    "name": "Xã Cư Yang",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60515046",
    "id": "60515046",
    "name": "Xã Ea Păl",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60517047",
    "id": "60517047",
    "name": "Xã M’Drắk",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60517048",
    "id": "60517048",
    "name": "Xã Ea Riêng",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60517049",
    "id": "60517049",
    "name": "Xã Cư M’ta",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60517050",
    "id": "60517050",
    "name": "Xã Krông Á",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60517051",
    "id": "60517051",
    "name": "Xã Cư Prao",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60517052",
    "id": "60517052",
    "name": "Xã Ea Trang",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60525053",
    "id": "60525053",
    "name": "Xã Hòa Sơn",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60525054",
    "id": "60525054",
    "name": "Xã Dang Kang",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60525055",
    "id": "60525055",
    "name": "Xã Krông Bông",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60525056",
    "id": "60525056",
    "name": "Xã Yang Mao",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60525057",
    "id": "60525057",
    "name": "Xã Cư Pui",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60531058",
    "id": "60531058",
    "name": "Xã Liên Sơn Lắk",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60531059",
    "id": "60531059",
    "name": "Xã Đắk Liêng",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60531060",
    "id": "60531060",
    "name": "Xã Nam Ka",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60531061",
    "id": "60531061",
    "name": "Xã Đắk Phơi",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60531062",
    "id": "60531062",
    "name": "Xã Krông Nô",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60537063",
    "id": "60537063",
    "name": "Xã Ea Ning",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60537064",
    "id": "60537064",
    "name": "Xã Dray Bhăng",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60537065",
    "id": "60537065",
    "name": "Xã Ea Ktur",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60523066",
    "id": "60523066",
    "name": "Xã Krông Ana",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60523067",
    "id": "60523067",
    "name": "Xã Dur Kmăl",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_60523068",
    "id": "60523068",
    "name": "Xã Ea Na",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50901069",
    "id": "50901069",
    "name": "Phường Tuy Hòa",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50901070",
    "id": "50901070",
    "name": "Phường Phú Yên",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50901071",
    "id": "50901071",
    "name": "Phường Bình Kiến",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50905072",
    "id": "50905072",
    "name": "Xã Xuân Thọ",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50905073",
    "id": "50905073",
    "name": "Xã Xuân Cảnh",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50905074",
    "id": "50905074",
    "name": "Xã Xuân Lộc",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50905075",
    "id": "50905075",
    "name": "Phường Xuân Đài",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50905076",
    "id": "50905076",
    "name": "Phường Sông Cầu",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50911077",
    "id": "50911077",
    "name": "Xã Hòa Xuân",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50911078",
    "id": "50911078",
    "name": "Phường Đông Hòa",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50911079",
    "id": "50911079",
    "name": "Phường Hòa Hiệp",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50907080",
    "id": "50907080",
    "name": "Xã Tuy An Bắc",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50907081",
    "id": "50907081",
    "name": "Xã Tuy An Đông",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50907082",
    "id": "50907082",
    "name": "Xã Ô Loan",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50907083",
    "id": "50907083",
    "name": "Xã Tuy An Nam",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50907084",
    "id": "50907084",
    "name": "Xã Tuy An Tây",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50915085",
    "id": "50915085",
    "name": "Xã Phú Hòa 1",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50915086",
    "id": "50915086",
    "name": "Xã Phú Hòa 2",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50912087",
    "id": "50912087",
    "name": "Xã Tây Hòa",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50912088",
    "id": "50912088",
    "name": "Xã Hòa Thịnh",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50912089",
    "id": "50912089",
    "name": "Xã Hòa Mỹ",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50912090",
    "id": "50912090",
    "name": "Xã Sơn Thành",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50909091",
    "id": "50909091",
    "name": "Xã Sơn Hòa",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50909092",
    "id": "50909092",
    "name": "Xã Vân Hòa",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50909093",
    "id": "50909093",
    "name": "Xã Tây Sơn",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50909094",
    "id": "50909094",
    "name": "Xã Suối Trai",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50913095",
    "id": "50913095",
    "name": "Xã Ea Ly",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50913096",
    "id": "50913096",
    "name": "Xã Ea Bá",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50913097",
    "id": "50913097",
    "name": "Xã Đức Bình",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50913098",
    "id": "50913098",
    "name": "Xã Sông Hinh",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50903099",
    "id": "50903099",
    "name": "Xã Xuân Lãnh",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50903100",
    "id": "50903100",
    "name": "Xã Phú Mỡ",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50903101",
    "id": "50903101",
    "name": "Xã Xuân Phước",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_50903102",
    "id": "50903102",
    "name": "Xã Đồng Xuân",
    "provinceId": "32",
    "provinceName": "Tỉnh Đắk Lắk",
    "level": 2
  },
  {
    "systemId": "W2_70301001",
    "id": "70301001",
    "name": "Phường Xuân Hương - Đà Lạt",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70301002",
    "id": "70301002",
    "name": "Phường Cam Ly - Đà Lạt",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70301003",
    "id": "70301003",
    "name": "Phường Lâm Viên - Đà Lạt",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70301004",
    "id": "70301004",
    "name": "Phường Xuân Trường - Đà Lạt",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70305005",
    "id": "70305005",
    "name": "Phường Langbiang - Đà Lạt",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70303006",
    "id": "70303006",
    "name": "Phường 1 Bảo Lộc",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70303007",
    "id": "70303007",
    "name": "Phường 2 Bảo Lộc",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70303008",
    "id": "70303008",
    "name": "Phường 3 Bảo Lộc",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70303009",
    "id": "70303009",
    "name": "Phường B' Lao",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70305010",
    "id": "70305010",
    "name": "Xã Lạc Dương",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70307011",
    "id": "70307011",
    "name": "Xã Đơn Dương",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70307012",
    "id": "70307012",
    "name": "Xã Ka Đô",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70307013",
    "id": "70307013",
    "name": "Xã Quảng Lập",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70307014",
    "id": "70307014",
    "name": "Xã D'Ran",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70309015",
    "id": "70309015",
    "name": "Xã Hiệp Thạnh",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70309016",
    "id": "70309016",
    "name": "Xã Đức Trọng",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70309017",
    "id": "70309017",
    "name": "Xã Tân Hội",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70309018",
    "id": "70309018",
    "name": "Xã Tà Hine",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70309019",
    "id": "70309019",
    "name": "Xã Tà Năng",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70311020",
    "id": "70311020",
    "name": "Xã Đinh Văn - Lâm Hà",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70311021",
    "id": "70311021",
    "name": "Xã Phú Sơn - Lâm Hà",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70311022",
    "id": "70311022",
    "name": "Xã Nam Hà - Lâm Hà",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70311023",
    "id": "70311023",
    "name": "Xã Nam Ban - Lâm Hà",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70311024",
    "id": "70311024",
    "name": "Xã Tân Hà - Lâm Hà",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70311025",
    "id": "70311025",
    "name": "Xã Phúc Thọ - Lâm Hà",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70323026",
    "id": "70323026",
    "name": "Xã Đam Rông 1",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70323027",
    "id": "70323027",
    "name": "Xã Đam Rông 2",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70323028",
    "id": "70323028",
    "name": "Xã Đam Rông 3",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70323029",
    "id": "70323029",
    "name": "Xã Đam Rông 4",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70315030",
    "id": "70315030",
    "name": "Xã Di Linh",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70315031",
    "id": "70315031",
    "name": "Xã Hòa Ninh",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70315032",
    "id": "70315032",
    "name": "Xã Hòa Bắc",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70315033",
    "id": "70315033",
    "name": "Xã Đinh Trang Thượng",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70315034",
    "id": "70315034",
    "name": "Xã Bảo Thuận",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70315035",
    "id": "70315035",
    "name": "Xã Sơn Điền",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70315036",
    "id": "70315036",
    "name": "Xã Gia Hiệp",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70313037",
    "id": "70313037",
    "name": "Xã Bảo Lâm 1",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70313038",
    "id": "70313038",
    "name": "Xã Bảo Lâm 2",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70313039",
    "id": "70313039",
    "name": "Xã Bảo Lâm 3",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70313040",
    "id": "70313040",
    "name": "Xã Bảo Lâm 4",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70313041",
    "id": "70313041",
    "name": "Xã Bảo Lâm 5",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70317042",
    "id": "70317042",
    "name": "Xã Đạ Huoai",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70317043",
    "id": "70317043",
    "name": "Xã Đạ Huoai 2",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70317044",
    "id": "70317044",
    "name": "Xã Đạ Huoai 3",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70317045",
    "id": "70317045",
    "name": "Xã Đạ Tẻh",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70317046",
    "id": "70317046",
    "name": "Xã Đạ Tẻh 2",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70317047",
    "id": "70317047",
    "name": "Xã Đạ Tẻh 3",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70317048",
    "id": "70317048",
    "name": "Xã Cát Tiên",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70317049",
    "id": "70317049",
    "name": "Xã Cát Tiên 2",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70317050",
    "id": "70317050",
    "name": "Xã Cát Tiên 3",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71501051",
    "id": "71501051",
    "name": "Phường Hàm Thắng",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71501052",
    "id": "71501052",
    "name": "Phường Bình Thuận",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71501053",
    "id": "71501053",
    "name": "Phường Mũi Né",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71501054",
    "id": "71501054",
    "name": "Phường Phú Thuỷ",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71501055",
    "id": "71501055",
    "name": "Phường Phan Thiết",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71501056",
    "id": "71501056",
    "name": "Phường Tiến Thành",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71513057",
    "id": "71513057",
    "name": "Phường La Gi",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71513058",
    "id": "71513058",
    "name": "Phường Phước Hội",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71501059",
    "id": "71501059",
    "name": "Xã Tuyên Quang",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71513060",
    "id": "71513060",
    "name": "Xã Tân Hải",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71503061",
    "id": "71503061",
    "name": "Xã Vĩnh Hảo",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71503062",
    "id": "71503062",
    "name": "Xã Liên Hương",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71503063",
    "id": "71503063",
    "name": "Xã Tuy Phong",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71503064",
    "id": "71503064",
    "name": "Xã Phan Rí Cửa",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71505065",
    "id": "71505065",
    "name": "Xã Bắc Bình",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71505066",
    "id": "71505066",
    "name": "Xã Hồng Thái",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71505067",
    "id": "71505067",
    "name": "Xã Hải Ninh",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71505068",
    "id": "71505068",
    "name": "Xã Phan Sơn",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71505069",
    "id": "71505069",
    "name": "Xã Sông Lũy",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71505070",
    "id": "71505070",
    "name": "Xã Lương Sơn",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71505071",
    "id": "71505071",
    "name": "Xã Hòa Thắng",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71507072",
    "id": "71507072",
    "name": "Xã Đông Giang",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71507073",
    "id": "71507073",
    "name": "Xã La Dạ",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71507074",
    "id": "71507074",
    "name": "Xã Hàm Thuận Bắc",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71507075",
    "id": "71507075",
    "name": "Xã Hàm Thuận",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71507076",
    "id": "71507076",
    "name": "Xã Hồng Sơn",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71507077",
    "id": "71507077",
    "name": "Xã Hàm Liêm",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71509078",
    "id": "71509078",
    "name": "Xã Hàm Thạnh",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71509079",
    "id": "71509079",
    "name": "Xã Hàm Kiệm",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71509080",
    "id": "71509080",
    "name": "Xã Tân Thành",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71509081",
    "id": "71509081",
    "name": "Xã Hàm Thuận Nam",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71509082",
    "id": "71509082",
    "name": "Xã Tân Lập",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71514083",
    "id": "71514083",
    "name": "Xã Tân Minh",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71514084",
    "id": "71514084",
    "name": "Xã Hàm Tân",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71514085",
    "id": "71514085",
    "name": "Xã Sơn Mỹ",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71511086",
    "id": "71511086",
    "name": "Xã Bắc Ruộng",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71511087",
    "id": "71511087",
    "name": "Xã Nghị Đức",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71511088",
    "id": "71511088",
    "name": "Xã Đồng Kho",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71511089",
    "id": "71511089",
    "name": "Xã Tánh Linh",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71511090",
    "id": "71511090",
    "name": "Xã Suối Kiết",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71515091",
    "id": "71515091",
    "name": "Xã Nam Thành",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71515092",
    "id": "71515092",
    "name": "Xã Đức Linh",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71515093",
    "id": "71515093",
    "name": "Xã hoài Đức",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71515094",
    "id": "71515094",
    "name": "Xã Trà Tân",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_71517095",
    "id": "71517095",
    "name": "Đặc khu Phú Quý",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60613096",
    "id": "60613096",
    "name": "Phường Bắc Gia Nghĩa",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60613097",
    "id": "60613097",
    "name": "Phường Nam Gia Nghĩa",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60613098",
    "id": "60613098",
    "name": "Phường Đông Gia Nghĩa",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60603099",
    "id": "60603099",
    "name": "Xã Đắk Wil",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60603100",
    "id": "60603100",
    "name": "Xã Nam Dong",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60603101",
    "id": "60603101",
    "name": "Xã Cư Jút",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60607102",
    "id": "60607102",
    "name": "Xã Thuận An",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60607103",
    "id": "60607103",
    "name": "Xã Đức Lập",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60607104",
    "id": "60607104",
    "name": "Xã Đắk Mil",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60607105",
    "id": "60607105",
    "name": "Xã Đắk Sắk",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60605106",
    "id": "60605106",
    "name": "Xã Nam Đà",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60605107",
    "id": "60605107",
    "name": "Xã Krông Nô",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60605108",
    "id": "60605108",
    "name": "Xã Nâm Nung",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60605109",
    "id": "60605109",
    "name": "Xã Quảng Phú",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60609110",
    "id": "60609110",
    "name": "Xã Đắk song",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60609111",
    "id": "60609111",
    "name": "Xã Đức An",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60609112",
    "id": "60609112",
    "name": "Xã Thuận Hạnh",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60609113",
    "id": "60609113",
    "name": "Xã Trường Xuân",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60615114",
    "id": "60615114",
    "name": "Xã Tà Đùng",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60615115",
    "id": "60615115",
    "name": "Xã Quảng Khê",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60617116",
    "id": "60617116",
    "name": "Xã Quảng Tân",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60617117",
    "id": "60617117",
    "name": "Xã Tuy Đức",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60611118",
    "id": "60611118",
    "name": "Xã Kiến Đức",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60611119",
    "id": "60611119",
    "name": "Xã Nhân Cơ",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60611120",
    "id": "60611120",
    "name": "Xã Quảng Tín",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_70309121",
    "id": "70309121",
    "name": "Xã Ninh Gia",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60615122",
    "id": "60615122",
    "name": "Xã Quảng Hòa",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60615123",
    "id": "60615123",
    "name": "Xã Quảng Sơn",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_60617124",
    "id": "60617124",
    "name": "Xã Quảng Trực",
    "provinceId": "15",
    "provinceName": "Tỉnh Lâm Đồng",
    "level": 2
  },
  {
    "systemId": "W2_80103001",
    "id": "80103001",
    "name": "Xã Hưng Điền",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80103002",
    "id": "80103002",
    "name": "Xã Vĩnh Thạnh",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80103003",
    "id": "80103003",
    "name": "Xã Tân Hưng",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80103004",
    "id": "80103004",
    "name": "Xã Vĩnh Châu",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80105005",
    "id": "80105005",
    "name": "Xã Tuyên Bình",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80105006",
    "id": "80105006",
    "name": "Xã Vĩnh Hưng",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80105007",
    "id": "80105007",
    "name": "Xã Khánh Hưng",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80129008",
    "id": "80129008",
    "name": "Xã Tuyên Thạnh",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80129009",
    "id": "80129009",
    "name": "Xã Bình Hiệp",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80129010",
    "id": "80129010",
    "name": "Phường Kiến Tường",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80107011",
    "id": "80107011",
    "name": "Xã Bình Hòa",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80107012",
    "id": "80107012",
    "name": "Xã Mộc Hoá",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80109013",
    "id": "80109013",
    "name": "Xã Hậu Thạnh",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80109014",
    "id": "80109014",
    "name": "Xã Nhơn Hòa Lập",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80109015",
    "id": "80109015",
    "name": "Xã Nhơn Ninh",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80109016",
    "id": "80109016",
    "name": "Xã Tân Thạnh",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80111017",
    "id": "80111017",
    "name": "Xã Bình Thành",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80111018",
    "id": "80111018",
    "name": "Xã Thạnh Phước",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80111019",
    "id": "80111019",
    "name": "Xã Thạnh Hóa",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80111020",
    "id": "80111020",
    "name": "Xã Tân Tây",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80119021",
    "id": "80119021",
    "name": "Xã Thủ Thừa",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80119022",
    "id": "80119022",
    "name": "Xã Mỹ An",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80119023",
    "id": "80119023",
    "name": "Xã Mỹ Thạnh",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80119024",
    "id": "80119024",
    "name": "Xã Tân Long",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80113025",
    "id": "80113025",
    "name": "Xã Mỹ Quý",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80113026",
    "id": "80113026",
    "name": "Xã Đông Thành",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80113027",
    "id": "80113027",
    "name": "Xã Đức Huệ",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80115028",
    "id": "80115028",
    "name": "Xã An Ninh",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80115029",
    "id": "80115029",
    "name": "Xã Hiệp Hòa",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80115030",
    "id": "80115030",
    "name": "Xã Hậu Nghĩa",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80115031",
    "id": "80115031",
    "name": "Xã Hòa Khánh",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80115032",
    "id": "80115032",
    "name": "Xã Đức Lập",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80115033",
    "id": "80115033",
    "name": "Xã Mỹ Hạnh",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80115034",
    "id": "80115034",
    "name": "Xã Đức Hòa",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80117035",
    "id": "80117035",
    "name": "Xã Thạnh Lợi",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80117036",
    "id": "80117036",
    "name": "Xã Bình Đức",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80117037",
    "id": "80117037",
    "name": "Xã Lương Hòa",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80117038",
    "id": "80117038",
    "name": "Xã Bến Lức",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80117039",
    "id": "80117039",
    "name": "Xã Mỹ Yên",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80125040",
    "id": "80125040",
    "name": "Xã Long Cang",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80125041",
    "id": "80125041",
    "name": "Xã Rạch Kiến",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80125042",
    "id": "80125042",
    "name": "Xã Mỹ Lệ",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80125043",
    "id": "80125043",
    "name": "Xã Tân Lân",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80125044",
    "id": "80125044",
    "name": "Xã Cần Đước",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80125045",
    "id": "80125045",
    "name": "Xã Long Hựu",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80127046",
    "id": "80127046",
    "name": "Xã Phước Lý",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80127047",
    "id": "80127047",
    "name": "Xã Mỹ Lộc",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80127048",
    "id": "80127048",
    "name": "Xã Cần Giuộc",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80127049",
    "id": "80127049",
    "name": "Xã Phước Vĩnh Tây",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80127050",
    "id": "80127050",
    "name": "Xã Tân Tập",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80123051",
    "id": "80123051",
    "name": "Xã Vàm Cỏ",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80123052",
    "id": "80123052",
    "name": "Xã Tân Trụ",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80123053",
    "id": "80123053",
    "name": "Xã Nhựt Tảo",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80121054",
    "id": "80121054",
    "name": "Xã Thuận Mỹ",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80121055",
    "id": "80121055",
    "name": "Xã An Lục Long",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80121056",
    "id": "80121056",
    "name": "Xã Tầm Vu",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80121057",
    "id": "80121057",
    "name": "Xã Vĩnh Công",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80101058",
    "id": "80101058",
    "name": "Phường Long An",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80101059",
    "id": "80101059",
    "name": "Phường Tân An",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_80101060",
    "id": "80101060",
    "name": "Phường Khánh Hậu",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70901061",
    "id": "70901061",
    "name": "Phường Tân Ninh",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70901062",
    "id": "70901062",
    "name": "Phường Bình Minh",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70907063",
    "id": "70907063",
    "name": "Phường Ninh Thạnh",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70911064",
    "id": "70911064",
    "name": "Phường Long Hoa",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70911065",
    "id": "70911065",
    "name": "Phường Hòa Thành",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70911066",
    "id": "70911066",
    "name": "Phường Thanh Điền",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70917067",
    "id": "70917067",
    "name": "Phường Trảng Bàng",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70917068",
    "id": "70917068",
    "name": "Phường An Tịnh",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70915069",
    "id": "70915069",
    "name": "Phường Gò Dầu",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70915070",
    "id": "70915070",
    "name": "Phường Gia Lộc",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70917071",
    "id": "70917071",
    "name": "Xã Hưng Thuận",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70917072",
    "id": "70917072",
    "name": "Xã Phước Chỉ",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70915073",
    "id": "70915073",
    "name": "Xã Thạnh Đức",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70915074",
    "id": "70915074",
    "name": "Xã Phước Thạnh",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70915075",
    "id": "70915075",
    "name": "Xã Truông Mít",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70907076",
    "id": "70907076",
    "name": "Xã Lộc Ninh",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70907077",
    "id": "70907077",
    "name": "Xã Cầu Khởi",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70907078",
    "id": "70907078",
    "name": "Xã Dương Minh Châu",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70905079",
    "id": "70905079",
    "name": "Xã Tân Đông",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70905080",
    "id": "70905080",
    "name": "Xã Tân Châu",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70905081",
    "id": "70905081",
    "name": "Xã Tân Phú",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70905082",
    "id": "70905082",
    "name": "Xã Tân Hội",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70905083",
    "id": "70905083",
    "name": "Xã Tân Thành",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70905084",
    "id": "70905084",
    "name": "Xã Tân Hòa",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70903085",
    "id": "70903085",
    "name": "Xã Tân Lập",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70903086",
    "id": "70903086",
    "name": "Xã Tân Biên",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70903087",
    "id": "70903087",
    "name": "Xã Thạnh Bình",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70903088",
    "id": "70903088",
    "name": "Xã Trà Vong",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70909089",
    "id": "70909089",
    "name": "Xã Phước Vinh",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70909090",
    "id": "70909090",
    "name": "Xã Hòa Hội",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70909091",
    "id": "70909091",
    "name": "Xã Ninh Điền",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70909092",
    "id": "70909092",
    "name": "Xã Châu Thành",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70909093",
    "id": "70909093",
    "name": "Xã Hảo Đước",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70913094",
    "id": "70913094",
    "name": "Xã Long Chữ",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70913095",
    "id": "70913095",
    "name": "Xã Long Thuận",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_70913096",
    "id": "70913096",
    "name": "Xã Bến Cầu",
    "provinceId": "28",
    "provinceName": "Tỉnh Tây Ninh",
    "level": 2
  },
  {
    "systemId": "W2_71301001",
    "id": "71301001",
    "name": "Phường Biên Hòa",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71301002",
    "id": "71301002",
    "name": "Phường Trấn Biên",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71301003",
    "id": "71301003",
    "name": "Phường Tam Hiệp",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71301004",
    "id": "71301004",
    "name": "Phường Long Bình",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71301005",
    "id": "71301005",
    "name": "Phường Trảng Dài",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71301006",
    "id": "71301006",
    "name": "Phường Hố Nai",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71301007",
    "id": "71301007",
    "name": "Phường Long Hưng",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71317008",
    "id": "71317008",
    "name": "Xã Đại Phước",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71317009",
    "id": "71317009",
    "name": "Xã Nhơn Trạch",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71317010",
    "id": "71317010",
    "name": "Xã Phước An",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71315011",
    "id": "71315011",
    "name": "Xã Phước Thái",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71315012",
    "id": "71315012",
    "name": "Xã Long Phước",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71315013",
    "id": "71315013",
    "name": "Xã Bình An",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71315014",
    "id": "71315014",
    "name": "Xã Long Thành",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71315015",
    "id": "71315015",
    "name": "Xã An Phước",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71308016",
    "id": "71308016",
    "name": "Xã An Viễn",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71308017",
    "id": "71308017",
    "name": "Xã Bình Minh",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71308018",
    "id": "71308018",
    "name": "Xã Trảng Bom",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71308019",
    "id": "71308019",
    "name": "Xã Bàu Hàm",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71308020",
    "id": "71308020",
    "name": "Xã Hưng Thịnh",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71309021",
    "id": "71309021",
    "name": "Xã Dầu Giây",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71309022",
    "id": "71309022",
    "name": "Xã Gia Kiệm",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71305023",
    "id": "71305023",
    "name": "Xã Thống Nhất",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71302024",
    "id": "71302024",
    "name": "Phường Bình Lộc",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71302025",
    "id": "71302025",
    "name": "Phường Bảo Vinh",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71302026",
    "id": "71302026",
    "name": "Phường Xuân Lập",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71302027",
    "id": "71302027",
    "name": "Phường Long Khánh",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71302028",
    "id": "71302028",
    "name": "Phường Hàng Gòn",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71311029",
    "id": "71311029",
    "name": "Xã Xuân Quế",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71311030",
    "id": "71311030",
    "name": "Xã Xuân Đường",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71311031",
    "id": "71311031",
    "name": "Xã Cẩm Mỹ",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71311032",
    "id": "71311032",
    "name": "Xã Sông Ray",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71311033",
    "id": "71311033",
    "name": "Xã Xuân Đông",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71313034",
    "id": "71313034",
    "name": "Xã Xuân Định",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71313035",
    "id": "71313035",
    "name": "Xã Xuân Phú",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71313036",
    "id": "71313036",
    "name": "Xã Xuân Lộc",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71313037",
    "id": "71313037",
    "name": "Xã Xuân Hòa",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71313038",
    "id": "71313038",
    "name": "Xã Xuân Thành",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71313039",
    "id": "71313039",
    "name": "Xã Xuân Bắc",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71305040",
    "id": "71305040",
    "name": "Xã La Ngà",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71305041",
    "id": "71305041",
    "name": "Xã Định Quán",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71305042",
    "id": "71305042",
    "name": "Xã Phú Vinh",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71305043",
    "id": "71305043",
    "name": "Xã Phú Hòa",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71303044",
    "id": "71303044",
    "name": "Xã Tà Lài",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71303045",
    "id": "71303045",
    "name": "Xã Nam Cát Tiên",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71303046",
    "id": "71303046",
    "name": "Xã Tân Phú",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71303047",
    "id": "71303047",
    "name": "Xã Phú Lâm",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71307048",
    "id": "71307048",
    "name": "Xã Trị An",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71307049",
    "id": "71307049",
    "name": "Xã Tân An",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71307050",
    "id": "71307050",
    "name": "Phường Tân Triều",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70710051",
    "id": "70710051",
    "name": "Phường Minh Hưng",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70710052",
    "id": "70710052",
    "name": "Phường Chơn Thành",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70710053",
    "id": "70710053",
    "name": "Xã Nha Bích",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70713054",
    "id": "70713054",
    "name": "Xã Tân Quan",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70713055",
    "id": "70713055",
    "name": "Xã Tân Hưng",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70713056",
    "id": "70713056",
    "name": "Xã Tân Khai",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70713057",
    "id": "70713057",
    "name": "Xã Minh Đức",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70709058",
    "id": "70709058",
    "name": "Phường Bình Long",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70709059",
    "id": "70709059",
    "name": "Phường An Lộc",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70705060",
    "id": "70705060",
    "name": "Xã Lộc Thành",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70705061",
    "id": "70705061",
    "name": "Xã Lộc Ninh",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70705062",
    "id": "70705062",
    "name": "Xã Lộc Hưng",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70705063",
    "id": "70705063",
    "name": "Xã Lộc Tấn",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70705064",
    "id": "70705064",
    "name": "Xã Lộc Thạnh",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70705065",
    "id": "70705065",
    "name": "Xã Lộc Quang",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70706066",
    "id": "70706066",
    "name": "Xã Tân Tiến",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70706067",
    "id": "70706067",
    "name": "Xã Thiện Hưng",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70706068",
    "id": "70706068",
    "name": "Xã Hưng Phước",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70715069",
    "id": "70715069",
    "name": "Xã Phú Nghĩa",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70715070",
    "id": "70715070",
    "name": "Xã Đa Kia",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70703071",
    "id": "70703071",
    "name": "Phường Phước Bình",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70703072",
    "id": "70703072",
    "name": "Phường Phước Long",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70716073",
    "id": "70716073",
    "name": "Xã Bình Tân",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70716074",
    "id": "70716074",
    "name": "Xã Long Hà",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70716075",
    "id": "70716075",
    "name": "Xã Phú Riềng",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70716076",
    "id": "70716076",
    "name": "Xã Phú Trung",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70711077",
    "id": "70711077",
    "name": "Phường Đồng Xoài",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70711078",
    "id": "70711078",
    "name": "Phường Bình Phước",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70701079",
    "id": "70701079",
    "name": "Xã Thuận Lợi",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70701080",
    "id": "70701080",
    "name": "Xã Đồng Tâm",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70701081",
    "id": "70701081",
    "name": "Xã Tân Lợi",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70701082",
    "id": "70701082",
    "name": "Xã Đồng Phú",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70707083",
    "id": "70707083",
    "name": "Xã Phước Sơn",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70707084",
    "id": "70707084",
    "name": "Xã Nghĩa Trung",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70707085",
    "id": "70707085",
    "name": "Xã Bù Đăng",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70707086",
    "id": "70707086",
    "name": "Xã Thọ Sơn",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70707087",
    "id": "70707087",
    "name": "Xã Đak Nhau",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70707088",
    "id": "70707088",
    "name": "Xã Bom Bo",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71301089",
    "id": "71301089",
    "name": "Phường Tam Phước",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71301090",
    "id": "71301090",
    "name": "Phường Phước Tân",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71305091",
    "id": "71305091",
    "name": "Xã Thanh Sơn",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71303092",
    "id": "71303092",
    "name": "Xã Đak Lua",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71307093",
    "id": "71307093",
    "name": "Xã Phú Lý",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70715094",
    "id": "70715094",
    "name": "Xã Bù Gia Mập",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_70715095",
    "id": "70715095",
    "name": "Xã Đăk Ơ",
    "provinceId": "33",
    "provinceName": "Tỉnh Đồng Nai",
    "level": 2
  },
  {
    "systemId": "W2_71701001",
    "id": "71701001",
    "name": "Phường Vũng Tàu",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71701002",
    "id": "71701002",
    "name": "Phường Tam Thắng",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71701003",
    "id": "71701003",
    "name": "Phường Rạch Dừa",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71701004",
    "id": "71701004",
    "name": "Phường Phước Thắng",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71703005",
    "id": "71703005",
    "name": "Phường Bà Rịa",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71703006",
    "id": "71703006",
    "name": "Phường Long Hương",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71709007",
    "id": "71709007",
    "name": "Phường Phú Mỹ",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71703008",
    "id": "71703008",
    "name": "Phường Tam Long",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71709009",
    "id": "71709009",
    "name": "Phường Tân Thành",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71709010",
    "id": "71709010",
    "name": "Phường Tân Phước",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71709011",
    "id": "71709011",
    "name": "Phường Tân Hải",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71709012",
    "id": "71709012",
    "name": "Xã Châu Pha",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71705013",
    "id": "71705013",
    "name": "Xã Ngãi Giao",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71705014",
    "id": "71705014",
    "name": "Xã Bình Giã",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71705015",
    "id": "71705015",
    "name": "Xã Kim Long",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71705016",
    "id": "71705016",
    "name": "Xã Châu Đức",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71705017",
    "id": "71705017",
    "name": "Xã Xuân Sơn",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71705018",
    "id": "71705018",
    "name": "Xã Nghĩa Thành",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71707019",
    "id": "71707019",
    "name": "Xã Hồ Tràm",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71707020",
    "id": "71707020",
    "name": "Xã Xuyên Mộc",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71707021",
    "id": "71707021",
    "name": "Xã Hòa Hội",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71707022",
    "id": "71707022",
    "name": "Xã Bàu Lâm",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71712023",
    "id": "71712023",
    "name": "Xã Phước Hải",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71712024",
    "id": "71712024",
    "name": "Xã Long Hải",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71712025",
    "id": "71712025",
    "name": "Xã Đất Đỏ",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71712026",
    "id": "71712026",
    "name": "Xã Long Điền",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71713027",
    "id": "71713027",
    "name": "Đặc khu Côn Đảo",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71109028",
    "id": "71109028",
    "name": "Phường Đông Hòa",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71109029",
    "id": "71109029",
    "name": "Phường Dĩ An",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71109030",
    "id": "71109030",
    "name": "Phường Tân Đông Hiệp",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71107031",
    "id": "71107031",
    "name": "Phường Thuận An",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71107032",
    "id": "71107032",
    "name": "Phường Thuận Giao",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71107033",
    "id": "71107033",
    "name": "Phường Bình Hòa",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71107034",
    "id": "71107034",
    "name": "Phường Lái Thiêu",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71107035",
    "id": "71107035",
    "name": "Phường An Phú",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71101036",
    "id": "71101036",
    "name": "Phường Bình Dương",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71101037",
    "id": "71101037",
    "name": "Phường Chánh Hiệp",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71101038",
    "id": "71101038",
    "name": "Phường Thủ Dầu Một",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71101039",
    "id": "71101039",
    "name": "Phường Phú Lợi",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71105040",
    "id": "71105040",
    "name": "Phường Vĩnh Tân",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71105041",
    "id": "71105041",
    "name": "Phường Bình Cơ",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71105042",
    "id": "71105042",
    "name": "Phường Tân Uyên",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71105043",
    "id": "71105043",
    "name": "Phường Tân Hiệp",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71105044",
    "id": "71105044",
    "name": "Phường Tân Khánh",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71103045",
    "id": "71103045",
    "name": "Phường Hòa Lợi",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71101046",
    "id": "71101046",
    "name": "Phường Phú An",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71113047",
    "id": "71113047",
    "name": "Phường Tây Nam",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71115048",
    "id": "71115048",
    "name": "Phường Long Nguyên",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71115049",
    "id": "71115049",
    "name": "Phường Bến Cát",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71115050",
    "id": "71115050",
    "name": "Phường Chánh Phú Hòa",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71117051",
    "id": "71117051",
    "name": "Xã Bắc Tân Uyên",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71117052",
    "id": "71117052",
    "name": "Xã Thường Tân",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71111053",
    "id": "71111053",
    "name": "Xã An Long",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71111054",
    "id": "71111054",
    "name": "Xã Phước Thành",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71111055",
    "id": "71111055",
    "name": "Xã Phước Hòa",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71111056",
    "id": "71111056",
    "name": "Xã Phú Giáo",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71115057",
    "id": "71115057",
    "name": "Xã Trừ Văn Thố",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71115058",
    "id": "71115058",
    "name": "Xã Bàu Bàng",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71113059",
    "id": "71113059",
    "name": "Xã Minh Thạnh",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71113060",
    "id": "71113060",
    "name": "Xã Long Hòa",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71113061",
    "id": "71113061",
    "name": "Xã Dầu Tiếng",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71113062",
    "id": "71113062",
    "name": "Xã Thanh An",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70101063",
    "id": "70101063",
    "name": "Phường Sài Gòn",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70101064",
    "id": "70101064",
    "name": "Phường Tân Định",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70101065",
    "id": "70101065",
    "name": "Phường Bến Thành",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70101066",
    "id": "70101066",
    "name": "Phường Cầu Ông Lãnh",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70105067",
    "id": "70105067",
    "name": "Phường Bàn Cờ",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70105068",
    "id": "70105068",
    "name": "Phường Xuân Hòa",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70105069",
    "id": "70105069",
    "name": "Phường Nhiêu Lộc",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70107070",
    "id": "70107070",
    "name": "Phường Xóm Chiếu",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70107071",
    "id": "70107071",
    "name": "Phường Khánh Hội",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70107072",
    "id": "70107072",
    "name": "Phường Vĩnh Hội",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70109073",
    "id": "70109073",
    "name": "Phường Chợ Quán",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70109074",
    "id": "70109074",
    "name": "Phường An Đông",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70109075",
    "id": "70109075",
    "name": "Phường Chợ Lớn",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70111076",
    "id": "70111076",
    "name": "Phường Bình Tây",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70111077",
    "id": "70111077",
    "name": "Phường Bình Tiên",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70111078",
    "id": "70111078",
    "name": "Phường Bình Phú",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70111079",
    "id": "70111079",
    "name": "Phường Phú Lâm",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70113080",
    "id": "70113080",
    "name": "Phường Tân Thuận",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70113081",
    "id": "70113081",
    "name": "Phường Phú Thuận",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70113082",
    "id": "70113082",
    "name": "Phường Tân Mỹ",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70113083",
    "id": "70113083",
    "name": "Phường Tân Hưng",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70115084",
    "id": "70115084",
    "name": "Phường Chánh Hưng",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70115085",
    "id": "70115085",
    "name": "Phường Phú Định",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70115086",
    "id": "70115086",
    "name": "Phường Bình Đông",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70119087",
    "id": "70119087",
    "name": "Phường Diên Hồng",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70119088",
    "id": "70119088",
    "name": "Phường Vườn Lài",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70119089",
    "id": "70119089",
    "name": "Phường Hòa Hưng",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70121090",
    "id": "70121090",
    "name": "Phường Minh Phụng",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70121091",
    "id": "70121091",
    "name": "Phường Bình Thới",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70121092",
    "id": "70121092",
    "name": "Phường Hòa Bình",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70121093",
    "id": "70121093",
    "name": "Phường Phú Thọ",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70123094",
    "id": "70123094",
    "name": "Phường Đông Hưng Thuận",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70123095",
    "id": "70123095",
    "name": "Phường Trung Mỹ Tây",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70123096",
    "id": "70123096",
    "name": "Phường Tân Thới Hiệp",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70123097",
    "id": "70123097",
    "name": "Phường Thới An",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70123098",
    "id": "70123098",
    "name": "Phường An Phú Đông",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70134099",
    "id": "70134099",
    "name": "Phường An Lạc",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70134100",
    "id": "70134100",
    "name": "Phường Tân Tạo",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70134101",
    "id": "70134101",
    "name": "Phường Bình Tân",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70134102",
    "id": "70134102",
    "name": "Phường Bình Trị Đông",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70134103",
    "id": "70134103",
    "name": "Phường Bình Hưng Hòa",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70129104",
    "id": "70129104",
    "name": "Phường Gia Định",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70129105",
    "id": "70129105",
    "name": "Phường Bình Thạnh",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70129106",
    "id": "70129106",
    "name": "Phường Bình Lợi Trung",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70129107",
    "id": "70129107",
    "name": "Phường Thạnh Mỹ Tây",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70129108",
    "id": "70129108",
    "name": "Phường Bình Quới",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70125109",
    "id": "70125109",
    "name": "Phường Hạnh Thông",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70125110",
    "id": "70125110",
    "name": "Phường An Nhơn",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70125111",
    "id": "70125111",
    "name": "Phường Gò Vấp",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70125112",
    "id": "70125112",
    "name": "Phường An Hội Đông",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70125113",
    "id": "70125113",
    "name": "Phường Thông Tây Hội",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70125114",
    "id": "70125114",
    "name": "Phường An Hội Tây",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70131115",
    "id": "70131115",
    "name": "Phường Đức Nhuận",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70131116",
    "id": "70131116",
    "name": "Phường Cầu Kiệu",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70131117",
    "id": "70131117",
    "name": "Phường Phú Nhuận",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70127118",
    "id": "70127118",
    "name": "Phường Tân Sơn Hòa",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70127119",
    "id": "70127119",
    "name": "Phường Tân Sơn Nhất",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70127120",
    "id": "70127120",
    "name": "Phường Tân Hòa",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70127121",
    "id": "70127121",
    "name": "Phường Bảy Hiền",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70127122",
    "id": "70127122",
    "name": "Phường Tân Bình",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70127123",
    "id": "70127123",
    "name": "Phường Tân Sơn",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70128124",
    "id": "70128124",
    "name": "Phường Tây Thạnh",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70128125",
    "id": "70128125",
    "name": "Phường Tân Sơn Nhì",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70128126",
    "id": "70128126",
    "name": "Phường Phú Thọ Hòa",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70128127",
    "id": "70128127",
    "name": "Phường Tân Phú",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70128128",
    "id": "70128128",
    "name": "Phường Phú Thạnh",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70145129",
    "id": "70145129",
    "name": "Phường Hiệp Bình",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70145130",
    "id": "70145130",
    "name": "Phường Thủ Đức",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70145131",
    "id": "70145131",
    "name": "Phường Tam Bình",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70145132",
    "id": "70145132",
    "name": "Phường Linh Xuân",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70145133",
    "id": "70145133",
    "name": "Phường Tăng Nhơn Phú",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70145134",
    "id": "70145134",
    "name": "Phường Long Bình",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70145135",
    "id": "70145135",
    "name": "Phường Long Phước",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70145136",
    "id": "70145136",
    "name": "Phường Long Trường",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70145137",
    "id": "70145137",
    "name": "Phường Cát Lái",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70145138",
    "id": "70145138",
    "name": "Phường Bình Trưng",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70145139",
    "id": "70145139",
    "name": "Phường Phước Long",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70145140",
    "id": "70145140",
    "name": "Phường An Khánh",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70139141",
    "id": "70139141",
    "name": "Xã Vĩnh Lộc",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70139142",
    "id": "70139142",
    "name": "Xã Tân Vĩnh Lộc",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70139143",
    "id": "70139143",
    "name": "Xã Bình Lợi",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70139144",
    "id": "70139144",
    "name": "Xã Tân Nhựt",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70139145",
    "id": "70139145",
    "name": "Xã Bình Chánh",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70139146",
    "id": "70139146",
    "name": "Xã Hưng Long",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70139147",
    "id": "70139147",
    "name": "Xã Bình Hưng",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70143148",
    "id": "70143148",
    "name": "Xã Bình Khánh",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70143149",
    "id": "70143149",
    "name": "Xã An Thới Đông",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70143150",
    "id": "70143150",
    "name": "Xã Cần Giờ",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70135151",
    "id": "70135151",
    "name": "Xã Củ Chi",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70135152",
    "id": "70135152",
    "name": "Xã Tân An Hội",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70135153",
    "id": "70135153",
    "name": "Xã Thái Mỹ",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70135154",
    "id": "70135154",
    "name": "Xã An Nhơn Tây",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70135155",
    "id": "70135155",
    "name": "Xã Nhuận Đức",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70135156",
    "id": "70135156",
    "name": "Xã Phú Hòa Đông",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70135157",
    "id": "70135157",
    "name": "Xã Bình Mỹ",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70137158",
    "id": "70137158",
    "name": "Xã Đông Thạnh",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70137159",
    "id": "70137159",
    "name": "Xã Hóc Môn",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70137160",
    "id": "70137160",
    "name": "Xã Xuân Thới Sơn",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70137161",
    "id": "70137161",
    "name": "Xã Bà Điểm",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70141162",
    "id": "70141162",
    "name": "Xã Nhà Bè",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70141163",
    "id": "70141163",
    "name": "Xã Hiệp Phước",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71701164",
    "id": "71701164",
    "name": "Xã Long Sơn",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71707165",
    "id": "71707165",
    "name": "Xã Hòa Hiệp",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71707166",
    "id": "71707166",
    "name": "Xã Bình Châu",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_71103167",
    "id": "71103167",
    "name": "Phường Thới Hòa",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_70143168",
    "id": "70143168",
    "name": "Xã Thạnh An",
    "provinceId": "24",
    "provinceName": "Thành phố Hồ Chí Minh",
    "level": 2
  },
  {
    "systemId": "W2_81701037",
    "id": "81701037",
    "name": "Phường Trà Vinh",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80905001",
    "id": "80905001",
    "name": "Xã Cái Nhum",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81701036",
    "id": "81701036",
    "name": "Phường Long Đức",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80905002",
    "id": "80905002",
    "name": "Xã Tân Long Hội",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81701038",
    "id": "81701038",
    "name": "Phường Nguyệt Hóa",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80905003",
    "id": "80905003",
    "name": "Xã Nhơn Phú",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81701039",
    "id": "81701039",
    "name": "Phường Hòa Thuận",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80905004",
    "id": "80905004",
    "name": "Xã Bình Phước",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81703042",
    "id": "81703042",
    "name": "Xã Càng Long",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80903005",
    "id": "80903005",
    "name": "Xã An Bình",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81703040",
    "id": "81703040",
    "name": "Xã An Trường",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80903006",
    "id": "80903006",
    "name": "Xã Long Hồ",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81703041",
    "id": "81703041",
    "name": "Xã Tân An",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80903007",
    "id": "80903007",
    "name": "Xã Phú Quới",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81703043",
    "id": "81703043",
    "name": "Xã Nhị Long",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80901008",
    "id": "80901008",
    "name": "Phường Thanh Đức",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81703044",
    "id": "81703044",
    "name": "Xã Bình Phú",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80901009",
    "id": "80901009",
    "name": "Phường Long Châu",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81705046",
    "id": "81705046",
    "name": "Xã Châu Thành",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80901010",
    "id": "80901010",
    "name": "Phường Phước Hậu",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81705045",
    "id": "81705045",
    "name": "Xã Song Lộc",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80901011",
    "id": "80901011",
    "name": "Phường Tân Hạnh",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81705047",
    "id": "81705047",
    "name": "Xã Hưng Mỹ",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80901012",
    "id": "80901012",
    "name": "Phường Tân Ngãi",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81705048",
    "id": "81705048",
    "name": "Xã Hòa Minh",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80913013",
    "id": "80913013",
    "name": "Xã Quới Thiện",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81705049",
    "id": "81705049",
    "name": "Xã Long Hòa",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80913014",
    "id": "80913014",
    "name": "Xã Trung Thành",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81707050",
    "id": "81707050",
    "name": "Xã Cầu Kè",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80913015",
    "id": "80913015",
    "name": "Xã Trung Ngãi",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81707051",
    "id": "81707051",
    "name": "Xã Phong Thạnh",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80913016",
    "id": "80913016",
    "name": "Xã Quới An",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81707052",
    "id": "81707052",
    "name": "Xã An Phú Tân",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80913017",
    "id": "80913017",
    "name": "Xã Trung Hiệp",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81707053",
    "id": "81707053",
    "name": "Xã Tam Ngãi",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80913018",
    "id": "80913018",
    "name": "Xã Hiếu Phụng",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81709056",
    "id": "81709056",
    "name": "Xã Tiểu Cần",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80913019",
    "id": "80913019",
    "name": "Xã Hiếu Thành",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81709054",
    "id": "81709054",
    "name": "Xã Tân Hòa",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80911020",
    "id": "80911020",
    "name": "Xã Lục Sỹ Thành",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81709055",
    "id": "81709055",
    "name": "Xã Hùng Hòa",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80911021",
    "id": "80911021",
    "name": "Xã Trà Ôn",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81709057",
    "id": "81709057",
    "name": "Xã Tập Ngãi",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80911022",
    "id": "80911022",
    "name": "Xã Trà Côn",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81711060",
    "id": "81711060",
    "name": "Xã Cầu Ngang",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80911023",
    "id": "80911023",
    "name": "Xã Vĩnh Xuân",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81711058",
    "id": "81711058",
    "name": "Xã Mỹ Long",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80911024",
    "id": "80911024",
    "name": "Xã Hòa Bình",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81711059",
    "id": "81711059",
    "name": "Xã Vinh Kim",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80909025",
    "id": "80909025",
    "name": "Xã Hòa Hiệp",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81711061",
    "id": "81711061",
    "name": "Xã Nhị Trường",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80909026",
    "id": "80909026",
    "name": "Xã Tam Bình",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81711062",
    "id": "81711062",
    "name": "Xã Hiệp Mỹ",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80909027",
    "id": "80909027",
    "name": "Xã Ngãi Tứ",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81713066",
    "id": "81713066",
    "name": "Xã Trà Cú",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80909028",
    "id": "80909028",
    "name": "Xã Song Phú",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81713063",
    "id": "81713063",
    "name": "Xã Lưu Nghiệp Anh",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80909029",
    "id": "80909029",
    "name": "Xã Cái Ngang",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81713064",
    "id": "81713064",
    "name": "Xã Đại An",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80908030",
    "id": "80908030",
    "name": "Xã Tân Quới",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81713065",
    "id": "81713065",
    "name": "Xã Hàm Giang",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80908031",
    "id": "80908031",
    "name": "Xã Tân Lược",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81713067",
    "id": "81713067",
    "name": "Xã Long Hiệp",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80908032",
    "id": "80908032",
    "name": "Xã Mỹ Thuận",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81713068",
    "id": "81713068",
    "name": "Xã Tập Sơn",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80907033",
    "id": "80907033",
    "name": "Phường Bình Minh",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81716069",
    "id": "81716069",
    "name": "Phường Duyên Hải",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80907034",
    "id": "80907034",
    "name": "Phường Cái Vồn",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81716070",
    "id": "81716070",
    "name": "Phường Trường Long Hòa",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80907035",
    "id": "80907035",
    "name": "Phường Đông Thành",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81716071",
    "id": "81716071",
    "name": "Xã Long Hữu",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81715072",
    "id": "81715072",
    "name": "Xã Long Thành",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81715073",
    "id": "81715073",
    "name": "Xã Đông Hải",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81715074",
    "id": "81715074",
    "name": "Xã Long Vĩnh",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81715075",
    "id": "81715075",
    "name": "Xã Đôn Châu",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81715076",
    "id": "81715076",
    "name": "Xã Ngũ Lạc",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81101077",
    "id": "81101077",
    "name": "Phường An Hội",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81101078",
    "id": "81101078",
    "name": "Phường Phú Khương",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81101079",
    "id": "81101079",
    "name": "Phường Bến Tre",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81101080",
    "id": "81101080",
    "name": "Phường Sơn Đông",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81103081",
    "id": "81103081",
    "name": "Phường Phú Tân",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81103082",
    "id": "81103082",
    "name": "Xã Phú Túc",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81103083",
    "id": "81103083",
    "name": "Xã Giao Long",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81103084",
    "id": "81103084",
    "name": "Xã Tiên Thủy",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81103085",
    "id": "81103085",
    "name": "Xã Tân Phú",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81105086",
    "id": "81105086",
    "name": "Xã Phú Phụng",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81105087",
    "id": "81105087",
    "name": "Xã Chợ Lách",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81105088",
    "id": "81105088",
    "name": "Xã Vĩnh Thành",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81105089",
    "id": "81105089",
    "name": "Xã Hưng Khánh Trung",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81108090",
    "id": "81108090",
    "name": "Xã Phước Mỹ Trung",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81108091",
    "id": "81108091",
    "name": "Xã Tân Thành Bình",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81108092",
    "id": "81108092",
    "name": "Xã Nhuận Phú Tân",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81107093",
    "id": "81107093",
    "name": "Xã Đồng Khởi",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81107094",
    "id": "81107094",
    "name": "Xã Mỏ Cày",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81107095",
    "id": "81107095",
    "name": "Xã Thành Thới",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81107096",
    "id": "81107096",
    "name": "Xã An Định",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81107097",
    "id": "81107097",
    "name": "Xã Hương Mỹ",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81115098",
    "id": "81115098",
    "name": "Xã Đại Điền",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81115099",
    "id": "81115099",
    "name": "Xã Quới Điền",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81115100",
    "id": "81115100",
    "name": "Xã Thạnh Phú",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81115101",
    "id": "81115101",
    "name": "Xã An Qui",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81115102",
    "id": "81115102",
    "name": "Xã Thạnh Hải",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81115103",
    "id": "81115103",
    "name": "Xã Thạnh Phong",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81113104",
    "id": "81113104",
    "name": "Xã Tân Thủy",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81113105",
    "id": "81113105",
    "name": "Xã Bảo Thạnh",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81113106",
    "id": "81113106",
    "name": "Xã Ba Tri",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81113107",
    "id": "81113107",
    "name": "Xã Tân Xuân",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81113108",
    "id": "81113108",
    "name": "Xã Mỹ Chánh Hòa",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81113109",
    "id": "81113109",
    "name": "Xã An Ngãi Trung",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81113110",
    "id": "81113110",
    "name": "Xã An Hiệp",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81109111",
    "id": "81109111",
    "name": "Xã Hưng Nhượng",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81109112",
    "id": "81109112",
    "name": "Xã Giồng Trôm",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81109113",
    "id": "81109113",
    "name": "Xã Tân Hào",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81109114",
    "id": "81109114",
    "name": "Xã Phước Long",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81109115",
    "id": "81109115",
    "name": "Xã Lương Phú",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81109116",
    "id": "81109116",
    "name": "Xã Châu Hòa",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81109117",
    "id": "81109117",
    "name": "Xã Lương Hòa",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81111118",
    "id": "81111118",
    "name": "Xã Thới Thuận",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81111119",
    "id": "81111119",
    "name": "Xã Thạnh Phước",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81111120",
    "id": "81111120",
    "name": "Xã Bình Đại",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81111121",
    "id": "81111121",
    "name": "Xã Thạnh Trị",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81111122",
    "id": "81111122",
    "name": "Xã Lộc Thuận",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81111123",
    "id": "81111123",
    "name": "Xã Châu Hưng",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_81111124",
    "id": "81111124",
    "name": "Xã Phú Thuận",
    "provinceId": "29",
    "provinceName": "Tỉnh Vĩnh Long",
    "level": 2
  },
  {
    "systemId": "W2_80701001",
    "id": "80701001",
    "name": "Phường Mỹ Tho",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80701002",
    "id": "80701002",
    "name": "Phường Đạo Thạnh",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80701003",
    "id": "80701003",
    "name": "Phường Mỹ Phong",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80701004",
    "id": "80701004",
    "name": "Phường Thới Sơn",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80701005",
    "id": "80701005",
    "name": "Phường Trung An",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80703006",
    "id": "80703006",
    "name": "Phường Gò Công",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80703007",
    "id": "80703007",
    "name": "Phường Long Thuận",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80703008",
    "id": "80703008",
    "name": "Phường Sơn Qui",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80703009",
    "id": "80703009",
    "name": "Phường Bình Xuân",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80721010",
    "id": "80721010",
    "name": "Phường Mỹ Phước Tây",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80721011",
    "id": "80721011",
    "name": "Phường Thanh Hòa",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80721012",
    "id": "80721012",
    "name": "Phường Cai Lậy",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80721013",
    "id": "80721013",
    "name": "Phường Nhị Quý",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80721014",
    "id": "80721014",
    "name": "Xã Tân Phú",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80713015",
    "id": "80713015",
    "name": "Xã Thanh Hưng",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80713016",
    "id": "80713016",
    "name": "Xã An Hữu",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80713017",
    "id": "80713017",
    "name": "Xã Mỹ Lợi",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80713018",
    "id": "80713018",
    "name": "Xã Mỹ Đức Tây",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80713019",
    "id": "80713019",
    "name": "Xã Mỹ Thiện",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80713020",
    "id": "80713020",
    "name": "Xã Hậu Mỹ",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80713021",
    "id": "80713021",
    "name": "Xã Hội Cư",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80713022",
    "id": "80713022",
    "name": "Xã Cái Bè",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80709023",
    "id": "80709023",
    "name": "Xã Bình Phú",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80709024",
    "id": "80709024",
    "name": "Xã Hiệp Đức",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80709025",
    "id": "80709025",
    "name": "Xã Ngũ Hiệp",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80709026",
    "id": "80709026",
    "name": "Xã Long Tiên",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80709027",
    "id": "80709027",
    "name": "Xã Mỹ Thành",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80709028",
    "id": "80709028",
    "name": "Xã Thạnh Phú",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80705029",
    "id": "80705029",
    "name": "Xã Tân Phước 1",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80705030",
    "id": "80705030",
    "name": "Xã Tân Phước 2",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80705031",
    "id": "80705031",
    "name": "Xã Tân Phước 3",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80705032",
    "id": "80705032",
    "name": "Xã Hưng Thạnh",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80707033",
    "id": "80707033",
    "name": "Xã Tân Hương",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80707034",
    "id": "80707034",
    "name": "Xã Châu Thành",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80707035",
    "id": "80707035",
    "name": "Xã Long Hưng",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80707036",
    "id": "80707036",
    "name": "Xã Long Định",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80707037",
    "id": "80707037",
    "name": "Xã Vĩnh Kim",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80707038",
    "id": "80707038",
    "name": "Xã Kim Sơn",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80707039",
    "id": "80707039",
    "name": "Xã Bình Trưng",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80711040",
    "id": "80711040",
    "name": "Xã Mỹ Tịnh An",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80711041",
    "id": "80711041",
    "name": "Xã Lương Hòa Lạc",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80711042",
    "id": "80711042",
    "name": "Xã Tân Thuận Bình",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80711043",
    "id": "80711043",
    "name": "Xã Chợ Gạo",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80711044",
    "id": "80711044",
    "name": "Xã An Thạnh Thủy",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80711045",
    "id": "80711045",
    "name": "Xã Bình Ninh",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80715046",
    "id": "80715046",
    "name": "Xã Vĩnh Bình",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80715047",
    "id": "80715047",
    "name": "Xã Đồng Sơn",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80715048",
    "id": "80715048",
    "name": "Xã Phú Thành",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80715049",
    "id": "80715049",
    "name": "Xã Long Bình",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80715050",
    "id": "80715050",
    "name": "Xã Vĩnh Hựu",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80717051",
    "id": "80717051",
    "name": "Xã Gò Công Đông",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80717052",
    "id": "80717052",
    "name": "Xã Tân Điền",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80717053",
    "id": "80717053",
    "name": "Xã Tân Hòa",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80717054",
    "id": "80717054",
    "name": "Xã Tân Đông",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80717055",
    "id": "80717055",
    "name": "Xã Gia Thuận",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80719056",
    "id": "80719056",
    "name": "Xã Tân Thới",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80719057",
    "id": "80719057",
    "name": "Xã Tân Phú Đông",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80305058",
    "id": "80305058",
    "name": "Xã Tân Hồng",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80305059",
    "id": "80305059",
    "name": "Xã Tân Thành",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80305060",
    "id": "80305060",
    "name": "Xã Tân Hộ Cơ",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80305061",
    "id": "80305061",
    "name": "Xã An Phước",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80323062",
    "id": "80323062",
    "name": "Phường An Bình",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80323063",
    "id": "80323063",
    "name": "Phường Hồng Ngự",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80307064",
    "id": "80307064",
    "name": "Phường Thường Lạc",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80307065",
    "id": "80307065",
    "name": "Xã Thường Phước",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80307066",
    "id": "80307066",
    "name": "Xã Long Khánh",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80307067",
    "id": "80307067",
    "name": "Xã Long Phú Thuận",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80309068",
    "id": "80309068",
    "name": "Xã An Hòa",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80309069",
    "id": "80309069",
    "name": "Xã Tam Nông",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80309070",
    "id": "80309070",
    "name": "Xã Phú Thọ",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80309071",
    "id": "80309071",
    "name": "Xã Tràm Chim",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80309072",
    "id": "80309072",
    "name": "Xã Phú Cường",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80309073",
    "id": "80309073",
    "name": "Xã An Long",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80311074",
    "id": "80311074",
    "name": "Xã Thanh Bình",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80311075",
    "id": "80311075",
    "name": "Xã Tân Thạnh",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80311076",
    "id": "80311076",
    "name": "Xã Bình Thành",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80311077",
    "id": "80311077",
    "name": "Xã Tân Long",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80313078",
    "id": "80313078",
    "name": "Xã Tháp Mười",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80313079",
    "id": "80313079",
    "name": "Xã Thanh Mỹ",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80313080",
    "id": "80313080",
    "name": "Xã Mỹ Quí",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80313081",
    "id": "80313081",
    "name": "Xã Đốc Binh Kiều",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80313082",
    "id": "80313082",
    "name": "Xã Trường Xuân",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80313083",
    "id": "80313083",
    "name": "Xã Phương Thịnh",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80315084",
    "id": "80315084",
    "name": "Xã Phong Mỹ",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80315085",
    "id": "80315085",
    "name": "Xã Ba Sao",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80315086",
    "id": "80315086",
    "name": "Xã Mỹ Thọ",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80315087",
    "id": "80315087",
    "name": "Xã Bình Hàng Trung",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80315088",
    "id": "80315088",
    "name": "Xã Mỹ Hiệp",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80301089",
    "id": "80301089",
    "name": "Phường Cao Lãnh",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80301090",
    "id": "80301090",
    "name": "Phường Mỹ Ngãi",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80301091",
    "id": "80301091",
    "name": "Phường Mỹ Trà",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80317092",
    "id": "80317092",
    "name": "Xã Mỹ An Hưng",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80317093",
    "id": "80317093",
    "name": "Xã Tân Khánh Trung",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80317094",
    "id": "80317094",
    "name": "Xã Lấp Vò",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80319095",
    "id": "80319095",
    "name": "Xã Lai Vung",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80319096",
    "id": "80319096",
    "name": "Xã Hòa Long",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80319097",
    "id": "80319097",
    "name": "Xã Phong Hòa",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80303098",
    "id": "80303098",
    "name": "Phường Sa Đéc",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80319099",
    "id": "80319099",
    "name": "Xã Tân Dương",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80321100",
    "id": "80321100",
    "name": "Xã Phú Hựu",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80321101",
    "id": "80321101",
    "name": "Xã Tân Nhuận Đông",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80321102",
    "id": "80321102",
    "name": "Xã Tân Phú Trung",
    "provinceId": "34",
    "provinceName": "Tỉnh Đồng Tháp",
    "level": 2
  },
  {
    "systemId": "W2_80501001",
    "id": "80501001",
    "name": "Xã Mỹ Hòa Hưng",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80501002",
    "id": "80501002",
    "name": "Phường Long Xuyên",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80501003",
    "id": "80501003",
    "name": "Phường Bình Đức",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80501004",
    "id": "80501004",
    "name": "Phường Mỹ Thới",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80503005",
    "id": "80503005",
    "name": "Phường Châu Đốc",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80503006",
    "id": "80503006",
    "name": "Phường Vĩnh Tế",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80505007",
    "id": "80505007",
    "name": "Xã An Phú",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80505008",
    "id": "80505008",
    "name": "Xã Vĩnh Hậu",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80505009",
    "id": "80505009",
    "name": "Xã Nhơn Hội",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80505010",
    "id": "80505010",
    "name": "Xã Khánh Bình",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80505011",
    "id": "80505011",
    "name": "Xã Phú Hữu",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80507012",
    "id": "80507012",
    "name": "Xã Tân An",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80507013",
    "id": "80507013",
    "name": "Xã Châu Phong",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80507014",
    "id": "80507014",
    "name": "Xã Vĩnh Xương",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80507015",
    "id": "80507015",
    "name": "Phường Tân Châu",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80507016",
    "id": "80507016",
    "name": "Phường Long Phú",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80509017",
    "id": "80509017",
    "name": "Xã Phú Tân",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80509018",
    "id": "80509018",
    "name": "Xã Phú An",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80509019",
    "id": "80509019",
    "name": "Xã Bình Thạnh Đông",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80509020",
    "id": "80509020",
    "name": "Xã Chợ Vàm",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80509021",
    "id": "80509021",
    "name": "Xã Hòa Lạc",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80509022",
    "id": "80509022",
    "name": "Xã Phú Lâm",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80511023",
    "id": "80511023",
    "name": "Xã Châu Phú",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80511024",
    "id": "80511024",
    "name": "Xã Mỹ Đức",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80511025",
    "id": "80511025",
    "name": "Xã Vĩnh Thạnh Trung",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80511026",
    "id": "80511026",
    "name": "Xã Bình Mỹ",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80511027",
    "id": "80511027",
    "name": "Xã Thạnh Mỹ Tây",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80513028",
    "id": "80513028",
    "name": "Xã An Cư",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80513029",
    "id": "80513029",
    "name": "Xã Núi Cấm",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80513030",
    "id": "80513030",
    "name": "Phường Tịnh Biên",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80513031",
    "id": "80513031",
    "name": "Phường Thới Sơn",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80513032",
    "id": "80513032",
    "name": "Phường Chi Lăng",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80515033",
    "id": "80515033",
    "name": "Xã Ba Chúc",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80515034",
    "id": "80515034",
    "name": "Xã Tri Tôn",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80515035",
    "id": "80515035",
    "name": "Xã Ô Lâm",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80515036",
    "id": "80515036",
    "name": "Xã Cô Tô",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80515037",
    "id": "80515037",
    "name": "Xã Vĩnh Gia",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80519038",
    "id": "80519038",
    "name": "Xã An Châu",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80519039",
    "id": "80519039",
    "name": "Xã Bình Hòa",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80519040",
    "id": "80519040",
    "name": "Xã Cần Đăng",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80519041",
    "id": "80519041",
    "name": "Xã Vĩnh Hanh",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80519042",
    "id": "80519042",
    "name": "Xã Vĩnh An",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80517043",
    "id": "80517043",
    "name": "Xã Chợ Mới",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80517044",
    "id": "80517044",
    "name": "Xã Cù Lao Giêng",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80517045",
    "id": "80517045",
    "name": "Xã Hội An",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80517046",
    "id": "80517046",
    "name": "Xã Long Điền",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80517047",
    "id": "80517047",
    "name": "Xã Nhơn Mỹ",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80517048",
    "id": "80517048",
    "name": "Xã Long Kiến",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80521049",
    "id": "80521049",
    "name": "Xã Thoại Sơn",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80521050",
    "id": "80521050",
    "name": "Xã Óc Eo",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80521051",
    "id": "80521051",
    "name": "Xã Định Mỹ",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80521052",
    "id": "80521052",
    "name": "Xã Phú Hòa",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80521053",
    "id": "80521053",
    "name": "Xã Vĩnh Trạch",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_80521054",
    "id": "80521054",
    "name": "Xã Tây Phú",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81319055",
    "id": "81319055",
    "name": "Xã Vĩnh Bình",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81319056",
    "id": "81319056",
    "name": "Xã Vĩnh Thuận",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81319057",
    "id": "81319057",
    "name": "Xã Vĩnh Phong",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81327058",
    "id": "81327058",
    "name": "Xã Vĩnh Hòa",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81327059",
    "id": "81327059",
    "name": "Xã U Minh Thượng",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81317060",
    "id": "81317060",
    "name": "Xã Đông Hòa",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81317061",
    "id": "81317061",
    "name": "Xã Tân Thạnh",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81317062",
    "id": "81317062",
    "name": "Xã Đông Hưng",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81317063",
    "id": "81317063",
    "name": "Xã An Minh",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81317064",
    "id": "81317064",
    "name": "Xã Vân Khánh",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81315065",
    "id": "81315065",
    "name": "Xã Tây Yên",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81315066",
    "id": "81315066",
    "name": "Xã Đông Thái",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81315067",
    "id": "81315067",
    "name": "Xã An Biên",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81313068",
    "id": "81313068",
    "name": "Xã Định Hòa",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81313069",
    "id": "81313069",
    "name": "Xã Gò Quao",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81313070",
    "id": "81313070",
    "name": "Xã Vĩnh Hòa Hưng",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81313071",
    "id": "81313071",
    "name": "Xã Vĩnh Tuy",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81311072",
    "id": "81311072",
    "name": "Xã Giồng Riềng",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81311073",
    "id": "81311073",
    "name": "Xã Thạnh Hưng",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81311074",
    "id": "81311074",
    "name": "Xã Long Thạnh",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81311075",
    "id": "81311075",
    "name": "Xã Hòa Hưng",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81311076",
    "id": "81311076",
    "name": "Xã Ngọc Chúc",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81311077",
    "id": "81311077",
    "name": "Xã Hòa Thuận",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81307078",
    "id": "81307078",
    "name": "Xã Tân Hội",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81307079",
    "id": "81307079",
    "name": "Xã Tân Hiệp",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81307080",
    "id": "81307080",
    "name": "Xã Thạnh Đông",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81309081",
    "id": "81309081",
    "name": "Xã Thạnh Lộc",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81309082",
    "id": "81309082",
    "name": "Xã Châu Thành",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81309083",
    "id": "81309083",
    "name": "Xã Bình An",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81305084",
    "id": "81305084",
    "name": "Xã Hòn Đất",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81305085",
    "id": "81305085",
    "name": "Xã Sơn Kiên",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81305086",
    "id": "81305086",
    "name": "Xã Mỹ Thuận",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81305087",
    "id": "81305087",
    "name": "Xã Bình Sơn",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81305088",
    "id": "81305088",
    "name": "Xã Bình Giang",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81304089",
    "id": "81304089",
    "name": "Xã Giang Thành",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81304090",
    "id": "81304090",
    "name": "Xã Vĩnh Điều",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81303091",
    "id": "81303091",
    "name": "Xã Hòa Điền",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81303092",
    "id": "81303092",
    "name": "Xã Kiên Lương",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81303093",
    "id": "81303093",
    "name": "Xã Sơn Hải",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81303094",
    "id": "81303094",
    "name": "Xã Hòn Nghệ",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81323095",
    "id": "81323095",
    "name": "Đặc khu Kiên Hải",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81301096",
    "id": "81301096",
    "name": "Phường Vĩnh Thông",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81301097",
    "id": "81301097",
    "name": "Phường Rạch Giá",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81325098",
    "id": "81325098",
    "name": "Phường Hà Tiên",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81325099",
    "id": "81325099",
    "name": "Phường Tô Châu",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81325100",
    "id": "81325100",
    "name": "Xã Tiên Hải",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81321101",
    "id": "81321101",
    "name": "Đặc khu Phú Quốc",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81321102",
    "id": "81321102",
    "name": "Đặc khu Thổ Châu",
    "provinceId": "01",
    "provinceName": "Tỉnh An Giang",
    "level": 2
  },
  {
    "systemId": "W2_81519001",
    "id": "81519001",
    "name": "Phường Ninh Kiều",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81519002",
    "id": "81519002",
    "name": "Phường Cái Khế",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81519003",
    "id": "81519003",
    "name": "Phường Tân An",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81519004",
    "id": "81519004",
    "name": "Phường An Bình",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81521005",
    "id": "81521005",
    "name": "Phường Thới An Đông",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81521006",
    "id": "81521006",
    "name": "Phường Bình Thủy",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81521007",
    "id": "81521007",
    "name": "Phường Long Tuyền",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81523008",
    "id": "81523008",
    "name": "Phường Cái Răng",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81523009",
    "id": "81523009",
    "name": "Phường Hưng Phú",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81505010",
    "id": "81505010",
    "name": "Phường Ô Môn",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81505011",
    "id": "81505011",
    "name": "Phường Thới Long",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81505012",
    "id": "81505012",
    "name": "Phường Phước Thới",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81503013",
    "id": "81503013",
    "name": "Phường Trung Nhứt",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81503014",
    "id": "81503014",
    "name": "Phường Thốt Nốt",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81503015",
    "id": "81503015",
    "name": "Phường Thuận Hưng",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81503016",
    "id": "81503016",
    "name": "Phường Tân Lộc",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81529017",
    "id": "81529017",
    "name": "Xã Phong Điền",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81529018",
    "id": "81529018",
    "name": "Xã Nhơn Ái",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81529019",
    "id": "81529019",
    "name": "Xã Trường Long",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81531020",
    "id": "81531020",
    "name": "Xã Thới Lai",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81531021",
    "id": "81531021",
    "name": "Xã Đông Thuận",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81531022",
    "id": "81531022",
    "name": "Xã Trường Xuân",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81531023",
    "id": "81531023",
    "name": "Xã Trường Thành",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81527024",
    "id": "81527024",
    "name": "Xã Cờ Đỏ",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81527025",
    "id": "81527025",
    "name": "Xã Đông Hiệp",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81527026",
    "id": "81527026",
    "name": "Xã Thạnh Phú",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81527027",
    "id": "81527027",
    "name": "Xã Thới Hưng",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81527028",
    "id": "81527028",
    "name": "Xã Trung Hưng",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81525029",
    "id": "81525029",
    "name": "Xã Vĩnh Thạnh",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81525030",
    "id": "81525030",
    "name": "Xã Vĩnh Trinh",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81525031",
    "id": "81525031",
    "name": "Xã Thạnh An",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81525032",
    "id": "81525032",
    "name": "Xã Thạnh Quới",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81601033",
    "id": "81601033",
    "name": "Xã Hỏa Lựu",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81601034",
    "id": "81601034",
    "name": "Phường Vị Thanh",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81601035",
    "id": "81601035",
    "name": "Phường Vị Tân",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81609036",
    "id": "81609036",
    "name": "Xã Vị Thủy",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81609037",
    "id": "81609037",
    "name": "Xã Vĩnh Thuận Đông",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81609038",
    "id": "81609038",
    "name": "Xã Vị Thanh 1",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81609039",
    "id": "81609039",
    "name": "Xã Vĩnh Tường",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81611040",
    "id": "81611040",
    "name": "Xã Vĩnh Viễn",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81611041",
    "id": "81611041",
    "name": "Xã Xà Phiên",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81611042",
    "id": "81611042",
    "name": "Xã Lương Tâm",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81612043",
    "id": "81612043",
    "name": "Phường Long Bình",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81612044",
    "id": "81612044",
    "name": "Phường Long Mỹ",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81612045",
    "id": "81612045",
    "name": "Phường Long Phú 1",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81603046",
    "id": "81603046",
    "name": "Xã Thạnh Xuân",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81603047",
    "id": "81603047",
    "name": "Xã Tân Hòa",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81603048",
    "id": "81603048",
    "name": "Xã Trường Long Tây",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81605049",
    "id": "81605049",
    "name": "Xã Châu Thành",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81605050",
    "id": "81605050",
    "name": "Xã Đông Phước",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81605051",
    "id": "81605051",
    "name": "Xã Phú Hữu",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81607052",
    "id": "81607052",
    "name": "Phường Đại Thành",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81607053",
    "id": "81607053",
    "name": "Phường Ngã Bảy",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81608054",
    "id": "81608054",
    "name": "Xã Tân Bình",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81608055",
    "id": "81608055",
    "name": "Xã Hòa An",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81608056",
    "id": "81608056",
    "name": "Xã Phương Bình",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81608057",
    "id": "81608057",
    "name": "Xã Tân Phước Hưng",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81608058",
    "id": "81608058",
    "name": "Xã Hiệp Hưng",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81608059",
    "id": "81608059",
    "name": "Xã Phụng Hiệp",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81608060",
    "id": "81608060",
    "name": "Xã Thạnh Hòa",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81901061",
    "id": "81901061",
    "name": "Phường Phú Lợi",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81901062",
    "id": "81901062",
    "name": "Phường Sóc Trăng",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81901063",
    "id": "81901063",
    "name": "Phường Mỹ Xuyên",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81909064",
    "id": "81909064",
    "name": "Xã Hòa Tú",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81909065",
    "id": "81909065",
    "name": "Xã Gia Hòa",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81909066",
    "id": "81909066",
    "name": "Xã Nhu Gia",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81909067",
    "id": "81909067",
    "name": "Xã Ngọc Tố",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81905068",
    "id": "81905068",
    "name": "Xã Trường Khánh",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81905069",
    "id": "81905069",
    "name": "Xã Đại Ngãi",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81905070",
    "id": "81905070",
    "name": "Xã Tân Thạnh",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81905071",
    "id": "81905071",
    "name": "Xã Long Phú",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81903072",
    "id": "81903072",
    "name": "Xã Nhơn Mỹ",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81903073",
    "id": "81903073",
    "name": "Xã Phong Nẫm",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81903074",
    "id": "81903074",
    "name": "Xã An Lạc Thôn",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81903075",
    "id": "81903075",
    "name": "Xã Kế Sách",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81903076",
    "id": "81903076",
    "name": "Xã Thới An Hội",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81903077",
    "id": "81903077",
    "name": "Xã Đại Hải",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81915078",
    "id": "81915078",
    "name": "Xã Phú Tâm",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81915079",
    "id": "81915079",
    "name": "Xã An Ninh",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81915080",
    "id": "81915080",
    "name": "Xã Thuận Hòa",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81915081",
    "id": "81915081",
    "name": "Xã Hồ Đắc Kiện",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81907082",
    "id": "81907082",
    "name": "Xã Mỹ Tú",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81907083",
    "id": "81907083",
    "name": "Xã Long Hưng",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81907084",
    "id": "81907084",
    "name": "Xã Mỹ Phước",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81907085",
    "id": "81907085",
    "name": "Xã Mỹ Hương",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81913086",
    "id": "81913086",
    "name": "Xã Vĩnh Hải",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81913087",
    "id": "81913087",
    "name": "Xã Lai Hòa",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81913088",
    "id": "81913088",
    "name": "Phường Vĩnh Phước",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81913089",
    "id": "81913089",
    "name": "Phường Vĩnh Châu",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81913090",
    "id": "81913090",
    "name": "Phường Khánh Hòa",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81912091",
    "id": "81912091",
    "name": "Xã Tân Long",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81912092",
    "id": "81912092",
    "name": "Phường Ngã Năm",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81912093",
    "id": "81912093",
    "name": "Phường Mỹ Quới",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81911094",
    "id": "81911094",
    "name": "Xã Phú Lộc",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81911095",
    "id": "81911095",
    "name": "Xã Vĩnh Lợi",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81911096",
    "id": "81911096",
    "name": "Xã Lâm Tân",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81917097",
    "id": "81917097",
    "name": "Xã Thạnh Thới An",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81917098",
    "id": "81917098",
    "name": "Xã Tài Văn",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81917099",
    "id": "81917099",
    "name": "Xã Liêu Tú",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81917100",
    "id": "81917100",
    "name": "Xã Lịch Hội Thượng",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81917101",
    "id": "81917101",
    "name": "Xã Trần Đề",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81906102",
    "id": "81906102",
    "name": "Xã An Thạnh",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_81906103",
    "id": "81906103",
    "name": "Xã Cù Lao Dung",
    "provinceId": "05",
    "provinceName": "Thành phố Cần Thơ",
    "level": 2
  },
  {
    "systemId": "W2_82301001",
    "id": "82301001",
    "name": "Phường An Xuyên",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82301002",
    "id": "82301002",
    "name": "Phường Lý Văn Lâm",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82301003",
    "id": "82301003",
    "name": "Phường Tân Thành",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82301004",
    "id": "82301004",
    "name": "Phường Hòa Thành",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82311005",
    "id": "82311005",
    "name": "Xã Tân Thuận",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82311006",
    "id": "82311006",
    "name": "Xã Tân Tiến",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82311007",
    "id": "82311007",
    "name": "Xã Tạ An Khương",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82311008",
    "id": "82311008",
    "name": "Xã Trần Phán",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82311009",
    "id": "82311009",
    "name": "Xã Thanh Tùng",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82311010",
    "id": "82311010",
    "name": "Xã Đầm Dơi",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82311011",
    "id": "82311011",
    "name": "Xã Quách Phẩm",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82305012",
    "id": "82305012",
    "name": "Xã U Minh",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82305013",
    "id": "82305013",
    "name": "Xã Nguyễn Phích",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82305014",
    "id": "82305014",
    "name": "Xã Khánh Lâm",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82305015",
    "id": "82305015",
    "name": "Xã Khánh An",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82313016",
    "id": "82313016",
    "name": "Xã Phan Ngọc Hiển",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82313017",
    "id": "82313017",
    "name": "Xã Đất Mũi",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82313018",
    "id": "82313018",
    "name": "Xã Tân Ân",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82307019",
    "id": "82307019",
    "name": "Xã Khánh Bình",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82307020",
    "id": "82307020",
    "name": "Xã Đá Bạc",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82307021",
    "id": "82307021",
    "name": "Xã Khánh Hưng",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82307022",
    "id": "82307022",
    "name": "Xã Sông Đốc",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82307023",
    "id": "82307023",
    "name": "Xã Trần Văn Thời",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82303024",
    "id": "82303024",
    "name": "Xã Thới Bình",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82303025",
    "id": "82303025",
    "name": "Xã Trí Phải",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82303026",
    "id": "82303026",
    "name": "Xã Tân Lộc",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82303027",
    "id": "82303027",
    "name": "Xã Hồ Thị Kỷ",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82303028",
    "id": "82303028",
    "name": "Xã Biển Bạch",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82312029",
    "id": "82312029",
    "name": "Xã Đất Mới",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82312030",
    "id": "82312030",
    "name": "Xã Năm Căn",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82312031",
    "id": "82312031",
    "name": "Xã Tam Giang",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82308032",
    "id": "82308032",
    "name": "Xã Cái Đôi Vàm",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82308033",
    "id": "82308033",
    "name": "Xã Nguyễn Việt Khái",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82308034",
    "id": "82308034",
    "name": "Xã Phú Tân",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82308035",
    "id": "82308035",
    "name": "Xã Phú Mỹ",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82309036",
    "id": "82309036",
    "name": "Xã Lương Thế Trân",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82309037",
    "id": "82309037",
    "name": "Xã Tân Hưng",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82309038",
    "id": "82309038",
    "name": "Xã Hưng Mỹ",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82309039",
    "id": "82309039",
    "name": "Xã Cái Nước",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82101040",
    "id": "82101040",
    "name": "Phường Bạc Liêu",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82101041",
    "id": "82101041",
    "name": "Phường Vĩnh Trạch",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82101042",
    "id": "82101042",
    "name": "Phường Hiệp Thành",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82107043",
    "id": "82107043",
    "name": "Phường Giá Rai",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82107044",
    "id": "82107044",
    "name": "Phường Láng Tròn",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82107045",
    "id": "82107045",
    "name": "Xã Phong Thạnh",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82103046",
    "id": "82103046",
    "name": "Xã Hồng Dân",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82103047",
    "id": "82103047",
    "name": "Xã Vĩnh Lộc",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82103048",
    "id": "82103048",
    "name": "Xã Ninh Thạnh Lợi",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82103049",
    "id": "82103049",
    "name": "Xã Ninh Quới",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82111050",
    "id": "82111050",
    "name": "Xã Gành Hào",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82111051",
    "id": "82111051",
    "name": "Xã Định Thành",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82111052",
    "id": "82111052",
    "name": "Xã An Trạch",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82111053",
    "id": "82111053",
    "name": "Xã Long Điền",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82111054",
    "id": "82111054",
    "name": "Xã Đông Hải",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82106055",
    "id": "82106055",
    "name": "Xã Hòa Bình",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82106056",
    "id": "82106056",
    "name": "Xã Vĩnh Mỹ",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82106057",
    "id": "82106057",
    "name": "Xã Vĩnh Hậu",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82109058",
    "id": "82109058",
    "name": "Xã Phước Long",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82109059",
    "id": "82109059",
    "name": "Xã Vĩnh Phước",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82109060",
    "id": "82109060",
    "name": "Xã Phong Hiệp",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82109061",
    "id": "82109061",
    "name": "Xã Vĩnh Thanh",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82105062",
    "id": "82105062",
    "name": "Xã Vĩnh Lợi",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82105063",
    "id": "82105063",
    "name": "Xã Hưng Hội",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  },
  {
    "systemId": "W2_82105064",
    "id": "82105064",
    "name": "Xã Châu Thới",
    "provinceId": "04",
    "provinceName": "Tỉnh Cà Mau",
    "level": 2
  }
] as const satisfies readonly Ward2LevelSeed[];

export const WARDS_2LEVEL_DATA: Ward2Level[] = rawData.map((item) => ({
  ...item,
  systemId: asSystemId(item.systemId),
  provinceId: asBusinessId(item.provinceId),
  ...buildSeedAuditFields({ createdAt: WARD_2LEVEL_AUDIT_DATE }),
}));
