import { formatDate } from "../../utils/adminActions";
import { getBusinessType } from "../../utils/businessTypes";
import { Panel, SimpleTable } from "./AdminFeatureUI";

export default function LibraryCenter({ tenants }) {
  const members = tenants.filter((tenant) => tenant.businessType === "library");

  return (
    <div className="grid grid-cols-1 gap-6">
      <Panel
        title="Library Members"
        subtitle="Keep this simple: add library members from Customers with business type Library."
      >
        <SimpleTable
          headers={["Member", "Seat", "Fee", "Start", "End", "Services"]}
          emptyText="No library members yet. Add one from Customers."
          rows={members.map((member) => ({
            key: member.id,
            cells: [
              member.name,
              member.room || "-",
              `₹${(Number(member.rent) || 0).toLocaleString("en-IN")}`,
              formatDate(member.moveInDate),
              formatDate(member.moveOutDate),
              member.services?.join(", ") || getBusinessType("library").label,
            ],
          }))}
        />
      </Panel>
    </div>
  );
}
