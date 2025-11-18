/**
 * ShippingCard Component
 * Reusable shipping section with address editing capability
 * Used in: OrderFormPage, SalesReturnFormPage
 */

import * as React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { ShippingIntegration } from './shipping-integration';
import { CustomerAddressSelector } from './customer-address-selector';
import type { Customer } from '../../customers/types';

interface ShippingCardProps {
  /**
   * Hide the shipping card completely
   */
  hidden?: boolean;
  
  /**
   * Customer object (optional - if not provided, will be watched from form)
   */
  customer?: Customer | null;
}

/**
 * Shipping card with integrated address selector
 * Manages both ShippingIntegration display and address selection dialog
 */
export function ShippingCard({ hidden = false, customer: customerProp }: ShippingCardProps) {
  const { control } = useFormContext<any>();
  
  // Use customer from props if provided, otherwise watch from form
  const customerFromForm = useWatch({ control, name: 'customer' }) as Customer | null;
  const customer = customerProp !== undefined ? customerProp : customerFromForm;
  
  const [isAddressDialogOpen, setIsAddressDialogOpen] = React.useState(false);

  /**
   * Handler for "Thay đổi" button in delivery address section
   * Opens address selector dialog with customer's addresses
   */
  const handleChangeDeliveryAddress = () => {
    console.log('🔵 [ShippingCard] Opening address selector dialog, customer:', customer);
    if (!customer) {
      console.warn('⚠️ [ShippingCard] No customer available');
      return;
    }
    setIsAddressDialogOpen(true);
  };

  if (hidden) return null;

  return (
    <>
      <ShippingIntegration 
        onChangeDeliveryAddress={handleChangeDeliveryAddress}
        customer={customer}
      />
      
      {/* Address selector dialog - only visible when customer is selected */}
      {customer && (
        <CustomerAddressSelector
          customer={customer}
          dialogOpen={isAddressDialogOpen}
          onDialogOpenChange={setIsAddressDialogOpen}
          hideCards={true}
          addressType="shipping"
        />
      )}
    </>
  );
}
