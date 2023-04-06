import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Box } from "@mui/material";
import ReplyField from "./ReplyField";
import NestedReplyField from "./NestedReplyField";
import Time from "../Time";
import Profile from "@mui/icons-material/AccountCircle";
import { urlToHttpOptions } from "url";

interface User {
  id : number;
  nickname : string;
}

interface ReplyItems{
  id: number;
  user: User;
  article: string;
  createdAt: string;
  modifiedDate?: string;
  parentId?: number;
  isChosen?: boolean;
  reports?: number;
}

interface ReplyProps {
  postingID?: string;
}
  
const FreeReply = ({postingID} : ReplyProps) => {

  const[replyData ,setReplyData] = useState<ReplyItems[]>([]);

  const url = `/api/freeBoards/${postingID}/replies`

  useEffect(()=>{
      axios({
          method : "get",
          url : url,
      }).then((res)=>{
          setReplyData(res.data);
      }).catch((err)=>{
          console.log(err);
      })
  },[])
  
const replyContainer = (replies: ReplyItems[], parentId?: number) => {
  const filteredReplies = parentId ? replies.filter((reply) => reply.parentId === parentId) : replies;

  return filteredReplies.length > 0 && (
    <Box sx={{ ml: 6 }}>
      {filteredReplies.map((reply) => (
        <div key={reply.id}>
          <Box sx={{ display: 'flex', mt: 5 }}>
            <Profile fontSize="large" />
            <Box sx={{ mt: 0.3 }}>
              <Typography variant="h6" sx={{ ml: 1 }}>{reply.user.nickname}</Typography>
              <Typography variant="subtitle2" sx={{ ml: 1 }}> 
                <Time date={reply.createdAt}/>
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography sx={{ ml: 5, mt: 1 }}>{reply.article}</Typography>
          </Box>
          <NestedReplyField parentID={reply.id} url={url}/>
          {replyContainer(replies, reply.id)}
        </div>
      ))}
    </Box>
  );
};

const reply = replyData.filter((reply) => !reply.parentId).length ?  (
  replyData.filter((reply) => !reply.parentId).map((value) => {
    return (
      <div key={value.id}>
        <Box sx={{
          display: 'flex', 
          mt:5 
        }}>
          <Profile fontSize="large"/>
          <Box sx={{mt:0.3}}>
            <Typography variant="h6" sx={{ml: 1}}>{value.user.nickname}</Typography>            
            <Typography variant="subtitle2" sx={{ml: 1}}>  
              <Time date={value.createdAt}/> 
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography sx={{ml: 5, mt: 1 }}>{value.article}</Typography>
        </Box>
        <NestedReplyField parentID={value.id} url={url}/>
        {replyContainer(replyData,value.id)}
      </div>
    )
  })
  
) : (<Typography variant="h6" sx={{color:"grey", m:2}}>아직 댓글이 없습니다.</Typography>)

  return (
    <>
      <ReplyField url={url}/>
      {reply}
    </>
  );
};

export default FreeReply;
