import * as React from "react";
import { useSettingsPageHeader } from "../use-settings-page-header";
import { useTabActionRegistry } from "../use-tab-action-registry";
import { SettingsVerticalTabs } from "../../../components/settings/SettingsVerticalTabs";
import { TabsContent } from "../../../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { PricingPolicyContent } from "./pricing-policy-content";
import { TaxContent } from "./tax-content";

export function PricingSettingsPage() {
    const [activeTab, setActiveTab] = React.useState('pricing-policy');
    const { headerActions, registerActions } = useTabActionRegistry(activeTab);
    
    const registerPricingActions = React.useMemo(() => registerActions('pricing-policy'), [registerActions]);
    const registerTaxActions = React.useMemo(() => registerActions('tax'), [registerActions]);

    useSettingsPageHeader({
        title: 'Giá & Thuế',
        subtitle: 'Quản lý chính sách giá và các loại thuế',
        actions: headerActions,
    });

    const tabs = React.useMemo(
        () => [
            { value: 'pricing-policy', label: 'Chính sách giá' },
            { value: 'tax', label: 'Thuế' },
        ],
        [],
    );

    return (
        <SettingsVerticalTabs value={activeTab} onValueChange={setActiveTab} tabs={tabs}>
            <TabsContent value="pricing-policy" className="mt-0">
                <Card>
                    <CardHeader>
                        <CardTitle>Chính sách giá</CardTitle>
                        <CardDescription>
                            Quản lý các loại giá áp dụng cho việc bán hàng và nhập hàng
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PricingPolicyContent
                            isActive={activeTab === 'pricing-policy'}
                            onRegisterActions={registerPricingActions}
                        />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="tax" className="mt-0">
                <Card>
                    <CardHeader>
                        <CardTitle>Thuế</CardTitle>
                        <CardDescription>
                            Quản lý các loại thuế áp dụng cho nhập hàng và bán hàng (VAT, thuế GTGT...)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TaxContent
                            isActive={activeTab === 'tax'}
                            onRegisterActions={registerTaxActions}
                        />
                    </CardContent>
                </Card>
            </TabsContent>
        </SettingsVerticalTabs>
    );
}
