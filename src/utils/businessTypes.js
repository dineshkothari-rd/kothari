export const businessTypes = {
  pg: {
    id: "pg",
    label: "PG",
    customerLabel: "Tenant",
    unitLabel: "Room",
    feeLabel: "Monthly Rent",
    dateInLabel: "Move In",
    dateOutLabel: "Move Out",
    services: ["WiFi", "Meals", "Laundry", "Parking", "AC", "Power Backup"],
  },
  hotel: {
    id: "hotel",
    label: "Hotel",
    customerLabel: "Guest",
    unitLabel: "Room",
    feeLabel: "Stay Charge",
    dateInLabel: "Check In",
    dateOutLabel: "Check Out",
    services: ["WiFi", "Breakfast", "Housekeeping", "Parking", "AC", "Room Service"],
  },
  library: {
    id: "library",
    label: "Library",
    customerLabel: "Member",
    unitLabel: "Seat",
    feeLabel: "Membership Fee",
    dateInLabel: "Start Date",
    dateOutLabel: "End Date",
    services: ["WiFi", "Locker", "AC", "Power Backup", "Quiet Zone", "Reserved Seat"],
  },
};

export const businessTypeOptions = Object.values(businessTypes);

export function getBusinessType(type) {
  return businessTypes[type] || businessTypes.pg;
}

export function getBusinessTypeLabel(type) {
  return getBusinessType(type).label;
}
