import Joyride from "react-joyride";
import { tours } from "../tours";
import { useTours } from "../hooks/use-editor";

export default function Tour() {
  const { seenTours, disabled } = useTours();

  if (disabled) {
    return null;
  }

  const selectedTour = Object.entries(tours).find(([tourId]) => !seenTours.includes(tourId));
  const [tourId, steps] = selectedTour || [];

  if (tourId && steps) {
    return (
      <Joyride
        steps={steps}
        continuous
        showSkipButton={true}
        locale={{
          back: "Back",
          close: "Close",
          last: "Finish",
          next: "Next",
          nextLabelWithProgress: "Next ({step}/{steps})",
          skip: "Skip tour",
        }}
        styles={{
          buttonNext: {
            backgroundColor: "#7270c6",
            padding: "0.7rem 2rem",
            borderRadius: "0.25rem",
          },
          buttonBack: {
            padding: "0.7rem 2rem",
            backgroundColor: "#EFEFEF",
            borderRadius: "0.25rem",
            color: "#333",
          },
          buttonSkip: {
            padding: "0.7rem 1rem",
            backgroundColor: "#E5E5E5",
            borderRadius: "0.25rem",
            color: "#333",
            width: "auto",
          },
          buttonClose: {
            scale: 0.7,
            borderRadius: "0.25rem",
            padding: "10px",
          },
          tooltip: {
            fontFamily: "inherit",
            padding: "0",
            borderRadius: "0.50rem",
          },
          tooltipFooter: {
            padding: "0.5rem",
            backgroundColor: "#f9f9f9",
            borderTop: "1px solid #e5e5e5",
            borderRadius: "0.5rem",
          },
          tooltipTitle: {
            textAlign: "left",
            fontWeight: "500",
            fontSize: "1.1rem",
            padding: "0.7rem 0.7rem 0 0.7rem",
            fontFamily: "inherit",
          },
          tooltipContent: {
            textAlign: "left",
            padding: "0.8rem",
            fontFamily: "inherit",
            fontSize: "1rem",
          },
        }}
      />
    );
  }

  return null;
}
