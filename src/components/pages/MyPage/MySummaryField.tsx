import { SyntheticEvent, useState } from "react"
import { Grid, TextField, IconButton, Autocomplete, Box } from "@mui/material";
import AddIcon from '@mui/icons-material/AddOutlined';
import { skillData, skillItems } from "../../data/SkillData";

interface MySummary {
    onAddSummary: (content:string, skill?: string) => void;
}

const MySummaryField = ({onAddSummary} : MySummary) => {
    const [content, setContent] = useState<string>("");
    const [summarySkill, setSummarySkill] = useState<skillItems | null>(null);
    const [error, setError] = useState<boolean>(false);

    const handleSummary = () => (
        content.trim() === '' ? 
        setError(true) : 
        (setError(false), onAddSummary(content, summarySkill?.name ?? ""), setContent(""), setSummarySkill(null))
    );

    const handleSummarySkill = (event: SyntheticEvent<Element, Event>, value: skillItems | null) => {
        if (value) {
            setSummarySkill(value);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setError(false);
        setContent(e.target.value)
    }

    return (
        <>
        <Grid container item spacing={2} direction="row" sx={{ p:"0 1rem 1.5rem", mt:"0.3rem", display:"flex", justifyContent:"space-between"}} >
            <Grid item xs={3} md={3}>
                <Autocomplete
                 options={skillData}
                 getOptionLabel={(option) => option.name}
                 renderOption={(props, option) => (
                   <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>               
                    <img src={option.logo} width={20} height={20} />
                    {option.name}
                   </Box>
                 )}
                 renderInput={(params) => (
                   <TextField
                     {...params}
                     inputProps={{
                       ...params.inputProps,
                     }}
                   />
                 )}
                 value={summarySkill}
                 onChange={handleSummarySkill}
               />
            </Grid>
            <Grid item xs={8} md={8}>
                <TextField 
                    className="summaryField"
                    placeholder="오늘의 공부기록을 남겨주세요!"
                    multiline
                    value={content}
                    onChange={handleChange}
                    error={error}
                    helperText={error ? "공부기록을 입력해주세요" : ""}
                />
            </Grid>
            <Grid item xs={1} md={1}>
                <IconButton className="summaryButton" onClick={handleSummary}><AddIcon/></IconButton>
            </Grid>

        </Grid>
        </>
    )
}

export default MySummaryField;