import React, { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import UserProfile from "boring-avatars";
import { shortenContent } from "../pages/Board/QnA/QnABoard";
import axios from "axios";

interface PostRankingItem {
    board: string,
    title: string,
}

interface UserRakingItem {
    adoptSize: number,
    nickname: string
    studentId: string,
}

// 인기유저 테스트 데이터
const postRank: PostRankingItem[] = [
    {
        board: "free",
        title: "182어ㅏㄴ러;미ㅏ어리ㅏㅓㅁ아ㅣ러982"
    },
    {
        board: "free",
        title: "182어ㅏㄴ러;미ㅏ어리ㅏㅓㅁ아ㅣ러982"
    },
    {
        board: "qna",
        title: "가나다라마바사;미ㅏ어리ㅏㅓㅁ아ㅣ러982"
    },
    {
        board: "recruit",
        title: "질문 있어여!"
    },
    {
        board: "qna",
        title: "꺅꺅꺅꺅꺅꺅꺅꺅"
    }
]

// 인기게시글 테스트 데이터
const userRank: UserRakingItem[] = [
    {
        adoptSize: 1,
        nickname: "yoddddddung",
        studentId: "182982"
    },
    {
        adoptSize: 2,
        nickname: "dddd",
        studentId: "18222982"
    }
]

// 인기게시글 컴포넌트
export const PostRanking = () => {
    const [postRanking, setPostRanking] = useState<PostRankingItem[]>(postRank);

    useEffect(() => {
        axios({
            method: "get",
            // TODO: 인기 게시글 api 추가 필요
            //url: ``,
        })
        .then((res) => {
            if (res.status === 200) {
                setPostRanking(res.data);
            }
        })
        .catch((err) => {
            
        });
    }, []);

    return (
        <Box sx={{ p:2 }}>
        <Typography variant="h6" sx={{mt:20, ml:2, mb:2}}>Top Posting</Typography>
        <Divider sx={{ borderBottomWidth: 3, borderColor: 'primary.light' }} />
        <>
        {postRanking.map((value, index) => {
            const board = value.board
            const boardName: string = board === "free" ? "자유게시판"
            : board === "qna" ? "Q&A게시판"
            : board === "recruit" ? "구인게시판"
            : board === "notice" ? "공지사항" : "";
            return (
                <>
                <Box sx={{ display:"flex", mt:3.5 }}>
                <Typography variant="h6" sx={{mt:"1rem", ml:"1.5rem", mr: 5}}>{index+1}위</Typography>
                <Box>
                    <Typography variant="subtitle2" color="secondary.dark">{boardName}</Typography>
                    <Typography variant="subtitle1">{shortenContent(value.title, 15)}</Typography>
                </Box>
                </Box>
                </>
            )
        })}
        </>
        </Box>
    )
}

// 인기유저 컴포넌트
export const UserRanking = () => {
    const [userRanking, setUserRanking] = useState<UserRakingItem[]>(userRank);

    useEffect(() => {
        axios({
            method: "get",
            url: `/api/user-rank`,
        })
        .then((res) => {
            if (res.status === 200) {
                setUserRanking(res.data);
            }
        })
        .catch((err) => {
            
        });
    }, []);

    return (
        <Box sx={{ p:2 }}>
        <Typography variant="h6" sx={{mt:10, ml:2, mb:2}}>Top User</Typography>
        <Divider sx={{ borderBottomWidth: 3, borderColor: 'primary.light' }} />
        <>
        {userRanking.map((value, index) => {
            const studentId = value.studentId.slice(0,2);
            return (
                <>
                <Box sx={{ display:"flex", justifyContent: "space-evenly", mt:5 }}>
                <Typography variant="h6" sx={{ mr:"1rem"}}>{index+1}위</Typography>
                <UserProfile
                    name={value.nickname}
                    size={33}
                    variant="beam"
                    colors={["#58B76B", "#FFE045", "#B5CC6C", "#AED62E", "#87D241"]}
                />
                <Box sx={{ display:"flex", justifyContent: "flex-end", ml: "1rem", mr:"0.2rem"}}>
                    <Typography variant="subtitle1" sx={{ width:90 }}>{shortenContent(value.nickname, 8)}</Typography>
                    <Typography variant="subtitle2" color="secondary.dark" sx={{mt:0.3}}>{studentId}학번</Typography>
                </Box>
                </Box>
                </>
            )
        })}
        </>
        </Box>
    )
}

const Ranking = () => {
    return(
        <>
        <PostRanking/>
        <UserRanking/>
        </>
    )
}

export default Ranking;