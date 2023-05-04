import React, { useEffect, useState } from "react";
import {
  Alert,
  Container,
  TextField,
  Button,
  Grid,
  FormControl,
  SelectChangeEvent,
  Select,
  Snackbar,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import Point from "../layout/Point";
import Skill from "../layout/Skill";
import EditorToolbar from "../layout/EditorToolbar";
import People from "../layout/People";
import { ConditionRequired, ConditionOptional } from "../layout/Condition";
import { checkLogin } from "../checkLogin";
import { useNavigate } from "react-router";
import "../style/Board.css";
import { getCurrentUserInfo } from "../getCurrentUserInfo";
import { BoardType } from "../model/board";
import Loading from "../layout/Loading";

/*
 * 기본 게시글 작성 UI폼
 */
const PostForm = () => {
  const [boardType, setBoardType] = React.useState("free");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [point, setPoint] = useState<number>(0);
  const [skill, setSkill] = useState<string>("");
  const [required, setRequired] = useState<string>("");
  const [optional, setOptional] = useState<string>("");
  const [party, setParty] = useState<number>(0);
  const [gathered, setGathered] = useState<number>(0);
  const [hasUserPoint, setHasUserPoint] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const nav = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    checkLogin().then((res) => {
      if (!res) {
        nav("/"); // 비로그인인 경우, 메인 페이지로 이동
      }
    });
  }, []);

  useEffect(() => {
    getCurrentUserInfo()
      .then(userInfo => setHasUserPoint(userInfo.point))
      .catch(err => console.log(err));
  }, [])


  //내용, 포인트 , 언어 컴포넌트로부터 데이터 받아오기
  const getContent = (value: string) => {
    setContent(value);
  };

  const getPoint = (point: number): void => {
    setPoint(point * 10);
  };

  const getSkill = (value: string) => {
    setSkill(value);
    console.log(value);
  };

  const getRequired = (value: string) => {
    setRequired(value);
  };

  const getOptional = (value: string) => {
    setOptional(value);
  };

  const getParty = (value: number) => {
    setParty(value);
  };

  const getGathered = (value: number) => {
    setGathered(value);
  };

  const boardHandler = (event: SelectChangeEvent<unknown>) => {
    setBoardType(event.target.value as string);
  };

  const fileList: File[] = [];

  const onSaveFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;
    const fileArray = Array.prototype.slice.call(files);

    fileArray.forEach((file) => {
      fileList.push(file);
    });
  };

  const submitHandler = async (event:React.MouseEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const request_data = {
      title: title,
      content: content,
    };

    const request_qna = {
      title: title,
      content: content,
      point: point,
      language: skill,
    };

    const request_recruit = {
      title,
      content,
      required,
      optional,
      party,
      gathered
    }

    const qna_formData = new FormData();

    fileList.forEach((file) => {
      qna_formData.append("multipartFiles", file);
    });

    qna_formData.append("stringQna", JSON.stringify(request_qna));

    if (boardType === BoardType.free) {
      // 자유 게시판인 경우
      axios({
        method: "post",
        url: `/api/${boardType}`,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(request_data),
      })
        .then((res) => {
          if (res.status === 200) {
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                게시되었습니다.
              </Alert>
            </Snackbar>
            window.location.href = `/${boardType}`;
          } // 응답(401, 403 등) 핸들링 ...
        })
        .catch((err) => console.log(err));
    } else if (boardType === BoardType.question) {
      // Q&A 게시판인 경우
      if (hasUserPoint >= point) {
        if (fileList.length > 0) {
          axios({
            method: "post",
            url: "/api/qna",
            headers: { "Content-Type": "multipart/form-data" },
            data: JSON.stringify(qna_formData),
          })
            .then((res) => {
              if (res.status === 200) {
                <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                  <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    게시되었습니다.
                  </Alert>
                </Snackbar>
                window.location.href = `/${boardType}`;
              } // 응답(401, 403 등) 핸들링 ...
            })
            .catch((err) => {
              if (err.response.status === 401) {
                console.log("로그인 x");
              } else if (err.response.status === 403) {
                console.log("권한 x");
              }
            });
        } else {
          axios({
            method: "post",
            url: "/api/qna/no-file",
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(request_qna),
          })
            .then((res) => {
              if (res.status === 200) {
                // 성공 시 작업
                window.location.href = `/${boardType}`;
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
      } else {
        alert("보유하신 포인트가 제시한 포인트보다 적습니다.");
        window.location.reload();
      }
    } else if (boardType === BoardType.recruit) {
      // 구인 게시판인 경우
      axios({
        method: "post",
        url: `/api/${boardType}`,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(request_recruit),
      })
        .then((res) => {
          if (res.status === 200) {
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                게시되었습니다.
              </Alert>
            </Snackbar>
            window.location.href = `/${boardType}`;
          } // 응답(401, 403 등) 핸들링 ...
        })
        .catch((err) => console.log(err));
    }
    setOpen(true);
    return (
      <>
        {isLoading && <Loading delayTime={1500} />}
      </>
    );
  };

  const SelectSkill =
    boardType === BoardType.question ? <Skill getSkill={getSkill} /> : null;

  const SelectPoint =
    boardType === BoardType.question ? <Point getPoint={getPoint} /> : null;

  const DesignateConditionRequired =
    boardType === BoardType.recruit ? (
      <ConditionRequired getRequired={getRequired} />
    ) : null;
  const DesignateConditionOptional =
    boardType === BoardType.recruit ? (
      <ConditionOptional getOptional={getOptional} />
    ) : null;
  const DesignatePeople = boardType === BoardType.recruit ? <People getParty={getParty} getGathered={getGathered} /> : null;

  return (
    <>
      <Container>
        <Grid container direction="column" spacing={2}>
          <>
            <Grid item>
              <FormControl style={{ minWidth: "120px" }}>
                <Select value={boardType} onChange={boardHandler} size="small">
                  <MenuItem value={BoardType.free} defaultChecked>
                    자유게시판
                  </MenuItem>
                  <MenuItem value={BoardType.question}>Q&A게시판</MenuItem>
                  <MenuItem value={BoardType.recruit}>구인게시판</MenuItem>
                  <MenuItem value={BoardType.notice}>공지사항</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {SelectSkill}
            <Grid item>
              <TextField
                className="board title"
                id="board_title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxRows={1}
                placeholder={"제목"}
                fullWidth
              ></TextField>
            </Grid>
            <Grid item>
              <div className="postQuill">
                <EditorToolbar onAddQuill={getContent} />
              </div>
              {/* value: {content} */}
              <div>
                <input type="file" multiple onChange={onSaveFiles} />
              </div>
            </Grid>

            {SelectPoint}

            {DesignateConditionRequired}
            {DesignateConditionOptional}
            {DesignatePeople}

            <Grid item>
              <Button
                className="board button"
                variant="outlined"
                disableElevation
                onClick={submitHandler}
              >
                게시
              </Button>
            </Grid>
          </>
        </Grid>
      </Container>
    </>
  );
};

export default PostForm;
