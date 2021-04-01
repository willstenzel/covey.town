import React from "react";
import { Button } from "@chakra-ui/react"
import useCoveyAppState from "../hooks/useCoveyAppState";



export default function TAControls(): JSX.Element {
    // const { emitMovement, players, myPlayerID, currentTownID, apiClient } = useCoveyAppState();
    // const { isTA, queue } = useCoveyAppState();
    const { isTA } = useCoveyAppState();

    const helpNextStudent = () => {
        // makes an api request to help a student
    }

    const finishHelping = () => {
        // makes an api request to finish helping a student
    }

    return (
        <Button style={{position: 'absolute', float: 'right', margin: '16px'}} colorScheme="blue">Help Student</Button>
        );
}