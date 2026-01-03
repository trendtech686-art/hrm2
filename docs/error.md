PS D:\hrm2> npx tsc --noEmit
app/api/orders/[systemId]/packaging/route.ts:17:37 - error TS2353: Object literal may only specify known properties, and 'name' does not exist in type 'EmployeeSelect<DefaultArgs>'.

17           select: { systemId: true, name: true },
                                       ~~~~

app/api/orders/[systemId]/shipment/sync/route.ts:28:61 - error TS2551: Property 'cancelledAt' does not exist on type '{ shipment: { systemId: string; createdAt: Date; updatedAt: Date; createdBy: string; id: string; status: ShipmentStatus; cancelledAt: Date; recipientName: string; ... 37 more ...; dispatchedAt: Date; }; } & { ...; }'. Did you mean 'cancelDate'?

28     const activePackaging = order.packagings.find((p) => !p.cancelledAt);
                                                               ~~~~~~~~~~~

app/api/orders/cod-reconciliation/route.ts:29:13 - error TS2353: Object literal may only specify known properties, and 'codReconciled' does not exist in type '(Without<ShipmentUpdateInput, ShipmentUncheckedUpdateInput> & ShipmentUncheckedUpdateInput) | (Without<...> & ShipmentUpdateInput)'.

29             codReconciled: true,
               ~~~~~~~~~~~~~

  generated/prisma/models/Shipment.ts:2977:3
    2977   data: Prisma.XOR<Prisma.ShipmentUpdateInput, Prisma.ShipmentUncheckedUpdateInput>
           ~~~~
    The expected type comes from property 'data' which is declared here on type '{ select?: ShipmentSelect<DefaultArgs>; omit?: ShipmentOmit<DefaultArgs>; include?: ShipmentInclude<DefaultArgs>; data: (Without<...> & ShipmentUncheckedUpdateInput) | (Without<...> & ShipmentUpdateInput); where: ShipmentWhereUniqueInput; }'

app/api/orders/cod-reconciliation/route.ts:42:64 - error TS2365: Operator '+' cannot be applied to types 'number' and 'number | Decimal'.

42           const paidAmount = order.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
                                                                  ~~~~~~~~~~~~~~~~~~~~~

app/api/orders/cod-reconciliation/route.ts:49:15 - error TS2353: Object literal may only specify known properties, and 'orderSystemId' does not exist in type '(Without<OrderPaymentCreateInput, OrderPaymentUncheckedCreateInput> & OrderPaymentUncheckedCreateInput) | (Without<...> & OrderPaymentCreateInput)'.

49               orderSystemId: order.systemId,
                 ~~~~~~~~~~~~~

  generated/prisma/models/OrderPayment.ts:1366:3
    1366   data: Prisma.XOR<Prisma.OrderPaymentCreateInput, Prisma.OrderPaymentUncheckedCreateInput>       
           ~~~~
    The expected type comes from property 'data' which is declared here on type '{ select?: OrderPaymentSelect<DefaultArgs>; omit?: OrderPaymentOmit<DefaultArgs>; include?: OrderPaymentInclude<DefaultArgs>; data: (Without<...> & OrderPaymentUncheckedCreateInput) | (Without<...> & OrderPaymentCreateInput); }'

features/customers/customer-form.tsx:304:32 - error TS2552: Cannot find name 'customerTypes'. Did you mean 'customers'?

304   }, [isEditMode, initialData, customerTypes, customerGroups, customerSources, lifecycleStages, paymentTerms, creditRatings, pricingPolicies, form]);
                                   ~~~~~~~~~~~~~

  features/customers/customer-form.tsx:76:17
    76   const { data: customers } = useCustomerStore();
                       ~~~~~~~~~
    'customers' is declared here.

features/customers/customer-form.tsx:304:47 - error TS2552: Cannot find name 'customerGroups'. Did you mean 'customerGroupsData'?

