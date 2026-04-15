 GET /api/notifications/unread-counts 200 in 146ms (compile: 20ms, proxy.ts: 67ms, render: 59ms)
[Middleware Debug] GET /api/warranties/stats | role=Admin | permission=view_warranty | hasPermission=true
[Middleware Debug] GET /api/complaints/stats | role=Admin | permission=view_complaints | hasPermission=true
prisma:error 
Invalid `__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].leave.findMany()` invocation in
D:\hrm2\.next\dev\server\chunks\[root-of-the-server]__e633b961._.js:6577:141

  6574     [sortBy]: sortOrder
  6575 };
  6576 const [data, total] = await Promise.all([
→ 6577     __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].leave.findMany({
             where: {
               status: "pending"
                       ~~~~~~~~~
             },
             skip: 0,
             take: 5,
             orderBy: {
               createdAt: "desc"
             },
             include: {
               employee: {
                 select: {
                   systemId: true,
                   id: true,
                   fullName: true
                 }
               }
             }
           })

Invalid value for argument `status`. Expected LeaveStatus.
prisma:error 
Invalid `__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].leave.count()` invocation in
D:\hrm2\.next\dev\server\chunks\[root-of-the-server]__e633b961._.js:6592:141

  6589         }
  6590     }
  6591 }),
→ 6592 __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].leave.count({
         select: {
           _count: {
             select: {
               _all: true
             }
           }
         },
         where: {
           status: "pending"
                   ~~~~~~~~~
         }
       })

Invalid value for argument `status`. Expected LeaveStatus.
[ERROR] [Leaves API] GET error Error [PrismaClientValidationError]: 
Invalid `__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].leave.findMany()` invocation in
D:\hrm2\.next\dev\server\chunks\[root-of-the-server]__e633b961._.js:6577:141

  6574     [sortBy]: sortOrder
  6575 };
  6576 const [data, total] = await Promise.all([
→ 6577     __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].leave.findMany({
             where: {
               status: "pending"
                       ~~~~~~~~~
             },
             skip: 0,
             take: 5,
             orderBy: {
               createdAt: "desc"
             },
             include: {
               employee: {
                 select: {
                   systemId: true,
                   id: true,
                   fullName: true
                 }
               }
             }
           })

Invalid value for argument `status`. Expected LeaveStatus.
    at <unknown> (app\api\leaves\route.ts:115:20)
    at async GET (app\api\leaves\route.ts:114:27)
  113 |
  114 |     const [data, total] = await Promise.all([
> 115 |       prisma.leave.findMany({
      |                    ^
  116 |         where,
  117 |         skip,
  118 |         take: limit, {
  clientVersion: '7.2.0'
} 
 GET /api/leaves?limit=5&status=pending&sortBy=createdAt&sortOrder=desc 500 in 1038ms (compile: 555ms, proxy.ts: 112ms, render: 372ms)
 GET /api/branches?page=1&limit=100000 200 in 1224ms (compile: 627ms, proxy.ts: 80ms, render: 517ms)
 GET /api/warranties/stats 200 in 1105ms (compile: 576ms, proxy.ts: 55ms, render: 475ms)
 GET /api/complaints/stats 200 in 1104ms (compile: 620ms, proxy.ts: 108ms, render: 376ms)
 GET /api/tasks/dashboard-stats 200 in 1150ms (compile: 462ms, proxy.ts: 45ms, render: 643ms)
 GET /api/dashboard?startDate=2026-04-15&endDate=2026-04-15&chartFrom=2026-04-09&chartTo=2026-04-15&topFrom=2026-04-09&topTo=2026-04-15 200 in 1231ms (compile: 425ms, proxy.ts: 55ms, render: 752ms)
 GET /api/settings?group=general 200 in 74ms (compile: 7ms, proxy.ts: 30ms, render: 37ms)
 GET /api/auth/session 200 in 87ms (compile: 35ms, proxy.ts: 31ms, render: 21ms)
 GET /api/upload?entityIds=PRODUCT003313%2CPRODUCT001626%2CPRODUCT000945%2CPRODUCT001091%2CPRODUCT001066&entityType=products 200 in 207ms (compile: 178ms, proxy.ts: 8ms, render: 20ms)
prisma:error 
Invalid `__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].leave.findMany()` invocation in
D:\hrm2\.next\dev\server\chunks\[root-of-the-server]__e633b961._.js:6577:141

  6574     [sortBy]: sortOrder
  6575 };
  6576 const [data, total] = await Promise.all([
→ 6577     __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].leave.findMany({
             where: {
               status: "pending"
                       ~~~~~~~~~
             },
             skip: 0,
             take: 5,
             orderBy: {
               createdAt: "desc"
             },
             include: {
               employee: {
                 select: {
                   systemId: true,
                   id: true,
                   fullName: true
                 }
               }
             }
           })

Invalid value for argument `status`. Expected LeaveStatus.
prisma:error 
Invalid `__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].leave.count()` invocation in
D:\hrm2\.next\dev\server\chunks\[root-of-the-server]__e633b961._.js:6592:141

  6589         }
  6590     }
  6591 }),
→ 6592 __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].leave.count({
         select: {
           _count: {
             select: {
               _all: true
             }
           }
         },
         where: {
           status: "pending"
                   ~~~~~~~~~
         }
       })

