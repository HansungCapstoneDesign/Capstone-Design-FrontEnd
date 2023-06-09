import { useState, useEffect } from "react";
import { Stack, TextField, IconButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

interface SearchProps {
    search : string | undefined
    setSearch : (search:string) => void; 
    arrange : (search:string) => void; 
}

const SearchBoardField = ({setSearch, search} : SearchProps) => {

    const [searchInput, setSearchInput] = useState<string>("");

    useEffect(() => {
        setSearchInput(search || ""); 
    }, [search, setSearch]);

    const handleBoardSearch = () => {
        if (searchInput.trim() !== "") {
            setSearch(searchInput);
        }
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && searchInput.trim() !== "") {
            setSearch(searchInput);
        }
    };

    return (
        <>
        <Stack direction="row" spacing={"0.5rem"} alignItems="center"
            sx={{border: "0.5px solid gray", borderRadius:"20px", width:"18rem"}} p={"0.3rem 1rem 0.3rem"}>
            <TextField
                placeholder="검색어를 입력해주세요"
                variant="standard"
                InputProps={{ disableUnderline: true}}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <IconButton onClick={handleBoardSearch}>
            <SearchIcon/>
            </IconButton>
        </Stack>
        </>
    )
}

export default SearchBoardField;
