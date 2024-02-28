import axios from "axios";
import { API_SERVER_HOST } from "./todoApi";
import jwtAxios from "../util/jwtUtil";
import { LoginFail, LoginParam, Member, MemberModify } from "types";
import { FieldValues } from "react-hook-form";

const host = `${API_SERVER_HOST}/api/member`;


export const loginPost = async (loginParam: FieldValues) => {
  const header = { headers: { "Content-Type": "x-www-form-urlencoded" } };

  const form = new FormData();
  form.append("username", loginParam.email);
  form.append("password", loginParam.pw);

  const res = await axios.post<Member | LoginFail>(`${host}/login`, form, header);

  return res.data;
};

export const modifyMember = async (member: MemberModify) => {
  const res = await jwtAxios.put(`${host}/modify`, member);
  return res.data;
};

export const joinMember = async (member: MemberModify) => {
  const res = await axios.post(`${host}/join`, member);
  return res.data;
};
