import React from "react";
import { Button, useToast } from "@chakra-ui/react"
import useCoveyAppState from "../hooks/useCoveyAppState";

export default function TAControls(): JSX.Element {
    const { currentTownID, apiClient, isTA } = useCoveyAppState();
    const toast = useToast();

    const helpNextStudent = async () => {
        // Help the next student
        try {
            await apiClient.helpNextStudent({ coveyTownID: currentTownID });
        } catch (e) {
            toast({
                title: 'No students to help',
                description: 'There are no students in the queue!',
                status: 'warning',
              });
        }
    }
    if(isTA) {
        return (
            <Button style={{position: 'absolute', marginTop: '94px', marginLeft: '16px'}} colorScheme="blue" onClick={helpNextStudent}>Help Student</Button>
        );
    } 
    return (<></>);
}