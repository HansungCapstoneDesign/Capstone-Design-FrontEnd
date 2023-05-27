//게시물 (글)
import { BoardType } from "./board";
import { User } from "./user";
import { Reply } from "./reply";

export interface Posting {
  type: BoardType;
  id: number;
  title: string;
  content: string;
  profileImg: string | null;
  writer: string; //게시글 작성자 닉네임
  stuId: number
  createdDate: string;
  modifiedDate?: string;
  bookmark: number;
  views: number; //조회수
  replies: Array<Reply>; 
	reply: number;
  report: number;
  condition?: String; //구인게시판 조건
  language?: string;
  //todo(은서): 게시판 성격따라서 다른 옵션 추가되어 질 수 있음
}