import { useState } from "react";

type Note = {
    id: number;
    title: string;
    body: string;
};

const initialNotes: Note[] = [
    { id: 1, title: "Idées", body: "Lister les problématiques clients à explorer." },
    { id: 2, title: "Roadmap", body: "Stabiliser l'app desktop avant d'ajouter le scan des plugins." },
];

export default function NotesPlugin() {
    const [notes] = useState(initialNotes);

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Bloc-notes de démonstration. Les notes sont stockées en mémoire.
            </p>
            <ul className="grid gap-3">
                {notes.map((note) => (
                    <li key={note.id} className="rounded-md border border-border bg-card p-3 shadow-sm">
                        <h3 className="text-sm font-semibold text-foreground">{note.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{note.body}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
