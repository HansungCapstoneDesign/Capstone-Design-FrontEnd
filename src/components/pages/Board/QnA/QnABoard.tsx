import React, { useEffect, useState, useLayoutEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Typography, Box, Link, Grid, Stack } from "@mui/material";
import Time from "../../../layout/Time";
import { skillData } from "../../../data/SkillData";
import { WritingButton } from "../../../layout/CRUDButtonStuff";
import { PaginationControl } from "react-bootstrap-pagination-control";
import "bootstrap/dist/css/bootstrap.min.css";
import { reply_bookmark_views } from "../../../layout/Board/reply_bookmark_views";
import { userInfo } from "../../../layout/postingDetail/userInfo";
import { BoardSkeleton, useSkeleton } from "../../../layout/Skeletons";
import SearchBoardField from "../../../layout/SearchBoardField";
import SortBoard from "../../../layout/SortBoard";
import Shorten from "../../../layout/Shorten";

export interface BoardItems {
  id: number;
  title: string;
  content: string;
  writer: string;
  createdDate: string;
  modifiedDate?: string;
  language?: string;
  bookmark: number;
  reply: number;
  point: number;
  views: number; //조회수
  profileImg: string | null; //사용자 이미지 img
  stuId: number; //사용자 아이디, 학번
  image: { imageUrl: string }[];
  introduce: string;
}

const QnABoard = () => {
  const [boardItems, setBoardItems] = useState<BoardItems[]>([]); // 인터페이스로 state 타입 지정
  const [total, setTotal] = useState<number>(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get('page');
  const [page, setPage] = useState<number>(currentPage ? parseInt(currentPage) : 1);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<string>("createdAt,desc");

 const getBoardItems = (sort: string, search?: string) => {
    const curPage = page - 1;
    const params = { size: 5, sort: sort };
    let url = `/api/questions/list?page=${curPage}`;

    if(search !== undefined) {
      url += `&search=${search}`;
    }
    
    setSearchParams({page: page.toString()})
    axios({
      method: "get",
      url: url,
      params: params
    })
    .then((res) => {
      if (res.status === 200) {
        setBoardItems(res.data.data);
        setTotal(res.data.count);
      }
    })
    .catch((err) => {
      if (err.response.status === 401) {
        console.log("로그인 x");
      } else if (err.response.status === 403) {
        console.log("권한 x");
      }
    });
  }

  useEffect(() => {
    getBoardItems(sort, search);
  }, [page, search, sort]);

  const arrangeBoard = (changeSort:string, changeSearch?: string | undefined) => {
    setSearch(changeSearch);
    setSort(changeSort);
    getBoardItems(sort, search);
  };

  const loadingStatus: boolean = useSkeleton(800, boardItems);

  const displayPosting = boardItems.map((element, idx) => {
    return (
      <>
        <PreviewPosting {...element} key={idx} />
      </>
    );
  });

  return (
    <>
      {loadingStatus ? (
        <Stack direction={"column"} spacing={"2.5rem"} sx={{ padding: "2.25rem 10rem 4.5rem" }}>
          <Stack direction={"row"} display={"flex"} justifyContent={"space-between"} alignItems={"center"} mb={"1rem"} pl={3}>
          <Typography variant="h2" className="boardTitle" onClick={() => {arrangeBoard("createdAt,desc", undefined)}}>Q&A게시판</Typography>
          <SortBoard sort={sort} setSort={setSort} arrange={(sort) => arrangeBoard(sort, search)}/>
          </Stack>
          {boardItems.length === 0 && search !== undefined? 
            <Stack p={"0rem 2rem 0rem"}>
              <Typography variant="h3" sx={{ color: "secondary.dark", fontWeight: 600 }}>일치하는 검색결과가 없습니다.</Typography>
            </Stack> : displayPosting
          }
          <Box display={"flex"} justifyContent={"flex-end"}>
          <SearchBoardField search={search} setSearch={setSearch} arrange={(search) => arrangeBoard(sort, search)}/>
          </Box>
          <PaginationControl
            page={page}
            between={1}
            total={total}
            limit={5}
            changePage={(page: React.SetStateAction<number>) => setPage(page)}
            ellipsis={1}
          />
        </Stack>)
        : (
          <BoardSkeleton />
        )}
      <WritingButton />
    </>
  );

}

const PreviewPosting: React.FunctionComponent<BoardItems> = (props: BoardItems) => {
  const navigate = useNavigate();

  const goToPost = (postId: number) => {
    navigate(`/questions/${postId}`);
  };

  const SkillIcon = props.language
    ? skillData.map((data) => {
      if (props.language === data.name) {
        return <img src={data.logo} width="25" height="25" />;
      }
    })
    : null;

  const preRegex = /<pre[^>]*>(.*?)<\/pre>/gs;
  const imgRegex = /<img\b[^>]*>/gs;
  const noPreTag = props.content.replace(preRegex, "");
  const deleteTag = noPreTag.replace(imgRegex, "");

  return (
    <Grid container direction="column" item xs={12} sx={{
      bgcolor: "background.paper",
      borderRadius: "40px",
      boxShadow: 3,
      margin: "2.25rem 0",
      padding: "2rem 2.5rem 2rem",
      justifyContent: "space-between",
      height: "15rem",
      "&:hover": {
        boxShadow: 5,
        pointer: "cursor"
      }
    }} onClick={() => goToPost(props.id)}>
    {props.image.length === 0 ? (
      <Grid item container direction={"column"} sx={{p:"0.5rem"}} spacing={"1rem"}>
        <Grid item display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="h3">{props.title}</Typography>
        <Stack direction="row" spacing={"1rem"}>
          <Time date={props.createdDate} variant="h5" />
          {SkillIcon}
        </Stack>
        </Grid>
        <Grid item className="boardContent">
          <div dangerouslySetInnerHTML={{ __html: Shorten(deleteTag, 200)}}/>
        </Grid>
        <Grid item>
          <Stack direction={"row"} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            {userInfo(props.writer, props.stuId, props.profileImg, props.introduce)}
            {reply_bookmark_views(props)}
          </Stack>
        </Grid>
      </Grid>
    ) : (
    <Grid item container spacing={4} > 
      <Grid item xs={4} md={4} sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box position="relative" width="22rem" height="11rem">
          <span style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, 
            backgroundSize: 'cover', backgroundImage: `url(${props.image[0].imageUrl})` }} />
        </Box>
      </Grid>
      <Grid item container direction="column" p={"0.5rem"} xs={8} md={8} spacing={"1.2rem"}>
        <Grid item display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
            <Typography variant="h3">{props.title}</Typography>
          <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
            <Time date={props.createdDate} variant="h5" />
            {SkillIcon}
          </Stack>
        </Grid>
        <Grid item sx={{width: "100%"}} className="boardContent">
          <div dangerouslySetInnerHTML={{ __html: Shorten(deleteTag, 200) }}/>
        </Grid>
        <Grid item>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            {userInfo(props.writer, props.stuId, props.profileImg, props.introduce)}
            {reply_bookmark_views(props)}
          </Box>
        </Grid>
      </Grid>

        </Grid>
      )}
    </Grid>
  );
}

export default QnABoard;