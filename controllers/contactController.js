const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

const getContacts = async (req, res) => {
  const contacts = await Contact.find({user_id: req.user.id});
  res.status(200).json(contacts);
};

const createContact = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("all fields are mandatory");
  }

  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id : req.user.id,
  });

  res.status(200).json({ "message": "contact created successfully", "contact":contact });
});

const getContact = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const contact = await Contact.findById(id);
  if(!contact){
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json({ "message": `get contact for ${req.params.id}`,"contact":contact });
});

const updateContact = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const contact = await Contact.findById(id);
  if(!contact){
    res.status(404);
    throw new Error("Contact not found");
  }

  if(contact.user_id.toString() !== req.user.id){
    res.status(403);
    throw new Error("User don't have permission to update other user contacts");
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    id, req.body,{ new: true}
  )
  res.status(200).json({ message: `update contact for ${req.params.id}`, contact: updatedContact });
});

const deleteContact = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const contact = await Contact.findById(id);
  if(!contact){
    res.status(404);
    throw new Error("Contact not found");
  }
  
  if(contact.user_id.toString() !== req.user.id){
    res.status(403);
    throw new Error("User don't have permission to update other user contacts");
  }

  await Contact.findOneAndRemove(id);
  res.status(200).json({ message: `delete contact for ${req.params.id}` });
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
