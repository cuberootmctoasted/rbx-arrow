import { useMotion, usePrevious } from "@rbxts/pretty-react-hooks";
import React, { useBinding, useEffect, useState } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { useComponent } from "client/hooks/useComponent";
import { useKeypoints } from "client/hooks/useKeypoints";
import { usePlayerEntity } from "client/hooks/usePlayerEntity";
import { useRoundSystem } from "client/hooks/useRoundSystem";
import { BG_1, FG_1, FONT_1 } from "shared/constants/themes";
import { CInRound } from "shared/covenant/components/_list";
import { syncedTime } from "shared/utils/syncedTime";
import { totalSecondsToMinutesSecondDisplay } from "shared/utils/time";

export function RoundTimer() {
    const roundSystem = useRoundSystem();
    const [secondsLeft, setSecondsLeft] = useBinding(0);

    const playerEntity = usePlayerEntity();
    const inRound = useComponent(playerEntity, CInRound);
    const previousInRound = usePrevious(inRound);

    useEffect(() => {
        if (roundSystem?.intermissionEnd !== undefined) {
            const connection = RunService.Heartbeat.Connect(() => {
                setSecondsLeft(roundSystem.intermissionEnd! - syncedTime());
            });
            return () => {
                connection.Disconnect();
            };
        }
        if (roundSystem?.roundEnd !== undefined) {
            const connection = RunService.Heartbeat.Connect(() => {
                setSecondsLeft(roundSystem.roundEnd! - syncedTime());
            });
            return () => {
                connection.Disconnect();
            };
        }
    }, [roundSystem]);

    const [bottonBlackScreenPosition, bottonBlackScreenPositionApi] = useMotion(
        new UDim2(0.5, 0, 1, 0),
    );
    const [topBlackScreenPosition, topBlackScreenPositionApi] = useMotion(new UDim2(0.5, 0, 0, 0));

    const [roundEndScreenTransparency, roundEndScreenTransparencyApi] = useMotion(1);

    const [quqRoundPosition, quqRoundPositionApi] = useMotion(new UDim2(-0.5, 0, 0.5, 0));
    const [quqStartPosition, quqStartPositionApi] = useMotion(new UDim2(1.5, 0, 0.5, 0));

    useKeypoints(
        previousInRound !== undefined && roundSystem?.loadingIntermission === true,
        () => {},
        [
            [
                0,
                () => {
                    roundEndScreenTransparencyApi.immediate(0);
                },
            ],
        ],
    );

    useKeypoints(
        previousInRound !== undefined && roundSystem?.intermissionEnd !== undefined,
        () => {},
        [
            [
                0,
                () => {
                    roundEndScreenTransparencyApi.spring(1);
                },
            ],
        ],
    );

    useKeypoints(inRound !== undefined && roundSystem?.loadingRound === true, () => {}, [
        [
            0,
            () => {
                // all black
                bottonBlackScreenPositionApi.immediate(new UDim2(0.5, 0, 0.5, 0));
                topBlackScreenPositionApi.immediate(new UDim2(0.5, 0, 0.5, 0));
            },
        ],
    ]);

    useKeypoints(inRound !== undefined && roundSystem?.roundEnd !== undefined, () => {}, [
        [
            0,
            () => {
                quqRoundPositionApi.immediate(new UDim2(-0.5, 0, 0.5, 0));
                quqStartPositionApi.immediate(new UDim2(1.5, 0, 0.5, 0));
            },
        ],
        [
            0.1,
            () => {
                // round...
                quqRoundPositionApi.spring(new UDim2(0.5, 0, 0.5, 0));
            },
        ],
        [
            0.5,
            () => {
                // ...start
                quqStartPositionApi.spring(new UDim2(0.5, 0, 0.5, 0));
            },
        ],
        [
            1,
            () => {
                // title go away
                quqRoundPositionApi.spring(new UDim2(1.5, 0, 0.5, 0));
                quqStartPositionApi.spring(new UDim2(-0.5, 0, 0.5, 0));
            },
        ],
        [
            0.5,
            () => {
                // open black screen
                bottonBlackScreenPositionApi.spring(new UDim2(0.5, 0, 1, 0));
                topBlackScreenPositionApi.spring(new UDim2(0.5, 0, 0, 0));
            },
        ],
    ]);

    return (
        <>
            <frame
                key={"TopBlackScreen"}
                BorderSizePixel={0}
                BackgroundColor3={BG_1}
                Position={topBlackScreenPosition}
                AnchorPoint={new Vector2(0.5, 1)}
                Size={new UDim2(5, 0, 5, 0)}
            ></frame>
            <frame
                key={"BottomBlackScreen"}
                BorderSizePixel={0}
                BackgroundColor3={BG_1}
                Position={bottonBlackScreenPosition}
                AnchorPoint={new Vector2(0.5, 0)}
                Size={new UDim2(5, 0, 5, 0)}
            ></frame>
            <frame
                key={"RoundEndBlackScreen"}
                BorderSizePixel={0}
                BackgroundColor3={BG_1}
                Position={new UDim2(0.5, 0, 0.5, 0)}
                BackgroundTransparency={roundEndScreenTransparency}
                AnchorPoint={new Vector2(0.5, 0.5)}
                Size={new UDim2(5, 0, 5, 0)}
            ></frame>
            <textlabel
                key={"Round"}
                BackgroundTransparency={1}
                BorderSizePixel={0}
                Position={quqRoundPosition}
                AnchorPoint={new Vector2(0.5, 1)}
                Size={new UDim2(0, 500, 0, 100)}
                Text={"Round"}
                TextColor3={FG_1}
                TextSize={50}
                Font={FONT_1}
                TextXAlignment={"Center"}
            />
            <textlabel
                key={"Start"}
                BackgroundTransparency={1}
                BorderSizePixel={0}
                Position={quqStartPosition}
                AnchorPoint={new Vector2(0.5, 0)}
                Size={new UDim2(0, 500, 0, 100)}
                Text={"Start"}
                TextColor3={FG_1}
                TextSize={50}
                Font={FONT_1}
                TextXAlignment={"Center"}
            />
            <textlabel
                key={"LeText"}
                BackgroundTransparency={1}
                BorderSizePixel={0}
                Position={new UDim2(0.5, 0, 0.3, -30)}
                AnchorPoint={new Vector2(0.5, 0.5)}
                Size={new UDim2(0, 200, 0, 50)}
                Text={
                    roundSystem?.intermissionEnd !== undefined
                        ? "Intermission"
                        : roundSystem?.roundEnd !== undefined
                          ? "Round"
                          : ""
                }
                TextColor3={FG_1}
                TextSize={20}
                ZIndex={-10}
                Font={FONT_1}
                TextXAlignment={"Center"}
                TextStrokeColor3={BG_1}
                TextStrokeTransparency={0}
            />
            <textlabel
                key={"SecondsLeft"}
                BackgroundTransparency={1}
                BorderSizePixel={0}
                Position={new UDim2(0.5, 0, 0.3, 0)}
                AnchorPoint={new Vector2(0.5, 0.5)}
                Size={new UDim2(0, 200, 0, 50)}
                Text={secondsLeft.map((v) => (v > 0 ? totalSecondsToMinutesSecondDisplay(v) : ""))}
                TextColor3={FG_1}
                TextSize={20}
                ZIndex={-10}
                Font={FONT_1}
                TextXAlignment={"Center"}
                TextStrokeColor3={BG_1}
                TextStrokeTransparency={0}
            />
        </>
    );
}
