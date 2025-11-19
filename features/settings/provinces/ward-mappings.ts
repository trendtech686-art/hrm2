/**
 * Ward Mapping Table (2-level ↔ 3-level)
 * Auto-generated from file2.xlsb - Sheet: DIA DANH MOI
 * Date: 2025-10-29T18:22:29.830685
 * Total: 3280 mappings
 */

import { asBusinessId, type BusinessId } from '@/lib/id-types';

export type WardMapping = {
  newWardId: string;      // ID xã mới (2-level) - Luật 2025
  newWardName: string;    // Tên xã mới
  provinceId: BusinessId; // Mã tỉnh (format 2 chữ số)
  provinceName: string;   // Tên tỉnh
  oldWardIds: string[];   // IDs xã cũ (3-level) - Legacy
  oldWardNames: string[]; // Tên xã cũ
};

type WardMappingSeed = {
  newWardId: string;
  newWardName: string;
  provinceId: string;
  provinceName: string;
  oldWardIds: string[];
  oldWardNames: string[];
};

const rawData = [
  {
    "newWardId": "81315067",
    "newWardName": "An Biên",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Thứ Ba",
      "Xã Đông Yên",
      "Xã Hưng Yên"
    ]
  },
  {
    "newWardId": "80519038",
    "newWardName": "An Châu",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30589",
      "30613",
      "30625"
    ],
    "oldWardNames": [
      "Thị trấn An Châu",
      "Xã Hòa Bình Thạnh",
      "Xã Vĩnh Thành"
    ]
  },
  {
    "newWardId": "80513028",
    "newWardName": "An Cư",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30523",
      "30532",
      "30526"
    ],
    "oldWardNames": [
      "Xã Văn Giáo",
      "Xã Vĩnh Trung",
      "Xã An Cư"
    ]
  },
  {
    "newWardId": "81317063",
    "newWardName": "An Minh",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Thứ Mười Một",
      "Xã Đông Hưng",
      "Xã Đông Hưng B"
    ]
  },
  {
    "newWardId": "80505007",
    "newWardName": "An Phú",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30337",
      "30370",
      "30355",
      "30358"
    ],
    "oldWardNames": [
      "Thị trấn An Phú",
      "Xã Vĩnh Hội Đông",
      "Xã Phú Hội",
      "Xã Phước Hưng"
    ]
  },
  {
    "newWardId": "80515033",
    "newWardName": "Ba Chúc",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30547",
      "30550",
      "30553"
    ],
    "oldWardNames": [
      "Thị trấn Ba Chúc",
      "Xã Lạc Quới",
      "Xã Lê Trì"
    ]
  },
  {
    "newWardId": "81309083",
    "newWardName": "Bình An",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình An",
      "Xã Vĩnh Hòa Hiệp",
      "Xã Vĩnh Hòa Phú"
    ]
  },
  {
    "newWardId": "80501003",
    "newWardName": "Bình Đức",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30292",
      "30289",
      "30310"
    ],
    "oldWardNames": [
      "Phường Bình Khánh",
      "Phường Bình Đức",
      "Xã Mỹ Khánh"
    ]
  },
  {
    "newWardId": "81305088",
    "newWardName": "Bình Giang",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình Giang"
    ]
  },
  {
    "newWardId": "80519039",
    "newWardName": "Bình Hòa",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30601",
      "30592",
      "30607"
    ],
    "oldWardNames": [
      "Xã Bình Thạnh",
      "Xã An Hòa",
      "Xã Bình Hòa"
    ]
  },
  {
    "newWardId": "80511026",
    "newWardName": "Bình Mỹ",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30490",
      "30499",
      "30487"
    ],
    "oldWardNames": [
      "Xã Bình Thủy",
      "Xã Bình Chánh",
      "Xã Bình Mỹ"
    ]
  },
  {
    "newWardId": "81305087",
    "newWardName": "Bình Sơn",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình Sơn"
    ]
  },
  {
    "newWardId": "80509019",
    "newWardName": "Bình Thạnh Đông",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30442",
      "30445",
      "30454"
    ],
    "oldWardNames": [
      "Xã Hiệp Xương",
      "Xã Phú Bình",
      "Xã Bình Thạnh Đông"
    ]
  },
  {
    "newWardId": "80519040",
    "newWardName": "Cần Đăng",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30616",
      "30595"
    ],
    "oldWardNames": [
      "Xã Vĩnh Lợi",
      "Xã Cần Đăng"
    ]
  },
  {
    "newWardId": "80503005",
    "newWardName": "Châu Đốc",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30319",
      "30316",
      "30322",
      "30334"
    ],
    "oldWardNames": [
      "Phường Vĩnh Nguơn",
      "Phường Châu Phú A",
      "Phường Châu Phú B",
      "Phường Vĩnh Mỹ",
      "Xã Vĩnh Châu"
    ]
  },
  {
    "newWardId": "80507013",
    "newWardName": "Châu Phong",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30400",
      "30403",
      "30397"
    ],
    "oldWardNames": [
      "Xã Phú Vĩnh",
      "Xã Lê Chánh",
      "Xã Châu Phong"
    ]
  },
  {
    "newWardId": "80511023",
    "newWardName": "Châu Phú",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30463",
      "30484",
      "30496"
    ],
    "oldWardNames": [
      "Thị trấn Cái Dầu",
      "Xã Bình Long",
      "Xã Bình Phú"
    ]
  },
  {
    "newWardId": "81309082",
    "newWardName": "Châu Thành",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Minh Lương",
      "Xã Minh Hòa",
      "Xã Giục Tượng"
    ]
  },
  {
    "newWardId": "80513032",
    "newWardName": "Chi Lăng",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30508",
      "30505",
      "30535"
    ],
    "oldWardNames": [
      "Phường Núi Voi",
      "Phường Chi Lăng",
      "Xã Tân Lợi"
    ]
  },
  {
    "newWardId": "80517043",
    "newWardName": "Chợ Mới",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30628",
      "30634",
      "30649"
    ],
    "oldWardNames": [
      "Thị trấn Chợ Mới",
      "Xã Kiến An",
      "Xã Kiến Thành"
    ]
  },
  {
    "newWardId": "80509020",
    "newWardName": "Chợ Vàm",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30409",
      "30427",
      "30433"
    ],
    "oldWardNames": [
      "Thị trấn Chợ Vàm",
      "Xã Phú Thạnh",
      "Xã Phú Thành"
    ]
  },
  {
    "newWardId": "80515036",
    "newWardName": "Cô Tô",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30580",
      "30571",
      "30583"
    ],
    "oldWardNames": [
      "Thị trấn Cô Tô",
      "Xã Tà Đảnh",
      "Xã Tân Tuyến"
    ]
  },
  {
    "newWardId": "80517044",
    "newWardName": "Cù Lao Giêng",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30643",
      "30652",
      "30667"
    ],
    "oldWardNames": [
      "Xã Tấn Mỹ",
      "Xã Mỹ Hiệp",
      "Xã Bình Phước Xuân"
    ]
  },
  {
    "newWardId": "81313068",
    "newWardName": "Định Hòa",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thới Quản",
      "Xã Thủy Liễu",
      "Xã Định Hòa"
    ]
  },
  {
    "newWardId": "80521051",
    "newWardName": "Định Mỹ",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30694",
      "30709",
      "30706"
    ],
    "oldWardNames": [
      "Xã Vĩnh Phú",
      "Xã Định Thành",
      "Xã Định Mỹ"
    ]
  },
  {
    "newWardId": "81317060",
    "newWardName": "Đông Hòa",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đông Thạnh",
      "Xã Đông Hòa"
    ]
  },
  {
    "newWardId": "81317062",
    "newWardName": "Đông Hưng",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vân Khánh Đông",
      "Xã Đông Hưng A"
    ]
  },
  {
    "newWardId": "81315066",
    "newWardName": "Đông Thái",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nam Thái",
      "Xã Nam Thái A",
      "Xã Đông Thái"
    ]
  },
  {
    "newWardId": "81304089",
    "newWardName": "Giang Thành",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Khánh Hòa",
      "Xã Phú Lợi",
      "Xã Phú Mỹ"
    ]
  },
  {
    "newWardId": "81311072",
    "newWardName": "Giồng Riềng",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Giồng Riềng",
      "Xã Bàn Tân Định",
      "Xã Thạnh Hòa",
      "Xã Bàn Thạch",
      "Xã Thạnh Bình"
    ]
  },
  {
    "newWardId": "81313069",
    "newWardName": "Gò Quao",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Gò Quao",
      "Xã Vĩnh Phước B",
      "Xã Định An"
    ]
  },
  {
    "newWardId": "81325098",
    "newWardName": "Hà Tiên",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Pháo Đài",
      "Phường Bình San",
      "Phường Mỹ Đức",
      "Phường Đông Hồ"
    ]
  },
  {
    "newWardId": "81303091",
    "newWardName": "Hòa Điền",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Kiên Bình",
      "Xã Hòa Điền"
    ]
  },
  {
    "newWardId": "81311075",
    "newWardName": "Hòa Hưng",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30679"
    ],
    "oldWardNames": [
      "Xã Hòa An",
      "Xã Hòa Lợi",
      "Xã Hòa Hưng"
    ]
  },
  {
    "newWardId": "80509021",
    "newWardName": "Hòa Lạc",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30424"
    ],
    "oldWardNames": [
      "Xã Phú Hiệp",
      "Xã Hòa Lạc"
    ]
  },
  {
    "newWardId": "81311077",
    "newWardName": "Hòa Thuận",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ngọc Hòa",
      "Xã Hòa Thuận"
    ]
  },
  {
    "newWardId": "81305084",
    "newWardName": "Hòn Đất",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Hòn Đất",
      "Xã Lình Huỳnh",
      "Xã Thổ Sơn",
      "Xã Nam Thái Sơn"
    ]
  },
  {
    "newWardId": "81303094",
    "newWardName": "Hòn Nghệ",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hòn Nghệ"
    ]
  },
  {
    "newWardId": "80517045",
    "newWardName": "Hội An",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30673",
      "30679",
      "30676"
    ],
    "oldWardNames": [
      "Thị trấn Hội An",
      "Xã Hòa An",
      "Xã Hòa Bình"
    ]
  },
  {
    "newWardId": "80505010",
    "newWardName": "Khánh Bình",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30341",
      "30340",
      "30343"
    ],
    "oldWardNames": [
      "Thị trấn Long Bình",
      "Xã Khánh An",
      "Xã Khánh Bình"
    ]
  },
  {
    "newWardId": "81303092",
    "newWardName": "Kiên Lương",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Kiên Lương",
      "Xã Bình An",
      "Xã Bình Trị"
    ]
  },
  {
    "newWardId": "80517046",
    "newWardName": "Long Điền",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30631",
      "30640",
      "30646"
    ],
    "oldWardNames": [
      "Thị trấn Mỹ Luông",
      "Xã Long Điền A",
      "Xã Long Điền B"
    ]
  },
  {
    "newWardId": "80517048",
    "newWardName": "Long Kiến",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30670",
      "30655",
      "30664"
    ],
    "oldWardNames": [
      "Xã An Thạnh Trung",
      "Xã Mỹ An",
      "Xã Long Kiến"
    ]
  },
  {
    "newWardId": "80507016",
    "newWardName": "Long Phú",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30377",
      "30378",
      "30394"
    ],
    "oldWardNames": [
      "Phường Long Hưng",
      "Phường Long Châu",
      "Phường Long Phú"
    ]
  },
  {
    "newWardId": "81311074",
    "newWardName": "Long Thạnh",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30694"
    ],
    "oldWardNames": [
      "Xã Vĩnh Phú",
      "Xã Vĩnh Thạnh",
      "Xã Long Thạnh"
    ]
  },
  {
    "newWardId": "80501002",
    "newWardName": "Long Xuyên",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30280",
      "30283",
      "30286",
      "30295",
      "30298",
      "30307"
    ],
    "oldWardNames": [
      "Phường Mỹ Bình",
      "Phường Mỹ Long",
      "Phường Mỹ Xuyên",
      "Phường Mỹ Phước",
      "Phường Mỹ Quý",
      "Phường Mỹ Hòa"
    ]
  },
  {
    "newWardId": "80511024",
    "newWardName": "Mỹ Đức",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30466",
      "30469"
    ],
    "oldWardNames": [
      "Xã Khánh Hòa",
      "Xã Mỹ Đức"
    ]
  },
  {
    "newWardId": "80501001",
    "newWardName": "Mỹ Hòa Hưng",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Mỹ Hòa Hưng"
    ]
  },
  {
    "newWardId": "80501004",
    "newWardName": "Mỹ Thới",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30304",
      "30301"
    ],
    "oldWardNames": [
      "Phường Mỹ Thạnh",
      "Phường Mỹ Thới"
    ]
  },
  {
    "newWardId": "81305086",
    "newWardName": "Mỹ Thuận",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Sóc Sơn",
      "Xã Mỹ Hiệp Sơn",
      "Xã Mỹ Phước",
      "Xã Mỹ Thuận"
    ]
  },
  {
    "newWardId": "81311076",
    "newWardName": "Ngọc Chúc",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ngọc Thuận",
      "Xã Ngọc Thành",
      "Xã Ngọc Chúc"
    ]
  },
  {
    "newWardId": "80505009",
    "newWardName": "Nhơn Hội",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30346",
      "30349",
      "30358",
      "30355"
    ],
    "oldWardNames": [
      "Xã Quốc Thái",
      "Xã Nhơn Hội",
      "Xã Phước Hưng",
      "Xã Phú Hội"
    ]
  },
  {
    "newWardId": "80517047",
    "newWardName": "Nhơn Mỹ",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30637",
      "30661",
      "30658"
    ],
    "oldWardNames": [
      "Xã Mỹ Hội Đông",
      "Xã Long Giang",
      "Xã Nhơn Mỹ"
    ]
  },
  {
    "newWardId": "80513029",
    "newWardName": "Núi Cấm",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30541",
      "30538"
    ],
    "oldWardNames": [
      "Xã Tân Lập",
      "Xã An Hảo"
    ]
  },
  {
    "newWardId": "80521050",
    "newWardName": "Óc Eo",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30727",
      "30715"
    ],
    "oldWardNames": [
      "Thị trấn Óc Eo",
      "Xã Vọng Thê",
      "Xã Vọng Đông"
    ]
  },
  {
    "newWardId": "80515035",
    "newWardName": "Ô Lâm",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30577",
      "30565",
      "30586"
    ],
    "oldWardNames": [
      "Xã An Tức",
      "Xã Lương Phi",
      "Xã Ô Lâm"
    ]
  },
  {
    "newWardId": "80509018",
    "newWardName": "Phú An",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30448",
      "30439",
      "30436"
    ],
    "oldWardNames": [
      "Xã Phú Thọ",
      "Xã Phú Xuân",
      "Xã Phú An"
    ]
  },
  {
    "newWardId": "80521052",
    "newWardName": "Phú Hòa",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30700",
      "30703"
    ],
    "oldWardNames": [
      "Thị trấn Phú Hòa",
      "Xã Phú Thuận",
      "Xã Vĩnh Chánh"
    ]
  },
  {
    "newWardId": "80505011",
    "newWardName": "Phú Hữu",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30352",
      "30361",
      "30358"
    ],
    "oldWardNames": [
      "Xã Phú Hữu",
      "Xã Vĩnh Lộc",
      "Xã Phước Hưng"
    ]
  },
  {
    "newWardId": "80509022",
    "newWardName": "Phú Lâm",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30418",
      "30421"
    ],
    "oldWardNames": [
      "Xã Long Hòa",
      "Xã Phú Long",
      "Xã Phú Lâm"
    ]
  },
  {
    "newWardId": "80509017",
    "newWardName": "Phú Tân",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30406",
      "30457",
      "30460",
      "30451"
    ],
    "oldWardNames": [
      "Thị trấn Phú Mỹ",
      "Xã Tân Hòa",
      "Xã Tân Trung",
      "Xã Phú Hưng"
    ]
  },
  {
    "newWardId": "81301097",
    "newWardName": "Rạch Giá",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Vĩnh Quang",
      "Phường Vĩnh Thanh",
      "Phường Vĩnh Thanh Vân",
      "Phường Vĩnh Lạc",
      "Phường An Hòa",
      "Phường Vĩnh Hiệp",
      "Phường An Bình",
      "Phường Rạch Sỏi",
      "Phường Vĩnh Lợi"
    ]
  },
  {
    "newWardId": "81303093",
    "newWardName": "Sơn Hải",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Sơn Hải"
    ]
  },
  {
    "newWardId": "81305085",
    "newWardName": "Sơn Kiên",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Sơn Bình",
      "Xã Mỹ Thái",
      "Xã Sơn Kiên"
    ]
  },
  {
    "newWardId": "80507012",
    "newWardName": "Tân An",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30388",
      "30387",
      "30391"
    ],
    "oldWardNames": [
      "Xã Tân An",
      "Xã Tân Thạnh",
      "Xã Long An"
    ]
  },
  {
    "newWardId": "80507015",
    "newWardName": "Tân Châu",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30376",
      "30412"
    ],
    "oldWardNames": [
      "Phường Long Thạnh",
      "Phường Long Sơn"
    ]
  },
  {
    "newWardId": "81307079",
    "newWardName": "Tân Hiệp",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Tân Hiệp",
      "Xã Tân Hiệp B",
      "Xã Thạnh Đông B",
      "Xã Thạnh Đông"
    ]
  },
  {
    "newWardId": "81307078",
    "newWardName": "Tân Hội",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30457",
      "30388"
    ],
    "oldWardNames": [
      "Xã Tân Hòa",
      "Xã Tân An",
      "Xã Tân Thành",
      "Xã Tân Hội"
    ]
  },
  {
    "newWardId": "81317061",
    "newWardName": "Tân Thạnh",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30387"
    ],
    "oldWardNames": [
      "Xã Tân Thạnh",
      "Xã Thuận Hòa"
    ]
  },
  {
    "newWardId": "80521054",
    "newWardName": "Tây Phú",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30692",
      "30712",
      "30691"
    ],
    "oldWardNames": [
      "Xã An Bình",
      "Xã Mỹ Phú Đông",
      "Xã Tây Phú"
    ]
  },
  {
    "newWardId": "81315065",
    "newWardName": "Tây Yên",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tây Yên A",
      "Xã Nam Yên",
      "Xã Tây Yên"
    ]
  },
  {
    "newWardId": "81307080",
    "newWardName": "Thạnh Đông",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Hiệp A",
      "Xã Thạnh Trị",
      "Xã Thạnh Đông A"
    ]
  },
  {
    "newWardId": "81311073",
    "newWardName": "Thạnh Hưng",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thạnh Lộc",
      "Xã Thạnh Phước",
      "Xã Thạnh Hưng"
    ]
  },
  {
    "newWardId": "81309081",
    "newWardName": "Thạnh Lộc",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thạnh Lộc",
      "Xã Mong Thọ",
      "Xã Mong Thọ A",
      "Xã Mong Thọ B"
    ]
  },
  {
    "newWardId": "80511027",
    "newWardName": "Thạnh Mỹ Tây",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30493",
      "30481"
    ],
    "oldWardNames": [
      "Xã Đào Hữu Cảnh",
      "Xã Ô Long Vĩ",
      "Xã Thạnh Mỹ Tây"
    ]
  },
  {
    "newWardId": "80521049",
    "newWardName": "Thoại Sơn",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30682",
      "30721",
      "30724"
    ],
    "oldWardNames": [
      "Thị trấn Núi Sập",
      "Xã Thoại Giang",
      "Xã Bình Thành"
    ]
  },
  {
    "newWardId": "80513031",
    "newWardName": "Thới Sơn",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30511",
      "30502",
      "30517"
    ],
    "oldWardNames": [
      "Phường Nhơn Hưng",
      "Phường Nhà Bàng",
      "Phường Thới Sơn"
    ]
  },
  {
    "newWardId": "81325100",
    "newWardName": "Tiên Hải",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tiên Hải"
    ]
  },
  {
    "newWardId": "80513030",
    "newWardName": "Tịnh Biên",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30514",
      "30520",
      "30529"
    ],
    "oldWardNames": [
      "Phường An Phú",
      "Phường Tịnh Biên",
      "Xã An Nông"
    ]
  },
  {
    "newWardId": "81325099",
    "newWardName": "Tô Châu",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tô Châu",
      "Xã Thuận Yên",
      "Xã Dương Hòa"
    ]
  },
  {
    "newWardId": "80515034",
    "newWardName": "Tri Tôn",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30544",
      "30574",
      "30562"
    ],
    "oldWardNames": [
      "Thị trấn Tri Tôn",
      "Xã Núi Tô",
      "Xã Châu Lăng"
    ]
  },
  {
    "newWardId": "81327059",
    "newWardName": "U Minh Thượng",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Minh Bắc",
      "Xã Minh Thuận"
    ]
  },
  {
    "newWardId": "81317064",
    "newWardName": "Vân Khánh",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vân Khánh Tây",
      "Xã Vân Khánh"
    ]
  },
  {
    "newWardId": "80519042",
    "newWardName": "Vĩnh An",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30604",
      "30622",
      "30610"
    ],
    "oldWardNames": [
      "Thị trấn Vĩnh Bình",
      "Xã Tân Phú",
      "Xã Vĩnh An"
    ]
  },
  {
    "newWardId": "81319055",
    "newWardName": "Vĩnh Bình",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vĩnh Bình Bắc",
      "Xã Vĩnh Bình Nam",
      "Xã Bình Minh"
    ]
  },
  {
    "newWardId": "81304090",
    "newWardName": "Vĩnh Điều",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30694"
    ],
    "oldWardNames": [
      "Xã Vĩnh Phú",
      "Xã Vĩnh Điều"
    ]
  },
  {
    "newWardId": "80515037",
    "newWardName": "Vĩnh Gia",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30559",
      "30568",
      "30556"
    ],
    "oldWardNames": [
      "Xã Vĩnh Phước",
      "Xã Lương An Trà",
      "Xã Vĩnh Gia"
    ]
  },
  {
    "newWardId": "80519041",
    "newWardName": "Vĩnh Hanh",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30619",
      "30598"
    ],
    "oldWardNames": [
      "Xã Vĩnh Nhuận",
      "Xã Vĩnh Hanh"
    ]
  },
  {
    "newWardId": "80505008",
    "newWardName": "Vĩnh Hậu",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30373",
      "30367",
      "30364"
    ],
    "oldWardNames": [
      "Thị trấn Đa Phước",
      "Xã Vĩnh Trường",
      "Xã Vĩnh Hậu"
    ]
  },
  {
    "newWardId": "81327058",
    "newWardName": "Vĩnh Hòa",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30385"
    ],
    "oldWardNames": [
      "Xã Vĩnh Hòa",
      "Xã Thạnh Yên A",
      "Xã Hòa Chánh",
      "Xã Thạnh Yên"
    ]
  },
  {
    "newWardId": "81313070",
    "newWardName": "Vĩnh Hòa Hưng",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vĩnh Hòa Hưng Bắc",
      "Xã Vĩnh Hòa Hưng Nam"
    ]
  },
  {
    "newWardId": "81319057",
    "newWardName": "Vĩnh Phong",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Vĩnh Thuận",
      "Xã Phong Đông",
      "Xã Vĩnh Phong"
    ]
  },
  {
    "newWardId": "80503006",
    "newWardName": "Vĩnh Tế",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30325",
      "30331",
      "30334"
    ],
    "oldWardNames": [
      "Phường Núi Sam",
      "Xã Vĩnh Tế",
      "Xã Vĩnh Châu"
    ]
  },
  {
    "newWardId": "80511025",
    "newWardName": "Vĩnh Thạnh Trung",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30478",
      "30472"
    ],
    "oldWardNames": [
      "Thị trấn Vĩnh Thạnh Trung",
      "Xã Mỹ Phú"
    ]
  },
  {
    "newWardId": "81301096",
    "newWardName": "Vĩnh Thông",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Vĩnh Thông",
      "Xã Phi Thông",
      "Xã Mỹ Lâm"
    ]
  },
  {
    "newWardId": "81319056",
    "newWardName": "Vĩnh Thuận",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Thuận",
      "Xã Vĩnh Thuận"
    ]
  },
  {
    "newWardId": "80521053",
    "newWardName": "Vĩnh Trạch",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30718",
      "30697"
    ],
    "oldWardNames": [
      "Xã Vĩnh Khánh",
      "Xã Vĩnh Trạch"
    ]
  },
  {
    "newWardId": "81313071",
    "newWardName": "Vĩnh Tuy",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vĩnh Thắng",
      "Xã Vĩnh Phước A",
      "Xã Vĩnh Tuy"
    ]
  },
  {
    "newWardId": "80507014",
    "newWardName": "Vĩnh Xương",
    "provinceId": "05",
    "provinceName": "An Giang",
    "oldWardIds": [
      "30385",
      "30379",
      "30382"
    ],
    "oldWardNames": [
      "Xã Vĩnh Hòa",
      "Xã Phú Lộc",
      "Xã Vĩnh Xương"
    ]
  },
  {
    "newWardId": "22113006",
    "newWardName": "An Lạc",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Lệ Viễn",
      "Xã An Lạc"
    ]
  },
  {
    "newWardId": "22115026",
    "newWardName": "Bảo Đài",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bảo Sơn",
      "Xã Thanh Lâm",
      "Xã Tam Dị",
      "Xã Bảo Đài"
    ]
  },
  {
    "newWardId": "22101051",
    "newWardName": "Bắc Giang",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Thọ Xương",
      "Phường Ngô Quyền",
      "Phường Xương Giang",
      "Phường Hoàng Văn Thụ",
      "Phường Trần Phú",
      "Phường Dĩnh Kế",
      "Phường Dĩnh Trì"
    ]
  },
  {
    "newWardId": "22115025",
    "newWardName": "Bắc Lũng",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Yên Sơn",
      "Xã Lan Mẫu",
      "Xã Khám Lạng",
      "Xã Bắc Lũng"
    ]
  },
  {
    "newWardId": "22107008",
    "newWardName": "Biển Động",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Biển Động",
      "Xã Kim Sơn",
      "Xã Phú Nhuận"
    ]
  },
  {
    "newWardId": "22107013",
    "newWardName": "Biên Sơn",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phong Vân",
      "Xã Biên Sơn",
      "Trường bắn TB1"
    ]
  },
  {
    "newWardId": "22103033",
    "newWardName": "Bố Hạ",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Bố Hạ",
      "Xã Đông Sơn",
      "Xã Hương Vĩ"
    ]
  },
  {
    "newWardId": "22305077",
    "newWardName": "Bồng Lai",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9298",
      "9295",
      "9307"
    ],
    "oldWardNames": [
      "Phường Cách Bi",
      "Phường Bồng Lai",
      "Xã Mộ Đạo"
    ]
  },
  {
    "newWardId": "22101057",
    "newWardName": "Cảnh Thụy",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Cảnh Thụy",
      "Xã Tiến Dũng",
      "Xã Tư Mại"
    ]
  },
  {
    "newWardId": "22315093",
    "newWardName": "Cao Đức",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9457",
      "9466"
    ],
    "oldWardNames": [
      "Xã Vạn Ninh",
      "Xã Cao Đức"
    ]
  },
  {
    "newWardId": "22115021",
    "newWardName": "Cẩm Lý",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đan Hội",
      "Xã Cẩm Lý"
    ]
  },
  {
    "newWardId": "22305078",
    "newWardName": "Chi Lăng",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9304",
      "9313"
    ],
    "oldWardNames": [
      "Xã Yên Giả",
      "Xã Chi Lăng"
    ]
  },
  {
    "newWardId": "22121017",
    "newWardName": "Chũ",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Thanh Hải",
      "Phường Hồng Giang",
      "Phường Trù Hựu",
      "Phường Chũ"
    ]
  },
  {
    "newWardId": "22113004",
    "newWardName": "Dương Hưu",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Long Sơn",
      "Xã Dương Hưu"
    ]
  },
  {
    "newWardId": "22101052",
    "newWardName": "Đa Mai",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tân Mỹ",
      "Phường Mỹ Độ",
      "Phường Song Mai",
      "Phường Đa Mai",
      "Xã Quế Nham"
    ]
  },
  {
    "newWardId": "22307088",
    "newWardName": "Đại Đồng",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9358",
      "9340",
      "9355"
    ],
    "oldWardNames": [
      "Xã Tri Phương",
      "Xã Hoàn Sơn",
      "Xã Đại Đồng"
    ]
  },
  {
    "newWardId": "22315092",
    "newWardName": "Đại Lai",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9472",
      "9469"
    ],
    "oldWardNames": [
      "Xã Song Giang",
      "Xã Đại Lai"
    ]
  },
  {
    "newWardId": "22113001",
    "newWardName": "Đại Sơn",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Giáo Liêm",
      "Xã Phúc Sơn",
      "Xã Đại Sơn"
    ]
  },
  {
    "newWardId": "22305076",
    "newWardName": "Đào Viên",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9274",
      "9289",
      "9301"
    ],
    "oldWardNames": [
      "Phường Phù Lương",
      "Xã Ngọc Xá",
      "Xã Đào Viên"
    ]
  },
  {
    "newWardId": "22107010",
    "newWardName": "Đèo Gia",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Lập",
      "Xã Đèo Gia"
    ]
  },
  {
    "newWardId": "22315094",
    "newWardName": "Đông Cứu",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9463",
      "9478",
      "9487"
    ],
    "oldWardNames": [
      "Xã Giang Sơn",
      "Xã Lãng Ngâm",
      "Xã Đông Cứu"
    ]
  },
  {
    "newWardId": "22103034",
    "newWardName": "Đồng Kỳ",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đồng Hưu",
      "Xã Đồng Vương",
      "Xã Đồng Kỳ"
    ]
  },
  {
    "newWardId": "22313065",
    "newWardName": "Đồng Nguyên",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9383",
      "9382",
      "9385"
    ],
    "oldWardNames": [
      "Phường Trang Hạ",
      "Phường Đồng Kỵ",
      "Phường Đồng Nguyên"
    ]
  },
  {
    "newWardId": "22115022",
    "newWardName": "Đông Phú",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đông Hưng",
      "Xã Đông Phú"
    ]
  },
  {
    "newWardId": "22101050",
    "newWardName": "Đồng Việt",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đức Giang",
      "Xã Đồng Phúc",
      "Xã Đồng Việt"
    ]
  },
  {
    "newWardId": "22315090",
    "newWardName": "Gia Bình",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9454",
      "9484",
      "9493",
      "9490"
    ],
    "oldWardNames": [
      "Thị trấn Gia Bình",
      "Xã Xuân Lai",
      "Xã Quỳnh Phú",
      "Xã Đại Bái"
    ]
  },
  {
    "newWardId": "22301061",
    "newWardName": "Hạp Lĩnh",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9325",
      "9331"
    ],
    "oldWardNames": [
      "Phường Khắc Niệm",
      "Phường Hạp Lĩnh"
    ]
  },
  {
    "newWardId": "22109043",
    "newWardName": "Hiệp Hòa",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Thắng",
      "Xã Đông Lỗ",
      "Xã Đoan Bái",
      "Xã Danh Thắng",
      "Xã Lương Phong"
    ]
  },
  {
    "newWardId": "22109044",
    "newWardName": "Hoàng Vân",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đồng Tiến",
      "Xã Toàn Thắng",
      "Xã Ngọc Sơn",
      "Xã Hoàng Vân"
    ]
  },
  {
    "newWardId": "22109042",
    "newWardName": "Hợp Thịnh",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thường Thắng",
      "Xã Mai Trung",
      "Xã Hùng Thái",
      "Xã Sơn Thịnh",
      "Xã Hợp Thịnh"
    ]
  },
  {
    "newWardId": "22111029",
    "newWardName": "Kép",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Kép",
      "Xã Quang Thịnh",
      "Xã Hương Sơn"
    ]
  },
  {
    "newWardId": "22121016",
    "newWardName": "Kiên Lao",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Kiên Thành",
      "Xã Kiên Lao"
    ]
  },
  {
    "newWardId": "22301058",
    "newWardName": "Kinh Bắc",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9187",
      "9184",
      "9226",
      "9214",
      "9235",
      "9172"
    ],
    "oldWardNames": [
      "Phường Suối Hoa",
      "Phường Tiền Ninh Vệ",
      "Phường Vạn An",
      "Phường Hòa Long",
      "Phường Khúc Xuyên",
      "Phường Kinh Bắc"
    ]
  },
  {
    "newWardId": "22111027",
    "newWardName": "Lạng Giang",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Vôi",
      "Xã Xương Lâm",
      "Xã Hương Lạc",
      "Xã Tân Hưng"
    ]
  },
  {
    "newWardId": "22311096",
    "newWardName": "Lâm Thao",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9529",
      "9514",
      "9535"
    ],
    "oldWardNames": [
      "Xã Bình Định",
      "Xã Quảng Phú",
      "Xã Lâm Thao"
    ]
  },
  {
    "newWardId": "22307086",
    "newWardName": "Liên Bão",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9337",
      "9346",
      "9334"
    ],
    "oldWardNames": [
      "Xã Hiên Vân",
      "Xã Việt Đoàn",
      "Xã Liên Bão"
    ]
  },
  {
    "newWardId": "22115024",
    "newWardName": "Lục Nam",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Phương Sơn",
      "Thị trấn Đồi Ngô",
      "Xã Cương Sơn",
      "Xã Tiên Nha",
      "Xã Chu Điện"
    ]
  },
  {
    "newWardId": "22107009",
    "newWardName": "Lục Ngạn",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Phì Điền",
      "Xã Giáp Sơn",
      "Xã Đồng Cốc",
      "Xã Tân Hoa",
      "Xã Tân Quang"
    ]
  },
  {
    "newWardId": "22115019",
    "newWardName": "Lục Sơn",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình Sơn",
      "Xã Lục Sơn"
    ]
  },
  {
    "newWardId": "22311095",
    "newWardName": "Lương Tài",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9496",
      "9505",
      "9511"
    ],
    "oldWardNames": [
      "Thị trấn Thứa",
      "Xã Phú Hòa",
      "Xã Tân Lãng"
    ]
  },
  {
    "newWardId": "22309068",
    "newWardName": "Mão Điền",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9418",
      "9409"
    ],
    "oldWardNames": [
      "Phường An Bình",
      "Xã hoài Thượng",
      "Xã Mão Điền"
    ]
  },
  {
    "newWardId": "22111028",
    "newWardName": "Mỹ Thái",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Xuân Hương",
      "Xã Dương Đức",
      "Xã Tân Thanh",
      "Xã Mỹ Thái"
    ]
  },
  {
    "newWardId": "22107015",
    "newWardName": "Nam Dương",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Mộc",
      "Xã Nam Dương"
    ]
  },
  {
    "newWardId": "22301062",
    "newWardName": "Nam Sơn",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9271",
      "9286"
    ],
    "oldWardNames": [
      "Phường Vân Dương",
      "Phường Nam Sơn"
    ]
  },
  {
    "newWardId": "22117048",
    "newWardName": "Nếnh",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Quang Châu",
      "Phường Vân Trung",
      "Phường Tăng Tiến",
      "Phường Nếnh"
    ]
  },
  {
    "newWardId": "22115023",
    "newWardName": "Nghĩa Phương",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trường Giang",
      "Xã Huyền Sơn",
      "Xã Nghĩa Phương"
    ]
  },
  {
    "newWardId": "22105038",
    "newWardName": "Ngọc Thiện",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Song Vân",
      "Xã Ngọc Châu",
      "Xã Ngọc Vân",
      "Xã Việt Ngọc",
      "Xã Ngọc Thiện"
    ]
  },
  {
    "newWardId": "22105039",
    "newWardName": "Nhã Nam",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Nhã Nam",
      "Xã Tân Trung",
      "Xã Liên Sơn",
      "Xã An Dương"
    ]
  },
  {
    "newWardId": "22305075",
    "newWardName": "Nhân Hòa",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9253",
      "9259",
      "9250"
    ],
    "oldWardNames": [
      "Phường Đại Xuân",
      "Phường Nhân Hòa",
      "Xã Việt Thống"
    ]
  },
  {
    "newWardId": "22315091",
    "newWardName": "Nhân Thắng",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9481",
      "9460",
      "9475"
    ],
    "oldWardNames": [
      "Thị trấn Nhân Thắng",
      "Xã Thái Bảo",
      "Xã Bình Dương"
    ]
  },
  {
    "newWardId": "22309072",
    "newWardName": "Ninh Xá",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9445",
      "9442"
    ],
    "oldWardNames": [
      "Phường Ninh Xá",
      "Xã Nguyệt Đức"
    ]
  },
  {
    "newWardId": "22307089",
    "newWardName": "Phật Tích",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9361",
      "9364",
      "9349"
    ],
    "oldWardNames": [
      "Xã Minh Đạo",
      "Xã Cảnh Hưng",
      "Xã Phật Tích"
    ]
  },
  {
    "newWardId": "22313066",
    "newWardName": "Phù Khê",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9388",
      "9373",
      "9379"
    ],
    "oldWardNames": [
      "Phường Châu Khê",
      "Phường Hương Mạc",
      "Phường Phù Khê"
    ]
  },
  {
    "newWardId": "22305079",
    "newWardName": "Phù Lãng",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9292",
      "9310",
      "9277"
    ],
    "oldWardNames": [
      "Xã Châu Phong",
      "Xã Đức Long",
      "Xã Phù Lãng"
    ]
  },
  {
    "newWardId": "22105040",
    "newWardName": "Phúc Hòa",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hợp Đức",
      "Xã Liên Chung",
      "Xã Phúc Hòa"
    ]
  },
  {
    "newWardId": "22305074",
    "newWardName": "Phương Liễu",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9280",
      "9265"
    ],
    "oldWardNames": [
      "Phường Phượng Mao",
      "Phường Phương Liễu"
    ]
  },
  {
    "newWardId": "22121018",
    "newWardName": "Phượng Sơn",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Phượng Sơn",
      "Xã Quý Sơn",
      "Xã Mỹ An"
    ]
  },
  {
    "newWardId": "22105041",
    "newWardName": "Quang Trung",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Lam Sơn",
      "Xã Quang Trung"
    ]
  },
  {
    "newWardId": "22305073",
    "newWardName": "Quế Võ",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9247",
      "9262",
      "9283",
      "9268"
    ],
    "oldWardNames": [
      "Phường Phố Mới",
      "Phường Bằng An",
      "Phường Việt Hùng",
      "Phường Quế Tân"
    ]
  },
  {
    "newWardId": "22107014",
    "newWardName": "Sa Lý",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phong Minh",
      "Xã Sa Lý"
    ]
  },
  {
    "newWardId": "22309071",
    "newWardName": "Song Liễu",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9433",
      "9436",
      "9439",
      "9451"
    ],
    "oldWardNames": [
      "Phường Xuân Lâm",
      "Phường Hà Mãn",
      "Xã Ngũ Thái",
      "Xã Song Liễu"
    ]
  },
  {
    "newWardId": "22113002",
    "newWardName": "Sơn Động",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn An Châu",
      "Xã An Bá",
      "Xã Vĩnh An"
    ]
  },
  {
    "newWardId": "22107011",
    "newWardName": "Sơn Hải",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hộ Đáp",
      "Xã Sơn Hải"
    ]
  },
  {
    "newWardId": "22303084",
    "newWardName": "Tam Đa",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9208",
      "9229",
      "9199"
    ],
    "oldWardNames": [
      "Xã Thụy Hòa",
      "Xã Đông Phong",
      "Xã Tam Đa"
    ]
  },
  {
    "newWardId": "22303082",
    "newWardName": "Tam Giang",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9211",
      "9202"
    ],
    "oldWardNames": [
      "Xã Hòa Tiến",
      "Xã Tam Giang"
    ]
  },
  {
    "newWardId": "22313064",
    "newWardName": "Tam Sơn",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9376",
      "9370"
    ],
    "oldWardNames": [
      "Phường Tương Giang",
      "Phường Tam Sơn"
    ]
  },
  {
    "newWardId": "22103036",
    "newWardName": "Tam Tiến",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tiến Thắng",
      "Xã An Thượng",
      "Xã Tam Tiến"
    ]
  },
  {
    "newWardId": "22101054",
    "newWardName": "Tân An",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tân An",
      "Xã Quỳnh Sơn",
      "Xã Trí Yên",
      "Xã Lãng Sơn"
    ]
  },
  {
    "newWardId": "22307087",
    "newWardName": "Tân Chi",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9343",
      "9352"
    ],
    "oldWardNames": [
      "Xã Lạc Vệ",
      "Xã Tân Chi"
    ]
  },
  {
    "newWardId": "22111030",
    "newWardName": "Tân Dĩnh",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Dĩnh",
      "Xã Thái Đào",
      "Xã Đại Lâm"
    ]
  },
  {
    "newWardId": "22107012",
    "newWardName": "Tân Sơn",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Cấm Sơn",
      "Xã Tân Sơn"
    ]
  },
  {
    "newWardId": "22101056",
    "newWardName": "Tân Tiến",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Hương Gián",
      "Phường Tân Tiến",
      "Xã Xuân Phú"
    ]
  },
  {
    "newWardId": "22105037",
    "newWardName": "Tân Yên",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Cao Thượng",
      "Xã Cao Xá",
      "Xã Việt Lập",
      "Xã Ngọc Lý"
    ]
  },
  {
    "newWardId": "22113003",
    "newWardName": "Tây Yên Tử",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Tây Yên Tử",
      "Xã Thanh Luận"
    ]
  },
  {
    "newWardId": "22309067",
    "newWardName": "Thuận Thành",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9400",
      "9412",
      "9424",
      "9406"
    ],
    "oldWardNames": [
      "Phường Hồ",
      "Phường Song Hồ",
      "Phường Gia Đông",
      "Xã Đại Đồng Thành"
    ]
  },
  {
    "newWardId": "22307085",
    "newWardName": "Tiên Du",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9319",
      "9328",
      "9322"
    ],
    "oldWardNames": [
      "Thị trấn Lim",
      "Xã Nội Duệ",
      "Xã Phú Lâm"
    ]
  },
  {
    "newWardId": "22111031",
    "newWardName": "Tiên Lục",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đào Mỹ",
      "Xã Nghĩa Hòa",
      "Xã An Hà",
      "Xã Nghĩa Hưng",
      "Xã Tiên Lục"
    ]
  },
  {
    "newWardId": "22101053",
    "newWardName": "Tiền Phong",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Nội Hoàng",
      "Phường Song Khê",
      "Phường Đồng Sơn",
      "Phường Tiền Phong"
    ]
  },
  {
    "newWardId": "22309069",
    "newWardName": "Trạm Lộ",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9430",
      "9448"
    ],
    "oldWardNames": [
      "Phường Trạm Lộ",
      "Xã Nghĩa Đạo"
    ]
  },
  {
    "newWardId": "22309070",
    "newWardName": "Trí Quả",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9427",
      "9421",
      "9415"
    ],
    "oldWardNames": [
      "Phường Thanh Khương",
      "Phường Trí Quả",
      "Xã Đình Tổ"
    ]
  },
  {
    "newWardId": "22311097",
    "newWardName": "Trung Chính",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9532",
      "9517",
      "9523"
    ],
    "oldWardNames": [
      "Xã Phú Lương",
      "Xã Quang Minh",
      "Xã Trung Chính"
    ]
  },
  {
    "newWardId": "22311098",
    "newWardName": "Trung Kênh",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9499",
      "9508",
      "9502"
    ],
    "oldWardNames": [
      "Xã An Thịnh",
      "Xã An Tập",
      "Xã Trung Kênh"
    ]
  },
  {
    "newWardId": "22115020",
    "newWardName": "Trường Sơn",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vô Tranh",
      "Xã Trường Sơn"
    ]
  },
  {
    "newWardId": "22113099",
    "newWardName": "Tuấn Đạo",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tuấn Đạo"
    ]
  },
  {
    "newWardId": "22117046",
    "newWardName": "Tự Lạn",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tự Lạn",
      "Xã Việt Tiến",
      "Xã Thượng Lan",
      "Xã Hương Mai"
    ]
  },
  {
    "newWardId": "22313063",
    "newWardName": "Từ Sơn",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9367",
      "9391",
      "9397",
      "9394"
    ],
    "oldWardNames": [
      "Phường Đông Ngàn",
      "Phường Tân Hồng",
      "Phường Phù Chẩn",
      "Phường Đình Bảng"
    ]
  },
  {
    "newWardId": "22303081",
    "newWardName": "Văn Môn",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9220",
      "9241",
      "9238"
    ],
    "oldWardNames": [
      "Xã Yên Phụ",
      "Xã Đông Thọ",
      "Xã Văn Môn"
    ]
  },
  {
    "newWardId": "22117049",
    "newWardName": "Vân Hà",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Ninh Sơn",
      "Phường Quảng Minh",
      "Xã Tiên Sơn",
      "Xã Trung Sơn",
      "Xã Vân Hà"
    ]
  },
  {
    "newWardId": "22113007",
    "newWardName": "Vân Sơn",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hữu Sản",
      "Xã Vân Sơn"
    ]
  },
  {
    "newWardId": "22117047",
    "newWardName": "Việt Yên",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Bích Động",
      "Phường Hồng Thái",
      "Xã Minh Đức",
      "Xã Nghĩa Trung"
    ]
  },
  {
    "newWardId": "22301059",
    "newWardName": "Võ Cường",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9181",
      "9244",
      "9190"
    ],
    "oldWardNames": [
      "Phường Đại Phúc",
      "Phường Phong Khê",
      "Phường Võ Cường"
    ]
  },
  {
    "newWardId": "22301060",
    "newWardName": "Vũ Ninh",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9256",
      "9166",
      "9169",
      "9163"
    ],
    "oldWardNames": [
      "Phường Kim Chân",
      "Phường Đáp Cầu",
      "Phường Thị Cầu",
      "Phường Vũ Ninh"
    ]
  },
  {
    "newWardId": "22109045",
    "newWardName": "Xuân Cẩm",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Bắc Lý",
      "Xã Hương Lâm",
      "Xã Mai Đình",
      "Xã Châu Minh",
      "Xã Xuân Cẩm"
    ]
  },
  {
    "newWardId": "22103035",
    "newWardName": "Xuân Lương",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đồng Tiến",
      "Xã Canh Nậu",
      "Xã Xuân Lương"
    ]
  },
  {
    "newWardId": "22101055",
    "newWardName": "Yên Dũng",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tân Liễu",
      "Phường Nham Biền",
      "Xã Yên Lư"
    ]
  },
  {
    "newWardId": "22113005",
    "newWardName": "Yên Định",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Cẩm Đàn",
      "Xã Yên Định"
    ]
  },
  {
    "newWardId": "22303080",
    "newWardName": "Yên Phong",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9193",
      "9223",
      "9232",
      "9217"
    ],
    "oldWardNames": [
      "Thị trấn Chờ",
      "Xã Trung Nghĩa",
      "Xã Long Châu",
      "Xã Đông Tiến"
    ]
  },
  {
    "newWardId": "22103032",
    "newWardName": "Yên Thế",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Phồn Xương",
      "Xã Đồng Lạc",
      "Xã Đồng Tâm",
      "Xã Tân Hiệp",
      "Xã Tân Sỏi"
    ]
  },
  {
    "newWardId": "22303083",
    "newWardName": "Yên Trung",
    "provinceId": "23",
    "provinceName": "Bắc Ninh",
    "oldWardIds": [
      "9196",
      "9205"
    ],
    "oldWardNames": [
      "Xã Dũng Liệt",
      "Xã Yên Trung"
    ]
  },
  {
    "newWardId": "20315033",
    "newWardName": "Bạch Đằng",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1780",
      "1711",
      "1708"
    ],
    "oldWardNames": [
      "Xã Thịnh Vượng",
      "Xã Bình Dương",
      "Xã Bạch Đằng"
    ]
  },
  {
    "newWardId": "20303011",
    "newWardName": "Bảo Lạc",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1321",
      "1333",
      "1342"
    ],
    "oldWardNames": [
      "Thị trấn Bảo Lạc",
      "Xã Bảo Toàn",
      "Xã Hồng Trị"
    ]
  },
  {
    "newWardId": "20323007",
    "newWardName": "Bảo Lâm",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1290",
      "1312",
      "1309"
    ],
    "oldWardNames": [
      "Thị trấn Pác Miầu",
      "Xã Mông Ân",
      "Xã Vĩnh Phong"
    ]
  },
  {
    "newWardId": "20317042",
    "newWardName": "Bế Văn Đàn",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1615",
      "1636",
      "1630"
    ],
    "oldWardNames": [
      "Xã Hồng Quang",
      "Xã Cách Linh",
      "Xã Bế Văn Đàn"
    ]
  },
  {
    "newWardId": "20313017",
    "newWardName": "Ca Thành",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1732",
      "1738"
    ],
    "oldWardNames": [
      "Xã Yên Lạc",
      "Xã Ca Thành"
    ]
  },
  {
    "newWardId": "20321036",
    "newWardName": "Canh Tân",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1801",
      "1789"
    ],
    "oldWardNames": [
      "Xã Đức Thông",
      "Xã Canh Tân"
    ]
  },
  {
    "newWardId": "20305025",
    "newWardName": "Cần Yên",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1367",
      "1372",
      "1366"
    ],
    "oldWardNames": [
      "Xã Cần Nông",
      "Xã Lương Thông",
      "Xã Cần Yên"
    ]
  },
  {
    "newWardId": "20303013",
    "newWardName": "Cô Ba",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1327",
      "1330"
    ],
    "oldWardNames": [
      "Xã Thượng Hà",
      "Xã Cô Ba"
    ]
  },
  {
    "newWardId": "20303012",
    "newWardName": "Cốc Pàng",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1291",
      "1324"
    ],
    "oldWardNames": [
      "Xã Đức Hạnh",
      "Xã Cốc Pàng"
    ]
  },
  {
    "newWardId": "20311052",
    "newWardName": "Đình Phong",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1481",
      "1480",
      "1489"
    ],
    "oldWardNames": [
      "Xã Ngọc Côn",
      "Xã Ngọc Khê",
      "Xã Phong Nặm",
      "Xã Đình Phong"
    ]
  },
  {
    "newWardId": "20311049",
    "newWardName": "Đoài Dương",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1516",
      "1519",
      "1525"
    ],
    "oldWardNames": [
      "Xã Trung Phúc",
      "Xã Cao Thăng",
      "Xã Đoài Dương"
    ]
  },
  {
    "newWardId": "20317043",
    "newWardName": "Độc Lập",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1582",
      "1597",
      "1594"
    ],
    "oldWardNames": [
      "Xã Quảng Hưng",
      "Xã Cai Bộ",
      "Xã Độc Lập"
    ]
  },
  {
    "newWardId": "20321039",
    "newWardName": "Đông Khê",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1786",
      "1831",
      "1816"
    ],
    "oldWardNames": [
      "Thị trấn Đông Khê",
      "Xã Đức Xuân",
      "Xã Trọng Con"
    ]
  },
  {
    "newWardId": "20321040",
    "newWardName": "Đức Long",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1669",
      "1810",
      "1828"
    ],
    "oldWardNames": [
      "Xã Đức Long",
      "Xã Thụy Hùng",
      "Xã Lê Lợi"
    ]
  },
  {
    "newWardId": "20319054",
    "newWardName": "Hạ Lang",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1558",
      "1564",
      "1573"
    ],
    "oldWardNames": [
      "Thị trấn Thanh Nhật",
      "Xã Thống Nhất",
      "Xã Thị Hoa"
    ]
  },
  {
    "newWardId": "20305028",
    "newWardName": "Hà Quảng",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1429",
      "1438",
      "1435"
    ],
    "oldWardNames": [
      "Xã Hồng Sỹ",
      "Xã Ngọc Đào",
      "Xã Mã Ba"
    ]
  },
  {
    "newWardId": "20317045",
    "newWardName": "Hạnh Phúc",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1378",
      "1609",
      "1624"
    ],
    "oldWardNames": [
      "Xã Ngọc Động",
      "Xã Tự Do",
      "Xã Hạnh Phúc"
    ]
  },
  {
    "newWardId": "20315032",
    "newWardName": "Hòa An",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1654",
      "1666",
      "1687"
    ],
    "oldWardNames": [
      "Thị trấn Nước Hai",
      "Xã Đại Tiến",
      "Xã Hồng Việt"
    ]
  },
  {
    "newWardId": "20303016",
    "newWardName": "Huy Giáp",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1357",
      "1354"
    ],
    "oldWardNames": [
      "Xã Đình Phùng",
      "Xã Huy Giáp"
    ]
  },
  {
    "newWardId": "20303010",
    "newWardName": "Hưng Đạo",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1352",
      "1343",
      "1705"
    ],
    "oldWardNames": [
      "Xã Hưng Thịnh",
      "Xã Kim Cúc",
      "Xã Hưng Đạo"
    ]
  },
  {
    "newWardId": "20303014",
    "newWardName": "Khánh Xuân",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1345",
      "1336"
    ],
    "oldWardNames": [
      "Xã Phan Thanh",
      "Xã Khánh Xuân"
    ]
  },
  {
    "newWardId": "20321037",
    "newWardName": "Kim Đồng",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1723",
      "1804",
      "1792"
    ],
    "oldWardNames": [
      "Xã Hồng Nam",
      "Xã Thái Cường",
      "Xã Kim Đồng"
    ]
  },
  {
    "newWardId": "20305029",
    "newWardName": "Lũng Nặm",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1420",
      "1393"
    ],
    "oldWardNames": [
      "Xã Thượng Thôn",
      "Xã Lũng Nặm"
    ]
  },
  {
    "newWardId": "20323006",
    "newWardName": "Lý Bôn",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1693",
      "1294"
    ],
    "oldWardNames": [
      "Xã Vĩnh Quang",
      "Xã Lý Bôn"
    ]
  },
  {
    "newWardId": "20319053",
    "newWardName": "Lý Quốc",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1534",
      "1543",
      "1537"
    ],
    "oldWardNames": [
      "Xã Minh Long",
      "Xã Đồng Loan",
      "Xã Lý Quốc"
    ]
  },
  {
    "newWardId": "20321035",
    "newWardName": "Minh Khai",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1813",
      "1795"
    ],
    "oldWardNames": [
      "Xã Quang Trọng",
      "Xã Minh Khai"
    ]
  },
  {
    "newWardId": "20313023",
    "newWardName": "Minh Tâm",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1675",
      "1747"
    ],
    "oldWardNames": [
      "Xã Trương Lương",
      "Xã Minh Tâm"
    ]
  },
  {
    "newWardId": "20323005",
    "newWardName": "Nam Quang",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1296",
      "1297"
    ],
    "oldWardNames": [
      "Xã Nam Cao",
      "Xã Nam Quang"
    ]
  },
  {
    "newWardId": "20315031",
    "newWardName": "Nam Tuấn",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1669",
      "1657",
      "1660"
    ],
    "oldWardNames": [
      "Xã Đức Long",
      "Xã Dân Chủ",
      "Xã Nam Tuấn"
    ]
  },
  {
    "newWardId": "20313022",
    "newWardName": "Nguyên Bình",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1726",
      "1750",
      "1762"
    ],
    "oldWardNames": [
      "Thị trấn Nguyên Bình",
      "Xã Thể Dục",
      "Xã Vũ Minh"
    ]
  },
  {
    "newWardId": "20315034",
    "newWardName": "Nguyễn Huệ",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1465",
      "1672",
      "1699"
    ],
    "oldWardNames": [
      "Xã Quang Trung",
      "Xã Ngũ Lão",
      "Xã Nguyễn Huệ"
    ]
  },
  {
    "newWardId": "20301002",
    "newWardName": "Nùng Trí Cao",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1279",
      "1270",
      "1693"
    ],
    "oldWardNames": [
      "Phường Ngọc Xuân",
      "Phường Sông Bằng",
      "Xã Vĩnh Quang"
    ]
  },
  {
    "newWardId": "20313018",
    "newWardName": "Phan Thanh",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1345",
      "1756"
    ],
    "oldWardNames": [
      "Xã Phan Thanh",
      "Xã Mai Long"
    ]
  },
  {
    "newWardId": "20317041",
    "newWardName": "Phục Hòa",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1627",
      "1651",
      "1639"
    ],
    "oldWardNames": [
      "Thị trấn Tà Lùng",
      "Thị trấn Hòa Thuận",
      "Xã Mỹ Hưng",
      "Xã Đại Sơn"
    ]
  },
  {
    "newWardId": "20311046",
    "newWardName": "Quang Hán",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1468",
      "1456"
    ],
    "oldWardNames": [
      "Xã Quang Vinh",
      "Xã Quang Hán"
    ]
  },
  {
    "newWardId": "20323004",
    "newWardName": "Quảng Lâm",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1304",
      "1303"
    ],
    "oldWardNames": [
      "Xã Thạch Lâm",
      "Xã Quảng Lâm"
    ]
  },
  {
    "newWardId": "20319056",
    "newWardName": "Quang Long",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1546",
      "1540",
      "1552"
    ],
    "oldWardNames": [
      "Xã Đức Quang",
      "Xã Thắng Lợi",
      "Xã Quang Long"
    ]
  },
  {
    "newWardId": "20311048",
    "newWardName": "Quang Trung",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1465",
      "1453",
      "1462"
    ],
    "oldWardNames": [
      "Xã Quang Trung",
      "Xã Tri Phương",
      "Xã Xuân Nội"
    ]
  },
  {
    "newWardId": "20317044",
    "newWardName": "Quảng Uyên",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1576",
      "1579",
      "1603",
      "1606"
    ],
    "oldWardNames": [
      "Thị trấn Quảng Uyên",
      "Xã Phi Hải",
      "Xã Phúc Sen",
      "Xã Chí Thảo"
    ]
  },
  {
    "newWardId": "20303009",
    "newWardName": "Sơn Lộ",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1359",
      "1360"
    ],
    "oldWardNames": [
      "Xã Sơn Lập",
      "Xã Sơn Lộ"
    ]
  },
  {
    "newWardId": "20313021",
    "newWardName": "Tam Kim",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1705",
      "1765",
      "1774"
    ],
    "oldWardNames": [
      "Xã Hưng Đạo",
      "Xã Hoa Thám",
      "Xã Tam Kim"
    ]
  },
  {
    "newWardId": "20301003",
    "newWardName": "Tân Giang",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1276",
      "1288",
      "1720",
      "1714"
    ],
    "oldWardNames": [
      "Phường Tân Giang",
      "Phường Duyệt Trung",
      "Phường Hòa Chung",
      "Xã Chu Trinh",
      "Xã Lê Chung"
    ]
  },
  {
    "newWardId": "20321038",
    "newWardName": "Thạch An",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1645",
      "1807",
      "1819"
    ],
    "oldWardNames": [
      "Xã Tiên Thành",
      "Xã Vân Trình",
      "Xã Lê Lai"
    ]
  },
  {
    "newWardId": "20313019",
    "newWardName": "Thành Công",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1771",
      "1777"
    ],
    "oldWardNames": [
      "Xã Quang Thành",
      "Xã Thành Công"
    ]
  },
  {
    "newWardId": "20305024",
    "newWardName": "Thanh Long",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1378",
      "1381",
      "1387"
    ],
    "oldWardNames": [
      "Xã Ngọc Động",
      "Xã Yên Sơn",
      "Xã Thanh Long"
    ]
  },
  {
    "newWardId": "20305026",
    "newWardName": "Thông Nông",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1363",
      "1375",
      "1384"
    ],
    "oldWardNames": [
      "Thị trấn Thông Nông",
      "Xã Đa Thông",
      "Xã Lương Can"
    ]
  },
  {
    "newWardId": "20301001",
    "newWardName": "Thục Phán",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1267",
      "1282",
      "1273",
      "1705",
      "1696"
    ],
    "oldWardNames": [
      "Phường Sông Hiến",
      "Phường Đề Thám",
      "Phường Hợp Giang",
      "Xã Hưng Đạo",
      "Xã Hoàng Tung"
    ]
  },
  {
    "newWardId": "20313020",
    "newWardName": "Tĩnh Túc",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1729",
      "1735",
      "1744"
    ],
    "oldWardNames": [
      "Thị trấn Tĩnh Túc",
      "Xã Triệu Nguyên",
      "Xã Vũ Nông"
    ]
  },
  {
    "newWardId": "20305030",
    "newWardName": "Tổng Cọt",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1411",
      "1402",
      "1414"
    ],
    "oldWardNames": [
      "Xã Nội Thôn",
      "Xã Cải Viên",
      "Xã Tổng Cọt"
    ]
  },
  {
    "newWardId": "20311047",
    "newWardName": "Trà Lĩnh",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1447",
      "1471",
      "1474"
    ],
    "oldWardNames": [
      "Thị trấn Trà Lĩnh",
      "Xã Cao Chương",
      "Xã Quốc Toản"
    ]
  },
  {
    "newWardId": "20311050",
    "newWardName": "Trùng Khánh",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1477",
      "1522",
      "1504",
      "1498"
    ],
    "oldWardNames": [
      "Thị trấn Trùng Khánh",
      "Xã Đức Hồng",
      "Xã Lăng Hiếu",
      "Xã Khâm Thành"
    ]
  },
  {
    "newWardId": "20305027",
    "newWardName": "Trường Hà",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1392",
      "1432",
      "1417",
      "1399"
    ],
    "oldWardNames": [
      "Thị trấn Xuân Hòa",
      "Xã Quý Quân",
      "Xã Sóc Hà",
      "Xã Trường Hà"
    ]
  },
  {
    "newWardId": "20319055",
    "newWardName": "Vinh Quý",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1567",
      "1555",
      "1549",
      "1561"
    ],
    "oldWardNames": [
      "Xã Cô Ngân",
      "Xã An Lạc",
      "Xã Kim Loan",
      "Xã Vinh Quý"
    ]
  },
  {
    "newWardId": "20303015",
    "newWardName": "Xuân Trường",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1348",
      "1339"
    ],
    "oldWardNames": [
      "Xã Hồng An",
      "Xã Xuân Trường"
    ]
  },
  {
    "newWardId": "20323008",
    "newWardName": "Yên Thổ",
    "provinceId": "03",
    "provinceName": "Cao Bằng",
    "oldWardIds": [
      "1315",
      "1316",
      "1318"
    ],
    "oldWardNames": [
      "Xã Thái Học",
      "Xã Thái Sơn",
      "Xã Yên Thổ"
    ]
  },
  {
    "newWardId": "82111052",
    "newWardName": "An Trạch",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Trạch A",
      "Xã An Trạch"
    ]
  },
  {
    "newWardId": "82301001",
    "newWardName": "An Xuyên",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32005",
      "32002",
      "31999",
      "32022",
      "32023"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 2",
      "Phường 9",
      "Phường Tân Xuyên",
      "Xã An Xuyên"
    ]
  },
  {
    "newWardId": "82101040",
    "newWardName": "Bạc Liêu",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32005",
      "32002",
      "32020",
      "32014"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 2",
      "Phường 7",
      "Phường 8",
      "Phường 3"
    ]
  },
  {
    "newWardId": "82303028",
    "newWardName": "Biển Bạch",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32069",
      "32074",
      "32068"
    ],
    "oldWardNames": [
      "Xã Tân Bằng",
      "Xã Biển Bạch Đông",
      "Xã Biển Bạch"
    ]
  },
  {
    "newWardId": "82308032",
    "newWardName": "Cái Đôi Vàm",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32212",
      "32230"
    ],
    "oldWardNames": [
      "Thị trấn Cái Đôi Vàm",
      "Xã Nguyễn Việt Khái"
    ]
  },
  {
    "newWardId": "82309039",
    "newWardName": "Cái Nước",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32128",
      "32149",
      "32142",
      "32143",
      "32146"
    ],
    "oldWardNames": [
      "Thị trấn Cái Nước",
      "Xã Trần Thới",
      "Xã Đông Hưng",
      "Xã Đông Thới",
      "Xã Tân Hưng Đông"
    ]
  },
  {
    "newWardId": "82105064",
    "newWardName": "Châu Thới",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vĩnh Hưng",
      "Xã Vĩnh Hưng A",
      "Xã Châu Thới"
    ]
  },
  {
    "newWardId": "82307020",
    "newWardName": "Đá Bạc",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32104",
      "32101",
      "32107"
    ],
    "oldWardNames": [
      "Xã Khánh Bình Tây",
      "Xã Khánh Bình Tây Bắc",
      "Xã Trần Hợi"
    ]
  },
  {
    "newWardId": "82311010",
    "newWardName": "Đầm Dơi",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32152",
      "32173",
      "32174",
      "32155"
    ],
    "oldWardNames": [
      "Thị trấn Đầm Dơi",
      "Xã Tân Duyệt",
      "Xã Tân Dân",
      "Xã Tạ An Khương"
    ]
  },
  {
    "newWardId": "82312029",
    "newWardName": "Đất Mới",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32201",
      "32200",
      "32194",
      "32242"
    ],
    "oldWardNames": [
      "Xã Lâm Hải",
      "Xã Đất Mới",
      "Thị trấn Năm Căn",
      "Xã Hàm Rồng",
      "Xã Viên An"
    ]
  },
  {
    "newWardId": "82313017",
    "newWardName": "Đất Mũi",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32248",
      "32242",
      "32245"
    ],
    "oldWardNames": [
      "Xã Đất Mũi",
      "Xã Viên An",
      "Xã Tân Ân"
    ]
  },
  {
    "newWardId": "82111051",
    "newWardName": "Định Thành",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Phúc",
      "Xã Định Thành A",
      "Xã Định Thành"
    ]
  },
  {
    "newWardId": "82111054",
    "newWardName": "Đông Hải",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Long Điền Đông",
      "Xã Long Điền Đông A"
    ]
  },
  {
    "newWardId": "82111050",
    "newWardName": "Gành Hào",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Gành Hào",
      "Xã Long Điền Tây"
    ]
  },
  {
    "newWardId": "82107043",
    "newWardName": "Giá Rai",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32005"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường Hộ Phòng",
      "Xã Phong Thạnh",
      "Xã Phong Thạnh A"
    ]
  },
  {
    "newWardId": "82101042",
    "newWardName": "Hiệp Thành",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Nhà Mát",
      "Xã Vĩnh Trạch Đông",
      "Xã Hiệp Thành"
    ]
  },
  {
    "newWardId": "82106055",
    "newWardName": "Hòa Bình",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Hòa Bình",
      "Xã Vĩnh Mỹ A",
      "Xã Long Thạnh"
    ]
  },
  {
    "newWardId": "82301004",
    "newWardName": "Hòa Thành",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32041",
      "32038",
      "32020",
      "32017",
      "32035",
      "32029"
    ],
    "oldWardNames": [
      "Xã Hòa Tân",
      "Xã Hòa Thành",
      "Phường 7",
      "Phường 6",
      "Xã Định Bình",
      "Xã Tắc Vân"
    ]
  },
  {
    "newWardId": "82303027",
    "newWardName": "Hồ Thị Kỷ",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32092"
    ],
    "oldWardNames": [
      "Xã Hồ Thị Kỷ"
    ]
  },
  {
    "newWardId": "82103046",
    "newWardName": "Hồng Dân",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Ngan Dừa",
      "Xã Lộc Ninh",
      "Xã Ninh Hòa"
    ]
  },
  {
    "newWardId": "82105063",
    "newWardName": "Hưng Hội",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hưng Thành",
      "Xã Hưng Hội"
    ]
  },
  {
    "newWardId": "82309038",
    "newWardName": "Hưng Mỹ",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32140",
      "32146"
    ],
    "oldWardNames": [
      "Xã Hưng Mỹ",
      "Xã Tân Hưng Đông",
      "Xã Hòa Mỹ (phần còn lại sau khi sáp nhập vào xã Phú Mỹ",
      "xã Tân Hưng)"
    ]
  },
  {
    "newWardId": "82305015",
    "newWardName": "Khánh An",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32059"
    ],
    "oldWardNames": [
      "Xã Khánh An",
      "Xã Nguyễn Phích (phần còn lại sau khi sáp nhập vào xã Nguyễn Phích",
      "xã Khánh Lâm)"
    ]
  },
  {
    "newWardId": "82307019",
    "newWardName": "Khánh Bình",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32116",
      "32110"
    ],
    "oldWardNames": [
      "Xã Khánh Bình Đông",
      "Xã Khánh Bình"
    ]
  },
  {
    "newWardId": "82307021",
    "newWardName": "Khánh Hưng",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32119",
      "32113"
    ],
    "oldWardNames": [
      "Xã Khánh Hải",
      "Xã Khánh Hưng"
    ]
  },
  {
    "newWardId": "82305014",
    "newWardName": "Khánh Lâm",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32062",
      "32053",
      "32056"
    ],
    "oldWardNames": [
      "Xã Khánh Hội",
      "Xã Nguyễn Phích",
      "Xã Khánh Lâm"
    ]
  },
  {
    "newWardId": "82107044",
    "newWardName": "Láng Tròn",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Láng Tròn",
      "Xã Phong Tân",
      "Xã Phong Thạnh Đông"
    ]
  },
  {
    "newWardId": "82111053",
    "newWardName": "Long Điền",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Điền Hải",
      "Xã Long Điền"
    ]
  },
  {
    "newWardId": "82309036",
    "newWardName": "Lương Thế Trân",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32130",
      "32134",
      "32131",
      "32122"
    ],
    "oldWardNames": [
      "Xã Thạnh Phú",
      "Xã Phú Hưng",
      "Xã Lương Thế Trân",
      "Xã Lợi An"
    ]
  },
  {
    "newWardId": "82301002",
    "newWardName": "Lý Văn Lâm",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32014",
      "32032"
    ],
    "oldWardNames": [
      "Phường 8",
      "Xã Lý Văn Lâm",
      "Xã Lợi An (phần còn lại sau khi sáp nhập vào xã Trần Văn Thời",
      "xã Lương Thế Trân)"
    ]
  },
  {
    "newWardId": "82312030",
    "newWardName": "Năm Căn",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32203",
      "32194"
    ],
    "oldWardNames": [
      "Xã Hàng Vịnh",
      "Thị trấn Năm Căn",
      "Xã Hàm Rồng"
    ]
  },
  {
    "newWardId": "82305013",
    "newWardName": "Nguyễn Phích",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32044",
      "32053",
      "32048"
    ],
    "oldWardNames": [
      "Thị trấn U Minh",
      "Xã Nguyễn Phích",
      "Xã Khánh Thuận"
    ]
  },
  {
    "newWardId": "82308033",
    "newWardName": "Nguyễn Việt Khái",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32227",
      "32228",
      "32224"
    ],
    "oldWardNames": [
      "Xã Tân Hưng Tây",
      "Xã Rạch Chèo",
      "Xã Việt Thắng"
    ]
  },
  {
    "newWardId": "82103049",
    "newWardName": "Ninh Quới",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ninh Quới A",
      "Xã Ninh Quới"
    ]
  },
  {
    "newWardId": "82103048",
    "newWardName": "Ninh Thạnh Lợi",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ninh Thạnh Lợi A",
      "Xã Ninh Thạnh Lợi"
    ]
  },
  {
    "newWardId": "82313016",
    "newWardName": "Phan Ngọc Hiển",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32244",
      "32239",
      "32245"
    ],
    "oldWardNames": [
      "Thị trấn Rạch Gốc",
      "Xã Viên An Đông",
      "Xã Tân Ân"
    ]
  },
  {
    "newWardId": "82109060",
    "newWardName": "Phong Hiệp",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phong Thạnh Tây A",
      "Xã Phong Thạnh Tây B"
    ]
  },
  {
    "newWardId": "82107045",
    "newWardName": "Phong Thạnh",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Thạnh",
      "Xã Phong Thạnh Tây",
      "Xã Tân Phong"
    ]
  },
  {
    "newWardId": "82308035",
    "newWardName": "Phú Mỹ",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32214",
      "32215"
    ],
    "oldWardNames": [
      "Xã Phú Thuận",
      "Xã Phú Mỹ",
      "Xã Hòa Mỹ"
    ]
  },
  {
    "newWardId": "82308034",
    "newWardName": "Phú Tân",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32221",
      "32218"
    ],
    "oldWardNames": [
      "Xã Tân Hải",
      "Xã Phú Tân"
    ]
  },
  {
    "newWardId": "82109058",
    "newWardName": "Phước Long",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Phước Long",
      "Xã Vĩnh Phú Đông"
    ]
  },
  {
    "newWardId": "82311011",
    "newWardName": "Quách Phẩm",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32179",
      "32182"
    ],
    "oldWardNames": [
      "Xã Quách Phẩm Bắc",
      "Xã Quách Phẩm"
    ]
  },
  {
    "newWardId": "82307022",
    "newWardName": "Sông Đốc",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32098",
      "32124"
    ],
    "oldWardNames": [
      "Thị trấn Sông Đốc",
      "Xã Phong Điền"
    ]
  },
  {
    "newWardId": "82311007",
    "newWardName": "Tạ An Khương",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32158",
      "32170",
      "32155"
    ],
    "oldWardNames": [
      "Xã Tạ An Khương Đông",
      "Xã Tạ An Khương Nam",
      "Xã Tạ An Khương"
    ]
  },
  {
    "newWardId": "82312031",
    "newWardName": "Tam Giang",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32197",
      "32209",
      "32206"
    ],
    "oldWardNames": [
      "Xã Hiệp Tùng",
      "Xã Tam Giang Đông",
      "Xã Tam Giang"
    ]
  },
  {
    "newWardId": "82313018",
    "newWardName": "Tân Ân",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32233",
      "32236"
    ],
    "oldWardNames": [
      "Xã Tam Giang Tây",
      "Xã Tân Ân Tây"
    ]
  },
  {
    "newWardId": "82309037",
    "newWardName": "Tân Hưng",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32137",
      "32142",
      "32143"
    ],
    "oldWardNames": [
      "Xã Tân Hưng",
      "Xã Đông Hưng",
      "Xã Đông Thới",
      "Xã Hòa Mỹ"
    ]
  },
  {
    "newWardId": "82303026",
    "newWardName": "Tân Lộc",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32083",
      "32089",
      "32086"
    ],
    "oldWardNames": [
      "Xã Tân Lộc Bắc",
      "Xã Tân Lộc Đông",
      "Xã Tân Lộc"
    ]
  },
  {
    "newWardId": "82301003",
    "newWardName": "Tân Thành",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32008",
      "32025",
      "32026",
      "32020",
      "32017",
      "32035",
      "32029"
    ],
    "oldWardNames": [
      "Phường 5",
      "Phường Tân Thành",
      "Xã Tân Thành",
      "Phường 7",
      "Phường 6",
      "Xã Định Bình",
      "Xã Tắc Vân"
    ]
  },
  {
    "newWardId": "82311005",
    "newWardName": "Tân Thuận",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32164",
      "32167"
    ],
    "oldWardNames": [
      "Xã Tân Đức",
      "Xã Tân Thuận"
    ]
  },
  {
    "newWardId": "82311006",
    "newWardName": "Tân Tiến",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32188",
      "32176"
    ],
    "oldWardNames": [
      "Xã Nguyễn Huân",
      "Xã Tân Tiến"
    ]
  },
  {
    "newWardId": "82311009",
    "newWardName": "Thanh Tùng",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32186",
      "32185"
    ],
    "oldWardNames": [
      "Xã Ngọc Chánh",
      "Xã Thanh Tùng"
    ]
  },
  {
    "newWardId": "82303024",
    "newWardName": "Thới Bình",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32065",
      "32077"
    ],
    "oldWardNames": [
      "Thị trấn Thới Bình",
      "Xã Thới Bình"
    ]
  },
  {
    "newWardId": "82311008",
    "newWardName": "Trần Phán",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32162",
      "32161"
    ],
    "oldWardNames": [
      "Xã Tân Trung",
      "Xã Trần Phán"
    ]
  },
  {
    "newWardId": "82307023",
    "newWardName": "Trần Văn Thời",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32095",
      "32108",
      "32125",
      "32122",
      "32107",
      "32124"
    ],
    "oldWardNames": [
      "Thị trấn Trần Văn Thời",
      "Xã Khánh Lộc",
      "Xã Phong Lạc",
      "Xã Lợi An",
      "Xã Trần Hợi",
      "Xã Phong Điền"
    ]
  },
  {
    "newWardId": "82303025",
    "newWardName": "Trí Phải",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32072",
      "32080",
      "32071"
    ],
    "oldWardNames": [
      "Xã Trí Lực",
      "Xã Tân Phú",
      "Xã Trí Phải"
    ]
  },
  {
    "newWardId": "82305012",
    "newWardName": "U Minh",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32050",
      "32047",
      "32048",
      "32056"
    ],
    "oldWardNames": [
      "Xã Khánh Tiến",
      "Xã Khánh Hòa",
      "Xã Khánh Thuận",
      "Xã Khánh Lâm"
    ]
  },
  {
    "newWardId": "82106057",
    "newWardName": "Vĩnh Hậu",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vĩnh Thịnh",
      "Xã Vĩnh Hậu A",
      "Xã Vĩnh Hậu"
    ]
  },
  {
    "newWardId": "82103047",
    "newWardName": "Vĩnh Lộc",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vĩnh Lộc A",
      "Xã Vĩnh Lộc"
    ]
  },
  {
    "newWardId": "82105062",
    "newWardName": "Vĩnh Lợi",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Châu Hưng",
      "Xã Châu Hưng A"
    ]
  },
  {
    "newWardId": "82106056",
    "newWardName": "Vĩnh Mỹ",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Minh Diệu",
      "Xã Vĩnh Bình",
      "Xã Vĩnh Mỹ B"
    ]
  },
  {
    "newWardId": "82109059",
    "newWardName": "Vĩnh Phước",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phước Long",
      "Xã Vĩnh Phú Tây"
    ]
  },
  {
    "newWardId": "82109061",
    "newWardName": "Vĩnh Thanh",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hưng Phú",
      "Xã Vĩnh Thanh"
    ]
  },
  {
    "newWardId": "82101041",
    "newWardName": "Vĩnh Trạch",
    "provinceId": "23",
    "provinceName": "Cà Mau",
    "oldWardIds": [
      "32008"
    ],
    "oldWardNames": [
      "Phường 5",
      "Xã Vĩnh Trạch"
    ]
  },
  {
    "newWardId": "81519004",
    "newWardName": "An Bình",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31150",
      "31312",
      "31183"
    ],
    "oldWardNames": [
      "Phường An Bình",
      "Xã Mỹ Khánh",
      "Phường Long Tuyền"
    ]
  },
  {
    "newWardId": "81903074",
    "newWardName": "An Lạc Thôn",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn An Lạc Thôn",
      "Xã Xuân Hòa",
      "Xã Trinh Phú"
    ]
  },
  {
    "newWardId": "81915079",
    "newWardName": "An Ninh",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Hiệp",
      "Xã An Ninh"
    ]
  },
  {
    "newWardId": "81906102",
    "newWardName": "An Thạnh",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Cù Lao Dung",
      "Xã An Thạnh 1",
      "Xã An Thạnh Tây",
      "Xã An Thạnh Đông"
    ]
  },
  {
    "newWardId": "81521006",
    "newWardName": "Bình Thủy",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31177",
      "31168",
      "31178"
    ],
    "oldWardNames": [
      "Phường An Thới",
      "Phường Bình Thủy",
      "Phường Bùi Hữu Nghĩa"
    ]
  },
  {
    "newWardId": "81519002",
    "newWardName": "Cái Khế",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31120",
      "31117",
      "31178"
    ],
    "oldWardNames": [
      "Phường An Hòa",
      "Phường Cái Khế",
      "Phường Bùi Hữu Nghĩa"
    ]
  },
  {
    "newWardId": "81523008",
    "newWardName": "Cái Răng",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31186",
      "31198",
      "31195",
      "31192"
    ],
    "oldWardNames": [
      "Phường Lê Bình",
      "Phường Thường Thạnh",
      "Phường Ba Láng",
      "Phường Hưng Thạnh"
    ]
  },
  {
    "newWardId": "81605049",
    "newWardName": "Châu Thành",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Mái Dầm",
      "Thị trấn Ngã Sáu",
      "Xã Đông Phú"
    ]
  },
  {
    "newWardId": "81527024",
    "newWardName": "Cờ Đỏ",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31261",
      "31276",
      "31277"
    ],
    "oldWardNames": [
      "Thị trấn Cờ Đỏ",
      "Xã Thới Đông",
      "Xã Thới Xuân"
    ]
  },
  {
    "newWardId": "81906103",
    "newWardName": "Cù Lao Dung",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Thạnh 2",
      "Xã Đại Ân 1",
      "Xã An Thạnh 3",
      "Xã An Thạnh Nam"
    ]
  },
  {
    "newWardId": "81903077",
    "newWardName": "Đại Hải",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ba Trinh",
      "Xã Đại Hải"
    ]
  },
  {
    "newWardId": "81905069",
    "newWardName": "Đại Ngãi",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Đại Ngãi",
      "Xã Long Đức"
    ]
  },
  {
    "newWardId": "81607052",
    "newWardName": "Đại Thành",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Hiệp Lợi",
      "Xã Tân Thành",
      "Xã Đại Thành"
    ]
  },
  {
    "newWardId": "81527025",
    "newWardName": "Đông Hiệp",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31274",
      "31270",
      "31273"
    ],
    "oldWardNames": [
      "Xã Đông Thắng",
      "Xã Xuân Thắng",
      "Xã Đông Hiệp"
    ]
  },
  {
    "newWardId": "81605050",
    "newWardName": "Đông Phước",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Cái Tắc",
      "Xã Đông Thạnh",
      "Xã Đông Phước A"
    ]
  },
  {
    "newWardId": "81531021",
    "newWardName": "Đông Thuận",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31279",
      "31282"
    ],
    "oldWardNames": [
      "Xã Đông Bình",
      "Xã Đông Thuận"
    ]
  },
  {
    "newWardId": "81909065",
    "newWardName": "Gia Hòa",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31246"
    ],
    "oldWardNames": [
      "Xã Thạnh Quới",
      "Xã Gia Hòa 2"
    ]
  },
  {
    "newWardId": "81608058",
    "newWardName": "Hiệp Hưng",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Cây Dương",
      "Xã Hiệp Hưng"
    ]
  },
  {
    "newWardId": "81608055",
    "newWardName": "Hòa An",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Kinh Cùng",
      "Xã Hòa An"
    ]
  },
  {
    "newWardId": "81601033",
    "newWardName": "Hỏa Lựu",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Tiến",
      "Xã Hỏa Tiến",
      "Xã Hỏa Lựu"
    ]
  },
  {
    "newWardId": "81909064",
    "newWardName": "Hòa Tú",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hòa Tú 1",
      "Xã Hòa Tú 2"
    ]
  },
  {
    "newWardId": "81915081",
    "newWardName": "Hồ Đắc Kiện",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thiện Mỹ",
      "Xã Hồ Đắc Kiện"
    ]
  },
  {
    "newWardId": "81523009",
    "newWardName": "Hưng Phú",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31204",
      "31201",
      "31189"
    ],
    "oldWardNames": [
      "Phường Tân Phú",
      "Phường Phú Thứ",
      "Phường Hưng Phú"
    ]
  },
  {
    "newWardId": "81903075",
    "newWardName": "Kế Sách",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Kế Sách",
      "Xã Kế An",
      "Xã Kế Thành"
    ]
  },
  {
    "newWardId": "81913090",
    "newWardName": "Khánh Hòa",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Khánh Hòa",
      "Xã Vĩnh Hiệp",
      "Xã Hòa Đông"
    ]
  },
  {
    "newWardId": "81913087",
    "newWardName": "Lai Hòa",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Lai Hòa"
    ]
  },
  {
    "newWardId": "81911096",
    "newWardName": "Lâm Tân",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tuân Tức",
      "Xã Lâm Kiết",
      "Xã Lâm Tân"
    ]
  },
  {
    "newWardId": "81917100",
    "newWardName": "Lịch Hội Thượng",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Lịch Hội Thượng",
      "Xã Lịch Hội Thượng"
    ]
  },
  {
    "newWardId": "81917099",
    "newWardName": "Liêu Tú",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Viên Bình",
      "Xã Liêu Tú"
    ]
  },
  {
    "newWardId": "81612043",
    "newWardName": "Long Bình",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Bình Thạnh",
      "Phường Vĩnh Tường",
      "Xã Long Bình"
    ]
  },
  {
    "newWardId": "81907083",
    "newWardName": "Long Hưng",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hưng Phú",
      "Xã Long Hưng"
    ]
  },
  {
    "newWardId": "81612044",
    "newWardName": "Long Mỹ",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31212"
    ],
    "oldWardNames": [
      "Phường Thuận An",
      "Xã Long Trị",
      "Xã Long Trị A"
    ]
  },
  {
    "newWardId": "81905071",
    "newWardName": "Long Phú",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Long Phú",
      "Xã Long Phú"
    ]
  },
  {
    "newWardId": "81612045",
    "newWardName": "Long Phú 1",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Trà Lồng",
      "Xã Tân Phú",
      "Xã Long Phú"
    ]
  },
  {
    "newWardId": "81521007",
    "newWardName": "Long Tuyền",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31180",
      "31183"
    ],
    "oldWardNames": [
      "Phường Long Hòa",
      "Phường Long Tuyền"
    ]
  },
  {
    "newWardId": "81611042",
    "newWardName": "Lương Tâm",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Lương Nghĩa",
      "Xã Lương Tâm"
    ]
  },
  {
    "newWardId": "81907085",
    "newWardName": "Mỹ Hương",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thuận Hưng",
      "Xã Phú Mỹ",
      "Xã Mỹ Hương"
    ]
  },
  {
    "newWardId": "81907084",
    "newWardName": "Mỹ Phước",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Mỹ Phước"
    ]
  },
  {
    "newWardId": "81912093",
    "newWardName": "Mỹ Quới",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường 3",
      "Xã Mỹ Bình",
      "Xã Mỹ Quới"
    ]
  },
  {
    "newWardId": "81907082",
    "newWardName": "Mỹ Tú",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Huỳnh Hữu Nghĩa",
      "Xã Mỹ Thuận",
      "Xã Mỹ Tú"
    ]
  },
  {
    "newWardId": "81901063",
    "newWardName": "Mỹ Xuyên",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường 10",
      "Thị trấn Mỹ Xuyên",
      "Xã Đại Tâm"
    ]
  },
  {
    "newWardId": "81607053",
    "newWardName": "Ngã Bảy",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Lái Hiếu",
      "Phường Hiệp Thành",
      "Phường Ngã Bảy"
    ]
  },
  {
    "newWardId": "81912092",
    "newWardName": "Ngã Năm",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường 1",
      "Phường 2",
      "Xã Vĩnh Quới"
    ]
  },
  {
    "newWardId": "81909067",
    "newWardName": "Ngọc Tố",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tham Đôn",
      "Xã Ngọc Đông",
      "Xã Ngọc Tố"
    ]
  },
  {
    "newWardId": "81529018",
    "newWardName": "Nhơn Ái",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31315",
      "31300"
    ],
    "oldWardNames": [
      "Xã Nhơn Nghĩa",
      "Xã Nhơn Ái"
    ]
  },
  {
    "newWardId": "81903072",
    "newWardName": "Nhơn Mỹ",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Mỹ",
      "Xã Song Phụng",
      "Xã Nhơn Mỹ"
    ]
  },
  {
    "newWardId": "81909066",
    "newWardName": "Nhu Gia",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31249"
    ],
    "oldWardNames": [
      "Xã Thạnh Phú",
      "Xã Gia Hòa 1"
    ]
  },
  {
    "newWardId": "81519001",
    "newWardName": "Ninh Kiều",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31135",
      "31123",
      "31144"
    ],
    "oldWardNames": [
      "Phường Tân An",
      "Phường Thới Bình",
      "Phường Xuân Khánh"
    ]
  },
  {
    "newWardId": "81505010",
    "newWardName": "Ô Môn",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31153",
      "31154",
      "31159",
      "31267"
    ],
    "oldWardNames": [
      "Phường Châu Văn Liêm",
      "Phường Thới Hòa",
      "Phường Thới An",
      "Xã Thới Thạnh"
    ]
  },
  {
    "newWardId": "81529017",
    "newWardName": "Phong Điền",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31299",
      "31306",
      "31303"
    ],
    "oldWardNames": [
      "Thị trấn Phong Điền",
      "Xã Tân Thới",
      "Xã Giai Xuân"
    ]
  },
  {
    "newWardId": "81903073",
    "newWardName": "Phong Nẫm",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phong Nẫm"
    ]
  },
  {
    "newWardId": "81605051",
    "newWardName": "Phú Hữu",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phú Tân",
      "Xã Đông Phước",
      "Xã Phú Hữu"
    ]
  },
  {
    "newWardId": "81911094",
    "newWardName": "Phú Lộc",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Hưng Lợi",
      "Thị trấn Phú Lộc",
      "Xã Thạnh Trị"
    ]
  },
  {
    "newWardId": "81901061",
    "newWardName": "Phú Lợi",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường 1",
      "Phường 2",
      "Phường 3",
      "Phường 4"
    ]
  },
  {
    "newWardId": "81915078",
    "newWardName": "Phú Tâm",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Châu Thành",
      "Xã Phú Tâm"
    ]
  },
  {
    "newWardId": "81608059",
    "newWardName": "Phụng Hiệp",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hòa Mỹ",
      "Xã Phụng Hiệp"
    ]
  },
  {
    "newWardId": "81505012",
    "newWardName": "Phước Thới",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31165",
      "31162"
    ],
    "oldWardNames": [
      "Phường Trường Lạc",
      "Phường Phước Thới"
    ]
  },
  {
    "newWardId": "81608056",
    "newWardName": "Phương Bình",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phương Phú",
      "Xã Phương Bình"
    ]
  },
  {
    "newWardId": "81901062",
    "newWardName": "Sóc Trăng",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường 5",
      "Phường 6",
      "Phường 7",
      "Phường 8"
    ]
  },
  {
    "newWardId": "81917098",
    "newWardName": "Tài Văn",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Viên An",
      "Xã Tài Văn"
    ]
  },
  {
    "newWardId": "81519003",
    "newWardName": "Tân An",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31149",
      "31147"
    ],
    "oldWardNames": [
      "Phường An Khánh",
      "Phường Hưng Lợi"
    ]
  },
  {
    "newWardId": "81608054",
    "newWardName": "Tân Bình",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình Thành",
      "Xã Tân Bình"
    ]
  },
  {
    "newWardId": "81603047",
    "newWardName": "Tân Hòa",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Một Ngàn",
      "Thị trấn Bảy Ngàn",
      "Xã Nhơn Nghĩa A",
      "Xã Tân Hòa"
    ]
  },
  {
    "newWardId": "81912091",
    "newWardName": "Tân Long",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thạnh Tân",
      "Xã Long Bình",
      "Xã Tân Long"
    ]
  },
  {
    "newWardId": "81503016",
    "newWardName": "Tân Lộc",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31213"
    ],
    "oldWardNames": [
      "Phường Tân Lộc"
    ]
  },
  {
    "newWardId": "81608057",
    "newWardName": "Tân Phước Hưng",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Búng Tàu",
      "Xã Tân Phước Hưng"
    ]
  },
  {
    "newWardId": "81905070",
    "newWardName": "Tân Thạnh",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31268"
    ],
    "oldWardNames": [
      "Xã Tân Hưng",
      "Xã Châu Khánh",
      "Xã Tân Thạnh"
    ]
  },
  {
    "newWardId": "81525031",
    "newWardName": "Thạnh An",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31244",
      "31243"
    ],
    "oldWardNames": [
      "Thị trấn Thạnh An",
      "Xã Thạnh Lợi",
      "Xã Thạnh Thắng"
    ]
  },
  {
    "newWardId": "81608060",
    "newWardName": "Thạnh Hòa",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Long Thạnh",
      "Xã Tân Long",
      "Xã Thạnh Hòa"
    ]
  },
  {
    "newWardId": "81527026",
    "newWardName": "Thạnh Phú",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31249"
    ],
    "oldWardNames": [
      "Xã Thạnh Phú"
    ]
  },
  {
    "newWardId": "81525032",
    "newWardName": "Thạnh Quới",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31241",
      "31240",
      "31246"
    ],
    "oldWardNames": [
      "Xã Thạnh Tiến",
      "Xã Thạnh An",
      "Xã Thạnh Quới"
    ]
  },
  {
    "newWardId": "81917097",
    "newWardName": "Thạnh Thới An",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thạnh Thới Thuận",
      "Xã Thạnh Thới An"
    ]
  },
  {
    "newWardId": "81603046",
    "newWardName": "Thạnh Xuân",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Rạch Gòi",
      "Xã Tân Phú Thạnh",
      "Xã Thạnh Xuân"
    ]
  },
  {
    "newWardId": "81503014",
    "newWardName": "Thốt Nốt",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31212",
      "31210",
      "31207"
    ],
    "oldWardNames": [
      "Phường Thuận An",
      "Phường Thới Thuận",
      "Phường Thốt Nốt"
    ]
  },
  {
    "newWardId": "81521005",
    "newWardName": "Thới An Đông",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31169",
      "31171",
      "31174"
    ],
    "oldWardNames": [
      "Phường Trà An",
      "Phường Trà Nóc",
      "Phường Thới An Đông"
    ]
  },
  {
    "newWardId": "81903076",
    "newWardName": "Thới An Hội",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Lạc Tây",
      "Xã Thới An Hội"
    ]
  },
  {
    "newWardId": "81527027",
    "newWardName": "Thới Hưng",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31264"
    ],
    "oldWardNames": [
      "Xã Thới Hưng"
    ]
  },
  {
    "newWardId": "81531020",
    "newWardName": "Thới Lai",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31258",
      "31285",
      "31286"
    ],
    "oldWardNames": [
      "Thị trấn Thới Lai",
      "Xã Thới Tân",
      "Xã Trường Thắng"
    ]
  },
  {
    "newWardId": "81505011",
    "newWardName": "Thới Long",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31157",
      "31227",
      "31156"
    ],
    "oldWardNames": [
      "Phường Long Hưng",
      "Phường Tân Hưng",
      "Phường Thới Long"
    ]
  },
  {
    "newWardId": "81915080",
    "newWardName": "Thuận Hòa",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thuận Hòa",
      "Xã Phú Tân"
    ]
  },
  {
    "newWardId": "81503015",
    "newWardName": "Thuận Hưng",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31219",
      "31228",
      "31207"
    ],
    "oldWardNames": [
      "Phường Trung Kiên",
      "Phường Thuận Hưng",
      "Phường Thốt Nốt"
    ]
  },
  {
    "newWardId": "81917101",
    "newWardName": "Trần Đề",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Trần Đề",
      "Xã Đại Ân 2",
      "Xã Trung Bình"
    ]
  },
  {
    "newWardId": "81527028",
    "newWardName": "Trung Hưng",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31225",
      "31255"
    ],
    "oldWardNames": [
      "Xã Trung Thạnh",
      "Xã Trung Hưng"
    ]
  },
  {
    "newWardId": "81503013",
    "newWardName": "Trung Nhứt",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31216",
      "31222"
    ],
    "oldWardNames": [
      "Phường Thạnh Hòa",
      "Phường Trung Nhứt",
      "Xã Trung An"
    ]
  },
  {
    "newWardId": "81905068",
    "newWardName": "Trường Khánh",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hậu Thạnh",
      "Xã Phú Hữu",
      "Xã Trường Khánh"
    ]
  },
  {
    "newWardId": "81529019",
    "newWardName": "Trường Long",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31309"
    ],
    "oldWardNames": [
      "Xã Trường Long"
    ]
  },
  {
    "newWardId": "81603048",
    "newWardName": "Trường Long Tây",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trường Long A",
      "Xã Trường Long Tây"
    ]
  },
  {
    "newWardId": "81531023",
    "newWardName": "Trường Thành",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31268",
      "31288",
      "31291"
    ],
    "oldWardNames": [
      "Xã Tân Thạnh",
      "Xã Định Môn",
      "Xã Trường Thành"
    ]
  },
  {
    "newWardId": "81531022",
    "newWardName": "Trường Xuân",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31297",
      "31298",
      "31294"
    ],
    "oldWardNames": [
      "Xã Trường Xuân A",
      "Xã Trường Xuân B",
      "Xã Trường Xuân"
    ]
  },
  {
    "newWardId": "81601035",
    "newWardName": "Vị Tân",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường IV",
      "Phường V",
      "Xã Vị Tân"
    ]
  },
  {
    "newWardId": "81601034",
    "newWardName": "Vị Thanh",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường I",
      "Phường III",
      "Phường VII"
    ]
  },
  {
    "newWardId": "81609038",
    "newWardName": "Vị Thanh 1",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vị Đông",
      "Xã Vị Bình",
      "Xã Vị Thanh"
    ]
  },
  {
    "newWardId": "81609036",
    "newWardName": "Vị Thủy",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Nàng Mau",
      "Xã Vị Thắng",
      "Xã Vị Trung"
    ]
  },
  {
    "newWardId": "81913089",
    "newWardName": "Vĩnh Châu",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường 1",
      "Phường 2",
      "Xã Lạc Hòa"
    ]
  },
  {
    "newWardId": "81913086",
    "newWardName": "Vĩnh Hải",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vĩnh Hải"
    ]
  },
  {
    "newWardId": "81911095",
    "newWardName": "Vĩnh Lợi",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Châu Hưng",
      "Xã Vĩnh Thành",
      "Xã Vĩnh Lợi"
    ]
  },
  {
    "newWardId": "81913088",
    "newWardName": "Vĩnh Phước",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Vĩnh Phước",
      "Xã Vĩnh Tân"
    ]
  },
  {
    "newWardId": "81525029",
    "newWardName": "Vĩnh Thạnh",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31232",
      "31252",
      "31234"
    ],
    "oldWardNames": [
      "Thị trấn Vĩnh Thạnh",
      "Xã Thạnh Lộc",
      "Xã Thạnh Mỹ"
    ]
  },
  {
    "newWardId": "81609037",
    "newWardName": "Vĩnh Thuận Đông",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vĩnh Thuận Tây",
      "Xã Vị Thủy",
      "Xã Vĩnh Thuận Đông"
    ]
  },
  {
    "newWardId": "81525030",
    "newWardName": "Vĩnh Trinh",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [
      "31211",
      "31237"
    ],
    "oldWardNames": [
      "Xã Vĩnh Bình",
      "Xã Vĩnh Trinh"
    ]
  },
  {
    "newWardId": "81609039",
    "newWardName": "Vĩnh Tường",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vĩnh Trung",
      "Xã Vĩnh Tường"
    ]
  },
  {
    "newWardId": "81611040",
    "newWardName": "Vĩnh Viễn",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Vĩnh Viễn",
      "Xã Vĩnh Viễn A"
    ]
  },
  {
    "newWardId": "81611041",
    "newWardName": "Xà Phiên",
    "provinceId": "15",
    "provinceName": "Cần Thơ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thuận Hòa",
      "Xã Thuận Hưng",
      "Xã Xà Phiên"
    ]
  },
  {
    "newWardId": "60311083",
    "newWardName": "An Bình",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23614",
      "24004",
      "24001"
    ],
    "oldWardNames": [
      "Phường An Bình",
      "Xã Tân An",
      "Xã Cư An"
    ]
  },
  {
    "newWardId": "50703054",
    "newWardName": "An Hòa",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Hòa",
      "Xã An Quang",
      "Xã An Nghĩa"
    ]
  },
  {
    "newWardId": "60311082",
    "newWardName": "An Khê",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23633",
      "23575",
      "23620",
      "23630",
      "23623",
      "23635"
    ],
    "oldWardNames": [
      "Phường Ngô Mây",
      "Phường Tây Sơn",
      "Phường An Phú",
      "Phường An Phước",
      "Phường An Tân",
      "Xã Thành An"
    ]
  },
  {
    "newWardId": "50703055",
    "newWardName": "An Lão",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn An Lão",
      "Xã An Tân",
      "Xã An Hưng"
    ]
  },
  {
    "newWardId": "50709027",
    "newWardName": "An Lương",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Mỹ Chánh",
      "Xã Mỹ Thành",
      "Xã Mỹ Cát"
    ]
  },
  {
    "newWardId": "50717007",
    "newWardName": "An Nhơn",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Đập Đá",
      "Xã Nhơn Mỹ",
      "Xã Nhơn Hậu"
    ]
  },
  {
    "newWardId": "50717010",
    "newWardName": "An Nhơn Bắc",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Nhơn Thành",
      "Xã Nhơn Phong",
      "Xã Nhơn Hạnh"
    ]
  },
  {
    "newWardId": "50717008",
    "newWardName": "An Nhơn Đông",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Nhơn Hưng",
      "Xã Nhơn An"
    ]
  },
  {
    "newWardId": "50717009",
    "newWardName": "An Nhơn Nam",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Nhơn Hòa",
      "Xã Nhơn Thọ"
    ]
  },
  {
    "newWardId": "50717011",
    "newWardName": "An Nhơn Tây",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nhơn Lộc",
      "Xã Nhơn Tân"
    ]
  },
  {
    "newWardId": "60301062",
    "newWardName": "An Phú",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23582",
      "23599",
      "23602"
    ],
    "oldWardNames": [
      "Phường Thắng Lợi",
      "Xã Chư Á",
      "Xã An Phú"
    ]
  },
  {
    "newWardId": "50703057",
    "newWardName": "An Toàn",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Toàn",
      "Xã An Nghĩa"
    ]
  },
  {
    "newWardId": "50703056",
    "newWardName": "An Vinh",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23830"
    ],
    "oldWardNames": [
      "Xã An Trung",
      "Xã An Dũng",
      "Xã An Vinh"
    ]
  },
  {
    "newWardId": "60305120",
    "newWardName": "Ayun",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23798",
      "23797"
    ],
    "oldWardNames": [
      "Xã Đak Jơ Ta",
      "Xã Ayun"
    ]
  },
  {
    "newWardId": "60321098",
    "newWardName": "Ayun Pa",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "24044",
      "24045",
      "24041",
      "24042"
    ],
    "oldWardNames": [
      "Phường Đoàn Kết",
      "Phường Sông Bờ",
      "Phường Cheo Reo",
      "Phường Hòa Bình"
    ]
  },
  {
    "newWardId": "50707046",
    "newWardName": "Ân Hảo",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ân Hảo Tây",
      "Xã Ân Hảo Đông",
      "Xã Ân Mỹ"
    ]
  },
  {
    "newWardId": "50707043",
    "newWardName": "Ân Tường",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ân Tường Tây",
      "Xã Ân Hữu",
      "Xã Đak Mang"
    ]
  },
  {
    "newWardId": "60317070",
    "newWardName": "Bàu Cạn",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23896",
      "23890",
      "23899"
    ],
    "oldWardNames": [
      "Xã Thăng Hưng",
      "Xã Bình Giáo",
      "Xã Bàu Cạn"
    ]
  },
  {
    "newWardId": "60301063",
    "newWardName": "Biển Hồ",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23761",
      "23692",
      "23590"
    ],
    "oldWardNames": [
      "Xã Nghĩa Hưng",
      "Xã Chư Đang Ya",
      "Xã Hà Bầu",
      "Xã Biển Hồ"
    ]
  },
  {
    "newWardId": "50715041",
    "newWardName": "Bình An",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tây Vinh",
      "Xã Tây Bình",
      "Xã Bình Hòa",
      "Xã Bình Thành"
    ]
  },
  {
    "newWardId": "50709028",
    "newWardName": "Bình Dương",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Bình Dương",
      "Xã Mỹ Lợi",
      "Xã Mỹ Phong"
    ]
  },
  {
    "newWardId": "50717006",
    "newWardName": "Bình Định",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Bình Định",
      "Xã Nhơn Khánh",
      "Xã Nhơn Phúc"
    ]
  },
  {
    "newWardId": "50715040",
    "newWardName": "Bình Hiệp",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình Thuận",
      "Xã Bình Tân",
      "Xã Tây An"
    ]
  },
  {
    "newWardId": "50715038",
    "newWardName": "Bình Khê",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tây Giang",
      "Xã Tây Thuận"
    ]
  },
  {
    "newWardId": "50715039",
    "newWardName": "Bình Phú",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vĩnh An",
      "Xã Bình Tường",
      "Xã Tây Phú"
    ]
  },
  {
    "newWardId": "50705012",
    "newWardName": "Bồng Sơn",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường hoài Đức",
      "Phường Bồng Sơn"
    ]
  },
  {
    "newWardId": "60319076",
    "newWardName": "Bờ Ngoong",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23946",
      "23944",
      "23945",
      "23947"
    ],
    "oldWardNames": [
      "Xã Bar Măih",
      "Xã Ia Tiêm",
      "Xã Chư Pơng",
      "Xã Bờ Ngoong"
    ]
  },
  {
    "newWardId": "50721049",
    "newWardName": "Canh Liên",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Canh Liên"
    ]
  },
  {
    "newWardId": "50721048",
    "newWardName": "Canh Vinh",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Canh Vinh",
      "Xã Canh Hiển",
      "Xã Canh Liên",
      "Xã Canh Hiệp"
    ]
  },
  {
    "newWardId": "50713022",
    "newWardName": "Cát Tiến",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Cát Tiến",
      "Xã Cát Thành",
      "Xã Cát Hải"
    ]
  },
  {
    "newWardId": "60313097",
    "newWardName": "Chơ Long",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23846"
    ],
    "oldWardNames": [
      "Xã Đăk Pơ Pho",
      "Xã Chơ GLong"
    ]
  },
  {
    "newWardId": "60329102",
    "newWardName": "Chư A Thai",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "24048",
      "24049",
      "24046"
    ],
    "oldWardNames": [
      "Xã Ayun Hạ",
      "Xã Ia Ake",
      "Xã Chư A Thai"
    ]
  },
  {
    "newWardId": "60313094",
    "newWardName": "Chư Krey",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23830"
    ],
    "oldWardNames": [
      "Xã An Trung",
      "Xã Chư Krey"
    ]
  },
  {
    "newWardId": "60307066",
    "newWardName": "Chư Păh",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23722",
      "23755",
      "23743"
    ],
    "oldWardNames": [
      "Thị trấn Phú Hòa",
      "Xã Nghĩa Hòa",
      "Xã Hòa Phú"
    ]
  },
  {
    "newWardId": "60317069",
    "newWardName": "Chư Prông",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23887",
      "23902",
      "23888"
    ],
    "oldWardNames": [
      "Thị trấn Chư Prông",
      "Xã Ia Phìn",
      "Xã Ia Kly",
      "Xã Ia Drang"
    ]
  },
  {
    "newWardId": "60331079",
    "newWardName": "Chư Pưh",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23980",
      "23983"
    ],
    "oldWardNames": [
      "Thị trấn Nhơn Hòa",
      "Xã Chư Don",
      "Xã Ia Phang"
    ]
  },
  {
    "newWardId": "60319075",
    "newWardName": "Chư Sê",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23941",
      "23965",
      "23962",
      "23966",
      "23950"
    ],
    "oldWardNames": [
      "Thị trấn Chư Sê",
      "Xã Dun",
      "Xã Ia Blang",
      "Xã Ia Pal",
      "Xã Ia Glai"
    ]
  },
  {
    "newWardId": "60311084",
    "newWardName": "Cửu An",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23626",
      "23627",
      "23632",
      "23629"
    ],
    "oldWardNames": [
      "Xã Tú An",
      "Xã Xuân An",
      "Xã Song An",
      "Xã Cửu An"
    ]
  },
  {
    "newWardId": "60301061",
    "newWardName": "Diên Hồng",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23557",
      "23563",
      "23560",
      "23605"
    ],
    "oldWardNames": [
      "Phường Yên Đỗ",
      "Phường Ia Kring",
      "Phường Diên Hồng",
      "Xã Diên Phú"
    ]
  },
  {
    "newWardId": "60325111",
    "newWardName": "Đak Đoa",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23704",
      "23707"
    ],
    "oldWardNames": [
      "Thị trấn Đak Đoa",
      "Xã Tân Bình",
      "Xã Glar"
    ]
  },
  {
    "newWardId": "60327085",
    "newWardName": "Đak Pơ",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23995",
      "23989",
      "23992",
      "23998"
    ],
    "oldWardNames": [
      "Thị trấn Đak Pơ",
      "Xã Hà Tam",
      "Xã An Thành",
      "Xã Yang Bắc"
    ]
  },
  {
    "newWardId": "60303091",
    "newWardName": "Đak Rong",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23641"
    ],
    "oldWardNames": [
      "Xã Kon Pne",
      "Xã Đak Rong"
    ]
  },
  {
    "newWardId": "60325115",
    "newWardName": "Đak Sơmei",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23680"
    ],
    "oldWardNames": [
      "Xã Hà Đông",
      "Xã Đak Sơmei"
    ]
  },
  {
    "newWardId": "60313096",
    "newWardName": "Đăk Song",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23843",
      "23842"
    ],
    "oldWardNames": [
      "Xã Đăk Pling",
      "Xã Đăk Song"
    ]
  },
  {
    "newWardId": "50713023",
    "newWardName": "Đề Gi",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Cát Khánh",
      "Xã Cát Minh",
      "Xã Cát Tài"
    ]
  },
  {
    "newWardId": "60315124",
    "newWardName": "Đức Cơ",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23857",
      "23878"
    ],
    "oldWardNames": [
      "Thị trấn Chư Ty",
      "Xã Ia Kriêng"
    ]
  },
  {
    "newWardId": "60301064",
    "newWardName": "Gào",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23608",
      "23791",
      "23611"
    ],
    "oldWardNames": [
      "Xã Ia Kênh",
      "Xã Ia Pếch",
      "Xã Gào"
    ]
  },
  {
    "newWardId": "50713024",
    "newWardName": "Hòa Hội",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Cát Hanh",
      "Xã Cát Hiệp"
    ]
  },
  {
    "newWardId": "50707042",
    "newWardName": "hoài Ân",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Tăng Bạt Hổ",
      "Xã Ân Phong",
      "Xã Ân Đức",
      "Xã Ân Tường Đông"
    ]
  },
  {
    "newWardId": "50705013",
    "newWardName": "hoài Nhơn",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường hoài Thanh",
      "Phường Tam Quan Nam",
      "Phường hoài Thanh Tây"
    ]
  },
  {
    "newWardId": "50705018",
    "newWardName": "hoài Nhơn Bắc",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tam Quan Bắc",
      "Xã hoài Sơn",
      "Xã hoài Châu Bắc"
    ]
  },
  {
    "newWardId": "50705015",
    "newWardName": "hoài Nhơn Đông",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường hoài Hương",
      "Xã hoài Hải",
      "Xã hoài Mỹ"
    ]
  },
  {
    "newWardId": "50705017",
    "newWardName": "hoài Nhơn Nam",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường hoài Tân",
      "Phường hoài Xuân"
    ]
  },
  {
    "newWardId": "50705016",
    "newWardName": "hoài Nhơn Tây",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường hoài Hảo",
      "Xã hoài Phú"
    ]
  },
  {
    "newWardId": "60301059",
    "newWardName": "Hội Phú",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23581",
      "23586",
      "23569"
    ],
    "oldWardNames": [
      "Phường Trà Bá",
      "Phường Chi Lăng",
      "Phường Hội Phú"
    ]
  },
  {
    "newWardId": "50713025",
    "newWardName": "Hội Sơn",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Cát Lâm",
      "Xã Cát Sơn"
    ]
  },
  {
    "newWardId": "60305119",
    "newWardName": "Hra",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23799",
      "23800"
    ],
    "oldWardNames": [
      "Xã Đak Ta Ley",
      "Xã Hra"
    ]
  },
  {
    "newWardId": "60325113",
    "newWardName": "Ia Băng",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23719",
      "23716"
    ],
    "oldWardNames": [
      "Xã Ia Băng",
      "Xã Adơk",
      "Xã Ia Pết"
    ]
  },
  {
    "newWardId": "60317071",
    "newWardName": "Ia Boòng",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23782",
      "23920",
      "23911"
    ],
    "oldWardNames": [
      "Xã Ia O",
      "Xã Ia Me",
      "Xã Ia Boòng"
    ]
  },
  {
    "newWardId": "60309133",
    "newWardName": "Ia Chia",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23788"
    ],
    "oldWardNames": [
      "Xã Ia Chia"
    ]
  },
  {
    "newWardId": "60315132",
    "newWardName": "Ia Dom",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23872"
    ],
    "oldWardNames": [
      "Xã Ia Dom"
    ]
  },
  {
    "newWardId": "60315125",
    "newWardName": "Ia Dơk",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23869",
      "23860"
    ],
    "oldWardNames": [
      "Xã Ia Kla",
      "Xã Ia Dơk"
    ]
  },
  {
    "newWardId": "60323108",
    "newWardName": "Ia Dreh",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "24115"
    ],
    "oldWardNames": [
      "Xã Ia Rmok",
      "Xã Krông Năng",
      "Xã Ia Dreh"
    ]
  },
  {
    "newWardId": "60309121",
    "newWardName": "Ia Grai",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23764",
      "23771",
      "23778"
    ],
    "oldWardNames": [
      "Thị trấn Ia Kha",
      "Xã Ia Bă",
      "Xã Ia Grăng"
    ]
  },
  {
    "newWardId": "60329103",
    "newWardName": "Ia Hiao",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "24060",
      "24058",
      "24061"
    ],
    "oldWardNames": [
      "Xã Chrôh Pơnan",
      "Xã Ia Peng",
      "Xã Ia Hiao"
    ]
  },
  {
    "newWardId": "60331081",
    "newWardName": "Ia Hrú",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23974",
      "23972",
      "23971"
    ],
    "oldWardNames": [
      "Xã Ia Dreng",
      "Xã Ia Rong",
      "Xã HBông",
      "Xã Ia Hrú"
    ]
  },
  {
    "newWardId": "60309123",
    "newWardName": "Ia Hrung",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "24073",
      "23768",
      "23785",
      "23770"
    ],
    "oldWardNames": [
      "Xã Ia Sao",
      "Xã Ia Yok",
      "Xã Ia Dêr",
      "Xã Ia Hrung"
    ]
  },
  {
    "newWardId": "60307067",
    "newWardName": "Ia Khươl",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23740",
      "23725",
      "23728"
    ],
    "oldWardNames": [
      "Xã Đăk Tơ Ver",
      "Xã Hà Tây",
      "Xã Ia Khươl"
    ]
  },
  {
    "newWardId": "60319077",
    "newWardName": "Ia Ko",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23978",
      "23977"
    ],
    "oldWardNames": [
      "Xã Ia Hlốp",
      "Xã Ia Hla",
      "Xã Ia Ko"
    ]
  },
  {
    "newWardId": "60309122",
    "newWardName": "Ia Krái",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23779",
      "23773"
    ],
    "oldWardNames": [
      "Xã Ia Tô",
      "Xã Ia Khai",
      "Xã Ia Krái"
    ]
  },
  {
    "newWardId": "60315126",
    "newWardName": "Ia Krêl",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23875",
      "23866",
      "23863"
    ],
    "oldWardNames": [
      "Xã Ia Lang",
      "Xã Ia Din",
      "Xã Ia Krêl"
    ]
  },
  {
    "newWardId": "60317072",
    "newWardName": "Ia Lâu",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23935",
      "23932"
    ],
    "oldWardNames": [
      "Xã Ia Piơr",
      "Xã Ia Lâu"
    ]
  },
  {
    "newWardId": "60331080",
    "newWardName": "Ia Le",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23986"
    ],
    "oldWardNames": [
      "Xã Ia Blứ",
      "Xã Ia Le"
    ]
  },
  {
    "newWardId": "60307065",
    "newWardName": "Ia Ly",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23734",
      "23737",
      "23738"
    ],
    "oldWardNames": [
      "Thị trấn Ia Ly",
      "Xã Ia Mơ Nông",
      "Xã Ia Kreng"
    ]
  },
  {
    "newWardId": "60317129",
    "newWardName": "Ia Mơ",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23737"
    ],
    "oldWardNames": [
      "Xã Ia Mơ Nông"
    ]
  },
  {
    "newWardId": "60315131",
    "newWardName": "Ia Nan",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23884"
    ],
    "oldWardNames": [
      "Xã Ia Nan"
    ]
  },
  {
    "newWardId": "60309134",
    "newWardName": "Ia O",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23782"
    ],
    "oldWardNames": [
      "Xã Ia O"
    ]
  },
  {
    "newWardId": "60320105",
    "newWardName": "Ia Pa",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "24022"
    ],
    "oldWardNames": [
      "Xã Ia Mrơn",
      "Xã Kim Tân",
      "Xã Ia Trôk"
    ]
  },
  {
    "newWardId": "60307068",
    "newWardName": "Ia Phí",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23749",
      "23752",
      "23731"
    ],
    "oldWardNames": [
      "Xã Ia Ka",
      "Xã Ia Nhin",
      "Xã Ia Phí"
    ]
  },
  {
    "newWardId": "60317073",
    "newWardName": "Ia Pia",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23929",
      "23923",
      "23926"
    ],
    "oldWardNames": [
      "Xã Ia Ga",
      "Xã Ia Vê",
      "Xã Ia Pia"
    ]
  },
  {
    "newWardId": "60315130",
    "newWardName": "Ia Pnôn",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23881"
    ],
    "oldWardNames": [
      "Xã Ia Pnôn"
    ]
  },
  {
    "newWardId": "60317128",
    "newWardName": "Ia Púch",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23917"
    ],
    "oldWardNames": [
      "Xã Ia Púch"
    ]
  },
  {
    "newWardId": "60321099",
    "newWardName": "Ia Rbol",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "24065"
    ],
    "oldWardNames": [
      "Xã Chư Băh",
      "Xã Ia Rbol"
    ]
  },
  {
    "newWardId": "60323109",
    "newWardName": "Ia Rsai",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "24085"
    ],
    "oldWardNames": [
      "Xã Chư RCăm",
      "Xã Chư Gu",
      "Xã Ia Rsai"
    ]
  },
  {
    "newWardId": "60321100",
    "newWardName": "Ia Sao",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "24073"
    ],
    "oldWardNames": [
      "Xã Ia Sao",
      "Xã Ia Rtô"
    ]
  },
  {
    "newWardId": "60317074",
    "newWardName": "Ia Tôr",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23719",
      "23924",
      "23908"
    ],
    "oldWardNames": [
      "Xã Ia Băng",
      "Xã Ia Bang",
      "Xã Ia Tôr"
    ]
  },
  {
    "newWardId": "60320106",
    "newWardName": "Ia Tul",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "24025",
      "24034",
      "24028"
    ],
    "oldWardNames": [
      "Xã Chư Mố",
      "Xã Ia Broăi",
      "Xã Ia Kdăm",
      "Xã Ia Tul"
    ]
  },
  {
    "newWardId": "60303087",
    "newWardName": "Kbang",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23656"
    ],
    "oldWardNames": [
      "Thị trấn Kbang",
      "Xã Lơ Ku",
      "Xã Đak Smar"
    ]
  },
  {
    "newWardId": "60325114",
    "newWardName": "KDang",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23713"
    ],
    "oldWardNames": [
      "Xã Hnol",
      "Xã Trang",
      "Xã KDang"
    ]
  },
  {
    "newWardId": "50707044",
    "newWardName": "Kim Sơn",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ân Nghĩa",
      "Xã Bok Tới"
    ]
  },
  {
    "newWardId": "60305118",
    "newWardName": "Kon Chiêng",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23818"
    ],
    "oldWardNames": [
      "Xã Đak Trôi",
      "Xã Kon Chiêng"
    ]
  },
  {
    "newWardId": "60325112",
    "newWardName": "Kon Gang",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23695",
      "23689"
    ],
    "oldWardNames": [
      "Xã Đak Krong",
      "Xã Hneng",
      "Xã Nam Yang",
      "Xã Kon Gang"
    ]
  },
  {
    "newWardId": "60303088",
    "newWardName": "Kông Bơ La",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23659",
      "23662",
      "23674"
    ],
    "oldWardNames": [
      "Xã Đông",
      "Xã Nghĩa An",
      "Xã Kông Bơ La"
    ]
  },
  {
    "newWardId": "60313092",
    "newWardName": "Kông Chro",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23824",
      "23845",
      "23854"
    ],
    "oldWardNames": [
      "Thị trấn Kông Chro",
      "Xã Yang Trung",
      "Xã Yang Nam"
    ]
  },
  {
    "newWardId": "60303135",
    "newWardName": "Krong",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23650"
    ],
    "oldWardNames": [
      "Xã KRong"
    ]
  },
  {
    "newWardId": "60305117",
    "newWardName": "Lơ Pang",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23815",
      "23812",
      "23809"
    ],
    "oldWardNames": [
      "Xã Đê Ar",
      "Xã Kon Thụp",
      "Xã Lơ Pang"
    ]
  },
  {
    "newWardId": "60305116",
    "newWardName": "Mang Yang",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23794",
      "23803",
      "23686"
    ],
    "oldWardNames": [
      "Thị trấn Kon Dơng",
      "Xã Đăk Yă",
      "Xã Đak Djrăng",
      "Xã Hải Yang"
    ]
  },
  {
    "newWardId": "50713021",
    "newWardName": "Ngô Mây",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Cát Hưng",
      "Xã Cát Thắng",
      "Xã Cát Chánh"
    ]
  },
  {
    "newWardId": "50701127",
    "newWardName": "Nhơn Châu",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nhơn Châu"
    ]
  },
  {
    "newWardId": "50713019",
    "newWardName": "Phù Cát",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Ngô Mây",
      "Xã Cát Trinh",
      "Xã Cát Tân"
    ]
  },
  {
    "newWardId": "50709026",
    "newWardName": "Phù Mỹ",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Phù Mỹ",
      "Xã Mỹ Quang",
      "Xã Mỹ Chánh Tây"
    ]
  },
  {
    "newWardId": "50709032",
    "newWardName": "Phù Mỹ Bắc",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Mỹ Đức",
      "Xã Mỹ Châu",
      "Xã Mỹ Lộc"
    ]
  },
  {
    "newWardId": "50709029",
    "newWardName": "Phù Mỹ Đông",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Mỹ An",
      "Xã Mỹ Thọ",
      "Xã Mỹ Thắng"
    ]
  },
  {
    "newWardId": "50709031",
    "newWardName": "Phù Mỹ Nam",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Mỹ Tài",
      "Xã Mỹ Hiệp"
    ]
  },
  {
    "newWardId": "50709030",
    "newWardName": "Phù Mỹ Tây",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Mỹ Trinh",
      "Xã Mỹ Hòa"
    ]
  },
  {
    "newWardId": "60329101",
    "newWardName": "Phú Thiện",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "24043",
      "24052",
      "24055",
      "24067"
    ],
    "oldWardNames": [
      "Thị trấn Phú Thiện",
      "Xã Ia Sol",
      "Xã Ia Piar",
      "Xã Ia Yeng"
    ]
  },
  {
    "newWardId": "60323107",
    "newWardName": "Phú Túc",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "24076",
      "24097",
      "24106",
      "24088"
    ],
    "oldWardNames": [
      "Thị trấn Phú Túc",
      "Xã Phú Cần",
      "Xã Chư Ngọc",
      "Xã Ia Mlah",
      "Xã Đất Bằng"
    ]
  },
  {
    "newWardId": "60301058",
    "newWardName": "Pleiku",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23575",
      "23566",
      "23572",
      "23570",
      "23596"
    ],
    "oldWardNames": [
      "Phường Tây Sơn",
      "Phường Hội Thương",
      "Phường Hoa Lư",
      "Phường Phù Đổng",
      "Xã Trà Đa"
    ]
  },
  {
    "newWardId": "60320104",
    "newWardName": "Pờ Tó",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "24016",
      "24013"
    ],
    "oldWardNames": [
      "Xã Chư Răng",
      "Xã Pờ Tó"
    ]
  },
  {
    "newWardId": "50701001",
    "newWardName": "Quy Nhơn",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23579"
    ],
    "oldWardNames": [
      "Phường Đống Đa",
      "Phường Hải Cảng",
      "Phường Thị Nại",
      "Phường Trần Phú"
    ]
  },
  {
    "newWardId": "50701005",
    "newWardName": "Quy Nhơn Bắc",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Trần Quang Diệu",
      "Phường Nhơn Phú"
    ]
  },
  {
    "newWardId": "50701002",
    "newWardName": "Quy Nhơn Đông",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Nhơn Bình",
      "Xã Nhơn Hội",
      "Xã Nhơn Lý",
      "Xã Nhơn Hải"
    ]
  },
  {
    "newWardId": "50701004",
    "newWardName": "Quy Nhơn Nam",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23633"
    ],
    "oldWardNames": [
      "Phường Ngô Mây",
      "Phường Nguyễn Văn Cừ",
      "Phường Quang Trung",
      "Phường Ghềnh Ráng"
    ]
  },
  {
    "newWardId": "50701003",
    "newWardName": "Quy Nhơn Tây",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Bùi Thị Xuân",
      "Xã Phước Mỹ"
    ]
  },
  {
    "newWardId": "60303090",
    "newWardName": "Sơn Lang",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23653",
      "23647"
    ],
    "oldWardNames": [
      "Xã Sơ Pai",
      "Xã Sơn Lang"
    ]
  },
  {
    "newWardId": "60313095",
    "newWardName": "SRó",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23839"
    ],
    "oldWardNames": [
      "Xã Đăk Kơ Ning",
      "Xã SRó"
    ]
  },
  {
    "newWardId": "50705014",
    "newWardName": "Tam Quan",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tam Quan",
      "Xã hoài Châu"
    ]
  },
  {
    "newWardId": "50715037",
    "newWardName": "Tây Sơn",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Phú Phong",
      "Xã Tây Xuân",
      "Xã Bình Nghi"
    ]
  },
  {
    "newWardId": "60301060",
    "newWardName": "Thống Nhất",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23579",
      "23584",
      "23578"
    ],
    "oldWardNames": [
      "Phường Đống Đa",
      "Phường Yên Thế",
      "Phường Thống Nhất"
    ]
  },
  {
    "newWardId": "60303089",
    "newWardName": "Tơ Tung",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23668",
      "23665"
    ],
    "oldWardNames": [
      "Xã Kông Lơng Khơng",
      "Xã Tơ Tung"
    ]
  },
  {
    "newWardId": "50719033",
    "newWardName": "Tuy Phước",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Tuy Phước",
      "Thị trấn Diêu Trì",
      "Xã Phước Thuận",
      "Xã Phước Nghĩa",
      "Xã Phước Lộc"
    ]
  },
  {
    "newWardId": "50719036",
    "newWardName": "Tuy Phước Bắc",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phước Hiệp",
      "Xã Phước Hưng",
      "Xã Phước Quang"
    ]
  },
  {
    "newWardId": "50719034",
    "newWardName": "Tuy Phước Đông",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phước Sơn",
      "Xã Phước Hòa",
      "Xã Phước Thắng"
    ]
  },
  {
    "newWardId": "50719035",
    "newWardName": "Tuy Phước Tây",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phước An",
      "Xã Phước Thành"
    ]
  },
  {
    "newWardId": "60323110",
    "newWardName": "Uar",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "24094",
      "24109"
    ],
    "oldWardNames": [
      "Xã Ia Rsươm",
      "Xã Chư Drăng",
      "Xã Uar"
    ]
  },
  {
    "newWardId": "50707045",
    "newWardName": "Vạn Đức",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ân Sơn",
      "Xã Ân Tín",
      "Xã Ân Thạnh"
    ]
  },
  {
    "newWardId": "50721047",
    "newWardName": "Vân Canh",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Vân Canh",
      "Xã Canh Thuận",
      "Xã Canh Hòa",
      "Xã Canh Hiệp"
    ]
  },
  {
    "newWardId": "50711052",
    "newWardName": "Vĩnh Quang",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vĩnh Thuận",
      "Xã Vĩnh Hòa",
      "Xã Vĩnh Quang"
    ]
  },
  {
    "newWardId": "50711053",
    "newWardName": "Vĩnh Sơn",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vĩnh Kim",
      "Xã Vĩnh Sơn"
    ]
  },
  {
    "newWardId": "50711050",
    "newWardName": "Vĩnh Thạnh",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Vĩnh Thạnh",
      "Xã Vĩnh Hảo"
    ]
  },
  {
    "newWardId": "50711051",
    "newWardName": "Vĩnh Thịnh",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vĩnh Hiệp",
      "Xã Vĩnh Thịnh"
    ]
  },
  {
    "newWardId": "50713020",
    "newWardName": "Xuân An",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Cát Nhơn",
      "Xã Cát Tường"
    ]
  },
  {
    "newWardId": "60327086",
    "newWardName": "Ya Hội",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "24007",
      "24010"
    ],
    "oldWardNames": [
      "Xã Phú An",
      "Xã Ya Hội"
    ]
  },
  {
    "newWardId": "60313093",
    "newWardName": "Ya Ma",
    "provinceId": "03",
    "provinceName": "Gia Lai",
    "oldWardIds": [
      "23836",
      "23833",
      "23848"
    ],
    "oldWardNames": [
      "Xã Đăk Tơ Pang",
      "Xã Kông Yang",
      "Xã Ya Ma"
    ]
  },
  {
    "newWardId": "41115035",
    "newWardName": "A Lưới 1",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "20104",
      "20047",
      "20056",
      "20053"
    ],
    "oldWardNames": [
      "Xã Hồng Thủy",
      "Xã Hồng Vân",
      "Xã Trung Sơn",
      "Xã Hồng Kim"
    ]
  },
  {
    "newWardId": "41115036",
    "newWardName": "A Lưới 2",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "20044",
      "20065",
      "20083",
      "20068"
    ],
    "oldWardNames": [
      "Thị trấn A Lưới",
      "Xã Hồng Bắc",
      "Xã Quảng Nhâm",
      "Xã A Ngo"
    ]
  },
  {
    "newWardId": "41115037",
    "newWardName": "A Lưới 3",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "20071",
      "20086",
      "20074",
      "20089"
    ],
    "oldWardNames": [
      "Xã Sơn Thủy",
      "Xã Hồng Thượng",
      "Xã Phú Vinh",
      "Xã Hồng Thái"
    ]
  },
  {
    "newWardId": "41115038",
    "newWardName": "A Lưới 4",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "20080",
      "20095",
      "20098",
      "20101"
    ],
    "oldWardNames": [
      "Xã Hương Phong",
      "Xã A Roàng",
      "Xã Đông Sơn",
      "Xã Lâm Đớt"
    ]
  },
  {
    "newWardId": "41115039",
    "newWardName": "A Lưới 5",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "20059",
      "20050"
    ],
    "oldWardNames": [
      "Xã Hương Nguyên",
      "Xã Hồng Hạ"
    ]
  },
  {
    "newWardId": "41101006",
    "newWardName": "An Cựu",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "19815",
      "19816",
      "19801"
    ],
    "oldWardNames": [
      "Phường An Đông",
      "Phường An Tây",
      "Phường An Cựu"
    ]
  },
  {
    "newWardId": "41107034",
    "newWardName": "Bình Điền",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "20026",
      "20041",
      "20035"
    ],
    "oldWardNames": [
      "Xã Hương Bình",
      "Xã Bình Thành",
      "Xã Bình Tiến"
    ]
  },
  {
    "newWardId": "41101040",
    "newWardName": "Dương Nỗ",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "19909"
    ],
    "oldWardNames": [
      "Phường Dương Nỗ"
    ]
  },
  {
    "newWardId": "41105021",
    "newWardName": "Đan Điền",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "19870",
      "19876",
      "19885",
      "19897"
    ],
    "oldWardNames": [
      "Xã Quảng Thái",
      "Xã Quảng Lợi",
      "Xã Quảng Vinh",
      "Xã Quảng Phú"
    ]
  },
  {
    "newWardId": "41119002",
    "newWardName": "Hóa Châu",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "20002",
      "20014",
      "19891"
    ],
    "oldWardNames": [
      "Phường Hương Phong",
      "Phường Hương Vinh",
      "Xã Quảng Thành"
    ]
  },
  {
    "newWardId": "41113027",
    "newWardName": "Hưng Lộc",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "20131",
      "20128",
      "20158"
    ],
    "oldWardNames": [
      "Thị trấn Lộc Sơn",
      "Xã Lộc Bổn",
      "Xã Xuân Lộc"
    ]
  },
  {
    "newWardId": "41119009",
    "newWardName": "Hương An",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "19803",
      "19804",
      "20023"
    ],
    "oldWardNames": [
      "Phường An Hòa",
      "Phường Hương Sơ",
      "Phường Hương An"
    ]
  },
  {
    "newWardId": "41111014",
    "newWardName": "Hương Thủy",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "19978",
      "19975",
      "19984"
    ],
    "oldWardNames": [
      "Phường Thủy Lương",
      "Phường Thủy Châu",
      "Xã Thủy Tân"
    ]
  },
  {
    "newWardId": "41107011",
    "newWardName": "Hương Trà",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "19996",
      "20011",
      "20008"
    ],
    "oldWardNames": [
      "Phường Tứ Hạ",
      "Phường Hương Văn",
      "Phường Hương Vân"
    ]
  },
  {
    "newWardId": "41113033",
    "newWardName": "Khe Tre",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "20161",
      "20164",
      "20170",
      "20185"
    ],
    "oldWardNames": [
      "Thị trấn Khe Tre",
      "Xã Hương Phú",
      "Xã Hương Lộc",
      "Xã Thượng Lộ"
    ]
  },
  {
    "newWardId": "41119008",
    "newWardName": "Kim Long",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "20029",
      "19810",
      "19774"
    ],
    "oldWardNames": [
      "Phường Long Hồ",
      "Phường Hương Long",
      "Phường Kim Long"
    ]
  },
  {
    "newWardId": "41107012",
    "newWardName": "Kim Trà",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "20017",
      "20020",
      "20005"
    ],
    "oldWardNames": [
      "Phường Hương Xuân",
      "Phường Hương Chữ",
      "Xã Hương Toàn"
    ]
  },
  {
    "newWardId": "41113031",
    "newWardName": "Long Quảng",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "20173",
      "20188",
      "20182"
    ],
    "oldWardNames": [
      "Xã Thượng Quảng",
      "Xã Thượng Long",
      "Xã Hương Hữu"
    ]
  },
  {
    "newWardId": "41113028",
    "newWardName": "Lộc An",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "20155",
      "20143",
      "20140"
    ],
    "oldWardNames": [
      "Xã Lộc Hòa",
      "Xã Lộc Điền",
      "Xã Lộc An"
    ]
  },
  {
    "newWardId": "41109003",
    "newWardName": "Mỹ Thượng",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "19930",
      "19912",
      "19927"
    ],
    "oldWardNames": [
      "Phường Phú Thượng",
      "Xã Phú An",
      "Xã Phú Mỹ"
    ]
  },
  {
    "newWardId": "41113032",
    "newWardName": "Nam Đông",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "20179",
      "20191",
      "20167"
    ],
    "oldWardNames": [
      "Xã Hương Xuân",
      "Xã Thượng Nhật",
      "Xã Hương Sơn"
    ]
  },
  {
    "newWardId": "41103018",
    "newWardName": "Phong Dinh",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "19846",
      "19831",
      "19837"
    ],
    "oldWardNames": [
      "Phường Phong Hòa",
      "Xã Phong Bình",
      "Xã Phong Chương"
    ]
  },
  {
    "newWardId": "41103016",
    "newWardName": "Phong Điền",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "19819",
      "19855",
      "19861"
    ],
    "oldWardNames": [
      "Phường Phong Thu",
      "Xã Phong Mỹ",
      "Xã Phong Xuân"
    ]
  },
  {
    "newWardId": "41103019",
    "newWardName": "Phong Phú",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "19828",
      "19825"
    ],
    "oldWardNames": [
      "Phường Phong Phú",
      "Xã Phong Thạnh"
    ]
  },
  {
    "newWardId": "41105020",
    "newWardName": "Phong Quảng",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "19843",
      "19879",
      "19873"
    ],
    "oldWardNames": [
      "Phường Phong Hải",
      "Xã Quảng Công",
      "Xã Quảng Ngạn"
    ]
  },
  {
    "newWardId": "41103017",
    "newWardName": "Phong Thái",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "19858",
      "19852",
      "19864"
    ],
    "oldWardNames": [
      "Phường Phong An",
      "Phường Phong Hiền",
      "Xã Phong Sơn"
    ]
  },
  {
    "newWardId": "41111015",
    "newWardName": "Phú Bài",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "19960",
      "19987",
      "19990",
      "19993"
    ],
    "oldWardNames": [
      "Phường Phú Bài",
      "Xã Thủy Phù",
      "Xã Phú Sơn",
      "Xã Dương Hòa"
    ]
  },
  {
    "newWardId": "41109024",
    "newWardName": "Phú Hồ",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "19918",
      "19939",
      "19933"
    ],
    "oldWardNames": [
      "Xã Phú Xuân",
      "Xã Phú Lương",
      "Xã Phú Hồ"
    ]
  },
  {
    "newWardId": "41113029",
    "newWardName": "Phú Lộc",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "20107",
      "20149",
      "20134"
    ],
    "oldWardNames": [
      "Thị trấn Phú Lộc",
      "Xã Lộc Trì",
      "Xã Lộc Bình"
    ]
  },
  {
    "newWardId": "41109025",
    "newWardName": "Phú Vang",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "19942",
      "19954",
      "19957"
    ],
    "oldWardNames": [
      "Thị trấn Phú Đa",
      "Xã Phú Gia",
      "Xã Vinh Hà"
    ]
  },
  {
    "newWardId": "41109023",
    "newWardName": "Phú Vinh",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "19921",
      "19936",
      "19948",
      "19945"
    ],
    "oldWardNames": [
      "Xã Phú Diên",
      "Xã Vinh Xuân",
      "Xã Vinh An",
      "Xã Vinh Thanh"
    ]
  },
  {
    "newWardId": "41119010",
    "newWardName": "Phú Xuân",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "19756",
      "19759",
      "19750",
      "19753",
      "19762",
      "19768"
    ],
    "oldWardNames": [
      "Phường Gia Hội",
      "Phường Phú Hậu",
      "Phường Tây Lộc",
      "Phường Thuận Lộc",
      "Phường Thuận Hòa",
      "Phường Đông Ba"
    ]
  },
  {
    "newWardId": "41105022",
    "newWardName": "Quảng Điền",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "19867",
      "19882",
      "19888",
      "19894"
    ],
    "oldWardNames": [
      "Thị trấn Sịa",
      "Xã Quảng Phước",
      "Xã Quảng An",
      "Xã Quảng Thọ"
    ]
  },
  {
    "newWardId": "41111013",
    "newWardName": "Thanh Thủy",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "19969",
      "19972",
      "19966"
    ],
    "oldWardNames": [
      "Phường Thủy Dương",
      "Phường Thủy Phương",
      "Xã Thủy Thanh"
    ]
  },
  {
    "newWardId": "41109001",
    "newWardName": "Thuận An",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "19900",
      "19915",
      "19903"
    ],
    "oldWardNames": [
      "Phường Thuận An",
      "Xã Phú Hải",
      "Xã Phú Thuận"
    ]
  },
  {
    "newWardId": "41101005",
    "newWardName": "Thuận Hóa",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "19786",
      "19789",
      "19783",
      "19798",
      "19795"
    ],
    "oldWardNames": [
      "Phường Phú Hội",
      "Phường Phú Nhuận",
      "Phường Đúc",
      "Phường Vĩnh Ninh",
      "Phường Phước Vĩnh",
      "Phường Trường An"
    ]
  },
  {
    "newWardId": "41101007",
    "newWardName": "Thủy Xuân",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "19981"
    ],
    "oldWardNames": [
      "Phường Thủy Biều",
      "Phường Thủy Bằng",
      "Phường Thủy Xuân"
    ]
  },
  {
    "newWardId": "41113026",
    "newWardName": "Vinh Lộc",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "20116",
      "20113",
      "20122",
      "20125"
    ],
    "oldWardNames": [
      "Xã Vinh Hưng",
      "Xã Vinh Mỹ",
      "Xã Giang Hải",
      "Xã Vinh Hiền"
    ]
  },
  {
    "newWardId": "41101004",
    "newWardName": "Vỹ Dạ",
    "provinceId": "11",
    "provinceName": "Huế",
    "oldWardIds": [
      "19963",
      "19792",
      "19777"
    ],
    "oldWardNames": [
      "Phường Thủy Vân",
      "Phường Xuân Phú",
      "Phường Vỹ Dạ"
    ]
  },
  {
    "newWardId": "10137105",
    "newWardName": "An Khánh",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9892",
      "9889",
      "9874",
      "9883",
      "9880"
    ],
    "oldWardNames": [
      "Xã Đông La",
      "Phường Dương Nội (phần còn lại sau khi sáp nhập vào phường Tây Mỗ",
      "phường Đại Mỗ",
      "phường Dương Nội)",
      "Xã An Khánh (phần còn lại sau khi sáp nhập vào phường Tây Mỗ",
      "xã Sơn Đồng)",
      "Xã La Phù",
      "Xã Song Phương",
      "Xã Vân Côn",
      "Xã An Thượng"
    ]
  },
  {
    "newWardId": "10101003",
    "newWardName": "Ba Đình",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "13",
      "4",
      "73",
      "19",
      "22",
      "28",
      "16",
      "112",
      "55",
      "40"
    ],
    "oldWardNames": [
      "Phường Quán Thánh",
      "Phường Trúc Bạch",
      "Phường Cửa Nam",
      "Phường Điện Biên",
      "Phường Đội Cấn",
      "Phường Kim Mã",
      "Phường Ngọc Hà",
      "Phường Thụy Khuê",
      "Phường Cửa Đông",
      "Phường Đồng Xuân"
    ]
  },
  {
    "newWardId": "10151085",
    "newWardName": "Ba Vì",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9703",
      "9712",
      "9700"
    ],
    "oldWardNames": [
      "Xã Ba Vì",
      "Xã Khánh Thượng",
      "Xã Minh Quang"
    ]
  },
  {
    "newWardId": "10107008",
    "newWardName": "Bạch Mai",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "292",
      "277",
      "289",
      "295",
      "280",
      "256",
      "232",
      "298",
      "271"
    ],
    "oldWardNames": [
      "Phường Bạch Mai",
      "Phường Bách Khoa",
      "Phường Quỳnh Mai",
      "Phường Minh Khai",
      "Phường Đồng Tâm",
      "Phường Lê Đại Hành",
      "Phường Phương Mai",
      "Phường Trương Định",
      "Phường Thanh Nhàn"
    ]
  },
  {
    "newWardId": "10119111",
    "newWardName": "Bát Tràng",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "589",
      "154",
      "565",
      "577"
    ],
    "oldWardNames": [
      "Xã Kim Đức",
      "Phường Cự Khối",
      "Phường Thạch Bàn (phần còn lại sau khi sáp nhập vào phường Long Biên",
      "phường Phúc Lợi",
      "xã Gia Lâm)",
      "Thị trấn Trâu Quỳ",
      "Xã Đa Tốn",
      "Xã Bát Tràng (phần còn lại sau khi sáp nhập vào phường Long Biên",
      "xã Gia Lâm)"
    ]
  },
  {
    "newWardId": "10151083",
    "newWardName": "Bất Bạt",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9691",
      "9670",
      "9676",
      "9673",
      "9700"
    ],
    "oldWardNames": [
      "Xã Thuần Mỹ",
      "Xã Tòng Bạt",
      "Xã Sơn Đà",
      "Xã Cẩm Lĩnh",
      "Xã Minh Quang"
    ]
  },
  {
    "newWardId": "10141062",
    "newWardName": "Bình Minh",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "10126",
      "10135",
      "10132",
      "10141",
      "10063",
      "10120"
    ],
    "oldWardNames": [
      "Xã Bích Hòa",
      "Xã Bình Minh",
      "Xã Cao Viên",
      "Xã Thanh Cao",
      "Xã Lam Điền",
      "Xã Cự Khê",
      "Phường Phú Lương (phần còn lại sau khi sáp nhập vào phường Phú Lương",
      "phường Kiến Hưng)"
    ]
  },
  {
    "newWardId": "10106040",
    "newWardName": "Bồ Đề",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "133",
      "124",
      "130",
      "115",
      "151",
      "118",
      "145"
    ],
    "oldWardNames": [
      "Phường Ngọc Lâm",
      "Phường Đức Giang",
      "Phường Gia Thụy",
      "Phường Thượng Thanh",
      "Phường Phúc Đồng",
      "Phường Ngọc Thụy",
      "Phường Bồ Đề (phần còn lại sau khi sáp nhập vào phường Hồng Hà",
      "phường Long Biên)",
      "Phường Long Biên"
    ]
  },
  {
    "newWardId": "10113025",
    "newWardName": "Cầu Giấy",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "166",
      "167",
      "169",
      "625",
      "626"
    ],
    "oldWardNames": [
      "Phường Dịch Vọng",
      "Phường Dịch Vọng Hậu",
      "Phường Quan Hoa",
      "Phường Mỹ Đình 1",
      "Phường Mỹ Đình 2",
      "Phường Yên Hòa"
    ]
  },
  {
    "newWardId": "10149059",
    "newWardName": "Chuyên Mỹ",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "415",
      "10348",
      "10339",
      "10330",
      "10321"
    ],
    "oldWardNames": [
      "Xã Tân Dân",
      "Xã Châu Can",
      "Xã Phú Yên",
      "Xã Vân Từ",
      "Xã Chuyên Mỹ"
    ]
  },
  {
    "newWardId": "10143055",
    "newWardName": "Chương Dương",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "10237",
      "10243",
      "10246",
      "10219",
      "10258",
      "10264"
    ],
    "oldWardNames": [
      "Xã Chương Dương",
      "Xã Lê Lợi",
      "Xã Thắng Lợi",
      "Xã Tự Nhiên",
      "Xã Tô Hiệu",
      "Xã Vạn Nhất"
    ]
  },
  {
    "newWardId": "10153073",
    "newWardName": "Chương Mỹ",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "10123",
      "10015",
      "10054",
      "10042",
      "10021",
      "10024",
      "10117"
    ],
    "oldWardNames": [
      "Phường Biên Giang",
      "Thị trấn Chúc Sơn",
      "Xã Đại Yên",
      "Xã Ngọc Hòa",
      "Xã Phụng Châu",
      "Xã Tiên Phương",
      "Xã Thuỵ Hương",
      "Phường Đồng Mai"
    ]
  },
  {
    "newWardId": "10151082",
    "newWardName": "Cổ Đô",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "442",
      "9628",
      "9640",
      "9646",
      "9643",
      "9634"
    ],
    "oldWardNames": [
      "Xã Phú Cường",
      "Xã Cổ Đô",
      "Xã Phong Vân",
      "Xã Phú Hồng",
      "Xã Phú Đông",
      "Xã Vạn Thắng"
    ]
  },
  {
    "newWardId": "10105002",
    "newWardName": "Cửa Nam",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "88",
      "85",
      "82",
      "73",
      "241",
      "247",
      "76",
      "70",
      "79"
    ],
    "oldWardNames": [
      "Phường Hàng Bài",
      "Phường Phan Chu Trinh",
      "Phường Trần Hưng Đạo",
      "Phường Cửa Nam",
      "Phường Nguyễn Du",
      "Phường Phạm Đình Hổ",
      "Phường Hàng Bông",
      "Phường Hàng Trống",
      "Phường Tràng Tiền"
    ]
  },
  {
    "newWardId": "10141064",
    "newWardName": "Dân Hòa",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "10174",
      "10180",
      "10171",
      "10165",
      "10168"
    ],
    "oldWardNames": [
      "Xã Cao Xuân Dương",
      "Xã Hồng Dương",
      "Xã Liên Châu",
      "Xã Tân Ước",
      "Xã Dân Hòa"
    ]
  },
  {
    "newWardId": "10137103",
    "newWardName": "Dương Hòa",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9850",
      "9841",
      "9865",
      "9838",
      "9856"
    ],
    "oldWardNames": [
      "Xã Cát Quế",
      "Xã Dương Liễu",
      "Xã Đắc Sở",
      "Xã Minh Khai",
      "Xã Yên Sở"
    ]
  },
  {
    "newWardId": "10127044",
    "newWardName": "Dương Nội",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9886",
      "9552",
      "9562",
      "9889",
      "9551"
    ],
    "oldWardNames": [
      "Phường Dương Nội",
      "Phường Phú La",
      "Phường Yên Nghĩa",
      "Xã La Phù",
      "Phường Đại Mỗ (phần còn lại sau khi sáp nhập vào phường Xuân Phương",
      "phường Tây Mỗ",
      "phường Đại Mỗ",
      "phường Hà Đông)",
      "Phường La Khê"
    ]
  },
  {
    "newWardId": "10115123",
    "newWardName": "Đa Phúc",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "403",
      "439",
      "394",
      "421",
      "424",
      "451"
    ],
    "oldWardNames": [
      "Xã Bắc Phú",
      "Xã Đức Hòa",
      "Xã Kim Lũ",
      "Xã Tân Hưng",
      "Xã Việt Long",
      "Xã Xuân Giang",
      "Xã Xuân Thu"
    ]
  },
  {
    "newWardId": "10155038",
    "newWardName": "Đại Mỗ",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "634",
      "9886",
      "9541",
      "632",
      "637"
    ],
    "oldWardNames": [
      "Phường Đại Mỗ",
      "Phường Dương Nội",
      "Phường Mộ Lao",
      "Phường Mễ Trì (phần còn lại sau khi sáp nhập vào phường Yên Hòa",
      "phường Từ Liêm)",
      "Phường Nhân Chính (phần còn lại sau khi sáp nhập vào phường Thanh Xuân",
      "phường Yên Hòa)",
      "Phường Trung Hòa (phần còn lại sau khi sáp nhập vào phường Thanh Xuân",
      "phường Yên Hòa)",
      "Phường Phú Đô",
      "Phường Trung Văn"
    ]
  },
  {
    "newWardId": "10123049",
    "newWardName": "Đại Thanh",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "655",
      "649",
      "664"
    ],
    "oldWardNames": [
      "Xã Tam Hiệp",
      "Xã Hữu Hòa",
      "Phường Kiến Hưng (phần còn lại sau khi sáp nhập vào phường Phú Lương",
      "phường Kiến Hưng)",
      "Thị trấn Văn Điển (phần còn lại sau khi sáp nhập vào phường Hoàng Liệt",
      "xã Thanh Trì)",
      "Xã Tả Thanh Oai",
      "Xã Vĩnh Quỳnh"
    ]
  },
  {
    "newWardId": "10149060",
    "newWardName": "Đại Xuyên",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "10342",
      "10324",
      "10351",
      "10327",
      "10345",
      "10333",
      "10336"
    ],
    "oldWardNames": [
      "Xã Bạch Hạ",
      "Xã Khai Thái",
      "Xã Minh Tân",
      "Xã Phúc Tiến",
      "Xã Quang Lãng",
      "Xã Tri Thủy",
      "Xã Đại Xuyên"
    ]
  },
  {
    "newWardId": "10133106",
    "newWardName": "Đan Phượng",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9784",
      "9826",
      "9829",
      "9814",
      "9823"
    ],
    "oldWardNames": [
      "Thị trấn Phùng",
      "Xã Đồng Tháp",
      "Xã Song Phượng",
      "Xã Thượng Mỗ",
      "Xã Đan Phượng"
    ]
  },
  {
    "newWardId": "10108019",
    "newWardName": "Định Công",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "307",
      "337",
      "331",
      "643",
      "646",
      "316"
    ],
    "oldWardNames": [
      "Phường Định Công",
      "Phường Hoàng Liệt",
      "Phường Thịnh Liệt",
      "Xã Tân Triều",
      "Xã Thanh Liệt",
      "Phường Đại Kim",
      "Phường Giáp Bát (phần còn lại sau khi sáp nhập vào phường Hoàng Mai",
      "phường Tương Mai)"
    ]
  },
  {
    "newWardId": "10129089",
    "newWardName": "Đoài Phương",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9610",
      "9613",
      "9616"
    ],
    "oldWardNames": [
      "Xã Kim Sơn",
      "Xã Sơn Đông",
      "Xã Cổ Đông"
    ]
  },
  {
    "newWardId": "10117114",
    "newWardName": "Đông Anh",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "505",
      "523",
      "520",
      "454",
      "517",
      "472",
      "502",
      "511",
      "484",
      "496",
      "478",
      "487"
    ],
    "oldWardNames": [
      "Xã Cổ Loa",
      "Xã Đông Hội",
      "Xã Mai Lâm",
      "Thị trấn Đông Anh",
      "Xã Tàm Xá",
      "Xã Tiên Dương",
      "Xã Vĩnh Ngọc",
      "Xã Xuân Canh",
      "Xã Liên Hà",
      "Xã Dục Tú",
      "Xã Uy Nỗ",
      "Xã Việt Hùng"
    ]
  },
  {
    "newWardId": "10109009",
    "newWardName": "Đống Đa",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "235",
      "214",
      "199",
      "208",
      "190",
      "217"
    ],
    "oldWardNames": [
      "Phường Thịnh Quang",
      "Phường Quang Trung",
      "Phường Láng Hạ",
      "Phường Nam Đồng",
      "Phường Ô Chợ Dừa",
      "Phường Trung Liệt"
    ]
  },
  {
    "newWardId": "10157033",
    "newWardName": "Đông Ngạc",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "602",
      "617",
      "604",
      "295",
      "601"
    ],
    "oldWardNames": [
      "Phường Đức Thắng",
      "Phường Cổ Nhuế 2",
      "Phường Thụy Phương",
      "Phường Minh Khai",
      "Phường Đông Ngạc",
      "Phường Xuân Đỉnh (phần còn lại sau khi sáp nhập vào phường Phú Thượng",
      "phường Xuân Đỉnh)"
    ]
  },
  {
    "newWardId": "10119109",
    "newWardName": "Gia Lâm",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "571",
      "580",
      "565",
      "148",
      "562",
      "553",
      "577",
      "583"
    ],
    "oldWardNames": [
      "Xã Dương Xá",
      "Xã Kiêu Kỵ",
      "Thị trấn Trâu Quỳ",
      "Phường Thạch Bàn",
      "Xã Phú Sơn",
      "Xã Cổ Bi",
      "Xã Đa Tốn",
      "Xã Bát Tràng"
    ]
  },
  {
    "newWardId": "10101005",
    "newWardName": "Giảng Võ",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "31",
      "178",
      "199",
      "25",
      "34",
      "7"
    ],
    "oldWardNames": [
      "Phường Giảng Võ",
      "Phường Cát Linh",
      "Phường Láng Hạ",
      "Phường Ngọc Khánh",
      "Phường Thành Công",
      "Phường Cống Vị",
      "Phường Kim Mã (phần còn lại sau khi sáp nhập vào phường Ba Đình",
      "phường Ngọc Hà)"
    ]
  },
  {
    "newWardId": "10135094",
    "newWardName": "Hạ Bằng",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9991",
      "10012",
      "9982",
      "10009",
      "10000",
      "9922"
    ],
    "oldWardNames": [
      "Xã Cần Kiệm",
      "Xã Đồng Trúc",
      "Xã Bình Yên",
      "Xã Hạ Bằng",
      "Xã Tân Xã",
      "Xã Phú Cát"
    ]
  },
  {
    "newWardId": "10127043",
    "newWardName": "Hà Đông",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9553",
      "9544",
      "214",
      "634",
      "9556",
      "9551",
      "9542",
      "643",
      "9541"
    ],
    "oldWardNames": [
      "Phường Phúc La",
      "Phường Vạn Phúc",
      "Phường Quang Trung",
      "Phường Đại Mỗ",
      "Phường Hà Cầu",
      "Phường La Khê",
      "Phường Văn Quán",
      "Xã Tân Triều",
      "Phường Mộ Lao"
    ]
  },
  {
    "newWardId": "10107006",
    "newWardName": "Hai Bà Trưng",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "259",
      "262",
      "244",
      "256",
      "241",
      "271",
      "247"
    ],
    "oldWardNames": [
      "Phường Đồng Nhân",
      "Phường Phố Huế",
      "Phường Bạch Đằng",
      "Phường Lê Đại Hành",
      "Phường Nguyễn Du",
      "Phường Thanh Nhàn",
      "Phường Phạm Đình Hổ"
    ]
  },
  {
    "newWardId": "10131092",
    "newWardName": "Hát Môn",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "655",
      "9778",
      "9781",
      "9766",
      "9772",
      "9757",
      "9751"
    ],
    "oldWardNames": [
      "Xã Tam Hiệp",
      "Xã Hiệp Thuận",
      "Xã Liên Hiệp",
      "Xã Ngọc Tảo",
      "Xã Tam Thuấn",
      "Xã Thanh Đa",
      "Xã Hát Môn"
    ]
  },
  {
    "newWardId": "10135096",
    "newWardName": "Hòa Lạc",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "4936",
      "9616",
      "9982",
      "10009",
      "10000"
    ],
    "oldWardNames": [
      "Xã Tiến Xuân",
      "Xã Thạch Hòa",
      "Xã Cổ Đông",
      "Xã Bình Yên",
      "Xã Hạ Bằng",
      "Xã Tân Xã"
    ]
  },
  {
    "newWardId": "10153077",
    "newWardName": "Hòa Phú",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "10108",
      "10105",
      "10096",
      "10090",
      "10102",
      "10159"
    ],
    "oldWardNames": [
      "Xã Hòa Phú",
      "Xã Đồng Lạc",
      "Xã Hồng Phú",
      "Xã Thượng Vực",
      "Xã Văn Võ",
      "Xã Kim Thư"
    ]
  },
  {
    "newWardId": "10147067",
    "newWardName": "Hòa Xá",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "10108",
      "9652",
      "10435",
      "10429"
    ],
    "oldWardNames": [
      "Xã Hòa Phú",
      "Xã Thái Hòa",
      "Xã Bình Lưu Quang",
      "Xã Phù Lưu"
    ]
  },
  {
    "newWardId": "10137102",
    "newWardName": "hoài Đức",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9832",
      "9844",
      "9847",
      "9835",
      "607",
      "9820",
      "493"
    ],
    "oldWardNames": [
      "Thị trấn Trạm Trôi",
      "Xã Di Trạch",
      "Xã Đức Giang",
      "Xã Đức Thượng",
      "Phường Tây Tựu",
      "Xã Tân Lập",
      "Xã Kim Chung"
    ]
  },
  {
    "newWardId": "10105001",
    "newWardName": "Hoàn Kiếm",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "61",
      "52",
      "46",
      "49",
      "64",
      "43",
      "58",
      "55",
      "73",
      "19",
      "40",
      "76",
      "70",
      "79"
    ],
    "oldWardNames": [
      "Phường Hàng Bạc",
      "Phường Hàng Bồ",
      "Phường Hàng Buồm",
      "Phường Hàng Đào",
      "Phường Hàng Gai",
      "Phường Hàng Mã",
      "Phường Lý Thái Tổ",
      "Phường Cửa Đông",
      "Phường Cửa Nam",
      "Phường Điện Biên",
      "Phường Đồng Xuân",
      "Phường Hàng Bông",
      "Phường Hàng Trống",
      "Phường Tràng Tiền"
    ]
  },
  {
    "newWardId": "10123020",
    "newWardName": "Hoàng Liệt",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "337",
      "640",
      "655",
      "646",
      "316"
    ],
    "oldWardNames": [
      "Phường Hoàng Liệt",
      "Thị trấn Văn Điển",
      "Xã Tam Hiệp",
      "Xã Thanh Liệt",
      "Phường Đại Kim"
    ]
  },
  {
    "newWardId": "10108016",
    "newWardName": "Hoàng Mai",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "325",
      "337",
      "322",
      "328",
      "319",
      "331",
      "313",
      "334",
      "304",
      "340"
    ],
    "oldWardNames": [
      "Phường Giáp Bát",
      "Phường Hoàng Liệt",
      "Phường Hoàng Văn Thụ",
      "Phường Lĩnh Nam",
      "Phường Tân Mai",
      "Phường Thịnh Liệt",
      "Phường Tương Mai",
      "Phường Trần Phú",
      "Phường Vĩnh Hưng",
      "Phường Yên Sở"
    ]
  },
  {
    "newWardId": "10103014",
    "newWardName": "Hồng Hà",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "67",
      "37",
      "1",
      "94",
      "91",
      "100",
      "268",
      "97",
      "106",
      "139",
      "118",
      "244"
    ],
    "oldWardNames": [
      "Phường Chương Dương",
      "Phường Phúc Tân",
      "Phường Phúc Xá",
      "Phường Nhật Tân",
      "Phường Phú Thượng",
      "Phường Quảng An",
      "Phường Thanh Lương",
      "Phường Tứ Liên",
      "Phường Yên Phụ",
      "Phường Bồ Đề",
      "Phường Ngọc Thụy",
      "Phường Bạch Đằng"
    ]
  },
  {
    "newWardId": "10145070",
    "newWardName": "Hồng Sơn",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9997",
      "10462",
      "10498",
      "10468",
      "10471",
      "10465"
    ],
    "oldWardNames": [
      "Xã Phùng Xá",
      "Xã An Mỹ",
      "Xã Hợp Tiến",
      "Xã Lê Thanh",
      "Xã Xuy Xá",
      "Xã Hồng Sơn"
    ]
  },
  {
    "newWardId": "10143056",
    "newWardName": "Hồng Vân",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "10225",
      "10207",
      "10213",
      "10210",
      "10186",
      "685"
    ],
    "oldWardNames": [
      "Xã Hà Hồi",
      "Xã Hồng Vân",
      "Xã Liên Phương",
      "Xã Vân Tảo",
      "Xã Duyên Thái (phần còn lại sau khi sáp nhập vào xã Nam Phù",
      "xã Ngọc Hồi)",
      "Xã Ninh Sở",
      "Xã Đông Mỹ"
    ]
  },
  {
    "newWardId": "10139099",
    "newWardName": "Hưng Đạo",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9931",
      "9919",
      "9934"
    ],
    "oldWardNames": [
      "Xã Cộng Hòa",
      "Xã Đồng Quang",
      "Xã Hưng Đạo"
    ]
  },
  {
    "newWardId": "10145072",
    "newWardName": "Hương Sơn",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "10495",
      "10492",
      "10483",
      "10489"
    ],
    "oldWardNames": [
      "Xã An Tiến",
      "Xã Hùng Tiến",
      "Xã Vạn Tín",
      "Xã Hương Sơn"
    ]
  },
  {
    "newWardId": "10111023",
    "newWardName": "Khương Đình",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "373",
      "364",
      "349",
      "316",
      "643",
      "355",
      "346"
    ],
    "oldWardNames": [
      "Phường Hạ Đình",
      "Phường Khương Đình",
      "Phường Khương Trung",
      "Phường Đại Kim",
      "Xã Tân Triều",
      "Phường Thanh Xuân Trung",
      "Phường Thượng Đình"
    ]
  },
  {
    "newWardId": "10127047",
    "newWardName": "Kiến Hưng",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9565",
      "9571",
      "214",
      "9556",
      "9552"
    ],
    "oldWardNames": [
      "Phường Kiến Hưng",
      "Phường Phú Lương",
      "Phường Quang Trung",
      "Phường Hà Cầu",
      "Phường Phú La"
    ]
  },
  {
    "newWardId": "10139100",
    "newWardName": "Kiều Phú",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9943",
      "9928",
      "9925",
      "9907",
      "10006",
      "9910"
    ],
    "oldWardNames": [
      "Xã Cấn Hữu",
      "Xã Liệp Nghĩa",
      "Xã Tuyết Nghĩa",
      "Xã Ngọc Liệp",
      "Xã Quang Trung",
      "Xã Ngọc Mỹ"
    ]
  },
  {
    "newWardId": "10115126",
    "newWardName": "Kim Anh",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "415",
      "397",
      "382"
    ],
    "oldWardNames": [
      "Xã Tân Dân",
      "Xã Minh Phú",
      "Xã Minh Trí"
    ]
  },
  {
    "newWardId": "10109010",
    "newWardName": "Kim Liên",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "229",
      "238",
      "208",
      "226",
      "217",
      "232",
      "214"
    ],
    "oldWardNames": [
      "Phường Kim Liên",
      "Phường Khương Thượng",
      "Phường Nam Đồng",
      "Phường Phương Liên - Trung Tự",
      "Phường Trung Liệt",
      "Phường Phương Mai",
      "Phường Quang Trung"
    ]
  },
  {
    "newWardId": "10109012",
    "newWardName": "Láng",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "187"
    ],
    "oldWardNames": [
      "Phường Láng Thượng",
      "Phường Láng Hạ (phần còn lại sau khi sáp nhập vào phường Giảng Võ",
      "phường Đống Đa)",
      "Phường Ngọc Khánh (phần còn lại sau khi sáp nhập vào phường Ngọc Hà",
      "phường Giảng Võ)"
    ]
  },
  {
    "newWardId": "10133108",
    "newWardName": "Liên Minh",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9811",
      "9787",
      "9793",
      "9790",
      "9796",
      "9007"
    ],
    "oldWardNames": [
      "Xã Phương Đình",
      "Xã Trung Châu",
      "Xã Thọ Xuân",
      "Xã Thọ An",
      "Xã Hồng Hà",
      "Xã Tiến Thịnh"
    ]
  },
  {
    "newWardId": "10108015",
    "newWardName": "Lĩnh Nam",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "328",
      "301",
      "334",
      "340"
    ],
    "oldWardNames": [
      "Phường Lĩnh Nam",
      "Phường Thanh Trì",
      "Phường Trần Phú",
      "Phường Yên Sở",
      "Phường Thanh Lương (phần còn lại sau khi sáp nhập vào phường Vĩnh Tuy",
      "phường Hồng Hà)"
    ]
  },
  {
    "newWardId": "10106039",
    "newWardName": "Long Biên",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "154",
      "151",
      "148",
      "583",
      "145",
      "139",
      "130"
    ],
    "oldWardNames": [
      "Phường Cự Khối",
      "Phường Phúc Đồng",
      "Phường Thạch Bàn",
      "Xã Bát Tràng",
      "Phường Long Biên",
      "Phường Bồ Đề",
      "Phường Gia Thụy"
    ]
  },
  {
    "newWardId": "10125118",
    "newWardName": "Mê Linh",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9022",
      "9019",
      "9013",
      "9010",
      "8974",
      "9796",
      "484",
      "9799",
      "9808",
      "499"
    ],
    "oldWardNames": [
      "Xã Tráng Việt",
      "Xã Tiền Phong",
      "Xã Văn Khê",
      "Xã Mê Linh",
      "Xã Đại Thịnh",
      "Xã Hồng Hà",
      "Xã Liên Hà",
      "Xã Liên Hồng",
      "Xã Liên Trung",
      "Xã Đại Mạch"
    ]
  },
  {
    "newWardId": "10151079",
    "newWardName": "Minh Châu",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9661",
      "9619",
      "9667"
    ],
    "oldWardNames": [
      "Xã Minh Châu",
      "Thị trấn Tây Đằng",
      "Xã Chu Minh"
    ]
  },
  {
    "newWardId": "10145069",
    "newWardName": "Mỹ Đức",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "10441",
      "10504",
      "10480",
      "10501",
      "10477"
    ],
    "oldWardNames": [
      "Thị trấn Đại Nghĩa",
      "Xã An Phú",
      "Xã Đại Hưng",
      "Xã Hợp Thanh",
      "Xã Phù Lưu Tế"
    ]
  },
  {
    "newWardId": "10123050",
    "newWardName": "Nam Phù",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "676",
      "682",
      "10186",
      "685",
      "10192",
      "667",
      "661",
      "670"
    ],
    "oldWardNames": [
      "Xã Vạn Phúc",
      "Xã Liên Ninh",
      "Xã Ninh Sở",
      "Xã Đông Mỹ",
      "Xã Duyên Thái",
      "Xã Ngũ Hiệp",
      "Xã Yên Mỹ",
      "Xã Duyên Hà"
    ]
  },
  {
    "newWardId": "10113026",
    "newWardName": "Nghĩa Đô",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "160",
      "616",
      "163",
      "157",
      "103",
      "611",
      "166",
      "167",
      "169"
    ],
    "oldWardNames": [
      "Phường Nghĩa Tân",
      "Phường Cổ Nhuế 1",
      "Phường Mai Dịch",
      "Phường Nghĩa Đô",
      "Phường Xuân La",
      "Phường Xuân Tảo",
      "Phường Dịch Vọng",
      "Phường Dịch Vọng Hậu",
      "Phường Quan Hoa"
    ]
  },
  {
    "newWardId": "10101004",
    "newWardName": "Ngọc Hà",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "6",
      "8",
      "7",
      "28",
      "25",
      "157",
      "22",
      "16"
    ],
    "oldWardNames": [
      "Phường Vĩnh Phúc",
      "Phường Liễu Giai",
      "Phường Cống Vị",
      "Phường Kim Mã",
      "Phường Ngọc Khánh",
      "Phường Nghĩa Đô",
      "Phường Đội Cấn",
      "Phường Ngọc Hà"
    ]
  },
  {
    "newWardId": "10123051",
    "newWardName": "Ngọc Hồi",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "673",
      "10192",
      "10195",
      "682"
    ],
    "oldWardNames": [
      "Xã Ngọc Hồi",
      "Xã Duyên Thái",
      "Xã Đại Áng",
      "Xã Khánh Hà",
      "Xã Liên Ninh"
    ]
  },
  {
    "newWardId": "10115124",
    "newWardName": "Nội Bài",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "442",
      "412",
      "433",
      "427",
      "445",
      "409"
    ],
    "oldWardNames": [
      "Xã Phú Cường",
      "Xã Hiền Ninh",
      "Xã Thanh Xuân",
      "Xã Mai Đình",
      "Xã Phú Minh",
      "Xã Quang Tiến"
    ]
  },
  {
    "newWardId": "10109013",
    "newWardName": "Ô Chợ Dừa",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "178",
      "34",
      "190",
      "196"
    ],
    "oldWardNames": [
      "Phường Cát Linh",
      "Phường Điện Biên (phần còn lại sau khi sáp nhập vào phường Hoàn Kiếm",
      "phường Ba Đình",
      "phường Văn Miếu Quốc Tử Giám)",
      "Phường Thành Công",
      "Phường Ô Chợ Dừa",
      "Phường Trung Liệt (phần còn lại sau khi sáp nhập vào phường Đống Đa",
      "phường Kim Liên)",
      "Phường Hàng Bột",
      "Phường Văn Miếu Quốc Tử Giám"
    ]
  },
  {
    "newWardId": "10133107",
    "newWardName": "Ô Diên",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9805",
      "9817",
      "484",
      "9796",
      "9799",
      "9808",
      "9820"
    ],
    "oldWardNames": [
      "Xã Hạ Mỗ",
      "Xã Tân Hội",
      "Xã Liên Hà",
      "Xã Hồng Hà",
      "Xã Liên Hồng",
      "Xã Liên Trung",
      "Phường Tây Tựu (phần còn lại sau khi sáp nhập vào phường Tây Tựu",
      "phường Đông Ngạc",
      "phường Thượng Cát",
      "xã hoài Đức)",
      "Xã Tân Lập"
    ]
  },
  {
    "newWardId": "10139101",
    "newWardName": "Phú Cát",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9952",
      "9949",
      "9940",
      "9922"
    ],
    "oldWardNames": [
      "Xã Đông Yên",
      "Xã Hòa Thạch",
      "Xã Phú Mãn",
      "Xã Phú Cát"
    ]
  },
  {
    "newWardId": "10157031",
    "newWardName": "Phú Diễn",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "619",
      "616",
      "163",
      "620"
    ],
    "oldWardNames": [
      "Phường Phú Diễn",
      "Phường Cổ Nhuế 1",
      "Phường Mai Dịch",
      "Phường Phúc Diễn"
    ]
  },
  {
    "newWardId": "10119112",
    "newWardName": "Phù Đổng",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "526",
      "535",
      "544",
      "541",
      "529",
      "532",
      "556"
    ],
    "oldWardNames": [
      "Thị trấn Yên Viên",
      "Xã Ninh Hiệp",
      "Xã Phù Đổng",
      "Xã Thiên Đức",
      "Xã Yên Thường",
      "Xã Yên Viên",
      "Xã Cổ Bi (phần còn lại sau khi sáp nhập vào phường Phúc Lợi",
      "xã Gia Lâm)",
      "Xã Đặng Xá"
    ]
  },
  {
    "newWardId": "10127046",
    "newWardName": "Phú Lương",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9568",
      "9565",
      "9571",
      "10120"
    ],
    "oldWardNames": [
      "Phường Phú Lãm",
      "Phường Kiến Hưng",
      "Phường Phú Lương",
      "Xã Cự Khê",
      "Xã Hữu Hòa"
    ]
  },
  {
    "newWardId": "10153074",
    "newWardName": "Phú Nghĩa",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "10030",
      "10027",
      "10048",
      "10051",
      "10039",
      "10033"
    ],
    "oldWardNames": [
      "Xã Đông Phương Yên",
      "Xã Đông Sơn",
      "Xã Thanh Bình",
      "Xã Trung Hòa",
      "Xã Trường Yên",
      "Xã Phú Nghĩa"
    ]
  },
  {
    "newWardId": "10157029",
    "newWardName": "Phú Thượng",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "601",
      "103",
      "610",
      "611"
    ],
    "oldWardNames": [
      "Phường Đông Ngạc",
      "Phường Xuân La",
      "Phường Xuân Đỉnh",
      "Phường Xuân Tảo",
      "Phường Phú Thượng (phần còn lại sau khi sáp nhập vào phường Hồng Hà",
      "phường Tây Hồ)"
    ]
  },
  {
    "newWardId": "10149057",
    "newWardName": "Phú Xuyên",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "10270",
      "10273",
      "10300",
      "10267",
      "10312",
      "10282",
      "10318",
      "10261",
      "10258",
      "10264"
    ],
    "oldWardNames": [
      "Thị trấn Phú Minh",
      "Thị trấn Phú Xuyên",
      "Xã Hồng Thái",
      "Xã Minh Cường",
      "Xã Nam Phong",
      "Xã Nam Tiến",
      "Xã Quang Hà",
      "Xã Văn Tự",
      "Xã Tô Hiệu",
      "Xã Vạn Nhất"
    ]
  },
  {
    "newWardId": "10131091",
    "newWardName": "Phúc Lộc",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9724",
      "9733",
      "9721",
      "9739",
      "9727"
    ],
    "oldWardNames": [
      "Xã Nam Hà",
      "Xã Sen Phương",
      "Xã Vân Phúc",
      "Xã Võng Xuyên",
      "Xã Xuân Đình"
    ]
  },
  {
    "newWardId": "10106042",
    "newWardName": "Phúc Lợi",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "148",
      "553",
      "121",
      "127",
      "136"
    ],
    "oldWardNames": [
      "Phường Thạch Bàn",
      "Xã Cổ Bi",
      "Phường Giang Biên",
      "Phường Việt Hưng",
      "Phường Phúc Lợi",
      "Phường Phúc Đồng (phần còn lại sau khi sáp nhập vào phường Long Biên",
      "phường Bồ Đề",
      "phường Việt Hưng)"
    ]
  },
  {
    "newWardId": "10145071",
    "newWardName": "Phúc Sơn",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "10459",
      "10453",
      "10447",
      "10450",
      "10444"
    ],
    "oldWardNames": [
      "Xã Mỹ Xuyên",
      "Xã Phúc Lâm",
      "Xã Thượng Lâm",
      "Xã Tuy Lai",
      "Xã Đồng Tâm"
    ]
  },
  {
    "newWardId": "10117115",
    "newWardName": "Phúc Thịnh",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "463",
      "469",
      "481",
      "502",
      "466",
      "457",
      "472"
    ],
    "oldWardNames": [
      "Xã Bắc Hồng",
      "Xã Nam Hồng",
      "Xã Vân Nội",
      "Xã Vĩnh Ngọc",
      "Xã Nguyên Khê",
      "Xã Xuân Nộn",
      "Xã Tiên Dương",
      "Thị trấn Đông Anh (phần còn lại sau khi sáp nhập vào xã Thư Lâm",
      "xã Đông Anh)"
    ]
  },
  {
    "newWardId": "10131090",
    "newWardName": "Phúc Thọ",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9715",
      "9745",
      "9763",
      "9769",
      "9742",
      "9760"
    ],
    "oldWardNames": [
      "Thị trấn Phúc Thọ",
      "Xã Long Thượng",
      "Xã Phúc Hòa",
      "Xã Phụng Thượng",
      "Xã Tích Lộc",
      "Xã Trạch Mỹ Lộc"
    ]
  },
  {
    "newWardId": "10149058",
    "newWardName": "Phượng Dực",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "10303",
      "10276",
      "10294",
      "10291",
      "10279"
    ],
    "oldWardNames": [
      "Xã Hoàng Long",
      "Xã Hồng Minh",
      "Xã Phú Túc",
      "Xã Văn Hoàng",
      "Xã Phượng Dực"
    ]
  },
  {
    "newWardId": "10111024",
    "newWardName": "Phương Liệt",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "352",
      "358",
      "307",
      "364",
      "349"
    ],
    "oldWardNames": [
      "Phường Khương Mai",
      "Phường Thịnh Liệt (phần còn lại sau khi sáp nhập vào phường Hoàng Mai",
      "phường Định Công",
      "phường Yên Sở)",
      "Phường Phương Liệt",
      "Phường Định Công",
      "Phường Khương Đình",
      "Phường Khương Trung"
    ]
  },
  {
    "newWardId": "10153078",
    "newWardName": "Quảng Bị",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "10078",
      "10072",
      "10084",
      "10060",
      "10063"
    ],
    "oldWardNames": [
      "Xã Hoàng Diệu",
      "Xã Hợp Đồng",
      "Xã Quảng Bị",
      "Xã Tốt Động",
      "Xã Lam Điền"
    ]
  },
  {
    "newWardId": "10125121",
    "newWardName": "Quang Minh",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "8973",
      "8989",
      "9010",
      "8977",
      "8992"
    ],
    "oldWardNames": [
      "Thị trấn Chi Đông",
      "Thị trấn Quang Minh",
      "Xã Mê Linh",
      "Xã Tiền Phong (phần còn lại sau khi sáp nhập vào xã Thiên Lộc",
      "xã Mê Linh)",
      "Xã Đại Thịnh (phần còn lại sau khi sáp nhập vào xã Mê Linh",
      "xã Tiến Thắng)",
      "Xã Kim Hoa",
      "Xã Thanh Lâm"
    ]
  },
  {
    "newWardId": "10151080",
    "newWardName": "Quảng Oai",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9688",
      "9679",
      "9682",
      "9685",
      "9619",
      "9667"
    ],
    "oldWardNames": [
      "Xã Cam Thượng",
      "Xã Đông Quang",
      "Xã Tiên Phong",
      "Xã Thụy An",
      "Thị trấn Tây Đằng",
      "Xã Chu Minh"
    ]
  },
  {
    "newWardId": "10139098",
    "newWardName": "Quốc Oai",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9916",
      "9898",
      "9910",
      "9895",
      "9904"
    ],
    "oldWardNames": [
      "Xã Thạch Thán",
      "Xã Sài Sơn",
      "Xã Ngọc Mỹ",
      "Thị trấn Quốc Oai",
      "Xã Phượng Sơn"
    ]
  },
  {
    "newWardId": "10115122",
    "newWardName": "Sóc Sơn",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "376",
      "406",
      "436",
      "448",
      "400",
      "418",
      "427",
      "445",
      "409"
    ],
    "oldWardNames": [
      "Thị trấn Sóc Sơn",
      "Xã Tân Minh",
      "Xã Đông Xuân",
      "Xã Phù Lỗ",
      "Xã Phù Linh",
      "Xã Tiên Dược",
      "Xã Mai Đình",
      "Xã Phú Minh",
      "Xã Quang Tiến"
    ]
  },
  {
    "newWardId": "10137104",
    "newWardName": "Sơn Đồng",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9868",
      "9859",
      "9871",
      "9877",
      "9874",
      "9883",
      "9880",
      "9862"
    ],
    "oldWardNames": [
      "Xã Lại Yên",
      "Xã Sơn Đồng",
      "Xã Tiền Yên",
      "Xã An Khánh",
      "Xã Song Phương",
      "Xã Vân Côn",
      "Xã An Thượng",
      "Xã Vân Canh"
    ]
  },
  {
    "newWardId": "10129087",
    "newWardName": "Sơn Tây",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9574",
      "9577",
      "9595",
      "9592",
      "9601",
      "9586",
      "9604"
    ],
    "oldWardNames": [
      "Phường Ngô Quyền",
      "Phường Phú Thịnh",
      "Phường Viên Sơn",
      "Xã Đường Lâm",
      "Phường Trung Hưng",
      "Phường Sơn Lộc",
      "Xã Thanh Mỹ"
    ]
  },
  {
    "newWardId": "10151084",
    "newWardName": "Suối Hai",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9697",
      "9694",
      "9685",
      "9673"
    ],
    "oldWardNames": [
      "Xã Ba Trại",
      "Xã Tản Lĩnh",
      "Xã Thụy An",
      "Xã Cẩm Lĩnh"
    ]
  },
  {
    "newWardId": "10141063",
    "newWardName": "Tam Hưng",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "10129",
      "10144",
      "10150",
      "10138"
    ],
    "oldWardNames": [
      "Xã Mỹ Hưng",
      "Xã Thanh Thùy",
      "Xã Thanh Văn",
      "Xã Tam Hưng"
    ]
  },
  {
    "newWardId": "10103028",
    "newWardName": "Tây Hồ",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "109",
      "91",
      "103",
      "94",
      "100",
      "97",
      "106",
      "112"
    ],
    "oldWardNames": [
      "Phường Bưởi",
      "Phường Phú Thượng",
      "Phường Xuân La",
      "Phường Nhật Tân",
      "Phường Quảng An",
      "Phường Tứ Liên",
      "Phường Yên Phụ",
      "Phường Nghĩa Đô (phần còn lại sau khi sáp nhập vào phường Ngọc Hà",
      "phường Nghĩa Đô)",
      "Phường Thụy Khuê"
    ]
  },
  {
    "newWardId": "10155037",
    "newWardName": "Tây Mỗ",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "634",
      "9886",
      "9877",
      "628"
    ],
    "oldWardNames": [
      "Phường Đại Mỗ",
      "Phường Dương Nội",
      "Xã An Khánh",
      "Phường Tây Mỗ"
    ]
  },
  {
    "newWardId": "10135095",
    "newWardName": "Tây Phương",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9997",
      "9970",
      "9973",
      "10003",
      "10006",
      "9895",
      "9907",
      "9904"
    ],
    "oldWardNames": [
      "Xã Phùng Xá",
      "Xã Hương Ngải",
      "Xã Lam Sơn",
      "Xã Thạch Xá",
      "Xã Quang Trung",
      "Thị trấn Quốc Oai",
      "Xã Ngọc Liệp",
      "Xã Phượng Sơn"
    ]
  },
  {
    "newWardId": "10157030",
    "newWardName": "Tây Tựu",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "295",
      "607",
      "493"
    ],
    "oldWardNames": [
      "Phường Minh Khai",
      "Phường Tây Tựu",
      "Xã Kim Chung"
    ]
  },
  {
    "newWardId": "10135093",
    "newWardName": "Thạch Thất",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9955",
      "9961",
      "9958",
      "9976",
      "9964",
      "9967"
    ],
    "oldWardNames": [
      "Thị trấn Liên Quan",
      "Xã Cẩm Yên",
      "Xã Đại Đồng",
      "Xã Kim Quan",
      "Xã Lại Thượng",
      "Xã Phú Kim"
    ]
  },
  {
    "newWardId": "10123052",
    "newWardName": "Thanh Liệt",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "649",
      "367",
      "373",
      "9542"
    ],
    "oldWardNames": [
      "Xã Tả Thanh Oai",
      "Phường Đại Kim (phần còn lại sau khi sáp nhập vào phường Định Công",
      "phường Hoàng Liệt",
      "phường Khương Đình)",
      "Phường Thanh Xuân Bắc",
      "Phường Hạ Đình",
      "Phường Văn Quán",
      "Xã Thanh Liệt (phần còn lại sau khi sáp nhập vào phường Định Công",
      "phường Hoàng Liệt)",
      "Xã Tân Triều (phần còn lại sau khi sáp nhập vào phường Định Công",
      "phường Khương Đình",
      "phường Hà Đông)"
    ]
  },
  {
    "newWardId": "10141061",
    "newWardName": "Thanh Oai",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "10114",
      "10153",
      "10156",
      "10162",
      "10147",
      "10159"
    ],
    "oldWardNames": [
      "Thị trấn Kim Bài",
      "Xã Đỗ Động",
      "Xã Kim An",
      "Xã Phương Trung",
      "Xã Thanh Mai",
      "Xã Kim Thư"
    ]
  },
  {
    "newWardId": "10123048",
    "newWardName": "Thanh Trì",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "640",
      "667",
      "664",
      "661",
      "670",
      "658"
    ],
    "oldWardNames": [
      "Thị trấn Văn Điển",
      "Xã Ngũ Hiệp",
      "Xã Vĩnh Quỳnh",
      "Xã Yên Mỹ",
      "Xã Duyên Hà",
      "Xã Tứ Hiệp",
      "Phường Yên Sở (phần còn lại sau khi sáp nhập vào phường Lĩnh Nam",
      "phường Hoàng Mai",
      "phường Yên Sở)"
    ]
  },
  {
    "newWardId": "10111022",
    "newWardName": "Thanh Xuân",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "343",
      "367",
      "355",
      "346",
      "637"
    ],
    "oldWardNames": [
      "Phường Nhân Chính",
      "Phường Thanh Xuân Bắc",
      "Phường Thanh Xuân Trung",
      "Phường Thượng Đình",
      "Phường Trung Hòa",
      "Phường Trung Văn"
    ]
  },
  {
    "newWardId": "10117116",
    "newWardName": "Thiên Lộc",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "514",
      "493",
      "499",
      "490",
      "9019",
      "508"
    ],
    "oldWardNames": [
      "Xã Võng La",
      "Xã Kim Chung",
      "Xã Đại Mạch",
      "Xã Kim Nỗ",
      "Xã Tiền Phong",
      "Xã Hải Bối"
    ]
  },
  {
    "newWardId": "10119110",
    "newWardName": "Thuận An",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "568",
      "550",
      "556",
      "562"
    ],
    "oldWardNames": [
      "Xã Dương Quang",
      "Xã Lệ Chi",
      "Xã Đặng Xá",
      "Xã Phú Sơn"
    ]
  },
  {
    "newWardId": "10117113",
    "newWardName": "Thư Lâm",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "475",
      "457",
      "454",
      "484",
      "496",
      "466",
      "478",
      "487"
    ],
    "oldWardNames": [
      "Xã Thụy Lâm",
      "Xã Vân Hà",
      "Xã Xuân Nộn",
      "Thị trấn Đông Anh",
      "Xã Liên Hà",
      "Xã Dục Tú",
      "Xã Nguyên Khê",
      "Xã Uy Nỗ",
      "Xã Việt Hùng"
    ]
  },
  {
    "newWardId": "10157034",
    "newWardName": "Thượng Cát",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "598",
      "595",
      "295",
      "607",
      "617",
      "604"
    ],
    "oldWardNames": [
      "Phường Liên Mạc",
      "Phường Thượng Cát",
      "Phường Minh Khai",
      "Phường Tây Tựu",
      "Phường Cổ Nhuế 2",
      "Phường Thụy Phương"
    ]
  },
  {
    "newWardId": "10143053",
    "newWardName": "Thượng Phúc",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "406",
      "10249",
      "10234",
      "10255",
      "10231"
    ],
    "oldWardNames": [
      "Xã Tân Minh",
      "Xã Dũng Tiến",
      "Xã Quất Động",
      "Xã Nghiêm Xuyên",
      "Xã Nguyễn Trãi"
    ]
  },
  {
    "newWardId": "10143054",
    "newWardName": "Thường Tín",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "10183",
      "9019",
      "10204",
      "10198",
      "10189",
      "10201",
      "10216",
      "10195"
    ],
    "oldWardNames": [
      "Thị trấn Thường Tín",
      "Xã Tiền Phong",
      "Xã Hiền Giang",
      "Xã Hòa Bình",
      "Xã Nhị Khê",
      "Xã Văn Bình",
      "Xã Văn Phú",
      "Xã Đại Áng",
      "Xã Khánh Hà"
    ]
  },
  {
    "newWardId": "10125120",
    "newWardName": "Tiến Thắng",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "8995",
      "8983",
      "8986",
      "8974",
      "8977",
      "8992",
      "8980"
    ],
    "oldWardNames": [
      "Xã Tam Đồng",
      "Xã Tiến Thắng",
      "Xã Tự Lập",
      "Xã Đại Thịnh",
      "Xã Kim Hoa",
      "Xã Thanh Lâm",
      "Xã Văn Khê (phần còn lại sau khi sáp nhập vào xã Ô Diên",
      "xã Mê Linh",
      "xã Yên Lãng)",
      "Xã Thạch Đà"
    ]
  },
  {
    "newWardId": "10153076",
    "newWardName": "Trần Phú",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "10075",
      "10081",
      "10087",
      "10099",
      "10444",
      "10066"
    ],
    "oldWardNames": [
      "Xã Hoàng Văn Thụ",
      "Xã Hữu Văn",
      "Xã Mỹ Lương",
      "Xã Trần Phú",
      "Xã Đồng Tâm",
      "Xã Tân Tiến"
    ]
  },
  {
    "newWardId": "10115125",
    "newWardName": "Trung Giã",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "379",
      "385",
      "388",
      "391"
    ],
    "oldWardNames": [
      "Xã Bắc Sơn",
      "Xã Hồng Kỳ",
      "Xã Nam Sơn",
      "Xã Trung Giã"
    ]
  },
  {
    "newWardId": "10129088",
    "newWardName": "Tùng Thiện",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9589",
      "9607",
      "9598",
      "9601",
      "9586",
      "9604"
    ],
    "oldWardNames": [
      "Phường Xuân Khanh",
      "Phường Trung Sơn Trầm",
      "Xã Xuân Sơn",
      "Phường Trung Hưng",
      "Phường Sơn Lộc",
      "Xã Thanh Mỹ"
    ]
  },
  {
    "newWardId": "10155035",
    "newWardName": "Từ Liêm",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "592",
      "631",
      "632",
      "625",
      "626"
    ],
    "oldWardNames": [
      "Phường Cầu Diễn",
      "Phường Mễ Trì",
      "Phường Phú Đô",
      "Phường Mai Dịch (phần còn lại sau khi sáp nhập vào phường Nghĩa Đô",
      "phường Phú Diễn)",
      "Phường Mỹ Đình 1",
      "Phường Mỹ Đình 2"
    ]
  },
  {
    "newWardId": "10108018",
    "newWardName": "Tương Mai",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "325",
      "358",
      "310",
      "295",
      "280",
      "298",
      "322",
      "319",
      "313"
    ],
    "oldWardNames": [
      "Phường Giáp Bát",
      "Phường Phương Liệt",
      "Phường Mai Động",
      "Phường Minh Khai",
      "Phường Đồng Tâm",
      "Phường Trương Định",
      "Phường Hoàng Văn Thụ",
      "Phường Tân Mai",
      "Phường Tương Mai",
      "Phường Vĩnh Hưng (phần còn lại sau khi sáp nhập vào phường Vĩnh Tuy",
      "phường Hoàng Mai",
      "phường Vĩnh Hưng)"
    ]
  },
  {
    "newWardId": "10147068",
    "newWardName": "Ứng Hòa",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "10432",
      "10423",
      "10426",
      "10390",
      "10411",
      "10399",
      "10402",
      "10387"
    ],
    "oldWardNames": [
      "Xã Đại Cường",
      "Xã Đại Hùng",
      "Xã Đông Lỗ",
      "Xã Đồng Tân",
      "Xã Kim Đường",
      "Xã Minh Đức",
      "Xã Trầm Lộng",
      "Xã Trung Tú"
    ]
  },
  {
    "newWardId": "10147066",
    "newWardName": "Ứng Thiên",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "10363",
      "10375",
      "10366",
      "10369"
    ],
    "oldWardNames": [
      "Xã Hoa Viên",
      "Xã Liên Bạt",
      "Xã Quảng Phú Cầu",
      "Xã Trường Thịnh"
    ]
  },
  {
    "newWardId": "10109011",
    "newWardName": "Văn Miếu - Quốc Tử Giám",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "202",
      "205",
      "193",
      "19",
      "196",
      "181",
      "226"
    ],
    "oldWardNames": [
      "Phường Khâm Thiên",
      "Phường Thổ Quan",
      "Phường Văn Chương",
      "Phường Điện Biên",
      "Phường Hàng Bột",
      "Phường Văn Miếu - Quốc Tử Giám",
      "Phường Cửa Nam (phần còn lại sau khi sáp nhập vào phường Hoàn Kiếm",
      "phường Cửa Nam",
      "phường Ba Đình)",
      "Phường Lê Đại Hành (phần còn lại sau khi sáp nhập vào phường Hai Bà Trưng",
      "phường Bạch Mai)",
      "Phường Nam Đồng (phần còn lại sau khi sáp nhập vào phường Đống Đa",
      "phường Kim Liên)",
      "Phường Nguyễn Du (phần còn lại sau khi sáp nhập vào phường Cửa Nam",
      "phường Hai Bà Trưng)",
      "Phường Phương Liên - Trung Tự"
    ]
  },
  {
    "newWardId": "10147065",
    "newWardName": "Vân Đình",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "10354",
      "10378",
      "10384",
      "10393"
    ],
    "oldWardNames": [
      "Thị trấn Vân Đình",
      "Xã Cao Sơn Tiến",
      "Xã Phương Tú",
      "Xã Tảo Dương Văn"
    ]
  },
  {
    "newWardId": "10151081",
    "newWardName": "Vật Lại",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9652",
      "562",
      "9655",
      "9649",
      "9664"
    ],
    "oldWardNames": [
      "Xã Thái Hòa",
      "Xã Phú Sơn",
      "Xã Đồng Thái",
      "Xã Phú Châu",
      "Xã Vật Lại"
    ]
  },
  {
    "newWardId": "10106041",
    "newWardName": "Việt Hưng",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "121",
      "151",
      "127",
      "136",
      "124",
      "115"
    ],
    "oldWardNames": [
      "Phường Giang Biên",
      "Phường Phúc Đồng",
      "Phường Việt Hưng",
      "Phường Phúc Lợi",
      "Phường Gia Thụy (phần còn lại sau khi sáp nhập vào phường Long Biên",
      "phường Bồ Đề)",
      "Phường Đức Giang",
      "Phường Thượng Thanh"
    ]
  },
  {
    "newWardId": "10108017",
    "newWardName": "Vĩnh Hưng",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "304",
      "301",
      "283"
    ],
    "oldWardNames": [
      "Phường Vĩnh Hưng",
      "Phường Lĩnh Nam (phần còn lại sau khi sáp nhập vào phường Lĩnh Nam",
      "phường Hoàng Mai)",
      "Phường Thanh Trì",
      "Phường Vĩnh Tuy"
    ]
  },
  {
    "newWardId": "10117117",
    "newWardName": "Vĩnh Thanh",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "517",
      "511",
      "493",
      "508",
      "490"
    ],
    "oldWardNames": [
      "Xã Tàm Xá",
      "Xã Xuân Canh",
      "Xã Vĩnh Ngọc (phần còn lại sau khi sáp nhập vào xã Đông Anh",
      "xã Phúc Thịnh)",
      "Xã Kim Chung",
      "Xã Hải Bối",
      "Xã Kim Nỗ"
    ]
  },
  {
    "newWardId": "10107007",
    "newWardName": "Vĩnh Tuy",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "310",
      "268",
      "304",
      "283"
    ],
    "oldWardNames": [
      "Phường Mai Động",
      "Phường Thanh Lương",
      "Phường Vĩnh Hưng",
      "Phường Vĩnh Tuy"
    ]
  },
  {
    "newWardId": "10157032",
    "newWardName": "Xuân Đỉnh",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "610"
    ],
    "oldWardNames": [
      "Phường Xuân Đỉnh",
      "Phường Cổ Nhuế 1 (phần còn lại sau khi sáp nhập vào phường Nghĩa Đô",
      "phường Phú Diễn)",
      "Phường Xuân La (phần còn lại sau khi sáp nhập vào phường Nghĩa Đô",
      "phường Tây Hồ",
      "phường Phú Thượng)",
      "Phường Xuân Tảo (phần còn lại sau khi sáp nhập vào phường Nghĩa Đô",
      "phường Phú Thượng)"
    ]
  },
  {
    "newWardId": "10153075",
    "newWardName": "Xuân Mai",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "10018",
      "10069",
      "10045",
      "10066"
    ],
    "oldWardNames": [
      "Thị trấn Xuân Mai",
      "Xã Nam Phương Tiến",
      "Xã Thủy Xuân Tiên",
      "Xã Tân Tiến"
    ]
  },
  {
    "newWardId": "10155036",
    "newWardName": "Xuân Phương",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "623",
      "622",
      "634",
      "628",
      "9862",
      "620"
    ],
    "oldWardNames": [
      "Phường Phương Canh",
      "Phường Xuân Phương",
      "Phường Đại Mỗ",
      "Phường Tây Mỗ",
      "Xã Vân Canh",
      "Phường Minh Khai (phần còn lại sau khi sáp nhập vào phường Tây Tựu",
      "phường Đông Ngạc",
      "phường Thượng Cát)",
      "Phường Phúc Diễn"
    ]
  },
  {
    "newWardId": "10151086",
    "newWardName": "Yên Bài",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9706",
      "9709"
    ],
    "oldWardNames": [
      "Xã Vân Hòa",
      "Xã Yên Bài",
      "Xã Thạch Hòa"
    ]
  },
  {
    "newWardId": "10113027",
    "newWardName": "Yên Hòa",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "631",
      "343"
    ],
    "oldWardNames": [
      "Phường Mễ Trì",
      "Phường Nhân Chính",
      "Phường Trung Hòa",
      "Phường Yên Hòa"
    ]
  },
  {
    "newWardId": "10125119",
    "newWardName": "Yên Lãng",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "9004",
      "9016",
      "8998",
      "8980",
      "9013",
      "9007",
      "9787",
      "9793",
      "9790"
    ],
    "oldWardNames": [
      "Xã Chu Phan",
      "Xã Hoàng Kim",
      "Xã Liên Mạc",
      "Xã Thạch Đà",
      "Xã Văn Khê",
      "Xã Tiến Thịnh",
      "Xã Trung Châu",
      "Xã Thọ Xuân",
      "Xã Thọ An",
      "Xã Hồng Hà (phần còn lại sau khi sáp nhập vào xã Liên Minh",
      "xã Mê Linh)"
    ]
  },
  {
    "newWardId": "10127045",
    "newWardName": "Yên Nghĩa",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "10117",
      "9562"
    ],
    "oldWardNames": [
      "Phường Đồng Mai",
      "Phường Yên Nghĩa"
    ]
  },
  {
    "newWardId": "10108021",
    "newWardName": "Yên Sở",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "331",
      "340",
      "658"
    ],
    "oldWardNames": [
      "Phường Thịnh Liệt",
      "Phường Yên Sở",
      "Xã Tứ Hiệp",
      "Phường Hoàng Liệt (phần còn lại sau khi sáp nhập vào phường Hoàng Mai",
      "phường Định Công",
      "phường Hoàng Liệt)",
      "Phường Trần Phú (phần còn lại sau khi sáp nhập vào phường Lĩnh Nam",
      "phường Hoàng Mai)"
    ]
  },
  {
    "newWardId": "10135097",
    "newWardName": "Yên Xuân",
    "provinceId": "01",
    "provinceName": "Hà Nội",
    "oldWardIds": [
      "436",
      "4930",
      "4927",
      "4936"
    ],
    "oldWardNames": [
      "Xã Đông Xuân",
      "Xã Yên Bình",
      "Xã Yên Trung",
      "Xã Tiến Xuân",
      "Xã Thạch Hòa (phần còn lại sau khi sáp nhập vào xã Yên Bài",
      "xã Hòa Lạc)"
    ]
  },
  {
    "newWardId": "40503040",
    "newWardName": "Bắc Hồng Lĩnh",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18115",
      "18124",
      "18121",
      "18400"
    ],
    "oldWardNames": [
      "Phường Bắc Hồng",
      "Phường Đức Thuận",
      "Phường Trung Lương",
      "Xã Xuân Lam"
    ]
  },
  {
    "newWardId": "40511034",
    "newWardName": "Can Lộc",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18406",
      "18415",
      "18427"
    ],
    "oldWardNames": [
      "Thị trấn Nghèn",
      "Xã Thiên Lộc",
      "Xã Vượng Lộc"
    ]
  },
  {
    "newWardId": "40501025",
    "newWardName": "Cẩm Bình",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18691",
      "18112",
      "18694",
      "18685"
    ],
    "oldWardNames": [
      "Xã Cẩm Vịnh",
      "Xã Thạch Bình",
      "Xã Cẩm Thành",
      "Xã Cẩm Bình"
    ]
  },
  {
    "newWardId": "40515014",
    "newWardName": "Cẩm Duệ",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18739",
      "18706",
      "18715"
    ],
    "oldWardNames": [
      "Xã Cẩm Mỹ",
      "Xã Cẩm Thạch",
      "Xã Cẩm Duệ"
    ]
  },
  {
    "newWardId": "40515015",
    "newWardName": "Cẩm Hưng",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18736",
      "18727",
      "18733"
    ],
    "oldWardNames": [
      "Xã Cẩm Thịnh",
      "Xã Cẩm Hà",
      "Xã Cẩm Hưng"
    ]
  },
  {
    "newWardId": "40515016",
    "newWardName": "Cẩm Lạc",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18751",
      "18745",
      "18748"
    ],
    "oldWardNames": [
      "Xã Cẩm Minh",
      "Xã Cẩm Sơn",
      "Xã Cẩm Lạc"
    ]
  },
  {
    "newWardId": "40515017",
    "newWardName": "Cẩm Trung",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18721",
      "18730",
      "18742"
    ],
    "oldWardNames": [
      "Xã Cẩm Lĩnh",
      "Xã Cẩm Lộc",
      "Xã Cẩm Trung"
    ]
  },
  {
    "newWardId": "40515012",
    "newWardName": "Cẩm Xuyên",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18673",
      "18697",
      "18724"
    ],
    "oldWardNames": [
      "Thị trấn Cẩm Xuyên",
      "Xã Cẩm Quang",
      "Xã Cẩm Quan"
    ]
  },
  {
    "newWardId": "40505044",
    "newWardName": "Cổ Đạm",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18403",
      "18394"
    ],
    "oldWardNames": [
      "Xã Cương Gián",
      "Xã Xuân Liên",
      "Xã Cổ Đạm"
    ]
  },
  {
    "newWardId": "40505045",
    "newWardName": "Đan Hải",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18358",
      "18367",
      "18355",
      "18364"
    ],
    "oldWardNames": [
      "Xã Đan Trường",
      "Xã Xuân Hải",
      "Xã Xuân Hội",
      "Xã Xuân Phổ"
    ]
  },
  {
    "newWardId": "40513029",
    "newWardName": "Đông Kinh",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18586",
      "18592",
      "18457"
    ],
    "oldWardNames": [
      "Xã Thạch Kênh",
      "Xã Thạch Liên",
      "Xã Ích Hậu"
    ]
  },
  {
    "newWardId": "40511039",
    "newWardName": "Đồng Lộc",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18484",
      "18478",
      "18487"
    ],
    "oldWardNames": [
      "Thị trấn Đồng Lộc",
      "Xã Thượng Lộc",
      "Xã Mỹ Lộc"
    ]
  },
  {
    "newWardId": "40501023",
    "newWardName": "Đồng Tiến",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18619",
      "18649",
      "18631"
    ],
    "oldWardNames": [
      "Xã Thạch Trị",
      "Xã Thạch Hội",
      "Xã Thạch Văn"
    ]
  },
  {
    "newWardId": "40507048",
    "newWardName": "Đức Đồng",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18307",
      "18310",
      "18304"
    ],
    "oldWardNames": [
      "Xã Đức Lạng",
      "Xã Tân Hương",
      "Xã Đức Đồng"
    ]
  },
  {
    "newWardId": "40507050",
    "newWardName": "Đức Minh",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18244",
      "18241",
      "18247"
    ],
    "oldWardNames": [
      "Xã Trường Sơn",
      "Xã Tùng Châu",
      "Xã Liên Minh"
    ]
  },
  {
    "newWardId": "40507047",
    "newWardName": "Đức Quang",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18235",
      "18262",
      "18253"
    ],
    "oldWardNames": [
      "Xã Quang Vĩnh",
      "Xã Bùi La Nhân",
      "Xã Yên Hồ"
    ]
  },
  {
    "newWardId": "40507049",
    "newWardName": "Đức Thịnh",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18274",
      "18277",
      "18298"
    ],
    "oldWardNames": [
      "Xã Thanh Bình Thịnh",
      "Xã Lâm Trung Thủy",
      "Xã An Dũng"
    ]
  },
  {
    "newWardId": "40507046",
    "newWardName": "Đức Thọ",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18229",
      "18259",
      "18280",
      "18283"
    ],
    "oldWardNames": [
      "Thị trấn Đức Thọ",
      "Xã Tùng Ảnh",
      "Xã Hòa Lạc",
      "Xã Tân Dân"
    ]
  },
  {
    "newWardId": "40511036",
    "newWardName": "Gia Hanh",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18466",
      "18433",
      "18463"
    ],
    "oldWardNames": [
      "Xã Khánh Vĩnh Yên",
      "Xã Thanh Lộc",
      "Xã Gia Hanh"
    ]
  },
  {
    "newWardId": "40501021",
    "newWardName": "Hà Huy Tập",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18652",
      "18643",
      "18082"
    ],
    "oldWardNames": [
      "Xã Tân Lâm Hương",
      "Xã Thạch Đài",
      "Phường Đại Nài"
    ]
  },
  {
    "newWardId": "40517064",
    "newWardName": "Hà Linh",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18499",
      "18502"
    ],
    "oldWardNames": [
      "Xã Điền Mỹ",
      "Xã Hà Linh"
    ]
  },
  {
    "newWardId": "40520002",
    "newWardName": "Hải Ninh",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18781",
      "18808",
      "18802"
    ],
    "oldWardNames": [
      "Phường Kỳ Ninh",
      "Xã Kỳ Hà",
      "Xã Kỳ Hải"
    ]
  },
  {
    "newWardId": "40520003",
    "newWardName": "Hoành Sơn",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18847",
      "18832",
      "18841",
      "18796"
    ],
    "oldWardNames": [
      "Phường Kỳ Nam",
      "Phường Kỳ Phương",
      "Phường Kỳ Liên",
      "Xã Kỳ Lợi"
    ]
  },
  {
    "newWardId": "40513032",
    "newWardName": "Hồng Lộc",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18409",
      "18412"
    ],
    "oldWardNames": [
      "Xã Tân Lộc",
      "Xã Hồng Lộc"
    ]
  },
  {
    "newWardId": "40517065",
    "newWardName": "Hương Bình",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18508",
      "18514",
      "18523"
    ],
    "oldWardNames": [
      "Xã Hòa Hải",
      "Xã Phúc Đồng",
      "Xã Hương Bình"
    ]
  },
  {
    "newWardId": "40517063",
    "newWardName": "Hương Đô",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18520",
      "18550",
      "18538"
    ],
    "oldWardNames": [
      "Xã Lộc Yên",
      "Xã Hương Trà",
      "Xã Hương Đô"
    ]
  },
  {
    "newWardId": "40517061",
    "newWardName": "Hương Khê",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18496",
      "18526",
      "18529"
    ],
    "oldWardNames": [
      "Thị trấn Hương Khê",
      "Xã Hương Long",
      "Xã Phú Gia"
    ]
  },
  {
    "newWardId": "40517062",
    "newWardName": "Hương Phố",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18517",
      "18505",
      "18532"
    ],
    "oldWardNames": [
      "Xã Hương Giang",
      "Xã Hương Thủy",
      "Xã Gia Phố"
    ]
  },
  {
    "newWardId": "40509051",
    "newWardName": "Hương Sơn",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18133",
      "18217",
      "18190",
      "18175",
      "18187"
    ],
    "oldWardNames": [
      "Thị trấn Phố Châu",
      "Xã Sơn Phú",
      "Xã Sơn Bằng",
      "Xã Sơn Ninh",
      "Xã Sơn Trung"
    ]
  },
  {
    "newWardId": "40517067",
    "newWardName": "Hương Xuân",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18556",
      "18541",
      "18544"
    ],
    "oldWardNames": [
      "Xã Hương Lâm",
      "Xã Hương Vĩnh",
      "Xã Hương Xuân"
    ]
  },
  {
    "newWardId": "40509057",
    "newWardName": "Kim Hoa",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18223",
      "18211"
    ],
    "oldWardNames": [
      "Xã Hàm Trường",
      "Xã Kim Hoa"
    ]
  },
  {
    "newWardId": "40519006",
    "newWardName": "Kỳ Anh",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18775",
      "18772",
      "18769",
      "18763"
    ],
    "oldWardNames": [
      "Thị trấn Kỳ Đồng",
      "Xã Kỳ Giang",
      "Xã Kỳ Tiến",
      "Xã Kỳ Phú"
    ]
  },
  {
    "newWardId": "40519007",
    "newWardName": "Kỳ Hoa",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18814",
      "18829"
    ],
    "oldWardNames": [
      "Xã Kỳ Tân",
      "Xã Kỳ Hoa"
    ]
  },
  {
    "newWardId": "40519009",
    "newWardName": "Kỳ Khang",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18790",
      "18805",
      "18778"
    ],
    "oldWardNames": [
      "Xã Kỳ Thọ",
      "Xã Kỳ Thư",
      "Xã Kỳ Khang"
    ]
  },
  {
    "newWardId": "40519010",
    "newWardName": "Kỳ Lạc",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18838",
      "18850"
    ],
    "oldWardNames": [
      "Xã Lâm Hợp",
      "Xã Kỳ Lạc"
    ]
  },
  {
    "newWardId": "40519011",
    "newWardName": "Kỳ Thượng",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18844",
      "18799"
    ],
    "oldWardNames": [
      "Xã Kỳ Sơn",
      "Xã Kỳ Thượng"
    ]
  },
  {
    "newWardId": "40519008",
    "newWardName": "Kỳ Văn",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18793",
      "18787",
      "18784"
    ],
    "oldWardNames": [
      "Xã Kỳ Tây",
      "Xã Kỳ Trung",
      "Xã Kỳ Văn"
    ]
  },
  {
    "newWardId": "40519005",
    "newWardName": "Kỳ Xuân",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18766",
      "18760",
      "18757"
    ],
    "oldWardNames": [
      "Xã Kỳ Phong",
      "Xã Kỳ Bắc",
      "Xã Kỳ Xuân"
    ]
  },
  {
    "newWardId": "40513031",
    "newWardName": "Lộc Hà",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18568",
      "18430",
      "18421",
      "18580"
    ],
    "oldWardNames": [
      "Thị trấn Lộc Hà",
      "Xã Bình An",
      "Xã Thịnh Lộc",
      "Xã Thạch Kim"
    ]
  },
  {
    "newWardId": "40521059",
    "newWardName": "Mai Hoa",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18316",
      "18319",
      "18322"
    ],
    "oldWardNames": [
      "Xã Ân Phú",
      "Xã Đức Giang",
      "Xã Đức Lĩnh"
    ]
  },
  {
    "newWardId": "40513033",
    "newWardName": "Mai Phụ",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18577",
      "18583",
      "18493",
      "18670"
    ],
    "oldWardNames": [
      "Xã Thạch Mỹ",
      "Xã Thạch Châu",
      "Xã Phù Lưu",
      "Xã Mai Phụ"
    ]
  },
  {
    "newWardId": "40503041",
    "newWardName": "Nam Hồng Lĩnh",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18118",
      "18127",
      "18130"
    ],
    "oldWardNames": [
      "Phường Nam Hồng",
      "Phường Đậu Liêu",
      "Xã Thuận Lộc"
    ]
  },
  {
    "newWardId": "40505043",
    "newWardName": "Nghi Xuân",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18352",
      "18370",
      "18388",
      "18385",
      "18397"
    ],
    "oldWardNames": [
      "Thị trấn Xuân An",
      "Xã Xuân Giang",
      "Xã Xuân Hồng",
      "Xã Xuân Viên",
      "Xã Xuân Lĩnh"
    ]
  },
  {
    "newWardId": "40517066",
    "newWardName": "Phúc Trạch",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18553",
      "18559",
      "18547"
    ],
    "oldWardNames": [
      "Xã Hương Trạch",
      "Xã Hương Liên",
      "Xã Phúc Trạch"
    ]
  },
  {
    "newWardId": "40520001",
    "newWardName": "Sông Trí",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18754",
      "18820",
      "18811",
      "18796"
    ],
    "oldWardNames": [
      "Phường Hưng Trí",
      "Phường Kỳ Trinh",
      "Xã Kỳ Châu",
      "Xã Kỳ Lợi"
    ]
  },
  {
    "newWardId": "40509054",
    "newWardName": "Sơn Giang",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18145",
      "18184",
      "18157"
    ],
    "oldWardNames": [
      "Xã Sơn Lâm",
      "Xã Quang Diệm",
      "Xã Sơn Giang"
    ]
  },
  {
    "newWardId": "40509056",
    "newWardName": "Sơn Hồng",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18160",
      "18139"
    ],
    "oldWardNames": [
      "Xã Sơn Lĩnh",
      "Xã Sơn Hồng"
    ]
  },
  {
    "newWardId": "40509068",
    "newWardName": "Sơn Kim 1",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18196"
    ],
    "oldWardNames": [
      "Xã Sơn Kim 1"
    ]
  },
  {
    "newWardId": "40509069",
    "newWardName": "Sơn Kim 2",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18199"
    ],
    "oldWardNames": [
      "Xã Sơn Kim 2"
    ]
  },
  {
    "newWardId": "40509052",
    "newWardName": "Sơn Tây",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18136",
      "18172"
    ],
    "oldWardNames": [
      "Thị trấn Tây Sơn",
      "Xã Sơn Tây"
    ]
  },
  {
    "newWardId": "40509055",
    "newWardName": "Sơn Tiến",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18148",
      "18163",
      "18142"
    ],
    "oldWardNames": [
      "Xã Sơn Lễ",
      "Xã An Hòa Thịnh",
      "Xã Sơn Tiến"
    ]
  },
  {
    "newWardId": "40513026",
    "newWardName": "Thạch Hà",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18562",
      "18607",
      "18589"
    ],
    "oldWardNames": [
      "Thị trấn Thạch Hà",
      "Xã Thạch Long",
      "Xã Thạch Sơn"
    ]
  },
  {
    "newWardId": "40501024",
    "newWardName": "Thạch Khê",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18595",
      "18571",
      "18604"
    ],
    "oldWardNames": [
      "Xã Đỉnh Bàn",
      "Xã Thạch Hải",
      "Xã Thạch Khê"
    ]
  },
  {
    "newWardId": "40501022",
    "newWardName": "Thạch Lạc",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18628",
      "18637",
      "18622"
    ],
    "oldWardNames": [
      "Xã Tượng Sơn",
      "Xã Thạch Thắng",
      "Xã Thạch Lạc"
    ]
  },
  {
    "newWardId": "40513030",
    "newWardName": "Thạch Xuân",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18667",
      "18658"
    ],
    "oldWardNames": [
      "Xã Nam Điền",
      "Xã Thạch Xuân"
    ]
  },
  {
    "newWardId": "40501019",
    "newWardName": "Thành Sen",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18077",
      "18091",
      "18079",
      "18109",
      "18073",
      "18094",
      "18085",
      "18097",
      "18082"
    ],
    "oldWardNames": [
      "Phường Bắc Hà",
      "Phường Thạch Quý",
      "Phường Tân Giang",
      "Phường Thạch Hưng",
      "Phường Nam Hà",
      "Phường Trần Phú",
      "Phường Hà Huy Tập",
      "Phường Văn Yên",
      "Phường Đại Nài"
    ]
  },
  {
    "newWardId": "40515013",
    "newWardName": "Thiên Cầm",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18676",
      "18712",
      "18709"
    ],
    "oldWardNames": [
      "Thị trấn Thiên Cầm",
      "Xã Nam Phúc Thăng",
      "Xã Cẩm Nhượng"
    ]
  },
  {
    "newWardId": "40521060",
    "newWardName": "Thượng Đức",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18331",
      "18328",
      "18334"
    ],
    "oldWardNames": [
      "Xã Đức Bồng",
      "Xã Đức Hương",
      "Xã Đức Liên"
    ]
  },
  {
    "newWardId": "40505042",
    "newWardName": "Tiên Điền",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18373",
      "18376",
      "18379",
      "18382"
    ],
    "oldWardNames": [
      "Thị trấn Tiên Điền",
      "Xã Xuân Yên",
      "Xã Xuân Mỹ",
      "Xã Xuân Thành"
    ]
  },
  {
    "newWardId": "40513027",
    "newWardName": "Toàn Lưu",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18565",
      "18634"
    ],
    "oldWardNames": [
      "Xã Ngọc Sơn",
      "Xã Lưu Vĩnh Sơn"
    ]
  },
  {
    "newWardId": "40501020",
    "newWardName": "Trần Phú",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18088",
      "18103",
      "18100",
      "18598"
    ],
    "oldWardNames": [
      "Phường Thạch Trung",
      "Phường Đồng Môn",
      "Phường Thạch Hạ",
      "Xã Hộ Độ"
    ]
  },
  {
    "newWardId": "40511037",
    "newWardName": "Trường Lưu",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18436",
      "18439",
      "18454"
    ],
    "oldWardNames": [
      "Xã Kim Song Trường",
      "Xã Thường Nga",
      "Xã Phú Lộc"
    ]
  },
  {
    "newWardId": "40511035",
    "newWardName": "Tùng Lộc",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18418",
      "18445"
    ],
    "oldWardNames": [
      "Xã Thuần Thiện",
      "Xã Tùng Lộc"
    ]
  },
  {
    "newWardId": "40509053",
    "newWardName": "Tứ Mỹ",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18178",
      "18181",
      "18202"
    ],
    "oldWardNames": [
      "Xã Châu Bình",
      "Xã Tân Mỹ Hà",
      "Xã Mỹ Long"
    ]
  },
  {
    "newWardId": "40513028",
    "newWardName": "Việt Xuyên",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18601",
      "18625"
    ],
    "oldWardNames": [
      "Xã Việt Tiến",
      "Xã Thạch Ngọc"
    ]
  },
  {
    "newWardId": "40521058",
    "newWardName": "Vũ Quang",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18313",
      "18340",
      "18343",
      "18325"
    ],
    "oldWardNames": [
      "Thị trấn Vũ Quang",
      "Xã Hương Minh",
      "Xã Quang Thọ",
      "Xã Thọ Điền"
    ]
  },
  {
    "newWardId": "40520004",
    "newWardName": "Vũng Áng",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18835",
      "18823",
      "18796"
    ],
    "oldWardNames": [
      "Phường Kỳ Long",
      "Phường Kỳ Thịnh",
      "Xã Kỳ Lợi"
    ]
  },
  {
    "newWardId": "40511038",
    "newWardName": "Xuân Lộc",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18490",
      "18481",
      "18475"
    ],
    "oldWardNames": [
      "Xã Sơn Lộc",
      "Xã Quang Lộc",
      "Xã Xuân Lộc"
    ]
  },
  {
    "newWardId": "40515018",
    "newWardName": "Yên Hòa",
    "provinceId": "05",
    "provinceName": "Hà Tĩnh",
    "oldWardIds": [
      "18682",
      "18679"
    ],
    "oldWardNames": [
      "Xã Cẩm Dương",
      "Xã Yên Hòa"
    ]
  },
  {
    "newWardId": "11503070",
    "newWardName": "A Sào",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Đồng",
      "Xã An Hiệp",
      "Xã An Thái",
      "Xã An Khê"
    ]
  },
  {
    "newWardId": "11515058",
    "newWardName": "Ái Quốc",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tây Giang",
      "Xã Ái Quốc"
    ]
  },
  {
    "newWardId": "10907019",
    "newWardName": "Ân Thi",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12142",
      "12157",
      "12169"
    ],
    "oldWardNames": [
      "Thị trấn Ân Thi",
      "Xã Quang Vinh",
      "Xã Hoàng Hoa Thám"
    ]
  },
  {
    "newWardId": "11509086",
    "newWardName": "Bắc Đông Hưng",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đông Cường",
      "Xã Đông Xá",
      "Xã Đông Phương"
    ]
  },
  {
    "newWardId": "11509085",
    "newWardName": "Bắc Đông Quan",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hà Giang",
      "Xã Đông Kinh",
      "Xã Đông Vinh"
    ]
  },
  {
    "newWardId": "11507050",
    "newWardName": "Bắc Thái Ninh",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thái Phúc",
      "Xã Dương Hồng Thủy"
    ]
  },
  {
    "newWardId": "11507047",
    "newWardName": "Bắc Thụy Anh",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thụy Quỳnh",
      "Xã Thụy Văn",
      "Xã Thụy Việt"
    ]
  },
  {
    "newWardId": "11509082",
    "newWardName": "Bắc Tiên Hưng",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Liên An Đô",
      "Xã Lô Giang",
      "Xã Mê Linh",
      "Xã Phú Lương"
    ]
  },
  {
    "newWardId": "11513095",
    "newWardName": "Bình Định",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hồng Tiến",
      "Xã Nam Bình",
      "Xã Bình Định"
    ]
  },
  {
    "newWardId": "11513097",
    "newWardName": "Bình Nguyên",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thanh Tân",
      "Xã An Bình",
      "Xã Bình Nguyên"
    ]
  },
  {
    "newWardId": "11513094",
    "newWardName": "Bình Thanh",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12394"
    ],
    "oldWardNames": [
      "Xã Minh Tân",
      "Xã Minh Quang",
      "Xã Bình Thanh"
    ]
  },
  {
    "newWardId": "10905028",
    "newWardName": "Châu Ninh",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12262",
      "12226",
      "12247",
      "12259"
    ],
    "oldWardNames": [
      "Xã Đại Tập",
      "Xã Tứ Dân",
      "Xã Tân Châu",
      "Xã Đông Ninh"
    ]
  },
  {
    "newWardId": "10905027",
    "newWardName": "Chí Minh",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12271",
      "12274",
      "12265"
    ],
    "oldWardNames": [
      "Xã Thuần Hưng",
      "Xã Nguyễn Huệ",
      "Xã Chí Minh"
    ]
  },
  {
    "newWardId": "11505078",
    "newWardName": "Diên Hà",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Quang Trung",
      "Xã Văn Cẩm",
      "Xã Duyên Hải"
    ]
  },
  {
    "newWardId": "10917035",
    "newWardName": "Đại Đồng",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "11998",
      "12010",
      "11995",
      "12004",
      "11989"
    ],
    "oldWardNames": [
      "Xã Việt Hưng",
      "Xã Lương Tài",
      "Xã Đại Đồng",
      "Xã Đình Dù",
      "Xã Lạc Đạo"
    ]
  },
  {
    "newWardId": "10911012",
    "newWardName": "Đoàn Đào",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12397",
      "12403",
      "12406"
    ],
    "oldWardNames": [
      "Xã Phan Sào Nam",
      "Xã Minh Hoàng",
      "Xã Đoàn Đào"
    ]
  },
  {
    "newWardId": "11503069",
    "newWardName": "Đồng Bằng",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Cầu",
      "Xã An Ấp",
      "Xã An Lễ",
      "Xã An Quý"
    ]
  },
  {
    "newWardId": "11515059",
    "newWardName": "Đồng Châu",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đông Hoàng",
      "Xã Đông Cơ",
      "Xã Đông Lâm",
      "Xã Đông Minh"
    ]
  },
  {
    "newWardId": "11509081",
    "newWardName": "Đông Hưng",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Đông Hưng",
      "Xã Nguyên Xá",
      "Xã Đông La",
      "Xã Đông Các",
      "Xã Đông Sơn",
      "Xã Đông Hợp"
    ]
  },
  {
    "newWardId": "11509087",
    "newWardName": "Đông Quan",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đông Á",
      "Xã Đông Tân",
      "Xã Đông Quan"
    ]
  },
  {
    "newWardId": "11507052",
    "newWardName": "Đông Thái Ninh",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Mỹ Lộc",
      "Xã Tân Học",
      "Xã Thái Đô",
      "Xã Thái Xuyên"
    ]
  },
  {
    "newWardId": "11507046",
    "newWardName": "Đông Thụy Anh",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thụy Trường",
      "Xã Thụy Xuân",
      "Xã An Tân",
      "Xã Hồng Dũng"
    ]
  },
  {
    "newWardId": "11515060",
    "newWardName": "Đông Tiền Hải",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đông Xuyên",
      "Xã Đông Quang",
      "Xã Đông Long",
      "Xã Đông Trà"
    ]
  },
  {
    "newWardId": "11509083",
    "newWardName": "Đông Tiên Hưng",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phong Dương Tiến",
      "Xã Phú Châu"
    ]
  },
  {
    "newWardId": "10909018",
    "newWardName": "Đức Hợp",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12295",
      "12313",
      "12316"
    ],
    "oldWardNames": [
      "Xã Phú Thọ",
      "Xã Mai Động",
      "Xã Đức Hợp"
    ]
  },
  {
    "newWardId": "10903005",
    "newWardName": "Đường Hào",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12121",
      "12130",
      "12133",
      "12139",
      "12136"
    ],
    "oldWardNames": [
      "Phường Dị Sử",
      "Phường Phùng Chí Kiên",
      "Xã Xuân Dục",
      "Xã Hưng Long",
      "Xã Ngọc Lâm"
    ]
  },
  {
    "newWardId": "10909017",
    "newWardName": "Hiệp Cường",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12301",
      "12319",
      "12328",
      "12322"
    ],
    "oldWardNames": [
      "Xã Song Mai",
      "Xã Hùng An",
      "Xã Hiệp Cường",
      "Xã Ngọc Thanh"
    ]
  },
  {
    "newWardId": "10919031",
    "newWardName": "Hoàn Long",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12208",
      "12061",
      "12070"
    ],
    "oldWardNames": [
      "Xã Đông Tảo",
      "Xã Đồng Than",
      "Xã Hoàn Long"
    ]
  },
  {
    "newWardId": "10913008",
    "newWardName": "Hoàng Hoa Thám",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12337",
      "12340",
      "12346",
      "12355"
    ],
    "oldWardNames": [
      "Thị trấn Vương",
      "Xã Hưng Đạo",
      "Xã Nhật Tân",
      "Xã An Viên"
    ]
  },
  {
    "newWardId": "10901003",
    "newWardName": "Hồng Châu",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "11968",
      "11980",
      "12388"
    ],
    "oldWardNames": [
      "Phường Hồng Châu",
      "Xã Quảng Châu",
      "Xã Hoàng Hanh"
    ]
  },
  {
    "newWardId": "11505076",
    "newWardName": "Hồng Minh",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Chí Hòa",
      "Xã Minh Hòa",
      "Xã Hồng Minh"
    ]
  },
  {
    "newWardId": "10907023",
    "newWardName": "Hồng Quang",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12190",
      "12193",
      "12202",
      "12196"
    ],
    "oldWardNames": [
      "Xã Hồ Tùng Mậu",
      "Xã Tiền Phong",
      "Xã Hạ Lễ",
      "Xã Hồng Quang"
    ]
  },
  {
    "newWardId": "11513096",
    "newWardName": "Hồng Vũ",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vũ Công",
      "Xã Hồng Vũ"
    ]
  },
  {
    "newWardId": "11505073",
    "newWardName": "Hưng Hà",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hòa Bình",
      "Xã Minh Khai",
      "Xã Thống Nhất",
      "Xã Kim Trung",
      "Xã Hồng Lĩnh",
      "Xã Văn Lang",
      "Thị trấn Hưng Hà"
    ]
  },
  {
    "newWardId": "11515062",
    "newWardName": "Hưng Phú",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nam Phú",
      "Xã Nam Hưng",
      "Xã Nam Trung"
    ]
  },
  {
    "newWardId": "10905024",
    "newWardName": "Khoái Châu",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12205",
      "12250",
      "12253",
      "12232"
    ],
    "oldWardNames": [
      "Thị trấn Khoái Châu",
      "Xã Liên Khê",
      "Xã Phùng Hưng",
      "Xã Đông Kết"
    ]
  },
  {
    "newWardId": "11513091",
    "newWardName": "Kiến Xương",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12211"
    ],
    "oldWardNames": [
      "Xã Bình Minh",
      "Xã Quang Trung",
      "Xã Quang Minh",
      "Xã Quang Bình",
      "Thị trấn Kiến Xương"
    ]
  },
  {
    "newWardId": "10917034",
    "newWardName": "Lạc Đạo",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "11992",
      "12007",
      "11989"
    ],
    "oldWardNames": [
      "Xã Chỉ Đạo",
      "Xã Minh Hải",
      "Xã Lạc Đạo"
    ]
  },
  {
    "newWardId": "11513090",
    "newWardName": "Lê Lợi",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thống Nhất",
      "Xã Lê Lợi"
    ]
  },
  {
    "newWardId": "11505075",
    "newWardName": "Lê Quý Đôn",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12394"
    ],
    "oldWardNames": [
      "Xã Minh Tân",
      "Xã Độc Lập",
      "Xã Hồng An"
    ]
  },
  {
    "newWardId": "11505080",
    "newWardName": "Long Hưng",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Hưng Nhân",
      "Xã Thái Hưng",
      "Xã Tân Lễ",
      "Xã Tiến Đức",
      "Xã Liên Hiệp"
    ]
  },
  {
    "newWardId": "10909015",
    "newWardName": "Lương Bằng",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12280",
      "12292",
      "12304",
      "12325"
    ],
    "oldWardNames": [
      "Thị trấn Lương Bằng",
      "Xã Phạm Ngũ Lão",
      "Xã Chính Nghĩa",
      "Xã Diên Hồng"
    ]
  },
  {
    "newWardId": "10915039",
    "newWardName": "Mễ Sở",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12211",
      "12046",
      "12049"
    ],
    "oldWardNames": [
      "Xã Bình Minh",
      "Xã Thắng Lợi",
      "Xã Mễ Sở"
    ]
  },
  {
    "newWardId": "11503065",
    "newWardName": "Minh Thọ",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Quỳnh Hoa",
      "Xã Quỳnh Minh",
      "Xã Quỳnh Giao",
      "Xã Quỳnh Thọ"
    ]
  },
  {
    "newWardId": "10903004",
    "newWardName": "Mỹ Hào",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12103",
      "12118",
      "12106",
      "12109"
    ],
    "oldWardNames": [
      "Phường Bần Yên Nhân",
      "Phường Nhân Hòa",
      "Phường Phan Đình Phùng",
      "Xã Cẩm Xá"
    ]
  },
  {
    "newWardId": "11515061",
    "newWardName": "Nam Cường",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nam Thịnh",
      "Xã Nam Tiến",
      "Xã Nam Chính",
      "Xã Nam Cường"
    ]
  },
  {
    "newWardId": "11509084",
    "newWardName": "Nam Đông Hưng",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đông Hoàng",
      "Xã Xuân Quang Động"
    ]
  },
  {
    "newWardId": "11507053",
    "newWardName": "Nam Thái Ninh",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thái Thọ",
      "Xã Thái Thịnh",
      "Xã Thuần Thành"
    ]
  },
  {
    "newWardId": "11507049",
    "newWardName": "Nam Thụy Anh",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thụy Thanh",
      "Xã Thụy Phong",
      "Xã Thụy Duyên"
    ]
  },
  {
    "newWardId": "11515063",
    "newWardName": "Nam Tiền Hải",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nam Hồng",
      "Xã Nam Hà",
      "Xã Nam Hải"
    ]
  },
  {
    "newWardId": "11509088",
    "newWardName": "Nam Tiên Hưng",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Liên Hoa",
      "Xã Hồng Giang",
      "Xã Trọng Quan",
      "Xã Minh Phú"
    ]
  },
  {
    "newWardId": "10909016",
    "newWardName": "Nghĩa Dân",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12298",
      "12289",
      "12286",
      "12283"
    ],
    "oldWardNames": [
      "Xã Đồng Thanh",
      "Xã Vĩnh Xá",
      "Xã Toàn Thắng",
      "Xã Nghĩa Dân"
    ]
  },
  {
    "newWardId": "10915036",
    "newWardName": "Nghĩa Trụ",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12034",
      "12037",
      "12031"
    ],
    "oldWardNames": [
      "Xã Long Hưng",
      "Xã Vĩnh Khúc",
      "Xã Nghĩa Trụ"
    ]
  },
  {
    "newWardId": "11503068",
    "newWardName": "Ngọc Lâm",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Quỳnh Hoàng",
      "Xã Quỳnh Lâm",
      "Xã Quỳnh Ngọc"
    ]
  },
  {
    "newWardId": "11503066",
    "newWardName": "Nguyễn Du",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Châu Sơn",
      "Xã Quỳnh Khê",
      "Xã Quỳnh Nguyên"
    ]
  },
  {
    "newWardId": "10907022",
    "newWardName": "Nguyễn Trãi",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12178",
      "12181",
      "12175",
      "12184"
    ],
    "oldWardNames": [
      "Xã Đặng Lễ",
      "Xã Cẩm Ninh",
      "Xã Đa Lộc",
      "Xã Nguyễn Trãi"
    ]
  },
  {
    "newWardId": "10919032",
    "newWardName": "Nguyễn Văn Linh",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12064",
      "12067",
      "12055"
    ],
    "oldWardNames": [
      "Xã Ngọc Long",
      "Xã Liêu Xá",
      "Xã Nguyễn Văn Linh"
    ]
  },
  {
    "newWardId": "11505079",
    "newWardName": "Ngự Thiên",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Hòa",
      "Xã Canh Tân",
      "Xã Cộng Hòa",
      "Xã Hòa Tiến"
    ]
  },
  {
    "newWardId": "10917033",
    "newWardName": "Như Quỳnh",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "11986",
      "12001",
      "12016",
      "12013",
      "12004"
    ],
    "oldWardNames": [
      "Thị trấn Như Quỳnh",
      "Xã Tân Quang",
      "Xã Lạc Hồng",
      "Xã Trưng Trắc",
      "Xã Đình Dù"
    ]
  },
  {
    "newWardId": "10907021",
    "newWardName": "Phạm Ngũ Lão",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12148",
      "12145",
      "12154",
      "12151"
    ],
    "oldWardNames": [
      "Xã Bắc Sơn",
      "Xã Phù Ủng",
      "Xã Đào Dương",
      "Xã Bãi Sậy"
    ]
  },
  {
    "newWardId": "10901001",
    "newWardName": "Phố Hiến",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "11956",
      "11959",
      "11953",
      "11962",
      "11971",
      "11974"
    ],
    "oldWardNames": [
      "Phường An Tảo",
      "Phường Lê Lợi",
      "Phường Hiến Nam",
      "Phường Minh Khai",
      "Xã Trung Nghĩa",
      "Xã Liên Phương"
    ]
  },
  {
    "newWardId": "11503071",
    "newWardName": "Phụ Dực",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn An Bài",
      "Xã An Ninh",
      "Xã An Vũ",
      "Xã An Mỹ",
      "Xã An Thanh"
    ]
  },
  {
    "newWardId": "10915037",
    "newWardName": "Phụng Công",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12022",
      "12025",
      "12028"
    ],
    "oldWardNames": [
      "Xã Xuân Quan",
      "Xã Cửu Cao",
      "Xã Phụng Công"
    ]
  },
  {
    "newWardId": "10911011",
    "newWardName": "Quang Hưng",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12391",
      "12394",
      "12409",
      "12400"
    ],
    "oldWardNames": [
      "Thị trấn Trần Cao",
      "Xã Minh Tân",
      "Xã Tống Phan",
      "Xã Quang Hưng"
    ]
  },
  {
    "newWardId": "11513092",
    "newWardName": "Quang Lịch",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hòa Bình",
      "Xã Vũ Lễ",
      "Xã Quang Lịch"
    ]
  },
  {
    "newWardId": "11503067",
    "newWardName": "Quỳnh An",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trang Bảo Xá",
      "Xã An Vinh",
      "Xã Đông Hải"
    ]
  },
  {
    "newWardId": "11503064",
    "newWardName": "Quỳnh Phụ",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Quỳnh Côi",
      "Xã Quỳnh Hải",
      "Xã Quỳnh Hội",
      "Xã Quỳnh Hồng",
      "Xã Quỳnh Mỹ",
      "Xã Quỳnh Hưng"
    ]
  },
  {
    "newWardId": "10901002",
    "newWardName": "Sơn Nam",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "11950",
      "12331",
      "12334",
      "11983",
      "12322"
    ],
    "oldWardNames": [
      "Phường Lam Sơn",
      "Xã Phú Cường",
      "Xã Hùng Cường",
      "Xã Bảo Khê",
      "Xã Ngọc Thanh"
    ]
  },
  {
    "newWardId": "10901007",
    "newWardName": "Tân Hưng",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12367",
      "11977",
      "12385"
    ],
    "oldWardNames": [
      "Xã Thủ Sỹ",
      "Xã Phương Nam",
      "Xã Tân Hưng"
    ]
  },
  {
    "newWardId": "11511101",
    "newWardName": "Tân Thuận",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12073"
    ],
    "oldWardNames": [
      "Xã Tân Lập",
      "Xã Tự Tân",
      "Xã Bách Thuận"
    ]
  },
  {
    "newWardId": "11503072",
    "newWardName": "Tân Tiến",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12244"
    ],
    "oldWardNames": [
      "Xã Đồng Tiến",
      "Xã An Dục",
      "Xã An Tràng"
    ]
  },
  {
    "newWardId": "11507054",
    "newWardName": "Tây Thái Ninh",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Sơn Hà",
      "Xã Thái Giang"
    ]
  },
  {
    "newWardId": "11507055",
    "newWardName": "Tây Thụy Anh",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thụy Chính",
      "Xã Thụy Dân",
      "Xã Thụy Ninh"
    ]
  },
  {
    "newWardId": "11515057",
    "newWardName": "Tây Tiền Hải",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phương Công",
      "Xã Vân Trường",
      "Xã Bắc Hải"
    ]
  },
  {
    "newWardId": "11501040",
    "newWardName": "Thái Bình",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Lê Hồng Phong",
      "Phường Bồ Xuyên",
      "Phường Tiền Phong",
      "Xã Tân Hòa",
      "Xã Phúc Thành",
      "Xã Tân Phong",
      "Xã Tân Bình"
    ]
  },
  {
    "newWardId": "11507051",
    "newWardName": "Thái Ninh",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thái Hưng",
      "Xã Thái Thượng",
      "Xã Hòa An",
      "Xã Thái Nguyên"
    ]
  },
  {
    "newWardId": "11507045",
    "newWardName": "Thái Thụy",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Diêm Điền",
      "Xã Thụy Hải",
      "Xã Thụy Trình",
      "Xã Thụy Bình",
      "Xã Thụy Liên"
    ]
  },
  {
    "newWardId": "11505077",
    "newWardName": "Thần Khê",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12148"
    ],
    "oldWardNames": [
      "Xã Bắc Sơn",
      "Xã Đông Đô",
      "Xã Tây Đô",
      "Xã Chi Lăng"
    ]
  },
  {
    "newWardId": "11507048",
    "newWardName": "Thụy Anh",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thụy Sơn",
      "Xã Dương Phúc",
      "Xã Thụy Hưng"
    ]
  },
  {
    "newWardId": "11511100",
    "newWardName": "Thư Trì",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Song Lãng",
      "Xã Hiệp Hòa",
      "Xã Minh Lãng"
    ]
  },
  {
    "newWardId": "11511102",
    "newWardName": "Thư Vũ",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Việt Thuận",
      "Xã Vũ Hội",
      "Xã Vũ Vinh",
      "Xã Vũ Vân"
    ]
  },
  {
    "newWardId": "10903006",
    "newWardName": "Thượng Hồng",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12124",
      "12127",
      "12112",
      "12115"
    ],
    "oldWardNames": [
      "Phường Bạch Sam",
      "Phường Minh Đức",
      "Xã Dương Quang",
      "Xã Hòa Phong"
    ]
  },
  {
    "newWardId": "11515056",
    "newWardName": "Tiền Hải",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Tiền Hải",
      "Xã An Ninh",
      "Xã Tây Ninh",
      "Xã Tây Lương",
      "Xã Vũ Lăng"
    ]
  },
  {
    "newWardId": "10913010",
    "newWardName": "Tiên Hoa",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12352",
      "12361",
      "12376"
    ],
    "oldWardNames": [
      "Xã Lệ Xá",
      "Xã Trung Dũng",
      "Xã Cương Chính"
    ]
  },
  {
    "newWardId": "11509089",
    "newWardName": "Tiên Hưng",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12394"
    ],
    "oldWardNames": [
      "Xã Minh Tân",
      "Xã Hồng Bạch",
      "Xã Thăng Long",
      "Xã Hồng Việt"
    ]
  },
  {
    "newWardId": "11505074",
    "newWardName": "Tiên La",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12043"
    ],
    "oldWardNames": [
      "Xã Tân Tiến",
      "Xã Thái Phương",
      "Xã Đoan Hùng",
      "Xã Phúc Khánh"
    ]
  },
  {
    "newWardId": "10913009",
    "newWardName": "Tiên Lữ",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12370",
      "12364",
      "12373"
    ],
    "oldWardNames": [
      "Xã Thiện Phiến",
      "Xã Hải Thắng",
      "Xã Thụy Lôi"
    ]
  },
  {
    "newWardId": "10911013",
    "newWardName": "Tiên Tiến",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12412",
      "12415",
      "12424"
    ],
    "oldWardNames": [
      "Xã Đình Cao",
      "Xã Nhật Quang",
      "Xã Tiên Tiến"
    ]
  },
  {
    "newWardId": "10911014",
    "newWardName": "Tống Trân",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12421",
      "12427",
      "12430"
    ],
    "oldWardNames": [
      "Xã Tam Đa",
      "Xã Nguyên Hòa",
      "Xã Tống Trân"
    ]
  },
  {
    "newWardId": "11513098",
    "newWardName": "Trà Giang",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hồng Thái",
      "Xã Quốc Tuấn",
      "Xã Trà Giang"
    ]
  },
  {
    "newWardId": "11501043",
    "newWardName": "Trà Lý",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Hoàng Diệu",
      "Xã Đông Mỹ",
      "Xã Đông Hòa",
      "Xã Đông Thọ",
      "Xã Đông Dương"
    ]
  },
  {
    "newWardId": "11501042",
    "newWardName": "Trần Hưng Đạo",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Trần Hưng Đạo",
      "Phường Đề Thám",
      "Phường Quang Trung",
      "Xã Phú Xuân"
    ]
  },
  {
    "newWardId": "11501041",
    "newWardName": "Trần Lãm",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Trần Lãm",
      "Phường Kỳ Bá",
      "Xã Vũ Đông",
      "Xã Vũ Lạc",
      "Xã Vũ Chính",
      "Xã Tây Sơn"
    ]
  },
  {
    "newWardId": "10905025",
    "newWardName": "Triệu Việt Vương",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12214",
      "12223",
      "12220",
      "12229"
    ],
    "oldWardNames": [
      "Xã Phạm Hồng Thái",
      "Xã Tân Dân",
      "Xã Ông Đình",
      "Xã An Vĩ"
    ]
  },
  {
    "newWardId": "11511104",
    "newWardName": "Vạn Xuân",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12298"
    ],
    "oldWardNames": [
      "Xã Đồng Thanh",
      "Xã Hồng Lý",
      "Xã Việt Hùng",
      "Xã Xuân Hòa"
    ]
  },
  {
    "newWardId": "10915038",
    "newWardName": "Văn Giang",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12043",
      "12040",
      "12019"
    ],
    "oldWardNames": [
      "Xã Tân Tiến",
      "Xã Liên Nghĩa",
      "Thị trấn Văn Giang"
    ]
  },
  {
    "newWardId": "10905026",
    "newWardName": "Việt Tiến",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12244",
      "12238",
      "12256"
    ],
    "oldWardNames": [
      "Xã Đồng Tiến",
      "Xã Dân Tiến",
      "Xã Việt Hòa"
    ]
  },
  {
    "newWardId": "10919030",
    "newWardName": "Việt Yên",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12079",
      "12076",
      "12091"
    ],
    "oldWardNames": [
      "Xã Yên Phú",
      "Xã Thanh Long",
      "Xã Việt Yên"
    ]
  },
  {
    "newWardId": "11501044",
    "newWardName": "Vũ Phúc",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Phú Khánh",
      "Xã Nguyên Xá",
      "Xã Song An",
      "Xã Trung An",
      "Xã Vũ Phúc"
    ]
  },
  {
    "newWardId": "11513093",
    "newWardName": "Vũ Quý",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vũ An",
      "Xã Vũ Ninh",
      "Xã Vũ Trung",
      "Xã Vũ Quý"
    ]
  },
  {
    "newWardId": "11511099",
    "newWardName": "Vũ Thư",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hòa Bình",
      "Xã Minh Khai",
      "Xã Minh Quang",
      "Xã Tam Quang",
      "Xã Dũng Nghĩa",
      "Thị trấn Vũ Thư"
    ]
  },
  {
    "newWardId": "11511103",
    "newWardName": "Vũ Tiên",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vũ Đoài",
      "Xã Duy Nhất",
      "Xã Hồng Phong",
      "Xã Vũ Tiến"
    ]
  },
  {
    "newWardId": "10907020",
    "newWardName": "Xuân Trúc",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12160",
      "12172",
      "12166"
    ],
    "oldWardNames": [
      "Xã Vân Du",
      "Xã Quảng Lãng",
      "Xã Xuân Trúc"
    ]
  },
  {
    "newWardId": "10919029",
    "newWardName": "Yên Mỹ",
    "provinceId": "09",
    "provinceName": "Hưng Yên",
    "oldWardIds": [
      "12052",
      "12073",
      "12085",
      "12100"
    ],
    "oldWardNames": [
      "Thị trấn Yên Mỹ",
      "Xã Tân Lập",
      "Xã Trung Hòa",
      "Xã Tân Minh"
    ]
  },
  {
    "newWardId": "10701059",
    "newWardName": "Ái Quốc",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Ái Quốc",
      "Xã Quyết Thắng",
      "Xã Hồng Lạc"
    ]
  },
  {
    "newWardId": "10305013",
    "newWardName": "An Biên",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11401",
      "11371",
      "11383",
      "11407"
    ],
    "oldWardNames": [
      "Phường An Dương",
      "Phường An Biên",
      "Phường Trần Nguyên Hãn",
      "Phường Vĩnh Niệm"
    ]
  },
  {
    "newWardId": "10313022",
    "newWardName": "An Dương",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11437",
      "11614",
      "11581",
      "11617",
      "11596",
      "11599"
    ],
    "oldWardNames": [
      "Phường Nam Sơn",
      "Phường An Hải",
      "Phường Lê Lợi",
      "Phường Đồng Thái",
      "Phường Tân Tiến",
      "Phường An Hưng"
    ]
  },
  {
    "newWardId": "10313023",
    "newWardName": "An Hải",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11623",
      "11626",
      "11581",
      "11614",
      "11617"
    ],
    "oldWardNames": [
      "Phường An Đồng",
      "Phường Hồng Thái",
      "Phường Lê Lợi",
      "Phường An Hải",
      "Phường Đồng Thái"
    ]
  },
  {
    "newWardId": "10315025",
    "newWardName": "An Hưng",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11677",
      "11674",
      "11671"
    ],
    "oldWardNames": [
      "Xã An Thái",
      "Xã An Thọ",
      "Xã Chiến Thắng"
    ]
  },
  {
    "newWardId": "10315026",
    "newWardName": "An Khánh",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11665",
      "11668",
      "11662"
    ],
    "oldWardNames": [
      "Xã Tân Viên",
      "Xã Mỹ Đức",
      "Xã Thái Sơn"
    ]
  },
  {
    "newWardId": "10315029",
    "newWardName": "An Lão",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11629",
      "11653",
      "11659",
      "11641",
      "11656",
      "11662"
    ],
    "oldWardNames": [
      "Thị trấn An Lão",
      "Xã An Thắng",
      "Xã Tân Dân",
      "Xã An Tiến",
      "Thị trấn Trường Sơn",
      "Xã Thái Sơn"
    ]
  },
  {
    "newWardId": "10313024",
    "newWardName": "An Phong",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11593",
      "11587",
      "11584",
      "11596",
      "11581"
    ],
    "oldWardNames": [
      "Phường An Hòa",
      "Phường Hồng Phong",
      "Phường Đại Bản",
      "Phường Lê Thiện",
      "Phường Tân Tiến",
      "Phường Lê Lợi"
    ]
  },
  {
    "newWardId": "10705077",
    "newWardName": "An Phú",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Bình",
      "Xã An Phú",
      "Xã Cộng Hòa"
    ]
  },
  {
    "newWardId": "10315027",
    "newWardName": "An Quang",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11650",
      "11518",
      "11644"
    ],
    "oldWardNames": [
      "Xã Quốc Tuấn",
      "Xã Quang Trung",
      "Xã Quang Hưng"
    ]
  },
  {
    "newWardId": "10711113",
    "newWardName": "An Thành",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11710"
    ],
    "oldWardNames": [
      "Xã Ngũ Phúc",
      "Xã Kim Tân",
      "Xã Kim Đính"
    ]
  },
  {
    "newWardId": "10315028",
    "newWardName": "An Trường",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11632",
      "11635",
      "11638"
    ],
    "oldWardNames": [
      "Xã Bát Trang",
      "Xã Trường Thọ",
      "Xã Trường Thành"
    ]
  },
  {
    "newWardId": "10311005",
    "newWardName": "Bạch Đằng",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11465",
      "11500",
      "11539"
    ],
    "oldWardNames": [
      "Phường Minh Đức",
      "Xã Bạch Đằng",
      "Phường Phạm Ngũ Lão"
    ]
  },
  {
    "newWardId": "10709069",
    "newWardName": "Bắc An Phụ",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11500"
    ],
    "oldWardNames": [
      "Phường Thất Hùng",
      "Xã Bạch Đằng",
      "Xã Lê Ninh",
      "Phường Văn Đức"
    ]
  },
  {
    "newWardId": "10721107",
    "newWardName": "Bắc Thanh Miện",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hồng Quang",
      "Xã Lam Sơn",
      "Xã Lê Hồng"
    ]
  },
  {
    "newWardId": "10719088",
    "newWardName": "Bình Giang",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Việt",
      "Xã Long Xuyên",
      "Xã Hồng Khê",
      "Xã Cổ Bì",
      "Xã Vĩnh Hồng"
    ]
  },
  {
    "newWardId": "10717083",
    "newWardName": "Cẩm Giang",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Cẩm Giang",
      "Xã Định Sơn",
      "Xã Cẩm Hoàng"
    ]
  },
  {
    "newWardId": "10717086",
    "newWardName": "Cẩm Giàng",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Lương Điền",
      "Xã Ngọc Liên",
      "Xã Cẩm Hưng",
      "Xã Phúc Điền"
    ]
  },
  {
    "newWardId": "10319039",
    "newWardName": "Chấn Hưng",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11806",
      "11803",
      "11815",
      "11812"
    ],
    "oldWardNames": [
      "Xã Nam Hưng",
      "Xã Bắc Hưng",
      "Xã Đông Hưng",
      "Xã Tây Hưng"
    ]
  },
  {
    "newWardId": "10703061",
    "newWardName": "Chí Linh",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Phả Lại",
      "Phường Cổ Thành",
      "Xã Nhân Huệ"
    ]
  },
  {
    "newWardId": "10715098",
    "newWardName": "Chí Minh",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Thanh",
      "Xã Văn Tố",
      "Xã Chí Minh"
    ]
  },
  {
    "newWardId": "10703060",
    "newWardName": "Chu Văn An",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Sao Đỏ",
      "Phường Văn An",
      "Phường Chí Minh",
      "Phường Thái Học",
      "Phường Cộng Hòa",
      "Phường Văn Đức"
    ]
  },
  {
    "newWardId": "10327021",
    "newWardName": "Dương Kinh",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11740",
      "11689",
      "11692"
    ],
    "oldWardNames": [
      "Phường Hòa Nghĩa",
      "Phường Tân Thành",
      "Phường Anh Dũng",
      "Phường Hải Thành"
    ]
  },
  {
    "newWardId": "10715097",
    "newWardName": "Đại Sơn",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình Lãng",
      "Xã Đại Sơn",
      "Xã Thanh Hải",
      "Xã Hưng Đạo"
    ]
  },
  {
    "newWardId": "10309019",
    "newWardName": "Đồ Sơn",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11458",
      "11740",
      "11461",
      "11455"
    ],
    "oldWardNames": [
      "Phường Hải Sơn",
      "Phường Tân Thành",
      "Phường Vạn Hương",
      "Phường Ngọc Xuyên"
    ]
  },
  {
    "newWardId": "10304015",
    "newWardName": "Đông Hải",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11410",
      "11411",
      "11419"
    ],
    "oldWardNames": [
      "Phường Đông Hải 1",
      "Phường Đông Hải 2",
      "Phường Nam Hải"
    ]
  },
  {
    "newWardId": "10719089",
    "newWardName": "Đường An",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thúc Kháng",
      "Xã Thái Minh",
      "Xã Tân Hồng",
      "Xã Thái Dương",
      "Xã Thái Hòa"
    ]
  },
  {
    "newWardId": "10713091",
    "newWardName": "Gia Lộc",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Gia Tiến",
      "Thị trấn Gia Lộc",
      "Xã Gia Phúc",
      "Xã Yết Kiêu",
      "Xã Lê Lợi"
    ]
  },
  {
    "newWardId": "10713093",
    "newWardName": "Gia Phúc",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Toàn Thắng",
      "Xã Hoàng Diệu",
      "Xã Hồng Hưng",
      "Xã Thống Kênh",
      "Xã Đoàn Thượng",
      "Xã Quang Đức",
      "Thị trấn Gia Lộc",
      "Xã Gia Phúc"
    ]
  },
  {
    "newWardId": "10303011",
    "newWardName": "Gia Viên",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11359",
      "11344",
      "11365",
      "11341",
      "11350"
    ],
    "oldWardNames": [
      "Phường Đằng Giang",
      "Phường Cầu Đất",
      "Phường Lạch Tray",
      "Phường Gia Viên",
      "Phường Đông Khê"
    ]
  },
  {
    "newWardId": "10707080",
    "newWardName": "Hà Bắc",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Việt",
      "Xã Cẩm Việt",
      "Xã Hồng Lạc"
    ]
  },
  {
    "newWardId": "10707082",
    "newWardName": "Hà Đông",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thanh Hồng",
      "Xã Vĩnh Cường",
      "Xã Thanh Quang"
    ]
  },
  {
    "newWardId": "10707081",
    "newWardName": "Hà Nam",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thanh Xuân",
      "Xã Liên Mạc",
      "Xã Thanh Lang",
      "Xã Thanh An",
      "Xã Hòa Bình"
    ]
  },
  {
    "newWardId": "10707079",
    "newWardName": "Hà Tây",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân An",
      "Xã An Phượng",
      "Xã Thanh Hải"
    ]
  },
  {
    "newWardId": "10304014",
    "newWardName": "Hải An",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11422",
      "11413",
      "11414",
      "11416",
      "11425",
      "11419",
      "11411"
    ],
    "oldWardNames": [
      "Phường Cát Bi",
      "Phường Đằng Lâm",
      "Phường Thành Tô",
      "Phường Đằng Hải",
      "Phường Tràng Cát",
      "Phường Nam Hải",
      "Phường Đông Hải 2"
    ]
  },
  {
    "newWardId": "10701051",
    "newWardName": "Hải Dương",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11512"
    ],
    "oldWardNames": [
      "Phường Trần Hưng Đạo",
      "Phường Nhị Châu",
      "Phường Ngọc Châu",
      "Phường Quang Trung"
    ]
  },
  {
    "newWardId": "10721108",
    "newWardName": "Hải Hưng",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11743"
    ],
    "oldWardNames": [
      "Xã Tân Trào",
      "Xã Ngô Quyền",
      "Xã Đoàn Kết"
    ]
  },
  {
    "newWardId": "10311003",
    "newWardName": "Hòa Bình",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11533",
      "11530"
    ],
    "oldWardNames": [
      "Phường Hòa Bình",
      "Phường An Lư",
      "Phường Thủy Hà"
    ]
  },
  {
    "newWardId": "10301009",
    "newWardName": "Hồng An",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11296",
      "11602",
      "11599",
      "11587",
      "11584",
      "11596"
    ],
    "oldWardNames": [
      "Phường Quán Toan",
      "Phường An Hồng",
      "Phường An Hưng",
      "Phường Đại Bản",
      "Phường Lê Thiện",
      "Phường Tân Tiến"
    ]
  },
  {
    "newWardId": "10301008",
    "newWardName": "Hồng Bàng",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11320",
      "11311",
      "11323",
      "11305",
      "11302",
      "11299",
      "11341"
    ],
    "oldWardNames": [
      "Phường Hoàng Văn Thụ",
      "Phường Minh Khai",
      "Phường Phan Bội Châu",
      "Phường Thượng Lý",
      "Phường Sở Dầu",
      "Phường Hùng Vương",
      "Phường Gia Viên"
    ]
  },
  {
    "newWardId": "10723105",
    "newWardName": "Hồng Châu",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Quang",
      "Xã Văn Hội",
      "Xã Hưng Long"
    ]
  },
  {
    "newWardId": "10705075",
    "newWardName": "Hợp Tiến",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11806"
    ],
    "oldWardNames": [
      "Xã Nam Hưng",
      "Xã Nam Tân",
      "Xã Hợp Tiến"
    ]
  },
  {
    "newWardId": "10319040",
    "newWardName": "Hùng Thắng",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11809",
      "11821"
    ],
    "oldWardNames": [
      "Xã Hùng Thắng",
      "Xã Vinh Quang"
    ]
  },
  {
    "newWardId": "10327020",
    "newWardName": "Hưng Đạo",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11683",
      "11686",
      "11689",
      "11692"
    ],
    "oldWardNames": [
      "Phường Đa Phúc",
      "Phường Hưng Đạo",
      "Phường Anh Dũng",
      "Phường Hải Thành"
    ]
  },
  {
    "newWardId": "10719087",
    "newWardName": "Kẻ Sặt",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11866",
      "11809"
    ],
    "oldWardNames": [
      "Xã Vĩnh Hưng",
      "Xã Hùng Thắng",
      "Thị trấn Kẻ Sặt",
      "Xã Vĩnh Hồng"
    ]
  },
  {
    "newWardId": "10723103",
    "newWardName": "Khúc Thừa Dụ",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình Xuyên",
      "Xã Hồng Phong",
      "Xã Kiến Phúc"
    ]
  },
  {
    "newWardId": "10307016",
    "newWardName": "Kiến An",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11437",
      "11434",
      "11443",
      "11446"
    ],
    "oldWardNames": [
      "Phường Nam Sơn",
      "Phường Đồng Hòa",
      "Phường Bắc Sơn",
      "Phường Trần Thành Ngọ",
      "Phường Văn Đẩu"
    ]
  },
  {
    "newWardId": "10317032",
    "newWardName": "Kiến Hải",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11734",
      "11752",
      "11749",
      "11746"
    ],
    "oldWardNames": [
      "Xã Tân Phong",
      "Xã Đại Hợp",
      "Xã Tú Sơn",
      "Xã Đoàn Xá"
    ]
  },
  {
    "newWardId": "10317033",
    "newWardName": "Kiến Hưng",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11743",
      "11728",
      "11746"
    ],
    "oldWardNames": [
      "Xã Tân Trào",
      "Xã Kiến Hưng",
      "Xã Đoàn Xá"
    ]
  },
  {
    "newWardId": "10317031",
    "newWardName": "Kiến Minh",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11725",
      "11704",
      "11695"
    ],
    "oldWardNames": [
      "Xã Minh Tân",
      "Xã Đại Đồng",
      "Xã Đông Phương"
    ]
  },
  {
    "newWardId": "10317030",
    "newWardName": "Kiến Thụy",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11680",
      "11722",
      "11698",
      "11701",
      "11728"
    ],
    "oldWardNames": [
      "Thị trấn Núi Đối",
      "Xã Thanh Sơn",
      "Xã Thuận Thiên",
      "Xã Hữu Bằng",
      "Xã Kiến Hưng"
    ]
  },
  {
    "newWardId": "10711114",
    "newWardName": "Kim Thành",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đồng Cẩm",
      "Xã Tam Kỳ",
      "Xã Đại Đức",
      "Xã Hòa Bình"
    ]
  },
  {
    "newWardId": "10709066",
    "newWardName": "Kinh Môn",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường An Lưu",
      "Phường Hiệp An",
      "Phường Long Xuyên"
    ]
  },
  {
    "newWardId": "10715099",
    "newWardName": "Lạc Phượng",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11518"
    ],
    "oldWardNames": [
      "Xã Quang Trung",
      "Xã Lạc Phượng",
      "Xã Tiên Động"
    ]
  },
  {
    "newWardId": "10711112",
    "newWardName": "Lai Khê",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Lai Khê",
      "Xã Vũ Dũng",
      "Xã Tuấn Việt",
      "Xã Cộng Hòa",
      "Xã Thanh An",
      "Xã Cẩm Việt"
    ]
  },
  {
    "newWardId": "10305012",
    "newWardName": "Lê Chân",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11395",
      "11404",
      "11405",
      "11371",
      "11383",
      "11407",
      "11344",
      "11365"
    ],
    "oldWardNames": [
      "Phường Hàng Kênh",
      "Phường Dư Hàng Kênh",
      "Phường Kênh Dương",
      "Phường An Biên",
      "Phường Trần Nguyên Hãn",
      "Phường Vĩnh Niệm",
      "Phường Cầu Đất",
      "Phường Lạch Tray"
    ]
  },
  {
    "newWardId": "10703065",
    "newWardName": "Lê Đại Hành",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tân Dân",
      "Phường An Lạc",
      "Phường Đồng Lạc"
    ]
  },
  {
    "newWardId": "10311007",
    "newWardName": "Lê Ích Mộc",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11506",
      "11521",
      "11518"
    ],
    "oldWardNames": [
      "Phường Quảng Thanh",
      "Phường Lê Hồng Phong",
      "Xã Quang Trung"
    ]
  },
  {
    "newWardId": "10701052",
    "newWardName": "Lê Thanh Nghị",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tân Bình",
      "Phường Thanh Bình",
      "Phường Lê Thanh Nghị",
      "Phường Trần Phú"
    ]
  },
  {
    "newWardId": "10311006",
    "newWardName": "Lưu Kiếm",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11512",
      "11488",
      "11485",
      "11518"
    ],
    "oldWardNames": [
      "Phường Trần Hưng Đạo",
      "Phường Lưu Kiếm",
      "Xã Liên Xuân",
      "Xã Quang Trung"
    ]
  },
  {
    "newWardId": "10717085",
    "newWardName": "Mao Điền",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Trường",
      "Xã Cẩm Đông",
      "Xã Phúc Điền"
    ]
  },
  {
    "newWardId": "10709072",
    "newWardName": "Nam An Phụ",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Quang Thành",
      "Xã Lạc Long",
      "Xã Thăng Long",
      "Xã Tuấn Việt",
      "Xã Vũ Dũng",
      "Xã Cộng Hòa"
    ]
  },
  {
    "newWardId": "10309018",
    "newWardName": "Nam Đồ Sơn",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11465",
      "11467",
      "11737",
      "11461",
      "11455"
    ],
    "oldWardNames": [
      "Phường Minh Đức",
      "Phường Bàng La",
      "Phường Hợp Đức",
      "Phường Vạn Hương",
      "Phường Ngọc Xuyên"
    ]
  },
  {
    "newWardId": "10701055",
    "newWardName": "Nam Đồng",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Nam Đồng",
      "Xã Tiền Tiến"
    ]
  },
  {
    "newWardId": "10705073",
    "newWardName": "Nam Sách",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Nam Sách",
      "Xã Hồng Phong",
      "Xã Đồng Lạc"
    ]
  },
  {
    "newWardId": "10721110",
    "newWardName": "Nam Thanh Miện",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hồng Phong",
      "Xã Thanh Giang",
      "Xã Chi Lăng Bắc",
      "Xã Chi Lăng Nam"
    ]
  },
  {
    "newWardId": "10311004",
    "newWardName": "Nam Triệu",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11542",
      "11551",
      "11545"
    ],
    "oldWardNames": [
      "Phường Nam Triệu Giang",
      "Phường Lập Lễ",
      "Phường Tam Hưng"
    ]
  },
  {
    "newWardId": "10317034",
    "newWardName": "Nghi Dương",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11710",
      "11713",
      "11716"
    ],
    "oldWardNames": [
      "Xã Ngũ Phúc",
      "Xã Kiến Quốc",
      "Xã Du Lễ"
    ]
  },
  {
    "newWardId": "10303010",
    "newWardName": "Ngô Quyền",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11329",
      "11335",
      "11338",
      "11341",
      "11350"
    ],
    "oldWardNames": [
      "Phường Máy Chai",
      "Phường Vạn Mỹ",
      "Phường Cầu Tre",
      "Phường Gia Viên",
      "Phường Đông Khê"
    ]
  },
  {
    "newWardId": "10321042",
    "newWardName": "Nguyễn Bỉnh Khiêm",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11911",
      "11884"
    ],
    "oldWardNames": [
      "Xã Trấn Dương",
      "Xã Hòa Bình",
      "Xã Lý Học"
    ]
  },
  {
    "newWardId": "10709067",
    "newWardName": "Nguyễn Đại Năng",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Thái Thịnh",
      "Phường Hiến Thành",
      "Xã Minh Hòa"
    ]
  },
  {
    "newWardId": "10715100",
    "newWardName": "Nguyên Giáp",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hà Kỳ",
      "Xã Nguyên Giáp",
      "Xã Hà Thanh",
      "Xã Tiên Động"
    ]
  },
  {
    "newWardId": "10721109",
    "newWardName": "Nguyễn Lương Bằng",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phạm Kha",
      "Xã Nhân Quyền",
      "Xã Thanh Tùng",
      "Xã Đoàn Tùng"
    ]
  },
  {
    "newWardId": "10703063",
    "newWardName": "Nguyễn Trãi",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Bến Tắm",
      "Xã Bắc An",
      "Xã Hoàng Hoa Thám"
    ]
  },
  {
    "newWardId": "10709071",
    "newWardName": "Nhị Chiểu",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tân Dân",
      "Phường Minh Tân",
      "Phường Duy Tân",
      "Phường Phú Thứ"
    ]
  },
  {
    "newWardId": "10723101",
    "newWardName": "Ninh Giang",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Ninh Giang",
      "Xã Vĩnh Hòa",
      "Xã Hồng Dụ",
      "Xã Hiệp Lực"
    ]
  },
  {
    "newWardId": "10709070",
    "newWardName": "Phạm Sư Mạnh",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Phạm Thái",
      "Phường An Sinh",
      "Phường Hiệp Sơn"
    ]
  },
  {
    "newWardId": "10307017",
    "newWardName": "Phù Liễn",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11449",
      "11440",
      "11656",
      "11437",
      "11434",
      "11443",
      "11446"
    ],
    "oldWardNames": [
      "Phường Bắc Hà",
      "Phường Ngọc Sơn",
      "Thị trấn Trường Sơn",
      "Phường Nam Sơn",
      "Phường Đồng Hòa",
      "Phường Bắc Sơn",
      "Phường Trần Thành Ngọ",
      "Phường Văn Đẩu"
    ]
  },
  {
    "newWardId": "10711111",
    "newWardName": "Phú Thái",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Phú Thái",
      "Xã Kim Xuyên",
      "Xã Kim Anh",
      "Xã Kim Liên",
      "Xã Thượng Quận"
    ]
  },
  {
    "newWardId": "10319035",
    "newWardName": "Quyết Thắng",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11758",
      "11761",
      "11764"
    ],
    "oldWardNames": [
      "Xã Đại Thắng",
      "Xã Tiên Cường",
      "Xã Tự Cường"
    ]
  },
  {
    "newWardId": "10723104",
    "newWardName": "Tân An",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11734"
    ],
    "oldWardNames": [
      "Xã Tân Phong",
      "Xã An Đức",
      "Xã Đức Phúc"
    ]
  },
  {
    "newWardId": "10701056",
    "newWardName": "Tân Hưng",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Hải Tân",
      "Phường Tân Hưng",
      "Xã Ngọc Sơn",
      "Phường Trần Phú"
    ]
  },
  {
    "newWardId": "10715096",
    "newWardName": "Tân Kỳ",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11752"
    ],
    "oldWardNames": [
      "Xã Đại Hợp",
      "Xã Tân Kỳ",
      "Xã Dân An",
      "Xã Kỳ Sơn",
      "Xã Hưng Đạo"
    ]
  },
  {
    "newWardId": "10319037",
    "newWardName": "Tân Minh",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11779",
      "11782",
      "11785",
      "11791"
    ],
    "oldWardNames": [
      "Xã Cấp Tiến",
      "Xã Kiến Thiết",
      "Xã Đoàn Lập",
      "Xã Tân Minh"
    ]
  },
  {
    "newWardId": "10701057",
    "newWardName": "Thạch Khôi",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Thạch Khôi",
      "Xã Gia Xuyên",
      "Xã Liên Hồng",
      "Xã Thống Nhất"
    ]
  },
  {
    "newWardId": "10705074",
    "newWardName": "Thái Tân",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11725"
    ],
    "oldWardNames": [
      "Xã Minh Tân",
      "Xã An Sơn",
      "Xã Thái Tân"
    ]
  },
  {
    "newWardId": "10701054",
    "newWardName": "Thành Đông",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Cẩm Thượng",
      "Phường Bình Hàn",
      "Phường Nguyễn Trãi",
      "Xã An Thượng"
    ]
  },
  {
    "newWardId": "10707078",
    "newWardName": "Thanh Hà",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11722"
    ],
    "oldWardNames": [
      "Thị trấn Thanh Hà",
      "Xã Thanh Sơn",
      "Xã Thanh Tân"
    ]
  },
  {
    "newWardId": "10721106",
    "newWardName": "Thanh Miện",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Cao Thắng",
      "Xã Ngũ Hùng",
      "Xã Tứ Cường",
      "Thị trấn Thanh Miện"
    ]
  },
  {
    "newWardId": "10311002",
    "newWardName": "Thiên Hương",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11557",
      "11569",
      "11521",
      "11572"
    ],
    "oldWardNames": [
      "Phường Thiên Hương",
      "Phường Hoàng Lâm",
      "Phường Lê Hồng Phong",
      "Phường Hoa Động"
    ]
  },
  {
    "newWardId": "10719090",
    "newWardName": "Thượng Hồng",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình Xuyên",
      "Xã Thanh Tùng",
      "Xã Đoàn Tùng",
      "Xã Thúc Kháng",
      "Xã Thái Minh",
      "Xã Tân Hồng",
      "Xã Thái Dương",
      "Xã Thái Hòa"
    ]
  },
  {
    "newWardId": "10319036",
    "newWardName": "Tiên Lãng",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11755",
      "11770",
      "11776",
      "11773"
    ],
    "oldWardNames": [
      "Thị trấn Tiên Lãng",
      "Xã Quyết Tiến",
      "Xã Tiên Thanh",
      "Xã Khởi Nghĩa"
    ]
  },
  {
    "newWardId": "10319038",
    "newWardName": "Tiên Minh",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11797",
      "11800",
      "11791"
    ],
    "oldWardNames": [
      "Xã Tiên Thắng",
      "Xã Tiên Minh",
      "Xã Tân Minh"
    ]
  },
  {
    "newWardId": "10703062",
    "newWardName": "Trần Hưng Đạo",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Lê Lợi",
      "Xã Hưng Đạo",
      "Phường Cộng Hòa"
    ]
  },
  {
    "newWardId": "10709068",
    "newWardName": "Trần Liễu",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường An Phụ",
      "Xã Hiệp Hòa",
      "Xã Thượng Quận"
    ]
  },
  {
    "newWardId": "10703064",
    "newWardName": "Trần Nhân Tông",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Hoàng Tân",
      "Phường Hoàng Tiến",
      "Phường Văn Đức"
    ]
  },
  {
    "newWardId": "10705076",
    "newWardName": "Trần Phú",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11650"
    ],
    "oldWardNames": [
      "Xã Quốc Tuấn",
      "Xã Hiệp Cát",
      "Xã Trần Phú"
    ]
  },
  {
    "newWardId": "10713094",
    "newWardName": "Trường Tân",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phạm Trấn",
      "Xã Nhật Quang",
      "Xã Thống Kênh",
      "Xã Đoàn Thượng",
      "Xã Quang Đức",
      "Thị trấn Thanh Miện"
    ]
  },
  {
    "newWardId": "10717084",
    "newWardName": "Tuệ Tĩnh",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đức Chính",
      "Xã Cẩm Vũ",
      "Xã Cẩm Văn"
    ]
  },
  {
    "newWardId": "10715095",
    "newWardName": "Tứ Kỳ",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Tứ Kỳ",
      "Xã Minh Đức",
      "Xã Quang Khải",
      "Xã Quang Phục"
    ]
  },
  {
    "newWardId": "10717058",
    "newWardName": "Tứ Minh",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Cẩm Đoài",
      "Phường Tứ Minh",
      "Thị trấn Lai Cách"
    ]
  },
  {
    "newWardId": "10701053",
    "newWardName": "Việt Hòa",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Việt Hòa",
      "Xã Cao An",
      "Phường Tứ Minh",
      "Thị trấn Lai Cách"
    ]
  },
  {
    "newWardId": "10311048",
    "newWardName": "Việt Khê",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11503",
      "11485"
    ],
    "oldWardNames": [
      "Xã Ninh Sơn",
      "Xã Liên Xuân"
    ]
  },
  {
    "newWardId": "10321043",
    "newWardName": "Vĩnh Am",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11887",
      "11902",
      "11881"
    ],
    "oldWardNames": [
      "Xã Tam Cường",
      "Xã Cao Minh",
      "Xã Liên Am"
    ]
  },
  {
    "newWardId": "10321041",
    "newWardName": "Vĩnh Bảo",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11824",
      "11866",
      "11857",
      "11860"
    ],
    "oldWardNames": [
      "Thị trấn Vĩnh Bảo",
      "Xã Vĩnh Hưng",
      "Xã Tân Hưng",
      "Xã Tân Liên"
    ]
  },
  {
    "newWardId": "10321044",
    "newWardName": "Vĩnh Hải",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11893",
      "11875"
    ],
    "oldWardNames": [
      "Xã Tiền Phong",
      "Xã Vĩnh Hải"
    ]
  },
  {
    "newWardId": "10321045",
    "newWardName": "Vĩnh Hòa",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11851"
    ],
    "oldWardNames": [
      "Xã Vĩnh Hòa",
      "Xã Hùng Tiến"
    ]
  },
  {
    "newWardId": "10723102",
    "newWardName": "Vĩnh Lại",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ứng Hòe",
      "Xã Tân Hương",
      "Xã Nghĩa An"
    ]
  },
  {
    "newWardId": "10321046",
    "newWardName": "Vĩnh Thịnh",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11836",
      "11839"
    ],
    "oldWardNames": [
      "Xã Thắng Thủy",
      "Xã Trung Lập",
      "Xã Việt Tiến"
    ]
  },
  {
    "newWardId": "10321047",
    "newWardName": "Vĩnh Thuận",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [
      "11842",
      "11830",
      "11827"
    ],
    "oldWardNames": [
      "Xã Vĩnh An",
      "Xã Giang Biên",
      "Xã Dũng Tiến"
    ]
  },
  {
    "newWardId": "10713092",
    "newWardName": "Yết Kiêu",
    "provinceId": "03",
    "provinceName": "Hải Phòng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thống Nhất",
      "Xã Lê Lợi",
      "Xã Yết Kiêu"
    ]
  },
  {
    "newWardId": "70503061",
    "newWardName": "Anh Dũng",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ma Nới",
      "Xã Hòa Sơn"
    ]
  },
  {
    "newWardId": "51109008",
    "newWardName": "Ba Ngòi",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22423",
      "22474"
    ],
    "oldWardNames": [
      "Phường Ba Ngòi",
      "Xã Cam Phước Đông"
    ]
  },
  {
    "newWardId": "70509064",
    "newWardName": "Bác Ái",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phước Tiến",
      "Xã Phước Thắng",
      "Xã Phước Chính"
    ]
  },
  {
    "newWardId": "70509063",
    "newWardName": "Bác Ái Đông",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phước Đại",
      "Xã Phước Thành"
    ]
  },
  {
    "newWardId": "70509065",
    "newWardName": "Bác Ái Tây",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phước Hòa",
      "Xã Phước Tân",
      "Xã Phước Bình"
    ]
  },
  {
    "newWardId": "70501045",
    "newWardName": "Bảo An",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Phước Mỹ",
      "Phường Bảo An",
      "Xã Thành Hải"
    ]
  },
  {
    "newWardId": "51109005",
    "newWardName": "Bắc Cam Ranh",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22408",
      "22411",
      "22468"
    ],
    "oldWardNames": [
      "Phường Cam Nghĩa",
      "Phường Cam Phúc Bắc",
      "Xã Cam Thành Nam"
    ]
  },
  {
    "newWardId": "51111033",
    "newWardName": "Bắc Khánh Vĩnh",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22615",
      "22621"
    ],
    "oldWardNames": [
      "Xã Khánh Bình",
      "Xã Khánh Đông"
    ]
  },
  {
    "newWardId": "51101002",
    "newWardName": "Bắc Nha Trang",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22327",
      "22330",
      "22333",
      "22339",
      "22384",
      "22387"
    ],
    "oldWardNames": [
      "Phường Vĩnh Hòa",
      "Phường Vĩnh Hải",
      "Phường Vĩnh Phước",
      "Phường Vĩnh Thọ",
      "Xã Vĩnh Lương",
      "Xã Vĩnh Phương"
    ]
  },
  {
    "newWardId": "51105010",
    "newWardName": "Bắc Ninh Hòa",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22540",
      "22531",
      "22546"
    ],
    "oldWardNames": [
      "Xã Ninh An",
      "Xã Ninh Sơn",
      "Xã Ninh Thọ"
    ]
  },
  {
    "newWardId": "70513051",
    "newWardName": "Cà Ná",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phước Diêm",
      "Xã Cà Ná"
    ]
  },
  {
    "newWardId": "51117032",
    "newWardName": "Cam An",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22459",
      "22465",
      "22471"
    ],
    "oldWardNames": [
      "Xã Cam Phước Tây",
      "Xã Cam An Bắc",
      "Xã Cam An Nam"
    ]
  },
  {
    "newWardId": "51117031",
    "newWardName": "Cam Hiệp",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22447",
      "22450",
      "22456",
      "22438",
      "22435",
      "22711"
    ],
    "oldWardNames": [
      "Xã Sơn Tân",
      "Xã Cam Hiệp Bắc",
      "Xã Cam Hiệp Nam",
      "Xã Cam Hòa",
      "Xã Cam Tân",
      "Xã Suối Tân"
    ]
  },
  {
    "newWardId": "51117029",
    "newWardName": "Cam Lâm",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22453",
      "22441",
      "22444",
      "22462",
      "22450",
      "22456",
      "22438",
      "22435",
      "22465",
      "22471",
      "22711"
    ],
    "oldWardNames": [
      "Thị trấn Cam Đức",
      "Xã Cam Hải Đông",
      "Xã Cam Hải Tây",
      "Xã Cam Thành Bắc",
      "Xã Cam Hiệp Bắc",
      "Xã Cam Hiệp Nam",
      "Xã Cam Hòa",
      "Xã Cam Tân",
      "Xã Cam An Bắc",
      "Xã Cam An Nam",
      "Xã Suối Tân"
    ]
  },
  {
    "newWardId": "51109007",
    "newWardName": "Cam Linh",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22426",
      "22429",
      "22432"
    ],
    "oldWardNames": [
      "Phường Cam Thuận",
      "Phường Cam Lợi",
      "Phường Cam Linh"
    ]
  },
  {
    "newWardId": "51109006",
    "newWardName": "Cam Ranh",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22420",
      "22417",
      "22414"
    ],
    "oldWardNames": [
      "Phường Cam Phú",
      "Phường Cam Lộc",
      "Phường Cam Phúc Nam"
    ]
  },
  {
    "newWardId": "70511058",
    "newWardName": "Công Hải",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phước Chiến",
      "Xã Công Hải"
    ]
  },
  {
    "newWardId": "51107025",
    "newWardName": "Diên Điền",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22663",
      "22669",
      "22657"
    ],
    "oldWardNames": [
      "Xã Diên Sơn",
      "Xã Diên Phú",
      "Xã Diên Điền"
    ]
  },
  {
    "newWardId": "51107023",
    "newWardName": "Diên Khánh",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22651",
      "22693",
      "22690"
    ],
    "oldWardNames": [
      "Thị trấn Diên Khánh",
      "Xã Diên An",
      "Xã Diên Toàn"
    ]
  },
  {
    "newWardId": "51107024",
    "newWardName": "Diên Lạc",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22687",
      "22678",
      "22684"
    ],
    "oldWardNames": [
      "Xã Diên Thạnh",
      "Xã Diên Lạc",
      "Xã Diên Hòa"
    ]
  },
  {
    "newWardId": "51107026",
    "newWardName": "Diên Lâm",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22660",
      "22654"
    ],
    "oldWardNames": [
      "Xã Xuân Đồng",
      "Xã Diên Lâm"
    ]
  },
  {
    "newWardId": "51107027",
    "newWardName": "Diên Thọ",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22681",
      "22675",
      "22672"
    ],
    "oldWardNames": [
      "Xã Diên Tân",
      "Xã Diên Phước",
      "Xã Diên Thọ"
    ]
  },
  {
    "newWardId": "51103018",
    "newWardName": "Đại Lãnh",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22519",
      "22504",
      "22492"
    ],
    "oldWardNames": [
      "Xã Vạn Thạnh",
      "Xã Vạn Thọ",
      "Xã Đại Lãnh"
    ]
  },
  {
    "newWardId": "70501046",
    "newWardName": "Đô Vinh",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Đô Vinh",
      "Xã Nhơn Sơn"
    ]
  },
  {
    "newWardId": "70501043",
    "newWardName": "Đông Hải",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Mỹ Bình",
      "Phường Mỹ Đông",
      "Phường Mỹ Hải",
      "Phường Đông Hải"
    ]
  },
  {
    "newWardId": "51113040",
    "newWardName": "Đông Khánh Sơn",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22729",
      "22732",
      "22735"
    ],
    "oldWardNames": [
      "Xã Sơn Trung",
      "Xã Ba Cụm Bắc",
      "Xã Ba Cụm Nam"
    ]
  },
  {
    "newWardId": "51105013",
    "newWardName": "Đông Ninh Hòa",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22561",
      "22543",
      "22567",
      "22606"
    ],
    "oldWardNames": [
      "Phường Ninh Diêm",
      "Phường Ninh Hải",
      "Phường Ninh Thủy",
      "Xã Ninh Phước"
    ]
  },
  {
    "newWardId": "51105014",
    "newWardName": "Hòa Thắng",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22591",
      "22594",
      "22582"
    ],
    "oldWardNames": [
      "Phường Ninh Giang",
      "Phường Ninh Hà",
      "Xã Ninh Phú"
    ]
  },
  {
    "newWardId": "51105017",
    "newWardName": "Hòa Trí",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22537",
      "22549",
      "22558"
    ],
    "oldWardNames": [
      "Xã Ninh Thượng",
      "Xã Ninh Trung",
      "Xã Ninh Thân"
    ]
  },
  {
    "newWardId": "51113038",
    "newWardName": "Khánh Sơn",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22714",
      "22723",
      "22726"
    ],
    "oldWardNames": [
      "Thị trấn Tô Hạp",
      "Xã Sơn Hiệp",
      "Xã Sơn Bình"
    ]
  },
  {
    "newWardId": "51111037",
    "newWardName": "Khánh Vĩnh",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22609",
      "22630",
      "22645"
    ],
    "oldWardNames": [
      "Thị trấn Khánh Vĩnh",
      "Xã Sông Cầu",
      "Xã Khánh Phú"
    ]
  },
  {
    "newWardId": "70503060",
    "newWardName": "Lâm Sơn",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Lương Sơn",
      "Xã Lâm Sơn"
    ]
  },
  {
    "newWardId": "70503062",
    "newWardName": "Mỹ Sơn",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phước Trung",
      "Xã Mỹ Sơn"
    ]
  },
  {
    "newWardId": "51109009",
    "newWardName": "Nam Cam Ranh",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22483",
      "22486",
      "22480",
      "22477"
    ],
    "oldWardNames": [
      "Xã Cam Lập",
      "Xã Cam Bình",
      "Xã Cam Thịnh Đông",
      "Xã Cam Thịnh Tây"
    ]
  },
  {
    "newWardId": "51111036",
    "newWardName": "Nam Khánh Vĩnh",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22636",
      "22642",
      "22639",
      "22648"
    ],
    "oldWardNames": [
      "Xã Cầu Bà",
      "Xã Khánh Thành",
      "Xã Liên Sang",
      "Xã Sơn Thái"
    ]
  },
  {
    "newWardId": "51101004",
    "newWardName": "Nam Nha Trang",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22357",
      "22378",
      "22381",
      "22402",
      "22405"
    ],
    "oldWardNames": [
      "Phường Phước Hải",
      "Phường Phước Long",
      "Phường Vĩnh Trường",
      "Xã Vĩnh Thái",
      "Xã Phước Đồng"
    ]
  },
  {
    "newWardId": "51105015",
    "newWardName": "Nam Ninh Hòa",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22600",
      "22603",
      "22597",
      "22585"
    ],
    "oldWardNames": [
      "Xã Ninh Lộc",
      "Xã Ninh Ích",
      "Xã Ninh Hưng",
      "Xã Ninh Tân"
    ]
  },
  {
    "newWardId": "51101001",
    "newWardName": "Nha Trang",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22348",
      "22363",
      "22375",
      "22366",
      "22372"
    ],
    "oldWardNames": [
      "Phường Vạn Thạnh",
      "Phường Lộc Thọ",
      "Phường Vĩnh Nguyên",
      "Phường Tân Tiến",
      "Phường Phước Hòa"
    ]
  },
  {
    "newWardId": "70505044",
    "newWardName": "Ninh Chử",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Văn Hải",
      "Thị trấn Khánh Hải"
    ]
  },
  {
    "newWardId": "70505054",
    "newWardName": "Ninh Hải",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phương Hải",
      "Xã Tri Hải",
      "Xã Bắc Sơn"
    ]
  },
  {
    "newWardId": "51105011",
    "newWardName": "Ninh Hòa",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22528",
      "22570",
      "22564",
      "22573"
    ],
    "oldWardNames": [
      "Phường Ninh Hiệp",
      "Phường Ninh Đa",
      "Xã Ninh Đông",
      "Xã Ninh Phụng"
    ]
  },
  {
    "newWardId": "70507047",
    "newWardName": "Ninh Phước",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Phước Dân",
      "Xã Phước Thuận",
      "Xã Phước Hải"
    ]
  },
  {
    "newWardId": "70503059",
    "newWardName": "Ninh Sơn",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Tân Sơn",
      "Xã Quảng Sơn"
    ]
  },
  {
    "newWardId": "70501042",
    "newWardName": "Phan Rang",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Kinh Dinh",
      "Phường Phủ Hà",
      "Phường Đài Sơn",
      "Phường Đạo Long"
    ]
  },
  {
    "newWardId": "70513053",
    "newWardName": "Phước Dinh",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Hải",
      "Xã Phước Dinh",
      "Phường Đông Hải"
    ]
  },
  {
    "newWardId": "70513052",
    "newWardName": "Phước Hà",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nhị Hà",
      "Xã Phước Hà"
    ]
  },
  {
    "newWardId": "70507049",
    "newWardName": "Phước Hậu",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phước Vinh",
      "Xã Phước Sơn",
      "Xã Phước Hậu"
    ]
  },
  {
    "newWardId": "70507048",
    "newWardName": "Phước Hữu",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phước Thái",
      "Xã Phước Hữu"
    ]
  },
  {
    "newWardId": "51117030",
    "newWardName": "Suối Dầu",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22708",
      "22438",
      "22435",
      "22711"
    ],
    "oldWardNames": [
      "Xã Suối Cát",
      "Xã Cam Hòa",
      "Xã Cam Tân",
      "Xã Suối Tân"
    ]
  },
  {
    "newWardId": "51107028",
    "newWardName": "Suối Hiệp",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22705",
      "22696",
      "22702"
    ],
    "oldWardNames": [
      "Xã Suối Tiên",
      "Xã Bình Lộc",
      "Xã Suối Hiệp"
    ]
  },
  {
    "newWardId": "51105012",
    "newWardName": "Tân Định",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22555",
      "22588",
      "22576"
    ],
    "oldWardNames": [
      "Xã Ninh Xuân",
      "Xã Ninh Quang",
      "Xã Ninh Bình"
    ]
  },
  {
    "newWardId": "51113039",
    "newWardName": "Tây Khánh Sơn",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22720",
      "22717"
    ],
    "oldWardNames": [
      "Xã Sơn Lâm",
      "Xã Thành Sơn"
    ]
  },
  {
    "newWardId": "51111035",
    "newWardName": "Tây Khánh Vĩnh",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22633",
      "22624",
      "22627"
    ],
    "oldWardNames": [
      "Xã Giang Ly",
      "Xã Khánh Thượng",
      "Xã Khánh Nam"
    ]
  },
  {
    "newWardId": "51101003",
    "newWardName": "Tây Nha Trang",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22336",
      "22351",
      "22390",
      "22393",
      "22399",
      "22396"
    ],
    "oldWardNames": [
      "Phường Ngọc Hiệp",
      "Phường Phương Sài",
      "Xã Vĩnh Ngọc",
      "Xã Vĩnh Thạnh",
      "Xã Vĩnh Hiệp",
      "Xã Vĩnh Trung"
    ]
  },
  {
    "newWardId": "51105016",
    "newWardName": "Tây Ninh Hòa",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22534",
      "22552"
    ],
    "oldWardNames": [
      "Xã Ninh Tây",
      "Xã Ninh Sim"
    ]
  },
  {
    "newWardId": "70511057",
    "newWardName": "Thuận Bắc",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bắc Phong",
      "Xã Phước Kháng",
      "Xã Lợi Hải"
    ]
  },
  {
    "newWardId": "70513050",
    "newWardName": "Thuận Nam",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phước Nam",
      "Xã Phước Ninh",
      "Xã Phước Minh"
    ]
  },
  {
    "newWardId": "51111034",
    "newWardName": "Trung Khánh Vĩnh",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22618",
      "22612"
    ],
    "oldWardNames": [
      "Xã Khánh Trung",
      "Xã Khánh Hiệp"
    ]
  },
  {
    "newWardId": "51103019",
    "newWardName": "Tu Bông",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22507",
      "22498",
      "22495"
    ],
    "oldWardNames": [
      "Xã Vạn Khánh",
      "Xã Vạn Long",
      "Xã Vạn Phước"
    ]
  },
  {
    "newWardId": "51103022",
    "newWardName": "Vạn Hưng",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22522",
      "22525"
    ],
    "oldWardNames": [
      "Xã Xuân Sơn",
      "Xã Vạn Hưng"
    ]
  },
  {
    "newWardId": "51103021",
    "newWardName": "Vạn Ninh",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22489",
      "22510",
      "22513"
    ],
    "oldWardNames": [
      "Thị trấn Vạn Giã",
      "Xã Vạn Phú",
      "Xã Vạn Lương"
    ]
  },
  {
    "newWardId": "51103020",
    "newWardName": "Vạn Thắng",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [
      "22501",
      "22516"
    ],
    "oldWardNames": [
      "Xã Vạn Bình",
      "Xã Vạn Thắng"
    ]
  },
  {
    "newWardId": "70505056",
    "newWardName": "Vĩnh Hải",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nhơn Hải",
      "Xã Thanh Hải",
      "Xã Vĩnh Hải"
    ]
  },
  {
    "newWardId": "70505055",
    "newWardName": "Xuân Hải",
    "provinceId": "11",
    "provinceName": "Khánh Hòa",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hộ Hải",
      "Xã Tân Hải",
      "Xã Xuân Hải"
    ]
  },
  {
    "newWardId": "30205009",
    "newWardName": "Bản Bo",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3427",
      "3424"
    ],
    "oldWardNames": [
      "Xã Nà Tăm",
      "Xã Bản Bo"
    ]
  },
  {
    "newWardId": "30205010",
    "newWardName": "Bình Lư",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3390",
      "3413",
      "3412"
    ],
    "oldWardNames": [
      "Thị trấn Tam Đường",
      "Xã Sơn Bình",
      "Xã Bình Lư"
    ]
  },
  {
    "newWardId": "30201032",
    "newWardName": "Bum Nưa",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3466"
    ],
    "oldWardNames": [
      "Xã Pa Vệ Sủ",
      "Xã Bum Nưa"
    ]
  },
  {
    "newWardId": "30201033",
    "newWardName": "Bum Tở",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3433",
      "3454"
    ],
    "oldWardNames": [
      "Thị trấn Mường Tè",
      "Xã Can Hồ",
      "Xã Bum Tở"
    ]
  },
  {
    "newWardId": "30203018",
    "newWardName": "Dào San",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3568",
      "3571"
    ],
    "oldWardNames": [
      "Xã Tung Qua Lìn",
      "Xã Mù Sang",
      "Xã Dào San"
    ]
  },
  {
    "newWardId": "30202014",
    "newWardName": "Đoàn Kết",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3389",
      "3388",
      "3386",
      "3403"
    ],
    "oldWardNames": [
      "Phường Đoàn Kết",
      "Phường Quyết Tiến",
      "Phường Quyết Thắng",
      "Xã Lản Nhì Thàng",
      "Xã Sùng Phài"
    ]
  },
  {
    "newWardId": "30207022",
    "newWardName": "Hồng Thu",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3496",
      "3508",
      "3499"
    ],
    "oldWardNames": [
      "Xã Phìn Hồ",
      "Xã Ma Quai",
      "Xã Hồng Thu"
    ]
  },
  {
    "newWardId": "30213030",
    "newWardName": "Hua Bum",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3467"
    ],
    "oldWardNames": [
      "Xã Vàng San",
      "Xã Hua Bum"
    ]
  },
  {
    "newWardId": "30209002",
    "newWardName": "Khoen On",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3643"
    ],
    "oldWardNames": [
      "Xã Ta Gia",
      "Xã Khoen On"
    ]
  },
  {
    "newWardId": "30203019",
    "newWardName": "Khổng Lào",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3580",
      "3577",
      "3583"
    ],
    "oldWardNames": [
      "Xã Hoang Thèn",
      "Xã Bản Lang",
      "Xã Khổng Lào"
    ]
  },
  {
    "newWardId": "30205012",
    "newWardName": "Khun Há",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3421",
      "3430"
    ],
    "oldWardNames": [
      "Xã Bản Hon",
      "Xã Khun Há"
    ]
  },
  {
    "newWardId": "30213027",
    "newWardName": "Lê Lợi",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3488",
      "3484",
      "3487",
      "3481"
    ],
    "oldWardNames": [
      "Xã Nậm Pì",
      "Xã Pú Đao",
      "Xã Chăn Nưa",
      "Xã Lê Lợi"
    ]
  },
  {
    "newWardId": "30201038",
    "newWardName": "Mù Cả",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3451"
    ],
    "oldWardNames": [
      "Xã Mù Cả"
    ]
  },
  {
    "newWardId": "30211008",
    "newWardName": "Mường Khoa",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3602",
      "3601"
    ],
    "oldWardNames": [
      "Xã Phúc Khoa",
      "Xã Mường Khoa"
    ]
  },
  {
    "newWardId": "30209001",
    "newWardName": "Mường Kim",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3638",
      "3634",
      "3628",
      "3637"
    ],
    "oldWardNames": [
      "Xã Tà Mung",
      "Xã Tà Hừa",
      "Xã Pha Mu",
      "Xã Mường Kim"
    ]
  },
  {
    "newWardId": "30213029",
    "newWardName": "Mường Mô",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3473",
      "3472"
    ],
    "oldWardNames": [
      "Xã Nậm Chà",
      "Xã Mường Mô"
    ]
  },
  {
    "newWardId": "30201034",
    "newWardName": "Mường Tè",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3457",
      "3445"
    ],
    "oldWardNames": [
      "Xã Nậm Khao",
      "Xã Mường Tè"
    ]
  },
  {
    "newWardId": "30209004",
    "newWardName": "Mường Than",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3618",
      "3625"
    ],
    "oldWardNames": [
      "Xã Phúc Than",
      "Xã Mường Mít"
    ]
  },
  {
    "newWardId": "30207025",
    "newWardName": "Nậm Cuổi",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3547",
      "3544"
    ],
    "oldWardNames": [
      "Xã Nậm Hăn",
      "Xã Nậm Cuổi"
    ]
  },
  {
    "newWardId": "30213028",
    "newWardName": "Nậm Hàng",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3434",
      "3474",
      "3475"
    ],
    "oldWardNames": [
      "Thị trấn Nậm Nhùn",
      "Xã Nậm Manh",
      "Xã Nậm Hàng"
    ]
  },
  {
    "newWardId": "30207026",
    "newWardName": "Nậm Mạ",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3538",
      "3535"
    ],
    "oldWardNames": [
      "Xã Căn Co",
      "Xã Nậm Mạ"
    ]
  },
  {
    "newWardId": "30211006",
    "newWardName": "Nậm Sỏ",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3622",
      "3613"
    ],
    "oldWardNames": [
      "Xã Tà Mít",
      "Xã Nậm Sỏ"
    ]
  },
  {
    "newWardId": "30207023",
    "newWardName": "Nậm Tăm",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3509",
      "3526",
      "3517"
    ],
    "oldWardNames": [
      "Xã Lùng Thàng",
      "Xã Nậm Cha",
      "Xã Nậm Tăm"
    ]
  },
  {
    "newWardId": "30213031",
    "newWardName": "Pa Tần",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3502",
      "3503",
      "3493"
    ],
    "oldWardNames": [
      "Xã Nậm Ban",
      "Xã Trung Chải",
      "Xã Pa Tần"
    ]
  },
  {
    "newWardId": "30201036",
    "newWardName": "Pa Ủ",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3440"
    ],
    "oldWardNames": [
      "Xã Tá Bạ",
      "Xã Pa Ủ"
    ]
  },
  {
    "newWardId": "30211005",
    "newWardName": "Pắc Ta",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3607",
      "3616"
    ],
    "oldWardNames": [
      "Xã Hố Mít",
      "Xã Pắc Ta"
    ]
  },
  {
    "newWardId": "30203016",
    "newWardName": "Phong Thổ",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3549",
      "3490",
      "3589"
    ],
    "oldWardNames": [
      "Thị trấn Phong Thổ",
      "Xã Huổi Luông",
      "Xã Ma Li Pho",
      "Xã Mường So"
    ]
  },
  {
    "newWardId": "30207024",
    "newWardName": "Pu Sam Cáp",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3532",
      "3523"
    ],
    "oldWardNames": [
      "Xã Pa Khóa",
      "Xã Noong Hẻo",
      "Xã Pu Sam Cáp"
    ]
  },
  {
    "newWardId": "30203017",
    "newWardName": "Sì Lở Lầu",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3562",
      "3553",
      "3559",
      "3550"
    ],
    "oldWardNames": [
      "Xã Vàng Ma Chải",
      "Xã Mồ Sì San",
      "Xã Pa Vây Sử",
      "Xã Sì Lở Lầu"
    ]
  },
  {
    "newWardId": "30207021",
    "newWardName": "Sìn Hồ",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3478",
      "3514",
      "3505",
      "3511"
    ],
    "oldWardNames": [
      "Thị trấn Sìn Hồ",
      "Xã Sà Dề Phìn",
      "Xã Phăng Sô Lin",
      "Xã Tả Phìn"
    ]
  },
  {
    "newWardId": "30203015",
    "newWardName": "Sin Suối Hồ",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3586",
      "3394",
      "3592"
    ],
    "oldWardNames": [
      "Xã Nậm Xe",
      "Xã Thèn Sin",
      "Xã Sin Suối Hồ"
    ]
  },
  {
    "newWardId": "30205011",
    "newWardName": "Tả Lèng",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3405",
      "3406",
      "3400"
    ],
    "oldWardNames": [
      "Xã Giang Ma",
      "Xã Hồ Thầu",
      "Xã Tả Lèng"
    ]
  },
  {
    "newWardId": "30201037",
    "newWardName": "Tà Tổng",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3463"
    ],
    "oldWardNames": [
      "Xã Tà Tổng"
    ]
  },
  {
    "newWardId": "30202013",
    "newWardName": "Tân Phong",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3387",
      "3408",
      "3409",
      "3415",
      "3418"
    ],
    "oldWardNames": [
      "Phường Tân Phong",
      "Phường Đông Phong",
      "Xã San Thàng",
      "Xã Nùng Nàng",
      "Xã Bản Giang"
    ]
  },
  {
    "newWardId": "30211007",
    "newWardName": "Tân Uyên",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3598",
      "3605",
      "3604",
      "3610"
    ],
    "oldWardNames": [
      "Thị trấn Tân Uyên",
      "Xã Trung Đồng",
      "Xã Thân Thuộc",
      "Xã Nậm Cần"
    ]
  },
  {
    "newWardId": "30209003",
    "newWardName": "Than Uyên",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3595",
      "3619",
      "3632",
      "3631"
    ],
    "oldWardNames": [
      "Thị trấn Than Uyên",
      "Xã Mường Than",
      "Xã Hua Nà",
      "Xã Mường Cang"
    ]
  },
  {
    "newWardId": "30201035",
    "newWardName": "Thu Lũm",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3439",
      "3436"
    ],
    "oldWardNames": [
      "Xã Ka Lăng",
      "Xã Thu Lũm"
    ]
  },
  {
    "newWardId": "30207020",
    "newWardName": "Tủa Sín Chải",
    "provinceId": "02",
    "provinceName": "Lai Châu",
    "oldWardIds": [
      "3529",
      "3520",
      "3541"
    ],
    "oldWardNames": [
      "Xã Làng Mô",
      "Xã Tả Ngảo",
      "Xã Tủa Sín Chải"
    ]
  },
  {
    "newWardId": "20507058",
    "newWardName": "A Mú Sung",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2689",
      "2686"
    ],
    "oldWardNames": [
      "Xã Nậm Chạc",
      "Xã A Mú Sung"
    ]
  },
  {
    "newWardId": "21301040",
    "newWardName": "Âu Lâu",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Hợp Minh",
      "Xã Giới Phiên",
      "Xã Minh Quân",
      "Xã Âu Lâu"
    ]
  },
  {
    "newWardId": "20513076",
    "newWardName": "Bản Hồ",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2779",
      "3046"
    ],
    "oldWardNames": [
      "Xã Thanh Bình",
      "Xã Bản Hồ"
    ]
  },
  {
    "newWardId": "20505088",
    "newWardName": "Bản Lầu",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2797",
      "2785",
      "2788"
    ],
    "oldWardNames": [
      "Xã Bản Sen",
      "Xã Lùng Vai",
      "Xã Bản Lầu"
    ]
  },
  {
    "newWardId": "20509082",
    "newWardName": "Bản Liền",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2887",
      "2869"
    ],
    "oldWardNames": [
      "Xã Nậm Khánh",
      "Xã Bản Liền"
    ]
  },
  {
    "newWardId": "20507060",
    "newWardName": "Bản Xèo",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2737",
      "2719",
      "2725"
    ],
    "oldWardNames": [
      "Xã Pa Cheo",
      "Xã Mường Vi",
      "Xã Bản Xèo"
    ]
  },
  {
    "newWardId": "21313036",
    "newWardName": "Bảo Ái",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Cảm Ân",
      "Xã Mông Sơn",
      "Xã Tân Nguyên",
      "Xã Bảo Ái"
    ]
  },
  {
    "newWardId": "20515067",
    "newWardName": "Bảo Hà",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2971",
      "2974",
      "3079",
      "3070",
      "2989"
    ],
    "oldWardNames": [
      "Xã Kim Sơn",
      "Xã Cam Cọn",
      "Xã Tân An",
      "Xã Tân Thượng",
      "Xã Bảo Hà"
    ]
  },
  {
    "newWardId": "20509081",
    "newWardName": "Bảo Nhai",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2884",
      "2878",
      "2890"
    ],
    "oldWardNames": [
      "Xã Nậm Đét",
      "Xã Cốc Ly",
      "Xã Bảo Nhai"
    ]
  },
  {
    "newWardId": "20511048",
    "newWardName": "Bảo Thắng",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2905",
      "2938",
      "2929",
      "2917"
    ],
    "oldWardNames": [
      "Thị trấn Phố Lu",
      "Xã Sơn Hà",
      "Xã Sơn Hải",
      "Xã Thái Niên"
    ]
  },
  {
    "newWardId": "20515064",
    "newWardName": "Bảo Yên",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2947",
      "2986",
      "2992",
      "2980"
    ],
    "oldWardNames": [
      "Thị trấn Phố Ràng",
      "Xã Yên Sơn",
      "Xã Lương Sơn",
      "Xã Xuân Thượng"
    ]
  },
  {
    "newWardId": "20507061",
    "newWardName": "Bát Xát",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2683",
      "2710",
      "2716",
      "2743",
      "2734"
    ],
    "oldWardNames": [
      "Thị trấn Bát Xát",
      "Xã Bản Vược",
      "Xã Bản Qua",
      "Xã Phìn Ngan",
      "Xã Quang Kim"
    ]
  },
  {
    "newWardId": "20509083",
    "newWardName": "Bắc Hà",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2839",
      "2875",
      "2857",
      "2866",
      "2863",
      "2881"
    ],
    "oldWardNames": [
      "Thị trấn Bắc Hà",
      "Xã Na Hối",
      "Xã Thải Giàng Phố",
      "Xã Bản Phố",
      "Xã Hoàng Thu Phố",
      "Xã Nậm Mòn"
    ]
  },
  {
    "newWardId": "20501053",
    "newWardName": "Cam Đường",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2671",
      "2656",
      "2653",
      "2668",
      "2650",
      "2658",
      "2674"
    ],
    "oldWardNames": [
      "Phường Nam Cường",
      "Phường Xuân Tăng",
      "Phường Pom Hán",
      "Phường Bắc Cường",
      "Phường Bắc Lệnh",
      "Phường Bình Minh",
      "Xã Cam Đường"
    ]
  },
  {
    "newWardId": "21313032",
    "newWardName": "Cảm Nhân",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Xuân Long",
      "Xã Ngọc Chấn",
      "Xã Cảm Nhân"
    ]
  },
  {
    "newWardId": "20505089",
    "newWardName": "Cao Sơn",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2776",
      "2794",
      "2791",
      "2782"
    ],
    "oldWardNames": [
      "Xã Lùng Khấu Nhin",
      "Xã Tả Thàng",
      "Xã La Pan Tẩn",
      "Xã Cao Sơn"
    ]
  },
  {
    "newWardId": "21315097",
    "newWardName": "Cát Thịnh",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Cát Thịnh"
    ]
  },
  {
    "newWardId": "21303010",
    "newWardName": "Cầu Thia",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Cầu Thia",
      "Xã Thanh Lương",
      "Xã Thạch Lương",
      "Xã Phúc Sơn",
      "Xã Hạnh Sơn"
    ]
  },
  {
    "newWardId": "21315015",
    "newWardName": "Chấn Thịnh",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Thịnh",
      "Xã Đại Lịch",
      "Xã Chấn Thịnh"
    ]
  },
  {
    "newWardId": "21307019",
    "newWardName": "Châu Quế",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Châu Quế Thượng",
      "Xã Châu Quế Hạ"
    ]
  },
  {
    "newWardId": "21309093",
    "newWardName": "Chế Tạo",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Chế Tạo"
    ]
  },
  {
    "newWardId": "20519072",
    "newWardName": "Chiềng Ken",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "3109",
      "3091"
    ],
    "oldWardNames": [
      "Xã Nậm Tha",
      "Xã Chiềng Ken"
    ]
  },
  {
    "newWardId": "20509080",
    "newWardName": "Cốc Lầu",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2893",
      "2899",
      "2896"
    ],
    "oldWardNames": [
      "Xã Nậm Lúc",
      "Xã Bản Cái",
      "Xã Cốc Lầu"
    ]
  },
  {
    "newWardId": "20501051",
    "newWardName": "Cốc San",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2662",
      "2749",
      "2746"
    ],
    "oldWardNames": [
      "Xã Đồng Tuyển",
      "Xã Tòng Sành",
      "Xã Cốc San"
    ]
  },
  {
    "newWardId": "20507056",
    "newWardName": "Dền Sáng",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2722",
      "2713",
      "2707"
    ],
    "oldWardNames": [
      "Xã Dền Thàng",
      "Xã Sàng Ma Sáo",
      "Xã Dền Sáng"
    ]
  },
  {
    "newWardId": "20519071",
    "newWardName": "Dương Quỳ",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "3106"
    ],
    "oldWardNames": [
      "Xã Thẳm Dương",
      "Xã Dương Quỳ"
    ]
  },
  {
    "newWardId": "21307021",
    "newWardName": "Đông Cuông",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Quang Minh",
      "Xã An Bình",
      "Xã Đông An",
      "Xã Đông Cuông"
    ]
  },
  {
    "newWardId": "21315012",
    "newWardName": "Gia Hội",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nậm Búng",
      "Xã Nậm Lành",
      "Xã Gia Hội"
    ]
  },
  {
    "newWardId": "20511050",
    "newWardName": "Gia Phú",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2932",
      "2659",
      "2923"
    ],
    "oldWardNames": [
      "Xã Xuân Giao",
      "Xã Thống Nhất",
      "Xã Gia Phú"
    ]
  },
  {
    "newWardId": "21317006",
    "newWardName": "Hạnh Phúc",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Trạm Tấu",
      "Xã Bản Công",
      "Xã Hát Lừu",
      "Xã Xà Hồ"
    ]
  },
  {
    "newWardId": "20501052",
    "newWardName": "Hợp Thành",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2677",
      "2680"
    ],
    "oldWardNames": [
      "Xã Tả Phời",
      "Xã Hợp Thành"
    ]
  },
  {
    "newWardId": "21311042",
    "newWardName": "Hưng Khánh",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hồng Ca",
      "Xã Hưng Khánh"
    ]
  },
  {
    "newWardId": "21305029",
    "newWardName": "Khánh Hòa",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tô Mậu",
      "Xã An Lạc",
      "Xã Động Quan",
      "Xã Khánh Hòa"
    ]
  },
  {
    "newWardId": "20519069",
    "newWardName": "Khánh Yên",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "3100",
      "3118",
      "3103"
    ],
    "oldWardNames": [
      "Xã Khánh Yên Trung",
      "Xã Liêm Phú",
      "Xã Khánh Yên Hạ"
    ]
  },
  {
    "newWardId": "21309001",
    "newWardName": "Khao Mang",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hồ Bốn",
      "Xã Khao Mang"
    ]
  },
  {
    "newWardId": "20501054",
    "newWardName": "Lào Cai",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2635",
      "2644",
      "2647",
      "2641",
      "2911"
    ],
    "oldWardNames": [
      "Phường Duyên Hải",
      "Phường Cốc Lếu",
      "Phường Kim Tân",
      "Phường Lào Cai",
      "Xã Vạn Hòa",
      "Xã Bản Phiệt"
    ]
  },
  {
    "newWardId": "21309092",
    "newWardName": "Lao Chải",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Lao Chải"
    ]
  },
  {
    "newWardId": "21307020",
    "newWardName": "Lâm Giang",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Lang Thíp",
      "Xã Lâm Giang"
    ]
  },
  {
    "newWardId": "21305026",
    "newWardName": "Lâm Thượng",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Mai Sơn",
      "Xã Khánh Thiện",
      "Xã Tân Phượng",
      "Xã Lâm Thượng"
    ]
  },
  {
    "newWardId": "21303011",
    "newWardName": "Liên Sơn",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn NT Liên Sơn",
      "Xã Sơn A",
      "Xã Nghĩa Phúc"
    ]
  },
  {
    "newWardId": "21305027",
    "newWardName": "Lục Yên",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Yên Thế",
      "Xã Minh Xuân",
      "Xã Yên Thắng",
      "Xã Liễu Đô"
    ]
  },
  {
    "newWardId": "20509085",
    "newWardName": "Lùng Phình",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2851",
      "2848",
      "2818"
    ],
    "oldWardNames": [
      "Xã Tả Van Chư",
      "Xã Lùng Phình",
      "Xã Lùng Thẩn"
    ]
  },
  {
    "newWardId": "21311043",
    "newWardName": "Lương Thịnh",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hưng Thịnh",
      "Xã Lương Thịnh"
    ]
  },
  {
    "newWardId": "21307023",
    "newWardName": "Mậu A",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Mậu A",
      "Xã Yên Thái",
      "Xã An Thịnh",
      "Xã Mậu Đông",
      "Xã Ngòi A"
    ]
  },
  {
    "newWardId": "20519073",
    "newWardName": "Minh Lương",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "3121",
      "3112"
    ],
    "oldWardNames": [
      "Xã Nậm Xây",
      "Xã Minh Lương"
    ]
  },
  {
    "newWardId": "21307025",
    "newWardName": "Mỏ Vàng",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Lương",
      "Xã Mỏ Vàng"
    ]
  },
  {
    "newWardId": "21309002",
    "newWardName": "Mù Cang Chải",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Mù Cang Chải",
      "Xã Kim Nọi",
      "Xã Mồ Dề",
      "Xã Chế Cu Nha"
    ]
  },
  {
    "newWardId": "20513075",
    "newWardName": "Mường Bo",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "3052",
      "3043"
    ],
    "oldWardNames": [
      "Xã Liên Minh",
      "Xã Mường Bo"
    ]
  },
  {
    "newWardId": "20507055",
    "newWardName": "Mường Hum",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2740",
      "2731",
      "2728"
    ],
    "oldWardNames": [
      "Xã Nậm Pung",
      "Xã Trung Lèng Hồ",
      "Xã Mường Hum"
    ]
  },
  {
    "newWardId": "20505087",
    "newWardName": "Mường Khương",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2761",
      "2779",
      "2770",
      "2758",
      "2773"
    ],
    "oldWardNames": [
      "Thị trấn Mường Khương",
      "Xã Thanh Bình",
      "Xã Nậm Chảy",
      "Xã Tung Chung Phố",
      "Xã Nấm Lư"
    ]
  },
  {
    "newWardId": "21305031",
    "newWardName": "Mường Lai",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Phú",
      "Xã Vĩnh Lạc",
      "Xã Minh Tiến",
      "Xã Mường Lai"
    ]
  },
  {
    "newWardId": "21301039",
    "newWardName": "Nam Cường",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2671"
    ],
    "oldWardNames": [
      "Phường Nam Cường",
      "Xã Minh Bảo",
      "Xã Tuy Lộc",
      "Xã Cường Thịnh"
    ]
  },
  {
    "newWardId": "20519074",
    "newWardName": "Nậm Chày",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "3088"
    ],
    "oldWardNames": [
      "Xã Dần Thàng",
      "Xã Nậm Chày"
    ]
  },
  {
    "newWardId": "21309094",
    "newWardName": "Nậm Có",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nậm Có"
    ]
  },
  {
    "newWardId": "20519098",
    "newWardName": "Nậm Xé",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "3085"
    ],
    "oldWardNames": [
      "Xã Nậm Xé"
    ]
  },
  {
    "newWardId": "20515062",
    "newWardName": "Nghĩa Đô",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2950",
      "2956",
      "2953"
    ],
    "oldWardNames": [
      "Xã Tân Tiến",
      "Xã Vĩnh Yên",
      "Xã Nghĩa Đô"
    ]
  },
  {
    "newWardId": "21303008",
    "newWardName": "Nghĩa Lộ",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tân An",
      "Phường Pú Trạng",
      "Xã Nghĩa An",
      "Xã Nghĩa Sơn"
    ]
  },
  {
    "newWardId": "21315016",
    "newWardName": "Nghĩa Tâm",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình Thuận",
      "Xã Minh An",
      "Xã Nghĩa Tâm"
    ]
  },
  {
    "newWardId": "20513099",
    "newWardName": "Ngũ Chỉ Sơn",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "3004"
    ],
    "oldWardNames": [
      "Xã Ngũ Chỉ Sơn"
    ]
  },
  {
    "newWardId": "20505086",
    "newWardName": "Pha Long",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2764",
      "2767",
      "2752"
    ],
    "oldWardNames": [
      "Xã Tả Ngài Chồ",
      "Xã Dìn Chin",
      "Xã Tả Gia Khâu",
      "Xã Pha Long"
    ]
  },
  {
    "newWardId": "21317007",
    "newWardName": "Phình Hồ",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Làng Nhì",
      "Xã Bản Mù",
      "Xã Phình Hồ"
    ]
  },
  {
    "newWardId": "21307018",
    "newWardName": "Phong Dụ Hạ",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Xuân Tầm",
      "Xã Phong Dụ Hạ"
    ]
  },
  {
    "newWardId": "21307096",
    "newWardName": "Phong Dụ Thượng",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phong Dụ Thượng"
    ]
  },
  {
    "newWardId": "20511046",
    "newWardName": "Phong Hải",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2914"
    ],
    "oldWardNames": [
      "Thị trấn NT Phong Hải",
      "Xã Bản Cầm"
    ]
  },
  {
    "newWardId": "20515066",
    "newWardName": "Phúc Khánh",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2983",
      "2998"
    ],
    "oldWardNames": [
      "Xã Việt Tiến",
      "Xã Phúc Khánh"
    ]
  },
  {
    "newWardId": "21305030",
    "newWardName": "Phúc Lợi",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trúc Lâu",
      "Xã Trung Tâm",
      "Xã Phúc Lợi"
    ]
  },
  {
    "newWardId": "21309003",
    "newWardName": "Púng Luông",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nậm Khắt",
      "Xã La Pán Tẩn",
      "Xã Dế Xu Phình",
      "Xã Púng Luông"
    ]
  },
  {
    "newWardId": "21311045",
    "newWardName": "Quy Mông",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Kiên Thành",
      "Xã Y Can",
      "Xã Quy Mông"
    ]
  },
  {
    "newWardId": "20513079",
    "newWardName": "Sa Pa",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "3016",
      "3003",
      "3002",
      "3028",
      "3006",
      "3001"
    ],
    "oldWardNames": [
      "Phường Hàm Rồng",
      "Phường Ô Quý Hồ",
      "Phường Sa Pả",
      "Phường Cầu Mây",
      "Phường Phan Si Păng",
      "Phường Sa Pa"
    ]
  },
  {
    "newWardId": "20521090",
    "newWardName": "Si Ma Cai",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2809",
      "2812",
      "2800",
      "2821",
      "2827"
    ],
    "oldWardNames": [
      "Thị trấn Si Ma Cai",
      "Xã Sán Chải",
      "Xã Nàn Sán",
      "Xã Cán Cấu",
      "Xã Quan Hồ Thẩn"
    ]
  },
  {
    "newWardId": "20521091",
    "newWardName": "Sín Chéng",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2806",
      "2803",
      "2824"
    ],
    "oldWardNames": [
      "Xã Bản Mế",
      "Xã Thào Chư Phìn",
      "Xã Nàn Sín",
      "Xã Sín Chéng"
    ]
  },
  {
    "newWardId": "21315013",
    "newWardName": "Sơn Lương",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nậm Mười",
      "Xã Sùng Đô",
      "Xã Suối Quyền",
      "Xã Sơn Lương"
    ]
  },
  {
    "newWardId": "20509084",
    "newWardName": "Tả Củ Tỷ",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2842",
      "2854"
    ],
    "oldWardNames": [
      "Xã Lùng Cải",
      "Xã Tả Củ Tỷ"
    ]
  },
  {
    "newWardId": "20513077",
    "newWardName": "Tả Phìn",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "3010",
      "3013"
    ],
    "oldWardNames": [
      "Xã Trung Chải",
      "Xã Tả Phìn"
    ]
  },
  {
    "newWardId": "20513078",
    "newWardName": "Tả Van",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "3019",
      "3037",
      "3040"
    ],
    "oldWardNames": [
      "Xã Hoàng Liên",
      "Xã Mường Hoa",
      "Xã Tả Van"
    ]
  },
  {
    "newWardId": "21317095",
    "newWardName": "Tà Xi Láng",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tà Xi Láng"
    ]
  },
  {
    "newWardId": "20511049",
    "newWardName": "Tằng Loỏng",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2908",
      "2944"
    ],
    "oldWardNames": [
      "Thị trấn Tằng Loỏng",
      "Xã Phú Nhuận"
    ]
  },
  {
    "newWardId": "21307022",
    "newWardName": "Tân Hợp",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đại Sơn",
      "Xã Nà Hẩu",
      "Xã Tân Hợp"
    ]
  },
  {
    "newWardId": "21305028",
    "newWardName": "Tân Lĩnh",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Minh Chuẩn",
      "Xã Tân Lập",
      "Xã Phan Thanh",
      "Xã Khai Trung",
      "Xã Tân Lĩnh"
    ]
  },
  {
    "newWardId": "21313034",
    "newWardName": "Thác Bà",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Thác Bà",
      "Xã Vũ Linh",
      "Xã Bạch Hà",
      "Xã Hán Đà",
      "Xã Vĩnh Kiên",
      "Xã Đại Minh"
    ]
  },
  {
    "newWardId": "21315014",
    "newWardName": "Thượng Bằng La",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn NT Trần Phú",
      "Xã Thượng Bằng La"
    ]
  },
  {
    "newWardId": "20515063",
    "newWardName": "Thượng Hà",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2959",
      "2977",
      "2968"
    ],
    "oldWardNames": [
      "Xã Điện Quan",
      "Xã Minh Tân",
      "Xã Thượng Hà"
    ]
  },
  {
    "newWardId": "21317005",
    "newWardName": "Trạm Tấu",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Pá Lau",
      "Xã Pá Hu",
      "Xã Túc Đán",
      "Xã Trạm Tấu"
    ]
  },
  {
    "newWardId": "21311041",
    "newWardName": "Trấn Yên",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Cổ Phúc",
      "Xã Báo Đáp",
      "Xã Tân Đồng",
      "Xã Thành Thịnh",
      "Xã Hòa Cuông",
      "Xã Minh Quán"
    ]
  },
  {
    "newWardId": "20507059",
    "newWardName": "Trịnh Tường",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2704",
      "2695"
    ],
    "oldWardNames": [
      "Xã Cốc Mỳ",
      "Xã Trịnh Tường"
    ]
  },
  {
    "newWardId": "21303009",
    "newWardName": "Trung Tâm",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Trung Tâm",
      "Xã Phù Nham",
      "Xã Nghĩa Lợi",
      "Xã Nghĩa Lộ"
    ]
  },
  {
    "newWardId": "21315004",
    "newWardName": "Tú Lệ",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Cao Phạ",
      "Xã Tú Lệ"
    ]
  },
  {
    "newWardId": "20519070",
    "newWardName": "Văn Bàn",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "3055",
      "3082",
      "3064",
      "3094"
    ],
    "oldWardNames": [
      "Thị trấn Khánh Yên",
      "Xã Khánh Yên Thượng",
      "Xã Sơn Thuỷ",
      "Xã Làng Giàng",
      "Xã Hòa Mạc"
    ]
  },
  {
    "newWardId": "21315017",
    "newWardName": "Văn Chấn",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Sơn Thịnh",
      "Xã Đồng Khê",
      "Xã Suối Bu",
      "Xã Suối Giàng"
    ]
  },
  {
    "newWardId": "21301037",
    "newWardName": "Văn Phú",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Yên Thịnh",
      "Xã Tân Thịnh",
      "Xã Văn Phú",
      "Xã Phú Thịnh"
    ]
  },
  {
    "newWardId": "21311044",
    "newWardName": "Việt Hồng",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Việt Cường",
      "Xã Vân Hội",
      "Xã Việt Hồng"
    ]
  },
  {
    "newWardId": "20519068",
    "newWardName": "Võ Lao",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "3067",
      "3061"
    ],
    "oldWardNames": [
      "Xã Nậm Mả",
      "Xã Nậm Dạng",
      "Xã Võ Lao"
    ]
  },
  {
    "newWardId": "21307024",
    "newWardName": "Xuân Ái",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đại Phác",
      "Xã Yên Phú",
      "Xã Yên Hợp",
      "Xã Viễn Sơn",
      "Xã Xuân Ái"
    ]
  },
  {
    "newWardId": "20515065",
    "newWardName": "Xuân Hòa",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2965"
    ],
    "oldWardNames": [
      "Xã Tân Dương",
      "Xã Xuân Hòa"
    ]
  },
  {
    "newWardId": "20511047",
    "newWardName": "Xuân Quang",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2920",
      "2935",
      "2926"
    ],
    "oldWardNames": [
      "Xã Phong Niên",
      "Xã Trì Quang",
      "Xã Xuân Quang"
    ]
  },
  {
    "newWardId": "20507057",
    "newWardName": "Y Tý",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [
      "2692",
      "2701"
    ],
    "oldWardNames": [
      "Xã A Lù",
      "Xã Y Tý"
    ]
  },
  {
    "newWardId": "21301038",
    "newWardName": "Yên Bái",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Đồng Tâm",
      "Phường Yên Ninh",
      "Phường Minh Tân",
      "Phường Nguyễn Thái Học",
      "Phường Hồng Hà"
    ]
  },
  {
    "newWardId": "21313035",
    "newWardName": "Yên Bình",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Yên Bình",
      "Xã Tân Hương",
      "Xã Thịnh Hưng",
      "Xã Đại Đồng"
    ]
  },
  {
    "newWardId": "21313033",
    "newWardName": "Yên Thành",
    "provinceId": "05",
    "provinceName": "Lào Cai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phúc Ninh",
      "Xã Mỹ Gia",
      "Xã Xuân Lai",
      "Xã Phúc An",
      "Xã Yên Thành"
    ]
  },
  {
    "newWardId": "70303006",
    "newWardName": "1 Bảo Lộc",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24784",
      "24814",
      "24835"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường Lộc Phát",
      "Xã Lộc Thanh"
    ]
  },
  {
    "newWardId": "70303007",
    "newWardName": "2 Bảo Lộc",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24781",
      "25078"
    ],
    "oldWardNames": [
      "Phường 2",
      "Xã Lộc Tân",
      "Xã ĐamBri"
    ]
  },
  {
    "newWardId": "70303008",
    "newWardName": "3 Bảo Lộc",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24817",
      "24841",
      "24844"
    ],
    "oldWardNames": [
      "Phường Lộc Tiến",
      "Xã Lộc Châu",
      "Xã Đại Lào"
    ]
  },
  {
    "newWardId": "70313037",
    "newWardName": "Bảo Lâm 1",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "25054",
      "25075",
      "25072"
    ],
    "oldWardNames": [
      "Thị trấn Lộc Thắng",
      "Xã Lộc Quảng",
      "Xã Lộc Ngãi"
    ]
  },
  {
    "newWardId": "70313038",
    "newWardName": "Bảo Lâm 2",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "25084",
      "25081",
      "25087"
    ],
    "oldWardNames": [
      "Xã Lộc An",
      "Xã Lộc Đức",
      "Xã Tân Lạc"
    ]
  },
  {
    "newWardId": "70313039",
    "newWardName": "Bảo Lâm 3",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "25090",
      "25093"
    ],
    "oldWardNames": [
      "Xã Lộc Thành",
      "Xã Lộc Nam"
    ]
  },
  {
    "newWardId": "70313040",
    "newWardName": "Bảo Lâm 4",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "25063",
      "25060"
    ],
    "oldWardNames": [
      "Xã Lộc Phú",
      "Xã Lộc Lâm",
      "Xã B’Lá"
    ]
  },
  {
    "newWardId": "70313041",
    "newWardName": "Bảo Lâm 5",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "25057",
      "25066"
    ],
    "oldWardNames": [
      "Xã Lộc Bảo",
      "Xã Lộc Bắc"
    ]
  },
  {
    "newWardId": "70315034",
    "newWardName": "Bảo Thuận",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "25018",
      "25012",
      "25033"
    ],
    "oldWardNames": [
      "Xã Đinh Lạc",
      "Xã Tân Nghĩa",
      "Xã Bảo Thuận"
    ]
  },
  {
    "newWardId": "71505065",
    "newWardName": "Bắc Bình",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Chợ Lầu",
      "Xã Phan Hòa",
      "Xã Phan Hiệp",
      "Xã Phan Rí Thành"
    ]
  },
  {
    "newWardId": "60613096",
    "newWardName": "Bắc Gia Nghĩa",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Quảng Thành",
      "Phường Nghĩa Thành",
      "Phường Nghĩa Đức",
      "Xã Đắk Ha"
    ]
  },
  {
    "newWardId": "71511086",
    "newWardName": "Bắc Ruộng",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Măng Tố",
      "Xã Bắc Ruộng"
    ]
  },
  {
    "newWardId": "71501052",
    "newWardName": "Bình Thuận",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Phú Tài",
      "Xã Phong Nẫm",
      "Xã Hàm Hiệp"
    ]
  },
  {
    "newWardId": "70301002",
    "newWardName": "Cam Ly - Đà Lạt",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24790",
      "24787",
      "24808"
    ],
    "oldWardNames": [
      "Phường 5",
      "Phường 6",
      "Xã Tà Nung"
    ]
  },
  {
    "newWardId": "70317048",
    "newWardName": "Cát Tiên",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "25159",
      "25171",
      "25189"
    ],
    "oldWardNames": [
      "Thị trấn Cát Tiên",
      "Xã Nam Ninh",
      "Xã Quảng Ngãi"
    ]
  },
  {
    "newWardId": "70317049",
    "newWardName": "Cát Tiên 2",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "25165",
      "25183"
    ],
    "oldWardNames": [
      "Thị trấn Phước Cát",
      "Xã Phước Cát 2",
      "Xã Đức Phổ"
    ]
  },
  {
    "newWardId": "70317050",
    "newWardName": "Cát Tiên 3",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "25168",
      "25162",
      "25192"
    ],
    "oldWardNames": [
      "Xã Gia Viễn",
      "Xã Tiên Hoàng",
      "Xã Đồng Nai Thượng"
    ]
  },
  {
    "newWardId": "60603101",
    "newWardName": "Cư Jút",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Ea T’ling",
      "Xã Trúc Sơn",
      "Xã Tâm Thắng",
      "Xã Cư K’nia"
    ]
  },
  {
    "newWardId": "70315030",
    "newWardName": "Di Linh",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "25000",
      "25027",
      "25009",
      "25030"
    ],
    "oldWardNames": [
      "Thị trấn Di Linh",
      "Xã Liên Đầm",
      "Xã Tân Châu",
      "Xã Gung Ré"
    ]
  },
  {
    "newWardId": "70317042",
    "newWardName": "Đạ Huoai",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "25111"
    ],
    "oldWardNames": [
      "Thị trấn Mađaguôi",
      "Xã Mađaguôi",
      "Xã Đạ Oai"
    ]
  },
  {
    "newWardId": "70317043",
    "newWardName": "Đạ Huoai 2",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "25105"
    ],
    "oldWardNames": [
      "Thị trấn Đạ M’ri",
      "Xã Hà Lâm"
    ]
  },
  {
    "newWardId": "70317044",
    "newWardName": "Đạ Huoai 3",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "xã Bà Gia"
    ]
  },
  {
    "newWardId": "70317045",
    "newWardName": "Đạ Tẻh",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "25126",
      "25129",
      "25141"
    ],
    "oldWardNames": [
      "Thị trấn Đạ Tẻh",
      "Xã An Nhơn",
      "Xã Đạ Lây"
    ]
  },
  {
    "newWardId": "70317046",
    "newWardName": "Đạ Tẻh 2",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "25138",
      "25156",
      "25153"
    ],
    "oldWardNames": [
      "Xã Quảng Trị",
      "Xã Đạ Pal",
      "Xã Đạ Kho"
    ]
  },
  {
    "newWardId": "70317047",
    "newWardName": "Đạ Tẻh 3",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "25135",
      "25132"
    ],
    "oldWardNames": [
      "Xã Mỹ Đức",
      "Xã Quốc Oai"
    ]
  },
  {
    "newWardId": "70323026",
    "newWardName": "Đam Rông 1",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24886"
    ],
    "oldWardNames": [
      "Xã Phi Liêng",
      "Xã Đạ K’Nàng"
    ]
  },
  {
    "newWardId": "70323027",
    "newWardName": "Đam Rông 2",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24877",
      "24874"
    ],
    "oldWardNames": [
      "Xã Rô Men",
      "Xã Liêng Srônh"
    ]
  },
  {
    "newWardId": "70323028",
    "newWardName": "Đam Rông 3",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24875"
    ],
    "oldWardNames": [
      "Xã Đạ Rsal",
      "Xã Đạ M’Rông"
    ]
  },
  {
    "newWardId": "70323029",
    "newWardName": "Đam Rông 4",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24853",
      "24856"
    ],
    "oldWardNames": [
      "Xã Đạ Tông",
      "Xã Đạ Long",
      "Xã Đưng K’Nớ"
    ]
  },
  {
    "newWardId": "60607104",
    "newWardName": "Đắk Mil",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đắk Gằn",
      "Xã Đắk N’Drót",
      "Xã Đắk R’La"
    ]
  },
  {
    "newWardId": "60607105",
    "newWardName": "Đắk Sắk",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nam Xuân",
      "Xã Long Sơn",
      "Xã Đắk Sắk"
    ]
  },
  {
    "newWardId": "60603099",
    "newWardName": "Đắk Wil",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ea Pô",
      "Xã Đắk Wil"
    ]
  },
  {
    "newWardId": "70315033",
    "newWardName": "Đinh Trang Thượng",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "25007",
      "25006",
      "25003"
    ],
    "oldWardNames": [
      "Xã Tân Lâm",
      "Xã Tân Thượng",
      "Xã Đinh Trang Thượng"
    ]
  },
  {
    "newWardId": "60613098",
    "newWardName": "Đông Gia Nghĩa",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Nghĩa Trung",
      "Xã Đắk Nia"
    ]
  },
  {
    "newWardId": "71507072",
    "newWardName": "Đông Giang",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đông Tiến",
      "Xã Đông Giang"
    ]
  },
  {
    "newWardId": "71511088",
    "newWardName": "Đồng Kho",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Huy Khiêm",
      "Xã La Ngâu",
      "Xã Đức Bình",
      "Xã Đồng Kho"
    ]
  },
  {
    "newWardId": "70307011",
    "newWardName": "Đơn Dương",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24931",
      "24937",
      "24952"
    ],
    "oldWardNames": [
      "Thị trấn Thạnh Mỹ",
      "Xã Đạ Ròn",
      "Xã Tu Tra"
    ]
  },
  {
    "newWardId": "60609111",
    "newWardName": "Đức An",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Đức An",
      "Xã Đắk N’Drung",
      "Xã Nam Bình"
    ]
  },
  {
    "newWardId": "60607103",
    "newWardName": "Đức Lập",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Đắk Mil",
      "Xã Đức Mạnh",
      "Xã Đức Minh"
    ]
  },
  {
    "newWardId": "71515092",
    "newWardName": "Đức Linh",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Võ Xu",
      "Xã Nam Chính",
      "Xã Vũ Hòa"
    ]
  },
  {
    "newWardId": "70309016",
    "newWardName": "Đức Trọng",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24958",
      "24982"
    ],
    "oldWardNames": [
      "Thị trấn Liên Nghĩa",
      "Xã Phú Hội"
    ]
  },
  {
    "newWardId": "70315036",
    "newWardName": "Gia Hiệp",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "25021",
      "25015"
    ],
    "oldWardNames": [
      "Xã Tam Bố",
      "Xã Gia Hiệp"
    ]
  },
  {
    "newWardId": "71505067",
    "newWardName": "Hải Ninh",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình An",
      "Xã Phan Điền",
      "Xã Hải Ninh"
    ]
  },
  {
    "newWardId": "71509079",
    "newWardName": "Hàm Kiệm",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Mương Mán",
      "Xã Hàm Cường",
      "Xã Hàm Kiệm"
    ]
  },
  {
    "newWardId": "71507077",
    "newWardName": "Hàm Liêm",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hàm Chính",
      "Xã Hàm Liêm"
    ]
  },
  {
    "newWardId": "71514084",
    "newWardName": "Hàm Tân",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24916"
    ],
    "oldWardNames": [
      "Xã Tân Hà",
      "Xã Tân Xuân",
      "Thị trấn Tân Nghĩa"
    ]
  },
  {
    "newWardId": "71509078",
    "newWardName": "Hàm Thạnh",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Mỹ Thạnh",
      "Xã Hàm Cần",
      "Xã Hàm Thạnh"
    ]
  },
  {
    "newWardId": "71501051",
    "newWardName": "Hàm Thắng",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Xuân An",
      "Thị trấn Phú Long",
      "Xã Hàm Thắng"
    ]
  },
  {
    "newWardId": "71507075",
    "newWardName": "Hàm Thuận",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Ma Lâm",
      "Xã Thuận Minh",
      "Xã Hàm Đức"
    ]
  },
  {
    "newWardId": "71507074",
    "newWardName": "Hàm Thuận Bắc",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thuận Hòa",
      "Xã Hàm Trí",
      "Xã Hàm Phú"
    ]
  },
  {
    "newWardId": "71509081",
    "newWardName": "Hàm Thuận Nam",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Thuận Nam",
      "Xã Hàm Minh"
    ]
  },
  {
    "newWardId": "70309015",
    "newWardName": "Hiệp Thạnh",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24961",
      "24964",
      "24967"
    ],
    "oldWardNames": [
      "Xã Hiệp An",
      "Xã Liên Hiệp",
      "Xã Hiệp Thạnh"
    ]
  },
  {
    "newWardId": "70315032",
    "newWardName": "Hòa Bắc",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "25042",
      "25045"
    ],
    "oldWardNames": [
      "Xã Hòa Nam",
      "Xã Hòa Bắc"
    ]
  },
  {
    "newWardId": "70315031",
    "newWardName": "Hòa Ninh",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "25024",
      "25039",
      "25036"
    ],
    "oldWardNames": [
      "Xã Đinh Trang Hòa",
      "Xã Hòa Trung",
      "Xã Hòa Ninh"
    ]
  },
  {
    "newWardId": "71505071",
    "newWardName": "Hòa Thắng",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hồng Phong",
      "Xã Hòa Thắng"
    ]
  },
  {
    "newWardId": "71515093",
    "newWardName": "hoài Đức",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Đức Tài",
      "Xã Đức Tín",
      "Xã Đức Hạnh"
    ]
  },
  {
    "newWardId": "71507076",
    "newWardName": "Hồng Sơn",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hồng Liêm",
      "Xã Hồng Sơn"
    ]
  },
  {
    "newWardId": "71505066",
    "newWardName": "Hồng Thái",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phan Thanh",
      "Xã Hồng Thái",
      "Xã Hòa Thắng"
    ]
  },
  {
    "newWardId": "70307012",
    "newWardName": "Ka Đô",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24940",
      "24943"
    ],
    "oldWardNames": [
      "Xã Lạc Lâm",
      "Xã Ka Đô"
    ]
  },
  {
    "newWardId": "60611118",
    "newWardName": "Kiến Đức",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Kiến Đức",
      "Xã Đạo Nghĩa",
      "Xã Nghĩa Thắng",
      "Xã Kiến Thành"
    ]
  },
  {
    "newWardId": "60605107",
    "newWardName": "Krông Nô",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24979"
    ],
    "oldWardNames": [
      "Xã Tân Thành",
      "Xã Đắk Drô",
      "Thị trấn Đắk Mâm"
    ]
  },
  {
    "newWardId": "71507073",
    "newWardName": "La Dạ",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đa Mi",
      "Xã La Dạ"
    ]
  },
  {
    "newWardId": "71513057",
    "newWardName": "La Gi",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tân An",
      "Phường Bình Tân",
      "Phường Tân Thiện",
      "Xã Tân Bình"
    ]
  },
  {
    "newWardId": "70305010",
    "newWardName": "Lạc Dương",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24865",
      "24848",
      "24847"
    ],
    "oldWardNames": [
      "Xã Đạ Sar",
      "Xã Đạ Nhim",
      "Xã Đạ Chais"
    ]
  },
  {
    "newWardId": "70301003",
    "newWardName": "Lâm Viên - Đà Lạt",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24772",
      "24778",
      "24775"
    ],
    "oldWardNames": [
      "Phường 8",
      "Phường 9",
      "Phường 12"
    ]
  },
  {
    "newWardId": "71503062",
    "newWardName": "Liên Hương",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24970"
    ],
    "oldWardNames": [
      "Thị trấn Liên Hương",
      "Xã Bình Thạnh",
      "Xã Phước Thể",
      "Xã Phú Lạc"
    ]
  },
  {
    "newWardId": "71505070",
    "newWardName": "Lương Sơn",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Lương Sơn",
      "Xã Sông Bình"
    ]
  },
  {
    "newWardId": "71501053",
    "newWardName": "Mũi Né",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Hàm Tiến",
      "Phường Mũi Né",
      "Xã Thiện Nghiệp"
    ]
  },
  {
    "newWardId": "60603100",
    "newWardName": "Nam Dong",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đắk D’rông",
      "Xã Nam Dong"
    ]
  },
  {
    "newWardId": "60605106",
    "newWardName": "Nam Đà",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Buôn Choáh",
      "Xã Đắk Sôr",
      "Xã Nam Đà"
    ]
  },
  {
    "newWardId": "60613097",
    "newWardName": "Nam Gia Nghĩa",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Nghĩa Phú",
      "Phường Nghĩa Tân",
      "Xã Đắk R’Moan"
    ]
  },
  {
    "newWardId": "71515091",
    "newWardName": "Nam Thành",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Mê Pu",
      "Xã Sùng Nhơn",
      "Xã Đa Kai"
    ]
  },
  {
    "newWardId": "60605108",
    "newWardName": "Nâm Nung",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nâm N’Đir",
      "Xã Nâm Nung"
    ]
  },
  {
    "newWardId": "71511087",
    "newWardName": "Nghị Đức",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đức Phú",
      "Xã Nghị Đức"
    ]
  },
  {
    "newWardId": "60611119",
    "newWardName": "Nhân Cơ",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nhân Đạo",
      "Xã Đắk Wer",
      "Xã Nhân Cơ"
    ]
  },
  {
    "newWardId": "70309121",
    "newWardName": "Ninh Gia",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24985"
    ],
    "oldWardNames": [
      "Xã Ninh Gia"
    ]
  },
  {
    "newWardId": "71503064",
    "newWardName": "Phan Rí Cửa",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Phan Rí Cửa",
      "Xã Chí Công",
      "Xã Hòa Minh",
      "Xã Phong Phú"
    ]
  },
  {
    "newWardId": "71505068",
    "newWardName": "Phan Sơn",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phan Lâm",
      "Xã Phan Sơn"
    ]
  },
  {
    "newWardId": "71501055",
    "newWardName": "Phan Thiết",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Phú Trinh",
      "Phường Lạc Đạo",
      "Phường Bình Hưng"
    ]
  },
  {
    "newWardId": "71513058",
    "newWardName": "Phước Hội",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Phước Lộc",
      "Phường Phước Hội",
      "Xã Tân Phước"
    ]
  },
  {
    "newWardId": "60615122",
    "newWardName": "Quảng Hòa",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Quảng Hòa"
    ]
  },
  {
    "newWardId": "60615115",
    "newWardName": "Quảng Khê",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đắk Plao",
      "Xã Quảng Khê"
    ]
  },
  {
    "newWardId": "70307013",
    "newWardName": "Quảng Lập",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24949",
      "24955"
    ],
    "oldWardNames": [
      "Xã Ka Đơn",
      "Xã Quảng Lập"
    ]
  },
  {
    "newWardId": "60605109",
    "newWardName": "Quảng Phú",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đức Xuyên",
      "Xã Đắk Nang",
      "Xã Quảng Phú"
    ]
  },
  {
    "newWardId": "60615123",
    "newWardName": "Quảng Sơn",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Quảng Sơn"
    ]
  },
  {
    "newWardId": "60617116",
    "newWardName": "Quảng Tân",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đắk Ngo",
      "Xã Quảng Tân"
    ]
  },
  {
    "newWardId": "60611120",
    "newWardName": "Quảng Tín",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đắk Sin",
      "Xã Hưng Bình",
      "Xã Đắk Ru",
      "Xã Quảng Tín"
    ]
  },
  {
    "newWardId": "60617124",
    "newWardName": "Quảng Trực",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Quảng Trực"
    ]
  },
  {
    "newWardId": "71505069",
    "newWardName": "Sông Lũy",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phan Tiến",
      "Xã Bình Tân",
      "Xã Sông Lũy"
    ]
  },
  {
    "newWardId": "70315035",
    "newWardName": "Sơn Điền",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "25051",
      "25048"
    ],
    "oldWardNames": [
      "Xã Gia Bắc",
      "Xã Sơn Điền"
    ]
  },
  {
    "newWardId": "71514085",
    "newWardName": "Sơn Mỹ",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Thắng",
      "Xã Thắng Hải",
      "Xã Sơn Mỹ"
    ]
  },
  {
    "newWardId": "71511090",
    "newWardName": "Suối Kiết",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Gia Huynh",
      "Xã Suối Kiết"
    ]
  },
  {
    "newWardId": "60615114",
    "newWardName": "Tà Đùng",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đắk Som",
      "Xã Đắk R’Măng"
    ]
  },
  {
    "newWardId": "70309018",
    "newWardName": "Tà Hine",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24997",
      "24994",
      "24991"
    ],
    "oldWardNames": [
      "Xã Ninh Loan",
      "Xã Đà Loan",
      "Xã Tà Hine"
    ]
  },
  {
    "newWardId": "70309019",
    "newWardName": "Tà Năng",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24989",
      "24988"
    ],
    "oldWardNames": [
      "Xã Đa Quyn",
      "Xã Tà Năng"
    ]
  },
  {
    "newWardId": "71511089",
    "newWardName": "Tánh Linh",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Lạc Tánh",
      "Xã Gia An",
      "Xã Đức Thuận"
    ]
  },
  {
    "newWardId": "71513060",
    "newWardName": "Tân Hải",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Tiến",
      "Xã Tân Hải"
    ]
  },
  {
    "newWardId": "70309017",
    "newWardName": "Tân Hội",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24979",
      "24976"
    ],
    "oldWardNames": [
      "Xã Tân Thành",
      "Xã N’ Thôn Hạ",
      "Xã Tân Hội"
    ]
  },
  {
    "newWardId": "71509082",
    "newWardName": "Tân Lập",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Sông Phan",
      "Xã Tân Lập"
    ]
  },
  {
    "newWardId": "71514083",
    "newWardName": "Tân Minh",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Tân Minh",
      "Xã Tân Đức",
      "Xã Tân Phúc"
    ]
  },
  {
    "newWardId": "71509080",
    "newWardName": "Tân Thành",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24979"
    ],
    "oldWardNames": [
      "Xã Tân Thành",
      "Xã Thuận Quý",
      "Xã Tân Thuận"
    ]
  },
  {
    "newWardId": "60607102",
    "newWardName": "Thuận An",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đắk Lao",
      "Xã Thuận An"
    ]
  },
  {
    "newWardId": "60609112",
    "newWardName": "Thuận Hạnh",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thuận Hà",
      "Xã Thuận Hạnh"
    ]
  },
  {
    "newWardId": "71501056",
    "newWardName": "Tiến Thành",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Đức Long",
      "Xã Tiến Thành"
    ]
  },
  {
    "newWardId": "71515094",
    "newWardName": "Trà Tân",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24916"
    ],
    "oldWardNames": [
      "Xã Tân Hà",
      "Xã Đông Hà",
      "Xã Trà Tân"
    ]
  },
  {
    "newWardId": "60609113",
    "newWardName": "Trường Xuân",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nâm N’Jang",
      "Xã Trường Xuân"
    ]
  },
  {
    "newWardId": "60617117",
    "newWardName": "Tuy Đức",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Quảng Tâm",
      "Xã Đắk R’Tíh",
      "Xã Đắk Búk So"
    ]
  },
  {
    "newWardId": "71503063",
    "newWardName": "Tuy Phong",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phan Dũng",
      "Xã Phong Phú"
    ]
  },
  {
    "newWardId": "71501059",
    "newWardName": "Tuyên Quang",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tiến Lợi",
      "Xã Hàm Mỹ"
    ]
  },
  {
    "newWardId": "71503061",
    "newWardName": "Vĩnh Hảo",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vĩnh Tân",
      "Xã Vĩnh Hảo"
    ]
  },
  {
    "newWardId": "70301001",
    "newWardName": "Xuân Hương - Đà Lạt",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24784",
      "24781",
      "24802",
      "24793",
      "24796"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 2",
      "Phường 3",
      "Phường 4",
      "Phường 10"
    ]
  },
  {
    "newWardId": "70301004",
    "newWardName": "Xuân Trường - Đà Lạt",
    "provinceId": "03",
    "provinceName": "Lâm Đồng",
    "oldWardIds": [
      "24799",
      "24805",
      "24811",
      "24810"
    ],
    "oldWardNames": [
      "Phường 11",
      "Xã Xuân Thọ",
      "Xã Xuân Trường",
      "Xã Trạm Hành"
    ]
  },
  {
    "newWardId": "20913061",
    "newWardName": "Ba Sơn",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6238",
      "6196",
      "6202"
    ],
    "oldWardNames": [
      "Xã Mẫu Sơn",
      "Xã Cao Lâu",
      "Xã Xuất Lễ"
    ]
  },
  {
    "newWardId": "20909016",
    "newWardName": "Bắc Sơn",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6325",
      "6328",
      "6343"
    ],
    "oldWardNames": [
      "Thị trấn Bắc Sơn",
      "Xã Long Đống",
      "Xã Bắc Quỳnh"
    ]
  },
  {
    "newWardId": "20917056",
    "newWardName": "Bằng Mạc",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6475",
      "6487",
      "6490",
      "6493"
    ],
    "oldWardNames": [
      "Xã Gia Lộc",
      "Xã Bằng Hữu",
      "Xã Thượng Cường",
      "Xã Bằng Mạc"
    ]
  },
  {
    "newWardId": "20907008",
    "newWardName": "Bình Gia",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6100",
      "6106",
      "6112"
    ],
    "oldWardNames": [
      "Xã Hoàng Văn Thụ",
      "Xã Mông Ân",
      "Thị trấn Bình Gia"
    ]
  },
  {
    "newWardId": "20921051",
    "newWardName": "Cai Kinh",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6412",
      "6403",
      "6427"
    ],
    "oldWardNames": [
      "Xã Yên Vượng",
      "Xã Yên Sơn",
      "Xã Cai Kinh"
    ]
  },
  {
    "newWardId": "20913059",
    "newWardName": "Cao Lộc",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6211",
      "6193",
      "6199"
    ],
    "oldWardNames": [
      "Xã Lộc Yên",
      "Xã Thanh Lòa",
      "Xã Thạch Đạn"
    ]
  },
  {
    "newWardId": "20919041",
    "newWardName": "Châu Sơn",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6646",
      "6643",
      "6634",
      "6637",
      "6625"
    ],
    "oldWardNames": [
      "Xã Bắc Lãng",
      "Xã Đồng Thắng",
      "Xã Cường Lợi",
      "Xã Châu Sơn",
      "Xã Kiên Mộc"
    ]
  },
  {
    "newWardId": "20917052",
    "newWardName": "Chi Lăng",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6034",
      "6466",
      "6463"
    ],
    "oldWardNames": [
      "Xã Chi Lăng",
      "Thị trấn Chi Lăng",
      "Thị trấn Đồng Mỏ"
    ]
  },
  {
    "newWardId": "20917054",
    "newWardName": "Chiến Thắng",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6364",
      "6469",
      "6502",
      "6472"
    ],
    "oldWardNames": [
      "Xã Chiến Thắng",
      "Xã Vân An",
      "Xã Liên Sơn",
      "Xã Vân Thủy"
    ]
  },
  {
    "newWardId": "20913060",
    "newWardName": "Công Sơn",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6223",
      "6220",
      "6232"
    ],
    "oldWardNames": [
      "Xã Hòa Cư",
      "Xã Hải Yến",
      "Xã Công Sơn"
    ]
  },
  {
    "newWardId": "20911023",
    "newWardName": "Điềm He",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6256",
      "6268",
      "6280"
    ],
    "oldWardNames": [
      "Xã Trấn Ninh",
      "Xã Liên Hội",
      "Xã Điềm He"
    ]
  },
  {
    "newWardId": "20919040",
    "newWardName": "Đình Lập",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6613",
      "6628",
      "6622"
    ],
    "oldWardNames": [
      "Thị trấn Đình Lập",
      "Xã Đình Lập",
      "Xã Bính Xá"
    ]
  },
  {
    "newWardId": "20903002",
    "newWardName": "Đoàn Kết",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "5998",
      "6010",
      "6001"
    ],
    "oldWardNames": [
      "Xã Khánh Long",
      "Xã Cao Minh",
      "Xã Đoàn Kết"
    ]
  },
  {
    "newWardId": "20913058",
    "newWardName": "Đồng Đăng",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6184",
      "6136",
      "6214",
      "6079",
      "6190"
    ],
    "oldWardNames": [
      "Thị trấn Đồng Đăng",
      "Xã Thụy Hùng",
      "Xã Phú Xá",
      "Xã Hồng Phong",
      "Xã Bảo Lâm"
    ]
  },
  {
    "newWardId": "20901065",
    "newWardName": "Đông Kinh",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "5977",
      "5980",
      "6247",
      "5992"
    ],
    "oldWardNames": [
      "Phường Vĩnh Trại",
      "Phường Đông Kinh",
      "Xã Yên Trạch",
      "Xã Mai Pha"
    ]
  },
  {
    "newWardId": "20907011",
    "newWardName": "Hoa Thám",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6067",
      "6073"
    ],
    "oldWardNames": [
      "Xã Hưng Đạo",
      "Xã Hoa Thám"
    ]
  },
  {
    "newWardId": "20905032",
    "newWardName": "Hoàng Văn Thụ",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6115",
      "6100",
      "6172",
      "6181",
      "6166"
    ],
    "oldWardNames": [
      "Xã Hồng Thái",
      "Xã Hoàng Văn Thụ",
      "Xã Tân Mỹ",
      "Xã Nhạc Kỳ",
      "Xã Tân Thanh"
    ]
  },
  {
    "newWardId": "20905030",
    "newWardName": "Hội Hoan",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6160",
      "6151"
    ],
    "oldWardNames": [
      "Xã Gia Miễn",
      "Xã Hội Hoan"
    ]
  },
  {
    "newWardId": "20907010",
    "newWardName": "Hồng Phong",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6079",
      "6094"
    ],
    "oldWardNames": [
      "Xã Hồng Phong",
      "Xã Minh Khai"
    ]
  },
  {
    "newWardId": "20909017",
    "newWardName": "Hưng Vũ",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6370",
      "6349"
    ],
    "oldWardNames": [
      "Xã Trấn Yên",
      "Xã Hưng Vũ"
    ]
  },
  {
    "newWardId": "20921050",
    "newWardName": "Hữu Liên",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6400",
      "6388"
    ],
    "oldWardNames": [
      "Xã Yên Thịnh",
      "Xã Hữu Liên"
    ]
  },
  {
    "newWardId": "20921044",
    "newWardName": "Hữu Lũng",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6385",
      "6424",
      "6451"
    ],
    "oldWardNames": [
      "Thị trấn Hữu Lũng",
      "Xã Đồng Tân",
      "Xã Hồ Sơn"
    ]
  },
  {
    "newWardId": "20903006",
    "newWardName": "Kháng Chiến",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6037",
      "6028",
      "6049"
    ],
    "oldWardNames": [
      "Xã Trung Thành",
      "Xã Tân Minh",
      "Xã Kháng Chiến"
    ]
  },
  {
    "newWardId": "20913027",
    "newWardName": "Khánh Khê",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6241",
      "6217",
      "6286"
    ],
    "oldWardNames": [
      "Xã Xuân Long",
      "Xã Bình Trung",
      "Xã Khánh Khê"
    ]
  },
  {
    "newWardId": "20915039",
    "newWardName": "Khuất Xá",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6559",
      "6565"
    ],
    "oldWardNames": [
      "Xã Tam Gia",
      "Xã Khuất Xá"
    ]
  },
  {
    "newWardId": "20919042",
    "newWardName": "Kiên Mộc",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6619",
      "6622",
      "6625"
    ],
    "oldWardNames": [
      "Xã Bắc Xa",
      "Xã Bính Xá",
      "Xã Kiên Mộc"
    ]
  },
  {
    "newWardId": "20913064",
    "newWardName": "Kỳ Lừa",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "5971",
      "6187",
      "6226",
      "6244",
      "6235"
    ],
    "oldWardNames": [
      "Phường Hoàng Văn Thụ",
      "Thị trấn Cao Lộc",
      "Xã Hợp Thành",
      "Xã Tân Liên",
      "Xã Gia Cát"
    ]
  },
  {
    "newWardId": "20915033",
    "newWardName": "Lộc Bình",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6529",
      "6544",
      "6553",
      "6550"
    ],
    "oldWardNames": [
      "Thị trấn Lộc Bình",
      "Xã Khánh Xuân",
      "Xã Đồng Bục",
      "Xã Hữu Khánh"
    ]
  },
  {
    "newWardId": "20915036",
    "newWardName": "Lợi Bác",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6589",
      "6601"
    ],
    "oldWardNames": [
      "Xã Sàn Viên",
      "Xã Lợi Bác"
    ]
  },
  {
    "newWardId": "20901063",
    "newWardName": "Lương Văn Tri",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "5983",
      "5989"
    ],
    "oldWardNames": [
      "Phường Chi Lăng",
      "Xã Quảng Lạc"
    ]
  },
  {
    "newWardId": "20915034",
    "newWardName": "Mẫu Sơn",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6238",
      "6541",
      "6547"
    ],
    "oldWardNames": [
      "Xã Mẫu Sơn",
      "Xã Yên Khoái",
      "Xã Tú Mịch"
    ]
  },
  {
    "newWardId": "20915035",
    "newWardName": "Na Dương",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6526",
      "6592",
      "6562"
    ],
    "oldWardNames": [
      "Thị trấn Na Dương",
      "Xã Đông Quan",
      "Xã Tú Đoạn"
    ]
  },
  {
    "newWardId": "20905028",
    "newWardName": "Na Sầm",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6124",
      "6157",
      "6139"
    ],
    "oldWardNames": [
      "Thị trấn Na Sầm",
      "Xã Hoàng Việt",
      "Xã Bắc Hùng"
    ]
  },
  {
    "newWardId": "20917053",
    "newWardName": "Nhân Lý",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6484",
      "6478",
      "6499",
      "6496"
    ],
    "oldWardNames": [
      "Xã Mai Sao",
      "Xã Bắc Thủy",
      "Xã Lâm Sơn",
      "Xã Nhân Lý"
    ]
  },
  {
    "newWardId": "20909019",
    "newWardName": "Nhất Hòa",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6250",
      "6382",
      "6376"
    ],
    "oldWardNames": [
      "Xã Tân Thành",
      "Xã Nhất Tiến",
      "Xã Nhất Hòa"
    ]
  },
  {
    "newWardId": "20917055",
    "newWardName": "Quan Sơn",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6514",
      "6517"
    ],
    "oldWardNames": [
      "Xã Hữu Kiên",
      "Xã Quan Sơn"
    ]
  },
  {
    "newWardId": "20903005",
    "newWardName": "Quốc Khánh",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6016",
      "6025",
      "6004"
    ],
    "oldWardNames": [
      "Xã Tri Phương",
      "Xã Đội Cấn",
      "Xã Quốc Khánh"
    ]
  },
  {
    "newWardId": "20903007",
    "newWardName": "Quốc Việt",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6043",
      "6058"
    ],
    "oldWardNames": [
      "Xã Đào Viên",
      "Xã Quốc Việt"
    ]
  },
  {
    "newWardId": "20907012",
    "newWardName": "Quý Hòa",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6070",
      "6076"
    ],
    "oldWardNames": [
      "Xã Vĩnh Yên",
      "Xã Quý Hòa"
    ]
  },
  {
    "newWardId": "20901062",
    "newWardName": "Tam Thanh",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "5974",
      "5986"
    ],
    "oldWardNames": [
      "Phường Tam Thanh",
      "Xã Hoàng Đồng"
    ]
  },
  {
    "newWardId": "20911026",
    "newWardName": "Tân Đoàn",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6250",
      "6316",
      "6307"
    ],
    "oldWardNames": [
      "Xã Tân Thành",
      "Xã Tràng Phái",
      "Xã Tân Đoàn"
    ]
  },
  {
    "newWardId": "20921046",
    "newWardName": "Tân Thành",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6250",
      "6430",
      "6445"
    ],
    "oldWardNames": [
      "Xã Tân Thành",
      "Xã Hòa Lạc",
      "Xã Hòa Sơn"
    ]
  },
  {
    "newWardId": "20903003",
    "newWardName": "Tân Tiến",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6022",
      "6031",
      "6019"
    ],
    "oldWardNames": [
      "Xã Tân Yên",
      "Xã Kim Đồng",
      "Xã Tân Tiến"
    ]
  },
  {
    "newWardId": "20909021",
    "newWardName": "Tân Tri",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6331",
      "6340"
    ],
    "oldWardNames": [
      "Xã Đồng Ý",
      "Xã Vạn Thủy",
      "Xã Tân Tri"
    ]
  },
  {
    "newWardId": "20907009",
    "newWardName": "Tân Văn",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6115",
      "6118",
      "6121"
    ],
    "oldWardNames": [
      "Xã Hồng Thái",
      "Xã Bình La",
      "Xã Tân Văn"
    ]
  },
  {
    "newWardId": "20919043",
    "newWardName": "Thái Bình",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6616",
      "6640",
      "6631"
    ],
    "oldWardNames": [
      "Thị trấn NT Thái Bình",
      "Xã Lâm Ca",
      "Xã Thái Bình"
    ]
  },
  {
    "newWardId": "20903001",
    "newWardName": "Thất Khê",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6034",
      "6013",
      "6040"
    ],
    "oldWardNames": [
      "Xã Chi Lăng",
      "Xã Chí Minh",
      "Thị trấn Thất Khê"
    ]
  },
  {
    "newWardId": "20907013",
    "newWardName": "Thiện Hòa",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6082",
      "6085"
    ],
    "oldWardNames": [
      "Xã Yên Lỗ",
      "Xã Thiện Hòa"
    ]
  },
  {
    "newWardId": "20907015",
    "newWardName": "Thiện Long",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6103",
      "6109",
      "6097"
    ],
    "oldWardNames": [
      "Xã Hòa Bình",
      "Xã Tân Hòa",
      "Xã Thiện Long"
    ]
  },
  {
    "newWardId": "20921048",
    "newWardName": "Thiện Tân",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6421",
      "6436",
      "6406"
    ],
    "oldWardNames": [
      "Xã Thanh Sơn",
      "Xã Đồng Tiến",
      "Xã Thiện Tân"
    ]
  },
  {
    "newWardId": "20907014",
    "newWardName": "Thiện Thuật",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6088",
      "6091"
    ],
    "oldWardNames": [
      "Xã Quang Trung",
      "Xã Thiện Thuật"
    ]
  },
  {
    "newWardId": "20915037",
    "newWardName": "Thống Nhất",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6595",
      "6598",
      "6577"
    ],
    "oldWardNames": [
      "Xã Minh Hiệp",
      "Xã Hữu Lân",
      "Xã Thống Nhất"
    ]
  },
  {
    "newWardId": "20905031",
    "newWardName": "Thụy Hùng",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6136",
      "6148",
      "6127"
    ],
    "oldWardNames": [
      "Xã Thụy Hùng",
      "Xã Thanh Long",
      "Xã Trùng Khánh"
    ]
  },
  {
    "newWardId": "20903004",
    "newWardName": "Tràng Định",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6046",
      "6055",
      "6061"
    ],
    "oldWardNames": [
      "Xã Đề Thám",
      "Xã Hùng Sơn",
      "Xã Hùng Việt"
    ]
  },
  {
    "newWardId": "20911024",
    "newWardName": "Tri Lễ",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6292",
      "6322",
      "6313"
    ],
    "oldWardNames": [
      "Xã Lương Năng",
      "Xã Hữu Lễ",
      "Xã Tri Lễ"
    ]
  },
  {
    "newWardId": "20921045",
    "newWardName": "Tuấn Sơn",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6448",
      "6457",
      "6460"
    ],
    "oldWardNames": [
      "Xã Minh Sơn",
      "Xã Minh Hòa",
      "Xã Hòa Thắng"
    ]
  },
  {
    "newWardId": "20917057",
    "newWardName": "Vạn Linh",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6103",
      "6520",
      "6505"
    ],
    "oldWardNames": [
      "Xã Hòa Bình",
      "Xã Y Tịch",
      "Xã Vạn Linh"
    ]
  },
  {
    "newWardId": "20905029",
    "newWardName": "Văn Lãng",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6154",
      "6133",
      "6142",
      "6163"
    ],
    "oldWardNames": [
      "Xã Bắc Việt",
      "Xã Bắc La",
      "Xã Tân Tác",
      "Xã Thành Hòa"
    ]
  },
  {
    "newWardId": "20911022",
    "newWardName": "Văn Quan",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6103",
      "6277",
      "6253"
    ],
    "oldWardNames": [
      "Xã Hòa Bình",
      "Xã Tú Xuyên",
      "Thị trấn Văn Quan"
    ]
  },
  {
    "newWardId": "20921047",
    "newWardName": "Vân Nham",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6415",
      "6418",
      "6433"
    ],
    "oldWardNames": [
      "Xã Minh Tiến",
      "Xã Nhật Tiến",
      "Xã Vân Nham"
    ]
  },
  {
    "newWardId": "20909018",
    "newWardName": "Vũ Lăng",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6352",
      "6361",
      "6358",
      "6367"
    ],
    "oldWardNames": [
      "Xã Tân Lập",
      "Xã Tân Hương",
      "Xã Chiêu Vũ",
      "Xã Vũ Lăng"
    ]
  },
  {
    "newWardId": "20909020",
    "newWardName": "Vũ Lễ",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6364",
      "6355",
      "6373"
    ],
    "oldWardNames": [
      "Xã Chiến Thắng",
      "Xã Vũ Sơn",
      "Xã Vũ Lễ"
    ]
  },
  {
    "newWardId": "20915038",
    "newWardName": "Xuân Dương",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6604",
      "6610",
      "6607"
    ],
    "oldWardNames": [
      "Xã Nam Quan",
      "Xã Ái Quốc",
      "Xã Xuân Dương"
    ]
  },
  {
    "newWardId": "20921049",
    "newWardName": "Yên Bình",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6103",
      "6394",
      "6391"
    ],
    "oldWardNames": [
      "Xã Hòa Bình",
      "Xã Quyết Thắng",
      "Xã Yên Bình"
    ]
  },
  {
    "newWardId": "20911025",
    "newWardName": "Yên Phúc",
    "provinceId": "09",
    "provinceName": "Lạng Sơn",
    "oldWardIds": [
      "6283",
      "6298",
      "6319"
    ],
    "oldWardNames": [
      "Xã An Sơn",
      "Xã Bình Phúc",
      "Xã Yên Phúc"
    ]
  },
  {
    "newWardId": "40325018",
    "newWardName": "An Châu",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17500",
      "17482",
      "17479",
      "17497"
    ],
    "oldWardNames": [
      "Xã Diễn An",
      "Xã Diễn Tân",
      "Xã Diễn Thịnh",
      "Xã Diễn Trung"
    ]
  },
  {
    "newWardId": "40327001",
    "newWardName": "Anh Sơn",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17329",
      "17353",
      "17374"
    ],
    "oldWardNames": [
      "Thị trấn Kim Nhan",
      "Xã Đức Sơn",
      "Xã Phúc Sơn"
    ]
  },
  {
    "newWardId": "40327004",
    "newWardName": "Anh Sơn Đông",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17365",
      "17359",
      "17362"
    ],
    "oldWardNames": [
      "Xã Lạng Sơn",
      "Xã Tào Sơn",
      "Xã Vĩnh Sơn"
    ]
  },
  {
    "newWardId": "40329024",
    "newWardName": "Bạch Hà",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17710",
      "17701",
      "17704",
      "17707"
    ],
    "oldWardNames": [
      "Xã Đại Sơn",
      "Xã Hiến Sơn",
      "Xã Mỹ Sơn",
      "Xã Trù Sơn"
    ]
  },
  {
    "newWardId": "40329022",
    "newWardName": "Bạch Ngọc",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17626",
      "17619",
      "17620",
      "17623"
    ],
    "oldWardNames": [
      "Xã Bồi Sơn",
      "Xã Giang Sơn Đông",
      "Xã Giang Sơn Tây",
      "Xã Bạch Ngọc"
    ]
  },
  {
    "newWardId": "40309042",
    "newWardName": "Bắc Lý",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16819"
    ],
    "oldWardNames": [
      "Xã Bắc Lý"
    ]
  },
  {
    "newWardId": "40331104",
    "newWardName": "Bích Hào",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17818",
      "17815",
      "17812",
      "17821"
    ],
    "oldWardNames": [
      "Xã Mai Giang",
      "Xã Thanh Lâm",
      "Xã Thanh Tùng",
      "Xã Thanh Xuân"
    ]
  },
  {
    "newWardId": "40321012",
    "newWardName": "Bình Chuẩn",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17230"
    ],
    "oldWardNames": [
      "Xã Bình Chuẩn"
    ]
  },
  {
    "newWardId": "40323129",
    "newWardName": "Bình Minh",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17518",
      "17509",
      "17515",
      "17510"
    ],
    "oldWardNames": [
      "Xã Đức Thành",
      "Xã Mã Thành",
      "Xã Tân Thành",
      "Xã Tiến Thành"
    ]
  },
  {
    "newWardId": "40321010",
    "newWardName": "Cam Phục",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17236",
      "17242"
    ],
    "oldWardNames": [
      "Xã Cam Lâm",
      "Xã Đôn Phục"
    ]
  },
  {
    "newWardId": "40331098",
    "newWardName": "Cát Ngạn",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17692",
      "17716",
      "17728"
    ],
    "oldWardNames": [
      "Xã Minh Sơn",
      "Xã Cát Văn",
      "Xã Phong Thịnh"
    ]
  },
  {
    "newWardId": "40307073",
    "newWardName": "Châu Bình",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16804"
    ],
    "oldWardNames": [
      "Xã Châu Bình"
    ]
  },
  {
    "newWardId": "40311077",
    "newWardName": "Châu Hồng",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16792",
      "17050",
      "17044"
    ],
    "oldWardNames": [
      "Xã Châu Tiến",
      "Xã Châu Thành",
      "Xã Châu Hồng"
    ]
  },
  {
    "newWardId": "40321011",
    "newWardName": "Châu Khê",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17233",
      "17248"
    ],
    "oldWardNames": [
      "Xã Lạng Khê",
      "Xã Châu Khê"
    ]
  },
  {
    "newWardId": "40311076",
    "newWardName": "Châu Lộc",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17053",
      "17056"
    ],
    "oldWardNames": [
      "Xã Liên Hợp",
      "Xã Châu Lộc"
    ]
  },
  {
    "newWardId": "40307071",
    "newWardName": "Châu Tiến",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16792",
      "16780",
      "16798",
      "16783"
    ],
    "oldWardNames": [
      "Xã Châu Tiến",
      "Xã Châu Bính",
      "Xã Châu Thắng",
      "Xã Châu Thuận"
    ]
  },
  {
    "newWardId": "40309037",
    "newWardName": "Chiêu Lưu",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16846",
      "16855"
    ],
    "oldWardNames": [
      "Xã Bảo Thắng",
      "Xã Chiêu Lưu"
    ]
  },
  {
    "newWardId": "40321007",
    "newWardName": "Con Cuông",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17254",
      "17251",
      "17257"
    ],
    "oldWardNames": [
      "Thị trấn Trà Lân",
      "Xã Chi Khê",
      "Xã Yên Khê"
    ]
  },
  {
    "newWardId": "40301121",
    "newWardName": "Cửa Lò",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16729",
      "16726",
      "16732",
      "16720",
      "16735"
    ],
    "oldWardNames": [
      "Phường Nghi Hải",
      "Phường Nghi Hòa",
      "Phường Nghi Hương",
      "Phường Nghi Tân",
      "Phường Nghi Thu",
      "Phường Nghi Thủy",
      "Xã Thu Thủy"
    ]
  },
  {
    "newWardId": "40325013",
    "newWardName": "Diễn Châu",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17464",
      "17461",
      "17467",
      "17452"
    ],
    "oldWardNames": [
      "Thị trấn Diễn Thành",
      "Xã Diễn Hoa",
      "Xã Diễn Phúc",
      "Xã Ngọc Bích"
    ]
  },
  {
    "newWardId": "40331105",
    "newWardName": "Đại Đồng",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17713",
      "16744",
      "17755",
      "17731",
      "17749"
    ],
    "oldWardNames": [
      "Thị trấn Dùng",
      "Xã Đồng Văn",
      "Xã Thanh Ngọc",
      "Xã Thanh Phong",
      "Xã Đại Đồng"
    ]
  },
  {
    "newWardId": "40335048",
    "newWardName": "Đại Huệ",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17941",
      "17953",
      "17944"
    ],
    "oldWardNames": [
      "Xã Nam Anh",
      "Xã Nam Lĩnh",
      "Xã Nam Xuân"
    ]
  },
  {
    "newWardId": "40329021",
    "newWardName": "Đô Lương",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17095",
      "17086",
      "17668",
      "17650",
      "17659",
      "17683",
      "17665",
      "17662",
      "17617"
    ],
    "oldWardNames": [
      "Xã Bắc Sơn",
      "Xã Nam Sơn",
      "Xã Đà Sơn",
      "Xã Đặng Sơn",
      "Xã Lưu Sơn",
      "Xã Thịnh Sơn",
      "Xã Văn Sơn",
      "Xã Yên Sơn",
      "Thị trấn Đô Lương"
    ]
  },
  {
    "newWardId": "40314097",
    "newWardName": "Đông Hiếu",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17008",
      "17014",
      "17017"
    ],
    "oldWardNames": [
      "Xã Nghĩa Mỹ",
      "Xã Nghĩa Thuận",
      "Xã Đông Hiếu"
    ]
  },
  {
    "newWardId": "40333060",
    "newWardName": "Đông Lộc",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17878",
      "17890",
      "17896"
    ],
    "oldWardNames": [
      "Xã Khánh Hợp",
      "Xã Nghi Thạch",
      "Xã Thịnh Trường"
    ]
  },
  {
    "newWardId": "40323130",
    "newWardName": "Đông Thành",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17527",
      "17542",
      "17530"
    ],
    "oldWardNames": [
      "Xã Đô Thành",
      "Xã Phú Thành",
      "Xã Thọ Thành"
    ]
  },
  {
    "newWardId": "40325014",
    "newWardName": "Đức Châu",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17413",
      "17434",
      "17416",
      "17428"
    ],
    "oldWardNames": [
      "Xã Diễn Hồng",
      "Xã Diễn Kỷ",
      "Xã Diễn Phong",
      "Xã Diễn Vạn"
    ]
  },
  {
    "newWardId": "40323128",
    "newWardName": "Giai Lạc",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17524",
      "17512",
      "17539"
    ],
    "oldWardNames": [
      "Xã Hậu Thành",
      "Xã Lăng Thành",
      "Xã Phúc Thành"
    ]
  },
  {
    "newWardId": "40319092",
    "newWardName": "Giai Xuân",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17269",
      "17278"
    ],
    "oldWardNames": [
      "Xã Tân Hợp",
      "Xã Giai Xuân"
    ]
  },
  {
    "newWardId": "40325016",
    "newWardName": "Hải Châu",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17404",
      "17431",
      "17410",
      "17419"
    ],
    "oldWardNames": [
      "Xã Diễn Hoàng",
      "Xã Diễn Kim",
      "Xã Diễn Mỹ",
      "Xã Hùng Hải"
    ]
  },
  {
    "newWardId": "40333063",
    "newWardName": "Hải Lộc",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17845",
      "17836",
      "17833"
    ],
    "oldWardNames": [
      "Xã Nghi Thiết",
      "Xã Nghi Tiến",
      "Xã Nghi Yên"
    ]
  },
  {
    "newWardId": "40331100",
    "newWardName": "Hạnh Lâm",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17824",
      "17722"
    ],
    "oldWardNames": [
      "Xã Thanh Đức",
      "Xã Hạnh Lâm"
    ]
  },
  {
    "newWardId": "40331102",
    "newWardName": "Hoa Quân",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17773",
      "17758",
      "17776",
      "17770"
    ],
    "oldWardNames": [
      "Xã Thanh An",
      "Xã Thanh Hương",
      "Xã Thanh Quả",
      "Xã Thanh Thịnh"
    ]
  },
  {
    "newWardId": "40339027",
    "newWardName": "Hoàng Mai",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17110",
      "17116",
      "17104"
    ],
    "oldWardNames": [
      "Phường Quỳnh Thiện",
      "Xã Quỳnh Trang",
      "Xã Quỳnh Vinh"
    ]
  },
  {
    "newWardId": "40323124",
    "newWardName": "Hợp Minh",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17605",
      "17578",
      "17614",
      "17596",
      "17587"
    ],
    "oldWardNames": [
      "Xã Bảo Thành",
      "Xã Long Thành",
      "Xã Sơn Thành",
      "Xã Viên Thành",
      "Xã Vĩnh Thành"
    ]
  },
  {
    "newWardId": "40307072",
    "newWardName": "Hùng Chân",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16807",
      "16801",
      "16810"
    ],
    "oldWardNames": [
      "Xã Châu Hoàn",
      "Xã Châu Phong",
      "Xã Diên Lãm"
    ]
  },
  {
    "newWardId": "40325020",
    "newWardName": "Hùng Châu",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17395",
      "17392",
      "17398",
      "17401"
    ],
    "oldWardNames": [
      "Xã Diễn Đoài",
      "Xã Diễn Lâm",
      "Xã Diễn Trường",
      "Xã Diễn Yên"
    ]
  },
  {
    "newWardId": "40309044",
    "newWardName": "Huồi Tụ",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16828"
    ],
    "oldWardNames": [
      "Xã Huồi Tụ"
    ]
  },
  {
    "newWardId": "40337030",
    "newWardName": "Hưng Nguyên",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "18001",
      "18016",
      "18010",
      "18022"
    ],
    "oldWardNames": [
      "Thị trấn Hưng Nguyên",
      "Xã Hưng Đạo",
      "Xã Hưng Tây",
      "Xã Thịnh Mỹ"
    ]
  },
  {
    "newWardId": "40337032",
    "newWardName": "Hưng Nguyên Nam",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "18025",
      "18043",
      "18028",
      "18055"
    ],
    "oldWardNames": [
      "Xã Hưng Lĩnh",
      "Xã Long Xá",
      "Xã Thông Tân",
      "Xã Xuân Lam"
    ]
  },
  {
    "newWardId": "40315114",
    "newWardName": "Hữu Khuông",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16885"
    ],
    "oldWardNames": [
      "Xã Hữu Khuông"
    ]
  },
  {
    "newWardId": "40309035",
    "newWardName": "Hữu Kiệm",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16840",
      "16849",
      "16861"
    ],
    "oldWardNames": [
      "Xã Bảo Nam",
      "Xã Hữu Lập",
      "Xã Hữu Kiệm"
    ]
  },
  {
    "newWardId": "40309043",
    "newWardName": "Keng Đu",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16822"
    ],
    "oldWardNames": [
      "Xã Keng Đu"
    ]
  },
  {
    "newWardId": "40331103",
    "newWardName": "Kim Bảng",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17806",
      "17797",
      "17791"
    ],
    "oldWardNames": [
      "Xã Thanh Hà",
      "Xã Thanh Thủy",
      "Xã Kim Bảng"
    ]
  },
  {
    "newWardId": "40335050",
    "newWardName": "Kim Liên",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17962",
      "17983",
      "17956",
      "17980",
      "17971"
    ],
    "oldWardNames": [
      "Xã Hùng Tiến",
      "Xã Nam Cát",
      "Xã Nam Giang",
      "Xã Xuân Hồng",
      "Xã Kim Liên"
    ]
  },
  {
    "newWardId": "40337033",
    "newWardName": "Lam Thành",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "18052",
      "18037",
      "18064",
      "18040"
    ],
    "oldWardNames": [
      "Xã Châu Nhân",
      "Xã Hưng Nghĩa",
      "Xã Hưng Thành",
      "Xã Phúc Lợi"
    ]
  },
  {
    "newWardId": "40315110",
    "newWardName": "Lượng Minh",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Lượng Minh"
    ]
  },
  {
    "newWardId": "40329026",
    "newWardName": "Lương Sơn",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17632",
      "17653",
      "17629",
      "17641"
    ],
    "oldWardNames": [
      "Xã Bài Sơn",
      "Xã Đông Sơn",
      "Xã Hồng Sơn",
      "Xã Tràng Sơn"
    ]
  },
  {
    "newWardId": "40321009",
    "newWardName": "Mậu Thạch",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17245",
      "17239"
    ],
    "oldWardNames": [
      "Xã Mậu Đức",
      "Xã Thạch Ngàn"
    ]
  },
  {
    "newWardId": "40325019",
    "newWardName": "Minh Châu",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17476",
      "17458",
      "17449",
      "17485"
    ],
    "oldWardNames": [
      "Xã Diễn Cát",
      "Xã Diễn Nguyên",
      "Xã Hạnh Quảng",
      "Xã Minh Châu"
    ]
  },
  {
    "newWardId": "40311080",
    "newWardName": "Minh Hợp",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17092",
      "17083",
      "17071"
    ],
    "oldWardNames": [
      "Xã Hạ Sơn",
      "Xã Văn Lợi",
      "Xã Minh Hợp"
    ]
  },
  {
    "newWardId": "40321008",
    "newWardName": "Môn Sơn",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17260",
      "17263"
    ],
    "oldWardNames": [
      "Xã Lục Dạ",
      "Xã Môn Sơn"
    ]
  },
  {
    "newWardId": "40311079",
    "newWardName": "Mường Chọng",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17095",
      "17086",
      "17089"
    ],
    "oldWardNames": [
      "Xã Bắc Sơn",
      "Xã Nam Sơn",
      "Xã Châu Lý"
    ]
  },
  {
    "newWardId": "40311078",
    "newWardName": "Mường Ham",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17062",
      "17077"
    ],
    "oldWardNames": [
      "Xã Châu Cường",
      "Xã Châu Thái"
    ]
  },
  {
    "newWardId": "40309045",
    "newWardName": "Mường Lống",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16831"
    ],
    "oldWardNames": [
      "Xã Mường Lống"
    ]
  },
  {
    "newWardId": "40305068",
    "newWardName": "Mường Quàng",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16765",
      "16771"
    ],
    "oldWardNames": [
      "Xã Cắm Muộn",
      "Xã Châu Thôn",
      "Xã Quang Phong"
    ]
  },
  {
    "newWardId": "40309039",
    "newWardName": "Mường Típ",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16867",
      "16858"
    ],
    "oldWardNames": [
      "Xã Mường Ải",
      "Xã Mường Típ"
    ]
  },
  {
    "newWardId": "40309034",
    "newWardName": "Mường Xén",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16813",
      "16852",
      "16864"
    ],
    "oldWardNames": [
      "Thị trấn Mường Xén",
      "Xã Tà Cạ",
      "Xã Tây Sơn"
    ]
  },
  {
    "newWardId": "40309041",
    "newWardName": "Mỹ Lý",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16816"
    ],
    "oldWardNames": [
      "Xã Mỹ Lý"
    ]
  },
  {
    "newWardId": "40309038",
    "newWardName": "Na Loi",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16825",
      "16834"
    ],
    "oldWardNames": [
      "Xã Đoọc Mạy",
      "Xã Na Loi"
    ]
  },
  {
    "newWardId": "40309040",
    "newWardName": "Na Ngoi",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16873",
      "16870"
    ],
    "oldWardNames": [
      "Xã Nậm Càn",
      "Xã Na Ngoi"
    ]
  },
  {
    "newWardId": "40335047",
    "newWardName": "Nam Đàn",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17290",
      "17932",
      "17938"
    ],
    "oldWardNames": [
      "Xã Nghĩa Thái",
      "Xã Nam Hưng",
      "Xã Nam Thanh"
    ]
  },
  {
    "newWardId": "40309036",
    "newWardName": "Nậm Cắn",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16843",
      "16837"
    ],
    "oldWardNames": [
      "Xã Phà Đánh",
      "Xã Nậm Cắn"
    ]
  },
  {
    "newWardId": "40315113",
    "newWardName": "Nga My",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16904",
      "16903"
    ],
    "oldWardNames": [
      "Xã Xiêng My",
      "Xã Nga My"
    ]
  },
  {
    "newWardId": "40333058",
    "newWardName": "Nghi Lộc",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17827",
      "17899",
      "17893",
      "17911"
    ],
    "oldWardNames": [
      "Thị trấn Quán Hành",
      "Xã Diên Hoa",
      "Xã Nghi Trung",
      "Xã Nghi Vạn"
    ]
  },
  {
    "newWardId": "40313051",
    "newWardName": "Nghĩa Đàn",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16941",
      "16960",
      "16981"
    ],
    "oldWardNames": [
      "Thị trấn Nghĩa Đàn",
      "Xã Nghĩa Bình",
      "Xã Nghĩa Trung"
    ]
  },
  {
    "newWardId": "40319091",
    "newWardName": "Nghĩa Đồng",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17281",
      "17284"
    ],
    "oldWardNames": [
      "Xã Bình Hợp",
      "Xã Nghĩa Đồng"
    ]
  },
  {
    "newWardId": "40319093",
    "newWardName": "Nghĩa Hành",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17323",
      "17325",
      "17326"
    ],
    "oldWardNames": [
      "Xã Phú Sơn",
      "Xã Tân Hương",
      "Xã Nghĩa Hành"
    ]
  },
  {
    "newWardId": "40313055",
    "newWardName": "Nghĩa Hưng",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16987",
      "16972"
    ],
    "oldWardNames": [
      "Xã Nghĩa Thành",
      "Xã Nghĩa Hưng"
    ]
  },
  {
    "newWardId": "40313056",
    "newWardName": "Nghĩa Khánh",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17023",
      "17020",
      "17032"
    ],
    "oldWardNames": [
      "Xã Nghĩa An",
      "Xã Nghĩa Đức",
      "Xã Nghĩa Khánh"
    ]
  },
  {
    "newWardId": "40313053",
    "newWardName": "Nghĩa Lâm",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16948",
      "16954",
      "16945",
      "16951"
    ],
    "oldWardNames": [
      "Xã Nghĩa Lạc",
      "Xã Nghĩa Sơn",
      "Xã Nghĩa Yên",
      "Xã Nghĩa Lâm"
    ]
  },
  {
    "newWardId": "40313057",
    "newWardName": "Nghĩa Lộc",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17026",
      "17029"
    ],
    "oldWardNames": [
      "Xã Nghĩa Long",
      "Xã Nghĩa Lộc"
    ]
  },
  {
    "newWardId": "40313054",
    "newWardName": "Nghĩa Mai",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16975",
      "16966",
      "16942"
    ],
    "oldWardNames": [
      "Xã Nghĩa Hồng",
      "Xã Nghĩa Minh",
      "Xã Nghĩa Mai"
    ]
  },
  {
    "newWardId": "40313052",
    "newWardName": "Nghĩa Thọ",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16984",
      "16957",
      "16969"
    ],
    "oldWardNames": [
      "Xã Nghĩa Hội",
      "Xã Nghĩa Lợi",
      "Xã Nghĩa Thọ"
    ]
  },
  {
    "newWardId": "40327003",
    "newWardName": "Nhân Hòa",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17350",
      "17347",
      "17344"
    ],
    "oldWardNames": [
      "Xã Cẩm Sơn",
      "Xã Hùng Sơn",
      "Xã Tam Đỉnh"
    ]
  },
  {
    "newWardId": "40315115",
    "newWardName": "Nhôn Mai",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16879",
      "16882"
    ],
    "oldWardNames": [
      "Xã Mai Sơn",
      "Xã Nhôn Mai"
    ]
  },
  {
    "newWardId": "40333059",
    "newWardName": "Phúc Lộc",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17884",
      "17887",
      "17848",
      "17857"
    ],
    "oldWardNames": [
      "Xã Nghi Công Bắc",
      "Xã Nghi Công Nam",
      "Xã Nghi Lâm",
      "Xã Nghi Mỹ"
    ]
  },
  {
    "newWardId": "40323123",
    "newWardName": "Quan Thành",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17569",
      "17584",
      "17575",
      "17566"
    ],
    "oldWardNames": [
      "Xã Bắc Thành",
      "Xã Nam Thành",
      "Xã Trung Thành",
      "Xã Xuân Thành"
    ]
  },
  {
    "newWardId": "40325015",
    "newWardName": "Quảng Châu",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17443",
      "17425",
      "17440",
      "17437"
    ],
    "oldWardNames": [
      "Xã Diễn Đồng",
      "Xã Diễn Liên",
      "Xã Diễn Thái",
      "Xã Xuân Tháp"
    ]
  },
  {
    "newWardId": "40323127",
    "newWardName": "Quang Đồng",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17545",
      "17521",
      "17533"
    ],
    "oldWardNames": [
      "Xã Đồng Thành",
      "Xã Kim Thành",
      "Xã Quang Thành"
    ]
  },
  {
    "newWardId": "40305065",
    "newWardName": "Quế Phong",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16738",
      "16759",
      "16763",
      "16753"
    ],
    "oldWardNames": [
      "Thị trấn Kim Sơn",
      "Xã Châu Kim",
      "Xã Mường Nọc",
      "Xã Nậm Giải"
    ]
  },
  {
    "newWardId": "40307070",
    "newWardName": "Quỳ Châu",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16777",
      "16795",
      "16786",
      "16789"
    ],
    "oldWardNames": [
      "Thị trấn Tân Lạc",
      "Xã Châu Hạnh",
      "Xã Châu Hội",
      "Xã Châu Nga"
    ]
  },
  {
    "newWardId": "40311074",
    "newWardName": "Quỳ Hợp",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17035",
      "17080",
      "17065",
      "17068"
    ],
    "oldWardNames": [
      "Thị trấn Quỳ Hợp",
      "Xã Châu Đình",
      "Xã Châu Quang",
      "Xã Thọ Hợp"
    ]
  },
  {
    "newWardId": "40317083",
    "newWardName": "Quỳnh Anh",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17176",
      "17158",
      "17173",
      "17164",
      "17182"
    ],
    "oldWardNames": [
      "Xã Minh Lương",
      "Xã Quỳnh Bảng",
      "Xã Quỳnh Đôi",
      "Xã Quỳnh Thanh",
      "Xã Quỳnh Yên"
    ]
  },
  {
    "newWardId": "40317081",
    "newWardName": "Quỳnh Lưu",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17179",
      "17185",
      "17191",
      "17197",
      "17167"
    ],
    "oldWardNames": [
      "Thị trấn Cầu Giát",
      "Xã Bình Sơn",
      "Xã Quỳnh Diễn",
      "Xã Quỳnh Giang",
      "Xã Quỳnh Hậu"
    ]
  },
  {
    "newWardId": "40339029",
    "newWardName": "Quỳnh Mai",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17125",
      "17134",
      "17131",
      "17137"
    ],
    "oldWardNames": [
      "Phường Mai Hùng",
      "Phường Quỳnh Phương",
      "Phường Quỳnh Xuân",
      "Xã Quỳnh Liên"
    ]
  },
  {
    "newWardId": "40317085",
    "newWardName": "Quỳnh Phú",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17206",
      "17209",
      "17218",
      "17212"
    ],
    "oldWardNames": [
      "Xã An Hòa",
      "Xã Phú Nghĩa",
      "Xã Thuận Long",
      "Xã Văn Hải"
    ]
  },
  {
    "newWardId": "40317086",
    "newWardName": "Quỳnh Sơn",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17146",
      "17170",
      "17152"
    ],
    "oldWardNames": [
      "Xã Ngọc Sơn",
      "Xã Quỳnh Lâm",
      "Xã Quỳnh Sơn"
    ]
  },
  {
    "newWardId": "40317084",
    "newWardName": "Quỳnh Tam",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17140",
      "17122",
      "17149"
    ],
    "oldWardNames": [
      "Xã Tân Sơn",
      "Xã Quỳnh Châu",
      "Xã Quỳnh Tam"
    ]
  },
  {
    "newWardId": "40317087",
    "newWardName": "Quỳnh Thắng",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17224",
      "17101"
    ],
    "oldWardNames": [
      "Xã Tân Thắng",
      "Xã Quỳnh Thắng"
    ]
  },
  {
    "newWardId": "40317082",
    "newWardName": "Quỳnh Văn",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17119",
      "17155",
      "17143"
    ],
    "oldWardNames": [
      "Xã Quỳnh Tân",
      "Xã Quỳnh Thạch",
      "Xã Quỳnh Văn"
    ]
  },
  {
    "newWardId": "40331101",
    "newWardName": "Sơn Lâm",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17759",
      "17723"
    ],
    "oldWardNames": [
      "Xã Ngọc Lâm",
      "Xã Thanh Sơn"
    ]
  },
  {
    "newWardId": "40331099",
    "newWardName": "Tam Đồng",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17743",
      "17734",
      "17737"
    ],
    "oldWardNames": [
      "Xã Thanh Liên",
      "Xã Thanh Mỹ",
      "Xã Thanh Tiên"
    ]
  },
  {
    "newWardId": "40311075",
    "newWardName": "Tam Hợp",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16936",
      "17047",
      "17074",
      "17038"
    ],
    "oldWardNames": [
      "Xã Tam Hợp",
      "Xã Đồng Hợp",
      "Xã Nghĩa Xuân",
      "Xã Yên Hợp"
    ]
  },
  {
    "newWardId": "40315107",
    "newWardName": "Tam Quang",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16927",
      "16933"
    ],
    "oldWardNames": [
      "Xã Tam Đình",
      "Xã Tam Quang"
    ]
  },
  {
    "newWardId": "40315108",
    "newWardName": "Tam Thái",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16936",
      "16924"
    ],
    "oldWardNames": [
      "Xã Tam Hợp",
      "Xã Tam Thái"
    ]
  },
  {
    "newWardId": "40319090",
    "newWardName": "Tân An",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17317",
      "17299",
      "17305"
    ],
    "oldWardNames": [
      "Xã Hương Sơn",
      "Xã Nghĩa Phúc",
      "Xã Tân An"
    ]
  },
  {
    "newWardId": "40325017",
    "newWardName": "Tân Châu",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17494",
      "17491",
      "17503",
      "17488"
    ],
    "oldWardNames": [
      "Xã Diễn Lộc",
      "Xã Diễn Lợi",
      "Xã Diễn Phú",
      "Xã Diễn Thọ"
    ]
  },
  {
    "newWardId": "40319088",
    "newWardName": "Tân Kỳ",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17266",
      "17308",
      "17320",
      "17314"
    ],
    "oldWardNames": [
      "Thị trấn Tân Kỳ",
      "Xã Nghĩa Dũng",
      "Xã Kỳ Tân",
      "Xã Kỳ Sơn"
    ]
  },
  {
    "newWardId": "40339028",
    "newWardName": "Tân Mai",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17128",
      "17113",
      "17107"
    ],
    "oldWardNames": [
      "Phường Quỳnh Dị",
      "Xã Quỳnh Lập",
      "Xã Quỳnh Lộc"
    ]
  },
  {
    "newWardId": "40319089",
    "newWardName": "Tân Phú",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17290",
      "17296",
      "17275",
      "17272"
    ],
    "oldWardNames": [
      "Xã Nghĩa Thái",
      "Xã Hoàn Long",
      "Xã Tân Xuân",
      "Xã Tân Phú"
    ]
  },
  {
    "newWardId": "40314096",
    "newWardName": "Tây Hiếu",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16994",
      "17005",
      "17011"
    ],
    "oldWardNames": [
      "Phường Quang Tiến",
      "Xã Nghĩa Tiến",
      "Xã Tây Hiếu"
    ]
  },
  {
    "newWardId": "40314095",
    "newWardName": "Thái Hòa",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17003",
      "16993"
    ],
    "oldWardNames": [
      "Phường Hòa Hiếu",
      "Phường Long Sơn",
      "Phường Quang Phong"
    ]
  },
  {
    "newWardId": "40327006",
    "newWardName": "Thành Bình Thọ",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17185",
      "17335",
      "17332"
    ],
    "oldWardNames": [
      "Xã Bình Sơn",
      "Xã Thành Sơn",
      "Xã Thọ Sơn"
    ]
  },
  {
    "newWardId": "40301117",
    "newWardName": "Thành Vinh",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16678",
      "16663",
      "16672",
      "16669",
      "16681",
      "18013"
    ],
    "oldWardNames": [
      "Phường Cửa Nam",
      "Phường Đông Vĩnh",
      "Phường Hưng Bình",
      "Phường Lê Lợi",
      "Phường Quang Trung",
      "Xã Hưng Chính"
    ]
  },
  {
    "newWardId": "40333062",
    "newWardName": "Thần Lĩnh",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17842",
      "17839",
      "17860"
    ],
    "oldWardNames": [
      "Xã Nghi Đồng",
      "Xã Nghi Hưng",
      "Xã Nghi Phương"
    ]
  },
  {
    "newWardId": "40335049",
    "newWardName": "Thiên Nhẫn",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17986",
      "17998",
      "17989"
    ],
    "oldWardNames": [
      "Xã Khánh Sơn",
      "Xã Nam Kim",
      "Xã Trung Phúc Cường"
    ]
  },
  {
    "newWardId": "40305069",
    "newWardName": "Thông Thụ",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16744",
      "16741"
    ],
    "oldWardNames": [
      "Xã Đồng Văn",
      "Xã Thông Thụ"
    ]
  },
  {
    "newWardId": "40329025",
    "newWardName": "Thuần Trung",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17692",
      "17671",
      "17698",
      "17695",
      "17686",
      "17689"
    ],
    "oldWardNames": [
      "Xã Minh Sơn",
      "Xã Lạc Sơn",
      "Xã Nhân Sơn",
      "Xã Thuận Sơn",
      "Xã Trung Sơn",
      "Xã Xuân Sơn"
    ]
  },
  {
    "newWardId": "40319094",
    "newWardName": "Tiên Đồng",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16744",
      "17302"
    ],
    "oldWardNames": [
      "Xã Đồng Văn",
      "Xã Tiên Kỳ"
    ]
  },
  {
    "newWardId": "40305066",
    "newWardName": "Tiền Phong",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16747",
      "16750"
    ],
    "oldWardNames": [
      "Xã Hạnh Dịch",
      "Xã Tiền Phong"
    ]
  },
  {
    "newWardId": "40305067",
    "newWardName": "Tri Lễ",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16768",
      "16756"
    ],
    "oldWardNames": [
      "Xã Nậm Nhoóng",
      "Xã Tri Lễ"
    ]
  },
  {
    "newWardId": "40333061",
    "newWardName": "Trung Lộc",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17866",
      "17851",
      "17863",
      "17869"
    ],
    "oldWardNames": [
      "Xã Nghi Long",
      "Xã Nghi Quang",
      "Xã Nghi Thuận",
      "Xã Nghi Xá"
    ]
  },
  {
    "newWardId": "40301116",
    "newWardName": "Trường Vinh",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16693",
      "16675",
      "16673",
      "16699",
      "16690",
      "16714",
      "16711"
    ],
    "oldWardNames": [
      "Phường Bến Thủy",
      "Phường Hưng Dũng",
      "Phường Hưng Phúc",
      "Phường Trung Đô",
      "Phường Trường Thi",
      "Phường Vinh Tân",
      "Xã Hưng Hòa"
    ]
  },
  {
    "newWardId": "40315109",
    "newWardName": "Tương Dương",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16876",
      "16915",
      "16921"
    ],
    "oldWardNames": [
      "Thị trấn Thạch Giám",
      "Xã Lưu Kiền",
      "Xã Xá Lượng"
    ]
  },
  {
    "newWardId": "40335046",
    "newWardName": "Vạn An",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17950",
      "17968",
      "17959"
    ],
    "oldWardNames": [
      "Thị trấn Nam Đàn",
      "Xã Thượng Tân Lộc",
      "Xã Xuân Hòa"
    ]
  },
  {
    "newWardId": "40329023",
    "newWardName": "Văn Hiến",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17140",
      "17647",
      "17680",
      "17677",
      "17644"
    ],
    "oldWardNames": [
      "Xã Tân Sơn",
      "Xã Hòa Sơn",
      "Xã Quang Sơn",
      "Xã Thái Sơn",
      "Xã Thượng Sơn"
    ]
  },
  {
    "newWardId": "40333064",
    "newWardName": "Văn Kiều",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17854",
      "17830"
    ],
    "oldWardNames": [
      "Xã Nghi Kiều",
      "Xã Nghi Văn"
    ]
  },
  {
    "newWardId": "40323126",
    "newWardName": "Vân Du",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17581",
      "17536",
      "17560"
    ],
    "oldWardNames": [
      "Xã Minh Thành",
      "Xã Tây Thành",
      "Xã Thịnh Thành"
    ]
  },
  {
    "newWardId": "40323125",
    "newWardName": "Vân Tụ",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17602",
      "17608",
      "17611"
    ],
    "oldWardNames": [
      "Xã Liên Thành",
      "Xã Mỹ Thành",
      "Xã Vân Tụ"
    ]
  },
  {
    "newWardId": "40301118",
    "newWardName": "Vinh Hưng",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16705",
      "16670",
      "17920",
      "17908"
    ],
    "oldWardNames": [
      "Phường Hưng Đông",
      "Phường Quán Bàu",
      "Xã Nghi Kim",
      "Xã Nghi Liên"
    ]
  },
  {
    "newWardId": "40301120",
    "newWardName": "Vinh Lộc",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16708",
      "17902",
      "17926",
      "17905",
      "17917"
    ],
    "oldWardNames": [
      "Phường Hưng Lộc",
      "Xã Nghi Phong",
      "Xã Nghi Thái",
      "Xã Nghi Xuân",
      "Xã Phúc Thọ"
    ]
  },
  {
    "newWardId": "40301119",
    "newWardName": "Vinh Phú",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16666",
      "17923",
      "16702",
      "17914"
    ],
    "oldWardNames": [
      "Phường Hà Huy Tập",
      "Phường Nghi Đức",
      "Phường Nghi Phú",
      "Xã Nghi Ân"
    ]
  },
  {
    "newWardId": "40327005",
    "newWardName": "Vĩnh Tường",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17357",
      "17368",
      "17356"
    ],
    "oldWardNames": [
      "Xã Hoa Sơn",
      "Xã Hội Sơn",
      "Xã Tường Sơn"
    ]
  },
  {
    "newWardId": "40331106",
    "newWardName": "Xuân Lâm",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17146",
      "17785",
      "17779"
    ],
    "oldWardNames": [
      "Xã Ngọc Sơn",
      "Xã Minh Tiến",
      "Xã Xuân Dương"
    ]
  },
  {
    "newWardId": "40315112",
    "newWardName": "Yên Hòa",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16930",
      "16909"
    ],
    "oldWardNames": [
      "Xã Yên Thắng",
      "Xã Yên Hòa"
    ]
  },
  {
    "newWardId": "40315111",
    "newWardName": "Yên Na",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "16900",
      "16912"
    ],
    "oldWardNames": [
      "Xã Yên Tĩnh",
      "Xã Yên Na"
    ]
  },
  {
    "newWardId": "40323122",
    "newWardName": "Yên Thành",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17506",
      "17572",
      "17554",
      "17557"
    ],
    "oldWardNames": [
      "Thị trấn Hoa Thành",
      "Xã Đông Thành",
      "Xã Tăng Thành",
      "Xã Văn Thành"
    ]
  },
  {
    "newWardId": "40337031",
    "newWardName": "Yên Trung",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "18008",
      "18004"
    ],
    "oldWardNames": [
      "Xã Hưng Yên Bắc",
      "Xã Hưng Yên Nam",
      "Xã Hưng Trung"
    ]
  },
  {
    "newWardId": "40327002",
    "newWardName": "Yên Xuân",
    "provinceId": "03",
    "provinceName": "Nghệ An",
    "oldWardIds": [
      "17386",
      "17380",
      "17383",
      "17377"
    ],
    "oldWardNames": [
      "Xã Cao Sơn",
      "Xã Khai Sơn",
      "Xã Lĩnh Sơn",
      "Xã Long Sơn"
    ]
  },
  {
    "newWardId": "11107044",
    "newWardName": "Bắc Lý",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Chân Lý",
      "Xã Đạo Lý",
      "Xã Bắc Lý"
    ]
  },
  {
    "newWardId": "11111034",
    "newWardName": "Bình An",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trung Lương",
      "Xã Ngọc Lũ",
      "Xã Bình An"
    ]
  },
  {
    "newWardId": "11111035",
    "newWardName": "Bình Giang",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bồ Đề",
      "Xã Vũ Bản",
      "Xã An Ninh"
    ]
  },
  {
    "newWardId": "11111032",
    "newWardName": "Bình Lục",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình Nghĩa",
      "Xã Tràng An",
      "Xã Đồng Du"
    ]
  },
  {
    "newWardId": "11715030",
    "newWardName": "Bình Minh",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14623",
      "14689",
      "14686"
    ],
    "oldWardNames": [
      "Thị trấn Bình Minh",
      "Xã Cồn Thoi",
      "Xã Kim Mỹ"
    ]
  },
  {
    "newWardId": "11111033",
    "newWardName": "Bình Mỹ",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Bình Mỹ",
      "Xã Đồn Xá",
      "Xã La Sơn"
    ]
  },
  {
    "newWardId": "11111036",
    "newWardName": "Bình Sơn",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tiêu Động",
      "Xã An Lão",
      "Xã An Đổ"
    ]
  },
  {
    "newWardId": "11311067",
    "newWardName": "Cát Thành",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Cát Thành",
      "Xã Việt Hùng",
      "Xã Trực Đạo"
    ]
  },
  {
    "newWardId": "11715024",
    "newWardName": "Chất Bình",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14632",
      "14629",
      "14653"
    ],
    "oldWardNames": [
      "Xã Xuân Chính",
      "Xã Hồi Ninh",
      "Xã Chất Bình"
    ]
  },
  {
    "newWardId": "11101109",
    "newWardName": "Châu Sơn",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Thanh Tuyền",
      "Phường Châu Sơn",
      "Thị trấn Kiện Khê"
    ]
  },
  {
    "newWardId": "11311065",
    "newWardName": "Cổ Lễ",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Cổ Lễ",
      "Xã Trung Đông",
      "Xã Trực Tuấn"
    ]
  },
  {
    "newWardId": "11705011",
    "newWardName": "Cúc Phương",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14431",
      "14404"
    ],
    "oldWardNames": [
      "Xã Văn Phương",
      "Xã Cúc Phương"
    ]
  },
  {
    "newWardId": "11103114",
    "newWardName": "Duy Hà",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Duy Minh",
      "Phường Duy Hải",
      "Phường Hoàng Đông"
    ]
  },
  {
    "newWardId": "11103112",
    "newWardName": "Duy Tân",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Châu Giang",
      "Xã Mộc Hoàn",
      "Phường Hòa Mạc"
    ]
  },
  {
    "newWardId": "11103111",
    "newWardName": "Duy Tiên",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Chuyên Ngoại",
      "Xã Trác Văn",
      "Xã Yên Nam",
      "Phường Hòa Mạc"
    ]
  },
  {
    "newWardId": "11707002",
    "newWardName": "Đại Hoàng",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14506",
      "14500",
      "14509"
    ],
    "oldWardNames": [
      "Xã Tiến Thắng",
      "Xã Gia Phương",
      "Xã Gia Trung"
    ]
  },
  {
    "newWardId": "11715029",
    "newWardName": "Định Hóa",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14680",
      "14683",
      "14677"
    ],
    "oldWardNames": [
      "Xã Văn Hải",
      "Xã Kim Tân",
      "Xã Định Hóa"
    ]
  },
  {
    "newWardId": "11301124",
    "newWardName": "Đông A",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Lộc Hòa",
      "Xã Mỹ Thắng",
      "Xã Mỹ Hà"
    ]
  },
  {
    "newWardId": "11713101",
    "newWardName": "Đông Hoa Lư",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14353",
      "14569",
      "14566",
      "14575"
    ],
    "oldWardNames": [
      "Phường Ninh Phúc",
      "Xã Khánh Hòa",
      "Xã Khánh Phú",
      "Xã Khánh An"
    ]
  },
  {
    "newWardId": "11711023",
    "newWardName": "Đồng Thái",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14746",
      "14734",
      "14749"
    ],
    "oldWardNames": [
      "Xã Yên Đồng",
      "Xã Yên Thành",
      "Xã Yên Thái"
    ]
  },
  {
    "newWardId": "11317091",
    "newWardName": "Đồng Thịnh",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hoàng Nam",
      "Xã Đồng Thịnh"
    ]
  },
  {
    "newWardId": "11103113",
    "newWardName": "Đồng Văn",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Bạch Thượng",
      "Phường Yên Bắc",
      "Phường Đồng Văn"
    ]
  },
  {
    "newWardId": "11707003",
    "newWardName": "Gia Hưng",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14473",
      "14482",
      "14470"
    ],
    "oldWardNames": [
      "Xã Liên Sơn",
      "Xã Gia Phú",
      "Xã Gia Hưng"
    ]
  },
  {
    "newWardId": "11705008",
    "newWardName": "Gia Lâm",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14392",
      "14386",
      "14389"
    ],
    "oldWardNames": [
      "Xã Gia Sơn",
      "Xã Xích Thổ",
      "Xã Gia Lâm"
    ]
  },
  {
    "newWardId": "11707004",
    "newWardName": "Gia Phong",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14515",
      "14512",
      "14524"
    ],
    "oldWardNames": [
      "Xã Gia Lạc",
      "Xã Gia Minh",
      "Xã Gia Phong"
    ]
  },
  {
    "newWardId": "11707006",
    "newWardName": "Gia Trấn",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14476",
      "14485",
      "14494"
    ],
    "oldWardNames": [
      "Xã Gia Thanh",
      "Xã Gia Xuân",
      "Xã Gia Trấn"
    ]
  },
  {
    "newWardId": "11705009",
    "newWardName": "Gia Tường",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14398",
      "14410",
      "14401"
    ],
    "oldWardNames": [
      "Xã Gia Thủy",
      "Xã Đức Long",
      "Xã Gia Tường"
    ]
  },
  {
    "newWardId": "11707005",
    "newWardName": "Gia Vân",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14488",
      "14479",
      "14503"
    ],
    "oldWardNames": [
      "Xã Gia Lập",
      "Xã Gia Vân",
      "Xã Gia Tân"
    ]
  },
  {
    "newWardId": "11707001",
    "newWardName": "Gia Viễn",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14464",
      "14467"
    ],
    "oldWardNames": [
      "Thị trấn Thịnh Vượng",
      "Xã Gia Hòa"
    ]
  },
  {
    "newWardId": "11315089",
    "newWardName": "Giao Bình",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Giao Yến",
      "Xã Bạch Long",
      "Xã Giao Tân"
    ]
  },
  {
    "newWardId": "11315085",
    "newWardName": "Giao Hòa",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hồng Thuận",
      "Xã Giao An",
      "Xã Giao Lạc"
    ]
  },
  {
    "newWardId": "11315088",
    "newWardName": "Giao Hưng",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Giao Nhân",
      "Xã Giao Long",
      "Xã Giao Châu"
    ]
  },
  {
    "newWardId": "11315084",
    "newWardName": "Giao Minh",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Giao Thiện",
      "Xã Giao Hương",
      "Xã Giao Thanh"
    ]
  },
  {
    "newWardId": "11315090",
    "newWardName": "Giao Ninh",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Quất Lâm",
      "Xã Giao Phong",
      "Xã Giao Thịnh"
    ]
  },
  {
    "newWardId": "11315087",
    "newWardName": "Giao Phúc",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Giao Xuân",
      "Xã Giao Hà",
      "Xã Giao Hải"
    ]
  },
  {
    "newWardId": "11101106",
    "newWardName": "Hà Nam",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Lam Hạ",
      "Phường Tân Hiệp",
      "Phường Quang Trung",
      "Phường Hoàng Đông",
      "Phường Tiên Nội",
      "Xã Tiên Ngoại"
    ]
  },
  {
    "newWardId": "11319080",
    "newWardName": "Hải An",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hải Phong",
      "Xã Hải Giang",
      "Xã Hải An"
    ]
  },
  {
    "newWardId": "11319077",
    "newWardName": "Hải Anh",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hải Minh",
      "Xã Hải Đường",
      "Xã Hải Anh"
    ]
  },
  {
    "newWardId": "11319076",
    "newWardName": "Hải Hậu",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Yên Định",
      "Xã Hải Trung",
      "Xã Hải Long"
    ]
  },
  {
    "newWardId": "11319079",
    "newWardName": "Hải Hưng",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hải Nam",
      "Xã Hải Lộc",
      "Xã Hải Hưng"
    ]
  },
  {
    "newWardId": "11319081",
    "newWardName": "Hải Quang",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hải Đông",
      "Xã Hải Tây",
      "Xã Hải Quang"
    ]
  },
  {
    "newWardId": "11319083",
    "newWardName": "Hải Thịnh",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Thịnh Long",
      "Xã Hải Châu",
      "Xã Hải Ninh"
    ]
  },
  {
    "newWardId": "11319078",
    "newWardName": "Hải Tiến",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Cồn",
      "Xã Hải Sơn",
      "Xã Hải Tân"
    ]
  },
  {
    "newWardId": "11319082",
    "newWardName": "Hải Xuân",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hải Phú",
      "Xã Hải Hòa",
      "Xã Hải Xuân"
    ]
  },
  {
    "newWardId": "11303055",
    "newWardName": "Hiển Khánh",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hợp Hưng",
      "Xã Trung Thành",
      "Xã Quang Trung",
      "Xã Hiển Khánh"
    ]
  },
  {
    "newWardId": "11709099",
    "newWardName": "Hoa Lư",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14527",
      "14344",
      "14320",
      "14323",
      "14329",
      "14341",
      "14338",
      "14332",
      "14536",
      "14347",
      "14350"
    ],
    "oldWardNames": [
      "Phường Ninh Mỹ",
      "Phường Ninh Khánh",
      "Phường Đông Thành",
      "Phường Tân Thành",
      "Phường Vân Giang",
      "Phường Nam Thành",
      "Phường Nam Bình",
      "Phường Bích Đào",
      "Xã Ninh Khang",
      "Xã Ninh Nhất",
      "Xã Ninh Tiến"
    ]
  },
  {
    "newWardId": "11317094",
    "newWardName": "Hồng Phong",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nghĩa Hồng",
      "Xã Nghĩa Phong",
      "Xã Nghĩa Phú"
    ]
  },
  {
    "newWardId": "11309128",
    "newWardName": "Hồng Quang",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hồng Quang",
      "Xã Nghĩa An",
      "Phường Nam Vân"
    ]
  },
  {
    "newWardId": "11713018",
    "newWardName": "Khánh Hội",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14593",
      "14614",
      "14599"
    ],
    "oldWardNames": [
      "Xã Khánh Mậu",
      "Xã Khánh Thủy",
      "Xã Khánh Hội"
    ]
  },
  {
    "newWardId": "11713016",
    "newWardName": "Khánh Nhạc",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14617",
      "14611"
    ],
    "oldWardNames": [
      "Xã Khánh Hồng",
      "Xã Khánh Nhạc"
    ]
  },
  {
    "newWardId": "11713017",
    "newWardName": "Khánh Thiện",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14578",
      "14572",
      "14563"
    ],
    "oldWardNames": [
      "Xã Khánh Cường",
      "Xã Khánh Lợi",
      "Xã Khánh Thiện"
    ]
  },
  {
    "newWardId": "11713019",
    "newWardName": "Khánh Trung",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14608",
      "14602",
      "14590"
    ],
    "oldWardNames": [
      "Xã Khánh Thành",
      "Xã Khánh Công",
      "Xã Khánh Trung"
    ]
  },
  {
    "newWardId": "11105121",
    "newWardName": "Kim Bảng",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Quế",
      "Phường Ngọc Sơn",
      "Xã Văn Xá"
    ]
  },
  {
    "newWardId": "11715031",
    "newWardName": "Kim Đông",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14695",
      "14698"
    ],
    "oldWardNames": [
      "Xã Kim Trung",
      "Xã Kim Đông",
      "Khu vực bãi bồi ven biển"
    ]
  },
  {
    "newWardId": "11715025",
    "newWardName": "Kim Sơn",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14635",
      "14638",
      "14641"
    ],
    "oldWardNames": [
      "Xã Kim Định",
      "Xã Ân Hòa",
      "Xã Hùng Tiến"
    ]
  },
  {
    "newWardId": "11105119",
    "newWardName": "Kim Thanh",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tân Tựu",
      "Xã Hoàng Tây"
    ]
  },
  {
    "newWardId": "11715028",
    "newWardName": "Lai Thành",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14671",
      "14668",
      "14674"
    ],
    "oldWardNames": [
      "Xã Yên Lộc",
      "Xã Tân Thành",
      "Xã Lai Thành"
    ]
  },
  {
    "newWardId": "11105116",
    "newWardName": "Lê Hồ",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Đại Cương",
      "Phường Đồng Hoá",
      "Phường Lê Hồ"
    ]
  },
  {
    "newWardId": "11109037",
    "newWardName": "Liêm Hà",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Liêm Phong",
      "Xã Liêm Cần",
      "Xã Thanh Hà"
    ]
  },
  {
    "newWardId": "11101110",
    "newWardName": "Liêm Tuyền",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tân Liêm",
      "Xã Đinh Xá",
      "Xã Trịnh Xá"
    ]
  },
  {
    "newWardId": "11303057",
    "newWardName": "Liên Minh",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vĩnh Hào",
      "Xã Đại Thắng",
      "Xã Liên Minh"
    ]
  },
  {
    "newWardId": "11107042",
    "newWardName": "Lý Nhân",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Chính Lý",
      "Xã Hợp Lý",
      "Xã Văn Lý"
    ]
  },
  {
    "newWardId": "11105118",
    "newWardName": "Lý Thường Kiệt",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14473",
      "14434"
    ],
    "oldWardNames": [
      "Xã Liên Sơn",
      "Xã Thanh Sơn",
      "Phường Thi Sơn"
    ]
  },
  {
    "newWardId": "11303054",
    "newWardName": "Minh Tân",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Cộng Hòa",
      "Xã Minh Tân"
    ]
  },
  {
    "newWardId": "11311070",
    "newWardName": "Minh Thái",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trực Đại",
      "Xã Trực Thái",
      "Xã Trực Thắng"
    ]
  },
  {
    "newWardId": "11301129",
    "newWardName": "Mỹ Lộc",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Hưng Lộc",
      "Xã Mỹ Thuận",
      "Xã Mỹ Lộc"
    ]
  },
  {
    "newWardId": "11301122",
    "newWardName": "Nam Định",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Quang Trung",
      "Phường Vị Xuyên",
      "Phường Lộc Vượng",
      "Phường Cửa Bắc",
      "Phường Trần Hưng Đạo",
      "Phường Năng Tĩnh",
      "Phường Cửa Nam",
      "Xã Mỹ Phúc"
    ]
  },
  {
    "newWardId": "11309051",
    "newWardName": "Nam Đồng",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đồng Sơn",
      "Xã Nam Thái"
    ]
  },
  {
    "newWardId": "11709100",
    "newWardName": "Nam Hoa Lư",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14359",
      "14356",
      "14554",
      "14557",
      "14551"
    ],
    "oldWardNames": [
      "Phường Ninh Phong",
      "Phường Ninh Sơn",
      "Xã Ninh Vân",
      "Xã Ninh An",
      "Xã Ninh Hải"
    ]
  },
  {
    "newWardId": "11309053",
    "newWardName": "Nam Hồng",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Thịnh",
      "Xã Nam Thắng",
      "Xã Nam Hồng"
    ]
  },
  {
    "newWardId": "11107048",
    "newWardName": "Nam Lý",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14506"
    ],
    "oldWardNames": [
      "Xã Tiến Thắng",
      "Xã Phú Phúc",
      "Xã Hòa Hậu"
    ]
  },
  {
    "newWardId": "11309050",
    "newWardName": "Nam Minh",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nam Dương",
      "Xã Bình Minh",
      "Xã Nam Tiến"
    ]
  },
  {
    "newWardId": "11309052",
    "newWardName": "Nam Ninh",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nam Hoa",
      "Xã Nam Lợi",
      "Xã Nam Hải",
      "Xã Nam Thanh"
    ]
  },
  {
    "newWardId": "11309049",
    "newWardName": "Nam Trực",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Nam Giang",
      "Xã Nam Cường",
      "Xã Nam Hùng"
    ]
  },
  {
    "newWardId": "11107043",
    "newWardName": "Nam Xang",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Công Lý",
      "Xã Nguyên Lý",
      "Xã Đức Lý"
    ]
  },
  {
    "newWardId": "11317092",
    "newWardName": "Nghĩa Hưng",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Liễu Đề",
      "Xã Nghĩa Thái",
      "Xã Nghĩa Châu",
      "Xã Nghĩa Trung"
    ]
  },
  {
    "newWardId": "11317096",
    "newWardName": "Nghĩa Lâm",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nghĩa Hùng",
      "Xã Nghĩa Hải",
      "Xã Nghĩa Lâm"
    ]
  },
  {
    "newWardId": "11317093",
    "newWardName": "Nghĩa Sơn",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nghĩa Lạc",
      "Xã Nghĩa Sơn"
    ]
  },
  {
    "newWardId": "11105117",
    "newWardName": "Nguyễn Úy",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tượng Lĩnh",
      "Phường Tân Sơn",
      "Xã Nguyễn Úy"
    ]
  },
  {
    "newWardId": "11107047",
    "newWardName": "Nhân Hà",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nhân Thịnh",
      "Xã Nhân Mỹ",
      "Xã Xuân Khê"
    ]
  },
  {
    "newWardId": "11705007",
    "newWardName": "Nho Quan",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14428",
      "14416",
      "14419"
    ],
    "oldWardNames": [
      "Thị trấn Nho Quan",
      "Xã Đồng Phong",
      "Xã Yên Quang"
    ]
  },
  {
    "newWardId": "11311071",
    "newWardName": "Ninh Cường",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Ninh Cường",
      "Xã Trực Cường",
      "Xã Trực Hùng"
    ]
  },
  {
    "newWardId": "11311066",
    "newWardName": "Ninh Giang",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trực Chính",
      "Xã Phương Định",
      "Xã Liêm Hải"
    ]
  },
  {
    "newWardId": "11715027",
    "newWardName": "Phát Diệm",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14620",
      "14662",
      "14659"
    ],
    "oldWardNames": [
      "Thị trấn Phát Diệm",
      "Xã Thượng Kiệm",
      "Xã Kim Chính"
    ]
  },
  {
    "newWardId": "11307064",
    "newWardName": "Phong Doanh",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phú Hưng",
      "Xã Yên Thọ",
      "Xã Yên Chính"
    ]
  },
  {
    "newWardId": "11705012",
    "newWardName": "Phú Long",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14449",
      "14458"
    ],
    "oldWardNames": [
      "Xã Kỳ Phú",
      "Xã Phú Long"
    ]
  },
  {
    "newWardId": "11101107",
    "newWardName": "Phủ Lý",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Châu Cầu",
      "Phường Thanh Châu",
      "Phường Liêm Chính",
      "Phường Quang Trung"
    ]
  },
  {
    "newWardId": "11705010",
    "newWardName": "Phú Sơn",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14395",
      "14413",
      "14407"
    ],
    "oldWardNames": [
      "Xã Thạch Bình",
      "Xã Lạc Vân",
      "Xã Phú Sơn"
    ]
  },
  {
    "newWardId": "11101108",
    "newWardName": "Phù Vân",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Lê Hồng Phong",
      "Xã Kim Bình",
      "Xã Phù Vân"
    ]
  },
  {
    "newWardId": "11311069",
    "newWardName": "Quang Hưng",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trực Khang",
      "Xã Trực Mỹ",
      "Xã Trực Thuận"
    ]
  },
  {
    "newWardId": "11715026",
    "newWardName": "Quang Thiện",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14650",
      "14656",
      "14647"
    ],
    "oldWardNames": [
      "Xã Như Hòa",
      "Xã Đồng Hướng",
      "Xã Quang Thiện"
    ]
  },
  {
    "newWardId": "11317095",
    "newWardName": "Quỹ Nhất",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Quỹ Nhất",
      "Xã Nghĩa Thành",
      "Xã Nghĩa Lợi"
    ]
  },
  {
    "newWardId": "11705014",
    "newWardName": "Quỳnh Lưu",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14446",
      "14452"
    ],
    "oldWardNames": [
      "Xã Phú Lộc",
      "Xã Quỳnh Lưu"
    ]
  },
  {
    "newWardId": "11317097",
    "newWardName": "Rạng Đông",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nam Điền",
      "Xã Phúc Thắng",
      "Thị trấn Rạng Đông"
    ]
  },
  {
    "newWardId": "11105120",
    "newWardName": "Tam Chúc",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Ba Sao",
      "Xã Khả Phong",
      "Xã Thuỵ Lôi"
    ]
  },
  {
    "newWardId": "11703102",
    "newWardName": "Tam Điệp",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14362",
      "14369",
      "14377"
    ],
    "oldWardNames": [
      "Phường Bắc Sơn",
      "Phường Tây Sơn",
      "Xã Quang Sơn"
    ]
  },
  {
    "newWardId": "11307063",
    "newWardName": "Tân Minh",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trung Nghĩa",
      "Xã Tân Minh"
    ]
  },
  {
    "newWardId": "11109038",
    "newWardName": "Tân Thanh",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Tân Thanh",
      "Xã Thanh Thủy",
      "Xã Thanh Phong"
    ]
  },
  {
    "newWardId": "11709098",
    "newWardName": "Tây Hoa Lư",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14530",
      "14533",
      "14542",
      "14437",
      "14521",
      "14503"
    ],
    "oldWardNames": [
      "Phường Ninh Giang",
      "Xã Trường Yên",
      "Xã Ninh Hòa",
      "Xã Phúc Sơn",
      "Xã Gia Sinh",
      "Xã Gia Tân"
    ]
  },
  {
    "newWardId": "11109039",
    "newWardName": "Thanh Bình",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Liêm Sơn",
      "Xã Liêm Thuận",
      "Xã Liêm Túc"
    ]
  },
  {
    "newWardId": "11109040",
    "newWardName": "Thanh Lâm",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thanh Nghị",
      "Xã Thanh Tân",
      "Xã Thanh Hải"
    ]
  },
  {
    "newWardId": "11109041",
    "newWardName": "Thanh Liêm",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thanh Hương",
      "Xã Thanh Tâm",
      "Xã Thanh Nguyên"
    ]
  },
  {
    "newWardId": "11301126",
    "newWardName": "Thành Nam",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Mỹ Xá",
      "Xã Đại An"
    ]
  },
  {
    "newWardId": "11705013",
    "newWardName": "Thanh Sơn",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14434",
      "14425",
      "14443"
    ],
    "oldWardNames": [
      "Xã Thanh Sơn",
      "Xã Thượng Hòa",
      "Xã Văn Phú"
    ]
  },
  {
    "newWardId": "11301123",
    "newWardName": "Thiên Trường",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Lộc Hạ",
      "Xã Mỹ Tân",
      "Xã Mỹ Trung"
    ]
  },
  {
    "newWardId": "11103115",
    "newWardName": "Tiên Sơn",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tiên Sơn",
      "Phường Tiên Nội",
      "Xã Tiên Ngoại"
    ]
  },
  {
    "newWardId": "11107046",
    "newWardName": "Trần Thương",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trần Hưng Đạo",
      "Xã Nhân Nghĩa",
      "Xã Nhân Bình"
    ]
  },
  {
    "newWardId": "11703104",
    "newWardName": "Trung Sơn",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14368",
      "14365",
      "14380"
    ],
    "oldWardNames": [
      "Phường Nam Sơn",
      "Phường Trung Sơn",
      "Xã Đông Sơn"
    ]
  },
  {
    "newWardId": "11311068",
    "newWardName": "Trực Ninh",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trực Thanh",
      "Xã Trực Nội",
      "Xã Trực Hưng"
    ]
  },
  {
    "newWardId": "11301127",
    "newWardName": "Trường Thi",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Trường Thi",
      "Xã Thành Lợi"
    ]
  },
  {
    "newWardId": "11307061",
    "newWardName": "Vạn Thắng",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14725"
    ],
    "oldWardNames": [
      "Xã Yên Thắng",
      "Xã Yên Tiến",
      "Xã Yên Lương"
    ]
  },
  {
    "newWardId": "11301125",
    "newWardName": "Vị Khê",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nam Điền",
      "Phường Nam Phong"
    ]
  },
  {
    "newWardId": "11107045",
    "newWardName": "Vĩnh Trụ",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Vĩnh Trụ",
      "Xã Nhân Chính",
      "Xã Nhân Khang"
    ]
  },
  {
    "newWardId": "11303056",
    "newWardName": "Vụ Bản",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Gôi",
      "Xã Kim Thái",
      "Xã Tam Thanh"
    ]
  },
  {
    "newWardId": "11307062",
    "newWardName": "Vũ Dương",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14740"
    ],
    "oldWardNames": [
      "Xã Yên Mỹ",
      "Xã Yên Bình",
      "Xã Yên Dương",
      "Xã Yên Ninh"
    ]
  },
  {
    "newWardId": "11313074",
    "newWardName": "Xuân Giang",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Xuân Tân",
      "Xã Xuân Phú",
      "Xã Xuân Giang"
    ]
  },
  {
    "newWardId": "11313075",
    "newWardName": "Xuân Hồng",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Xuân Châu",
      "Xã Xuân Thành",
      "Xã Xuân Thượng",
      "Xã Xuân Hồng"
    ]
  },
  {
    "newWardId": "11313073",
    "newWardName": "Xuân Hưng",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Xuân Vinh",
      "Xã Trà Lũ",
      "Xã Thọ Nghiệp"
    ]
  },
  {
    "newWardId": "11313072",
    "newWardName": "Xuân Trường",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Xuân Trường",
      "Xã Xuân Phúc",
      "Xã Xuân Ninh",
      "Xã Xuân Ngọc"
    ]
  },
  {
    "newWardId": "11307058",
    "newWardName": "Ý Yên",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14719"
    ],
    "oldWardNames": [
      "Xã Yên Phong",
      "Xã Hồng Quang",
      "Xã Yên Khánh",
      "Thị trấn Lâm"
    ]
  },
  {
    "newWardId": "11307060",
    "newWardName": "Yên Cường",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14737",
      "14671"
    ],
    "oldWardNames": [
      "Xã Yên Nhân",
      "Xã Yên Lộc",
      "Xã Yên Phúc",
      "Xã Yên Cường"
    ]
  },
  {
    "newWardId": "11307059",
    "newWardName": "Yên Đồng",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14746"
    ],
    "oldWardNames": [
      "Xã Yên Đồng",
      "Xã Yên Trị",
      "Xã Yên Khang"
    ]
  },
  {
    "newWardId": "11713015",
    "newWardName": "Yên Khánh",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14560",
      "14581",
      "14596",
      "14587"
    ],
    "oldWardNames": [
      "Thị trấn Yên Ninh",
      "Xã Khánh Cư",
      "Xã Khánh Vân",
      "Xã Khánh Hải"
    ]
  },
  {
    "newWardId": "11711022",
    "newWardName": "Yên Mạc",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14740",
      "14752",
      "14743"
    ],
    "oldWardNames": [
      "Xã Yên Mỹ",
      "Xã Yên Lâm",
      "Xã Yên Mạc"
    ]
  },
  {
    "newWardId": "11711020",
    "newWardName": "Yên Mô",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14701",
      "14707",
      "14722"
    ],
    "oldWardNames": [
      "Thị trấn Yên Thịnh",
      "Xã Khánh Dương",
      "Xã Yên Hòa"
    ]
  },
  {
    "newWardId": "11703103",
    "newWardName": "Yên Sơn",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14375",
      "14461",
      "14371"
    ],
    "oldWardNames": [
      "Phường Tân Bình",
      "Xã Quảng Lạc",
      "Xã Yên Sơn"
    ]
  },
  {
    "newWardId": "11703105",
    "newWardName": "Yên Thắng",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14725",
      "14704",
      "14374"
    ],
    "oldWardNames": [
      "Xã Yên Thắng",
      "Xã Khánh Thượng",
      "Phường Yên Bình"
    ]
  },
  {
    "newWardId": "11711021",
    "newWardName": "Yên Từ",
    "provinceId": "17",
    "provinceName": "Ninh Bình",
    "oldWardIds": [
      "14719",
      "14737",
      "14728"
    ],
    "oldWardNames": [
      "Xã Yên Phong",
      "Xã Yên Nhân",
      "Xã Yên Từ"
    ]
  },
  {
    "newWardId": "30517126",
    "newWardName": "An Bình",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hưng Thi",
      "Xã Thống Nhất",
      "Xã An Bình"
    ]
  },
  {
    "newWardId": "30517127",
    "newWardName": "An Nghĩa",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Ba Hàng Đồi",
      "Xã Phú Nghĩa",
      "Xã Phú Thành"
    ]
  },
  {
    "newWardId": "21703012",
    "newWardName": "Âu Cơ",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "7966",
      "7948",
      "7960"
    ],
    "oldWardNames": [
      "Phường Thanh Vinh",
      "Phường Âu Cơ",
      "Xã Thanh Minh"
    ]
  },
  {
    "newWardId": "21721009",
    "newWardName": "Bản Nguyên",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8527",
      "8533",
      "8539"
    ],
    "oldWardNames": [
      "Xã Cao Xá",
      "Xã Vĩnh Lại",
      "Xã Bản Nguyên"
    ]
  },
  {
    "newWardId": "30505132",
    "newWardName": "Bao La",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Mai Hịch",
      "Xã Xăm Khòe",
      "Xã Bao La"
    ]
  },
  {
    "newWardId": "21705028",
    "newWardName": "Bằng Luân",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "7996",
      "8005",
      "7981"
    ],
    "oldWardNames": [
      "Xã Bằng Doãn",
      "Xã Phúc Lai",
      "Xã Bằng Luân"
    ]
  },
  {
    "newWardId": "21913095",
    "newWardName": "Bình Nguyên",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Hương Canh",
      "Xã Tam Hợp",
      "Xã Quất Lưu",
      "Xã Sơn Lôi"
    ]
  },
  {
    "newWardId": "21711017",
    "newWardName": "Bình Phú",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8263",
      "8272",
      "8275"
    ],
    "oldWardNames": [
      "Xã Tiên Du",
      "Xã An Đạo",
      "Xã Bình Phú"
    ]
  },
  {
    "newWardId": "21913098",
    "newWardName": "Bình Tuyền",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Bá Hiến",
      "Xã Trung Mỹ"
    ]
  },
  {
    "newWardId": "21913097",
    "newWardName": "Bình Xuyên",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Gia Khánh",
      "Xã Hương Sơn",
      "Xã Thiện Kế"
    ]
  },
  {
    "newWardId": "30509129",
    "newWardName": "Cao Dương",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thanh Cao",
      "Xã Thanh Sơn",
      "Xã Cao Dương"
    ]
  },
  {
    "newWardId": "30510103",
    "newWardName": "Cao Phong",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Cao Phong",
      "Xã Hợp Phong",
      "Xã Thu Phong"
    ]
  },
  {
    "newWardId": "30503107",
    "newWardName": "Cao Sơn",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8629"
    ],
    "oldWardNames": [
      "Xã Tân Minh",
      "Xã Cao Sơn"
    ]
  },
  {
    "newWardId": "21713035",
    "newWardName": "Cẩm Khê",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8341",
      "8353",
      "8389"
    ],
    "oldWardNames": [
      "Thị trấn Cẩm Khê",
      "Xã Minh Tân",
      "Xã Phong Thịnh"
    ]
  },
  {
    "newWardId": "21705026",
    "newWardName": "Chân Mộng",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8035",
      "8038",
      "8044"
    ],
    "oldWardNames": [
      "Xã Hùng Long",
      "Xã Yên Kiện",
      "Xã Chân Mộng"
    ]
  },
  {
    "newWardId": "21705027",
    "newWardName": "Chí Đám",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "7975",
      "7999"
    ],
    "oldWardNames": [
      "Xã Hùng Xuyên",
      "Xã Chí Đám"
    ]
  },
  {
    "newWardId": "21709022",
    "newWardName": "Chí Tiên",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8215",
      "8218",
      "8206"
    ],
    "oldWardNames": [
      "Xã Sơn Cương",
      "Xã Thanh Hà",
      "Xã Chí Tiên"
    ]
  },
  {
    "newWardId": "21719051",
    "newWardName": "Cự Đồng",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8605",
      "8623",
      "8614"
    ],
    "oldWardNames": [
      "Xã Tất Thắng",
      "Xã Thắng Sơn",
      "Xã Cự Đồng"
    ]
  },
  {
    "newWardId": "21711014",
    "newWardName": "Dân Chủ",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8254",
      "8242",
      "8251",
      "8260"
    ],
    "oldWardNames": [
      "Xã Bảo Thanh",
      "Xã Trị Quận",
      "Xã Hạ Giáp",
      "Xã Gia Thanh"
    ]
  },
  {
    "newWardId": "30511114",
    "newWardName": "Dũng Tiến",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Cuối Hạ",
      "Xã Mỵ Hòa",
      "Xã Nuông Dăm"
    ]
  },
  {
    "newWardId": "30503106",
    "newWardName": "Đà Bắc",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8080"
    ],
    "oldWardNames": [
      "Thị trấn Đà Bắc",
      "Xã Hiền Lương",
      "Xã Toàn Sơn",
      "Xã Tú Lý"
    ]
  },
  {
    "newWardId": "21904078",
    "newWardName": "Đại Đình",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Đại Đình",
      "Xã Bồ Lý"
    ]
  },
  {
    "newWardId": "30515119",
    "newWardName": "Đại Đồng",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ân Nghĩa",
      "Xã Tân Mỹ",
      "Xã Yên Nghiệp"
    ]
  },
  {
    "newWardId": "21707030",
    "newWardName": "Đan Thượng",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8071",
      "8056",
      "8065",
      "8062"
    ],
    "oldWardNames": [
      "Xã Tứ Hiệp",
      "Xã Đại Phạm",
      "Xã Hà Lương",
      "Xã Đan Thượng"
    ]
  },
  {
    "newWardId": "21904079",
    "newWardName": "Đạo Trù",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Yên Dương",
      "Xã Đạo Trù"
    ]
  },
  {
    "newWardId": "21723046",
    "newWardName": "Đào Xá",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8668",
      "8665",
      "8671",
      "8662"
    ],
    "oldWardNames": [
      "Xã Xuân Lộc",
      "Xã Thạch Đồng",
      "Xã Tân Phương",
      "Xã Đào Xá"
    ]
  },
  {
    "newWardId": "21705024",
    "newWardName": "Đoan Hùng",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "7969",
      "8014",
      "8008"
    ],
    "oldWardNames": [
      "Thị trấn Đoan Hùng",
      "Xã Hợp Nhất",
      "Xã Ngọc Quan"
    ]
  },
  {
    "newWardId": "21713038",
    "newWardName": "Đồng Lương",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8428",
      "8422",
      "8431"
    ],
    "oldWardNames": [
      "Xã Điêu Lương",
      "Xã Yên Dưỡng",
      "Xã Đồng Lương"
    ]
  },
  {
    "newWardId": "21709021",
    "newWardName": "Đông Thành",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8197",
      "8194",
      "8209"
    ],
    "oldWardNames": [
      "Xã Khải Xuân",
      "Xã Võ Lao",
      "Xã Đông Thành"
    ]
  },
  {
    "newWardId": "30503108",
    "newWardName": "Đức Nhàn",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Mường Chiềng",
      "Xã Nánh Nghê"
    ]
  },
  {
    "newWardId": "21707029",
    "newWardName": "Hạ Hòa",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8119",
      "8095",
      "8092"
    ],
    "oldWardNames": [
      "Thị trấn Hạ Hòa",
      "Xã Minh Hạc",
      "Xã Ấm Hạ",
      "Xã Gia Điền"
    ]
  },
  {
    "newWardId": "21915069",
    "newWardName": "Hải Lựu",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nhân Đạo",
      "Xã Đôn Nhân",
      "Xã Phương Khoan",
      "Xã Hải Lựu"
    ]
  },
  {
    "newWardId": "21707034",
    "newWardName": "Hiền Lương",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8080",
      "8110"
    ],
    "oldWardNames": [
      "Xã Hiền Lương",
      "Xã Xuân Áng"
    ]
  },
  {
    "newWardId": "21717044",
    "newWardName": "Hiền Quan",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8446",
      "8443",
      "8440"
    ],
    "oldWardNames": [
      "Xã Thanh Uyên",
      "Xã Bắc Sơn",
      "Xã Hiền Quan"
    ]
  },
  {
    "newWardId": "30501145",
    "newWardName": "Hòa Bình",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Đồng Tiến",
      "Phường Hữu Nghị",
      "Phường Phương Lâm",
      "Phường Quỳnh Lâm",
      "Phường Tân Thịnh",
      "Phường Thịnh Lang",
      "Phường Trung Minh"
    ]
  },
  {
    "newWardId": "21905082",
    "newWardName": "Hoàng An",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hoàng Đan",
      "Xã Hoàng Lâu",
      "Xã An Hòa"
    ]
  },
  {
    "newWardId": "21709020",
    "newWardName": "Hoàng Cương",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8179",
      "8200",
      "8203"
    ],
    "oldWardNames": [
      "Xã Ninh Dân",
      "Xã Mạn Lạn",
      "Xã Hoàng Cương"
    ]
  },
  {
    "newWardId": "21905081",
    "newWardName": "Hội Thịnh",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Duy Phiên",
      "Xã Thanh Vân",
      "Xã Hội Thịnh"
    ]
  },
  {
    "newWardId": "30511115",
    "newWardName": "Hợp Kim",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Kim Lập",
      "Xã Nam Thượng",
      "Xã Sào Báy"
    ]
  },
  {
    "newWardId": "21903075",
    "newWardName": "Hợp Lý",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ngọc Mỹ",
      "Xã Quang Sơn",
      "Xã Hợp Lý"
    ]
  },
  {
    "newWardId": "21713037",
    "newWardName": "Hùng Việt",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8413",
      "8416"
    ],
    "oldWardNames": [
      "Xã Nhật Tiến",
      "Xã Hùng Việt"
    ]
  },
  {
    "newWardId": "21719052",
    "newWardName": "Hương Cần",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8647",
      "8644",
      "8632"
    ],
    "oldWardNames": [
      "Xã Yên Lương",
      "Xã Yên Lãng",
      "Xã Hương Cần"
    ]
  },
  {
    "newWardId": "21701005",
    "newWardName": "Hy Cương",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8515",
      "8506",
      "8503"
    ],
    "oldWardNames": [
      "Xã Thanh Đình",
      "Xã Chu Hóa",
      "Xã Hy Cương"
    ]
  },
  {
    "newWardId": "21719054",
    "newWardName": "Khả Cửu",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8638",
      "8650",
      "8635"
    ],
    "oldWardNames": [
      "Xã Đông Cửu",
      "Xã Thượng Cửu",
      "Xã Khả Cửu"
    ]
  },
  {
    "newWardId": "30511112",
    "newWardName": "Kim Bôi",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Bo",
      "Xã Vĩnh Đồng",
      "Xã Kim Bôi"
    ]
  },
  {
    "newWardId": "30501146",
    "newWardName": "Kỳ Sơn",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Kỳ Sơn",
      "Xã Độc Lập",
      "Xã Mông Hóa"
    ]
  },
  {
    "newWardId": "30519142",
    "newWardName": "Lạc Lương",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bảo Hiệu",
      "Xã Đa Phúc",
      "Xã Lạc Sỹ",
      "Xã Lạc Lương"
    ]
  },
  {
    "newWardId": "30515117",
    "newWardName": "Lạc Sơn",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Vụ Bản",
      "Xã Hương Nhượng",
      "Xã Vũ Bình"
    ]
  },
  {
    "newWardId": "30517125",
    "newWardName": "Lạc Thủy",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Chi Nê",
      "Xã Đồng Tâm",
      "Xã Khoan Dụ",
      "Xã Yên Bồng"
    ]
  },
  {
    "newWardId": "21720057",
    "newWardName": "Lai Đồng",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8554",
      "8578",
      "8557",
      "8560"
    ],
    "oldWardNames": [
      "Xã Kiệt Sơn",
      "Xã Tân Sơn",
      "Xã Đồng Sơn",
      "Xã Lai Đồng"
    ]
  },
  {
    "newWardId": "21721006",
    "newWardName": "Lâm Thao",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8498",
      "8494",
      "8512"
    ],
    "oldWardNames": [
      "Thị trấn Hùng Sơn",
      "Thị trấn Lâm Thao",
      "Xã Thạch Sơn"
    ]
  },
  {
    "newWardId": "21903071",
    "newWardName": "Lập Thạch",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Lập Thạch",
      "Xã Xuân Hòa",
      "Xã Tử Du",
      "Xã Vân Trục"
    ]
  },
  {
    "newWardId": "21909092",
    "newWardName": "Liên Châu",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đại Tự",
      "Xã Hồng Châu",
      "Xã Liên Châu"
    ]
  },
  {
    "newWardId": "21903074",
    "newWardName": "Liên Hòa",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Hoa Sơn",
      "Xã Bàn Giản",
      "Xã Liên Hòa"
    ]
  },
  {
    "newWardId": "21709023",
    "newWardName": "Liên Minh",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8221",
      "8224",
      "8227"
    ],
    "oldWardNames": [
      "Xã Đỗ Sơn",
      "Xã Đỗ Xuyên",
      "Xã Lương Lỗ"
    ]
  },
  {
    "newWardId": "30509130",
    "newWardName": "Liên Sơn",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Cư Yên",
      "Xã Liên Sơn",
      "Xã Cao Sơn"
    ]
  },
  {
    "newWardId": "21720060",
    "newWardName": "Long Cốc",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8620",
      "8626",
      "8608"
    ],
    "oldWardNames": [
      "Xã Tam Thanh",
      "Xã Vinh Tiền",
      "Xã Long Cốc"
    ]
  },
  {
    "newWardId": "30509128",
    "newWardName": "Lương Sơn",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Lương Sơn",
      "Xã Hòa Sơn",
      "Xã Lâm Sơn",
      "Xã Nhuận Trạch",
      "Xã Tân Vinh",
      "Xã Cao Sơn"
    ]
  },
  {
    "newWardId": "30505131",
    "newWardName": "Mai Châu",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Mai Châu",
      "Xã Nà Phòn",
      "Xã Thành Sơn",
      "Xã Tòng Đậu",
      "Xã Đồng Tân"
    ]
  },
  {
    "newWardId": "30505133",
    "newWardName": "Mai Hạ",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Chiềng Châu",
      "Xã Vạn Mai",
      "Xã Mai Hạ"
    ]
  },
  {
    "newWardId": "21720056",
    "newWardName": "Minh Đài",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8569",
      "8596",
      "8593"
    ],
    "oldWardNames": [
      "Xã Mỹ Thuận",
      "Xã Văn Luông",
      "Xã Minh Đài"
    ]
  },
  {
    "newWardId": "21715065",
    "newWardName": "Minh Hòa",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8335",
      "8338",
      "8332"
    ],
    "oldWardNames": [
      "Xã Ngọc Lập",
      "Xã Ngọc Đồng",
      "Xã Minh Hòa"
    ]
  },
  {
    "newWardId": "30513137",
    "newWardName": "Mường Bi",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Mỹ Hòa",
      "Xã Phong Phú",
      "Xã Phú Cường"
    ]
  },
  {
    "newWardId": "30511113",
    "newWardName": "Mường Động",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đông Bắc",
      "Xã Hợp Tiến",
      "Xã Tú Sơn",
      "Xã Vĩnh Tiến"
    ]
  },
  {
    "newWardId": "30513138",
    "newWardName": "Mường Hoa",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phú Vinh",
      "Xã Suối Hoa"
    ]
  },
  {
    "newWardId": "30510104",
    "newWardName": "Mường Thàng",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Dũng Phong",
      "Xã Nam Phong",
      "Xã Tây Phong",
      "Xã Thạch Yên"
    ]
  },
  {
    "newWardId": "30515118",
    "newWardName": "Mường Vang",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8641"
    ],
    "oldWardNames": [
      "Xã Tân Lập",
      "Xã Quý Hòa",
      "Xã Tuân Đạo"
    ]
  },
  {
    "newWardId": "30511116",
    "newWardName": "Nật Sơn",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8308"
    ],
    "oldWardNames": [
      "Xã Xuân Thủy",
      "Xã Bình Sơn",
      "Xã Đú Sáng",
      "Xã Hùng Sơn"
    ]
  },
  {
    "newWardId": "30515120",
    "newWardName": "Ngọc Sơn",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ngọc Lâu",
      "Xã Tự Do",
      "Xã Ngọc Sơn"
    ]
  },
  {
    "newWardId": "21909094",
    "newWardName": "Nguyệt Đức",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Văn Tiến",
      "Xã Trung Kiên",
      "Xã Trung Hà",
      "Xã Nguyệt Đức"
    ]
  },
  {
    "newWardId": "30515121",
    "newWardName": "Nhân Nghĩa",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Mỹ Thành",
      "Xã Văn Nghĩa",
      "Xã Nhân Nghĩa"
    ]
  },
  {
    "newWardId": "21701002",
    "newWardName": "Nông Trang",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "7927",
      "7894",
      "7924"
    ],
    "oldWardNames": [
      "Phường Minh Phương",
      "Phường Nông Trang",
      "Xã Thụy Vân"
    ]
  },
  {
    "newWardId": "30505134",
    "newWardName": "Pà Cò",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Cun Pheo",
      "Xã Hang Kia",
      "Xã Pà Cò",
      "Xã Đồng Tân"
    ]
  },
  {
    "newWardId": "21703010",
    "newWardName": "Phong Châu",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "7945",
      "7954",
      "7963"
    ],
    "oldWardNames": [
      "Phường Phong Châu",
      "Xã Phú Hộ",
      "Xã Hà Thạch"
    ]
  },
  {
    "newWardId": "21713036",
    "newWardName": "Phú Khê",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8401",
      "8398"
    ],
    "oldWardNames": [
      "Xã Hương Lung",
      "Xã Phú Khê"
    ]
  },
  {
    "newWardId": "21711015",
    "newWardName": "Phú Mỹ",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8236",
      "8234",
      "8233"
    ],
    "oldWardNames": [
      "Xã Liên Hoa",
      "Xã Lệ Mỹ",
      "Xã Phú Mỹ"
    ]
  },
  {
    "newWardId": "21711013",
    "newWardName": "Phù Ninh",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8230",
      "8266",
      "8257",
      "8278"
    ],
    "oldWardNames": [
      "Thị trấn Phong Châu",
      "Xã Phú Nham",
      "Xã Phú Lộc",
      "Xã Phù Ninh"
    ]
  },
  {
    "newWardId": "21703011",
    "newWardName": "Phú Thọ",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "7942",
      "7957",
      "7951"
    ],
    "oldWardNames": [
      "Phường Hùng Vương",
      "Xã Văn Lung",
      "Xã Hà Lộc"
    ]
  },
  {
    "newWardId": "21902101",
    "newWardName": "Phúc Yên",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "7942"
    ],
    "oldWardNames": [
      "Phường Hùng Vương",
      "Phường Hai Bà Trưng",
      "Phường Phúc Thắng",
      "Phường Tiền Châu",
      "Phường Nam Viêm"
    ]
  },
  {
    "newWardId": "21721008",
    "newWardName": "Phùng Nguyên",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8536",
      "8518",
      "8521"
    ],
    "oldWardNames": [
      "Xã Tứ Xã",
      "Xã Sơn Vi",
      "Xã Phùng Nguyên"
    ]
  },
  {
    "newWardId": "21709019",
    "newWardName": "Quảng Yên",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8161",
      "8158",
      "8173"
    ],
    "oldWardNames": [
      "Xã Đại An",
      "Xã Đông Lĩnh",
      "Xã Quảng Yên"
    ]
  },
  {
    "newWardId": "30503109",
    "newWardName": "Quy Đức",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đoàn Kết",
      "Xã Đồng Ruộng",
      "Xã Trung Thành",
      "Xã Yên Hòa"
    ]
  },
  {
    "newWardId": "30515122",
    "newWardName": "Quyết Thắng",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Chí Đạo",
      "Xã Định Cư",
      "Xã Quyết Thắng"
    ]
  },
  {
    "newWardId": "21915068",
    "newWardName": "Sông Lô",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8326"
    ],
    "oldWardNames": [
      "Xã Đồng Thịnh",
      "Xã Tứ Yên",
      "Xã Đức Bác",
      "Xã Yên Thạch"
    ]
  },
  {
    "newWardId": "21903076",
    "newWardName": "Sơn Đông",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tây Sơn",
      "Xã Cao Phong",
      "Xã Sơn Đông"
    ]
  },
  {
    "newWardId": "21715063",
    "newWardName": "Sơn Lương",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8296",
      "8293",
      "8299"
    ],
    "oldWardNames": [
      "Xã Mỹ Lương",
      "Xã Mỹ Lung",
      "Xã Lương Sơn"
    ]
  },
  {
    "newWardId": "21905080",
    "newWardName": "Tam Dương",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Hợp Hòa",
      "Thị trấn Kim Long",
      "Xã Hướng Đạo",
      "Xã Đạo Tú"
    ]
  },
  {
    "newWardId": "21905083",
    "newWardName": "Tam Dương Bắc",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đồng Tĩnh",
      "Xã Hoàng Hoa",
      "Xã Tam Quan"
    ]
  },
  {
    "newWardId": "21904077",
    "newWardName": "Tam Đảo",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Hợp Châu",
      "Thị trấn Tam Đảo",
      "Xã Hồ Sơn",
      "Xã Minh Quang"
    ]
  },
  {
    "newWardId": "21909093",
    "newWardName": "Tam Hồng",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Tam Hồng",
      "Xã Yên Phương",
      "Xã Yên Đồng"
    ]
  },
  {
    "newWardId": "21717041",
    "newWardName": "Tam Nông",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8491",
      "8473"
    ],
    "oldWardNames": [
      "Thị trấn Hưng Hóa",
      "Xã Dân Quyền",
      "Xã Hương Nộn"
    ]
  },
  {
    "newWardId": "21915067",
    "newWardName": "Tam Sơn",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8641"
    ],
    "oldWardNames": [
      "Xã Tân Lập",
      "Xã Đồng Quế",
      "Thị trấn Tam Sơn"
    ]
  },
  {
    "newWardId": "30501147",
    "newWardName": "Tân Hòa",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tân Hòa",
      "Xã Hòa Bình",
      "Xã Yên Mông"
    ]
  },
  {
    "newWardId": "30513136",
    "newWardName": "Tân Lạc",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Mãn Đức",
      "Xã Ngọc Mỹ",
      "Xã Đông Lai",
      "Xã Thanh Hối",
      "Xã Tử Nê"
    ]
  },
  {
    "newWardId": "30505135",
    "newWardName": "Tân Mai",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8677"
    ],
    "oldWardNames": [
      "Xã Sơn Thủy",
      "Xã Tân Thành"
    ]
  },
  {
    "newWardId": "30503110",
    "newWardName": "Tân Pheo",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đồng Chum",
      "Xã Giáp Đắt",
      "Xã Tân Pheo"
    ]
  },
  {
    "newWardId": "21720055",
    "newWardName": "Tân Sơn",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8566",
      "8551",
      "8548"
    ],
    "oldWardNames": [
      "Thị trấn Tân Phú",
      "Xã Thu Ngạc",
      "Xã Thạch Kiệt"
    ]
  },
  {
    "newWardId": "21705025",
    "newWardName": "Tây Cốc",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "7987",
      "8050",
      "8023"
    ],
    "oldWardNames": [
      "Xã Phú Lâm",
      "Xã Ca Đình",
      "Xã Tây Cốc"
    ]
  },
  {
    "newWardId": "21909091",
    "newWardName": "Tề Lỗ",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đồng Văn",
      "Xã Trung Nguyên",
      "Xã Tề Lỗ"
    ]
  },
  {
    "newWardId": "21903073",
    "newWardName": "Thái Hòa",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bắc Bình",
      "Xã Liễn Sơn",
      "Xã Thái Hòa"
    ]
  },
  {
    "newWardId": "21709018",
    "newWardName": "Thanh Ba",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8152",
      "8170",
      "8164",
      "8156"
    ],
    "oldWardNames": [
      "Thị trấn Thanh Ba",
      "Xã Đồng Xuân",
      "Xã Hanh Cù",
      "Xã Vân Lĩnh"
    ]
  },
  {
    "newWardId": "21701003",
    "newWardName": "Thanh Miếu",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "7906",
      "7903",
      "7912",
      "7909",
      "7936"
    ],
    "oldWardNames": [
      "Phường Thọ Sơn",
      "Phường Tiên Cát",
      "Phường Bạch Hạc",
      "Phường Thanh Miếu",
      "Xã Sông Lô"
    ]
  },
  {
    "newWardId": "21719048",
    "newWardName": "Thanh Sơn",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8542",
      "8563",
      "8575",
      "8587",
      "8581"
    ],
    "oldWardNames": [
      "Thị trấn Thanh Sơn",
      "Xã Sơn Hùng",
      "Xã Giáp Lai",
      "Xã Thạch Khoán",
      "Xã Thục Luyện"
    ]
  },
  {
    "newWardId": "30501144",
    "newWardName": "Thịnh Minh",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hợp Thành",
      "Xã Quang Tiến",
      "Xã Thịnh Minh"
    ]
  },
  {
    "newWardId": "21717042",
    "newWardName": "Thọ Văn",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8482",
      "8476",
      "8479"
    ],
    "oldWardNames": [
      "Xã Dị Nậu",
      "Xã Tề Lễ",
      "Xã Thọ Văn"
    ]
  },
  {
    "newWardId": "21907085",
    "newWardName": "Thổ Tang",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Thổ Tang",
      "Xã Thượng Trưng",
      "Xã Tuân Chính"
    ]
  },
  {
    "newWardId": "30501148",
    "newWardName": "Thống Nhất",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Dân Chủ",
      "Phường Thái Bình",
      "Phường Thống Nhất",
      "Xã Vầy Nưa"
    ]
  },
  {
    "newWardId": "21720058",
    "newWardName": "Thu Cúc",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8545"
    ],
    "oldWardNames": [
      "Xã Thu Cúc"
    ]
  },
  {
    "newWardId": "30510105",
    "newWardName": "Thung Nai",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bắc Phong",
      "Xã Bình Thanh",
      "Xã Thung Nai"
    ]
  },
  {
    "newWardId": "30515123",
    "newWardName": "Thượng Cốc",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Miền Đồi",
      "Xã Văn Sơn",
      "Xã Thượng Cốc"
    ]
  },
  {
    "newWardId": "21715062",
    "newWardName": "Thượng Long",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8329",
      "8317",
      "8323"
    ],
    "oldWardNames": [
      "Xã Phúc Khánh",
      "Xã Nga Hoàng",
      "Xã Thượng Long"
    ]
  },
  {
    "newWardId": "21903072",
    "newWardName": "Tiên Lữ",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Xuân Lôi",
      "Xã Văn Quán",
      "Xã Đồng Ích",
      "Xã Tiên Lữ"
    ]
  },
  {
    "newWardId": "21713039",
    "newWardName": "Tiên Lương",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8356",
      "8350",
      "8344"
    ],
    "oldWardNames": [
      "Xã Phượng Vĩ",
      "Xã Minh Thắng",
      "Xã Tiên Lương"
    ]
  },
  {
    "newWardId": "30503111",
    "newWardName": "Tiền Phong",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tiền Phong",
      "Xã Vầy Nưa"
    ]
  },
  {
    "newWardId": "30513139",
    "newWardName": "Toàn Thắng",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Gia Mô",
      "Xã Lỗ Sơn",
      "Xã Nhân Mỹ"
    ]
  },
  {
    "newWardId": "21711016",
    "newWardName": "Trạm Thản",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8248",
      "8245",
      "8239"
    ],
    "oldWardNames": [
      "Xã Tiên Phú",
      "Xã Trung Giáp",
      "Xã Trạm Thản"
    ]
  },
  {
    "newWardId": "21715066",
    "newWardName": "Trung Sơn",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8311"
    ],
    "oldWardNames": [
      "Xã Trung Sơn"
    ]
  },
  {
    "newWardId": "21723047",
    "newWardName": "Tu Vũ",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8686",
      "8689",
      "8701"
    ],
    "oldWardNames": [
      "Xã Đồng Trung",
      "Xã Hoàng Xá",
      "Xã Tu Vũ"
    ]
  },
  {
    "newWardId": "21717043",
    "newWardName": "Vạn Xuân",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8470",
      "8461",
      "8467"
    ],
    "oldWardNames": [
      "Xã Quang Húc",
      "Xã Lam Sơn",
      "Xã Vạn Xuân"
    ]
  },
  {
    "newWardId": "21707033",
    "newWardName": "Văn Lang",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8131",
      "8125",
      "8140",
      "8134"
    ],
    "oldWardNames": [
      "Xã Vô Tranh",
      "Xã Bằng Giã",
      "Xã Minh Côi",
      "Xã Văn Lang"
    ]
  },
  {
    "newWardId": "21719050",
    "newWardName": "Văn Miếu",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8641",
      "8629",
      "8611"
    ],
    "oldWardNames": [
      "Xã Tân Lập",
      "Xã Tân Minh",
      "Xã Văn Miếu"
    ]
  },
  {
    "newWardId": "21713040",
    "newWardName": "Vân Bán",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8374",
      "8377",
      "8380"
    ],
    "oldWardNames": [
      "Xã Tùng Khê",
      "Xã Tam Sơn",
      "Xã Văn Bán"
    ]
  },
  {
    "newWardId": "21701004",
    "newWardName": "Vân Phú",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "7918",
      "7921",
      "8287",
      "8281"
    ],
    "oldWardNames": [
      "Phường Vân Phú",
      "Xã Phượng Lâu",
      "Xã Hùng Lô",
      "Xã Kim Đức"
    ]
  },
  {
    "newWardId": "30513140",
    "newWardName": "Vân Sơn",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ngổ Luông",
      "Xã Quyết Chiến",
      "Xã Vân Sơn"
    ]
  },
  {
    "newWardId": "21701001",
    "newWardName": "Việt Trì",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "7897",
      "7900",
      "7933",
      "7888",
      "7930"
    ],
    "oldWardNames": [
      "Phường Tân Dân",
      "Phường Gia Cẩm",
      "Phường Minh Nông",
      "Phường Dữu Lâu",
      "Xã Trưng Vương"
    ]
  },
  {
    "newWardId": "21907087",
    "newWardName": "Vĩnh An",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Kim Xá",
      "Xã Yên Bình",
      "Xã Chấn Hưng"
    ]
  },
  {
    "newWardId": "21707032",
    "newWardName": "Vĩnh Chân",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8122",
      "8128",
      "8143"
    ],
    "oldWardNames": [
      "Xã Lang Sơn",
      "Xã Yên Luật",
      "Xã Vĩnh Chân"
    ]
  },
  {
    "newWardId": "21907086",
    "newWardName": "Vĩnh Hưng",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nghĩa Hưng",
      "Xã Yên Lập",
      "Xã Đại Đồng"
    ]
  },
  {
    "newWardId": "21907088",
    "newWardName": "Vĩnh Phú",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Nhân",
      "Xã Vĩnh Thịnh",
      "Xã Ngũ Kiên",
      "Xã Vĩnh Phú"
    ]
  },
  {
    "newWardId": "21901099",
    "newWardName": "Vĩnh Phúc",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Định Trung",
      "Phường Liên Bảo",
      "Phường Khai Quang",
      "Phường Ngô Quyền",
      "Phường Đống Đa"
    ]
  },
  {
    "newWardId": "21907089",
    "newWardName": "Vĩnh Thành",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Sao Đại Việt",
      "Xã Lũng Hòa",
      "Xã Tân Phú"
    ]
  },
  {
    "newWardId": "21907084",
    "newWardName": "Vĩnh Tường",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Vĩnh Tường",
      "Thị trấn Tứ Trưng",
      "Xã Lương Điền",
      "Xã Vũ Di"
    ]
  },
  {
    "newWardId": "21901100",
    "newWardName": "Vĩnh Yên",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tích Sơn",
      "Phường Hội Hợp",
      "Phường Đồng Tâm",
      "Xã Thanh Trù"
    ]
  },
  {
    "newWardId": "21719049",
    "newWardName": "Võ Miếu",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8572",
      "8602",
      "8584"
    ],
    "oldWardNames": [
      "Xã Địch Quả",
      "Xã Cự Thắng",
      "Xã Võ Miếu"
    ]
  },
  {
    "newWardId": "21720059",
    "newWardName": "Xuân Đài",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8617",
      "8599",
      "8590"
    ],
    "oldWardNames": [
      "Xã Kim Thượng",
      "Xã Xuân Sơn",
      "Xã Xuân Đài"
    ]
  },
  {
    "newWardId": "21902102",
    "newWardName": "Xuân Hòa",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Đồng Xuân",
      "Phường Xuân Hòa",
      "Xã Cao Minh",
      "Xã Ngọc Thanh"
    ]
  },
  {
    "newWardId": "21913096",
    "newWardName": "Xuân Lãng",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Thanh Lãng",
      "Thị trấn Đạo Đức",
      "Xã Tân Phong",
      "Xã Phú Xuân"
    ]
  },
  {
    "newWardId": "21721007",
    "newWardName": "Xuân Lũng",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8497",
      "8509",
      "8500"
    ],
    "oldWardNames": [
      "Xã Tiên Kiên",
      "Xã Xuân Huy",
      "Xã Xuân Lũng"
    ]
  },
  {
    "newWardId": "21715064",
    "newWardName": "Xuân Viên",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8308",
      "8302",
      "8305"
    ],
    "oldWardNames": [
      "Xã Xuân Thủy",
      "Xã Xuân An",
      "Xã Xuân Viên"
    ]
  },
  {
    "newWardId": "21707031",
    "newWardName": "Yên Kỳ",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8104",
      "8089",
      "8113"
    ],
    "oldWardNames": [
      "Xã Hương Xạ",
      "Xã Phương Viên",
      "Xã Yên Kỳ"
    ]
  },
  {
    "newWardId": "21909090",
    "newWardName": "Yên Lạc",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Yên Lạc",
      "Xã Bình Định",
      "Xã Đồng Cương"
    ]
  },
  {
    "newWardId": "21915070",
    "newWardName": "Yên Lãng",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Quang Yên",
      "Xã Lãng Công"
    ]
  },
  {
    "newWardId": "21715061",
    "newWardName": "Yên Lập",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8290",
      "8326",
      "8314",
      "8320"
    ],
    "oldWardNames": [
      "Thị trấn Yên Lập",
      "Xã Đồng Thịnh",
      "Xã Hưng Long",
      "Xã Đồng Lạc"
    ]
  },
  {
    "newWardId": "30515124",
    "newWardName": "Yên Phú",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình Hẻm",
      "Xã Xuất Hóa",
      "Xã Yên Phú"
    ]
  },
  {
    "newWardId": "21719053",
    "newWardName": "Yên Sơn",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [
      "8659",
      "8653",
      "8656"
    ],
    "oldWardNames": [
      "Xã Tinh Nhuệ",
      "Xã Lương Nha",
      "Xã Yên Sơn"
    ]
  },
  {
    "newWardId": "30519141",
    "newWardName": "Yên Thủy",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Hàng Trạm",
      "Xã Lạc Thịnh",
      "Xã Phú Lai"
    ]
  },
  {
    "newWardId": "30519143",
    "newWardName": "Yên Trị",
    "provinceId": "17",
    "provinceName": "Phú Thọ",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đoàn Kết",
      "Xã Hữu Lợi",
      "Xã Ngọc Lương",
      "Xã Yên Trị"
    ]
  },
  {
    "newWardId": "50501003",
    "newWardName": "An Phú",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21256",
      "21037",
      "21034",
      "21262"
    ],
    "oldWardNames": [
      "Xã Nghĩa Hà",
      "Xã Nghĩa Dõng",
      "Xã Nghĩa Dũng",
      "Xã An Phú"
    ]
  },
  {
    "newWardId": "50525050",
    "newWardName": "Ba Dinh",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21500",
      "21499"
    ],
    "oldWardNames": [
      "Xã Ba Giang",
      "Xã Ba Dinh"
    ]
  },
  {
    "newWardId": "50525053",
    "newWardName": "Ba Động",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21502",
      "21493",
      "21496"
    ],
    "oldWardNames": [
      "Xã Ba Liên",
      "Xã Ba Thành",
      "Xã Ba Động"
    ]
  },
  {
    "newWardId": "50509017",
    "newWardName": "Ba Gia",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21205",
      "21184",
      "21178"
    ],
    "oldWardNames": [
      "Xã Tịnh Bắc",
      "Xã Tịnh Hiệp",
      "Xã Tịnh Trà"
    ]
  },
  {
    "newWardId": "50525049",
    "newWardName": "Ba Tô",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21532",
      "21535",
      "21523"
    ],
    "oldWardNames": [
      "Xã Ba Lế",
      "Xã Ba Nam",
      "Xã Ba Tô"
    ]
  },
  {
    "newWardId": "50525051",
    "newWardName": "Ba Tơ",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21484",
      "21511",
      "21526"
    ],
    "oldWardNames": [
      "Thị trấn Ba Tơ",
      "Xã Ba Cung",
      "Xã Ba Bích"
    ]
  },
  {
    "newWardId": "50525048",
    "newWardName": "Ba Vì",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21517",
      "21505",
      "21529"
    ],
    "oldWardNames": [
      "Xã Ba Tiêu",
      "Xã Ba Ngạc",
      "Xã Ba Vì"
    ]
  },
  {
    "newWardId": "50525052",
    "newWardName": "Ba Vinh",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21487",
      "21490"
    ],
    "oldWardNames": [
      "Xã Ba Điền",
      "Xã Ba Vinh"
    ]
  },
  {
    "newWardId": "50525055",
    "newWardName": "Ba Xa",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21538"
    ],
    "oldWardNames": [
      "Xã Ba Xa"
    ]
  },
  {
    "newWardId": "50505012",
    "newWardName": "Bình Chương",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21106",
      "21100"
    ],
    "oldWardNames": [
      "Xã Bình Mỹ",
      "Xã Bình Chương"
    ]
  },
  {
    "newWardId": "50505011",
    "newWardName": "Bình Minh",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21058",
      "21064",
      "21085"
    ],
    "oldWardNames": [
      "Xã Bình Khương",
      "Xã Bình An",
      "Xã Bình Minh"
    ]
  },
  {
    "newWardId": "50505013",
    "newWardName": "Bình Sơn",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21040",
      "21046",
      "21052",
      "21070",
      "21055",
      "21082",
      "21088"
    ],
    "oldWardNames": [
      "Thị trấn Châu Ổ",
      "Xã Bình Thạnh",
      "Xã Bình Chánh",
      "Xã Bình Dương",
      "Xã Bình Nguyên",
      "Xã Bình Trung",
      "Xã Bình Long"
    ]
  },
  {
    "newWardId": "60105075",
    "newWardName": "Bờ Y",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Plei Kần",
      "Xã Đăk Xú",
      "Xã Pờ Y"
    ]
  },
  {
    "newWardId": "50507036",
    "newWardName": "Cà Đam",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21136",
      "21142"
    ],
    "oldWardNames": [
      "Xã Trà Tân",
      "Xã Trà Bùi"
    ]
  },
  {
    "newWardId": "50501004",
    "newWardName": "Cẩm Thành",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21025",
      "21022",
      "21019",
      "21031"
    ],
    "oldWardNames": [
      "Phường Nguyễn Nghiêm",
      "Phường Trần Hưng Đạo",
      "Phường Nghĩa Chánh",
      "Phường Chánh Lộ"
    ]
  },
  {
    "newWardId": "60105077",
    "newWardName": "Dục Nông",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đăk Ang",
      "Xã Đăk Dục",
      "Xã Đăk Nông"
    ]
  },
  {
    "newWardId": "60101058",
    "newWardName": "Đăk Cấm",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Ngô Mây",
      "Phường Duy Tân",
      "Xã Đăk Cấm"
    ]
  },
  {
    "newWardId": "60111067",
    "newWardName": "Đăk Hà",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Đăk Hà",
      "Xã Hà Mòn",
      "Xã Đăk La"
    ]
  },
  {
    "newWardId": "60108087",
    "newWardName": "Đăk Kôi",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đăk Tơ Lung",
      "Xã Đăk Kôi"
    ]
  },
  {
    "newWardId": "60103093",
    "newWardName": "Đăk Long",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đăk Long"
    ]
  },
  {
    "newWardId": "60111064",
    "newWardName": "Đăk Mar",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đăk Hring",
      "Xã Đăk Mar"
    ]
  },
  {
    "newWardId": "60103082",
    "newWardName": "Đăk Môn",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đăk Kroong",
      "Xã Đăk Môn"
    ]
  },
  {
    "newWardId": "60103081",
    "newWardName": "Đăk Pék",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Đăk Glei",
      "Xã Đăk Pék"
    ]
  },
  {
    "newWardId": "60103080",
    "newWardName": "Đăk Plô",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đăk Nhoong",
      "Xã Đăk Man",
      "Xã Đăk Plô"
    ]
  },
  {
    "newWardId": "60111063",
    "newWardName": "Đăk Pxi",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đăk Long",
      "Xã Đăk Pxi"
    ]
  },
  {
    "newWardId": "60101062",
    "newWardName": "Đăk Rơ Wa",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hòa Bình",
      "Xã Chư Hreng",
      "Xã Đăk Blà",
      "Xã Đăk Rơ Wa"
    ]
  },
  {
    "newWardId": "60108089",
    "newWardName": "Đăk Rve",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Đăk Rve",
      "Xã Đăk Pne"
    ]
  },
  {
    "newWardId": "60115071",
    "newWardName": "Đăk Sao",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đăk Na",
      "Xã Đăk Sao"
    ]
  },
  {
    "newWardId": "60107069",
    "newWardName": "Đăk Tô",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Đăk Tô",
      "Xã Tân Cảnh",
      "Xã Pô Kô",
      "Xã Diên Bình"
    ]
  },
  {
    "newWardId": "60115072",
    "newWardName": "Đăk Tờ Kan",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đăk Rơ Ông",
      "Xã Đăk Tờ Kan"
    ]
  },
  {
    "newWardId": "60111065",
    "newWardName": "Đăk Ui",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đăk Ngọk",
      "Xã Đăk Ui"
    ]
  },
  {
    "newWardId": "50525054",
    "newWardName": "Đặng Thùy Trâm",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21520",
      "21508"
    ],
    "oldWardNames": [
      "Xã Ba Trang",
      "Xã Ba Khâm"
    ]
  },
  {
    "newWardId": "50517025",
    "newWardName": "Đình Cương",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21379",
      "21385",
      "21391"
    ],
    "oldWardNames": [
      "Xã Hành Đức",
      "Xã Hành Phước",
      "Xã Hành Thịnh"
    ]
  },
  {
    "newWardId": "50505015",
    "newWardName": "Đông Sơn",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21103",
      "21109",
      "21112",
      "21187"
    ],
    "oldWardNames": [
      "Xã Bình Hiệp",
      "Xã Bình Thanh",
      "Xã Bình Tân Phú",
      "Xã Bình Châu",
      "Xã Tịnh Hòa"
    ]
  },
  {
    "newWardId": "50507033",
    "newWardName": "Đông Trà Bồng",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21127",
      "21130",
      "21118"
    ],
    "oldWardNames": [
      "Xã Trà Bình",
      "Xã Trà Phú",
      "Xã Trà Giang"
    ]
  },
  {
    "newWardId": "50523008",
    "newWardName": "Đức Phổ",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21025"
    ],
    "oldWardNames": [
      "Phường Nguyễn Nghiêm",
      "Phổ Hòa",
      "Phổ Minh",
      "Phổ Vinh",
      "Phổ Ninh"
    ]
  },
  {
    "newWardId": "60101061",
    "newWardName": "Ia Chim",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đoàn Kết",
      "Xã Đăk Năng",
      "Xã Ia Chim"
    ]
  },
  {
    "newWardId": "60114096",
    "newWardName": "Ia Đal",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ia Đal"
    ]
  },
  {
    "newWardId": "60114086",
    "newWardName": "Ia Tơi",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ia Dom",
      "Xã Ia Tơi"
    ]
  },
  {
    "newWardId": "50523009",
    "newWardName": "Khánh Cường",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21475",
      "21472"
    ],
    "oldWardNames": [
      "Xã Phổ Khánh",
      "Xã Phổ Cường"
    ]
  },
  {
    "newWardId": "60108088",
    "newWardName": "Kon Braih",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đăk Tờ Re",
      "Xã Đăk Ruồng",
      "Xã Tân Lập"
    ]
  },
  {
    "newWardId": "60107070",
    "newWardName": "Kon Đào",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Văn Lem",
      "Xã Đăk Trăm",
      "Xã Kon Đào"
    ]
  },
  {
    "newWardId": "60109092",
    "newWardName": "Kon Plông",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ngọk Tem",
      "Xã Hiếu",
      "Xã Pờ Ê"
    ]
  },
  {
    "newWardId": "60101057",
    "newWardName": "Kon Tum",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Quang Trung",
      "Phường Quyết Thắng",
      "Phường Thắng Lợi",
      "Phường Trường Chinh",
      "Phường Thống Nhất"
    ]
  },
  {
    "newWardId": "50521031",
    "newWardName": "Lân Phong",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21433",
      "21436"
    ],
    "oldWardNames": [
      "Xã Đức Phong",
      "Xã Đức Lân"
    ]
  },
  {
    "newWardId": "50521028",
    "newWardName": "Long Phụng",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21406",
      "21409",
      "21415"
    ],
    "oldWardNames": [
      "Xã Thắng Lợi",
      "Xã Đức Nhuận",
      "Xã Đức Hiệp"
    ]
  },
  {
    "newWardId": "60109091",
    "newWardName": "Măng Bút",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đăk Nên",
      "Xã Đăk Ring",
      "Xã Măng Bút"
    ]
  },
  {
    "newWardId": "60109090",
    "newWardName": "Măng Đen",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Măng Đen",
      "Xã Măng Cành",
      "Xã Đăk Tăng"
    ]
  },
  {
    "newWardId": "60115074",
    "newWardName": "Măng Ri",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ngọk Yêu",
      "Xã Văn Xuôi",
      "Xã Tê Xăng",
      "Xã Ngọk Lây",
      "Xã Măng Ri"
    ]
  },
  {
    "newWardId": "50519046",
    "newWardName": "Minh Long",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21361",
      "21355",
      "21358"
    ],
    "oldWardNames": [
      "Xã Long Hiệp",
      "Xã Thanh An",
      "Xã Long Môn"
    ]
  },
  {
    "newWardId": "50521029",
    "newWardName": "Mỏ Cày",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21412",
      "21421",
      "21418"
    ],
    "oldWardNames": [
      "Xã Đức Chánh",
      "Xã Đức Thạnh",
      "Xã Đức Minh"
    ]
  },
  {
    "newWardId": "50521030",
    "newWardName": "Mộ Đức",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21400",
      "21424",
      "21430",
      "21427"
    ],
    "oldWardNames": [
      "Thị trấn Mộ Đức",
      "Xã Đức Hòa",
      "Xã Đức Phú",
      "Xã Đức Tân"
    ]
  },
  {
    "newWardId": "60113095",
    "newWardName": "Mô Rai",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Mô Rai"
    ]
  },
  {
    "newWardId": "50515022",
    "newWardName": "Nghĩa Giang",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21247",
      "21250",
      "21271"
    ],
    "oldWardNames": [
      "Xã Nghĩa Thuận",
      "Xã Nghĩa Kỳ",
      "Xã Nghĩa Điền"
    ]
  },
  {
    "newWardId": "50517024",
    "newWardName": "Nghĩa Hành",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21364",
      "21367",
      "21373"
    ],
    "oldWardNames": [
      "Thị trấn Chợ Chùa",
      "Xã Hành Thuận",
      "Xã Hành Trung"
    ]
  },
  {
    "newWardId": "50501005",
    "newWardName": "Nghĩa Lộ",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21010",
      "21013",
      "21016",
      "21028"
    ],
    "oldWardNames": [
      "Phường Lê Hồng Phong",
      "Phường Trần Phú",
      "Phường Quảng Phú",
      "Phường Nghĩa Lộ"
    ]
  },
  {
    "newWardId": "60103079",
    "newWardName": "Ngọc Linh",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Mường Hoong",
      "Xã Ngọc Linh"
    ]
  },
  {
    "newWardId": "60101060",
    "newWardName": "Ngọk Bay",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Kroong",
      "Xã Vinh Quang",
      "Xã Ngọk Bay"
    ]
  },
  {
    "newWardId": "60111066",
    "newWardName": "Ngọk Réo",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ngọk Wang",
      "Xã Ngọk Réo"
    ]
  },
  {
    "newWardId": "60107068",
    "newWardName": "Ngọk Tụ",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đăk Rơ Nga",
      "Xã Ngọk Tụ"
    ]
  },
  {
    "newWardId": "50523007",
    "newWardName": "Nguyễn Nghiêm",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21457",
      "21445"
    ],
    "oldWardNames": [
      "Xã Phổ Nhơn",
      "Xã Phổ Phong"
    ]
  },
  {
    "newWardId": "50517027",
    "newWardName": "Phước Giang",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21370",
      "21376",
      "21382"
    ],
    "oldWardNames": [
      "Xã Hành Dũng",
      "Xã Hành Nhân",
      "Xã Hành Minh"
    ]
  },
  {
    "newWardId": "60113094",
    "newWardName": "Rờ Kơi",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Rờ Kơi"
    ]
  },
  {
    "newWardId": "60113084",
    "newWardName": "Sa Bình",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Sa Nghĩa",
      "Xã Hơ Moong",
      "Xã Sa Bình"
    ]
  },
  {
    "newWardId": "50523010",
    "newWardName": "Sa Huỳnh",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21478",
      "21481"
    ],
    "oldWardNames": [
      "Phường Phổ Thạnh",
      "Xã Phổ Châu"
    ]
  },
  {
    "newWardId": "60105076",
    "newWardName": "Sa Loong",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đăk Kan",
      "Xã Sa Loong"
    ]
  },
  {
    "newWardId": "60113083",
    "newWardName": "Sa Thầy",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Sa Thầy",
      "Xã Sa Sơn",
      "Xã Sa Nhơn"
    ]
  },
  {
    "newWardId": "50513040",
    "newWardName": "Sơn Hà",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21289",
      "21301",
      "21313"
    ],
    "oldWardNames": [
      "Thị trấn Di Lăng",
      "Xã Sơn Bao",
      "Xã Sơn Thượng"
    ]
  },
  {
    "newWardId": "50513038",
    "newWardName": "Sơn Hạ",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21295",
      "21298",
      "21292"
    ],
    "oldWardNames": [
      "Xã Sơn Thành",
      "Xã Sơn Nham",
      "Xã Sơn Hạ"
    ]
  },
  {
    "newWardId": "50513042",
    "newWardName": "Sơn Kỳ",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21328",
      "21325"
    ],
    "oldWardNames": [
      "Xã Sơn Ba",
      "Xã Sơn Kỳ"
    ]
  },
  {
    "newWardId": "50513039",
    "newWardName": "Sơn Linh",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21307",
      "21316",
      "21304"
    ],
    "oldWardNames": [
      "Xã Sơn Giang",
      "Xã Sơn Cao",
      "Xã Sơn Linh"
    ]
  },
  {
    "newWardId": "50519047",
    "newWardName": "Sơn Mai",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21352",
      "21349"
    ],
    "oldWardNames": [
      "Xã Long Mai",
      "Xã Long Sơn"
    ]
  },
  {
    "newWardId": "50511043",
    "newWardName": "Sơn Tây",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21341",
      "21337",
      "21340"
    ],
    "oldWardNames": [
      "Xã Sơn Long",
      "Xã Sơn Tân",
      "Xã Sơn Dung"
    ]
  },
  {
    "newWardId": "50511045",
    "newWardName": "Sơn Tây Hạ",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21343",
      "21346",
      "21338"
    ],
    "oldWardNames": [
      "Xã Sơn Tinh",
      "Xã Sơn Lập",
      "Xã Sơn Màu"
    ]
  },
  {
    "newWardId": "50511044",
    "newWardName": "Sơn Tây Thượng",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21334",
      "21335",
      "21331"
    ],
    "oldWardNames": [
      "Xã Sơn Mùa",
      "Xã Sơn Liên",
      "Xã Sơn Bua"
    ]
  },
  {
    "newWardId": "50513041",
    "newWardName": "Sơn Thủy",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21310",
      "21319",
      "21322"
    ],
    "oldWardNames": [
      "Xã Sơn Trung",
      "Xã Sơn Hải",
      "Xã Sơn Thủy"
    ]
  },
  {
    "newWardId": "50509018",
    "newWardName": "Sơn Tịnh",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21220",
      "21193",
      "21217"
    ],
    "oldWardNames": [
      "Thị trấn Tịnh Hà",
      "Xã Tịnh Bình",
      "Xã Tịnh Sơn"
    ]
  },
  {
    "newWardId": "50507034",
    "newWardName": "Tây Trà",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21148",
      "21154",
      "21163"
    ],
    "oldWardNames": [
      "Xã Sơn Trà",
      "Xã Trà Phong",
      "Xã Trà Xinh"
    ]
  },
  {
    "newWardId": "50507037",
    "newWardName": "Tây Trà Bồng",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21157",
      "21166",
      "21142"
    ],
    "oldWardNames": [
      "Xã Hương Trà",
      "Xã Trà Tây",
      "Xã Trà Bùi"
    ]
  },
  {
    "newWardId": "50507035",
    "newWardName": "Thanh Bồng",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21133",
      "21124",
      "21145"
    ],
    "oldWardNames": [
      "Xã Trà Lâm",
      "Xã Trà Hiệp",
      "Xã Trà Thanh"
    ]
  },
  {
    "newWardId": "50517026",
    "newWardName": "Thiện Tín",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21388",
      "21394",
      "21397"
    ],
    "oldWardNames": [
      "Xã Hành Thiện",
      "Xã Hành Tín Tây",
      "Xã Hành Tín Đông"
    ]
  },
  {
    "newWardId": "50509019",
    "newWardName": "Thọ Phong",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21181",
      "21175"
    ],
    "oldWardNames": [
      "Xã Tịnh Phong",
      "Xã Tịnh Thọ"
    ]
  },
  {
    "newWardId": "50501001",
    "newWardName": "Tịnh Khê",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21190",
      "21208",
      "21214",
      "21199",
      "21211"
    ],
    "oldWardNames": [
      "Xã Tịnh Kỳ",
      "Xã Tịnh Châu",
      "Xã Tịnh Long",
      "Xã Tịnh Thiện",
      "Xã Tịnh Khê"
    ]
  },
  {
    "newWardId": "50507032",
    "newWardName": "Trà Bồng",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21115",
      "21139",
      "21121"
    ],
    "oldWardNames": [
      "Thị trấn Trà Xuân",
      "Xã Trà Sơn",
      "Xã Trà Thủy"
    ]
  },
  {
    "newWardId": "50523006",
    "newWardName": "Trà Câu",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21451",
      "21454",
      "21442",
      "21448"
    ],
    "oldWardNames": [
      "Phường Phổ Văn",
      "Phường Phổ Quang",
      "Xã Phổ An",
      "Xã Phổ Thuận"
    ]
  },
  {
    "newWardId": "50515023",
    "newWardName": "Trà Giang",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21259",
      "21241",
      "21244"
    ],
    "oldWardNames": [
      "Xã Nghĩa Sơn",
      "Xã Nghĩa Lâm",
      "Xã Nghĩa Thắng"
    ]
  },
  {
    "newWardId": "50509016",
    "newWardName": "Trường Giang",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21226",
      "21196",
      "21229"
    ],
    "oldWardNames": [
      "Xã Tịnh Giang",
      "Xã Tịnh Đông",
      "Xã Tịnh Minh"
    ]
  },
  {
    "newWardId": "50501002",
    "newWardName": "Trương Quang Trọng",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21172",
      "21223",
      "21202",
      "21232"
    ],
    "oldWardNames": [
      "Phường Trương Quang Trọng",
      "Xã Tịnh Ấn Tây",
      "Xã Tịnh Ấn Đông",
      "Xã Tịnh An"
    ]
  },
  {
    "newWardId": "60115073",
    "newWardName": "Tu Mơ Rông",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đăk Hà",
      "Xã Tu Mơ Rông"
    ]
  },
  {
    "newWardId": "50515020",
    "newWardName": "Tư Nghĩa",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21235",
      "21277",
      "21274",
      "21268"
    ],
    "oldWardNames": [
      "Thị trấn La Hà",
      "Xã Nghĩa Trung",
      "Xã Nghĩa Thương",
      "Xã Nghĩa Hòa"
    ]
  },
  {
    "newWardId": "50505014",
    "newWardName": "Vạn Tường",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21043",
      "21049",
      "21061",
      "21067",
      "21079",
      "21073"
    ],
    "oldWardNames": [
      "Xã Bình Thuận",
      "Xã Bình Đông",
      "Xã Bình Trị",
      "Xã Bình Hải",
      "Xã Bình Hòa",
      "Xã Bình Phước"
    ]
  },
  {
    "newWardId": "50515021",
    "newWardName": "Vệ Giang",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [
      "21238",
      "21280",
      "21283"
    ],
    "oldWardNames": [
      "Thị trấn Sông Vệ",
      "Xã Nghĩa Hiệp",
      "Xã Nghĩa Phương"
    ]
  },
  {
    "newWardId": "60103078",
    "newWardName": "Xốp",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đăk Choong",
      "Xã Xốp"
    ]
  },
  {
    "newWardId": "60113085",
    "newWardName": "Ya Ly",
    "provinceId": "05",
    "provinceName": "Quảng Ngãi",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ya Xiêr",
      "Xã Ya Tăng",
      "Xã Ya Ly"
    ]
  },
  {
    "newWardId": "22521001",
    "newWardName": "An Sinh",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "7090",
      "7075",
      "7084",
      "7093"
    ],
    "oldWardNames": [
      "Phường Bình Dương",
      "Xã An Sinh",
      "Xã Việt Dân",
      "Phường Đức Chính"
    ]
  },
  {
    "newWardId": "22515037",
    "newWardName": "Ba Chẽ",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6970",
      "6973",
      "6982",
      "6988",
      "6886"
    ],
    "oldWardNames": [
      "Thị trấn Ba Chẽ",
      "Xã Thanh Sơn",
      "Xã Nam Sơn",
      "Xã Đồn Đạc",
      "Xã Hải Lạng"
    ]
  },
  {
    "newWardId": "22501017",
    "newWardName": "Bãi Cháy",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6679",
      "6673"
    ],
    "oldWardNames": [
      "Phường Hùng Thắng",
      "Phường Bãi Cháy"
    ]
  },
  {
    "newWardId": "22521003",
    "newWardName": "Bình Khê",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "7096",
      "7081",
      "7078"
    ],
    "oldWardNames": [
      "Phường Tràng An",
      "Phường Bình Khê",
      "Xã Tràng Lương"
    ]
  },
  {
    "newWardId": "22507045",
    "newWardName": "Bình Liêu",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6838",
      "6859",
      "6853"
    ],
    "oldWardNames": [
      "Thị trấn Bình Liêu",
      "Xã Húc Động",
      "Xã Vô Ngại"
    ]
  },
  {
    "newWardId": "22511054",
    "newWardName": "Cái Chiên",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6967"
    ],
    "oldWardNames": [
      "Xã Cái Chiên"
    ]
  },
  {
    "newWardId": "22501020",
    "newWardName": "Cao Xanh",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6649",
      "6658"
    ],
    "oldWardNames": [
      "Phường Hà Khánh",
      "Phường Cao Xanh"
    ]
  },
  {
    "newWardId": "22503028",
    "newWardName": "Cẩm Phả",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6793",
      "6790",
      "6796",
      "6775",
      "6769"
    ],
    "oldWardNames": [
      "Phường Cẩm Trung",
      "Phường Cẩm Thành",
      "Phường Cẩm Bình",
      "Phường Cẩm Tây",
      "Phường Cẩm Đông"
    ]
  },
  {
    "newWardId": "22503029",
    "newWardName": "Cửa Ông",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6772",
      "6781",
      "6766",
      "6763"
    ],
    "oldWardNames": [
      "Phường Cẩm Phú",
      "Phường Cẩm Thịnh",
      "Phường Cẩm Sơn",
      "Phường Cửa Ông"
    ]
  },
  {
    "newWardId": "22527039",
    "newWardName": "Đầm Hà",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6895",
      "6904",
      "6919",
      "6917",
      "6916"
    ],
    "oldWardNames": [
      "Thị trấn Đầm Hà",
      "Xã Tân Bình",
      "Xã Đại Bình",
      "Xã Tân Lập",
      "Xã Đầm Hà"
    ]
  },
  {
    "newWardId": "22513032",
    "newWardName": "Điền Xá",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6865",
      "6874",
      "6880"
    ],
    "oldWardNames": [
      "Xã Hà Lâu",
      "Xã Điền Xá",
      "Xã Yên Than"
    ]
  },
  {
    "newWardId": "22525009",
    "newWardName": "Đông Mai",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "7138",
      "7135"
    ],
    "oldWardNames": [
      "Phường Minh Thành",
      "Phường Đông Mai"
    ]
  },
  {
    "newWardId": "22513033",
    "newWardName": "Đông Ngũ",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6883",
      "6868",
      "6877"
    ],
    "oldWardNames": [
      "Xã Đông Hải",
      "Xã Đại Dực",
      "Xã Đông Ngũ"
    ]
  },
  {
    "newWardId": "22521002",
    "newWardName": "Đông Triều",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "7102",
      "7126",
      "7120",
      "7099",
      "7093"
    ],
    "oldWardNames": [
      "Phường Thủy An",
      "Phường Hưng Đạo",
      "Phường Hồng Phong",
      "Xã Nguyễn Huệ",
      "Phường Đức Chính"
    ]
  },
  {
    "newWardId": "22511041",
    "newWardName": "Đường Hoa",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6928",
      "6949",
      "6946"
    ],
    "oldWardNames": [
      "Xã Quảng Sơn",
      "Xã Đường Hoa",
      "Xã Quảng Long"
    ]
  },
  {
    "newWardId": "22525012",
    "newWardName": "Hà An",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "7159",
      "7168",
      "7156",
      "7180"
    ],
    "oldWardNames": [
      "Phường Tân An",
      "Phường Hà An",
      "Xã Hoàng Tân",
      "Xã Liên Hòa"
    ]
  },
  {
    "newWardId": "22501019",
    "newWardName": "Hà Lầm",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6676",
      "6667",
      "6670"
    ],
    "oldWardNames": [
      "Phường Cao Thắng",
      "Phường Hà Trung",
      "Phường Hà Lầm"
    ]
  },
  {
    "newWardId": "22501022",
    "newWardName": "Hạ Long",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6697",
      "6688"
    ],
    "oldWardNames": [
      "Phường Hồng Hà",
      "Phường Hồng Hải"
    ]
  },
  {
    "newWardId": "22501018",
    "newWardName": "Hà Tu",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6652",
      "6664"
    ],
    "oldWardNames": [
      "Phường Hà Phong",
      "Phường Hà Tu"
    ]
  },
  {
    "newWardId": "22503030",
    "newWardName": "Hải Hòa",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6886",
      "6799"
    ],
    "oldWardNames": [
      "Xã Hải Lạng",
      "Xã Hải Hòa"
    ]
  },
  {
    "newWardId": "22513034",
    "newWardName": "Hải Lạng",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6892",
      "6886",
      "6799"
    ],
    "oldWardNames": [
      "Xã Đồng Rui",
      "Xã Hải Lạng",
      "Xã Hải Hòa"
    ]
  },
  {
    "newWardId": "22509047",
    "newWardName": "Hải Ninh",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6739",
      "6733"
    ],
    "oldWardNames": [
      "Xã Quảng Nghĩa",
      "Xã Hải Tiến"
    ]
  },
  {
    "newWardId": "22509046",
    "newWardName": "Hải Sơn",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6727",
      "6724"
    ],
    "oldWardNames": [
      "Xã Bắc Sơn",
      "Xã Hải Sơn"
    ]
  },
  {
    "newWardId": "22525010",
    "newWardName": "Hiệp Hòa",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "7150",
      "7144",
      "7147"
    ],
    "oldWardNames": [
      "Phường Cộng Hòa",
      "Xã Sông Khoai",
      "Xã Hiệp Hòa"
    ]
  },
  {
    "newWardId": "22521005",
    "newWardName": "Hoàng Quế",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "7129",
      "7114",
      "7108",
      "7111"
    ],
    "oldWardNames": [
      "Phường Yên Đức",
      "Phường Hoàng Quế",
      "Xã Hồng Thái Tây",
      "Xã Hồng Thái Đông"
    ]
  },
  {
    "newWardId": "22501023",
    "newWardName": "Hoành Bồ",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "7030",
      "7063",
      "7066",
      "7042"
    ],
    "oldWardNames": [
      "Phường Hoành Bồ",
      "Xã Sơn Dương",
      "Xã Lê Lợi",
      "Xã Đồng Lâm"
    ]
  },
  {
    "newWardId": "22507043",
    "newWardName": "Hoành Mô",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6847",
      "6841"
    ],
    "oldWardNames": [
      "Xã Đồng Văn",
      "Xã Hoành Mô"
    ]
  },
  {
    "newWardId": "22501021",
    "newWardName": "Hồng Gai",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6694",
      "6685",
      "6691"
    ],
    "oldWardNames": [
      "Phường Bạch Đằng",
      "Phường Trần Hưng Đạo",
      "Phường Hồng Gai"
    ]
  },
  {
    "newWardId": "22515036",
    "newWardName": "Kỳ Thượng",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6976",
      "6979",
      "7033"
    ],
    "oldWardNames": [
      "Xã Thanh Lâm",
      "Xã Đạp Thanh",
      "Xã Kỳ Thượng"
    ]
  },
  {
    "newWardId": "22525014",
    "newWardName": "Liên Hòa",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "7174",
      "7186",
      "7189",
      "7180"
    ],
    "oldWardNames": [
      "Phường Phong Hải",
      "Xã Liên Vị",
      "Xã Tiền Phong",
      "Xã Liên Hòa"
    ]
  },
  {
    "newWardId": "22507044",
    "newWardName": "Lục Hồn",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6844",
      "6856"
    ],
    "oldWardNames": [
      "Xã Đồng Tâm",
      "Xã Lục Hồn"
    ]
  },
  {
    "newWardId": "22501035",
    "newWardName": "Lương Minh",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "7036",
      "6985"
    ],
    "oldWardNames": [
      "Xã Đồng Sơn",
      "Xã Lương Minh"
    ]
  },
  {
    "newWardId": "22521004",
    "newWardName": "Mạo Khê",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "7105",
      "7123",
      "7117",
      "7069"
    ],
    "oldWardNames": [
      "Phường Xuân Sơn",
      "Phường Kim Sơn",
      "Phường Yên Thọ",
      "Phường Mạo Khê"
    ]
  },
  {
    "newWardId": "22509049",
    "newWardName": "Móng Cái 1",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6712",
      "6751",
      "6721",
      "6745"
    ],
    "oldWardNames": [
      "Phường Trần Phú",
      "Phường Hải Hòa",
      "Phường Bình Ngọc",
      "Phường Trà Cổ",
      "Xã Hải Xuân"
    ]
  },
  {
    "newWardId": "22509050",
    "newWardName": "Móng Cái 2",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6715",
      "6709",
      "6748"
    ],
    "oldWardNames": [
      "Phường Ninh Dương",
      "Phường Ka Long",
      "Xã Vạn Ninh"
    ]
  },
  {
    "newWardId": "22509051",
    "newWardName": "Móng Cái 3",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6736",
      "6730"
    ],
    "oldWardNames": [
      "Phường Hải Yên",
      "Xã Hải Đông"
    ]
  },
  {
    "newWardId": "22503026",
    "newWardName": "Mông Dương",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6760",
      "6805"
    ],
    "oldWardNames": [
      "Phường Mông Dương",
      "Xã Dương Huy"
    ]
  },
  {
    "newWardId": "22525013",
    "newWardName": "Phong Cốc",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "7177",
      "7183",
      "7171"
    ],
    "oldWardNames": [
      "Phường Nam Hòa",
      "Phường Yên Hải",
      "Phường Phong Cốc",
      "Xã Cẩm La"
    ]
  },
  {
    "newWardId": "22511042",
    "newWardName": "Quảng Đức",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6931",
      "6937",
      "6925"
    ],
    "oldWardNames": [
      "Xã Quảng Thành",
      "Xã Quảng Thịnh",
      "Xã Quảng Đức"
    ]
  },
  {
    "newWardId": "22511040",
    "newWardName": "Quảng Hà",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6922",
      "6940",
      "6943",
      "6952",
      "6946"
    ],
    "oldWardNames": [
      "Thị trấn Quảng Hà",
      "Xã Quảng Minh",
      "Xã Quảng Chính",
      "Xã Quảng Phong",
      "Xã Quảng Long"
    ]
  },
  {
    "newWardId": "22503027",
    "newWardName": "Quang Hanh",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6787",
      "6784",
      "6778"
    ],
    "oldWardNames": [
      "Phường Cẩm Thạch",
      "Phường Cẩm Thủy",
      "Phường Quang Hanh"
    ]
  },
  {
    "newWardId": "22501024",
    "newWardName": "Quảng La",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "7057",
      "7051",
      "7039",
      "7054"
    ],
    "oldWardNames": [
      "Xã Bằng Cả",
      "Xã Dân Chủ",
      "Xã Tân Dân",
      "Xã Quảng La"
    ]
  },
  {
    "newWardId": "22527038",
    "newWardName": "Quảng Tân",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6901",
      "6910",
      "6898",
      "6913"
    ],
    "oldWardNames": [
      "Xã Quảng An",
      "Xã Dực Yên",
      "Xã Quảng Lâm",
      "Xã Quảng Tân"
    ]
  },
  {
    "newWardId": "22525011",
    "newWardName": "Quảng Yên",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "7162",
      "7132",
      "7153"
    ],
    "oldWardNames": [
      "Phường Yên Giang",
      "Phường Quảng Yên",
      "Xã Tiền An"
    ]
  },
  {
    "newWardId": "22501025",
    "newWardName": "Thống Nhất",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "7048",
      "7045",
      "7060",
      "7042"
    ],
    "oldWardNames": [
      "Xã Vũ Oai",
      "Xã Hòa Bình",
      "Xã Thống Nhất",
      "Xã Đồng Lâm"
    ]
  },
  {
    "newWardId": "22513031",
    "newWardName": "Tiên Yên",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6862",
      "6871",
      "6889",
      "6880",
      "6868",
      "6877",
      "6853"
    ],
    "oldWardNames": [
      "Thị trấn Tiên Yên",
      "Xã Phong Dụ",
      "Xã Tiên Lãng",
      "Xã Yên Than",
      "Xã Đại Dực",
      "Xã Đông Ngũ",
      "Xã Vô Ngại"
    ]
  },
  {
    "newWardId": "22501015",
    "newWardName": "Tuần Châu",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6706",
      "6700",
      "6655"
    ],
    "oldWardNames": [
      "Phường Đại Yên",
      "Phường Tuần Châu",
      "Phường Hà Khẩu"
    ]
  },
  {
    "newWardId": "22505008",
    "newWardName": "Uông Bí",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6817",
      "6811",
      "6826",
      "6820"
    ],
    "oldWardNames": [
      "Phường Quang Trung",
      "Phường Thanh Sơn",
      "Phường Yên Thanh",
      "Phường Trưng Vương"
    ]
  },
  {
    "newWardId": "22505007",
    "newWardName": "Vàng Danh",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6814",
      "6823",
      "6808",
      "6820"
    ],
    "oldWardNames": [
      "Phường Bắc Sơn",
      "Phường Nam Khê",
      "Phường Vàng Danh",
      "Phường Trưng Vương"
    ]
  },
  {
    "newWardId": "22501016",
    "newWardName": "Việt Hưng",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6661",
      "6703",
      "6655"
    ],
    "oldWardNames": [
      "Phường Giếng Đáy",
      "Phường Việt Hưng",
      "Phường Hà Khẩu"
    ]
  },
  {
    "newWardId": "22509048",
    "newWardName": "Vĩnh Thực",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6754",
      "6757"
    ],
    "oldWardNames": [
      "Xã Vĩnh Trung",
      "Xã Vĩnh Thực"
    ]
  },
  {
    "newWardId": "22505006",
    "newWardName": "Yên Tử",
    "provinceId": "25",
    "provinceName": "Quảng Ninh",
    "oldWardIds": [
      "6832",
      "6835",
      "6829"
    ],
    "oldWardNames": [
      "Phường Phương Đông",
      "Phường Phương Nam",
      "Xã Thượng Yên Công"
    ]
  },
  {
    "newWardId": "40915060",
    "newWardName": "A Dơi",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19477",
      "19492",
      "19483"
    ],
    "oldWardNames": [
      "Xã Ba Tầng",
      "Xã Xy",
      "Xã A Dơi"
    ]
  },
  {
    "newWardId": "40911069",
    "newWardName": "Ái Tử",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19669",
      "19675",
      "19657"
    ],
    "oldWardNames": [
      "Xã Triệu Ái",
      "Xã Triệu Giang",
      "Xã Triệu Long"
    ]
  },
  {
    "newWardId": "40715006",
    "newWardName": "Ba Đồn",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Quảng Phong",
      "Phường Quảng Long",
      "Phường Ba Đồn",
      "Xã Quảng Hải"
    ]
  },
  {
    "newWardId": "40917064",
    "newWardName": "Ba Lòng",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19567",
      "19570"
    ],
    "oldWardNames": [
      "Xã Triệu Nguyên",
      "Xã Ba Lòng"
    ]
  },
  {
    "newWardId": "40715007",
    "newWardName": "Bắc Gianh",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Quảng Phúc",
      "Phường Quảng Thọ",
      "Phường Quảng Thuận"
    ]
  },
  {
    "newWardId": "40709026",
    "newWardName": "Bắc Trạch",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thanh Trạch",
      "Xã Hạ Mỹ",
      "Xã Liên Trạch",
      "Xã Bắc Trạch"
    ]
  },
  {
    "newWardId": "40907053",
    "newWardName": "Bến Hải",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19501",
      "19498",
      "19504"
    ],
    "oldWardNames": [
      "Xã Trung Hải",
      "Xã Trung Giang",
      "Xã Trung Sơn"
    ]
  },
  {
    "newWardId": "40905049",
    "newWardName": "Bến Quan",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19366",
      "19426",
      "19417",
      "19393"
    ],
    "oldWardNames": [
      "Thị trấn Bến Quan",
      "Xã Vĩnh Ô",
      "Xã Vĩnh Hà",
      "Xã Vĩnh Khê"
    ]
  },
  {
    "newWardId": "40709029",
    "newWardName": "Bố Trạch",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hưng Trạch",
      "Xã Cự Nẫm",
      "Xã Vạn Trạch",
      "Xã Phú Định"
    ]
  },
  {
    "newWardId": "40713036",
    "newWardName": "Cam Hồng",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19606"
    ],
    "oldWardNames": [
      "Xã Cam Thủy",
      "Xã Thanh Thủy",
      "Xã Hồng Thủy",
      "Xã Ngư Thủy Bắc"
    ]
  },
  {
    "newWardId": "40909066",
    "newWardName": "Cam Lộ",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19597",
      "19612",
      "19618",
      "19621"
    ],
    "oldWardNames": [
      "Thị trấn Cam Lộ",
      "Xã Cam Thành",
      "Xã Cam Chính",
      "Xã Cam Nghĩa"
    ]
  },
  {
    "newWardId": "40907050",
    "newWardName": "Cồn Tiên",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19546",
      "19534",
      "19522",
      "19537"
    ],
    "oldWardNames": [
      "Xã Hải Thái",
      "Xã Linh Trường",
      "Xã Gio An",
      "Xã Gio Sơn"
    ]
  },
  {
    "newWardId": "40905046",
    "newWardName": "Cửa Tùng",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19414",
      "19423",
      "19408",
      "19384"
    ],
    "oldWardNames": [
      "Thị trấn Cửa Tùng",
      "Xã Vĩnh Giang",
      "Xã Hiền Thành",
      "Xã Kim Thạch"
    ]
  },
  {
    "newWardId": "40907051",
    "newWardName": "Cửa Việt",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19496",
      "19543",
      "19519"
    ],
    "oldWardNames": [
      "Thị trấn Cửa Việt",
      "Xã Gio Mai",
      "Xã Gio Hải"
    ]
  },
  {
    "newWardId": "40705008",
    "newWardName": "Dân Hóa",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trọng Hóa",
      "Xã Dân Hóa"
    ]
  },
  {
    "newWardId": "40913073",
    "newWardName": "Diên Sanh",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19681",
      "19729",
      "19714"
    ],
    "oldWardNames": [
      "Thị trấn Diên Sanh",
      "Xã Hải Trường",
      "Xã Hải Định"
    ]
  },
  {
    "newWardId": "40917063",
    "newWardName": "Đakrông",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19576",
      "19579"
    ],
    "oldWardNames": [
      "Xã Ba Nang",
      "Xã Tà Long",
      "Xã Đakrông"
    ]
  },
  {
    "newWardId": "40901042",
    "newWardName": "Đông Hà",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19333",
      "19354",
      "19345",
      "19330",
      "19339"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 3",
      "Phường 4",
      "Phường Đông Giang",
      "Phường Đông Thanh"
    ]
  },
  {
    "newWardId": "40701001",
    "newWardName": "Đồng Hới",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Đức Ninh Đông",
      "Phường Đồng Hải",
      "Phường Đồng Phú",
      "Phường Phú Hải",
      "Phường Hải Thành",
      "Phường Nam Lý",
      "Xã Bảo Ninh",
      "Xã Đức Ninh"
    ]
  },
  {
    "newWardId": "40703015",
    "newWardName": "Đồng Lê",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Đồng Lê",
      "Xã Kim Hóa",
      "Xã Lê Hóa",
      "Xã Thuận Hóa",
      "Xã Sơn Hóa"
    ]
  },
  {
    "newWardId": "40701003",
    "newWardName": "Đồng Sơn",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Bắc Nghĩa",
      "Phường Đồng Sơn",
      "Xã Nghĩa Ninh",
      "Xã Thuận Đức"
    ]
  },
  {
    "newWardId": "40701002",
    "newWardName": "Đồng Thuận",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Bắc Lý",
      "Xã Lộc Ninh",
      "Xã Quang Phú"
    ]
  },
  {
    "newWardId": "40709027",
    "newWardName": "Đông Trạch",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19702"
    ],
    "oldWardNames": [
      "Xã Hải Phú",
      "Xã Sơn Lộc",
      "Xã Đức Trạch",
      "Xã Đồng Trạch"
    ]
  },
  {
    "newWardId": "40907052",
    "newWardName": "Gio Linh",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19495",
      "19552",
      "19510",
      "19507"
    ],
    "oldWardNames": [
      "Thị trấn Gio Linh",
      "Xã Gio Quang",
      "Xã Gio Mỹ",
      "Xã Phong Bình"
    ]
  },
  {
    "newWardId": "40913075",
    "newWardName": "Hải Lăng",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19702",
      "19717",
      "19708"
    ],
    "oldWardNames": [
      "Xã Hải Phú",
      "Xã Hải Lâm",
      "Xã Hải Thượng"
    ]
  },
  {
    "newWardId": "40909067",
    "newWardName": "Hiếu Giang",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19606",
      "19615",
      "19600",
      "19603"
    ],
    "oldWardNames": [
      "Xã Cam Thủy",
      "Xã Cam Hiếu",
      "Xã Cam Tuyền",
      "Xã Thanh An"
    ]
  },
  {
    "newWardId": "40707022",
    "newWardName": "Hòa Trạch",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Quảng Châu",
      "Xã Quảng Tùng",
      "Xã Cảnh Dương"
    ]
  },
  {
    "newWardId": "40709028",
    "newWardName": "Hoàn Lão",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Hoàn Lão",
      "Xã Trung Trạch",
      "Xã Đại Trạch",
      "Xã Tây Trạch",
      "Xã Hòa Trạch"
    ]
  },
  {
    "newWardId": "40917065",
    "newWardName": "Hướng Hiệp",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19555",
      "19558",
      "19561"
    ],
    "oldWardNames": [
      "Thị trấn Krông Klang",
      "Xã Mò Ó",
      "Xã Hướng Hiệp"
    ]
  },
  {
    "newWardId": "40915054",
    "newWardName": "Hướng Lập",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19438",
      "19435"
    ],
    "oldWardNames": [
      "Xã Hướng Việt",
      "Xã Hướng Lập"
    ]
  },
  {
    "newWardId": "40915055",
    "newWardName": "Hướng Phùng",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19444",
      "19447",
      "19441"
    ],
    "oldWardNames": [
      "Xã Hướng Sơn",
      "Xã Hướng Linh",
      "Xã Hướng Phùng"
    ]
  },
  {
    "newWardId": "40915056",
    "newWardName": "Khe Sanh",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19429",
      "19450",
      "19468",
      "19453"
    ],
    "oldWardNames": [
      "Thị trấn Khe Sanh",
      "Xã Tân Hợp",
      "Xã Húc",
      "Xã Hướng Tân"
    ]
  },
  {
    "newWardId": "40705009",
    "newWardName": "Kim Điền",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hóa Sơn",
      "Xã Hóa Hợp"
    ]
  },
  {
    "newWardId": "40713041",
    "newWardName": "Kim Ngân",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Kim Thủy",
      "Xã Ngân Thủy",
      "Xã Lâm Thủy"
    ]
  },
  {
    "newWardId": "40705010",
    "newWardName": "Kim Phú",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thượng Hóa",
      "Xã Trung Hóa",
      "Xã Minh Hóa",
      "Xã Tân Hóa"
    ]
  },
  {
    "newWardId": "40917061",
    "newWardName": "La Lay",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19591",
      "19594"
    ],
    "oldWardNames": [
      "Xã A Bung",
      "Xã A Ngo"
    ]
  },
  {
    "newWardId": "40915058",
    "newWardName": "Lao Bảo",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19456",
      "19459",
      "19432"
    ],
    "oldWardNames": [
      "Xã Tân Thành",
      "Xã Tân Long",
      "Thị trấn Lao Bảo"
    ]
  },
  {
    "newWardId": "40713040",
    "newWardName": "Lệ Ninh",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn NT Lệ Ninh",
      "Xã Sơn Thủy",
      "Xã Hoa Thủy"
    ]
  },
  {
    "newWardId": "40713035",
    "newWardName": "Lệ Thủy",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Kiến Giang",
      "Xã Liên Thủy",
      "Xã Xuân Thủy",
      "Xã An Thủy",
      "Xã Phong Thủy",
      "Xã Lộc Thủy"
    ]
  },
  {
    "newWardId": "40915059",
    "newWardName": "Lìa",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19480",
      "19471",
      "19489"
    ],
    "oldWardNames": [
      "Xã Thanh",
      "Xã Thuận",
      "Xã Lìa"
    ]
  },
  {
    "newWardId": "40705011",
    "newWardName": "Minh Hóa",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Quy Đạt",
      "Xã Xuân Hóa",
      "Xã Yên Hóa",
      "Xã Hồng Hóa"
    ]
  },
  {
    "newWardId": "40913074",
    "newWardName": "Mỹ Thủy",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19711",
      "19684",
      "19741"
    ],
    "oldWardNames": [
      "Xã Hải Dương",
      "Xã Hải An",
      "Xã Hải Khê"
    ]
  },
  {
    "newWardId": "40715005",
    "newWardName": "Nam Ba Đồn",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Quảng Tân",
      "Xã Quảng Trung",
      "Xã Quảng Tiên",
      "Xã Quảng Sơn",
      "Xã Quảng Thủy"
    ]
  },
  {
    "newWardId": "40911072",
    "newWardName": "Nam Cửa Việt",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19639",
      "19633",
      "19627"
    ],
    "oldWardNames": [
      "Xã Triệu Trạch",
      "Xã Triệu Phước",
      "Xã Triệu Tân"
    ]
  },
  {
    "newWardId": "40901043",
    "newWardName": "Nam Đông Hà",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19342",
      "19348",
      "19336",
      "19351"
    ],
    "oldWardNames": [
      "Phường 2",
      "Phường 5",
      "Phường Đông Lễ",
      "Phường Đông Lương"
    ]
  },
  {
    "newWardId": "40715004",
    "newWardName": "Nam Gianh",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Quảng Hòa",
      "Xã Quảng Lộc",
      "Xã Quảng Văn",
      "Xã Quảng Minh"
    ]
  },
  {
    "newWardId": "40913077",
    "newWardName": "Nam Hải Lăng",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19735",
      "19726",
      "19738"
    ],
    "oldWardNames": [
      "Xã Hải Sơn",
      "Xã Hải Phong",
      "Xã Hải Chánh"
    ]
  },
  {
    "newWardId": "40709030",
    "newWardName": "Nam Trạch",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn NT Việt Trung",
      "Xã Nhân Trạch",
      "Xã Lý Nam"
    ]
  },
  {
    "newWardId": "40711032",
    "newWardName": "Ninh Châu",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Ninh",
      "Xã Gia Ninh",
      "Xã Duy Ninh",
      "Xã Hải Ninh"
    ]
  },
  {
    "newWardId": "40709025",
    "newWardName": "Phong Nha",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Phong Nha",
      "Xã Lâm Trạch",
      "Xã Xuân Trạch",
      "Xã Phúc Trạch"
    ]
  },
  {
    "newWardId": "40707023",
    "newWardName": "Phú Trạch",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Quảng Đông",
      "Xã Quảng Phú",
      "Xã Quảng Kim",
      "Xã Quảng Hợp"
    ]
  },
  {
    "newWardId": "40711031",
    "newWardName": "Quảng Ninh",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Quán Hàu",
      "Xã Vĩnh Ninh",
      "Xã Võ Ninh",
      "Xã Hàm Ninh"
    ]
  },
  {
    "newWardId": "40707021",
    "newWardName": "Quảng Trạch",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Quảng Phương",
      "Xã Quảng Xuân",
      "Xã Quảng Hưng"
    ]
  },
  {
    "newWardId": "40903044",
    "newWardName": "Quảng Trị",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19333",
      "19342",
      "19354",
      "19358",
      "19705"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 2",
      "Phường 3",
      "Phường An Đôn",
      "Xã Hải Lệ"
    ]
  },
  {
    "newWardId": "40713037",
    "newWardName": "Sen Ngư",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hưng Thủy",
      "Xã Sen Thủy",
      "Xã Ngư Thủy"
    ]
  },
  {
    "newWardId": "40917062",
    "newWardName": "Tà Rụt",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19585",
      "19582",
      "19588"
    ],
    "oldWardNames": [
      "Xã A Vao",
      "Xã Húc Nghì",
      "Xã Tà Rụt"
    ]
  },
  {
    "newWardId": "40707019",
    "newWardName": "Tân Gianh",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phù Cảnh",
      "Xã Liên Trường",
      "Xã Quảng Thanh"
    ]
  },
  {
    "newWardId": "40915057",
    "newWardName": "Tân Lập",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19465",
      "19474",
      "19462"
    ],
    "oldWardNames": [
      "Xã Tân Liên",
      "Xã Hướng Lộc",
      "Xã Tân Lập"
    ]
  },
  {
    "newWardId": "40713038",
    "newWardName": "Tân Mỹ",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Thủy",
      "Xã Dương Thủy",
      "Xã Mỹ Thủy",
      "Xã Thái Thủy"
    ]
  },
  {
    "newWardId": "40705012",
    "newWardName": "Tân Thành",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19456"
    ],
    "oldWardNames": [
      "Xã Tân Thành"
    ]
  },
  {
    "newWardId": "40709024",
    "newWardName": "Thượng Trạch",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Trạch",
      "Xã Thượng Trạch"
    ]
  },
  {
    "newWardId": "40911070",
    "newWardName": "Triệu Bình",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19636",
      "19642",
      "19648",
      "19645"
    ],
    "oldWardNames": [
      "Xã Triệu Độ",
      "Xã Triệu Thuận",
      "Xã Triệu Hòa",
      "Xã Triệu Đại"
    ]
  },
  {
    "newWardId": "40911071",
    "newWardName": "Triệu Cơ",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19666",
      "19660",
      "19654"
    ],
    "oldWardNames": [
      "Xã Triệu Trung",
      "Xã Triệu Tài",
      "Xã Triệu Cơ"
    ]
  },
  {
    "newWardId": "40911068",
    "newWardName": "Triệu Phong",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19678",
      "19672"
    ],
    "oldWardNames": [
      "Thị trấn Ái Tử",
      "Xã Triệu Thành",
      "Xã Triệu Thượng"
    ]
  },
  {
    "newWardId": "40707020",
    "newWardName": "Trung Thuần",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Quảng Lưu",
      "Xã Quảng Thạch",
      "Xã Quảng Tiến"
    ]
  },
  {
    "newWardId": "40711033",
    "newWardName": "Trường Ninh",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vạn Ninh",
      "Xã An Ninh",
      "Xã Xuân Ninh",
      "Xã Hiền Ninh"
    ]
  },
  {
    "newWardId": "40713039",
    "newWardName": "Trường Phú",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trường Thủy",
      "Xã Mai Thủy",
      "Xã Phú Thủy"
    ]
  },
  {
    "newWardId": "40711034",
    "newWardName": "Trường Sơn",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trường Xuân",
      "Xã Trường Sơn"
    ]
  },
  {
    "newWardId": "40703017",
    "newWardName": "Tuyên Bình",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phong Hóa",
      "Xã Ngư Hóa",
      "Xã Mai Hóa"
    ]
  },
  {
    "newWardId": "40703018",
    "newWardName": "Tuyên Hóa",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tiến Hóa",
      "Xã Châu Hóa",
      "Xã Cao Quảng",
      "Xã Văn Hóa"
    ]
  },
  {
    "newWardId": "40703013",
    "newWardName": "Tuyên Lâm",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Lâm Hóa",
      "Xã Thanh Hóa"
    ]
  },
  {
    "newWardId": "40703016",
    "newWardName": "Tuyên Phú",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đồng Hóa",
      "Xã Thạch Hóa",
      "Xã Đức Hóa"
    ]
  },
  {
    "newWardId": "40703014",
    "newWardName": "Tuyên Sơn",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thanh Thạch",
      "Xã Hương Hóa"
    ]
  },
  {
    "newWardId": "40913076",
    "newWardName": "Vĩnh Định",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19693",
      "19699",
      "19687"
    ],
    "oldWardNames": [
      "Xã Hải Quy",
      "Xã Hải Hưng",
      "Xã Hải Bình"
    ]
  },
  {
    "newWardId": "40905047",
    "newWardName": "Vĩnh Hoàng",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19369",
      "19378",
      "19396",
      "19372"
    ],
    "oldWardNames": [
      "Xã Vĩnh Thái",
      "Xã Trung Nam",
      "Xã Vĩnh Hòa",
      "Xã Vĩnh Tú"
    ]
  },
  {
    "newWardId": "40905045",
    "newWardName": "Vĩnh Linh",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19363",
      "19387",
      "19375"
    ],
    "oldWardNames": [
      "Thị trấn Hồ Xá",
      "Xã Vĩnh Long",
      "Xã Vĩnh Chấp"
    ]
  },
  {
    "newWardId": "40905048",
    "newWardName": "Vĩnh Thủy",
    "provinceId": "09",
    "provinceName": "Quảng Trị",
    "oldWardIds": [
      "19405",
      "19420",
      "19402"
    ],
    "oldWardNames": [
      "Xã Vĩnh Lâm",
      "Xã Vĩnh Sơn",
      "Xã Vĩnh Thủy"
    ]
  },
  {
    "newWardId": "30309033",
    "newWardName": "Bắc Yên",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3856",
      "3859",
      "3886",
      "3883"
    ],
    "oldWardNames": [
      "Thị trấn Bắc Yên",
      "Xã Phiêng Ban",
      "Xã Hồng Ngài",
      "Xã Song Pe"
    ]
  },
  {
    "newWardId": "30307026",
    "newWardName": "Bình Thuận",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3724",
      "3730"
    ],
    "oldWardNames": [
      "Xã Phổng Lái",
      "Xã Chiềng Pha"
    ]
  },
  {
    "newWardId": "30315058",
    "newWardName": "Bó Sinh",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4180",
      "4171"
    ],
    "oldWardNames": [
      "Xã Pú Bẩu",
      "Xã Chiềng En",
      "Xã Bó Sinh"
    ]
  },
  {
    "newWardId": "30301002",
    "newWardName": "Chiềng An",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3667",
      "3664",
      "3661"
    ],
    "oldWardNames": [
      "Phường Chiềng An",
      "Xã Chiềng Xôm",
      "Xã Chiềng Đen"
    ]
  },
  {
    "newWardId": "30301003",
    "newWardName": "Chiềng Cơi",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3670",
      "3676",
      "3658"
    ],
    "oldWardNames": [
      "Phường Chiềng Cơi",
      "Xã Hua La",
      "Xã Chiềng Cọ"
    ]
  },
  {
    "newWardId": "30317047",
    "newWardName": "Chiềng Hặc",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4093",
      "4081",
      "4078"
    ],
    "oldWardNames": [
      "Xã Tú Nang",
      "Xã Mường Lựm",
      "Xã Chiềng Hặc"
    ]
  },
  {
    "newWardId": "30305032",
    "newWardName": "Chiềng Hoa",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3832",
      "3838",
      "3850"
    ],
    "oldWardNames": [
      "Xã Chiềng Ân",
      "Xã Chiềng Công",
      "Xã Chiềng Hoa"
    ]
  },
  {
    "newWardId": "30315061",
    "newWardName": "Chiềng Khoong",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4216",
      "4204"
    ],
    "oldWardNames": [
      "Xã Mường Cai",
      "Xã Chiềng Khoong"
    ]
  },
  {
    "newWardId": "30315059",
    "newWardName": "Chiềng Khương",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4213",
      "4222"
    ],
    "oldWardNames": [
      "Xã Mường Sai",
      "Xã Chiềng Khương"
    ]
  },
  {
    "newWardId": "30307021",
    "newWardName": "Chiềng La",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3736",
      "3775",
      "3733"
    ],
    "oldWardNames": [
      "Xã Chiềng Ngàm",
      "Xã Nong Lay",
      "Xã Tông Cọ",
      "Xã Chiềng La"
    ]
  },
  {
    "newWardId": "30305030",
    "newWardName": "Chiềng Lao",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3811",
      "3817",
      "3814"
    ],
    "oldWardNames": [
      "Xã Nậm Giôn",
      "Xã Hua Trai",
      "Xã Chiềng Lao"
    ]
  },
  {
    "newWardId": "30313050",
    "newWardName": "Chiềng Mai",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4120",
      "4150",
      "4147",
      "4153",
      "4132"
    ],
    "oldWardNames": [
      "Xã Chiềng Ban",
      "Xã Chiềng Kheo",
      "Xã Chiềng Dong",
      "Xã Chiềng Ve",
      "Xã Chiềng Mai"
    ]
  },
  {
    "newWardId": "30313053",
    "newWardName": "Chiềng Mung",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4111",
      "4126",
      "4123"
    ],
    "oldWardNames": [
      "Xã Mường Bằng",
      "Xã Mường Bon",
      "Xã Chiềng Mung"
    ]
  },
  {
    "newWardId": "30309038",
    "newWardName": "Chiềng Sại",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3892",
      "3895"
    ],
    "oldWardNames": [
      "Xã Phiêng Côn",
      "Xã Chiềng Sại"
    ]
  },
  {
    "newWardId": "30301004",
    "newWardName": "Chiềng Sinh",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3679",
      "3673"
    ],
    "oldWardNames": [
      "Phường Chiềng Sinh",
      "Xã Chiềng Ngần"
    ]
  },
  {
    "newWardId": "30315066",
    "newWardName": "Chiềng Sơ",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4192",
      "4195"
    ],
    "oldWardNames": [
      "Xã Yên Hưng",
      "Xã Chiềng Sơ"
    ]
  },
  {
    "newWardId": "30319011",
    "newWardName": "Chiềng Sơn",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4056",
      "3985"
    ],
    "oldWardNames": [
      "Xã Chiềng Xuân",
      "Xã Chiềng Sơn"
    ]
  },
  {
    "newWardId": "30313057",
    "newWardName": "Chiềng Sung",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4114",
      "4108"
    ],
    "oldWardNames": [
      "Xã Chiềng Chăn",
      "Xã Chiềng Sung"
    ]
  },
  {
    "newWardId": "30307025",
    "newWardName": "Co Mạ",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3796",
      "3802",
      "3781"
    ],
    "oldWardNames": [
      "Xã Co Tòng",
      "Xã Pá Lông",
      "Xã Co Mạ"
    ]
  },
  {
    "newWardId": "30319009",
    "newWardName": "Đoàn Kết",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4015",
      "4000"
    ],
    "oldWardNames": [
      "Xã Chiềng Chung",
      "Xã Đoàn Kết"
    ]
  },
  {
    "newWardId": "30311040",
    "newWardName": "Gia Phù",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3925",
      "3937",
      "3946",
      "3922"
    ],
    "oldWardNames": [
      "Xã Tường Phù",
      "Xã Suối Bau",
      "Xã Sập Xa",
      "Xã Gia Phù"
    ]
  },
  {
    "newWardId": "30315065",
    "newWardName": "Huổi Một",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4201",
      "4210"
    ],
    "oldWardNames": [
      "Xã Nậm Mằn",
      "Xã Huổi Một"
    ]
  },
  {
    "newWardId": "30311045",
    "newWardName": "Kim Bon",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3967",
      "3961"
    ],
    "oldWardNames": [
      "Xã Đá Đỏ",
      "Xã Kim Bon"
    ]
  },
  {
    "newWardId": "30307028",
    "newWardName": "Long Hẹ",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3763"
    ],
    "oldWardNames": [
      "Xã É Tòng",
      "Xã Long Hẹ"
    ]
  },
  {
    "newWardId": "30317048",
    "newWardName": "Lóng Phiêng",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4102",
      "4096"
    ],
    "oldWardNames": [
      "Xã Chiềng Tương",
      "Xã Lóng Phiêng"
    ]
  },
  {
    "newWardId": "30319010",
    "newWardName": "Lóng Sập",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4024",
      "4045"
    ],
    "oldWardNames": [
      "Xã Chiềng Khừa",
      "Xã Lóng Sập"
    ]
  },
  {
    "newWardId": "30313051",
    "newWardName": "Mai Sơn",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4105",
      "4135",
      "4138"
    ],
    "oldWardNames": [
      "Thị trấn Hát Lót",
      "Xã Hát Lót",
      "Xã Cò Nòi"
    ]
  },
  {
    "newWardId": "30319005",
    "newWardName": "Mộc Châu",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3980",
      "4027",
      "4012"
    ],
    "oldWardNames": [
      "Phường Mộc Lỵ",
      "Phường Mường Sang",
      "Xã Chiềng Hắc"
    ]
  },
  {
    "newWardId": "30319006",
    "newWardName": "Mộc Sơn",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4030",
      "3979"
    ],
    "oldWardNames": [
      "Phường Đông Sang",
      "Phường Mộc Sơn"
    ]
  },
  {
    "newWardId": "30307023",
    "newWardName": "Muổi Nọi",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3805",
      "3793",
      "3799"
    ],
    "oldWardNames": [
      "Xã Bản Lầm",
      "Xã Bon Phặng",
      "Xã Muổi Nọi"
    ]
  },
  {
    "newWardId": "30307070",
    "newWardName": "Mường Bám",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3760"
    ],
    "oldWardNames": [
      "Xã Mường Bám"
    ]
  },
  {
    "newWardId": "30311043",
    "newWardName": "Mường Bang",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3943",
      "3934",
      "3964"
    ],
    "oldWardNames": [
      "Xã Mường Do",
      "Xã Mường Lang",
      "Xã Mường Bang"
    ]
  },
  {
    "newWardId": "30305031",
    "newWardName": "Mường Bú",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3853",
      "3841",
      "3847"
    ],
    "oldWardNames": [
      "Xã Mường Chùm",
      "Xã Tạ Bú",
      "Xã Mường Bú"
    ]
  },
  {
    "newWardId": "30313055",
    "newWardName": "Mường Chanh",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4015",
      "4117"
    ],
    "oldWardNames": [
      "Xã Chiềng Chung",
      "Xã Mường Chanh"
    ]
  },
  {
    "newWardId": "30303017",
    "newWardName": "Mường Chiên",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3688",
      "3685",
      "3682"
    ],
    "oldWardNames": [
      "Xã Chiềng Khay",
      "Xã Cà Nàng",
      "Xã Mường Chiên"
    ]
  },
  {
    "newWardId": "30311042",
    "newWardName": "Mường Cơi",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3904",
      "3919",
      "3907"
    ],
    "oldWardNames": [
      "Xã Mường Thải",
      "Xã Tân Lang",
      "Xã Mường Cơi"
    ]
  },
  {
    "newWardId": "30307027",
    "newWardName": "Mường É",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3745"
    ],
    "oldWardNames": [
      "Xã Phổng Lập",
      "Xã Mường É"
    ]
  },
  {
    "newWardId": "30303018",
    "newWardName": "Mường Giôn",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3697",
      "3694"
    ],
    "oldWardNames": [
      "Xã Pá Ma Pha Khinh",
      "Xã Mường Giôn"
    ]
  },
  {
    "newWardId": "30315060",
    "newWardName": "Mường Hung",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4207",
      "4219"
    ],
    "oldWardNames": [
      "Xã Chiềng Cang",
      "Xã Mường Hung"
    ]
  },
  {
    "newWardId": "30307024",
    "newWardName": "Mường Khiêng",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3739",
      "3778",
      "3757"
    ],
    "oldWardNames": [
      "Xã Liệp Tè",
      "Xã Bó Mười",
      "Xã Mường Khiêng"
    ]
  },
  {
    "newWardId": "30305029",
    "newWardName": "Mường La",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3808",
      "3844",
      "3829",
      "3823",
      "3835"
    ],
    "oldWardNames": [
      "Thị trấn Ít Ong",
      "Xã Nặm Păm",
      "Xã Chiềng San",
      "Xã Chiềng Muôn",
      "Xã Mường Trai",
      "Xã Pi Toong"
    ]
  },
  {
    "newWardId": "30321074",
    "newWardName": "Mường Lạn",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4246"
    ],
    "oldWardNames": [
      "Xã Mường Lạn"
    ]
  },
  {
    "newWardId": "30315062",
    "newWardName": "Mường Lầm",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4189",
      "4183"
    ],
    "oldWardNames": [
      "Xã Đứa Mòn",
      "Xã Mường Lầm"
    ]
  },
  {
    "newWardId": "30321075",
    "newWardName": "Mường Lèo",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4240"
    ],
    "oldWardNames": [
      "Xã Mường Lèo"
    ]
  },
  {
    "newWardId": "30303019",
    "newWardName": "Mường Sại",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3709"
    ],
    "oldWardNames": [
      "Xã Nặm Ét",
      "Xã Mường Sại"
    ]
  },
  {
    "newWardId": "30307022",
    "newWardName": "Nậm Lầu",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3766",
      "3784",
      "3790"
    ],
    "oldWardNames": [
      "Xã Chiềng Bôm",
      "Xã Púng Tra",
      "Xã Nậm Lầu"
    ]
  },
  {
    "newWardId": "30315063",
    "newWardName": "Nậm Ty",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4177",
      "4186"
    ],
    "oldWardNames": [
      "Xã Chiềng Phung",
      "Xã Nậm Ty"
    ]
  },
  {
    "newWardId": "30305071",
    "newWardName": "Ngọc Chiến",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3820"
    ],
    "oldWardNames": [
      "Xã Ngọc Chiến"
    ]
  },
  {
    "newWardId": "30309037",
    "newWardName": "Pắc Ngà",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3877",
      "3871"
    ],
    "oldWardNames": [
      "Xã Chim Vàn",
      "Xã Pắc Ngà"
    ]
  },
  {
    "newWardId": "30313054",
    "newWardName": "Phiêng Cằm",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4141",
      "4144"
    ],
    "oldWardNames": [
      "Xã Chiềng Nơi",
      "Xã Phiêng Cằm"
    ]
  },
  {
    "newWardId": "30317073",
    "newWardName": "Phiêng Khoài",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4099"
    ],
    "oldWardNames": [
      "Xã Phiêng Khoài"
    ]
  },
  {
    "newWardId": "30313052",
    "newWardName": "Phiêng Pằn",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4156",
      "4159"
    ],
    "oldWardNames": [
      "Xã Nà Ớt",
      "Xã Chiềng Lương",
      "Xã Phiêng Pằn"
    ]
  },
  {
    "newWardId": "30311039",
    "newWardName": "Phù Yên",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3910",
      "3928",
      "3940",
      "3931",
      "3916"
    ],
    "oldWardNames": [
      "Thị trấn Quang Huy",
      "Xã Huy Hạ",
      "Xã Huy Tường",
      "Xã Huy Tân",
      "Xã Huy Thượng"
    ]
  },
  {
    "newWardId": "30321068",
    "newWardName": "Púng Bánh",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4234",
      "4225",
      "4228"
    ],
    "oldWardNames": [
      "Xã Dồm Cang",
      "Xã Sam Kha",
      "Xã Púng Bánh"
    ]
  },
  {
    "newWardId": "30303016",
    "newWardName": "Quỳnh Nhai",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3703",
      "3706",
      "3718",
      "3700"
    ],
    "oldWardNames": [
      "Thị trấn Mường Giàng",
      "Xã Chiềng Bằng",
      "Xã Chiềng Khoang",
      "Xã Chiềng Ơn"
    ]
  },
  {
    "newWardId": "30323013",
    "newWardName": "Song Khủa",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4021",
      "4042",
      "4006"
    ],
    "oldWardNames": [
      "Xã Mường Tè",
      "Xã Liên Hòa",
      "Xã Quang Minh",
      "Xã Song Khủa"
    ]
  },
  {
    "newWardId": "30315064",
    "newWardName": "Sông Mã",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4168",
      "4198"
    ],
    "oldWardNames": [
      "Thị trấn Sông Mã",
      "Xã Nà Nghịu"
    ]
  },
  {
    "newWardId": "30321067",
    "newWardName": "Sốp Cộp",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4243",
      "4237",
      "4231"
    ],
    "oldWardNames": [
      "Xã Mường Và",
      "Xã Nậm Lạnh",
      "Xã Sốp Cộp"
    ]
  },
  {
    "newWardId": "30311072",
    "newWardName": "Suối Tọ",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3901"
    ],
    "oldWardNames": [
      "Xã Suối Tọ"
    ]
  },
  {
    "newWardId": "30313056",
    "newWardName": "Tà Hộc",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4136",
      "4165"
    ],
    "oldWardNames": [
      "Xã Nà Bó",
      "Xã Tà Hộc"
    ]
  },
  {
    "newWardId": "30309035",
    "newWardName": "Tạ Khoa",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3880",
      "3890",
      "3889"
    ],
    "oldWardNames": [
      "Xã Mường Khoa",
      "Xã Hua Nhàn",
      "Xã Tạ Khoa"
    ]
  },
  {
    "newWardId": "30309034",
    "newWardName": "Tà Xùa",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3874",
      "3869",
      "3868"
    ],
    "oldWardNames": [
      "Xã Làng Chếu",
      "Xã Háng Đồng",
      "Xã Tà Xùa"
    ]
  },
  {
    "newWardId": "30311044",
    "newWardName": "Tân Phong",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3976",
      "3973",
      "3970"
    ],
    "oldWardNames": [
      "Xã Bắc Phong",
      "Xã Nam Phong",
      "Xã Tân Phong"
    ]
  },
  {
    "newWardId": "30319069",
    "newWardName": "Tân Yên",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3997"
    ],
    "oldWardNames": [
      "Xã Tân Yên"
    ]
  },
  {
    "newWardId": "30319008",
    "newWardName": "Thảo Nguyên",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3984"
    ],
    "oldWardNames": [
      "Phường Cờ Đỏ",
      "Phường Thảo Ngu yên"
    ]
  },
  {
    "newWardId": "30307020",
    "newWardName": "Thuận Châu",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3721",
      "3748",
      "3769",
      "3772",
      "3787"
    ],
    "oldWardNames": [
      "Thị trấn Thuận Châu",
      "Xã Phổng Ly",
      "Xã Thôm Mòn",
      "Xã Tông Lạnh",
      "Xã Chiềng Pấc"
    ]
  },
  {
    "newWardId": "30301001",
    "newWardName": "Tô Hiệu",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3652",
      "3655",
      "3646",
      "3649"
    ],
    "oldWardNames": [
      "Phường Quyết Thắng",
      "Phường Quyết Tâm",
      "Phường Chiềng Lề",
      "Phường Tô Hiệu"
    ]
  },
  {
    "newWardId": "30323014",
    "newWardName": "Tô Múa",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4036",
      "3994",
      "4018"
    ],
    "oldWardNames": [
      "Xã Chiềng Khoa",
      "Xã Suối Bàng",
      "Xã Tô Múa"
    ]
  },
  {
    "newWardId": "30311041",
    "newWardName": "Tường Hạ",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3949",
      "3955",
      "3952",
      "3958"
    ],
    "oldWardNames": [
      "Xã Tường Thượng",
      "Xã Tường Phong",
      "Xã Tường Tiến",
      "Xã Tường Hạ"
    ]
  },
  {
    "newWardId": "30323012",
    "newWardName": "Vân Hồ",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4051",
      "4054",
      "4039",
      "4048"
    ],
    "oldWardNames": [
      "Xã Lóng Luông",
      "Xã Chiềng Yên",
      "Xã Mường Men",
      "Xã Vân Hồ"
    ]
  },
  {
    "newWardId": "30319007",
    "newWardName": "Vân Sơn",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3983",
      "4033"
    ],
    "oldWardNames": [
      "Phường Bình Minh",
      "Phường Vân Sơn"
    ]
  },
  {
    "newWardId": "30309036",
    "newWardName": "Xím Vàng",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "3862"
    ],
    "oldWardNames": [
      "Xã Hang Chú",
      "Xã Xí m Vàng"
    ]
  },
  {
    "newWardId": "30323015",
    "newWardName": "Xuân Nha",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4058",
      "4057"
    ],
    "oldWardNames": [
      "Xã Tân Xuân",
      "Xã Xuân Nha"
    ]
  },
  {
    "newWardId": "30317046",
    "newWardName": "Yên Châu",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4075",
      "4063",
      "4069",
      "4072",
      "4090",
      "4066"
    ],
    "oldWardNames": [
      "Thị trấn Yên Châu",
      "Xã Chiềng Đông",
      "Xã Chiềng Sàng",
      "Xã Chiềng Pằn",
      "Xã Chiềng Khoi",
      "Xã Sặp Vạt"
    ]
  },
  {
    "newWardId": "30317049",
    "newWardName": "Yên Sơn",
    "provinceId": "03",
    "provinceName": "Sơn La",
    "oldWardIds": [
      "4084",
      "4087"
    ],
    "oldWardNames": [
      "Xã Chiềng On",
      "Xã Yên Sơn"
    ]
  },
  {
    "newWardId": "40147088",
    "newWardName": "An Nông",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15730",
      "15733",
      "15709"
    ],
    "oldWardNames": [
      "Xã Tiến Nông",
      "Xã Khuyến Nông",
      "Xã NT",
      "Xã An Nông"
    ]
  },
  {
    "newWardId": "40133037",
    "newWardName": "Ba Đình",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16099",
      "16171",
      "16105",
      "16096"
    ],
    "oldWardNames": [
      "Xã Nga Vịnh",
      "Xã Nga Trường",
      "Xã Nga Thiện",
      "Xã Ba Đình"
    ]
  },
  {
    "newWardId": "40113123",
    "newWardName": "Bá Thước",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14923",
      "14971",
      "14962"
    ],
    "oldWardNames": [
      "Thị trấn Cành Nàng",
      "Xã Ban Công",
      "Xã Hạ Trung"
    ]
  },
  {
    "newWardId": "40123158",
    "newWardName": "Bát Mọt",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15607"
    ],
    "oldWardNames": [
      "Xã Bát Mọt"
    ]
  },
  {
    "newWardId": "40129082",
    "newWardName": "Biện Thượng",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15379",
      "15382",
      "15388",
      "15391"
    ],
    "oldWardNames": [
      "Xã Vĩnh Hùng",
      "Xã Minh Tân",
      "Xã Vĩnh Thịnh",
      "Xã Vĩnh An"
    ]
  },
  {
    "newWardId": "40103010",
    "newWardName": "Bỉm Sơn",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14785",
      "14773",
      "14776",
      "15277"
    ],
    "oldWardNames": [
      "Phường Đông Sơn",
      "Phường Lam Sơn",
      "Phường Ba Đình",
      "Xã Hà Vinh"
    ]
  },
  {
    "newWardId": "40153020",
    "newWardName": "Các Sơn",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16579",
      "16591"
    ],
    "oldWardNames": [
      "Xã Anh Sơn",
      "Xã Các Sơn"
    ]
  },
  {
    "newWardId": "40115139",
    "newWardName": "Cẩm Tân",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15172",
      "15181",
      "15178"
    ],
    "oldWardNames": [
      "Xã Cẩm Long",
      "Xã Cẩm Phú",
      "Xã Cẩm Tân"
    ]
  },
  {
    "newWardId": "40115135",
    "newWardName": "Cẩm Thạch",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15133",
      "15145",
      "15151",
      "15142"
    ],
    "oldWardNames": [
      "Xã Cẩm Thành",
      "Xã Cẩm Liên",
      "Xã Cẩm Bình",
      "Xã Cẩm Thạch"
    ]
  },
  {
    "newWardId": "40115136",
    "newWardName": "Cẩm Thủy",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15127",
      "15169"
    ],
    "oldWardNames": [
      "Thị trấn Phong Sơn",
      "Xã Cẩm Ngọc"
    ]
  },
  {
    "newWardId": "40115137",
    "newWardName": "Cẩm Tú",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15136",
      "15148",
      "15139",
      "15154"
    ],
    "oldWardNames": [
      "Xã Cẩm Quý",
      "Xã Cẩm Giang",
      "Xã Cẩm Lương",
      "Xã Cẩm Tú"
    ]
  },
  {
    "newWardId": "40115138",
    "newWardName": "Cẩm Vân",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15163",
      "15160",
      "15175",
      "15184"
    ],
    "oldWardNames": [
      "Xã Cẩm Tâm",
      "Xã Cẩm Châu",
      "Xã Cẩm Yên",
      "Xã Cẩm Vân"
    ]
  },
  {
    "newWardId": "40113124",
    "newWardName": "Cổ Lũng",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14959",
      "14965"
    ],
    "oldWardNames": [
      "Xã Lũng Cao",
      "Xã Cổ Lũng"
    ]
  },
  {
    "newWardId": "40151059",
    "newWardName": "Công Chính",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16354",
      "16375",
      "16369",
      "16273"
    ],
    "oldWardNames": [
      "Xã Công Liêm",
      "Xã Yên Mỹ",
      "Xã Công Chính",
      "Xã Thanh Tân"
    ]
  },
  {
    "newWardId": "40113126",
    "newWardName": "Điền Lư",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14944",
      "14935",
      "14950"
    ],
    "oldWardNames": [
      "Xã Ái Thượng",
      "Xã Điền Trung",
      "Xã Điền Lư"
    ]
  },
  {
    "newWardId": "40113127",
    "newWardName": "Điền Quang",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14926",
      "14929",
      "14932"
    ],
    "oldWardNames": [
      "Xã Điền Thượng",
      "Xã Điền Hạ",
      "Xã Điền Quang"
    ]
  },
  {
    "newWardId": "40135071",
    "newWardName": "Định Hòa",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15478",
      "15454",
      "15451",
      "15448",
      "15793"
    ],
    "oldWardNames": [
      "Xã Định Bình",
      "Xã Định Công",
      "Xã Định Thành",
      "Xã Định Hòa",
      "Xã Thiệu Long"
    ]
  },
  {
    "newWardId": "40135070",
    "newWardName": "Định Tân",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15475",
      "15472",
      "15460",
      "15457"
    ],
    "oldWardNames": [
      "Xã Định Hải",
      "Xã Định Hưng",
      "Xã Định Tiến",
      "Xã Định Tân"
    ]
  },
  {
    "newWardId": "40117116",
    "newWardName": "Đồng Lương",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15046",
      "15058"
    ],
    "oldWardNames": [
      "Xã Tân Phúc",
      "Xã Đồng Lương"
    ]
  },
  {
    "newWardId": "40101003",
    "newWardName": "Đông Quang",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14803",
      "16429",
      "16426",
      "16393",
      "16417",
      "16420",
      "16423",
      "16435"
    ],
    "oldWardNames": [
      "Phường Quảng Thắng",
      "Xã Đông Vinh",
      "Xã Đông Quang",
      "Xã Đông Yên",
      "Xã Đông Văn",
      "Xã Đông Phú",
      "Xã Đông Nam",
      "Phường An Hưng"
    ]
  },
  {
    "newWardId": "40101004",
    "newWardName": "Đông Sơn",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16378",
      "16414",
      "16432",
      "16390",
      "16399",
      "16381",
      "16408",
      "16384"
    ],
    "oldWardNames": [
      "Phường Rừng Thông",
      "Phường Đông Thịnh",
      "Phường Đông Tân",
      "Xã Đông Hòa",
      "Xã Đông Minh",
      "Xã Đông Hoàng",
      "Xã Đông Khê",
      "Xã Đông Ninh"
    ]
  },
  {
    "newWardId": "40139028",
    "newWardName": "Đông Thành",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16015",
      "16036",
      "16033",
      "16042"
    ],
    "oldWardNames": [
      "Xã Đồng Lộc",
      "Xã Thành Lộc",
      "Xã Cầu Lộc",
      "Xã Tuy Lộc"
    ]
  },
  {
    "newWardId": "40101005",
    "newWardName": "Đông Tiến",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16396",
      "15856",
      "16402",
      "15850",
      "15847",
      "15853",
      "16405"
    ],
    "oldWardNames": [
      "Phường Đông Lĩnh",
      "Phường Thiệu Khánh",
      "Xã Đông Thanh",
      "Xã Thiệu Vân",
      "Xã Tân Châu",
      "Xã Thiệu Giao",
      "Xã Đông Tiến"
    ]
  },
  {
    "newWardId": "40147090",
    "newWardName": "Đồng Tiến",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15721",
      "15727",
      "15724"
    ],
    "oldWardNames": [
      "Xã Đồng Lợi",
      "Xã Đồng Thắng",
      "Xã Đồng Tiến"
    ]
  },
  {
    "newWardId": "40117118",
    "newWardName": "Giao An",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15043",
      "15040"
    ],
    "oldWardNames": [
      "Xã Giao Thiện",
      "Xã Giao An"
    ]
  },
  {
    "newWardId": "40131024",
    "newWardName": "Hà Long",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15274",
      "15280",
      "15292"
    ],
    "oldWardNames": [
      "Thị trấn Hà Long",
      "Xã Hà Bắc",
      "Xã Hà Giang"
    ]
  },
  {
    "newWardId": "40131022",
    "newWardName": "Hà Trung",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15319",
      "15304",
      "15307",
      "15271",
      "15328"
    ],
    "oldWardNames": [
      "Xã Hà Đông",
      "Xã Hà Ngọc",
      "Xã Yến Sơn",
      "Thị trấn Hà Trung",
      "Xã Hà Bình"
    ]
  },
  {
    "newWardId": "40101001",
    "newWardName": "Hạc Thành",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14770",
      "14773",
      "14776",
      "14779",
      "14785",
      "14764",
      "14767",
      "14794",
      "14797",
      "14782",
      "14758",
      "16435"
    ],
    "oldWardNames": [
      "Phường Phú Sơn",
      "Phường Lam Sơn",
      "Phường Ba Đình",
      "Phường Ngọc Trạo",
      "Phường Đông Sơn",
      "Phường Trường Thi",
      "Phường Điện Biên",
      "Phường Đông Hương",
      "Phường Đông Hải",
      "Phường Đông Vệ",
      "Phường Đông Thọ",
      "Phường An Hưng"
    ]
  },
  {
    "newWardId": "40153017",
    "newWardName": "Hải Bình",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16645",
      "16642",
      "16633"
    ],
    "oldWardNames": [
      "Phường Mai Lâm",
      "Phường Tĩnh Hải",
      "Phường Hải Bình"
    ]
  },
  {
    "newWardId": "40153014",
    "newWardName": "Hải Lĩnh",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15475",
      "16606",
      "16597"
    ],
    "oldWardNames": [
      "Xã Định Hải",
      "Phường Ninh Hải",
      "Phường Hải Lĩnh"
    ]
  },
  {
    "newWardId": "40101006",
    "newWardName": "Hàm Rồng",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15859",
      "14791",
      "14761",
      "14755",
      "14758"
    ],
    "oldWardNames": [
      "Phường Thiệu Dương",
      "Phường Đông Cương",
      "Phường Nam Ngạn",
      "Phường Hàm Rồng",
      "Phường Đông Thọ"
    ]
  },
  {
    "newWardId": "40139029",
    "newWardName": "Hậu Lộc",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16012",
      "16048",
      "16045",
      "16030"
    ],
    "oldWardNames": [
      "Thị trấn Hậu Lộc",
      "Xã Thuần Lộc",
      "Xã Mỹ Lộc",
      "Xã Lộc Sơn"
    ]
  },
  {
    "newWardId": "40109102",
    "newWardName": "Hiền Kiệt",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14896",
      "14899"
    ],
    "oldWardNames": [
      "Xã Hiền Chung",
      "Xã Hiền Kiệt"
    ]
  },
  {
    "newWardId": "40139030",
    "newWardName": "Hoa Lộc",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15643",
      "16066",
      "16069",
      "16072",
      "16075",
      "16063"
    ],
    "oldWardNames": [
      "Xã Xuân Lộc",
      "Xã Liên Lộc",
      "Xã Quang Lộc",
      "Xã Phú Lộc",
      "Xã Hòa Lộc",
      "Xã Hoa Lộc"
    ]
  },
  {
    "newWardId": "40125149",
    "newWardName": "Hóa Quỳ",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16204",
      "16186"
    ],
    "oldWardNames": [
      "Xã Bình Lương",
      "Xã Hóa Quỳ"
    ]
  },
  {
    "newWardId": "40131025",
    "newWardName": "Hoạt Giang",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15286",
      "15283",
      "15271",
      "15328"
    ],
    "oldWardNames": [
      "Xã Yên Dương",
      "Xã Hoạt Giang",
      "Thị trấn Hà Trung",
      "Xã Hà Bình"
    ]
  },
  {
    "newWardId": "40143042",
    "newWardName": "Hoằng Châu",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15949",
      "15973",
      "15976",
      "15979"
    ],
    "oldWardNames": [
      "Xã Hoằng Thắng",
      "Xã Hoằng Phong",
      "Xã Hoằng Lưu",
      "Xã Hoằng Châu"
    ]
  },
  {
    "newWardId": "40143045",
    "newWardName": "Hoằng Giang",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15877",
      "15886",
      "15919",
      "15880"
    ],
    "oldWardNames": [
      "Xã Hoằng Xuân",
      "Xã Hoằng Quỳ",
      "Xã Hoằng Hợp",
      "Xã Hoằng Giang"
    ]
  },
  {
    "newWardId": "40143038",
    "newWardName": "Hoằng Hóa",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15865",
      "15928",
      "15952",
      "15946",
      "15937",
      "15940"
    ],
    "oldWardNames": [
      "Thị trấn Bút Sơn",
      "Xã Hoằng Đức",
      "Xã Hoằng Đồng",
      "Xã Hoằng Đạo",
      "Xã Hoằng Hà",
      "Xã Hoằng Đạt"
    ]
  },
  {
    "newWardId": "40143041",
    "newWardName": "Hoằng Lộc",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15958",
      "15955",
      "15961",
      "15967",
      "15982",
      "15964"
    ],
    "oldWardNames": [
      "Xã Hoằng Thịnh",
      "Xã Hoằng Thái",
      "Xã Hoằng Thành",
      "Xã Hoằng Trạch",
      "Xã Hoằng Tân",
      "Xã Hoằng Lộc"
    ]
  },
  {
    "newWardId": "40143044",
    "newWardName": "Hoằng Phú",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15916",
      "15889",
      "15892",
      "15883"
    ],
    "oldWardNames": [
      "Xã Hoằng Quý",
      "Xã Hoằng Kim",
      "Xã Hoằng Trung",
      "Xã Hoằng Phú"
    ]
  },
  {
    "newWardId": "40143043",
    "newWardName": "Hoằng Sơn",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15895",
      "15910",
      "15907",
      "15901"
    ],
    "oldWardNames": [
      "Xã Hoằng Trinh",
      "Xã Hoằng Xuyên",
      "Xã Hoằng Cát",
      "Xã Hoằng Sơn"
    ]
  },
  {
    "newWardId": "40143040",
    "newWardName": "Hoằng Thanh",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15997",
      "15994",
      "16003",
      "16000"
    ],
    "oldWardNames": [
      "Xã Hoằng Đông",
      "Xã Hoằng Ngọc",
      "Xã Hoằng Phụ",
      "Xã Hoằng Thanh"
    ]
  },
  {
    "newWardId": "40143039",
    "newWardName": "Hoằng Tiến",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15985",
      "15991",
      "16006",
      "15988"
    ],
    "oldWardNames": [
      "Xã Hoằng Yến",
      "Xã Hoằng Hải",
      "Xã Hoằng Trường",
      "Xã Hoằng Tiến"
    ]
  },
  {
    "newWardId": "40133034",
    "newWardName": "Hồ Vương",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16138",
      "16141",
      "16135",
      "16159"
    ],
    "oldWardNames": [
      "Xã Nga Hải",
      "Xã Nga Thành",
      "Xã Nga Giáp",
      "Xã Nga Liên"
    ]
  },
  {
    "newWardId": "40109099",
    "newWardName": "Hồi Xuân",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14869",
      "14911"
    ],
    "oldWardNames": [
      "Thị trấn Hồi Xuân",
      "Xã Phú Nghiêm"
    ]
  },
  {
    "newWardId": "40147087",
    "newWardName": "Hợp Tiến",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15676",
      "15688",
      "15682",
      "15685",
      "15679"
    ],
    "oldWardNames": [
      "Xã Hợp Lý",
      "Xã Hợp Thắng",
      "Xã Hợp Thành",
      "Xã Triệu Thành",
      "Xã Hợp Tiến"
    ]
  },
  {
    "newWardId": "40121134",
    "newWardName": "Kiên Thọ",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15112",
      "15109",
      "15118"
    ],
    "oldWardNames": [
      "Xã Phúc Thịnh",
      "Xã Phùng Minh",
      "Xã Kiên Thọ"
    ]
  },
  {
    "newWardId": "40119140",
    "newWardName": "Kim Tân",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15187",
      "15265",
      "15253",
      "15214",
      "15241",
      "15256"
    ],
    "oldWardNames": [
      "Thị trấn Kim Tân",
      "Xã Thành Hưng",
      "Xã Thành Thọ",
      "Xã Thạch Định",
      "Xã Thành Trực",
      "Xã Thành Tiến"
    ]
  },
  {
    "newWardId": "40137076",
    "newWardName": "Lam Sơn",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15556",
      "15547",
      "15544"
    ],
    "oldWardNames": [
      "Thị trấn Lam Sơn",
      "Xã Xuân Bái",
      "Xã Thọ Xương"
    ]
  },
  {
    "newWardId": "40117115",
    "newWardName": "Linh Sơn",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15055",
      "15037"
    ],
    "oldWardNames": [
      "Thị trấn Lang Chánh",
      "Xã Trí Nang"
    ]
  },
  {
    "newWardId": "40131026",
    "newWardName": "Lĩnh Toại",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15343",
      "15334",
      "15331",
      "15298"
    ],
    "oldWardNames": [
      "Xã Hà Hải",
      "Xã Hà Châu",
      "Xã Thái Lai",
      "Xã Lĩnh Toại"
    ]
  },
  {
    "newWardId": "40123162",
    "newWardName": "Luận Thành",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15631",
      "15634",
      "15637"
    ],
    "oldWardNames": [
      "Xã Xuân Cao",
      "Xã Luận Thành",
      "Xã Luận Khê"
    ]
  },
  {
    "newWardId": "40123160",
    "newWardName": "Lương Sơn",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15628"
    ],
    "oldWardNames": [
      "Xã Lương Sơn"
    ]
  },
  {
    "newWardId": "40149046",
    "newWardName": "Lưu Vệ",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16438",
      "16453",
      "16456"
    ],
    "oldWardNames": [
      "Thị trấn Tân Phong",
      "Xã Quảng Đức",
      "Xã Quảng Định"
    ]
  },
  {
    "newWardId": "40127153",
    "newWardName": "Mậu Lâm",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16249",
      "16243"
    ],
    "oldWardNames": [
      "Xã Phú Nhuận",
      "Xã Mậu Lâm"
    ]
  },
  {
    "newWardId": "40121132",
    "newWardName": "Minh Sơn",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15124",
      "15064",
      "15079",
      "15121"
    ],
    "oldWardNames": [
      "Xã Minh Sơn",
      "Xã Lam Sơn",
      "Xã Cao Ngọc",
      "Xã Minh Tiến"
    ]
  },
  {
    "newWardId": "40107091",
    "newWardName": "Mường Chanh",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14866"
    ],
    "oldWardNames": [
      "Xã Mường Chanh"
    ]
  },
  {
    "newWardId": "40107094",
    "newWardName": "Mường Lát",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14845"
    ],
    "oldWardNames": [
      "Thị trấn Mường Lát"
    ]
  },
  {
    "newWardId": "40107097",
    "newWardName": "Mường Lý",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14854"
    ],
    "oldWardNames": [
      "Xã Mường Lý"
    ]
  },
  {
    "newWardId": "40111110",
    "newWardName": "Mường Mìn",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15025"
    ],
    "oldWardNames": [
      "Xã Mường Mìn"
    ]
  },
  {
    "newWardId": "40111107",
    "newWardName": "Na Mèo",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15013"
    ],
    "oldWardNames": [
      "Xã Na Mèo"
    ]
  },
  {
    "newWardId": "40105009",
    "newWardName": "Nam Sầm Sơn",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16534",
      "16513",
      "16516",
      "16519"
    ],
    "oldWardNames": [
      "Phường Quảng Vinh",
      "Xã Quảng Minh",
      "Xã Đại Hùng",
      "Xã Quảng Giao"
    ]
  },
  {
    "newWardId": "40109100",
    "newWardName": "Nam Xuân",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14902",
      "14914"
    ],
    "oldWardNames": [
      "Xã Nam Tiến",
      "Xã Nam Xuân"
    ]
  },
  {
    "newWardId": "40133036",
    "newWardName": "Nga An",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16150",
      "16147",
      "16144"
    ],
    "oldWardNames": [
      "Xã Nga Điền",
      "Xã Nga Phú",
      "Xã Nga An"
    ]
  },
  {
    "newWardId": "40133032",
    "newWardName": "Nga Sơn",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16093",
      "16132",
      "16123",
      "16120",
      "16156"
    ],
    "oldWardNames": [
      "Thị trấn Nga Sơn",
      "Xã Nga Yên",
      "Xã Nga Thanh",
      "Xã Nga Hiệp",
      "Xã Nga Thủy"
    ]
  },
  {
    "newWardId": "40133033",
    "newWardName": "Nga Thắng",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16102",
      "16114",
      "16165",
      "16168"
    ],
    "oldWardNames": [
      "Xã Nga Văn",
      "Xã Nga Phượng",
      "Xã Nga Thạch",
      "Xã Nga Thắng"
    ]
  },
  {
    "newWardId": "40153019",
    "newWardName": "Nghi Sơn",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16654",
      "16660",
      "16657"
    ],
    "oldWardNames": [
      "Phường Hải Thượng",
      "Xã Hải Hà",
      "Xã Nghi Sơn"
    ]
  },
  {
    "newWardId": "40121129",
    "newWardName": "Ngọc Lặc",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15061",
      "15067",
      "15070"
    ],
    "oldWardNames": [
      "Thị trấn Ngọc Lặc",
      "Xã Mỹ Tân",
      "Xã Thúy Sơn"
    ]
  },
  {
    "newWardId": "40121131",
    "newWardName": "Ngọc Liên",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15097",
      "15100",
      "15094",
      "15103",
      "15091"
    ],
    "oldWardNames": [
      "Xã Lộc Thịnh",
      "Xã Cao Thịnh",
      "Xã Ngọc Sơn",
      "Xã Ngọc Trung",
      "Xã Ngọc Liên"
    ]
  },
  {
    "newWardId": "40153012",
    "newWardName": "Ngọc Sơn",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16222",
      "16567",
      "16564",
      "16576"
    ],
    "oldWardNames": [
      "Xã Thanh Sơn",
      "Xã Thanh Thủy",
      "Phường Hải Châu",
      "Phường Hải Ninh"
    ]
  },
  {
    "newWardId": "40119142",
    "newWardName": "Ngọc Trạo",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15250",
      "15259",
      "15247",
      "15268"
    ],
    "oldWardNames": [
      "Xã Thành An",
      "Xã Thành Long",
      "Xã Thành Tâm",
      "Xã Ngọc Trạo"
    ]
  },
  {
    "newWardId": "40121133",
    "newWardName": "Nguyệt Ấn",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15106",
      "15115"
    ],
    "oldWardNames": [
      "Xã Phùng Giáo",
      "Xã Vân Am",
      "Xã Nguyệt Ấn"
    ]
  },
  {
    "newWardId": "40101007",
    "newWardName": "Nguyệt Viên",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15913",
      "15922",
      "15925",
      "15970"
    ],
    "oldWardNames": [
      "Phường Tào Xuyên",
      "Phường Long Anh",
      "Phường Hoằng Quang",
      "Phường Hoằng Đại"
    ]
  },
  {
    "newWardId": "40107096",
    "newWardName": "Nhi Sơn",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14864"
    ],
    "oldWardNames": [
      "Xã Nhi Sơn"
    ]
  },
  {
    "newWardId": "40127154",
    "newWardName": "Như Thanh",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16228",
      "16246",
      "16252",
      "15415"
    ],
    "oldWardNames": [
      "Thị trấn Bến Sung",
      "Xã Xuân Khang",
      "Xã Hải Long",
      "Xã Yên Thọ"
    ]
  },
  {
    "newWardId": "40125146",
    "newWardName": "Như Xuân",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16174",
      "16201"
    ],
    "oldWardNames": [
      "Thị trấn Yên Cát",
      "Xã Tân Bình"
    ]
  },
  {
    "newWardId": "40151053",
    "newWardName": "Nông Cống",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16279",
      "16333",
      "16327",
      "16339",
      "16321",
      "16324"
    ],
    "oldWardNames": [
      "Thị trấn Nông Cống",
      "Xã Vạn Thắng",
      "Xã Vạn Hòa",
      "Xã Vạn Thiện",
      "Xã Minh Nghĩa",
      "Xã Minh Khôi"
    ]
  },
  {
    "newWardId": "40109104",
    "newWardName": "Phú Lệ",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14887",
      "14878",
      "14884"
    ],
    "oldWardNames": [
      "Xã Phú Sơn",
      "Xã Phú Thanh",
      "Xã Phú Lệ"
    ]
  },
  {
    "newWardId": "40109103",
    "newWardName": "Phú Xuân",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14890"
    ],
    "oldWardNames": [
      "Xã Phú Xuân"
    ]
  },
  {
    "newWardId": "40113125",
    "newWardName": "Pù Luông",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14872",
      "14956",
      "14968"
    ],
    "oldWardNames": [
      "Xã Thành Sơn",
      "Xã Lũng Niêm",
      "Xã Thành Lâm"
    ]
  },
  {
    "newWardId": "40107095",
    "newWardName": "Pù Nhi",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14863"
    ],
    "oldWardNames": [
      "Xã Pù Nhi"
    ]
  },
  {
    "newWardId": "40111113",
    "newWardName": "Quan Sơn",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14998",
      "15016"
    ],
    "oldWardNames": [
      "Xã Trung Thượng",
      "Thị trấn Sơn Lư"
    ]
  },
  {
    "newWardId": "40149050",
    "newWardName": "Quảng Bình",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16543",
      "16546",
      "16558",
      "16468"
    ],
    "oldWardNames": [
      "Xã Quảng Lưu",
      "Xã Quảng Lộc",
      "Xã Quảng Thái",
      "Xã Quảng Bình"
    ]
  },
  {
    "newWardId": "40107092",
    "newWardName": "Quang Chiểu",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14860"
    ],
    "oldWardNames": [
      "Xã Quang Chiểu"
    ]
  },
  {
    "newWardId": "40149052",
    "newWardName": "Quảng Chính",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16501",
      "16489",
      "16492",
      "16495"
    ],
    "oldWardNames": [
      "Xã Quảng Trường",
      "Xã Quảng Khê",
      "Xã Quảng Trung",
      "Xã Quảng Chính"
    ]
  },
  {
    "newWardId": "40149048",
    "newWardName": "Quảng Ngọc",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16471",
      "16474",
      "16510",
      "16498"
    ],
    "oldWardNames": [
      "Xã Quảng Hợp",
      "Xã Quảng Văn",
      "Xã Quảng Phúc",
      "Xã Quảng Ngọc"
    ]
  },
  {
    "newWardId": "40149049",
    "newWardName": "Quảng Ninh",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16462",
      "16540",
      "16465"
    ],
    "oldWardNames": [
      "Xã Quảng Nhân",
      "Xã Quảng Hải",
      "Xã Quảng Ninh"
    ]
  },
  {
    "newWardId": "40101002",
    "newWardName": "Quảng Phú",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14800",
      "16525",
      "14806",
      "16459",
      "16441",
      "16507",
      "16522"
    ],
    "oldWardNames": [
      "Phường Quảng Hưng",
      "Phường Quảng Tâm",
      "Phường Quảng Thành",
      "Phường Quảng Đông",
      "Phường Quảng Thịnh",
      "Phường Quảng Cát",
      "Phường Quảng Phú"
    ]
  },
  {
    "newWardId": "40103011",
    "newWardName": "Quang Trung",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14809",
      "14779",
      "14770",
      "14824"
    ],
    "oldWardNames": [
      "Phường Bắc Sơn",
      "Phường Ngọc Trạo",
      "Phường Phú Sơn",
      "Xã Quang Trung"
    ]
  },
  {
    "newWardId": "40149047",
    "newWardName": "Quảng Yên",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16447",
      "16483",
      "16477",
      "16480"
    ],
    "oldWardNames": [
      "Xã Quảng Trạch",
      "Xã Quảng Hòa",
      "Xã Quảng Long",
      "Xã Quảng Yên"
    ]
  },
  {
    "newWardId": "40135068",
    "newWardName": "Quý Lộc",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15415",
      "15403",
      "15412"
    ],
    "oldWardNames": [
      "Xã Yên Thọ",
      "Thị trấn Yên Lâm",
      "Thị trấn Quý Lộc"
    ]
  },
  {
    "newWardId": "40113128",
    "newWardName": "Quý Lương",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14947",
      "14953",
      "14941"
    ],
    "oldWardNames": [
      "Xã Lương Nội",
      "Xã Lương Trung",
      "Xã Lương Ngoại"
    ]
  },
  {
    "newWardId": "40137075",
    "newWardName": "Sao Vàng",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15553",
      "15541",
      "15550",
      "15532"
    ],
    "oldWardNames": [
      "Thị trấn Sao Vàng",
      "Xã Thọ Lâm",
      "Xã Xuân Phú",
      "Xã Xuân Sinh"
    ]
  },
  {
    "newWardId": "40105008",
    "newWardName": "Sầm Sơn",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14809",
      "14842",
      "14839",
      "14830",
      "14836",
      "16531",
      "16528"
    ],
    "oldWardNames": [
      "Phường Bắc Sơn",
      "Phường Quảng Tiến",
      "Phường Quảng Cư",
      "Phường Trung Sơn",
      "Phường Trường Sơn",
      "Phường Quảng Châu",
      "Phường Quảng Thọ"
    ]
  },
  {
    "newWardId": "40111109",
    "newWardName": "Sơn Điện",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15022"
    ],
    "oldWardNames": [
      "Xã Sơn Điện"
    ]
  },
  {
    "newWardId": "40111108",
    "newWardName": "Sơn Thủy",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15010"
    ],
    "oldWardNames": [
      "Xã Sơn Thủy"
    ]
  },
  {
    "newWardId": "40111112",
    "newWardName": "Tam Lư",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15004",
      "15019",
      "15016"
    ],
    "oldWardNames": [
      "Xã Sơn Hà",
      "Xã Tam Lư",
      "Thị trấn Sơn Lư"
    ]
  },
  {
    "newWardId": "40111111",
    "newWardName": "Tam Thanh",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15007"
    ],
    "oldWardNames": [
      "Xã Tam Thanh"
    ]
  },
  {
    "newWardId": "40153013",
    "newWardName": "Tân Dân",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16585",
      "16594",
      "16582"
    ],
    "oldWardNames": [
      "Phường Hải An",
      "Phường Tân Dân",
      "Xã Ngọc Lĩnh"
    ]
  },
  {
    "newWardId": "40147089",
    "newWardName": "Tân Ninh",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15718",
      "15715"
    ],
    "oldWardNames": [
      "Thị trấn Nưa",
      "Xã Thái Hòa",
      "Xã Vân Sơn"
    ]
  },
  {
    "newWardId": "40123163",
    "newWardName": "Tân Thành",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15661",
      "15637"
    ],
    "oldWardNames": [
      "Xã Tân Thành",
      "Xã Luận Khê"
    ]
  },
  {
    "newWardId": "40133035",
    "newWardName": "Tân Tiến",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16108",
      "16153",
      "16162"
    ],
    "oldWardNames": [
      "Xã Nga Tiến",
      "Xã Nga Tân",
      "Xã Nga Thái"
    ]
  },
  {
    "newWardId": "40129081",
    "newWardName": "Tây Đô",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15352",
      "15355",
      "15358",
      "15361"
    ],
    "oldWardNames": [
      "Xã Vĩnh Quang",
      "Xã Vĩnh Yên",
      "Xã Vĩnh Tiến",
      "Xã Vĩnh Long"
    ]
  },
  {
    "newWardId": "40119143",
    "newWardName": "Thạch Bình",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15208",
      "15220",
      "15205",
      "15211"
    ],
    "oldWardNames": [
      "Xã Thạch Sơn",
      "Xã Thạch Long",
      "Xã Thạch Cẩm",
      "Xã Thạch Bình"
    ]
  },
  {
    "newWardId": "40121130",
    "newWardName": "Thạch Lập",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14824",
      "15088",
      "15073"
    ],
    "oldWardNames": [
      "Xã Quang Trung",
      "Xã Đồng Thịnh",
      "Xã Thạch Lập"
    ]
  },
  {
    "newWardId": "40119145",
    "newWardName": "Thạch Quảng",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15196",
      "15202",
      "15199"
    ],
    "oldWardNames": [
      "Xã Thạch Lâm",
      "Xã Thạch Tượng",
      "Xã Thạch Quảng"
    ]
  },
  {
    "newWardId": "40127157",
    "newWardName": "Thanh Kỳ",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16276",
      "16273"
    ],
    "oldWardNames": [
      "Xã Thanh Kỳ",
      "Xã Thanh Tân"
    ]
  },
  {
    "newWardId": "40125151",
    "newWardName": "Thanh Phong",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16213",
      "16219",
      "16216"
    ],
    "oldWardNames": [
      "Xã Thanh Hòa",
      "Xã Thanh Lâm",
      "Xã Thanh Phong"
    ]
  },
  {
    "newWardId": "40125150",
    "newWardName": "Thanh Quân",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16222",
      "16210",
      "16207"
    ],
    "oldWardNames": [
      "Xã Thanh Sơn",
      "Xã Thanh Xuân",
      "Xã Thanh Quân"
    ]
  },
  {
    "newWardId": "40119144",
    "newWardName": "Thành Vinh",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15232",
      "15223",
      "15226",
      "15229"
    ],
    "oldWardNames": [
      "Xã Thành Minh",
      "Xã Thành Mỹ",
      "Xã Thành Yên",
      "Xã Thành Vinh"
    ]
  },
  {
    "newWardId": "40151057",
    "newWardName": "Thăng Bình",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16342",
      "16360",
      "16351"
    ],
    "oldWardNames": [
      "Xã Thăng Long",
      "Xã Thăng Thọ",
      "Xã Thăng Bình"
    ]
  },
  {
    "newWardId": "40123165",
    "newWardName": "Thắng Lộc",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15643",
      "15640"
    ],
    "oldWardNames": [
      "Xã Xuân Lộc",
      "Xã Xuân Thắng"
    ]
  },
  {
    "newWardId": "40151054",
    "newWardName": "Thắng Lợi",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14881",
      "16318",
      "16309",
      "16315"
    ],
    "oldWardNames": [
      "Xã Trung Thành",
      "Xã Tế Nông",
      "Xã Tế Thắng",
      "Xã Tế Lợi"
    ]
  },
  {
    "newWardId": "40109101",
    "newWardName": "Thiên Phủ",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14917",
      "14908"
    ],
    "oldWardNames": [
      "Xã Nam Động",
      "Xã Thiên Phủ"
    ]
  },
  {
    "newWardId": "40113122",
    "newWardName": "Thiết Ống",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14986",
      "14980"
    ],
    "oldWardNames": [
      "Xã Thiết Kế",
      "Xã Thiết Ống"
    ]
  },
  {
    "newWardId": "40141060",
    "newWardName": "Thiệu Hóa",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15781",
      "15787",
      "15802",
      "15772",
      "15793"
    ],
    "oldWardNames": [
      "Xã Thiệu Phúc",
      "Xã Thiệu Công",
      "Xã Thiệu Nguyên",
      "Thị trấn Thiệu Hóa",
      "Xã Thiệu Long"
    ]
  },
  {
    "newWardId": "40141061",
    "newWardName": "Thiệu Quang",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15799",
      "15805",
      "15808",
      "15796",
      "15811",
      "15772"
    ],
    "oldWardNames": [
      "Xã Thiệu Duy",
      "Xã Thiệu Hợp",
      "Xã Thiệu Thịnh",
      "Xã Thiệu Giang",
      "Xã Thiệu Quang",
      "Thị trấn Thiệu Hóa"
    ]
  },
  {
    "newWardId": "40141062",
    "newWardName": "Thiệu Tiến",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15775",
      "15778",
      "15814",
      "15784"
    ],
    "oldWardNames": [
      "Xã Thiệu Ngọc",
      "Xã Thiệu Vũ",
      "Xã Thiệu Thành",
      "Xã Thiệu Tiến"
    ]
  },
  {
    "newWardId": "40141063",
    "newWardName": "Thiệu Toán",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15829",
      "15820",
      "15823",
      "15817"
    ],
    "oldWardNames": [
      "Thị trấn Hậu Hiền",
      "Xã Thiệu Chính",
      "Xã Thiệu Hòa",
      "Xã Thiệu Toán"
    ]
  },
  {
    "newWardId": "40141064",
    "newWardName": "Thiệu Trung",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15838",
      "15835",
      "15832",
      "15841",
      "15772"
    ],
    "oldWardNames": [
      "Xã Thiệu Vận",
      "Xã Thiệu Lý",
      "Xã Thiệu Viên",
      "Xã Thiệu Trung",
      "Thị trấn Thiệu Hóa"
    ]
  },
  {
    "newWardId": "40147084",
    "newWardName": "Thọ Bình",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15667",
      "15769",
      "15670"
    ],
    "oldWardNames": [
      "Xã Thọ Sơn",
      "Xã Bình Sơn",
      "Xã Thọ Bình"
    ]
  },
  {
    "newWardId": "40137077",
    "newWardName": "Thọ Lập",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15559",
      "15565",
      "15568"
    ],
    "oldWardNames": [
      "Xã Xuân Thiên",
      "Xã Thuận Minh",
      "Xã Thọ Lập"
    ]
  },
  {
    "newWardId": "40137073",
    "newWardName": "Thọ Long",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15511",
      "15508",
      "15505",
      "15502",
      "15523"
    ],
    "oldWardNames": [
      "Xã Thọ Lộc",
      "Xã Xuân Phong",
      "Xã Nam Giang",
      "Xã Bắc Lương",
      "Xã Tây Hồ"
    ]
  },
  {
    "newWardId": "40147085",
    "newWardName": "Thọ Ngọc",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15673",
      "15745",
      "15754",
      "15751"
    ],
    "oldWardNames": [
      "Xã Thọ Tiến",
      "Xã Xuân Thọ",
      "Xã Thọ Cường",
      "Xã Thọ Ngọc"
    ]
  },
  {
    "newWardId": "40147086",
    "newWardName": "Thọ Phú",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15643",
      "15742",
      "15763",
      "15748",
      "15760"
    ],
    "oldWardNames": [
      "Xã Xuân Lộc",
      "Xã Thọ Dân",
      "Xã Thọ Thế",
      "Xã Thọ Tân",
      "Xã Thọ Phú"
    ]
  },
  {
    "newWardId": "40137072",
    "newWardName": "Thọ Xuân",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15499",
      "15493",
      "15514",
      "15526"
    ],
    "oldWardNames": [
      "Thị trấn Thọ Xuân",
      "Xã Xuân Hồng",
      "Xã Xuân Trường",
      "Xã Xuân Giang"
    ]
  },
  {
    "newWardId": "40125147",
    "newWardName": "Thượng Ninh",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16198",
      "16195",
      "16225"
    ],
    "oldWardNames": [
      "Xã Cát Tân",
      "Xã Cát Vân",
      "Xã Thượng Ninh"
    ]
  },
  {
    "newWardId": "40123161",
    "newWardName": "Thường Xuân",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15646",
      "15652",
      "15655",
      "15649"
    ],
    "oldWardNames": [
      "Thị trấn Thường Xuân",
      "Xã Thọ Thanh",
      "Xã Ngọc Phụng",
      "Xã Xuân Dương"
    ]
  },
  {
    "newWardId": "40149051",
    "newWardName": "Tiên Trang",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16555",
      "16552",
      "16549"
    ],
    "oldWardNames": [
      "Xã Quảng Thạch",
      "Xã Quảng Nham",
      "Xã Tiên Trang"
    ]
  },
  {
    "newWardId": "40153015",
    "newWardName": "Tĩnh Gia",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16561",
      "16618",
      "16621",
      "16612"
    ],
    "oldWardNames": [
      "Phường Hải Hòa",
      "Phường Bình Minh",
      "Phường Hải Thanh",
      "Xã Hải Nhân"
    ]
  },
  {
    "newWardId": "40131023",
    "newWardName": "Tống Sơn",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15316",
      "15325",
      "15322",
      "15313"
    ],
    "oldWardNames": [
      "Thị trấn Hà Lĩnh",
      "Xã Hà Tiến",
      "Xã Hà Tân",
      "Xã Hà Sơn"
    ]
  },
  {
    "newWardId": "40139027",
    "newWardName": "Triệu Lộc",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16018",
      "16027",
      "16021"
    ],
    "oldWardNames": [
      "Xã Đại Lộc",
      "Xã Tiến Lộc",
      "Xã Triệu Lộc"
    ]
  },
  {
    "newWardId": "40147083",
    "newWardName": "Triệu Sơn",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15664",
      "15124",
      "15700",
      "15703",
      "15706"
    ],
    "oldWardNames": [
      "Thị trấn Triệu Sơn",
      "Xã Minh Sơn",
      "Xã Dân Lực",
      "Xã Dân Lý",
      "Xã Dân Quyền"
    ]
  },
  {
    "newWardId": "40153018",
    "newWardName": "Trúc Lâm",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16630",
      "14887",
      "16624",
      "16639"
    ],
    "oldWardNames": [
      "Phường Trúc Lâm",
      "Xã Phú Sơn",
      "Xã Phú Lâm",
      "Xã Tùng Lâm"
    ]
  },
  {
    "newWardId": "40151055",
    "newWardName": "Trung Chính",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15046",
      "16285",
      "16291",
      "16288",
      "16294",
      "16297"
    ],
    "oldWardNames": [
      "Xã Tân Phúc",
      "Xã Tân Thọ",
      "Xã Tân Khang",
      "Xã Hoàng Sơn",
      "Xã Hoàng Giang",
      "Xã Trung Chính"
    ]
  },
  {
    "newWardId": "40111114",
    "newWardName": "Trung Hạ",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14999",
      "14995",
      "15001"
    ],
    "oldWardNames": [
      "Xã Trung Tiến",
      "Xã Trung Xuân",
      "Xã Trung Hạ"
    ]
  },
  {
    "newWardId": "40107098",
    "newWardName": "Trung Lý",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14857"
    ],
    "oldWardNames": [
      "Xã Trung Lý"
    ]
  },
  {
    "newWardId": "40109106",
    "newWardName": "Trung Sơn",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14830"
    ],
    "oldWardNames": [
      "Phường Trung Sơn"
    ]
  },
  {
    "newWardId": "40109105",
    "newWardName": "Trung Thành",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14872",
      "14881"
    ],
    "oldWardNames": [
      "Xã Thành Sơn",
      "Xã Trung Thành"
    ]
  },
  {
    "newWardId": "40153021",
    "newWardName": "Trường Lâm",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16636",
      "16648"
    ],
    "oldWardNames": [
      "Xã Tân Trường",
      "Xã Trường Lâm"
    ]
  },
  {
    "newWardId": "40151056",
    "newWardName": "Trường Văn",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16345",
      "16330",
      "16348",
      "16336"
    ],
    "oldWardNames": [
      "Xã Trường Minh",
      "Xã Trường Trung",
      "Xã Trường Sơn",
      "Xã Trường Giang"
    ]
  },
  {
    "newWardId": "40151058",
    "newWardName": "Tượng Lĩnh",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16366",
      "16357",
      "16363"
    ],
    "oldWardNames": [
      "Xã Tượng Sơn",
      "Xã Tượng Văn",
      "Xã Tượng Lĩnh"
    ]
  },
  {
    "newWardId": "40139031",
    "newWardName": "Vạn Lộc",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16078",
      "16084",
      "16081",
      "16090",
      "16087"
    ],
    "oldWardNames": [
      "Xã Minh Lộc",
      "Xã Hải Lộc",
      "Xã Hưng Lộc",
      "Xã Ngư Lộc",
      "Xã Đa Lộc"
    ]
  },
  {
    "newWardId": "40123164",
    "newWardName": "Vạn Xuân",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15622"
    ],
    "oldWardNames": [
      "Xã Vạn Xuân"
    ]
  },
  {
    "newWardId": "40113121",
    "newWardName": "Văn Nho",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14974",
      "14977"
    ],
    "oldWardNames": [
      "Xã Kỳ Tân",
      "Xã Văn Nho"
    ]
  },
  {
    "newWardId": "40117117",
    "newWardName": "Văn Phú",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15049",
      "15052"
    ],
    "oldWardNames": [
      "Xã Tam Văn",
      "Xã Lâm Phú"
    ]
  },
  {
    "newWardId": "40119141",
    "newWardName": "Vân Du",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15190",
      "15235",
      "15238"
    ],
    "oldWardNames": [
      "Thị trấn Vân Du",
      "Xã Thành Công",
      "Xã Thành Tân"
    ]
  },
  {
    "newWardId": "40129080",
    "newWardName": "Vĩnh Lộc",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15349",
      "15385",
      "15364",
      "15367",
      "15376"
    ],
    "oldWardNames": [
      "Thị trấn Vĩnh Lộc",
      "Xã Ninh Khang",
      "Xã Vĩnh Phúc",
      "Xã Vĩnh Hưng",
      "Xã Vĩnh Hòa"
    ]
  },
  {
    "newWardId": "40125148",
    "newWardName": "Xuân Bình",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15517",
      "16177",
      "16183"
    ],
    "oldWardNames": [
      "Xã Xuân Hòa",
      "Xã Bãi Trành",
      "Xã Xuân Bình"
    ]
  },
  {
    "newWardId": "40123166",
    "newWardName": "Xuân Chinh",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15619",
      "15658"
    ],
    "oldWardNames": [
      "Xã Xuân Lẹ",
      "Xã Xuân Chinh"
    ]
  },
  {
    "newWardId": "40127152",
    "newWardName": "Xuân Du",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16231",
      "16240",
      "16234"
    ],
    "oldWardNames": [
      "Xã Cán Khê",
      "Xã Phượng Nghi",
      "Xã Xuân Du"
    ]
  },
  {
    "newWardId": "40137074",
    "newWardName": "Xuân Hòa",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15517",
      "15520",
      "15538",
      "15535"
    ],
    "oldWardNames": [
      "Xã Xuân Hòa",
      "Xã Thọ Hải",
      "Xã Thọ Diên",
      "Xã Xuân Hưng"
    ]
  },
  {
    "newWardId": "40137079",
    "newWardName": "Xuân Lập",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15592",
      "15583",
      "15598",
      "15586"
    ],
    "oldWardNames": [
      "Xã Xuân Minh",
      "Xã Xuân Lai",
      "Xã Trường Xuân",
      "Xã Xuân Lập"
    ]
  },
  {
    "newWardId": "40127156",
    "newWardName": "Xuân Thái",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16258"
    ],
    "oldWardNames": [
      "Xã Xuân Thái"
    ]
  },
  {
    "newWardId": "40137078",
    "newWardName": "Xuân Tín",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "14890",
      "15571",
      "15574"
    ],
    "oldWardNames": [
      "Xã Phú Xuân",
      "Xã Quảng Phú",
      "Xã Xuân Tín"
    ]
  },
  {
    "newWardId": "40135065",
    "newWardName": "Yên Định",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15469",
      "15466",
      "15463",
      "15445"
    ],
    "oldWardNames": [
      "Thị trấn Quán Lào",
      "Xã Định Liên",
      "Xã Định Long",
      "Xã Định Tăng"
    ]
  },
  {
    "newWardId": "40117119",
    "newWardName": "Yên Khương",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15031"
    ],
    "oldWardNames": [
      "Xã Yên Khương"
    ]
  },
  {
    "newWardId": "40123159",
    "newWardName": "Yên Nhân",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15610"
    ],
    "oldWardNames": [
      "Xã Yên Nhân"
    ]
  },
  {
    "newWardId": "40135069",
    "newWardName": "Yên Ninh",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15433",
      "15436",
      "15442"
    ],
    "oldWardNames": [
      "Xã Yên Hùng",
      "Xã Yên Thịnh",
      "Xã Yên Ninh"
    ]
  },
  {
    "newWardId": "40135067",
    "newWardName": "Yên Phú",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15397",
      "15406",
      "15409"
    ],
    "oldWardNames": [
      "Thị trấn Thống Nhất",
      "Xã Yên Tâm",
      "Xã Yên Phú"
    ]
  },
  {
    "newWardId": "40117120",
    "newWardName": "Yên Thắng",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15034"
    ],
    "oldWardNames": [
      "Xã Yên Thắng"
    ]
  },
  {
    "newWardId": "40127155",
    "newWardName": "Yên Thọ",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "16261",
      "16267",
      "15415"
    ],
    "oldWardNames": [
      "Xã Xuân Phúc",
      "Xã Yên Lạc",
      "Xã Yên Thọ"
    ]
  },
  {
    "newWardId": "40135066",
    "newWardName": "Yên Trường",
    "provinceId": "01",
    "provinceName": "Thanh Hóa",
    "oldWardIds": [
      "15418",
      "15427",
      "15430",
      "15421"
    ],
    "oldWardNames": [
      "Xã Yên Trung",
      "Xã Yên Phong",
      "Xã Yên Thái",
      "Xã Yên Trường"
    ]
  },
  {
    "newWardId": "21513014",
    "newWardName": "An Khánh",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5809",
      "5812",
      "5824"
    ],
    "oldWardNames": [
      "Xã Cù Vân",
      "Xã Hà Thượng",
      "Xã An Khánh"
    ]
  },
  {
    "newWardId": "20703058",
    "newWardName": "Ba Bể",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Cao Thượng",
      "Xã Nam Mẫu",
      "Xã Khang Ninh"
    ]
  },
  {
    "newWardId": "21503035",
    "newWardName": "Bá Xuyên",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5512",
      "5509",
      "5533"
    ],
    "oldWardNames": [
      "Phường Mỏ Chè",
      "Phường Châu Sơn",
      "Xã Bá Xuyên"
    ]
  },
  {
    "newWardId": "21503036",
    "newWardName": "Bách Quang",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5506",
      "5528",
      "5527"
    ],
    "oldWardNames": [
      "Phường Lương Sơn",
      "Phường Bách Quang",
      "Xã Tân Quang"
    ]
  },
  {
    "newWardId": "20711077",
    "newWardName": "Bạch Thông",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đồng Thắng",
      "Xã Dương Phong",
      "Xã Quang Thuận"
    ]
  },
  {
    "newWardId": "20701080",
    "newWardName": "Bắc Kạn",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Sông Cầu",
      "Phường Phùng Chí Kiên",
      "Phường Xuất Hóa",
      "Xã Nông Thượng"
    ]
  },
  {
    "newWardId": "20704055",
    "newWardName": "Bằng Thành",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bộc Bố",
      "Xã Nhạn Môn",
      "Xã Giáo Hiệu",
      "Xã Bằng Thành"
    ]
  },
  {
    "newWardId": "20705064",
    "newWardName": "Bằng Vân",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thượng Ân",
      "Xã Bằng Vân"
    ]
  },
  {
    "newWardId": "21505046",
    "newWardName": "Bình Thành",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5599",
      "5605"
    ],
    "oldWardNames": [
      "Xã Sơn Phú",
      "Xã Bình Thành"
    ]
  },
  {
    "newWardId": "21505042",
    "newWardName": "Bình Yên",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5584",
      "5575",
      "5578",
      "5587"
    ],
    "oldWardNames": [
      "Xã Trung Lương",
      "Xã Định Biên",
      "Xã Thanh Định",
      "Xã Bình Yên"
    ]
  },
  {
    "newWardId": "20704057",
    "newWardName": "Cao Minh",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Công Bằng",
      "Xã Cổ Linh",
      "Xã Cao Tân"
    ]
  },
  {
    "newWardId": "20711075",
    "newWardName": "Cẩm Giàng",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Quân Hà",
      "Xã Nguyên Phúc",
      "Xã Mỹ Thanh",
      "Xã Cẩm Giàng"
    ]
  },
  {
    "newWardId": "20707071",
    "newWardName": "Chợ Đồn",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Bằng Lũng",
      "Xã Ngọc Phái",
      "Xã Phương Viên",
      "Xã Bằng Lãng"
    ]
  },
  {
    "newWardId": "20713090",
    "newWardName": "Chợ Mới",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Đồng Tâm",
      "Xã Quảng Chu",
      "Xã Như Cố"
    ]
  },
  {
    "newWardId": "20703059",
    "newWardName": "Chợ Rã",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Chợ Rã",
      "Xã Thượng Giáo",
      "Xã Địa Linh"
    ]
  },
  {
    "newWardId": "20709085",
    "newWardName": "Côn Minh",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Quang Phong",
      "Xã Dương Sơn",
      "Xã Côn Minh"
    ]
  },
  {
    "newWardId": "20709082",
    "newWardName": "Cường Lợi",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Văn Vũ",
      "Xã Cường Lợi"
    ]
  },
  {
    "newWardId": "21507050",
    "newWardName": "Dân Tiến",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5758",
      "5749",
      "5755"
    ],
    "oldWardNames": [
      "Xã Bình Long",
      "Xã Phương Giao",
      "Xã Dân Tiến"
    ]
  },
  {
    "newWardId": "21501008",
    "newWardName": "Đại Phúc",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5761",
      "5488",
      "5494",
      "5827",
      "5863"
    ],
    "oldWardNames": [
      "Thị trấn Hùng Sơn",
      "Xã Phúc Xuân",
      "Xã Phúc Trìu",
      "Xã Tân Thái",
      "Xã Phúc Tân"
    ]
  },
  {
    "newWardId": "21513009",
    "newWardName": "Đại Từ",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5830",
      "5821",
      "5836",
      "5833"
    ],
    "oldWardNames": [
      "Xã Bình Thuận",
      "Xã Khôi Kỳ",
      "Xã Mỹ Yên",
      "Xã Lục Ba"
    ]
  },
  {
    "newWardId": "21515025",
    "newWardName": "Điềm Thụy",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5968",
      "5956",
      "5941",
      "5932"
    ],
    "oldWardNames": [
      "Xã Hà Châu",
      "Xã Nga My",
      "Xã Điềm Thụy",
      "Xã Thượng Đình"
    ]
  },
  {
    "newWardId": "21505041",
    "newWardName": "Định Hóa",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5569",
      "5560",
      "5554",
      "5572"
    ],
    "oldWardNames": [
      "Thị trấn Chợ Chu",
      "Xã Phúc Chu",
      "Xã Bảo Linh",
      "Xã Đồng Thịnh"
    ]
  },
  {
    "newWardId": "21511028",
    "newWardName": "Đồng Hỷ",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5692",
      "5656",
      "5677",
      "5683"
    ],
    "oldWardNames": [
      "Thị trấn Hóa Thượng",
      "Thị trấn Sông Cầu",
      "Xã Minh Lập",
      "Xã Hóa Trung"
    ]
  },
  {
    "newWardId": "20703062",
    "newWardName": "Đồng Phúc",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Quảng Khê",
      "Xã Hoàng Trĩ",
      "Xã Bằng Phúc",
      "Xã Đồng Phúc"
    ]
  },
  {
    "newWardId": "21513010",
    "newWardName": "Đức Lương",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5770",
      "5767",
      "5776"
    ],
    "oldWardNames": [
      "Xã Minh Tiến",
      "Xã Phúc Lương",
      "Xã Đức Lương"
    ]
  },
  {
    "newWardId": "20701079",
    "newWardName": "Đức Xuân",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Nguyễn Thị Minh Khai",
      "Phường Huyền Tụng",
      "Phường Đức Xuân"
    ]
  },
  {
    "newWardId": "21501004",
    "newWardName": "Gia Sàng",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5473",
      "5914",
      "5461",
      "5467"
    ],
    "oldWardNames": [
      "Phường Hương Sơn",
      "Xã Đồng Liên",
      "Phường Gia Sàng",
      "Phường Cam Giá"
    ]
  },
  {
    "newWardId": "20705067",
    "newWardName": "Hiệp Lực",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thuần Mang",
      "Xã Hiệp Lực"
    ]
  },
  {
    "newWardId": "21509040",
    "newWardName": "Hợp Thành",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5626",
      "5632",
      "5638"
    ],
    "oldWardNames": [
      "Xã Ôn Lương",
      "Xã Phủ Lý",
      "Xã Hợp Thành"
    ]
  },
  {
    "newWardId": "21515026",
    "newWardName": "Kha Sơn",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5953",
      "5947",
      "5962",
      "5965",
      "5959"
    ],
    "oldWardNames": [
      "Xã Lương Phú",
      "Xã Tân Đức",
      "Xã Thanh Ninh",
      "Xã Dương Thành",
      "Xã Kha Sơn"
    ]
  },
  {
    "newWardId": "21505047",
    "newWardName": "Kim Phượng",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5545",
      "5551"
    ],
    "oldWardNames": [
      "Xã Quy Kỳ",
      "Xã Kim Phượng"
    ]
  },
  {
    "newWardId": "21513012",
    "newWardName": "La Bằng",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5818",
      "5803",
      "5815"
    ],
    "oldWardNames": [
      "Xã Hoàng Nông",
      "Xã Tiên Hội",
      "Xã La Bằng"
    ]
  },
  {
    "newWardId": "21507053",
    "newWardName": "La Hiên",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5737",
      "5740"
    ],
    "oldWardNames": [
      "Xã Cúc Đường",
      "Xã La Hiên"
    ]
  },
  {
    "newWardId": "21505048",
    "newWardName": "Lam Vỹ",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5539",
      "5542"
    ],
    "oldWardNames": [
      "Xã Linh Thông",
      "Xã Lam Vỹ"
    ]
  },
  {
    "newWardId": "21501002",
    "newWardName": "Linh Sơn",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5659",
      "5710",
      "5695",
      "5713",
      "5701"
    ],
    "oldWardNames": [
      "Phường Chùa Hang",
      "Phường Đồng Bẩm",
      "Xã Cao Ngạn",
      "Xã Huống Thượng",
      "Xã Linh Sơn"
    ]
  },
  {
    "newWardId": "20705066",
    "newWardName": "Nà Phặc",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Nà Phặc",
      "Xã Trung Hòa"
    ]
  },
  {
    "newWardId": "20709083",
    "newWardName": "Na Rì",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Yến Lạc",
      "Xã Sơn Thành",
      "Xã Kim Lư"
    ]
  },
  {
    "newWardId": "20707068",
    "newWardName": "Nam Cường",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Xuân Lạc",
      "Xã Đồng Lạc",
      "Xã Nam Cường"
    ]
  },
  {
    "newWardId": "21511031",
    "newWardName": "Nam Hòa",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5689",
      "5707"
    ],
    "oldWardNames": [
      "Xã Cây Thị",
      "Xã Nam Hòa"
    ]
  },
  {
    "newWardId": "20705065",
    "newWardName": "Ngân Sơn",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Vân Tùng",
      "Xã Cốc Đán",
      "Xã Đức Vân"
    ]
  },
  {
    "newWardId": "20707073",
    "newWardName": "Nghĩa Tá",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Lương Bằng",
      "Xã Bình Trung",
      "Xã Nghĩa Tá"
    ]
  },
  {
    "newWardId": "20704056",
    "newWardName": "Nghiên Loan",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Xuân La",
      "Xã An Thắng",
      "Xã Nghiên Loan"
    ]
  },
  {
    "newWardId": "21507051",
    "newWardName": "Nghinh Tường",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5728",
      "5722"
    ],
    "oldWardNames": [
      "Xã Vũ Chấn",
      "Xã Nghinh Tường"
    ]
  },
  {
    "newWardId": "21501001",
    "newWardName": "Phan Đình Phùng",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5443",
      "5437",
      "5458",
      "5446",
      "5440",
      "5452",
      "5449",
      "5461"
    ],
    "oldWardNames": [
      "Phường Trưng Vương",
      "Phường Túc Duyên",
      "Phường Đồng Quang",
      "Phường Quang Trung",
      "Phường Hoàng Văn Thụ",
      "Phường Tân Thịnh",
      "Phường Phan Đình Phùng",
      "Phường Gia Sàng"
    ]
  },
  {
    "newWardId": "20701078",
    "newWardName": "Phong Quang",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Dương Quang",
      "Xã Đôn Phong"
    ]
  },
  {
    "newWardId": "21517018",
    "newWardName": "Phổ Yên",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5860",
      "5869",
      "5854"
    ],
    "oldWardNames": [
      "Phường Ba Hàng",
      "Phường Hồng Tiến",
      "Phường Bãi Bông",
      "Xã Đắc Sơn"
    ]
  },
  {
    "newWardId": "21515023",
    "newWardName": "Phú Bình",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5908",
      "5944",
      "5950",
      "5938",
      "5929",
      "5932"
    ],
    "oldWardNames": [
      "Thị trấn Hương Sơn",
      "Xã Xuân Phương",
      "Xã Úc Kỳ",
      "Xã Nhã Lộng",
      "Xã Bảo Lý",
      "Xã Thượng Đình"
    ]
  },
  {
    "newWardId": "21505045",
    "newWardName": "Phú Đình",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5590",
      "5602"
    ],
    "oldWardNames": [
      "Xã Điềm Mặc",
      "Xã Phú Đình"
    ]
  },
  {
    "newWardId": "21513013",
    "newWardName": "Phú Lạc",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5794",
      "5788",
      "5785"
    ],
    "oldWardNames": [
      "Xã Phục Linh",
      "Xã Tân Linh",
      "Xã Phú Lạc"
    ]
  },
  {
    "newWardId": "21509037",
    "newWardName": "Phú Lương",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5611",
      "5644",
      "5623",
      "5629"
    ],
    "oldWardNames": [
      "Thị trấn Đu",
      "Thị trấn Giang Tiên",
      "Xã Yên Lạc",
      "Xã Động Đạt"
    ]
  },
  {
    "newWardId": "21513011",
    "newWardName": "Phú Thịnh",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5800",
      "5779",
      "5791"
    ],
    "oldWardNames": [
      "Xã Bản Ngoại",
      "Xã Phú Cường",
      "Xã Phú Thịnh"
    ]
  },
  {
    "newWardId": "20711074",
    "newWardName": "Phủ Thông",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Phủ Thông",
      "Xã Vi Hương",
      "Xã Tân Tú",
      "Xã Lục Bình"
    ]
  },
  {
    "newWardId": "21513017",
    "newWardName": "Phú Xuyên",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5773",
      "5797"
    ],
    "oldWardNames": [
      "Xã Yên Lãng",
      "Xã Phú Xuyên"
    ]
  },
  {
    "newWardId": "20703060",
    "newWardName": "Phúc Lộc",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bành Trạch",
      "Xã Hà Hiệu",
      "Xã Phúc Lộc"
    ]
  },
  {
    "newWardId": "21517021",
    "newWardName": "Phúc Thuận",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5857",
      "5872",
      "5866"
    ],
    "oldWardNames": [
      "Phường Bắc Sơn",
      "Xã Minh Đức",
      "Xã Phúc Thuận"
    ]
  },
  {
    "newWardId": "21505044",
    "newWardName": "Phượng Tiến",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5563",
      "5548",
      "5566"
    ],
    "oldWardNames": [
      "Xã Tân Dương",
      "Xã Tân Thịnh",
      "Xã Phượng Tiến"
    ]
  },
  {
    "newWardId": "21501006",
    "newWardName": "Quan Triều",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5482",
      "5434",
      "5653"
    ],
    "oldWardNames": [
      "Phường Tân Long",
      "Phường Quang Vinh",
      "Phường Quan Triều",
      "Xã Sơn Cẩm"
    ]
  },
  {
    "newWardId": "20707069",
    "newWardName": "Quảng Bạch",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Lập",
      "Xã Quảng Bạch"
    ]
  },
  {
    "newWardId": "21511029",
    "newWardName": "Quang Sơn",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5668",
      "5674"
    ],
    "oldWardNames": [
      "Xã Tân Long",
      "Xã Quang Sơn"
    ]
  },
  {
    "newWardId": "21513015",
    "newWardName": "Quân Chu",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5851",
      "5848"
    ],
    "oldWardNames": [
      "Thị trấn Quân Chu",
      "Xã Cát Nê"
    ]
  },
  {
    "newWardId": "21501005",
    "newWardName": "Quyết Thắng",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5455",
      "5485",
      "5491"
    ],
    "oldWardNames": [
      "Phường Thịnh Đán",
      "Xã Phúc Hà",
      "Xã Quyết Thắng"
    ]
  },
  {
    "newWardId": "21507091",
    "newWardName": "Sảng Mộc",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5719"
    ],
    "oldWardNames": [
      "Xã Sảng Mộc"
    ]
  },
  {
    "newWardId": "21503034",
    "newWardName": "Sông Công",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5518",
      "5521",
      "5515"
    ],
    "oldWardNames": [
      "Phường Thắng Lợi",
      "Phường Phố Cò",
      "Phường Cải Đan"
    ]
  },
  {
    "newWardId": "21501007",
    "newWardName": "Tân Cương",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5497",
      "5530",
      "5503"
    ],
    "oldWardNames": [
      "Xã Thịnh Đức",
      "Xã Bình Sơn",
      "Xã Tân Cương"
    ]
  },
  {
    "newWardId": "21515027",
    "newWardName": "Tân Khánh",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5911",
      "5926",
      "5917"
    ],
    "oldWardNames": [
      "Xã Bàn Đạt",
      "Xã Đào Xá",
      "Xã Tân Khánh"
    ]
  },
  {
    "newWardId": "20713087",
    "newWardName": "Tân Kỳ",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Sơn",
      "Xã Cao Kỳ",
      "Xã Hòa Mục"
    ]
  },
  {
    "newWardId": "21515024",
    "newWardName": "Tân Thành",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5935",
      "5920",
      "5923"
    ],
    "oldWardNames": [
      "Xã Tân Hòa",
      "Xã Tân Kim",
      "Xã Tân Thành"
    ]
  },
  {
    "newWardId": "21517022",
    "newWardName": "Thành Công",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5887",
      "5881"
    ],
    "oldWardNames": [
      "Xã Vạn Phái",
      "Xã Thành Công"
    ]
  },
  {
    "newWardId": "20713088",
    "newWardName": "Thanh Mai",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thanh Vận",
      "Xã Mai Lạp",
      "Xã Thanh Mai"
    ]
  },
  {
    "newWardId": "20713089",
    "newWardName": "Thanh Thịnh",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nông Hạ",
      "Xã Thanh Thịnh"
    ]
  },
  {
    "newWardId": "21507052",
    "newWardName": "Thần Sa",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5731",
      "5725"
    ],
    "oldWardNames": [
      "Xã Thượng Nung",
      "Xã Thần Xa"
    ]
  },
  {
    "newWardId": "20703061",
    "newWardName": "Thượng Minh",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Yến Dương",
      "Xã Chu Hương",
      "Xã Mỹ Phương"
    ]
  },
  {
    "newWardId": "20705092",
    "newWardName": "Thượng Quan",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thượng Quan"
    ]
  },
  {
    "newWardId": "21501003",
    "newWardName": "Tích Lương",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5476",
      "5470",
      "5479",
      "5464",
      "5500",
      "5467"
    ],
    "oldWardNames": [
      "Phường Trung Thành",
      "Phường Phú Xá",
      "Phường Tân Thành",
      "Phường Tân Lập",
      "Phường Tích Lương",
      "Phường Cam Giá"
    ]
  },
  {
    "newWardId": "21511030",
    "newWardName": "Trại Cau",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5662",
      "5698"
    ],
    "oldWardNames": [
      "Thị trấn Trại Cau",
      "Xã Hợp Tiến"
    ]
  },
  {
    "newWardId": "21507054",
    "newWardName": "Tràng Xá",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5752",
      "5746"
    ],
    "oldWardNames": [
      "Xã Liên Minh",
      "Xã Tràng Xá"
    ]
  },
  {
    "newWardId": "20709084",
    "newWardName": "Trần Phú",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Văn Minh",
      "Xã Cư Lễ",
      "Xã Trần Phú"
    ]
  },
  {
    "newWardId": "21505043",
    "newWardName": "Trung Hội",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5593",
      "5596",
      "5581"
    ],
    "oldWardNames": [
      "Xã Phú Tiến",
      "Xã Bộc Nhiêu",
      "Xã Trung Hội"
    ]
  },
  {
    "newWardId": "21517020",
    "newWardName": "Trung Thành",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5476",
      "5896",
      "5902",
      "5905"
    ],
    "oldWardNames": [
      "Phường Trung Thành",
      "Phường Đông Cao",
      "Phường Tân Phú",
      "Phường Thuận Thành"
    ]
  },
  {
    "newWardId": "21513016",
    "newWardName": "Vạn Phú",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5842",
      "5845"
    ],
    "oldWardNames": [
      "Xã Văn Yên",
      "Xã Vạn Phú"
    ]
  },
  {
    "newWardId": "21517019",
    "newWardName": "Vạn Xuân",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5890",
      "5878",
      "5893",
      "5884"
    ],
    "oldWardNames": [
      "Phường Nam Tiến",
      "Phường Đồng Tiến",
      "Phường Tân Hương",
      "Phường Tiên Phong"
    ]
  },
  {
    "newWardId": "21511032",
    "newWardName": "Văn Hán",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5686",
      "5680"
    ],
    "oldWardNames": [
      "Xã Khe Mo",
      "Xã Văn Hán"
    ]
  },
  {
    "newWardId": "20709081",
    "newWardName": "Văn Lang",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Kim Hỷ",
      "Xã Lương Thượng",
      "Xã Văn Lang"
    ]
  },
  {
    "newWardId": "21511033",
    "newWardName": "Văn Lăng",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5671",
      "5665"
    ],
    "oldWardNames": [
      "Xã Hòa Bình",
      "Xã Văn Lăng"
    ]
  },
  {
    "newWardId": "20711076",
    "newWardName": "Vĩnh Thông",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Sĩ Bình",
      "Xã Vũ Muộn",
      "Xã Cao Sơn"
    ]
  },
  {
    "newWardId": "21507049",
    "newWardName": "Võ Nhai",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5716",
      "5734",
      "5743"
    ],
    "oldWardNames": [
      "Thị trấn Đình Cả",
      "Xã Phú Thượng",
      "Xã Lâu Thượng"
    ]
  },
  {
    "newWardId": "21509038",
    "newWardName": "Vô Tranh",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5641",
      "5650",
      "5635",
      "5647"
    ],
    "oldWardNames": [
      "Xã Tức Tranh",
      "Xã Cổ Lũng",
      "Xã Phú Đô",
      "Xã Vô Tranh"
    ]
  },
  {
    "newWardId": "20709086",
    "newWardName": "Xuân Dương",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đổng Xá",
      "Xã Liêm Thủy",
      "Xã Xuân Dương"
    ]
  },
  {
    "newWardId": "20713063",
    "newWardName": "Yên Bình",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Yên Cư",
      "Xã Bình Văn",
      "Xã Yên Hân"
    ]
  },
  {
    "newWardId": "20707072",
    "newWardName": "Yên Phong",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đại Sảo",
      "Xã Yên Mỹ",
      "Xã Yên Phong"
    ]
  },
  {
    "newWardId": "20707070",
    "newWardName": "Yên Thịnh",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bản Thi",
      "Xã Yên Thượng",
      "Xã Yên Thịnh"
    ]
  },
  {
    "newWardId": "21509039",
    "newWardName": "Yên Trạch",
    "provinceId": "15",
    "provinceName": "Thái Nguyên",
    "oldWardIds": [
      "5614",
      "5620",
      "5617"
    ],
    "oldWardNames": [
      "Xã Yên Ninh",
      "Xã Yên Đổ",
      "Xã Yên Trạch"
    ]
  },
  {
    "newWardId": "70109074",
    "newWardName": "An Đông",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26887",
      "26926",
      "27001"
    ],
    "oldWardNames": [
      "Phường 5",
      "Phường 7",
      "Phường 9"
    ]
  },
  {
    "newWardId": "70125112",
    "newWardName": "An Hội Đông",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26872",
      "26878"
    ],
    "oldWardNames": [
      "Phường 15",
      "Phường 16"
    ]
  },
  {
    "newWardId": "70125114",
    "newWardName": "An Hội Tây",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26881",
      "26882"
    ],
    "oldWardNames": [
      "Phường 12",
      "Phường 14"
    ]
  },
  {
    "newWardId": "70145140",
    "newWardName": "An Khánh",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27118",
      "27115",
      "27088",
      "27094",
      "27091"
    ],
    "oldWardNames": [
      "Phường Thủ Thiêm",
      "Phường An Lợi Đông",
      "Phường Thảo Điền",
      "Phường An Khánh",
      "Phường An Phú"
    ]
  },
  {
    "newWardId": "70134099",
    "newWardName": "An Lạc",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27451",
      "27463",
      "27460"
    ],
    "oldWardNames": [
      "Phường Bình Trị Đông B",
      "Phường An Lạc A",
      "Phường An Lạc"
    ]
  },
  {
    "newWardId": "71111053",
    "newWardName": "An Long",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Linh",
      "Xã Tân Long",
      "Xã An Long"
    ]
  },
  {
    "newWardId": "70125110",
    "newWardName": "An Nhơn",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26887",
      "26876"
    ],
    "oldWardNames": [
      "Phường 5",
      "Phường 6"
    ]
  },
  {
    "newWardId": "70135154",
    "newWardName": "An Nhơn Tây",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27499",
      "27502",
      "27508"
    ],
    "oldWardNames": [
      "Xã Phú Mỹ Hưng",
      "Xã An Phú",
      "Xã An Nhơn Tây"
    ]
  },
  {
    "newWardId": "71107035",
    "newWardName": "An Phú",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27091"
    ],
    "oldWardNames": [
      "Phường An Phú",
      "Phường Bình Chuẩn"
    ]
  },
  {
    "newWardId": "70123098",
    "newWardName": "An Phú Đông",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26767",
      "26779"
    ],
    "oldWardNames": [
      "Phường Thạnh Lộc",
      "Phường An Phú Đông"
    ]
  },
  {
    "newWardId": "70143149",
    "newWardName": "An Thới Đông",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27682",
      "27673"
    ],
    "oldWardNames": [
      "Xã Lý Nhơn",
      "Xã An Thới Đông"
    ]
  },
  {
    "newWardId": "70137161",
    "newWardName": "Bà Điểm",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27589",
      "27586",
      "27592"
    ],
    "oldWardNames": [
      "Xã Xuân Thới Thượng",
      "Xã Trung Chánh",
      "Xã Bà Điểm"
    ]
  },
  {
    "newWardId": "71703005",
    "newWardName": "Bà Rịa",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Phước Trung",
      "Phường Phước Nguyên",
      "Phường Long Toàn",
      "Phường Phước Hưng"
    ]
  },
  {
    "newWardId": "70105067",
    "newWardName": "Bàn Cờ",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26890",
      "26941",
      "26902",
      "26887",
      "26968"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 2",
      "Phường 3",
      "Phường 5",
      "Phường 4"
    ]
  },
  {
    "newWardId": "71115058",
    "newWardName": "Bàu Bàng",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Lai Uyên"
    ]
  },
  {
    "newWardId": "71707022",
    "newWardName": "Bàu Lâm",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Lâm",
      "Xã Bàu Lâm"
    ]
  },
  {
    "newWardId": "70127121",
    "newWardName": "Bảy Hiền",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26884",
      "26899",
      "26881"
    ],
    "oldWardNames": [
      "Phường 10",
      "Phường 11",
      "Phường 12"
    ]
  },
  {
    "newWardId": "71117051",
    "newWardName": "Bắc Tân Uyên",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Tân Thành",
      "Xã Đất Cuốc",
      "Xã Tân Định"
    ]
  },
  {
    "newWardId": "71115049",
    "newWardName": "Bến Cát",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Hưng",
      "Xã Lai Hưng",
      "Phường Mỹ Phước"
    ]
  },
  {
    "newWardId": "70101065",
    "newWardName": "Bến Thành",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26743",
      "26749",
      "26752",
      "26746"
    ],
    "oldWardNames": [
      "Phường Bến Thành",
      "Phường Phạm Ngũ Lão",
      "Phường Cầu Ông Lãnh",
      "Phường Nguyễn Thái Bình"
    ]
  },
  {
    "newWardId": "70139145",
    "newWardName": "Bình Chánh",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27634",
      "27637",
      "27625"
    ],
    "oldWardNames": [
      "Xã Tân Quý Tây",
      "Xã Bình Chánh",
      "Xã An Phú Tây"
    ]
  },
  {
    "newWardId": "71707166",
    "newWardName": "Bình Châu",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình Châu"
    ]
  },
  {
    "newWardId": "71105041",
    "newWardName": "Bình Cơ",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27550"
    ],
    "oldWardNames": [
      "Xã Bình Mỹ",
      "Phường Hội Nghĩa"
    ]
  },
  {
    "newWardId": "71101036",
    "newWardName": "Bình Dương",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27493"
    ],
    "oldWardNames": [
      "Phường Phú Mỹ",
      "Phường Hòa Phú",
      "Phường Phú Tân",
      "Phường Phú Chánh"
    ]
  },
  {
    "newWardId": "70115086",
    "newWardName": "Bình Đông",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26876",
      "26926",
      "27625",
      "26887"
    ],
    "oldWardNames": [
      "Phường 6",
      "Phường 7",
      "Xã An Phú Tây",
      "Phường 5"
    ]
  },
  {
    "newWardId": "71705014",
    "newWardName": "Bình Giã",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình Trung",
      "Xã Quảng Thành",
      "Xã Bình Giã"
    ]
  },
  {
    "newWardId": "71107033",
    "newWardName": "Bình Hòa",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Bình Hòa",
      "Phường Vĩnh Phú"
    ]
  },
  {
    "newWardId": "70139147",
    "newWardName": "Bình Hưng",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27622",
      "27619",
      "26926"
    ],
    "oldWardNames": [
      "Xã Phong Phú",
      "Xã Bình Hưng",
      "Phường 7"
    ]
  },
  {
    "newWardId": "70134103",
    "newWardName": "Bình Hưng Hòa",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27436",
      "27016"
    ],
    "oldWardNames": [
      "Phường Bình Hưng Hòa",
      "Phường Sơn Kỳ",
      "Phường Bình Hưng Hòa A"
    ]
  },
  {
    "newWardId": "70143148",
    "newWardName": "Bình Khánh",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27670",
      "27667",
      "27673"
    ],
    "oldWardNames": [
      "Xã Tam Thôn Hiệp",
      "Xã Bình Khánh",
      "Xã An Thới Đông"
    ]
  },
  {
    "newWardId": "70139143",
    "newWardName": "Bình Lợi",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27610",
      "27607"
    ],
    "oldWardNames": [
      "Xã Lê Minh Xuân",
      "Xã Bình Lợi"
    ]
  },
  {
    "newWardId": "70129106",
    "newWardName": "Bình Lợi Trung",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26887",
      "26899",
      "26905"
    ],
    "oldWardNames": [
      "Phường 5",
      "Phường 11",
      "Phường 13"
    ]
  },
  {
    "newWardId": "70135157",
    "newWardName": "Bình Mỹ",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27550",
      "27544",
      "27523"
    ],
    "oldWardNames": [
      "Xã Bình Mỹ",
      "Xã Hòa Phú",
      "Xã Trung An"
    ]
  },
  {
    "newWardId": "70111078",
    "newWardName": "Bình Phú",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26884",
      "26899",
      "26878"
    ],
    "oldWardNames": [
      "Phường 10",
      "Phường 11",
      "Phường 16"
    ]
  },
  {
    "newWardId": "70129108",
    "newWardName": "Bình Quới",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26911",
      "26962"
    ],
    "oldWardNames": [
      "Phường 27",
      "Phường 28"
    ]
  },
  {
    "newWardId": "70134101",
    "newWardName": "Bình Tân",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27448",
      "27454"
    ],
    "oldWardNames": [
      "Phường Bình Hưng Hòa B",
      "Phường Bình Trị Đông A",
      "Phường Tân Tạo"
    ]
  },
  {
    "newWardId": "70111076",
    "newWardName": "Bình Tây",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26941",
      "27001"
    ],
    "oldWardNames": [
      "Phường 2",
      "Phường 9"
    ]
  },
  {
    "newWardId": "70129105",
    "newWardName": "Bình Thạnh",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26881",
      "26882",
      "26914"
    ],
    "oldWardNames": [
      "Phường 12",
      "Phường 14",
      "Phường 26"
    ]
  },
  {
    "newWardId": "70121091",
    "newWardName": "Bình Thới",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26902",
      "26884",
      "26898"
    ],
    "oldWardNames": [
      "Phường 3",
      "Phường 10",
      "Phường 8"
    ]
  },
  {
    "newWardId": "70111077",
    "newWardName": "Bình Tiên",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26890",
      "26926",
      "26898"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 7",
      "Phường 8"
    ]
  },
  {
    "newWardId": "70134102",
    "newWardName": "Bình Trị Đông",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27445",
      "27448"
    ],
    "oldWardNames": [
      "Phường Bình Trị Đông",
      "Phường Bình Hưng Hòa A",
      "Phường Bình Trị Đông A"
    ]
  },
  {
    "newWardId": "70145138",
    "newWardName": "Bình Trưng",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27097",
      "27100",
      "27091"
    ],
    "oldWardNames": [
      "Phường Bình Trưng Đông",
      "Phường Bình Trưng Tây",
      "Phường An Phú"
    ]
  },
  {
    "newWardId": "70145137",
    "newWardName": "Cát Lái",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27112",
      "27109"
    ],
    "oldWardNames": [
      "Phường Thạnh Mỹ Lợi",
      "Phường Cát Lái"
    ]
  },
  {
    "newWardId": "70143150",
    "newWardName": "Cần Giờ",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27679",
      "27664"
    ],
    "oldWardNames": [
      "Xã Long Hòa",
      "Thị trấn Cần Thạnh"
    ]
  },
  {
    "newWardId": "70131116",
    "newWardName": "Cầu Kiệu",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26890",
      "26941",
      "26926",
      "26872"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 2",
      "Phường 7",
      "Phường 15"
    ]
  },
  {
    "newWardId": "70101066",
    "newWardName": "Cầu Ông Lãnh",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26758",
      "26761",
      "26755",
      "26752"
    ],
    "oldWardNames": [
      "Phường Nguyễn Cư Trinh",
      "Phường Cầu Kho",
      "Phường Cô Giang",
      "Phường Cầu Ông Lãnh"
    ]
  },
  {
    "newWardId": "71101037",
    "newWardName": "Chánh Hiệp",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Định Hòa",
      "Phường Tương Bình Hiệp",
      "Phường Hiệp An",
      "Phường Chánh Mỹ"
    ]
  },
  {
    "newWardId": "70115084",
    "newWardName": "Chánh Hưng",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26968",
      "27403",
      "26887"
    ],
    "oldWardNames": [
      "Phường 4",
      "Rạch Ông",
      "Phường Hưng Phú",
      "Phường 5"
    ]
  },
  {
    "newWardId": "71115050",
    "newWardName": "Chánh Phú Hòa",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Chánh Phú Hòa",
      "Xã Hưng Hòa"
    ]
  },
  {
    "newWardId": "71705016",
    "newWardName": "Châu Đức",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Cù Bị",
      "Xã Xà Bang"
    ]
  },
  {
    "newWardId": "71709012",
    "newWardName": "Châu Pha",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tóc Tiên",
      "Xã Châu Pha"
    ]
  },
  {
    "newWardId": "70109075",
    "newWardName": "Chợ Lớn",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26899",
      "26881",
      "26905",
      "26882"
    ],
    "oldWardNames": [
      "Phường 11",
      "Phường 12",
      "Phường 13",
      "Phường 14"
    ]
  },
  {
    "newWardId": "70109073",
    "newWardName": "Chợ Quán",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26890",
      "26941",
      "26968"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 2",
      "Phường 4"
    ]
  },
  {
    "newWardId": "70135151",
    "newWardName": "Củ Chi",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27553",
      "27556",
      "27535"
    ],
    "oldWardNames": [
      "Xã Tân Phú Trung",
      "Xã Tân Thông Hội",
      "Xã Phước Vĩnh An"
    ]
  },
  {
    "newWardId": "71113061",
    "newWardName": "Dầu Tiếng",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Dầu Tiếng",
      "Xã Định An",
      "Xã Định Thành",
      "Xã Định Hiệp"
    ]
  },
  {
    "newWardId": "71109029",
    "newWardName": "Dĩ An",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường An Bình",
      "Phường Dĩ An",
      "Phường Tân Đông Hiệp"
    ]
  },
  {
    "newWardId": "70119087",
    "newWardName": "Diên Hồng",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26876",
      "26898",
      "26882"
    ],
    "oldWardNames": [
      "Phường 6",
      "Phường 8",
      "Phường 14"
    ]
  },
  {
    "newWardId": "71712025",
    "newWardName": "Đất Đỏ",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Đất Đỏ",
      "Xã Long Tân",
      "Xã Láng Dài",
      "Xã Phước Long Thọ"
    ]
  },
  {
    "newWardId": "71109028",
    "newWardName": "Đông Hòa",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Bình An",
      "Phường Bình Thắng",
      "Phường Đông Hòa"
    ]
  },
  {
    "newWardId": "70123094",
    "newWardName": "Đông Hưng Thuận",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26791",
      "26787",
      "26788"
    ],
    "oldWardNames": [
      "Phường Tân Thới Nhất",
      "Phường Tân Hưng Thuận",
      "Phường Đông Hưng Thuận"
    ]
  },
  {
    "newWardId": "70137158",
    "newWardName": "Đông Thạnh",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27574",
      "27565",
      "27568"
    ],
    "oldWardNames": [
      "Xã Thới Tam Thôn",
      "Xã Nhị Bình",
      "Xã Đông Thạnh"
    ]
  },
  {
    "newWardId": "70131115",
    "newWardName": "Đức Nhuận",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26968",
      "26887",
      "27001"
    ],
    "oldWardNames": [
      "Phường 4",
      "Phường 5",
      "Phường 9"
    ]
  },
  {
    "newWardId": "70129104",
    "newWardName": "Gia Định",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26890",
      "26941",
      "26926",
      "26875"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 2",
      "Phường 7",
      "Phường 17"
    ]
  },
  {
    "newWardId": "70125111",
    "newWardName": "Gò Vấp",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26884",
      "26875"
    ],
    "oldWardNames": [
      "Phường 10",
      "Phường 17"
    ]
  },
  {
    "newWardId": "70125109",
    "newWardName": "Hạnh Thông",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26890",
      "26902"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 3"
    ]
  },
  {
    "newWardId": "70145129",
    "newWardName": "Hiệp Bình",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26812",
      "26809",
      "26821"
    ],
    "oldWardNames": [
      "Phường Hiệp Bình Chánh",
      "Phường Hiệp Bình Phước",
      "Phường Linh Đông"
    ]
  },
  {
    "newWardId": "70141163",
    "newWardName": "Hiệp Phước",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27652",
      "27658",
      "27661"
    ],
    "oldWardNames": [
      "Xã Nhơn Đức",
      "Xã Long Thới",
      "Xã Hiệp Phước"
    ]
  },
  {
    "newWardId": "70121092",
    "newWardName": "Hòa Bình",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26887",
      "26882"
    ],
    "oldWardNames": [
      "Phường 5",
      "Phường 14"
    ]
  },
  {
    "newWardId": "71707165",
    "newWardName": "Hòa Hiệp",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hòa Hiệp"
    ]
  },
  {
    "newWardId": "71707021",
    "newWardName": "Hòa Hội",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hòa Hưng",
      "Xã Hòa Bình",
      "Xã Hòa Hội"
    ]
  },
  {
    "newWardId": "70119089",
    "newWardName": "Hòa Hưng",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26881",
      "26905",
      "26872",
      "26882"
    ],
    "oldWardNames": [
      "Phường 12",
      "Phường 13",
      "Phường 15",
      "Phường 14"
    ]
  },
  {
    "newWardId": "71103045",
    "newWardName": "Hòa Lợi",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26734"
    ],
    "oldWardNames": [
      "Phường Tân Định",
      "Phường Hòa Lợi"
    ]
  },
  {
    "newWardId": "70137159",
    "newWardName": "Hóc Môn",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27562",
      "27580",
      "27559"
    ],
    "oldWardNames": [
      "Xã Tân Hiệp",
      "Xã Tân Xuân",
      "Thị trấn Hóc Môn"
    ]
  },
  {
    "newWardId": "71707019",
    "newWardName": "Hồ Tràm",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Phước Bửu",
      "Xã Phước Tân",
      "Xã Phước Thuận"
    ]
  },
  {
    "newWardId": "70139146",
    "newWardName": "Hưng Long",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27631",
      "27628"
    ],
    "oldWardNames": [
      "Xã Đa Phước",
      "Xã Qui Đức",
      "Xã Hưng Long"
    ]
  },
  {
    "newWardId": "70107071",
    "newWardName": "Khánh Hội",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26898",
      "27001",
      "26941",
      "26968",
      "26872"
    ],
    "oldWardNames": [
      "Phường 8",
      "Phường 9",
      "Phường 2",
      "Phường 4",
      "Phường 15"
    ]
  },
  {
    "newWardId": "71705015",
    "newWardName": "Kim Long",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Kim Long",
      "Xã Bàu Chinh",
      "Xã Láng Lớn"
    ]
  },
  {
    "newWardId": "71107034",
    "newWardName": "Lái Thiêu",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Bình Nhâm",
      "Phường Lái Thiêu",
      "Phường Vĩnh Phú"
    ]
  },
  {
    "newWardId": "70145132",
    "newWardName": "Linh Xuân",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26800",
      "26794",
      "26818"
    ],
    "oldWardNames": [
      "Phường Linh Trung",
      "Phường Linh Xuân",
      "Phường Linh Tây"
    ]
  },
  {
    "newWardId": "70145134",
    "newWardName": "Long Bình",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26830",
      "26833"
    ],
    "oldWardNames": [
      "Phường Long Bình",
      "Phường Long Thạnh Mỹ"
    ]
  },
  {
    "newWardId": "71712026",
    "newWardName": "Long Điền",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Long Điền",
      "Xã Tam An"
    ]
  },
  {
    "newWardId": "71712024",
    "newWardName": "Long Hải",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Long Hải",
      "Xã Phước Tỉnh",
      "Xã Phước Hưng"
    ]
  },
  {
    "newWardId": "71113060",
    "newWardName": "Long Hòa",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27679"
    ],
    "oldWardNames": [
      "Xã Long Tân",
      "Xã Long Hòa",
      "Xã Minh Tân",
      "Xã Minh Thạnh"
    ]
  },
  {
    "newWardId": "71703006",
    "newWardName": "Long Hương",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Hưng",
      "Phường Kim Dinh",
      "Phường Long Hương"
    ]
  },
  {
    "newWardId": "71115048",
    "newWardName": "Long Nguyên",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường An Điền",
      "Xã Long Nguyên",
      "Phường Mỹ Phước"
    ]
  },
  {
    "newWardId": "70145135",
    "newWardName": "Long Phước",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26854",
      "26857"
    ],
    "oldWardNames": [
      "Phường Trường Thạnh",
      "Phường Long Phước"
    ]
  },
  {
    "newWardId": "71701164",
    "newWardName": "Long Sơn",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Long Sơn"
    ]
  },
  {
    "newWardId": "70145136",
    "newWardName": "Long Trường",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26866",
      "26860"
    ],
    "oldWardNames": [
      "Phường Phú Hữu",
      "Phường Long Trường"
    ]
  },
  {
    "newWardId": "70121090",
    "newWardName": "Minh Phụng",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26890",
      "26926",
      "26878"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 7",
      "Phường 16"
    ]
  },
  {
    "newWardId": "71113059",
    "newWardName": "Minh Thạnh",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Minh Hòa",
      "Xã Minh Tân",
      "Xã Minh Thạnh"
    ]
  },
  {
    "newWardId": "71705013",
    "newWardName": "Ngãi Giao",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Ngãi Giao",
      "Xã Bình Ba",
      "Xã Suối Nghệ"
    ]
  },
  {
    "newWardId": "71705018",
    "newWardName": "Nghĩa Thành",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đá Bạc",
      "Xã Nghĩa Thành"
    ]
  },
  {
    "newWardId": "70141162",
    "newWardName": "Nhà Bè",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27643",
      "27655",
      "27646",
      "27649"
    ],
    "oldWardNames": [
      "Thị trấn Nhà Bè",
      "Xã Phú Xuân",
      "Xã Phước Kiển",
      "Xã Phước Lộc"
    ]
  },
  {
    "newWardId": "70105069",
    "newWardName": "Nhiêu Lộc",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27001",
      "26899",
      "26881",
      "26882"
    ],
    "oldWardNames": [
      "Phường 9",
      "Phường 11",
      "Phường 12",
      "Phường 14"
    ]
  },
  {
    "newWardId": "70135155",
    "newWardName": "Nhuận Đức",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27514",
      "27520",
      "27511"
    ],
    "oldWardNames": [
      "Xã Phạm Văn Cội",
      "Xã Trung Lập Hạ",
      "Xã Nhuận Đức"
    ]
  },
  {
    "newWardId": "71101046",
    "newWardName": "Phú An",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tân An",
      "Xã Phú An",
      "Phường Hiệp An"
    ]
  },
  {
    "newWardId": "70115085",
    "newWardName": "Phú Định",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26882",
      "26872",
      "27415",
      "26878"
    ],
    "oldWardNames": [
      "Phường 14",
      "Phường 15",
      "Phường Xóm Củi",
      "Phường 16"
    ]
  },
  {
    "newWardId": "71111056",
    "newWardName": "Phú Giáo",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Phước Vĩnh",
      "Xã An Bình",
      "Xã Tam Lập"
    ]
  },
  {
    "newWardId": "70135156",
    "newWardName": "Phú Hòa Đông",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27541",
      "27547",
      "27517"
    ],
    "oldWardNames": [
      "Xã Tân Thạnh Tây",
      "Xã Tân Thạnh Đông",
      "Xã Phú Hòa Đông"
    ]
  },
  {
    "newWardId": "70111079",
    "newWardName": "Phú Lâm",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26881",
      "26905",
      "26882"
    ],
    "oldWardNames": [
      "Phường 12",
      "Phường 13",
      "Phường 14"
    ]
  },
  {
    "newWardId": "71101039",
    "newWardName": "Phú Lợi",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26770"
    ],
    "oldWardNames": [
      "Phường Phú Hòa",
      "Phường Phú Lợi",
      "Phường Hiệp Thành"
    ]
  },
  {
    "newWardId": "71709007",
    "newWardName": "Phú Mỹ",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27493"
    ],
    "oldWardNames": [
      "Phường Phú Mỹ",
      "Phường Mỹ Xuân"
    ]
  },
  {
    "newWardId": "70131117",
    "newWardName": "Phú Nhuận",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26898",
      "26884",
      "26899",
      "26905",
      "26872"
    ],
    "oldWardNames": [
      "Phường 8",
      "Phường 10",
      "Phường 11",
      "Phường 13",
      "Phường 15"
    ]
  },
  {
    "newWardId": "70128128",
    "newWardName": "Phú Thạnh",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27037",
      "27028",
      "27040"
    ],
    "oldWardNames": [
      "Phường Hiệp Tân",
      "Phường Phú Thạnh",
      "Phường Tân Thới Hòa"
    ]
  },
  {
    "newWardId": "70121093",
    "newWardName": "Phú Thọ",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26899",
      "26872",
      "26898"
    ],
    "oldWardNames": [
      "Phường 11",
      "Phường 15",
      "Phường 8"
    ]
  },
  {
    "newWardId": "70128126",
    "newWardName": "Phú Thọ Hòa",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27025",
      "27022",
      "27019"
    ],
    "oldWardNames": [
      "Phường Phú Thọ Hòa",
      "Phường Tân Thành",
      "Phường Tân Quý"
    ]
  },
  {
    "newWardId": "70113081",
    "newWardName": "Phú Thuận",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27484",
      "27493"
    ],
    "oldWardNames": [
      "Phường Phú Thuận",
      "Phường Phú Mỹ"
    ]
  },
  {
    "newWardId": "71712023",
    "newWardName": "Phước Hải",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Phước Hải",
      "Xã Phước Hội"
    ]
  },
  {
    "newWardId": "71111055",
    "newWardName": "Phước Hòa",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vĩnh Hòa",
      "Xã Phước Hòa",
      "Xã Tam Lập"
    ]
  },
  {
    "newWardId": "70145139",
    "newWardName": "Phước Long",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26863",
      "26851",
      "26848"
    ],
    "oldWardNames": [
      "Phường Phước Bình",
      "Phường Phước Long A",
      "Phường Phước Long B"
    ]
  },
  {
    "newWardId": "71111054",
    "newWardName": "Phước Thành",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27562"
    ],
    "oldWardNames": [
      "Xã Tân Hiệp",
      "Xã An Thái",
      "Xã Phước Sang"
    ]
  },
  {
    "newWardId": "71701004",
    "newWardName": "Phước Thắng",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26899",
      "26881"
    ],
    "oldWardNames": [
      "Phường 11",
      "Phường 12"
    ]
  },
  {
    "newWardId": "71701003",
    "newWardName": "Rạch Dừa",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26884"
    ],
    "oldWardNames": [
      "Phường 10",
      "Phường Thắng Nhất",
      "Phường Rạch Dừa"
    ]
  },
  {
    "newWardId": "70101063",
    "newWardName": "Sài Gòn",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26740",
      "26737",
      "26746"
    ],
    "oldWardNames": [
      "Phường Bến Nghé",
      "Phường Đa Kao",
      "Phường Nguyễn Thái Bình"
    ]
  },
  {
    "newWardId": "70145131",
    "newWardName": "Tam Bình",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26797",
      "26806",
      "26803"
    ],
    "oldWardNames": [
      "Phường Bình Chiểu",
      "Phường Tam Phú",
      "Phường Tam Bình"
    ]
  },
  {
    "newWardId": "71703008",
    "newWardName": "Tam Long",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Long Tâm",
      "Xã Hòa Long",
      "Xã Long Phước"
    ]
  },
  {
    "newWardId": "71701002",
    "newWardName": "Tam Thắng",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26926",
      "26898",
      "27001"
    ],
    "oldWardNames": [
      "Phường 7",
      "Phường 8",
      "Phường 9",
      "Phường Nguyễn An Ninh"
    ]
  },
  {
    "newWardId": "70145133",
    "newWardName": "Tăng Nhơn Phú",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26836",
      "26839",
      "26842",
      "26845",
      "26833"
    ],
    "oldWardNames": [
      "Phường Tân Phú",
      "Phường Hiệp Phú",
      "Phường Tăng Nhơn Phú A",
      "Phường Tăng Nhơn Phú B",
      "Phường Long Thạnh Mỹ"
    ]
  },
  {
    "newWardId": "70135152",
    "newWardName": "Tân An Hội",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27496",
      "27529",
      "27532"
    ],
    "oldWardNames": [
      "Thị trấn Củ Chi",
      "Xã Phước Hiệp",
      "Xã Tân An Hội"
    ]
  },
  {
    "newWardId": "70127122",
    "newWardName": "Tân Bình",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26905",
      "26882",
      "26872"
    ],
    "oldWardNames": [
      "Phường 13",
      "Phường 14",
      "Phường 15"
    ]
  },
  {
    "newWardId": "70101064",
    "newWardName": "Tân Định",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26734",
      "26737"
    ],
    "oldWardNames": [
      "Phường Tân Định",
      "Phường Đa Kao"
    ]
  },
  {
    "newWardId": "71109030",
    "newWardName": "Tân Đông Hiệp",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tân Bình",
      "Phường Thái Hòa",
      "Phường Tân Đông Hiệp"
    ]
  },
  {
    "newWardId": "71709011",
    "newWardName": "Tân Hải",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tân Hòa",
      "Phường Tân Hải"
    ]
  },
  {
    "newWardId": "71105043",
    "newWardName": "Tân Hiệp",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Khánh Bình",
      "Phường Tân Hiệp"
    ]
  },
  {
    "newWardId": "70127120",
    "newWardName": "Tân Hòa",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26876",
      "26898",
      "27001"
    ],
    "oldWardNames": [
      "Phường 6",
      "Phường 8",
      "Phường 9"
    ]
  },
  {
    "newWardId": "70113083",
    "newWardName": "Tân Hưng",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27490",
      "27481",
      "27472",
      "27475"
    ],
    "oldWardNames": [
      "Phường Tân Phong",
      "Phường Tân Quy",
      "Phường Tân Kiểng",
      "Phường Tân Hưng"
    ]
  },
  {
    "newWardId": "71105044",
    "newWardName": "Tân Khánh",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Thạnh Phước",
      "Phường Tân Phước Khánh",
      "Phường Tân Vĩnh Hiệp",
      "Xã Thạnh Hội",
      "Phường Thái Hòa"
    ]
  },
  {
    "newWardId": "70113082",
    "newWardName": "Tân Mỹ",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26836",
      "27493"
    ],
    "oldWardNames": [
      "Phường Tân Phú",
      "Phường Phú Mỹ"
    ]
  },
  {
    "newWardId": "70139144",
    "newWardName": "Tân Nhựt",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27595",
      "27613",
      "27457",
      "27616",
      "26878"
    ],
    "oldWardNames": [
      "Thị trấn Tân Túc",
      "Xã Tân Nhựt",
      "Phường Tân Tạo A",
      "Xã Tân Kiên",
      "Phường 16"
    ]
  },
  {
    "newWardId": "70128127",
    "newWardName": "Tân Phú",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27031",
      "27034",
      "27040",
      "27022"
    ],
    "oldWardNames": [
      "Phường Phú Trung",
      "Phường Hòa Thạnh",
      "Phường Tân Thới Hòa",
      "Phường Tân Thành"
    ]
  },
  {
    "newWardId": "71709010",
    "newWardName": "Tân Phước",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Phước Hòa",
      "Phường Tân Phước"
    ]
  },
  {
    "newWardId": "70127123",
    "newWardName": "Tân Sơn",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26872"
    ],
    "oldWardNames": [
      "Phường 15"
    ]
  },
  {
    "newWardId": "70127118",
    "newWardName": "Tân Sơn Hòa",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26890",
      "26941",
      "26902"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 2",
      "Phường 3"
    ]
  },
  {
    "newWardId": "70127119",
    "newWardName": "Tân Sơn Nhất",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26968",
      "26887",
      "26926"
    ],
    "oldWardNames": [
      "Phường 4",
      "Phường 5",
      "Phường 7"
    ]
  },
  {
    "newWardId": "70128125",
    "newWardName": "Tân Sơn Nhì",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27010",
      "27016",
      "27019",
      "27022"
    ],
    "oldWardNames": [
      "Phường Tân Sơn Nhì",
      "Phường Sơn Kỳ",
      "Phường Tân Quý",
      "Phường Tân Thành"
    ]
  },
  {
    "newWardId": "70134100",
    "newWardName": "Tân Tạo",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27616",
      "27457",
      "27454"
    ],
    "oldWardNames": [
      "Xã Tân Kiên",
      "Phường Tân Tạo A",
      "Phường Tân Tạo"
    ]
  },
  {
    "newWardId": "71709009",
    "newWardName": "Tân Thành",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Hắc Dịch",
      "Xã Sông Xoài"
    ]
  },
  {
    "newWardId": "70123096",
    "newWardName": "Tân Thới Hiệp",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26770",
      "26782"
    ],
    "oldWardNames": [
      "Phường Hiệp Thành",
      "Phường Tân Thới Hiệp"
    ]
  },
  {
    "newWardId": "70113080",
    "newWardName": "Tân Thuận",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27478",
      "27466",
      "27469"
    ],
    "oldWardNames": [
      "Phường Bình Thuận",
      "Phường Tân Thuận Đông",
      "Phường Tân Thuận Tây"
    ]
  },
  {
    "newWardId": "71105042",
    "newWardName": "Tân Uyên",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Uyên Hưng",
      "Xã Bạch Đằng",
      "Xã Tân Lập",
      "Xã Tân Mỹ"
    ]
  },
  {
    "newWardId": "70139142",
    "newWardName": "Tân Vĩnh Lộc",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27604",
      "27598",
      "27454"
    ],
    "oldWardNames": [
      "Xã Vĩnh Lộc B",
      "Xã Phạm Văn Hai",
      "Phường Tân Tạo"
    ]
  },
  {
    "newWardId": "71113047",
    "newWardName": "Tây Nam",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường An Tây",
      "Xã Thanh Tuyền",
      "Xã An Lập"
    ]
  },
  {
    "newWardId": "70128124",
    "newWardName": "Tây Thạnh",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27013",
      "27016"
    ],
    "oldWardNames": [
      "Phường Tây Thạnh",
      "Phường Sơn Kỳ"
    ]
  },
  {
    "newWardId": "70135153",
    "newWardName": "Thái Mỹ",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27505",
      "27526",
      "27538"
    ],
    "oldWardNames": [
      "Xã Trung Lập Thượng",
      "Xã Phước Thạnh",
      "Xã Thái Mỹ"
    ]
  },
  {
    "newWardId": "71113062",
    "newWardName": "Thanh An",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thanh An",
      "Xã Định Hiệp",
      "Xã Thanh Tuyền",
      "Xã An Lập"
    ]
  },
  {
    "newWardId": "70143168",
    "newWardName": "Thạnh An",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27676"
    ],
    "oldWardNames": [
      "Xã Thạnh An"
    ]
  },
  {
    "newWardId": "70129107",
    "newWardName": "Thạnh Mỹ Tây",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26953",
      "26956",
      "26920"
    ],
    "oldWardNames": [
      "Phường 19",
      "Phường 22",
      "Phường 25"
    ]
  },
  {
    "newWardId": "70125113",
    "newWardName": "Thông Tây Hội",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26898",
      "26899"
    ],
    "oldWardNames": [
      "Phường 8",
      "Phường 11"
    ]
  },
  {
    "newWardId": "70123097",
    "newWardName": "Thới An",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26764",
      "26773"
    ],
    "oldWardNames": [
      "Phường Thạnh Xuân",
      "Phường Thới An"
    ]
  },
  {
    "newWardId": "71103167",
    "newWardName": "Thới Hòa",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Thới Hòa"
    ]
  },
  {
    "newWardId": "71101038",
    "newWardName": "Thủ Dầu Một",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26770"
    ],
    "oldWardNames": [
      "Phường Phú Cường",
      "Phường Phú Thọ",
      "Phường Chánh Nghĩa",
      "Phường Hiệp Thành",
      "Phường Chánh Mỹ"
    ]
  },
  {
    "newWardId": "70145130",
    "newWardName": "Thủ Đức",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26824",
      "26815",
      "26827",
      "26818",
      "26821"
    ],
    "oldWardNames": [
      "Phường Bình Thọ",
      "Phường Linh Chiểu",
      "Phường Trường Thọ",
      "Phường Linh Tây",
      "Phường Linh Đông"
    ]
  },
  {
    "newWardId": "71107031",
    "newWardName": "Thuận An",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Hưng Định",
      "Phường An Thạnh",
      "Xã An Sơn"
    ]
  },
  {
    "newWardId": "71107032",
    "newWardName": "Thuận Giao",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Thuận Giao",
      "Phường Bình Chuẩn"
    ]
  },
  {
    "newWardId": "71117052",
    "newWardName": "Thường Tân",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Lạc An",
      "Xã Hiếu Liêm",
      "Xã Thường Tân",
      "Xã Tân Mỹ"
    ]
  },
  {
    "newWardId": "70123095",
    "newWardName": "Trung Mỹ Tây",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26776",
      "26785"
    ],
    "oldWardNames": [
      "Phường Tân Chánh Hiệp",
      "Phường Trung Mỹ Tây"
    ]
  },
  {
    "newWardId": "71115057",
    "newWardName": "Trừ Văn Thố",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trừ Văn Thố",
      "Xã Cây Trường II",
      "Thị trấn Lai Uyên"
    ]
  },
  {
    "newWardId": "70107072",
    "newWardName": "Vĩnh Hội",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26890",
      "26902",
      "26941",
      "26968"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 3",
      "Phường 2",
      "Phường 4"
    ]
  },
  {
    "newWardId": "70139141",
    "newWardName": "Vĩnh Lộc",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27601",
      "27598"
    ],
    "oldWardNames": [
      "Xã Vĩnh Lộc A",
      "Xã Phạm Văn Hai"
    ]
  },
  {
    "newWardId": "71105040",
    "newWardName": "Vĩnh Tân",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Vĩnh Tân",
      "Thị trấn Tân Bình"
    ]
  },
  {
    "newWardId": "71701001",
    "newWardName": "Vũng Tàu",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26890",
      "26941",
      "26902",
      "26968",
      "26887"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 2",
      "Phường 3",
      "Phường 4",
      "Phường 5",
      "Phường Thắng Nhì",
      "Phường Thắng Tam"
    ]
  },
  {
    "newWardId": "70119088",
    "newWardName": "Vườn Lài",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26890",
      "26941",
      "26968",
      "27001",
      "26884"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 2",
      "Phường 4",
      "Phường 9",
      "Phường 10"
    ]
  },
  {
    "newWardId": "70107070",
    "newWardName": "Xóm Chiếu",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "26905",
      "26878",
      "27277",
      "26872"
    ],
    "oldWardNames": [
      "Phường 13",
      "Phường 16",
      "Phường 18",
      "Phường 15"
    ]
  },
  {
    "newWardId": "70105068",
    "newWardName": "Xuân Hòa",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27139",
      "26968"
    ],
    "oldWardNames": [
      "Phường Võ Thị Sáu",
      "Phường 4"
    ]
  },
  {
    "newWardId": "71705017",
    "newWardName": "Xuân Sơn",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Suối Rao",
      "Xã Sơn Bình",
      "Xã Xuân Sơn"
    ]
  },
  {
    "newWardId": "70137160",
    "newWardName": "Xuân Thới Sơn",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [
      "27571",
      "27583",
      "27577"
    ],
    "oldWardNames": [
      "Xã Tân Thới Nhì",
      "Xã Xuân Thới Đông",
      "Xã Xuân Thới Sơn"
    ]
  },
  {
    "newWardId": "71707020",
    "newWardName": "Xuyên Mộc",
    "provinceId": "01",
    "provinceName": "Hồ Chí Minh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bông Trang",
      "Xã Bưng Riềng",
      "Xã Xuyên Mộc"
    ]
  },
  {
    "newWardId": "21101050",
    "newWardName": "An Tường",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2218",
      "2512",
      "2515",
      "2503",
      "2518"
    ],
    "oldWardNames": [
      "Phường Hưng Thành",
      "Phường An Tường",
      "Xã Lưỡng Vượng",
      "Xã An Khang",
      "Xã Hoàng Khai"
    ]
  },
  {
    "newWardId": "20107064",
    "newWardName": "Bạch Đích",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phú Lũng",
      "Xã Na Khê",
      "Xã Bạch Đích"
    ]
  },
  {
    "newWardId": "20115091",
    "newWardName": "Bạch Ngọc",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ngọc Minh",
      "Xã Bạch Ngọc"
    ]
  },
  {
    "newWardId": "21107021",
    "newWardName": "Bạch Xa",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2377",
      "2383",
      "2380"
    ],
    "oldWardNames": [
      "Xã Yên Thuận",
      "Xã Minh Khương",
      "Xã Bạch Xa"
    ]
  },
  {
    "newWardId": "20113117",
    "newWardName": "Bản Máy",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bản Phùng",
      "Xã Chiến Phố",
      "Xã Bản Máy"
    ]
  },
  {
    "newWardId": "20111077",
    "newWardName": "Bắc Mê",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Yên Phú",
      "Xã Yên Phong",
      "Xã Lạc Nông"
    ]
  },
  {
    "newWardId": "20119100",
    "newWardName": "Bắc Quang",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Việt Quang",
      "Xã Quang Minh",
      "Xã Việt Vinh"
    ]
  },
  {
    "newWardId": "20119099",
    "newWardName": "Bằng Hành",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Kim Ngọc",
      "Xã Vô Điếm",
      "Xã Bằng Hành"
    ]
  },
  {
    "newWardId": "20118106",
    "newWardName": "Bằng Lang",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Yên Hà",
      "Xã Bằng Lang"
    ]
  },
  {
    "newWardId": "21113004",
    "newWardName": "Bình An",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2296",
      "2290"
    ],
    "oldWardNames": [
      "Xã Thổ Bình",
      "Xã Bình An"
    ]
  },
  {
    "newWardId": "21111040",
    "newWardName": "Bình Ca",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2551",
      "2563",
      "2548"
    ],
    "oldWardNames": [
      "Xã Thượng Ấm",
      "Xã Cấp Tiến",
      "Xã Vĩnh Lợi"
    ]
  },
  {
    "newWardId": "21101051",
    "newWardName": "Bình Thuận",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2524",
      "2521"
    ],
    "oldWardNames": [
      "Phường Đội Cấn",
      "Xã Thái Long"
    ]
  },
  {
    "newWardId": "21107024",
    "newWardName": "Bình Xa",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2395",
      "2404"
    ],
    "oldWardNames": [
      "Xã Minh Hương",
      "Xã Bình Xa"
    ]
  },
  {
    "newWardId": "20109071",
    "newWardName": "Cán Tỷ",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bát Đại Sơn",
      "Xã Cán Tỷ"
    ]
  },
  {
    "newWardId": "20115094",
    "newWardName": "Cao Bồ",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Cao Bồ"
    ]
  },
  {
    "newWardId": "21103005",
    "newWardName": "Côn Lôn",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2227",
      "2245"
    ],
    "oldWardNames": [
      "Xã Sinh Long",
      "Xã Côn Lôn"
    ]
  },
  {
    "newWardId": "20107068",
    "newWardName": "Du Già",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Du Tiến",
      "Xã Du Già"
    ]
  },
  {
    "newWardId": "20119097",
    "newWardName": "Đồng Tâm",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đồng Tiến",
      "Xã Tân Phước",
      "Xã Đồng Tâm"
    ]
  },
  {
    "newWardId": "21111046",
    "newWardName": "Đông Thọ",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2587",
      "2584",
      "2572"
    ],
    "oldWardNames": [
      "Xã Đồng Quý",
      "Xã Quyết Thắng",
      "Xã Đông Thọ"
    ]
  },
  {
    "newWardId": "20103053",
    "newWardName": "Đồng Văn",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Đồng Văn",
      "Xã Tả Lủng",
      "Xã Tả Phìn",
      "Xã Thài Phìn Tủng",
      "Xã Pải Lủng"
    ]
  },
  {
    "newWardId": "20119103",
    "newWardName": "Đồng Yên",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vĩnh Phúc",
      "Xã Đồng Yên"
    ]
  },
  {
    "newWardId": "20111076",
    "newWardName": "Đường Hồng",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đường Âm",
      "Xã Phú Nam",
      "Xã Đường Hồng"
    ]
  },
  {
    "newWardId": "20107069",
    "newWardName": "Đường Thượng",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Lũng Hồ",
      "Xã Đường Thượng"
    ]
  },
  {
    "newWardId": "20111078",
    "newWardName": "Giáp Trung",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Giáp Trung"
    ]
  },
  {
    "newWardId": "20101082",
    "newWardName": "Hà Giang 1",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Nguyễn Trãi",
      "Xã Phương Thiện",
      "Xã Phương Độ",
      "Phường Quang Trung"
    ]
  },
  {
    "newWardId": "20101083",
    "newWardName": "Hà Giang 2",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Ngọc Hà",
      "Phường Trần Phú",
      "Phường Minh Khai",
      "Phường Quang Trung",
      "Xã Phong Quang"
    ]
  },
  {
    "newWardId": "21107023",
    "newWardName": "Hàm Yên",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2374",
      "2401",
      "2416",
      "2410"
    ],
    "oldWardNames": [
      "Thị trấn Tân Yên",
      "Xã Tân Thành",
      "Xã Bằng Cốc",
      "Xã Nhân Mục"
    ]
  },
  {
    "newWardId": "21105014",
    "newWardName": "Hòa An",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2344",
      "2362",
      "2353"
    ],
    "oldWardNames": [
      "Xã Tân Thịnh",
      "Xã Nhân Lý",
      "Xã Hòa An"
    ]
  },
  {
    "newWardId": "20113115",
    "newWardName": "Hoàng Su Phì",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Vinh Quang",
      "Xã Bản Luốc",
      "Xã Ngàm Đăng Vài",
      "Xã Tụ Nhân",
      "Xã Đản Ván"
    ]
  },
  {
    "newWardId": "20113112",
    "newWardName": "Hồ Thầu",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nậm Khòa",
      "Xã Nam Sơn",
      "Xã Hồ Thầu"
    ]
  },
  {
    "newWardId": "21111045",
    "newWardName": "Hồng Sơn",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2599",
      "2596",
      "2608"
    ],
    "oldWardNames": [
      "Xã Chi Thiết",
      "Xã Văn Phú",
      "Xã Hồng Sơn"
    ]
  },
  {
    "newWardId": "21103008",
    "newWardName": "Hồng Thái",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2260",
      "2275",
      "2254"
    ],
    "oldWardNames": [
      "Xã Đà Vị",
      "Xã Sơn Phú",
      "Xã Hồng Thái"
    ]
  },
  {
    "newWardId": "20119101",
    "newWardName": "Hùng An",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Việt Hồng",
      "Xã Tiên Kiều",
      "Xã Hùng An"
    ]
  },
  {
    "newWardId": "21107027",
    "newWardName": "Hùng Đức",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2425"
    ],
    "oldWardNames": [
      "Xã Hùng Đức"
    ]
  },
  {
    "newWardId": "21109028",
    "newWardName": "Hùng Lợi",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2440",
      "2455"
    ],
    "oldWardNames": [
      "Xã Trung Minh",
      "Xã Hùng Lợi"
    ]
  },
  {
    "newWardId": "20105060",
    "newWardName": "Khâu Vai",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Cán Chu Phìn",
      "Xã Lũng Pù",
      "Xã Khâu Vai"
    ]
  },
  {
    "newWardId": "20117124",
    "newWardName": "Khuôn Lùng",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nà Chì",
      "Xã Khuôn Lùng"
    ]
  },
  {
    "newWardId": "21105015",
    "newWardName": "Kiên Đài",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2332",
      "2341"
    ],
    "oldWardNames": [
      "Xã Phú Bình",
      "Xã Kiên Đài"
    ]
  },
  {
    "newWardId": "21109036",
    "newWardName": "Kiến Thiết",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2437"
    ],
    "oldWardNames": [
      "Xã Kiến Thiết"
    ]
  },
  {
    "newWardId": "21105017",
    "newWardName": "Kim Bình",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2356",
      "2371",
      "2350"
    ],
    "oldWardNames": [
      "Xã Vinh Quang",
      "Xã Bình Nhân",
      "Xã Kim Bình"
    ]
  },
  {
    "newWardId": "20115084",
    "newWardName": "Lao Chải",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Xín Chải",
      "Xã Thanh Đức",
      "Xã Lao Chải"
    ]
  },
  {
    "newWardId": "21113002",
    "newWardName": "Lâm Bình",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2266",
      "2233",
      "2242"
    ],
    "oldWardNames": [
      "Thị trấn Lăng Can",
      "Xã Phúc Yên",
      "Xã Xuân Lập"
    ]
  },
  {
    "newWardId": "20119098",
    "newWardName": "Liên Hiệp",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hữu Sản",
      "Xã Đức Xuân",
      "Xã Liên Hiệp"
    ]
  },
  {
    "newWardId": "20115090",
    "newWardName": "Linh Hồ",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ngọc Linh",
      "Xã Trung Thành",
      "Xã Linh Hồ"
    ]
  },
  {
    "newWardId": "20103052",
    "newWardName": "Lũng Cú",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Má Lé",
      "Xã Lũng Táo",
      "Xã Lũng Cú"
    ]
  },
  {
    "newWardId": "20103056",
    "newWardName": "Lũng Phìn",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Sủng Trái",
      "Xã Hố Quáng Phìn",
      "Xã Lũng Phìn"
    ]
  },
  {
    "newWardId": "20109070",
    "newWardName": "Lùng Tám",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thái An",
      "Xã Đông Hà",
      "Xã Lùng Tám"
    ]
  },
  {
    "newWardId": "21109033",
    "newWardName": "Lực Hành",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2443",
      "2434"
    ],
    "oldWardNames": [
      "Xã Quý Quân",
      "Xã Chiêu Yên",
      "Xã Lực Hành"
    ]
  },
  {
    "newWardId": "20107066",
    "newWardName": "Mậu Duệ",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ngam La",
      "Xã Mậu Long",
      "Xã Mậu Duệ"
    ]
  },
  {
    "newWardId": "20105059",
    "newWardName": "Mèo Vạc",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Mèo Vạc",
      "Xã Tả Lủng",
      "Xã Giàng Chu Phìn",
      "Xã Pả Vi"
    ]
  },
  {
    "newWardId": "20111080",
    "newWardName": "Minh Ngọc",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Minh Ngọc",
      "Xã Thượng Tân",
      "Xã Yên Định"
    ]
  },
  {
    "newWardId": "21113003",
    "newWardName": "Minh Quang",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2299",
      "2293",
      "2302"
    ],
    "oldWardNames": [
      "Xã Phúc Sơn",
      "Xã Hồng Quang",
      "Xã Minh Quang"
    ]
  },
  {
    "newWardId": "20111079",
    "newWardName": "Minh Sơn",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Minh Sơn"
    ]
  },
  {
    "newWardId": "20115086",
    "newWardName": "Minh Tân",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Minh Tân"
    ]
  },
  {
    "newWardId": "21111038",
    "newWardName": "Minh Thanh",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2554",
      "2557",
      "2542"
    ],
    "oldWardNames": [
      "Xã Bình Yên",
      "Xã Lương Thiện",
      "Xã Minh Thanh"
    ]
  },
  {
    "newWardId": "21101048",
    "newWardName": "Minh Xuân",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2215",
      "2216",
      "2200",
      "2203",
      "2206",
      "2497"
    ],
    "oldWardNames": [
      "Phường Ỷ La",
      "Phường Tân Hà",
      "Phường Phan Thiết",
      "Phường Minh Xuân",
      "Phường Tân Quang",
      "Xã Kim Phú"
    ]
  },
  {
    "newWardId": "21101047",
    "newWardName": "Mỹ Lâm",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2509",
      "2506",
      "2497"
    ],
    "oldWardNames": [
      "Phường Mỹ Lâm",
      "Xã Mỹ Bằng",
      "Xã Kim Phú"
    ]
  },
  {
    "newWardId": "21103009",
    "newWardName": "Nà Hang",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2221",
      "2281",
      "2284"
    ],
    "oldWardNames": [
      "Thị trấn Na Hang",
      "Xã Năng Khả",
      "Xã Thanh Tương"
    ]
  },
  {
    "newWardId": "20117121",
    "newWardName": "Nấm Dẩn",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Chế Là",
      "Xã Tả Nhìu",
      "Xã Nấm Dẩn"
    ]
  },
  {
    "newWardId": "20113113",
    "newWardName": "Nậm Dịch",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nậm Ty",
      "Xã Tả Sử Choóng",
      "Xã Nậm Dịch"
    ]
  },
  {
    "newWardId": "20109072",
    "newWardName": "Nghĩa Thuận",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thanh Vân",
      "Xã Nghĩa Thuận"
    ]
  },
  {
    "newWardId": "20101081",
    "newWardName": "Ngọc Đường",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ngọc Đường",
      "Xã Yên Định"
    ]
  },
  {
    "newWardId": "20107067",
    "newWardName": "Ngọc Long",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ngọc Long"
    ]
  },
  {
    "newWardId": "21109035",
    "newWardName": "Nhữ Khê",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2527",
      "2533",
      "2530"
    ],
    "oldWardNames": [
      "Xã Nhữ Hán",
      "Xã Đội Bình",
      "Xã Nhữ Khê"
    ]
  },
  {
    "newWardId": "20105061",
    "newWardName": "Niêm Sơn",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Niêm Tòng",
      "Xã Niêm Sơn"
    ]
  },
  {
    "newWardId": "21101049",
    "newWardName": "Nông Tiến",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2212",
      "2209",
      "2494"
    ],
    "oldWardNames": [
      "Phường Nông Tiến",
      "Xã Tràng Đà",
      "Xã Thái Bình"
    ]
  },
  {
    "newWardId": "20117120",
    "newWardName": "Pà Vầy Sủ",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Cốc Pài",
      "Xã Nàn Ma",
      "Xã Bản Ngò",
      "Xã Pà Vầy Sủ"
    ]
  },
  {
    "newWardId": "20103055",
    "newWardName": "Phố Bảng",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Phố Bảng",
      "Xã Phố Là",
      "Xã Phố Cáo",
      "Xã Lũng Thầu"
    ]
  },
  {
    "newWardId": "20115089",
    "newWardName": "Phú Linh",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Kim Thạch",
      "Xã Kim Linh",
      "Xã Phú Linh"
    ]
  },
  {
    "newWardId": "21111043",
    "newWardName": "Phú Lương",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2617",
      "2626",
      "2611"
    ],
    "oldWardNames": [
      "Xã Đại Phú",
      "Xã Tam Đa",
      "Xã Phú Lương"
    ]
  },
  {
    "newWardId": "21107022",
    "newWardName": "Phù Lưu",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2389",
      "2392"
    ],
    "oldWardNames": [
      "Xã Minh Dân",
      "Xã Phù Lưu"
    ]
  },
  {
    "newWardId": "20113118",
    "newWardName": "Pờ Ly Ngài",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Sán Sả Hồ",
      "Xã Nàng Đôn",
      "Xã Pờ Ly Ngài"
    ]
  },
  {
    "newWardId": "20109073",
    "newWardName": "Quản Bạ",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Tam Sơn",
      "Xã Quyết Tiến",
      "Xã Quản Bạ"
    ]
  },
  {
    "newWardId": "20118108",
    "newWardName": "Quang Bình",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Yên Bình",
      "Xã Tân Nam"
    ]
  },
  {
    "newWardId": "20117123",
    "newWardName": "Quảng Nguyên",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Quảng Nguyên"
    ]
  },
  {
    "newWardId": "20103054",
    "newWardName": "Sà Phìn",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Sủng Là",
      "Xã Sính Lủng",
      "Xã Sảng Tủng",
      "Xã Sà Phìn"
    ]
  },
  {
    "newWardId": "21111039",
    "newWardName": "Sơn Dương",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2536",
      "2566",
      "2569",
      "2560"
    ],
    "oldWardNames": [
      "Thị trấn Sơn Dương",
      "Xã Hợp Thành",
      "Xã Phúc Ứng",
      "Xã Tú Thịnh"
    ]
  },
  {
    "newWardId": "20105058",
    "newWardName": "Sơn Vĩ",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thượng Phùng",
      "Xã Xín Cái",
      "Xã Sơn Vĩ"
    ]
  },
  {
    "newWardId": "20105057",
    "newWardName": "Sủng Máng",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Lũng Chinh",
      "Xã Sủng Trà",
      "Xã Sủng Máng"
    ]
  },
  {
    "newWardId": "20105062",
    "newWardName": "Tát Ngà",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nậm Ban",
      "Xã Tát Ngà"
    ]
  },
  {
    "newWardId": "21105012",
    "newWardName": "Tân An",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2311",
      "2320"
    ],
    "oldWardNames": [
      "Xã Hà Lang",
      "Xã Tân An"
    ]
  },
  {
    "newWardId": "21109031",
    "newWardName": "Tân Long",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2461",
      "2470"
    ],
    "oldWardNames": [
      "Xã Tân Tiến",
      "Xã Tân Long"
    ]
  },
  {
    "newWardId": "21105010",
    "newWardName": "Tân Mỹ",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2314",
      "2308"
    ],
    "oldWardNames": [
      "Xã Hùng Mỹ",
      "Xã Tân Mỹ"
    ]
  },
  {
    "newWardId": "20119096",
    "newWardName": "Tân Quang",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2401"
    ],
    "oldWardNames": [
      "Xã Tân Thành",
      "Xã Tân Lập",
      "Xã Tân Quang"
    ]
  },
  {
    "newWardId": "21111041",
    "newWardName": "Tân Thanh",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2575",
      "2578",
      "2590"
    ],
    "oldWardNames": [
      "Xã Kháng Nhật",
      "Xã Hợp Hòa",
      "Xã Tân Thanh"
    ]
  },
  {
    "newWardId": "20113114",
    "newWardName": "Tân Tiến",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2461"
    ],
    "oldWardNames": [
      "Xã Tân Tiến",
      "Xã Bản Nhùng",
      "Xã Túng Sán"
    ]
  },
  {
    "newWardId": "21111037",
    "newWardName": "Tân Trào",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2476",
      "2539",
      "2545"
    ],
    "oldWardNames": [
      "Xã Kim Quan",
      "Xã Trung Yên",
      "Xã Tân Trào"
    ]
  },
  {
    "newWardId": "20118109",
    "newWardName": "Tân Trịnh",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Bắc",
      "Xã Tân Trịnh"
    ]
  },
  {
    "newWardId": "21109030",
    "newWardName": "Thái Bình",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2482",
      "2500",
      "2494"
    ],
    "oldWardNames": [
      "Xã Phú Thịnh",
      "Xã Tiến Bộ",
      "Xã Thái Bình"
    ]
  },
  {
    "newWardId": "21107026",
    "newWardName": "Thái Hòa",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2422",
      "2419"
    ],
    "oldWardNames": [
      "Xã Đức Ninh",
      "Xã Thái Hòa"
    ]
  },
  {
    "newWardId": "21107025",
    "newWardName": "Thái Sơn",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2413",
      "2407"
    ],
    "oldWardNames": [
      "Xã Thành Long",
      "Xã Thái Sơn"
    ]
  },
  {
    "newWardId": "20113116",
    "newWardName": "Thàng Tín",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Pố Lồ",
      "Xã Thèn Chu Phìn",
      "Xã Thàng Tín"
    ]
  },
  {
    "newWardId": "20107063",
    "newWardName": "Thắng Mố",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Sủng Cháng",
      "Xã Sủng Thài",
      "Xã Thắng Mố"
    ]
  },
  {
    "newWardId": "20113111",
    "newWardName": "Thông Nguyên",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Xuân Minh",
      "Xã Thông Nguyên"
    ]
  },
  {
    "newWardId": "21113001",
    "newWardName": "Thượng Lâm",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2251",
      "2269"
    ],
    "oldWardNames": [
      "Xã Khuôn Hà",
      "Xã Thượng Lâm"
    ]
  },
  {
    "newWardId": "21103007",
    "newWardName": "Thượng Nông",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2230",
      "2239"
    ],
    "oldWardNames": [
      "Xã Thượng Giáp",
      "Xã Thượng Nông"
    ]
  },
  {
    "newWardId": "20115095",
    "newWardName": "Thượng Sơn",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thượng Sơn"
    ]
  },
  {
    "newWardId": "20118110",
    "newWardName": "Tiên Nguyên",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tiên Nguyên"
    ]
  },
  {
    "newWardId": "20118104",
    "newWardName": "Tiên Yên",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vĩ Thượng",
      "Xã Hương Sơn",
      "Xã Tiên Yên"
    ]
  },
  {
    "newWardId": "21105016",
    "newWardName": "Tri Phú",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2368",
      "2359"
    ],
    "oldWardNames": [
      "Xã Linh Phú",
      "Xã Tri Phú"
    ]
  },
  {
    "newWardId": "21105019",
    "newWardName": "Trung Hà",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2305"
    ],
    "oldWardNames": [
      "Xã Trung Hà"
    ]
  },
  {
    "newWardId": "21109029",
    "newWardName": "Trung Sơn",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2467",
      "2485",
      "2458"
    ],
    "oldWardNames": [
      "Xã Đạo Viện",
      "Xã Công Đa",
      "Xã Trung Sơn"
    ]
  },
  {
    "newWardId": "20117122",
    "newWardName": "Trung Thịnh",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Cốc Rế",
      "Xã Thu Tà",
      "Xã Trung Thịnh"
    ]
  },
  {
    "newWardId": "21111044",
    "newWardName": "Trường Sinh",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2623",
      "2602",
      "2632"
    ],
    "oldWardNames": [
      "Xã Hào Phú",
      "Xã Đông Lợi",
      "Xã Trường Sinh"
    ]
  },
  {
    "newWardId": "20115088",
    "newWardName": "Tùng Bá",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tùng Bá"
    ]
  },
  {
    "newWardId": "20109074",
    "newWardName": "Tùng Vài",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Cao Mã Pờ",
      "Xã Tả Ván",
      "Xã Tùng Vài"
    ]
  },
  {
    "newWardId": "20115092",
    "newWardName": "Vị Xuyên",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Vị Xuyên",
      "Thị trấn NT Việt Lâm",
      "Xã Đạo Đức",
      "Xã Việt Lâm"
    ]
  },
  {
    "newWardId": "20115093",
    "newWardName": "Việt Lâm",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Quảng Ngần",
      "Xã Việt Lâm"
    ]
  },
  {
    "newWardId": "20119102",
    "newWardName": "Vĩnh Tuy",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Vĩnh Tuy",
      "Xã Vĩnh Hảo",
      "Xã Đông Thành"
    ]
  },
  {
    "newWardId": "20117119",
    "newWardName": "Xín Mần",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thèn Phàng",
      "Xã Nàn Xỉn",
      "Xã Bản Díu",
      "Xã Chí Cà",
      "Xã Xín Mần"
    ]
  },
  {
    "newWardId": "20118105",
    "newWardName": "Xuân Giang",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nà Khương",
      "Xã Xuân Giang"
    ]
  },
  {
    "newWardId": "21109032",
    "newWardName": "Xuân Vân",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2446",
      "2452",
      "2449"
    ],
    "oldWardNames": [
      "Xã Trung Trực",
      "Xã Phúc Ninh",
      "Xã Xuân Vân"
    ]
  },
  {
    "newWardId": "20111075",
    "newWardName": "Yên Cường",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phiêng Luông",
      "Xã Yên Cường"
    ]
  },
  {
    "newWardId": "21103006",
    "newWardName": "Yên Hoa",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2248"
    ],
    "oldWardNames": [
      "Xã Khâu Tinh",
      "Xã Yên Hoa"
    ]
  },
  {
    "newWardId": "21105011",
    "newWardName": "Yên Lập",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2323",
      "2317"
    ],
    "oldWardNames": [
      "Xã Bình Phú",
      "Xã Yên Lập"
    ]
  },
  {
    "newWardId": "20107065",
    "newWardName": "Yên Minh",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Yên Minh",
      "Xã Lao Và Chải",
      "Xã Hữu Vinh",
      "Xã Đông Minh",
      "Xã Vần Chải"
    ]
  },
  {
    "newWardId": "21105018",
    "newWardName": "Yên Nguyên",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2335",
      "2365"
    ],
    "oldWardNames": [
      "Xã Hòa Phú",
      "Xã Yên Nguyên"
    ]
  },
  {
    "newWardId": "21107020",
    "newWardName": "Yên Phú",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2386",
      "2398"
    ],
    "oldWardNames": [
      "Xã Yên Lâm",
      "Xã Yên Phú"
    ]
  },
  {
    "newWardId": "21109034",
    "newWardName": "Yên Sơn",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [
      "2473",
      "2464",
      "2479",
      "2491"
    ],
    "oldWardNames": [
      "Thị trấn Yên Sơn",
      "Xã Tứ Quận",
      "Xã Lang Quán",
      "Xã Chân Sơn"
    ]
  },
  {
    "newWardId": "20118107",
    "newWardName": "Yên Thành",
    "provinceId": "11",
    "provinceName": "Tuyên Quang",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bản Rịa",
      "Xã Yên Thành"
    ]
  },
  {
    "newWardId": "80121055",
    "newWardName": "An Lục Long",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Dương Xuân Hội",
      "Xã Long Trì",
      "Xã An Lục Long"
    ]
  },
  {
    "newWardId": "80115028",
    "newWardName": "An Ninh",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Lộc Giang",
      "Xã An Ninh Đông",
      "Xã An Ninh Tây"
    ]
  },
  {
    "newWardId": "70917068",
    "newWardName": "An Tịnh",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25717",
      "25732"
    ],
    "oldWardNames": [
      "Phường Lộc Hưng",
      "Phường An Tịnh"
    ]
  },
  {
    "newWardId": "70913096",
    "newWardName": "Bến Cầu",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25681",
      "25705",
      "25693",
      "25699"
    ],
    "oldWardNames": [
      "Thị trấn Bến Cầu",
      "Xã An Thạnh",
      "Xã Tiên Thuận",
      "Xã Lợi Thuận"
    ]
  },
  {
    "newWardId": "80117038",
    "newWardName": "Bến Lức",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25705"
    ],
    "oldWardNames": [
      "Xã An Thạnh",
      "Xã Thanh Phú",
      "Thị trấn Bến Lức"
    ]
  },
  {
    "newWardId": "80117036",
    "newWardName": "Bình Đức",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25657"
    ],
    "oldWardNames": [
      "Xã Thạnh Đức",
      "Xã Nhựt Chánh",
      "Xã Bình Đức"
    ]
  },
  {
    "newWardId": "80129009",
    "newWardName": "Bình Hiệp",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thạnh Trị",
      "Xã Bình Tân",
      "Xã Bình Hòa Tây",
      "Xã Bình Hiệp"
    ]
  },
  {
    "newWardId": "80107011",
    "newWardName": "Bình Hòa",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình Thạnh",
      "Xã Bình Hòa Đông",
      "Xã Bình Hòa Trung"
    ]
  },
  {
    "newWardId": "70901062",
    "newWardName": "Bình Minh",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25480",
      "25474",
      "25477",
      "25471",
      "25555",
      "25558"
    ],
    "oldWardNames": [
      "Phường Ninh Sơn",
      "Xã Tân Bình",
      "Xã Bình Minh",
      "Xã Thạnh Tân",
      "Xã Suối Đá",
      "Xã Phan"
    ]
  },
  {
    "newWardId": "80111017",
    "newWardName": "Bình Thành",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25537"
    ],
    "oldWardNames": [
      "Xã Tân Hiệp",
      "Xã Thuận Bình",
      "Xã Bình Hòa Hưng"
    ]
  },
  {
    "newWardId": "80125044",
    "newWardName": "Cần Đước",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Cần Đước",
      "Xã Phước Tuy",
      "Xã Tân Ân",
      "Xã Tân Chánh"
    ]
  },
  {
    "newWardId": "80127048",
    "newWardName": "Cần Giuộc",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Cần Giuộc",
      "Xã Phước Lại",
      "Xã Long Hậu"
    ]
  },
  {
    "newWardId": "70907077",
    "newWardName": "Cầu Khởi",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25561",
      "25573",
      "25570"
    ],
    "oldWardNames": [
      "Xã Phước Ninh",
      "Xã Cầu Khởi",
      "Xã Chà Là"
    ]
  },
  {
    "newWardId": "70909092",
    "newWardName": "Châu Thành",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25585",
      "25594",
      "25615",
      "25597"
    ],
    "oldWardNames": [
      "Thị trấn Châu Thành",
      "Xã Đồng Khởi",
      "Xã An Bình",
      "Xã Thái Bình"
    ]
  },
  {
    "newWardId": "70907078",
    "newWardName": "Dương Minh Châu",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25552",
      "25558",
      "25555",
      "25564"
    ],
    "oldWardNames": [
      "Thị trấn Dương Minh Châu",
      "Xã Phan",
      "Xã Suối Đá",
      "Xã Phước Minh"
    ]
  },
  {
    "newWardId": "80113026",
    "newWardName": "Đông Thành",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Đông Thành",
      "Xã Mỹ Thạnh Tây",
      "Xã Mỹ Thạnh Đông",
      "Xã Mỹ Bình"
    ]
  },
  {
    "newWardId": "80115034",
    "newWardName": "Đức Hòa",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Đức Hòa",
      "Xã Hựu Thạnh",
      "Xã Đức Hòa Hạ"
    ]
  },
  {
    "newWardId": "80113027",
    "newWardName": "Đức Huệ",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình Hòa Bắc",
      "Xã Bình Hòa Nam",
      "Xã Bình Thành"
    ]
  },
  {
    "newWardId": "80115032",
    "newWardName": "Đức Lập",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đức Lập Hạ",
      "Xã Mỹ Hạnh Bắc",
      "Xã Đức Hòa Thượng"
    ]
  },
  {
    "newWardId": "70915070",
    "newWardName": "Gia Lộc",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25672",
      "25720"
    ],
    "oldWardNames": [
      "Xã Phước Đông",
      "Phường Gia Lộc"
    ]
  },
  {
    "newWardId": "70915069",
    "newWardName": "Gò Dầu",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25723",
      "25654",
      "25678"
    ],
    "oldWardNames": [
      "Phường Gia Bình",
      "Thị trấn Gò Dầu",
      "Xã Thanh Phước"
    ]
  },
  {
    "newWardId": "70909093",
    "newWardName": "Hảo Đước",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25600",
      "25609",
      "25588"
    ],
    "oldWardNames": [
      "Xã An Cơ",
      "Xã Trí Bình",
      "Xã Hảo Đước"
    ]
  },
  {
    "newWardId": "80115030",
    "newWardName": "Hậu Nghĩa",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Hậu Nghĩa",
      "Xã Đức Lập Thượng",
      "Xã Tân Mỹ"
    ]
  },
  {
    "newWardId": "80109013",
    "newWardName": "Hậu Thạnh",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hậu Thạnh Đông",
      "Xã Hậu Thạnh Tây",
      "Xã Bắc Hòa"
    ]
  },
  {
    "newWardId": "80115029",
    "newWardName": "Hiệp Hòa",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25546"
    ],
    "oldWardNames": [
      "Xã Tân Phú",
      "Xã Hiệp Hòa",
      "Thị trấn Hiệp Hòa"
    ]
  },
  {
    "newWardId": "70909090",
    "newWardName": "Hòa Hội",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25603",
      "25606",
      "25612"
    ],
    "oldWardNames": [
      "Xã Biên Giới",
      "Xã Hòa Thạnh",
      "Xã Hòa Hội"
    ]
  },
  {
    "newWardId": "80115031",
    "newWardName": "Hòa Khánh",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hòa Khánh Tây",
      "Xã Hòa Khánh Nam",
      "Xã Hòa Khánh Đông"
    ]
  },
  {
    "newWardId": "70911065",
    "newWardName": "Hòa Thành",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25645",
      "25651"
    ],
    "oldWardNames": [
      "Phường Long Thành Trung",
      "Xã Long Thành Nam"
    ]
  },
  {
    "newWardId": "80103001",
    "newWardName": "Hưng Điền",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hưng Hà",
      "Xã Hưng Điền B",
      "Xã Hưng Điền"
    ]
  },
  {
    "newWardId": "70917071",
    "newWardName": "Hưng Thuận",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25711",
      "25714"
    ],
    "oldWardNames": [
      "Xã Đôn Thuận",
      "Xã Hưng Thuận"
    ]
  },
  {
    "newWardId": "80101060",
    "newWardName": "Khánh Hậu",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tân Khánh",
      "Phường Khánh Hậu",
      "Xã Lợi Bình Nhơn"
    ]
  },
  {
    "newWardId": "80105007",
    "newWardName": "Khánh Hưng",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hưng Điền A",
      "Xã Thái Bình Trung",
      "Xã Vĩnh Trị",
      "Xã Thái Trị",
      "Xã Khánh Hưng"
    ]
  },
  {
    "newWardId": "80129010",
    "newWardName": "Kiến Tường",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25456",
      "25468",
      "25459"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 2",
      "Phường 3"
    ]
  },
  {
    "newWardId": "80101058",
    "newWardName": "Long An",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25456",
      "25459",
      "25462"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 3",
      "Phường 4",
      "Phường 5",
      "Phường 6",
      "Xã Hướng Thọ Phú",
      "Xã Bình Thạnh"
    ]
  },
  {
    "newWardId": "80125040",
    "newWardName": "Long Cang",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Long Định",
      "Xã Phước Vân",
      "Xã Long Cang"
    ]
  },
  {
    "newWardId": "70913094",
    "newWardName": "Long Chữ",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25627",
      "25687",
      "25684"
    ],
    "oldWardNames": [
      "Xã Long Vĩnh",
      "Xã Long Phước",
      "Xã Long Chữ"
    ]
  },
  {
    "newWardId": "70911064",
    "newWardName": "Long Hoa",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25636",
      "25630",
      "25639",
      "25648",
      "25642"
    ],
    "oldWardNames": [
      "Phường Long Thành Bắc",
      "Phường Long Hoa",
      "Xã Trường Hòa",
      "Xã Trường Tây",
      "Xã Trường Đông"
    ]
  },
  {
    "newWardId": "80125045",
    "newWardName": "Long Hựu",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Long Hựu Đông",
      "Xã Long Hựu Tây"
    ]
  },
  {
    "newWardId": "70913095",
    "newWardName": "Long Thuận",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25702",
      "25690",
      "25696"
    ],
    "oldWardNames": [
      "Xã Long Thuận",
      "Xã Long Giang",
      "Xã Long Khánh"
    ]
  },
  {
    "newWardId": "70907076",
    "newWardName": "Lộc Ninh",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25576",
      "25579",
      "25564"
    ],
    "oldWardNames": [
      "Xã Bến Củi",
      "Xã Lộc Ninh",
      "Xã Phước Minh"
    ]
  },
  {
    "newWardId": "80117037",
    "newWardName": "Lương Hòa",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Bửu",
      "Xã Lương Hòa"
    ]
  },
  {
    "newWardId": "80119022",
    "newWardName": "Mỹ An",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Mỹ Phú",
      "Xã Mỹ An"
    ]
  },
  {
    "newWardId": "80115033",
    "newWardName": "Mỹ Hạnh",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đức Hòa Đông",
      "Xã Mỹ Hạnh Nam",
      "Xã Đức Hòa Thượng"
    ]
  },
  {
    "newWardId": "80125042",
    "newWardName": "Mỹ Lệ",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Trạch",
      "Xã Long Sơn",
      "Xã Mỹ Lệ"
    ]
  },
  {
    "newWardId": "80127047",
    "newWardName": "Mỹ Lộc",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phước Lâm",
      "Xã Thuận Thành",
      "Xã Mỹ Lộc"
    ]
  },
  {
    "newWardId": "80113025",
    "newWardName": "Mỹ Quý",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Mỹ Thạnh Bắc",
      "Xã Mỹ Quý Đông",
      "Xã Mỹ Quý Tây"
    ]
  },
  {
    "newWardId": "80119023",
    "newWardName": "Mỹ Thạnh",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25543"
    ],
    "oldWardNames": [
      "Xã Bình An",
      "Xã Mỹ Lạc",
      "Xã Mỹ Thạnh",
      "Xã Tân Thành"
    ]
  },
  {
    "newWardId": "80117039",
    "newWardName": "Mỹ Yên",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Long Hiệp",
      "Xã Phước Lợi",
      "Xã Mỹ Yên"
    ]
  },
  {
    "newWardId": "80109014",
    "newWardName": "Nhơn Hòa Lập",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25489"
    ],
    "oldWardNames": [
      "Xã Tân Lập",
      "Xã Nhơn Hòa",
      "Xã Nhơn Hòa Lập"
    ]
  },
  {
    "newWardId": "80109015",
    "newWardName": "Nhơn Ninh",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25543"
    ],
    "oldWardNames": [
      "Xã Tân Thành",
      "Xã Tân Ninh",
      "Xã Nhơn Ninh"
    ]
  },
  {
    "newWardId": "80123053",
    "newWardName": "Nhựt Tảo",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25474"
    ],
    "oldWardNames": [
      "Xã Tân Bình",
      "Xã Quê Mỹ Thạnh",
      "Xã Lạc Tấn",
      "Xã Nhị Thành",
      "Thủ Thừa"
    ]
  },
  {
    "newWardId": "70909091",
    "newWardName": "Ninh Điền",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25621",
      "25624"
    ],
    "oldWardNames": [
      "Xã Thành Long",
      "Xã Ninh Điền"
    ]
  },
  {
    "newWardId": "70907063",
    "newWardName": "Ninh Thạnh",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25483",
      "25567",
      "25570"
    ],
    "oldWardNames": [
      "Phường Ninh Thạnh",
      "Xã Bàu Năng",
      "Xã Chà Là"
    ]
  },
  {
    "newWardId": "70917072",
    "newWardName": "Phước Chỉ",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25729",
      "25738"
    ],
    "oldWardNames": [
      "Xã Phước Bình",
      "Xã Phước Chỉ"
    ]
  },
  {
    "newWardId": "80127046",
    "newWardName": "Phước Lý",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Long Thượng",
      "Xã Phước Hậu",
      "Xã Phước Lý"
    ]
  },
  {
    "newWardId": "70915074",
    "newWardName": "Phước Thạnh",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25663",
      "25675",
      "25669"
    ],
    "oldWardNames": [
      "Xã Hiệp Thạnh",
      "Xã Phước Trạch",
      "Xã Phước Thạnh"
    ]
  },
  {
    "newWardId": "70909089",
    "newWardName": "Phước Vinh",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25504",
      "25591"
    ],
    "oldWardNames": [
      "Xã Hòa Hiệp",
      "Xã Phước Vinh"
    ]
  },
  {
    "newWardId": "80127049",
    "newWardName": "Phước Vĩnh Tây",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Long An",
      "Xã Long Phụng",
      "Xã Phước Vĩnh Tây"
    ]
  },
  {
    "newWardId": "80125041",
    "newWardName": "Rạch Kiến",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Long Trạch",
      "Xã Long Khê",
      "Xã Long Hòa"
    ]
  },
  {
    "newWardId": "80121056",
    "newWardName": "Tầm Vu",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25663"
    ],
    "oldWardNames": [
      "Thị trấn Tầm Vu",
      "Xã Hiệp Thạnh",
      "Xã Phú Ngãi Trị",
      "Xã Phước Tân Hưng"
    ]
  },
  {
    "newWardId": "80101059",
    "newWardName": "Tân An",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường 7",
      "Xã Bình Tâm",
      "Xã Nhơn Thạnh Trung",
      "Xã An Vĩnh Ngãi"
    ]
  },
  {
    "newWardId": "70903086",
    "newWardName": "Tân Biên",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25474",
      "25501",
      "25486"
    ],
    "oldWardNames": [
      "Xã Tân Bình",
      "Xã Thạnh Tây",
      "Thị trấn Tân Biên"
    ]
  },
  {
    "newWardId": "70905080",
    "newWardName": "Tân Châu",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25516",
      "25540",
      "25546",
      "25534"
    ],
    "oldWardNames": [
      "Thị trấn Tân Châu",
      "Xã Thạnh Đông",
      "Xã Tân Phú",
      "Xã Suối Dây"
    ]
  },
  {
    "newWardId": "70905079",
    "newWardName": "Tân Đông",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25522",
      "25519"
    ],
    "oldWardNames": [
      "Xã Tân Đông",
      "Xã Tân Hà"
    ]
  },
  {
    "newWardId": "70905084",
    "newWardName": "Tân Hòa",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25528",
      "25531"
    ],
    "oldWardNames": [
      "Xã Tân Hòa",
      "Xã Suối Ngô"
    ]
  },
  {
    "newWardId": "70905082",
    "newWardName": "Tân Hội",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25537",
      "25525"
    ],
    "oldWardNames": [
      "Xã Tân Hiệp",
      "Xã Tân Hội"
    ]
  },
  {
    "newWardId": "80103003",
    "newWardName": "Tân Hưng",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Tân Hưng",
      "Xã Vĩnh Thạnh",
      "Xã Vĩnh Lợi"
    ]
  },
  {
    "newWardId": "80125043",
    "newWardName": "Tân Lân",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25672"
    ],
    "oldWardNames": [
      "Xã Phước Đông",
      "Xã Tân Lân"
    ]
  },
  {
    "newWardId": "70903085",
    "newWardName": "Tân Lập",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25489",
      "25492"
    ],
    "oldWardNames": [
      "Xã Tân Lập",
      "Xã Thạnh Bắc"
    ]
  },
  {
    "newWardId": "80119024",
    "newWardName": "Tân Long",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25702"
    ],
    "oldWardNames": [
      "Xã Long Thuận",
      "Xã Long Thạnh",
      "Xã Tân Long"
    ]
  },
  {
    "newWardId": "70901061",
    "newWardName": "Tân Ninh",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25456",
      "25468",
      "25459",
      "25465",
      "25597"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 2",
      "Phường 3",
      "Phường IV",
      "Phường Hiệp Ninh",
      "Xã Thái Bình"
    ]
  },
  {
    "newWardId": "70905081",
    "newWardName": "Tân Phú",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25549",
      "25510",
      "25513",
      "25507",
      "25546"
    ],
    "oldWardNames": [
      "Xã Tân Hưng",
      "Xã Mỏ Công",
      "Xã Trà Vong",
      "Xã Tân Phong",
      "Xã Tân Phú"
    ]
  },
  {
    "newWardId": "80127050",
    "newWardName": "Tân Tập",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đông Thạnh",
      "Xã Phước Vĩnh Đông",
      "Xã Tân Tập"
    ]
  },
  {
    "newWardId": "80111020",
    "newWardName": "Tân Tây",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25522"
    ],
    "oldWardNames": [
      "Xã Tân Đông",
      "Xã Thủy Đông",
      "Xã Tân Tây"
    ]
  },
  {
    "newWardId": "70905083",
    "newWardName": "Tân Thành",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25543",
      "25534"
    ],
    "oldWardNames": [
      "Xã Tân Thành",
      "Xã Suối Dây"
    ]
  },
  {
    "newWardId": "80109016",
    "newWardName": "Tân Thạnh",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25474",
      "25528"
    ],
    "oldWardNames": [
      "Xã Tân Bình",
      "Xã Tân Hòa",
      "Xã Kiến Bình",
      "Thị trấn Tân Thạnh"
    ]
  },
  {
    "newWardId": "80123052",
    "newWardName": "Tân Trụ",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Tân Trụ",
      "Xã Bình Trinh Đông",
      "Xã Bình Lãng",
      "Xã Bình Tịnh"
    ]
  },
  {
    "newWardId": "70903087",
    "newWardName": "Thạnh Bình",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25498",
      "25507"
    ],
    "oldWardNames": [
      "Xã Thạnh Bình",
      "Xã Tân Phong"
    ]
  },
  {
    "newWardId": "70911066",
    "newWardName": "Thanh Điền",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25633",
      "25618"
    ],
    "oldWardNames": [
      "Phường Hiệp Tân",
      "Xã Thanh Điền"
    ]
  },
  {
    "newWardId": "70915073",
    "newWardName": "Thạnh Đức",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25657",
      "25660"
    ],
    "oldWardNames": [
      "Xã Thạnh Đức",
      "Xã Cẩm Giang"
    ]
  },
  {
    "newWardId": "80111019",
    "newWardName": "Thạnh Hóa",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Thạnh Hóa",
      "Xã Thủy Tây",
      "Xã Thạnh An"
    ]
  },
  {
    "newWardId": "80117035",
    "newWardName": "Thạnh Lợi",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thạnh Hòa",
      "Xã Lương Bình",
      "Xã Thạnh Lợi"
    ]
  },
  {
    "newWardId": "80111018",
    "newWardName": "Thạnh Phước",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thuận Nghĩa Hòa",
      "Xã Thạnh Phú",
      "Xã Thạnh Phước"
    ]
  },
  {
    "newWardId": "80119021",
    "newWardName": "Thủ Thừa",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25543"
    ],
    "oldWardNames": [
      "Thị trấn Thủ Thừa",
      "Xã Bình Thạnh",
      "Xã Tân Thành",
      "Xã Nhị Thành"
    ]
  },
  {
    "newWardId": "80121054",
    "newWardName": "Thuận Mỹ",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thanh Phú Long",
      "Xã Thanh Vĩnh Đông",
      "Xã Thuận Mỹ"
    ]
  },
  {
    "newWardId": "70903088",
    "newWardName": "Trà Vong",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25510",
      "25513"
    ],
    "oldWardNames": [
      "Xã Mỏ Công",
      "Xã Trà Vong"
    ]
  },
  {
    "newWardId": "70917067",
    "newWardName": "Trảng Bàng",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25735",
      "25708"
    ],
    "oldWardNames": [
      "Phường An Hòa",
      "Phường Trảng Bàng"
    ]
  },
  {
    "newWardId": "70915075",
    "newWardName": "Truông Mít",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [
      "25666",
      "25582"
    ],
    "oldWardNames": [
      "Xã Bàu Đồn",
      "Xã Truông Mít"
    ]
  },
  {
    "newWardId": "80105005",
    "newWardName": "Tuyên Bình",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tuyên Bình",
      "Xã Tuyên Bình Tây",
      "Xã Vĩnh Bình",
      "Xã Vĩnh Thuận",
      "Xã Thái Bình Trung"
    ]
  },
  {
    "newWardId": "80129008",
    "newWardName": "Tuyên Thạnh",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thạnh Hưng",
      "Xã Tuyên Thạnh",
      "Xã Bắc Hòa"
    ]
  },
  {
    "newWardId": "80123051",
    "newWardName": "Vàm Cỏ",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Phước Tây",
      "Xã Nhựt Ninh",
      "Xã Đức Tân"
    ]
  },
  {
    "newWardId": "80103004",
    "newWardName": "Vĩnh Châu",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vĩnh Đại",
      "Xã Vĩnh Bửu",
      "Xã Vĩnh Châu A"
    ]
  },
  {
    "newWardId": "80121057",
    "newWardName": "Vĩnh Công",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hòa Phú",
      "Xã Bình Quới",
      "Xã Vĩnh Công"
    ]
  },
  {
    "newWardId": "80105006",
    "newWardName": "Vĩnh Hưng",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Vĩnh Hưng",
      "Xã Vĩnh Trị",
      "Xã Thái Trị",
      "Xã Khánh Hưng",
      "Xã Thái Bình Trung",
      "Xã Vĩnh Thuận",
      "Xã Vĩnh Bình"
    ]
  },
  {
    "newWardId": "80103002",
    "newWardName": "Vĩnh Thạnh",
    "provinceId": "09",
    "provinceName": "Tây Ninh",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thạnh Hưng",
      "Xã Vĩnh Châu B",
      "Xã Hưng Thạnh"
    ]
  },
  {
    "newWardId": "80903005",
    "newWardName": "An Bình",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29584",
      "29581",
      "29578",
      "29587"
    ],
    "oldWardNames": [
      "Xã Hòa Ninh",
      "Xã Bình Hòa Phước",
      "Xã Đồng Phú",
      "Xã An Bình"
    ]
  },
  {
    "newWardId": "81107096",
    "newWardName": "An Định",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Trung",
      "Xã Minh Đức",
      "Xã An Định"
    ]
  },
  {
    "newWardId": "81113110",
    "newWardName": "An Hiệp",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Hưng",
      "Xã An Ngãi Tây",
      "Xã An Hiệp"
    ]
  },
  {
    "newWardId": "81101077",
    "newWardName": "An Hội",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường An Hội",
      "Xã Mỹ Thạnh An",
      "Xã Phú Nhuận",
      "Xã Sơn Phú"
    ]
  },
  {
    "newWardId": "81113109",
    "newWardName": "An Ngãi Trung",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Mỹ Thạnh",
      "Xã An Phú Trung",
      "Xã An Ngãi Trung"
    ]
  },
  {
    "newWardId": "81707052",
    "newWardName": "An Phú Tân",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hòa Tân",
      "Xã An Phú Tân"
    ]
  },
  {
    "newWardId": "81115101",
    "newWardName": "An Qui",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Thuận",
      "Xã An Nhơn",
      "Xã An Qui"
    ]
  },
  {
    "newWardId": "81703040",
    "newWardName": "An Trường",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29797"
    ],
    "oldWardNames": [
      "Xã Tân Bình",
      "Xã An Trường A",
      "Xã An Trường"
    ]
  },
  {
    "newWardId": "81113106",
    "newWardName": "Ba Tri",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Ba Tri",
      "Xã Vĩnh Hòa",
      "Xã An Đức",
      "Xã Vĩnh An",
      "Xã An Bình Tây"
    ]
  },
  {
    "newWardId": "81113105",
    "newWardName": "Bảo Thạnh",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bảo Thuận",
      "Xã Bảo Thạnh"
    ]
  },
  {
    "newWardId": "81101079",
    "newWardName": "Bến Tre",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường 7",
      "Xã Bình Phú",
      "Xã Thanh Tân"
    ]
  },
  {
    "newWardId": "81111120",
    "newWardName": "Bình Đại",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Bình Đại",
      "Xã Bình Thới",
      "Xã Bình Thắng"
    ]
  },
  {
    "newWardId": "80907033",
    "newWardName": "Bình Minh",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29806",
      "29771",
      "29770"
    ],
    "oldWardNames": [
      "Xã Thuận An",
      "Phường Thành Phước",
      "Phường Cái Vồn"
    ]
  },
  {
    "newWardId": "81703044",
    "newWardName": "Bình Phú",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình Phú",
      "Xã Đại Phúc",
      "Xã Phương Thạnh"
    ]
  },
  {
    "newWardId": "80905004",
    "newWardName": "Bình Phước",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29635",
      "29638",
      "29644"
    ],
    "oldWardNames": [
      "Xã Long Mỹ",
      "Xã Hòa Tịnh",
      "Xã Bình Phước"
    ]
  },
  {
    "newWardId": "80909029",
    "newWardName": "Cái Ngang",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29746",
      "29722",
      "29728",
      "29737"
    ],
    "oldWardNames": [
      "Xã Mỹ Lộc",
      "Xã Tân Lộc",
      "Xã Hậu Lộc",
      "Xã Phú Lộc"
    ]
  },
  {
    "newWardId": "80905001",
    "newWardName": "Cái Nhum",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29629",
      "29647",
      "29641"
    ],
    "oldWardNames": [
      "Xã An Phước",
      "Xã Chánh An",
      "Thị trấn Cái Nhum"
    ]
  },
  {
    "newWardId": "80907034",
    "newWardName": "Cái Vồn",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29815",
      "29764",
      "29771",
      "29770"
    ],
    "oldWardNames": [
      "Xã Mỹ Hòa",
      "Xã Ngãi Tứ",
      "Phường Thành Phước",
      "Phường Cái Vồn"
    ]
  },
  {
    "newWardId": "81703042",
    "newWardName": "Càng Long",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Càng Long",
      "Xã Mỹ Cẩm",
      "Xã Nhị Long Phú"
    ]
  },
  {
    "newWardId": "81707050",
    "newWardName": "Cầu Kè",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Cầu Kè",
      "Xã Hòa Ân",
      "Xã Châu Điền"
    ]
  },
  {
    "newWardId": "81711060",
    "newWardName": "Cầu Ngang",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29815"
    ],
    "oldWardNames": [
      "Xã Mỹ Hòa",
      "Xã Thuận Hòa",
      "Thị trấn Cầu Ngang"
    ]
  },
  {
    "newWardId": "81109116",
    "newWardName": "Châu Hòa",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Châu Bình",
      "Xã Lương Quới",
      "Xã Châu Hòa"
    ]
  },
  {
    "newWardId": "81111123",
    "newWardName": "Châu Hưng",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Long Hòa",
      "Xã Thới Lai",
      "Xã Châu Hưng"
    ]
  },
  {
    "newWardId": "81705046",
    "newWardName": "Châu Thành",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Châu Thành (huyện Châu Thành",
      "tỉnh Trà Vinh)",
      "Xã Mỹ Chánh",
      "Xã Thanh Mỹ",
      "Xã Đa Lộc"
    ]
  },
  {
    "newWardId": "81105087",
    "newWardName": "Chợ Lách",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Long Thới",
      "Xã Hòa Nghĩa",
      "Thị trấn Chợ Lách"
    ]
  },
  {
    "newWardId": "81716069",
    "newWardName": "Duyên Hải",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29551"
    ],
    "oldWardNames": [
      "Phường 1",
      "Xã Long Toàn",
      "Xã Dân Thành"
    ]
  },
  {
    "newWardId": "81713064",
    "newWardName": "Đại An",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Định An",
      "Xã Định An",
      "Xã Đại An"
    ]
  },
  {
    "newWardId": "81115098",
    "newWardName": "Đại Điền",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phú Khánh",
      "Xã Tân Phong",
      "Xã Thới Thạnh",
      "Xã Đại Điền"
    ]
  },
  {
    "newWardId": "81715075",
    "newWardName": "Đôn Châu",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đôn Xuân",
      "Xã Đôn Châu"
    ]
  },
  {
    "newWardId": "81715073",
    "newWardName": "Đông Hải",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đông Hải"
    ]
  },
  {
    "newWardId": "81107093",
    "newWardName": "Đồng Khởi",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Định Thủy",
      "Xã Phước Hiệp",
      "Xã Bình Khánh"
    ]
  },
  {
    "newWardId": "80907035",
    "newWardName": "Đông Thành",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29813",
      "29812",
      "29809",
      "29818"
    ],
    "oldWardNames": [
      "Phường Đông Thuận",
      "Xã Đông Bình",
      "Xã Đông Thạnh",
      "Xã Đông Thành"
    ]
  },
  {
    "newWardId": "81103083",
    "newWardName": "Giao Long",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29629"
    ],
    "oldWardNames": [
      "Xã An Phước",
      "Xã Quới Sơn",
      "Xã Giao Long"
    ]
  },
  {
    "newWardId": "81109112",
    "newWardName": "Giồng Trôm",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Giồng Trôm",
      "Xã Bình Hòa",
      "Xã Bình Thành"
    ]
  },
  {
    "newWardId": "81713065",
    "newWardName": "Hàm Giang",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hàm Tân",
      "Xã Kim Sơn",
      "Xã Hàm Giang"
    ]
  },
  {
    "newWardId": "81711062",
    "newWardName": "Hiệp Mỹ",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Long Sơn",
      "Xã Hiệp Mỹ Đông",
      "Xã Hiệp Mỹ Tây"
    ]
  },
  {
    "newWardId": "80913018",
    "newWardName": "Hiếu Phụng",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29701",
      "29707",
      "29686"
    ],
    "oldWardNames": [
      "Xã Hiếu Thuận",
      "Xã Trung An",
      "Xã Hiếu Phụng"
    ]
  },
  {
    "newWardId": "80913019",
    "newWardName": "Hiếu Thành",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29710",
      "29716",
      "29713"
    ],
    "oldWardNames": [
      "Xã Hiếu Nhơn",
      "Xã Hiếu Nghĩa",
      "Xã Hiếu Thành"
    ]
  },
  {
    "newWardId": "80911024",
    "newWardName": "Hòa Bình",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29824",
      "29833",
      "29830"
    ],
    "oldWardNames": [
      "Xã Xuân Hiệp",
      "Xã Thới Hòa",
      "Xã Hòa Bình"
    ]
  },
  {
    "newWardId": "80909025",
    "newWardName": "Hòa Hiệp",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29731",
      "29743"
    ],
    "oldWardNames": [
      "Xã Hòa Thạnh",
      "Xã Hòa Lộc",
      "Xã Hòa Hiệp"
    ]
  },
  {
    "newWardId": "81705048",
    "newWardName": "Hòa Minh",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hòa Minh"
    ]
  },
  {
    "newWardId": "81701039",
    "newWardName": "Hòa Thuận",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29545"
    ],
    "oldWardNames": [
      "Phường 5",
      "Xã Hòa Thuận"
    ]
  },
  {
    "newWardId": "81709055",
    "newWardName": "Hùng Hòa",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ngãi Hùng",
      "Xã Tân Hùng",
      "Xã Hùng Hòa"
    ]
  },
  {
    "newWardId": "81105089",
    "newWardName": "Hưng Khánh Trung",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vĩnh Hòa",
      "Xã Hưng Khánh Trung A",
      "Xã Hưng Khánh Trung B"
    ]
  },
  {
    "newWardId": "81705047",
    "newWardName": "Hưng Mỹ",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hòa Lợi",
      "Xã Phước Hảo",
      "Xã Hưng Mỹ"
    ]
  },
  {
    "newWardId": "81109111",
    "newWardName": "Hưng Nhượng",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Thanh",
      "Xã Hưng Lễ",
      "Xã Hưng Nhượng"
    ]
  },
  {
    "newWardId": "81107097",
    "newWardName": "Hương Mỹ",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ngãi Đăng",
      "Xã Cẩm Sơn",
      "Xã Hương Mỹ"
    ]
  },
  {
    "newWardId": "80901009",
    "newWardName": "Long Châu",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29551",
      "29542",
      "29572"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 9",
      "Phường Trường An"
    ]
  },
  {
    "newWardId": "81701036",
    "newWardName": "Long Đức",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29554"
    ],
    "oldWardNames": [
      "Phường 4",
      "Xã Long Đức"
    ]
  },
  {
    "newWardId": "81713067",
    "newWardName": "Long Hiệp",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ngọc Biên",
      "Xã Tân Hiệp",
      "Xã Long Hiệp"
    ]
  },
  {
    "newWardId": "81705049",
    "newWardName": "Long Hòa",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Long Hòa"
    ]
  },
  {
    "newWardId": "80903006",
    "newWardName": "Long Hồ",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29602",
      "29608",
      "29599"
    ],
    "oldWardNames": [
      "Thị trấn Long Hồ",
      "Xã Long An",
      "Xã Long Phước"
    ]
  },
  {
    "newWardId": "81716071",
    "newWardName": "Long Hữu",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hiệp Thạnh",
      "Xã Long Hữu"
    ]
  },
  {
    "newWardId": "81715072",
    "newWardName": "Long Thành",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Long Thành",
      "Xã Long Khánh"
    ]
  },
  {
    "newWardId": "81715074",
    "newWardName": "Long Vĩnh",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Long Vĩnh"
    ]
  },
  {
    "newWardId": "81111122",
    "newWardName": "Lộc Thuận",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Vang Quới Đông",
      "Xã Vang Quới Tây",
      "Xã Lộc Thuận"
    ]
  },
  {
    "newWardId": "81109117",
    "newWardName": "Lương Hòa",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Lương Hòa",
      "Xã Phong Nẫm"
    ]
  },
  {
    "newWardId": "81109115",
    "newWardName": "Lương Phú",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Mỹ Thạnh",
      "Xã Thuận Điền",
      "Xã Lương Phú"
    ]
  },
  {
    "newWardId": "81713063",
    "newWardName": "Lưu Nghiệp Anh",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Quảng Hữu",
      "Xã Lưu Nghiệp Anh"
    ]
  },
  {
    "newWardId": "81107094",
    "newWardName": "Mỏ Cày",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Mỏ Cày",
      "Xã An Thạnh",
      "Xã Tân Hội",
      "Xã Đa Phước Hội"
    ]
  },
  {
    "newWardId": "81113108",
    "newWardName": "Mỹ Chánh Hòa",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29815"
    ],
    "oldWardNames": [
      "Xã Mỹ Hòa",
      "Xã Mỹ Chánh",
      "Xã Mỹ Nhơn"
    ]
  },
  {
    "newWardId": "81711058",
    "newWardName": "Mỹ Long",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Mỹ Long",
      "Xã Mỹ Long Bắc",
      "Xã Mỹ Long Nam"
    ]
  },
  {
    "newWardId": "80908032",
    "newWardName": "Mỹ Thuận",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29779",
      "29788",
      "29794"
    ],
    "oldWardNames": [
      "Xã Thành Trung",
      "Xã Nguyễn Văn Thảnh",
      "Xã Mỹ Thuận"
    ]
  },
  {
    "newWardId": "80909027",
    "newWardName": "Ngãi Tứ",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29761",
      "29767",
      "29764",
      "29821"
    ],
    "oldWardNames": [
      "Xã Loan Mỹ",
      "Xã Bình Ninh",
      "Xã Ngãi Tứ",
      "Thị trấn Trà Ôn"
    ]
  },
  {
    "newWardId": "81715076",
    "newWardName": "Ngũ Lạc",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thạnh Hòa Sơn",
      "Xã Ngũ Lạc"
    ]
  },
  {
    "newWardId": "81703043",
    "newWardName": "Nhị Long",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đại Phước",
      "Xã Đức Mỹ",
      "Xã Nhị Long"
    ]
  },
  {
    "newWardId": "81711061",
    "newWardName": "Nhị Trường",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hiệp Hòa",
      "Xã Trường Thọ",
      "Xã Nhị Trường"
    ]
  },
  {
    "newWardId": "80905003",
    "newWardName": "Nhơn Phú",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29623",
      "29626",
      "29632"
    ],
    "oldWardNames": [
      "Xã Mỹ An",
      "Xã Mỹ Phước",
      "Xã Nhơn Phú"
    ]
  },
  {
    "newWardId": "81108092",
    "newWardName": "Nhuận Phú Tân",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Khánh Thạnh Tân",
      "Xã Tân Thanh Tây",
      "Xã Nhuận Phú Tân"
    ]
  },
  {
    "newWardId": "81707051",
    "newWardName": "Phong Thạnh",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ninh Thới",
      "Xã Phong Phú",
      "Xã Phong Thạnh"
    ]
  },
  {
    "newWardId": "81101078",
    "newWardName": "Phú Khương",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29560"
    ],
    "oldWardNames": [
      "Phường 8",
      "Phường Phú Khương",
      "Xã Phú Hưng",
      "Xã Nhơn Thạnh"
    ]
  },
  {
    "newWardId": "81105086",
    "newWardName": "Phú Phụng",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Sơn Định",
      "Xã Vĩnh Bình",
      "Xã Phú Phụng"
    ]
  },
  {
    "newWardId": "80903007",
    "newWardName": "Phú Quới",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29605",
      "29617",
      "29614",
      "29611"
    ],
    "oldWardNames": [
      "Xã Lộc Hòa",
      "Xã Hòa Phú",
      "Xã Thạnh Quới",
      "Xã Phú Quới"
    ]
  },
  {
    "newWardId": "81103081",
    "newWardName": "Phú Tân",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Phú Tân",
      "Xã Hữu Định",
      "Xã Phước Thạnh"
    ]
  },
  {
    "newWardId": "81111124",
    "newWardName": "Phú Thuận",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Long Định",
      "Xã Tam Hiệp",
      "Xã Phú Thuận"
    ]
  },
  {
    "newWardId": "81103082",
    "newWardName": "Phú Túc",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Châu Thành (huyện Châu Thành",
      "tỉnh Bến Tre)",
      "Xã Tân Thạch",
      "Xã Tường Đa",
      "Xã Phú Túc"
    ]
  },
  {
    "newWardId": "80901010",
    "newWardName": "Phước Hậu",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29557",
      "29554",
      "29596"
    ],
    "oldWardNames": [
      "Phường 3",
      "Phường 4",
      "Xã Phước Hậu"
    ]
  },
  {
    "newWardId": "81109114",
    "newWardName": "Phước Long",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29635"
    ],
    "oldWardNames": [
      "Xã Long Mỹ",
      "Xã Hưng Phong",
      "Xã Phước Long"
    ]
  },
  {
    "newWardId": "81108090",
    "newWardName": "Phước Mỹ Trung",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Phước Mỹ Trung",
      "Xã Phú Mỹ",
      "Xã Thạnh Ngãi",
      "Xã Tân Phú Tây"
    ]
  },
  {
    "newWardId": "80913016",
    "newWardName": "Quới An",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29680",
      "29662",
      "29668"
    ],
    "oldWardNames": [
      "Xã Trung Thành Tây",
      "Xã Tân Quới Trung",
      "Xã Quới An"
    ]
  },
  {
    "newWardId": "81115099",
    "newWardName": "Quới Điền",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hòa Lợi",
      "Xã Mỹ Hưng",
      "Xã Quới Điền"
    ]
  },
  {
    "newWardId": "80913013",
    "newWardName": "Quới Thiện",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29677",
      "29665"
    ],
    "oldWardNames": [
      "Xã Thanh Bình",
      "Xã Quới Thiện"
    ]
  },
  {
    "newWardId": "81705045",
    "newWardName": "Song Lộc",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Lương Hòa",
      "Xã Lương Hòa A",
      "Xã Song Lộc"
    ]
  },
  {
    "newWardId": "80909028",
    "newWardName": "Song Phú",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29749",
      "29752",
      "29725",
      "29740"
    ],
    "oldWardNames": [
      "Xã Tân Phú",
      "Xã Long Phú",
      "Xã Phú Thịnh",
      "Xã Song Phú"
    ]
  },
  {
    "newWardId": "81101080",
    "newWardName": "Sơn Đông",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường 6",
      "Xã Sơn Đông",
      "Xã Tam Phước"
    ]
  },
  {
    "newWardId": "80909026",
    "newWardName": "Tam Bình",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29755",
      "29719"
    ],
    "oldWardNames": [
      "Xã Mỹ Thạnh Trung",
      "Thị trấn Tam Bình"
    ]
  },
  {
    "newWardId": "81707053",
    "newWardName": "Tam Ngãi",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thông Hòa",
      "Xã Thạnh Phú",
      "Xã Tam Ngãi"
    ]
  },
  {
    "newWardId": "81703041",
    "newWardName": "Tân An",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Huyền Hội",
      "Xã Tân An"
    ]
  },
  {
    "newWardId": "80901011",
    "newWardName": "Tân Hạnh",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29560",
      "29593"
    ],
    "oldWardNames": [
      "Phường 8",
      "Xã Tân Hạnh"
    ]
  },
  {
    "newWardId": "81109113",
    "newWardName": "Tân Hào",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Lợi Thạnh",
      "Xã Thạnh Phú Đông",
      "Xã Tân Hào"
    ]
  },
  {
    "newWardId": "81709054",
    "newWardName": "Tân Hòa",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Long Thới",
      "Xã Tân Hòa",
      "Thị trấn Cầu Quan"
    ]
  },
  {
    "newWardId": "80905002",
    "newWardName": "Tân Long Hội",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29650",
      "29653",
      "29656"
    ],
    "oldWardNames": [
      "Xã Tân An Hội",
      "Xã Tân Long",
      "Xã Tân Long Hội"
    ]
  },
  {
    "newWardId": "80908031",
    "newWardName": "Tân Lược",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29776",
      "29782",
      "29785"
    ],
    "oldWardNames": [
      "Xã Tân Thành",
      "Xã Tân An Thạnh",
      "Xã Tân Lược"
    ]
  },
  {
    "newWardId": "80901012",
    "newWardName": "Tân Ngãi",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29566",
      "29569",
      "29563"
    ],
    "oldWardNames": [
      "Phường Tân Hòa",
      "Phường Tân Hội",
      "Phường Tân Ngãi"
    ]
  },
  {
    "newWardId": "81103085",
    "newWardName": "Tân Phú",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29749"
    ],
    "oldWardNames": [
      "Xã Tân Phú",
      "Xã Tiên Long",
      "Xã Phú Đức"
    ]
  },
  {
    "newWardId": "80908030",
    "newWardName": "Tân Quới",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29797",
      "29791",
      "29800"
    ],
    "oldWardNames": [
      "Xã Tân Bình",
      "Xã Thành Lợi",
      "Thị trấn Tân Quới"
    ]
  },
  {
    "newWardId": "81108091",
    "newWardName": "Tân Thành Bình",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29797"
    ],
    "oldWardNames": [
      "Xã Tân Bình",
      "Xã Thành An",
      "Xã Hòa Lộc",
      "Xã Tân Thành Bình"
    ]
  },
  {
    "newWardId": "81113104",
    "newWardName": "Tân Thủy",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Tiệm Tôm",
      "Xã An Hòa Tây",
      "Xã Tân Thủy"
    ]
  },
  {
    "newWardId": "81113107",
    "newWardName": "Tân Xuân",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phú Lễ",
      "Xã Phước Ngãi",
      "Xã Tân Xuân"
    ]
  },
  {
    "newWardId": "81709057",
    "newWardName": "Tập Ngãi",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hiếu Tử",
      "Xã Tập Ngãi"
    ]
  },
  {
    "newWardId": "81713068",
    "newWardName": "Tập Sơn",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Sơn",
      "Xã Phước Hưng",
      "Xã Tập Sơn"
    ]
  },
  {
    "newWardId": "80901008",
    "newWardName": "Thanh Đức",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29545",
      "29590"
    ],
    "oldWardNames": [
      "Phường 5",
      "Xã Thanh Đức"
    ]
  },
  {
    "newWardId": "81115102",
    "newWardName": "Thạnh Hải",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Điền",
      "Xã Thạnh Hải"
    ]
  },
  {
    "newWardId": "81115103",
    "newWardName": "Thạnh Phong",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Giao Thạnh",
      "Xã Thạnh Phong"
    ]
  },
  {
    "newWardId": "81115100",
    "newWardName": "Thạnh Phú",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29623"
    ],
    "oldWardNames": [
      "Thị trấn Thạnh Phú",
      "Xã An Thạnh",
      "Xã Bình Thạnh",
      "Xã Mỹ An"
    ]
  },
  {
    "newWardId": "81111119",
    "newWardName": "Thạnh Phước",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đại Hòa Lộc",
      "Xã Thạnh Phước"
    ]
  },
  {
    "newWardId": "81107095",
    "newWardName": "Thành Thới",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Thới",
      "Xã Thành Thới A",
      "Xã Thành Thới B"
    ]
  },
  {
    "newWardId": "81111121",
    "newWardName": "Thạnh Trị",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Định Trung",
      "Xã Phú Long",
      "Xã Thạnh Trị"
    ]
  },
  {
    "newWardId": "81111118",
    "newWardName": "Thới Thuận",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thừa Đức",
      "Xã Thới Thuận"
    ]
  },
  {
    "newWardId": "81103084",
    "newWardName": "Tiên Thủy",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Tiên Thủy",
      "Xã Thành Triệu",
      "Xã Quới Thành"
    ]
  },
  {
    "newWardId": "81709056",
    "newWardName": "Tiểu Cần",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Tiểu Cần",
      "Xã Phú Cần",
      "Xã Hiếu Trung"
    ]
  },
  {
    "newWardId": "80911022",
    "newWardName": "Trà Côn",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29827",
      "29836",
      "29839",
      "29719"
    ],
    "oldWardNames": [
      "Xã Nhơn Bình",
      "Xã Trà Côn",
      "Xã Tân Mỹ",
      "Thị trấn Tam Bình"
    ]
  },
  {
    "newWardId": "81713066",
    "newWardName": "Trà Cú",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Trà Cú",
      "Xã Ngãi Xuyên",
      "Xã Thanh Sơn"
    ]
  },
  {
    "newWardId": "80911021",
    "newWardName": "Trà Ôn",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29860",
      "29821"
    ],
    "oldWardNames": [
      "Xã Tích Thiện",
      "Thị trấn Trà Ôn"
    ]
  },
  {
    "newWardId": "81701037",
    "newWardName": "Trà Vinh",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29551",
      "29557",
      "29542"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 3",
      "Phường 9"
    ]
  },
  {
    "newWardId": "80913017",
    "newWardName": "Trung Hiệp",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29674",
      "29671",
      "29683"
    ],
    "oldWardNames": [
      "Xã Tân An Luông",
      "Xã Trung Chánh",
      "Xã Trung Hiệp"
    ]
  },
  {
    "newWardId": "80913015",
    "newWardName": "Trung Ngãi",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29689",
      "29704",
      "29698"
    ],
    "oldWardNames": [
      "Xã Trung Thành Đông",
      "Xã Trung Nghĩa",
      "Xã Trung Ngãi"
    ]
  },
  {
    "newWardId": "80913014",
    "newWardName": "Trung Thành",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29659",
      "29695",
      "29692"
    ],
    "oldWardNames": [
      "Thị trấn Vũng Liêm",
      "Xã Trung Hiếu",
      "Xã Trung Thành"
    ]
  },
  {
    "newWardId": "81716070",
    "newWardName": "Trường Long Hòa",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường 2",
      "Xã Trường Long Hòa"
    ]
  },
  {
    "newWardId": "81711059",
    "newWardName": "Vinh Kim",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Kim Hòa",
      "Xã Vinh Kim"
    ]
  },
  {
    "newWardId": "81105088",
    "newWardName": "Vĩnh Thành",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phú Sơn",
      "Xã Tân Thiềng",
      "Xã Vĩnh Thành"
    ]
  },
  {
    "newWardId": "80911023",
    "newWardName": "Vĩnh Xuân",
    "provinceId": "09",
    "provinceName": "Vĩnh Long",
    "oldWardIds": [
      "29842",
      "29848",
      "29845"
    ],
    "oldWardNames": [
      "Xã Hựu Thành",
      "Xã Thuận Thới",
      "Xã Vĩnh Xuân"
    ]
  },
  {
    "newWardId": "30121044",
    "newWardName": "Búng Lao",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3292",
      "3299",
      "3301"
    ],
    "oldWardNames": [
      "Xã Ẳng Tở",
      "Xã Chiềng Đông",
      "Xã Búng Lao"
    ]
  },
  {
    "newWardId": "30123035",
    "newWardName": "Chà Tở",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3174",
      "3175"
    ],
    "oldWardNames": [
      "Xã Nậm Khăn",
      "Xã Chà Tở"
    ]
  },
  {
    "newWardId": "30115015",
    "newWardName": "Chiềng Sinh",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3283",
      "3277",
      "3284",
      "3298"
    ],
    "oldWardNames": [
      "Xã Nà Sáy",
      "Xã Mường Thín",
      "Xã Mường Khong",
      "Xã Chiềng Sinh"
    ]
  },
  {
    "newWardId": "30101002",
    "newWardName": "Điện Biên Phủ",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3127",
      "3133",
      "3136",
      "3130",
      "3142",
      "3145"
    ],
    "oldWardNames": [
      "Phường Him Lam",
      "Phường Tân Thanh",
      "Phường Mường Thanh",
      "Phường Thanh Bình",
      "Phường Thanh Trường",
      "Xã Thanh Minh"
    ]
  },
  {
    "newWardId": "30121042",
    "newWardName": "Mường Ảng",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3256",
      "3307",
      "3310"
    ],
    "oldWardNames": [
      "Thị trấn Mường Ảng",
      "Xã Ẳng Nưa",
      "Xã Ẳng Cang"
    ]
  },
  {
    "newWardId": "30123032",
    "newWardName": "Mường Chà",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3166",
      "3187",
      "3156",
      "3165"
    ],
    "oldWardNames": [
      "Xã Chà Cang",
      "Xã Chà Nưa",
      "Xã Nậm Tin",
      "Xã Pa Tần"
    ]
  },
  {
    "newWardId": "30121045",
    "newWardName": "Mường Lạn",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3312",
      "3302",
      "3313"
    ],
    "oldWardNames": [
      "Xã Nặm Lịch",
      "Xã Xuân Lao",
      "Xã Mường Lạn"
    ]
  },
  {
    "newWardId": "30103004",
    "newWardName": "Mường Lay",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3148",
      "3151",
      "3184"
    ],
    "oldWardNames": [
      "Phường Sông Đà",
      "Phường Na Lay",
      "Xã Lay Nưa",
      "Xã Sá Tổng"
    ]
  },
  {
    "newWardId": "30119029",
    "newWardName": "Mường Luân",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3211",
      "3214"
    ],
    "oldWardNames": [
      "Xã Chiềng Sơ",
      "Xã Luân Giói",
      "Xã Mường Luân"
    ]
  },
  {
    "newWardId": "30115013",
    "newWardName": "Mường Mùn",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3262",
      "3269",
      "3268"
    ],
    "oldWardNames": [
      "Xã Mùn Chung",
      "Xã Pú Xi",
      "Xã Mường Mùn"
    ]
  },
  {
    "newWardId": "30117010",
    "newWardName": "Mường Nhà",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3367",
      "3368",
      "3364"
    ],
    "oldWardNames": [
      "Xã Mường Lói",
      "Xã Phu Luông",
      "Xã Mường Nhà"
    ]
  },
  {
    "newWardId": "30104037",
    "newWardName": "Mường Nhé",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3161",
      "3157",
      "3160"
    ],
    "oldWardNames": [
      "Xã Nậm Vì",
      "Xã Chung Chải",
      "Xã Mường Nhé"
    ]
  },
  {
    "newWardId": "30101001",
    "newWardName": "Mường Phăng",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3317",
      "3326",
      "3325"
    ],
    "oldWardNames": [
      "Xã Nà Nhạn",
      "Xã Pá Khoang",
      "Xã Mường Phăng"
    ]
  },
  {
    "newWardId": "30111025",
    "newWardName": "Mường Pồn",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3202",
      "3319"
    ],
    "oldWardNames": [
      "Xã Mường Mươn",
      "Xã Mường Pồn"
    ]
  },
  {
    "newWardId": "30101003",
    "newWardName": "Mường Thanh",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3124",
      "3139",
      "3334"
    ],
    "oldWardNames": [
      "Phường Noong Bua",
      "Phường Nam Thanh",
      "Xã Thanh Xương"
    ]
  },
  {
    "newWardId": "30104039",
    "newWardName": "Mường Toong",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3163"
    ],
    "oldWardNames": [
      "Xã Huổi Lếch",
      "Xã Mường Toong"
    ]
  },
  {
    "newWardId": "30111022",
    "newWardName": "Mường Tùng",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3196",
      "3181"
    ],
    "oldWardNames": [
      "Xã Huổi Lèng",
      "Xã Mường Tùng"
    ]
  },
  {
    "newWardId": "30123034",
    "newWardName": "Nà Bủng",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3176",
      "3170"
    ],
    "oldWardNames": [
      "Xã Vàng Đán",
      "Xã Nà Bủng"
    ]
  },
  {
    "newWardId": "30123033",
    "newWardName": "Nà Hỳ",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3168",
      "3171",
      "3173",
      "3169"
    ],
    "oldWardNames": [
      "Xã Nà Khoa",
      "Xã Nậm Nhừ",
      "Xã Nậm Chua",
      "Xã Nà Hỳ"
    ]
  },
  {
    "newWardId": "30111021",
    "newWardName": "Na Sang",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3172",
      "3200",
      "3197",
      "3201"
    ],
    "oldWardNames": [
      "Thị trấn Mường Chà",
      "Xã Ma Thì Hồ",
      "Xã Sa Lông",
      "Xã Na Sang"
    ]
  },
  {
    "newWardId": "30119026",
    "newWardName": "Na Son",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3203",
      "3376",
      "3205"
    ],
    "oldWardNames": [
      "Thị trấn Điện Biên Đông",
      "Xã Keo Lôm",
      "Xã Na Son"
    ]
  },
  {
    "newWardId": "30121043",
    "newWardName": "Nà Tấu",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3286",
      "3287",
      "3316"
    ],
    "oldWardNames": [
      "Xã Mường Đăng",
      "Xã Ngối Cáy",
      "Xã Nà Tấu"
    ]
  },
  {
    "newWardId": "30104040",
    "newWardName": "Nậm Kè",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3159",
      "3162"
    ],
    "oldWardNames": [
      "Xã Pá Mỳ",
      "Xã Nậm Kè"
    ]
  },
  {
    "newWardId": "30111024",
    "newWardName": "Nậm Nèn",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3191",
      "3194"
    ],
    "oldWardNames": [
      "Xã Huổi Mí",
      "Xã Nậm Nèn"
    ]
  },
  {
    "newWardId": "30117009",
    "newWardName": "Núa Ngam",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3359",
      "3365",
      "3358"
    ],
    "oldWardNames": [
      "Xã Hẹ Muông",
      "Xã Na Tông",
      "Xã Núa Ngam"
    ]
  },
  {
    "newWardId": "30111023",
    "newWardName": "Pa Ham",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3190",
      "3193"
    ],
    "oldWardNames": [
      "Xã Hừa Ngài",
      "Xã Pa Ham"
    ]
  },
  {
    "newWardId": "30119031",
    "newWardName": "Phình Giàng",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3383",
      "3382"
    ],
    "oldWardNames": [
      "Xã Pú Hồng",
      "Xã Phình Giàng"
    ]
  },
  {
    "newWardId": "30119028",
    "newWardName": "Pu Nhi",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3371"
    ],
    "oldWardNames": [
      "Xã Nong U",
      "Xã Pu Nhi"
    ]
  },
  {
    "newWardId": "30115014",
    "newWardName": "Pú Nhung",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3260",
      "3265",
      "3271"
    ],
    "oldWardNames": [
      "Xã Rạng Đông",
      "Xã Ta Ma",
      "Xã Pú Nhung"
    ]
  },
  {
    "newWardId": "30115012",
    "newWardName": "Quài Tở",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3280",
      "3304",
      "3295"
    ],
    "oldWardNames": [
      "Xã Tỏa Tình",
      "Xã Tênh Phông",
      "Xã Quài Tở"
    ]
  },
  {
    "newWardId": "30104041",
    "newWardName": "Quảng Lâm",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3167",
      "3164"
    ],
    "oldWardNames": [
      "Xã Na Cô Sa",
      "Xã Quảng Lâm"
    ]
  },
  {
    "newWardId": "30117008",
    "newWardName": "Sam Mứn",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3356",
      "3361"
    ],
    "oldWardNames": [
      "Xã Pom Lót",
      "Xã Na Ư"
    ]
  },
  {
    "newWardId": "30113020",
    "newWardName": "Sáng Nhè",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3247",
      "3259"
    ],
    "oldWardNames": [
      "Xã Xá Nhè",
      "Xã Mường Đun",
      "Xã Phình Sáng"
    ]
  },
  {
    "newWardId": "30123036",
    "newWardName": "Si Pa Phìn",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3198",
      "3199"
    ],
    "oldWardNames": [
      "Xã Phìn Hồ",
      "Xã Si Pa Phìn"
    ]
  },
  {
    "newWardId": "30113017",
    "newWardName": "Sín Chải",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3226",
      "3229"
    ],
    "oldWardNames": [
      "Xã Tả Sìn Thàng",
      "Xã Lao Xả Phình",
      "Xã Sín Chải"
    ]
  },
  {
    "newWardId": "30104038",
    "newWardName": "Sín Thầu",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3155",
      "3158",
      "3154"
    ],
    "oldWardNames": [
      "Xã Sen Thượng",
      "Xã Leng Su Sìn",
      "Xã Sín Thầu"
    ]
  },
  {
    "newWardId": "30113018",
    "newWardName": "Sính Phình",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3238",
      "3232",
      "3241"
    ],
    "oldWardNames": [
      "Xã Trung Thu",
      "Xã Tả Phìn",
      "Xã Sính Phình"
    ]
  },
  {
    "newWardId": "30117006",
    "newWardName": "Thanh An",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3355",
      "3343"
    ],
    "oldWardNames": [
      "Xã Noong Hẹt",
      "Xã Sam Mứn",
      "Xã Thanh An"
    ]
  },
  {
    "newWardId": "30117005",
    "newWardName": "Thanh Nưa",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3323",
      "3328",
      "3331",
      "3337",
      "3322"
    ],
    "oldWardNames": [
      "Xã Hua Thanh",
      "Xã Thanh Luông",
      "Xã Thanh Hưng",
      "Xã Thanh Chăn",
      "Xã Thanh Nưa"
    ]
  },
  {
    "newWardId": "30117007",
    "newWardName": "Thanh Yên",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3349",
      "3340",
      "3346"
    ],
    "oldWardNames": [
      "Xã Noong Luống",
      "Xã Pa Thơm",
      "Xã Thanh Yên"
    ]
  },
  {
    "newWardId": "30119030",
    "newWardName": "Tìa Dình",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3385",
      "3384"
    ],
    "oldWardNames": [
      "Xã Háng Lìa",
      "Xã Tìa Dình"
    ]
  },
  {
    "newWardId": "30113016",
    "newWardName": "Tủa Chùa",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3217",
      "3250",
      "3263"
    ],
    "oldWardNames": [
      "Thị trấn Tủa Chùa",
      "Xã Mường Báng",
      "Xã Nà Tòng"
    ]
  },
  {
    "newWardId": "30113019",
    "newWardName": "Tủa Thàng",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3220",
      "3235"
    ],
    "oldWardNames": [
      "Xã Huổi Só",
      "Xã Tủa Thàng"
    ]
  },
  {
    "newWardId": "30115011",
    "newWardName": "Tuần Giáo",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3253",
      "3289",
      "3274"
    ],
    "oldWardNames": [
      "Thị trấn Tuần Giáo",
      "Xã Quài Cang",
      "Xã Quài Nưa"
    ]
  },
  {
    "newWardId": "30119027",
    "newWardName": "Xa Dung",
    "provinceId": "01",
    "provinceName": "Điện Biên",
    "oldWardIds": [
      "3208",
      "3373"
    ],
    "oldWardNames": [
      "Xã Phì Nhừ",
      "Xã Xa Dung"
    ]
  },
  {
    "newWardId": "50105005",
    "newWardName": "An Hải",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [
      "20275",
      "20272",
      "20278"
    ],
    "oldWardNames": [
      "Phường Phước Mỹ",
      "Phường An Hải Bắc",
      "Phường An Hải Nam"
    ]
  },
  {
    "newWardId": "50115004",
    "newWardName": "An Khê",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [
      "20306",
      "20305",
      "20224"
    ],
    "oldWardNames": [
      "Phường Hòa An",
      "Phường Hòa Phát",
      "Phường An Khê"
    ]
  },
  {
    "newWardId": "50309061",
    "newWardName": "An Thắng",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Điện An",
      "Phường Điện Thắng Nam",
      "Phường Điện Thắng Trung"
    ]
  },
  {
    "newWardId": "50304084",
    "newWardName": "Avương",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bhalêê",
      "Xã Avương"
    ]
  },
  {
    "newWardId": "50111015",
    "newWardName": "Bà Nà",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [
      "20299",
      "20308"
    ],
    "oldWardNames": [
      "Xã Hòa Ninh",
      "Xã Hòa Nhơn"
    ]
  },
  {
    "newWardId": "50301026",
    "newWardName": "Bàn Thạch",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tân Thạnh",
      "Phường Hòa Thuận",
      "Xã Tam Thăng"
    ]
  },
  {
    "newWardId": "50313075",
    "newWardName": "Bến Giằng",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Cà Dy",
      "Xã Tà Bhing",
      "Xã Tà Pơơ"
    ]
  },
  {
    "newWardId": "50305083",
    "newWardName": "Bến Hiên",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Kà Dăng",
      "Xã Mà Cooih"
    ]
  },
  {
    "newWardId": "50115011",
    "newWardName": "Cẩm Lệ",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [
      "20311",
      "20312",
      "20260"
    ],
    "oldWardNames": [
      "Phường Hòa Thọ Tây",
      "Phường Hòa Thọ Đông",
      "Phường Khuê Trung"
    ]
  },
  {
    "newWardId": "50302028",
    "newWardName": "Chiên Đàn",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Phú Thịnh",
      "Xã Tam Đàn",
      "Xã Tam Thái"
    ]
  },
  {
    "newWardId": "50311055",
    "newWardName": "Duy Nghĩa",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Duy Thành",
      "Xã Duy Hải",
      "Xã Duy Nghĩa"
    ]
  },
  {
    "newWardId": "50311057",
    "newWardName": "Duy Xuyên",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Duy Trung",
      "Xã Duy Sơn",
      "Xã Duy Trinh"
    ]
  },
  {
    "newWardId": "50307069",
    "newWardName": "Đại Lộc",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Ái Nghĩa",
      "Xã Đại Hiệp",
      "Xã Đại Hòa",
      "Xã Đại An",
      "Xã Đại Nghĩa"
    ]
  },
  {
    "newWardId": "50313077",
    "newWardName": "Đắc Pring",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đắc Pre",
      "Xã Đắc Pring"
    ]
  },
  {
    "newWardId": "50309059",
    "newWardName": "Điện Bàn",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Điện Phương",
      "Phường Điện Minh",
      "Phường Vĩnh Điện"
    ]
  },
  {
    "newWardId": "50309062",
    "newWardName": "Điện Bàn Bắc",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Điện Thắng Bắc",
      "Xã Điện Hòa",
      "Xã Điện Tiến"
    ]
  },
  {
    "newWardId": "50309060",
    "newWardName": "Điện Bàn Đông",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Điện Nam Đông",
      "Phường Điện Nam Trung",
      "Phường Điện Dương",
      "Phường Điện Ngọc",
      "Phường Điện Nam Bắc"
    ]
  },
  {
    "newWardId": "50309063",
    "newWardName": "Điện Bàn Tây",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Điện Hồng",
      "Xã Điện Thọ",
      "Xã Điện Phước"
    ]
  },
  {
    "newWardId": "50315049",
    "newWardName": "Đồng Dương",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình Lãnh",
      "Xã Bình Trị",
      "Xã Bình Định"
    ]
  },
  {
    "newWardId": "50305082",
    "newWardName": "Đông Giang",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Prao",
      "Xã Tà Lu",
      "Xã A Rooi",
      "Xã Zà Hung"
    ]
  },
  {
    "newWardId": "50325020",
    "newWardName": "Đức Phú",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tam Sơn",
      "Xã Tam Thạnh"
    ]
  },
  {
    "newWardId": "50309064",
    "newWardName": "Gò Nổi",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Điện Phong",
      "Xã Điện Trung",
      "Xã Điện Quang"
    ]
  },
  {
    "newWardId": "50307070",
    "newWardName": "Hà Nha",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đại Đồng",
      "Xã Đại Hồng",
      "Xã Đại Quang"
    ]
  },
  {
    "newWardId": "50101001",
    "newWardName": "Hải Châu",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [
      "20227",
      "20230",
      "20233",
      "20242",
      "20236"
    ],
    "oldWardNames": [
      "Phường Thanh Bình",
      "Phường Thuận Phước",
      "Phường Thạch Thang",
      "Phường Phước Ninh",
      "Phường Hải Châu"
    ]
  },
  {
    "newWardId": "50109009",
    "newWardName": "Hải Vân",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [
      "20194",
      "20195",
      "20293",
      "20296"
    ],
    "oldWardNames": [
      "Phường Hòa Hiệp Bắc",
      "Phường Hòa Hiệp Nam",
      "Xã Hòa Bắc",
      "Xã Hòa Liên"
    ]
  },
  {
    "newWardId": "50319087",
    "newWardName": "Hiệp Đức",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Tân Bình",
      "Xã Quế Tân",
      "Xã Quế Lưu"
    ]
  },
  {
    "newWardId": "50101002",
    "newWardName": "Hòa Cường",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [
      "20254",
      "20245",
      "20257",
      "20258"
    ],
    "oldWardNames": [
      "Phường Bình Thuận",
      "Phường Hòa Thuận Tây",
      "Phường Hòa Cường Bắc",
      "Phường Hòa Cường Nam"
    ]
  },
  {
    "newWardId": "50109008",
    "newWardName": "Hòa Khánh",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [
      "20198",
      "20200",
      "20302"
    ],
    "oldWardNames": [
      "Phường Hòa Khánh Nam",
      "Phường Hòa Minh",
      "Xã Hòa Sơn"
    ]
  },
  {
    "newWardId": "50111014",
    "newWardName": "Hòa Tiến",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [
      "20332",
      "20326"
    ],
    "oldWardNames": [
      "Xã Hòa Khương",
      "Xã Hòa Tiến"
    ]
  },
  {
    "newWardId": "50111013",
    "newWardName": "Hòa Vang",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [
      "20320",
      "20317"
    ],
    "oldWardNames": [
      "Xã Hòa Phong",
      "Xã Hòa Phú"
    ]
  },
  {
    "newWardId": "50111012",
    "newWardName": "Hòa Xuân",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [
      "20314",
      "20323",
      "20329"
    ],
    "oldWardNames": [
      "Phường Hòa Xuân",
      "Xã Hòa Châu",
      "Xã Hòa Phước"
    ]
  },
  {
    "newWardId": "50303065",
    "newWardName": "Hội An",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Minh An",
      "Phường Cẩm Phô",
      "Phường Sơn Phong",
      "Phường Cẩm Nam",
      "Xã Cẩm Kim"
    ]
  },
  {
    "newWardId": "50303066",
    "newWardName": "Hội An Đông",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Cẩm Châu",
      "Phường Cửa Đại",
      "Xã Cẩm Thanh"
    ]
  },
  {
    "newWardId": "50303067",
    "newWardName": "Hội An Tây",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Thanh Hà",
      "Phường Tân An",
      "Phường Cẩm An",
      "Xã Cẩm Hà"
    ]
  },
  {
    "newWardId": "50304086",
    "newWardName": "Hùng Sơn",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ch’ơm",
      "Xã Gari",
      "Xã Tr’hy",
      "Xã Axan"
    ]
  },
  {
    "newWardId": "50301025",
    "newWardName": "Hương Trà",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường An Sơn",
      "Phường Hòa Hương",
      "Xã Tam Ngọc"
    ]
  },
  {
    "newWardId": "50323090",
    "newWardName": "Khâm Đức",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Khâm Đức",
      "Xã Phước Xuân"
    ]
  },
  {
    "newWardId": "50313078",
    "newWardName": "La Dêê",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đắc Tôi",
      "Xã La Dêê"
    ]
  },
  {
    "newWardId": "50313079",
    "newWardName": "La Êê",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Chơ Chun",
      "Xã La Êê"
    ]
  },
  {
    "newWardId": "50321030",
    "newWardName": "Lãnh Ngọc",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tiên Lãnh",
      "Xã Tiên Ngọc",
      "Xã Tiên Hiệp"
    ]
  },
  {
    "newWardId": "50109010",
    "newWardName": "Liên Chiểu",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [
      "20197",
      "20296"
    ],
    "oldWardNames": [
      "Phường Hòa Khánh Bắc",
      "Xã Hòa Liên"
    ]
  },
  {
    "newWardId": "50313076",
    "newWardName": "Nam Giang",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Zuôih",
      "Xã Chà Vàl"
    ]
  },
  {
    "newWardId": "50311056",
    "newWardName": "Nam Phước",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Nam Phước",
      "Xã Duy Phước",
      "Xã Duy Vinh"
    ]
  },
  {
    "newWardId": "50329039",
    "newWardName": "Nam Trà My",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trà Mai",
      "Xã Trà Don"
    ]
  },
  {
    "newWardId": "50107007",
    "newWardName": "Ngũ Hành Sơn",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [
      "20284",
      "20285"
    ],
    "oldWardNames": [
      "Phường Mỹ An",
      "Phường Khuê Mỹ",
      "Phường Hòa Hải",
      "Phường Hòa Quý"
    ]
  },
  {
    "newWardId": "50317053",
    "newWardName": "Nông Sơn",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Trung Phước",
      "Xã Quế Lộc"
    ]
  },
  {
    "newWardId": "50325017",
    "newWardName": "Núi Thành",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Núi Thành",
      "Xã Tam Quang",
      "Xã Tam Nghĩa",
      "Xã Tam Hiệp",
      "Xã Tam Giang"
    ]
  },
  {
    "newWardId": "50302029",
    "newWardName": "Phú Ninh",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tam Dân",
      "Xã Tam Đại",
      "Xã Tam Lãnh"
    ]
  },
  {
    "newWardId": "50307073",
    "newWardName": "Phú Thuận",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đại Tân",
      "Xã Đại Thắng",
      "Xã Đại Chánh",
      "Xã Đại Thạnh"
    ]
  },
  {
    "newWardId": "50323092",
    "newWardName": "Phước Chánh",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phước Công",
      "Xã Phước Chánh"
    ]
  },
  {
    "newWardId": "50323094",
    "newWardName": "Phước Hiệp",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phước Hòa",
      "Xã Phước Hiệp"
    ]
  },
  {
    "newWardId": "50323091",
    "newWardName": "Phước Năng",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phước Đức",
      "Xã Phước Mỹ",
      "Xã Phước Năng"
    ]
  },
  {
    "newWardId": "50323093",
    "newWardName": "Phước Thành",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phước Lộc",
      "Xã Phước Kim",
      "Xã Phước Thành"
    ]
  },
  {
    "newWardId": "50319089",
    "newWardName": "Phước Trà",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Sông Trà",
      "Xã Phước Gia",
      "Xã Phước Trà"
    ]
  },
  {
    "newWardId": "50301024",
    "newWardName": "Quảng Phú",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường An Phú",
      "Xã Tam Thanh",
      "Xã Tam Phú"
    ]
  },
  {
    "newWardId": "50317054",
    "newWardName": "Quế Phước",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Quế Lâm",
      "Xã Phước Ninh",
      "Xã Ninh Phước"
    ]
  },
  {
    "newWardId": "50317051",
    "newWardName": "Quế Sơn",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Đông Phú",
      "Xã Quế Minh",
      "Xã Quế An",
      "Xã Quế Long",
      "Xã Quế Phong"
    ]
  },
  {
    "newWardId": "50317050",
    "newWardName": "Quế Sơn Trung",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Quế Mỹ",
      "Xã Quế Hiệp",
      "Xã Quế Thuận",
      "Xã Quế Châu"
    ]
  },
  {
    "newWardId": "50305081",
    "newWardName": "Sông Kôn",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã A Ting",
      "Xã Jơ Ngây",
      "Xã Sông Kôn"
    ]
  },
  {
    "newWardId": "50305080",
    "newWardName": "Sông Vàng",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tư",
      "Xã Ba"
    ]
  },
  {
    "newWardId": "50321033",
    "newWardName": "Sơn Cẩm Hà",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tiên Sơn",
      "Xã Tiên Hà",
      "Xã Tiên Châu"
    ]
  },
  {
    "newWardId": "50105006",
    "newWardName": "Sơn Trà",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [
      "20263",
      "20266",
      "20269"
    ],
    "oldWardNames": [
      "Phường Thọ Quang",
      "Phường Nại Hiên Đông",
      "Phường Mân Thái"
    ]
  },
  {
    "newWardId": "50325019",
    "newWardName": "Tam Anh",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tam Hòa",
      "Xã Tam Anh Bắc",
      "Xã Tam Anh Nam"
    ]
  },
  {
    "newWardId": "50325022",
    "newWardName": "Tam Hải",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tam Hải"
    ]
  },
  {
    "newWardId": "50301023",
    "newWardName": "Tam Kỳ",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường An Mỹ",
      "Phường An Xuân",
      "Phường Trường Xuân"
    ]
  },
  {
    "newWardId": "50325018",
    "newWardName": "Tam Mỹ",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tam Mỹ Đông",
      "Xã Tam Mỹ Tây",
      "Xã Tam Trà"
    ]
  },
  {
    "newWardId": "50325021",
    "newWardName": "Tam Xuân",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tam Xuân I",
      "Xã Tam Xuân II",
      "Xã Tam Tiến"
    ]
  },
  {
    "newWardId": "50303068",
    "newWardName": "Tân Hiệp",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Hiệp"
    ]
  },
  {
    "newWardId": "50304085",
    "newWardName": "Tây Giang",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Atiêng",
      "Xã Dang",
      "Xã Anông",
      "Xã Lăng"
    ]
  },
  {
    "newWardId": "50302027",
    "newWardName": "Tây Hồ",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tam An",
      "Xã Tam Thành",
      "Xã Tam Phước",
      "Xã Tam Lộc"
    ]
  },
  {
    "newWardId": "50321032",
    "newWardName": "Thạnh Bình",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tiên Lập",
      "Xã Tiên Lộc",
      "Xã Tiên An",
      "Xã Tiên Cảnh"
    ]
  },
  {
    "newWardId": "50103003",
    "newWardName": "Thanh Khê",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [
      "20209",
      "20215",
      "20218",
      "20206",
      "20207"
    ],
    "oldWardNames": [
      "Phường Xuân Hà",
      "Phường Chính Gián",
      "Phường Thạc Gián",
      "Phường Thanh Khê Tây",
      "Phường Thanh Khê Đông"
    ]
  },
  {
    "newWardId": "50313074",
    "newWardName": "Thạnh Mỹ",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Thạnh Mỹ"
    ]
  },
  {
    "newWardId": "50315045",
    "newWardName": "Thăng An",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình Triều",
      "Xã Bình Giang",
      "Xã Bình Đào",
      "Xã Bình Minh",
      "Xã Bình Dương"
    ]
  },
  {
    "newWardId": "50315044",
    "newWardName": "Thăng Bình",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Hà Lam",
      "Xã Bình Nguyên",
      "Xã Bình Quý",
      "Xã Bình Phục"
    ]
  },
  {
    "newWardId": "50315047",
    "newWardName": "Thăng Điền",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình An",
      "Xã Bình Trung",
      "Xã Bình Tú"
    ]
  },
  {
    "newWardId": "50315048",
    "newWardName": "Thăng Phú",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình Phú",
      "Xã Bình Quế"
    ]
  },
  {
    "newWardId": "50315046",
    "newWardName": "Thăng Trường",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình Nam",
      "Xã Bình Hải",
      "Xã Bình Sa"
    ]
  },
  {
    "newWardId": "50311058",
    "newWardName": "Thu Bồn",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Duy Châu",
      "Xã Duy Hòa",
      "Xã Duy Phú",
      "Xã Duy Tân"
    ]
  },
  {
    "newWardId": "50307071",
    "newWardName": "Thượng Đức",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đại Lãnh",
      "Xã Đại Hưng",
      "Xã Đại Sơn"
    ]
  },
  {
    "newWardId": "50321031",
    "newWardName": "Tiên Phước",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Tiên Kỳ",
      "Xã Tiên Mỹ",
      "Xã Tiên Phong",
      "Xã Tiên Thọ"
    ]
  },
  {
    "newWardId": "50327037",
    "newWardName": "Trà Đốc",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trà Bui",
      "Xã Trà Đốc"
    ]
  },
  {
    "newWardId": "50327035",
    "newWardName": "Trà Giáp",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trà Ka",
      "Xã Trà Giáp"
    ]
  },
  {
    "newWardId": "50329043",
    "newWardName": "Trà Leng",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trà Dơn",
      "Xã Trà Leng"
    ]
  },
  {
    "newWardId": "50327034",
    "newWardName": "Trà Liên",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trà Đông",
      "Xã Trà Nú",
      "Xã Trà Kót"
    ]
  },
  {
    "newWardId": "50329042",
    "newWardName": "Trà Linh",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trà Nam",
      "Xã Trà Linh"
    ]
  },
  {
    "newWardId": "50327038",
    "newWardName": "Trà My",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Trà My",
      "Xã Trà Sơn",
      "Xã Trà Giang",
      "Xã Trà Dương"
    ]
  },
  {
    "newWardId": "50327036",
    "newWardName": "Trà Tân",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trà Giác",
      "Xã Trà Tân"
    ]
  },
  {
    "newWardId": "50329040",
    "newWardName": "Trà Tập",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trà Cang",
      "Xã Trà Tập"
    ]
  },
  {
    "newWardId": "50329041",
    "newWardName": "Trà Vân",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trà Vinh",
      "Xã Trà Vân"
    ]
  },
  {
    "newWardId": "50319088",
    "newWardName": "Việt An",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thăng Phước",
      "Xã Bình Sơn",
      "Xã Quế Thọ",
      "Xã Bình Lâm"
    ]
  },
  {
    "newWardId": "50307072",
    "newWardName": "Vu Gia",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đại Phong",
      "Xã Đại Minh",
      "Xã Đại Cường"
    ]
  },
  {
    "newWardId": "50317052",
    "newWardName": "Xuân Phú",
    "provinceId": "01",
    "provinceName": "Đà Nẵng",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Hương An",
      "Xã Quế Xuân 1",
      "Xã Quế Xuân 2",
      "Xã Quế Phú"
    ]
  },
  {
    "newWardId": "50901071",
    "newWardName": "Bình Kiến",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Phú",
      "Xã Hòa Kiến",
      "Xã Bình Kiến",
      "Phường 9"
    ]
  },
  {
    "newWardId": "60511017",
    "newWardName": "Buôn Đôn",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Krông Na"
    ]
  },
  {
    "newWardId": "60509008",
    "newWardName": "Buôn Hồ",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24318",
      "24308",
      "24305",
      "24311",
      "24331",
      "24322"
    ],
    "oldWardNames": [
      "Phường Đạt Hiếu",
      "Phường An Bình",
      "Phường An Lạc",
      "Phường Thiện An",
      "Phường Thống Nhất",
      "Phường Đoàn Kết"
    ]
  },
  {
    "newWardId": "60501002",
    "newWardName": "Buôn Ma Thuột",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24133",
      "24145",
      "24142",
      "24148",
      "24136"
    ],
    "oldWardNames": [
      "Phường Thành Công",
      "Phường Tân Tiến",
      "Phường Tân Thành",
      "Phường Tự An",
      "Phường Tân Lợi",
      "Xã Cư Êbur"
    ]
  },
  {
    "newWardId": "60513021",
    "newWardName": "Cuôr Đăng",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ea Drơng",
      "Xã Cuôr Đăng"
    ]
  },
  {
    "newWardId": "60509009",
    "newWardName": "Cư Bao",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24332",
      "24337",
      "24340"
    ],
    "oldWardNames": [
      "Phường Bình Tân",
      "Xã Bình Thuận",
      "Xã Cư Bao"
    ]
  },
  {
    "newWardId": "60513022",
    "newWardName": "Cư M’gar",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ea H’đing",
      "Xã Ea Kpam",
      "Xã Cư M’gar"
    ]
  },
  {
    "newWardId": "60517049",
    "newWardName": "Cư M’ta",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Cư Króa",
      "Xã Cư M’ta"
    ]
  },
  {
    "newWardId": "60539026",
    "newWardName": "Cư Pơng",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24314",
      "24313"
    ],
    "oldWardNames": [
      "Xã Ea Sin",
      "Xã Cư Pơng"
    ]
  },
  {
    "newWardId": "60517051",
    "newWardName": "Cư Prao",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24418",
      "24415"
    ],
    "oldWardNames": [
      "Xã Ea Pil",
      "Xã Cư Prao"
    ]
  },
  {
    "newWardId": "60525057",
    "newWardName": "Cư Pui",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24463",
      "24478"
    ],
    "oldWardNames": [
      "Xã Hòa Phong",
      "Xã Cư Pui"
    ]
  },
  {
    "newWardId": "60515045",
    "newWardName": "Cư Yang",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24406"
    ],
    "oldWardNames": [
      "Xã Cư Bông",
      "Xã Cư Yang"
    ]
  },
  {
    "newWardId": "60525054",
    "newWardName": "Dang Kang",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24457",
      "24451"
    ],
    "oldWardNames": [
      "Xã Hòa Thành",
      "Xã Cư Kty",
      "Xã Dang Kang"
    ]
  },
  {
    "newWardId": "60507033",
    "newWardName": "Dliê Ya",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24349",
      "24370"
    ],
    "oldWardNames": [
      "Xã Ea Tóh",
      "Xã Ea Tân",
      "Xã Dliê Ya"
    ]
  },
  {
    "newWardId": "60537064",
    "newWardName": "Dray Bhăng",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24562",
      "24561"
    ],
    "oldWardNames": [
      "Xã Hòa Hiệp",
      "Xã Dray Bhăng",
      "Xã Ea Bhốk"
    ]
  },
  {
    "newWardId": "60523067",
    "newWardName": "Dur Kmăl",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24568"
    ],
    "oldWardNames": [
      "Xã Băng A Drênh",
      "Xã Dur Kmăl"
    ]
  },
  {
    "newWardId": "60531059",
    "newWardName": "Đắk Liêng",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24595",
      "24592",
      "24589"
    ],
    "oldWardNames": [
      "Xã Buôn Tría",
      "Xã Buôn Triết",
      "Xã Đắk Liêng"
    ]
  },
  {
    "newWardId": "60531061",
    "newWardName": "Đắk Phơi",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24601",
      "24598"
    ],
    "oldWardNames": [
      "Xã Đắk Nuê",
      "Xã Đắk Phơi"
    ]
  },
  {
    "newWardId": "50911078",
    "newWardName": "Đông Hòa",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Hòa Vinh",
      "Phường Hòa Xuân Tây",
      "Xã Hòa Tân Đông"
    ]
  },
  {
    "newWardId": "50903102",
    "newWardName": "Đồng Xuân",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn La Hai",
      "Xã Xuân Sơn Nam",
      "Xã Xuân Sơn Bắc",
      "Xã Xuân Long",
      "Xã Xuân Quang 2"
    ]
  },
  {
    "newWardId": "50913097",
    "newWardName": "Đức Bình",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Sơn Giang",
      "Xã Đức Bình Đông",
      "Xã Đức Bình Tây",
      "Xã Ea Bia"
    ]
  },
  {
    "newWardId": "50913096",
    "newWardName": "Ea Bá",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24250"
    ],
    "oldWardNames": [
      "Xã Ea Bá",
      "Xã Ea Bar"
    ]
  },
  {
    "newWardId": "60505012",
    "newWardName": "Ea Bung",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24220",
      "24229"
    ],
    "oldWardNames": [
      "Xã Ya Tờ Mốt",
      "Xã Ea Bung"
    ]
  },
  {
    "newWardId": "60503028",
    "newWardName": "Ea Drăng",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24181",
      "24190",
      "24205"
    ],
    "oldWardNames": [
      "Thị trấn Ea Drăng",
      "Xã Ea Ral",
      "Xã Dliê Yang"
    ]
  },
  {
    "newWardId": "60509007",
    "newWardName": "Ea Drông",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24334",
      "24328"
    ],
    "oldWardNames": [
      "Xã Ea Siên",
      "Xã Ea Drông"
    ]
  },
  {
    "newWardId": "60503031",
    "newWardName": "Ea Hiao",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24187",
      "24199"
    ],
    "oldWardNames": [
      "Xã Ea Sol",
      "Xã Ea Hiao"
    ]
  },
  {
    "newWardId": "60501006",
    "newWardName": "Ea Kao",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24151",
      "24169"
    ],
    "oldWardNames": [
      "Phường Ea Tam",
      "Xã Ea Kao"
    ]
  },
  {
    "newWardId": "60515042",
    "newWardName": "Ea Kar",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24373",
      "24385",
      "24391",
      "24394",
      "24397",
      "24382"
    ],
    "oldWardNames": [
      "Thị trấn Ea Kar",
      "Xã Cư Huê",
      "Xã Ea Đar",
      "Xã Ea Kmút",
      "Xã Cư Ni",
      "Xã Xuân Phú"
    ]
  },
  {
    "newWardId": "60503027",
    "newWardName": "Ea Khăl",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24208",
      "24207"
    ],
    "oldWardNames": [
      "Xã Ea Nam",
      "Xã Ea Tir",
      "Xã Ea Khăl"
    ]
  },
  {
    "newWardId": "60513018",
    "newWardName": "Ea Kiết",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24264",
      "24265"
    ],
    "oldWardNames": [
      "Xã Ea Kuêh",
      "Xã Ea Kiết"
    ]
  },
  {
    "newWardId": "60519040",
    "newWardName": "Ea Kly",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24496"
    ],
    "oldWardNames": [
      "Xã Krông Búk",
      "Xã Ea Kly"
    ]
  },
  {
    "newWardId": "60515044",
    "newWardName": "Ea Knốp",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24376",
      "24388",
      "24379",
      "24380"
    ],
    "oldWardNames": [
      "Thị trấn Ea Knốp",
      "Xã Ea Tih",
      "Xã Ea Sô",
      "Xã Ea Sar"
    ]
  },
  {
    "newWardId": "60519037",
    "newWardName": "Ea Knuếc",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24517",
      "24499"
    ],
    "oldWardNames": [
      "Xã Hòa Đông",
      "Xã Ea Kênh",
      "Xã Ea Knuếc"
    ]
  },
  {
    "newWardId": "60537065",
    "newWardName": "Ea Ktur",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24547",
      "24544"
    ],
    "oldWardNames": [
      "Xã Ea Tiêu",
      "Xã Ea Ktur",
      "Xã Ea Bhốk"
    ]
  },
  {
    "newWardId": "50913095",
    "newWardName": "Ea Ly",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24250"
    ],
    "oldWardNames": [
      "Xã Ea Lâm",
      "Xã Ea Ly",
      "Xã Ea Bar"
    ]
  },
  {
    "newWardId": "60513019",
    "newWardName": "Ea M’Droh",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24286"
    ],
    "oldWardNames": [
      "Xã Quảng Hiệp",
      "Xã Ea M’nang",
      "Xã Ea M’Droh"
    ]
  },
  {
    "newWardId": "60523068",
    "newWardName": "Ea Na",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24565",
      "24556",
      "24559"
    ],
    "oldWardNames": [
      "Xã Ea Bông",
      "Xã Dray Sáp",
      "Xã Ea Na"
    ]
  },
  {
    "newWardId": "60537063",
    "newWardName": "Ea Ning",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24553",
      "24540"
    ],
    "oldWardNames": [
      "Xã Cư Êwi",
      "Xã Ea Hu",
      "Xã Ea Ning"
    ]
  },
  {
    "newWardId": "60511016",
    "newWardName": "Ea Nuôl",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24250",
      "24253"
    ],
    "oldWardNames": [
      "Xã Ea Bar",
      "Xã Cuôr Knia",
      "Xã Ea Nuôl"
    ]
  },
  {
    "newWardId": "60515043",
    "newWardName": "Ea Ô",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24403"
    ],
    "oldWardNames": [
      "Xã Cư Elang",
      "Xã Ea Ô"
    ]
  },
  {
    "newWardId": "60515046",
    "newWardName": "Ea Păl",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24401",
      "24400"
    ],
    "oldWardNames": [
      "Xã Cư Prông",
      "Xã Ea Păl"
    ]
  },
  {
    "newWardId": "60519039",
    "newWardName": "Ea Phê",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24514",
      "24520",
      "24502"
    ],
    "oldWardNames": [
      "Xã Ea Kuăng",
      "Xã Ea Hiu",
      "Xã Ea Phê"
    ]
  },
  {
    "newWardId": "60517048",
    "newWardName": "Ea Riêng",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24433"
    ],
    "oldWardNames": [
      "Xã Ea H’Mlay",
      "Xã Ea M’Doal",
      "Xã Ea Riêng"
    ]
  },
  {
    "newWardId": "60505011",
    "newWardName": "Ea Rốk",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24217"
    ],
    "oldWardNames": [
      "Xã Ia Jlơi",
      "Xã Cư Kbang",
      "Xã Ea Rốk"
    ]
  },
  {
    "newWardId": "60505010",
    "newWardName": "Ea Súp",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24211",
      "24223"
    ],
    "oldWardNames": [
      "Thị trấn Ea Súp",
      "Xã Cư M’Lan",
      "Xã Ea Lê"
    ]
  },
  {
    "newWardId": "60517052",
    "newWardName": "Ea Trang",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24445"
    ],
    "oldWardNames": [
      "Xã Ea Trang"
    ]
  },
  {
    "newWardId": "60513023",
    "newWardName": "Ea Tul",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24268",
      "24277"
    ],
    "oldWardNames": [
      "Xã Ea Tar",
      "Xã Cư Dliê Mnông",
      "Xã Ea Tul"
    ]
  },
  {
    "newWardId": "60511015",
    "newWardName": "Ea Wer",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24238",
      "24241"
    ],
    "oldWardNames": [
      "Xã Ea Huar",
      "Xã Tân Hòa",
      "Xã Ea Wer"
    ]
  },
  {
    "newWardId": "60503029",
    "newWardName": "Ea Wy",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24194",
      "24196",
      "24193"
    ],
    "oldWardNames": [
      "Xã Cư A Mung",
      "Xã Cư Mốt",
      "Xã Ea Wy"
    ]
  },
  {
    "newWardId": "50911079",
    "newWardName": "Hòa Hiệp",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Hòa Hiệp Trung",
      "Phường Hòa Hiệp Nam",
      "Phường Hòa Hiệp Bắc"
    ]
  },
  {
    "newWardId": "50912089",
    "newWardName": "Hòa Mỹ",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hòa Mỹ Đông",
      "Xã Hòa Mỹ Tây"
    ]
  },
  {
    "newWardId": "60501001",
    "newWardName": "Hòa Phú",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24172",
      "24178",
      "24175"
    ],
    "oldWardNames": [
      "Xã Hòa Phú",
      "Xã Hòa Xuân",
      "Xã Hòa Khánh"
    ]
  },
  {
    "newWardId": "60525053",
    "newWardName": "Hòa Sơn",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24469",
      "24472",
      "24481"
    ],
    "oldWardNames": [
      "Xã Yang Reh",
      "Xã Ea Trul",
      "Xã Hòa Sơn"
    ]
  },
  {
    "newWardId": "50912088",
    "newWardName": "Hòa Thịnh",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hòa Đồng",
      "Xã Hòa Thịnh"
    ]
  },
  {
    "newWardId": "50911077",
    "newWardName": "Hòa Xuân",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hòa Tâm",
      "Xã Hòa Xuân Đông",
      "Xã Hòa Xuân Nam"
    ]
  },
  {
    "newWardId": "60505014",
    "newWardName": "Ia Lốp",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24214"
    ],
    "oldWardNames": [
      "Xã Ia Lốp"
    ]
  },
  {
    "newWardId": "60505013",
    "newWardName": "Ia Rvê",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24221"
    ],
    "oldWardNames": [
      "Xã Ia RVê"
    ]
  },
  {
    "newWardId": "60517050",
    "newWardName": "Krông Á",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24444",
      "24442"
    ],
    "oldWardNames": [
      "Xã Cư San",
      "Xã Krông Á"
    ]
  },
  {
    "newWardId": "60523066",
    "newWardName": "Krông Ana",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24538",
      "24574",
      "24577"
    ],
    "oldWardNames": [
      "Thị trấn Buôn Trấp",
      "Xã Bình Hòa",
      "Xã Quảng Điền"
    ]
  },
  {
    "newWardId": "60525055",
    "newWardName": "Krông Bông",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24448",
      "24466",
      "24475"
    ],
    "oldWardNames": [
      "Thị trấn Krông Kmar",
      "Xã Hòa Lễ",
      "Xã Khuê Ngọc Điền"
    ]
  },
  {
    "newWardId": "60539025",
    "newWardName": "Krông Búk",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24307"
    ],
    "oldWardNames": [
      "Xã Cư Né",
      "Xã Chứ Kbô"
    ]
  },
  {
    "newWardId": "60507032",
    "newWardName": "Krông Năng",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24343",
      "24355",
      "24361"
    ],
    "oldWardNames": [
      "Thị trấn Krông Năng",
      "Xã Phú Lộc",
      "Xã Ea Hồ"
    ]
  },
  {
    "newWardId": "60531062",
    "newWardName": "Krông Nô",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24604"
    ],
    "oldWardNames": [
      "Xã Krông Nô"
    ]
  },
  {
    "newWardId": "60519036",
    "newWardName": "Krông Pắc",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24490",
      "24511",
      "24508",
      "24523"
    ],
    "oldWardNames": [
      "Thị trấn Phước An",
      "Xã Hòa An",
      "Xã Ea Yông",
      "Xã Hòa Tiến"
    ]
  },
  {
    "newWardId": "60531058",
    "newWardName": "Liên Sơn Lắk",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24580",
      "24583",
      "24586"
    ],
    "oldWardNames": [
      "Thị trấn Liên Sơn",
      "Xã Yang Tao",
      "Xã Bông Krang"
    ]
  },
  {
    "newWardId": "60517047",
    "newWardName": "M’Drắk",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24427",
      "24421"
    ],
    "oldWardNames": [
      "Thị trấn M’Drắk",
      "Xã Krông Jing",
      "Xã Ea Lai"
    ]
  },
  {
    "newWardId": "60531060",
    "newWardName": "Nam Ka",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24607"
    ],
    "oldWardNames": [
      "Xã Ea Rbin",
      "Xã Nam Ka"
    ]
  },
  {
    "newWardId": "50907082",
    "newWardName": "Ô Loan",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Hiệp",
      "Xã An Hòa Hải",
      "Xã An Cư"
    ]
  },
  {
    "newWardId": "50915085",
    "newWardName": "Phú Hòa 1",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24166",
      "24511"
    ],
    "oldWardNames": [
      "Thị trấn Phú Hòa",
      "Xã Hòa Thắng",
      "Xã Hòa Định Đông",
      "Xã Hòa Định Tây",
      "Xã Hòa Hội",
      "Xã Hòa An"
    ]
  },
  {
    "newWardId": "50915086",
    "newWardName": "Phú Hòa 2",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hòa Quang Nam",
      "Xã Hòa Quang Bắc",
      "Xã Hòa Trị"
    ]
  },
  {
    "newWardId": "50903100",
    "newWardName": "Phú Mỡ",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Xuân Quang 1",
      "Xã Phú Mỡ"
    ]
  },
  {
    "newWardId": "60507035",
    "newWardName": "Phú Xuân",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24360",
      "24364"
    ],
    "oldWardNames": [
      "Xã Ea Púk",
      "Xã Ea Dăh",
      "Xã Phú Xuân"
    ]
  },
  {
    "newWardId": "50901070",
    "newWardName": "Phú Yên",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24457"
    ],
    "oldWardNames": [
      "Phường Phú Đông",
      "Phường Phú Lâm",
      "Phường Phú Thạnh",
      "Xã Hòa Thành",
      "Phường Hòa Hiệp Bắc",
      "Xã Hòa Bình 1"
    ]
  },
  {
    "newWardId": "60539024",
    "newWardName": "Pơng Drang",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24316",
      "24319",
      "24317"
    ],
    "oldWardNames": [
      "Thị trấn Pơng Drang",
      "Xã Ea Ngai",
      "Xã Tân Lập"
    ]
  },
  {
    "newWardId": "60513020",
    "newWardName": "Quảng Phú",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24259",
      "24256",
      "24298",
      "24262"
    ],
    "oldWardNames": [
      "Thị trấn Quảng Phú",
      "Thị trấn Ea Pốk",
      "Xã Cư Suê",
      "Xã Quảng Tiến"
    ]
  },
  {
    "newWardId": "50905076",
    "newWardName": "Sông Cầu",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Xuân Yên",
      "Phường Xuân Phú",
      "Xã Xuân Phương",
      "Xã Xuân Thịnh"
    ]
  },
  {
    "newWardId": "50913098",
    "newWardName": "Sông Hinh",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Hai Riêng",
      "Xã Ea Trol",
      "Xã Sông Hinh",
      "Xã Ea Bia"
    ]
  },
  {
    "newWardId": "50909091",
    "newWardName": "Sơn Hòa",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Củng Sơn",
      "Xã Suối Bạc",
      "Xã Sơn Hà",
      "Xã Sơn Nguyên",
      "Xã Sơn Phước"
    ]
  },
  {
    "newWardId": "50912090",
    "newWardName": "Sơn Thành",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24172"
    ],
    "oldWardNames": [
      "Xã Hòa Phú",
      "Xã Sơn Thành Đông",
      "Xã Sơn Thành Tây"
    ]
  },
  {
    "newWardId": "50909094",
    "newWardName": "Suối Trai",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Ea Chà Rang",
      "Xã Krông Pa",
      "Xã Suối Trai"
    ]
  },
  {
    "newWardId": "60507034",
    "newWardName": "Tam Giang",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24352",
      "24367",
      "24358"
    ],
    "oldWardNames": [
      "Xã Ea Tam",
      "Xã Cư Klông",
      "Xã Tam Giang"
    ]
  },
  {
    "newWardId": "60501003",
    "newWardName": "Tân An",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24124",
      "24163",
      "24157"
    ],
    "oldWardNames": [
      "Phường Tân An",
      "Xã Ea Tu",
      "Xã Hòa Thuận"
    ]
  },
  {
    "newWardId": "60501004",
    "newWardName": "Tân Lập",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24121",
      "24118",
      "24166"
    ],
    "oldWardNames": [
      "Phường Tân Hòa",
      "Phường Tân Lập",
      "Xã Hòa Thắng"
    ]
  },
  {
    "newWardId": "60519038",
    "newWardName": "Tân Tiến",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24535",
      "24532",
      "24526"
    ],
    "oldWardNames": [
      "Xã Ea Yiêng",
      "Xã Ea Uy",
      "Xã Tân Tiến"
    ]
  },
  {
    "newWardId": "50912087",
    "newWardName": "Tây Hòa",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24463"
    ],
    "oldWardNames": [
      "Thị trấn Phú Thứ",
      "Xã Hòa Phong",
      "Xã Hòa Tân Tây",
      "Xã Hòa Bình 1"
    ]
  },
  {
    "newWardId": "50909093",
    "newWardName": "Tây Sơn",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Sơn Hội",
      "Xã Cà Lúi",
      "Xã Phước Tân"
    ]
  },
  {
    "newWardId": "60501005",
    "newWardName": "Thành Nhất",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24154",
      "24130"
    ],
    "oldWardNames": [
      "Phường Khánh Xuân",
      "Phường Thành Nhất"
    ]
  },
  {
    "newWardId": "50907080",
    "newWardName": "Tuy An Bắc",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Chí Thạnh",
      "Xã An Dân",
      "Xã An Định"
    ]
  },
  {
    "newWardId": "50907081",
    "newWardName": "Tuy An Đông",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Ninh Đông",
      "Xã An Ninh Tây",
      "Xã An Thạch"
    ]
  },
  {
    "newWardId": "50907083",
    "newWardName": "Tuy An Nam",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Thọ",
      "Xã An Mỹ",
      "Xã An Chấn"
    ]
  },
  {
    "newWardId": "50907084",
    "newWardName": "Tuy An Tây",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Nghiệp",
      "Xã An Xuân",
      "Xã An Lĩnh"
    ]
  },
  {
    "newWardId": "50901069",
    "newWardName": "Tuy Hòa",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24511"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 2",
      "Phường 4",
      "Phường 5",
      "Phường 7",
      "Phường 9",
      "Xã Hòa An",
      "Xã Hòa Trị"
    ]
  },
  {
    "newWardId": "50909092",
    "newWardName": "Vân Hòa",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Sơn Long",
      "Xã Sơn Xuân",
      "Xã Sơn Định"
    ]
  },
  {
    "newWardId": "60519041",
    "newWardName": "Vụ Bổn",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24529"
    ],
    "oldWardNames": [
      "Xã Vụ Bổn"
    ]
  },
  {
    "newWardId": "50905073",
    "newWardName": "Xuân Cảnh",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Xuân Bình",
      "Xã Xuân Cảnh"
    ]
  },
  {
    "newWardId": "50905075",
    "newWardName": "Xuân Đài",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Xuân Thành",
      "Phường Xuân Đài"
    ]
  },
  {
    "newWardId": "50903099",
    "newWardName": "Xuân Lãnh",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đa Lộc",
      "Xã Xuân Lãnh"
    ]
  },
  {
    "newWardId": "50905074",
    "newWardName": "Xuân Lộc",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Xuân Hải",
      "Xã Xuân Lộc"
    ]
  },
  {
    "newWardId": "50903101",
    "newWardName": "Xuân Phước",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Xuân Quang 3",
      "Xã Xuân Phước"
    ]
  },
  {
    "newWardId": "50905072",
    "newWardName": "Xuân Thọ",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Xuân Lâm",
      "Xã Xuân Thọ 1",
      "Xã Xuân Thọ 2"
    ]
  },
  {
    "newWardId": "60525056",
    "newWardName": "Yang Mao",
    "provinceId": "05",
    "provinceName": "Đắk Lắk",
    "oldWardIds": [
      "24484",
      "24487"
    ],
    "oldWardNames": [
      "Xã Cư Drăm",
      "Xã Yang Mao"
    ]
  },
  {
    "newWardId": "70709059",
    "newWardName": "An Lộc",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Phú Thịnh",
      "Xã Thanh Phú",
      "Xã Thanh Lương"
    ]
  },
  {
    "newWardId": "71315015",
    "newWardName": "An Phước",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26398",
      "26383"
    ],
    "oldWardNames": [
      "Xã Tam An",
      "Xã An Phước"
    ]
  },
  {
    "newWardId": "71308016",
    "newWardName": "An Viễn",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26284",
      "26296"
    ],
    "oldWardNames": [
      "Xã Đồi 61",
      "Xã An Viễn"
    ]
  },
  {
    "newWardId": "71302025",
    "newWardName": "Bảo Vinh",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26098",
      "26092"
    ],
    "oldWardNames": [
      "Phường Bảo Vinh",
      "Xã Bảo Quang"
    ]
  },
  {
    "newWardId": "71308019",
    "newWardName": "Bàu Hàm",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26251",
      "26254",
      "26260",
      "26257"
    ],
    "oldWardNames": [
      "Xã Thanh Bình",
      "Xã Cây Gáo",
      "Xã Sông Thao",
      "Xã Bàu Hàm"
    ]
  },
  {
    "newWardId": "71301001",
    "newWardName": "Biên Hòa",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26062",
      "26068",
      "26053",
      "26059"
    ],
    "oldWardNames": [
      "Phường Tân Hạnh",
      "Phường Hóa An",
      "Phường Bửu Hòa",
      "Phường Tân Vạn"
    ]
  },
  {
    "newWardId": "71315013",
    "newWardName": "Bình An",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26389",
      "26386"
    ],
    "oldWardNames": [
      "Xã Long Đức",
      "Xã Bình An"
    ]
  },
  {
    "newWardId": "70709058",
    "newWardName": "Bình Long",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26251"
    ],
    "oldWardNames": [
      "Phường An Lộc",
      "Phường Hưng Chiến",
      "Phường Phú Đức",
      "Xã Thanh Bình"
    ]
  },
  {
    "newWardId": "71302024",
    "newWardName": "Bình Lộc",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26095",
      "26323",
      "26089"
    ],
    "oldWardNames": [
      "Phường Suối Tre",
      "Xã Xuân Thiện",
      "Xã Bình Lộc"
    ]
  },
  {
    "newWardId": "71308017",
    "newWardName": "Bình Minh",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26278",
      "26269"
    ],
    "oldWardNames": [
      "Xã Bình Minh",
      "Xã Bắc Sơn"
    ]
  },
  {
    "newWardId": "70711078",
    "newWardName": "Bình Phước",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tân Phú",
      "Phường Tân Đồng",
      "Phường Tân Thiện",
      "Phường Tân Bình",
      "Phường Tân Xuân",
      "Xã Tiến Hưng"
    ]
  },
  {
    "newWardId": "70716073",
    "newWardName": "Bình Tân",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26380"
    ],
    "oldWardNames": [
      "Xã Long Hưng",
      "Xã Long Bình",
      "Xã Bình Tân"
    ]
  },
  {
    "newWardId": "70707088",
    "newWardName": "Bom Bo",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26278"
    ],
    "oldWardNames": [
      "Xã Bình Minh",
      "Xã Bom Bo"
    ]
  },
  {
    "newWardId": "70707085",
    "newWardName": "Bù Đăng",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Đức Phong",
      "Xã Đoàn Kết",
      "Xã Minh Hưng"
    ]
  },
  {
    "newWardId": "70715094",
    "newWardName": "Bù Gia Mập",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bù Gia Mập"
    ]
  },
  {
    "newWardId": "71311031",
    "newWardName": "Cẩm Mỹ",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26341",
      "26335",
      "26344",
      "26350"
    ],
    "oldWardNames": [
      "Thị trấn Long Giao",
      "Xã Nhân Nghĩa",
      "Xã Xuân Mỹ",
      "Xã Bảo Bình"
    ]
  },
  {
    "newWardId": "70710052",
    "newWardName": "Chơn Thành",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Hưng Long",
      "Phường Thành Tâm",
      "Phường Minh Thành"
    ]
  },
  {
    "newWardId": "71309021",
    "newWardName": "Dầu Giây",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26326",
      "26317",
      "26314",
      "26320"
    ],
    "oldWardNames": [
      "Thị trấn Dầu Giây",
      "Xã Hưng Lộc",
      "Xã Bàu Hàm 2",
      "Xã Lộ 25"
    ]
  },
  {
    "newWardId": "70715070",
    "newWardName": "Đa Kia",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phước Minh",
      "Xã Bình Thắng",
      "Xã Đa Kia"
    ]
  },
  {
    "newWardId": "71317008",
    "newWardName": "Đại Phước",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26482",
      "26491",
      "26500",
      "26476"
    ],
    "oldWardNames": [
      "Xã Phú Hữu",
      "Xã Phú Đông",
      "Xã Phước Khánh",
      "Xã Đại Phước"
    ]
  },
  {
    "newWardId": "71303092",
    "newWardName": "Đak Lua",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đak Lua"
    ]
  },
  {
    "newWardId": "70707087",
    "newWardName": "Đak Nhau",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đường 10",
      "Xã Đak Nhau"
    ]
  },
  {
    "newWardId": "70715095",
    "newWardName": "Đăk Ơ",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đăk Ơ"
    ]
  },
  {
    "newWardId": "71305041",
    "newWardName": "Định Quán",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26206",
      "26233",
      "26230",
      "26224"
    ],
    "oldWardNames": [
      "Thị trấn Định Quán",
      "Xã Phú Ngọc",
      "Xã Gia Canh",
      "Xã Ngọc Định"
    ]
  },
  {
    "newWardId": "70701082",
    "newWardName": "Đồng Phú",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26116"
    ],
    "oldWardNames": [
      "Thị trấn Tân Phú",
      "Xã Tân Tiến",
      "Xã Tân Lập"
    ]
  },
  {
    "newWardId": "70701080",
    "newWardName": "Đồng Tâm",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đồng Tiến",
      "Xã Tân Phước",
      "Xã Đồng Tâm"
    ]
  },
  {
    "newWardId": "70711077",
    "newWardName": "Đồng Xoài",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Tiến Thành",
      "Xã Tân Thành"
    ]
  },
  {
    "newWardId": "71309022",
    "newWardName": "Gia Kiệm",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26311",
      "26305",
      "26308"
    ],
    "oldWardNames": [
      "Xã Quang Trung",
      "Xã Gia Tân 3",
      "Xã Gia Kiệm"
    ]
  },
  {
    "newWardId": "71302028",
    "newWardName": "Hàng Gòn",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26110",
      "26113"
    ],
    "oldWardNames": [
      "Phường Xuân Tân",
      "Xã Hàng Gòn"
    ]
  },
  {
    "newWardId": "71301006",
    "newWardName": "Hố Nai",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26005",
      "26272"
    ],
    "oldWardNames": [
      "Phường Tân Hòa",
      "Xã Hố Nai 3"
    ]
  },
  {
    "newWardId": "70706068",
    "newWardName": "Hưng Phước",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phước Thiện",
      "Xã Hưng Phước"
    ]
  },
  {
    "newWardId": "71308020",
    "newWardName": "Hưng Thịnh",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26287"
    ],
    "oldWardNames": [
      "Xã Đông Hòa",
      "Xã Tây Hòa",
      "Xã Trung Hòa",
      "Xã Hưng Thịnh"
    ]
  },
  {
    "newWardId": "71305040",
    "newWardName": "La Ngà",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26239",
      "26227"
    ],
    "oldWardNames": [
      "Xã Túc Trưng",
      "Xã La Ngà"
    ]
  },
  {
    "newWardId": "71301004",
    "newWardName": "Long Bình",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26002",
      "25999",
      "26020"
    ],
    "oldWardNames": [
      "Phường Hố Nai",
      "Phường Tân Biên",
      "Phường Long Bình"
    ]
  },
  {
    "newWardId": "70716074",
    "newWardName": "Long Hà",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26473"
    ],
    "oldWardNames": [
      "Xã Long Tân",
      "Xã Long Hà"
    ]
  },
  {
    "newWardId": "71301007",
    "newWardName": "Long Hưng",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26056",
      "26371",
      "26380"
    ],
    "oldWardNames": [
      "Phường Long Bình Tân",
      "Phường An Hòa",
      "Xã Long Hưng"
    ]
  },
  {
    "newWardId": "71302027",
    "newWardName": "Long Khánh",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26443",
      "26158",
      "26107"
    ],
    "oldWardNames": [
      "Xã Xuân An",
      "Xã Xuân Bình",
      "Xã Xuân Hòa",
      "Xã Phú Bình",
      "Xã Bàu Trâm"
    ]
  },
  {
    "newWardId": "71315012",
    "newWardName": "Long Phước",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26410",
      "26413"
    ],
    "oldWardNames": [
      "Xã Bàu Cạn",
      "Xã Long Phước"
    ]
  },
  {
    "newWardId": "71315014",
    "newWardName": "Long Thành",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26368",
      "26392",
      "26395",
      "26404"
    ],
    "oldWardNames": [
      "Thị trấn Long Thành",
      "Xã Lộc An",
      "Xã Bình Sơn",
      "Xã Long An"
    ]
  },
  {
    "newWardId": "70705062",
    "newWardName": "Lộc Hưng",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Lộc Khánh",
      "Xã Lộc Điền",
      "Xã Lộc Hưng"
    ]
  },
  {
    "newWardId": "70705061",
    "newWardName": "Lộc Ninh",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Lộc Ninh",
      "Xã Lộc Thái",
      "Xã Lộc Thuận"
    ]
  },
  {
    "newWardId": "70705065",
    "newWardName": "Lộc Quang",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Lộc Phú",
      "Xã Lộc Hiệp",
      "Xã Lộc Quang"
    ]
  },
  {
    "newWardId": "70705063",
    "newWardName": "Lộc Tấn",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Lộc Thiện",
      "Xã Lộc Tấn"
    ]
  },
  {
    "newWardId": "70705060",
    "newWardName": "Lộc Thành",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Lộc Thịnh",
      "Xã Lộc Thành"
    ]
  },
  {
    "newWardId": "70705064",
    "newWardName": "Lộc Thạnh",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Lộc Hòa",
      "Xã Lộc Thạnh"
    ]
  },
  {
    "newWardId": "70713057",
    "newWardName": "Minh Đức",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Phú",
      "Xã Minh Tâm",
      "Xã Minh Đức"
    ]
  },
  {
    "newWardId": "70710051",
    "newWardName": "Minh Hưng",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Minh Long",
      "Phường Minh Hưng"
    ]
  },
  {
    "newWardId": "71303045",
    "newWardName": "Nam Cát Tiên",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26125",
      "26122"
    ],
    "oldWardNames": [
      "Xã Phú An",
      "Xã Nam Cát Tiên"
    ]
  },
  {
    "newWardId": "70707084",
    "newWardName": "Nghĩa Trung",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đức Liễu",
      "Xã Nghĩa Bình",
      "Xã Nghĩa Trung"
    ]
  },
  {
    "newWardId": "70710053",
    "newWardName": "Nha Bích",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Minh Thắng",
      "Xã Minh Lập",
      "Xã Nha Bích"
    ]
  },
  {
    "newWardId": "71317009",
    "newWardName": "Nhơn Trạch",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26479",
      "26473",
      "26488",
      "26485",
      "26470"
    ],
    "oldWardNames": [
      "Thị trấn Hiệp Phước",
      "Xã Long Tân",
      "Xã Phú Thạnh",
      "Xã Phú Hội",
      "Xã Phước Thiền"
    ]
  },
  {
    "newWardId": "71305043",
    "newWardName": "Phú Hòa",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26167",
      "26218",
      "26221"
    ],
    "oldWardNames": [
      "Xã Phú Điền",
      "Xã Phú Lợi",
      "Xã Phú Hòa"
    ]
  },
  {
    "newWardId": "71303047",
    "newWardName": "Phú Lâm",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26143",
      "26146",
      "26158",
      "26155"
    ],
    "oldWardNames": [
      "Xã Thanh Sơn",
      "Xã Phú Sơn",
      "Xã Phú Bình",
      "Xã Phú Lâm"
    ]
  },
  {
    "newWardId": "71307093",
    "newWardName": "Phú Lý",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26173"
    ],
    "oldWardNames": [
      "Xã Phú Lý"
    ]
  },
  {
    "newWardId": "70715069",
    "newWardName": "Phú Nghĩa",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phú Văn",
      "Xã Đức Hạnh",
      "Xã Phú Nghĩa"
    ]
  },
  {
    "newWardId": "70716075",
    "newWardName": "Phú Riềng",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bù Nho",
      "Xã Phú Riềng"
    ]
  },
  {
    "newWardId": "70716076",
    "newWardName": "Phú Trung",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phước Tân",
      "Xã Phú Trung"
    ]
  },
  {
    "newWardId": "71305042",
    "newWardName": "Phú Vinh",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26212",
      "26215"
    ],
    "oldWardNames": [
      "Xã Phú Tân",
      "Xã Phú Vinh"
    ]
  },
  {
    "newWardId": "71317010",
    "newWardName": "Phước An",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26503",
      "26497",
      "26494"
    ],
    "oldWardNames": [
      "Xã Phước An",
      "Xã Vĩnh Thanh",
      "Xã Long Thọ"
    ]
  },
  {
    "newWardId": "70703071",
    "newWardName": "Phước Bình",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26395"
    ],
    "oldWardNames": [
      "Phường Long Phước",
      "Phường Phước Bình",
      "Xã Bình Sơn",
      "Xã Long Giang"
    ]
  },
  {
    "newWardId": "70703072",
    "newWardName": "Phước Long",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Long Thủy",
      "Phường Thác Mơ",
      "Phường Sơn Giang",
      "Xã Phước Tín"
    ]
  },
  {
    "newWardId": "70707083",
    "newWardName": "Phước Sơn",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đăng Hà",
      "Xã Thống Nhất",
      "Xã Phước Sơn"
    ]
  },
  {
    "newWardId": "71301090",
    "newWardName": "Phước Tân",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phước Tân"
    ]
  },
  {
    "newWardId": "71315011",
    "newWardName": "Phước Thái",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26419",
      "26416",
      "26422"
    ],
    "oldWardNames": [
      "Xã Tân Hiệp",
      "Xã Phước Bình",
      "Xã Phước Thái"
    ]
  },
  {
    "newWardId": "71311032",
    "newWardName": "Sông Ray",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26365",
      "26362"
    ],
    "oldWardNames": [
      "Xã Lâm San",
      "Xã Sông Ray"
    ]
  },
  {
    "newWardId": "71303044",
    "newWardName": "Tà Lài",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26140",
      "26134",
      "26131"
    ],
    "oldWardNames": [
      "Xã Phú Thịnh",
      "Xã Phú Lập",
      "Xã Tà Lài"
    ]
  },
  {
    "newWardId": "71301003",
    "newWardName": "Tam Hiệp",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26008",
      "26014",
      "26047",
      "26017"
    ],
    "oldWardNames": [
      "Phường Tân Hiệp",
      "Phường Tân Mai",
      "Phường Bình Đa",
      "Phường Tam Hiệp"
    ]
  },
  {
    "newWardId": "71301089",
    "newWardName": "Tam Phước",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26374"
    ],
    "oldWardNames": [
      "Phường Tam Phước"
    ]
  },
  {
    "newWardId": "71307049",
    "newWardName": "Tân An",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26182",
      "26179"
    ],
    "oldWardNames": [
      "Xã Vĩnh Tân",
      "Xã Tân An"
    ]
  },
  {
    "newWardId": "70713055",
    "newWardName": "Tân Hưng",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Hưng",
      "Xã An Khương",
      "Xã Thanh An"
    ]
  },
  {
    "newWardId": "70713056",
    "newWardName": "Tân Khai",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26419"
    ],
    "oldWardNames": [
      "Thị trấn Tân Khai",
      "Xã Tân Hiệp",
      "Xã Đồng Nơ"
    ]
  },
  {
    "newWardId": "70701081",
    "newWardName": "Tân Lợi",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Hưng",
      "Xã Tân Lợi",
      "Xã Tân Hòa"
    ]
  },
  {
    "newWardId": "71303046",
    "newWardName": "Tân Phú",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26116",
      "26152",
      "26164",
      "26161",
      "26149"
    ],
    "oldWardNames": [
      "Thị trấn Tân Phú",
      "Xã Phú Lộc",
      "Xã Trà Cổ",
      "Xã Phú Thanh",
      "Xã Phú Xuân"
    ]
  },
  {
    "newWardId": "70713054",
    "newWardName": "Tân Quan",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26503"
    ],
    "oldWardNames": [
      "Xã Phước An",
      "Xã Tân Lợi",
      "Xã Quang Minh",
      "Xã Tân Quan"
    ]
  },
  {
    "newWardId": "70706066",
    "newWardName": "Tân Tiến",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26392"
    ],
    "oldWardNames": [
      "Xã Tân Thành",
      "Xã Tân Tiến",
      "Xã Lộc An"
    ]
  },
  {
    "newWardId": "71307050",
    "newWardName": "Tân Triều",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "25996",
      "26194",
      "26185",
      "26188"
    ],
    "oldWardNames": [
      "Phường Tân Phong",
      "Xã Tân Bình",
      "Xã Bình Lợi",
      "Xã Thạnh Phú"
    ]
  },
  {
    "newWardId": "71305091",
    "newWardName": "Thanh Sơn",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26143"
    ],
    "oldWardNames": [
      "Xã Thanh Sơn"
    ]
  },
  {
    "newWardId": "70706067",
    "newWardName": "Thiện Hưng",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Thanh Bình",
      "Xã Thanh Hòa",
      "Xã Thiện Hưng"
    ]
  },
  {
    "newWardId": "70707086",
    "newWardName": "Thọ Sơn",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26146"
    ],
    "oldWardNames": [
      "Xã Phú Sơn",
      "Xã Đồng Nai",
      "Xã Thọ Sơn"
    ]
  },
  {
    "newWardId": "71305023",
    "newWardName": "Thống Nhất",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26299",
      "26302",
      "26236",
      "26242"
    ],
    "oldWardNames": [
      "Xã Gia Tân 1",
      "Xã Gia Tân 2",
      "Xã Phú Cường",
      "Xã Phú Túc"
    ]
  },
  {
    "newWardId": "70701079",
    "newWardName": "Thuận Lợi",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thuận Phú",
      "Xã Thuận Lợi"
    ]
  },
  {
    "newWardId": "71308018",
    "newWardName": "Trảng Bom",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26248",
      "26290",
      "26263",
      "26293"
    ],
    "oldWardNames": [
      "Thị trấn Trảng Bom",
      "Xã Quảng Tiến",
      "Xã Sông Trầu",
      "Xã Giang Điền"
    ]
  },
  {
    "newWardId": "71301005",
    "newWardName": "Trảng Dài",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "25993",
      "26191"
    ],
    "oldWardNames": [
      "Phường Trảng Dài",
      "Xã Thiện Tân"
    ]
  },
  {
    "newWardId": "71301002",
    "newWardName": "Trấn Biên",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26011",
      "26023",
      "26041",
      "26029",
      "26065",
      "26050"
    ],
    "oldWardNames": [
      "Phường Bửu Long",
      "Phường Quang Vinh",
      "Phường Trung Dũng",
      "Phường Thống Nhất",
      "Phường Hiệp Hòa",
      "Phường An Bình"
    ]
  },
  {
    "newWardId": "71307048",
    "newWardName": "Trị An",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26170",
      "26200",
      "26176"
    ],
    "oldWardNames": [
      "Thị trấn Vĩnh An",
      "Xã Mã Đà",
      "Xã Trị An"
    ]
  },
  {
    "newWardId": "71313039",
    "newWardName": "Xuân Bắc",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26245",
      "26428"
    ],
    "oldWardNames": [
      "Xã Suối Nho",
      "Xã Xuân Bắc"
    ]
  },
  {
    "newWardId": "71313034",
    "newWardName": "Xuân Định",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26353",
      "26461"
    ],
    "oldWardNames": [
      "Xã Xuân Bảo",
      "Xã Bảo Hòa",
      "Xã Xuân Định"
    ]
  },
  {
    "newWardId": "71311033",
    "newWardName": "Xuân Đông",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26356",
      "26359",
      "26449"
    ],
    "oldWardNames": [
      "Xã Xuân Tây",
      "Xã Xuân Đông",
      "Xã Xuân Tâm"
    ]
  },
  {
    "newWardId": "71311030",
    "newWardName": "Xuân Đường",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26401",
      "26347",
      "26338"
    ],
    "oldWardNames": [
      "Xã Cẩm Đường",
      "Xã Thừa Đức",
      "Xã Xuân Đường"
    ]
  },
  {
    "newWardId": "71313037",
    "newWardName": "Xuân Hòa",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26446",
      "26443",
      "26449"
    ],
    "oldWardNames": [
      "Xã Xuân Hưng",
      "Xã Xuân Hòa",
      "Xã Xuân Tâm"
    ]
  },
  {
    "newWardId": "71302026",
    "newWardName": "Xuân Lập",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26104",
      "26101"
    ],
    "oldWardNames": [
      "Phường Bàu Sen",
      "Phường Xuân Lập"
    ]
  },
  {
    "newWardId": "71313036",
    "newWardName": "Xuân Lộc",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26425",
      "26437",
      "26440",
      "26452",
      "26455"
    ],
    "oldWardNames": [
      "Thị trấn Gia Ray",
      "Xã Xuân Thọ",
      "Xã Xuân Trường",
      "Xã Suối Cát",
      "Xã Xuân Hiệp"
    ]
  },
  {
    "newWardId": "71313035",
    "newWardName": "Xuân Phú",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26467",
      "26458"
    ],
    "oldWardNames": [
      "Xã Lang Minh",
      "Xã Xuân Phú"
    ]
  },
  {
    "newWardId": "71311029",
    "newWardName": "Xuân Quế",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26329",
      "26332"
    ],
    "oldWardNames": [
      "Xã Sông Nhạn",
      "Xã Xuân Quế"
    ]
  },
  {
    "newWardId": "71313038",
    "newWardName": "Xuân Thành",
    "provinceId": "13",
    "provinceName": "Đồng Nai",
    "oldWardIds": [
      "26431",
      "26434"
    ],
    "oldWardNames": [
      "Xã Suối Cao",
      "Xã Xuân Thành"
    ]
  },
  {
    "newWardId": "80323062",
    "newWardName": "An Bình",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29954",
      "29989",
      "29986"
    ],
    "oldWardNames": [
      "Phường An Lộc",
      "Phường An Bình A",
      "Phường An Bình B"
    ]
  },
  {
    "newWardId": "80309068",
    "newWardName": "An Hòa",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30016",
      "30019"
    ],
    "oldWardNames": [
      "Xã Phú Thành B",
      "Xã An Hòa"
    ]
  },
  {
    "newWardId": "80713016",
    "newWardName": "An Hữu",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hòa Hưng",
      "Xã Mỹ Lương",
      "Xã An Hữu"
    ]
  },
  {
    "newWardId": "80309073",
    "newWardName": "An Long",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30139",
      "30028",
      "30022"
    ],
    "oldWardNames": [
      "Xã An Phong",
      "Xã Phú Ninh",
      "Xã An Long"
    ]
  },
  {
    "newWardId": "80305061",
    "newWardName": "An Phước",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29944",
      "29950"
    ],
    "oldWardNames": [
      "Xã Tân Phước",
      "Xã An Phước"
    ]
  },
  {
    "newWardId": "80711044",
    "newWardName": "An Thạnh Thủy",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình Phan",
      "Xã Bình Phục Nhứt",
      "Xã An Thạnh Thủy"
    ]
  },
  {
    "newWardId": "80315085",
    "newWardName": "Ba Sao",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30094",
      "30085"
    ],
    "oldWardNames": [
      "Xã Phương Trà",
      "Xã Ba Sao"
    ]
  },
  {
    "newWardId": "80315087",
    "newWardName": "Bình Hàng Trung",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30103",
      "30124",
      "30118"
    ],
    "oldWardNames": [
      "Xã Tân Hội Trung",
      "Xã Bình Hàng Tây",
      "Xã Bình Hàng Trung"
    ]
  },
  {
    "newWardId": "80711045",
    "newWardName": "Bình Ninh",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Xuân Đông",
      "Xã Hòa Định",
      "Xã Bình Ninh"
    ]
  },
  {
    "newWardId": "80709023",
    "newWardName": "Bình Phú",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Bình Phú",
      "Xã Phú An",
      "Xã Cẩm Sơn"
    ]
  },
  {
    "newWardId": "80311076",
    "newWardName": "Bình Thành",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30163",
      "30148"
    ],
    "oldWardNames": [
      "Xã Bình Thành",
      "Xã Bình Tấn"
    ]
  },
  {
    "newWardId": "80707039",
    "newWardName": "Bình Trưng",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Điềm Hy",
      "Xã Bình Trưng"
    ]
  },
  {
    "newWardId": "80703009",
    "newWardName": "Bình Xuân",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Long Chánh",
      "Xã Bình Xuân"
    ]
  },
  {
    "newWardId": "80713022",
    "newWardName": "Cái Bè",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Cái Bè",
      "Xã Đông Hòa Hiệp",
      "Xã Hòa Khánh"
    ]
  },
  {
    "newWardId": "80721012",
    "newWardName": "Cai Lậy",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29872"
    ],
    "oldWardNames": [
      "Phường 4",
      "Phường 5",
      "Xã Long Khánh"
    ]
  },
  {
    "newWardId": "80301089",
    "newWardName": "Cao Lãnh",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29869",
      "29875",
      "29872",
      "29878",
      "29893",
      "29899",
      "29890",
      "29896"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 3",
      "Phường 4",
      "Phường 6",
      "Phường Hòa Thuận",
      "Xã Hòa An",
      "Xã Tịnh Thới",
      "Xã Tân Thuận Tây",
      "Xã Tân Thuận Đông"
    ]
  },
  {
    "newWardId": "80707034",
    "newWardName": "Châu Thành",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Tân Hiệp",
      "Xã Thân Cửu Nghĩa",
      "Xã Long An"
    ]
  },
  {
    "newWardId": "80711043",
    "newWardName": "Chợ Gạo",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Chợ Gạo",
      "Xã Long Bình Điền",
      "Xã Song Bình"
    ]
  },
  {
    "newWardId": "80701002",
    "newWardName": "Đạo Thạnh",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29872"
    ],
    "oldWardNames": [
      "Phường 4",
      "Phường 5",
      "Xã Đạo Thạnh"
    ]
  },
  {
    "newWardId": "80313081",
    "newWardName": "Đốc Binh Kiều",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30049",
      "30061"
    ],
    "oldWardNames": [
      "Xã Tân Kiều",
      "Xã Đốc Binh Kiều"
    ]
  },
  {
    "newWardId": "80715047",
    "newWardName": "Đồng Sơn",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình Nhì",
      "Xã Đồng Thạnh",
      "Xã Đồng Sơn"
    ]
  },
  {
    "newWardId": "80717055",
    "newWardName": "Gia Thuận",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Vàm Láng",
      "Xã Kiểng Phước",
      "Xã Gia Thuận"
    ]
  },
  {
    "newWardId": "80703006",
    "newWardName": "Gò Công",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29869"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 5",
      "Phường Long Hòa"
    ]
  },
  {
    "newWardId": "80717051",
    "newWardName": "Gò Công Đông",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30226"
    ],
    "oldWardNames": [
      "Xã Tân Thành",
      "Xã Tăng Hòa"
    ]
  },
  {
    "newWardId": "80713020",
    "newWardName": "Hậu Mỹ",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Hậu Mỹ Bắc A",
      "Xã Hậu Mỹ Bắc B",
      "Xã Hậu Mỹ Trinh"
    ]
  },
  {
    "newWardId": "80709024",
    "newWardName": "Hiệp Đức",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Phong",
      "Xã Hội Xuân",
      "Xã Hiệp Đức"
    ]
  },
  {
    "newWardId": "80319096",
    "newWardName": "Hòa Long",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30208",
      "30217",
      "30229",
      "30223"
    ],
    "oldWardNames": [
      "Thị trấn Lai Vung",
      "Xã Long Hậu",
      "Xã Long Thắng",
      "Xã Hòa Long"
    ]
  },
  {
    "newWardId": "80713021",
    "newWardName": "Hội Cư",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30109"
    ],
    "oldWardNames": [
      "Xã Mỹ Hội",
      "Xã An Cư",
      "Xã Hậu Thành",
      "Xã Hậu Mỹ Phú"
    ]
  },
  {
    "newWardId": "80323063",
    "newWardName": "Hồng Ngự",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29955",
      "29959",
      "29965"
    ],
    "oldWardNames": [
      "Phường An Thạnh",
      "Xã Bình Thạnh",
      "Xã Tân Hội"
    ]
  },
  {
    "newWardId": "80705032",
    "newWardName": "Hưng Thạnh",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30043"
    ],
    "oldWardNames": [
      "Xã Hưng Thạnh",
      "Xã Phú Mỹ",
      "Xã Tân Hòa Thành"
    ]
  },
  {
    "newWardId": "80707038",
    "newWardName": "Kim Sơn",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Song Thuận",
      "Xã Bình Đức",
      "Xã Kim Sơn"
    ]
  },
  {
    "newWardId": "80319095",
    "newWardName": "Lai Vung",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30226",
      "29944",
      "30196",
      "30199"
    ],
    "oldWardNames": [
      "Xã Tân Thành",
      "Xã Tân Phước",
      "Xã Định An",
      "Xã Định Yên"
    ]
  },
  {
    "newWardId": "80317094",
    "newWardName": "Lấp Vò",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30169",
      "30163",
      "30187",
      "30205"
    ],
    "oldWardNames": [
      "Thị trấn Lấp Vò",
      "Xã Bình Thành",
      "Xã Vĩnh Thạnh",
      "Xã Bình Thạnh Trung"
    ]
  },
  {
    "newWardId": "80715049",
    "newWardName": "Long Bình",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình Tân",
      "Xã Long Bình"
    ]
  },
  {
    "newWardId": "80707036",
    "newWardName": "Long Định",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Nhị Bình",
      "Xã Đông Hòa",
      "Xã Long Định"
    ]
  },
  {
    "newWardId": "80707035",
    "newWardName": "Long Hưng",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tam Hiệp",
      "Xã Thạnh Phú",
      "Xã Long Hưng"
    ]
  },
  {
    "newWardId": "80307066",
    "newWardName": "Long Khánh",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29980",
      "29983"
    ],
    "oldWardNames": [
      "Xã Long Khánh A",
      "Xã Long Khánh B"
    ]
  },
  {
    "newWardId": "80307067",
    "newWardName": "Long Phú Thuận",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29992",
      "29998",
      "29995"
    ],
    "oldWardNames": [
      "Xã Long Thuận",
      "Xã Phú Thuận A",
      "Xã Phú Thuận B"
    ]
  },
  {
    "newWardId": "80703007",
    "newWardName": "Long Thuận",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29911"
    ],
    "oldWardNames": [
      "Phường 2",
      "Phường Long Thuận"
    ]
  },
  {
    "newWardId": "80709026",
    "newWardName": "Long Tiên",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30115"
    ],
    "oldWardNames": [
      "Xã Mỹ Long",
      "Xã Long Trung",
      "Xã Long Tiên"
    ]
  },
  {
    "newWardId": "80711041",
    "newWardName": "Lương Hòa Lạc",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thanh Bình",
      "Xã Phú Kiết",
      "Xã Lương Hòa Lạc"
    ]
  },
  {
    "newWardId": "80317092",
    "newWardName": "Mỹ An Hưng",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30145",
      "30202",
      "30172",
      "30178"
    ],
    "oldWardNames": [
      "Xã Tân Mỹ",
      "Xã Hội An Đông",
      "Xã Mỹ An Hưng A",
      "Xã Mỹ An Hưng B"
    ]
  },
  {
    "newWardId": "80713018",
    "newWardName": "Mỹ Đức Tây",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thiện Trí",
      "Xã Mỹ Đức Đông",
      "Xã Mỹ Đức Tây"
    ]
  },
  {
    "newWardId": "80315088",
    "newWardName": "Mỹ Hiệp",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30115",
      "29959",
      "30112"
    ],
    "oldWardNames": [
      "Xã Mỹ Long",
      "Xã Bình Thạnh",
      "Xã Mỹ Hiệp"
    ]
  },
  {
    "newWardId": "80713017",
    "newWardName": "Mỹ Lợi",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã An Thái Đông",
      "Xã Mỹ Lợi A",
      "Xã Mỹ Lợi B"
    ]
  },
  {
    "newWardId": "80301090",
    "newWardName": "Mỹ Ngãi",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29881",
      "29884",
      "30091"
    ],
    "oldWardNames": [
      "Phường Mỹ Ngãi",
      "Xã Mỹ Tân",
      "Xã Tân Nghĩa"
    ]
  },
  {
    "newWardId": "80701003",
    "newWardName": "Mỹ Phong",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường 9",
      "Xã Tân Mỹ Chánh",
      "Xã Mỹ Phong"
    ]
  },
  {
    "newWardId": "80721010",
    "newWardName": "Mỹ Phước Tây",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29869",
      "29875"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 3",
      "Xã Mỹ Hạnh Trung",
      "Xã Mỹ Phước Tây"
    ]
  },
  {
    "newWardId": "80313080",
    "newWardName": "Mỹ Quí",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30070",
      "30058"
    ],
    "oldWardNames": [
      "Xã Láng Biển",
      "Xã Mỹ Đông",
      "Xã Mỹ Quí"
    ]
  },
  {
    "newWardId": "80709027",
    "newWardName": "Mỹ Thành",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phú Nhuận",
      "Xã Mỹ Thành Bắc",
      "Xã Mỹ Thành Nam"
    ]
  },
  {
    "newWardId": "80713019",
    "newWardName": "Mỹ Thiện",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29884"
    ],
    "oldWardNames": [
      "Xã Mỹ Tân",
      "Xã Mỹ Trung",
      "Xã Thiện Trung"
    ]
  },
  {
    "newWardId": "80701001",
    "newWardName": "Mỹ Tho",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29869",
      "29911"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 2",
      "Phường Tân Long"
    ]
  },
  {
    "newWardId": "80315086",
    "newWardName": "Mỹ Thọ",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30076",
      "30109",
      "30121",
      "30100"
    ],
    "oldWardNames": [
      "Thị trấn Mỹ Thọ",
      "Xã Mỹ Hội",
      "Xã Mỹ Xương",
      "Xã Mỹ Thọ"
    ]
  },
  {
    "newWardId": "80711040",
    "newWardName": "Mỹ Tịnh An",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Trung Hòa",
      "Xã Hòa Tịnh",
      "Xã Tân Bình Thạnh",
      "Xã Mỹ Tịnh An"
    ]
  },
  {
    "newWardId": "80301091",
    "newWardName": "Mỹ Trà",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29888",
      "30097",
      "30106",
      "29887"
    ],
    "oldWardNames": [
      "Phường Mỹ Phú",
      "Xã Nhị Mỹ",
      "Xã An Bình",
      "Xã Mỹ Trà"
    ]
  },
  {
    "newWardId": "80709025",
    "newWardName": "Ngũ Hiệp",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tam Bình",
      "Xã Ngũ Hiệp"
    ]
  },
  {
    "newWardId": "80721013",
    "newWardName": "Nhị Quý",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Nhị Mỹ",
      "Xã Phú Quý",
      "Xã Nhị Quý"
    ]
  },
  {
    "newWardId": "80319097",
    "newWardName": "Phong Hòa",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30136",
      "30238",
      "30232",
      "30241"
    ],
    "oldWardNames": [
      "Xã Tân Hòa",
      "Xã Định Hòa",
      "Xã Vĩnh Thới",
      "Xã Phong Hòa"
    ]
  },
  {
    "newWardId": "80315084",
    "newWardName": "Phong Mỹ",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30088",
      "30079"
    ],
    "oldWardNames": [
      "Xã Phong Mỹ",
      "Xã Gáo Giồng"
    ]
  },
  {
    "newWardId": "80309072",
    "newWardName": "Phú Cường",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30025",
      "30079"
    ],
    "oldWardNames": [
      "Xã Phú Cường",
      "Xã Hòa Bình",
      "Xã Gáo Giồng"
    ]
  },
  {
    "newWardId": "80321100",
    "newWardName": "Phú Hựu",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30244",
      "30265",
      "30247",
      "30250",
      "30268"
    ],
    "oldWardNames": [
      "Thị trấn Cái Tàu Hạ",
      "Xã An Phú Thuận",
      "Xã An Hiệp",
      "Xã An Nhơn",
      "Xã Phú Hựu"
    ]
  },
  {
    "newWardId": "80715048",
    "newWardName": "Phú Thành",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29935"
    ],
    "oldWardNames": [
      "Xã Bình Phú",
      "Xã Thành Công",
      "Xã Yên Luông"
    ]
  },
  {
    "newWardId": "80309070",
    "newWardName": "Phú Thọ",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30034",
      "30031"
    ],
    "oldWardNames": [
      "Xã Phú Thành A",
      "Xã Phú Thọ"
    ]
  },
  {
    "newWardId": "80313083",
    "newWardName": "Phương Thịnh",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30043",
      "30082"
    ],
    "oldWardNames": [
      "Xã Hưng Thạnh",
      "Xã Phương Thịnh"
    ]
  },
  {
    "newWardId": "80303098",
    "newWardName": "Sa Đéc",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29869",
      "29911",
      "29875",
      "29872",
      "29917",
      "29914",
      "29920"
    ],
    "oldWardNames": [
      "Phường 1",
      "Phường 2",
      "Phường 3",
      "Phường 4",
      "Phường An Hòa",
      "Phường Tân Quy Đông",
      "Xã Tân Khánh Đông",
      "Xã Tân Quy Tây"
    ]
  },
  {
    "newWardId": "80703008",
    "newWardName": "Sơn Qui",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường Long Hưng",
      "Xã Tân Trung",
      "Xã Bình Đông"
    ]
  },
  {
    "newWardId": "80309069",
    "newWardName": "Tam Nông",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30013",
      "30010"
    ],
    "oldWardNames": [
      "Xã Phú Đức",
      "Xã Phú Hiệp"
    ]
  },
  {
    "newWardId": "80319099",
    "newWardName": "Tân Dương",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29923",
      "30214",
      "30211"
    ],
    "oldWardNames": [
      "Xã Tân Phú Đông",
      "Xã Hòa Thành",
      "Xã Tân Dương"
    ]
  },
  {
    "newWardId": "80717052",
    "newWardName": "Tân Điền",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Bình Ân",
      "Xã Tân Điền"
    ]
  },
  {
    "newWardId": "80717054",
    "newWardName": "Tân Đông",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29944"
    ],
    "oldWardNames": [
      "Xã Tân Phước",
      "Xã Tân Tây",
      "Xã Tân Đông"
    ]
  },
  {
    "newWardId": "80717053",
    "newWardName": "Tân Hòa",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Tân Hòa",
      "Xã Phước Trung",
      "Xã Bình Nghị"
    ]
  },
  {
    "newWardId": "80305060",
    "newWardName": "Tân Hộ Cơ",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29941",
      "29929"
    ],
    "oldWardNames": [
      "Xã Tân Thành B",
      "Xã Tân Hộ Cơ"
    ]
  },
  {
    "newWardId": "80305058",
    "newWardName": "Tân Hồng",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29926",
      "29935",
      "29947"
    ],
    "oldWardNames": [
      "Thị trấn Sa Rài",
      "Xã Bình Phú",
      "Xã Tân Công Chí"
    ]
  },
  {
    "newWardId": "80707033",
    "newWardName": "Tân Hương",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Lý Đông",
      "Xã Tân Hội Đông",
      "Xã Tân Hương"
    ]
  },
  {
    "newWardId": "80317093",
    "newWardName": "Tân Khánh Trung",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30184",
      "30190",
      "30181"
    ],
    "oldWardNames": [
      "Xã Long Hưng A",
      "Xã Long Hưng B",
      "Xã Tân Khánh Trung"
    ]
  },
  {
    "newWardId": "80311077",
    "newWardName": "Tân Long",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30154",
      "30136",
      "30133",
      "30151",
      "30166",
      "29995"
    ],
    "oldWardNames": [
      "Xã Tân Bình",
      "Xã Tân Hòa",
      "Xã Tân Quới",
      "Xã Tân Huề",
      "Xã Tân Long",
      "Xã Phú Thuận B"
    ]
  },
  {
    "newWardId": "80321101",
    "newWardName": "Tân Nhuận Đông",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30277",
      "30271",
      "30253"
    ],
    "oldWardNames": [
      "Xã Hòa Tân",
      "Xã An Khánh",
      "Xã Tân Nhuận Đông"
    ]
  },
  {
    "newWardId": "80721014",
    "newWardName": "Tân Phú",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29965",
      "30160"
    ],
    "oldWardNames": [
      "Xã Tân Hội",
      "Xã Tân Phú",
      "Xã Mỹ Hạnh Đông"
    ]
  },
  {
    "newWardId": "80719057",
    "newWardName": "Tân Phú Đông",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phú Thạnh",
      "Xã Phú Đông",
      "Xã Phú Tân"
    ]
  },
  {
    "newWardId": "80321102",
    "newWardName": "Tân Phú Trung",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30154",
      "30160",
      "30262",
      "30259"
    ],
    "oldWardNames": [
      "Xã Tân Bình",
      "Xã Tân Phú",
      "Xã Phú Long",
      "Xã Tân Phú Trung"
    ]
  },
  {
    "newWardId": "80705029",
    "newWardName": "Tân Phước 1",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Mỹ Phước",
      "Xã Thạnh Mỹ",
      "Xã Tân Hòa Đông"
    ]
  },
  {
    "newWardId": "80705030",
    "newWardName": "Tân Phước 2",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Thạnh Tân",
      "Xã Thạnh Hòa",
      "Xã Tân Hòa Tây"
    ]
  },
  {
    "newWardId": "80705031",
    "newWardName": "Tân Phước 3",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phước Lập",
      "Xã Tân Lập 1",
      "Xã Tân Lập 2"
    ]
  },
  {
    "newWardId": "80305059",
    "newWardName": "Tân Thành",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29932",
      "29938"
    ],
    "oldWardNames": [
      "Xã Thông Bình",
      "Xã Tân Thành A"
    ]
  },
  {
    "newWardId": "80311075",
    "newWardName": "Tân Thạnh",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30142",
      "30157"
    ],
    "oldWardNames": [
      "Xã Phú Lợi",
      "Xã Tân Thạnh"
    ]
  },
  {
    "newWardId": "80719056",
    "newWardName": "Tân Thới",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30160",
      "30157"
    ],
    "oldWardNames": [
      "Xã Tân Phú",
      "Xã Tân Thạnh",
      "Xã Tân Thới"
    ]
  },
  {
    "newWardId": "80711042",
    "newWardName": "Tân Thuận Bình",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Đăng Hưng Phước",
      "Xã Quơn Long",
      "Xã Tân Thuận Bình"
    ]
  },
  {
    "newWardId": "80311074",
    "newWardName": "Thanh Bình",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30145",
      "30160",
      "30130",
      "30157"
    ],
    "oldWardNames": [
      "Xã Tân Mỹ",
      "Xã Tân Phú",
      "Thị trấn Thanh Bình",
      "Xã Tân Thạnh"
    ]
  },
  {
    "newWardId": "80721011",
    "newWardName": "Thanh Hòa",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29911",
      "30154"
    ],
    "oldWardNames": [
      "Phường 2",
      "Xã Tân Bình",
      "Xã Thanh Hòa"
    ]
  },
  {
    "newWardId": "80713015",
    "newWardName": "Thanh Hưng",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Tân Thanh",
      "Xã Tân Hưng",
      "Xã An Thái Trung"
    ]
  },
  {
    "newWardId": "80313079",
    "newWardName": "Thanh Mỹ",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30067",
      "30073"
    ],
    "oldWardNames": [
      "Xã Phú Điền",
      "Xã Thanh Mỹ"
    ]
  },
  {
    "newWardId": "80709028",
    "newWardName": "Thạnh Phú",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30025"
    ],
    "oldWardNames": [
      "Xã Phú Cường",
      "Xã Thạnh Lộc"
    ]
  },
  {
    "newWardId": "80313078",
    "newWardName": "Tháp Mười",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30037",
      "30064",
      "30052"
    ],
    "oldWardNames": [
      "Thị trấn Mỹ An",
      "Xã Mỹ An",
      "Xã Mỹ Hòa"
    ]
  },
  {
    "newWardId": "80701004",
    "newWardName": "Thới Sơn",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29878"
    ],
    "oldWardNames": [
      "Phường 6",
      "Xã Thới Sơn"
    ]
  },
  {
    "newWardId": "80307064",
    "newWardName": "Thường Lạc",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29978",
      "29962",
      "29977"
    ],
    "oldWardNames": [
      "Phường An Lạc",
      "Xã Thường Thới Hậu A",
      "Xã Thường Lạc"
    ]
  },
  {
    "newWardId": "80307065",
    "newWardName": "Thường Phước",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "29971",
      "29956",
      "29974"
    ],
    "oldWardNames": [
      "Thị trấn Thường Thới Tiền",
      "Xã Thường Phước 1",
      "Xã Thường Phước 2"
    ]
  },
  {
    "newWardId": "80309071",
    "newWardName": "Tràm Chim",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30001",
      "30007"
    ],
    "oldWardNames": [
      "Thị trấn Tràm Chim",
      "Xã Tân Công Sính"
    ]
  },
  {
    "newWardId": "80701005",
    "newWardName": "Trung An",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Phường 10",
      "Xã Phước Thạnh",
      "Xã Trung An"
    ]
  },
  {
    "newWardId": "80313082",
    "newWardName": "Trường Xuân",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [
      "30040",
      "30046"
    ],
    "oldWardNames": [
      "Xã Thạnh Lợi",
      "Xã Trường Xuân"
    ]
  },
  {
    "newWardId": "80715046",
    "newWardName": "Vĩnh Bình",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Thị trấn Vĩnh Bình",
      "Xã Thạnh Nhựt",
      "Xã Thạnh Trị"
    ]
  },
  {
    "newWardId": "80715050",
    "newWardName": "Vĩnh Hựu",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Long Vĩnh",
      "Xã Vĩnh Hựu"
    ]
  },
  {
    "newWardId": "80707037",
    "newWardName": "Vĩnh Kim",
    "provinceId": "03",
    "provinceName": "Đồng Tháp",
    "oldWardIds": [],
    "oldWardNames": [
      "Xã Phú Phong",
      "Xã Bàn Long",
      "Xã Vĩnh Kim"
    ]
  }
] as const satisfies readonly WardMappingSeed[];

export const WARD_MAPPINGS: WardMapping[] = rawData.map((item) => ({
  ...item,
  provinceId: asBusinessId(item.provinceId),
}));

// Helper functions
export function findOldWardsByNewId(newWardId: string): string[] {
  const mapping = WARD_MAPPINGS.find(m => m.newWardId === newWardId);
  return mapping?.oldWardIds || [];
}

export function findNewWardByOldId(oldWardId: string): string | null {
  const mapping = WARD_MAPPINGS.find(m => m.oldWardIds.includes(oldWardId));
  return mapping?.newWardId || null;
}

export function getMapping(newWardId: string): WardMapping | undefined {
  return WARD_MAPPINGS.find(m => m.newWardId === newWardId);
}
