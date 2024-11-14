import React, { useEffect, useState } from "react";

interface GamepadState {
  supported: boolean;
  ticking: boolean;
  gamepads: (Gamepad | null)[];
  SHOULDER0_BUTTON_THRESHOLD: number;
  SHOULDER1_BUTTON_THRESHOLD: number;
  LEFT_AXIS_THRESHOLD: number;
  RIGHT_AXIS_THRESHOLD: number;
}

const GamepadComponent: React.FC = () => {
  const [gamepadState, setGamepadState] = useState<GamepadState>({
    supported: false,
    ticking: false,
    gamepads: [],
    SHOULDER0_BUTTON_THRESHOLD: 0.5,
    SHOULDER1_BUTTON_THRESHOLD: 30.0 / 255.0,
    LEFT_AXIS_THRESHOLD: 8689 / 32767.0,
    RIGHT_AXIS_THRESHOLD: 7849.0 / 32767.0,
  });

  useEffect(() => {
    const handleGamepadConnect = (event: Event) => {
      const connectedGamepad = (event as GamepadEvent).gamepad;
      const updatedGamepads = [...gamepadState.gamepads];
      updatedGamepads[connectedGamepad.index] = connectedGamepad;
      console.log("Connected Gamepad");
      setGamepadState((prevState) => ({
        ...prevState,
        gamepads: updatedGamepads,
        ticking: true,
      }));
    };

    const handleGamepadDisconnect = (event: Event) => {
      const disconnectedGamepad = (event as GamepadEvent).gamepad;
      const updatedGamepads = [...gamepadState.gamepads];
      updatedGamepads[disconnectedGamepad.index] = null;
      console.log("Disconnected Gamepad");

      setGamepadState((prevState) => ({
        ...prevState,
        gamepads: updatedGamepads,
        ticking: updatedGamepads.filter(Boolean).length > 0,
      }));
    };

    window.addEventListener("gamepadconnected", handleGamepadConnect);
    window.addEventListener("gamepaddisconnected", handleGamepadDisconnect);

    return () => {
      window.removeEventListener("gamepadconnected", handleGamepadConnect);
      window.removeEventListener(
        "gamepaddisconnected",
        handleGamepadDisconnect
      );
    };
  }, [gamepadState.gamepads]);

  useEffect(() => {
    const tick = () => {
      pollStatus();
      if (gamepadState.ticking) {
        window.requestAnimationFrame(tick);
      }
    };

    if (gamepadState.ticking) {
      tick();
    }

    return () => {
      setGamepadState((prevState) => ({
        ...prevState,
        ticking: false,
      }));
    };
  }, [gamepadState.ticking]);

  const pollStatus = () => {
    const rawGamepads = navigator.getGamepads();
    const updatedGamepads = [...gamepadState.gamepads];

    if (rawGamepads) {
      for (let i = 0; i < rawGamepads.length; i++) {
        if (rawGamepads[i]) {
          updatedGamepads[i] = rawGamepads[i];
        }
      }
    }

    setGamepadState((prevState) => ({
      ...prevState,
      gamepads: updatedGamepads,
    }));
  };

  const pressed = (pad: number, buttonId: string) => {
    const gamepad = gamepadState.gamepads[pad];
    if (gamepad) {
      const buttonIndex = BUTTONS[buttonId as keyof typeof BUTTONS];
      if (buttonIndex === 4 || buttonIndex === 5) {
        return (
          gamepad.buttons[buttonIndex].value > gamepadState.SHOULDER0_BUTTON_THRESHOLD
        );
      } else if (buttonIndex === 6 || buttonIndex === 7) {
        return (
          gamepad.buttons[buttonIndex].value > gamepadState.SHOULDER1_BUTTON_THRESHOLD
        );
      } else {
        return gamepad.buttons[buttonIndex].value > 0.5;
      }
    } else {
      return false;
    }
  };

  const moved = (pad: number, axisId: string) => {
    const gamepad = gamepadState.gamepads[pad];
    console.log(gamepad);
    if (gamepad) {
      if (axisId === "LEFT_X") {
        if (
          gamepad.axes[0] < -gamepadState.LEFT_AXIS_THRESHOLD ||
          gamepad.axes[0] > gamepadState.LEFT_AXIS_THRESHOLD
        ) {
          return gamepad.axes[0];
        }
      } else if (axisId === "LEFT_Y") {
        if (
          gamepad.axes[1] < -gamepadState.LEFT_AXIS_THRESHOLD ||
          gamepad.axes[1] > gamepadState.LEFT_AXIS_THRESHOLD
        ) {
          return gamepad.axes[1];
        }
      } else if (axisId === "RIGHT_X") {
        if (
          gamepad.axes[2] < -gamepadState.RIGHT_AXIS_THRESHOLD ||
          gamepad.axes[2] > gamepadState.RIGHT_AXIS_THRESHOLD
        ) {
          return gamepad.axes[2];
        }
      } else if (axisId === "RIGHT_Y") {
        if (
          gamepad.axes[3] < -gamepadState.RIGHT_AXIS_THRESHOLD ||
          gamepad.axes[3] > gamepadState.RIGHT_AXIS_THRESHOLD
        ) {
          return gamepad.axes[3];
        }
      }
    }
    return 0;
  };

  const BUTTONS = {
    FACE_1: 0,
    FACE_2: 1,
    FACE_3: 2,
    FACE_4: 3,
    LEFT_SHOULDER: 4,
    RIGHT_SHOULDER: 5,
    LEFT_SHOULDER_BOTTOM: 6,
    RIGHT_SHOULDER_BOTTOM: 7,
    SELECT: 8,
    START: 9,
    LEFT_ANALOGUE_STICK: 10,
    RIGHT_ANALOGUE_STICK: 11,
    PAD_UP: 12,
    PAD_DOWN: 13,
    PAD_LEFT: 14,
    PAD_RIGHT: 15,
    CENTER_BUTTON: 16,
  };

  return (
    <div>
      {gamepadState.gamepads.map((gamepad, index) => (
        <div key={index}>
          Gamepad {index}: {gamepad ? "Connected" : "Disconnected"}
        </div>
      ))}
    </div>
  );
};

export default GamepadComponent;
