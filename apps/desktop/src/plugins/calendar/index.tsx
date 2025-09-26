import { useMemo } from "react";

const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function generateMonthGrid(): Array<{ day: string; date: number }> {
    const totalDays = 30;
    return Array.from({ length: totalDays }, (_, idx) => ({ day: days[idx % days.length], date: idx + 1 }));
}

export default function CalendarPlugin() {
    const month = useMemo(generateMonthGrid, []);

    return (
        <div className="space-y-4">
            <header className="flex items-baseline justify-between">
                <h2 className="text-lg font-semibold text-foreground">Calendrier d'exemple</h2>
                <span className="text-xs uppercase text-muted-foreground">Mois simulé</span>
            </header>
            <div className="grid grid-cols-7 gap-2 text-sm">
                {month.map(({ day, date }) => (
                    <div key={`${day}-${date}`} className="rounded-md border border-border bg-card p-2 text-center">
                        <div className="text-xs text-muted-foreground">{day}</div>
                        <div className="text-base font-medium text-foreground">{date}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