304   }, [isEditMode, initialData, customerTypes, customerGroups, customerSources, lifecycleStages, paymentTerms, creditRatings, pricingPolicies, form]);
                                                  ~~~~~~~~~~~~~~

  features/customers/customer-form.tsx:80:17
    80   const { data: customerGroupsData } = useActiveCustomerGroups();
                       ~~~~~~~~~~~~~~~~~~
    'customerGroupsData' is declared here.

features/customers/customer-form.tsx:304:63 - error TS2552: Cannot find name 'customerSources'. Did you mean 'customerSourcesData'?

304   }, [isEditMode, initialData, customerTypes, customerGroups, customerSources, lifecycleStages, paymentTerms, creditRatings, pricingPolicies, form]);
                                                                  ~~~~~~~~~~~~~~~

  features/customers/customer-form.tsx:81:17
    81   const { data: customerSourcesData } = useActiveCustomerSources();
                       ~~~~~~~~~~~~~~~~~~~
    'customerSourcesData' is declared here.

features/customers/customer-form.tsx:304:80 - error TS2552: Cannot find name 'lifecycleStages'. Did you mean 'lifecycleStagesData'?

304   }, [isEditMode, initialData, customerTypes, customerGroups, customerSources, lifecycleStages, paymentTerms, creditRatings, pricingPolicies, form]);
                                                                                   ~~~~~~~~~~~~~~~

  features/customers/customer-form.tsx:84:17
    84   const { data: lifecycleStagesData } = useActiveLifecycleStages();
                       ~~~~~~~~~~~~~~~~~~~
    'lifecycleStagesData' is declared here.

features/customers/customer-form.tsx:304:97 - error TS2552: Cannot find name 'paymentTerms'. Did you mean 'paymentTermsData'?

304   }, [isEditMode, initialData, customerTypes, customerGroups, customerSources, lifecycleStages, paymentTerms, creditRatings, pricingPolicies, form]);
                                                                                                    ~~~~~~~~~~~~

  features/customers/customer-form.tsx:82:17
    82   const { data: paymentTermsData } = useActivePaymentTerms();
                       ~~~~~~~~~~~~~~~~
    'paymentTermsData' is declared here.

features/customers/customer-form.tsx:304:111 - error TS2552: Cannot find name 'creditRatings'. Did you mean 'creditRatingsData'?

304   }, [isEditMode, initialData, customerTypes, customerGroups, customerSources, lifecycleStages, paymentTerms, creditRatings, pricingPolicies, form]);
                                                                                                           
       ~~~~~~~~~~~~~

  features/customers/customer-form.tsx:83:17
    83   const { data: creditRatingsData } = useActiveCreditRatings();
                       ~~~~~~~~~~~~~~~~~
    'creditRatingsData' is declared here.

features/customers/customer-form.tsx:359:13 - error TS2552: Cannot find name 'customerGroups'. Did you mean 'customerGroupsData'?

359   }, [form, customerGroups, pricingPolicies]);
                ~~~~~~~~~~~~~~

  features/customers/customer-form.tsx:80:17
    80   const { data: customerGroupsData } = useActiveCustomerGroups();
                       ~~~~~~~~~~~~~~~~~~
    'customerGroupsData' is declared here.

features/employees/components/employee-form-old.tsx:13:32 - error TS2307: Cannot find module '@/hooks/use-branches' or its corresponding type declarations.

13 import { useAllBranches } from '@/hooks/use-branches';
                                  ~~~~~~~~~~~~~~~~~~~~~~

features/employees/components/employee-form.tsx:13:32 - error TS2307: Cannot find module '@/hooks/use-branches' or its corresponding type declarations.

13 import { useAllBranches } from '@/hooks/use-branches';
                                  ~~~~~~~~~~~~~~~~~~~~~~

features/employees/page-tanstack-test.tsx:12:32 - error TS2307: Cannot find module '@/hooks/use-branches' or its corresponding type declarations.

12 import { useAllBranches } from '@/hooks/use-branches';
                                  ~~~~~~~~~~~~~~~~~~~~~~

features/employees/page.tsx:9:32 - error TS2307: Cannot find module '@/hooks/use-branches' or its corresponding type declarations.

