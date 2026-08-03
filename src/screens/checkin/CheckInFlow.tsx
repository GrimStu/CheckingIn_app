import React from 'react';
import { WheelLayer1, WheelLayer2, WheelLayer3 } from './WheelSteps';
import { ConfirmStep } from './ConfirmStep';
import { BodyIntroStep, BodyMapStep } from './BodyScreens';
import { JournalStep } from './JournalStep';
import { DoneStep } from './DoneStep';
import { useNav } from '../../store/NavContext';

export function CheckInFlow() {
  const { checkinStep } = useNav();

  switch (checkinStep) {
    case 'wheel1':
      return <WheelLayer1 />;
    case 'wheel2':
      return <WheelLayer2 />;
    case 'wheel3':
      return <WheelLayer3 />;
    case 'confirm':
      return <ConfirmStep />;
    case 'bodyIntro':
      return <BodyIntroStep />;
    case 'body':
      return <BodyMapStep />;
    case 'journal':
      return <JournalStep />;
    case 'done':
      return <DoneStep />;
    default:
      return <WheelLayer1 />;
  }
}
