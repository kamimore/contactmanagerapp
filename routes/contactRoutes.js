const express = require("express");
const router = express.Router();
const {
  getContacts,
  getContact,
  updateContact,
  deleteContact,
  createContact,
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken)
router.route("/").get(getContacts).post(createContact);

router.route("/:id").put(updateContact).get(getContact);

router.route("/:id").delete(deleteContact);

module.exports = router;