9 import { useAllBranches } from "@/hooks/use-branches";
                                 ~~~~~~~~~~~~~~~~~~~~~~

features/employees/trash-page.tsx:9:32 - error TS2307: Cannot find module '@/hooks/use-branches' or its corresponding type declarations.

9 import { useAllBranches } from "@/hooks/use-branches";
                                 ~~~~~~~~~~~~~~~~~~~~~~

features/employees/virtualized-page.tsx:6:32 - error TS2307: Cannot find module '@/hooks/use-branches' or its corresponding type declarations.

6 import { useAllBranches } from "@/hooks/use-branches";
                                 ~~~~~~~~~~~~~~~~~~~~~~

features/orders/hooks/use-all-orders.ts:18:17 - error TS2339: Property 'isLoading' does not exist on type '{ cancelOrder: (systemId: SystemId, employeeId: SystemId, options?: { reason?: string; restock?: boolean; }) => void; addPayment: (orderSystemId: SystemId, paymentData: { ...; }, employeeId: SystemId) => void; ... 26 more ...; loadFromAPI: () => Promise<...>; }'.

18   const { data, isLoading } = useOrderStore();
                   ~~~~~~~~~

features/orders/hooks/use-all-orders.ts:36:31 - error TS2339: Property 'isDeleted' does not exist on type 'Order'.

36     () => data.filter(o => !o.isDeleted && o.status !== 'cancelled'),
                                 ~~~~~~~~~

features/orders/hooks/use-all-orders.ts:36:44 - error TS2367: This comparison appears to be unintentional because the types 'OrderMainStatus' and '"cancelled"' have no overlap.

36     () => data.filter(o => !o.isDeleted && o.status !== 'cancelled'),
                                              ~~~~~~~~~~~~~~~~~~~~~~~~

features/orders/order-detail-page.tsx:1547:9 - error TS2339: Property 'isPending' does not exist on type '{ cancelOrder: (orderSystemId: string | SystemId, _employeeSystemId?: string | SystemId, opts?: CancelOptions) => Promise<void>; ... 23 more ...; isLoading: boolean; }'.

1547         isPending
             ~~~~~~~~~

features/orders/order-detail-page.tsx:2144:108 - error TS2345: Argument of type 'PaymentFormValues' is not assignable to parameter of type 'PaymentData'.
  Property 'paymentMethodId' is missing in type 'PaymentFormValues' but required in type 'PaymentData'.    

2144     const handleAddPayment = (paymentData: PaymentFormValues) => { if (order) { addPayment(order.systemId, paymentData, currentEmployeeSystemId); setIsPaymentDialogOpen(false); } };
                                                                                                           
     ~~~~~~~~~~~

  features/orders/hooks/use-order-detail-actions.ts:24:3
    24   paymentMethodId: string;
         ~~~~~~~~~~~~~~~
    'paymentMethodId' is declared here.

features/orders/order-detail-page.tsx:2155:84 - error TS2345: Argument of type 'Record<string, unknown>' is not assignable to parameter of type 'string'.

2155             await confirmPartnerShipment(order.systemId, activePackaging.systemId, data);
                                                                                        ~~~~

features/products/hooks/use-combo-stock.ts:132:33 - error TS2304: Cannot find name 'useProductStore'.      

132   const { data: allProducts } = useProductStore();
                                    ~~~~~~~~~~~~~~~

features/products/hooks/use-product-pricing.ts:104:33 - error TS2304: Cannot find name 'useProductStore'.  

104   const { data: allProducts } = useProductStore();
                                    ~~~~~~~~~~~~~~~

features/purchase-orders/detail-page.tsx:171:12 - error TS2304: Cannot find name 'findByPurchaseOrderSystemId'.

171     return findByPurchaseOrderSystemId(asSystemId(purchaseOrder.systemId));
               ~~~~~~~~~~~~~~~~~~~~~~~~~~~

features/purchase-orders/detail-page.tsx:172:22 - error TS2304: Cannot find name 'findByPurchaseOrderSystemId'.

