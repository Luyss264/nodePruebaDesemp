import { Router } from "express";
import authRoutes from "./auth.routes.js";
import clinicRoutes from "./clinic.routes.js";
import inventoryRoutes from "./inventory.routes.js";
import medicineRoutes from "./medicine.routes.js";
import requestRoutes from "./request.routes.js";
import seedRoutes from "./seed.routes.js";
import warehouseRoutes from "./warehouse.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/clinics", clinicRoutes);
router.use("/warehouses", warehouseRoutes);
router.use("/medicines", medicineRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/requests", requestRoutes);
router.use("/seed", seedRoutes);

export default router;
