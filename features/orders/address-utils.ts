import type { OrderAddress } from '@/lib/types/prisma-extended';

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

export const cloneOrderAddress = (address?: unknown): OrderAddress | undefined => {
    if (!address) return undefined;

    if (typeof address === 'string') {
        const normalized = address.trim();
        return normalized ? { street: normalized, formattedAddress: normalized } : undefined;
    }

    if (typeof address !== 'object' || address === null) {
        return undefined;
    }

    const addr = address as Record<string, unknown>;

    const snapshot: OrderAddress = {
        street: addr.street as string | undefined,
        ward: addr.ward as string | undefined,
        district: addr.district as string | undefined,
        province: addr.province as string | undefined,
        contactName: addr.contactName as string | undefined,
        company: addr.company as string | undefined,
        note: (addr.note ?? addr.notes) as string | undefined,
        id: addr.id as string | undefined,
        label: addr.label as string | undefined,
        provinceId: addr.provinceId ? String(addr.provinceId) : undefined,
        districtId: addr.districtId as number | string | undefined,
        wardId: addr.wardId as string | undefined,
    };

    const phoneValue = (addr.phone ?? addr.contactPhone) as string | undefined;
    if (hasAddressValue(phoneValue)) {
        snapshot.phone = phoneValue;
        snapshot.contactPhone = phoneValue;
    }

    const formatted = formatOrderAddress(snapshot);
    if (hasAddressValue(formatted)) {
        snapshot.formattedAddress = formatted;
    } else if (hasAddressValue((address as { formattedAddress?: string }).formattedAddress)) {
        snapshot.formattedAddress = (address as { formattedAddress: string }).formattedAddress;
    }

    return snapshot;
};
