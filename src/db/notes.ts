interface Note {
    id: string;
    userId: string;
    author: string;
    bgColor: string;
    text: string;
    placement: {
        x: number;
        y: number;
    };
}

const notes: Note[] = [];

const getNotes = () => {
    return notes;
};

const getNote = (id: string) => {
    return notes.find((note) => note.id === id);
};
const addNote = (note: Note) => {
    notes.push(note);
    return note;
};

const updateNote = (note: Note) => {
    const index = notes.findIndex((n) => n.id === note.id);
    if (index === -1) return;
    return (notes[index] = note);
};

export default {
    getNotes,
    getNote,
    addNote,
    updateNote
};
