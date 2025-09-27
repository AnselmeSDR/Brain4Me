import {PuzzlePieceIcon, SparklesIcon, DocumentTextIcon, CalendarDaysIcon, BeakerIcon} from "@heroicons/react/24/outline";
import {cn} from "@/lib/utils";

const iconMap = {
    SparklesIcon,
    DocumentTextIcon,
    CalendarDaysIcon,
    BeakerIcon,
    PuzzlePieceIcon,
} satisfies Record<string, typeof PuzzlePieceIcon>;

export function PluginIcon({icon, className}: {icon?: string; className?: string}) {
    const IconComponent = icon && iconMap[icon as keyof typeof iconMap] ? iconMap[icon as keyof typeof iconMap] : PuzzlePieceIcon;
    return <IconComponent aria-hidden className={cn("h-5 w-5", className)} />;
}
