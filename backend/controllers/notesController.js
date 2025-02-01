const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");


const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().select().lean();
    if (!notes?.length) {
        return res.status(400).json({ message: "No notes found!" });
    }

    return res.status(200).json(notes);
})

const createNewNote = asyncHandler(async (req, res) => {
    const { user, title, text, completed } = req.body;

    // Check all fields
    if(!user || !title || !text || typeof completed !== "boolean") {
        return res.status(400).json({message: "All fields are required"});
    }

    // Check if exist by title
    const duplicate = await Note.findOne({title}).lean().exec();
    if(duplicate) {
        return res.status(401).json({message: "Note with provided title already exist"})
    }
    const noteObject = {user, title, text, completed};

    const note = Note.create(noteObject);

    if(note) {
        return res.status(200).json({message: `Note "${title}" created`});
    } else {
        return res.status(400).json({message: "Invalid note data recieved"});
    }
})

const updateNote = asyncHandler(async (req,res) => {
    const { id, user, title, text, completed } = req.body;

    if(!id || !user || !title || !text || typeof completed !== "boolean") {
        return res.status(400).json("All fields are required");
    }

    const note = await Note.findById(id).exec();
    if(!note) {
        return res.status(400).json({message: "Note does not exist"})
    }

    note.title = title;
    note.text = text;
    note.completed = completed;

    const updatedNote = await note.save();
    return res.status(200).json({message: `Note "${updatedNote.title}" updated`});
})

const deleteNote = asyncHandler(async (req,res) => {
    const {id} = req.body;

    if(!id) {
        return res.status(400).json({message: "Note ID required"});
    }

    const note = await Note.findById(id).exec();
    if(!note) {
        return res.status(400).json({message: "Note not exist"});
    }
    const deletedNote = await Note.findOneAndDelete({ _id: note._id });
    res.json(`Note ${deletedNote._id} deleted`)

})

module.exports = {
    getAllNotes,
    createNewNote, 
    updateNote,
    deleteNote
}