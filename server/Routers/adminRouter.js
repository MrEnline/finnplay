const Router = require("express");
const adminController = require("../Controllers/adminController");
const router = Router();

router.get("/getData", adminController.getData);
router.delete("/deleteGroup", adminController.deleteGroup);
router.post("/editGroup", adminController.editGroup);
router.post("/addGroup", adminController.addGroup);

module.exports = router;