Invalid value for argument `status`. Expected LeaveStatus.
[ERROR] [Leaves API] GET error Error [PrismaClientValidationError]: 
Invalid `__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].leave.findMany()` invocation in
D:\hrm2\.next\dev\server\chunks\[root-of-the-server]__e633b961._.js:6577:141

  6574     [sortBy]: sortOrder
  6575 };
  6576 const [data, total] = await Promise.all([
→ 6577     __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].leave.findMany({
             where: {
               status: "pending"
                       ~~~~~~~~~
             },
             skip: 0,
             take: 5,
             orderBy: {
               createdAt: "desc"
             },
             include: {
               employee: {
                 select: {
                   systemId: true,
                   id: true,
                   fullName: true
                 }
               }
             }
           })

Invalid value for argument `status`. Expected LeaveStatus.
    at <unknown> (app\api\leaves\route.ts:115:20)
    at async GET (app\api\leaves\route.ts:114:27)
  113 |
  114 |     const [data, total] = await Promise.all([
> 115 |       prisma.leave.findMany({
      |                    ^
  116 |         where,
  117 |         skip,
  118 |         take: limit, {
  clientVersion: '7.2.0'
} 
 GET /api/leaves?limit=5&status=pending&sortBy=createdAt&sortOrder=desc 500 in 149ms (compile: 3ms, proxy.ts: 9ms, render: 137ms)
prisma:error 
Invalid `__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].leave.findMany()` invocation in
D:\hrm2\.next\dev\server\chunks\[root-of-the-server]__e633b961._.js:6577:141

  6574     [sortBy]: sortOrder
  6575 };
  6576 const [data, total] = await Promise.all([
→ 6577     __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].leave.findMany({
             where: {
               status: "pending"
                       ~~~~~~~~~
             },
             skip: 0,
             take: 5,
             orderBy: {
               createdAt: "desc"
             },
             include: {
               employee: {
                 select: {
                   systemId: true,
                   id: true,
                   fullName: true
                 }
               }
             }
           })

Invalid value for argument `status`. Expected LeaveStatus.
prisma:error 
Invalid `__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].leave.count()` invocation in
D:\hrm2\.next\dev\server\chunks\[root-of-the-server]__e633b961._.js:6592:141

  6589         }
  6590     }
  6591 }),
→ 6592 __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].leave.count({
         select: {
           _count: {
             select: {
               _all: true
             }
           }
         },
         where: {
           status: "pending"
                   ~~~~~~~~~
         }
       })

