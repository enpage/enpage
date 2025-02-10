import Joyride from "react-joyride";
import { tours } from "../tours";
import { useSeenTours } from "../hooks/use-editor";

export default function Tour() {
  const seenTours = useSeenTours();
  const selectedTour = Object.entries(tours).find(([tourId]) => !seenTours.includes(tourId));
  const [tourId, steps] = selectedTour || [];

  if (tourId && steps) {
    return <Joyride steps={steps} />;
  }

  return null;
}
