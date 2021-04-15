import React, { useState } from "react";
import { Button, useToast } from "@chakra-ui/react"
import useCoveyAppState from "../hooks/useCoveyAppState";

export default function TAControls(): JSX.Element {
    const [isHelpingStudent, setIsHelpingStudent] = useState<boolean>(false);
    const toast = useToast();
    const { currentTownID, apiClient, isTA } = useCoveyAppState();

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
    if(isTA) {
        return (
            <Button style={{position: 'absolute', marginTop: '16px', marginLeft: '70%'}} colorScheme="blue" onClick={helpNextStudent}>Help Student</Button>
        );
    } 
    return (<></>);
}