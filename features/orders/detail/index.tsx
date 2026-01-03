// Re-export all components from detail folder
export * from './types';
export * from './status-stepper';
export * from './payment-dialog';
export * from './create-shipment-dialog';
export * from './packer-selection-dialog';
export * from './order-history-tab';
export * from './product-info-card';
export * from './product-thumbnail-cell';
export * from './return-history-tab';

// Re-export main page component from components folder (still the main file)
// TODO: Move main component here after refactoring
export { OrderDetailPage } from '../components/order-detail-page';
