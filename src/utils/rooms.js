export const roomNumbers = Array.from({ length: 15 }, (_, index) =>
  String(index + 1).padStart(2, "0"),
);

export const bedLabels = ["Bed A", "Bed B"];

export function getRoomOptions(roomType = "single") {
  if (roomType === "double") {
    return roomNumbers.map((room) => ({
      value: `Room ${room} - Full Room`,
      label: `Room ${room} - Double Room`,
      room,
      bed: "Full Room",
    }));
  }

  return roomNumbers.flatMap((room) =>
    bedLabels.map((bed) => ({
      value: `Room ${room} - ${bed}`,
      label: `Room ${room} - ${bed}`,
      room,
      bed,
    })),
  );
}

export function getRoomInventory() {
  return roomNumbers.map((room) => ({
    room,
    beds: bedLabels,
  }));
}

export function parseRoomLabel(value = "") {
  const text = String(value || "");
  const roomMatch = text.match(/Room\s+(\d+)/i);
  const legacyRoomMatch = text.match(/^(\d{1,3})\b/);
  const rawRoom = roomMatch?.[1] || legacyRoomMatch?.[1] || "";
  const room = rawRoom ? rawRoom.slice(-2).padStart(2, "0") : "";
  const bed = text.includes("Bed A")
    ? "Bed A"
    : text.includes("Bed B")
      ? "Bed B"
      : /Full Room|Double Room|Single/i.test(text)
        ? "Full Room"
        : "";

  return { room, bed };
}

export function isRoomCustomer(customer) {
  const businessType = customer.businessType || "pg";
  if (!["pg", "hotel"].includes(businessType)) return false;
  const status = String(customer.status || "active").toLowerCase();
  const activeStatuses = ["active", "booked", "checked in", "occupied"];
  if (!activeStatuses.includes(status)) return false;

  if (customer.moveOutDate) {
    const moveOut = new Date(customer.moveOutDate);
    if (!Number.isNaN(moveOut.getTime()) && moveOut < new Date()) return false;
  }

  return Boolean(parseRoomLabel(customer.room).room);
}

export function getAvailableRoomOptions(
  customers = [],
  roomType = "single",
  currentCustomerId = "",
) {
  const activeCustomers = customers.filter(
    (customer) => isRoomCustomer(customer) && customer.id !== currentCustomerId,
  );

  return getRoomOptions(roomType).filter((option) => {
    const occupants = activeCustomers
      .map((customer) => parseRoomLabel(customer.room))
      .filter((parsed) => parsed.room === option.room);

    const hasFullRoom = occupants.some((parsed) => parsed.bed === "Full Room");
    const occupiedBeds = occupants
      .filter((parsed) => parsed.bed === "Bed A" || parsed.bed === "Bed B")
      .map((parsed) => parsed.bed);

    if (option.bed === "Full Room") {
      return !hasFullRoom && occupiedBeds.length === 0;
    }

    return !hasFullRoom && !occupiedBeds.includes(option.bed);
  });
}
