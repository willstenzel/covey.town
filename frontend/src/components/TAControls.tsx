import React from "react";
import { Button } from "@chakra-ui/react"
import useCoveyAppState from "../hooks/useCoveyAppState";

export default function TAControls(): JSX.Element {
    const { currentTownID, apiClient, isTA } = useCoveyAppState();

    const helpNextStudent = async () => {
        // Help the next student
        await apiClient.helpNextStudent({ coveyTownID: currentTownID });
    }
    if(isTA) {
        return (
            <Button style={{position: 'absolute', marginTop: '16px', marginLeft: '70%'}} colorScheme="blue" onClick={helpNextStudent}>Help Student</Button>
        );
    } 
    return (<></>);
}