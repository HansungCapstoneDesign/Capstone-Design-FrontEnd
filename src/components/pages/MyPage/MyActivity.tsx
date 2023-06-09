import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Stack, Box, Typography, Card, CardContent, CardActions, Button } from "@mui/material";
import { FindIcon } from "../../data/IconData";
import Shorten from "../../layout/Shorten";
import MySummary from "./MySummary"

interface MyDataProps {
    activityType : string;
}

// UserActivityItems 인터페이스
interface UserActivityItems {
    boardType: string;
    id: number;
    title: string;
    content: string;
    writer: string;
    createdDate: string;
    modifiedDate?: string;
    language?: string;
    bookmark: number;
    reply: number;
    point?: number;
}

const MyActivity = (props: MyDataProps) => {
    const [activity, setActivity] = useState<UserActivityItems[]>([]);
    const activityType = props.activityType;
    const navigate = useNavigate();

    useEffect (()=>{
        activityType === "summary" ? setActivity([]) :
        axios({
            method : "get",
            url : `/api/user/${activityType}/mypage`
        }).then((res)=>{
            if(res.status === 200)
                setActivity(res.data);
        }).catch((err)=>{
            console.log(err);
        })
    }, [activityType])
    
    const activityTitle = activityType === "summary" ? "공부기록" :
        activityType === "application" ? "신청 목록" :
        activityType === "bookmark" ? "북마크한 글" :
        activityType === "post" ? "작성한 게시글" : null;

    const goToDetails = (postId: number, boardType: string) => {
        navigate(`/${boardType}/${postId}`);
    }

    return (
        <>
        <Typography variant="h4" mt={"3rem"} ml={"1rem"} sx={{fontWeight: "600"}}>{activityTitle}</Typography>
            <Box sx={{display:"flex", flexWrap:"wrap", justifyContent: "space-between"}}>
                {activityType === "summary" ? <MySummary/> :
                activity.length === 0 ? 
                    <Typography variant="h2" textAlign="center" p={5} color="primary.dark" sx={{fontWeight:"400"}}>아직 {activityTitle}이 없습니다</Typography> : 
                    activity.map((value) => {
                        return (
                            <Card sx={{ width: "48%", mt:"1.5rem", borderRadius:"15px", p:"1rem"}}>
                            <CardContent>
                                <Typography variant="subtitle2" color="black" gutterBottom>{Shorten(value.title, 20)}</Typography>


                                <Stack direction={"row"} display={"flex"} justifyContent={"space-between"} alignItems={"center"} mt={"1rem"}>

                                    <Typography variant="subtitle2" color="secondary.dark"> {value.writer}</Typography>

                                    <Stack
                                        direction="row"
                                        spacing={"0.5rem"}
                                        display={"flex"}
                                        alignItems={"center"}
                                    >
                                        <Stack direction={"row"} spacing={"0.2rem"}>
                                        <FindIcon name="reply"/>
                                        <Typography variant="h5">{value.reply}</Typography>
                                        </Stack>
                                        <Stack direction={"row"} spacing={"0.2rem"}>
                                        <FindIcon name="bookmark"/>
                                        <Typography variant="h5">{value.bookmark}</Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>

                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={()=>goToDetails(value.id, value.boardType)}>자세히 보기</Button>
                            </CardActions>
                            </Card>
                        )
                    })
                }
            </Box>  
        </>
    )
}

export default MyActivity;