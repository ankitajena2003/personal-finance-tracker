const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const incomeController = require("../controllers/incomeController");

router.post("/", authMiddleware, incomeController.addIncome);
router.get("/", authMiddleware, incomeController.getIncome);
router.delete("/:id", authMiddleware, incomeController.deleteIncome);

module.exports = router;
