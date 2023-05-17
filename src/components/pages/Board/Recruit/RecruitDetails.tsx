import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles"
import Time from "../../../layout/Time";
import { Box, Button, Chip, Divider, Grid, Stack, Typography, IconButton, Zoom, Tooltip } from "@mui/material";
import axios from "axios";
import Reply from "../../../layout/Reply/Reply";
import { PostingCrumbs } from "../../../layout/postingDetail/postingCrumbs";
import { replyCount } from "../../../layout/postingDetail/replyCount";
import { userInfo } from "../../../layout/postingDetail/userInfo";
import Loading from "../../../layout/Loading";
import { UpdateSpeedDial } from "../../../layout/CRUDButtonStuff";
import { BoardType } from "../../../model/board";
import { getCurrentUserInfo } from "../../../getCurrentUserInfo";
import Bookmark from "../../../layout/Bookmark";
import TimeAndViews from "../../../layout/postingDetail/TimeAndViews";
import { ApplicantList, DoubleCheckModal, } from "./ApplyAcceptStuff";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Application } from "./ApplyAcceptStuff";

//모집 상세보기 인터페이스
export interface RecruitDetailItems {
  id: number;
  title: string;
  content: string;
  writer: string;
  profileImg: string | null; //사용자 프로필 사진 img 링크. 현재는 <Avartar />의 기본 이미지가 들어감
  createdDate: string;
  modifiedDate?: string;
  bookmark: number;
  reply: number;
  views: number; //조회수
  stuId: number; //사용자 학번
  imgUrl?: Array<string>; //이미지
  require: string; //필수조건: 분반명 등
  optional?: string; //기타, 우대조건: 학점, 기술스택 등
  party: number; //모집할 인원수

  gathered: number; //모집된 인원 수
  isCompleted: boolean;
}

