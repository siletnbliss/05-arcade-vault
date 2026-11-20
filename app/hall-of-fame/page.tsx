import { HallOfFame } from "@/components/hall-of-fame";
import { GAMES } from "@/lib/games";

export default function HallOfFamePage() {
  return <HallOfFame games={GAMES} />;
}
