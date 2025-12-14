import type { OrderAddress } from './types.ts';

export const formatOrderAddress = (address?: string | OrderAddress | null): string => {
    if (!address) return '';
    if (typeof address === 'string') {
        return address;
    }

    if (address.formattedAddress) {
        return address.formattedAddress;
    }

    return [
        address.street,
        address.ward,
        address.district,
        address.province
    ].filter(Boolean).join(', ');
};

const hasAddressValue = (value?: string | null) => typeof value === 'string' && value.trim().length > 0;

export const cloneOrderAddress = (address?: any | null): OrderAddress | undefined => {
    if (!address) return undefined;

    if (typeof address === 'string') {
        const normalized = address.trim();
        return normalized ? { street: normalized, formattedAddress: normalized } : undefined;
    }

    if (typeof address !== 'object') {
        return undefined;
    }

    const snapshot: OrderAddress = {
        street: address.street,
        ward: address.ward,
        district: address.district,
        province: address.province,
        contactName: address.contactName,
        company: address.company,
        note: address.note ?? address.notes,
        id: address.id,
        label: address.label,
        provinceId: address.provinceId,
        districtId: address.districtId,
        wardId: address.wardId,
    };

    const phoneValue = address.phone ?? address.contactPhone;
    if (hasAddressValue(phoneValue)) {
        snapshot.phone = phoneValue;
        snapshot.contactPhone = phoneValue;
    }

    const formatted = formatOrderAddress(snapshot);
    if (hasAddressValue(formatted)) {
        snapshot.formattedAddress = formatted;
    } else if (hasAddressValue(address.formattedAddress)) {
        snapshot.formattedAddress = address.formattedAddress;
    }

    return snapshot;
};
