/**
 * Ward District Mapping Data
 * Auto-generated from FB0CA300.xlsx
 * Total: 3321 wards, 696 districts, 34 provinces
 * Generated: 2025-10-29T07:17:58.613Z
 */

import { asBusinessId } from '@/lib/id-types';
import type { WardDistrictDataInput } from './ward-district-mapping';

const rawData = [
  {
    "wardId": "10105001",
    "wardName": "Phường Hoàn Kiếm",
    "districtId": 10105,
    "districtName": "Quận Hoàn Kiếm",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10105002",
    "wardName": "Phường Cửa Nam",
    "districtId": 10105,
    "districtName": "Quận Hoàn Kiếm",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10101003",
    "wardName": "Phường Ba Đình",
    "districtId": 10101,
    "districtName": "Quận Ba Đình",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10101004",
    "wardName": "Phường Ngọc Hà",
    "districtId": 10101,
    "districtName": "Quận Ba Đình",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10101005",
    "wardName": "Phường Giảng Võ",
    "districtId": 10101,
    "districtName": "Quận Ba Đình",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10107006",
    "wardName": "Phường Hai Bà Trưng",
    "districtId": 10107,
    "districtName": "Quận Hai Bà Trưng",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10107007",
    "wardName": "Phường Vĩnh Tuy",
    "districtId": 10107,
    "districtName": "Quận Hai Bà Trưng",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10107008",
    "wardName": "Phường Bạch Mai",
    "districtId": 10107,
    "districtName": "Quận Hai Bà Trưng",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10109009",
    "wardName": "Phường Đống Đa",
    "districtId": 10109,
    "districtName": "Quận Đống Đa",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10109010",
    "wardName": "Phường Kim Liên",
    "districtId": 10109,
    "districtName": "Quận Đống Đa",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10109011",
    "wardName": "Phường Văn Miếu - Quốc Tử Giám",
    "districtId": 10109,
    "districtName": "Quận Đống Đa",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10109012",
    "wardName": "Phường Láng",
    "districtId": 10109,
    "districtName": "Quận Đống Đa",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10109013",
    "wardName": "Phường Ô Chợ Dừa",
    "districtId": 10109,
    "districtName": "Quận Đống Đa",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10103014",
    "wardName": "Phường Hồng Hà",
    "districtId": 10103,
    "districtName": "Quận Tây Hồ",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10108015",
    "wardName": "Phường Lĩnh Nam",
    "districtId": 10108,
    "districtName": "Quận Hoàng Mai",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10108016",
    "wardName": "Phường Hoàng Mai",
    "districtId": 10108,
    "districtName": "Quận Hoàng Mai",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10108017",
    "wardName": "Phường Vĩnh Hưng",
    "districtId": 10108,
    "districtName": "Quận Hoàng Mai",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10108018",
    "wardName": "Phường Tương Mai",
    "districtId": 10108,
    "districtName": "Quận Hoàng Mai",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10108019",
    "wardName": "Phường Định Công",
    "districtId": 10108,
    "districtName": "Quận Hoàng Mai",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10123020",
    "wardName": "Phường Hoàng Liệt",
    "districtId": 10123,
    "districtName": "Huyện Thanh Trì",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10108021",
    "wardName": "Phường Yên Sở",
    "districtId": 10108,
    "districtName": "Quận Hoàng Mai",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10111022",
    "wardName": "Phường Thanh Xuân",
    "districtId": 10111,
    "districtName": "Quận Thanh Xuân",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10111023",
    "wardName": "Phường Khương Đình",
    "districtId": 10111,
    "districtName": "Quận Thanh Xuân",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10111024",
    "wardName": "Phường Phương Liệt",
    "districtId": 10111,
    "districtName": "Quận Thanh Xuân",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10113025",
    "wardName": "Phường Cầu Giấy",
    "districtId": 10113,
    "districtName": "Quận Cầu Giấy",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10113026",
    "wardName": "Phường Nghĩa Đô",
    "districtId": 10113,
    "districtName": "Quận Cầu Giấy",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10113027",
    "wardName": "Phường Yên Hoà",
    "districtId": 10113,
    "districtName": "Quận Cầu Giấy",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10103028",
    "wardName": "Phường Tây Hồ",
    "districtId": 10103,
    "districtName": "Quận Tây Hồ",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10157029",
    "wardName": "Phường Phú Thượng",
    "districtId": 10157,
    "districtName": "Quận Bắc Từ Liêm",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10157030",
    "wardName": "Phường Tây Tựu",
    "districtId": 10157,
    "districtName": "Quận Bắc Từ Liêm",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10157031",
    "wardName": "Phường Phú Diễn",
    "districtId": 10157,
    "districtName": "Quận Bắc Từ Liêm",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10157032",
    "wardName": "Phường Xuân Đỉnh",
    "districtId": 10157,
    "districtName": "Quận Bắc Từ Liêm",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10157033",
    "wardName": "Phường Đông Ngạc",
    "districtId": 10157,
    "districtName": "Quận Bắc Từ Liêm",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10157034",
    "wardName": "Phường Thượng Cát",
    "districtId": 10157,
    "districtName": "Quận Bắc Từ Liêm",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10155035",
    "wardName": "Phường Từ Liêm",
    "districtId": 10155,
    "districtName": "Quận Nam Từ Liêm",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10155036",
    "wardName": "Phường Xuân Phương",
    "districtId": 10155,
    "districtName": "Quận Nam Từ Liêm",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10155037",
    "wardName": "Phường Tây Mỗ",
    "districtId": 10155,
    "districtName": "Quận Nam Từ Liêm",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10155038",
    "wardName": "Phường Đại Mỗ",
    "districtId": 10155,
    "districtName": "Quận Nam Từ Liêm",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10106039",
    "wardName": "Phường Long Biên",
    "districtId": 10106,
    "districtName": "Quận Long Biên",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10106040",
    "wardName": "Phường Bồ Đề",
    "districtId": 10106,
    "districtName": "Quận Long Biên",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10106041",
    "wardName": "Phường Việt Hưng",
    "districtId": 10106,
    "districtName": "Quận Long Biên",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10106042",
    "wardName": "Phường Phúc Lợi",
    "districtId": 10106,
    "districtName": "Quận Long Biên",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10127043",
    "wardName": "Phường Hà Đông",
    "districtId": 10127,
    "districtName": "Quận Hà Đông",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10127044",
    "wardName": "Phường Dương Nội",
    "districtId": 10127,
    "districtName": "Quận Hà Đông",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10127045",
    "wardName": "Phường Yên Nghĩa",
    "districtId": 10127,
    "districtName": "Quận Hà Đông",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10127046",
    "wardName": "Phường Phú Lương",
    "districtId": 10127,
    "districtName": "Quận Hà Đông",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10127047",
    "wardName": "Phường Kiến Hưng",
    "districtId": 10127,
    "districtName": "Quận Hà Đông",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10123048",
    "wardName": "Xã Thanh Trì",
    "districtId": 10123,
    "districtName": "Huyện Thanh Trì",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10123049",
    "wardName": "Xã Đại Thanh",
    "districtId": 10123,
    "districtName": "Huyện Thanh Trì",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10123050",
    "wardName": "Xã Nam Phù",
    "districtId": 10123,
    "districtName": "Huyện Thanh Trì",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10123051",
    "wardName": "Xã Ngọc Hồi",
    "districtId": 10123,
    "districtName": "Huyện Thanh Trì",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10123052",
    "wardName": "Phường Thanh Liệt",
    "districtId": 10123,
    "districtName": "Huyện Thanh Trì",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10143053",
    "wardName": "Xã Thượng Phúc",
    "districtId": 10143,
    "districtName": "Huyện Thường Tín",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10143054",
    "wardName": "Xã Thường Tín",
    "districtId": 10143,
    "districtName": "Huyện Thường Tín",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10143055",
    "wardName": "Xã Chương Dương",
    "districtId": 10143,
    "districtName": "Huyện Thường Tín",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10143056",
    "wardName": "Xã Hồng Vân",
    "districtId": 10143,
    "districtName": "Huyện Thường Tín",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10149057",
    "wardName": "Xã Phú Xuyên",
    "districtId": 10149,
    "districtName": "Huyện Phú Xuyên",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10149058",
    "wardName": "Xã Phượng Dực",
    "districtId": 10149,
    "districtName": "Huyện Phú Xuyên",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10149059",
    "wardName": "Xã Chuyên Mỹ",
    "districtId": 10149,
    "districtName": "Huyện Phú Xuyên",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10149060",
    "wardName": "Xã Đại Xuyên",
    "districtId": 10149,
    "districtName": "Huyện Phú Xuyên",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10141061",
    "wardName": "Xã Thanh Oai",
    "districtId": 10141,
    "districtName": "Huyện Thanh Oai",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10141062",
    "wardName": "Xã Bình Minh",
    "districtId": 10141,
    "districtName": "Huyện Thanh Oai",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10141063",
    "wardName": "Xã Tam Hưng",
    "districtId": 10141,
    "districtName": "Huyện Thanh Oai",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10141064",
    "wardName": "Xã Dân Hoà",
    "districtId": 10141,
    "districtName": "Huyện Thanh Oai",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10147065",
    "wardName": "Xã Vân Đình",
    "districtId": 10147,
    "districtName": "Huyện Ứng Hoà",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10147066",
    "wardName": "Xã Ứng Thiên",
    "districtId": 10147,
    "districtName": "Huyện Ứng Hoà",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10147067",
    "wardName": "Xã Hoà Xá",
    "districtId": 10147,
    "districtName": "Huyện Ứng Hoà",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10147068",
    "wardName": "Xã Ứng Hoà",
    "districtId": 10147,
    "districtName": "Huyện Ứng Hoà",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10145069",
    "wardName": "Xã Mỹ Đức",
    "districtId": 10145,
    "districtName": "Huyện Mỹ Đức",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10145070",
    "wardName": "Xã Hồng Sơn",
    "districtId": 10145,
    "districtName": "Huyện Mỹ Đức",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10145071",
    "wardName": "Xã Phúc Sơn",
    "districtId": 10145,
    "districtName": "Huyện Mỹ Đức",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10145072",
    "wardName": "Xã Hương Sơn",
    "districtId": 10145,
    "districtName": "Huyện Mỹ Đức",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10153073",
    "wardName": "Phường Chương Mỹ",
    "districtId": 10153,
    "districtName": "Huyện Chương Mỹ",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10153074",
    "wardName": "Xã Phú Nghĩa",
    "districtId": 10153,
    "districtName": "Huyện Chương Mỹ",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10153075",
    "wardName": "Xã Xuân Mai",
    "districtId": 10153,
    "districtName": "Huyện Chương Mỹ",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10153076",
    "wardName": "Xã Trần Phú",
    "districtId": 10153,
    "districtName": "Huyện Chương Mỹ",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10153077",
    "wardName": "Xã Hoà Phú",
    "districtId": 10153,
    "districtName": "Huyện Chương Mỹ",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10153078",
    "wardName": "Xã Quảng Bị",
    "districtId": 10153,
    "districtName": "Huyện Chương Mỹ",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10151079",
    "wardName": "Xã Minh Châu",
    "districtId": 10151,
    "districtName": "Huyện Ba Vì",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10151080",
    "wardName": "Xã Quảng Oai",
    "districtId": 10151,
    "districtName": "Huyện Ba Vì",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10151081",
    "wardName": "Xã Vật Lại",
    "districtId": 10151,
    "districtName": "Huyện Ba Vì",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10151082",
    "wardName": "Xã Cổ Đô",
    "districtId": 10151,
    "districtName": "Huyện Ba Vì",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10151083",
    "wardName": "Xã Bất Bạt",
    "districtId": 10151,
    "districtName": "Huyện Ba Vì",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10151084",
    "wardName": "Xã Suối Hai",
    "districtId": 10151,
    "districtName": "Huyện Ba Vì",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10151085",
    "wardName": "Xã Ba Vì",
    "districtId": 10151,
    "districtName": "Huyện Ba Vì",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10151086",
    "wardName": "Xã Yên Bài",
    "districtId": 10151,
    "districtName": "Huyện Ba Vì",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10129087",
    "wardName": "Phường Sơn Tây",
    "districtId": 10129,
    "districtName": "Thị xã Sơn Tây",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10129088",
    "wardName": "Phường Tùng Thiện",
    "districtId": 10129,
    "districtName": "Thị xã Sơn Tây",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10129089",
    "wardName": "Xã Đoài Phương",
    "districtId": 10129,
    "districtName": "Thị xã Sơn Tây",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10131090",
    "wardName": "Xã Phúc Thọ",
    "districtId": 10131,
    "districtName": "Huyện Phúc Thọ",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10131091",
    "wardName": "Xã Phúc Lộc",
    "districtId": 10131,
    "districtName": "Huyện Phúc Thọ",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10131092",
    "wardName": "Xã Hát Môn",
    "districtId": 10131,
    "districtName": "Huyện Phúc Thọ",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10135093",
    "wardName": "Xã Thạch Thất",
    "districtId": 10135,
    "districtName": "Huyện Thạch Thất",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10135094",
    "wardName": "Xã Hạ Bằng",
    "districtId": 10135,
    "districtName": "Huyện Thạch Thất",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10135095",
    "wardName": "Xã Tây Phương",
    "districtId": 10135,
    "districtName": "Huyện Thạch Thất",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10135096",
    "wardName": "Xã Hoà Lạc",
    "districtId": 10135,
    "districtName": "Huyện Thạch Thất",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10135097",
    "wardName": "Xã Yên Xuân",
    "districtId": 10135,
    "districtName": "Huyện Thạch Thất",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10139098",
    "wardName": "Xã Quốc Oai",
    "districtId": 10139,
    "districtName": "Huyện Quốc Oai",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10139099",
    "wardName": "Xã Hưng Đạo",
    "districtId": 10139,
    "districtName": "Huyện Quốc Oai",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10139100",
    "wardName": "Xã Kiều Phú",
    "districtId": 10139,
    "districtName": "Huyện Quốc Oai",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10139101",
    "wardName": "Xã Phú Cát",
    "districtId": 10139,
    "districtName": "Huyện Quốc Oai",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10137102",
    "wardName": "Xã Hoài Đức",
    "districtId": 10137,
    "districtName": "Huyện Hoài Đức",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10137103",
    "wardName": "Xã Dương Hoà",
    "districtId": 10137,
    "districtName": "Huyện Hoài Đức",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10137104",
    "wardName": "Xã Sơn Đồng",
    "districtId": 10137,
    "districtName": "Huyện Hoài Đức",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10137105",
    "wardName": "Xã An Khánh",
    "districtId": 10137,
    "districtName": "Huyện Hoài Đức",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10133106",
    "wardName": "Xã Đan Phượng",
    "districtId": 10133,
    "districtName": "Huyện Đan Phượng",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10133107",
    "wardName": "Xã Ô Diên",
    "districtId": 10133,
    "districtName": "Huyện Đan Phượng",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10133108",
    "wardName": "Xã Liên Minh",
    "districtId": 10133,
    "districtName": "Huyện Đan Phượng",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10119109",
    "wardName": "Xã Gia Lâm",
    "districtId": 10119,
    "districtName": "Huyện Gia Lâm",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10119110",
    "wardName": "Xã Thuận An",
    "districtId": 10119,
    "districtName": "Huyện Gia Lâm",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10119111",
    "wardName": "Xã Bát Tràng",
    "districtId": 10119,
    "districtName": "Huyện Gia Lâm",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10119112",
    "wardName": "Xã Phù Đổng",
    "districtId": 10119,
    "districtName": "Huyện Gia Lâm",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10117113",
    "wardName": "Xã Thư Lâm",
    "districtId": 10117,
    "districtName": "Huyện Đông Anh",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10117114",
    "wardName": "Xã Đông Anh",
    "districtId": 10117,
    "districtName": "Huyện Đông Anh",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10117115",
    "wardName": "Xã Phúc Thịnh",
    "districtId": 10117,
    "districtName": "Huyện Đông Anh",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10117116",
    "wardName": "Xã Thiên Lộc",
    "districtId": 10117,
    "districtName": "Huyện Đông Anh",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10117117",
    "wardName": "Xã Vĩnh Thanh",
    "districtId": 10117,
    "districtName": "Huyện Đông Anh",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10125118",
    "wardName": "Xã Mê Linh",
    "districtId": 10125,
    "districtName": "Huyện Mê Linh",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10125119",
    "wardName": "Xã Yên Lãng",
    "districtId": 10125,
    "districtName": "Huyện Mê Linh",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10125120",
    "wardName": "Xã Tiến Thắng",
    "districtId": 10125,
    "districtName": "Huyện Mê Linh",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10125121",
    "wardName": "Xã Quang Minh",
    "districtId": 10125,
    "districtName": "Huyện Mê Linh",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10115122",
    "wardName": "Xã Sóc Sơn",
    "districtId": 10115,
    "districtName": "Huyện Sóc Sơn",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10115123",
    "wardName": "Xã Đa Phúc",
    "districtId": 10115,
    "districtName": "Huyện Sóc Sơn",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10115124",
    "wardName": "Xã Nội Bài",
    "districtId": 10115,
    "districtName": "Huyện Sóc Sơn",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10115125",
    "wardName": "Xã Trung Giã",
    "districtId": 10115,
    "districtName": "Huyện Sóc Sơn",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "10115126",
    "wardName": "Xã Kim Anh",
    "districtId": 10115,
    "districtName": "Huyện Sóc Sơn",
    "provinceId": "01",
    "provinceName": "Thành phố Hà Nội"
  },
  {
    "wardId": "22113001",
    "wardName": "Xã Đại Sơn",
    "districtId": 22113,
    "districtName": "Huyện Sơn Động",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22113002",
    "wardName": "Xã Sơn Động",
    "districtId": 22113,
    "districtName": "Huyện Sơn Động",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22113003",
    "wardName": "Xã Tây Yên Tử",
    "districtId": 22113,
    "districtName": "Huyện Sơn Động",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22113004",
    "wardName": "Xã Dương Hưu",
    "districtId": 22113,
    "districtName": "Huyện Sơn Động",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22113005",
    "wardName": "Xã Yên Định",
    "districtId": 22113,
    "districtName": "Huyện Sơn Động",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22113006",
    "wardName": "Xã An Lạc",
    "districtId": 22113,
    "districtName": "Huyện Sơn Động",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22113007",
    "wardName": "Xã Vân Sơn",
    "districtId": 22113,
    "districtName": "Huyện Sơn Động",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22107008",
    "wardName": "Xã Biển Động",
    "districtId": 22107,
    "districtName": "Huyện Lục Ngạn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22107009",
    "wardName": "Xã Lục Ngạn",
    "districtId": 22107,
    "districtName": "Huyện Lục Ngạn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22107010",
    "wardName": "Xã Đèo Gia",
    "districtId": 22107,
    "districtName": "Huyện Lục Ngạn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22107011",
    "wardName": "Xã Sơn Hải",
    "districtId": 22107,
    "districtName": "Huyện Lục Ngạn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22107012",
    "wardName": "Xã Tân Sơn",
    "districtId": 22107,
    "districtName": "Huyện Lục Ngạn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22107013",
    "wardName": "Xã Biên Sơn",
    "districtId": 22107,
    "districtName": "Huyện Lục Ngạn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22107014",
    "wardName": "Xã Sa Lý",
    "districtId": 22107,
    "districtName": "Huyện Lục Ngạn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22107015",
    "wardName": "Xã Nam Dương",
    "districtId": 22107,
    "districtName": "Huyện Lục Ngạn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22121016",
    "wardName": "Xã Kiên Lao",
    "districtId": 22121,
    "districtName": "Thị xã Chũ",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22121017",
    "wardName": "Phường Chũ",
    "districtId": 22121,
    "districtName": "Thị xã Chũ",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22121018",
    "wardName": "Phường Phượng Sơn",
    "districtId": 22121,
    "districtName": "Thị xã Chũ",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22115019",
    "wardName": "Xã Lục Sơn",
    "districtId": 22115,
    "districtName": "Huyện Lục Nam",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22115020",
    "wardName": "Xã Trường Sơn",
    "districtId": 22115,
    "districtName": "Huyện Lục Nam",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22115021",
    "wardName": "Xã Cẩm Lý",
    "districtId": 22115,
    "districtName": "Huyện Lục Nam",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22115022",
    "wardName": "Xã Đông Phú",
    "districtId": 22115,
    "districtName": "Huyện Lục Nam",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22115023",
    "wardName": "Xã Nghĩa Phương",
    "districtId": 22115,
    "districtName": "Huyện Lục Nam",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22115024",
    "wardName": "Xã Lục Nam",
    "districtId": 22115,
    "districtName": "Huyện Lục Nam",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22115025",
    "wardName": "Xã Bắc Lũng",
    "districtId": 22115,
    "districtName": "Huyện Lục Nam",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22115026",
    "wardName": "Xã Bảo Đài",
    "districtId": 22115,
    "districtName": "Huyện Lục Nam",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22111027",
    "wardName": "Xã Lạng Giang",
    "districtId": 22111,
    "districtName": "Huyện Lạng Giang",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22111028",
    "wardName": "Xã Mỹ Thái",
    "districtId": 22111,
    "districtName": "Huyện Lạng Giang",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22111029",
    "wardName": "Xã Kép",
    "districtId": 22111,
    "districtName": "Huyện Lạng Giang",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22111030",
    "wardName": "Xã Tân Dĩnh",
    "districtId": 22111,
    "districtName": "Huyện Lạng Giang",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22111031",
    "wardName": "Xã Tiên Lục",
    "districtId": 22111,
    "districtName": "Huyện Lạng Giang",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22103032",
    "wardName": "Xã Yên Thế",
    "districtId": 22103,
    "districtName": "Huyện Yên Thế",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22103033",
    "wardName": "Xã Bố Hạ",
    "districtId": 22103,
    "districtName": "Huyện Yên Thế",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22103034",
    "wardName": "Xã Đồng Kỳ",
    "districtId": 22103,
    "districtName": "Huyện Yên Thế",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22103035",
    "wardName": "Xã Xuân Lương",
    "districtId": 22103,
    "districtName": "Huyện Yên Thế",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22103036",
    "wardName": "Xã Tam Tiến",
    "districtId": 22103,
    "districtName": "Huyện Yên Thế",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22105037",
    "wardName": "Xã Tân Yên",
    "districtId": 22105,
    "districtName": "Huyện Tân Yên",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22105038",
    "wardName": "Xã Ngọc Thiện",
    "districtId": 22105,
    "districtName": "Huyện Tân Yên",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22105039",
    "wardName": "Xã Nhã Nam",
    "districtId": 22105,
    "districtName": "Huyện Tân Yên",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22105040",
    "wardName": "Xã Phúc Hoà",
    "districtId": 22105,
    "districtName": "Huyện Tân Yên",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22105041",
    "wardName": "Xã Quang Trung",
    "districtId": 22105,
    "districtName": "Huyện Tân Yên",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22109042",
    "wardName": "Xã Hợp Thịnh",
    "districtId": 22109,
    "districtName": "Huyện Hiệp Hoà",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22109043",
    "wardName": "Xã Hiệp Hoà",
    "districtId": 22109,
    "districtName": "Huyện Hiệp Hoà",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22109044",
    "wardName": "Xã Hoàng Vân",
    "districtId": 22109,
    "districtName": "Huyện Hiệp Hoà",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22109045",
    "wardName": "Xã Xuân Cẩm",
    "districtId": 22109,
    "districtName": "Huyện Hiệp Hoà",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22117046",
    "wardName": "Phường Tự Lạn",
    "districtId": 22117,
    "districtName": "Thị xã Việt Yên",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22117047",
    "wardName": "Phường Việt Yên",
    "districtId": 22117,
    "districtName": "Thị xã Việt Yên",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22117048",
    "wardName": "Phường Nếnh",
    "districtId": 22117,
    "districtName": "Thị xã Việt Yên",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22117049",
    "wardName": "Phường Vân Hà",
    "districtId": 22117,
    "districtName": "Thị xã Việt Yên",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22101050",
    "wardName": "Xã Đồng Việt",
    "districtId": 22101,
    "districtName": "Thành phố Bắc Giang",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22101051",
    "wardName": "Phường Bắc Giang",
    "districtId": 22101,
    "districtName": "Thành phố Bắc Giang",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22101052",
    "wardName": "Phường Đa Mai",
    "districtId": 22101,
    "districtName": "Thành phố Bắc Giang",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22101053",
    "wardName": "Phường Tiền Phong",
    "districtId": 22101,
    "districtName": "Thành phố Bắc Giang",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22101054",
    "wardName": "Phường Tân An",
    "districtId": 22101,
    "districtName": "Thành phố Bắc Giang",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22101055",
    "wardName": "Phường Yên Dũng",
    "districtId": 22101,
    "districtName": "Thành phố Bắc Giang",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22101056",
    "wardName": "Phường Tân Tiến",
    "districtId": 22101,
    "districtName": "Thành phố Bắc Giang",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22101057",
    "wardName": "Phường Cảnh Thụy",
    "districtId": 22101,
    "districtName": "Thành phố Bắc Giang",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22301058",
    "wardName": "Phường Kinh Bắc",
    "districtId": 22301,
    "districtName": "Thành phố Bắc Ninh",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22301059",
    "wardName": "Phường Võ Cường",
    "districtId": 22301,
    "districtName": "Thành phố Bắc Ninh",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22301060",
    "wardName": "Phường Vũ Ninh",
    "districtId": 22301,
    "districtName": "Thành phố Bắc Ninh",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22301061",
    "wardName": "Phường Hạp Lĩnh",
    "districtId": 22301,
    "districtName": "Thành phố Bắc Ninh",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22301062",
    "wardName": "Phường Nam Sơn",
    "districtId": 22301,
    "districtName": "Thành phố Bắc Ninh",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22313063",
    "wardName": "Phường Từ Sơn",
    "districtId": 22313,
    "districtName": "Thị xã Từ Sơn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22313064",
    "wardName": "Phường Tam Sơn",
    "districtId": 22313,
    "districtName": "Thị xã Từ Sơn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22313065",
    "wardName": "Phường Đồng Nguyên",
    "districtId": 22313,
    "districtName": "Thị xã Từ Sơn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22313066",
    "wardName": "Phường Phù Khê",
    "districtId": 22313,
    "districtName": "Thị xã Từ Sơn",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22309067",
    "wardName": "Phường Thuận Thành",
    "districtId": 22309,
    "districtName": "Thị xã Thuận Thành",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22309068",
    "wardName": "Phường Mão Điền",
    "districtId": 22309,
    "districtName": "Thị xã Thuận Thành",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22309069",
    "wardName": "Phường Trạm Lộ",
    "districtId": 22309,
    "districtName": "Thị xã Thuận Thành",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22309070",
    "wardName": "Phường Trí Quả",
    "districtId": 22309,
    "districtName": "Thị xã Thuận Thành",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22309071",
    "wardName": "Phường Song Liễu",
    "districtId": 22309,
    "districtName": "Thị xã Thuận Thành",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22309072",
    "wardName": "Phường Ninh Xá",
    "districtId": 22309,
    "districtName": "Thị xã Thuận Thành",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22305073",
    "wardName": "Phường Quế Võ",
    "districtId": 22305,
    "districtName": "Thị xã Quế Võ",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22305074",
    "wardName": "Phường Phương Liễu",
    "districtId": 22305,
    "districtName": "Thị xã Quế Võ",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22305075",
    "wardName": "Phường Nhân Hoà",
    "districtId": 22305,
    "districtName": "Thị xã Quế Võ",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22305076",
    "wardName": "Phường Đào Viên",
    "districtId": 22305,
    "districtName": "Thị xã Quế Võ",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22305077",
    "wardName": "Phường Bồng Lai",
    "districtId": 22305,
    "districtName": "Thị xã Quế Võ",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22305078",
    "wardName": "Xã Chi Lăng",
    "districtId": 22305,
    "districtName": "Thị xã Quế Võ",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22305079",
    "wardName": "Xã Phù Lãng",
    "districtId": 22305,
    "districtName": "Thị xã Quế Võ",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22303080",
    "wardName": "Xã Yên Phong",
    "districtId": 22303,
    "districtName": "Huyện Yên Phong",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22303081",
    "wardName": "Xã Văn Môn",
    "districtId": 22303,
    "districtName": "Huyện Yên Phong",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22303082",
    "wardName": "Xã Tam Giang",
    "districtId": 22303,
    "districtName": "Huyện Yên Phong",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22303083",
    "wardName": "Xã Yên Trung",
    "districtId": 22303,
    "districtName": "Huyện Yên Phong",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22303084",
    "wardName": "Xã Tam Đa",
    "districtId": 22303,
    "districtName": "Huyện Yên Phong",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22307085",
    "wardName": "Xã Tiên Du",
    "districtId": 22307,
    "districtName": "Huyện Tiên Du",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22307086",
    "wardName": "Xã Liên Bão",
    "districtId": 22307,
    "districtName": "Huyện Tiên Du",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22307087",
    "wardName": "Xã Tân Chi",
    "districtId": 22307,
    "districtName": "Huyện Tiên Du",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22307088",
    "wardName": "Xã Đại Đồng",
    "districtId": 22307,
    "districtName": "Huyện Tiên Du",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22307089",
    "wardName": "Xã Phật Tích",
    "districtId": 22307,
    "districtName": "Huyện Tiên Du",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22315090",
    "wardName": "Xã Gia Bình",
    "districtId": 22315,
    "districtName": "Huyện Gia Bình",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22315091",
    "wardName": "Xã Nhân Thắng",
    "districtId": 22315,
    "districtName": "Huyện Gia Bình",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22315092",
    "wardName": "Xã Đại Lai",
    "districtId": 22315,
    "districtName": "Huyện Gia Bình",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22315093",
    "wardName": "Xã Cao Đức",
    "districtId": 22315,
    "districtName": "Huyện Gia Bình",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22315094",
    "wardName": "Xã Đông Cứu",
    "districtId": 22315,
    "districtName": "Huyện Gia Bình",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22311095",
    "wardName": "Xã Lương Tài",
    "districtId": 22311,
    "districtName": "Huyện Lương Tài",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22311096",
    "wardName": "Xã Lâm Thao",
    "districtId": 22311,
    "districtName": "Huyện Lương Tài",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22311097",
    "wardName": "Xã Trung Chính",
    "districtId": 22311,
    "districtName": "Huyện Lương Tài",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22311098",
    "wardName": "Xã Trung Kênh",
    "districtId": 22311,
    "districtName": "Huyện Lương Tài",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22113099",
    "wardName": "Xã Tuấn Đạo",
    "districtId": 22113,
    "districtName": "Huyện Sơn Động",
    "provinceId": "02",
    "provinceName": "Tỉnh Bắc Ninh"
  },
  {
    "wardId": "22521001",
    "wardName": "Phường An Sinh",
    "districtId": 22521,
    "districtName": "Thành phố Đông Triều",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22521002",
    "wardName": "Phường Đông Triều",
    "districtId": 22521,
    "districtName": "Thành phố Đông Triều",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22521003",
    "wardName": "Phường Bình Khê",
    "districtId": 22521,
    "districtName": "Thành phố Đông Triều",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22521004",
    "wardName": "Phường Mạo Khê",
    "districtId": 22521,
    "districtName": "Thành phố Đông Triều",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22521005",
    "wardName": "Phường Hoàng Quế",
    "districtId": 22521,
    "districtName": "Thành phố Đông Triều",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22505006",
    "wardName": "Phường Yên Tử",
    "districtId": 22505,
    "districtName": "Thành phố Uông Bí",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22505007",
    "wardName": "Phường Vàng Danh",
    "districtId": 22505,
    "districtName": "Thành phố Uông Bí",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22505008",
    "wardName": "Phường Uông Bí",
    "districtId": 22505,
    "districtName": "Thành phố Uông Bí",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22525009",
    "wardName": "Phường Đông Mai",
    "districtId": 22525,
    "districtName": "Thị xã Quảng Yên",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22525010",
    "wardName": "Phường Hiệp Hoà",
    "districtId": 22525,
    "districtName": "Thị xã Quảng Yên",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22525011",
    "wardName": "Phường Quảng Yên",
    "districtId": 22525,
    "districtName": "Thị xã Quảng Yên",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22525012",
    "wardName": "Phường Hà An",
    "districtId": 22525,
    "districtName": "Thị xã Quảng Yên",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22525013",
    "wardName": "Phường Phong Cốc",
    "districtId": 22525,
    "districtName": "Thị xã Quảng Yên",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22525014",
    "wardName": "Phường Liên Hoà",
    "districtId": 22525,
    "districtName": "Thị xã Quảng Yên",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22501015",
    "wardName": "Phường Tuần Châu",
    "districtId": 22501,
    "districtName": "Thành phố Hạ Long",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22501016",
    "wardName": "Phường Việt Hưng",
    "districtId": 22501,
    "districtName": "Thành phố Hạ Long",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22501017",
    "wardName": "Phường Bãi Cháy",
    "districtId": 22501,
    "districtName": "Thành phố Hạ Long",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22501018",
    "wardName": "Phường Hà Tu",
    "districtId": 22501,
    "districtName": "Thành phố Hạ Long",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22501019",
    "wardName": "Phường Hà Lầm",
    "districtId": 22501,
    "districtName": "Thành phố Hạ Long",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22501020",
    "wardName": "Phường Cao Xanh",
    "districtId": 22501,
    "districtName": "Thành phố Hạ Long",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22501021",
    "wardName": "Phường Hồng Gai",
    "districtId": 22501,
    "districtName": "Thành phố Hạ Long",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22501022",
    "wardName": "Phường Hạ Long",
    "districtId": 22501,
    "districtName": "Thành phố Hạ Long",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22501023",
    "wardName": "Phường Hoành Bồ",
    "districtId": 22501,
    "districtName": "Thành phố Hạ Long",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22501024",
    "wardName": "Xã Quảng La",
    "districtId": 22501,
    "districtName": "Thành phố Hạ Long",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22501025",
    "wardName": "Xã Thống Nhất",
    "districtId": 22501,
    "districtName": "Thành phố Hạ Long",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22503026",
    "wardName": "Phường Mông Dương",
    "districtId": 22503,
    "districtName": "Thành phố Cẩm Phả",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22503027",
    "wardName": "Phường Quang Hanh",
    "districtId": 22503,
    "districtName": "Thành phố Cẩm Phả",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22503028",
    "wardName": "Phường Cẩm Phả",
    "districtId": 22503,
    "districtName": "Thành phố Cẩm Phả",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22503029",
    "wardName": "Phường Cửa Ông",
    "districtId": 22503,
    "districtName": "Thành phố Cẩm Phả",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22503030",
    "wardName": "Xã Hải Hoà",
    "districtId": 22503,
    "districtName": "Thành phố Cẩm Phả",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22513031",
    "wardName": "Xã Tiên Yên",
    "districtId": 22513,
    "districtName": "Huyện Tiên Yên",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22513032",
    "wardName": "Xã Điền Xá",
    "districtId": 22513,
    "districtName": "Huyện Tiên Yên",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22513033",
    "wardName": "Xã Đông Ngũ",
    "districtId": 22513,
    "districtName": "Huyện Tiên Yên",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22513034",
    "wardName": "Xã Hải Lạng",
    "districtId": 22513,
    "districtName": "Huyện Tiên Yên",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22501035",
    "wardName": "Xã Lương Minh",
    "districtId": 22501,
    "districtName": "Thành phố Hạ Long",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22515036",
    "wardName": "Xã Kỳ Thượng",
    "districtId": 22515,
    "districtName": "Huyện Ba Chẽ",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22515037",
    "wardName": "Xã Ba Chẽ",
    "districtId": 22515,
    "districtName": "Huyện Ba Chẽ",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22527038",
    "wardName": "Xã Quảng Tân",
    "districtId": 22527,
    "districtName": "Huyện Đầm Hà",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22527039",
    "wardName": "Xã Đầm Hà",
    "districtId": 22527,
    "districtName": "Huyện Đầm Hà",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22511040",
    "wardName": "Xã Quảng Hà",
    "districtId": 22511,
    "districtName": "Huyện Hải Hà",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22511041",
    "wardName": "Xã Đường Hoa",
    "districtId": 22511,
    "districtName": "Huyện Hải Hà",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22511042",
    "wardName": "Xã Quảng Đức",
    "districtId": 22511,
    "districtName": "Huyện Hải Hà",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22507043",
    "wardName": "Xã Hoành Mô",
    "districtId": 22507,
    "districtName": "Huyện Bình Liêu",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22507044",
    "wardName": "Xã Lục Hồn",
    "districtId": 22507,
    "districtName": "Huyện Bình Liêu",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22507045",
    "wardName": "Xã Bình Liêu",
    "districtId": 22507,
    "districtName": "Huyện Bình Liêu",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22509046",
    "wardName": "Xã Hải Sơn",
    "districtId": 22509,
    "districtName": "Thành phố Móng Cái",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22509047",
    "wardName": "Xã Hải Ninh",
    "districtId": 22509,
    "districtName": "Thành phố Móng Cái",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22509048",
    "wardName": "Xã Vĩnh Thực",
    "districtId": 22509,
    "districtName": "Thành phố Móng Cái",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22509049",
    "wardName": "Phường Móng Cái 1",
    "districtId": 22509,
    "districtName": "Thành phố Móng Cái",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22509050",
    "wardName": "Phường Móng Cái 2",
    "districtId": 22509,
    "districtName": "Thành phố Móng Cái",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22509051",
    "wardName": "Phường Móng Cái 3",
    "districtId": 22509,
    "districtName": "Thành phố Móng Cái",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22517052",
    "wardName": "Đặc khu Vân Đồn",
    "districtId": 22517,
    "districtName": "Huyện Vân Đồn",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22523053",
    "wardName": "Đặc khu Cô Tô",
    "districtId": 22523,
    "districtName": "Huyện Cô Tô",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "22511054",
    "wardName": "Xã Cái Chiên",
    "districtId": 22511,
    "districtName": "Huyện Hải Hà",
    "provinceId": "03",
    "provinceName": "Tỉnh Quảng Ninh"
  },
  {
    "wardId": "10311001",
    "wardName": "Phường Thuỷ Nguyên",
    "districtId": 10311,
    "districtName": "Thành phố Thuỷ Nguyên",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10311002",
    "wardName": "Phường Thiên Hương",
    "districtId": 10311,
    "districtName": "Thành phố Thuỷ Nguyên",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10311003",
    "wardName": "Phường Hoà Bình",
    "districtId": 10311,
    "districtName": "Thành phố Thuỷ Nguyên",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10311004",
    "wardName": "Phường Nam Triệu",
    "districtId": 10311,
    "districtName": "Thành phố Thuỷ Nguyên",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10311005",
    "wardName": "Phường Bạch Đằng",
    "districtId": 10311,
    "districtName": "Thành phố Thuỷ Nguyên",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10311006",
    "wardName": "Phường Lưu Kiếm",
    "districtId": 10311,
    "districtName": "Thành phố Thuỷ Nguyên",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10311007",
    "wardName": "Phường Lê Ích Mộc",
    "districtId": 10311,
    "districtName": "Thành phố Thuỷ Nguyên",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10301008",
    "wardName": "Phường Hồng Bàng",
    "districtId": 10301,
    "districtName": "Quận Hồng Bàng",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10301009",
    "wardName": "Phường Hồng An",
    "districtId": 10301,
    "districtName": "Quận Hồng Bàng",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10303010",
    "wardName": "Phường Ngô Quyền",
    "districtId": 10303,
    "districtName": "Quận Ngô Quyền",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10303011",
    "wardName": "Phường Gia Viên",
    "districtId": 10303,
    "districtName": "Quận Ngô Quyền",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10305012",
    "wardName": "Phường Lê Chân",
    "districtId": 10305,
    "districtName": "Quận Lê Chân",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10305013",
    "wardName": "Phường An Biên",
    "districtId": 10305,
    "districtName": "Quận Lê Chân",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10304014",
    "wardName": "Phường Hải An",
    "districtId": 10304,
    "districtName": "Quận Hải An",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10304015",
    "wardName": "Phường Đông Hải",
    "districtId": 10304,
    "districtName": "Quận Hải An",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10307016",
    "wardName": "Phường Kiến An",
    "districtId": 10307,
    "districtName": "Quận Kiến An",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10307017",
    "wardName": "Phường Phù Liễn",
    "districtId": 10307,
    "districtName": "Quận Kiến An",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10309018",
    "wardName": "Phường Nam Đồ Sơn",
    "districtId": 10309,
    "districtName": "Quận Đồ Sơn",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10309019",
    "wardName": "Phường Đồ Sơn",
    "districtId": 10309,
    "districtName": "Quận Đồ Sơn",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10327020",
    "wardName": "Phường Hưng Đạo",
    "districtId": 10327,
    "districtName": "Quận Dương Kinh",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10327021",
    "wardName": "Phường Dương Kinh",
    "districtId": 10327,
    "districtName": "Quận Dương Kinh",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10313022",
    "wardName": "Phường An Dương",
    "districtId": 10313,
    "districtName": "Quận An Dương",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10313023",
    "wardName": "Phường An Hải",
    "districtId": 10313,
    "districtName": "Quận An Dương",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10313024",
    "wardName": "Phường An Phong",
    "districtId": 10313,
    "districtName": "Quận An Dương",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10315025",
    "wardName": "Xã An Hưng",
    "districtId": 10315,
    "districtName": "Huyện An Lão",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10315026",
    "wardName": "Xã An Khánh",
    "districtId": 10315,
    "districtName": "Huyện An Lão",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10315027",
    "wardName": "Xã An Quang",
    "districtId": 10315,
    "districtName": "Huyện An Lão",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10315028",
    "wardName": "Xã An Trường",
    "districtId": 10315,
    "districtName": "Huyện An Lão",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10315029",
    "wardName": "Xã An Lão",
    "districtId": 10315,
    "districtName": "Huyện An Lão",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10317030",
    "wardName": "Xã Kiến Thụy",
    "districtId": 10317,
    "districtName": "Huyện Kiến Thụy",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10317031",
    "wardName": "Xã Kiến Minh",
    "districtId": 10317,
    "districtName": "Huyện Kiến Thụy",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10317032",
    "wardName": "Xã Kiến Hải",
    "districtId": 10317,
    "districtName": "Huyện Kiến Thụy",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10317033",
    "wardName": "Xã Kiến Hưng",
    "districtId": 10317,
    "districtName": "Huyện Kiến Thụy",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10317034",
    "wardName": "Xã Nghi Dương",
    "districtId": 10317,
    "districtName": "Huyện Kiến Thụy",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10319035",
    "wardName": "Xã Quyết Thắng",
    "districtId": 10319,
    "districtName": "Huyện Tiên Lãng",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10319036",
    "wardName": "Xã Tiên Lãng",
    "districtId": 10319,
    "districtName": "Huyện Tiên Lãng",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10319037",
    "wardName": "Xã Tân Minh",
    "districtId": 10319,
    "districtName": "Huyện Tiên Lãng",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10319038",
    "wardName": "Xã Tiên Minh",
    "districtId": 10319,
    "districtName": "Huyện Tiên Lãng",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10319039",
    "wardName": "Xã Chấn Hưng",
    "districtId": 10319,
    "districtName": "Huyện Tiên Lãng",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10319040",
    "wardName": "Xã Hùng Thắng",
    "districtId": 10319,
    "districtName": "Huyện Tiên Lãng",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10321041",
    "wardName": "Xã Vĩnh Bảo",
    "districtId": 10321,
    "districtName": "Huyện Vĩnh Bảo",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10321042",
    "wardName": "Xã Nguyễn Bỉnh Khiêm",
    "districtId": 10321,
    "districtName": "Huyện Vĩnh Bảo",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10321043",
    "wardName": "Xã Vĩnh Am",
    "districtId": 10321,
    "districtName": "Huyện Vĩnh Bảo",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10321044",
    "wardName": "Xã Vĩnh Hải",
    "districtId": 10321,
    "districtName": "Huyện Vĩnh Bảo",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10321045",
    "wardName": "Xã Vĩnh Hoà",
    "districtId": 10321,
    "districtName": "Huyện Vĩnh Bảo",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10321046",
    "wardName": "Xã Vĩnh Thịnh",
    "districtId": 10321,
    "districtName": "Huyện Vĩnh Bảo",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10321047",
    "wardName": "Xã Vĩnh Thuận",
    "districtId": 10321,
    "districtName": "Huyện Vĩnh Bảo",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10311048",
    "wardName": "Xã Việt Khê",
    "districtId": 10311,
    "districtName": "Thành phố Thuỷ Nguyên",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10323049",
    "wardName": "Đặc khu Cát Hải",
    "districtId": 10323,
    "districtName": "Huyện Cát Hải",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10325050",
    "wardName": "Đặc khu Bạch Long Vĩ",
    "districtId": 10325,
    "districtName": "Huyện Bạch Long Vĩ",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10701051",
    "wardName": "Phường Hải Dương",
    "districtId": 10701,
    "districtName": "Thành phố Hải Dương",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10701052",
    "wardName": "Phường Lê Thanh Nghị",
    "districtId": 10701,
    "districtName": "Thành phố Hải Dương",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10701053",
    "wardName": "Phường Việt Hoà",
    "districtId": 10701,
    "districtName": "Thành phố Hải Dương",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10701054",
    "wardName": "Phường Thành Đông",
    "districtId": 10701,
    "districtName": "Thành phố Hải Dương",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10701055",
    "wardName": "Phường Nam Đồng",
    "districtId": 10701,
    "districtName": "Thành phố Hải Dương",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10701056",
    "wardName": "Phường Tân Hưng",
    "districtId": 10701,
    "districtName": "Thành phố Hải Dương",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10701057",
    "wardName": "Phường Thạch Khôi",
    "districtId": 10701,
    "districtName": "Thành phố Hải Dương",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10717058",
    "wardName": "Phường Tứ Minh",
    "districtId": 10717,
    "districtName": "Huyện Cẩm Giàng",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10701059",
    "wardName": "Phường Ái Quốc",
    "districtId": 10701,
    "districtName": "Thành phố Hải Dương",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10703060",
    "wardName": "Phường Chu Văn An",
    "districtId": 10703,
    "districtName": "Thành phố Chí Linh",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10703061",
    "wardName": "Phường Chí Linh",
    "districtId": 10703,
    "districtName": "Thành phố Chí Linh",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10703062",
    "wardName": "Phường Trần Hưng Đạo",
    "districtId": 10703,
    "districtName": "Thành phố Chí Linh",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10703063",
    "wardName": "Phường Nguyễn Trãi",
    "districtId": 10703,
    "districtName": "Thành phố Chí Linh",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10703064",
    "wardName": "Phường Trần Nhân Tông",
    "districtId": 10703,
    "districtName": "Thành phố Chí Linh",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10703065",
    "wardName": "Phường Lê Đại Hành",
    "districtId": 10703,
    "districtName": "Thành phố Chí Linh",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10709066",
    "wardName": "Phường Kinh Môn",
    "districtId": 10709,
    "districtName": "Thị xã Kinh Môn",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10709067",
    "wardName": "Phường Nguyễn Đại Năng",
    "districtId": 10709,
    "districtName": "Thị xã Kinh Môn",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10709068",
    "wardName": "Phường Trần Liễu",
    "districtId": 10709,
    "districtName": "Thị xã Kinh Môn",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10709069",
    "wardName": "Phường Bắc An Phụ",
    "districtId": 10709,
    "districtName": "Thị xã Kinh Môn",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10709070",
    "wardName": "Phường Phạm Sư Mạnh",
    "districtId": 10709,
    "districtName": "Thị xã Kinh Môn",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10709071",
    "wardName": "Phường Nhị Chiểu",
    "districtId": 10709,
    "districtName": "Thị xã Kinh Môn",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10709072",
    "wardName": "Xã Nam An Phụ",
    "districtId": 10709,
    "districtName": "Thị xã Kinh Môn",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10705073",
    "wardName": "Xã Nam Sách",
    "districtId": 10705,
    "districtName": "Huyện Nam Sách",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10705074",
    "wardName": "Xã Thái Tân",
    "districtId": 10705,
    "districtName": "Huyện Nam Sách",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10705075",
    "wardName": "Xã Hợp Tiến",
    "districtId": 10705,
    "districtName": "Huyện Nam Sách",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10705076",
    "wardName": "Xã Trần Phú",
    "districtId": 10705,
    "districtName": "Huyện Nam Sách",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10705077",
    "wardName": "Xã An Phú",
    "districtId": 10705,
    "districtName": "Huyện Nam Sách",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10707078",
    "wardName": "Xã Thanh Hà",
    "districtId": 10707,
    "districtName": "Huyện Thanh Hà",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10707079",
    "wardName": "Xã Hà Tây",
    "districtId": 10707,
    "districtName": "Huyện Thanh Hà",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10707080",
    "wardName": "Xã Hà Bắc",
    "districtId": 10707,
    "districtName": "Huyện Thanh Hà",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10707081",
    "wardName": "Xã Hà Nam",
    "districtId": 10707,
    "districtName": "Huyện Thanh Hà",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10707082",
    "wardName": "Xã Hà Đông",
    "districtId": 10707,
    "districtName": "Huyện Thanh Hà",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10717083",
    "wardName": "Xã Cẩm Giang",
    "districtId": 10717,
    "districtName": "Huyện Cẩm Giàng",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10717084",
    "wardName": "Xã Tuệ Tĩnh",
    "districtId": 10717,
    "districtName": "Huyện Cẩm Giàng",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10717085",
    "wardName": "Xã Mao Điền",
    "districtId": 10717,
    "districtName": "Huyện Cẩm Giàng",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10717086",
    "wardName": "Xã Cẩm Giàng",
    "districtId": 10717,
    "districtName": "Huyện Cẩm Giàng",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10719087",
    "wardName": "Xã Kẻ Sặt",
    "districtId": 10719,
    "districtName": "Huyện Bình Giang",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10719088",
    "wardName": "Xã Bình Giang",
    "districtId": 10719,
    "districtName": "Huyện Bình Giang",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10719089",
    "wardName": "Xã Đường An",
    "districtId": 10719,
    "districtName": "Huyện Bình Giang",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10719090",
    "wardName": "Xã Thượng Hồng",
    "districtId": 10719,
    "districtName": "Huyện Bình Giang",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10713091",
    "wardName": "Xã Gia Lộc",
    "districtId": 10713,
    "districtName": "Huyện Gia Lộc",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10713092",
    "wardName": "Xã Yết Kiêu",
    "districtId": 10713,
    "districtName": "Huyện Gia Lộc",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10713093",
    "wardName": "Xã Gia Phúc",
    "districtId": 10713,
    "districtName": "Huyện Gia Lộc",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10713094",
    "wardName": "Xã Trường Tân",
    "districtId": 10713,
    "districtName": "Huyện Gia Lộc",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10715095",
    "wardName": "Xã Tứ Kỳ",
    "districtId": 10715,
    "districtName": "Huyện Tứ Kỳ",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10715096",
    "wardName": "Xã Tân Kỳ",
    "districtId": 10715,
    "districtName": "Huyện Tứ Kỳ",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10715097",
    "wardName": "Xã Đại Sơn",
    "districtId": 10715,
    "districtName": "Huyện Tứ Kỳ",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10715098",
    "wardName": "Xã Chí Minh",
    "districtId": 10715,
    "districtName": "Huyện Tứ Kỳ",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10715099",
    "wardName": "Xã Lạc Phượng",
    "districtId": 10715,
    "districtName": "Huyện Tứ Kỳ",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10715100",
    "wardName": "Xã Nguyên Giáp",
    "districtId": 10715,
    "districtName": "Huyện Tứ Kỳ",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10723101",
    "wardName": "Xã Ninh Giang",
    "districtId": 10723,
    "districtName": "Huyện Ninh Giang",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10723102",
    "wardName": "Xã Vĩnh Lại",
    "districtId": 10723,
    "districtName": "Huyện Ninh Giang",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10723103",
    "wardName": "Xã Khúc Thừa Dụ",
    "districtId": 10723,
    "districtName": "Huyện Ninh Giang",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10723104",
    "wardName": "Xã Tân An",
    "districtId": 10723,
    "districtName": "Huyện Ninh Giang",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10723105",
    "wardName": "Xã Hồng Châu",
    "districtId": 10723,
    "districtName": "Huyện Ninh Giang",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10721106",
    "wardName": "Xã Thanh Miện",
    "districtId": 10721,
    "districtName": "Huyện Thanh Miện",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10721107",
    "wardName": "Xã Bắc Thanh Miện",
    "districtId": 10721,
    "districtName": "Huyện Thanh Miện",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10721108",
    "wardName": "Xã Hải Hưng",
    "districtId": 10721,
    "districtName": "Huyện Thanh Miện",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10721109",
    "wardName": "Xã Nguyễn Lương Bằng",
    "districtId": 10721,
    "districtName": "Huyện Thanh Miện",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10721110",
    "wardName": "Xã Nam Thanh Miện",
    "districtId": 10721,
    "districtName": "Huyện Thanh Miện",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10711111",
    "wardName": "Xã Phú Thái",
    "districtId": 10711,
    "districtName": "Huyện Kim Thành",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10711112",
    "wardName": "Xã Lai Khê",
    "districtId": 10711,
    "districtName": "Huyện Kim Thành",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10711113",
    "wardName": "Xã An Thành",
    "districtId": 10711,
    "districtName": "Huyện Kim Thành",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10711114",
    "wardName": "Xã Kim Thành",
    "districtId": 10711,
    "districtName": "Huyện Kim Thành",
    "provinceId": "04",
    "provinceName": "Tp Hải Phòng"
  },
  {
    "wardId": "10901001",
    "wardName": "Phường Phố Hiến",
    "districtId": 10901,
    "districtName": "Thành phố Hưng Yên",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10901002",
    "wardName": "Phường Sơn Nam",
    "districtId": 10901,
    "districtName": "Thành phố Hưng Yên",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10901003",
    "wardName": "Phường Hồng Châu",
    "districtId": 10901,
    "districtName": "Thành phố Hưng Yên",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10903004",
    "wardName": "Phường Mỹ Hào",
    "districtId": 10903,
    "districtName": "Thị xã Mỹ Hào",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10903005",
    "wardName": "Phường Đường Hào",
    "districtId": 10903,
    "districtName": "Thị xã Mỹ Hào",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10903006",
    "wardName": "Phường Thượng Hồng",
    "districtId": 10903,
    "districtName": "Thị xã Mỹ Hào",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10901007",
    "wardName": "Xã Tân Hưng",
    "districtId": 10901,
    "districtName": "Thành phố Hưng Yên",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10913008",
    "wardName": "Xã Hoàng Hoa Thám",
    "districtId": 10913,
    "districtName": "Huyện Tiên Lữ",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10913009",
    "wardName": "Xã Tiên Lữ",
    "districtId": 10913,
    "districtName": "Huyện Tiên Lữ",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10913010",
    "wardName": "Xã Tiên Hoa",
    "districtId": 10913,
    "districtName": "Huyện Tiên Lữ",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10911011",
    "wardName": "Xã Quang Hưng",
    "districtId": 10911,
    "districtName": "Huyện Phù Cừ",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10911012",
    "wardName": "Xã Đoàn Đào",
    "districtId": 10911,
    "districtName": "Huyện Phù Cừ",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10911013",
    "wardName": "Xã Tiên Tiến",
    "districtId": 10911,
    "districtName": "Huyện Phù Cừ",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10911014",
    "wardName": "Xã Tống Trân",
    "districtId": 10911,
    "districtName": "Huyện Phù Cừ",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10909015",
    "wardName": "Xã Lương Bằng",
    "districtId": 10909,
    "districtName": "Huyện Kim Động",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10909016",
    "wardName": "Xã Nghĩa Dân",
    "districtId": 10909,
    "districtName": "Huyện Kim Động",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10909017",
    "wardName": "Xã Hiệp Cường",
    "districtId": 10909,
    "districtName": "Huyện Kim Động",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10909018",
    "wardName": "Xã Đức Hợp",
    "districtId": 10909,
    "districtName": "Huyện Kim Động",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10907019",
    "wardName": "Xã Ân Thi",
    "districtId": 10907,
    "districtName": "Huyện Ân Thi",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10907020",
    "wardName": "Xã Xuân Trúc",
    "districtId": 10907,
    "districtName": "Huyện Ân Thi",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10907021",
    "wardName": "Xã Phạm Ngũ Lão",
    "districtId": 10907,
    "districtName": "Huyện Ân Thi",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10907022",
    "wardName": "Xã Nguyễn Trãi",
    "districtId": 10907,
    "districtName": "Huyện Ân Thi",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10907023",
    "wardName": "Xã Hồng Quang",
    "districtId": 10907,
    "districtName": "Huyện Ân Thi",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10905024",
    "wardName": "Xã Khoái Châu",
    "districtId": 10905,
    "districtName": "Huyện Khoái Châu",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10905025",
    "wardName": "Xã Triệu Việt Vương",
    "districtId": 10905,
    "districtName": "Huyện Khoái Châu",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10905026",
    "wardName": "Xã Việt Tiến",
    "districtId": 10905,
    "districtName": "Huyện Khoái Châu",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10905027",
    "wardName": "Xã Chí Minh",
    "districtId": 10905,
    "districtName": "Huyện Khoái Châu",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10905028",
    "wardName": "Xã Châu Ninh",
    "districtId": 10905,
    "districtName": "Huyện Khoái Châu",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10919029",
    "wardName": "Xã Yên Mỹ",
    "districtId": 10919,
    "districtName": "Huyện Yên Mỹ",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10919030",
    "wardName": "Xã Việt Yên",
    "districtId": 10919,
    "districtName": "Huyện Yên Mỹ",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10919031",
    "wardName": "Xã Hoàn Long",
    "districtId": 10919,
    "districtName": "Huyện Yên Mỹ",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10919032",
    "wardName": "Xã Nguyễn Văn Linh",
    "districtId": 10919,
    "districtName": "Huyện Yên Mỹ",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10917033",
    "wardName": "Xã Như Quỳnh",
    "districtId": 10917,
    "districtName": "Huyện Văn Lâm",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10917034",
    "wardName": "Xã Lạc Đạo",
    "districtId": 10917,
    "districtName": "Huyện Văn Lâm",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10917035",
    "wardName": "Xã Đại Đồng",
    "districtId": 10917,
    "districtName": "Huyện Văn Lâm",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10915036",
    "wardName": "Xã Nghĩa Trụ",
    "districtId": 10915,
    "districtName": "Huyện Văn Giang",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10915037",
    "wardName": "Xã Phụng Công",
    "districtId": 10915,
    "districtName": "Huyện Văn Giang",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10915038",
    "wardName": "Xã Văn Giang",
    "districtId": 10915,
    "districtName": "Huyện Văn Giang",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "10915039",
    "wardName": "Xã Mễ Sở",
    "districtId": 10915,
    "districtName": "Huyện Văn Giang",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11501040",
    "wardName": "Phường Thái Bình",
    "districtId": 11501,
    "districtName": "Thành phố Thái Bình",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11501041",
    "wardName": "Phường Trần Lãm",
    "districtId": 11501,
    "districtName": "Thành phố Thái Bình",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11501042",
    "wardName": "Phường Trần Hưng Đạo",
    "districtId": 11501,
    "districtName": "Thành phố Thái Bình",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11501043",
    "wardName": "Phường Trà Lý",
    "districtId": 11501,
    "districtName": "Thành phố Thái Bình",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11501044",
    "wardName": "Phường Vũ Phúc",
    "districtId": 11501,
    "districtName": "Thành phố Thái Bình",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11507045",
    "wardName": "Xã Thái Thụy",
    "districtId": 11507,
    "districtName": "Huyện Thái Thụy",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11507046",
    "wardName": "Xã Đông Thụy Anh",
    "districtId": 11507,
    "districtName": "Huyện Thái Thụy",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11507047",
    "wardName": "Xã Bắc Thụy Anh",
    "districtId": 11507,
    "districtName": "Huyện Thái Thụy",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11507048",
    "wardName": "Xã Thụy Anh",
    "districtId": 11507,
    "districtName": "Huyện Thái Thụy",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11507049",
    "wardName": "Xã Nam Thụy Anh",
    "districtId": 11507,
    "districtName": "Huyện Thái Thụy",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11507050",
    "wardName": "Xã Bắc Thái Ninh",
    "districtId": 11507,
    "districtName": "Huyện Thái Thụy",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11507051",
    "wardName": "Xã Thái Ninh",
    "districtId": 11507,
    "districtName": "Huyện Thái Thụy",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11507052",
    "wardName": "Xã Đông Thái Ninh",
    "districtId": 11507,
    "districtName": "Huyện Thái Thụy",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11507053",
    "wardName": "Xã Nam Thái Ninh",
    "districtId": 11507,
    "districtName": "Huyện Thái Thụy",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11507054",
    "wardName": "Xã Tây Thái Ninh",
    "districtId": 11507,
    "districtName": "Huyện Thái Thụy",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11507055",
    "wardName": "Xã Tây Thụy Anh",
    "districtId": 11507,
    "districtName": "Huyện Thái Thụy",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11515056",
    "wardName": "Xã Tiền Hải",
    "districtId": 11515,
    "districtName": "Huyện Tiền Hải",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11515057",
    "wardName": "Xã Tây Tiền Hải",
    "districtId": 11515,
    "districtName": "Huyện Tiền Hải",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11515058",
    "wardName": "Xã Ái Quốc",
    "districtId": 11515,
    "districtName": "Huyện Tiền Hải",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11515059",
    "wardName": "Xã Đồng Châu",
    "districtId": 11515,
    "districtName": "Huyện Tiền Hải",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11515060",
    "wardName": "Xã Đông Tiền Hải",
    "districtId": 11515,
    "districtName": "Huyện Tiền Hải",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11515061",
    "wardName": "Xã Nam Cường",
    "districtId": 11515,
    "districtName": "Huyện Tiền Hải",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11515062",
    "wardName": "Xã Hưng Phú",
    "districtId": 11515,
    "districtName": "Huyện Tiền Hải",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11515063",
    "wardName": "Xã Nam Tiền Hải",
    "districtId": 11515,
    "districtName": "Huyện Tiền Hải",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11503064",
    "wardName": "Xã Quỳnh Phụ",
    "districtId": 11503,
    "districtName": "Huyện Quỳnh Phụ",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11503065",
    "wardName": "Xã Minh Thọ",
    "districtId": 11503,
    "districtName": "Huyện Quỳnh Phụ",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11503066",
    "wardName": "Xã Nguyễn Du",
    "districtId": 11503,
    "districtName": "Huyện Quỳnh Phụ",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11503067",
    "wardName": "Xã Quỳnh An",
    "districtId": 11503,
    "districtName": "Huyện Quỳnh Phụ",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11503068",
    "wardName": "Xã Ngọc Lâm",
    "districtId": 11503,
    "districtName": "Huyện Quỳnh Phụ",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11503069",
    "wardName": "Xã Đồng Bằng",
    "districtId": 11503,
    "districtName": "Huyện Quỳnh Phụ",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11503070",
    "wardName": "Xã A Sào",
    "districtId": 11503,
    "districtName": "Huyện Quỳnh Phụ",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11503071",
    "wardName": "Xã Phụ Dực",
    "districtId": 11503,
    "districtName": "Huyện Quỳnh Phụ",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11503072",
    "wardName": "Xã Tân Tiến",
    "districtId": 11503,
    "districtName": "Huyện Quỳnh Phụ",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11505073",
    "wardName": "Xã Hưng Hà",
    "districtId": 11505,
    "districtName": "Huyện Hưng Hà",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11505074",
    "wardName": "Xã Tiên La",
    "districtId": 11505,
    "districtName": "Huyện Hưng Hà",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11505075",
    "wardName": "Xã Lê Quý Đôn",
    "districtId": 11505,
    "districtName": "Huyện Hưng Hà",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11505076",
    "wardName": "Xã Hồng Minh",
    "districtId": 11505,
    "districtName": "Huyện Hưng Hà",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11505077",
    "wardName": "Xã Thần Khê",
    "districtId": 11505,
    "districtName": "Huyện Hưng Hà",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11505078",
    "wardName": "Xã Diên Hà",
    "districtId": 11505,
    "districtName": "Huyện Hưng Hà",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11505079",
    "wardName": "Xã Ngự Thiên",
    "districtId": 11505,
    "districtName": "Huyện Hưng Hà",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11505080",
    "wardName": "Xã Long Hưng",
    "districtId": 11505,
    "districtName": "Huyện Hưng Hà",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11509081",
    "wardName": "Xã Đông Hưng",
    "districtId": 11509,
    "districtName": "Huyện Đông Hưng",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11509082",
    "wardName": "Xã Bắc Tiên Hưng",
    "districtId": 11509,
    "districtName": "Huyện Đông Hưng",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11509083",
    "wardName": "Xã Đông Tiên Hưng",
    "districtId": 11509,
    "districtName": "Huyện Đông Hưng",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11509084",
    "wardName": "Xã Nam Đông Hưng",
    "districtId": 11509,
    "districtName": "Huyện Đông Hưng",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11509085",
    "wardName": "Xã Bắc Đông Quan",
    "districtId": 11509,
    "districtName": "Huyện Đông Hưng",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11509086",
    "wardName": "Xã Bắc Đông Hưng",
    "districtId": 11509,
    "districtName": "Huyện Đông Hưng",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11509087",
    "wardName": "Xã Đông Quan",
    "districtId": 11509,
    "districtName": "Huyện Đông Hưng",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11509088",
    "wardName": "Xã Nam Tiên Hưng",
    "districtId": 11509,
    "districtName": "Huyện Đông Hưng",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11509089",
    "wardName": "Xã Tiên Hưng",
    "districtId": 11509,
    "districtName": "Huyện Đông Hưng",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11513090",
    "wardName": "Xã Lê Lợi",
    "districtId": 11513,
    "districtName": "Huyện Kiến Xương",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11513091",
    "wardName": "Xã Kiến Xương",
    "districtId": 11513,
    "districtName": "Huyện Kiến Xương",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11513092",
    "wardName": "Xã Quang Lịch",
    "districtId": 11513,
    "districtName": "Huyện Kiến Xương",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11513093",
    "wardName": "Xã Vũ Quý",
    "districtId": 11513,
    "districtName": "Huyện Kiến Xương",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11513094",
    "wardName": "Xã Bình Thanh",
    "districtId": 11513,
    "districtName": "Huyện Kiến Xương",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11513095",
    "wardName": "Xã Bình Định",
    "districtId": 11513,
    "districtName": "Huyện Kiến Xương",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11513096",
    "wardName": "Xã Hồng Vũ",
    "districtId": 11513,
    "districtName": "Huyện Kiến Xương",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11513097",
    "wardName": "Xã Bình Nguyên",
    "districtId": 11513,
    "districtName": "Huyện Kiến Xương",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11513098",
    "wardName": "Xã Trà Giang",
    "districtId": 11513,
    "districtName": "Huyện Kiến Xương",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11511099",
    "wardName": "Xã Vũ Thư",
    "districtId": 11511,
    "districtName": "Huyện Vũ Thư",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11511100",
    "wardName": "Xã Thư Trì",
    "districtId": 11511,
    "districtName": "Huyện Vũ Thư",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11511101",
    "wardName": "Xã Tân Thuận",
    "districtId": 11511,
    "districtName": "Huyện Vũ Thư",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11511102",
    "wardName": "Xã Thư Vũ",
    "districtId": 11511,
    "districtName": "Huyện Vũ Thư",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11511103",
    "wardName": "Xã Vũ Tiên",
    "districtId": 11511,
    "districtName": "Huyện Vũ Thư",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11511104",
    "wardName": "Xã Vạn Xuân",
    "districtId": 11511,
    "districtName": "Huyện Vũ Thư",
    "provinceId": "05",
    "provinceName": "Tỉnh Hưng Yên"
  },
  {
    "wardId": "11707001",
    "wardName": "Xã Gia Viễn",
    "districtId": 11707,
    "districtName": "Huyện Gia Viễn",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11707002",
    "wardName": "Xã Đại Hoàng",
    "districtId": 11707,
    "districtName": "Huyện Gia Viễn",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11707003",
    "wardName": "Xã Gia Hưng",
    "districtId": 11707,
    "districtName": "Huyện Gia Viễn",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11707004",
    "wardName": "Xã Gia Phong",
    "districtId": 11707,
    "districtName": "Huyện Gia Viễn",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11707005",
    "wardName": "Xã Gia Vân",
    "districtId": 11707,
    "districtName": "Huyện Gia Viễn",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11707006",
    "wardName": "Xã Gia Trấn",
    "districtId": 11707,
    "districtName": "Huyện Gia Viễn",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11705007",
    "wardName": "Xã Nho Quan",
    "districtId": 11705,
    "districtName": "Huyện Nho quan",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11705008",
    "wardName": "Xã Gia Lâm",
    "districtId": 11705,
    "districtName": "Huyện Nho quan",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11705009",
    "wardName": "Xã Gia Tường",
    "districtId": 11705,
    "districtName": "Huyện Nho quan",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11705010",
    "wardName": "Xã Phú Sơn",
    "districtId": 11705,
    "districtName": "Huyện Nho quan",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11705011",
    "wardName": "Xã Cúc Phương",
    "districtId": 11705,
    "districtName": "Huyện Nho quan",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11705012",
    "wardName": "Xã Phú Long",
    "districtId": 11705,
    "districtName": "Huyện Nho quan",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11705013",
    "wardName": "Xã Thanh Sơn",
    "districtId": 11705,
    "districtName": "Huyện Nho quan",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11705014",
    "wardName": "Xã Quỳnh Lưu",
    "districtId": 11705,
    "districtName": "Huyện Nho quan",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11713015",
    "wardName": "Xã Yên Khánh",
    "districtId": 11713,
    "districtName": "Huyện Yên Khánh",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11713016",
    "wardName": "Xã Khánh Nhạc",
    "districtId": 11713,
    "districtName": "Huyện Yên Khánh",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11713017",
    "wardName": "Xã Khánh Thiện",
    "districtId": 11713,
    "districtName": "Huyện Yên Khánh",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11713018",
    "wardName": "Xã Khánh Hội",
    "districtId": 11713,
    "districtName": "Huyện Yên Khánh",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11713019",
    "wardName": "Xã Khánh Trung",
    "districtId": 11713,
    "districtName": "Huyện Yên Khánh",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11711020",
    "wardName": "Xã Yên Mô",
    "districtId": 11711,
    "districtName": "Huyện Yên Mô",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11711021",
    "wardName": "Xã Yên Từ",
    "districtId": 11711,
    "districtName": "Huyện Yên Mô",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11711022",
    "wardName": "Xã Yên Mạc",
    "districtId": 11711,
    "districtName": "Huyện Yên Mô",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11711023",
    "wardName": "Xã Đồng Thái",
    "districtId": 11711,
    "districtName": "Huyện Yên Mô",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11715024",
    "wardName": "Xã Chất Bình",
    "districtId": 11715,
    "districtName": "Huyện Kim Sơn",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11715025",
    "wardName": "Xã Kim Sơn",
    "districtId": 11715,
    "districtName": "Huyện Kim Sơn",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11715026",
    "wardName": "Xã Quang Thiện",
    "districtId": 11715,
    "districtName": "Huyện Kim Sơn",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11715027",
    "wardName": "Xã Phát Diệm",
    "districtId": 11715,
    "districtName": "Huyện Kim Sơn",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11715028",
    "wardName": "Xã Lai Thành",
    "districtId": 11715,
    "districtName": "Huyện Kim Sơn",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11715029",
    "wardName": "Xã Định Hóa",
    "districtId": 11715,
    "districtName": "Huyện Kim Sơn",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11715030",
    "wardName": "Xã Bình Minh",
    "districtId": 11715,
    "districtName": "Huyện Kim Sơn",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11715031",
    "wardName": "Xã Kim Đông",
    "districtId": 11715,
    "districtName": "Huyện Kim Sơn",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11111032",
    "wardName": "Xã Bình Lục",
    "districtId": 11111,
    "districtName": "Huyện Bình Lục",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11111033",
    "wardName": "Xã Bình Mỹ",
    "districtId": 11111,
    "districtName": "Huyện Bình Lục",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11111034",
    "wardName": "Xã Bình An",
    "districtId": 11111,
    "districtName": "Huyện Bình Lục",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11111035",
    "wardName": "Xã Bình Giang",
    "districtId": 11111,
    "districtName": "Huyện Bình Lục",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11111036",
    "wardName": "Xã Bình Sơn",
    "districtId": 11111,
    "districtName": "Huyện Bình Lục",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11109037",
    "wardName": "Xã Liêm Hà",
    "districtId": 11109,
    "districtName": "Huyện Thanh Liêm",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11109038",
    "wardName": "Xã Tân Thanh",
    "districtId": 11109,
    "districtName": "Huyện Thanh Liêm",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11109039",
    "wardName": "Xã Thanh Bình",
    "districtId": 11109,
    "districtName": "Huyện Thanh Liêm",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11109040",
    "wardName": "Xã Thanh Lâm",
    "districtId": 11109,
    "districtName": "Huyện Thanh Liêm",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11109041",
    "wardName": "Xã Thanh Liêm",
    "districtId": 11109,
    "districtName": "Huyện Thanh Liêm",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11107042",
    "wardName": "Xã Lý Nhân",
    "districtId": 11107,
    "districtName": "Huyện Lý Nhân",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11107043",
    "wardName": "Xã Nam Xang",
    "districtId": 11107,
    "districtName": "Huyện Lý Nhân",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11107044",
    "wardName": "Xã Bắc Lý",
    "districtId": 11107,
    "districtName": "Huyện Lý Nhân",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11107045",
    "wardName": "Xã Vĩnh Trụ",
    "districtId": 11107,
    "districtName": "Huyện Lý Nhân",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11107046",
    "wardName": "Xã Trần Thương",
    "districtId": 11107,
    "districtName": "Huyện Lý Nhân",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11107047",
    "wardName": "Xã Nhân Hà",
    "districtId": 11107,
    "districtName": "Huyện Lý Nhân",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11107048",
    "wardName": "Xã Nam Lý",
    "districtId": 11107,
    "districtName": "Huyện Lý Nhân",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11309049",
    "wardName": "Xã Nam Trực",
    "districtId": 11309,
    "districtName": "Huyện Nam Trực",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11309050",
    "wardName": "Xã Nam Minh",
    "districtId": 11309,
    "districtName": "Huyện Nam Trực",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11309051",
    "wardName": "Xã Nam Đồng",
    "districtId": 11309,
    "districtName": "Huyện Nam Trực",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11309052",
    "wardName": "Xã Nam Ninh",
    "districtId": 11309,
    "districtName": "Huyện Nam Trực",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11309053",
    "wardName": "Xã Nam Hồng",
    "districtId": 11309,
    "districtName": "Huyện Nam Trực",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11303054",
    "wardName": "Xã Minh Tân",
    "districtId": 11303,
    "districtName": "Huyện Vụ Bản",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11303055",
    "wardName": "Xã Hiển Khánh",
    "districtId": 11303,
    "districtName": "Huyện Vụ Bản",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11303056",
    "wardName": "Xã Vụ Bản",
    "districtId": 11303,
    "districtName": "Huyện Vụ Bản",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11303057",
    "wardName": "Xã Liên Minh",
    "districtId": 11303,
    "districtName": "Huyện Vụ Bản",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11307058",
    "wardName": "Xã Ý Yên",
    "districtId": 11307,
    "districtName": "Huyện Ý Yên",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11307059",
    "wardName": "Xã Yên Đồng",
    "districtId": 11307,
    "districtName": "Huyện Ý Yên",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11307060",
    "wardName": "Xã Yên Cường",
    "districtId": 11307,
    "districtName": "Huyện Ý Yên",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11307061",
    "wardName": "Xã Vạn Thắng",
    "districtId": 11307,
    "districtName": "Huyện Ý Yên",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11307062",
    "wardName": "Xã Vũ Dương",
    "districtId": 11307,
    "districtName": "Huyện Ý Yên",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11307063",
    "wardName": "Xã Tân Minh",
    "districtId": 11307,
    "districtName": "Huyện Ý Yên",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11307064",
    "wardName": "Xã Phong Doanh",
    "districtId": 11307,
    "districtName": "Huyện Ý Yên",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11311065",
    "wardName": "Xã Cổ Lễ",
    "districtId": 11311,
    "districtName": "Huyện Trực Ninh",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11311066",
    "wardName": "Xã Ninh Giang",
    "districtId": 11311,
    "districtName": "Huyện Trực Ninh",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11311067",
    "wardName": "Xã Cát Thành",
    "districtId": 11311,
    "districtName": "Huyện Trực Ninh",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11311068",
    "wardName": "Xã Trực Ninh",
    "districtId": 11311,
    "districtName": "Huyện Trực Ninh",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11311069",
    "wardName": "Xã Quang Hưng",
    "districtId": 11311,
    "districtName": "Huyện Trực Ninh",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11311070",
    "wardName": "Xã Minh Thái",
    "districtId": 11311,
    "districtName": "Huyện Trực Ninh",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11311071",
    "wardName": "Xã Ninh Cường",
    "districtId": 11311,
    "districtName": "Huyện Trực Ninh",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11313072",
    "wardName": "Xã Xuân Trường",
    "districtId": 11313,
    "districtName": "Huyện Xuân Trường",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11313073",
    "wardName": "Xã Xuân Hưng",
    "districtId": 11313,
    "districtName": "Huyện Xuân Trường",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11313074",
    "wardName": "Xã Xuân Giang",
    "districtId": 11313,
    "districtName": "Huyện Xuân Trường",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11313075",
    "wardName": "Xã Xuân Hồng",
    "districtId": 11313,
    "districtName": "Huyện Xuân Trường",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11319076",
    "wardName": "Xã Hải Hậu",
    "districtId": 11319,
    "districtName": "Huyện Hải Hậu",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11319077",
    "wardName": "Xã Hải Anh",
    "districtId": 11319,
    "districtName": "Huyện Hải Hậu",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11319078",
    "wardName": "Xã Hải Tiến",
    "districtId": 11319,
    "districtName": "Huyện Hải Hậu",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11319079",
    "wardName": "Xã Hải Hưng",
    "districtId": 11319,
    "districtName": "Huyện Hải Hậu",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11319080",
    "wardName": "Xã Hải An",
    "districtId": 11319,
    "districtName": "Huyện Hải Hậu",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11319081",
    "wardName": "Xã Hải Quang",
    "districtId": 11319,
    "districtName": "Huyện Hải Hậu",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11319082",
    "wardName": "Xã Hải Xuân",
    "districtId": 11319,
    "districtName": "Huyện Hải Hậu",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11319083",
    "wardName": "Xã Hải Thịnh",
    "districtId": 11319,
    "districtName": "Huyện Hải Hậu",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11315084",
    "wardName": "Xã Giao Minh",
    "districtId": 11315,
    "districtName": "Huyện Giao Thuỷ",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11315085",
    "wardName": "Xã Giao Hoà",
    "districtId": 11315,
    "districtName": "Huyện Giao Thuỷ",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11315086",
    "wardName": "Xã Giao Thuỷ",
    "districtId": 11315,
    "districtName": "Huyện Giao Thuỷ",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11315087",
    "wardName": "Xã Giao Phúc",
    "districtId": 11315,
    "districtName": "Huyện Giao Thuỷ",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11315088",
    "wardName": "Xã Giao Hưng",
    "districtId": 11315,
    "districtName": "Huyện Giao Thuỷ",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11315089",
    "wardName": "Xã Giao Bình",
    "districtId": 11315,
    "districtName": "Huyện Giao Thuỷ",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11315090",
    "wardName": "Xã Giao Ninh",
    "districtId": 11315,
    "districtName": "Huyện Giao Thuỷ",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11317091",
    "wardName": "Xã Đồng Thịnh",
    "districtId": 11317,
    "districtName": "Huyện Nghĩa Hưng",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11317092",
    "wardName": "Xã Nghĩa Hưng",
    "districtId": 11317,
    "districtName": "Huyện Nghĩa Hưng",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11317093",
    "wardName": "Xã Nghĩa Sơn",
    "districtId": 11317,
    "districtName": "Huyện Nghĩa Hưng",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11317094",
    "wardName": "Xã Hồng Phong",
    "districtId": 11317,
    "districtName": "Huyện Nghĩa Hưng",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11317095",
    "wardName": "Xã Quỹ Nhất",
    "districtId": 11317,
    "districtName": "Huyện Nghĩa Hưng",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11317096",
    "wardName": "Xã Nghĩa Lâm",
    "districtId": 11317,
    "districtName": "Huyện Nghĩa Hưng",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11317097",
    "wardName": "Xã Rạng Đông",
    "districtId": 11317,
    "districtName": "Huyện Nghĩa Hưng",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11709098",
    "wardName": "Phường Tây Hoa Lư",
    "districtId": 11709,
    "districtName": "Thành phố Hoa Lư",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11709099",
    "wardName": "Phường Hoa Lư",
    "districtId": 11709,
    "districtName": "Thành phố Hoa Lư",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11709100",
    "wardName": "Phường Nam Hoa Lư",
    "districtId": 11709,
    "districtName": "Thành phố Hoa Lư",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11713101",
    "wardName": "Phường Đông Hoa Lư",
    "districtId": 11713,
    "districtName": "Huyện Yên Khánh",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11703102",
    "wardName": "Phường Tam Điệp",
    "districtId": 11703,
    "districtName": "Thành phố Tam Điệp",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11703103",
    "wardName": "Phường Yên Sơn",
    "districtId": 11703,
    "districtName": "Thành phố Tam Điệp",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11703104",
    "wardName": "Phường Trung Sơn",
    "districtId": 11703,
    "districtName": "Thành phố Tam Điệp",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11703105",
    "wardName": "Phường Yên Thắng",
    "districtId": 11703,
    "districtName": "Thành phố Tam Điệp",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11101106",
    "wardName": "Phường Hà Nam",
    "districtId": 11101,
    "districtName": "Thành phố Phủ Lý",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11101107",
    "wardName": "Phường Phủ Lý",
    "districtId": 11101,
    "districtName": "Thành phố Phủ Lý",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11101108",
    "wardName": "Phường Phù Vân",
    "districtId": 11101,
    "districtName": "Thành phố Phủ Lý",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11101109",
    "wardName": "Phường Châu Sơn",
    "districtId": 11101,
    "districtName": "Thành phố Phủ Lý",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11101110",
    "wardName": "Phường Liêm Tuyền",
    "districtId": 11101,
    "districtName": "Thành phố Phủ Lý",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11103111",
    "wardName": "Phường Duy Tiên",
    "districtId": 11103,
    "districtName": "Thị xã Duy Tiên",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11103112",
    "wardName": "Phường Duy Tân",
    "districtId": 11103,
    "districtName": "Thị xã Duy Tiên",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11103113",
    "wardName": "Phường Đồng Văn",
    "districtId": 11103,
    "districtName": "Thị xã Duy Tiên",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11103114",
    "wardName": "Phường Duy Hà",
    "districtId": 11103,
    "districtName": "Thị xã Duy Tiên",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11103115",
    "wardName": "Phường Tiên Sơn",
    "districtId": 11103,
    "districtName": "Thị xã Duy Tiên",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11105116",
    "wardName": "Phường Lê Hồ",
    "districtId": 11105,
    "districtName": "Thị xã Kim Bảng",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11105117",
    "wardName": "Phường Nguyễn Úy",
    "districtId": 11105,
    "districtName": "Thị xã Kim Bảng",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11105118",
    "wardName": "Phường Lý Thường Kiệt",
    "districtId": 11105,
    "districtName": "Thị xã Kim Bảng",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11105119",
    "wardName": "Phường Kim Thanh",
    "districtId": 11105,
    "districtName": "Thị xã Kim Bảng",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11105120",
    "wardName": "Phường Tam Chúc",
    "districtId": 11105,
    "districtName": "Thị xã Kim Bảng",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11105121",
    "wardName": "Phường Kim Bảng",
    "districtId": 11105,
    "districtName": "Thị xã Kim Bảng",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11301122",
    "wardName": "Phường Nam Định",
    "districtId": 11301,
    "districtName": "Thành phố Nam Định",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11301123",
    "wardName": "Phường Thiên Trường",
    "districtId": 11301,
    "districtName": "Thành phố Nam Định",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11301124",
    "wardName": "Phường Đông A",
    "districtId": 11301,
    "districtName": "Thành phố Nam Định",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11301125",
    "wardName": "Phường Vị Khê",
    "districtId": 11301,
    "districtName": "Thành phố Nam Định",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11301126",
    "wardName": "Phường Thành Nam",
    "districtId": 11301,
    "districtName": "Thành phố Nam Định",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11301127",
    "wardName": "Phường Trường Thi",
    "districtId": 11301,
    "districtName": "Thành phố Nam Định",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11309128",
    "wardName": "Phường Hồng Quang",
    "districtId": 11309,
    "districtName": "Huyện Nam Trực",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "11301129",
    "wardName": "Phường Mỹ Lộc",
    "districtId": 11301,
    "districtName": "Thành phố Nam Định",
    "provinceId": "06",
    "provinceName": "Tỉnh Ninh Bình"
  },
  {
    "wardId": "20301001",
    "wardName": "Phường Thục Phán",
    "districtId": 20301,
    "districtName": "Thành phố Cao Bằng",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20301002",
    "wardName": "Phường Nùng Trí Cao",
    "districtId": 20301,
    "districtName": "Thành phố Cao Bằng",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20301003",
    "wardName": "Phường Tân Giang",
    "districtId": 20301,
    "districtName": "Thành phố Cao Bằng",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20323004",
    "wardName": "Xã Quảng Lâm",
    "districtId": 20323,
    "districtName": "Huyện Bảo Lâm",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20323005",
    "wardName": "Xã Nam Quang",
    "districtId": 20323,
    "districtName": "Huyện Bảo Lâm",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20323006",
    "wardName": "Xã Lý Bôn",
    "districtId": 20323,
    "districtName": "Huyện Bảo Lâm",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20323007",
    "wardName": "Xã Bảo Lâm",
    "districtId": 20323,
    "districtName": "Huyện Bảo Lâm",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20323008",
    "wardName": "Xã Yên Thổ",
    "districtId": 20323,
    "districtName": "Huyện Bảo Lâm",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20303009",
    "wardName": "Xã Sơn Lộ",
    "districtId": 20303,
    "districtName": "Huyện Bảo Lạc",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20303010",
    "wardName": "Xã Hưng Đạo",
    "districtId": 20303,
    "districtName": "Huyện Bảo Lạc",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20303011",
    "wardName": "Xã Bảo Lạc",
    "districtId": 20303,
    "districtName": "Huyện Bảo Lạc",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20303012",
    "wardName": "Xã Cốc Pàng",
    "districtId": 20303,
    "districtName": "Huyện Bảo Lạc",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20303013",
    "wardName": "Xã Cô Ba",
    "districtId": 20303,
    "districtName": "Huyện Bảo Lạc",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20303014",
    "wardName": "Xã Khánh Xuân",
    "districtId": 20303,
    "districtName": "Huyện Bảo Lạc",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20303015",
    "wardName": "Xã Xuân Trường",
    "districtId": 20303,
    "districtName": "Huyện Bảo Lạc",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20303016",
    "wardName": "Xã Huy Giáp",
    "districtId": 20303,
    "districtName": "Huyện Bảo Lạc",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20313017",
    "wardName": "Xã Ca Thành",
    "districtId": 20313,
    "districtName": "Huyện Nguyên Bình",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20313018",
    "wardName": "Xã Phan Thanh",
    "districtId": 20313,
    "districtName": "Huyện Nguyên Bình",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20313019",
    "wardName": "Xã Thành Công",
    "districtId": 20313,
    "districtName": "Huyện Nguyên Bình",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20313020",
    "wardName": "Xã Tĩnh Túc",
    "districtId": 20313,
    "districtName": "Huyện Nguyên Bình",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20313021",
    "wardName": "Xã Tam Kim",
    "districtId": 20313,
    "districtName": "Huyện Nguyên Bình",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20313022",
    "wardName": "Xã Nguyên Bình",
    "districtId": 20313,
    "districtName": "Huyện Nguyên Bình",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20313023",
    "wardName": "Xã Minh Tâm",
    "districtId": 20313,
    "districtName": "Huyện Nguyên Bình",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20305024",
    "wardName": "Xã Thanh Long",
    "districtId": 20305,
    "districtName": "Huyện Hà Quảng",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20305025",
    "wardName": "Xã Cần Yên",
    "districtId": 20305,
    "districtName": "Huyện Hà Quảng",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20305026",
    "wardName": "Xã Thông Nông",
    "districtId": 20305,
    "districtName": "Huyện Hà Quảng",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20305027",
    "wardName": "Xã Trường Hà",
    "districtId": 20305,
    "districtName": "Huyện Hà Quảng",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20305028",
    "wardName": "Xã Hà Quảng",
    "districtId": 20305,
    "districtName": "Huyện Hà Quảng",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20305029",
    "wardName": "Xã Lũng Nặm",
    "districtId": 20305,
    "districtName": "Huyện Hà Quảng",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20305030",
    "wardName": "Xã Tổng Cọt",
    "districtId": 20305,
    "districtName": "Huyện Hà Quảng",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20315031",
    "wardName": "Xã Nam Tuấn",
    "districtId": 20315,
    "districtName": "Huyện Hoà An",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20315032",
    "wardName": "Xã Hoà An",
    "districtId": 20315,
    "districtName": "Huyện Hoà An",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20315033",
    "wardName": "Xã Bạch Đằng",
    "districtId": 20315,
    "districtName": "Huyện Hoà An",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20315034",
    "wardName": "Xã Nguyễn Huệ",
    "districtId": 20315,
    "districtName": "Huyện Hoà An",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20321035",
    "wardName": "Xã Minh Khai",
    "districtId": 20321,
    "districtName": "Huyện Thạch An",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20321036",
    "wardName": "Xã Canh Tân",
    "districtId": 20321,
    "districtName": "Huyện Thạch An",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20321037",
    "wardName": "Xã Kim Đồng",
    "districtId": 20321,
    "districtName": "Huyện Thạch An",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20321038",
    "wardName": "Xã Thạch An",
    "districtId": 20321,
    "districtName": "Huyện Thạch An",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20321039",
    "wardName": "Xã Đông Khê",
    "districtId": 20321,
    "districtName": "Huyện Thạch An",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20321040",
    "wardName": "Xã Đức Long",
    "districtId": 20321,
    "districtName": "Huyện Thạch An",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20317041",
    "wardName": "Xã Phục Hoà",
    "districtId": 20317,
    "districtName": "Huyện Quảng Hòa",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20317042",
    "wardName": "Xã Bế Văn Đàn",
    "districtId": 20317,
    "districtName": "Huyện Quảng Hòa",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20317043",
    "wardName": "Xã Độc Lập",
    "districtId": 20317,
    "districtName": "Huyện Quảng Hòa",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20317044",
    "wardName": "Xã Quảng Uyên",
    "districtId": 20317,
    "districtName": "Huyện Quảng Hòa",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20317045",
    "wardName": "Xã Hạnh Phúc",
    "districtId": 20317,
    "districtName": "Huyện Quảng Hòa",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20311046",
    "wardName": "Xã Quang Hán",
    "districtId": 20311,
    "districtName": "Huyện Trùng Khánh",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20311047",
    "wardName": "Xã Trà Lĩnh",
    "districtId": 20311,
    "districtName": "Huyện Trùng Khánh",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20311048",
    "wardName": "Xã Quang Trung",
    "districtId": 20311,
    "districtName": "Huyện Trùng Khánh",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20311049",
    "wardName": "Xã Đoài Dương",
    "districtId": 20311,
    "districtName": "Huyện Trùng Khánh",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20311050",
    "wardName": "Xã Trùng Khánh",
    "districtId": 20311,
    "districtName": "Huyện Trùng Khánh",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20311051",
    "wardName": "Xã Đàm Thuỷ",
    "districtId": 20311,
    "districtName": "Huyện Trùng Khánh",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20311052",
    "wardName": "Xã Đình Phong",
    "districtId": 20311,
    "districtName": "Huyện Trùng Khánh",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20319053",
    "wardName": "Xã Lý Quốc",
    "districtId": 20319,
    "districtName": "Huyện Hạ Lang",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20319054",
    "wardName": "Xã Hạ Lang",
    "districtId": 20319,
    "districtName": "Huyện Hạ Lang",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20319055",
    "wardName": "Xã Vinh Quý",
    "districtId": 20319,
    "districtName": "Huyện Hạ Lang",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "20319056",
    "wardName": "Xã Quang Long",
    "districtId": 20319,
    "districtName": "Huyện Hạ Lang",
    "provinceId": "07",
    "provinceName": "Tỉnh Cao Bằng"
  },
  {
    "wardId": "21113001",
    "wardName": "Xã Thượng Lâm",
    "districtId": 21113,
    "districtName": "Huyện Lâm Bình",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21113002",
    "wardName": "Xã Lâm Bình",
    "districtId": 21113,
    "districtName": "Huyện Lâm Bình",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21113003",
    "wardName": "Xã Minh Quang",
    "districtId": 21113,
    "districtName": "Huyện Lâm Bình",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21113004",
    "wardName": "Xã Bình An",
    "districtId": 21113,
    "districtName": "Huyện Lâm Bình",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21103005",
    "wardName": "Xã Côn Lôn",
    "districtId": 21103,
    "districtName": "Huyện Na Hang",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21103006",
    "wardName": "Xã Yên Hoa",
    "districtId": 21103,
    "districtName": "Huyện Na Hang",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21103007",
    "wardName": "Xã Thượng Nông",
    "districtId": 21103,
    "districtName": "Huyện Na Hang",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21103008",
    "wardName": "Xã Hồng Thái",
    "districtId": 21103,
    "districtName": "Huyện Na Hang",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21103009",
    "wardName": "Xã Nà Hang",
    "districtId": 21103,
    "districtName": "Huyện Na Hang",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21105010",
    "wardName": "Xã Tân Mỹ",
    "districtId": 21105,
    "districtName": "Huyện Chiêm Hoá",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21105011",
    "wardName": "Xã Yên Lập",
    "districtId": 21105,
    "districtName": "Huyện Chiêm Hoá",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21105012",
    "wardName": "Xã Tân An",
    "districtId": 21105,
    "districtName": "Huyện Chiêm Hoá",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21105013",
    "wardName": "Xã Chiêm Hoá",
    "districtId": 21105,
    "districtName": "Huyện Chiêm Hoá",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21105014",
    "wardName": "Xã Hoà An",
    "districtId": 21105,
    "districtName": "Huyện Chiêm Hoá",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21105015",
    "wardName": "Xã Kiên Đài",
    "districtId": 21105,
    "districtName": "Huyện Chiêm Hoá",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21105016",
    "wardName": "Xã Tri Phú",
    "districtId": 21105,
    "districtName": "Huyện Chiêm Hoá",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21105017",
    "wardName": "Xã Kim Bình",
    "districtId": 21105,
    "districtName": "Huyện Chiêm Hoá",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21105018",
    "wardName": "Xã Yên Nguyên",
    "districtId": 21105,
    "districtName": "Huyện Chiêm Hoá",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21105019",
    "wardName": "Xã Trung Hà",
    "districtId": 21105,
    "districtName": "Huyện Chiêm Hoá",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21107020",
    "wardName": "Xã Yên Phú",
    "districtId": 21107,
    "districtName": "Huyện Hàm Yên",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21107021",
    "wardName": "Xã Bạch Xa",
    "districtId": 21107,
    "districtName": "Huyện Hàm Yên",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21107022",
    "wardName": "Xã Phù Lưu",
    "districtId": 21107,
    "districtName": "Huyện Hàm Yên",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21107023",
    "wardName": "Xã Hàm Yên",
    "districtId": 21107,
    "districtName": "Huyện Hàm Yên",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21107024",
    "wardName": "Xã Bình Xa",
    "districtId": 21107,
    "districtName": "Huyện Hàm Yên",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21107025",
    "wardName": "Xã Thái Sơn",
    "districtId": 21107,
    "districtName": "Huyện Hàm Yên",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21107026",
    "wardName": "Xã Thái Hoà",
    "districtId": 21107,
    "districtName": "Huyện Hàm Yên",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21107027",
    "wardName": "Xã Hùng Đức",
    "districtId": 21107,
    "districtName": "Huyện Hàm Yên",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21109028",
    "wardName": "Xã Hùng Lợi",
    "districtId": 21109,
    "districtName": "Huyện Yên Sơn",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21109029",
    "wardName": "Xã Trung Sơn",
    "districtId": 21109,
    "districtName": "Huyện Yên Sơn",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21109030",
    "wardName": "Xã Thái Bình",
    "districtId": 21109,
    "districtName": "Huyện Yên Sơn",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21109031",
    "wardName": "Xã Tân Long",
    "districtId": 21109,
    "districtName": "Huyện Yên Sơn",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21109032",
    "wardName": "Xã Xuân Vân",
    "districtId": 21109,
    "districtName": "Huyện Yên Sơn",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21109033",
    "wardName": "Xã Lực Hành",
    "districtId": 21109,
    "districtName": "Huyện Yên Sơn",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21109034",
    "wardName": "Xã Yên Sơn",
    "districtId": 21109,
    "districtName": "Huyện Yên Sơn",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21109035",
    "wardName": "Xã Nhữ Khê",
    "districtId": 21109,
    "districtName": "Huyện Yên Sơn",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21109036",
    "wardName": "Xã Kiến Thiết",
    "districtId": 21109,
    "districtName": "Huyện Yên Sơn",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21111037",
    "wardName": "Xã Tân Trào",
    "districtId": 21111,
    "districtName": "Huyện Sơn Dương",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21111038",
    "wardName": "Xã Minh Thanh",
    "districtId": 21111,
    "districtName": "Huyện Sơn Dương",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21111039",
    "wardName": "Xã Sơn Dương",
    "districtId": 21111,
    "districtName": "Huyện Sơn Dương",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21111040",
    "wardName": "Xã Bình Ca",
    "districtId": 21111,
    "districtName": "Huyện Sơn Dương",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21111041",
    "wardName": "Xã Tân Thanh",
    "districtId": 21111,
    "districtName": "Huyện Sơn Dương",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21111042",
    "wardName": "Xã Sơn Thuỷ",
    "districtId": 21111,
    "districtName": "Huyện Sơn Dương",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21111043",
    "wardName": "Xã Phú Lương",
    "districtId": 21111,
    "districtName": "Huyện Sơn Dương",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21111044",
    "wardName": "Xã Trường Sinh",
    "districtId": 21111,
    "districtName": "Huyện Sơn Dương",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21111045",
    "wardName": "Xã Hồng Sơn",
    "districtId": 21111,
    "districtName": "Huyện Sơn Dương",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21111046",
    "wardName": "Xã Đông Thọ",
    "districtId": 21111,
    "districtName": "Huyện Sơn Dương",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21101047",
    "wardName": "Phường Mỹ Lâm",
    "districtId": 21101,
    "districtName": "Thành phố Tuyên Quang",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21101048",
    "wardName": "Phường Minh Xuân",
    "districtId": 21101,
    "districtName": "Thành phố Tuyên Quang",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21101049",
    "wardName": "Phường Nông Tiến",
    "districtId": 21101,
    "districtName": "Thành phố Tuyên Quang",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21101050",
    "wardName": "Phường An Tường",
    "districtId": 21101,
    "districtName": "Thành phố Tuyên Quang",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21101051",
    "wardName": "Phường Bình Thuận",
    "districtId": 21101,
    "districtName": "Thành phố Tuyên Quang",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20103052",
    "wardName": "Xã Lũng Cú",
    "districtId": 20103,
    "districtName": "Huyện Đồng Văn",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20103053",
    "wardName": "Xã Đồng Văn",
    "districtId": 20103,
    "districtName": "Huyện Đồng Văn",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20103054",
    "wardName": "Xã Sà Phìn",
    "districtId": 20103,
    "districtName": "Huyện Đồng Văn",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20103055",
    "wardName": "Xã Phố Bảng",
    "districtId": 20103,
    "districtName": "Huyện Đồng Văn",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20103056",
    "wardName": "Xã Lũng Phìn",
    "districtId": 20103,
    "districtName": "Huyện Đồng Văn",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20105057",
    "wardName": "Xã Sủng Máng",
    "districtId": 20105,
    "districtName": "Huyện Mèo Vạc",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20105058",
    "wardName": "Xã Sơn Vĩ",
    "districtId": 20105,
    "districtName": "Huyện Mèo Vạc",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20105059",
    "wardName": "Xã Mèo Vạc",
    "districtId": 20105,
    "districtName": "Huyện Mèo Vạc",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20105060",
    "wardName": "Xã Khâu Vai",
    "districtId": 20105,
    "districtName": "Huyện Mèo Vạc",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20105061",
    "wardName": "Xã Niêm Sơn",
    "districtId": 20105,
    "districtName": "Huyện Mèo Vạc",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20105062",
    "wardName": "Xã Tát Ngà",
    "districtId": 20105,
    "districtName": "Huyện Mèo Vạc",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20107063",
    "wardName": "Xã Thắng Mố",
    "districtId": 20107,
    "districtName": "Huyện Yên Minh",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20107064",
    "wardName": "Xã Bạch Đích",
    "districtId": 20107,
    "districtName": "Huyện Yên Minh",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20107065",
    "wardName": "Xã Yên Minh",
    "districtId": 20107,
    "districtName": "Huyện Yên Minh",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20107066",
    "wardName": "Xã Mậu Duệ",
    "districtId": 20107,
    "districtName": "Huyện Yên Minh",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20107067",
    "wardName": "Xã Ngọc Long",
    "districtId": 20107,
    "districtName": "Huyện Yên Minh",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20107068",
    "wardName": "Xã Du Già",
    "districtId": 20107,
    "districtName": "Huyện Yên Minh",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20107069",
    "wardName": "Xã Đường Thượng",
    "districtId": 20107,
    "districtName": "Huyện Yên Minh",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20109070",
    "wardName": "Xã Lùng Tám",
    "districtId": 20109,
    "districtName": "Huyện Quản Bạ",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20109071",
    "wardName": "Xã Cán Tỷ",
    "districtId": 20109,
    "districtName": "Huyện Quản Bạ",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20109072",
    "wardName": "Xã Nghĩa Thuận",
    "districtId": 20109,
    "districtName": "Huyện Quản Bạ",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20109073",
    "wardName": "Xã Quản Bạ",
    "districtId": 20109,
    "districtName": "Huyện Quản Bạ",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20109074",
    "wardName": "Xã Tùng Vài",
    "districtId": 20109,
    "districtName": "Huyện Quản Bạ",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20111075",
    "wardName": "Xã Yên Cường",
    "districtId": 20111,
    "districtName": "Huyện Bắc Mê",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20111076",
    "wardName": "Xã Đường Hồng",
    "districtId": 20111,
    "districtName": "Huyện Bắc Mê",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20111077",
    "wardName": "Xã Bắc Mê",
    "districtId": 20111,
    "districtName": "Huyện Bắc Mê",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20111078",
    "wardName": "Xã Giáp Trung",
    "districtId": 20111,
    "districtName": "Huyện Bắc Mê",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20111079",
    "wardName": "Xã Minh Sơn",
    "districtId": 20111,
    "districtName": "Huyện Bắc Mê",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20111080",
    "wardName": "Xã Minh Ngọc",
    "districtId": 20111,
    "districtName": "Huyện Bắc Mê",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20101081",
    "wardName": "Xã Ngọc Đường",
    "districtId": 20101,
    "districtName": "Thành phố Hà Giang",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20101082",
    "wardName": "Phường Hà Giang 1",
    "districtId": 20101,
    "districtName": "Thành phố Hà Giang",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20101083",
    "wardName": "Phường Hà Giang 2",
    "districtId": 20101,
    "districtName": "Thành phố Hà Giang",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20115084",
    "wardName": "Xã Lao Chải",
    "districtId": 20115,
    "districtName": "Huyện Vị Xuyên",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20115085",
    "wardName": "Xã Thanh Thuỷ",
    "districtId": 20115,
    "districtName": "Huyện Vị Xuyên",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20115086",
    "wardName": "Xã Minh Tân",
    "districtId": 20115,
    "districtName": "Huyện Vị Xuyên",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20115087",
    "wardName": "Xã Thuận Hoà",
    "districtId": 20115,
    "districtName": "Huyện Vị Xuyên",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20115088",
    "wardName": "Xã Tùng Bá",
    "districtId": 20115,
    "districtName": "Huyện Vị Xuyên",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20115089",
    "wardName": "Xã Phú Linh",
    "districtId": 20115,
    "districtName": "Huyện Vị Xuyên",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20115090",
    "wardName": "Xã Linh Hồ",
    "districtId": 20115,
    "districtName": "Huyện Vị Xuyên",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20115091",
    "wardName": "Xã Bạch Ngọc",
    "districtId": 20115,
    "districtName": "Huyện Vị Xuyên",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20115092",
    "wardName": "Xã Vị Xuyên",
    "districtId": 20115,
    "districtName": "Huyện Vị Xuyên",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20115093",
    "wardName": "Xã Việt Lâm",
    "districtId": 20115,
    "districtName": "Huyện Vị Xuyên",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20115094",
    "wardName": "Xã Cao Bồ",
    "districtId": 20115,
    "districtName": "Huyện Vị Xuyên",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20115095",
    "wardName": "Xã Thượng Sơn",
    "districtId": 20115,
    "districtName": "Huyện Vị Xuyên",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20119096",
    "wardName": "Xã Tân Quang",
    "districtId": 20119,
    "districtName": "Huyện Bắc Quang",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20119097",
    "wardName": "Xã Đồng Tâm",
    "districtId": 20119,
    "districtName": "Huyện Bắc Quang",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20119098",
    "wardName": "Xã Liên Hiệp",
    "districtId": 20119,
    "districtName": "Huyện Bắc Quang",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20119099",
    "wardName": "Xã Bằng Hành",
    "districtId": 20119,
    "districtName": "Huyện Bắc Quang",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20119100",
    "wardName": "Xã Bắc Quang",
    "districtId": 20119,
    "districtName": "Huyện Bắc Quang",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20119101",
    "wardName": "Xã Hùng An",
    "districtId": 20119,
    "districtName": "Huyện Bắc Quang",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20119102",
    "wardName": "Xã Vĩnh Tuy",
    "districtId": 20119,
    "districtName": "Huyện Bắc Quang",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20119103",
    "wardName": "Xã Đồng Yên",
    "districtId": 20119,
    "districtName": "Huyện Bắc Quang",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20118104",
    "wardName": "Xã Tiên Yên",
    "districtId": 20118,
    "districtName": "Huyện Quang Bình",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20118105",
    "wardName": "Xã Xuân Giang",
    "districtId": 20118,
    "districtName": "Huyện Quang Bình",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20118106",
    "wardName": "Xã Bằng Lang",
    "districtId": 20118,
    "districtName": "Huyện Quang Bình",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20118107",
    "wardName": "Xã Yên Thành",
    "districtId": 20118,
    "districtName": "Huyện Quang Bình",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20118108",
    "wardName": "Xã Quang Bình",
    "districtId": 20118,
    "districtName": "Huyện Quang Bình",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20118109",
    "wardName": "Xã Tân Trịnh",
    "districtId": 20118,
    "districtName": "Huyện Quang Bình",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20118110",
    "wardName": "Xã Tiên Nguyên",
    "districtId": 20118,
    "districtName": "Huyện Quang Bình",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20113111",
    "wardName": "Xã Thông Nguyên",
    "districtId": 20113,
    "districtName": "Huyện Hoàng Su Phì",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20113112",
    "wardName": "Xã Hồ Thầu",
    "districtId": 20113,
    "districtName": "Huyện Hoàng Su Phì",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20113113",
    "wardName": "Xã Nậm Dịch",
    "districtId": 20113,
    "districtName": "Huyện Hoàng Su Phì",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20113114",
    "wardName": "Xã Tân Tiến",
    "districtId": 20113,
    "districtName": "Huyện Hoàng Su Phì",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20113115",
    "wardName": "Xã Hoàng Su Phì",
    "districtId": 20113,
    "districtName": "Huyện Hoàng Su Phì",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20113116",
    "wardName": "Xã Thàng Tín",
    "districtId": 20113,
    "districtName": "Huyện Hoàng Su Phì",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20113117",
    "wardName": "Xã Bản Máy",
    "districtId": 20113,
    "districtName": "Huyện Hoàng Su Phì",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20113118",
    "wardName": "Xã Pờ Ly Ngài",
    "districtId": 20113,
    "districtName": "Huyện Hoàng Su Phì",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20117119",
    "wardName": "Xã Xín Mần",
    "districtId": 20117,
    "districtName": "Huyện Xín Mần",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20117120",
    "wardName": "Xã Pà Vầy Sủ",
    "districtId": 20117,
    "districtName": "Huyện Xín Mần",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20117121",
    "wardName": "Xã Nấm Dẩn",
    "districtId": 20117,
    "districtName": "Huyện Xín Mần",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20117122",
    "wardName": "Xã Trung Thịnh",
    "districtId": 20117,
    "districtName": "Huyện Xín Mần",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20117123",
    "wardName": "Xã Quảng Nguyên",
    "districtId": 20117,
    "districtName": "Huyện Xín Mần",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "20117124",
    "wardName": "Xã Khuôn Lùng",
    "districtId": 20117,
    "districtName": "Huyện Xín Mần",
    "provinceId": "08",
    "provinceName": "Tỉnh Tuyên Quang"
  },
  {
    "wardId": "21309001",
    "wardName": "Xã Khao Mang",
    "districtId": 21309,
    "districtName": "Huyện Mù Cang Chải",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21309002",
    "wardName": "Xã Mù Cang Chải",
    "districtId": 21309,
    "districtName": "Huyện Mù Cang Chải",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21309003",
    "wardName": "Xã Púng Luông",
    "districtId": 21309,
    "districtName": "Huyện Mù Cang Chải",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21315004",
    "wardName": "Xã Tú Lệ",
    "districtId": 21315,
    "districtName": "Huyện Văn Chấn",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21317005",
    "wardName": "Xã Trạm Tấu",
    "districtId": 21317,
    "districtName": "Huyện Trạm Tấu",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21317006",
    "wardName": "Xã Hạnh Phúc",
    "districtId": 21317,
    "districtName": "Huyện Trạm Tấu",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21317007",
    "wardName": "Xã Phình Hồ",
    "districtId": 21317,
    "districtName": "Huyện Trạm Tấu",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21303008",
    "wardName": "Phường Nghĩa Lộ",
    "districtId": 21303,
    "districtName": "Thị xã Nghĩa Lộ",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21303009",
    "wardName": "Phường Trung Tâm",
    "districtId": 21303,
    "districtName": "Thị xã Nghĩa Lộ",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21303010",
    "wardName": "Phường Cầu Thia",
    "districtId": 21303,
    "districtName": "Thị xã Nghĩa Lộ",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21303011",
    "wardName": "Xã Liên Sơn",
    "districtId": 21303,
    "districtName": "Thị xã Nghĩa Lộ",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21315012",
    "wardName": "Xã Gia Hội",
    "districtId": 21315,
    "districtName": "Huyện Văn Chấn",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21315013",
    "wardName": "Xã Sơn Lương",
    "districtId": 21315,
    "districtName": "Huyện Văn Chấn",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21315014",
    "wardName": "Xã Thượng Bằng La",
    "districtId": 21315,
    "districtName": "Huyện Văn Chấn",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21315015",
    "wardName": "Xã Chấn Thịnh",
    "districtId": 21315,
    "districtName": "Huyện Văn Chấn",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21315016",
    "wardName": "Xã Nghĩa Tâm",
    "districtId": 21315,
    "districtName": "Huyện Văn Chấn",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21315017",
    "wardName": "Xã Văn Chấn",
    "districtId": 21315,
    "districtName": "Huyện Văn Chấn",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21307018",
    "wardName": "Xã Phong Dụ Hạ",
    "districtId": 21307,
    "districtName": "Huyện Văn Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21307019",
    "wardName": "Xã Châu Quế",
    "districtId": 21307,
    "districtName": "Huyện Văn Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21307020",
    "wardName": "Xã Lâm Giang",
    "districtId": 21307,
    "districtName": "Huyện Văn Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21307021",
    "wardName": "Xã Đông Cuông",
    "districtId": 21307,
    "districtName": "Huyện Văn Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21307022",
    "wardName": "Xã Tân Hợp",
    "districtId": 21307,
    "districtName": "Huyện Văn Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21307023",
    "wardName": "Xã Mậu A",
    "districtId": 21307,
    "districtName": "Huyện Văn Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21307024",
    "wardName": "Xã Xuân Ái",
    "districtId": 21307,
    "districtName": "Huyện Văn Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21307025",
    "wardName": "Xã Mỏ Vàng",
    "districtId": 21307,
    "districtName": "Huyện Văn Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21305026",
    "wardName": "Xã Lâm Thượng",
    "districtId": 21305,
    "districtName": "Huyện Lục Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21305027",
    "wardName": "Xã Lục Yên",
    "districtId": 21305,
    "districtName": "Huyện Lục Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21305028",
    "wardName": "Xã Tân Lĩnh",
    "districtId": 21305,
    "districtName": "Huyện Lục Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21305029",
    "wardName": "Xã Khánh Hoà",
    "districtId": 21305,
    "districtName": "Huyện Lục Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21305030",
    "wardName": "Xã Phúc Lợi",
    "districtId": 21305,
    "districtName": "Huyện Lục Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21305031",
    "wardName": "Xã Mường Lai",
    "districtId": 21305,
    "districtName": "Huyện Lục Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21313032",
    "wardName": "Xã Cảm Nhân",
    "districtId": 21313,
    "districtName": "Huyện Yên Bình",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21313033",
    "wardName": "Xã Yên Thành",
    "districtId": 21313,
    "districtName": "Huyện Yên Bình",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21313034",
    "wardName": "Xã Thác Bà",
    "districtId": 21313,
    "districtName": "Huyện Yên Bình",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21313035",
    "wardName": "Xã Yên Bình",
    "districtId": 21313,
    "districtName": "Huyện Yên Bình",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21313036",
    "wardName": "Xã Bảo Ái",
    "districtId": 21313,
    "districtName": "Huyện Yên Bình",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21301037",
    "wardName": "Phường Văn Phú",
    "districtId": 21301,
    "districtName": "Thành phố Yên Bái",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21301038",
    "wardName": "Phường Yên Bái",
    "districtId": 21301,
    "districtName": "Thành phố Yên Bái",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21301039",
    "wardName": "Phường Nam Cường",
    "districtId": 21301,
    "districtName": "Thành phố Yên Bái",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21301040",
    "wardName": "Phường Âu Lâu",
    "districtId": 21301,
    "districtName": "Thành phố Yên Bái",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21311041",
    "wardName": "Xã Trấn Yên",
    "districtId": 21311,
    "districtName": "Huyện Trấn Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21311042",
    "wardName": "Xã Hưng Khánh",
    "districtId": 21311,
    "districtName": "Huyện Trấn Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21311043",
    "wardName": "Xã Lương Thịnh",
    "districtId": 21311,
    "districtName": "Huyện Trấn Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21311044",
    "wardName": "Xã Việt Hồng",
    "districtId": 21311,
    "districtName": "Huyện Trấn Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21311045",
    "wardName": "Xã Quy Mông",
    "districtId": 21311,
    "districtName": "Huyện Trấn Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20511046",
    "wardName": "Xã Phong Hải",
    "districtId": 20511,
    "districtName": "Huyện Bảo Thắng",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20511047",
    "wardName": "Xã Xuân Quang",
    "districtId": 20511,
    "districtName": "Huyện Bảo Thắng",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20511048",
    "wardName": "Xã Bảo Thắng",
    "districtId": 20511,
    "districtName": "Huyện Bảo Thắng",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20511049",
    "wardName": "Xã Tằng Lỏong",
    "districtId": 20511,
    "districtName": "Huyện Bảo Thắng",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20511050",
    "wardName": "Xã Gia Phú",
    "districtId": 20511,
    "districtName": "Huyện Bảo Thắng",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20501051",
    "wardName": "Xã Cốc San",
    "districtId": 20501,
    "districtName": "Thành phố Lào Cai",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20501052",
    "wardName": "Xã Hợp Thành",
    "districtId": 20501,
    "districtName": "Thành phố Lào Cai",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20501053",
    "wardName": "Phường Cam Đường",
    "districtId": 20501,
    "districtName": "Thành phố Lào Cai",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20501054",
    "wardName": "Phường Lào Cai",
    "districtId": 20501,
    "districtName": "Thành phố Lào Cai",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20507055",
    "wardName": "Xã Mường Hum",
    "districtId": 20507,
    "districtName": "Huyện Bát Xát",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20507056",
    "wardName": "Xã Dền Sáng",
    "districtId": 20507,
    "districtName": "Huyện Bát Xát",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20507057",
    "wardName": "Xã Y Tý",
    "districtId": 20507,
    "districtName": "Huyện Bát Xát",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20507058",
    "wardName": "Xã A Mú Sung",
    "districtId": 20507,
    "districtName": "Huyện Bát Xát",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20507059",
    "wardName": "Xã Trịnh Tường",
    "districtId": 20507,
    "districtName": "Huyện Bát Xát",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20507060",
    "wardName": "Xã Bản Xèo",
    "districtId": 20507,
    "districtName": "Huyện Bát Xát",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20507061",
    "wardName": "Xã Bát Xát",
    "districtId": 20507,
    "districtName": "Huyện Bát Xát",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20515062",
    "wardName": "Xã Nghĩa Đô",
    "districtId": 20515,
    "districtName": "Huyện Bảo Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20515063",
    "wardName": "Xã Thượng Hà",
    "districtId": 20515,
    "districtName": "Huyện Bảo Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20515064",
    "wardName": "Xã Bảo Yên",
    "districtId": 20515,
    "districtName": "Huyện Bảo Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20515065",
    "wardName": "Xã Xuân Hoà",
    "districtId": 20515,
    "districtName": "Huyện Bảo Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20515066",
    "wardName": "Xã Phúc Khánh",
    "districtId": 20515,
    "districtName": "Huyện Bảo Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20515067",
    "wardName": "Xã Bảo Hà",
    "districtId": 20515,
    "districtName": "Huyện Bảo Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20519068",
    "wardName": "Xã Võ Lao",
    "districtId": 20519,
    "districtName": "Huyện Văn Bàn",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20519069",
    "wardName": "Xã Khánh Yên",
    "districtId": 20519,
    "districtName": "Huyện Văn Bàn",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20519070",
    "wardName": "Xã Văn Bàn",
    "districtId": 20519,
    "districtName": "Huyện Văn Bàn",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20519071",
    "wardName": "Xã Dương Quỳ",
    "districtId": 20519,
    "districtName": "Huyện Văn Bàn",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20519072",
    "wardName": "Xã Chiềng Ken",
    "districtId": 20519,
    "districtName": "Huyện Văn Bàn",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20519073",
    "wardName": "Xã Minh Lương",
    "districtId": 20519,
    "districtName": "Huyện Văn Bàn",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20519074",
    "wardName": "Xã Nậm Chày",
    "districtId": 20519,
    "districtName": "Huyện Văn Bàn",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20513075",
    "wardName": "Xã Mường Bo",
    "districtId": 20513,
    "districtName": "Thị xã Sa Pa",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20513076",
    "wardName": "Xã Bản Hồ",
    "districtId": 20513,
    "districtName": "Thị xã Sa Pa",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20513077",
    "wardName": "Xã Tả Phìn",
    "districtId": 20513,
    "districtName": "Thị xã Sa Pa",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20513078",
    "wardName": "Xã Tả Van",
    "districtId": 20513,
    "districtName": "Thị xã Sa Pa",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20513079",
    "wardName": "Phường Sa Pa",
    "districtId": 20513,
    "districtName": "Thị xã Sa Pa",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20509080",
    "wardName": "Xã Cốc Lầu",
    "districtId": 20509,
    "districtName": "Huyện Bắc Hà",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20509081",
    "wardName": "Xã Bảo Nhai",
    "districtId": 20509,
    "districtName": "Huyện Bắc Hà",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20509082",
    "wardName": "Xã Bản Liền",
    "districtId": 20509,
    "districtName": "Huyện Bắc Hà",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20509083",
    "wardName": "Xã Bắc Hà",
    "districtId": 20509,
    "districtName": "Huyện Bắc Hà",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20509084",
    "wardName": "Xã Tả Củ Tỷ",
    "districtId": 20509,
    "districtName": "Huyện Bắc Hà",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20509085",
    "wardName": "Xã Lùng Phình",
    "districtId": 20509,
    "districtName": "Huyện Bắc Hà",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20505086",
    "wardName": "Xã Pha Long",
    "districtId": 20505,
    "districtName": "Huyện Mường Khương",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20505087",
    "wardName": "Xã Mường Khương",
    "districtId": 20505,
    "districtName": "Huyện Mường Khương",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20505088",
    "wardName": "Xã Bản Lầu",
    "districtId": 20505,
    "districtName": "Huyện Mường Khương",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20505089",
    "wardName": "Xã Cao Sơn",
    "districtId": 20505,
    "districtName": "Huyện Mường Khương",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20521090",
    "wardName": "Xã Si Ma Cai",
    "districtId": 20521,
    "districtName": "Huyện Si Ma Cai",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20521091",
    "wardName": "Xã Sín Chéng",
    "districtId": 20521,
    "districtName": "Huyện Si Ma Cai",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21309092",
    "wardName": "Xã Lao Chải",
    "districtId": 21309,
    "districtName": "Huyện Mù Cang Chải",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21309093",
    "wardName": "Xã Chế Tạo",
    "districtId": 21309,
    "districtName": "Huyện Mù Cang Chải",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21309094",
    "wardName": "Xã Nậm Có",
    "districtId": 21309,
    "districtName": "Huyện Mù Cang Chải",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21317095",
    "wardName": "Xã Tà Xi Láng",
    "districtId": 21317,
    "districtName": "Huyện Trạm Tấu",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21307096",
    "wardName": "Xã Phong Dụ Thượng",
    "districtId": 21307,
    "districtName": "Huyện Văn Yên",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21315097",
    "wardName": "Xã Cát Thịnh",
    "districtId": 21315,
    "districtName": "Huyện Văn Chấn",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20519098",
    "wardName": "Xã Nậm Xé",
    "districtId": 20519,
    "districtName": "Huyện Văn Bàn",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "20513099",
    "wardName": "Xã Ngũ Chỉ Sơn",
    "districtId": 20513,
    "districtName": "Thị xã Sa Pa",
    "provinceId": "09",
    "provinceName": "Tỉnh Lào Cai"
  },
  {
    "wardId": "21501001",
    "wardName": "Phường Phan Đình Phùng",
    "districtId": 21501,
    "districtName": "Thành phố Thái Nguyên",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21501002",
    "wardName": "Phường Linh Sơn",
    "districtId": 21501,
    "districtName": "Thành phố Thái Nguyên",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21501003",
    "wardName": "Phường Tích Lương",
    "districtId": 21501,
    "districtName": "Thành phố Thái Nguyên",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21501004",
    "wardName": "Phường Gia Sàng",
    "districtId": 21501,
    "districtName": "Thành phố Thái Nguyên",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21501005",
    "wardName": "Phường Quyết Thắng",
    "districtId": 21501,
    "districtName": "Thành phố Thái Nguyên",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21501006",
    "wardName": "Phường Quan Triều",
    "districtId": 21501,
    "districtName": "Thành phố Thái Nguyên",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21501007",
    "wardName": "Xã Tân Cương",
    "districtId": 21501,
    "districtName": "Thành phố Thái Nguyên",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21501008",
    "wardName": "Xã Đại Phúc",
    "districtId": 21501,
    "districtName": "Thành phố Thái Nguyên",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21513009",
    "wardName": "Xã Đại Từ",
    "districtId": 21513,
    "districtName": "Huyện Đại Từ",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21513010",
    "wardName": "Xã Đức Lương",
    "districtId": 21513,
    "districtName": "Huyện Đại Từ",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21513011",
    "wardName": "Xã Phú Thịnh",
    "districtId": 21513,
    "districtName": "Huyện Đại Từ",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21513012",
    "wardName": "Xã La Bằng",
    "districtId": 21513,
    "districtName": "Huyện Đại Từ",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21513013",
    "wardName": "Xã Phú Lạc",
    "districtId": 21513,
    "districtName": "Huyện Đại Từ",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21513014",
    "wardName": "Xã An Khánh",
    "districtId": 21513,
    "districtName": "Huyện Đại Từ",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21513015",
    "wardName": "Xã Quân Chu",
    "districtId": 21513,
    "districtName": "Huyện Đại Từ",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21513016",
    "wardName": "Xã Vạn Phú",
    "districtId": 21513,
    "districtName": "Huyện Đại Từ",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21513017",
    "wardName": "Xã Phú Xuyên",
    "districtId": 21513,
    "districtName": "Huyện Đại Từ",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21517018",
    "wardName": "Phường Phổ Yên",
    "districtId": 21517,
    "districtName": "Thành phố Phổ Yên",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21517019",
    "wardName": "Phường Vạn Xuân",
    "districtId": 21517,
    "districtName": "Thành phố Phổ Yên",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21517020",
    "wardName": "Phường Trung Thành",
    "districtId": 21517,
    "districtName": "Thành phố Phổ Yên",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21517021",
    "wardName": "Phường Phúc Thuận",
    "districtId": 21517,
    "districtName": "Thành phố Phổ Yên",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21517022",
    "wardName": "Xã Thành Công",
    "districtId": 21517,
    "districtName": "Thành phố Phổ Yên",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21515023",
    "wardName": "Xã Phú Bình",
    "districtId": 21515,
    "districtName": "Huyện Phú Bình",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21515024",
    "wardName": "Xã Tân Thành",
    "districtId": 21515,
    "districtName": "Huyện Phú Bình",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21515025",
    "wardName": "Xã Điềm Thụy",
    "districtId": 21515,
    "districtName": "Huyện Phú Bình",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21515026",
    "wardName": "Xã Kha Sơn",
    "districtId": 21515,
    "districtName": "Huyện Phú Bình",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21515027",
    "wardName": "Xã Tân Khánh",
    "districtId": 21515,
    "districtName": "Huyện Phú Bình",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21511028",
    "wardName": "Xã Đồng Hỷ",
    "districtId": 21511,
    "districtName": "Huyện Đồng Hỷ",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21511029",
    "wardName": "Xã Quang Sơn",
    "districtId": 21511,
    "districtName": "Huyện Đồng Hỷ",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21511030",
    "wardName": "Xã Trại Cau",
    "districtId": 21511,
    "districtName": "Huyện Đồng Hỷ",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21511031",
    "wardName": "Xã Nam Hoà",
    "districtId": 21511,
    "districtName": "Huyện Đồng Hỷ",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21511032",
    "wardName": "Xã Văn Hán",
    "districtId": 21511,
    "districtName": "Huyện Đồng Hỷ",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21511033",
    "wardName": "Xã Văn Lăng",
    "districtId": 21511,
    "districtName": "Huyện Đồng Hỷ",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21503034",
    "wardName": "Phường Sông Công",
    "districtId": 21503,
    "districtName": "Thành phố Sông Công",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21503035",
    "wardName": "Phường Bá Xuyên",
    "districtId": 21503,
    "districtName": "Thành phố Sông Công",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21503036",
    "wardName": "Phường Bách Quang",
    "districtId": 21503,
    "districtName": "Thành phố Sông Công",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21509037",
    "wardName": "Xã Phú Lương",
    "districtId": 21509,
    "districtName": "Huyện Phú Lương",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21509038",
    "wardName": "Xã Vô Tranh",
    "districtId": 21509,
    "districtName": "Huyện Phú Lương",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21509039",
    "wardName": "Xã Yên Trạch",
    "districtId": 21509,
    "districtName": "Huyện Phú Lương",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21509040",
    "wardName": "Xã Hợp Thành",
    "districtId": 21509,
    "districtName": "Huyện Phú Lương",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21505041",
    "wardName": "Xã Định Hóa",
    "districtId": 21505,
    "districtName": "Huyện Định Hoá",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21505042",
    "wardName": "Xã Bình Yên",
    "districtId": 21505,
    "districtName": "Huyện Định Hoá",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21505043",
    "wardName": "Xã Trung Hội",
    "districtId": 21505,
    "districtName": "Huyện Định Hoá",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21505044",
    "wardName": "Xã Phượng Tiến",
    "districtId": 21505,
    "districtName": "Huyện Định Hoá",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21505045",
    "wardName": "Xã Phú Đình",
    "districtId": 21505,
    "districtName": "Huyện Định Hoá",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21505046",
    "wardName": "Xã Bình Thành",
    "districtId": 21505,
    "districtName": "Huyện Định Hoá",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21505047",
    "wardName": "Xã Kim Phượng",
    "districtId": 21505,
    "districtName": "Huyện Định Hoá",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21505048",
    "wardName": "Xã Lam Vỹ",
    "districtId": 21505,
    "districtName": "Huyện Định Hoá",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21507049",
    "wardName": "Xã Võ Nhai",
    "districtId": 21507,
    "districtName": "Huyện Võ Nhai",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21507050",
    "wardName": "Xã Dân Tiến",
    "districtId": 21507,
    "districtName": "Huyện Võ Nhai",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21507051",
    "wardName": "Xã Nghinh Tường",
    "districtId": 21507,
    "districtName": "Huyện Võ Nhai",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21507052",
    "wardName": "Xã Thần Sa",
    "districtId": 21507,
    "districtName": "Huyện Võ Nhai",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21507053",
    "wardName": "Xã La Hiên",
    "districtId": 21507,
    "districtName": "Huyện Võ Nhai",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21507054",
    "wardName": "Xã Tràng Xá",
    "districtId": 21507,
    "districtName": "Huyện Võ Nhai",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20704055",
    "wardName": "Xã Bằng Thành",
    "districtId": 20704,
    "districtName": "Huyện Pác Nặm",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20704056",
    "wardName": "Xã Nghiên Loan",
    "districtId": 20704,
    "districtName": "Huyện Pác Nặm",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20704057",
    "wardName": "Xã Cao Minh",
    "districtId": 20704,
    "districtName": "Huyện Pác Nặm",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20703058",
    "wardName": "Xã Ba Bể",
    "districtId": 20703,
    "districtName": "Huyện Ba Bể",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20703059",
    "wardName": "Xã Chợ Rã",
    "districtId": 20703,
    "districtName": "Huyện Ba Bể",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20703060",
    "wardName": "Xã Phúc Lộc",
    "districtId": 20703,
    "districtName": "Huyện Ba Bể",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20703061",
    "wardName": "Xã Thượng Minh",
    "districtId": 20703,
    "districtName": "Huyện Ba Bể",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20703062",
    "wardName": "Xã Đồng Phúc",
    "districtId": 20703,
    "districtName": "Huyện Ba Bể",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20713063",
    "wardName": "Xã Yên Bình",
    "districtId": 20713,
    "districtName": "Huyện Chợ Mới",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20705064",
    "wardName": "Xã Bằng Vân",
    "districtId": 20705,
    "districtName": "Huyện Ngân Sơn",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20705065",
    "wardName": "Xã Ngân Sơn",
    "districtId": 20705,
    "districtName": "Huyện Ngân Sơn",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20705066",
    "wardName": "Xã Nà Phặc",
    "districtId": 20705,
    "districtName": "Huyện Ngân Sơn",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20705067",
    "wardName": "Xã Hiệp Lực",
    "districtId": 20705,
    "districtName": "Huyện Ngân Sơn",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20707068",
    "wardName": "Xã Nam Cường",
    "districtId": 20707,
    "districtName": "Huyện Chợ Đồn",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20707069",
    "wardName": "Xã Quảng Bạch",
    "districtId": 20707,
    "districtName": "Huyện Chợ Đồn",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20707070",
    "wardName": "Xã Yên Thịnh",
    "districtId": 20707,
    "districtName": "Huyện Chợ Đồn",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20707071",
    "wardName": "Xã Chợ Đồn",
    "districtId": 20707,
    "districtName": "Huyện Chợ Đồn",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20707072",
    "wardName": "Xã Yên Phong",
    "districtId": 20707,
    "districtName": "Huyện Chợ Đồn",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20707073",
    "wardName": "Xã Nghĩa Tá",
    "districtId": 20707,
    "districtName": "Huyện Chợ Đồn",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20711074",
    "wardName": "Xã Phủ Thông",
    "districtId": 20711,
    "districtName": "Huyện Bạch Thông",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20711075",
    "wardName": "Xã Cẩm Giàng",
    "districtId": 20711,
    "districtName": "Huyện Bạch Thông",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20711076",
    "wardName": "Xã Vĩnh Thông",
    "districtId": 20711,
    "districtName": "Huyện Bạch Thông",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20711077",
    "wardName": "Xã Bạch Thông",
    "districtId": 20711,
    "districtName": "Huyện Bạch Thông",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20701078",
    "wardName": "Xã Phong Quang",
    "districtId": 20701,
    "districtName": "Thành phố Bắc Kạn",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20701079",
    "wardName": "Phường Đức Xuân",
    "districtId": 20701,
    "districtName": "Thành phố Bắc Kạn",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20701080",
    "wardName": "Phường Bắc Kạn",
    "districtId": 20701,
    "districtName": "Thành phố Bắc Kạn",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20709081",
    "wardName": "Xã Văn Lang",
    "districtId": 20709,
    "districtName": "Huyện Na Rì",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20709082",
    "wardName": "Xã Cường Lợi",
    "districtId": 20709,
    "districtName": "Huyện Na Rì",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20709083",
    "wardName": "Xã Na Rì",
    "districtId": 20709,
    "districtName": "Huyện Na Rì",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20709084",
    "wardName": "Xã Trần Phú",
    "districtId": 20709,
    "districtName": "Huyện Na Rì",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20709085",
    "wardName": "Xã Côn Minh",
    "districtId": 20709,
    "districtName": "Huyện Na Rì",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20709086",
    "wardName": "Xã Xuân Dương",
    "districtId": 20709,
    "districtName": "Huyện Na Rì",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20713087",
    "wardName": "Xã Tân Kỳ",
    "districtId": 20713,
    "districtName": "Huyện Chợ Mới",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20713088",
    "wardName": "Xã Thanh Mai",
    "districtId": 20713,
    "districtName": "Huyện Chợ Mới",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20713089",
    "wardName": "Xã Thanh Thịnh",
    "districtId": 20713,
    "districtName": "Huyện Chợ Mới",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20713090",
    "wardName": "Xã Chợ Mới",
    "districtId": 20713,
    "districtName": "Huyện Chợ Mới",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "21507091",
    "wardName": "Xã Sảng Mộc",
    "districtId": 21507,
    "districtName": "Huyện Võ Nhai",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20705092",
    "wardName": "Xã Thượng Quan",
    "districtId": 20705,
    "districtName": "Huyện Ngân Sơn",
    "provinceId": 10,
    "provinceName": "Tỉnh Thái Nguyên"
  },
  {
    "wardId": "20903001",
    "wardName": "Xã Thất Khê",
    "districtId": 20903,
    "districtName": "Huyện Tràng Định",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20903002",
    "wardName": "Xã Đoàn Kết",
    "districtId": 20903,
    "districtName": "Huyện Tràng Định",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20903003",
    "wardName": "Xã Tân Tiến",
    "districtId": 20903,
    "districtName": "Huyện Tràng Định",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20903004",
    "wardName": "Xã Tràng Định",
    "districtId": 20903,
    "districtName": "Huyện Tràng Định",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20903005",
    "wardName": "Xã Quốc Khánh",
    "districtId": 20903,
    "districtName": "Huyện Tràng Định",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20903006",
    "wardName": "Xã Kháng Chiến",
    "districtId": 20903,
    "districtName": "Huyện Tràng Định",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20903007",
    "wardName": "Xã Quốc Việt",
    "districtId": 20903,
    "districtName": "Huyện Tràng Định",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20907008",
    "wardName": "Xã Bình Gia",
    "districtId": 20907,
    "districtName": "Huyện Bình Gia",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20907009",
    "wardName": "Xã Tân Văn",
    "districtId": 20907,
    "districtName": "Huyện Bình Gia",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20907010",
    "wardName": "Xã Hồng Phong",
    "districtId": 20907,
    "districtName": "Huyện Bình Gia",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20907011",
    "wardName": "Xã Hoa Thám",
    "districtId": 20907,
    "districtName": "Huyện Bình Gia",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20907012",
    "wardName": "Xã Quý Hoà",
    "districtId": 20907,
    "districtName": "Huyện Bình Gia",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20907013",
    "wardName": "Xã Thiện Hoà",
    "districtId": 20907,
    "districtName": "Huyện Bình Gia",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20907014",
    "wardName": "Xã Thiện Thuật",
    "districtId": 20907,
    "districtName": "Huyện Bình Gia",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20907015",
    "wardName": "Xã Thiện Long",
    "districtId": 20907,
    "districtName": "Huyện Bình Gia",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20909016",
    "wardName": "Xã Bắc Sơn",
    "districtId": 20909,
    "districtName": "Huyện Bắc Sơn",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20909017",
    "wardName": "Xã Hưng Vũ",
    "districtId": 20909,
    "districtName": "Huyện Bắc Sơn",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20909018",
    "wardName": "Xã Vũ Lăng",
    "districtId": 20909,
    "districtName": "Huyện Bắc Sơn",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20909019",
    "wardName": "Xã Nhất Hoà",
    "districtId": 20909,
    "districtName": "Huyện Bắc Sơn",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20909020",
    "wardName": "Xã Vũ Lễ",
    "districtId": 20909,
    "districtName": "Huyện Bắc Sơn",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20909021",
    "wardName": "Xã Tân Tri",
    "districtId": 20909,
    "districtName": "Huyện Bắc Sơn",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20911022",
    "wardName": "Xã Văn Quan",
    "districtId": 20911,
    "districtName": "Huyện Văn Quan",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20911023",
    "wardName": "Xã Điềm He",
    "districtId": 20911,
    "districtName": "Huyện Văn Quan",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20911024",
    "wardName": "Xã Tri Lễ",
    "districtId": 20911,
    "districtName": "Huyện Văn Quan",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20911025",
    "wardName": "Xã Yên Phúc",
    "districtId": 20911,
    "districtName": "Huyện Văn Quan",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20911026",
    "wardName": "Xã Tân Đoàn",
    "districtId": 20911,
    "districtName": "Huyện Văn Quan",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20913027",
    "wardName": "Xã Khánh Khê",
    "districtId": 20913,
    "districtName": "Huyện Cao Lộc",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20905028",
    "wardName": "Xã Na Sầm",
    "districtId": 20905,
    "districtName": "Huyện Văn Lãng",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20905029",
    "wardName": "Xã Văn Lãng",
    "districtId": 20905,
    "districtName": "Huyện Văn Lãng",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20905030",
    "wardName": "Xã Hội Hoan",
    "districtId": 20905,
    "districtName": "Huyện Văn Lãng",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20905031",
    "wardName": "Xã Thụy Hùng",
    "districtId": 20905,
    "districtName": "Huyện Văn Lãng",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20905032",
    "wardName": "Xã Hoàng Văn Thụ",
    "districtId": 20905,
    "districtName": "Huyện Văn Lãng",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20915033",
    "wardName": "Xã Lộc Bình",
    "districtId": 20915,
    "districtName": "Huyện Lộc Bình",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20915034",
    "wardName": "Xã Mẫu Sơn",
    "districtId": 20915,
    "districtName": "Huyện Lộc Bình",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20915035",
    "wardName": "Xã Na Dương",
    "districtId": 20915,
    "districtName": "Huyện Lộc Bình",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20915036",
    "wardName": "Xã Lợi Bác",
    "districtId": 20915,
    "districtName": "Huyện Lộc Bình",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20915037",
    "wardName": "Xã Thống Nhất",
    "districtId": 20915,
    "districtName": "Huyện Lộc Bình",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20915038",
    "wardName": "Xã Xuân Dương",
    "districtId": 20915,
    "districtName": "Huyện Lộc Bình",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20915039",
    "wardName": "Xã Khuất Xá",
    "districtId": 20915,
    "districtName": "Huyện Lộc Bình",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20919040",
    "wardName": "Xã Đình Lập",
    "districtId": 20919,
    "districtName": "Huyện Đình Lập",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20919041",
    "wardName": "Xã Châu Sơn",
    "districtId": 20919,
    "districtName": "Huyện Đình Lập",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20919042",
    "wardName": "Xã Kiên Mộc",
    "districtId": 20919,
    "districtName": "Huyện Đình Lập",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20919043",
    "wardName": "Xã Thái Bình",
    "districtId": 20919,
    "districtName": "Huyện Đình Lập",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20921044",
    "wardName": "Xã Hữu Lũng",
    "districtId": 20921,
    "districtName": "Huyện Hữu Lũng",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20921045",
    "wardName": "Xã Tuấn Sơn",
    "districtId": 20921,
    "districtName": "Huyện Hữu Lũng",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20921046",
    "wardName": "Xã Tân Thành",
    "districtId": 20921,
    "districtName": "Huyện Hữu Lũng",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20921047",
    "wardName": "Xã Vân Nham",
    "districtId": 20921,
    "districtName": "Huyện Hữu Lũng",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20921048",
    "wardName": "Xã Thiện Tân",
    "districtId": 20921,
    "districtName": "Huyện Hữu Lũng",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20921049",
    "wardName": "Xã Yên Bình",
    "districtId": 20921,
    "districtName": "Huyện Hữu Lũng",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20921050",
    "wardName": "Xã Hữu Liên",
    "districtId": 20921,
    "districtName": "Huyện Hữu Lũng",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20921051",
    "wardName": "Xã Cai Kinh",
    "districtId": 20921,
    "districtName": "Huyện Hữu Lũng",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20917052",
    "wardName": "Xã Chi Lăng",
    "districtId": 20917,
    "districtName": "Huyện Chi Lăng",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20917053",
    "wardName": "Xã Nhân Lý",
    "districtId": 20917,
    "districtName": "Huyện Chi Lăng",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20917054",
    "wardName": "Xã Chiến Thắng",
    "districtId": 20917,
    "districtName": "Huyện Chi Lăng",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20917055",
    "wardName": "Xã Quan Sơn",
    "districtId": 20917,
    "districtName": "Huyện Chi Lăng",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20917056",
    "wardName": "Xã Bằng Mạc",
    "districtId": 20917,
    "districtName": "Huyện Chi Lăng",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20917057",
    "wardName": "Xã Vạn Linh",
    "districtId": 20917,
    "districtName": "Huyện Chi Lăng",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20913058",
    "wardName": "Xã Đồng Đăng",
    "districtId": 20913,
    "districtName": "Huyện Cao Lộc",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20913059",
    "wardName": "Xã Cao Lộc",
    "districtId": 20913,
    "districtName": "Huyện Cao Lộc",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20913060",
    "wardName": "Xã Công Sơn",
    "districtId": 20913,
    "districtName": "Huyện Cao Lộc",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20913061",
    "wardName": "Xã Ba Sơn",
    "districtId": 20913,
    "districtName": "Huyện Cao Lộc",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20901062",
    "wardName": "Phường Tam Thanh",
    "districtId": 20901,
    "districtName": "Thành phố Lạng Sơn",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20901063",
    "wardName": "Phường Lương Văn Tri",
    "districtId": 20901,
    "districtName": "Thành phố Lạng Sơn",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20913064",
    "wardName": "Phường Kỳ Lừa",
    "districtId": 20913,
    "districtName": "Huyện Cao Lộc",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "20901065",
    "wardName": "Phường Đông Kinh",
    "districtId": 20901,
    "districtName": "Thành phố Lạng Sơn",
    "provinceId": 11,
    "provinceName": "Tỉnh Lạng Sơn"
  },
  {
    "wardId": "21701001",
    "wardName": "Phường Việt Trì",
    "districtId": 21701,
    "districtName": "Thành phố Việt Trì",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21701002",
    "wardName": "Phường Nông Trang",
    "districtId": 21701,
    "districtName": "Thành phố Việt Trì",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21701003",
    "wardName": "Phường Thanh Miếu",
    "districtId": 21701,
    "districtName": "Thành phố Việt Trì",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21701004",
    "wardName": "Phường Vân Phú",
    "districtId": 21701,
    "districtName": "Thành phố Việt Trì",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21701005",
    "wardName": "Xã Hy Cương",
    "districtId": 21701,
    "districtName": "Thành phố Việt Trì",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21721006",
    "wardName": "Xã Lâm Thao",
    "districtId": 21721,
    "districtName": "Huyện Lâm Thao",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21721007",
    "wardName": "Xã Xuân Lũng",
    "districtId": 21721,
    "districtName": "Huyện Lâm Thao",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21721008",
    "wardName": "Xã Phùng Nguyên",
    "districtId": 21721,
    "districtName": "Huyện Lâm Thao",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21721009",
    "wardName": "Xã Bản Nguyên",
    "districtId": 21721,
    "districtName": "Huyện Lâm Thao",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21703010",
    "wardName": "Phường Phong Châu",
    "districtId": 21703,
    "districtName": "Thị xã Phú Thọ",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21703011",
    "wardName": "Phường Phú Thọ",
    "districtId": 21703,
    "districtName": "Thị xã Phú Thọ",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21703012",
    "wardName": "Phường Âu Cơ",
    "districtId": 21703,
    "districtName": "Thị xã Phú Thọ",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21711013",
    "wardName": "Xã Phù Ninh",
    "districtId": 21711,
    "districtName": "Huyện Phù Ninh",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21711014",
    "wardName": "Xã Dân Chủ",
    "districtId": 21711,
    "districtName": "Huyện Phù Ninh",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21711015",
    "wardName": "Xã Phú Mỹ",
    "districtId": 21711,
    "districtName": "Huyện Phù Ninh",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21711016",
    "wardName": "Xã Trạm Thản",
    "districtId": 21711,
    "districtName": "Huyện Phù Ninh",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21711017",
    "wardName": "Xã Bình Phú",
    "districtId": 21711,
    "districtName": "Huyện Phù Ninh",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21709018",
    "wardName": "Xã Thanh Ba",
    "districtId": 21709,
    "districtName": "Huyện Thanh Ba",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21709019",
    "wardName": "Xã Quảng Yên",
    "districtId": 21709,
    "districtName": "Huyện Thanh Ba",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21709020",
    "wardName": "Xã Hoàng Cương",
    "districtId": 21709,
    "districtName": "Huyện Thanh Ba",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21709021",
    "wardName": "Xã Đông Thành",
    "districtId": 21709,
    "districtName": "Huyện Thanh Ba",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21709022",
    "wardName": "Xã Chí Tiên",
    "districtId": 21709,
    "districtName": "Huyện Thanh Ba",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21709023",
    "wardName": "Xã Liên Minh",
    "districtId": 21709,
    "districtName": "Huyện Thanh Ba",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21705024",
    "wardName": "Xã Đoan Hùng",
    "districtId": 21705,
    "districtName": "Huyện Đoan Hùng",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21705025",
    "wardName": "Xã Tây Cốc",
    "districtId": 21705,
    "districtName": "Huyện Đoan Hùng",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21705026",
    "wardName": "Xã Chân Mộng",
    "districtId": 21705,
    "districtName": "Huyện Đoan Hùng",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21705027",
    "wardName": "Xã Chí Đám",
    "districtId": 21705,
    "districtName": "Huyện Đoan Hùng",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21705028",
    "wardName": "Xã Bằng Luân",
    "districtId": 21705,
    "districtName": "Huyện Đoan Hùng",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21707029",
    "wardName": "Xã Hạ Hòa",
    "districtId": 21707,
    "districtName": "Huyện Hạ Hoà",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21707030",
    "wardName": "Xã Đan Thượng",
    "districtId": 21707,
    "districtName": "Huyện Hạ Hoà",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21707031",
    "wardName": "Xã Yên Kỳ",
    "districtId": 21707,
    "districtName": "Huyện Hạ Hoà",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21707032",
    "wardName": "Xã Vĩnh Chân",
    "districtId": 21707,
    "districtName": "Huyện Hạ Hoà",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21707033",
    "wardName": "Xã Văn Lang",
    "districtId": 21707,
    "districtName": "Huyện Hạ Hoà",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21707034",
    "wardName": "Xã Hiền Lương",
    "districtId": 21707,
    "districtName": "Huyện Hạ Hoà",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21713035",
    "wardName": "Xã Cẩm Khê",
    "districtId": 21713,
    "districtName": "Huyện Cẩm Khê",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21713036",
    "wardName": "Xã Phú Khê",
    "districtId": 21713,
    "districtName": "Huyện Cẩm Khê",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21713037",
    "wardName": "Xã Hùng Việt",
    "districtId": 21713,
    "districtName": "Huyện Cẩm Khê",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21713038",
    "wardName": "Xã Đồng Lương",
    "districtId": 21713,
    "districtName": "Huyện Cẩm Khê",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21713039",
    "wardName": "Xã Tiên Lương",
    "districtId": 21713,
    "districtName": "Huyện Cẩm Khê",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21713040",
    "wardName": "Xã Vân Bán",
    "districtId": 21713,
    "districtName": "Huyện Cẩm Khê",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21717041",
    "wardName": "Xã Tam Nông",
    "districtId": 21717,
    "districtName": "Huyện Tam Nông",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21717042",
    "wardName": "Xã Thọ Văn",
    "districtId": 21717,
    "districtName": "Huyện Tam Nông",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21717043",
    "wardName": "Xã Vạn Xuân",
    "districtId": 21717,
    "districtName": "Huyện Tam Nông",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21717044",
    "wardName": "Xã Hiền Quan",
    "districtId": 21717,
    "districtName": "Huyện Tam Nông",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21723045",
    "wardName": "Xã Thanh Thuỷ",
    "districtId": 21723,
    "districtName": "Huyện Thanh Thuỷ",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21723046",
    "wardName": "Xã Đào Xá",
    "districtId": 21723,
    "districtName": "Huyện Thanh Thuỷ",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21723047",
    "wardName": "Xã Tu Vũ",
    "districtId": 21723,
    "districtName": "Huyện Thanh Thuỷ",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21719048",
    "wardName": "Xã Thanh Sơn",
    "districtId": 21719,
    "districtName": "Huyện Thanh Sơn",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21719049",
    "wardName": "Xã Võ Miếu",
    "districtId": 21719,
    "districtName": "Huyện Thanh Sơn",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21719050",
    "wardName": "Xã Văn Miếu",
    "districtId": 21719,
    "districtName": "Huyện Thanh Sơn",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21719051",
    "wardName": "Xã Cự Đồng",
    "districtId": 21719,
    "districtName": "Huyện Thanh Sơn",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21719052",
    "wardName": "Xã Hương Cần",
    "districtId": 21719,
    "districtName": "Huyện Thanh Sơn",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21719053",
    "wardName": "Xã Yên Sơn",
    "districtId": 21719,
    "districtName": "Huyện Thanh Sơn",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21719054",
    "wardName": "Xã Khả Cửu",
    "districtId": 21719,
    "districtName": "Huyện Thanh Sơn",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21720055",
    "wardName": "Xã Tân Sơn",
    "districtId": 21720,
    "districtName": "Huyện Tân Sơn",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21720056",
    "wardName": "Xã Minh Đài",
    "districtId": 21720,
    "districtName": "Huyện Tân Sơn",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21720057",
    "wardName": "Xã Lai Đồng",
    "districtId": 21720,
    "districtName": "Huyện Tân Sơn",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21720058",
    "wardName": "Xã Thu Cúc",
    "districtId": 21720,
    "districtName": "Huyện Tân Sơn",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21720059",
    "wardName": "Xã Xuân Đài",
    "districtId": 21720,
    "districtName": "Huyện Tân Sơn",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21720060",
    "wardName": "Xã Long Cốc",
    "districtId": 21720,
    "districtName": "Huyện Tân Sơn",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21715061",
    "wardName": "Xã Yên Lập",
    "districtId": 21715,
    "districtName": "Huyện Yên Lập",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21715062",
    "wardName": "Xã Thượng Long",
    "districtId": 21715,
    "districtName": "Huyện Yên Lập",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21715063",
    "wardName": "Xã Sơn Lương",
    "districtId": 21715,
    "districtName": "Huyện Yên Lập",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21715064",
    "wardName": "Xã Xuân Viên",
    "districtId": 21715,
    "districtName": "Huyện Yên Lập",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21715065",
    "wardName": "Xã Minh Hòa",
    "districtId": 21715,
    "districtName": "Huyện Yên Lập",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21715066",
    "wardName": "Xã Trung Sơn",
    "districtId": 21715,
    "districtName": "Huyện Yên Lập",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21915067",
    "wardName": "Xã Tam Sơn",
    "districtId": 21915,
    "districtName": "Huyện Sông Lô",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21915068",
    "wardName": "Xã Sông Lô",
    "districtId": 21915,
    "districtName": "Huyện Sông Lô",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21915069",
    "wardName": "Xã Hải Lựu",
    "districtId": 21915,
    "districtName": "Huyện Sông Lô",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21915070",
    "wardName": "Xã Yên Lãng",
    "districtId": 21915,
    "districtName": "Huyện Sông Lô",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21903071",
    "wardName": "Xã Lập Thạch",
    "districtId": 21903,
    "districtName": "Huyện Lập Thạch",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21903072",
    "wardName": "Xã Tiên Lữ",
    "districtId": 21903,
    "districtName": "Huyện Lập Thạch",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21903073",
    "wardName": "Xã Thái Hòa",
    "districtId": 21903,
    "districtName": "Huyện Lập Thạch",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21903074",
    "wardName": "Xã Liên Hòa",
    "districtId": 21903,
    "districtName": "Huyện Lập Thạch",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21903075",
    "wardName": "Xã Hợp Lý",
    "districtId": 21903,
    "districtName": "Huyện Lập Thạch",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21903076",
    "wardName": "Xã Sơn Đông",
    "districtId": 21903,
    "districtName": "Huyện Lập Thạch",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21904077",
    "wardName": "Xã Tam Đảo",
    "districtId": 21904,
    "districtName": "Huyện Tam Đảo",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21904078",
    "wardName": "Xã Đại Đình",
    "districtId": 21904,
    "districtName": "Huyện Tam Đảo",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21904079",
    "wardName": "Xã Đạo Trù",
    "districtId": 21904,
    "districtName": "Huyện Tam Đảo",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21905080",
    "wardName": "Xã Tam Dương",
    "districtId": 21905,
    "districtName": "Huyện Tam Dương",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21905081",
    "wardName": "Xã Hội Thịnh",
    "districtId": 21905,
    "districtName": "Huyện Tam Dương",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21905082",
    "wardName": "Xã Hoàng An",
    "districtId": 21905,
    "districtName": "Huyện Tam Dương",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21905083",
    "wardName": "Xã Tam Dương Bắc",
    "districtId": 21905,
    "districtName": "Huyện Tam Dương",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21907084",
    "wardName": "Xã Vĩnh Tường",
    "districtId": 21907,
    "districtName": "Huyện Vĩnh Tường",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21907085",
    "wardName": "Xã Thổ Tang",
    "districtId": 21907,
    "districtName": "Huyện Vĩnh Tường",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21907086",
    "wardName": "Xã Vĩnh Hưng",
    "districtId": 21907,
    "districtName": "Huyện Vĩnh Tường",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21907087",
    "wardName": "Xã Vĩnh An",
    "districtId": 21907,
    "districtName": "Huyện Vĩnh Tường",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21907088",
    "wardName": "Xã Vĩnh Phú",
    "districtId": 21907,
    "districtName": "Huyện Vĩnh Tường",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21907089",
    "wardName": "Xã Vĩnh Thành",
    "districtId": 21907,
    "districtName": "Huyện Vĩnh Tường",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21909090",
    "wardName": "Xã Yên Lạc",
    "districtId": 21909,
    "districtName": "Huyện Yên Lạc",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21909091",
    "wardName": "Xã Tề Lỗ",
    "districtId": 21909,
    "districtName": "Huyện Yên Lạc",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21909092",
    "wardName": "Xã Liên Châu",
    "districtId": 21909,
    "districtName": "Huyện Yên Lạc",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21909093",
    "wardName": "Xã Tam Hồng",
    "districtId": 21909,
    "districtName": "Huyện Yên Lạc",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21909094",
    "wardName": "Xã Nguyệt Đức",
    "districtId": 21909,
    "districtName": "Huyện Yên Lạc",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21913095",
    "wardName": "Xã Bình Nguyên",
    "districtId": 21913,
    "districtName": "Huyện Bình Xuyên",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21913096",
    "wardName": "Xã Xuân Lãng",
    "districtId": 21913,
    "districtName": "Huyện Bình Xuyên",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21913097",
    "wardName": "Xã Bình Xuyên",
    "districtId": 21913,
    "districtName": "Huyện Bình Xuyên",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21913098",
    "wardName": "Xã Bình Tuyền",
    "districtId": 21913,
    "districtName": "Huyện Bình Xuyên",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21901099",
    "wardName": "Phường Vĩnh Phúc",
    "districtId": 21901,
    "districtName": "Thành phố Vĩnh Yên",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21901100",
    "wardName": "Phường Vĩnh Yên",
    "districtId": 21901,
    "districtName": "Thành phố Vĩnh Yên",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21902101",
    "wardName": "Phường Phúc Yên",
    "districtId": 21902,
    "districtName": "Thành phố Phúc Yên",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "21902102",
    "wardName": "Phường Xuân Hòa",
    "districtId": 21902,
    "districtName": "Thành phố Phúc Yên",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30510103",
    "wardName": "Xã Cao Phong",
    "districtId": 30510,
    "districtName": "Huyện Cao Phong",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30510104",
    "wardName": "Xã Mường Thàng",
    "districtId": 30510,
    "districtName": "Huyện Cao Phong",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30510105",
    "wardName": "Xã Thung Nai",
    "districtId": 30510,
    "districtName": "Huyện Cao Phong",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30503106",
    "wardName": "Xã Đà Bắc",
    "districtId": 30503,
    "districtName": "Huyện Đà Bắc",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30503107",
    "wardName": "Xã Cao Sơn",
    "districtId": 30503,
    "districtName": "Huyện Đà Bắc",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30503108",
    "wardName": "Xã Đức Nhàn",
    "districtId": 30503,
    "districtName": "Huyện Đà Bắc",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30503109",
    "wardName": "Xã Quy Đức",
    "districtId": 30503,
    "districtName": "Huyện Đà Bắc",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30503110",
    "wardName": "Xã Tân Pheo",
    "districtId": 30503,
    "districtName": "Huyện Đà Bắc",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30503111",
    "wardName": "Xã Tiền Phong",
    "districtId": 30503,
    "districtName": "Huyện Đà Bắc",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30511112",
    "wardName": "Xã Kim Bôi",
    "districtId": 30511,
    "districtName": "Huyện Kim Bôi",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30511113",
    "wardName": "Xã Mường Động",
    "districtId": 30511,
    "districtName": "Huyện Kim Bôi",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30511114",
    "wardName": "Xã Dũng Tiến",
    "districtId": 30511,
    "districtName": "Huyện Kim Bôi",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30511115",
    "wardName": "Xã Hợp Kim",
    "districtId": 30511,
    "districtName": "Huyện Kim Bôi",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30511116",
    "wardName": "Xã Nật Sơn",
    "districtId": 30511,
    "districtName": "Huyện Kim Bôi",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30515117",
    "wardName": "Xã Lạc Sơn",
    "districtId": 30515,
    "districtName": "Huyện Lạc Sơn",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30515118",
    "wardName": "Xã Mường Vang",
    "districtId": 30515,
    "districtName": "Huyện Lạc Sơn",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30515119",
    "wardName": "Xã Đại Đồng",
    "districtId": 30515,
    "districtName": "Huyện Lạc Sơn",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30515120",
    "wardName": "Xã Ngọc Sơn",
    "districtId": 30515,
    "districtName": "Huyện Lạc Sơn",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30515121",
    "wardName": "Xã Nhân Nghĩa",
    "districtId": 30515,
    "districtName": "Huyện Lạc Sơn",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30515122",
    "wardName": "Xã Quyết Thắng",
    "districtId": 30515,
    "districtName": "Huyện Lạc Sơn",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30515123",
    "wardName": "Xã Thượng Cốc",
    "districtId": 30515,
    "districtName": "Huyện Lạc Sơn",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30515124",
    "wardName": "Xã Yên Phú",
    "districtId": 30515,
    "districtName": "Huyện Lạc Sơn",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30517125",
    "wardName": "Xã Lạc Thủy",
    "districtId": 30517,
    "districtName": "Huyện Lạc Thuỷ",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30517126",
    "wardName": "Xã An Bình",
    "districtId": 30517,
    "districtName": "Huyện Lạc Thuỷ",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30517127",
    "wardName": "Xã An Nghĩa",
    "districtId": 30517,
    "districtName": "Huyện Lạc Thuỷ",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30509128",
    "wardName": "Xã Lương Sơn",
    "districtId": 30509,
    "districtName": "Huyện Lương Sơn",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30509129",
    "wardName": "Xã Cao Dương",
    "districtId": 30509,
    "districtName": "Huyện Lương Sơn",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30509130",
    "wardName": "Xã Liên Sơn",
    "districtId": 30509,
    "districtName": "Huyện Lương Sơn",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30505131",
    "wardName": "Xã Mai Châu",
    "districtId": 30505,
    "districtName": "Huyện Mai Châu",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30505132",
    "wardName": "Xã Bao La",
    "districtId": 30505,
    "districtName": "Huyện Mai Châu",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30505133",
    "wardName": "Xã Mai Hạ",
    "districtId": 30505,
    "districtName": "Huyện Mai Châu",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30505134",
    "wardName": "Xã Pà Cò",
    "districtId": 30505,
    "districtName": "Huyện Mai Châu",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30505135",
    "wardName": "Xã Tân Mai",
    "districtId": 30505,
    "districtName": "Huyện Mai Châu",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30513136",
    "wardName": "Xã Tân Lạc",
    "districtId": 30513,
    "districtName": "Huyện Tân Lạc",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30513137",
    "wardName": "Xã Mường Bi",
    "districtId": 30513,
    "districtName": "Huyện Tân Lạc",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30513138",
    "wardName": "Xã Mường Hoa",
    "districtId": 30513,
    "districtName": "Huyện Tân Lạc",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30513139",
    "wardName": "Xã Toàn Thắng",
    "districtId": 30513,
    "districtName": "Huyện Tân Lạc",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30513140",
    "wardName": "Xã Vân Sơn",
    "districtId": 30513,
    "districtName": "Huyện Tân Lạc",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30519141",
    "wardName": "Xã Yên Thủy",
    "districtId": 30519,
    "districtName": "Huyện Yên Thuỷ",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30519142",
    "wardName": "Xã Lạc Lương",
    "districtId": 30519,
    "districtName": "Huyện Yên Thuỷ",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30519143",
    "wardName": "Xã Yên Trị",
    "districtId": 30519,
    "districtName": "Huyện Yên Thuỷ",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30501144",
    "wardName": "Xã Thịnh Minh",
    "districtId": 30501,
    "districtName": "Thành phố Hoà Bình",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30501145",
    "wardName": "Phường Hoà Bình",
    "districtId": 30501,
    "districtName": "Thành phố Hoà Bình",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30501146",
    "wardName": "Phường Kỳ Sơn",
    "districtId": 30501,
    "districtName": "Thành phố Hoà Bình",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30501147",
    "wardName": "Phường Tân Hoà",
    "districtId": 30501,
    "districtName": "Thành phố Hoà Bình",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30501148",
    "wardName": "Phường Thống Nhất",
    "districtId": 30501,
    "districtName": "Thành phố Hoà Bình",
    "provinceId": 12,
    "provinceName": "Tỉnh Phú Thọ"
  },
  {
    "wardId": "30101001",
    "wardName": "Xã Mường Phăng",
    "districtId": 30101,
    "districtName": "TP.Điện Biên Phủ",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30101002",
    "wardName": "Phường Điện Biên Phủ",
    "districtId": 30101,
    "districtName": "TP.Điện Biên Phủ",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30101003",
    "wardName": "Phường Mường Thanh",
    "districtId": 30101,
    "districtName": "TP.Điện Biên Phủ",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30103004",
    "wardName": "Phường Mường Lay",
    "districtId": 30103,
    "districtName": "Thị xã Mường Lay",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30117005",
    "wardName": "Xã Thanh Nưa",
    "districtId": 30117,
    "districtName": "Huyện Điện Biên",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30117006",
    "wardName": "Xã Thanh An",
    "districtId": 30117,
    "districtName": "Huyện Điện Biên",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30117007",
    "wardName": "Xã Thanh Yên",
    "districtId": 30117,
    "districtName": "Huyện Điện Biên",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30117008",
    "wardName": "Xã Sam Mứn",
    "districtId": 30117,
    "districtName": "Huyện Điện Biên",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30117009",
    "wardName": "Xã Núa Ngam",
    "districtId": 30117,
    "districtName": "Huyện Điện Biên",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30117010",
    "wardName": "Xã Mường Nhà",
    "districtId": 30117,
    "districtName": "Huyện Điện Biên",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30115011",
    "wardName": "Xã Tuần Giáo",
    "districtId": 30115,
    "districtName": "Huyện Tuần Giáo",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30115012",
    "wardName": "Xã Quài Tở",
    "districtId": 30115,
    "districtName": "Huyện Tuần Giáo",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30115013",
    "wardName": "Xã Mường Mùn",
    "districtId": 30115,
    "districtName": "Huyện Tuần Giáo",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30115014",
    "wardName": "Xã Pú Nhung",
    "districtId": 30115,
    "districtName": "Huyện Tuần Giáo",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30115015",
    "wardName": "Xã Chiềng Sinh",
    "districtId": 30115,
    "districtName": "Huyện Tuần Giáo",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30113016",
    "wardName": "Xã Tủa Chùa",
    "districtId": 30113,
    "districtName": "Huyện Tủa Chùa",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30113017",
    "wardName": "Xã Sín Chải",
    "districtId": 30113,
    "districtName": "Huyện Tủa Chùa",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30113018",
    "wardName": "Xã Sính Phình",
    "districtId": 30113,
    "districtName": "Huyện Tủa Chùa",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30113019",
    "wardName": "Xã Tủa Thàng",
    "districtId": 30113,
    "districtName": "Huyện Tủa Chùa",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30113020",
    "wardName": "Xã Sáng Nhè",
    "districtId": 30113,
    "districtName": "Huyện Tủa Chùa",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30111021",
    "wardName": "Xã Na Sang",
    "districtId": 30111,
    "districtName": "Huyện Mường Chà",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30111022",
    "wardName": "Xã Mường Tùng",
    "districtId": 30111,
    "districtName": "Huyện Mường Chà",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30111023",
    "wardName": "Xã Pa Ham",
    "districtId": 30111,
    "districtName": "Huyện Mường Chà",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30111024",
    "wardName": "Xã Nậm Nèn",
    "districtId": 30111,
    "districtName": "Huyện Mường Chà",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30111025",
    "wardName": "Xã Mường Pồn",
    "districtId": 30111,
    "districtName": "Huyện Mường Chà",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30119026",
    "wardName": "Xã Na Son",
    "districtId": 30119,
    "districtName": "Huyện Điện Biên Đông",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30119027",
    "wardName": "Xã Xa Dung",
    "districtId": 30119,
    "districtName": "Huyện Điện Biên Đông",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30119028",
    "wardName": "Xã Pu Nhi",
    "districtId": 30119,
    "districtName": "Huyện Điện Biên Đông",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30119029",
    "wardName": "Xã Mường Luân",
    "districtId": 30119,
    "districtName": "Huyện Điện Biên Đông",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30119030",
    "wardName": "Xã Tìa Dình",
    "districtId": 30119,
    "districtName": "Huyện Điện Biên Đông",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30119031",
    "wardName": "Xã Phình Giàng",
    "districtId": 30119,
    "districtName": "Huyện Điện Biên Đông",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30123032",
    "wardName": "Xã Mường Chà",
    "districtId": 30123,
    "districtName": "Huyện Nậm Pồ",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30123033",
    "wardName": "Xã Nà Hỳ",
    "districtId": 30123,
    "districtName": "Huyện Nậm Pồ",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30123034",
    "wardName": "Xã Nà Bủng",
    "districtId": 30123,
    "districtName": "Huyện Nậm Pồ",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30123035",
    "wardName": "Xã Chà Tở",
    "districtId": 30123,
    "districtName": "Huyện Nậm Pồ",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30123036",
    "wardName": "Xã Si Pa Phìn",
    "districtId": 30123,
    "districtName": "Huyện Nậm Pồ",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30104037",
    "wardName": "Xã Mường Nhé",
    "districtId": 30104,
    "districtName": "Huyện Mường Nhé",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30104038",
    "wardName": "Xã Sín Thầu",
    "districtId": 30104,
    "districtName": "Huyện Mường Nhé",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30104039",
    "wardName": "Xã Mường Toong",
    "districtId": 30104,
    "districtName": "Huyện Mường Nhé",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30104040",
    "wardName": "Xã Nậm Kè",
    "districtId": 30104,
    "districtName": "Huyện Mường Nhé",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30104041",
    "wardName": "Xã Quảng Lâm",
    "districtId": 30104,
    "districtName": "Huyện Mường Nhé",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30121042",
    "wardName": "Xã Mường Ảng",
    "districtId": 30121,
    "districtName": "Huyện Mường Ảng",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30121043",
    "wardName": "Xã Nà Tấu",
    "districtId": 30121,
    "districtName": "Huyện Mường Ảng",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30121044",
    "wardName": "Xã Búng Lao",
    "districtId": 30121,
    "districtName": "Huyện Mường Ảng",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30121045",
    "wardName": "Xã Mường Lạn",
    "districtId": 30121,
    "districtName": "Huyện Mường Ảng",
    "provinceId": 13,
    "provinceName": "Tỉnh Điện Biên"
  },
  {
    "wardId": "30209001",
    "wardName": "Xã Mường Kim",
    "districtId": 30209,
    "districtName": "Huyện Than Uyên",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30209002",
    "wardName": "Xã Khoen On",
    "districtId": 30209,
    "districtName": "Huyện Than Uyên",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30209003",
    "wardName": "Xã Than Uyên",
    "districtId": 30209,
    "districtName": "Huyện Than Uyên",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30209004",
    "wardName": "Xã Mường Than",
    "districtId": 30209,
    "districtName": "Huyện Than Uyên",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30211005",
    "wardName": "Xã Pắc Ta",
    "districtId": 30211,
    "districtName": "Huyện Tân Uyên",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30211006",
    "wardName": "Xã Nậm Sỏ",
    "districtId": 30211,
    "districtName": "Huyện Tân Uyên",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30211007",
    "wardName": "Xã Tân Uyên",
    "districtId": 30211,
    "districtName": "Huyện Tân Uyên",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30211008",
    "wardName": "Xã Mường Khoa",
    "districtId": 30211,
    "districtName": "Huyện Tân Uyên",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30205009",
    "wardName": "Xã Bản Bo",
    "districtId": 30205,
    "districtName": "Huyện Tam Đường",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30205010",
    "wardName": "Xã Bình Lư",
    "districtId": 30205,
    "districtName": "Huyện Tam Đường",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30205011",
    "wardName": "Xã Tả Lèng",
    "districtId": 30205,
    "districtName": "Huyện Tam Đường",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30205012",
    "wardName": "Xã Khun Há",
    "districtId": 30205,
    "districtName": "Huyện Tam Đường",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30202013",
    "wardName": "Phường Tân Phong",
    "districtId": 30202,
    "districtName": "Thành phố Lai Châu",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30202014",
    "wardName": "Phường Đoàn Kết",
    "districtId": 30202,
    "districtName": "Thành phố Lai Châu",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30203015",
    "wardName": "Xã Sin Suối Hồ",
    "districtId": 30203,
    "districtName": "Huyện Phong Thổ",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30203016",
    "wardName": "Xã Phong Thổ",
    "districtId": 30203,
    "districtName": "Huyện Phong Thổ",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30203017",
    "wardName": "Xã Sì Lở Lầu",
    "districtId": 30203,
    "districtName": "Huyện Phong Thổ",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30203018",
    "wardName": "Xã Dào San",
    "districtId": 30203,
    "districtName": "Huyện Phong Thổ",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30203019",
    "wardName": "Xã Khổng Lào",
    "districtId": 30203,
    "districtName": "Huyện Phong Thổ",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30207020",
    "wardName": "Xã Tủa Sín Chải",
    "districtId": 30207,
    "districtName": "Huyện Sìn Hồ",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30207021",
    "wardName": "Xã Sìn Hồ",
    "districtId": 30207,
    "districtName": "Huyện Sìn Hồ",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30207022",
    "wardName": "Xã Hồng Thu",
    "districtId": 30207,
    "districtName": "Huyện Sìn Hồ",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30207023",
    "wardName": "Xã Nậm Tăm",
    "districtId": 30207,
    "districtName": "Huyện Sìn Hồ",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30207024",
    "wardName": "Xã Pu Sam Cáp",
    "districtId": 30207,
    "districtName": "Huyện Sìn Hồ",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30207025",
    "wardName": "Xã Nậm Cuổi",
    "districtId": 30207,
    "districtName": "Huyện Sìn Hồ",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30207026",
    "wardName": "Xã Nậm Mạ",
    "districtId": 30207,
    "districtName": "Huyện Sìn Hồ",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30213027",
    "wardName": "Xã Lê Lợi",
    "districtId": 30213,
    "districtName": "Huyện Nậm Nhùn",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30213028",
    "wardName": "Xã Nậm Hàng",
    "districtId": 30213,
    "districtName": "Huyện Nậm Nhùn",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30213029",
    "wardName": "Xã Mường Mô",
    "districtId": 30213,
    "districtName": "Huyện Nậm Nhùn",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30213030",
    "wardName": "Xã Hua Bum",
    "districtId": 30213,
    "districtName": "Huyện Nậm Nhùn",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30213031",
    "wardName": "Xã Pa Tần",
    "districtId": 30213,
    "districtName": "Huyện Nậm Nhùn",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30201032",
    "wardName": "Xã Bum Nưa",
    "districtId": 30201,
    "districtName": "Huyện Mường Tè",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30201033",
    "wardName": "Xã Bum Tở",
    "districtId": 30201,
    "districtName": "Huyện Mường Tè",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30201034",
    "wardName": "Xã Mường Tè",
    "districtId": 30201,
    "districtName": "Huyện Mường Tè",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30201035",
    "wardName": "Xã Thu Lũm",
    "districtId": 30201,
    "districtName": "Huyện Mường Tè",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30201036",
    "wardName": "Xã Pa Ủ",
    "districtId": 30201,
    "districtName": "Huyện Mường Tè",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30201037",
    "wardName": "Xã Tà Tổng",
    "districtId": 30201,
    "districtName": "Huyện Mường Tè",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30201038",
    "wardName": "Xã Mù Cả",
    "districtId": 30201,
    "districtName": "Huyện Mường Tè",
    "provinceId": 14,
    "provinceName": "Tỉnh Lai Châu"
  },
  {
    "wardId": "30301001",
    "wardName": "Phường Tô Hiệu",
    "districtId": 30301,
    "districtName": "Thành phố Sơn La",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30301002",
    "wardName": "Phường Chiềng An",
    "districtId": 30301,
    "districtName": "Thành phố Sơn La",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30301003",
    "wardName": "Phường Chiềng Cơi",
    "districtId": 30301,
    "districtName": "Thành phố Sơn La",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30301004",
    "wardName": "Phường Chiềng Sinh",
    "districtId": 30301,
    "districtName": "Thành phố Sơn La",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30319005",
    "wardName": "Phường Mộc Châu",
    "districtId": 30319,
    "districtName": "Thị xã Mộc Châu",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30319006",
    "wardName": "Phường Mộc Sơn",
    "districtId": 30319,
    "districtName": "Thị xã Mộc Châu",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30319007",
    "wardName": "Phường Vân Sơn",
    "districtId": 30319,
    "districtName": "Thị xã Mộc Châu",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30319008",
    "wardName": "Phường Thảo Nguyên",
    "districtId": 30319,
    "districtName": "Thị xã Mộc Châu",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30319009",
    "wardName": "Xã Đoàn Kết",
    "districtId": 30319,
    "districtName": "Thị xã Mộc Châu",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30319010",
    "wardName": "Xã Lóng Sập",
    "districtId": 30319,
    "districtName": "Thị xã Mộc Châu",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30319011",
    "wardName": "Xã Chiềng Sơn",
    "districtId": 30319,
    "districtName": "Thị xã Mộc Châu",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30323012",
    "wardName": "Xã Vân Hồ",
    "districtId": 30323,
    "districtName": "Huyện Vân Hồ",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30323013",
    "wardName": "Xã Song Khủa",
    "districtId": 30323,
    "districtName": "Huyện Vân Hồ",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30323014",
    "wardName": "Xã Tô Múa",
    "districtId": 30323,
    "districtName": "Huyện Vân Hồ",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30323015",
    "wardName": "Xã Xuân Nha",
    "districtId": 30323,
    "districtName": "Huyện Vân Hồ",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30303016",
    "wardName": "Xã Quỳnh Nhai",
    "districtId": 30303,
    "districtName": "Huyện Quỳnh Nhai",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30303017",
    "wardName": "Xã Mường Chiên",
    "districtId": 30303,
    "districtName": "Huyện Quỳnh Nhai",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30303018",
    "wardName": "Xã Mường Giôn",
    "districtId": 30303,
    "districtName": "Huyện Quỳnh Nhai",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30303019",
    "wardName": "Xã Mường Sại",
    "districtId": 30303,
    "districtName": "Huyện Quỳnh Nhai",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30307020",
    "wardName": "Xã Thuận Châu",
    "districtId": 30307,
    "districtName": "Huyện Thuận Châu",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30307021",
    "wardName": "Xã Chiềng La",
    "districtId": 30307,
    "districtName": "Huyện Thuận Châu",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30307022",
    "wardName": "Xã Nậm Lầu",
    "districtId": 30307,
    "districtName": "Huyện Thuận Châu",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30307023",
    "wardName": "Xã Muổi Nọi",
    "districtId": 30307,
    "districtName": "Huyện Thuận Châu",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30307024",
    "wardName": "Xã Mường Khiêng",
    "districtId": 30307,
    "districtName": "Huyện Thuận Châu",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30307025",
    "wardName": "Xã Co Mạ",
    "districtId": 30307,
    "districtName": "Huyện Thuận Châu",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30307026",
    "wardName": "Xã Bình Thuận",
    "districtId": 30307,
    "districtName": "Huyện Thuận Châu",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30307027",
    "wardName": "Xã Mường É",
    "districtId": 30307,
    "districtName": "Huyện Thuận Châu",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30307028",
    "wardName": "Xã Long Hẹ",
    "districtId": 30307,
    "districtName": "Huyện Thuận Châu",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30305029",
    "wardName": "Xã Mường La",
    "districtId": 30305,
    "districtName": "Huyện Mường La",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30305030",
    "wardName": "Xã Chiềng Lao",
    "districtId": 30305,
    "districtName": "Huyện Mường La",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30305031",
    "wardName": "Xã Mường Bú",
    "districtId": 30305,
    "districtName": "Huyện Mường La",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30305032",
    "wardName": "Xã Chiềng Hoa",
    "districtId": 30305,
    "districtName": "Huyện Mường La",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30309033",
    "wardName": "Xã Bắc Yên",
    "districtId": 30309,
    "districtName": "Huyện Bắc Yên",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30309034",
    "wardName": "Xã Tà Xùa",
    "districtId": 30309,
    "districtName": "Huyện Bắc Yên",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30309035",
    "wardName": "Xã Tạ Khoa",
    "districtId": 30309,
    "districtName": "Huyện Bắc Yên",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30309036",
    "wardName": "Xã Xím Vàng",
    "districtId": 30309,
    "districtName": "Huyện Bắc Yên",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30309037",
    "wardName": "Xã Pắc Ngà",
    "districtId": 30309,
    "districtName": "Huyện Bắc Yên",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30309038",
    "wardName": "Xã Chiềng Sại",
    "districtId": 30309,
    "districtName": "Huyện Bắc Yên",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30311039",
    "wardName": "Xã Phù Yên",
    "districtId": 30311,
    "districtName": "Huyện Phù Yên",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30311040",
    "wardName": "Xã Gia Phù",
    "districtId": 30311,
    "districtName": "Huyện Phù Yên",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30311041",
    "wardName": "Xã Tường Hạ",
    "districtId": 30311,
    "districtName": "Huyện Phù Yên",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30311042",
    "wardName": "Xã Mường Cơi",
    "districtId": 30311,
    "districtName": "Huyện Phù Yên",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30311043",
    "wardName": "Xã Mường Bang",
    "districtId": 30311,
    "districtName": "Huyện Phù Yên",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30311044",
    "wardName": "Xã Tân Phong",
    "districtId": 30311,
    "districtName": "Huyện Phù Yên",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30311045",
    "wardName": "Xã Kim Bon",
    "districtId": 30311,
    "districtName": "Huyện Phù Yên",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30317046",
    "wardName": "Xã Yên Châu",
    "districtId": 30317,
    "districtName": "Huyện Yên Châu",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30317047",
    "wardName": "Xã Chiềng Hặc",
    "districtId": 30317,
    "districtName": "Huyện Yên Châu",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30317048",
    "wardName": "Xã Lóng Phiêng",
    "districtId": 30317,
    "districtName": "Huyện Yên Châu",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30317049",
    "wardName": "Xã Yên Sơn",
    "districtId": 30317,
    "districtName": "Huyện Yên Châu",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30313050",
    "wardName": "Xã Chiềng Mai",
    "districtId": 30313,
    "districtName": "Huyện Mai Sơn",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30313051",
    "wardName": "Xã Mai Sơn",
    "districtId": 30313,
    "districtName": "Huyện Mai Sơn",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30313052",
    "wardName": "Xã Phiêng Pằn",
    "districtId": 30313,
    "districtName": "Huyện Mai Sơn",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30313053",
    "wardName": "Xã Chiềng Mung",
    "districtId": 30313,
    "districtName": "Huyện Mai Sơn",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30313054",
    "wardName": "Xã Phiêng Cằm",
    "districtId": 30313,
    "districtName": "Huyện Mai Sơn",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30313055",
    "wardName": "Xã Mường Chanh",
    "districtId": 30313,
    "districtName": "Huyện Mai Sơn",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30313056",
    "wardName": "Xã Tà Hộc",
    "districtId": 30313,
    "districtName": "Huyện Mai Sơn",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30313057",
    "wardName": "Xã Chiềng Sung",
    "districtId": 30313,
    "districtName": "Huyện Mai Sơn",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30315058",
    "wardName": "Xã Bó Sinh",
    "districtId": 30315,
    "districtName": "Huyện Sông Mã",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30315059",
    "wardName": "Xã Chiềng Khương",
    "districtId": 30315,
    "districtName": "Huyện Sông Mã",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30315060",
    "wardName": "Xã Mường Hung",
    "districtId": 30315,
    "districtName": "Huyện Sông Mã",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30315061",
    "wardName": "Xã Chiềng Khoong",
    "districtId": 30315,
    "districtName": "Huyện Sông Mã",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30315062",
    "wardName": "Xã Mường Lầm",
    "districtId": 30315,
    "districtName": "Huyện Sông Mã",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30315063",
    "wardName": "Xã Nậm Ty",
    "districtId": 30315,
    "districtName": "Huyện Sông Mã",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30315064",
    "wardName": "Xã Sông Mã",
    "districtId": 30315,
    "districtName": "Huyện Sông Mã",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30315065",
    "wardName": "Xã Huổi Một",
    "districtId": 30315,
    "districtName": "Huyện Sông Mã",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30315066",
    "wardName": "Xã Chiềng Sơ",
    "districtId": 30315,
    "districtName": "Huyện Sông Mã",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30321067",
    "wardName": "Xã Sốp Cộp",
    "districtId": 30321,
    "districtName": "Huyện Sốp Cộp",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30321068",
    "wardName": "Xã Púng Bánh",
    "districtId": 30321,
    "districtName": "Huyện Sốp Cộp",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30319069",
    "wardName": "Xã Tân Yên",
    "districtId": 30319,
    "districtName": "Thị xã Mộc Châu",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30307070",
    "wardName": "Xã Mường Bám",
    "districtId": 30307,
    "districtName": "Huyện Thuận Châu",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30305071",
    "wardName": "Xã Ngọc Chiến",
    "districtId": 30305,
    "districtName": "Huyện Mường La",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30311072",
    "wardName": "Xã Suối Tọ",
    "districtId": 30311,
    "districtName": "Huyện Phù Yên",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30317073",
    "wardName": "Xã Phiêng Khoài",
    "districtId": 30317,
    "districtName": "Huyện Yên Châu",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30321074",
    "wardName": "Xã Mường Lạn",
    "districtId": 30321,
    "districtName": "Huyện Sốp Cộp",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "30321075",
    "wardName": "Xã Mường Lèo",
    "districtId": 30321,
    "districtName": "Huyện Sốp Cộp",
    "provinceId": 15,
    "provinceName": "Tỉnh Sơn La"
  },
  {
    "wardId": "40101001",
    "wardName": "Phường Hạc Thành",
    "districtId": 40101,
    "districtName": "Thành phố Thanh Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40101002",
    "wardName": "Phường Quảng Phú",
    "districtId": 40101,
    "districtName": "Thành phố Thanh Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40101003",
    "wardName": "Phường Đông Quang",
    "districtId": 40101,
    "districtName": "Thành phố Thanh Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40101004",
    "wardName": "Phường Đông Sơn",
    "districtId": 40101,
    "districtName": "Thành phố Thanh Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40101005",
    "wardName": "Phường Đông Tiến",
    "districtId": 40101,
    "districtName": "Thành phố Thanh Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40101006",
    "wardName": "Phường Hàm Rồng",
    "districtId": 40101,
    "districtName": "Thành phố Thanh Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40101007",
    "wardName": "Phường Nguyệt Viên",
    "districtId": 40101,
    "districtName": "Thành phố Thanh Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40105008",
    "wardName": "Phường Sầm Sơn",
    "districtId": 40105,
    "districtName": "Thành Phố Sầm Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40105009",
    "wardName": "Phường Nam Sầm Sơn",
    "districtId": 40105,
    "districtName": "Thành Phố Sầm Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40103010",
    "wardName": "Phường Bỉm Sơn",
    "districtId": 40103,
    "districtName": "Thị xã Bỉm Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40103011",
    "wardName": "Phường Quang Trung",
    "districtId": 40103,
    "districtName": "Thị xã Bỉm Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40153012",
    "wardName": "Phường Ngọc Sơn",
    "districtId": 40153,
    "districtName": "Thị xã Nghi Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40153013",
    "wardName": "Phường Tân Dân",
    "districtId": 40153,
    "districtName": "Thị xã Nghi Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40153014",
    "wardName": "Phường Hải Lĩnh",
    "districtId": 40153,
    "districtName": "Thị xã Nghi Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40153015",
    "wardName": "Phường Tĩnh Gia",
    "districtId": 40153,
    "districtName": "Thị xã Nghi Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40153016",
    "wardName": "Phường Đào Duy Tư",
    "districtId": 40153,
    "districtName": "Thị xã Nghi Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40153017",
    "wardName": "Phường Hải Bình",
    "districtId": 40153,
    "districtName": "Thị xã Nghi Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40153018",
    "wardName": "Phường Trúc Lâm",
    "districtId": 40153,
    "districtName": "Thị xã Nghi Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40153019",
    "wardName": "Phường Nghi Sơn",
    "districtId": 40153,
    "districtName": "Thị xã Nghi Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40153020",
    "wardName": "Xã Các Sơn",
    "districtId": 40153,
    "districtName": "Thị xã Nghi Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40153021",
    "wardName": "Xã Trường Lâm",
    "districtId": 40153,
    "districtName": "Thị xã Nghi Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40131022",
    "wardName": "Xã Hà Trung",
    "districtId": 40131,
    "districtName": "Huyện Hà Trung",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40131023",
    "wardName": "Xã Tống Sơn",
    "districtId": 40131,
    "districtName": "Huyện Hà Trung",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40131024",
    "wardName": "Xã Hà Long",
    "districtId": 40131,
    "districtName": "Huyện Hà Trung",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40131025",
    "wardName": "Xã Hoạt Giang",
    "districtId": 40131,
    "districtName": "Huyện Hà Trung",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40131026",
    "wardName": "Xã Lĩnh Toại",
    "districtId": 40131,
    "districtName": "Huyện Hà Trung",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40139027",
    "wardName": "Xã Triệu Lộc",
    "districtId": 40139,
    "districtName": "Huyện Hậu Lộc",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40139028",
    "wardName": "Xã Đông Thành",
    "districtId": 40139,
    "districtName": "Huyện Hậu Lộc",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40139029",
    "wardName": "Xã Hậu Lộc",
    "districtId": 40139,
    "districtName": "Huyện Hậu Lộc",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40139030",
    "wardName": "Xã Hoa Lộc",
    "districtId": 40139,
    "districtName": "Huyện Hậu Lộc",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40139031",
    "wardName": "Xã Vạn Lộc",
    "districtId": 40139,
    "districtName": "Huyện Hậu Lộc",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40133032",
    "wardName": "Xã Nga Sơn",
    "districtId": 40133,
    "districtName": "Huyện Nga Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40133033",
    "wardName": "Xã Nga Thắng",
    "districtId": 40133,
    "districtName": "Huyện Nga Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40133034",
    "wardName": "Xã Hồ Vương",
    "districtId": 40133,
    "districtName": "Huyện Nga Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40133035",
    "wardName": "Xã Tân Tiến",
    "districtId": 40133,
    "districtName": "Huyện Nga Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40133036",
    "wardName": "Xã Nga An",
    "districtId": 40133,
    "districtName": "Huyện Nga Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40133037",
    "wardName": "Xã Ba Đình",
    "districtId": 40133,
    "districtName": "Huyện Nga Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40143038",
    "wardName": "Xã Hoằng Hóa",
    "districtId": 40143,
    "districtName": "Huyện Hoằng Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40143039",
    "wardName": "Xã Hoằng Tiến",
    "districtId": 40143,
    "districtName": "Huyện Hoằng Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40143040",
    "wardName": "Xã Hoằng Thanh",
    "districtId": 40143,
    "districtName": "Huyện Hoằng Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40143041",
    "wardName": "Xã Hoằng Lộc",
    "districtId": 40143,
    "districtName": "Huyện Hoằng Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40143042",
    "wardName": "Xã Hoằng Châu",
    "districtId": 40143,
    "districtName": "Huyện Hoằng Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40143043",
    "wardName": "Xã Hoằng Sơn",
    "districtId": 40143,
    "districtName": "Huyện Hoằng Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40143044",
    "wardName": "Xã Hoằng Phú",
    "districtId": 40143,
    "districtName": "Huyện Hoằng Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40143045",
    "wardName": "Xã Hoằng Giang",
    "districtId": 40143,
    "districtName": "Huyện Hoằng Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40149046",
    "wardName": "Xã Lưu Vệ",
    "districtId": 40149,
    "districtName": "Huyện Quảng Xương",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40149047",
    "wardName": "Xã Quảng Yên",
    "districtId": 40149,
    "districtName": "Huyện Quảng Xương",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40149048",
    "wardName": "Xã Quảng Ngọc",
    "districtId": 40149,
    "districtName": "Huyện Quảng Xương",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40149049",
    "wardName": "Xã Quảng Ninh",
    "districtId": 40149,
    "districtName": "Huyện Quảng Xương",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40149050",
    "wardName": "Xã Quảng Bình",
    "districtId": 40149,
    "districtName": "Huyện Quảng Xương",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40149051",
    "wardName": "Xã Tiên Trang",
    "districtId": 40149,
    "districtName": "Huyện Quảng Xương",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40149052",
    "wardName": "Xã Quảng Chính",
    "districtId": 40149,
    "districtName": "Huyện Quảng Xương",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40151053",
    "wardName": "Xã Nông Cống",
    "districtId": 40151,
    "districtName": "Huyện Nông Cống",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40151054",
    "wardName": "Xã Thắng Lợi",
    "districtId": 40151,
    "districtName": "Huyện Nông Cống",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40151055",
    "wardName": "Xã Trung Chính",
    "districtId": 40151,
    "districtName": "Huyện Nông Cống",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40151056",
    "wardName": "Xã Trường Văn",
    "districtId": 40151,
    "districtName": "Huyện Nông Cống",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40151057",
    "wardName": "Xã Thăng Bình",
    "districtId": 40151,
    "districtName": "Huyện Nông Cống",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40151058",
    "wardName": "Xã Tượng Lĩnh",
    "districtId": 40151,
    "districtName": "Huyện Nông Cống",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40151059",
    "wardName": "Xã Công Chính",
    "districtId": 40151,
    "districtName": "Huyện Nông Cống",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40141060",
    "wardName": "Xã Thiệu Hóa",
    "districtId": 40141,
    "districtName": "Huyện Thiệu Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40141061",
    "wardName": "Xã Thiệu Quang",
    "districtId": 40141,
    "districtName": "Huyện Thiệu Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40141062",
    "wardName": "Xã Thiệu Tiến",
    "districtId": 40141,
    "districtName": "Huyện Thiệu Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40141063",
    "wardName": "Xã Thiệu Toán",
    "districtId": 40141,
    "districtName": "Huyện Thiệu Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40141064",
    "wardName": "Xã Thiệu Trung",
    "districtId": 40141,
    "districtName": "Huyện Thiệu Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40135065",
    "wardName": "Xã Yên Định",
    "districtId": 40135,
    "districtName": "Huyện Yên Định",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40135066",
    "wardName": "Xã Yên Trường",
    "districtId": 40135,
    "districtName": "Huyện Yên Định",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40135067",
    "wardName": "Xã Yên Phú",
    "districtId": 40135,
    "districtName": "Huyện Yên Định",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40135068",
    "wardName": "Xã Quý Lộc",
    "districtId": 40135,
    "districtName": "Huyện Yên Định",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40135069",
    "wardName": "Xã Yên Ninh",
    "districtId": 40135,
    "districtName": "Huyện Yên Định",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40135070",
    "wardName": "Xã Định Tân",
    "districtId": 40135,
    "districtName": "Huyện Yên Định",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40135071",
    "wardName": "Xã Định Hoà",
    "districtId": 40135,
    "districtName": "Huyện Yên Định",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40137072",
    "wardName": "Xã Thọ Xuân",
    "districtId": 40137,
    "districtName": "Huyện Thọ Xuân",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40137073",
    "wardName": "Xã Thọ Long",
    "districtId": 40137,
    "districtName": "Huyện Thọ Xuân",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40137074",
    "wardName": "Xã Xuân Hoà",
    "districtId": 40137,
    "districtName": "Huyện Thọ Xuân",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40137075",
    "wardName": "Xã Sao Vàng",
    "districtId": 40137,
    "districtName": "Huyện Thọ Xuân",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40137076",
    "wardName": "Xã Lam Sơn",
    "districtId": 40137,
    "districtName": "Huyện Thọ Xuân",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40137077",
    "wardName": "Xã Thọ Lập",
    "districtId": 40137,
    "districtName": "Huyện Thọ Xuân",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40137078",
    "wardName": "Xã Xuân Tín",
    "districtId": 40137,
    "districtName": "Huyện Thọ Xuân",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40137079",
    "wardName": "Xã Xuân Lập",
    "districtId": 40137,
    "districtName": "Huyện Thọ Xuân",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40129080",
    "wardName": "Xã Vĩnh Lộc",
    "districtId": 40129,
    "districtName": "Huyện Vĩnh Lộc",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40129081",
    "wardName": "Xã Tây Đô",
    "districtId": 40129,
    "districtName": "Huyện Vĩnh Lộc",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40129082",
    "wardName": "Xã Biện Thượng",
    "districtId": 40129,
    "districtName": "Huyện Vĩnh Lộc",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40147083",
    "wardName": "Xã Triệu Sơn",
    "districtId": 40147,
    "districtName": "Huyện Triệu Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40147084",
    "wardName": "Xã Thọ Bình",
    "districtId": 40147,
    "districtName": "Huyện Triệu Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40147085",
    "wardName": "Xã Thọ Ngọc",
    "districtId": 40147,
    "districtName": "Huyện Triệu Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40147086",
    "wardName": "Xã Thọ Phú",
    "districtId": 40147,
    "districtName": "Huyện Triệu Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40147087",
    "wardName": "Xã Hợp Tiến",
    "districtId": 40147,
    "districtName": "Huyện Triệu Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40147088",
    "wardName": "Xã An Nông",
    "districtId": 40147,
    "districtName": "Huyện Triệu Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40147089",
    "wardName": "Xã Tân Ninh",
    "districtId": 40147,
    "districtName": "Huyện Triệu Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40147090",
    "wardName": "Xã Đồng Tiến",
    "districtId": 40147,
    "districtName": "Huyện Triệu Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40107091",
    "wardName": "Xã Mường Chanh",
    "districtId": 40107,
    "districtName": "Huyện Mường Lát",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40107092",
    "wardName": "Xã Quang Chiểu",
    "districtId": 40107,
    "districtName": "Huyện Mường Lát",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40107093",
    "wardName": "Xã Tam chung",
    "districtId": 40107,
    "districtName": "Huyện Mường Lát",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40107094",
    "wardName": "Xã Mường Lát",
    "districtId": 40107,
    "districtName": "Huyện Mường Lát",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40107095",
    "wardName": "Xã Pù Nhi",
    "districtId": 40107,
    "districtName": "Huyện Mường Lát",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40107096",
    "wardName": "Xã Nhi Sơn",
    "districtId": 40107,
    "districtName": "Huyện Mường Lát",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40107097",
    "wardName": "Xã Mường Lý",
    "districtId": 40107,
    "districtName": "Huyện Mường Lát",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40107098",
    "wardName": "Xã Trung Lý",
    "districtId": 40107,
    "districtName": "Huyện Mường Lát",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40109099",
    "wardName": "Xã Hồi Xuân",
    "districtId": 40109,
    "districtName": "Huyện Quan Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40109100",
    "wardName": "Xã Nam Xuân",
    "districtId": 40109,
    "districtName": "Huyện Quan Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40109101",
    "wardName": "Xã Thiên Phủ",
    "districtId": 40109,
    "districtName": "Huyện Quan Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40109102",
    "wardName": "Xã Hiền Kiệt",
    "districtId": 40109,
    "districtName": "Huyện Quan Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40109103",
    "wardName": "Xã Phú Xuân",
    "districtId": 40109,
    "districtName": "Huyện Quan Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40109104",
    "wardName": "Xã Phú Lệ",
    "districtId": 40109,
    "districtName": "Huyện Quan Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40109105",
    "wardName": "Xã Trung Thành",
    "districtId": 40109,
    "districtName": "Huyện Quan Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40109106",
    "wardName": "Xã Trung Sơn",
    "districtId": 40109,
    "districtName": "Huyện Quan Hoá",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40111107",
    "wardName": "Xã Na Mèo",
    "districtId": 40111,
    "districtName": "Huyện Quan Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40111108",
    "wardName": "Xã Sơn Thủy",
    "districtId": 40111,
    "districtName": "Huyện Quan Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40111109",
    "wardName": "Xã Sơn Điện",
    "districtId": 40111,
    "districtName": "Huyện Quan Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40111110",
    "wardName": "Xã Mường Mìn",
    "districtId": 40111,
    "districtName": "Huyện Quan Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40111111",
    "wardName": "Xã Tam Thanh",
    "districtId": 40111,
    "districtName": "Huyện Quan Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40111112",
    "wardName": "Xã Tam Lư",
    "districtId": 40111,
    "districtName": "Huyện Quan Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40111113",
    "wardName": "Xã Quan Sơn",
    "districtId": 40111,
    "districtName": "Huyện Quan Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40111114",
    "wardName": "Xã Trung Hạ",
    "districtId": 40111,
    "districtName": "Huyện Quan Sơn",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40117115",
    "wardName": "Xã Linh Sơn",
    "districtId": 40117,
    "districtName": "Huyện Lang Chánh",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40117116",
    "wardName": "Xã Đồng Lương",
    "districtId": 40117,
    "districtName": "Huyện Lang Chánh",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40117117",
    "wardName": "Xã Văn Phú",
    "districtId": 40117,
    "districtName": "Huyện Lang Chánh",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40117118",
    "wardName": "Xã Giao An",
    "districtId": 40117,
    "districtName": "Huyện Lang Chánh",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40117119",
    "wardName": "Xã Yên Khương",
    "districtId": 40117,
    "districtName": "Huyện Lang Chánh",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40117120",
    "wardName": "Xã Yên Thắng",
    "districtId": 40117,
    "districtName": "Huyện Lang Chánh",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40113121",
    "wardName": "Xã Văn Nho",
    "districtId": 40113,
    "districtName": "Huyện Bá Thước",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40113122",
    "wardName": "Xã Thiết Ống",
    "districtId": 40113,
    "districtName": "Huyện Bá Thước",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40113123",
    "wardName": "Xã Bá Thước",
    "districtId": 40113,
    "districtName": "Huyện Bá Thước",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40113124",
    "wardName": "Xã Cổ Lũng",
    "districtId": 40113,
    "districtName": "Huyện Bá Thước",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40113125",
    "wardName": "Xã Pù Luông",
    "districtId": 40113,
    "districtName": "Huyện Bá Thước",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40113126",
    "wardName": "Xã Điền Lư",
    "districtId": 40113,
    "districtName": "Huyện Bá Thước",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40113127",
    "wardName": "Xã Điền Quang",
    "districtId": 40113,
    "districtName": "Huyện Bá Thước",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40113128",
    "wardName": "Xã Quý Lương",
    "districtId": 40113,
    "districtName": "Huyện Bá Thước",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40121129",
    "wardName": "Xã Ngọc Lặc",
    "districtId": 40121,
    "districtName": "Huyện Ngọc Lặc",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40121130",
    "wardName": "Xã Thạch Lập",
    "districtId": 40121,
    "districtName": "Huyện Ngọc Lặc",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40121131",
    "wardName": "Xã Ngọc Liên",
    "districtId": 40121,
    "districtName": "Huyện Ngọc Lặc",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40121132",
    "wardName": "Xã Minh Sơn",
    "districtId": 40121,
    "districtName": "Huyện Ngọc Lặc",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40121133",
    "wardName": "Xã Nguyệt Ấn",
    "districtId": 40121,
    "districtName": "Huyện Ngọc Lặc",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40121134",
    "wardName": "Xã Kiên Thọ",
    "districtId": 40121,
    "districtName": "Huyện Ngọc Lặc",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40115135",
    "wardName": "Xã Cẩm Thạch",
    "districtId": 40115,
    "districtName": "Huyện Cẩm Thuỷ",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40115136",
    "wardName": "Xã Cẩm Thủy",
    "districtId": 40115,
    "districtName": "Huyện Cẩm Thuỷ",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40115137",
    "wardName": "Xã Cẩm Tú",
    "districtId": 40115,
    "districtName": "Huyện Cẩm Thuỷ",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40115138",
    "wardName": "Xã Cẩm Vân",
    "districtId": 40115,
    "districtName": "Huyện Cẩm Thuỷ",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40115139",
    "wardName": "Xã Cẩm Tân",
    "districtId": 40115,
    "districtName": "Huyện Cẩm Thuỷ",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40119140",
    "wardName": "Xã Kim Tân",
    "districtId": 40119,
    "districtName": "Huyện Thạch Thành",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40119141",
    "wardName": "Xã Vân Du",
    "districtId": 40119,
    "districtName": "Huyện Thạch Thành",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40119142",
    "wardName": "Xã Ngọc Trạo",
    "districtId": 40119,
    "districtName": "Huyện Thạch Thành",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40119143",
    "wardName": "Xã Thạch Bình",
    "districtId": 40119,
    "districtName": "Huyện Thạch Thành",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40119144",
    "wardName": "Xã Thành Vinh",
    "districtId": 40119,
    "districtName": "Huyện Thạch Thành",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40119145",
    "wardName": "Xã Thạch Quảng",
    "districtId": 40119,
    "districtName": "Huyện Thạch Thành",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40125146",
    "wardName": "Xã Như Xuân",
    "districtId": 40125,
    "districtName": "Huyện Như Xuân",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40125147",
    "wardName": "Xã Thượng Ninh",
    "districtId": 40125,
    "districtName": "Huyện Như Xuân",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40125148",
    "wardName": "Xã Xuân Bình",
    "districtId": 40125,
    "districtName": "Huyện Như Xuân",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40125149",
    "wardName": "Xã Hóa Quỳ",
    "districtId": 40125,
    "districtName": "Huyện Như Xuân",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40125150",
    "wardName": "Xã Thanh Quân",
    "districtId": 40125,
    "districtName": "Huyện Như Xuân",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40125151",
    "wardName": "Xã Thanh Phong",
    "districtId": 40125,
    "districtName": "Huyện Như Xuân",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40127152",
    "wardName": "Xã Xuân Du",
    "districtId": 40127,
    "districtName": "Huyện Như Thanh",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40127153",
    "wardName": "Xã Mậu Lâm",
    "districtId": 40127,
    "districtName": "Huyện Như Thanh",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40127154",
    "wardName": "Xã Như Thanh",
    "districtId": 40127,
    "districtName": "Huyện Như Thanh",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40127155",
    "wardName": "Xã Yên Thọ",
    "districtId": 40127,
    "districtName": "Huyện Như Thanh",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40127156",
    "wardName": "Xã Xuân Thái",
    "districtId": 40127,
    "districtName": "Huyện Như Thanh",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40127157",
    "wardName": "Xã Thanh Kỳ",
    "districtId": 40127,
    "districtName": "Huyện Như Thanh",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40123158",
    "wardName": "Xã Bát Mọt",
    "districtId": 40123,
    "districtName": "Huyện Thường Xuân",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40123159",
    "wardName": "Xã Yên Nhân",
    "districtId": 40123,
    "districtName": "Huyện Thường Xuân",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40123160",
    "wardName": "Xã Lương Sơn",
    "districtId": 40123,
    "districtName": "Huyện Thường Xuân",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40123161",
    "wardName": "Xã Thường Xuân",
    "districtId": 40123,
    "districtName": "Huyện Thường Xuân",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40123162",
    "wardName": "Xã Luận Thành",
    "districtId": 40123,
    "districtName": "Huyện Thường Xuân",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40123163",
    "wardName": "Xã Tân Thành",
    "districtId": 40123,
    "districtName": "Huyện Thường Xuân",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40123164",
    "wardName": "Xã Vạn Xuân",
    "districtId": 40123,
    "districtName": "Huyện Thường Xuân",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40123165",
    "wardName": "Xã Thắng Lộc",
    "districtId": 40123,
    "districtName": "Huyện Thường Xuân",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40123166",
    "wardName": "Xã Xuân Chinh",
    "districtId": 40123,
    "districtName": "Huyện Thường Xuân",
    "provinceId": 16,
    "provinceName": "Tỉnh Thanh Hóa"
  },
  {
    "wardId": "40327001",
    "wardName": "Xã Anh Sơn",
    "districtId": 40327,
    "districtName": "Huyện Anh Sơn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40327002",
    "wardName": "Xã Yên Xuân",
    "districtId": 40327,
    "districtName": "Huyện Anh Sơn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40327003",
    "wardName": "Xã Nhân Hoà",
    "districtId": 40327,
    "districtName": "Huyện Anh Sơn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40327004",
    "wardName": "Xã Anh Sơn Đông",
    "districtId": 40327,
    "districtName": "Huyện Anh Sơn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40327005",
    "wardName": "Xã Vĩnh Tường",
    "districtId": 40327,
    "districtName": "Huyện Anh Sơn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40327006",
    "wardName": "Xã Thành Bình Thọ",
    "districtId": 40327,
    "districtName": "Huyện Anh Sơn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40321007",
    "wardName": "Xã Con Cuông",
    "districtId": 40321,
    "districtName": "Huyện Con Cuông",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40321008",
    "wardName": "Xã Môn Sơn",
    "districtId": 40321,
    "districtName": "Huyện Con Cuông",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40321009",
    "wardName": "Xã Mậu Thạch",
    "districtId": 40321,
    "districtName": "Huyện Con Cuông",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40321010",
    "wardName": "Xã Cam Phục",
    "districtId": 40321,
    "districtName": "Huyện Con Cuông",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40321011",
    "wardName": "Xã Châu Khê",
    "districtId": 40321,
    "districtName": "Huyện Con Cuông",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40321012",
    "wardName": "Xã Bình Chuẩn",
    "districtId": 40321,
    "districtName": "Huyện Con Cuông",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40325013",
    "wardName": "Xã Diễn Châu",
    "districtId": 40325,
    "districtName": "Huyện Diễn Châu",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40325014",
    "wardName": "Xã Đức Châu",
    "districtId": 40325,
    "districtName": "Huyện Diễn Châu",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40325015",
    "wardName": "Xã Quảng Châu",
    "districtId": 40325,
    "districtName": "Huyện Diễn Châu",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40325016",
    "wardName": "Xã Hải Châu",
    "districtId": 40325,
    "districtName": "Huyện Diễn Châu",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40325017",
    "wardName": "Xã Tân Châu",
    "districtId": 40325,
    "districtName": "Huyện Diễn Châu",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40325018",
    "wardName": "Xã An Châu",
    "districtId": 40325,
    "districtName": "Huyện Diễn Châu",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40325019",
    "wardName": "Xã Minh Châu",
    "districtId": 40325,
    "districtName": "Huyện Diễn Châu",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40325020",
    "wardName": "Xã Hùng Châu",
    "districtId": 40325,
    "districtName": "Huyện Diễn Châu",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40329021",
    "wardName": "Xã Đô Lương",
    "districtId": 40329,
    "districtName": "Huyện Đô Lương",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40329022",
    "wardName": "Xã Bạch Ngọc",
    "districtId": 40329,
    "districtName": "Huyện Đô Lương",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40329023",
    "wardName": "Xã Văn Hiến",
    "districtId": 40329,
    "districtName": "Huyện Đô Lương",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40329024",
    "wardName": "Xã Bạch Hà",
    "districtId": 40329,
    "districtName": "Huyện Đô Lương",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40329025",
    "wardName": "Xã Thuần Trung",
    "districtId": 40329,
    "districtName": "Huyện Đô Lương",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40329026",
    "wardName": "Xã Lương Sơn",
    "districtId": 40329,
    "districtName": "Huyện Đô Lương",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40339027",
    "wardName": "Phường Hoàng Mai",
    "districtId": 40339,
    "districtName": "Thị xã Hoàng Mai",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40339028",
    "wardName": "Phường Tân Mai",
    "districtId": 40339,
    "districtName": "Thị xã Hoàng Mai",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40339029",
    "wardName": "Phường Quỳnh Mai",
    "districtId": 40339,
    "districtName": "Thị xã Hoàng Mai",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40337030",
    "wardName": "Xã Hưng Nguyên",
    "districtId": 40337,
    "districtName": "Huyện Hưng Nguyên",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40337031",
    "wardName": "Xã Yên Trung",
    "districtId": 40337,
    "districtName": "Huyện Hưng Nguyên",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40337032",
    "wardName": "Xã Hưng Nguyên Nam",
    "districtId": 40337,
    "districtName": "Huyện Hưng Nguyên",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40337033",
    "wardName": "Xã Lam Thành",
    "districtId": 40337,
    "districtName": "Huyện Hưng Nguyên",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40309034",
    "wardName": "Xã Mường Xén",
    "districtId": 40309,
    "districtName": "Huyện Kỳ Sơn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40309035",
    "wardName": "Xã Hữu Kiệm",
    "districtId": 40309,
    "districtName": "Huyện Kỳ Sơn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40309036",
    "wardName": "Xã Nậm Cắn",
    "districtId": 40309,
    "districtName": "Huyện Kỳ Sơn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40309037",
    "wardName": "Xã Chiêu Lưu",
    "districtId": 40309,
    "districtName": "Huyện Kỳ Sơn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40309038",
    "wardName": "Xã Na Loi",
    "districtId": 40309,
    "districtName": "Huyện Kỳ Sơn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40309039",
    "wardName": "Xã Mường Típ",
    "districtId": 40309,
    "districtName": "Huyện Kỳ Sơn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40309040",
    "wardName": "Xã Na Ngoi",
    "districtId": 40309,
    "districtName": "Huyện Kỳ Sơn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40309041",
    "wardName": "Xã Mỹ Lý",
    "districtId": 40309,
    "districtName": "Huyện Kỳ Sơn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40309042",
    "wardName": "Xã Bắc Lý",
    "districtId": 40309,
    "districtName": "Huyện Kỳ Sơn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40309043",
    "wardName": "Xã Keng Đu",
    "districtId": 40309,
    "districtName": "Huyện Kỳ Sơn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40309044",
    "wardName": "Xã Huồi Tụ",
    "districtId": 40309,
    "districtName": "Huyện Kỳ Sơn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40309045",
    "wardName": "Xã Mường Lống",
    "districtId": 40309,
    "districtName": "Huyện Kỳ Sơn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40335046",
    "wardName": "Xã Vạn An",
    "districtId": 40335,
    "districtName": "Huyện Nam Đàn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40335047",
    "wardName": "Xã Nam Đàn",
    "districtId": 40335,
    "districtName": "Huyện Nam Đàn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40335048",
    "wardName": "Xã Đại Huệ",
    "districtId": 40335,
    "districtName": "Huyện Nam Đàn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40335049",
    "wardName": "Xã Thiên Nhẫn",
    "districtId": 40335,
    "districtName": "Huyện Nam Đàn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40335050",
    "wardName": "Xã Kim Liên",
    "districtId": 40335,
    "districtName": "Huyện Nam Đàn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40313051",
    "wardName": "Xã Nghĩa Đàn",
    "districtId": 40313,
    "districtName": "Huyện Nghĩa Đàn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40313052",
    "wardName": "Xã Nghĩa Thọ",
    "districtId": 40313,
    "districtName": "Huyện Nghĩa Đàn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40313053",
    "wardName": "Xã Nghĩa Lâm",
    "districtId": 40313,
    "districtName": "Huyện Nghĩa Đàn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40313054",
    "wardName": "Xã Nghĩa Mai",
    "districtId": 40313,
    "districtName": "Huyện Nghĩa Đàn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40313055",
    "wardName": "Xã Nghĩa Hưng",
    "districtId": 40313,
    "districtName": "Huyện Nghĩa Đàn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40313056",
    "wardName": "Xã Nghĩa Khánh",
    "districtId": 40313,
    "districtName": "Huyện Nghĩa Đàn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40313057",
    "wardName": "Xã Nghĩa Lộc",
    "districtId": 40313,
    "districtName": "Huyện Nghĩa Đàn",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40333058",
    "wardName": "Xã Nghi Lộc",
    "districtId": 40333,
    "districtName": "Huyện Nghi Lộc",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40333059",
    "wardName": "Xã Phúc Lộc",
    "districtId": 40333,
    "districtName": "Huyện Nghi Lộc",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40333060",
    "wardName": "Xã Đông Lộc",
    "districtId": 40333,
    "districtName": "Huyện Nghi Lộc",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40333061",
    "wardName": "Xã Trung Lộc",
    "districtId": 40333,
    "districtName": "Huyện Nghi Lộc",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40333062",
    "wardName": "Xã Thần Lĩnh",
    "districtId": 40333,
    "districtName": "Huyện Nghi Lộc",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40333063",
    "wardName": "Xã Hải Lộc",
    "districtId": 40333,
    "districtName": "Huyện Nghi Lộc",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40333064",
    "wardName": "Xã Văn Kiều",
    "districtId": 40333,
    "districtName": "Huyện Nghi Lộc",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40305065",
    "wardName": "Xã Quế Phong",
    "districtId": 40305,
    "districtName": "Huyện Quế Phong",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40305066",
    "wardName": "Xã Tiền Phong",
    "districtId": 40305,
    "districtName": "Huyện Quế Phong",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40305067",
    "wardName": "Xã Tri Lễ",
    "districtId": 40305,
    "districtName": "Huyện Quế Phong",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40305068",
    "wardName": "Xã Mường Quàng",
    "districtId": 40305,
    "districtName": "Huyện Quế Phong",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40305069",
    "wardName": "Xã Thông Thụ",
    "districtId": 40305,
    "districtName": "Huyện Quế Phong",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40307070",
    "wardName": "Xã Quỳ Châu",
    "districtId": 40307,
    "districtName": "Huyện Quỳ Châu",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40307071",
    "wardName": "Xã Châu Tiến",
    "districtId": 40307,
    "districtName": "Huyện Quỳ Châu",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40307072",
    "wardName": "Xã Hùng Chân",
    "districtId": 40307,
    "districtName": "Huyện Quỳ Châu",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40307073",
    "wardName": "Xã Châu Bình",
    "districtId": 40307,
    "districtName": "Huyện Quỳ Châu",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40311074",
    "wardName": "Xã Quỳ Hợp",
    "districtId": 40311,
    "districtName": "Huyện Quỳ Hợp",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40311075",
    "wardName": "Xã Tam Hợp",
    "districtId": 40311,
    "districtName": "Huyện Quỳ Hợp",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40311076",
    "wardName": "Xã Châu Lộc",
    "districtId": 40311,
    "districtName": "Huyện Quỳ Hợp",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40311077",
    "wardName": "Xã Châu Hồng",
    "districtId": 40311,
    "districtName": "Huyện Quỳ Hợp",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40311078",
    "wardName": "Xã Mường Ham",
    "districtId": 40311,
    "districtName": "Huyện Quỳ Hợp",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40311079",
    "wardName": "Xã Mường Chọng",
    "districtId": 40311,
    "districtName": "Huyện Quỳ Hợp",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40311080",
    "wardName": "Xã Minh Hợp",
    "districtId": 40311,
    "districtName": "Huyện Quỳ Hợp",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40317081",
    "wardName": "Xã Quỳnh Lưu",
    "districtId": 40317,
    "districtName": "Huyện Quỳnh Lưu",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40317082",
    "wardName": "Xã Quỳnh Văn",
    "districtId": 40317,
    "districtName": "Huyện Quỳnh Lưu",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40317083",
    "wardName": "Xã Quỳnh Anh",
    "districtId": 40317,
    "districtName": "Huyện Quỳnh Lưu",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40317084",
    "wardName": "Xã Quỳnh Tam",
    "districtId": 40317,
    "districtName": "Huyện Quỳnh Lưu",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40317085",
    "wardName": "Xã Quỳnh Phú",
    "districtId": 40317,
    "districtName": "Huyện Quỳnh Lưu",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40317086",
    "wardName": "Xã Quỳnh Sơn",
    "districtId": 40317,
    "districtName": "Huyện Quỳnh Lưu",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40317087",
    "wardName": "Xã Quỳnh Thắng",
    "districtId": 40317,
    "districtName": "Huyện Quỳnh Lưu",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40319088",
    "wardName": "Xã Tân Kỳ",
    "districtId": 40319,
    "districtName": "Huyện Tân Kỳ",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40319089",
    "wardName": "Xã Tân Phú",
    "districtId": 40319,
    "districtName": "Huyện Tân Kỳ",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40319090",
    "wardName": "Xã Tân An",
    "districtId": 40319,
    "districtName": "Huyện Tân Kỳ",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40319091",
    "wardName": "Xã Nghĩa Đồng",
    "districtId": 40319,
    "districtName": "Huyện Tân Kỳ",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40319092",
    "wardName": "Xã Giai Xuân",
    "districtId": 40319,
    "districtName": "Huyện Tân Kỳ",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40319093",
    "wardName": "Xã Nghĩa Hành",
    "districtId": 40319,
    "districtName": "Huyện Tân Kỳ",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40319094",
    "wardName": "Xã Tiên Đồng",
    "districtId": 40319,
    "districtName": "Huyện Tân Kỳ",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40314095",
    "wardName": "Phường Thái Hoà",
    "districtId": 40314,
    "districtName": "Thị xã Thái Hoà",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40314096",
    "wardName": "Phường Tây Hiếu",
    "districtId": 40314,
    "districtName": "Thị xã Thái Hoà",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40314097",
    "wardName": "Xã Đông Hiếu",
    "districtId": 40314,
    "districtName": "Thị xã Thái Hoà",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40331098",
    "wardName": "Xã Cát Ngạn",
    "districtId": 40331,
    "districtName": "Huyện Thanh Chương",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40331099",
    "wardName": "Xã Tam Đồng",
    "districtId": 40331,
    "districtName": "Huyện Thanh Chương",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40331100",
    "wardName": "Xã Hạnh Lâm",
    "districtId": 40331,
    "districtName": "Huyện Thanh Chương",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40331101",
    "wardName": "Xã Sơn Lâm",
    "districtId": 40331,
    "districtName": "Huyện Thanh Chương",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40331102",
    "wardName": "Xã Hoa Quân",
    "districtId": 40331,
    "districtName": "Huyện Thanh Chương",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40331103",
    "wardName": "Xã Kim Bảng",
    "districtId": 40331,
    "districtName": "Huyện Thanh Chương",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40331104",
    "wardName": "Xã Bích Hào",
    "districtId": 40331,
    "districtName": "Huyện Thanh Chương",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40331105",
    "wardName": "Xã Đại Đồng",
    "districtId": 40331,
    "districtName": "Huyện Thanh Chương",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40331106",
    "wardName": "Xã Xuân Lâm",
    "districtId": 40331,
    "districtName": "Huyện Thanh Chương",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40315107",
    "wardName": "Xã Tam Quang",
    "districtId": 40315,
    "districtName": "Huyện Tương Dương",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40315108",
    "wardName": "Xã Tam Thái",
    "districtId": 40315,
    "districtName": "Huyện Tương Dương",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40315109",
    "wardName": "Xã Tương Dương",
    "districtId": 40315,
    "districtName": "Huyện Tương Dương",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40315110",
    "wardName": "Xã Lượng Minh",
    "districtId": 40315,
    "districtName": "Huyện Tương Dương",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40315111",
    "wardName": "Xã Yên Na",
    "districtId": 40315,
    "districtName": "Huyện Tương Dương",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40315112",
    "wardName": "Xã Yên Hoà",
    "districtId": 40315,
    "districtName": "Huyện Tương Dương",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40315113",
    "wardName": "Xã Nga My",
    "districtId": 40315,
    "districtName": "Huyện Tương Dương",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40315114",
    "wardName": "Xã Hữu Khuông",
    "districtId": 40315,
    "districtName": "Huyện Tương Dương",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40315115",
    "wardName": "Xã Nhôn Mai",
    "districtId": 40315,
    "districtName": "Huyện Tương Dương",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40301116",
    "wardName": "Phường Trường Vinh",
    "districtId": 40301,
    "districtName": "Thành phố Vinh",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40301117",
    "wardName": "Phường Thành Vinh",
    "districtId": 40301,
    "districtName": "Thành phố Vinh",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40301118",
    "wardName": "Phường Vinh Hưng",
    "districtId": 40301,
    "districtName": "Thành phố Vinh",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40301119",
    "wardName": "Phường Vinh Phú",
    "districtId": 40301,
    "districtName": "Thành phố Vinh",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40301120",
    "wardName": "Phường Vinh Lộc",
    "districtId": 40301,
    "districtName": "Thành phố Vinh",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40301121",
    "wardName": "Phường Cửa Lò",
    "districtId": 40301,
    "districtName": "Thành phố Vinh",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40323122",
    "wardName": "Xã Yên Thành",
    "districtId": 40323,
    "districtName": "Huyện Yên Thành",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40323123",
    "wardName": "Xã Quan Thành",
    "districtId": 40323,
    "districtName": "Huyện Yên Thành",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40323124",
    "wardName": "Xã Hợp Minh",
    "districtId": 40323,
    "districtName": "Huyện Yên Thành",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40323125",
    "wardName": "Xã Vân Tụ",
    "districtId": 40323,
    "districtName": "Huyện Yên Thành",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40323126",
    "wardName": "Xã Vân Du",
    "districtId": 40323,
    "districtName": "Huyện Yên Thành",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40323127",
    "wardName": "Xã Quang Đồng",
    "districtId": 40323,
    "districtName": "Huyện Yên Thành",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40323128",
    "wardName": "Xã Giai Lạc",
    "districtId": 40323,
    "districtName": "Huyện Yên Thành",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40323129",
    "wardName": "Xã Bình Minh",
    "districtId": 40323,
    "districtName": "Huyện Yên Thành",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40323130",
    "wardName": "Xã Đông Thành",
    "districtId": 40323,
    "districtName": "Huyện Yên Thành",
    "provinceId": 17,
    "provinceName": "Tỉnh Nghệ An"
  },
  {
    "wardId": "40520001",
    "wardName": "Phường Sông Trí",
    "districtId": 40520,
    "districtName": "Thị xã Kỳ Anh",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40520002",
    "wardName": "Phường Hải Ninh",
    "districtId": 40520,
    "districtName": "Thị xã Kỳ Anh",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40520003",
    "wardName": "Phường Hoành Sơn",
    "districtId": 40520,
    "districtName": "Thị xã Kỳ Anh",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40520004",
    "wardName": "Phường Vũng Áng",
    "districtId": 40520,
    "districtName": "Thị xã Kỳ Anh",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40519005",
    "wardName": "Xã Kỳ Xuân",
    "districtId": 40519,
    "districtName": "Huyện Kỳ Anh",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40519006",
    "wardName": "Xã Kỳ Anh",
    "districtId": 40519,
    "districtName": "Huyện Kỳ Anh",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40519007",
    "wardName": "Xã Kỳ Hoa",
    "districtId": 40519,
    "districtName": "Huyện Kỳ Anh",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40519008",
    "wardName": "Xã Kỳ Văn",
    "districtId": 40519,
    "districtName": "Huyện Kỳ Anh",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40519009",
    "wardName": "Xã Kỳ Khang",
    "districtId": 40519,
    "districtName": "Huyện Kỳ Anh",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40519010",
    "wardName": "Xã Kỳ Lạc",
    "districtId": 40519,
    "districtName": "Huyện Kỳ Anh",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40519011",
    "wardName": "Xã Kỳ Thượng",
    "districtId": 40519,
    "districtName": "Huyện Kỳ Anh",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40515012",
    "wardName": "Xã Cẩm Xuyên",
    "districtId": 40515,
    "districtName": "Huyện Cẩm Xuyên",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40515013",
    "wardName": "Xã Thiên Cầm",
    "districtId": 40515,
    "districtName": "Huyện Cẩm Xuyên",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40515014",
    "wardName": "Xã Cẩm Duệ",
    "districtId": 40515,
    "districtName": "Huyện Cẩm Xuyên",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40515015",
    "wardName": "Xã Cẩm Hưng",
    "districtId": 40515,
    "districtName": "Huyện Cẩm Xuyên",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40515016",
    "wardName": "Xã Cẩm Lạc",
    "districtId": 40515,
    "districtName": "Huyện Cẩm Xuyên",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40515017",
    "wardName": "Xã Cẩm Trung",
    "districtId": 40515,
    "districtName": "Huyện Cẩm Xuyên",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40515018",
    "wardName": "Xã Yên Hoà",
    "districtId": 40515,
    "districtName": "Huyện Cẩm Xuyên",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40501019",
    "wardName": "Phường Thành Sen",
    "districtId": 40501,
    "districtName": "Thành phố Hà Tĩnh",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40501020",
    "wardName": "Phường Trần Phú",
    "districtId": 40501,
    "districtName": "Thành phố Hà Tĩnh",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40501021",
    "wardName": "Phường Hà Huy Tập",
    "districtId": 40501,
    "districtName": "Thành phố Hà Tĩnh",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40501022",
    "wardName": "Xã Thạch Lạc",
    "districtId": 40501,
    "districtName": "Thành phố Hà Tĩnh",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40501023",
    "wardName": "Xã Đồng Tiến",
    "districtId": 40501,
    "districtName": "Thành phố Hà Tĩnh",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40501024",
    "wardName": "Xã Thạch Khê",
    "districtId": 40501,
    "districtName": "Thành phố Hà Tĩnh",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40501025",
    "wardName": "Xã Cẩm Bình",
    "districtId": 40501,
    "districtName": "Thành phố Hà Tĩnh",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40513026",
    "wardName": "Xã Thạch Hà",
    "districtId": 40513,
    "districtName": "Huyện Thạch Hà",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40513027",
    "wardName": "Xã Toàn Lưu",
    "districtId": 40513,
    "districtName": "Huyện Thạch Hà",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40513028",
    "wardName": "Xã Việt Xuyên",
    "districtId": 40513,
    "districtName": "Huyện Thạch Hà",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40513029",
    "wardName": "Xã Đông Kinh",
    "districtId": 40513,
    "districtName": "Huyện Thạch Hà",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40513030",
    "wardName": "Xã Thạch Xuân",
    "districtId": 40513,
    "districtName": "Huyện Thạch Hà",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40513031",
    "wardName": "Xã Lộc Hà",
    "districtId": 40513,
    "districtName": "Huyện Thạch Hà",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40513032",
    "wardName": "Xã Hồng Lộc",
    "districtId": 40513,
    "districtName": "Huyện Thạch Hà",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40513033",
    "wardName": "Xã Mai Phụ",
    "districtId": 40513,
    "districtName": "Huyện Thạch Hà",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40511034",
    "wardName": "Xã Can Lộc",
    "districtId": 40511,
    "districtName": "Huyện Can Lộc",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40511035",
    "wardName": "Xã Tùng Lộc",
    "districtId": 40511,
    "districtName": "Huyện Can Lộc",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40511036",
    "wardName": "Xã Gia Hanh",
    "districtId": 40511,
    "districtName": "Huyện Can Lộc",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40511037",
    "wardName": "Xã Trường Lưu",
    "districtId": 40511,
    "districtName": "Huyện Can Lộc",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40511038",
    "wardName": "Xã Xuân Lộc",
    "districtId": 40511,
    "districtName": "Huyện Can Lộc",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40511039",
    "wardName": "Xã Đồng Lộc",
    "districtId": 40511,
    "districtName": "Huyện Can Lộc",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40503040",
    "wardName": "Phường Bắc Hồng Lĩnh",
    "districtId": 40503,
    "districtName": "Thị xã Hồng Lĩnh",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40503041",
    "wardName": "Phường Nam Hồng Lĩnh",
    "districtId": 40503,
    "districtName": "Thị xã Hồng Lĩnh",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40505042",
    "wardName": "Xã Tiên Điền",
    "districtId": 40505,
    "districtName": "Huyện Nghi Xuân",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40505043",
    "wardName": "Xã Nghi Xuân",
    "districtId": 40505,
    "districtName": "Huyện Nghi Xuân",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40505044",
    "wardName": "Xã Cổ Đạm",
    "districtId": 40505,
    "districtName": "Huyện Nghi Xuân",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40505045",
    "wardName": "Xã Đan Hải",
    "districtId": 40505,
    "districtName": "Huyện Nghi Xuân",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40507046",
    "wardName": "Xã Đức Thọ",
    "districtId": 40507,
    "districtName": "Huyện Đức Thọ",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40507047",
    "wardName": "Xã Đức Quang",
    "districtId": 40507,
    "districtName": "Huyện Đức Thọ",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40507048",
    "wardName": "Xã Đức Đồng",
    "districtId": 40507,
    "districtName": "Huyện Đức Thọ",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40507049",
    "wardName": "Xã Đức Thịnh",
    "districtId": 40507,
    "districtName": "Huyện Đức Thọ",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40507050",
    "wardName": "Xã Đức Minh",
    "districtId": 40507,
    "districtName": "Huyện Đức Thọ",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40509051",
    "wardName": "Xã Hương Sơn",
    "districtId": 40509,
    "districtName": "Huyện Hương Sơn",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40509052",
    "wardName": "Xã Sơn Tây",
    "districtId": 40509,
    "districtName": "Huyện Hương Sơn",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40509053",
    "wardName": "Xã Tứ Mỹ",
    "districtId": 40509,
    "districtName": "Huyện Hương Sơn",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40509054",
    "wardName": "Xã Sơn Giang",
    "districtId": 40509,
    "districtName": "Huyện Hương Sơn",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40509055",
    "wardName": "Xã Sơn Tiến",
    "districtId": 40509,
    "districtName": "Huyện Hương Sơn",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40509056",
    "wardName": "Xã Sơn Hồng",
    "districtId": 40509,
    "districtName": "Huyện Hương Sơn",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40509057",
    "wardName": "Xã Kim Hoa",
    "districtId": 40509,
    "districtName": "Huyện Hương Sơn",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40521058",
    "wardName": "Xã Vũ Quang",
    "districtId": 40521,
    "districtName": "Huyện Vũ Quang",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40521059",
    "wardName": "Xã Mai Hoa",
    "districtId": 40521,
    "districtName": "Huyện Vũ Quang",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40521060",
    "wardName": "Xã Thượng Đức",
    "districtId": 40521,
    "districtName": "Huyện Vũ Quang",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40517061",
    "wardName": "Xã Hương Khê",
    "districtId": 40517,
    "districtName": "Huyện Hương Khê",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40517062",
    "wardName": "Xã Hương Phố",
    "districtId": 40517,
    "districtName": "Huyện Hương Khê",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40517063",
    "wardName": "Xã Hương Đô",
    "districtId": 40517,
    "districtName": "Huyện Hương Khê",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40517064",
    "wardName": "Xã Hà Linh",
    "districtId": 40517,
    "districtName": "Huyện Hương Khê",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40517065",
    "wardName": "Xã Hương Bình",
    "districtId": 40517,
    "districtName": "Huyện Hương Khê",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40517066",
    "wardName": "Xã Phúc Trạch",
    "districtId": 40517,
    "districtName": "Huyện Hương Khê",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40517067",
    "wardName": "Xã Hương Xuân",
    "districtId": 40517,
    "districtName": "Huyện Hương Khê",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40509068",
    "wardName": "Xã Sơn Kim 1",
    "districtId": 40509,
    "districtName": "Huyện Hương Sơn",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40509069",
    "wardName": "Xã Sơn Kim 2",
    "districtId": 40509,
    "districtName": "Huyện Hương Sơn",
    "provinceId": 18,
    "provinceName": "Tỉnh Hà Tĩnh"
  },
  {
    "wardId": "40701001",
    "wardName": "Phường Đồng Hới",
    "districtId": 40701,
    "districtName": "Thành phố Đồng Hới",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40701002",
    "wardName": "Phường Đồng Thuận",
    "districtId": 40701,
    "districtName": "Thành phố Đồng Hới",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40701003",
    "wardName": "Phường Đồng Sơn",
    "districtId": 40701,
    "districtName": "Thành phố Đồng Hới",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40715004",
    "wardName": "Xã Nam Gianh",
    "districtId": 40715,
    "districtName": "Thị xã Ba Đồn",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40715005",
    "wardName": "Xã Nam Ba Đồn",
    "districtId": 40715,
    "districtName": "Thị xã Ba Đồn",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40715006",
    "wardName": "Phường Ba Đồn",
    "districtId": 40715,
    "districtName": "Thị xã Ba Đồn",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40715007",
    "wardName": "Phường Bắc Gianh",
    "districtId": 40715,
    "districtName": "Thị xã Ba Đồn",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40705008",
    "wardName": "Xã Dân Hóa",
    "districtId": 40705,
    "districtName": "Huyện Minh Hoá",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40705009",
    "wardName": "Xã Kim Điền",
    "districtId": 40705,
    "districtName": "Huyện Minh Hoá",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40705010",
    "wardName": "Xã Kim Phú",
    "districtId": 40705,
    "districtName": "Huyện Minh Hoá",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40705011",
    "wardName": "Xã Minh Hóa",
    "districtId": 40705,
    "districtName": "Huyện Minh Hoá",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40705012",
    "wardName": "Xã Tân Thành",
    "districtId": 40705,
    "districtName": "Huyện Minh Hoá",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40703013",
    "wardName": "Xã Tuyên Lâm",
    "districtId": 40703,
    "districtName": "Huyện Tuyên Hoá",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40703014",
    "wardName": "Xã Tuyên Sơn",
    "districtId": 40703,
    "districtName": "Huyện Tuyên Hoá",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40703015",
    "wardName": "Xã Đồng Lê",
    "districtId": 40703,
    "districtName": "Huyện Tuyên Hoá",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40703016",
    "wardName": "Xã Tuyên Phú",
    "districtId": 40703,
    "districtName": "Huyện Tuyên Hoá",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40703017",
    "wardName": "Xã Tuyên Bình",
    "districtId": 40703,
    "districtName": "Huyện Tuyên Hoá",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40703018",
    "wardName": "Xã Tuyên Hóa",
    "districtId": 40703,
    "districtName": "Huyện Tuyên Hoá",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40707019",
    "wardName": "Xã Tân Gianh",
    "districtId": 40707,
    "districtName": "Huyện Quảng Trạch",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40707020",
    "wardName": "Xã Trung Thuần",
    "districtId": 40707,
    "districtName": "Huyện Quảng Trạch",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40707021",
    "wardName": "Xã Quảng Trạch",
    "districtId": 40707,
    "districtName": "Huyện Quảng Trạch",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40707022",
    "wardName": "Xã Hoà Trạch",
    "districtId": 40707,
    "districtName": "Huyện Quảng Trạch",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40707023",
    "wardName": "Xã Phú Trạch",
    "districtId": 40707,
    "districtName": "Huyện Quảng Trạch",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40709024",
    "wardName": "Xã Thượng Trạch",
    "districtId": 40709,
    "districtName": "Huyện Bố Trạch",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40709025",
    "wardName": "Xã Phong Nha",
    "districtId": 40709,
    "districtName": "Huyện Bố Trạch",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40709026",
    "wardName": "Xã Bắc Trạch",
    "districtId": 40709,
    "districtName": "Huyện Bố Trạch",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40709027",
    "wardName": "Xã Đông Trạch",
    "districtId": 40709,
    "districtName": "Huyện Bố Trạch",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40709028",
    "wardName": "Xã Hoàn Lão",
    "districtId": 40709,
    "districtName": "Huyện Bố Trạch",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40709029",
    "wardName": "Xã Bố Trạch",
    "districtId": 40709,
    "districtName": "Huyện Bố Trạch",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40709030",
    "wardName": "Xã Nam Trạch",
    "districtId": 40709,
    "districtName": "Huyện Bố Trạch",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40711031",
    "wardName": "Xã Quảng Ninh",
    "districtId": 40711,
    "districtName": "Huyện Quảng Ninh",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40711032",
    "wardName": "Xã Ninh Châu",
    "districtId": 40711,
    "districtName": "Huyện Quảng Ninh",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40711033",
    "wardName": "Xã Trường Ninh",
    "districtId": 40711,
    "districtName": "Huyện Quảng Ninh",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40711034",
    "wardName": "Xã Trường Sơn",
    "districtId": 40711,
    "districtName": "Huyện Quảng Ninh",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40713035",
    "wardName": "Xã Lệ Thủy",
    "districtId": 40713,
    "districtName": "Huyện Lệ Thuỷ",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40713036",
    "wardName": "Xã Cam Hồng",
    "districtId": 40713,
    "districtName": "Huyện Lệ Thuỷ",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40713037",
    "wardName": "Xã Sen Ngư",
    "districtId": 40713,
    "districtName": "Huyện Lệ Thuỷ",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40713038",
    "wardName": "Xã Tân Mỹ",
    "districtId": 40713,
    "districtName": "Huyện Lệ Thuỷ",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40713039",
    "wardName": "Xã Trường Phú",
    "districtId": 40713,
    "districtName": "Huyện Lệ Thuỷ",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40713040",
    "wardName": "Xã Lệ Ninh",
    "districtId": 40713,
    "districtName": "Huyện Lệ Thuỷ",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40713041",
    "wardName": "Xã Kim Ngân",
    "districtId": 40713,
    "districtName": "Huyện Lệ Thuỷ",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40901042",
    "wardName": "Phường Đông Hà",
    "districtId": 40901,
    "districtName": "Thành phố Đông Hà",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40901043",
    "wardName": "Phường Nam Đông Hà",
    "districtId": 40901,
    "districtName": "Thành phố Đông Hà",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40903044",
    "wardName": "Phường Quảng Trị",
    "districtId": 40903,
    "districtName": "Thị xã Quảng Trị",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40905045",
    "wardName": "Xã Vĩnh Linh",
    "districtId": 40905,
    "districtName": "Huyện Vĩnh Linh",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40905046",
    "wardName": "Xã Cửa Tùng",
    "districtId": 40905,
    "districtName": "Huyện Vĩnh Linh",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40905047",
    "wardName": "Xã Vĩnh Hoàng",
    "districtId": 40905,
    "districtName": "Huyện Vĩnh Linh",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40905048",
    "wardName": "Xã Vĩnh Thủy",
    "districtId": 40905,
    "districtName": "Huyện Vĩnh Linh",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40905049",
    "wardName": "Xã Bến Quan",
    "districtId": 40905,
    "districtName": "Huyện Vĩnh Linh",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40907050",
    "wardName": "Xã Cồn Tiên",
    "districtId": 40907,
    "districtName": "Huyện Gio Linh",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40907051",
    "wardName": "Xã Cửa Việt",
    "districtId": 40907,
    "districtName": "Huyện Gio Linh",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40907052",
    "wardName": "Xã Gio Linh",
    "districtId": 40907,
    "districtName": "Huyện Gio Linh",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40907053",
    "wardName": "Xã Bến Hải",
    "districtId": 40907,
    "districtName": "Huyện Gio Linh",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40915054",
    "wardName": "Xã Hướng Lập",
    "districtId": 40915,
    "districtName": "Huyện Hướng Hoá",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40915055",
    "wardName": "Xã Hướng Phùng",
    "districtId": 40915,
    "districtName": "Huyện Hướng Hoá",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40915056",
    "wardName": "Xã Khe Sanh",
    "districtId": 40915,
    "districtName": "Huyện Hướng Hoá",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40915057",
    "wardName": "Xã Tân Lập",
    "districtId": 40915,
    "districtName": "Huyện Hướng Hoá",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40915058",
    "wardName": "Xã Lao Bảo",
    "districtId": 40915,
    "districtName": "Huyện Hướng Hoá",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40915059",
    "wardName": "Xã Lìa",
    "districtId": 40915,
    "districtName": "Huyện Hướng Hoá",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40915060",
    "wardName": "Xã A Dơi",
    "districtId": 40915,
    "districtName": "Huyện Hướng Hoá",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40917061",
    "wardName": "Xã La Lay",
    "districtId": 40917,
    "districtName": "Huyện Đa Krông",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40917062",
    "wardName": "Xã Tà Rụt",
    "districtId": 40917,
    "districtName": "Huyện Đa Krông",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40917063",
    "wardName": "Xã Đakrông",
    "districtId": 40917,
    "districtName": "Huyện Đa Krông",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40917064",
    "wardName": "Xã Ba Lòng",
    "districtId": 40917,
    "districtName": "Huyện Đa Krông",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40917065",
    "wardName": "Xã Hướng Hiệp",
    "districtId": 40917,
    "districtName": "Huyện Đa Krông",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40909066",
    "wardName": "Xã Cam Lộ",
    "districtId": 40909,
    "districtName": "Huyện Cam Lộ",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40909067",
    "wardName": "Xã Hiếu Giang",
    "districtId": 40909,
    "districtName": "Huyện Cam Lộ",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40911068",
    "wardName": "Xã Triệu Phong",
    "districtId": 40911,
    "districtName": "Huyện Triệu Phong",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40911069",
    "wardName": "Xã Ái Tử",
    "districtId": 40911,
    "districtName": "Huyện Triệu Phong",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40911070",
    "wardName": "Xã Triệu Bình",
    "districtId": 40911,
    "districtName": "Huyện Triệu Phong",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40911071",
    "wardName": "Xã Triệu Cơ",
    "districtId": 40911,
    "districtName": "Huyện Triệu Phong",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40911072",
    "wardName": "Xã Nam Cửa Việt",
    "districtId": 40911,
    "districtName": "Huyện Triệu Phong",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40913073",
    "wardName": "Xã Diên Sanh",
    "districtId": 40913,
    "districtName": "Huyện Hải Lăng",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40913074",
    "wardName": "Xã Mỹ Thủy",
    "districtId": 40913,
    "districtName": "Huyện Hải Lăng",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40913075",
    "wardName": "Xã Hải Lăng",
    "districtId": 40913,
    "districtName": "Huyện Hải Lăng",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40913076",
    "wardName": "Xã Vĩnh Định",
    "districtId": 40913,
    "districtName": "Huyện Hải Lăng",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40913077",
    "wardName": "Xã Nam Hải Lăng",
    "districtId": 40913,
    "districtName": "Huyện Hải Lăng",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "40919078",
    "wardName": "Đặc khu Cồn Cỏ",
    "districtId": 40919,
    "districtName": "Huyện Đảo Cồn Cỏ",
    "provinceId": 19,
    "provinceName": "Tỉnh Quảng Trị"
  },
  {
    "wardId": "41109001",
    "wardName": "Phường Thuận An",
    "districtId": 41109,
    "districtName": "Huyện Phú Vang",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41119002",
    "wardName": "Phường Hóa Châu",
    "districtId": 41119,
    "districtName": "Quận Phú Xuân",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41109003",
    "wardName": "Phường Mỹ Thượng",
    "districtId": 41109,
    "districtName": "Huyện Phú Vang",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41101004",
    "wardName": "Phường Vỹ Dạ",
    "districtId": 41101,
    "districtName": "Quận Thuận Hóa",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41101005",
    "wardName": "Phường Thuận Hóa",
    "districtId": 41101,
    "districtName": "Quận Thuận Hóa",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41101006",
    "wardName": "Phường An Cựu",
    "districtId": 41101,
    "districtName": "Quận Thuận Hóa",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41101007",
    "wardName": "Phường Thủy Xuân",
    "districtId": 41101,
    "districtName": "Quận Thuận Hóa",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41119008",
    "wardName": "Phường Kim Long",
    "districtId": 41119,
    "districtName": "Quận Phú Xuân",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41119009",
    "wardName": "Phường Hương An",
    "districtId": 41119,
    "districtName": "Quận Phú Xuân",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41119010",
    "wardName": "Phường Phú Xuân",
    "districtId": 41119,
    "districtName": "Quận Phú Xuân",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41107011",
    "wardName": "Phường Hương Trà",
    "districtId": 41107,
    "districtName": "Thị xã Hương Trà",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41107012",
    "wardName": "Phường Kim Trà",
    "districtId": 41107,
    "districtName": "Thị xã Hương Trà",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41111013",
    "wardName": "Phường Thanh Thủy",
    "districtId": 41111,
    "districtName": "Thị xã Hương Thuỷ",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41111014",
    "wardName": "Phường Hương Thủy",
    "districtId": 41111,
    "districtName": "Thị xã Hương Thuỷ",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41111015",
    "wardName": "Phường Phú Bài",
    "districtId": 41111,
    "districtName": "Thị xã Hương Thuỷ",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41103016",
    "wardName": "Phường Phong Điền",
    "districtId": 41103,
    "districtName": "Thị xã Phong Điền",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41103017",
    "wardName": "Phường Phong Thái",
    "districtId": 41103,
    "districtName": "Thị xã Phong Điền",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41103018",
    "wardName": "Phường Phong Dinh",
    "districtId": 41103,
    "districtName": "Thị xã Phong Điền",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41103019",
    "wardName": "Phường Phong Phú",
    "districtId": 41103,
    "districtName": "Thị xã Phong Điền",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41105020",
    "wardName": "Phường Phong Quảng",
    "districtId": 41105,
    "districtName": "Huyện Quảng Điền",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41105021",
    "wardName": "Xã Đan Điền",
    "districtId": 41105,
    "districtName": "Huyện Quảng Điền",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41105022",
    "wardName": "Xã Quảng Điền",
    "districtId": 41105,
    "districtName": "Huyện Quảng Điền",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41109023",
    "wardName": "Xã Phú Vinh",
    "districtId": 41109,
    "districtName": "Huyện Phú Vang",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41109024",
    "wardName": "Xã Phú Hồ",
    "districtId": 41109,
    "districtName": "Huyện Phú Vang",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41109025",
    "wardName": "Xã Phú Vang",
    "districtId": 41109,
    "districtName": "Huyện Phú Vang",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41113026",
    "wardName": "Xã Vinh Lộc",
    "districtId": 41113,
    "districtName": "Huyện Phú Lộc",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41113027",
    "wardName": "Xã Hưng Lộc",
    "districtId": 41113,
    "districtName": "Huyện Phú Lộc",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41113028",
    "wardName": "Xã Lộc An",
    "districtId": 41113,
    "districtName": "Huyện Phú Lộc",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41113029",
    "wardName": "Xã Phú Lộc",
    "districtId": 41113,
    "districtName": "Huyện Phú Lộc",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41113030",
    "wardName": "Xã Chân Mây – Lăng Cô",
    "districtId": 41113,
    "districtName": "Huyện Phú Lộc",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41113031",
    "wardName": "Xã Long Quảng",
    "districtId": 41113,
    "districtName": "Huyện Phú Lộc",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41113032",
    "wardName": "Xã Nam Đông",
    "districtId": 41113,
    "districtName": "Huyện Phú Lộc",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41113033",
    "wardName": "Xã Khe Tre",
    "districtId": 41113,
    "districtName": "Huyện Phú Lộc",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41107034",
    "wardName": "Xã Bình Điền",
    "districtId": 41107,
    "districtName": "Thị xã Hương Trà",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41115035",
    "wardName": "Xã A Lưới 1",
    "districtId": 41115,
    "districtName": "Huyện A Lưới",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41115036",
    "wardName": "Xã A Lưới 2",
    "districtId": 41115,
    "districtName": "Huyện A Lưới",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41115037",
    "wardName": "Xã A Lưới 3",
    "districtId": 41115,
    "districtName": "Huyện A Lưới",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41115038",
    "wardName": "Xã A Lưới 4",
    "districtId": 41115,
    "districtName": "Huyện A Lưới",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41115039",
    "wardName": "Xã A Lưới 5",
    "districtId": 41115,
    "districtName": "Huyện A Lưới",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "41101040",
    "wardName": "Phường Dương Nỗ",
    "districtId": 41101,
    "districtName": "Quận Thuận Hóa",
    "provinceId": 20,
    "provinceName": "Thành phố Huế"
  },
  {
    "wardId": "50101001",
    "wardName": "Phường Hải Châu",
    "districtId": 50101,
    "districtName": "Quận Hải Châu",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50101002",
    "wardName": "Phường Hoà Cường",
    "districtId": 50101,
    "districtName": "Quận Hải Châu",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50103003",
    "wardName": "Phường Thanh Khê",
    "districtId": 50103,
    "districtName": "Quận Thanh Khê",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50115004",
    "wardName": "Phường An Khê",
    "districtId": 50115,
    "districtName": "Quận Cẩm Lệ",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50105005",
    "wardName": "Phường An Hải",
    "districtId": 50105,
    "districtName": "Quận Sơn Trà",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50105006",
    "wardName": "Phường Sơn Trà",
    "districtId": 50105,
    "districtName": "Quận Sơn Trà",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50107007",
    "wardName": "Phường Ngũ Hành Sơn",
    "districtId": 50107,
    "districtName": "Quận Ngũ Hành Sơn",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50109008",
    "wardName": "Phường Hoà Khánh",
    "districtId": 50109,
    "districtName": "Quận Liên Chiểu",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50109009",
    "wardName": "Phường Hải Vân",
    "districtId": 50109,
    "districtName": "Quận Liên Chiểu",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50109010",
    "wardName": "Phường Liên Chiểu",
    "districtId": 50109,
    "districtName": "Quận Liên Chiểu",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50115011",
    "wardName": "Phường Cẩm Lệ",
    "districtId": 50115,
    "districtName": "Quận Cẩm Lệ",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50111012",
    "wardName": "Phường Hoà Xuân",
    "districtId": 50111,
    "districtName": "Huyện Hoà Vang",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50111013",
    "wardName": "Xã Hoà Vang",
    "districtId": 50111,
    "districtName": "Huyện Hoà Vang",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50111014",
    "wardName": "Xã Hoà Tiến",
    "districtId": 50111,
    "districtName": "Huyện Hoà Vang",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50111015",
    "wardName": "Xã Bà Nà",
    "districtId": 50111,
    "districtName": "Huyện Hoà Vang",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50113016",
    "wardName": "Đặc khu Hoàng Sa",
    "districtId": 50113,
    "districtName": "Huyện đảo Hoàng Sa",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50325017",
    "wardName": "Xã Núi Thành",
    "districtId": 50325,
    "districtName": "Huyện Núi Thành",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50325018",
    "wardName": "Xã Tam Mỹ",
    "districtId": 50325,
    "districtName": "Huyện Núi Thành",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50325019",
    "wardName": "Xã Tam Anh",
    "districtId": 50325,
    "districtName": "Huyện Núi Thành",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50325020",
    "wardName": "Xã Đức Phú",
    "districtId": 50325,
    "districtName": "Huyện Núi Thành",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50325021",
    "wardName": "Xã Tam Xuân",
    "districtId": 50325,
    "districtName": "Huyện Núi Thành",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50325022",
    "wardName": "Xã Tam Hải",
    "districtId": 50325,
    "districtName": "Huyện Núi Thành",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50301023",
    "wardName": "Phường Tam Kỳ",
    "districtId": 50301,
    "districtName": "Thành phố Tam Kỳ",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50301024",
    "wardName": "Phường Quảng Phú",
    "districtId": 50301,
    "districtName": "Thành phố Tam Kỳ",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50301025",
    "wardName": "Phường Hương Trà",
    "districtId": 50301,
    "districtName": "Thành phố Tam Kỳ",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50301026",
    "wardName": "Phường Bàn Thạch",
    "districtId": 50301,
    "districtName": "Thành phố Tam Kỳ",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50302027",
    "wardName": "Xã Tây Hồ",
    "districtId": 50302,
    "districtName": "Huyện Phú Ninh",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50302028",
    "wardName": "Xã Chiên Đàn",
    "districtId": 50302,
    "districtName": "Huyện Phú Ninh",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50302029",
    "wardName": "Xã Phú Ninh",
    "districtId": 50302,
    "districtName": "Huyện Phú Ninh",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50321030",
    "wardName": "Xã Lãnh Ngọc",
    "districtId": 50321,
    "districtName": "Huyện Tiên Phước",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50321031",
    "wardName": "Xã Tiên Phước",
    "districtId": 50321,
    "districtName": "Huyện Tiên Phước",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50321032",
    "wardName": "Xã Thạnh Bình",
    "districtId": 50321,
    "districtName": "Huyện Tiên Phước",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50321033",
    "wardName": "Xã Sơn Cẩm Hà",
    "districtId": 50321,
    "districtName": "Huyện Tiên Phước",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50327034",
    "wardName": "Xã Trà Liên",
    "districtId": 50327,
    "districtName": "Huyện Bắc Trà My",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50327035",
    "wardName": "Xã Trà Giáp",
    "districtId": 50327,
    "districtName": "Huyện Bắc Trà My",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50327036",
    "wardName": "Xã Trà Tân",
    "districtId": 50327,
    "districtName": "Huyện Bắc Trà My",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50327037",
    "wardName": "Xã Trà Đốc",
    "districtId": 50327,
    "districtName": "Huyện Bắc Trà My",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50327038",
    "wardName": "Xã Trà My",
    "districtId": 50327,
    "districtName": "Huyện Bắc Trà My",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50329039",
    "wardName": "Xã Nam Trà My",
    "districtId": 50329,
    "districtName": "Huyện Nam Trà My",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50329040",
    "wardName": "Xã Trà Tập",
    "districtId": 50329,
    "districtName": "Huyện Nam Trà My",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50329041",
    "wardName": "Xã Trà Vân",
    "districtId": 50329,
    "districtName": "Huyện Nam Trà My",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50329042",
    "wardName": "Xã Trà Linh",
    "districtId": 50329,
    "districtName": "Huyện Nam Trà My",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50329043",
    "wardName": "Xã Trà Leng",
    "districtId": 50329,
    "districtName": "Huyện Nam Trà My",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50315044",
    "wardName": "Xã Thăng Bình",
    "districtId": 50315,
    "districtName": "Huyện Thăng Bình",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50315045",
    "wardName": "Xã Thăng An",
    "districtId": 50315,
    "districtName": "Huyện Thăng Bình",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50315046",
    "wardName": "Xã Thăng Trường",
    "districtId": 50315,
    "districtName": "Huyện Thăng Bình",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50315047",
    "wardName": "Xã Thăng Điền",
    "districtId": 50315,
    "districtName": "Huyện Thăng Bình",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50315048",
    "wardName": "Xã Thăng Phú",
    "districtId": 50315,
    "districtName": "Huyện Thăng Bình",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50315049",
    "wardName": "Xã Đồng Dương",
    "districtId": 50315,
    "districtName": "Huyện Thăng Bình",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50317050",
    "wardName": "Xã Quế Sơn Trung",
    "districtId": 50317,
    "districtName": "Huyện Quế Sơn",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50317051",
    "wardName": "Xã Quế Sơn",
    "districtId": 50317,
    "districtName": "Huyện Quế Sơn",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50317052",
    "wardName": "Xã Xuân Phú",
    "districtId": 50317,
    "districtName": "Huyện Quế Sơn",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50317053",
    "wardName": "Xã Nông Sơn",
    "districtId": 50317,
    "districtName": "Huyện Quế Sơn",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50317054",
    "wardName": "Xã Quế Phước",
    "districtId": 50317,
    "districtName": "Huyện Quế Sơn",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50311055",
    "wardName": "Xã Duy Nghĩa",
    "districtId": 50311,
    "districtName": "Huyện Duy Xuyên",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50311056",
    "wardName": "Xã Nam Phước",
    "districtId": 50311,
    "districtName": "Huyện Duy Xuyên",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50311057",
    "wardName": "Xã Duy Xuyên",
    "districtId": 50311,
    "districtName": "Huyện Duy Xuyên",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50311058",
    "wardName": "Xã Thu Bồn",
    "districtId": 50311,
    "districtName": "Huyện Duy Xuyên",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50309059",
    "wardName": "Phường Điện Bàn",
    "districtId": 50309,
    "districtName": "Thị xã Điện Bàn",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50309060",
    "wardName": "Phường Điện Bàn Đông",
    "districtId": 50309,
    "districtName": "Thị xã Điện Bàn",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50309061",
    "wardName": "Phường An Thắng",
    "districtId": 50309,
    "districtName": "Thị xã Điện Bàn",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50309062",
    "wardName": "Phường Điện Bàn Bắc",
    "districtId": 50309,
    "districtName": "Thị xã Điện Bàn",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50309063",
    "wardName": "Xã Điện Bàn Tây",
    "districtId": 50309,
    "districtName": "Thị xã Điện Bàn",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50309064",
    "wardName": "Xã Gò Nổi",
    "districtId": 50309,
    "districtName": "Thị xã Điện Bàn",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50303065",
    "wardName": "Phường Hội An",
    "districtId": 50303,
    "districtName": "Thành phố Hội An",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50303066",
    "wardName": "Phường Hội An Đông",
    "districtId": 50303,
    "districtName": "Thành phố Hội An",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50303067",
    "wardName": "Phường Hội An Tây",
    "districtId": 50303,
    "districtName": "Thành phố Hội An",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50303068",
    "wardName": "Xã Tân Hiệp",
    "districtId": 50303,
    "districtName": "Thành phố Hội An",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50307069",
    "wardName": "Xã Đại Lộc",
    "districtId": 50307,
    "districtName": "Huyện Đại Lộc",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50307070",
    "wardName": "Xã Hà Nha",
    "districtId": 50307,
    "districtName": "Huyện Đại Lộc",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50307071",
    "wardName": "Xã Thượng Đức",
    "districtId": 50307,
    "districtName": "Huyện Đại Lộc",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50307072",
    "wardName": "Xã Vu Gia",
    "districtId": 50307,
    "districtName": "Huyện Đại Lộc",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50307073",
    "wardName": "Xã Phú Thuận",
    "districtId": 50307,
    "districtName": "Huyện Đại Lộc",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50313074",
    "wardName": "Xã Thạnh Mỹ",
    "districtId": 50313,
    "districtName": "Huyện Nam Giang",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50313075",
    "wardName": "Xã Bến Giằng",
    "districtId": 50313,
    "districtName": "Huyện Nam Giang",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50313076",
    "wardName": "Xã Nam Giang",
    "districtId": 50313,
    "districtName": "Huyện Nam Giang",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50313077",
    "wardName": "Xã Đắc Pring",
    "districtId": 50313,
    "districtName": "Huyện Nam Giang",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50313078",
    "wardName": "Xã La Dêê",
    "districtId": 50313,
    "districtName": "Huyện Nam Giang",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50313079",
    "wardName": "Xã La Êê",
    "districtId": 50313,
    "districtName": "Huyện Nam Giang",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50305080",
    "wardName": "Xã Sông Vàng",
    "districtId": 50305,
    "districtName": "Huyện Đông Giang",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50305081",
    "wardName": "Xã Sông Kôn",
    "districtId": 50305,
    "districtName": "Huyện Đông Giang",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50305082",
    "wardName": "Xã Đông Giang",
    "districtId": 50305,
    "districtName": "Huyện Đông Giang",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50305083",
    "wardName": "Xã Bến Hiên",
    "districtId": 50305,
    "districtName": "Huyện Đông Giang",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50304084",
    "wardName": "Xã Avương",
    "districtId": 50304,
    "districtName": "Huyện Tây Giang",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50304085",
    "wardName": "Xã Tây Giang",
    "districtId": 50304,
    "districtName": "Huyện Tây Giang",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50304086",
    "wardName": "Xã Hùng Sơn",
    "districtId": 50304,
    "districtName": "Huyện Tây Giang",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50319087",
    "wardName": "Xã Hiệp Đức",
    "districtId": 50319,
    "districtName": "Huyện Hiệp Đức",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50319088",
    "wardName": "Xã Việt An",
    "districtId": 50319,
    "districtName": "Huyện Hiệp Đức",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50319089",
    "wardName": "Xã Phước Trà",
    "districtId": 50319,
    "districtName": "Huyện Hiệp Đức",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50323090",
    "wardName": "Xã Khâm Đức",
    "districtId": 50323,
    "districtName": "Huyện Phước Sơn",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50323091",
    "wardName": "Xã Phước Năng",
    "districtId": 50323,
    "districtName": "Huyện Phước Sơn",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50323092",
    "wardName": "Xã Phước Chánh",
    "districtId": 50323,
    "districtName": "Huyện Phước Sơn",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50323093",
    "wardName": "Xã Phước Thành",
    "districtId": 50323,
    "districtName": "Huyện Phước Sơn",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50323094",
    "wardName": "Xã Phước Hiệp",
    "districtId": 50323,
    "districtName": "Huyện Phước Sơn",
    "provinceId": 21,
    "provinceName": "Tp Đà Nẵng"
  },
  {
    "wardId": "50501001",
    "wardName": "Xã Tịnh Khê",
    "districtId": 50501,
    "districtName": "Thành phố Quảng Ngãi",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50501002",
    "wardName": "Phường Trương Quang Trọng",
    "districtId": 50501,
    "districtName": "Thành phố Quảng Ngãi",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50501003",
    "wardName": "Xã An Phú",
    "districtId": 50501,
    "districtName": "Thành phố Quảng Ngãi",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50501004",
    "wardName": "Phường Cẩm Thành",
    "districtId": 50501,
    "districtName": "Thành phố Quảng Ngãi",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50501005",
    "wardName": "Phường Nghĩa Lộ",
    "districtId": 50501,
    "districtName": "Thành phố Quảng Ngãi",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50523006",
    "wardName": "Phường Trà Câu",
    "districtId": 50523,
    "districtName": "Thị xã Đức Phổ",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50523007",
    "wardName": "Xã Nguyễn Nghiêm",
    "districtId": 50523,
    "districtName": "Thị xã Đức Phổ",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50523008",
    "wardName": "Phường Đức Phổ",
    "districtId": 50523,
    "districtName": "Thị xã Đức Phổ",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50523009",
    "wardName": "Xã Khánh Cường",
    "districtId": 50523,
    "districtName": "Thị xã Đức Phổ",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50523010",
    "wardName": "Phường Sa Huỳnh",
    "districtId": 50523,
    "districtName": "Thị xã Đức Phổ",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50505011",
    "wardName": "Xã Bình Minh",
    "districtId": 50505,
    "districtName": "Huyện Bình Sơn",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50505012",
    "wardName": "Xã Bình Chương",
    "districtId": 50505,
    "districtName": "Huyện Bình Sơn",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50505013",
    "wardName": "Xã Bình Sơn",
    "districtId": 50505,
    "districtName": "Huyện Bình Sơn",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50505014",
    "wardName": "Xã Vạn Tường",
    "districtId": 50505,
    "districtName": "Huyện Bình Sơn",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50505015",
    "wardName": "Xã Đông Sơn",
    "districtId": 50505,
    "districtName": "Huyện Bình Sơn",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50509016",
    "wardName": "Xã Trường Giang",
    "districtId": 50509,
    "districtName": "Huyện Sơn Tịnh",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50509017",
    "wardName": "Xã Ba Gia",
    "districtId": 50509,
    "districtName": "Huyện Sơn Tịnh",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50509018",
    "wardName": "Xã Sơn Tịnh",
    "districtId": 50509,
    "districtName": "Huyện Sơn Tịnh",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50509019",
    "wardName": "Xã Thọ Phong",
    "districtId": 50509,
    "districtName": "Huyện Sơn Tịnh",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50515020",
    "wardName": "Xã Tư Nghĩa",
    "districtId": 50515,
    "districtName": "Huyện Tư Nghĩa",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50515021",
    "wardName": "Xã Vệ Giang",
    "districtId": 50515,
    "districtName": "Huyện Tư Nghĩa",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50515022",
    "wardName": "Xã Nghĩa Giang",
    "districtId": 50515,
    "districtName": "Huyện Tư Nghĩa",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50515023",
    "wardName": "Xã Trà Giang",
    "districtId": 50515,
    "districtName": "Huyện Tư Nghĩa",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50517024",
    "wardName": "Xã Nghĩa Hành",
    "districtId": 50517,
    "districtName": "Huyện Nghĩa Hành",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50517025",
    "wardName": "Xã Đình Cương",
    "districtId": 50517,
    "districtName": "Huyện Nghĩa Hành",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50517026",
    "wardName": "Xã Thiện Tín",
    "districtId": 50517,
    "districtName": "Huyện Nghĩa Hành",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50517027",
    "wardName": "Xã Phước Giang",
    "districtId": 50517,
    "districtName": "Huyện Nghĩa Hành",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50521028",
    "wardName": "Xã Long Phụng",
    "districtId": 50521,
    "districtName": "Huyện Mộ Đức",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50521029",
    "wardName": "Xã Mỏ Cày",
    "districtId": 50521,
    "districtName": "Huyện Mộ Đức",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50521030",
    "wardName": "Xã Mộ Đức",
    "districtId": 50521,
    "districtName": "Huyện Mộ Đức",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50521031",
    "wardName": "Xã Lân Phong",
    "districtId": 50521,
    "districtName": "Huyện Mộ Đức",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50507032",
    "wardName": "Xã Trà Bồng",
    "districtId": 50507,
    "districtName": "Huyện Trà Bồng",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50507033",
    "wardName": "Xã Đông Trà Bồng",
    "districtId": 50507,
    "districtName": "Huyện Trà Bồng",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50507034",
    "wardName": "Xã Tây Trà",
    "districtId": 50507,
    "districtName": "Huyện Trà Bồng",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50507035",
    "wardName": "Xã Thanh Bồng",
    "districtId": 50507,
    "districtName": "Huyện Trà Bồng",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50507036",
    "wardName": "Xã Cà Đam",
    "districtId": 50507,
    "districtName": "Huyện Trà Bồng",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50507037",
    "wardName": "Xã Tây Trà Bồng",
    "districtId": 50507,
    "districtName": "Huyện Trà Bồng",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50513038",
    "wardName": "Xã Sơn Hạ",
    "districtId": 50513,
    "districtName": "Huyện Sơn Hà",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50513039",
    "wardName": "Xã Sơn Linh",
    "districtId": 50513,
    "districtName": "Huyện Sơn Hà",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50513040",
    "wardName": "Xã Sơn Hà",
    "districtId": 50513,
    "districtName": "Huyện Sơn Hà",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50513041",
    "wardName": "Xã Sơn Thủy",
    "districtId": 50513,
    "districtName": "Huyện Sơn Hà",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50513042",
    "wardName": "Xã Sơn Kỳ",
    "districtId": 50513,
    "districtName": "Huyện Sơn Hà",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50511043",
    "wardName": "Xã Sơn Tây",
    "districtId": 50511,
    "districtName": "Huyện Sơn Tây",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50511044",
    "wardName": "Xã Sơn Tây Thượng",
    "districtId": 50511,
    "districtName": "Huyện Sơn Tây",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50511045",
    "wardName": "Xã Sơn Tây Hạ",
    "districtId": 50511,
    "districtName": "Huyện Sơn Tây",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50519046",
    "wardName": "Xã Minh Long",
    "districtId": 50519,
    "districtName": "Huyện Minh Long",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50519047",
    "wardName": "Xã Sơn Mai",
    "districtId": 50519,
    "districtName": "Huyện Minh Long",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50525048",
    "wardName": "Xã Ba Vì",
    "districtId": 50525,
    "districtName": "Huyện Ba Tơ",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50525049",
    "wardName": "Xã Ba Tô",
    "districtId": 50525,
    "districtName": "Huyện Ba Tơ",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50525050",
    "wardName": "Xã Ba Dinh",
    "districtId": 50525,
    "districtName": "Huyện Ba Tơ",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50525051",
    "wardName": "Xã Ba Tơ",
    "districtId": 50525,
    "districtName": "Huyện Ba Tơ",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50525052",
    "wardName": "Xã Ba Vinh",
    "districtId": 50525,
    "districtName": "Huyện Ba Tơ",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50525053",
    "wardName": "Xã Ba Động",
    "districtId": 50525,
    "districtName": "Huyện Ba Tơ",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50525054",
    "wardName": "Xã Đặng Thùy Trâm",
    "districtId": 50525,
    "districtName": "Huyện Ba Tơ",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50525055",
    "wardName": "Xã Ba Xa",
    "districtId": 50525,
    "districtName": "Huyện Ba Tơ",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "50503056",
    "wardName": "Đặc khu Lý Sơn",
    "districtId": 50503,
    "districtName": "Huyện Lý Sơn",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60101057",
    "wardName": "Phường Kon Tum",
    "districtId": 60101,
    "districtName": "Thành phố Kon Tum",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60101058",
    "wardName": "Phường Đăk Cấm",
    "districtId": 60101,
    "districtName": "Thành phố Kon Tum",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60101059",
    "wardName": "Phường Đăk BLa",
    "districtId": 60101,
    "districtName": "Thành phố Kon Tum",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60101060",
    "wardName": "Xã Ngọk Bay",
    "districtId": 60101,
    "districtName": "Thành phố Kon Tum",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60101061",
    "wardName": "Xã Ia Chim",
    "districtId": 60101,
    "districtName": "Thành phố Kon Tum",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60101062",
    "wardName": "Xã Đăk Rơ Wa",
    "districtId": 60101,
    "districtName": "Thành phố Kon Tum",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60111063",
    "wardName": "Xã Đăk Pxi",
    "districtId": 60111,
    "districtName": "Huyện Đăk Hà",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60111064",
    "wardName": "Xã Đăk Mar",
    "districtId": 60111,
    "districtName": "Huyện Đăk Hà",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60111065",
    "wardName": "Xã Đăk Ui",
    "districtId": 60111,
    "districtName": "Huyện Đăk Hà",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60111066",
    "wardName": "Xã Ngọk Réo",
    "districtId": 60111,
    "districtName": "Huyện Đăk Hà",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60111067",
    "wardName": "Xã Đăk Hà",
    "districtId": 60111,
    "districtName": "Huyện Đăk Hà",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60107068",
    "wardName": "Xã Ngọk Tụ",
    "districtId": 60107,
    "districtName": "Huyện Đắk Tô",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60107069",
    "wardName": "Xã Đăk Tô",
    "districtId": 60107,
    "districtName": "Huyện Đắk Tô",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60107070",
    "wardName": "Xã Kon Đào",
    "districtId": 60107,
    "districtName": "Huyện Đắk Tô",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60115071",
    "wardName": "Xã Đăk Sao",
    "districtId": 60115,
    "districtName": "Huyện Tu Mơ Rông",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60115072",
    "wardName": "Xã Đăk Tờ Kan",
    "districtId": 60115,
    "districtName": "Huyện Tu Mơ Rông",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60115073",
    "wardName": "Xã Tu Mơ Rông",
    "districtId": 60115,
    "districtName": "Huyện Tu Mơ Rông",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60115074",
    "wardName": "Xã Măng Ri",
    "districtId": 60115,
    "districtName": "Huyện Tu Mơ Rông",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60105075",
    "wardName": "Xã Bờ Y",
    "districtId": 60105,
    "districtName": "Huyện Ngọc Hồi",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60105076",
    "wardName": "Xã Sa Loong",
    "districtId": 60105,
    "districtName": "Huyện Ngọc Hồi",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60105077",
    "wardName": "Xã Dục Nông",
    "districtId": 60105,
    "districtName": "Huyện Ngọc Hồi",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60103078",
    "wardName": "Xã Xốp",
    "districtId": 60103,
    "districtName": "Huyện Đắk Glei",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60103079",
    "wardName": "Xã Ngọc Linh",
    "districtId": 60103,
    "districtName": "Huyện Đắk Glei",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60103080",
    "wardName": "Xã Đăk Plô",
    "districtId": 60103,
    "districtName": "Huyện Đắk Glei",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60103081",
    "wardName": "Xã Đăk Pék",
    "districtId": 60103,
    "districtName": "Huyện Đắk Glei",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60103082",
    "wardName": "Xã Đăk Môn",
    "districtId": 60103,
    "districtName": "Huyện Đắk Glei",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60113083",
    "wardName": "Xã Sa Thầy",
    "districtId": 60113,
    "districtName": "Huyện Sa Thầy",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60113084",
    "wardName": "Xã Sa Bình",
    "districtId": 60113,
    "districtName": "Huyện Sa Thầy",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60113085",
    "wardName": "Xã Ya Ly",
    "districtId": 60113,
    "districtName": "Huyện Sa Thầy",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60114086",
    "wardName": "Xã Ia Tơi",
    "districtId": 60114,
    "districtName": "Huyện Ia H'Drai",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60108087",
    "wardName": "Xã Đăk Kôi",
    "districtId": 60108,
    "districtName": "Huyện Kon Rẫy",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60108088",
    "wardName": "Xã Kon Braih",
    "districtId": 60108,
    "districtName": "Huyện Kon Rẫy",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60108089",
    "wardName": "Xã Đăk Rve",
    "districtId": 60108,
    "districtName": "Huyện Kon Rẫy",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60109090",
    "wardName": "Xã Măng Đen",
    "districtId": 60109,
    "districtName": "Huyện Kon Plông",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60109091",
    "wardName": "Xã Măng Bút",
    "districtId": 60109,
    "districtName": "Huyện Kon Plông",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60109092",
    "wardName": "Xã Kon Plông",
    "districtId": 60109,
    "districtName": "Huyện Kon Plông",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60103093",
    "wardName": "Xã Đăk Long",
    "districtId": 60103,
    "districtName": "Huyện Đắk Glei",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60113094",
    "wardName": "Xã Rờ Kơi",
    "districtId": 60113,
    "districtName": "Huyện Sa Thầy",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60113095",
    "wardName": "Xã Mô Rai",
    "districtId": 60113,
    "districtName": "Huyện Sa Thầy",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "60114096",
    "wardName": "Xã Ia Đal",
    "districtId": 60114,
    "districtName": "Huyện Ia H'Drai",
    "provinceId": 22,
    "provinceName": "Tỉnh Quảng Ngãi"
  },
  {
    "wardId": "51101001",
    "wardName": "Phường Nha Trang",
    "districtId": 51101,
    "districtName": "Thành phố Nha Trang",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51101002",
    "wardName": "Phường Bắc Nha Trang",
    "districtId": 51101,
    "districtName": "Thành phố Nha Trang",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51101003",
    "wardName": "Phường Tây Nha Trang",
    "districtId": 51101,
    "districtName": "Thành phố Nha Trang",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51101004",
    "wardName": "Phường Nam Nha Trang",
    "districtId": 51101,
    "districtName": "Thành phố Nha Trang",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51109005",
    "wardName": "Phường Bắc Cam Ranh",
    "districtId": 51109,
    "districtName": "Thành phố Cam Ranh",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51109006",
    "wardName": "Phường Cam Ranh",
    "districtId": 51109,
    "districtName": "Thành phố Cam Ranh",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51109007",
    "wardName": "Phường Cam Linh",
    "districtId": 51109,
    "districtName": "Thành phố Cam Ranh",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51109008",
    "wardName": "Phường Ba Ngòi",
    "districtId": 51109,
    "districtName": "Thành phố Cam Ranh",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51109009",
    "wardName": "Xã Nam Cam Ranh",
    "districtId": 51109,
    "districtName": "Thành phố Cam Ranh",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51105010",
    "wardName": "Xã Bắc Ninh Hoà",
    "districtId": 51105,
    "districtName": "Thị xã Ninh Hoà",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51105011",
    "wardName": "Phường Ninh Hoà",
    "districtId": 51105,
    "districtName": "Thị xã Ninh Hoà",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51105012",
    "wardName": "Xã Tân Định",
    "districtId": 51105,
    "districtName": "Thị xã Ninh Hoà",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51105013",
    "wardName": "Phường Đông Ninh Hoà",
    "districtId": 51105,
    "districtName": "Thị xã Ninh Hoà",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51105014",
    "wardName": "Phường Hoà Thắng",
    "districtId": 51105,
    "districtName": "Thị xã Ninh Hoà",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51105015",
    "wardName": "Xã Nam Ninh Hoà",
    "districtId": 51105,
    "districtName": "Thị xã Ninh Hoà",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51105016",
    "wardName": "Xã Tây Ninh Hoà",
    "districtId": 51105,
    "districtName": "Thị xã Ninh Hoà",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51105017",
    "wardName": "Xã Hoà Trí",
    "districtId": 51105,
    "districtName": "Thị xã Ninh Hoà",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51103018",
    "wardName": "Xã Đại Lãnh",
    "districtId": 51103,
    "districtName": "Huyện Vạn Ninh",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51103019",
    "wardName": "Xã Tu Bông",
    "districtId": 51103,
    "districtName": "Huyện Vạn Ninh",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51103020",
    "wardName": "Xã Vạn Thắng",
    "districtId": 51103,
    "districtName": "Huyện Vạn Ninh",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51103021",
    "wardName": "Xã Vạn Ninh",
    "districtId": 51103,
    "districtName": "Huyện Vạn Ninh",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51103022",
    "wardName": "Xã Vạn Hưng",
    "districtId": 51103,
    "districtName": "Huyện Vạn Ninh",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51107023",
    "wardName": "Xã Diên Khánh",
    "districtId": 51107,
    "districtName": "Huyện Diên Khánh",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51107024",
    "wardName": "Xã Diên Lạc",
    "districtId": 51107,
    "districtName": "Huyện Diên Khánh",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51107025",
    "wardName": "Xã Diên Điền",
    "districtId": 51107,
    "districtName": "Huyện Diên Khánh",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51107026",
    "wardName": "Xã Diên Lâm",
    "districtId": 51107,
    "districtName": "Huyện Diên Khánh",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51107027",
    "wardName": "Xã Diên Thọ",
    "districtId": 51107,
    "districtName": "Huyện Diên Khánh",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51107028",
    "wardName": "Xã Suối Hiệp",
    "districtId": 51107,
    "districtName": "Huyện Diên Khánh",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51117029",
    "wardName": "Xã Cam Lâm",
    "districtId": 51117,
    "districtName": "Huyện Cam Lâm",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51117030",
    "wardName": "Xã Suối Dầu",
    "districtId": 51117,
    "districtName": "Huyện Cam Lâm",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51117031",
    "wardName": "Xã Cam Hiệp",
    "districtId": 51117,
    "districtName": "Huyện Cam Lâm",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51117032",
    "wardName": "Xã Cam An",
    "districtId": 51117,
    "districtName": "Huyện Cam Lâm",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51111033",
    "wardName": "Xã Bắc Khánh Vĩnh",
    "districtId": 51111,
    "districtName": "Huyện Khánh Vĩnh",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51111034",
    "wardName": "Xã Trung Khánh Vĩnh",
    "districtId": 51111,
    "districtName": "Huyện Khánh Vĩnh",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51111035",
    "wardName": "Xã Tây Khánh Vĩnh",
    "districtId": 51111,
    "districtName": "Huyện Khánh Vĩnh",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51111036",
    "wardName": "Xã Nam Khánh Vĩnh",
    "districtId": 51111,
    "districtName": "Huyện Khánh Vĩnh",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51111037",
    "wardName": "Xã Khánh Vĩnh",
    "districtId": 51111,
    "districtName": "Huyện Khánh Vĩnh",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51113038",
    "wardName": "Xã Khánh Sơn",
    "districtId": 51113,
    "districtName": "Huyện Khánh Sơn",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51113039",
    "wardName": "Xã Tây Khánh Sơn",
    "districtId": 51113,
    "districtName": "Huyện Khánh Sơn",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51113040",
    "wardName": "Xã Đông Khánh Sơn",
    "districtId": 51113,
    "districtName": "Huyện Khánh Sơn",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "51115041",
    "wardName": "Đặc khu Trường Sa",
    "districtId": 51115,
    "districtName": "Huyện Trường Sa",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "70501042",
    "wardName": "Phường Phan Rang",
    "districtId": 70501,
    "districtName": "TP.Phan Rang-Tháp Chàm",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "70501043",
    "wardName": "Phường Đông Hải",
    "districtId": 70501,
    "districtName": "TP.Phan Rang-Tháp Chàm",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "70505044",
    "wardName": "Phường Ninh Chử",
    "districtId": 70505,
    "districtName": "Huyện Ninh Hải",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "70501045",
    "wardName": "Phường Bảo An",
    "districtId": 70501,
    "districtName": "TP.Phan Rang-Tháp Chàm",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "70501046",
    "wardName": "Phường Đô Vinh",
    "districtId": 70501,
    "districtName": "TP.Phan Rang-Tháp Chàm",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "70507047",
    "wardName": "Xã Ninh Phước",
    "districtId": 70507,
    "districtName": "Huyện Ninh Phước",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "70507048",
    "wardName": "Xã Phước Hữu",
    "districtId": 70507,
    "districtName": "Huyện Ninh Phước",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "70507049",
    "wardName": "Xã Phước Hậu",
    "districtId": 70507,
    "districtName": "Huyện Ninh Phước",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "70513050",
    "wardName": "Xã Thuận Nam",
    "districtId": 70513,
    "districtName": "Huyện Thuận Nam",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "70513051",
    "wardName": "Xã Cà Ná",
    "districtId": 70513,
    "districtName": "Huyện Thuận Nam",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "70513052",
    "wardName": "Xã Phước Hà",
    "districtId": 70513,
    "districtName": "Huyện Thuận Nam",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "70513053",
    "wardName": "Xã Phước Dinh",
    "districtId": 70513,
    "districtName": "Huyện Thuận Nam",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "70505054",
    "wardName": "Xã Ninh Hải",
    "districtId": 70505,
    "districtName": "Huyện Ninh Hải",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "70505055",
    "wardName": "Xã Xuân Hải",
    "districtId": 70505,
    "districtName": "Huyện Ninh Hải",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "70505056",
    "wardName": "Xã Vĩnh Hải",
    "districtId": 70505,
    "districtName": "Huyện Ninh Hải",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "70511057",
    "wardName": "Xã Thuận Bắc",
    "districtId": 70511,
    "districtName": "Huyện Thuận Bắc",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "70511058",
    "wardName": "Xã Công Hải",
    "districtId": 70511,
    "districtName": "Huyện Thuận Bắc",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "70503059",
    "wardName": "Xã Ninh Sơn",
    "districtId": 70503,
    "districtName": "Huyện Ninh Sơn",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "70503060",
    "wardName": "Xã Lâm Sơn",
    "districtId": 70503,
    "districtName": "Huyện Ninh Sơn",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "70503061",
    "wardName": "Xã Anh Dũng",
    "districtId": 70503,
    "districtName": "Huyện Ninh Sơn",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "70503062",
    "wardName": "Xã Mỹ Sơn",
    "districtId": 70503,
    "districtName": "Huyện Ninh Sơn",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "70509063",
    "wardName": "Xã Bác Ái Đông",
    "districtId": 70509,
    "districtName": "Huyện Bác Ái",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "70509064",
    "wardName": "Xã Bác Ái",
    "districtId": 70509,
    "districtName": "Huyện Bác Ái",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "70509065",
    "wardName": "Xã Bác Ái Tây",
    "districtId": 70509,
    "districtName": "Huyện Bác Ái",
    "provinceId": 23,
    "provinceName": "Tỉnh Khánh Hòa"
  },
  {
    "wardId": "50701001",
    "wardName": "Phường Quy Nhơn",
    "districtId": 50701,
    "districtName": "Thành phố Quy Nhơn",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50701002",
    "wardName": "Phường Quy Nhơn Đông",
    "districtId": 50701,
    "districtName": "Thành phố Quy Nhơn",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50701003",
    "wardName": "Phường Quy Nhơn Tây",
    "districtId": 50701,
    "districtName": "Thành phố Quy Nhơn",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50701004",
    "wardName": "Phường Quy Nhơn Nam",
    "districtId": 50701,
    "districtName": "Thành phố Quy Nhơn",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50701005",
    "wardName": "Phường Quy Nhơn Bắc",
    "districtId": 50701,
    "districtName": "Thành phố Quy Nhơn",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50717006",
    "wardName": "Phường Bình Định",
    "districtId": 50717,
    "districtName": "Thị xã An Nhơn",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50717007",
    "wardName": "Phường An Nhơn",
    "districtId": 50717,
    "districtName": "Thị xã An Nhơn",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50717008",
    "wardName": "Phường An Nhơn Đông",
    "districtId": 50717,
    "districtName": "Thị xã An Nhơn",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50717009",
    "wardName": "Phường An Nhơn Nam",
    "districtId": 50717,
    "districtName": "Thị xã An Nhơn",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50717010",
    "wardName": "Phường An Nhơn Bắc",
    "districtId": 50717,
    "districtName": "Thị xã An Nhơn",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50717011",
    "wardName": "Xã An Nhơn Tây",
    "districtId": 50717,
    "districtName": "Thị xã An Nhơn",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50705012",
    "wardName": "Phường Bồng Sơn",
    "districtId": 50705,
    "districtName": "Thị xã Hoài Nhơn",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50705013",
    "wardName": "Phường Hoài Nhơn",
    "districtId": 50705,
    "districtName": "Thị xã Hoài Nhơn",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50705014",
    "wardName": "Phường Tam Quan",
    "districtId": 50705,
    "districtName": "Thị xã Hoài Nhơn",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50705015",
    "wardName": "Phường Hoài Nhơn Đông",
    "districtId": 50705,
    "districtName": "Thị xã Hoài Nhơn",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50705016",
    "wardName": "Phường Hoài Nhơn Tây",
    "districtId": 50705,
    "districtName": "Thị xã Hoài Nhơn",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50705017",
    "wardName": "Phường Hoài Nhơn Nam",
    "districtId": 50705,
    "districtName": "Thị xã Hoài Nhơn",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50705018",
    "wardName": "Phường Hoài Nhơn Bắc",
    "districtId": 50705,
    "districtName": "Thị xã Hoài Nhơn",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50713019",
    "wardName": "Xã Phù Cát",
    "districtId": 50713,
    "districtName": "Huyện Phù Cát",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50713020",
    "wardName": "Xã Xuân An",
    "districtId": 50713,
    "districtName": "Huyện Phù Cát",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50713021",
    "wardName": "Xã Ngô Mây",
    "districtId": 50713,
    "districtName": "Huyện Phù Cát",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50713022",
    "wardName": "Xã Cát Tiến",
    "districtId": 50713,
    "districtName": "Huyện Phù Cát",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50713023",
    "wardName": "Xã Đề Gi",
    "districtId": 50713,
    "districtName": "Huyện Phù Cát",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50713024",
    "wardName": "Xã Hoà Hội",
    "districtId": 50713,
    "districtName": "Huyện Phù Cát",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50713025",
    "wardName": "Xã Hội Sơn",
    "districtId": 50713,
    "districtName": "Huyện Phù Cát",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50709026",
    "wardName": "Xã Phù Mỹ",
    "districtId": 50709,
    "districtName": "Huyện Phù Mỹ",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50709027",
    "wardName": "Xã An Lương",
    "districtId": 50709,
    "districtName": "Huyện Phù Mỹ",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50709028",
    "wardName": "Xã Bình Dương",
    "districtId": 50709,
    "districtName": "Huyện Phù Mỹ",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50709029",
    "wardName": "Xã Phù Mỹ Đông",
    "districtId": 50709,
    "districtName": "Huyện Phù Mỹ",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50709030",
    "wardName": "Xã Phù Mỹ Tây",
    "districtId": 50709,
    "districtName": "Huyện Phù Mỹ",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50709031",
    "wardName": "Xã Phù Mỹ Nam",
    "districtId": 50709,
    "districtName": "Huyện Phù Mỹ",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50709032",
    "wardName": "Xã Phù Mỹ Bắc",
    "districtId": 50709,
    "districtName": "Huyện Phù Mỹ",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50719033",
    "wardName": "Xã Tuy Phước",
    "districtId": 50719,
    "districtName": "Huyện Tuy Phước",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50719034",
    "wardName": "Xã Tuy Phước Đông",
    "districtId": 50719,
    "districtName": "Huyện Tuy Phước",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50719035",
    "wardName": "Xã Tuy Phước Tây",
    "districtId": 50719,
    "districtName": "Huyện Tuy Phước",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50719036",
    "wardName": "Xã Tuy Phước Bắc",
    "districtId": 50719,
    "districtName": "Huyện Tuy Phước",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50715037",
    "wardName": "Xã Tây Sơn",
    "districtId": 50715,
    "districtName": "Huyện Tây Sơn",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50715038",
    "wardName": "Xã Bình Khê",
    "districtId": 50715,
    "districtName": "Huyện Tây Sơn",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50715039",
    "wardName": "Xã Bình Phú",
    "districtId": 50715,
    "districtName": "Huyện Tây Sơn",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50715040",
    "wardName": "Xã Bình Hiệp",
    "districtId": 50715,
    "districtName": "Huyện Tây Sơn",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50715041",
    "wardName": "Xã Bình An",
    "districtId": 50715,
    "districtName": "Huyện Tây Sơn",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50707042",
    "wardName": "Xã Hoài Ân",
    "districtId": 50707,
    "districtName": "Huyện Hoài Ân",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50707043",
    "wardName": "Xã Ân Tường",
    "districtId": 50707,
    "districtName": "Huyện Hoài Ân",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50707044",
    "wardName": "Xã Kim Sơn",
    "districtId": 50707,
    "districtName": "Huyện Hoài Ân",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50707045",
    "wardName": "Xã Vạn Đức",
    "districtId": 50707,
    "districtName": "Huyện Hoài Ân",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50707046",
    "wardName": "Xã Ân Hảo",
    "districtId": 50707,
    "districtName": "Huyện Hoài Ân",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50721047",
    "wardName": "Xã Vân Canh",
    "districtId": 50721,
    "districtName": "Huyện Vân Canh",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50721048",
    "wardName": "Xã Canh Vinh",
    "districtId": 50721,
    "districtName": "Huyện Vân Canh",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50721049",
    "wardName": "Xã Canh Liên",
    "districtId": 50721,
    "districtName": "Huyện Vân Canh",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50711050",
    "wardName": "Xã Vĩnh Thạnh",
    "districtId": 50711,
    "districtName": "Huyện Vĩnh Thạnh",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50711051",
    "wardName": "Xã Vĩnh Thịnh",
    "districtId": 50711,
    "districtName": "Huyện Vĩnh Thạnh",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50711052",
    "wardName": "Xã Vĩnh Quang",
    "districtId": 50711,
    "districtName": "Huyện Vĩnh Thạnh",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50711053",
    "wardName": "Xã Vĩnh Sơn",
    "districtId": 50711,
    "districtName": "Huyện Vĩnh Thạnh",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50703054",
    "wardName": "Xã An Hoà",
    "districtId": 50703,
    "districtName": "Huyện An Lão",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50703055",
    "wardName": "Xã An Lão",
    "districtId": 50703,
    "districtName": "Huyện An Lão",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50703056",
    "wardName": "Xã An Vinh",
    "districtId": 50703,
    "districtName": "Huyện An Lão",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50703057",
    "wardName": "Xã An Toàn",
    "districtId": 50703,
    "districtName": "Huyện An Lão",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60301058",
    "wardName": "Phường Pleiku",
    "districtId": 60301,
    "districtName": "Thành phố Pleiku",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60301059",
    "wardName": "Phường Hội Phú",
    "districtId": 60301,
    "districtName": "Thành phố Pleiku",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60301060",
    "wardName": "Phường Thống Nhất",
    "districtId": 60301,
    "districtName": "Thành phố Pleiku",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60301061",
    "wardName": "Phường Diên Hồng",
    "districtId": 60301,
    "districtName": "Thành phố Pleiku",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60301062",
    "wardName": "Phường An Phú",
    "districtId": 60301,
    "districtName": "Thành phố Pleiku",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60301063",
    "wardName": "Xã Biển Hồ",
    "districtId": 60301,
    "districtName": "Thành phố Pleiku",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60301064",
    "wardName": "Xã Gào",
    "districtId": 60301,
    "districtName": "Thành phố Pleiku",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60307065",
    "wardName": "Xã Ia Ly",
    "districtId": 60307,
    "districtName": "Huyện Chư Păh",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60307066",
    "wardName": "Xã Chư Păh",
    "districtId": 60307,
    "districtName": "Huyện Chư Păh",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60307067",
    "wardName": "Xã Ia Khươl",
    "districtId": 60307,
    "districtName": "Huyện Chư Păh",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60307068",
    "wardName": "Xã Ia Phí",
    "districtId": 60307,
    "districtName": "Huyện Chư Păh",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60317069",
    "wardName": "Xã Chư Prông",
    "districtId": 60317,
    "districtName": "Huyện Chư Prông",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60317070",
    "wardName": "Xã Bàu Cạn",
    "districtId": 60317,
    "districtName": "Huyện Chư Prông",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60317071",
    "wardName": "Xã Ia Boòng",
    "districtId": 60317,
    "districtName": "Huyện Chư Prông",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60317072",
    "wardName": "Xã Ia Lâu",
    "districtId": 60317,
    "districtName": "Huyện Chư Prông",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60317073",
    "wardName": "Xã Ia Pia",
    "districtId": 60317,
    "districtName": "Huyện Chư Prông",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60317074",
    "wardName": "Xã Ia Tôr",
    "districtId": 60317,
    "districtName": "Huyện Chư Prông",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60319075",
    "wardName": "Xã Chư Sê",
    "districtId": 60319,
    "districtName": "Huyện Chư Sê",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60319076",
    "wardName": "Xã Bờ Ngoong",
    "districtId": 60319,
    "districtName": "Huyện Chư Sê",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60319077",
    "wardName": "Xã Ia Ko",
    "districtId": 60319,
    "districtName": "Huyện Chư Sê",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60319078",
    "wardName": "Xã Albá",
    "districtId": 60319,
    "districtName": "Huyện Chư Sê",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60331079",
    "wardName": "Xã Chư Pưh",
    "districtId": 60331,
    "districtName": "Huyện Chư Pưh",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60331080",
    "wardName": "Xã Ia Le",
    "districtId": 60331,
    "districtName": "Huyện Chư Pưh",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60331081",
    "wardName": "Xã Ia Hrú",
    "districtId": 60331,
    "districtName": "Huyện Chư Pưh",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60311082",
    "wardName": "Phường An Khê",
    "districtId": 60311,
    "districtName": "Thị xã An Khê",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60311083",
    "wardName": "Phường An Bình",
    "districtId": 60311,
    "districtName": "Thị xã An Khê",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60311084",
    "wardName": "Xã Cửu An",
    "districtId": 60311,
    "districtName": "Thị xã An Khê",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60327085",
    "wardName": "Xã Đak Pơ",
    "districtId": 60327,
    "districtName": "Huyện ĐakPơ",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60327086",
    "wardName": "Xã Ya Hội",
    "districtId": 60327,
    "districtName": "Huyện ĐakPơ",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60303087",
    "wardName": "Xã Kbang",
    "districtId": 60303,
    "districtName": "Huyện Kbang",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60303088",
    "wardName": "Xã Kông Bơ La",
    "districtId": 60303,
    "districtName": "Huyện Kbang",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60303089",
    "wardName": "Xã Tơ Tung",
    "districtId": 60303,
    "districtName": "Huyện Kbang",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60303090",
    "wardName": "Xã Sơn Lang",
    "districtId": 60303,
    "districtName": "Huyện Kbang",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60303091",
    "wardName": "Xã Đak Rong",
    "districtId": 60303,
    "districtName": "Huyện Kbang",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60313092",
    "wardName": "Xã Kông Chro",
    "districtId": 60313,
    "districtName": "Huyện Kông Chro",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60313093",
    "wardName": "Xã Ya Ma",
    "districtId": 60313,
    "districtName": "Huyện Kông Chro",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60313094",
    "wardName": "Xã Chư Krey",
    "districtId": 60313,
    "districtName": "Huyện Kông Chro",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60313095",
    "wardName": "Xã SRó",
    "districtId": 60313,
    "districtName": "Huyện Kông Chro",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60313096",
    "wardName": "Xã Đăk Song",
    "districtId": 60313,
    "districtName": "Huyện Kông Chro",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60313097",
    "wardName": "Xã Chơ Long",
    "districtId": 60313,
    "districtName": "Huyện Kông Chro",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60321098",
    "wardName": "Phường Ayun Pa",
    "districtId": 60321,
    "districtName": "Thị xã Ayun Pa",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60321099",
    "wardName": "Xã Ia Rbol",
    "districtId": 60321,
    "districtName": "Thị xã Ayun Pa",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60321100",
    "wardName": "Xã Ia Sao",
    "districtId": 60321,
    "districtName": "Thị xã Ayun Pa",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60329101",
    "wardName": "Xã Phú Thiện",
    "districtId": 60329,
    "districtName": "Huyện Phú Thiện",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60329102",
    "wardName": "Xã Chư A Thai",
    "districtId": 60329,
    "districtName": "Huyện Phú Thiện",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60329103",
    "wardName": "Xã Ia Hiao",
    "districtId": 60329,
    "districtName": "Huyện Phú Thiện",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60320104",
    "wardName": "Xã Pờ Tó",
    "districtId": 60320,
    "districtName": "Huyện IaPa",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60320105",
    "wardName": "Xã Ia Pa",
    "districtId": 60320,
    "districtName": "Huyện IaPa",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60320106",
    "wardName": "Xã Ia Tul",
    "districtId": 60320,
    "districtName": "Huyện IaPa",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60323107",
    "wardName": "Xã Phú Túc",
    "districtId": 60323,
    "districtName": "Huyện Krông Pa",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60323108",
    "wardName": "Xã Ia Dreh",
    "districtId": 60323,
    "districtName": "Huyện Krông Pa",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60323109",
    "wardName": "Xã Ia Rsai",
    "districtId": 60323,
    "districtName": "Huyện Krông Pa",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60323110",
    "wardName": "Xã Uar",
    "districtId": 60323,
    "districtName": "Huyện Krông Pa",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60325111",
    "wardName": "Xã Đak Đoa",
    "districtId": 60325,
    "districtName": "Huyện Đak Đoa",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60325112",
    "wardName": "Xã Kon Gang",
    "districtId": 60325,
    "districtName": "Huyện Đak Đoa",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60325113",
    "wardName": "Xã Ia Băng",
    "districtId": 60325,
    "districtName": "Huyện Đak Đoa",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60325114",
    "wardName": "Xã KDang",
    "districtId": 60325,
    "districtName": "Huyện Đak Đoa",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60325115",
    "wardName": "Xã Đak Sơmei",
    "districtId": 60325,
    "districtName": "Huyện Đak Đoa",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60305116",
    "wardName": "Xã Mang Yang",
    "districtId": 60305,
    "districtName": "Huyện Mang Yang",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60305117",
    "wardName": "Xã Lơ Pang",
    "districtId": 60305,
    "districtName": "Huyện Mang Yang",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60305118",
    "wardName": "Xã Kon Chiêng",
    "districtId": 60305,
    "districtName": "Huyện Mang Yang",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60305119",
    "wardName": "Xã Hra",
    "districtId": 60305,
    "districtName": "Huyện Mang Yang",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60305120",
    "wardName": "Xã Ayun",
    "districtId": 60305,
    "districtName": "Huyện Mang Yang",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60309121",
    "wardName": "Xã Ia Grai",
    "districtId": 60309,
    "districtName": "Huyện Ia Grai",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60309122",
    "wardName": "Xã Ia Krái",
    "districtId": 60309,
    "districtName": "Huyện Ia Grai",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60309123",
    "wardName": "Xã Ia Hrung",
    "districtId": 60309,
    "districtName": "Huyện Ia Grai",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60315124",
    "wardName": "Xã Đức Cơ",
    "districtId": 60315,
    "districtName": "Huyện Đức Cơ",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60315125",
    "wardName": "Xã Ia Dơk",
    "districtId": 60315,
    "districtName": "Huyện Đức Cơ",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60315126",
    "wardName": "Xã Ia Krêl",
    "districtId": 60315,
    "districtName": "Huyện Đức Cơ",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "50701127",
    "wardName": "Xã Nhơn Châu",
    "districtId": 50701,
    "districtName": "Thành phố Quy Nhơn",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60317128",
    "wardName": "Xã Ia Púch",
    "districtId": 60317,
    "districtName": "Huyện Chư Prông",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60317129",
    "wardName": "Xã Ia Mơ",
    "districtId": 60317,
    "districtName": "Huyện Chư Prông",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60315130",
    "wardName": "Xã Ia Pnôn",
    "districtId": 60315,
    "districtName": "Huyện Đức Cơ",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60315131",
    "wardName": "Xã Ia Nan",
    "districtId": 60315,
    "districtName": "Huyện Đức Cơ",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60315132",
    "wardName": "Xã Ia Dom",
    "districtId": 60315,
    "districtName": "Huyện Đức Cơ",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60309133",
    "wardName": "Xã Ia Chia",
    "districtId": 60309,
    "districtName": "Huyện Ia Grai",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60309134",
    "wardName": "Xã Ia O",
    "districtId": 60309,
    "districtName": "Huyện Ia Grai",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60303135",
    "wardName": "Xã Krong",
    "districtId": 60303,
    "districtName": "Huyện Kbang",
    "provinceId": 24,
    "provinceName": "Tỉnh Gia Lai"
  },
  {
    "wardId": "60501001",
    "wardName": "Xã Hoà Phú",
    "districtId": 60501,
    "districtName": "TP.Buôn Ma Thuột",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60501002",
    "wardName": "Phường Buôn Ma Thuột",
    "districtId": 60501,
    "districtName": "TP.Buôn Ma Thuột",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60501003",
    "wardName": "Phường Tân An",
    "districtId": 60501,
    "districtName": "TP.Buôn Ma Thuột",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60501004",
    "wardName": "Phường Tân Lập",
    "districtId": 60501,
    "districtName": "TP.Buôn Ma Thuột",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60501005",
    "wardName": "Phường Thành Nhất",
    "districtId": 60501,
    "districtName": "TP.Buôn Ma Thuột",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60501006",
    "wardName": "Phường Ea Kao",
    "districtId": 60501,
    "districtName": "TP.Buôn Ma Thuột",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60509007",
    "wardName": "Xã Ea Drông",
    "districtId": 60509,
    "districtName": "Thị xã Buôn Hồ",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60509008",
    "wardName": "Phường Buôn Hồ",
    "districtId": 60509,
    "districtName": "Thị xã Buôn Hồ",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60509009",
    "wardName": "Phường Cư Bao",
    "districtId": 60509,
    "districtName": "Thị xã Buôn Hồ",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60505010",
    "wardName": "Xã Ea Súp",
    "districtId": 60505,
    "districtName": "Huyện Ea Súp",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60505011",
    "wardName": "Xã Ea Rốk",
    "districtId": 60505,
    "districtName": "Huyện Ea Súp",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60505012",
    "wardName": "Xã Ea Bung",
    "districtId": 60505,
    "districtName": "Huyện Ea Súp",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60505013",
    "wardName": "Xã Ia Rvê",
    "districtId": 60505,
    "districtName": "Huyện Ea Súp",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60505014",
    "wardName": "Xã Ia Lốp",
    "districtId": 60505,
    "districtName": "Huyện Ea Súp",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60511015",
    "wardName": "Xã Ea Wer",
    "districtId": 60511,
    "districtName": "Huyện Buôn Đôn",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60511016",
    "wardName": "Xã Ea Nuôl",
    "districtId": 60511,
    "districtName": "Huyện Buôn Đôn",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60511017",
    "wardName": "Xã Buôn Đôn",
    "districtId": 60511,
    "districtName": "Huyện Buôn Đôn",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60513018",
    "wardName": "Xã Ea Kiết",
    "districtId": 60513,
    "districtName": "Huyện Cư M'gar",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60513019",
    "wardName": "Xã Ea M’Droh",
    "districtId": 60513,
    "districtName": "Huyện Cư M'gar",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60513020",
    "wardName": "Xã Quảng Phú",
    "districtId": 60513,
    "districtName": "Huyện Cư M'gar",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60513021",
    "wardName": "Xã Cuôr Đăng",
    "districtId": 60513,
    "districtName": "Huyện Cư M'gar",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60513022",
    "wardName": "Xã Cư M’gar",
    "districtId": 60513,
    "districtName": "Huyện Cư M'gar",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60513023",
    "wardName": "Xã Ea Tul",
    "districtId": 60513,
    "districtName": "Huyện Cư M'gar",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60539024",
    "wardName": "Xã Pơng Drang",
    "districtId": 60539,
    "districtName": "Huyện Krông Buk",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60539025",
    "wardName": "Xã Krông Búk",
    "districtId": 60539,
    "districtName": "Huyện Krông Buk",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60539026",
    "wardName": "Xã Cư Pơng",
    "districtId": 60539,
    "districtName": "Huyện Krông Buk",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60503027",
    "wardName": "Xã Ea Khăl",
    "districtId": 60503,
    "districtName": "Huyện Ea H'leo",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60503028",
    "wardName": "Xã Ea Drăng",
    "districtId": 60503,
    "districtName": "Huyện Ea H'leo",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60503029",
    "wardName": "Xã Ea Wy",
    "districtId": 60503,
    "districtName": "Huyện Ea H'leo",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60503030",
    "wardName": "Xã Ea H’leo",
    "districtId": 60503,
    "districtName": "Huyện Ea H'leo",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60503031",
    "wardName": "Xã Ea Hiao",
    "districtId": 60503,
    "districtName": "Huyện Ea H'leo",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60507032",
    "wardName": "Xã Krông Năng",
    "districtId": 60507,
    "districtName": "Huyện Krông Năng",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60507033",
    "wardName": "Xã Dliê Ya",
    "districtId": 60507,
    "districtName": "Huyện Krông Năng",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60507034",
    "wardName": "Xã Tam Giang",
    "districtId": 60507,
    "districtName": "Huyện Krông Năng",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60507035",
    "wardName": "Xã Phú Xuân",
    "districtId": 60507,
    "districtName": "Huyện Krông Năng",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60519036",
    "wardName": "Xã Krông Pắc",
    "districtId": 60519,
    "districtName": "Huyện Krông Pắc",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60519037",
    "wardName": "Xã Ea Knuếc",
    "districtId": 60519,
    "districtName": "Huyện Krông Pắc",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60519038",
    "wardName": "Xã Tân Tiến",
    "districtId": 60519,
    "districtName": "Huyện Krông Pắc",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60519039",
    "wardName": "Xã Ea Phê",
    "districtId": 60519,
    "districtName": "Huyện Krông Pắc",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60519040",
    "wardName": "Xã Ea Kly",
    "districtId": 60519,
    "districtName": "Huyện Krông Pắc",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60519041",
    "wardName": "Xã Vụ Bổn",
    "districtId": 60519,
    "districtName": "Huyện Krông Pắc",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60515042",
    "wardName": "Xã Ea Kar",
    "districtId": 60515,
    "districtName": "Huyện Ea Kar",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60515043",
    "wardName": "Xã Ea Ô",
    "districtId": 60515,
    "districtName": "Huyện Ea Kar",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60515044",
    "wardName": "Xã Ea Knốp",
    "districtId": 60515,
    "districtName": "Huyện Ea Kar",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60515045",
    "wardName": "Xã Cư Yang",
    "districtId": 60515,
    "districtName": "Huyện Ea Kar",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60515046",
    "wardName": "Xã Ea Păl",
    "districtId": 60515,
    "districtName": "Huyện Ea Kar",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60517047",
    "wardName": "Xã M’Drắk",
    "districtId": 60517,
    "districtName": "Huyện M'ĐrắK",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60517048",
    "wardName": "Xã Ea Riêng",
    "districtId": 60517,
    "districtName": "Huyện M'ĐrắK",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60517049",
    "wardName": "Xã Cư M’ta",
    "districtId": 60517,
    "districtName": "Huyện M'ĐrắK",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60517050",
    "wardName": "Xã Krông Á",
    "districtId": 60517,
    "districtName": "Huyện M'ĐrắK",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60517051",
    "wardName": "Xã Cư Prao",
    "districtId": 60517,
    "districtName": "Huyện M'ĐrắK",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60517052",
    "wardName": "Xã Ea Trang",
    "districtId": 60517,
    "districtName": "Huyện M'ĐrắK",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60525053",
    "wardName": "Xã Hoà Sơn",
    "districtId": 60525,
    "districtName": "Huyện Krông Bông",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60525054",
    "wardName": "Xã Dang Kang",
    "districtId": 60525,
    "districtName": "Huyện Krông Bông",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60525055",
    "wardName": "Xã Krông Bông",
    "districtId": 60525,
    "districtName": "Huyện Krông Bông",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60525056",
    "wardName": "Xã Yang Mao",
    "districtId": 60525,
    "districtName": "Huyện Krông Bông",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60525057",
    "wardName": "Xã Cư Pui",
    "districtId": 60525,
    "districtName": "Huyện Krông Bông",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60531058",
    "wardName": "Xã Liên Sơn Lắk",
    "districtId": 60531,
    "districtName": "Huyện Lắk",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60531059",
    "wardName": "Xã Đắk Liêng",
    "districtId": 60531,
    "districtName": "Huyện Lắk",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60531060",
    "wardName": "Xã Nam Ka",
    "districtId": 60531,
    "districtName": "Huyện Lắk",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60531061",
    "wardName": "Xã Đắk Phơi",
    "districtId": 60531,
    "districtName": "Huyện Lắk",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60531062",
    "wardName": "Xã Krông Nô",
    "districtId": 60531,
    "districtName": "Huyện Lắk",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60537063",
    "wardName": "Xã Ea Ning",
    "districtId": 60537,
    "districtName": "Huyện Cư Kuin",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60537064",
    "wardName": "Xã Dray Bhăng",
    "districtId": 60537,
    "districtName": "Huyện Cư Kuin",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60537065",
    "wardName": "Xã Ea Ktur",
    "districtId": 60537,
    "districtName": "Huyện Cư Kuin",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60523066",
    "wardName": "Xã Krông Ana",
    "districtId": 60523,
    "districtName": "Huyện Krông A Na",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60523067",
    "wardName": "Xã Dur Kmăl",
    "districtId": 60523,
    "districtName": "Huyện Krông A Na",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "60523068",
    "wardName": "Xã Ea Na",
    "districtId": 60523,
    "districtName": "Huyện Krông A Na",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50901069",
    "wardName": "Phường Tuy Hòa",
    "districtId": 50901,
    "districtName": "Thành phố Tuy Hoà",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50901070",
    "wardName": "Phường Phú Yên",
    "districtId": 50901,
    "districtName": "Thành phố Tuy Hoà",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50901071",
    "wardName": "Phường Bình Kiến",
    "districtId": 50901,
    "districtName": "Thành phố Tuy Hoà",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50905072",
    "wardName": "Xã Xuân Thọ",
    "districtId": 50905,
    "districtName": "Thị xã Sông Cầu",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50905073",
    "wardName": "Xã Xuân Cảnh",
    "districtId": 50905,
    "districtName": "Thị xã Sông Cầu",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50905074",
    "wardName": "Xã Xuân Lộc",
    "districtId": 50905,
    "districtName": "Thị xã Sông Cầu",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50905075",
    "wardName": "Phường Xuân Đài",
    "districtId": 50905,
    "districtName": "Thị xã Sông Cầu",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50905076",
    "wardName": "Phường Sông Cầu",
    "districtId": 50905,
    "districtName": "Thị xã Sông Cầu",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50911077",
    "wardName": "Xã Hòa Xuân",
    "districtId": 50911,
    "districtName": "Thị xã Đông Hòa",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50911078",
    "wardName": "Phường Đông Hòa",
    "districtId": 50911,
    "districtName": "Thị xã Đông Hòa",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50911079",
    "wardName": "Phường Hòa Hiệp",
    "districtId": 50911,
    "districtName": "Thị xã Đông Hòa",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50907080",
    "wardName": "Xã Tuy An Bắc",
    "districtId": 50907,
    "districtName": "Huyện Tuy An",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50907081",
    "wardName": "Xã Tuy An Đông",
    "districtId": 50907,
    "districtName": "Huyện Tuy An",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50907082",
    "wardName": "Xã Ô Loan",
    "districtId": 50907,
    "districtName": "Huyện Tuy An",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50907083",
    "wardName": "Xã Tuy An Nam",
    "districtId": 50907,
    "districtName": "Huyện Tuy An",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50907084",
    "wardName": "Xã Tuy An Tây",
    "districtId": 50907,
    "districtName": "Huyện Tuy An",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50915085",
    "wardName": "Xã Phú Hòa 1",
    "districtId": 50915,
    "districtName": "Huyện Phú Hoà",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50915086",
    "wardName": "Xã Phú Hòa 2",
    "districtId": 50915,
    "districtName": "Huyện Phú Hoà",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50912087",
    "wardName": "Xã Tây Hòa",
    "districtId": 50912,
    "districtName": "Huyện Tây Hoà",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50912088",
    "wardName": "Xã Hòa Thịnh",
    "districtId": 50912,
    "districtName": "Huyện Tây Hoà",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50912089",
    "wardName": "Xã Hòa Mỹ",
    "districtId": 50912,
    "districtName": "Huyện Tây Hoà",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50912090",
    "wardName": "Xã Sơn Thành",
    "districtId": 50912,
    "districtName": "Huyện Tây Hoà",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50909091",
    "wardName": "Xã Sơn Hòa",
    "districtId": 50909,
    "districtName": "Huyện Sơn Hoà",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50909092",
    "wardName": "Xã Vân Hòa",
    "districtId": 50909,
    "districtName": "Huyện Sơn Hoà",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50909093",
    "wardName": "Xã Tây Sơn",
    "districtId": 50909,
    "districtName": "Huyện Sơn Hoà",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50909094",
    "wardName": "Xã Suối Trai",
    "districtId": 50909,
    "districtName": "Huyện Sơn Hoà",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50913095",
    "wardName": "Xã Ea Ly",
    "districtId": 50913,
    "districtName": "Huyện Sông Hinh",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50913096",
    "wardName": "Xã Ea Bá",
    "districtId": 50913,
    "districtName": "Huyện Sông Hinh",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50913097",
    "wardName": "Xã Đức Bình",
    "districtId": 50913,
    "districtName": "Huyện Sông Hinh",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50913098",
    "wardName": "Xã Sông Hinh",
    "districtId": 50913,
    "districtName": "Huyện Sông Hinh",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50903099",
    "wardName": "Xã Xuân Lãnh",
    "districtId": 50903,
    "districtName": "Huyện Đồng Xuân",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50903100",
    "wardName": "Xã Phú Mỡ",
    "districtId": 50903,
    "districtName": "Huyện Đồng Xuân",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50903101",
    "wardName": "Xã Xuân Phước",
    "districtId": 50903,
    "districtName": "Huyện Đồng Xuân",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "50903102",
    "wardName": "Xã Đồng Xuân",
    "districtId": 50903,
    "districtName": "Huyện Đồng Xuân",
    "provinceId": 25,
    "provinceName": "Tỉnh Đắk Lắk"
  },
  {
    "wardId": "70301001",
    "wardName": "Phường Xuân Hương - Đà Lạt",
    "districtId": 70301,
    "districtName": "Thành phố Đà Lạt",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70301002",
    "wardName": "Phường Cam Ly - Đà Lạt",
    "districtId": 70301,
    "districtName": "Thành phố Đà Lạt",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70301003",
    "wardName": "Phường Lâm Viên - Đà Lạt",
    "districtId": 70301,
    "districtName": "Thành phố Đà Lạt",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70301004",
    "wardName": "Phường Xuân Trường - Đà Lạt",
    "districtId": 70301,
    "districtName": "Thành phố Đà Lạt",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70305005",
    "wardName": "Phường Langbiang - Đà Lạt",
    "districtId": 70305,
    "districtName": "Huyện Lạc Dương",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70303006",
    "wardName": "Phường 1 Bảo Lộc",
    "districtId": 70303,
    "districtName": "Thành phố Bảo Lộc",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70303007",
    "wardName": "Phường 2 Bảo Lộc",
    "districtId": 70303,
    "districtName": "Thành phố Bảo Lộc",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70303008",
    "wardName": "Phường 3 Bảo Lộc",
    "districtId": 70303,
    "districtName": "Thành phố Bảo Lộc",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70303009",
    "wardName": "Phường B' Lao",
    "districtId": 70303,
    "districtName": "Thành phố Bảo Lộc",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70305010",
    "wardName": "Xã Lạc Dương",
    "districtId": 70305,
    "districtName": "Huyện Lạc Dương",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70307011",
    "wardName": "Xã Đơn Dương",
    "districtId": 70307,
    "districtName": "Huyện Đơn Dương",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70307012",
    "wardName": "Xã Ka Đô",
    "districtId": 70307,
    "districtName": "Huyện Đơn Dương",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70307013",
    "wardName": "Xã Quảng Lập",
    "districtId": 70307,
    "districtName": "Huyện Đơn Dương",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70307014",
    "wardName": "Xã D'Ran",
    "districtId": 70307,
    "districtName": "Huyện Đơn Dương",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70309015",
    "wardName": "Xã Hiệp Thạnh",
    "districtId": 70309,
    "districtName": "Huyện Đức Trọng",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70309016",
    "wardName": "Xã Đức Trọng",
    "districtId": 70309,
    "districtName": "Huyện Đức Trọng",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70309017",
    "wardName": "Xã Tân Hội",
    "districtId": 70309,
    "districtName": "Huyện Đức Trọng",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70309018",
    "wardName": "Xã Tà Hine",
    "districtId": 70309,
    "districtName": "Huyện Đức Trọng",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70309019",
    "wardName": "Xã Tà Năng",
    "districtId": 70309,
    "districtName": "Huyện Đức Trọng",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70311020",
    "wardName": "Xã Đinh Văn - Lâm Hà",
    "districtId": 70311,
    "districtName": "Huyện Lâm Hà",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70311021",
    "wardName": "Xã Phú Sơn - Lâm Hà",
    "districtId": 70311,
    "districtName": "Huyện Lâm Hà",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70311022",
    "wardName": "Xã Nam Hà - Lâm Hà",
    "districtId": 70311,
    "districtName": "Huyện Lâm Hà",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70311023",
    "wardName": "Xã Nam Ban - Lâm Hà",
    "districtId": 70311,
    "districtName": "Huyện Lâm Hà",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70311024",
    "wardName": "Xã Tân Hà - Lâm Hà",
    "districtId": 70311,
    "districtName": "Huyện Lâm Hà",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70311025",
    "wardName": "Xã Phúc Thọ - Lâm Hà",
    "districtId": 70311,
    "districtName": "Huyện Lâm Hà",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70323026",
    "wardName": "Xã Đam Rông 1",
    "districtId": 70323,
    "districtName": "Huyện Đam Rông",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70323027",
    "wardName": "Xã Đam Rông 2",
    "districtId": 70323,
    "districtName": "Huyện Đam Rông",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70323028",
    "wardName": "Xã Đam Rông 3",
    "districtId": 70323,
    "districtName": "Huyện Đam Rông",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70323029",
    "wardName": "Xã Đam Rông 4",
    "districtId": 70323,
    "districtName": "Huyện Đam Rông",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70315030",
    "wardName": "Xã Di Linh",
    "districtId": 70315,
    "districtName": "Huyện Di Linh",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70315031",
    "wardName": "Xã Hoà Ninh",
    "districtId": 70315,
    "districtName": "Huyện Di Linh",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70315032",
    "wardName": "Xã Hoà Bắc",
    "districtId": 70315,
    "districtName": "Huyện Di Linh",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70315033",
    "wardName": "Xã Đinh Trang Thượng",
    "districtId": 70315,
    "districtName": "Huyện Di Linh",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70315034",
    "wardName": "Xã Bảo Thuận",
    "districtId": 70315,
    "districtName": "Huyện Di Linh",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70315035",
    "wardName": "Xã Sơn Điền",
    "districtId": 70315,
    "districtName": "Huyện Di Linh",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70315036",
    "wardName": "Xã Gia Hiệp",
    "districtId": 70315,
    "districtName": "Huyện Di Linh",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70313037",
    "wardName": "Xã Bảo Lâm 1",
    "districtId": 70313,
    "districtName": "Huyện Bảo Lâm",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70313038",
    "wardName": "Xã Bảo Lâm 2",
    "districtId": 70313,
    "districtName": "Huyện Bảo Lâm",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70313039",
    "wardName": "Xã Bảo Lâm 3",
    "districtId": 70313,
    "districtName": "Huyện Bảo Lâm",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70313040",
    "wardName": "Xã Bảo Lâm 4",
    "districtId": 70313,
    "districtName": "Huyện Bảo Lâm",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70313041",
    "wardName": "Xã Bảo Lâm 5",
    "districtId": 70313,
    "districtName": "Huyện Bảo Lâm",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70317042",
    "wardName": "Xã Đạ Huoai",
    "districtId": 70317,
    "districtName": "Huyện Đạ Huoai",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70317043",
    "wardName": "Xã Đạ Huoai 2",
    "districtId": 70317,
    "districtName": "Huyện Đạ Huoai",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70317044",
    "wardName": "Xã Đạ Huoai 3",
    "districtId": 70317,
    "districtName": "Huyện Đạ Huoai",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70317045",
    "wardName": "Xã Đạ Tẻh",
    "districtId": 70317,
    "districtName": "Huyện Đạ Huoai",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70317046",
    "wardName": "Xã Đạ Tẻh 2",
    "districtId": 70317,
    "districtName": "Huyện Đạ Huoai",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70317047",
    "wardName": "Xã Đạ Tẻh 3",
    "districtId": 70317,
    "districtName": "Huyện Đạ Huoai",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70317048",
    "wardName": "Xã Cát Tiên",
    "districtId": 70317,
    "districtName": "Huyện Đạ Huoai",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70317049",
    "wardName": "Xã Cát Tiên 2",
    "districtId": 70317,
    "districtName": "Huyện Đạ Huoai",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70317050",
    "wardName": "Xã Cát Tiên 3",
    "districtId": 70317,
    "districtName": "Huyện Đạ Huoai",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71501051",
    "wardName": "Phường Hàm Thắng",
    "districtId": 71501,
    "districtName": "Thành phố Phan Thiết",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71501052",
    "wardName": "Phường Bình Thuận",
    "districtId": 71501,
    "districtName": "Thành phố Phan Thiết",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71501053",
    "wardName": "Phường Mũi Né",
    "districtId": 71501,
    "districtName": "Thành phố Phan Thiết",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71501054",
    "wardName": "Phường Phú Thuỷ",
    "districtId": 71501,
    "districtName": "Thành phố Phan Thiết",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71501055",
    "wardName": "Phường Phan Thiết",
    "districtId": 71501,
    "districtName": "Thành phố Phan Thiết",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71501056",
    "wardName": "Phường Tiến Thành",
    "districtId": 71501,
    "districtName": "Thành phố Phan Thiết",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71513057",
    "wardName": "Phường La Gi",
    "districtId": 71513,
    "districtName": "Thị xã La Gi",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71513058",
    "wardName": "Phường Phước Hội",
    "districtId": 71513,
    "districtName": "Thị xã La Gi",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71501059",
    "wardName": "Xã Tuyên Quang",
    "districtId": 71501,
    "districtName": "Thành phố Phan Thiết",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71513060",
    "wardName": "Xã Tân Hải",
    "districtId": 71513,
    "districtName": "Thị xã La Gi",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71503061",
    "wardName": "Xã Vĩnh Hảo",
    "districtId": 71503,
    "districtName": "Huyện Tuy Phong",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71503062",
    "wardName": "Xã Liên Hương",
    "districtId": 71503,
    "districtName": "Huyện Tuy Phong",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71503063",
    "wardName": "Xã Tuy Phong",
    "districtId": 71503,
    "districtName": "Huyện Tuy Phong",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71503064",
    "wardName": "Xã Phan Rí Cửa",
    "districtId": 71503,
    "districtName": "Huyện Tuy Phong",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71505065",
    "wardName": "Xã Bắc Bình",
    "districtId": 71505,
    "districtName": "Huyện Bắc Bình",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71505066",
    "wardName": "Xã Hồng Thái",
    "districtId": 71505,
    "districtName": "Huyện Bắc Bình",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71505067",
    "wardName": "Xã Hải Ninh",
    "districtId": 71505,
    "districtName": "Huyện Bắc Bình",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71505068",
    "wardName": "Xã Phan Sơn",
    "districtId": 71505,
    "districtName": "Huyện Bắc Bình",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71505069",
    "wardName": "Xã Sông Lũy",
    "districtId": 71505,
    "districtName": "Huyện Bắc Bình",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71505070",
    "wardName": "Xã Lương Sơn",
    "districtId": 71505,
    "districtName": "Huyện Bắc Bình",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71505071",
    "wardName": "Xã Hoà Thắng",
    "districtId": 71505,
    "districtName": "Huyện Bắc Bình",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71507072",
    "wardName": "Xã Đông Giang",
    "districtId": 71507,
    "districtName": "Huyện Hàm Thuận Bắc",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71507073",
    "wardName": "Xã La Dạ",
    "districtId": 71507,
    "districtName": "Huyện Hàm Thuận Bắc",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71507074",
    "wardName": "Xã Hàm Thuận Bắc",
    "districtId": 71507,
    "districtName": "Huyện Hàm Thuận Bắc",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71507075",
    "wardName": "Xã Hàm Thuận",
    "districtId": 71507,
    "districtName": "Huyện Hàm Thuận Bắc",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71507076",
    "wardName": "Xã Hồng Sơn",
    "districtId": 71507,
    "districtName": "Huyện Hàm Thuận Bắc",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71507077",
    "wardName": "Xã Hàm Liêm",
    "districtId": 71507,
    "districtName": "Huyện Hàm Thuận Bắc",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71509078",
    "wardName": "Xã Hàm Thạnh",
    "districtId": 71509,
    "districtName": "Huyện Hàm Thuận Nam",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71509079",
    "wardName": "Xã Hàm Kiệm",
    "districtId": 71509,
    "districtName": "Huyện Hàm Thuận Nam",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71509080",
    "wardName": "Xã Tân Thành",
    "districtId": 71509,
    "districtName": "Huyện Hàm Thuận Nam",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71509081",
    "wardName": "Xã Hàm Thuận Nam",
    "districtId": 71509,
    "districtName": "Huyện Hàm Thuận Nam",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71509082",
    "wardName": "Xã Tân Lập",
    "districtId": 71509,
    "districtName": "Huyện Hàm Thuận Nam",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71514083",
    "wardName": "Xã Tân Minh",
    "districtId": 71514,
    "districtName": "Huyện Hàm Tân",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71514084",
    "wardName": "Xã Hàm Tân",
    "districtId": 71514,
    "districtName": "Huyện Hàm Tân",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71514085",
    "wardName": "Xã Sơn Mỹ",
    "districtId": 71514,
    "districtName": "Huyện Hàm Tân",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71511086",
    "wardName": "Xã Bắc Ruộng",
    "districtId": 71511,
    "districtName": "Huyện Tánh Linh",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71511087",
    "wardName": "Xã Nghị Đức",
    "districtId": 71511,
    "districtName": "Huyện Tánh Linh",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71511088",
    "wardName": "Xã Đồng Kho",
    "districtId": 71511,
    "districtName": "Huyện Tánh Linh",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71511089",
    "wardName": "Xã Tánh Linh",
    "districtId": 71511,
    "districtName": "Huyện Tánh Linh",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71511090",
    "wardName": "Xã Suối Kiết",
    "districtId": 71511,
    "districtName": "Huyện Tánh Linh",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71515091",
    "wardName": "Xã Nam Thành",
    "districtId": 71515,
    "districtName": "Huyện Đức Linh",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71515092",
    "wardName": "Xã Đức Linh",
    "districtId": 71515,
    "districtName": "Huyện Đức Linh",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71515093",
    "wardName": "Xã Hoài Đức",
    "districtId": 71515,
    "districtName": "Huyện Đức Linh",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71515094",
    "wardName": "Xã Trà Tân",
    "districtId": 71515,
    "districtName": "Huyện Đức Linh",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "71517095",
    "wardName": "Đặc khu Phú Quý",
    "districtId": 71517,
    "districtName": "Huyện Phú Quý",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60613096",
    "wardName": "Phường Bắc Gia Nghĩa",
    "districtId": 60613,
    "districtName": "Thành phố Gia Nghĩa",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60613097",
    "wardName": "Phường Nam Gia Nghĩa",
    "districtId": 60613,
    "districtName": "Thành phố Gia Nghĩa",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60613098",
    "wardName": "Phường Đông Gia Nghĩa",
    "districtId": 60613,
    "districtName": "Thành phố Gia Nghĩa",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60603099",
    "wardName": "Xã Đắk Wil",
    "districtId": 60603,
    "districtName": "Huyện Cư Jút",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60603100",
    "wardName": "Xã Nam Dong",
    "districtId": 60603,
    "districtName": "Huyện Cư Jút",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60603101",
    "wardName": "Xã Cư Jút",
    "districtId": 60603,
    "districtName": "Huyện Cư Jút",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60607102",
    "wardName": "Xã Thuận An",
    "districtId": 60607,
    "districtName": "Huyện Đắk Mil",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60607103",
    "wardName": "Xã Đức Lập",
    "districtId": 60607,
    "districtName": "Huyện Đắk Mil",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60607104",
    "wardName": "Xã Đắk Mil",
    "districtId": 60607,
    "districtName": "Huyện Đắk Mil",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60607105",
    "wardName": "Xã Đắk Sắk",
    "districtId": 60607,
    "districtName": "Huyện Đắk Mil",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60605106",
    "wardName": "Xã Nam Đà",
    "districtId": 60605,
    "districtName": "Huyện Krông Nô",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60605107",
    "wardName": "Xã Krông Nô",
    "districtId": 60605,
    "districtName": "Huyện Krông Nô",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60605108",
    "wardName": "Xã Nâm Nung",
    "districtId": 60605,
    "districtName": "Huyện Krông Nô",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60605109",
    "wardName": "Xã Quảng Phú",
    "districtId": 60605,
    "districtName": "Huyện Krông Nô",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60609110",
    "wardName": "Xã Đắk song",
    "districtId": 60609,
    "districtName": "Huyện Đắk Song",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60609111",
    "wardName": "Xã Đức An",
    "districtId": 60609,
    "districtName": "Huyện Đắk Song",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60609112",
    "wardName": "Xã Thuận Hạnh",
    "districtId": 60609,
    "districtName": "Huyện Đắk Song",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60609113",
    "wardName": "Xã Trường Xuân",
    "districtId": 60609,
    "districtName": "Huyện Đắk Song",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60615114",
    "wardName": "Xã Tà Đùng",
    "districtId": 60615,
    "districtName": "Huyện Đắk Glong",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60615115",
    "wardName": "Xã Quảng Khê",
    "districtId": 60615,
    "districtName": "Huyện Đắk Glong",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60617116",
    "wardName": "Xã Quảng Tân",
    "districtId": 60617,
    "districtName": "Huyện Tuy Đức",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60617117",
    "wardName": "Xã Tuy Đức",
    "districtId": 60617,
    "districtName": "Huyện Tuy Đức",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60611118",
    "wardName": "Xã Kiến Đức",
    "districtId": 60611,
    "districtName": "Huyện Đắk R'Lấp",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60611119",
    "wardName": "Xã Nhân Cơ",
    "districtId": 60611,
    "districtName": "Huyện Đắk R'Lấp",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60611120",
    "wardName": "Xã Quảng Tín",
    "districtId": 60611,
    "districtName": "Huyện Đắk R'Lấp",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "70309121",
    "wardName": "Xã Ninh Gia",
    "districtId": 70309,
    "districtName": "Huyện Đức Trọng",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60615122",
    "wardName": "Xã Quảng Hoà",
    "districtId": 60615,
    "districtName": "Huyện Đắk Glong",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60615123",
    "wardName": "Xã Quảng Sơn",
    "districtId": 60615,
    "districtName": "Huyện Đắk Glong",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "60617124",
    "wardName": "Xã Quảng Trực",
    "districtId": 60617,
    "districtName": "Huyện Tuy Đức",
    "provinceId": 26,
    "provinceName": "Tỉnh Lâm Đồng"
  },
  {
    "wardId": "80103001",
    "wardName": "Xã Hưng Điền",
    "districtId": 80103,
    "districtName": "Huyện Tân Hưng",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80103002",
    "wardName": "Xã Vĩnh Thạnh",
    "districtId": 80103,
    "districtName": "Huyện Tân Hưng",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80103003",
    "wardName": "Xã Tân Hưng",
    "districtId": 80103,
    "districtName": "Huyện Tân Hưng",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80103004",
    "wardName": "Xã Vĩnh Châu",
    "districtId": 80103,
    "districtName": "Huyện Tân Hưng",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80105005",
    "wardName": "Xã Tuyên Bình",
    "districtId": 80105,
    "districtName": "Huyện Vĩnh Hưng",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80105006",
    "wardName": "Xã Vĩnh Hưng",
    "districtId": 80105,
    "districtName": "Huyện Vĩnh Hưng",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80105007",
    "wardName": "Xã Khánh Hưng",
    "districtId": 80105,
    "districtName": "Huyện Vĩnh Hưng",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80129008",
    "wardName": "Xã Tuyên Thạnh",
    "districtId": 80129,
    "districtName": "Thị xã Kiến Tường",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80129009",
    "wardName": "Xã Bình Hiệp",
    "districtId": 80129,
    "districtName": "Thị xã Kiến Tường",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80129010",
    "wardName": "Phường Kiến Tường",
    "districtId": 80129,
    "districtName": "Thị xã Kiến Tường",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80107011",
    "wardName": "Xã Bình Hoà",
    "districtId": 80107,
    "districtName": "Huyện Mộc Hoá",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80107012",
    "wardName": "Xã Mộc Hoá",
    "districtId": 80107,
    "districtName": "Huyện Mộc Hoá",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80109013",
    "wardName": "Xã Hậu Thạnh",
    "districtId": 80109,
    "districtName": "Huyện Tân Thạnh",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80109014",
    "wardName": "Xã Nhơn Hoà Lập",
    "districtId": 80109,
    "districtName": "Huyện Tân Thạnh",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80109015",
    "wardName": "Xã Nhơn Ninh",
    "districtId": 80109,
    "districtName": "Huyện Tân Thạnh",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80109016",
    "wardName": "Xã Tân Thạnh",
    "districtId": 80109,
    "districtName": "Huyện Tân Thạnh",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80111017",
    "wardName": "Xã Bình Thành",
    "districtId": 80111,
    "districtName": "Huyện Thạnh Hoá",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80111018",
    "wardName": "Xã Thạnh Phước",
    "districtId": 80111,
    "districtName": "Huyện Thạnh Hoá",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80111019",
    "wardName": "Xã Thạnh Hóa",
    "districtId": 80111,
    "districtName": "Huyện Thạnh Hoá",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80111020",
    "wardName": "Xã Tân Tây",
    "districtId": 80111,
    "districtName": "Huyện Thạnh Hoá",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80119021",
    "wardName": "Xã Thủ Thừa",
    "districtId": 80119,
    "districtName": "Huyện Thủ Thừa",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80119022",
    "wardName": "Xã Mỹ An",
    "districtId": 80119,
    "districtName": "Huyện Thủ Thừa",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80119023",
    "wardName": "Xã Mỹ Thạnh",
    "districtId": 80119,
    "districtName": "Huyện Thủ Thừa",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80119024",
    "wardName": "Xã Tân Long",
    "districtId": 80119,
    "districtName": "Huyện Thủ Thừa",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80113025",
    "wardName": "Xã Mỹ Quý",
    "districtId": 80113,
    "districtName": "Huyện Đức Huệ",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80113026",
    "wardName": "Xã Đông Thành",
    "districtId": 80113,
    "districtName": "Huyện Đức Huệ",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80113027",
    "wardName": "Xã Đức Huệ",
    "districtId": 80113,
    "districtName": "Huyện Đức Huệ",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80115028",
    "wardName": "Xã An Ninh",
    "districtId": 80115,
    "districtName": "Huyện Đức Hoà",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80115029",
    "wardName": "Xã Hiệp Hoà",
    "districtId": 80115,
    "districtName": "Huyện Đức Hoà",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80115030",
    "wardName": "Xã Hậu Nghĩa",
    "districtId": 80115,
    "districtName": "Huyện Đức Hoà",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80115031",
    "wardName": "Xã Hoà Khánh",
    "districtId": 80115,
    "districtName": "Huyện Đức Hoà",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80115032",
    "wardName": "Xã Đức Lập",
    "districtId": 80115,
    "districtName": "Huyện Đức Hoà",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80115033",
    "wardName": "Xã Mỹ Hạnh",
    "districtId": 80115,
    "districtName": "Huyện Đức Hoà",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80115034",
    "wardName": "Xã Đức Hoà",
    "districtId": 80115,
    "districtName": "Huyện Đức Hoà",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80117035",
    "wardName": "Xã Thạnh Lợi",
    "districtId": 80117,
    "districtName": "Huyện Bến Lức",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80117036",
    "wardName": "Xã Bình Đức",
    "districtId": 80117,
    "districtName": "Huyện Bến Lức",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80117037",
    "wardName": "Xã Lương Hoà",
    "districtId": 80117,
    "districtName": "Huyện Bến Lức",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80117038",
    "wardName": "Xã Bến Lức",
    "districtId": 80117,
    "districtName": "Huyện Bến Lức",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80117039",
    "wardName": "Xã Mỹ Yên",
    "districtId": 80117,
    "districtName": "Huyện Bến Lức",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80125040",
    "wardName": "Xã Long Cang",
    "districtId": 80125,
    "districtName": "Huyện Cần Đước",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80125041",
    "wardName": "Xã Rạch Kiến",
    "districtId": 80125,
    "districtName": "Huyện Cần Đước",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80125042",
    "wardName": "Xã Mỹ Lệ",
    "districtId": 80125,
    "districtName": "Huyện Cần Đước",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80125043",
    "wardName": "Xã Tân Lân",
    "districtId": 80125,
    "districtName": "Huyện Cần Đước",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80125044",
    "wardName": "Xã Cần Đước",
    "districtId": 80125,
    "districtName": "Huyện Cần Đước",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80125045",
    "wardName": "Xã Long Hựu",
    "districtId": 80125,
    "districtName": "Huyện Cần Đước",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80127046",
    "wardName": "Xã Phước Lý",
    "districtId": 80127,
    "districtName": "Huyện Cần Giuộc",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80127047",
    "wardName": "Xã Mỹ Lộc",
    "districtId": 80127,
    "districtName": "Huyện Cần Giuộc",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80127048",
    "wardName": "Xã Cần Giuộc",
    "districtId": 80127,
    "districtName": "Huyện Cần Giuộc",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80127049",
    "wardName": "Xã Phước Vĩnh Tây",
    "districtId": 80127,
    "districtName": "Huyện Cần Giuộc",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80127050",
    "wardName": "Xã Tân Tập",
    "districtId": 80127,
    "districtName": "Huyện Cần Giuộc",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80123051",
    "wardName": "Xã Vàm Cỏ",
    "districtId": 80123,
    "districtName": "Huyện Tân Trụ",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80123052",
    "wardName": "Xã Tân Trụ",
    "districtId": 80123,
    "districtName": "Huyện Tân Trụ",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80123053",
    "wardName": "Xã Nhựt Tảo",
    "districtId": 80123,
    "districtName": "Huyện Tân Trụ",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80121054",
    "wardName": "Xã Thuận Mỹ",
    "districtId": 80121,
    "districtName": "Huyện Châu Thành",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80121055",
    "wardName": "Xã An Lục Long",
    "districtId": 80121,
    "districtName": "Huyện Châu Thành",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80121056",
    "wardName": "Xã Tầm Vu",
    "districtId": 80121,
    "districtName": "Huyện Châu Thành",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80121057",
    "wardName": "Xã Vĩnh Công",
    "districtId": 80121,
    "districtName": "Huyện Châu Thành",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80101058",
    "wardName": "Phường Long An",
    "districtId": 80101,
    "districtName": "Thành phố Tân An",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80101059",
    "wardName": "Phường Tân An",
    "districtId": 80101,
    "districtName": "Thành phố Tân An",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "80101060",
    "wardName": "Phường Khánh Hậu",
    "districtId": 80101,
    "districtName": "Thành phố Tân An",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70901061",
    "wardName": "Phường Tân Ninh",
    "districtId": 70901,
    "districtName": "Thành phố Tây Ninh",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70901062",
    "wardName": "Phường Bình Minh",
    "districtId": 70901,
    "districtName": "Thành phố Tây Ninh",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70907063",
    "wardName": "Phường Ninh Thạnh",
    "districtId": 70907,
    "districtName": "Huyện Dương Minh Châu",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70911064",
    "wardName": "Phường Long Hoa",
    "districtId": 70911,
    "districtName": "Thị xã Hoà Thành",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70911065",
    "wardName": "Phường Hoà Thành",
    "districtId": 70911,
    "districtName": "Thị xã Hoà Thành",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70911066",
    "wardName": "Phường Thanh Điền",
    "districtId": 70911,
    "districtName": "Thị xã Hoà Thành",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70917067",
    "wardName": "Phường Trảng Bàng",
    "districtId": 70917,
    "districtName": "Thị xã Trảng Bàng",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70917068",
    "wardName": "Phường An Tịnh",
    "districtId": 70917,
    "districtName": "Thị xã Trảng Bàng",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70915069",
    "wardName": "Phường Gò Dầu",
    "districtId": 70915,
    "districtName": "Huyện Gò Dầu",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70915070",
    "wardName": "Phường Gia Lộc",
    "districtId": 70915,
    "districtName": "Huyện Gò Dầu",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70917071",
    "wardName": "Xã Hưng Thuận",
    "districtId": 70917,
    "districtName": "Thị xã Trảng Bàng",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70917072",
    "wardName": "Xã Phước Chỉ",
    "districtId": 70917,
    "districtName": "Thị xã Trảng Bàng",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70915073",
    "wardName": "Xã Thạnh Đức",
    "districtId": 70915,
    "districtName": "Huyện Gò Dầu",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70915074",
    "wardName": "Xã Phước Thạnh",
    "districtId": 70915,
    "districtName": "Huyện Gò Dầu",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70915075",
    "wardName": "Xã Truông Mít",
    "districtId": 70915,
    "districtName": "Huyện Gò Dầu",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70907076",
    "wardName": "Xã Lộc Ninh",
    "districtId": 70907,
    "districtName": "Huyện Dương Minh Châu",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70907077",
    "wardName": "Xã Cầu Khởi",
    "districtId": 70907,
    "districtName": "Huyện Dương Minh Châu",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70907078",
    "wardName": "Xã Dương Minh Châu",
    "districtId": 70907,
    "districtName": "Huyện Dương Minh Châu",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70905079",
    "wardName": "Xã Tân Đông",
    "districtId": 70905,
    "districtName": "Huyện Tân Châu",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70905080",
    "wardName": "Xã Tân Châu",
    "districtId": 70905,
    "districtName": "Huyện Tân Châu",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70905081",
    "wardName": "Xã Tân Phú",
    "districtId": 70905,
    "districtName": "Huyện Tân Châu",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70905082",
    "wardName": "Xã Tân Hội",
    "districtId": 70905,
    "districtName": "Huyện Tân Châu",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70905083",
    "wardName": "Xã Tân Thành",
    "districtId": 70905,
    "districtName": "Huyện Tân Châu",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70905084",
    "wardName": "Xã Tân Hoà",
    "districtId": 70905,
    "districtName": "Huyện Tân Châu",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70903085",
    "wardName": "Xã Tân Lập",
    "districtId": 70903,
    "districtName": "Huyện Tân Biên",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70903086",
    "wardName": "Xã Tân Biên",
    "districtId": 70903,
    "districtName": "Huyện Tân Biên",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70903087",
    "wardName": "Xã Thạnh Bình",
    "districtId": 70903,
    "districtName": "Huyện Tân Biên",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70903088",
    "wardName": "Xã Trà Vong",
    "districtId": 70903,
    "districtName": "Huyện Tân Biên",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70909089",
    "wardName": "Xã Phước Vinh",
    "districtId": 70909,
    "districtName": "Huyện Châu Thành",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70909090",
    "wardName": "Xã Hoà Hội",
    "districtId": 70909,
    "districtName": "Huyện Châu Thành",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70909091",
    "wardName": "Xã Ninh Điền",
    "districtId": 70909,
    "districtName": "Huyện Châu Thành",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70909092",
    "wardName": "Xã Châu Thành",
    "districtId": 70909,
    "districtName": "Huyện Châu Thành",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70909093",
    "wardName": "Xã Hảo Đước",
    "districtId": 70909,
    "districtName": "Huyện Châu Thành",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70913094",
    "wardName": "Xã Long Chữ",
    "districtId": 70913,
    "districtName": "Huyện Bến Cầu",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70913095",
    "wardName": "Xã Long Thuận",
    "districtId": 70913,
    "districtName": "Huyện Bến Cầu",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "70913096",
    "wardName": "Xã Bến Cầu",
    "districtId": 70913,
    "districtName": "Huyện Bến Cầu",
    "provinceId": 27,
    "provinceName": "Tỉnh Tây Ninh"
  },
  {
    "wardId": "71301001",
    "wardName": "Phường Biên Hoà",
    "districtId": 71301,
    "districtName": "Thành phố Biên Hoà",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71301002",
    "wardName": "Phường Trấn Biên",
    "districtId": 71301,
    "districtName": "Thành phố Biên Hoà",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71301003",
    "wardName": "Phường Tam Hiệp",
    "districtId": 71301,
    "districtName": "Thành phố Biên Hoà",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71301004",
    "wardName": "Phường Long Bình",
    "districtId": 71301,
    "districtName": "Thành phố Biên Hoà",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71301005",
    "wardName": "Phường Trảng Dài",
    "districtId": 71301,
    "districtName": "Thành phố Biên Hoà",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71301006",
    "wardName": "Phường Hố Nai",
    "districtId": 71301,
    "districtName": "Thành phố Biên Hoà",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71301007",
    "wardName": "Phường Long Hưng",
    "districtId": 71301,
    "districtName": "Thành phố Biên Hoà",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71317008",
    "wardName": "Xã Đại Phước",
    "districtId": 71317,
    "districtName": "Huyện Nhơn Trạch",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71317009",
    "wardName": "Xã Nhơn Trạch",
    "districtId": 71317,
    "districtName": "Huyện Nhơn Trạch",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71317010",
    "wardName": "Xã Phước An",
    "districtId": 71317,
    "districtName": "Huyện Nhơn Trạch",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71315011",
    "wardName": "Xã Phước Thái",
    "districtId": 71315,
    "districtName": "Huyện Long Thành",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71315012",
    "wardName": "Xã Long Phước",
    "districtId": 71315,
    "districtName": "Huyện Long Thành",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71315013",
    "wardName": "Xã Bình An",
    "districtId": 71315,
    "districtName": "Huyện Long Thành",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71315014",
    "wardName": "Xã Long Thành",
    "districtId": 71315,
    "districtName": "Huyện Long Thành",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71315015",
    "wardName": "Xã An Phước",
    "districtId": 71315,
    "districtName": "Huyện Long Thành",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71308016",
    "wardName": "Xã An Viễn",
    "districtId": 71308,
    "districtName": "Huyện Trảng Bom",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71308017",
    "wardName": "Xã Bình Minh",
    "districtId": 71308,
    "districtName": "Huyện Trảng Bom",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71308018",
    "wardName": "Xã Trảng Bom",
    "districtId": 71308,
    "districtName": "Huyện Trảng Bom",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71308019",
    "wardName": "Xã Bàu Hàm",
    "districtId": 71308,
    "districtName": "Huyện Trảng Bom",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71308020",
    "wardName": "Xã Hưng Thịnh",
    "districtId": 71308,
    "districtName": "Huyện Trảng Bom",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71309021",
    "wardName": "Xã Dầu Giây",
    "districtId": 71309,
    "districtName": "Huyện Thống Nhất",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71309022",
    "wardName": "Xã Gia Kiệm",
    "districtId": 71309,
    "districtName": "Huyện Thống Nhất",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71305023",
    "wardName": "Xã Thống Nhất",
    "districtId": 71305,
    "districtName": "Huyện Định Quán",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71302024",
    "wardName": "Phường Bình Lộc",
    "districtId": 71302,
    "districtName": "Thành phố Long khánh",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71302025",
    "wardName": "Phường Bảo Vinh",
    "districtId": 71302,
    "districtName": "Thành phố Long khánh",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71302026",
    "wardName": "Phường Xuân Lập",
    "districtId": 71302,
    "districtName": "Thành phố Long khánh",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71302027",
    "wardName": "Phường Long Khánh",
    "districtId": 71302,
    "districtName": "Thành phố Long khánh",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71302028",
    "wardName": "Phường Hàng Gòn",
    "districtId": 71302,
    "districtName": "Thành phố Long khánh",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71311029",
    "wardName": "Xã Xuân Quế",
    "districtId": 71311,
    "districtName": "Huyện Cẩm Mỹ",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71311030",
    "wardName": "Xã Xuân Đường",
    "districtId": 71311,
    "districtName": "Huyện Cẩm Mỹ",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71311031",
    "wardName": "Xã Cẩm Mỹ",
    "districtId": 71311,
    "districtName": "Huyện Cẩm Mỹ",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71311032",
    "wardName": "Xã Sông Ray",
    "districtId": 71311,
    "districtName": "Huyện Cẩm Mỹ",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71311033",
    "wardName": "Xã Xuân Đông",
    "districtId": 71311,
    "districtName": "Huyện Cẩm Mỹ",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71313034",
    "wardName": "Xã Xuân Định",
    "districtId": 71313,
    "districtName": "Huyện Xuân Lộc",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71313035",
    "wardName": "Xã Xuân Phú",
    "districtId": 71313,
    "districtName": "Huyện Xuân Lộc",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71313036",
    "wardName": "Xã Xuân Lộc",
    "districtId": 71313,
    "districtName": "Huyện Xuân Lộc",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71313037",
    "wardName": "Xã Xuân Hoà",
    "districtId": 71313,
    "districtName": "Huyện Xuân Lộc",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71313038",
    "wardName": "Xã Xuân Thành",
    "districtId": 71313,
    "districtName": "Huyện Xuân Lộc",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71313039",
    "wardName": "Xã Xuân Bắc",
    "districtId": 71313,
    "districtName": "Huyện Xuân Lộc",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71305040",
    "wardName": "Xã La Ngà",
    "districtId": 71305,
    "districtName": "Huyện Định Quán",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71305041",
    "wardName": "Xã Định Quán",
    "districtId": 71305,
    "districtName": "Huyện Định Quán",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71305042",
    "wardName": "Xã Phú Vinh",
    "districtId": 71305,
    "districtName": "Huyện Định Quán",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71305043",
    "wardName": "Xã Phú Hoà",
    "districtId": 71305,
    "districtName": "Huyện Định Quán",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71303044",
    "wardName": "Xã Tà Lài",
    "districtId": 71303,
    "districtName": "Huyện Tân Phú",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71303045",
    "wardName": "Xã Nam Cát Tiên",
    "districtId": 71303,
    "districtName": "Huyện Tân Phú",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71303046",
    "wardName": "Xã Tân Phú",
    "districtId": 71303,
    "districtName": "Huyện Tân Phú",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71303047",
    "wardName": "Xã Phú Lâm",
    "districtId": 71303,
    "districtName": "Huyện Tân Phú",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71307048",
    "wardName": "Xã Trị An",
    "districtId": 71307,
    "districtName": "Huyện Vĩnh Cửu",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71307049",
    "wardName": "Xã Tân An",
    "districtId": 71307,
    "districtName": "Huyện Vĩnh Cửu",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71307050",
    "wardName": "Phường Tân Triều",
    "districtId": 71307,
    "districtName": "Huyện Vĩnh Cửu",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70710051",
    "wardName": "Phường Minh Hưng",
    "districtId": 70710,
    "districtName": "Huyện Chơn Thành",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70710052",
    "wardName": "Phường Chơn Thành",
    "districtId": 70710,
    "districtName": "Huyện Chơn Thành",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70710053",
    "wardName": "Xã Nha Bích",
    "districtId": 70710,
    "districtName": "Huyện Chơn Thành",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70713054",
    "wardName": "Xã Tân Quan",
    "districtId": 70713,
    "districtName": "Huyện Hớn Quản",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70713055",
    "wardName": "Xã Tân Hưng",
    "districtId": 70713,
    "districtName": "Huyện Hớn Quản",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70713056",
    "wardName": "Xã Tân Khai",
    "districtId": 70713,
    "districtName": "Huyện Hớn Quản",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70713057",
    "wardName": "Xã Minh Đức",
    "districtId": 70713,
    "districtName": "Huyện Hớn Quản",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70709058",
    "wardName": "Phường Bình Long",
    "districtId": 70709,
    "districtName": "Thị xã Bình Long",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70709059",
    "wardName": "Phường An Lộc",
    "districtId": 70709,
    "districtName": "Thị xã Bình Long",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70705060",
    "wardName": "Xã Lộc Thành",
    "districtId": 70705,
    "districtName": "Huyện Lộc Ninh",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70705061",
    "wardName": "Xã Lộc Ninh",
    "districtId": 70705,
    "districtName": "Huyện Lộc Ninh",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70705062",
    "wardName": "Xã Lộc Hưng",
    "districtId": 70705,
    "districtName": "Huyện Lộc Ninh",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70705063",
    "wardName": "Xã Lộc Tấn",
    "districtId": 70705,
    "districtName": "Huyện Lộc Ninh",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70705064",
    "wardName": "Xã Lộc Thạnh",
    "districtId": 70705,
    "districtName": "Huyện Lộc Ninh",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70705065",
    "wardName": "Xã Lộc Quang",
    "districtId": 70705,
    "districtName": "Huyện Lộc Ninh",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70706066",
    "wardName": "Xã Tân Tiến",
    "districtId": 70706,
    "districtName": "Huyện Bù Đốp",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70706067",
    "wardName": "Xã Thiện Hưng",
    "districtId": 70706,
    "districtName": "Huyện Bù Đốp",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70706068",
    "wardName": "Xã Hưng Phước",
    "districtId": 70706,
    "districtName": "Huyện Bù Đốp",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70715069",
    "wardName": "Xã Phú Nghĩa",
    "districtId": 70715,
    "districtName": "Huyện Bù Gia Mập",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70715070",
    "wardName": "Xã Đa Kia",
    "districtId": 70715,
    "districtName": "Huyện Bù Gia Mập",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70703071",
    "wardName": "Phường Phước Bình",
    "districtId": 70703,
    "districtName": "Thị xã Phước Long",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70703072",
    "wardName": "Phường Phước Long",
    "districtId": 70703,
    "districtName": "Thị xã Phước Long",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70716073",
    "wardName": "Xã Bình Tân",
    "districtId": 70716,
    "districtName": "Huyện Phú Riềng",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70716074",
    "wardName": "Xã Long Hà",
    "districtId": 70716,
    "districtName": "Huyện Phú Riềng",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70716075",
    "wardName": "Xã Phú Riềng",
    "districtId": 70716,
    "districtName": "Huyện Phú Riềng",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70716076",
    "wardName": "Xã Phú Trung",
    "districtId": 70716,
    "districtName": "Huyện Phú Riềng",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70711077",
    "wardName": "Phường Đồng Xoài",
    "districtId": 70711,
    "districtName": "Thành phố Đồng Xoài",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70711078",
    "wardName": "Phường Bình Phước",
    "districtId": 70711,
    "districtName": "Thành phố Đồng Xoài",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70701079",
    "wardName": "Xã Thuận Lợi",
    "districtId": 70701,
    "districtName": "Huyện Đồng Phú",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70701080",
    "wardName": "Xã Đồng Tâm",
    "districtId": 70701,
    "districtName": "Huyện Đồng Phú",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70701081",
    "wardName": "Xã Tân Lợi",
    "districtId": 70701,
    "districtName": "Huyện Đồng Phú",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70701082",
    "wardName": "Xã Đồng Phú",
    "districtId": 70701,
    "districtName": "Huyện Đồng Phú",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70707083",
    "wardName": "Xã Phước Sơn",
    "districtId": 70707,
    "districtName": "Huyện Bù Đăng",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70707084",
    "wardName": "Xã Nghĩa Trung",
    "districtId": 70707,
    "districtName": "Huyện Bù Đăng",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70707085",
    "wardName": "Xã Bù Đăng",
    "districtId": 70707,
    "districtName": "Huyện Bù Đăng",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70707086",
    "wardName": "Xã Thọ Sơn",
    "districtId": 70707,
    "districtName": "Huyện Bù Đăng",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70707087",
    "wardName": "Xã Đak Nhau",
    "districtId": 70707,
    "districtName": "Huyện Bù Đăng",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70707088",
    "wardName": "Xã Bom Bo",
    "districtId": 70707,
    "districtName": "Huyện Bù Đăng",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71301089",
    "wardName": "Phường Tam Phước",
    "districtId": 71301,
    "districtName": "Thành phố Biên Hoà",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71301090",
    "wardName": "Phường Phước Tân",
    "districtId": 71301,
    "districtName": "Thành phố Biên Hoà",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71305091",
    "wardName": "Xã Thanh Sơn",
    "districtId": 71305,
    "districtName": "Huyện Định Quán",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71303092",
    "wardName": "Xã Đak Lua",
    "districtId": 71303,
    "districtName": "Huyện Tân Phú",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71307093",
    "wardName": "Xã Phú Lý",
    "districtId": 71307,
    "districtName": "Huyện Vĩnh Cửu",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70715094",
    "wardName": "Xã Bù Gia Mập",
    "districtId": 70715,
    "districtName": "Huyện Bù Gia Mập",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "70715095",
    "wardName": "Xã Đăk Ơ",
    "districtId": 70715,
    "districtName": "Huyện Bù Gia Mập",
    "provinceId": 28,
    "provinceName": "Tỉnh Đồng Nai"
  },
  {
    "wardId": "71701001",
    "wardName": "Phường Vũng Tàu",
    "districtId": 71701,
    "districtName": "Thành phố Vũng Tàu",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71701002",
    "wardName": "Phường Tam Thắng",
    "districtId": 71701,
    "districtName": "Thành phố Vũng Tàu",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71701003",
    "wardName": "Phường Rạch Dừa",
    "districtId": 71701,
    "districtName": "Thành phố Vũng Tàu",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71701004",
    "wardName": "Phường Phước Thắng",
    "districtId": 71701,
    "districtName": "Thành phố Vũng Tàu",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71703005",
    "wardName": "Phường Bà Rịa",
    "districtId": 71703,
    "districtName": "Thành phố Bà Rịa",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71703006",
    "wardName": "Phường Long Hương",
    "districtId": 71703,
    "districtName": "Thành phố Bà Rịa",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71709007",
    "wardName": "Phường Phú Mỹ",
    "districtId": 71709,
    "districtName": "Thành phố Phú Mỹ",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71703008",
    "wardName": "Phường Tam Long",
    "districtId": 71703,
    "districtName": "Thành phố Bà Rịa",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71709009",
    "wardName": "Phường Tân Thành",
    "districtId": 71709,
    "districtName": "Thành phố Phú Mỹ",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71709010",
    "wardName": "Phường Tân Phước",
    "districtId": 71709,
    "districtName": "Thành phố Phú Mỹ",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71709011",
    "wardName": "Phường Tân Hải",
    "districtId": 71709,
    "districtName": "Thành phố Phú Mỹ",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71709012",
    "wardName": "Xã Châu Pha",
    "districtId": 71709,
    "districtName": "Thành phố Phú Mỹ",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71705013",
    "wardName": "Xã Ngãi Giao",
    "districtId": 71705,
    "districtName": "Huyện Châu Đức",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71705014",
    "wardName": "Xã Bình Giã",
    "districtId": 71705,
    "districtName": "Huyện Châu Đức",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71705015",
    "wardName": "Xã Kim Long",
    "districtId": 71705,
    "districtName": "Huyện Châu Đức",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71705016",
    "wardName": "Xã Châu Đức",
    "districtId": 71705,
    "districtName": "Huyện Châu Đức",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71705017",
    "wardName": "Xã Xuân Sơn",
    "districtId": 71705,
    "districtName": "Huyện Châu Đức",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71705018",
    "wardName": "Xã Nghĩa Thành",
    "districtId": 71705,
    "districtName": "Huyện Châu Đức",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71707019",
    "wardName": "Xã Hồ Tràm",
    "districtId": 71707,
    "districtName": "Huyện Xuyên Mộc",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71707020",
    "wardName": "Xã Xuyên Mộc",
    "districtId": 71707,
    "districtName": "Huyện Xuyên Mộc",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71707021",
    "wardName": "Xã Hòa Hội",
    "districtId": 71707,
    "districtName": "Huyện Xuyên Mộc",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71707022",
    "wardName": "Xã Bàu Lâm",
    "districtId": 71707,
    "districtName": "Huyện Xuyên Mộc",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71712023",
    "wardName": "Xã Phước Hải",
    "districtId": 71712,
    "districtName": "Huyện Long Đất",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71712024",
    "wardName": "Xã Long Hải",
    "districtId": 71712,
    "districtName": "Huyện Long Đất",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71712025",
    "wardName": "Xã Đất Đỏ",
    "districtId": 71712,
    "districtName": "Huyện Long Đất",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71712026",
    "wardName": "Xã Long Điền",
    "districtId": 71712,
    "districtName": "Huyện Long Đất",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71713027",
    "wardName": "Đặc khu Côn Đảo",
    "districtId": 71713,
    "districtName": "Huyện Côn Đảo",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71109028",
    "wardName": "Phường Đông Hoà",
    "districtId": 71109,
    "districtName": "Thành phố Dĩ An",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71109029",
    "wardName": "Phường Dĩ An",
    "districtId": 71109,
    "districtName": "Thành phố Dĩ An",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71109030",
    "wardName": "Phường Tân Đông Hiệp",
    "districtId": 71109,
    "districtName": "Thành phố Dĩ An",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71107031",
    "wardName": "Phường Thuận An",
    "districtId": 71107,
    "districtName": "Thành phố Thuận An",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71107032",
    "wardName": "Phường Thuận Giao",
    "districtId": 71107,
    "districtName": "Thành phố Thuận An",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71107033",
    "wardName": "Phường Bình Hoà",
    "districtId": 71107,
    "districtName": "Thành phố Thuận An",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71107034",
    "wardName": "Phường Lái Thiêu",
    "districtId": 71107,
    "districtName": "Thành phố Thuận An",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71107035",
    "wardName": "Phường An Phú",
    "districtId": 71107,
    "districtName": "Thành phố Thuận An",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71101036",
    "wardName": "Phường Bình Dương",
    "districtId": 71101,
    "districtName": "Thành phố Thủ Dầu Một",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71101037",
    "wardName": "Phường Chánh Hiệp",
    "districtId": 71101,
    "districtName": "Thành phố Thủ Dầu Một",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71101038",
    "wardName": "Phường Thủ Dầu Một",
    "districtId": 71101,
    "districtName": "Thành phố Thủ Dầu Một",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71101039",
    "wardName": "Phường Phú Lợi",
    "districtId": 71101,
    "districtName": "Thành phố Thủ Dầu Một",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71105040",
    "wardName": "Phường Vĩnh Tân",
    "districtId": 71105,
    "districtName": "Thành phố Tân Uyên",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71105041",
    "wardName": "Phường Bình Cơ",
    "districtId": 71105,
    "districtName": "Thành phố Tân Uyên",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71105042",
    "wardName": "Phường Tân Uyên",
    "districtId": 71105,
    "districtName": "Thành phố Tân Uyên",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71105043",
    "wardName": "Phường Tân Hiệp",
    "districtId": 71105,
    "districtName": "Thành phố Tân Uyên",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71105044",
    "wardName": "Phường Tân Khánh",
    "districtId": 71105,
    "districtName": "Thành phố Tân Uyên",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71103045",
    "wardName": "Phường Hoà Lợi",
    "districtId": 71103,
    "districtName": "Thành phố Bến Cát",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71101046",
    "wardName": "Phường Phú An",
    "districtId": 71101,
    "districtName": "Thành phố Thủ Dầu Một",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71113047",
    "wardName": "Phường Tây Nam",
    "districtId": 71113,
    "districtName": "Huyện Dầu Tiếng",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71115048",
    "wardName": "Phường Long Nguyên",
    "districtId": 71115,
    "districtName": "Huyện Bàu Bàng",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71115049",
    "wardName": "Phường Bến Cát",
    "districtId": 71115,
    "districtName": "Huyện Bàu Bàng",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71115050",
    "wardName": "Phường Chánh Phú Hoà",
    "districtId": 71115,
    "districtName": "Huyện Bàu Bàng",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71117051",
    "wardName": "Xã Bắc Tân Uyên",
    "districtId": 71117,
    "districtName": "Huyện Bắc Tân Uyên",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71117052",
    "wardName": "Xã Thường Tân",
    "districtId": 71117,
    "districtName": "Huyện Bắc Tân Uyên",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71111053",
    "wardName": "Xã An Long",
    "districtId": 71111,
    "districtName": "Huyện Phú Giáo",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71111054",
    "wardName": "Xã Phước Thành",
    "districtId": 71111,
    "districtName": "Huyện Phú Giáo",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71111055",
    "wardName": "Xã Phước Hoà",
    "districtId": 71111,
    "districtName": "Huyện Phú Giáo",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71111056",
    "wardName": "Xã Phú Giáo",
    "districtId": 71111,
    "districtName": "Huyện Phú Giáo",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71115057",
    "wardName": "Xã Trừ Văn Thố",
    "districtId": 71115,
    "districtName": "Huyện Bàu Bàng",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71115058",
    "wardName": "Xã Bàu Bàng",
    "districtId": 71115,
    "districtName": "Huyện Bàu Bàng",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71113059",
    "wardName": "Xã Minh Thạnh",
    "districtId": 71113,
    "districtName": "Huyện Dầu Tiếng",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71113060",
    "wardName": "Xã Long Hoà",
    "districtId": 71113,
    "districtName": "Huyện Dầu Tiếng",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71113061",
    "wardName": "Xã Dầu Tiếng",
    "districtId": 71113,
    "districtName": "Huyện Dầu Tiếng",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71113062",
    "wardName": "Xã Thanh An",
    "districtId": 71113,
    "districtName": "Huyện Dầu Tiếng",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70101063",
    "wardName": "Phường Sài Gòn",
    "districtId": 70101,
    "districtName": "Quận 1",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70101064",
    "wardName": "Phường Tân Định",
    "districtId": 70101,
    "districtName": "Quận 1",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70101065",
    "wardName": "Phường Bến Thành",
    "districtId": 70101,
    "districtName": "Quận 1",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70101066",
    "wardName": "Phường Cầu Ông Lãnh",
    "districtId": 70101,
    "districtName": "Quận 1",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70105067",
    "wardName": "Phường Bàn Cờ",
    "districtId": 70105,
    "districtName": "Quận 3",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70105068",
    "wardName": "Phường Xuân Hoà",
    "districtId": 70105,
    "districtName": "Quận 3",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70105069",
    "wardName": "Phường Nhiêu Lộc",
    "districtId": 70105,
    "districtName": "Quận 3",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70107070",
    "wardName": "Phường Xóm Chiếu",
    "districtId": 70107,
    "districtName": "Quận 4",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70107071",
    "wardName": "Phường Khánh Hội",
    "districtId": 70107,
    "districtName": "Quận 4",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70107072",
    "wardName": "Phường Vĩnh Hội",
    "districtId": 70107,
    "districtName": "Quận 4",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70109073",
    "wardName": "Phường Chợ Quán",
    "districtId": 70109,
    "districtName": "Quận 5",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70109074",
    "wardName": "Phường An Đông",
    "districtId": 70109,
    "districtName": "Quận 5",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70109075",
    "wardName": "Phường Chợ Lớn",
    "districtId": 70109,
    "districtName": "Quận 5",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70111076",
    "wardName": "Phường Bình Tây",
    "districtId": 70111,
    "districtName": "Quận 6",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70111077",
    "wardName": "Phường Bình Tiên",
    "districtId": 70111,
    "districtName": "Quận 6",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70111078",
    "wardName": "Phường Bình Phú",
    "districtId": 70111,
    "districtName": "Quận 6",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70111079",
    "wardName": "Phường Phú Lâm",
    "districtId": 70111,
    "districtName": "Quận 6",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70113080",
    "wardName": "Phường Tân Thuận",
    "districtId": 70113,
    "districtName": "Quận 7",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70113081",
    "wardName": "Phường Phú Thuận",
    "districtId": 70113,
    "districtName": "Quận 7",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70113082",
    "wardName": "Phường Tân Mỹ",
    "districtId": 70113,
    "districtName": "Quận 7",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70113083",
    "wardName": "Phường Tân Hưng",
    "districtId": 70113,
    "districtName": "Quận 7",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70115084",
    "wardName": "Phường Chánh Hưng",
    "districtId": 70115,
    "districtName": "Quận 8",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70115085",
    "wardName": "Phường Phú Định",
    "districtId": 70115,
    "districtName": "Quận 8",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70115086",
    "wardName": "Phường Bình Đông",
    "districtId": 70115,
    "districtName": "Quận 8",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70119087",
    "wardName": "Phường Diên Hồng",
    "districtId": 70119,
    "districtName": "Quận 10",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70119088",
    "wardName": "Phường Vườn Lài",
    "districtId": 70119,
    "districtName": "Quận 10",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70119089",
    "wardName": "Phường Hoà Hưng",
    "districtId": 70119,
    "districtName": "Quận 10",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70121090",
    "wardName": "Phường Minh Phụng",
    "districtId": 70121,
    "districtName": "Quận 11",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70121091",
    "wardName": "Phường Bình Thới",
    "districtId": 70121,
    "districtName": "Quận 11",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70121092",
    "wardName": "Phường Hoà Bình",
    "districtId": 70121,
    "districtName": "Quận 11",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70121093",
    "wardName": "Phường Phú Thọ",
    "districtId": 70121,
    "districtName": "Quận 11",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70123094",
    "wardName": "Phường Đông Hưng Thuận",
    "districtId": 70123,
    "districtName": "Quận 12",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70123095",
    "wardName": "Phường Trung Mỹ Tây",
    "districtId": 70123,
    "districtName": "Quận 12",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70123096",
    "wardName": "Phường Tân Thới Hiệp",
    "districtId": 70123,
    "districtName": "Quận 12",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70123097",
    "wardName": "Phường Thới An",
    "districtId": 70123,
    "districtName": "Quận 12",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70123098",
    "wardName": "Phường An Phú Đông",
    "districtId": 70123,
    "districtName": "Quận 12",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70134099",
    "wardName": "Phường An Lạc",
    "districtId": 70134,
    "districtName": "Quận Bình Tân",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70134100",
    "wardName": "Phường Tân Tạo",
    "districtId": 70134,
    "districtName": "Quận Bình Tân",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70134101",
    "wardName": "Phường Bình Tân",
    "districtId": 70134,
    "districtName": "Quận Bình Tân",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70134102",
    "wardName": "Phường Bình Trị Đông",
    "districtId": 70134,
    "districtName": "Quận Bình Tân",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70134103",
    "wardName": "Phường Bình Hưng Hoà",
    "districtId": 70134,
    "districtName": "Quận Bình Tân",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70129104",
    "wardName": "Phường Gia Định",
    "districtId": 70129,
    "districtName": "Quận Bình Thạnh",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70129105",
    "wardName": "Phường Bình Thạnh",
    "districtId": 70129,
    "districtName": "Quận Bình Thạnh",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70129106",
    "wardName": "Phường Bình Lợi Trung",
    "districtId": 70129,
    "districtName": "Quận Bình Thạnh",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70129107",
    "wardName": "Phường Thạnh Mỹ Tây",
    "districtId": 70129,
    "districtName": "Quận Bình Thạnh",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70129108",
    "wardName": "Phường Bình Quới",
    "districtId": 70129,
    "districtName": "Quận Bình Thạnh",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70125109",
    "wardName": "Phường Hạnh Thông",
    "districtId": 70125,
    "districtName": "Quận Gò Vấp",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70125110",
    "wardName": "Phường An Nhơn",
    "districtId": 70125,
    "districtName": "Quận Gò Vấp",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70125111",
    "wardName": "Phường Gò Vấp",
    "districtId": 70125,
    "districtName": "Quận Gò Vấp",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70125112",
    "wardName": "Phường An Hội Đông",
    "districtId": 70125,
    "districtName": "Quận Gò Vấp",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70125113",
    "wardName": "Phường Thông Tây Hội",
    "districtId": 70125,
    "districtName": "Quận Gò Vấp",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70125114",
    "wardName": "Phường An Hội Tây",
    "districtId": 70125,
    "districtName": "Quận Gò Vấp",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70131115",
    "wardName": "Phường Đức Nhuận",
    "districtId": 70131,
    "districtName": "Quận Phú Nhuận",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70131116",
    "wardName": "Phường Cầu Kiệu",
    "districtId": 70131,
    "districtName": "Quận Phú Nhuận",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70131117",
    "wardName": "Phường Phú Nhuận",
    "districtId": 70131,
    "districtName": "Quận Phú Nhuận",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70127118",
    "wardName": "Phường Tân Sơn Hoà",
    "districtId": 70127,
    "districtName": "Quận Tân Bình",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70127119",
    "wardName": "Phường Tân Sơn Nhất",
    "districtId": 70127,
    "districtName": "Quận Tân Bình",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70127120",
    "wardName": "Phường Tân Hoà",
    "districtId": 70127,
    "districtName": "Quận Tân Bình",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70127121",
    "wardName": "Phường Bảy Hiền",
    "districtId": 70127,
    "districtName": "Quận Tân Bình",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70127122",
    "wardName": "Phường Tân Bình",
    "districtId": 70127,
    "districtName": "Quận Tân Bình",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70127123",
    "wardName": "Phường Tân Sơn",
    "districtId": 70127,
    "districtName": "Quận Tân Bình",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70128124",
    "wardName": "Phường Tây Thạnh",
    "districtId": 70128,
    "districtName": "Quận Tân Phú",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70128125",
    "wardName": "Phường Tân Sơn Nhì",
    "districtId": 70128,
    "districtName": "Quận Tân Phú",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70128126",
    "wardName": "Phường Phú Thọ Hoà",
    "districtId": 70128,
    "districtName": "Quận Tân Phú",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70128127",
    "wardName": "Phường Tân Phú",
    "districtId": 70128,
    "districtName": "Quận Tân Phú",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70128128",
    "wardName": "Phường Phú Thạnh",
    "districtId": 70128,
    "districtName": "Quận Tân Phú",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70145129",
    "wardName": "Phường Hiệp Bình",
    "districtId": 70145,
    "districtName": "Thành phố Thủ Đức",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70145130",
    "wardName": "Phường Thủ Đức",
    "districtId": 70145,
    "districtName": "Thành phố Thủ Đức",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70145131",
    "wardName": "Phường Tam Bình",
    "districtId": 70145,
    "districtName": "Thành phố Thủ Đức",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70145132",
    "wardName": "Phường Linh Xuân",
    "districtId": 70145,
    "districtName": "Thành phố Thủ Đức",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70145133",
    "wardName": "Phường Tăng Nhơn Phú",
    "districtId": 70145,
    "districtName": "Thành phố Thủ Đức",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70145134",
    "wardName": "Phường Long Bình",
    "districtId": 70145,
    "districtName": "Thành phố Thủ Đức",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70145135",
    "wardName": "Phường Long Phước",
    "districtId": 70145,
    "districtName": "Thành phố Thủ Đức",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70145136",
    "wardName": "Phường Long Trường",
    "districtId": 70145,
    "districtName": "Thành phố Thủ Đức",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70145137",
    "wardName": "Phường Cát Lái",
    "districtId": 70145,
    "districtName": "Thành phố Thủ Đức",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70145138",
    "wardName": "Phường Bình Trưng",
    "districtId": 70145,
    "districtName": "Thành phố Thủ Đức",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70145139",
    "wardName": "Phường Phước Long",
    "districtId": 70145,
    "districtName": "Thành phố Thủ Đức",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70145140",
    "wardName": "Phường An Khánh",
    "districtId": 70145,
    "districtName": "Thành phố Thủ Đức",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70139141",
    "wardName": "Xã Vĩnh Lộc",
    "districtId": 70139,
    "districtName": "Huyện Bình Chánh",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70139142",
    "wardName": "Xã Tân Vĩnh Lộc",
    "districtId": 70139,
    "districtName": "Huyện Bình Chánh",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70139143",
    "wardName": "Xã Bình Lợi",
    "districtId": 70139,
    "districtName": "Huyện Bình Chánh",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70139144",
    "wardName": "Xã Tân Nhựt",
    "districtId": 70139,
    "districtName": "Huyện Bình Chánh",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70139145",
    "wardName": "Xã Bình Chánh",
    "districtId": 70139,
    "districtName": "Huyện Bình Chánh",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70139146",
    "wardName": "Xã Hưng Long",
    "districtId": 70139,
    "districtName": "Huyện Bình Chánh",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70139147",
    "wardName": "Xã Bình Hưng",
    "districtId": 70139,
    "districtName": "Huyện Bình Chánh",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70143148",
    "wardName": "Xã Bình Khánh",
    "districtId": 70143,
    "districtName": "Huyện Cần Giờ",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70143149",
    "wardName": "Xã An Thới Đông",
    "districtId": 70143,
    "districtName": "Huyện Cần Giờ",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70143150",
    "wardName": "Xã Cần Giờ",
    "districtId": 70143,
    "districtName": "Huyện Cần Giờ",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70135151",
    "wardName": "Xã Củ Chi",
    "districtId": 70135,
    "districtName": "Huyện Củ Chi",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70135152",
    "wardName": "Xã Tân An Hội",
    "districtId": 70135,
    "districtName": "Huyện Củ Chi",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70135153",
    "wardName": "Xã Thái Mỹ",
    "districtId": 70135,
    "districtName": "Huyện Củ Chi",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70135154",
    "wardName": "Xã An Nhơn Tây",
    "districtId": 70135,
    "districtName": "Huyện Củ Chi",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70135155",
    "wardName": "Xã Nhuận Đức",
    "districtId": 70135,
    "districtName": "Huyện Củ Chi",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70135156",
    "wardName": "Xã Phú Hoà Đông",
    "districtId": 70135,
    "districtName": "Huyện Củ Chi",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70135157",
    "wardName": "Xã Bình Mỹ",
    "districtId": 70135,
    "districtName": "Huyện Củ Chi",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70137158",
    "wardName": "Xã Đông Thạnh",
    "districtId": 70137,
    "districtName": "Huyện Hóc Môn",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70137159",
    "wardName": "Xã Hóc Môn",
    "districtId": 70137,
    "districtName": "Huyện Hóc Môn",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70137160",
    "wardName": "Xã Xuân Thới Sơn",
    "districtId": 70137,
    "districtName": "Huyện Hóc Môn",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70137161",
    "wardName": "Xã Bà Điểm",
    "districtId": 70137,
    "districtName": "Huyện Hóc Môn",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70141162",
    "wardName": "Xã Nhà Bè",
    "districtId": 70141,
    "districtName": "Huyện Nhà Bè",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70141163",
    "wardName": "Xã Hiệp Phước",
    "districtId": 70141,
    "districtName": "Huyện Nhà Bè",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71701164",
    "wardName": "Xã Long Sơn",
    "districtId": 71701,
    "districtName": "Thành phố Vũng Tàu",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71707165",
    "wardName": "Xã Hòa Hiệp",
    "districtId": 71707,
    "districtName": "Huyện Xuyên Mộc",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71707166",
    "wardName": "Xã Bình Châu",
    "districtId": 71707,
    "districtName": "Huyện Xuyên Mộc",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "71103167",
    "wardName": "Phường Thới Hoà",
    "districtId": 71103,
    "districtName": "Thành phố Bến Cát",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "70143168",
    "wardName": "Xã Thạnh An",
    "districtId": 70143,
    "districtName": "Huyện Cần Giờ",
    "provinceId": 29,
    "provinceName": "Tp Hồ Chí Minh"
  },
  {
    "wardId": "81701037",
    "wardName": "Phường Trà Vinh",
    "districtId": 81701,
    "districtName": "Thành phố Trà Vinh",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80905001",
    "wardName": "Xã Cái Nhum",
    "districtId": 80905,
    "districtName": "Huyện Mang Thít",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81701036",
    "wardName": "Phường Long Đức",
    "districtId": 81701,
    "districtName": "Thành phố Trà Vinh",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80905002",
    "wardName": "Xã Tân Long Hội",
    "districtId": 80905,
    "districtName": "Huyện Mang Thít",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81701038",
    "wardName": "Phường Nguyệt Hóa",
    "districtId": 81701,
    "districtName": "Thành phố Trà Vinh",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80905003",
    "wardName": "Xã Nhơn Phú",
    "districtId": 80905,
    "districtName": "Huyện Mang Thít",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81701039",
    "wardName": "Phường Hòa Thuận",
    "districtId": 81701,
    "districtName": "Thành phố Trà Vinh",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80905004",
    "wardName": "Xã Bình Phước",
    "districtId": 80905,
    "districtName": "Huyện Mang Thít",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81703042",
    "wardName": "Xã Càng Long",
    "districtId": 81703,
    "districtName": "Huyện Càng Long",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80903005",
    "wardName": "Xã An Bình",
    "districtId": 80903,
    "districtName": "Huyện Long Hồ",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81703040",
    "wardName": "Xã An Trường",
    "districtId": 81703,
    "districtName": "Huyện Càng Long",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80903006",
    "wardName": "Xã Long Hồ",
    "districtId": 80903,
    "districtName": "Huyện Long Hồ",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81703041",
    "wardName": "Xã Tân An",
    "districtId": 81703,
    "districtName": "Huyện Càng Long",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80903007",
    "wardName": "Xã Phú Quới",
    "districtId": 80903,
    "districtName": "Huyện Long Hồ",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81703043",
    "wardName": "Xã Nhị Long",
    "districtId": 81703,
    "districtName": "Huyện Càng Long",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80901008",
    "wardName": "Phường Thanh Đức",
    "districtId": 80901,
    "districtName": "Thành phố Vĩnh Long",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81703044",
    "wardName": "Xã Bình Phú",
    "districtId": 81703,
    "districtName": "Huyện Càng Long",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80901009",
    "wardName": "Phường Long Châu",
    "districtId": 80901,
    "districtName": "Thành phố Vĩnh Long",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81705046",
    "wardName": "Xã Châu Thành",
    "districtId": 81705,
    "districtName": "Huyện Châu Thành",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80901010",
    "wardName": "Phường Phước Hậu",
    "districtId": 80901,
    "districtName": "Thành phố Vĩnh Long",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81705045",
    "wardName": "Xã Song Lộc",
    "districtId": 81705,
    "districtName": "Huyện Châu Thành",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80901011",
    "wardName": "Phường Tân Hạnh",
    "districtId": 80901,
    "districtName": "Thành phố Vĩnh Long",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81705047",
    "wardName": "Xã Hưng Mỹ",
    "districtId": 81705,
    "districtName": "Huyện Châu Thành",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80901012",
    "wardName": "Phường Tân Ngãi",
    "districtId": 80901,
    "districtName": "Thành phố Vĩnh Long",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81705048",
    "wardName": "Xã Hòa Minh",
    "districtId": 81705,
    "districtName": "Huyện Châu Thành",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80913013",
    "wardName": "Xã Quới Thiện",
    "districtId": 80913,
    "districtName": "Huyện Vũng Liêm",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81705049",
    "wardName": "Xã Long Hòa",
    "districtId": 81705,
    "districtName": "Huyện Châu Thành",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80913014",
    "wardName": "Xã Trung Thành",
    "districtId": 80913,
    "districtName": "Huyện Vũng Liêm",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81707050",
    "wardName": "Xã Cầu Kè",
    "districtId": 81707,
    "districtName": "Huyện Cầu Kè",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80913015",
    "wardName": "Xã Trung Ngãi",
    "districtId": 80913,
    "districtName": "Huyện Vũng Liêm",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81707051",
    "wardName": "Xã Phong Thạnh",
    "districtId": 81707,
    "districtName": "Huyện Cầu Kè",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80913016",
    "wardName": "Xã Quới An",
    "districtId": 80913,
    "districtName": "Huyện Vũng Liêm",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81707052",
    "wardName": "Xã An Phú Tân",
    "districtId": 81707,
    "districtName": "Huyện Cầu Kè",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80913017",
    "wardName": "Xã Trung Hiệp",
    "districtId": 80913,
    "districtName": "Huyện Vũng Liêm",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81707053",
    "wardName": "Xã Tam Ngãi",
    "districtId": 81707,
    "districtName": "Huyện Cầu Kè",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80913018",
    "wardName": "Xã Hiếu Phụng",
    "districtId": 80913,
    "districtName": "Huyện Vũng Liêm",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81709056",
    "wardName": "Xã Tiểu Cần",
    "districtId": 81709,
    "districtName": "Huyện Tiểu Cần",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80913019",
    "wardName": "Xã Hiếu Thành",
    "districtId": 80913,
    "districtName": "Huyện Vũng Liêm",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81709054",
    "wardName": "Xã Tân Hòa",
    "districtId": 81709,
    "districtName": "Huyện Tiểu Cần",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80911020",
    "wardName": "Xã Lục Sỹ Thành",
    "districtId": 80911,
    "districtName": "Huyện Trà Ôn",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81709055",
    "wardName": "Xã Hùng Hòa",
    "districtId": 81709,
    "districtName": "Huyện Tiểu Cần",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80911021",
    "wardName": "Xã Trà Ôn",
    "districtId": 80911,
    "districtName": "Huyện Trà Ôn",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81709057",
    "wardName": "Xã Tập Ngãi",
    "districtId": 81709,
    "districtName": "Huyện Tiểu Cần",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80911022",
    "wardName": "Xã Trà Côn",
    "districtId": 80911,
    "districtName": "Huyện Trà Ôn",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81711060",
    "wardName": "Xã Cầu Ngang",
    "districtId": 81711,
    "districtName": "Huyện Cầu Ngang",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80911023",
    "wardName": "Xã Vĩnh Xuân",
    "districtId": 80911,
    "districtName": "Huyện Trà Ôn",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81711058",
    "wardName": "Xã Mỹ Long",
    "districtId": 81711,
    "districtName": "Huyện Cầu Ngang",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80911024",
    "wardName": "Xã Hòa Bình",
    "districtId": 80911,
    "districtName": "Huyện Trà Ôn",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81711059",
    "wardName": "Xã Vinh Kim",
    "districtId": 81711,
    "districtName": "Huyện Cầu Ngang",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80909025",
    "wardName": "Xã Hòa Hiệp",
    "districtId": 80909,
    "districtName": "Huyện Tam Bình",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81711061",
    "wardName": "Xã Nhị Trường",
    "districtId": 81711,
    "districtName": "Huyện Cầu Ngang",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80909026",
    "wardName": "Xã Tam Bình",
    "districtId": 80909,
    "districtName": "Huyện Tam Bình",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81711062",
    "wardName": "Xã Hiệp Mỹ",
    "districtId": 81711,
    "districtName": "Huyện Cầu Ngang",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80909027",
    "wardName": "Xã Ngãi Tứ",
    "districtId": 80909,
    "districtName": "Huyện Tam Bình",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81713066",
    "wardName": "Xã Trà Cú",
    "districtId": 81713,
    "districtName": "Huyện Trà Cú",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80909028",
    "wardName": "Xã Song Phú",
    "districtId": 80909,
    "districtName": "Huyện Tam Bình",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81713063",
    "wardName": "Xã Lưu Nghiệp Anh",
    "districtId": 81713,
    "districtName": "Huyện Trà Cú",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80909029",
    "wardName": "Xã Cái Ngang",
    "districtId": 80909,
    "districtName": "Huyện Tam Bình",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81713064",
    "wardName": "Xã Đại An",
    "districtId": 81713,
    "districtName": "Huyện Trà Cú",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80908030",
    "wardName": "Xã Tân Quới",
    "districtId": 80908,
    "districtName": "Huyện Bình Tân",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81713065",
    "wardName": "Xã Hàm Giang",
    "districtId": 81713,
    "districtName": "Huyện Trà Cú",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80908031",
    "wardName": "Xã Tân Lược",
    "districtId": 80908,
    "districtName": "Huyện Bình Tân",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81713067",
    "wardName": "Xã Long Hiệp",
    "districtId": 81713,
    "districtName": "Huyện Trà Cú",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80908032",
    "wardName": "Xã Mỹ Thuận",
    "districtId": 80908,
    "districtName": "Huyện Bình Tân",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81713068",
    "wardName": "Xã Tập Sơn",
    "districtId": 81713,
    "districtName": "Huyện Trà Cú",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80907033",
    "wardName": "Phường Bình Minh",
    "districtId": 80907,
    "districtName": "Thị xã Bình Minh",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81716069",
    "wardName": "Phường Duyên Hải",
    "districtId": 81716,
    "districtName": "Thị xã Duyên Hải",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80907034",
    "wardName": "Phường Cái Vồn",
    "districtId": 80907,
    "districtName": "Thị xã Bình Minh",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81716070",
    "wardName": "Phường Trường Long Hòa",
    "districtId": 81716,
    "districtName": "Thị xã Duyên Hải",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80907035",
    "wardName": "Phường Đông Thành",
    "districtId": 80907,
    "districtName": "Thị xã Bình Minh",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81716071",
    "wardName": "Xã Long Hữu",
    "districtId": 81716,
    "districtName": "Thị xã Duyên Hải",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81715072",
    "wardName": "Xã Long Thành",
    "districtId": 81715,
    "districtName": "Huyện Duyên Hải",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81715073",
    "wardName": "Xã Đông Hải",
    "districtId": 81715,
    "districtName": "Huyện Duyên Hải",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81715074",
    "wardName": "Xã Long Vĩnh",
    "districtId": 81715,
    "districtName": "Huyện Duyên Hải",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81715075",
    "wardName": "Xã Đôn Châu",
    "districtId": 81715,
    "districtName": "Huyện Duyên Hải",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81715076",
    "wardName": "Xã Ngũ Lạc",
    "districtId": 81715,
    "districtName": "Huyện Duyên Hải",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81101077",
    "wardName": "Phường An Hội",
    "districtId": 81101,
    "districtName": "Thành phố Bến Tre",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81101078",
    "wardName": "Phường Phú Khương",
    "districtId": 81101,
    "districtName": "Thành phố Bến Tre",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81101079",
    "wardName": "Phường Bến Tre",
    "districtId": 81101,
    "districtName": "Thành phố Bến Tre",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81101080",
    "wardName": "Phường Sơn Đông",
    "districtId": 81101,
    "districtName": "Thành phố Bến Tre",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81103081",
    "wardName": "Phường Phú Tân",
    "districtId": 81103,
    "districtName": "Huyện Châu Thành",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81103082",
    "wardName": "Xã Phú Túc",
    "districtId": 81103,
    "districtName": "Huyện Châu Thành",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81103083",
    "wardName": "Xã Giao Long",
    "districtId": 81103,
    "districtName": "Huyện Châu Thành",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81103084",
    "wardName": "Xã Tiên Thủy",
    "districtId": 81103,
    "districtName": "Huyện Châu Thành",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81103085",
    "wardName": "Xã Tân Phú",
    "districtId": 81103,
    "districtName": "Huyện Châu Thành",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81105086",
    "wardName": "Xã Phú Phụng",
    "districtId": 81105,
    "districtName": "Huyện Chợ Lách",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81105087",
    "wardName": "Xã Chợ Lách",
    "districtId": 81105,
    "districtName": "Huyện Chợ Lách",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81105088",
    "wardName": "Xã Vĩnh Thành",
    "districtId": 81105,
    "districtName": "Huyện Chợ Lách",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81105089",
    "wardName": "Xã Hưng Khánh Trung",
    "districtId": 81105,
    "districtName": "Huyện Chợ Lách",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81108090",
    "wardName": "Xã Phước Mỹ Trung",
    "districtId": 81108,
    "districtName": "Huyện Mỏ Cày Bắc",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81108091",
    "wardName": "Xã Tân Thành Bình",
    "districtId": 81108,
    "districtName": "Huyện Mỏ Cày Bắc",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81108092",
    "wardName": "Xã Nhuận Phú Tân",
    "districtId": 81108,
    "districtName": "Huyện Mỏ Cày Bắc",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81107093",
    "wardName": "Xã Đồng Khởi",
    "districtId": 81107,
    "districtName": "Huyện Mỏ Cày Nam",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81107094",
    "wardName": "Xã Mỏ Cày",
    "districtId": 81107,
    "districtName": "Huyện Mỏ Cày Nam",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81107095",
    "wardName": "Xã Thành Thới",
    "districtId": 81107,
    "districtName": "Huyện Mỏ Cày Nam",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81107096",
    "wardName": "Xã An Định",
    "districtId": 81107,
    "districtName": "Huyện Mỏ Cày Nam",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81107097",
    "wardName": "Xã Hương Mỹ",
    "districtId": 81107,
    "districtName": "Huyện Mỏ Cày Nam",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81115098",
    "wardName": "Xã Đại Điền",
    "districtId": 81115,
    "districtName": "Huyện Thạnh Phú",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81115099",
    "wardName": "Xã Quới Điền",
    "districtId": 81115,
    "districtName": "Huyện Thạnh Phú",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81115100",
    "wardName": "Xã Thạnh Phú",
    "districtId": 81115,
    "districtName": "Huyện Thạnh Phú",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81115101",
    "wardName": "Xã An Qui",
    "districtId": 81115,
    "districtName": "Huyện Thạnh Phú",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81115102",
    "wardName": "Xã Thạnh Hải",
    "districtId": 81115,
    "districtName": "Huyện Thạnh Phú",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81115103",
    "wardName": "Xã Thạnh Phong",
    "districtId": 81115,
    "districtName": "Huyện Thạnh Phú",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81113104",
    "wardName": "Xã Tân Thủy",
    "districtId": 81113,
    "districtName": "Huyện Ba Tri",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81113105",
    "wardName": "Xã Bảo Thạnh",
    "districtId": 81113,
    "districtName": "Huyện Ba Tri",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81113106",
    "wardName": "Xã Ba Tri",
    "districtId": 81113,
    "districtName": "Huyện Ba Tri",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81113107",
    "wardName": "Xã Tân Xuân",
    "districtId": 81113,
    "districtName": "Huyện Ba Tri",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81113108",
    "wardName": "Xã Mỹ Chánh Hòa",
    "districtId": 81113,
    "districtName": "Huyện Ba Tri",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81113109",
    "wardName": "Xã An Ngãi Trung",
    "districtId": 81113,
    "districtName": "Huyện Ba Tri",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81113110",
    "wardName": "Xã An Hiệp",
    "districtId": 81113,
    "districtName": "Huyện Ba Tri",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81109111",
    "wardName": "Xã Hưng Nhượng",
    "districtId": 81109,
    "districtName": "Huyện Giồng Trôm",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81109112",
    "wardName": "Xã Giồng Trôm",
    "districtId": 81109,
    "districtName": "Huyện Giồng Trôm",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81109113",
    "wardName": "Xã Tân Hào",
    "districtId": 81109,
    "districtName": "Huyện Giồng Trôm",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81109114",
    "wardName": "Xã Phước Long",
    "districtId": 81109,
    "districtName": "Huyện Giồng Trôm",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81109115",
    "wardName": "Xã Lương Phú",
    "districtId": 81109,
    "districtName": "Huyện Giồng Trôm",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81109116",
    "wardName": "Xã Châu Hòa",
    "districtId": 81109,
    "districtName": "Huyện Giồng Trôm",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81109117",
    "wardName": "Xã Lương Hòa",
    "districtId": 81109,
    "districtName": "Huyện Giồng Trôm",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81111118",
    "wardName": "Xã Thới Thuận",
    "districtId": 81111,
    "districtName": "Huyện Bình Đại",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81111119",
    "wardName": "Xã Thạnh Phước",
    "districtId": 81111,
    "districtName": "Huyện Bình Đại",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81111120",
    "wardName": "Xã Bình Đại",
    "districtId": 81111,
    "districtName": "Huyện Bình Đại",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81111121",
    "wardName": "Xã Thạnh Trị",
    "districtId": 81111,
    "districtName": "Huyện Bình Đại",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81111122",
    "wardName": "Xã Lộc Thuận",
    "districtId": 81111,
    "districtName": "Huyện Bình Đại",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81111123",
    "wardName": "Xã Châu Hưng",
    "districtId": 81111,
    "districtName": "Huyện Bình Đại",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "81111124",
    "wardName": "Xã Phú Thuận",
    "districtId": 81111,
    "districtName": "Huyện Bình Đại",
    "provinceId": 30,
    "provinceName": "Tỉnh Vĩnh Long"
  },
  {
    "wardId": "80701001",
    "wardName": "Phường Mỹ Tho",
    "districtId": 80701,
    "districtName": "Thành phố Mỹ Tho",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80701002",
    "wardName": "Phường Đạo Thạnh",
    "districtId": 80701,
    "districtName": "Thành phố Mỹ Tho",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80701003",
    "wardName": "Phường Mỹ Phong",
    "districtId": 80701,
    "districtName": "Thành phố Mỹ Tho",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80701004",
    "wardName": "Phường Thới Sơn",
    "districtId": 80701,
    "districtName": "Thành phố Mỹ Tho",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80701005",
    "wardName": "Phường Trung An",
    "districtId": 80701,
    "districtName": "Thành phố Mỹ Tho",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80703006",
    "wardName": "Phường Gò Công",
    "districtId": 80703,
    "districtName": "Thành phố Gò Công",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80703007",
    "wardName": "Phường Long Thuận",
    "districtId": 80703,
    "districtName": "Thành phố Gò Công",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80703008",
    "wardName": "Phường Sơn Qui",
    "districtId": 80703,
    "districtName": "Thành phố Gò Công",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80703009",
    "wardName": "Phường Bình Xuân",
    "districtId": 80703,
    "districtName": "Thành phố Gò Công",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80721010",
    "wardName": "Phường Mỹ Phước Tây",
    "districtId": 80721,
    "districtName": "Thị xã Cai Lậy",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80721011",
    "wardName": "Phường Thanh Hoà",
    "districtId": 80721,
    "districtName": "Thị xã Cai Lậy",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80721012",
    "wardName": "Phường Cai Lậy",
    "districtId": 80721,
    "districtName": "Thị xã Cai Lậy",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80721013",
    "wardName": "Phường Nhị Quý",
    "districtId": 80721,
    "districtName": "Thị xã Cai Lậy",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80721014",
    "wardName": "Xã Tân Phú",
    "districtId": 80721,
    "districtName": "Thị xã Cai Lậy",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80713015",
    "wardName": "Xã Thanh Hưng",
    "districtId": 80713,
    "districtName": "Huyện Cái Bè",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80713016",
    "wardName": "Xã An Hữu",
    "districtId": 80713,
    "districtName": "Huyện Cái Bè",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80713017",
    "wardName": "Xã Mỹ Lợi",
    "districtId": 80713,
    "districtName": "Huyện Cái Bè",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80713018",
    "wardName": "Xã Mỹ Đức Tây",
    "districtId": 80713,
    "districtName": "Huyện Cái Bè",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80713019",
    "wardName": "Xã Mỹ Thiện",
    "districtId": 80713,
    "districtName": "Huyện Cái Bè",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80713020",
    "wardName": "Xã Hậu Mỹ",
    "districtId": 80713,
    "districtName": "Huyện Cái Bè",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80713021",
    "wardName": "Xã Hội Cư",
    "districtId": 80713,
    "districtName": "Huyện Cái Bè",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80713022",
    "wardName": "Xã Cái Bè",
    "districtId": 80713,
    "districtName": "Huyện Cái Bè",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80709023",
    "wardName": "Xã Bình Phú",
    "districtId": 80709,
    "districtName": "Huyện Cai Lậy",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80709024",
    "wardName": "Xã Hiệp Đức",
    "districtId": 80709,
    "districtName": "Huyện Cai Lậy",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80709025",
    "wardName": "Xã Ngũ Hiệp",
    "districtId": 80709,
    "districtName": "Huyện Cai Lậy",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80709026",
    "wardName": "Xã Long Tiên",
    "districtId": 80709,
    "districtName": "Huyện Cai Lậy",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80709027",
    "wardName": "Xã Mỹ Thành",
    "districtId": 80709,
    "districtName": "Huyện Cai Lậy",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80709028",
    "wardName": "Xã Thạnh Phú",
    "districtId": 80709,
    "districtName": "Huyện Cai Lậy",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80705029",
    "wardName": "Xã Tân Phước 1",
    "districtId": 80705,
    "districtName": "Huyện Tân Phước",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80705030",
    "wardName": "Xã Tân Phước 2",
    "districtId": 80705,
    "districtName": "Huyện Tân Phước",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80705031",
    "wardName": "Xã Tân Phước 3",
    "districtId": 80705,
    "districtName": "Huyện Tân Phước",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80705032",
    "wardName": "Xã Hưng Thạnh",
    "districtId": 80705,
    "districtName": "Huyện Tân Phước",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80707033",
    "wardName": "Xã Tân Hương",
    "districtId": 80707,
    "districtName": "Huyện Châu Thành",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80707034",
    "wardName": "Xã Châu Thành",
    "districtId": 80707,
    "districtName": "Huyện Châu Thành",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80707035",
    "wardName": "Xã Long Hưng",
    "districtId": 80707,
    "districtName": "Huyện Châu Thành",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80707036",
    "wardName": "Xã Long Định",
    "districtId": 80707,
    "districtName": "Huyện Châu Thành",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80707037",
    "wardName": "Xã Vĩnh Kim",
    "districtId": 80707,
    "districtName": "Huyện Châu Thành",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80707038",
    "wardName": "Xã Kim Sơn",
    "districtId": 80707,
    "districtName": "Huyện Châu Thành",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80707039",
    "wardName": "Xã Bình Trưng",
    "districtId": 80707,
    "districtName": "Huyện Châu Thành",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80711040",
    "wardName": "Xã Mỹ Tịnh An",
    "districtId": 80711,
    "districtName": "Huyện Chợ Gạo",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80711041",
    "wardName": "Xã Lương Hoà Lạc",
    "districtId": 80711,
    "districtName": "Huyện Chợ Gạo",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80711042",
    "wardName": "Xã Tân Thuận Bình",
    "districtId": 80711,
    "districtName": "Huyện Chợ Gạo",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80711043",
    "wardName": "Xã Chợ Gạo",
    "districtId": 80711,
    "districtName": "Huyện Chợ Gạo",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80711044",
    "wardName": "Xã An Thạnh Thủy",
    "districtId": 80711,
    "districtName": "Huyện Chợ Gạo",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80711045",
    "wardName": "Xã Bình Ninh",
    "districtId": 80711,
    "districtName": "Huyện Chợ Gạo",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80715046",
    "wardName": "Xã Vĩnh Bình",
    "districtId": 80715,
    "districtName": "Huyện Gò Công Tây",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80715047",
    "wardName": "Xã Đồng Sơn",
    "districtId": 80715,
    "districtName": "Huyện Gò Công Tây",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80715048",
    "wardName": "Xã Phú Thành",
    "districtId": 80715,
    "districtName": "Huyện Gò Công Tây",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80715049",
    "wardName": "Xã Long Bình",
    "districtId": 80715,
    "districtName": "Huyện Gò Công Tây",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80715050",
    "wardName": "Xã Vĩnh Hựu",
    "districtId": 80715,
    "districtName": "Huyện Gò Công Tây",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80717051",
    "wardName": "Xã Gò Công Đông",
    "districtId": 80717,
    "districtName": "Huyện Gò Công Đông",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80717052",
    "wardName": "Xã Tân Điền",
    "districtId": 80717,
    "districtName": "Huyện Gò Công Đông",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80717053",
    "wardName": "Xã Tân Hoà",
    "districtId": 80717,
    "districtName": "Huyện Gò Công Đông",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80717054",
    "wardName": "Xã Tân Đông",
    "districtId": 80717,
    "districtName": "Huyện Gò Công Đông",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80717055",
    "wardName": "Xã Gia Thuận",
    "districtId": 80717,
    "districtName": "Huyện Gò Công Đông",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80719056",
    "wardName": "Xã Tân Thới",
    "districtId": 80719,
    "districtName": "Huyện Tân Phú Đông",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80719057",
    "wardName": "Xã Tân Phú Đông",
    "districtId": 80719,
    "districtName": "Huyện Tân Phú Đông",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80305058",
    "wardName": "Xã Tân Hồng",
    "districtId": 80305,
    "districtName": "Huyện Tân Hồng",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80305059",
    "wardName": "Xã Tân Thành",
    "districtId": 80305,
    "districtName": "Huyện Tân Hồng",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80305060",
    "wardName": "Xã Tân Hộ Cơ",
    "districtId": 80305,
    "districtName": "Huyện Tân Hồng",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80305061",
    "wardName": "Xã An Phước",
    "districtId": 80305,
    "districtName": "Huyện Tân Hồng",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80323062",
    "wardName": "Phường An Bình",
    "districtId": 80323,
    "districtName": "Thành phố Hồng Ngự",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80323063",
    "wardName": "Phường Hồng Ngự",
    "districtId": 80323,
    "districtName": "Thành phố Hồng Ngự",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80307064",
    "wardName": "Phường Thường Lạc",
    "districtId": 80307,
    "districtName": "Huyện Hồng Ngự",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80307065",
    "wardName": "Xã Thường Phước",
    "districtId": 80307,
    "districtName": "Huyện Hồng Ngự",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80307066",
    "wardName": "Xã Long Khánh",
    "districtId": 80307,
    "districtName": "Huyện Hồng Ngự",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80307067",
    "wardName": "Xã Long Phú Thuận",
    "districtId": 80307,
    "districtName": "Huyện Hồng Ngự",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80309068",
    "wardName": "Xã An Hoà",
    "districtId": 80309,
    "districtName": "Huyện Tam Nông",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80309069",
    "wardName": "Xã Tam Nông",
    "districtId": 80309,
    "districtName": "Huyện Tam Nông",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80309070",
    "wardName": "Xã Phú Thọ",
    "districtId": 80309,
    "districtName": "Huyện Tam Nông",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80309071",
    "wardName": "Xã Tràm Chim",
    "districtId": 80309,
    "districtName": "Huyện Tam Nông",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80309072",
    "wardName": "Xã Phú Cường",
    "districtId": 80309,
    "districtName": "Huyện Tam Nông",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80309073",
    "wardName": "Xã An Long",
    "districtId": 80309,
    "districtName": "Huyện Tam Nông",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80311074",
    "wardName": "Xã Thanh Bình",
    "districtId": 80311,
    "districtName": "Huyện Thanh Bình",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80311075",
    "wardName": "Xã Tân Thạnh",
    "districtId": 80311,
    "districtName": "Huyện Thanh Bình",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80311076",
    "wardName": "Xã Bình Thành",
    "districtId": 80311,
    "districtName": "Huyện Thanh Bình",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80311077",
    "wardName": "Xã Tân Long",
    "districtId": 80311,
    "districtName": "Huyện Thanh Bình",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80313078",
    "wardName": "Xã Tháp Mười",
    "districtId": 80313,
    "districtName": "Huyện Tháp Mười",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80313079",
    "wardName": "Xã Thanh Mỹ",
    "districtId": 80313,
    "districtName": "Huyện Tháp Mười",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80313080",
    "wardName": "Xã Mỹ Quí",
    "districtId": 80313,
    "districtName": "Huyện Tháp Mười",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80313081",
    "wardName": "Xã Đốc Binh Kiều",
    "districtId": 80313,
    "districtName": "Huyện Tháp Mười",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80313082",
    "wardName": "Xã Trường Xuân",
    "districtId": 80313,
    "districtName": "Huyện Tháp Mười",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80313083",
    "wardName": "Xã Phương Thịnh",
    "districtId": 80313,
    "districtName": "Huyện Tháp Mười",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80315084",
    "wardName": "Xã Phong Mỹ",
    "districtId": 80315,
    "districtName": "Huyện Cao Lãnh",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80315085",
    "wardName": "Xã Ba Sao",
    "districtId": 80315,
    "districtName": "Huyện Cao Lãnh",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80315086",
    "wardName": "Xã Mỹ Thọ",
    "districtId": 80315,
    "districtName": "Huyện Cao Lãnh",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80315087",
    "wardName": "Xã Bình Hàng Trung",
    "districtId": 80315,
    "districtName": "Huyện Cao Lãnh",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80315088",
    "wardName": "Xã Mỹ Hiệp",
    "districtId": 80315,
    "districtName": "Huyện Cao Lãnh",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80301089",
    "wardName": "Phường Cao Lãnh",
    "districtId": 80301,
    "districtName": "Thành phố Cao Lãnh",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80301090",
    "wardName": "Phường Mỹ Ngãi",
    "districtId": 80301,
    "districtName": "Thành phố Cao Lãnh",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80301091",
    "wardName": "Phường Mỹ Trà",
    "districtId": 80301,
    "districtName": "Thành phố Cao Lãnh",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80317092",
    "wardName": "Xã Mỹ An Hưng",
    "districtId": 80317,
    "districtName": "Huyện Lấp Vò",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80317093",
    "wardName": "Xã Tân Khánh Trung",
    "districtId": 80317,
    "districtName": "Huyện Lấp Vò",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80317094",
    "wardName": "Xã Lấp Vò",
    "districtId": 80317,
    "districtName": "Huyện Lấp Vò",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80319095",
    "wardName": "Xã Lai Vung",
    "districtId": 80319,
    "districtName": "Huyện Lai Vung",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80319096",
    "wardName": "Xã Hoà Long",
    "districtId": 80319,
    "districtName": "Huyện Lai Vung",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80319097",
    "wardName": "Xã Phong Hoà",
    "districtId": 80319,
    "districtName": "Huyện Lai Vung",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80303098",
    "wardName": "Phường Sa Đéc",
    "districtId": 80303,
    "districtName": "Thành phố Sa Đéc",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80319099",
    "wardName": "Xã Tân Dương",
    "districtId": 80319,
    "districtName": "Huyện Lai Vung",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80321100",
    "wardName": "Xã Phú Hựu",
    "districtId": 80321,
    "districtName": "Huyện Châu Thành",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80321101",
    "wardName": "Xã Tân Nhuận Đông",
    "districtId": 80321,
    "districtName": "Huyện Châu Thành",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80321102",
    "wardName": "Xã Tân Phú Trung",
    "districtId": 80321,
    "districtName": "Huyện Châu Thành",
    "provinceId": 31,
    "provinceName": "Tỉnh Đồng Tháp"
  },
  {
    "wardId": "80501001",
    "wardName": "Xã Mỹ Hoà Hưng",
    "districtId": 80501,
    "districtName": "Thành phố Long Xuyên",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80501002",
    "wardName": "Phường Long Xuyên",
    "districtId": 80501,
    "districtName": "Thành phố Long Xuyên",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80501003",
    "wardName": "Phường Bình Đức",
    "districtId": 80501,
    "districtName": "Thành phố Long Xuyên",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80501004",
    "wardName": "Phường Mỹ Thới",
    "districtId": 80501,
    "districtName": "Thành phố Long Xuyên",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80503005",
    "wardName": "Phường Châu Đốc",
    "districtId": 80503,
    "districtName": "Thành phố Châu Đốc",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80503006",
    "wardName": "Phường Vĩnh Tế",
    "districtId": 80503,
    "districtName": "Thành phố Châu Đốc",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80505007",
    "wardName": "Xã An Phú",
    "districtId": 80505,
    "districtName": "Huyện An Phú",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80505008",
    "wardName": "Xã Vĩnh Hậu",
    "districtId": 80505,
    "districtName": "Huyện An Phú",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80505009",
    "wardName": "Xã Nhơn Hội",
    "districtId": 80505,
    "districtName": "Huyện An Phú",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80505010",
    "wardName": "Xã Khánh Bình",
    "districtId": 80505,
    "districtName": "Huyện An Phú",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80505011",
    "wardName": "Xã Phú Hữu",
    "districtId": 80505,
    "districtName": "Huyện An Phú",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80507012",
    "wardName": "Xã Tân An",
    "districtId": 80507,
    "districtName": "Thị xã Tân Châu",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80507013",
    "wardName": "Xã Châu Phong",
    "districtId": 80507,
    "districtName": "Thị xã Tân Châu",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80507014",
    "wardName": "Xã Vĩnh Xương",
    "districtId": 80507,
    "districtName": "Thị xã Tân Châu",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80507015",
    "wardName": "Phường Tân Châu",
    "districtId": 80507,
    "districtName": "Thị xã Tân Châu",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80507016",
    "wardName": "Phường Long Phú",
    "districtId": 80507,
    "districtName": "Thị xã Tân Châu",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80509017",
    "wardName": "Xã Phú Tân",
    "districtId": 80509,
    "districtName": "Huyện Phú Tân",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80509018",
    "wardName": "Xã Phú An",
    "districtId": 80509,
    "districtName": "Huyện Phú Tân",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80509019",
    "wardName": "Xã Bình Thạnh Đông",
    "districtId": 80509,
    "districtName": "Huyện Phú Tân",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80509020",
    "wardName": "Xã Chợ Vàm",
    "districtId": 80509,
    "districtName": "Huyện Phú Tân",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80509021",
    "wardName": "Xã Hoà Lạc",
    "districtId": 80509,
    "districtName": "Huyện Phú Tân",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80509022",
    "wardName": "Xã Phú Lâm",
    "districtId": 80509,
    "districtName": "Huyện Phú Tân",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80511023",
    "wardName": "Xã Châu Phú",
    "districtId": 80511,
    "districtName": "Huyện Châu Phú",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80511024",
    "wardName": "Xã Mỹ Đức",
    "districtId": 80511,
    "districtName": "Huyện Châu Phú",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80511025",
    "wardName": "Xã Vĩnh Thạnh Trung",
    "districtId": 80511,
    "districtName": "Huyện Châu Phú",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80511026",
    "wardName": "Xã Bình Mỹ",
    "districtId": 80511,
    "districtName": "Huyện Châu Phú",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80511027",
    "wardName": "Xã Thạnh Mỹ Tây",
    "districtId": 80511,
    "districtName": "Huyện Châu Phú",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80513028",
    "wardName": "Xã An Cư",
    "districtId": 80513,
    "districtName": "Thị xã Tịnh Biên",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80513029",
    "wardName": "Xã Núi Cấm",
    "districtId": 80513,
    "districtName": "Thị xã Tịnh Biên",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80513030",
    "wardName": "Phường Tịnh Biên",
    "districtId": 80513,
    "districtName": "Thị xã Tịnh Biên",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80513031",
    "wardName": "Phường Thới Sơn",
    "districtId": 80513,
    "districtName": "Thị xã Tịnh Biên",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80513032",
    "wardName": "Phường Chi Lăng",
    "districtId": 80513,
    "districtName": "Thị xã Tịnh Biên",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80515033",
    "wardName": "Xã Ba Chúc",
    "districtId": 80515,
    "districtName": "Huyện Tri Tôn",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80515034",
    "wardName": "Xã Tri Tôn",
    "districtId": 80515,
    "districtName": "Huyện Tri Tôn",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80515035",
    "wardName": "Xã Ô Lâm",
    "districtId": 80515,
    "districtName": "Huyện Tri Tôn",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80515036",
    "wardName": "Xã Cô Tô",
    "districtId": 80515,
    "districtName": "Huyện Tri Tôn",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80515037",
    "wardName": "Xã Vĩnh Gia",
    "districtId": 80515,
    "districtName": "Huyện Tri Tôn",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80519038",
    "wardName": "Xã An Châu",
    "districtId": 80519,
    "districtName": "Huyện Châu Thành",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80519039",
    "wardName": "Xã Bình Hoà",
    "districtId": 80519,
    "districtName": "Huyện Châu Thành",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80519040",
    "wardName": "Xã Cần Đăng",
    "districtId": 80519,
    "districtName": "Huyện Châu Thành",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80519041",
    "wardName": "Xã Vĩnh Hanh",
    "districtId": 80519,
    "districtName": "Huyện Châu Thành",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80519042",
    "wardName": "Xã Vĩnh An",
    "districtId": 80519,
    "districtName": "Huyện Châu Thành",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80517043",
    "wardName": "Xã Chợ Mới",
    "districtId": 80517,
    "districtName": "Huyện Chợ Mới",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80517044",
    "wardName": "Xã Cù Lao Giêng",
    "districtId": 80517,
    "districtName": "Huyện Chợ Mới",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80517045",
    "wardName": "Xã Hội An",
    "districtId": 80517,
    "districtName": "Huyện Chợ Mới",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80517046",
    "wardName": "Xã Long Điền",
    "districtId": 80517,
    "districtName": "Huyện Chợ Mới",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80517047",
    "wardName": "Xã Nhơn Mỹ",
    "districtId": 80517,
    "districtName": "Huyện Chợ Mới",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80517048",
    "wardName": "Xã Long Kiến",
    "districtId": 80517,
    "districtName": "Huyện Chợ Mới",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80521049",
    "wardName": "Xã Thoại Sơn",
    "districtId": 80521,
    "districtName": "Huyện Thoại Sơn",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80521050",
    "wardName": "Xã Óc Eo",
    "districtId": 80521,
    "districtName": "Huyện Thoại Sơn",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80521051",
    "wardName": "Xã Định Mỹ",
    "districtId": 80521,
    "districtName": "Huyện Thoại Sơn",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80521052",
    "wardName": "Xã Phú Hoà",
    "districtId": 80521,
    "districtName": "Huyện Thoại Sơn",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80521053",
    "wardName": "Xã Vĩnh Trạch",
    "districtId": 80521,
    "districtName": "Huyện Thoại Sơn",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "80521054",
    "wardName": "Xã Tây Phú",
    "districtId": 80521,
    "districtName": "Huyện Thoại Sơn",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81319055",
    "wardName": "Xã Vĩnh Bình",
    "districtId": 81319,
    "districtName": "Huyện Vĩnh Thuận",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81319056",
    "wardName": "Xã Vĩnh Thuận",
    "districtId": 81319,
    "districtName": "Huyện Vĩnh Thuận",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81319057",
    "wardName": "Xã Vĩnh Phong",
    "districtId": 81319,
    "districtName": "Huyện Vĩnh Thuận",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81327058",
    "wardName": "Xã Vĩnh Hoà",
    "districtId": 81327,
    "districtName": "Huyện U Minh Thượng",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81327059",
    "wardName": "Xã U Minh Thượng",
    "districtId": 81327,
    "districtName": "Huyện U Minh Thượng",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81317060",
    "wardName": "Xã Đông Hoà",
    "districtId": 81317,
    "districtName": "Huyện An Minh",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81317061",
    "wardName": "Xã Tân Thạnh",
    "districtId": 81317,
    "districtName": "Huyện An Minh",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81317062",
    "wardName": "Xã Đông Hưng",
    "districtId": 81317,
    "districtName": "Huyện An Minh",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81317063",
    "wardName": "Xã An Minh",
    "districtId": 81317,
    "districtName": "Huyện An Minh",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81317064",
    "wardName": "Xã Vân Khánh",
    "districtId": 81317,
    "districtName": "Huyện An Minh",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81315065",
    "wardName": "Xã Tây Yên",
    "districtId": 81315,
    "districtName": "Huyện An Biên",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81315066",
    "wardName": "Xã Đông Thái",
    "districtId": 81315,
    "districtName": "Huyện An Biên",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81315067",
    "wardName": "Xã An Biên",
    "districtId": 81315,
    "districtName": "Huyện An Biên",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81313068",
    "wardName": "Xã Định Hoà",
    "districtId": 81313,
    "districtName": "Huyện Gò Quao",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81313069",
    "wardName": "Xã Gò Quao",
    "districtId": 81313,
    "districtName": "Huyện Gò Quao",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81313070",
    "wardName": "Xã Vĩnh Hoà Hưng",
    "districtId": 81313,
    "districtName": "Huyện Gò Quao",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81313071",
    "wardName": "Xã Vĩnh Tuy",
    "districtId": 81313,
    "districtName": "Huyện Gò Quao",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81311072",
    "wardName": "Xã Giồng Riềng",
    "districtId": 81311,
    "districtName": "Huyện Giồng Riềng",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81311073",
    "wardName": "Xã Thạnh Hưng",
    "districtId": 81311,
    "districtName": "Huyện Giồng Riềng",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81311074",
    "wardName": "Xã Long Thạnh",
    "districtId": 81311,
    "districtName": "Huyện Giồng Riềng",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81311075",
    "wardName": "Xã Hoà Hưng",
    "districtId": 81311,
    "districtName": "Huyện Giồng Riềng",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81311076",
    "wardName": "Xã Ngọc Chúc",
    "districtId": 81311,
    "districtName": "Huyện Giồng Riềng",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81311077",
    "wardName": "Xã Hoà Thuận",
    "districtId": 81311,
    "districtName": "Huyện Giồng Riềng",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81307078",
    "wardName": "Xã Tân Hội",
    "districtId": 81307,
    "districtName": "Huyện Tân Hiệp",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81307079",
    "wardName": "Xã Tân Hiệp",
    "districtId": 81307,
    "districtName": "Huyện Tân Hiệp",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81307080",
    "wardName": "Xã Thạnh Đông",
    "districtId": 81307,
    "districtName": "Huyện Tân Hiệp",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81309081",
    "wardName": "Xã Thạnh Lộc",
    "districtId": 81309,
    "districtName": "Huyện Châu Thành",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81309082",
    "wardName": "Xã Châu Thành",
    "districtId": 81309,
    "districtName": "Huyện Châu Thành",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81309083",
    "wardName": "Xã Bình An",
    "districtId": 81309,
    "districtName": "Huyện Châu Thành",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81305084",
    "wardName": "Xã Hòn Đất",
    "districtId": 81305,
    "districtName": "Huyện Hòn Đất",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81305085",
    "wardName": "Xã Sơn Kiên",
    "districtId": 81305,
    "districtName": "Huyện Hòn Đất",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81305086",
    "wardName": "Xã Mỹ Thuận",
    "districtId": 81305,
    "districtName": "Huyện Hòn Đất",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81305087",
    "wardName": "Xã Bình Sơn",
    "districtId": 81305,
    "districtName": "Huyện Hòn Đất",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81305088",
    "wardName": "Xã Bình Giang",
    "districtId": 81305,
    "districtName": "Huyện Hòn Đất",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81304089",
    "wardName": "Xã Giang Thành",
    "districtId": 81304,
    "districtName": "Huyện Giang Thành",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81304090",
    "wardName": "Xã Vĩnh Điều",
    "districtId": 81304,
    "districtName": "Huyện Giang Thành",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81303091",
    "wardName": "Xã Hoà Điền",
    "districtId": 81303,
    "districtName": "Huyện Kiên Lương",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81303092",
    "wardName": "Xã Kiên Lương",
    "districtId": 81303,
    "districtName": "Huyện Kiên Lương",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81303093",
    "wardName": "Xã Sơn Hải",
    "districtId": 81303,
    "districtName": "Huyện Kiên Lương",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81303094",
    "wardName": "Xã Hòn Nghệ",
    "districtId": 81303,
    "districtName": "Huyện Kiên Lương",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81323095",
    "wardName": "Đặc khu Kiên Hải",
    "districtId": 81323,
    "districtName": "Huyện Kiên Hải",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81301096",
    "wardName": "Phường Vĩnh Thông",
    "districtId": 81301,
    "districtName": "Thành phố Rạch Giá",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81301097",
    "wardName": "Phường Rạch Giá",
    "districtId": 81301,
    "districtName": "Thành phố Rạch Giá",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81325098",
    "wardName": "Phường Hà Tiên",
    "districtId": 81325,
    "districtName": "Thành phố Hà Tiên",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81325099",
    "wardName": "Phường Tô Châu",
    "districtId": 81325,
    "districtName": "Thành phố Hà Tiên",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81325100",
    "wardName": "Xã Tiên Hải",
    "districtId": 81325,
    "districtName": "Thành phố Hà Tiên",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81321101",
    "wardName": "Đặc khu Phú Quốc",
    "districtId": 81321,
    "districtName": "Thành phố Phú Quốc",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81321102",
    "wardName": "Đặc khu Thổ Châu",
    "districtId": 81321,
    "districtName": "Thành phố Phú Quốc",
    "provinceId": 32,
    "provinceName": "Tỉnh An Giang"
  },
  {
    "wardId": "81519001",
    "wardName": "Phường Ninh Kiều",
    "districtId": 81519,
    "districtName": "Quận Ninh Kiều",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81519002",
    "wardName": "Phường Cái Khế",
    "districtId": 81519,
    "districtName": "Quận Ninh Kiều",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81519003",
    "wardName": "Phường Tân An",
    "districtId": 81519,
    "districtName": "Quận Ninh Kiều",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81519004",
    "wardName": "Phường An Bình",
    "districtId": 81519,
    "districtName": "Quận Ninh Kiều",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81521005",
    "wardName": "Phường Thới An Đông",
    "districtId": 81521,
    "districtName": "Quận Bình Thuỷ",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81521006",
    "wardName": "Phường Bình Thủy",
    "districtId": 81521,
    "districtName": "Quận Bình Thuỷ",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81521007",
    "wardName": "Phường Long Tuyền",
    "districtId": 81521,
    "districtName": "Quận Bình Thuỷ",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81523008",
    "wardName": "Phường Cái Răng",
    "districtId": 81523,
    "districtName": "Quận Cái Răng",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81523009",
    "wardName": "Phường Hưng Phú",
    "districtId": 81523,
    "districtName": "Quận Cái Răng",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81505010",
    "wardName": "Phường Ô Môn",
    "districtId": 81505,
    "districtName": "Quận Ô Môn",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81505011",
    "wardName": "Phường Thới Long",
    "districtId": 81505,
    "districtName": "Quận Ô Môn",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81505012",
    "wardName": "Phường Phước Thới",
    "districtId": 81505,
    "districtName": "Quận Ô Môn",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81503013",
    "wardName": "Phường Trung Nhứt",
    "districtId": 81503,
    "districtName": "Quận Thốt Nốt",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81503014",
    "wardName": "Phường Thốt Nốt",
    "districtId": 81503,
    "districtName": "Quận Thốt Nốt",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81503015",
    "wardName": "Phường Thuận Hưng",
    "districtId": 81503,
    "districtName": "Quận Thốt Nốt",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81503016",
    "wardName": "Phường Tân Lộc",
    "districtId": 81503,
    "districtName": "Quận Thốt Nốt",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81529017",
    "wardName": "Xã Phong Điền",
    "districtId": 81529,
    "districtName": "Huyện Phong Điền",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81529018",
    "wardName": "Xã Nhơn Ái",
    "districtId": 81529,
    "districtName": "Huyện Phong Điền",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81529019",
    "wardName": "Xã Trường Long",
    "districtId": 81529,
    "districtName": "Huyện Phong Điền",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81531020",
    "wardName": "Xã Thới Lai",
    "districtId": 81531,
    "districtName": "Huyện Thới Lai",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81531021",
    "wardName": "Xã Đông Thuận",
    "districtId": 81531,
    "districtName": "Huyện Thới Lai",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81531022",
    "wardName": "Xã Trường Xuân",
    "districtId": 81531,
    "districtName": "Huyện Thới Lai",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81531023",
    "wardName": "Xã Trường Thành",
    "districtId": 81531,
    "districtName": "Huyện Thới Lai",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81527024",
    "wardName": "Xã Cờ Đỏ",
    "districtId": 81527,
    "districtName": "Huyện Cờ Đỏ",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81527025",
    "wardName": "Xã Đông Hiệp",
    "districtId": 81527,
    "districtName": "Huyện Cờ Đỏ",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81527026",
    "wardName": "Xã Thạnh Phú",
    "districtId": 81527,
    "districtName": "Huyện Cờ Đỏ",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81527027",
    "wardName": "Xã Thới Hưng",
    "districtId": 81527,
    "districtName": "Huyện Cờ Đỏ",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81527028",
    "wardName": "Xã Trung Hưng",
    "districtId": 81527,
    "districtName": "Huyện Cờ Đỏ",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81525029",
    "wardName": "Xã Vĩnh Thạnh",
    "districtId": 81525,
    "districtName": "Huyện Vĩnh Thạnh",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81525030",
    "wardName": "Xã Vĩnh Trinh",
    "districtId": 81525,
    "districtName": "Huyện Vĩnh Thạnh",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81525031",
    "wardName": "Xã Thạnh An",
    "districtId": 81525,
    "districtName": "Huyện Vĩnh Thạnh",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81525032",
    "wardName": "Xã Thạnh Quới",
    "districtId": 81525,
    "districtName": "Huyện Vĩnh Thạnh",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81601033",
    "wardName": "Xã Hỏa Lựu",
    "districtId": 81601,
    "districtName": "Thành phố Vị Thanh",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81601034",
    "wardName": "Phường Vị Thanh",
    "districtId": 81601,
    "districtName": "Thành phố Vị Thanh",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81601035",
    "wardName": "Phường Vị Tân",
    "districtId": 81601,
    "districtName": "Thành phố Vị Thanh",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81609036",
    "wardName": "Xã Vị Thủy",
    "districtId": 81609,
    "districtName": "Huyện Vị Thủy",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81609037",
    "wardName": "Xã Vĩnh Thuận Đông",
    "districtId": 81609,
    "districtName": "Huyện Vị Thủy",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81609038",
    "wardName": "Xã Vị Thanh 1",
    "districtId": 81609,
    "districtName": "Huyện Vị Thủy",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81609039",
    "wardName": "Xã Vĩnh Tường",
    "districtId": 81609,
    "districtName": "Huyện Vị Thủy",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81611040",
    "wardName": "Xã Vĩnh Viễn",
    "districtId": 81611,
    "districtName": "Huyện Long Mỹ",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81611041",
    "wardName": "Xã Xà Phiên",
    "districtId": 81611,
    "districtName": "Huyện Long Mỹ",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81611042",
    "wardName": "Xã Lương Tâm",
    "districtId": 81611,
    "districtName": "Huyện Long Mỹ",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81612043",
    "wardName": "Phường Long Bình",
    "districtId": 81612,
    "districtName": "Thị xã Long Mỹ",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81612044",
    "wardName": "Phường Long Mỹ",
    "districtId": 81612,
    "districtName": "Thị xã Long Mỹ",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81612045",
    "wardName": "Phường Long Phú 1",
    "districtId": 81612,
    "districtName": "Thị xã Long Mỹ",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81603046",
    "wardName": "Xã Thạnh Xuân",
    "districtId": 81603,
    "districtName": "Huyện Châu Thành A",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81603047",
    "wardName": "Xã Tân Hoà",
    "districtId": 81603,
    "districtName": "Huyện Châu Thành A",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81603048",
    "wardName": "Xã Trường Long Tây",
    "districtId": 81603,
    "districtName": "Huyện Châu Thành A",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81605049",
    "wardName": "Xã Châu Thành",
    "districtId": 81605,
    "districtName": "Huyện Châu Thành",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81605050",
    "wardName": "Xã Đông Phước",
    "districtId": 81605,
    "districtName": "Huyện Châu Thành",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81605051",
    "wardName": "Xã Phú Hữu",
    "districtId": 81605,
    "districtName": "Huyện Châu Thành",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81607052",
    "wardName": "Phường Đại Thành",
    "districtId": 81607,
    "districtName": "Thành phố Ngã Bảy",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81607053",
    "wardName": "Phường Ngã Bảy",
    "districtId": 81607,
    "districtName": "Thành phố Ngã Bảy",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81608054",
    "wardName": "Xã Tân Bình",
    "districtId": 81608,
    "districtName": "Huyện Phụng Hiệp",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81608055",
    "wardName": "Xã Hoà An",
    "districtId": 81608,
    "districtName": "Huyện Phụng Hiệp",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81608056",
    "wardName": "Xã Phương Bình",
    "districtId": 81608,
    "districtName": "Huyện Phụng Hiệp",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81608057",
    "wardName": "Xã Tân Phước Hưng",
    "districtId": 81608,
    "districtName": "Huyện Phụng Hiệp",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81608058",
    "wardName": "Xã Hiệp Hưng",
    "districtId": 81608,
    "districtName": "Huyện Phụng Hiệp",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81608059",
    "wardName": "Xã Phụng Hiệp",
    "districtId": 81608,
    "districtName": "Huyện Phụng Hiệp",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81608060",
    "wardName": "Xã Thạnh Hoà",
    "districtId": 81608,
    "districtName": "Huyện Phụng Hiệp",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81901061",
    "wardName": "Phường Phú Lợi",
    "districtId": 81901,
    "districtName": "Thành phố Sóc Trăng",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81901062",
    "wardName": "Phường Sóc Trăng",
    "districtId": 81901,
    "districtName": "Thành phố Sóc Trăng",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81901063",
    "wardName": "Phường Mỹ Xuyên",
    "districtId": 81901,
    "districtName": "Thành phố Sóc Trăng",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81909064",
    "wardName": "Xã Hoà Tú",
    "districtId": 81909,
    "districtName": "Huyện Mỹ Xuyên",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81909065",
    "wardName": "Xã Gia Hoà",
    "districtId": 81909,
    "districtName": "Huyện Mỹ Xuyên",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81909066",
    "wardName": "Xã Nhu Gia",
    "districtId": 81909,
    "districtName": "Huyện Mỹ Xuyên",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81909067",
    "wardName": "Xã Ngọc Tố",
    "districtId": 81909,
    "districtName": "Huyện Mỹ Xuyên",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81905068",
    "wardName": "Xã Trường Khánh",
    "districtId": 81905,
    "districtName": "Huyện Long Phú",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81905069",
    "wardName": "Xã Đại Ngãi",
    "districtId": 81905,
    "districtName": "Huyện Long Phú",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81905070",
    "wardName": "Xã Tân Thạnh",
    "districtId": 81905,
    "districtName": "Huyện Long Phú",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81905071",
    "wardName": "Xã Long Phú",
    "districtId": 81905,
    "districtName": "Huyện Long Phú",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81903072",
    "wardName": "Xã Nhơn Mỹ",
    "districtId": 81903,
    "districtName": "Huyện Kế Sách",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81903073",
    "wardName": "Xã Phong Nẫm",
    "districtId": 81903,
    "districtName": "Huyện Kế Sách",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81903074",
    "wardName": "Xã An Lạc Thôn",
    "districtId": 81903,
    "districtName": "Huyện Kế Sách",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81903075",
    "wardName": "Xã Kế Sách",
    "districtId": 81903,
    "districtName": "Huyện Kế Sách",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81903076",
    "wardName": "Xã Thới An Hội",
    "districtId": 81903,
    "districtName": "Huyện Kế Sách",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81903077",
    "wardName": "Xã Đại Hải",
    "districtId": 81903,
    "districtName": "Huyện Kế Sách",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81915078",
    "wardName": "Xã Phú Tâm",
    "districtId": 81915,
    "districtName": "Huyện Châu Thành",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81915079",
    "wardName": "Xã An Ninh",
    "districtId": 81915,
    "districtName": "Huyện Châu Thành",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81915080",
    "wardName": "Xã Thuận Hoà",
    "districtId": 81915,
    "districtName": "Huyện Châu Thành",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81915081",
    "wardName": "Xã Hồ Đắc Kiện",
    "districtId": 81915,
    "districtName": "Huyện Châu Thành",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81907082",
    "wardName": "Xã Mỹ Tú",
    "districtId": 81907,
    "districtName": "Huyện Mỹ Tú",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81907083",
    "wardName": "Xã Long Hưng",
    "districtId": 81907,
    "districtName": "Huyện Mỹ Tú",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81907084",
    "wardName": "Xã Mỹ Phước",
    "districtId": 81907,
    "districtName": "Huyện Mỹ Tú",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81907085",
    "wardName": "Xã Mỹ Hương",
    "districtId": 81907,
    "districtName": "Huyện Mỹ Tú",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81913086",
    "wardName": "Xã Vĩnh Hải",
    "districtId": 81913,
    "districtName": "Thị xã Vĩnh Châu",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81913087",
    "wardName": "Xã Lai Hoà",
    "districtId": 81913,
    "districtName": "Thị xã Vĩnh Châu",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81913088",
    "wardName": "Phường Vĩnh Phước",
    "districtId": 81913,
    "districtName": "Thị xã Vĩnh Châu",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81913089",
    "wardName": "Phường Vĩnh Châu",
    "districtId": 81913,
    "districtName": "Thị xã Vĩnh Châu",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81913090",
    "wardName": "Phường Khánh Hoà",
    "districtId": 81913,
    "districtName": "Thị xã Vĩnh Châu",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81912091",
    "wardName": "Xã Tân Long",
    "districtId": 81912,
    "districtName": "Thị xã Ngã Năm",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81912092",
    "wardName": "Phường Ngã Năm",
    "districtId": 81912,
    "districtName": "Thị xã Ngã Năm",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81912093",
    "wardName": "Phường Mỹ Quới",
    "districtId": 81912,
    "districtName": "Thị xã Ngã Năm",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81911094",
    "wardName": "Xã Phú Lộc",
    "districtId": 81911,
    "districtName": "Huyện Thạnh Trị",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81911095",
    "wardName": "Xã Vĩnh Lợi",
    "districtId": 81911,
    "districtName": "Huyện Thạnh Trị",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81911096",
    "wardName": "Xã Lâm Tân",
    "districtId": 81911,
    "districtName": "Huyện Thạnh Trị",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81917097",
    "wardName": "Xã Thạnh Thới An",
    "districtId": 81917,
    "districtName": "Huyện Trần Đề",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81917098",
    "wardName": "Xã Tài Văn",
    "districtId": 81917,
    "districtName": "Huyện Trần Đề",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81917099",
    "wardName": "Xã Liêu Tú",
    "districtId": 81917,
    "districtName": "Huyện Trần Đề",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81917100",
    "wardName": "Xã Lịch Hội Thượng",
    "districtId": 81917,
    "districtName": "Huyện Trần Đề",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81917101",
    "wardName": "Xã Trần Đề",
    "districtId": 81917,
    "districtName": "Huyện Trần Đề",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81906102",
    "wardName": "Xã An Thạnh",
    "districtId": 81906,
    "districtName": "Huyện Cù Lao Dung",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "81906103",
    "wardName": "Xã Cù Lao Dung",
    "districtId": 81906,
    "districtName": "Huyện Cù Lao Dung",
    "provinceId": 33,
    "provinceName": "Tp Cần Thơ"
  },
  {
    "wardId": "82301001",
    "wardName": "Phường An Xuyên",
    "districtId": 82301,
    "districtName": "Thành phố Cà Mau",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82301002",
    "wardName": "Phường Lý Văn Lâm",
    "districtId": 82301,
    "districtName": "Thành phố Cà Mau",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82301003",
    "wardName": "Phường Tân Thành",
    "districtId": 82301,
    "districtName": "Thành phố Cà Mau",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82301004",
    "wardName": "Phường Hòa Thành",
    "districtId": 82301,
    "districtName": "Thành phố Cà Mau",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82311005",
    "wardName": "Xã Tân Thuận",
    "districtId": 82311,
    "districtName": "Huyện Đầm Dơi",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82311006",
    "wardName": "Xã Tân Tiến",
    "districtId": 82311,
    "districtName": "Huyện Đầm Dơi",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82311007",
    "wardName": "Xã Tạ An Khương",
    "districtId": 82311,
    "districtName": "Huyện Đầm Dơi",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82311008",
    "wardName": "Xã Trần Phán",
    "districtId": 82311,
    "districtName": "Huyện Đầm Dơi",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82311009",
    "wardName": "Xã Thanh Tùng",
    "districtId": 82311,
    "districtName": "Huyện Đầm Dơi",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82311010",
    "wardName": "Xã Đầm Dơi",
    "districtId": 82311,
    "districtName": "Huyện Đầm Dơi",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82311011",
    "wardName": "Xã Quách Phẩm",
    "districtId": 82311,
    "districtName": "Huyện Đầm Dơi",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82305012",
    "wardName": "Xã U Minh",
    "districtId": 82305,
    "districtName": "Huyện U Minh",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82305013",
    "wardName": "Xã Nguyễn Phích",
    "districtId": 82305,
    "districtName": "Huyện U Minh",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82305014",
    "wardName": "Xã Khánh Lâm",
    "districtId": 82305,
    "districtName": "Huyện U Minh",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82305015",
    "wardName": "Xã Khánh An",
    "districtId": 82305,
    "districtName": "Huyện U Minh",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82313016",
    "wardName": "Xã Phan Ngọc Hiển",
    "districtId": 82313,
    "districtName": "Huyện Ngọc Hiển",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82313017",
    "wardName": "Xã Đất Mũi",
    "districtId": 82313,
    "districtName": "Huyện Ngọc Hiển",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82313018",
    "wardName": "Xã Tân Ân",
    "districtId": 82313,
    "districtName": "Huyện Ngọc Hiển",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82307019",
    "wardName": "Xã Khánh Bình",
    "districtId": 82307,
    "districtName": "Huyện Trần Văn Thời",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82307020",
    "wardName": "Xã Đá Bạc",
    "districtId": 82307,
    "districtName": "Huyện Trần Văn Thời",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82307021",
    "wardName": "Xã Khánh Hưng",
    "districtId": 82307,
    "districtName": "Huyện Trần Văn Thời",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82307022",
    "wardName": "Xã Sông Đốc",
    "districtId": 82307,
    "districtName": "Huyện Trần Văn Thời",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82307023",
    "wardName": "Xã Trần Văn Thời",
    "districtId": 82307,
    "districtName": "Huyện Trần Văn Thời",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82303024",
    "wardName": "Xã Thới Bình",
    "districtId": 82303,
    "districtName": "Huyện Thới Bình",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82303025",
    "wardName": "Xã Trí Phải",
    "districtId": 82303,
    "districtName": "Huyện Thới Bình",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82303026",
    "wardName": "Xã Tân Lộc",
    "districtId": 82303,
    "districtName": "Huyện Thới Bình",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82303027",
    "wardName": "Xã Hồ Thị Kỷ",
    "districtId": 82303,
    "districtName": "Huyện Thới Bình",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82303028",
    "wardName": "Xã Biển Bạch",
    "districtId": 82303,
    "districtName": "Huyện Thới Bình",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82312029",
    "wardName": "Xã Đất Mới",
    "districtId": 82312,
    "districtName": "Huyện Năm Căn",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82312030",
    "wardName": "Xã Năm Căn",
    "districtId": 82312,
    "districtName": "Huyện Năm Căn",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82312031",
    "wardName": "Xã Tam Giang",
    "districtId": 82312,
    "districtName": "Huyện Năm Căn",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82308032",
    "wardName": "Xã Cái Đôi Vàm",
    "districtId": 82308,
    "districtName": "Huyện Phú Tân",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82308033",
    "wardName": "Xã Nguyễn Việt Khái",
    "districtId": 82308,
    "districtName": "Huyện Phú Tân",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82308034",
    "wardName": "Xã Phú Tân",
    "districtId": 82308,
    "districtName": "Huyện Phú Tân",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82308035",
    "wardName": "Xã Phú Mỹ",
    "districtId": 82308,
    "districtName": "Huyện Phú Tân",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82309036",
    "wardName": "Xã Lương Thế Trân",
    "districtId": 82309,
    "districtName": "Huyện Cái Nước",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82309037",
    "wardName": "Xã Tân Hưng",
    "districtId": 82309,
    "districtName": "Huyện Cái Nước",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82309038",
    "wardName": "Xã Hưng Mỹ",
    "districtId": 82309,
    "districtName": "Huyện Cái Nước",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82309039",
    "wardName": "Xã Cái Nước",
    "districtId": 82309,
    "districtName": "Huyện Cái Nước",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82101040",
    "wardName": "Phường Bạc Liêu",
    "districtId": 82101,
    "districtName": "Thành phố Bạc Liêu",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82101041",
    "wardName": "Phường Vĩnh Trạch",
    "districtId": 82101,
    "districtName": "Thành phố Bạc Liêu",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82101042",
    "wardName": "Phường Hiệp Thành",
    "districtId": 82101,
    "districtName": "Thành phố Bạc Liêu",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82107043",
    "wardName": "Phường Giá Rai",
    "districtId": 82107,
    "districtName": "Thị xã Giá Rai",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82107044",
    "wardName": "Phường Láng Tròn",
    "districtId": 82107,
    "districtName": "Thị xã Giá Rai",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82107045",
    "wardName": "Xã Phong Thạnh",
    "districtId": 82107,
    "districtName": "Thị xã Giá Rai",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82103046",
    "wardName": "Xã Hồng Dân",
    "districtId": 82103,
    "districtName": "Huyện Hồng Dân",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82103047",
    "wardName": "Xã Vĩnh Lộc",
    "districtId": 82103,
    "districtName": "Huyện Hồng Dân",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82103048",
    "wardName": "Xã Ninh Thạnh Lợi",
    "districtId": 82103,
    "districtName": "Huyện Hồng Dân",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82103049",
    "wardName": "Xã Ninh Quới",
    "districtId": 82103,
    "districtName": "Huyện Hồng Dân",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82111050",
    "wardName": "Xã Gành Hào",
    "districtId": 82111,
    "districtName": "Huyện Đông Hải",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82111051",
    "wardName": "Xã Định Thành",
    "districtId": 82111,
    "districtName": "Huyện Đông Hải",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82111052",
    "wardName": "Xã An Trạch",
    "districtId": 82111,
    "districtName": "Huyện Đông Hải",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82111053",
    "wardName": "Xã Long Điền",
    "districtId": 82111,
    "districtName": "Huyện Đông Hải",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82111054",
    "wardName": "Xã Đông Hải",
    "districtId": 82111,
    "districtName": "Huyện Đông Hải",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82106055",
    "wardName": "Xã Hoà Bình",
    "districtId": 82106,
    "districtName": "Huyện Hoà Bình",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82106056",
    "wardName": "Xã Vĩnh Mỹ",
    "districtId": 82106,
    "districtName": "Huyện Hoà Bình",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82106057",
    "wardName": "Xã Vĩnh Hậu",
    "districtId": 82106,
    "districtName": "Huyện Hoà Bình",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82109058",
    "wardName": "Xã Phước Long",
    "districtId": 82109,
    "districtName": "Huyện Phước Long",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82109059",
    "wardName": "Xã Vĩnh Phước",
    "districtId": 82109,
    "districtName": "Huyện Phước Long",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82109060",
    "wardName": "Xã Phong Hiệp",
    "districtId": 82109,
    "districtName": "Huyện Phước Long",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82109061",
    "wardName": "Xã Vĩnh Thanh",
    "districtId": 82109,
    "districtName": "Huyện Phước Long",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82105062",
    "wardName": "Xã Vĩnh Lợi",
    "districtId": 82105,
    "districtName": "Huyện Vĩnh Lợi",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82105063",
    "wardName": "Xã Hưng Hội",
    "districtId": 82105,
    "districtName": "Huyện Vĩnh Lợi",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  },
  {
    "wardId": "82105064",
    "wardName": "Xã Châu Thới",
    "districtId": 82105,
    "districtName": "Huyện Vĩnh Lợi",
    "provinceId": 34,
    "provinceName": "Tỉnh Cà Mau"
  }
] as const satisfies readonly WardDistrictDataInput[];

export const WARD_DISTRICT_DATA: ReadonlyArray<WardDistrictDataInput> = rawData.map((item) => ({
  ...item,
  provinceId: asBusinessId(
    typeof item.provinceId === 'number'
      ? item.provinceId.toString().padStart(2, '0')
      : item.provinceId
  ),
}));

export const STATISTICS = {
  totalWards: 3321,
  totalDistricts: 696,
  totalProvinces: 34,
  generatedAt: '2025-10-29T07:17:58.618Z'
};
