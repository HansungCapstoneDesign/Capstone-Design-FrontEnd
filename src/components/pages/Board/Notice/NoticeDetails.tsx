import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Chip, Grid, Typography, Zoom, Stack } from "@mui/material";
import { FileItem } from "../Free/FreeDetails";
import Reply from "../../../layout/Reply/Reply";
import { PostingSkeleton, useSkeleton } from "../../../layout/Skeletons";
import { getCurrentUserInfo } from "../../../getCurrentUserInfo";
import { UpdateSpeedDial } from "../../../layout/CRUDButtonStuff";
import { BoardType } from "../../../model/board";
import { PostingCrumbs } from "../../../layout/postingDetail/postingCrumbs";
import TimeAndViews from "../../../layout/postingDetail/TimeAndViews";
import { userInfo } from "../../../layout/postingDetail/userInfo";
import File from "../../../layout/File";
import Bookmark from "../../../layout/Bookmark";
import { NoticeItems } from "./Notice";

const testData: NoticeItems = {
  id: 1,
  title: "title",
  content: "content",
  writer: "admin",
  createdDate: "now",
  bookmark: 2,
  reply: 0,
  views: 1,
  profileImg: null,
  stuId: 120,
  image: [],
};

const NoticeDetails = () => {
  const [postItem, setPostItem] = useState<NoticeItems | undefined>(testData);
  const { id } = useParams() as { id: string };
  const [accessUserId, setAccessUserId] = useState<number>(0); 
  const [isFile, setIsFile] = useState<boolean>(false);
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const postingId = Number(id);

  useEffect(() => {
    axios({
      method: "get",
      url: `/api/notice/detail/${id}`,
    })
      .then((res) => {
        setPostItem(res.data.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          console.log("로그인 x");
        } else if (err.response.status === 403) {
          console.log("권한 x");
        }
      });
    getCurrentUserInfo()
      .then(userInfo => setAccessUserId(userInfo.studentId))
      .catch(err => console.log(err));

    axios({
          method: "get",
          url: `/api/notice/${id}/file-list`
      })
      .then((res) => {
          setFileList(res.data);
      })
      .catch((err) => {
          console.log(err);
      });
  }, []);

  const loadingStatus: boolean = useSkeleton(800, postItem);

  const displayUpdateSpeedDial = (studentId: number, title: string, content: string) => {
    if (typeof postItem !== undefined) {
      if (Number(studentId) === Number(accessUserId)) {
        return (<UpdateSpeedDial boardType={BoardType.notice} postingId={postingId} postingTitle={title} postingContent={content} />);
      }
      else
        return null;
    }

  }

  const PostDetails = postItem ? (
    <>
      <Grid container direction="column" rowSpacing={"1.5rem"} mb={"1rem"}>
        <Grid item xs={12}>
          <PostingCrumbs title={postItem.title} board="notice" />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={1} sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
            <Typography variant="h1" sx={{fontWeight:"600"}}>{postItem.title}</Typography>
            {(typeof postItem.modifiedDate === 'object') ?
              null : <Chip label="수정됨" size="small" variant="outlined" color="error" />}
          </Stack>
        </Grid>
        <Grid item xs={12} sx={{display: "flex", justifyContent: "space-between"}}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ display: "flex", justifyContent: "start", alignItems:"center" }}
          >
            {userInfo(postItem.writer, postItem.stuId, postItem.profileImg)}
            {TimeAndViews (postItem.createdDate, postItem.views)}
          </Stack>
           <Bookmark boardType={"free"} id={id} />
        </Grid>
        {fileList.length > 0 && 
        <Grid item xs={12}>
          <File fileList={fileList}/>
        </Grid>
        }
        <Grid item xs={12} sx={{ m: "3rem 0rem 5rem" }}>
          <div className="ql-snow">
            <div className="ql-editor"
              dangerouslySetInnerHTML={{ __html: postItem.content }}/>
          </div>
        </Grid>
        <Grid item direction={"column"}>
          <Reply board={BoardType.free} postingId={id} />
        </Grid>
      </Grid>
      <Zoom in={true}>
        <Box>{displayUpdateSpeedDial(postItem.stuId, postItem.title, postItem.content)}</Box>
      </Zoom>
    </>
  ) : (
    <PostingSkeleton />
  );
  return <Box sx={{ p: "2rem 10rem 4rem" }}>{PostDetails}</Box>
};

export default NoticeDetails;