const RecruitDetails = () => {
  const { id } = useParams() as { id: string };
  const [postItem, setPostItem] = useState<RecruitDetailItems | undefined>();

  // const [isApplyBtnAvailable, setIsApplyBtnAvailale] = useState<boolean>(false); //신청하기 버튼 상태 관리
  const [modalOpen, setModalOpen] = useState<boolean>(false); //신청, 승인, 모집완료 모달 open 상태 
  const [accessUserId, setAccessUserId] = useState<number>(0); //접속한 유저의 id
  const [applicantStatus, setApplicantStatus] = useState<boolean | null>(null); //유저의 신청 및 승인 여부

  const [approvedApplicants, setApprovedApplicants] = useState<number>(0); //승인된 인원수
  const [applicants, setApplicants] = useState<number>(0); //신청인원수
  const [isComplete, setIsCompleted] = useState<boolean>(false); //모집완료가 되었나?

  const _theme = useTheme();
  const postingId = Number(id);

  const handleModalOpenChange = () => {
    setModalOpen(false);
  }

  const handleApplicantStatus = () => {
    //신청하는 경우
    if (approvedApplicants === null) setApplicantStatus(false);
    //false나 true면 (신청취소) null로
    else if (typeof approvedApplicants === 'boolean')
      setApplicantStatus(null);
  }

  const handleNewApplicant = () => { //신청하기로 인한 신청자 인원 증가
    setApplicants(prevState => prevState + 1);
    setApplicantStatus(false);
  }

  const handleApplicantOut = () => { //신청취소로 인한 신청자 인원 감소
    setApplicants(prevState => prevState - 1);
    setApplicantStatus(null);
  }

  const handleNewApprovedApplicants = () => { //승인하기로 인한 승인 인원 증가
    setApprovedApplicants(prevState => prevState + 1);
  }

  const handleApprovedApplicantsOut = () => { //승인취소로 인한 승인 인원 감소
    setApprovedApplicants(prevState => prevState - 1);
  }

  useEffect(() => {
    axios({
      method: "get",
      url: "/api/recruit/detail/" + id,
    })
      .then((res) => {
        if (res.status === 200) {
          setPostItem(res.data);
          setIsCompleted(res.data.isCompleted);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    getCurrentUserInfo()
      .then(userInfo => setAccessUserId(userInfo.studentId))
      .catch(err => console.log(err));

    axios({ //신청자 목록의 인원수
      method: "get",
      url: `/api/recruit/${postingId}/applicants-number`,
    }).then((res) => {
      if (res.status === 200) {
        setApplicants(applicants);
        console.log(`useEffect 시행 후의 신청인원수 ${applicants}`);
      }
    }).catch((err) => console.log(err));

  }, []);

  useEffect(() => {
    //승인된 인원수 + 기존에 작성자가 선택한 gathered = 모인인원.
    axios({
      method: "get",
      url: `/api/recruit/${postingId}/approvers-number`, //승인된 인원수 구해오는 api
    }).then((res) => {
      if (res.status === 200) {
        setApprovedApplicants((prevState) => res.data);
      }
    }).catch(err => console.log(`updateApproveapplicant: ${err}`));
  }, [approvedApplicants]);

  useEffect(() => {
    axios({ //신청자 목록의 인원수
      method: "get",
      url: `/api/recruit/${postingId}/applicants-number`,
    }).then((res) => {
      if (res.status === 200) {
        setApplicants(res.data);
        console.log(`useEffect 시행 후의 신청인원수 ${applicants}`);
      }
    }).catch((err) => console.log(err));
  }, [applicants]);

  //신청 및 승인 여부확인
  useEffect(() => {
    axios({
      method: "get",
      url: `/api/recruit/${postingId}/application-check`
    }).then((res) => {
      if (res.status === 200) {
        setApplicantStatus(res.data);
        console.log(`서버에서 받은 신청자 신청여부 ${res.data} ${JSON.stringify(res.data)}`);
        const status: string = (res.data).toString();
        switch (status) {
          case "":
            alert(`res.data: ${JSON.stringify(res.data)} ${JSON.stringify(applicantStatus)}신청하지 않은 사용자입니다. 나중에 지우기 어차ㅣ 글쓴이한테는 신청버튼 안뜰테니까`);
            // setApplicantStatus(null);
            break;
          case "true":
            alert(`res.data: ${JSON.stringify(res.data)} ${JSON.stringify(applicantStatus)} 신청서가 승인 되었습니다.`);
            // setApplicantStatus(true);
            break;
          case "false":
            alert(`res.data: ${JSON.stringify(res.data)} ${JSON.stringify(applicantStatus)}아직 신청 승인 대기 중입니다.`);
            // setApplicantStatus(false);
            break;
          default:
            alert(`res.data: ${JSON.stringify(res.data)} ${JSON.stringify(applicantStatus)} 무언가 오류...`);
            break;
        }
      }
    })
  }, []);

  /**
 * 글 작성자에게 게시글 수정, 삭제 버튼을 보여줌.
 * @param studentId 
 * @param title 
 * @param content 
 * @returns 게시글 정보를 포함하고있는 speedDial
 */
  const displayUpdateSpeedDial = (studentId: number, title: string, content: string) => {
    if (typeof postItem !== undefined) {
      if (Number(studentId) === Number(accessUserId)) { //accessUserId는 현재 접속한 유저의 학번, stuId
        return (<UpdateSpeedDial boardType={BoardType.recruit} postingId={postingId} postingTitle={title} postingContent={content} />);
      }
      else
        return null;
    }
  }

  const detailPosting = postItem ? (
    <>
      <Grid container direction="column" rowSpacing={"2rem"} mb={"0.5rem"}>
        {/*게시판 이름, BreadCrumbs */}
        <Grid item xs={12}>
          <PostingCrumbs title={postItem.title} board="recruit" />
        </Grid>
        {/*게시글 제목 */}
        <Grid item xs={12}>
          <Stack direction="row" spacing={1} sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
            <Typography variant="h1">{postItem.title}</Typography>
            {(typeof postItem.modifiedDate === 'object') ?
              null : <Chip label="modified" size="small" variant="outlined" color="error" />}
          </Stack>
        </Grid>
        {/*작성자 정보 , 작성 시각 */}
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}
          >
            {userInfo(postItem.writer, postItem.stuId, postItem.profileImg)}
            {TimeAndViews(postItem.createdDate, postItem.views)}
          </Stack>
          <Bookmark boardType={"recruit"} id={id} />
        </Grid>

        {/*게시글 내용 */}
        <Grid item xs={12} sx={{ m: "1rem 2.5rem" }}>
          <div dangerouslySetInnerHTML={{ __html: postItem.content }} />
          {/* 이미지에 대해서는 추후 논의 후 추가)*/}
        </Grid>

        <Grid item container xs={12} direction="row" spacing={"3rem"}>
          {postItem.optional ? <>
            <Grid item container xs={12}>
              <Grid item xs={6}>
                <Typography variant="h3" sx={{ mb: 1 }}>필수</Typography>
                <Typography variant="h4">
                  <div dangerouslySetInnerHTML={{ __html: postItem.require }} />
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h3" sx={{ mb: 1 }}>우대</Typography>
                <Typography variant="h4">
                  <div dangerouslySetInnerHTML={{ __html: postItem.optional }} />
                </Typography>
              </Grid>
            </Grid>
          </>
            : <Grid item xs={12}>
              <Typography variant="h3" sx={{ mb: 1 }}>필수</Typography>
              <Typography variant="h4">
                <div dangerouslySetInnerHTML={{ __html: postItem.require }} />
              </Typography>
            </Grid>}
        </Grid>

        <Grid item xs={12} sm={6}>
          <Grid item container xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h3">
              모인 사람 {postItem.gathered + approvedApplicants} / 최종 인원 {postItem.party}
            </Typography>
            {/* 게시글 작성자: 모집완료 버튼과 신청자 목록, 일반 사용자: 신청하기 버튼 */}
            {/* 모집완료 버튼과 신청하기 버튼을 클릭하면, 더블체킹을하는 모달. */}
            {(Number(postItem.stuId) === Number(accessUserId)) //게시글 작성자의 학번 === 접속한유저의학번
              ? <>
                <Button variant="outlined" startIcon={<AssignmentTurnedInIcon />} size="small" onClick={() => setModalOpen(true)}>
                  모집완료
                </Button>
                <DoubleCheckModal open={modalOpen} who={true} callNode="completeBtn" id={accessUserId} postingId={postingId}
                  onModalOpenChange={handleModalOpenChange} />
                <ApplicantList postingId={postingId} onNewApprovedApplicants={handleNewApprovedApplicants} onApprovedApplicantsOut={handleApprovedApplicantsOut} />
              </>
              : <>
                <Tooltip title={((typeof applicantStatus !== 'boolean') ? "신청하기" : "신청취소")}>
                  <Button variant="outlined" startIcon={((typeof applicantStatus !== 'boolean') ? <HistoryEduOutlinedIcon /> : <CancelOutlinedIcon />)}
                    size="medium"
                    onClick={() => setModalOpen(true)}
                    color={((typeof applicantStatus !== 'boolean') ? "primary" : "secondary")}
                  >
                    {((typeof applicantStatus !== 'boolean') ? "신청하기" : "신청취소")}
                  </Button>
                </Tooltip>
                <DoubleCheckModal open={modalOpen} who={false} callNode={((typeof applicantStatus !== 'boolean') ? "applyBtn" : "applyCancelBtn")} id={accessUserId} postingId={postingId}
                  requireContext={postItem.require} optionalContext={postItem.optional}
                  onModalOpenChange={handleModalOpenChange} onApplicantOut={handleApplicantOut} onNewApplicant={handleNewApplicant} onApplicantStatus={handleApplicantStatus} />
              </>
            }
            <Typography variant="h4">지금까지 {applicants}명이 신청했어요!</Typography>
          </Grid>
        </Grid>
        {replyCount(postItem.reply)}
      </Grid>
      <Reply board={"recruit"} postingId={id} />
      <Zoom in={true}>
        <Box>{displayUpdateSpeedDial(postItem.stuId, postItem.title, postItem.content)}</Box>
      </Zoom>
    </>
  ) : (
    <Loading />
  );

  return (
    <Box sx={{ padding: "2.25rem 10rem 4.5rem" }}>{detailPosting}</Box>
  );
}

export default RecruitDetails;
