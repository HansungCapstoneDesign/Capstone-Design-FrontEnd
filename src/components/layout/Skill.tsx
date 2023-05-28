import React, {useEffect, useState} from 'react';
import { Grid, FormControl, Select, SelectChangeEvent, Avatar, MenuItem, Stack, InputLabel, Typography } from "@mui/material";
import { skillData } from "../data/SkillData";

interface SkillProps {
  getSkill: any;
  value?: string
}
  
const Skill: React.FC<SkillProps>= ({getSkill, value}) => {

  const [skill, setSkill] = useState<string>("");

  useEffect(() => {
      if (value) setSkill(value);
  }, [value])

  const onSelectSkill = (event: SelectChangeEvent) => {
    setSkill(event.target.value)
    getSkill(event.target.value)
  }

  return (
    <Grid item xs={12} md={3}>
      <FormControl fullWidth>
        <Select
          displayEmpty
          value={skill} 
          onChange={onSelectSkill}
          renderValue={(selected) => (
            selected !== '' ?
            <Stack alignItems={"center"} direction={"row"}>
              {selected}
            </Stack> : 
            <Typography variant="h5" color="primary.dark">질문할 기술을 선택해주세요</Typography>
          )}
          >
            {skillData.map((value) => (
            <MenuItem value={value.name}>
              <Avatar sx={{ width: 30, height: 30, ml:2, mr:3 }} src={value.logo}/> {value.name}
            </MenuItem>
          ))}
            
        </Select>
      </FormControl>
    </Grid>
  );
}

export default Skill;