import React, { useState } from 'react';
import { Button, Snackbar, SnackbarOrigin, Alert } from '@mui/material';

export interface State extends SnackbarOrigin {
  open: boolean;
}

interface AdoptReplyProps {
  replyId: number; // 댓글 id
  check: boolean; // 채택 여부
  checkId: number | null // 채택한 댓글 id
  userId: number; // user.id
  writerUserId: number; // 댓글 작성자 user.id
  onReplyAdopt: (replyId: number) => void;
}

const AdoptReply = ({ userId, writerUserId, onReplyAdopt, check, checkId, replyId }: AdoptReplyProps) => {
  const [state, setState] = useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'right',
  });

  const { vertical, horizontal, open } = state;

  const [message, setMessage] = useState<string>("");
  
  const handleCheckReply = () => {
    onReplyAdopt(replyId);
    setMessage(check ? "댓글 채택이 취소되었습니다." : "댓글이 채택되었습니다.");
    setState({ open: true, vertical: 'top', horizontal: 'right'});  
  };
  
  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <>
      { userId === writerUserId ? 
        null : check ? replyId === checkId ? 
        <Button onClick={handleCheckReply}>채택취소</Button> : null 
          : <Button onClick={handleCheckReply}>채택하기</Button>
      }
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={2000}
        open={open}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          {message}
        </Alert>
      </Snackbar>
    </>
  )
};

export default AdoptReply;