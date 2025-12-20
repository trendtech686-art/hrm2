import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { FormField, FormItem, FormControl } from '../../../components/ui/form';
import { Textarea } from '../../../components/ui/textarea';

export function OrderNotes({ disabled }: { disabled?: boolean }) {
    const { control } = useFormContext();
    return (
        <Card>
            <CardHeader><CardTitle className="text-base font-semibold">Ghi chú đơn hàng</CardTitle></CardHeader>
            <CardContent>
                <FormField control={control} name="notes" render={({ field }) => (
                    <FormItem>
                        <FormControl><Textarea placeholder="VD: Hàng tặng gói riêng" {...field} rows={12} disabled={disabled} /></FormControl>
                    </FormItem>
                )}/>
            </CardContent>
        </Card>
    );
}
