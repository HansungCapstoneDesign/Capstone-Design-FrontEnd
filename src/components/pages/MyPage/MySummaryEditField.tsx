import { useState } from "react"
import { Grid, TextField, Button } from "@mui/material";

interface EditMySummaryProps {
    summaryId: number;
    content: string;
    editSummary: (summaryId:number, content:string) => void;
}

const MySummaryEditField = (props : EditMySummaryProps) => {
    const [content, setContent] = useState<string>(props.content);
    const summaryId = props.summaryId;

    const handleEditSummary = () => {
        props.editSummary(summaryId, content);
        setContent("");
    }

    return (
        <>
        <Grid container direction="row" spacing={2} sx={{alignItems:"center", justifyContent:"space-between", display:"flex"}}>
        <Grid item xs={10} md={10}>
            <TextField 
                variant="standard" 
                className="summaryField"
                multiline
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
        </Grid>
        <Grid item xs={1} md={1}>
            <Button onClick={handleEditSummary}>수정</Button>
        </Grid>
        </Grid>
        </>
    )
}

export default MySummaryEditField;