172   }, [purchaseOrder, findByPurchaseOrderSystemId]);
                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~

features/settings/complaints/complaints-settings-page.tsx:66:8 - error TS2300: Duplicate identifier 'ComplaintType'.

66   type ComplaintType,
          ~~~~~~~~~~~~~

features/settings/complaints/complaints-settings-page.tsx:70:8 - error TS2300: Duplicate identifier 'ComplaintType'.

70   type ComplaintType,
          ~~~~~~~~~~~~~

features/settings/complaints/complaints-settings-page.tsx:229:32 - error TS2304: Cannot find name 'defaultSLA'.

229     const nextDefaults = clone(defaultSLA);
                                   ~~~~~~~~~~

features/settings/complaints/complaints-settings-page.tsx:304:28 - error TS2304: Cannot find name 'defaultTemplates'.

304     const defaults = clone(defaultTemplates);
                               ~~~~~~~~~~~~~~~~

features/settings/complaints/complaints-settings-page.tsx:337:28 - error TS2304: Cannot find name 'defaultNotifications'.

337     const defaults = clone(defaultNotifications);
                               ~~~~~~~~~~~~~~~~~~~~

features/settings/complaints/complaints-settings-page.tsx:364:28 - error TS2304: Cannot find name 'defaultPublicTracking'.

364     const defaults = clone(defaultPublicTracking);
                               ~~~~~~~~~~~~~~~~~~~~~

features/settings/complaints/complaints-settings-page.tsx:391:28 - error TS2304: Cannot find name 'defaultReminders'.

391     const defaults = clone(defaultReminders);
                               ~~~~~~~~~~~~~~~~

features/settings/complaints/complaints-settings-page.tsx:499:28 - error TS2304: Cannot find name 'defaultCardColors'.

499     const defaults = clone(defaultCardColors);
                               ~~~~~~~~~~~~~~~~~

features/settings/complaints/complaints-settings-page.tsx:570:28 - error TS2304: Cannot find name 'defaultComplaintTypes'.

570     const defaults = clone(defaultComplaintTypes);
                               ~~~~~~~~~~~~~~~~~~~~~

features/settings/pkgx/components/brand-mapping-tab.tsx:85:5 - error TS2322: Type '{ systemId: string; isActive: boolean; createdAt: Date; updatedAt: Date; id: string; name: string; description: string; isDeleted: boolean; deletedAt: Date; website: string; logo: string; ... 8 more ...; sortOrder: number; }[]' is not assignable to type '{ systemId: SystemId; name: string; status?: string; isActive?: boolean; }[]'.
  Type '{ systemId: string; isActive: boolean; createdAt: Date; updatedAt: Date; id: string; name: string; description: string; isDeleted: boolean; deletedAt: Date; website: string; logo: string; ... 8 more ...; sortOrder: number; }' is not assignable to type '{ systemId: SystemId; name: string; status?: string; isActive?: boolean; }'.
    Types of property 'systemId' are incompatible.
      Type 'string' is not assignable to type 'SystemId'.
        Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.