Invalid value for argument `status`. Expected LeaveStatus.
[ERROR] [Leaves API] GET error Error [PrismaClientValidationError]: 
Invalid `__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].leave.findMany()` invocation in
D:\hrm2\.next\dev\server\chunks\[root-of-the-server]__e633b961._.js:6577:141

  6574     [sortBy]: sortOrder
  6575 };
  6576 const [data, total] = await Promise.all([
→ 6577     __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].leave.findMany({
             where: {
               status: "pending"
                       ~~~~~~~~~
             },
             skip: 0,
             take: 5,
             orderBy: {
               createdAt: "desc"
             },
             include: {
               employee: {
                 select: {
                   systemId: true,
                   id: true,
                   fullName: true
                 }
               }
             }
           })

Invalid value for argument `status`. Expected LeaveStatus.
    at <unknown> (app\api\leaves\route.ts:115:20)
    at async GET (app\api\leaves\route.ts:114:27)
  113 |
  114 |     const [data, total] = await Promise.all([
> 115 |       prisma.leave.findMany({
      |                    ^
  116 |         where,
  117 |         skip,
  118 |         take: limit, {
  clientVersion: '7.2.0'
} 
 GET /api/leaves?limit=5&status=pending&sortBy=createdAt&sortOrder=desc 500 in 138ms (compile: 3ms, proxy.ts: 8ms, render: 127ms)
prisma:error 
Invalid `__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].leave.findMany()` invocation in
D:\hrm2\.next\dev\server\chunks\[root-of-the-server]__e633b961._.js:6577:141

  6574     [sortBy]: sortOrder
  6575 };
  6576 const [data, total] = await Promise.all([
→ 6577     __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].leave.findMany({
             where: {
               status: "pending"
                       ~~~~~~~~~
             },
             skip: 0,
             take: 5,
             orderBy: {
               createdAt: "desc"
             },
             include: {
               employee: {
                 select: {
                   systemId: true,
                   id: true,
                   fullName: true
                 }
               }
             }
           })

Invalid value for argument `status`. Expected LeaveStatus.
prisma:error 
Invalid `__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].leave.count()` invocation in
D:\hrm2\.next\dev\server\chunks\[root-of-the-server]__e633b961._.js:6592:141

  6589         }
  6590     }
  6591 }),
→ 6592 __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].leave.count({
         select: {
           _count: {
             select: {
               _all: true
             }
           }
         },
         where: {
           status: "pending"
                   ~~~~~~~~~
         }
       })

Invalid value for argument `status`. Expected LeaveStatus.
[ERROR] [Leaves API] GET error Error [PrismaClientValidationError]: 
Invalid `__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].leave.findMany()` invocation in
D:\hrm2\.next\dev\server\chunks\[root-of-the-server]__e633b961._.js:6577:141

  6574     [sortBy]: sortOrder
  6575 };
  6576 const [data, total] = await Promise.all([
→ 6577     __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].leave.findMany({
             where: {
               status: "pending"
                       ~~~~~~~~~
             },
             skip: 0,
             take: 5,
             orderBy: {
               createdAt: "desc"
             },
             include: {
               employee: {
                 select: {
                   systemId: true,
                   id: true,
                   fullName: true
                 }
               }
             }
           })

Invalid value for argument `status`. Expected LeaveStatus.
    at <unknown> (app\api\leaves\route.ts:115:20)
    at async GET (app\api\leaves\route.ts:114:27)
  113 |
  114 |     const [data, total] = await Promise.all([
> 115 |       prisma.leave.findMany({
      |                    ^
  116 |         where,
  117 |         skip,
  118 |         take: limit, {
  clientVersion: '7.2.0'
} 
 GET /api/leaves?limit=5&status=pending&sortBy=createdAt&sortOrder=desc 500 in 149ms (compile: 4ms, proxy.ts: 7ms, render: 138ms)