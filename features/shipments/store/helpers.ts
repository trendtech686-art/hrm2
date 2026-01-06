/**
 * Shipment Store - Helpers
 * ID generation and utility functions
 * 
 * @module features/shipments/store/helpers
 */

import type { SystemId, BusinessId } from '../../../lib/id-types';
import { generateSystemId, generateBusinessId, getMaxSystemIdCounter, getMaxBusinessIdCounter } from '../../../lib/id-utils';
import type { Shipment } from './types';

const SHIPMENT_SYSTEM_ID_PREFIX = 'SHIPMENT';
const SHIPMENT_BUSINESS_ID_PREFIX = 'VC';

let shipmentSystemIdCounter = 0;
let shipmentBusinessIdCounter = 0;

/**
 * Initialize counters from existing data
 */
export function initCounters(shipments: Shipment[]) {
    shipmentSystemIdCounter = getMaxSystemIdCounter(shipments, SHIPMENT_SYSTEM_ID_PREFIX);
    shipmentBusinessIdCounter = getMaxBusinessIdCounter(shipments, SHIPMENT_BUSINESS_ID_PREFIX);
}

/**
 * Get next system ID for shipment
 */
export function getNextShipmentSystemId(): SystemId {
    shipmentSystemIdCounter++;
    return generateSystemId('shipments', shipmentSystemIdCounter) as SystemId;
}

/**
 * Get next business ID for shipment
 */
export function getNextShipmentBusinessId(): BusinessId {
    shipmentBusinessIdCounter++;
    return generateBusinessId('shipments', shipmentBusinessIdCounter) as BusinessId;
}
