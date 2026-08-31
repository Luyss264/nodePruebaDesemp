import { Clinic } from "./clinic.model.js";
import { Inventory } from "./inventory.model.js";
import { Medicine } from "./medicine.model.js";
import { SupplyRequest } from "./supplyRequest.model.js";
import { User } from "./user.model.js";
import { Warehouse } from "./warehouse.model.js";

Warehouse.hasMany(Inventory, { foreignKey: "warehouseId" });
Inventory.belongsTo(Warehouse, { foreignKey: "warehouseId" });
Medicine.hasMany(Inventory, { foreignKey: "medicineId" });
Inventory.belongsTo(Medicine, { foreignKey: "medicineId" });
Clinic.hasMany(SupplyRequest, { foreignKey: "clinicId" });
SupplyRequest.belongsTo(Clinic, { foreignKey: "clinicId" });
Medicine.hasMany(SupplyRequest, { foreignKey: "medicineId" });
SupplyRequest.belongsTo(Medicine, { foreignKey: "medicineId" });
Warehouse.hasMany(SupplyRequest, { foreignKey: "warehouseId" });
SupplyRequest.belongsTo(Warehouse, { foreignKey: "warehouseId" });

export { User, Clinic, Warehouse, Medicine, Inventory, SupplyRequest };