85     hrmBrands: hrmBrands,
       ~~~~~~~~~

  features/settings/pkgx/hooks/use-brand-mapping-validation.ts:14:3
    14   hrmBrands: Array<{
         ~~~~~~~~~
    The expected type comes from property 'hrmBrands' which is declared here on type 'UseBrandMappingValidationOptions'

features/settings/pkgx/components/brand-mapping-tab.tsx:254:13 - error TS2322: Type 'JsonValue' is not assignable to type '{ pkgx?: { seoKeywords?: string; seoTitle?: string; metaDescription?: string; shortDescription?: string; longDescription?: string; }; }'.
  Type 'string' has no properties in common with type '{ pkgx?: { seoKeywords?: string; seoTitle?: string; metaDescription?: string; shortDescription?: string; longDescription?: string; }; }'.

254             websiteSeo: hrmBrand.websiteSeo,
                ~~~~~~~~~~

  features/settings/pkgx/hooks/use-pkgx-entity-sync.ts:65:3
    65   websiteSeo?: {
         ~~~~~~~~~~
    The expected type comes from property 'websiteSeo' which is declared here on type 'HrmBrandData'       

features/settings/pkgx/components/brand-mapping-tab.tsx:470:9 - error TS2322: Type 'string' is not assignable to type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.

470         hrmBrandSystemId: hrmBrand.systemId,
            ~~~~~~~~~~~~~~~~

  lib/types/prisma-extended.ts:3321:3
    3321   hrmBrandSystemId: SystemId;
           ~~~~~~~~~~~~~~~~
    The expected type comes from property 'hrmBrandSystemId' which is declared here on type 'Partial<PkgxBrandMapping>'

features/settings/pkgx/components/brand-mapping-tab.tsx:485:9 - error TS2322: Type 'string' is not assignable to type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.

485         hrmBrandSystemId: hrmBrand.systemId,
            ~~~~~~~~~~~~~~~~

  lib/types/prisma-extended.ts:3321:3
    3321   hrmBrandSystemId: SystemId;
           ~~~~~~~~~~~~~~~~
    The expected type comes from property 'hrmBrandSystemId' which is declared here on type 'PkgxBrandMapping'

features/settings/pkgx/components/category-mapping-tab.tsx:84:5 - error TS2322: Type '{ systemId: string; isActive: boolean; createdAt: Date; updatedAt: Date; id: string; name: string; description: string; isDeleted: boolean; deletedAt: Date; slug: string; thumbnail: string; ... 13 more ...; imageUrl: string; }[]' is not assignable to type '{ systemId: SystemId; name: string; parentId?: SystemId; status?: string; isActive?: boolean; path?: string; }[]'.
  Type '{ systemId: string; isActive: boolean; createdAt: Date; updatedAt: Date; id: string; name: string; description: string; isDeleted: boolean; deletedAt: Date; slug: string; thumbnail: string; ... 13 more ...; imageUrl: string; }' is not assignable to type '{ systemId: SystemId; name: string; parentId?: SystemId; status?: string; isActive?: boolean; path?: string; }'.
    Types of property 'systemId' are incompatible.
      Type 'string' is not assignable to type 'SystemId'.
        Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.

84     hrmCategories: hrmCategories,
       ~~~~~~~~~~~~~

  features/settings/pkgx/hooks/use-category-mapping-validation.ts:14:3
    14   hrmCategories: Array<{
         ~~~~~~~~~~~~~
    The expected type comes from property 'hrmCategories' which is declared here on type 'UseCategoryMappingValidationOptions'

features/settings/pkgx/components/category-mapping-tab.tsx:267:13 - error TS2322: Type 'JsonValue' is not assignable to type '{ pkgx?: { seoKeywords?: string; seoTitle?: string; metaDescription?: string; shortDescription?: string; longDescription?: string; }; }'.
  Type 'string' has no properties in common with type '{ pkgx?: { seoKeywords?: string; seoTitle?: string; metaDescription?: string; shortDescription?: string; longDescription?: string; }; }'.

267             websiteSeo: hrmCategory.websiteSeo,
                ~~~~~~~~~~

  features/settings/pkgx/hooks/use-pkgx-entity-sync.ts:45:3
    45   websiteSeo?: {
         ~~~~~~~~~~
    The expected type comes from property 'websiteSeo' which is declared here on type 'HrmCategoryData'    

features/settings/pkgx/components/category-mapping-tab.tsx:557:9 - error TS2322: Type 'string' is not assignable to type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.

557         hrmCategorySystemId: hrmCategory.systemId,
            ~~~~~~~~~~~~~~~~~~~

  lib/types/prisma-extended.ts:3313:3
    3313   hrmCategorySystemId: SystemId;
           ~~~~~~~~~~~~~~~~~~~
    The expected type comes from property 'hrmCategorySystemId' which is declared here on type 'Partial<PkgxCategoryMapping>'

features/settings/pkgx/components/category-mapping-tab.tsx:572:9 - error TS2322: Type 'string' is not assignable to type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.

572         hrmCategorySystemId: hrmCategory.systemId,
            ~~~~~~~~~~~~~~~~~~~

  lib/types/prisma-extended.ts:3313:3
    3313   hrmCategorySystemId: SystemId;
           ~~~~~~~~~~~~~~~~~~~
    The expected type comes from property 'hrmCategorySystemId' which is declared here on type 'PkgxCategoryMapping'

features/settings/pkgx/components/product-mapping-tab.tsx:356:12 - error TS2304: Cannot find name 'DropdownMenu'.

356           <DropdownMenu>
               ~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:357:14 - error TS2304: Cannot find name 'DropdownMenuTrigger'.

357             <DropdownMenuTrigger asChild>
                 ~~~~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:359:18 - error TS2304: Cannot find name 'MoreHorizontal'.

359                 <MoreHorizontal className="h-4 w-4" />
                     ~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:361:15 - error TS2304: Cannot find name 'DropdownMenuTrigger'.

361             </DropdownMenuTrigger>
                  ~~~~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:362:14 - error TS2304: Cannot find name 'DropdownMenuContent'.

362             <DropdownMenuContent align="end">
                 ~~~~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:366:20 - error TS2304: Cannot find name 'DropdownMenuItem'.

366                   <DropdownMenuItem
                       ~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:373:21 - error TS2304: Cannot find name 'DropdownMenuItem'.

373                   </DropdownMenuItem>
                        ~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:374:20 - error TS2304: Cannot find name 'DropdownMenuSeparator'.

374                   <DropdownMenuSeparator />
                       ~~~~~~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:377:20 - error TS2304: Cannot find name 'DropdownMenuItem'.

377                   <DropdownMenuItem
                       ~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:381:22 - error TS2304: Cannot find name 'FileText'.

381                     <FileText className="h-4 w-4 mr-2" />
                         ~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:383:21 - error TS2304: Cannot find name 'DropdownMenuItem'.

383                   </DropdownMenuItem>
                        ~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:384:20 - error TS2304: Cannot find name 'DropdownMenuItem'.

384                   <DropdownMenuItem
                       ~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:388:22 - error TS2304: Cannot find name 'DollarSign'.

388                     <DollarSign className="h-4 w-4 mr-2" />
                         ~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:390:21 - error TS2304: Cannot find name 'DropdownMenuItem'.

390                   </DropdownMenuItem>
                        ~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:391:20 - error TS2304: Cannot find name 'DropdownMenuItem'.

391                   <DropdownMenuItem
                       ~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:397:21 - error TS2304: Cannot find name 'DropdownMenuItem'.

397                   </DropdownMenuItem>
                        ~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:398:20 - error TS2304: Cannot find name 'DropdownMenuItem'.

398                   <DropdownMenuItem
                       ~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:404:21 - error TS2304: Cannot find name 'DropdownMenuItem'.

404                   </DropdownMenuItem>
                        ~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:405:20 - error TS2304: Cannot find name 'DropdownMenuItem'.

405                   <DropdownMenuItem
                       ~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:409:22 - error TS2304: Cannot find name 'AlignLeft'.

409                     <AlignLeft className="h-4 w-4 mr-2" />
                         ~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:411:21 - error TS2304: Cannot find name 'DropdownMenuItem'.

411                   </DropdownMenuItem>
                        ~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:412:20 - error TS2304: Cannot find name 'DropdownMenuItem'.

412                   <DropdownMenuItem
                       ~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:416:22 - error TS2304: Cannot find name 'Tag'.   

416                     <Tag className="h-4 w-4 mr-2" />
                         ~~~

features/settings/pkgx/components/product-mapping-tab.tsx:418:21 - error TS2304: Cannot find name 'DropdownMenuItem'.

418                   </DropdownMenuItem>
                        ~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:420:20 - error TS2304: Cannot find name 'DropdownMenuSeparator'.

420                   <DropdownMenuSeparator />
                       ~~~~~~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:421:20 - error TS2304: Cannot find name 'DropdownMenuItem'.

421                   <DropdownMenuItem onClick={() => handleViewOnPkgx(row.goods_id)}>
                       ~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:424:21 - error TS2304: Cannot find name 'DropdownMenuItem'.

424                   </DropdownMenuItem>
                        ~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:427:20 - error TS2304: Cannot find name 'DropdownMenuSeparator'.

427                   <DropdownMenuSeparator />
                       ~~~~~~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:428:20 - error TS2304: Cannot find name 'DropdownMenuItem'.

428                   <DropdownMenuItem
                       ~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:438:21 - error TS2304: Cannot find name 'DropdownMenuItem'.

438                   </DropdownMenuItem>
                        ~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:443:20 - error TS2304: Cannot find name 'DropdownMenuItem'.

443                   <DropdownMenuItem onClick={() => handleOpenLinkDialog(row)}>
                       ~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:446:21 - error TS2304: Cannot find name 'DropdownMenuItem'.

446                   </DropdownMenuItem>
                        ~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:449:15 - error TS2304: Cannot find name 'DropdownMenuContent'.

449             </DropdownMenuContent>
                  ~~~~~~~~~~~~~~~~~~~

features/settings/pkgx/components/product-mapping-tab.tsx:450:13 - error TS2304: Cannot find name 'DropdownMenu'.

450           </DropdownMenu>
                ~~~~~~~~~~~~

features/settings/pricing/hooks/use-all-pricing-policies.ts:30:31 - error TS2339: Property 'isDeleted' does not exist on type 'PricingPolicy'.

30     () => data.filter(p => !p.isDeleted && p.isActive !== false),
                                 ~~~~~~~~~

features/settings/store-info/store-info-page.tsx:79:84 - error TS2352: Conversion of type 'Omit<Branch, "systemId">' to type 'Omit<{ systemId: string; createdAt: Date; updatedAt: Date; createdBy: string; updatedBy: string; id: string; name: string; isDefault: boolean; phone: string; managerId: string; isDeleted: boolean; ... 9 more ...; wardCode: string; }, "systemId" | ... 1 more ... | "updatedAt">' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type 'Omit<Branch, "systemId">' is missing the following properties from type 'Omit<{ systemId: string; createdAt: Date; updatedAt: Date; createdBy: string; updatedBy: string; id: string; name: string; isDefault: boolean; phone: string; managerId: string; isDeleted: boolean; ... 9 more ...; wardCode: string; }, "systemId" | ... 1 more ... | "updatedAt">': isDeleted, deletedAt, website, thumbnail

79     const addBranch = (data: Omit<Branch, 'systemId'>) => addBranchMutation.mutate(data as Parameters<typeof addBranchMutation.mutate>[0]);
                                                                                      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

features/settings/store-info/store-info-page.tsx:80:113 - error TS2322: Type 'Partial<Branch>' is not assignable to type 'Partial<{ systemId: string; createdAt: Date; updatedAt: Date; createdBy: string; updatedBy: string; id: string; name: string; isDefault: boolean; phone: string; managerId: string; isDeleted: boolean; ... 9 more ...; wardCode: string; }>'.
  Types of property 'createdAt' are incompatible.
    Type 'string' is not assignable to type 'Date'.

80     const updateBranch = (systemId: SystemId, data: Partial<Branch>) => updateBranchMutation.mutate({ systemId, data });
                                                                                                           
        ~~~~

  features/settings/branches/hooks/use-branches.ts:67:58
    67     mutationFn: ({ systemId, data }: { systemId: string; data: Partial<Branch> }) =>
                                                                ~~~~
    The expected type comes from property 'data' which is declared here on type '{ systemId: string; data: Partial<{ systemId: string; createdAt: Date; updatedAt: Date; createdBy: string; updatedBy: string; id: string; name: string; isDefault: boolean; phone: string; managerId: string; ... 10 more ...; wardCode: string; }>; }'

features/settings/tasks/tasks-settings-page.tsx:540:28 - error TS2304: Cannot find name 'defaultTemplates'.

540     const defaults = clone(defaultTemplates);
                               ~~~~~~~~~~~~~~~~

features/settings/trendtech/components/brand-mapping-tab.tsx:29:51 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.

29     return hrmBrands.filter((b) => !mappedIds.has(b.systemId));
                                                     ~~~~~~~~~~

features/settings/trendtech/components/brand-mapping-tab.tsx:52:7 - error TS2322: Type 'string' is not assignable to type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.

52       hrmBrandSystemId: hrmBrand.systemId,
         ~~~~~~~~~~~~~~~~

  lib/trendtech/types.ts:55:3
    55   hrmBrandSystemId: SystemId;         // Brand systemId trong HRM
         ~~~~~~~~~~~~~~~~
    The expected type comes from property 'hrmBrandSystemId' which is declared here on type 'TrendtechBrandMapping'

features/settings/trendtech/components/category-mapping-tab.tsx:29:55 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.

29     return hrmCategories.filter((c) => !mappedIds.has(c.systemId));
                                                         ~~~~~~~~~~

features/settings/trendtech/components/category-mapping-tab.tsx:52:7 - error TS2322: Type 'string' is not assignable to type 'SystemId'.
  Type 'string' is not assignable to type '{ readonly __brand: "SystemId"; }'.

52       hrmCategorySystemId: hrmCategory.systemId,
         ~~~~~~~~~~~~~~~~~~~

  lib/trendtech/types.ts:44:3
    44   hrmCategorySystemId: SystemId;      // Category systemId trong HRM
         ~~~~~~~~~~~~~~~~~~~
    The expected type comes from property 'hrmCategorySystemId' which is declared here on type 'TrendtechCategoryMapping'

features/warranty/components/dialogs/warranty-cancel-dialog.tsx:116:28 - error TS2304: Cannot find name 'useOrderStore'.

116         const orderStore = useOrderStore.getState();
                               ~~~~~~~~~~~~~

features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx:97:11 - error TS2339: Property 'update' does not exist on type '{ cancel: UseMutationResult<Order, Error, { systemId: string; reason: string; restockItems: boolean; }, unknown>; addPayment: UseMutationResult<Order, Error, { ...; }, unknown>; ... 17 more ...; isLoading: boolean; }'.

97   const { update: updateOrder } = useOrderActions();
             ~~~~~~


Found 89 errors in 26 files.

Errors  Files
     1  app/api/orders/[systemId]/packaging/route.ts:17
     1  app/api/orders/[systemId]/shipment/sync/route.ts:28
     3  app/api/orders/cod-reconciliation/route.ts:29
     7  features/customers/customer-form.tsx:304
     1  features/employees/components/employee-form-old.tsx:13
     1  features/employees/components/employee-form.tsx:13
     1  features/employees/page-tanstack-test.tsx:12
     1  features/employees/page.tsx:9
     1  features/employees/trash-page.tsx:9
     1  features/employees/virtualized-page.tsx:6
     3  features/orders/hooks/use-all-orders.ts:18
     3  features/orders/order-detail-page.tsx:1547
     1  features/products/hooks/use-combo-stock.ts:132
     1  features/products/hooks/use-product-pricing.ts:104
     2  features/purchase-orders/detail-page.tsx:171
     9  features/settings/complaints/complaints-settings-page.tsx:66
     4  features/settings/pkgx/components/brand-mapping-tab.tsx:85
     4  features/settings/pkgx/components/category-mapping-tab.tsx:84
    34  features/settings/pkgx/components/product-mapping-tab.tsx:356
     1  features/settings/pricing/hooks/use-all-pricing-policies.ts:30
     2  features/settings/store-info/store-info-page.tsx:79
     1  features/settings/tasks/tasks-settings-page.tsx:540
     2  features/settings/trendtech/components/brand-mapping-tab.tsx:29
     2  features/settings/trendtech/components/category-mapping-tab.tsx:29
     1  features/warranty/components/dialogs/warranty-cancel-dialog.tsx:116
     1  features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx:97