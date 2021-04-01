import React, { useState } from "react";
import { Button, useToast } from "@chakra-ui/react"
import useCoveyAppState from "../hooks/useCoveyAppState";

export default function TAControls(): JSX.Element {
    const [isHelpingStudent, setIsHelpingStudent] = useState<boolean>(false);
    const toast = useToast();

    // const { emitMovement, players, myPlayerID, currentTownID, apiClient } = useCoveyAppState();
    const { currentTownID, apiClient } = useCoveyAppState();

    const helpNextStudent = async () => {
        if (isHelpingStudent) {
            toast({
                title: 'Already helping student!',
                description: 'Please finish helping the current student.',
                status: 'warning',
              });
              return;
        }

        // Help the next student
        await apiClient.helpNextStudent({ coveyTownID: currentTownID });
    }

    // const finishHelping = async () => {
    //     // Some stuff

    //     // Then
    //     setIsHelpingStudent(false);
    // }

    return (
        <Button style={{position: 'absolute', float: 'right', margin: '16px'}} colorScheme="blue" onClick={helpNextStudent}>Help Student</Button>
        );
}