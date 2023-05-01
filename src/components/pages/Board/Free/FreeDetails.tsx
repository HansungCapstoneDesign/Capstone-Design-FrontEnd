import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Time from "../../../layout/Time";
import {
  Box,
  Grid,
  Typography,
  Skeleton,
  Zoom
} from "@mui/material";
import axios from "axios";
import Reply from "../../../layout/Reply/Reply";
import { PostingCrumbs } from "../../../layout/postingDetail/postingCrumbs";
import { replyCount } from "../../../layout/postingDetail/replyCount";
import { bookmarkNviews } from "../../../layout/postingDetail/bookmarkNviews";
import { userInfo } from "../../../layout/postingDetail/userInfo";
import { PageName } from "../../../layout/postingDetail/postingCrumbs";
import { PostingSkeleton } from "../../../layout/Skeletons";
import { UpdateSpeedDial } from "../../../layout/CRUDButtonStuff";
import { BoardType } from "../../../model/board";

//자유 상세보기 인터페이스
interface FreeDetailItems {
  id: number;
  title: string;
  content: string;
  //imgUrl?: Array<string>;
  writer: string;
  profileImg: string;
  stuId: number;
  createdDate: string;
  modifiedDate?: string;
  bookmark: number;
  reply: number;
  views: number; //조회수
}

const FreeDetails = () => {
  const [postItem, setPostItem] = useState<FreeDetailItems | undefined>();
  const { id } = useParams() as { id: string };
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [bookmarkCheck, setBookmarkCheck] = useState(false);
  const [loading, setLoading] = useState(false); //loading이 false면 skeleton, true면 게시물 목록 
  const [accessUserId, setAccessUserId] = useState<number>(0); //접속한 유저의 id

  const postingId = Number(id);

  useEffect(() => {
    axios({
      method: "get",
      url: "/api/free/detail/" + id,
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
    //해당 게시글의 북마크 수
    axios({
      method: "get",
      url: "/api/free/" + id + "/bookmark-count",
    })
      .then((res) => {
        setBookmarkCount(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    //접속 유저가 해당 게시글의 북마크를 설정하였는지 아닌지 체크
    axios({
      method: "get",
      url: "/api/free/" + id + "/bookmark-check",
    })
      .then((res) => {
        setBookmarkCheck(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    //접속 유저가 해당 게시글의 작성자인지 체크 => 접속한 유저정보 
    axios({
      method: "get",
      url: "/api/user-info"
    })
      .then((res) => {
        if (res.status === 200) {
          setAccessUserId(res.data.studentId);
        }
      })
      .catch((err) => {

        console.log(err);
      });
  }, []);

  //북마크 등록
  const onClickBookmark = () => {
    if (bookmarkCheck === false) {
      axios({
        method: "post",
        url: "/api/free/" + id + "/bookmark",
      })
        .then((res) => {
          if (res.status === 200) {
            alert("해당 게시글을 북마크로 등록하였습니다.");
            window.location.reload();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios({
        method: "delete",
        url: "/api/free/" + id + "/bookmark",
      })
        .then((res) => {
          alert("북마크를 취소하였습니다.");
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  /**
   * 글 작성자에게 게시글 수정, 삭제 버튼을 보여줌.
   * @param studentId 
   * @param title 
   * @param content 
   * @returns 게시글 정보를 포함하고있는 speedDial
   */
  const displayUpdateSpeedDial = (studentId: number, title: string, content: string) => {
    if (typeof postItem !== undefined) {
      if (Number(studentId) === Number(accessUserId)) {
        return (<UpdateSpeedDial boardType={BoardType.free} postingId={postingId} postingTitle={title} postingContent={content} />);
      }
      else
        return null;
    }

  }

  const detailPosting = postItem ? (
    <>
      <Grid container direction="column" rowSpacing={"3rem"}>
        {/*게시판 이름, BreadCrumbs */}
        <Grid item xs={12}>
          <PostingCrumbs title={postItem.title} board="free" />
        </Grid>
        {/*게시글 제목 */}
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            {postItem.title}
          </Typography>
        </Grid>
        {/*작성자 정보 , 작성 시각 */}
        <Grid item container xs={12} justifyContent={"space-between"}>
          <Grid item xs={4}>
            {userInfo(postItem.writer, postItem.profileImg, postItem.stuId)}
          </Grid>

          <Grid item justifyContent={"flex-end"}>
            <Time date={postItem.createdDate} />
          </Grid>
        </Grid>

        {/*게시글 내용 */}
        <Grid item xs={12} sx={{ padding: "0 2.5rem" }}>
          <Typography variant="h5">
            <div dangerouslySetInnerHTML={{ __html: postItem.content }} />
            {/* 이미지에 대해서는 추후 논의 후 추가)*/}
          </Typography>
        </Grid>

        {/*북마크, 조회수 이 컴포넌트 따로 빼둘것  */}
        <Grid item xs={12} sm={6}>
          {bookmarkNviews(postItem.bookmark, onClickBookmark, bookmarkCount)}
        </Grid>

        {/*댓글 */}
        {replyCount(postItem.reply)}
      </Grid>
      <Reply board={"free"} postingId={id} />
      <Zoom in={true}>
        <Box>{displayUpdateSpeedDial(postItem.stuId, postItem.title, postItem.content)}</Box>
      </Zoom>
    </>
  ) : (
    <PostingSkeleton />
  );
  {
    /*은서: 상세보기에도 rightbar, leftbar 들어갈 경우, 좌우 15rem X */
  }
  return <Box sx={{ padding: "2.25rem 10rem 4.5rem" }}>{detailPosting}</Box>;
};

export default FreeDetails;
