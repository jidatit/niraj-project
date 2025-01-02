import React from "react";

const ClientNotesView = ({ notes }) => {
  if (!notes || notes.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col justify-start items-start gap-3">
      <h1 className="font-bold underline text-[20px]">Notes:</h1>
      <div className="w-full flex flex-col text-[16px] font-normal justify-start items-start gap-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="w-full flex flex-col justify-start items-start gap-1"
          >
            {/* <p>
              <span className="font-medium">Author: </span>
              {note.author}
            </p> */}
            {/* <p>
              <span className="font-medium">Date: </span>
              {new Date(note.timestamp).toLocaleString()}
            </p> */}
            <p className="whitespace-pre-wrap">{note.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientNotesView;
